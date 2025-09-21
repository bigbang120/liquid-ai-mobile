from flask import Flask, request, jsonify
import pickle
import numpy as np
from utils import clean_input, is_event

app = Flask(__name__)

# Load trained model (replace with your model path later)
# For now, it's just a placeholder — you can update with real .pkl
try:
    model = pickle.load(open("models/liquid_ai_rf.pkl", "rb"))
except:
    model = None

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
        features = np.array([[data["heart_rate"], data["spo2"], data["temperature"]]])
        prediction = model.predict(features)[0]
    else:
        prediction = is_event(data["heart_rate"], data["spo2"], data["temperature"])

    return jsonify({
        "input": data,
        "event_prediction": int(prediction)
    })

if __name__ == "__main__":
    app.run(debug=True)
