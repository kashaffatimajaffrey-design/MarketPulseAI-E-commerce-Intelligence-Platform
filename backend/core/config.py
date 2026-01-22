import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    
    @classmethod
    def validate(cls):
        """Validate configuration"""
        if not cls.GEMINI_API_KEY or cls.GEMINI_API_KEY == "your_api_key_here":
            print("⚠️  WARNING: GEMINI_API_KEY not set in .env file")
            print("⚠️  Running in mock mode with sample data")
        return True

config = Config()