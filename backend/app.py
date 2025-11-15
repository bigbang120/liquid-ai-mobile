from flask import Flask, request, jsonify
import numpy as np
from utils import clean_input, is_event
from model_handler import load_model


app = Flask(__name__)

# Load trained model from model_handler
model = load_model()


@app.route("/")
def home():
    return jsonify({"message": "Liquid AI backend is running!"})


@app.route("/predict", methods=["POST"])
def predict():
    """
    Example usage:
    Send JSON like:
    {
        "heart_rate": 130,
        "spo2": 85,
        "temperature": 38.5
    }
    """
    data = clean_input(request.json)

    if model:
        # Extract features for model prediction
        features = np.array([[data["heart_rate"], data["spo2"], data["temperature"]]])
        prediction = model.predict(features)[0]
        # IsolationForest returns -1 for anomaly (event) and 1 for normal sample
        prediction = 1 if prediction == -1 else 0
    else:
        # Fallback to rule-based logic
        prediction = is_event(data["heart_rate"], data["spo2"], data["temperature"])

    return jsonify({
        "input": data,
        "event_prediction": int(prediction)
    })


if __name__ == "__main__":
    app.run(debug=True)