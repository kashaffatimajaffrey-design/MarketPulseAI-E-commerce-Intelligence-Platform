from typing import List
from pydantic import BaseModel, Field

class ListingGenerationRequest(BaseModel):
    product_name: str
    category: str
    features: str
    target_audience: str = "General consumers"
    brand_tone: str = "Professional"

class ListingGenerationResponse(BaseModel):
    product_title_variants: List[str] = Field(..., min_items=2)
    bullet_point_variants: List[List[str]]
    full_description_variants: List[str] = Field(..., min_items=2)
    primary_keywords: List[str]
    secondary_keywords: List[str]