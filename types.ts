
export enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

export enum Frequency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface PainPoint {
  issue: string;
  frequency_estimate: Frequency;
  example_review_excerpt: string;
}

export interface PositiveFeature {
  feature: string;
  frequency_estimate: Frequency;
  example_review_excerpt: string;
}

export interface CompetitiveGap {
  gap: string;
  competitor_advantage: string;
}

export interface ReviewAnalysisResponse {
  overall_sentiment: Sentiment;
  top_pain_points: PainPoint[];
  top_positive_features: PositiveFeature[];
  competitive_gaps: CompetitiveGap[];
  actionable_recommendations: string[];
}

export interface ListingGenerationResponse {
  product_title_variants: string[];
  bullet_point_variants: string[][];
  full_description_variants: string[];
  primary_keywords: string[];
  secondary_keywords: string[];
}

export interface ListingInput {
  productName: string;
  category: string;
  features: string;
  targetAudience: string;
  brandTone: string;
}

export interface PredictionFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PredictionExplanationResponse {
  prediction_summary: string;
  key_factors: PredictionFactor[];
  recommended_actions: string[];
  confidence_level: 'low' | 'medium' | 'high';
}

export interface PredictionInput {
  modelOutput: string;
  inputFeatures: string;
  historicalContext: string;
}
