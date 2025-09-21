def clean_input(data):
    """
    Ensures incoming JSON has all needed fields,
    fills in defaults if missing, and keeps types consistent.
    """
    return {
        "heart_rate": float(data.get("heart_rate", 0)),
        "spo2": float(data.get("spo2", 100)),      # default 100 if missing
        "temperature": float(data.get("temperature", 37))  # default 37°C if missing
    }


def is_event(heart_rate, spo2, temperature):
    """
    Simple rule-based fallback:
    Returns 1 if any critical condition is met, else 0.
    """
    if spo2 < 90 or heart_rate > 120 or temperature > 38:
        return 1
    return 0
