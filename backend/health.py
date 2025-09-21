from flask import Blueprint, jsonify

# Create a health blueprint so it's easy to attach to app.py
health_bp = Blueprint("health", __name__)

@health_bp.get("/healthz")
def healthz():
    """Basic heartbeat check"""
    return jsonify({"ok": True})

@health_bp.get("/readyz")
def readyz():
    """Deeper readiness check — later you can add: model loaded, DB alive, etc."""
    return jsonify({"ready": True})
