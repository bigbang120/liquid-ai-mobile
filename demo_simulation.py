"""
demo_simulation.py
-------------------

This script provides a simple demonstration of the Liquid AI anomaly detection
capabilities for both human and feline vital signs.  It loads the trained
machine‑learning models from the repository (an IsolationForest model for
human events and a RandomForest classifier for cat events), generates a few
synthetic vital‑sign samples, and prints whether each sample is classified
as an event (1) or non‑event (0).

Usage:
    python demo_simulation.py

The script requires scikit‑learn to be installed and assumes the model
files `backend/liquid_ai_isolation_forest.pkl` and
`backend/liquid_ai_cat_model.pkl` are present.  It can be run from the
repository root after installing the backend dependencies.

NOTE: This demonstration uses synthetic data for illustrative purposes.  It
does not provide medical advice and is not intended for diagnostic use.
"""

import pickle
from pathlib import Path


def load_model(path: Path):
    """Load a pickled scikit‑learn model from disk."""
    with path.open("rb") as f:
        return pickle.load(f)


def predict_human(model, heart_rate: float, spo2: float, temperature: float) -> int:
    """
    Predict whether a set of human vital signs constitutes an event.

    The IsolationForest model returns -1 for anomalies and 1 for normal samples;
    we invert this to return 1 for events and 0 for normal cases.

    Parameters
    ----------
    model : IsolationForest
        Trained IsolationForest model.
    heart_rate : float
        Heart rate (beats per minute).
    spo2 : float
        Oxygen saturation (percentage).
    temperature : float
        Body temperature (°C).

    Returns
    -------
    int
        1 if the sample is anomalous (event), 0 otherwise.
    """
    raw_pred = model.predict([[heart_rate, spo2, temperature]])[0]
    return 1 if raw_pred == -1 else 0


def predict_cat(model, heart_rate: float, resp_rate: float, temperature: float) -> int:
    """
    Predict whether a set of feline vital signs constitutes an event.

    The RandomForest classifier returns 1 for events (anomalies) and 0 for
    normal samples.

    Parameters
    ----------
    model : RandomForestClassifier
        Trained RandomForest model for cat events.
    heart_rate : float
        Cat heart rate (beats per minute).
    resp_rate : float
        Respiratory rate (breaths per minute).
    temperature : float
        Body temperature (°C).

    Returns
    -------
    int
        1 if the sample is classified as an event, 0 otherwise.
    """
    return int(model.predict([[heart_rate, resp_rate, temperature]])[0])


def main() -> None:
    # Paths to the trained models (relative to the repository root).
    human_model_path = Path("backend/liquid_ai_isolation_forest.pkl")
    cat_model_path = Path("backend/liquid_ai_cat_model.pkl")

    # Load models
    try:
        human_model = load_model(human_model_path)
    except FileNotFoundError:
        print(f"Human model not found at {human_model_path}. Make sure the file exists.")
        return

    try:
        cat_model = load_model(cat_model_path)
    except FileNotFoundError:
        print(f"Cat model not found at {cat_model_path}. Make sure the file exists.")
        return

    # Synthetic human samples: (heart_rate, spo2, temperature)
    human_samples = [
        (72, 98, 36.8),   # Normal
        (130, 85, 39.0),  # High heart rate & high temperature → event
    ]

    # Synthetic cat samples: (heart_rate, resp_rate, temperature)
    cat_samples = [
        (120, 25, 38.5),  # Normal
        (190, 50, 41.0),  # Elevated vitals → event
    ]

    print("Human vital‑sign predictions:\n----------------------------")
    for idx, (hr, spo2, temp) in enumerate(human_samples, 1):
        prediction = predict_human(human_model, hr, spo2, temp)
        status = "EVENT" if prediction == 1 else "Normal"
        print(f"Sample {idx}: HR={hr} bpm, SpO₂={spo2} %, Temp={temp} °C → {status}")

    print("\nCat vital‑sign predictions:\n--------------------------")
    for idx, (hr, rr, temp) in enumerate(cat_samples, 1):
        prediction = predict_cat(cat_model, hr, rr, temp)
        status = "EVENT" if prediction == 1 else "Normal"
        print(f"Sample {idx}: HR={hr} bpm, RR={rr} bpm, Temp={temp} °C → {status}")


if __name__ == "__main__":
    main()