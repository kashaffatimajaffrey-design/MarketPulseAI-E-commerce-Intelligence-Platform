import google.generativeai as genai
import json
from typing import Dict, Any, List

class ListingGenerator:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is missing")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
    
    def generate(self, product_data: Dict[str, str]) -> Dict[str, Any]:
        """Generate e-commerce product listing content"""
        
        prompt = f"""
        You are a professional e-commerce copywriter. Generate SEO-optimized product listing content.
        
        PRODUCT DETAILS:
        - Name: {product_data.get('product_name', 'Unknown Product')}
        - Category: {product_data.get('category', 'General')}
        - Features: {product_data.get('features', 'No features specified')}
        - Target Audience: {product_data.get('target_audience', 'General consumers')}
        - Brand Tone: {product_data.get('brand_tone', 'Professional')}
        
        Generate 3 variations (A, B, C) for A/B testing. Each variation should have:
        1. A compelling product title
        2. 5-7 bullet points highlighting key features/benefits
        3. A detailed product description (150-200 words)
        
        Also provide relevant SEO keywords.
        
        Return VALID JSON with:
        1. "product_title_variants": array of 3 title strings
        2. "bullet_point_variants": array of 3 arrays, each containing 5-7 bullet strings
        3. "full_description_variants": array of 3 description strings
        4. "primary_keywords": array of 5-7 main keywords
        5. "secondary_keywords": array of 5-7 secondary keywords
        
        Make it persuasive, clear, and optimized for conversion.
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "response_mime_type": "application/json",
                    "max_output_tokens": 2500
                }
            )
            
            result = json.loads(response.text.strip())
            return result
            
        except Exception as e:
            print(f"Gemini API error in listing generator: {e}")
            return self._get_fallback_listing(product_data)
    
    def _get_fallback_listing(self, product_data: Dict[str, str]) -> Dict[str, Any]:
        """Fallback listing data"""
        product_name = product_data.get('product_name', 'Premium Product')
        
        return {
            "product_title_variants": [
                f"{product_name} - Professional Grade | Highest Quality",
                f"Premium {product_name} | Advanced Performance & Durability",
                f"{product_name} Pro - Industry Leading Technology"
            ],
            "bullet_point_variants": [
                [
                    f"Premium quality {product_name.lower()} built to last",
                    "Engineered for maximum performance and reliability",
                    "Easy to use with intuitive controls and setup",
                    "Backed by 2-year manufacturer warranty",
                    "Trusted by professionals worldwide"
                ],
                [
                    "Advanced technology for superior results",
                    "Durable construction withstands heavy use",
                    "Versatile design suitable for multiple applications",
                    "Energy efficient operation saves costs",
                    "Excellent customer support and service"
                ],
                [
                    "Cutting-edge innovation at an affordable price",
                    "Ergonomic design for comfortable extended use",
                    "Low maintenance requirements",
                    "Compatible with industry-standard accessories",
                    "Fast shipping and reliable delivery"
                ]
            ],
            "full_description_variants": [
                f"Introducing our premium {product_name}, designed for professionals who demand excellence. This {product_data.get('category', 'product')} combines breakthrough technology with robust construction to deliver unmatched performance. Perfect for {product_data.get('target_audience', 'demanding users')}, it features {product_data.get('features', 'advanced functionality')}. Experience the difference that quality makes.",
                f"Elevate your experience with our {product_name}, engineered to exceed expectations. This exceptional {product_data.get('category', 'product')} offers {product_data.get('features', 'superior features')} in a package designed for {product_data.get('target_audience', 'discriminating customers')}. Built with precision and tested for reliability, it represents the pinnacle of innovation in its category.",
                f"Discover the {product_name} - where advanced technology meets practical design. This professional-grade {product_data.get('category', 'solution')} provides {product_data.get('features', 'outstanding performance')} for {product_data.get('target_audience', 'serious users')}. Crafted from premium materials and backed by comprehensive support, it's the smart choice for those who value quality and results."
            ],
            "primary_keywords": [
                product_name.lower(),
                product_data.get('category', '').lower(),
                "premium",
                "professional",
                "quality",
                "2024"
            ],
            "secondary_keywords": [
                "buy",
                "best",
                "review",
                "sale",
                "discount",
                "price",
                "deal"
            ]
        }