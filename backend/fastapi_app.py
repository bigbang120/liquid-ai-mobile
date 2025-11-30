"""
FastAPI version of the Liquid AI backend with cat prediction and data ingestion support.

This module replaces the original Flask application with a FastAPI app that
serves the same endpoints for health checks and event prediction while adding
support for Firebase authentication.  The human model is loaded from
``model_handler.load_model`` and predictions use an IsolationForest model
trained to detect anomalies in heart rate, SpO₂, and temperature readings.  A
second model is available for cats and is loaded from ``liquid_ai_cat_model.pkl``.

The module also exposes an `/ingest` endpoint for normalising raw wearable
readings.  This endpoint accepts arbitrary vendor‑specific keys (e.g.,
``heartRate``, ``oxygenSaturation``, ``bodyTemperature``) and maps them to
canonical Liquid AI field names via ``data_ingestion.normalise_wearable_data``.  It
then runs the appropriate prediction model (human or cat) if sufficient
features are present.  If no model is available, it falls back to rule‑based
logic.

To enable Firebase authentication, set the environment variable
``FIREBASE_SERVICE_ACCOUNT_JSON`` to the path of your Firebase service
account JSON file.  If the environment variable is not set or the file
cannot be loaded, the app will skip authentication and allow unauthenticated
requests.
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
import os
import pickle
from typing import Dict, Optional, Any

from utils import clean_input, is_event
from model_handler import load_model
from data_ingestion import normalise_wearable_data

# Optional Firebase integration
try:
    import firebase_admin
    from firebase_admin import credentials, auth
except ImportError:
    firebase_admin = None  # Firebase is optional


def initialize_firebase() -> bool:
    """Initialize Firebase app if a service account file is provided.

    Returns True if Firebase was successfully initialized, else False.
    """
    # Only initialize once
    if firebase_admin is None:
        return False
    if firebase_admin._apps:
        return True
    sa_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if sa_path and os.path.exists(sa_path):
        cred = credentials.Certificate(sa_path)
        firebase_admin.initialize_app(cred)
        return True
    return False


# Initialize Firebase (if available and configured)
FIREBASE_ENABLED = initialize_firebase()

# Load the machine learning model for human prediction once at startup
model = load_model()

# Load the cat model once at startup
CAT_MODEL_PATH = os.path.join(os.path.dirname(__file__), "liquid_ai_cat_model.pkl")
cat_model: Optional[Any] = None
try:
    with open(CAT_MODEL_PATH, "rb") as f:
        cat_model = pickle.load(f)
except Exception:
    cat_model = None


# Define request schemas using Pydantic
class PredictionRequest(BaseModel):
    heart_rate: float
    spo2: float
    temperature: float


class CatPredictionRequest(BaseModel):
    heart_rate: float
    resp_rate: float
    temperature: float


class IngestRequest(BaseModel):
    """Request model for the /ingest endpoint.

    Accepts a free‑form dictionary of sensor readings keyed by vendor‑specific
    field names.  Values should be numeric where possible.  This schema is
    intentionally permissive to allow arbitrary key names.
    """

    data: Dict[str, float]


app = FastAPI(title="Liquid AI Backend",
              description="Predicts anomalous biomarker events and normalises raw sensor readings.")


@app.get("/")
def home() -> Dict[str, str]:
    """Health check endpoint.

    Returns a simple JSON indicating that the service is running.
    """
    return {"message": "Liquid AI backend is running!"}


def verify_firebase_token(authorization: Optional[str]) -> None:
    """Verify a Firebase ID token if Firebase authentication is enabled.

    Raises HTTPException if authentication fails.
    """
    if not FIREBASE_ENABLED:
        return  # Authentication is disabled; allow request
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    token = authorization.split(" ", 1)[1]
    try:
        auth.verify_id_token(token)  # type: ignore
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")


@app.post("/predict")
def predict(request: PredictionRequest, Authorization: Optional[str] = Header(None)) -> JSONResponse:
    """Predict whether an event has occurred based on biomarker readings for humans.

    This endpoint accepts heart rate, SpO₂ and temperature readings in the
    request body.  If a trained model is available, it uses the model to
    classify the sample.  Otherwise it falls back to rule‑based logic from
    ``utils.is_event``.

    If Firebase authentication is enabled, a valid bearer token must be
    provided in the Authorization header.
    """
    # Perform Firebase authentication if enabled
    verify_firebase_token(Authorization)

    # Clean and format the input
    data = clean_input(request.dict())
    prediction: int
    if model:
        features = np.array([[data["heart_rate"], data["spo2"], data["temperature"]]])
        raw_pred = model.predict(features)[0]
        # IsolationForest returns -1 for anomaly and 1 for normal
        prediction = 1 if raw_pred == -1 else 0
    else:
        prediction = is_event(data["heart_rate"], data["spo2"], data["temperature"])
    response = {"input": data, "event_prediction": int(prediction)}
    return JSONResponse(content=response)


@app.post("/predict-cat")
def predict_cat(request: CatPredictionRequest, Authorization: Optional[str] = Header(None)) -> JSONResponse:
    """Predict whether an event has occurred based on cat biomarker readings.

    Accepts heart rate (bpm), respiratory rate (breaths/min) and temperature (°C).
    If a trained cat model is available, it uses the model to classify the sample.
    Otherwise, it falls back to rule‑based logic: an event is flagged if the
    heart rate exceeds 160 bpm, the respiration rate exceeds 40 breaths/min or the
    temperature exceeds 40.5°C.
    """
    # Perform Firebase authentication if enabled
    verify_firebase_token(Authorization)

    data = request.dict()
    prediction: int
    if cat_model:
        features = np.array([[data["heart_rate"], data["resp_rate"], data["temperature"]]])
        prediction = int(cat_model.predict(features)[0])
    else:
        prediction = 1 if (
            data["heart_rate"] > 160
            or data["resp_rate"] > 40
            or data["temperature"] > 40.5
        ) else 0
    response = {"input": data, "event_prediction": prediction}
    return JSONResponse(content=response)


@app.post("/ingest")
def ingest(request: IngestRequest, Authorization: Optional[str] = Header(None)) -> JSONResponse:
    """Normalise raw wearable data and return an event prediction.

    This endpoint accepts a dictionary of vendor‑specific sensor readings in the
    ``data`` field.  Keys may include ``heartRate``, ``oxygenSaturation``,
    ``bodyTemperature``, ``respiratoryRate`` and so on.  The data is
    normalised into canonical field names using
    ``normalise_wearable_data``.  The appropriate model (human or cat) is then
    selected based on which features are present.  If no model is available,
    rule‑based logic is used.
    """
    # Perform Firebase authentication if enabled
    verify_firebase_token(Authorization)

    raw_data = request.data
    # Normalise vendor‑specific keys into canonical names
    normalized = normalise_wearable_data(raw_data)

    # Extract common features
    hr = normalized.get("heart_rate")
    spo2 = normalized.get("spo2")
    temp = normalized.get("temperature")
    resp = normalized.get("resp_rate")

    prediction: int
    # If respiratory rate is provided and a cat model is available, use cat model
    if resp is not None and cat_model:
        features = np.array([[hr, resp, temp]])
        prediction = int(cat_model.predict(features)[0])
    # Otherwise, if human model is available and core features present, use human model
    elif hr is not None and spo2 is not None and temp is not None and model:
        features = np.array([[hr, spo2, temp]])
        raw_pred = model.predict(features)[0]
        prediction = 1 if raw_pred == -1 else 0
    else:
        # Fallback to rule‑based logic: if respiratory rate is present, use cat rules;
        # otherwise use human rules.
        if resp is not None:
            prediction = 1 if (
                (hr is not None and hr > 160)
                or (resp > 40)
                or (temp is not None and temp > 40.5)
            ) else 0
        else:
            prediction = is_event(hr, spo2, temp)

    response = {
        "normalized_input": normalized,
        "event_prediction": int(prediction),
    }
    return JSONResponse(content=response)