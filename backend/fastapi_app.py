"""
FastAPI version of the Liquid AI backend.

This module replaces the original Flask application with a FastAPI app that
serves the same endpoints for health checks and event prediction while adding
support for Firebase authentication.  The model is loaded from
``model_handler.load_model`` and predictions use an IsolationForest model
trained to detect anomalies in heart rate, SpO2, and temperature readings.

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

from utils import clean_input, is_event
from model_handler import load_model

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

# Load the machine learning model once at startup
model = load_model()

# Define request schema using Pydantic
class PredictionRequest(BaseModel):
    heart_rate: float
    spo2: float
    temperature: float


app = FastAPI(title="Liquid AI Backend", description="Predicts anomalous biomarker events.")


@app.get("/")
def home() -> dict:
    """Health check endpoint.

    Returns a simple JSON indicating that the service is running.
    """
    return {"message": "Liquid AI backend is running!"}


def verify_firebase_token(authorization: str | None) -> None:
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
        auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")


@app.post("/predict")
def predict(request: PredictionRequest, Authorization: str | None = Header(None)):
    """Predict whether an event has occurred based on biomarker readings.

    This endpoint accepts heart rate, SpO2 and temperature readings in the
    request body.  If a trained model is available, it uses the model to
    classify the sample.  Otherwise it falls back to rule-based logic from
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