from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from ai_modules.review_analysis import ReviewAnalyzer
from ai_modules.listing_generator import ListingGenerator
from ai_modules.prediction import PredictionExplainer

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS - allow all origins
CORS(app, origins="*")

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Get configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PORT = int(os.getenv("PORT", 5000))
DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"

# Initialize AI services
if GEMINI_API_KEY and GEMINI_API_KEY != "your_api_key_here":
    print("✅ Gemini API key loaded")
    review_analyzer = ReviewAnalyzer(GEMINI_API_KEY)
    listing_generator = ListingGenerator(GEMINI_API_KEY)
    prediction_explainer = PredictionExplainer(GEMINI_API_KEY)
else:
    print("⚠️  Running in mock mode (no Gemini API key)")
    print("⚠️  Using fallback/sample data")
    review_analyzer = None
    listing_generator = None
    prediction_explainer = None

@app.route('/')
def home():
    return jsonify({
        "service": "MarketPulse AI Backend",
        "version": "1.0.0",
        "status": "running",
        "mode": "production" if review_analyzer else "mock",
        "endpoints": {
            "health": "/health (GET)",
            "analyze": "/api/analyze (POST)",
            "generate_listing": "/api/generate-listing (POST)",
            "explain_prediction": "/api/explain-prediction (POST)"
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "MarketPulse AI Backend",
        "port": PORT,
        "gemini_configured": bool(review_analyzer),
        "mode": "production" if review_analyzer else "mock"
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze product reviews"""
    try:
        data = request.json
        
        # Validate input
        if not data or 'productReviews' not in data:
            return jsonify({"error": "productReviews field is required"}), 400
        
        product_reviews = data.get('productReviews', '')
        competitor_reviews = data.get('competitorReviews', '')
        
        if not product_reviews:
            return jsonify({"error": "productReviews field is required"}), 400
        
        print(f"📊 Analyzing {len(product_reviews)} characters of reviews...")
        
        # Convert to list format expected by ReviewAnalyzer
        product_reviews_list = [product_reviews] if product_reviews else []
        competitor_reviews_list = [competitor_reviews] if competitor_reviews else None
        
        if review_analyzer:
            result = review_analyzer.analyze(product_reviews_list, competitor_reviews_list)
        else:
            # Use fallback data
            result = ReviewAnalyzer("mock")._fallback_response()
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Error in /api/analyze: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-listing', methods=['POST'])
def generate_listing():
    """Generate product listing content"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        product_name = data.get('productName', '')
        features = data.get('features', '')
        
        if not product_name or not features:
            return jsonify({"error": "productName and features are required"}), 400
        
        product_data = {
            "product_name": product_name,
            "category": data.get('category', ''),
            "features": features,
            "target_audience": data.get('targetAudience', 'General consumers'),
            "brand_tone": data.get('brandTone', 'Professional')
        }
        
        print(f"📝 Generating listing for: {product_name}")
        
        if listing_generator:
            result = listing_generator.generate(product_data)
        else:
            # Use fallback data
            result = ListingGenerator("mock")._get_fallback_listing(product_data)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Error in /api/generate-listing: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/explain-prediction', methods=['POST'])
def explain_prediction():
    """Explain ML predictions"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        model_output = data.get('modelOutput', '')
        input_features = data.get('inputFeatures', '')
        
        if not model_output or not input_features:
            return jsonify({"error": "modelOutput and inputFeatures are required"}), 400
        
        prediction_data = {
            "model_output": model_output,
            "input_features": input_features,
            "historical_context": data.get('historicalContext', '')
        }
        
        print("🤖 Explaining prediction...")
        
        if prediction_explainer:
            result = prediction_explainer.explain(prediction_data)
        else:
            # Use fallback data
            result = PredictionExplainer("mock")._get_fallback_explanation()
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Error in /api/explain-prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Validate configuration
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_api_key_here":
        print("⚠️  WARNING: GEMINI_API_KEY not set in .env file")
        print("⚠️  Running in mock mode with sample data")
    
    print(f"\n{'='*60}")
    print("🚀 MARKETPULSE AI BACKEND")
    print(f"{'='*60}")
    print(f"📡 URL: http://localhost:{PORT}")
    print(f"🏥 Health: http://localhost:{PORT}/health")
    print(f"🤖 Mode: {'PRODUCTION' if review_analyzer else 'MOCK'}")
    print(f"🌐 CORS: Enabled for all origins (*)")
    print(f"{'='*60}\n")
    
    app.run(debug=DEBUG, host='0.0.0.0', port=PORT)