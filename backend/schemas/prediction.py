from typing import List
from pydantic import BaseModel, Field

class PredictionFactor(BaseModel):
    factor: str
    impact: str = Field(..., pattern="^(low|medium|high)$")

class PredictionExplanationRequest(BaseModel):
    model_output: str
    input_features: str
    historical_context: str = ""

class PredictionExplanationResponse(BaseModel):
    prediction_summary: str
    key_factors: List[PredictionFactor]
    recommended_actions: List[str]
    confidence_level: str = Field(..., pattern="^(low|medium|high)$")