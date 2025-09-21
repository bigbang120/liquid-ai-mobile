from flask import Flask, request, jsonify
import pickle
import numpy as np

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
    data = request.json

    # Simple dummy features → just for demo
    features = np.array([
        data.get("heart_rate", 0),
        data.get("spo2", 0),
        data.get("temperature", 0)
    ]).reshape(1, -1)

    if model:
        prediction = model.predict(features)[0]
    else:
        # Fallback: simple rule-based "event" prediction
        if data.get("spo2", 100) < 90 or data.get("heart_rate", 0) > 120 or data.get("temperature", 0) > 38:
            prediction = 1
        else:
            prediction = 0

    return jsonify({
        "input": data,
        "event_prediction": int(prediction)
    })

if __name__ == "__main__":
    app.run(debug=True)
