import logging
import sys
from config import Config

def configure_logging():
    """
    Configure structured logging for the backend.
    Prints to stdout with timestamp + level + message.
    """
    handler = logging.StreamHandler(sys.stdout)
    fmt = "%(asctime)s %(levelname)s %(name)s %(message)s"
    handler.setFormatter(logging.Formatter(fmt))

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(getattr(logging, Config.LOG_LEVEL.upper(), logging.INFO))
