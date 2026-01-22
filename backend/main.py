# backend/main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
os.getenv("GOOGLE_API_KEY") 

# Load environment variables
load_dotenv(".env.local")

from ai_modules import review_analysis, listing_generator, prediction

app = FastAPI(title="MarketPulse AI Backend")

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "MarketPulse AI backend is running"}

@app.post("/analyze-reviews")
def analyze_reviews(payload: dict):
    return review_analysis.analyze_reviews(payload)

@app.post("/generate-listing")
def generate_listing(payload: dict):
    return listing_generator.generate_listing(payload)

@app.post("/predict")
def predict(payload: dict):
    return prediction.predict(payload)
