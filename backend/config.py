import os
from dotenv import load_dotenv

# Load variables from .env file (local/dev). 
# In production, the hosting platform usually sets these automatically.
load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    MODEL_PATH = os.getenv("MODEL_PATH", "models/liquid_ai_rf.pkl")
    APP_ENV = os.getenv("APP_ENV", "dev")    # dev | staging | prod
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
