import pickle
import os

MODEL_PATH = "models/liquid_ai_rf.pkl"

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
