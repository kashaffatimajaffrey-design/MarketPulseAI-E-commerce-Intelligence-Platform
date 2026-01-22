from typing import List, Optional
from pydantic import BaseModel, Field

class PainPoint(BaseModel):
    issue: str
    frequency_estimate: str = Field(..., pattern="^(low|medium|high)$")
    example_review_excerpt: str

class PositiveFeature(BaseModel):
    feature: str
    frequency_estimate: str = Field(..., pattern="^(low|medium|high)$")
    example_review_excerpt: str

class CompetitiveGap(BaseModel):
    gap: str
    competitor_advantage: str

class ReviewAnalysisRequest(BaseModel):
    product_reviews: List[str]
    competitor_reviews: Optional[List[str]] = None

class ReviewAnalysisResponse(BaseModel):
    overall_sentiment: str = Field(..., pattern="^(positive|neutral|negative)$")
    top_pain_points: List[PainPoint]
    top_positive_features: List[PositiveFeature]
    competitive_gaps: List[CompetitiveGap]
    actionable_recommendations: List[str]