import pickle
import os

# Path to the isolation forest model used for anomaly detection
# The trained Isolation Forest model file.  The model is expected to live in the
# same directory as this module (e.g. backend/liquid_ai_isolation_forest.pkl).
MODEL_PATH = "liquid_ai_isolation_forest.pkl"

def load_model(path=MODEL_PATH):
    """
    Load a trained model from disk.
    Returns the model if found, else None.
    """
    if os.path.exists(path):
        with open(path, "rb") as f:
            return pickle.load(f)
    return None


def save_model(model, path=MODEL_PATH):
    """
    Save a trained model to disk.
    """
    with open(path, "wb") as f:
        pickle.dump(model, f)