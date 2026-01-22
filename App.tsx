import React, { useState, useEffect } from 'react';
import { analyzeReviews, generateListing, explainPrediction, checkBackendHealth } from './services/geminiService';
import { 
  ReviewAnalysisResponse, 
  ListingGenerationResponse, 
  ListingInput, 
  PredictionExplanationResponse, 
  PredictionInput 
} from './types';
import AnalysisResult from './components/AnalysisResult';
import ListingResult from './components/ListingResult';
import PredictionResult from './components/PredictionResult';

type Tab = 'analysis' | 'listing' | 'prediction';

interface BackendHealth {
  connected: boolean;
  message: string;
  details?: any;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  
  // Review Analysis State
  const [productAReviews, setProductAReviews] = useState('');
  const [competitorReviews, setCompetitorReviews] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ReviewAnalysisResponse | null>(null);
  
  // Listing Generation State
  const [listingInput, setListingInput] = useState<ListingInput>({
    productName: '',
    category: '',
    features: '',
    targetAudience: '',
    brandTone: 'Professional'
  });
  const [listingResult, setListingResult] = useState<ListingGenerationResponse | null>(null);

  // Prediction State
  const [predInput, setPredInput] = useState<PredictionInput>({
    modelOutput: '',
    inputFeatures: '',
    historicalContext: ''
  });
  const [predictionResult, setPredictionResult] = useState<PredictionExplanationResponse | null>(null);

  // System State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendHealth, setBackendHealth] = useState<BackendHealth>({
    connected: false,
    message: 'Checking backend connection...'
  });
  const [connectionRetries, setConnectionRetries] = useState(0);

  // Check backend health on mount
  useEffect(() => {
    const initializeBackend = async () => {
      const health = await checkBackendHealth();
      setBackendHealth(health);
      
      if (!health.connected && connectionRetries < 3) {
        // Retry connection after 3 seconds
        setTimeout(() => {
          setConnectionRetries(prev => prev + 1);
        }, 3000);
      }
    };
    
    initializeBackend();
  }, [connectionRetries]);

  const handleAnalyzeReviews = async () => {
    if (!productAReviews.trim()) {
      setError('Provide product reviews to begin analysis.');
      return;
    }
    
    if (!backendHealth.connected) {
      setError('Backend not connected. Please check if Python server is running.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      console.log('🔄 Starting review analysis...');
      const result = await analyzeReviews(productAReviews, competitorReviews);
      setAnalysisResult(result);
      
      // Check if we got fallback data (indicates backend issues)
      if (result.top_pain_points.some(p => p.issue.includes('Backend connection'))) {
        setError('⚠️ Using fallback data. Backend may not be fully connected.');
      }
      
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(`Intelligence extraction failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateListing = async () => {
    if (!listingInput.productName || !listingInput.features) {
      setError('Product Name and Features are required for copywriting.');
      return;
    }
    
    if (!backendHealth.connected) {
      setError('Backend not connected. Please check if Python server is running.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setListingResult(null);
    
    try {
      console.log('🔄 Generating product listing...');
      const result = await generateListing(listingInput);
      setListingResult(result);
      
    } catch (err: any) {
      console.error('Listing generation error:', err);
      setError(`Copy generation failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainPrediction = async () => {
    if (!predInput.modelOutput || !predInput.inputFeatures) {
      setError('Prediction data and features are required.');
      return;
    }
    
    if (!backendHealth.connected) {
      setError('Backend not connected. Please check if Python server is running.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setPredictionResult(null);
    
    try {
      console.log('🔄 Explaining prediction...');
      const result = await explainPrediction(predInput);
      setPredictionResult(result);
      
    } catch (err: any) {
      console.error('Prediction explanation error:', err);
      setError(`Strategy bridge failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setListingResult(null);
    setPredictionResult(null);
    setError(null);
  };

  const refreshBackendConnection = async () => {
    setConnectionRetries(0);
    const health = await checkBackendHealth();
    setBackendHealth(health);
    
    if (health.connected) {
      setError(null);
    }
  };

  const renderBackendStatus = () => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
      backendHealth.connected 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-amber-50 text-amber-700 border border-amber-200'
    }`}>
      <div className={`w-2 h-2 rounded-full ${backendHealth.connected ? 'bg-green-500' : 'bg-amber-500'}`}></div>
      <span>{backendHealth.message}</span>
      {!backendHealth.connected && (
        <button 
          onClick={refreshBackendConnection}
          className="ml-2 px-2 py-0.5 bg-amber-100 hover:bg-amber-200 rounded text-xs transition"
        >
          Retry
        </button>
      )}
    </div>
  );

  const renderAnalysisInput = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Review Intelligence</h1>
        <p className="text-xl text-gray-500 font-medium">Decode the voice of your customer in seconds.</p>
        {!backendHealth.connected && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-amber-700 font-medium">
              ⚠️ Backend not connected. Analysis will use fallback data.
            </p>
            <button 
              onClick={refreshBackendConnection}
              className="mt-2 px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded text-xs font-medium transition"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-quote-left text-indigo-500"></i> Primary Product Reviews
            <span className="text-xs text-gray-400 font-normal">({productAReviews.length} chars)</span>
          </label>
          <textarea
            className="w-full h-80 p-6 rounded-3xl glass-panel border focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all"
            value={productAReviews}
            onChange={(e) => setProductAReviews(e.target.value)}
            placeholder="Paste multiple reviews for your product..."
          />
          <div className="text-xs text-gray-400">
            Try: "Great product but shipping is slow. Quality is excellent though!"
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-users-viewfinder text-purple-500"></i> Competitor Benchmark (Optional)
            <span className="text-xs text-gray-400 font-normal">({competitorReviews.length} chars)</span>
          </label>
          <textarea
            className="w-full h-80 p-6 rounded-3xl glass-panel border focus:ring-4 focus:ring-purple-100 outline-none text-sm transition-all"
            value={competitorReviews}
            onChange={(e) => setCompetitorReviews(e.target.value)}
            placeholder="Paste reviews of your competitors to find gaps..."
          />
          <div className="text-xs text-gray-400">
            Optional: Compare with competitor reviews for gap analysis
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={handleAnalyzeReviews} 
          disabled={isLoading}
          className={`px-12 py-5 font-bold rounded-2xl hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 ${
            backendHealth.connected
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-400"></i>
              {backendHealth.connected ? 'Extract Intelligence' : 'Backend Not Connected'}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderListingInput = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Listing Generator</h1>
        <p className="text-xl text-gray-500 font-medium">Generate SEO-first copy that converts.</p>
        {!backendHealth.connected && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-amber-700 font-medium">
              ⚠️ Backend not connected. Using mock listing data.
            </p>
          </div>
        )}
      </div>
      <div className="glass-panel p-10 rounded-[2.5rem] border shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name *</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl border border-gray-100 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold" 
              placeholder="e.g. Ultra-Light Carbon Bike"
              value={listingInput.productName}
              onChange={(e) => setListingInput({...listingInput, productName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category *</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl border border-gray-100 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold" 
              placeholder="e.g. Outdoor / Cycling"
              value={listingInput.category}
              onChange={(e) => setListingInput({...listingInput, category: e.target.value})}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Core Features (Line-by-line) *</label>
          <textarea 
            className="w-full h-40 p-5 rounded-xl border border-gray-100 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none font-medium" 
            placeholder="Aerodynamic frame&#10;8kg total weight&#10;Hydraulic brakes..."
            value={listingInput.features}
            onChange={(e) => setListingInput({...listingInput, features: e.target.value})}
          />
          <div className="text-xs text-gray-400">
            Enter one feature per line for best results
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Audience</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl border border-gray-100 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold" 
              placeholder="e.g. Competitive cyclists"
              value={listingInput.targetAudience}
              onChange={(e) => setListingInput({...listingInput, targetAudience: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Voice</label>
            <select 
              className="w-full p-4 rounded-xl border border-gray-100 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold bg-white"
              value={listingInput.brandTone}
              onChange={(e) => setListingInput({...listingInput, brandTone: e.target.value})}
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Premium</option>
              <option>Witty</option>
              <option>Minimalist</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleGenerateListing} 
          disabled={isLoading}
          className={`w-full py-5 text-white font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
            backendHealth.connected
              ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <i className="fa-solid fa-pen-nib"></i>
              {backendHealth.connected ? 'Generate Multi-Variant Copy' : 'Backend Not Connected'}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPredictionInput = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
       <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Strategist Bridge</h1>
        <p className="text-xl text-gray-500 font-medium">Translate raw data into actionable boardroom strategy.</p>
        {!backendHealth.connected && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-amber-700 font-medium">
              ⚠️ Backend not connected. Using mock prediction explanations.
            </p>
          </div>
        )}
      </div>
      <div className="glass-panel p-10 rounded-[2.5rem] border shadow-sm space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-indigo-500"></i> Model Conclusion *
          </label>
          <input 
            type="text" 
            className="w-full p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-xl font-bold text-indigo-950" 
            placeholder="e.g. Recommend price hike to $49.99 (92% projected margin stability)"
            value={predInput.modelOutput}
            onChange={(e) => setPredInput({...predInput, modelOutput: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-database text-purple-500"></i> Key Driving Features *
          </label>
          <textarea 
            className="w-full h-40 p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium" 
            placeholder="Elasticity: -1.2, Stock Velocity: High, Comp. Price: $54..."
            value={predInput.inputFeatures}
            onChange={(e) => setPredInput({...predInput, inputFeatures: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-gray-500"></i> Historical Context (Optional)
          </label>
          <textarea 
            className="w-full h-32 p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium" 
            placeholder="Previous quarter sales trends, competitor moves, market shifts..."
            value={predInput.historicalContext}
            onChange={(e) => setPredInput({...predInput, historicalContext: e.target.value})}
          />
        </div>
        <button 
          onClick={handleExplainPrediction} 
          disabled={isLoading}
          className={`w-full py-5 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95 ${
            backendHealth.connected
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Prediction...
            </div>
          ) : (
            'Explain & Strategize'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pb-12">
      {/* Top Navigation */}
      <nav className="glass-panel border-b sticky top-0 z-50 py-4 px-6 md:px-12 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-wave-square text-white text-xl"></i>
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">MarketPulse<span className="text-indigo-600">AI</span></span>
              <div className="text-xs text-gray-500">E-commerce Intelligence Platform</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {renderBackendStatus()}
            
            <div className="flex bg-gray-200/50 p-1 rounded-[1.25rem] border border-gray-100">
              {[
                { id: 'analysis', label: 'Analyst', icon: 'fa-chart-pie' },
                { id: 'listing', label: 'Copywriter', icon: 'fa-feather-pointed' },
                { id: 'prediction', label: 'Strategist', icon: 'fa-chess-king' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as Tab); handleReset(); }}
                  className={`flex items-center gap-2 px-6 py-2.5 text-xs font-black rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-lg scale-105' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  <i className={`fa-solid ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6">
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center gap-4 text-rose-700 animate-in slide-in-from-top-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
              {error.includes('Backend not connected') && (
                <div className="mt-2">
                  <button 
                    onClick={refreshBackendConnection}
                    className="px-3 py-1 bg-rose-100 hover:bg-rose-200 rounded text-xs font-medium transition"
                  >
                    Retry Connection
                  </button>
                  <p className="text-xs text-rose-600 mt-1">
                    Run: <code className="bg-rose-100 px-1 py-0.5 rounded">cd backend && python server.py</code>
                  </p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-in fade-in duration-500">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-microchip text-indigo-600 text-3xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Generating Insights</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
                {backendHealth.connected ? 'Connected to AI Engine...' : 'Using fallback data...'}
              </p>
              {!backendHealth.connected && (
                <p className="text-xs text-amber-600 mt-2 max-w-md">
                  Backend not connected. Running in demo mode with sample data.
                  Start the Python backend for full AI capabilities.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'analysis' ? (
              analysisResult ? (
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Intelligence Report</h2>
                      <p className="text-gray-500 font-medium">Extracted from customer feedback loops</p>
                      {!backendHealth.connected && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs mt-1">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          Demo Mode
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
                          alert('Report copied to clipboard!');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition flex items-center gap-1"
                      >
                        <i className="fa-regular fa-copy"></i>
                        Copy
                      </button>
                      <button onClick={handleReset} className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-wider hover:bg-indigo-100 transition">New Analysis</button>
                    </div>
                  </div>
                  <AnalysisResult data={analysisResult} />
                </div>
              ) : renderAnalysisInput()
            ) : activeTab === 'listing' ? (
              listingResult ? (
                <div className="space-y-8">
                   <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Content Variations</h2>
                      <p className="text-gray-500 font-medium">A/B optimized for search and conversion</p>
                      {!backendHealth.connected && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs mt-1">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          Demo Mode
                        </div>
                      )}
                    </div>
                    <button onClick={handleReset} className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-wider hover:bg-indigo-100 transition">New Listing</button>
                  </div>
                  <ListingResult data={listingResult} />
                </div>
              ) : renderListingInput()
            ) : (
              predictionResult ? (
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Strategic Roadmap</h2>
                      <p className="text-gray-500 font-medium">AI-interpreted model predictions</p>
                      {!backendHealth.connected && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs mt-1">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          Demo Mode
                        </div>
                      )}
                    </div>
                    <button onClick={handleReset} className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-wider hover:bg-indigo-100 transition">New Prediction</button>
                  </div>
                  <PredictionResult data={predictionResult} />
                </div>
              ) : renderPredictionInput()
            )}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-16 text-center">
        <div className="max-w-4xl mx-auto border-t border-gray-200/50 pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-50 grayscale">
             <i className="fa-solid fa-wave-square text-gray-900"></i>
             <span className="font-black text-gray-900 tracking-tighter">MarketPulseAI</span>
          </div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} Intelligent E-commerce Core
          </p>
          <div className="text-xs text-gray-500 flex items-center gap-4">
            <span>Frontend: React + TypeScript</span>
            <span>•</span>
            <span>Backend: Python + Flask</span>
            <span>•</span>
            <span>AI: Google Gemini</span>
          </div>
          {!backendHealth.connected && (
            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 max-w-md">
              <p className="font-medium">Backend Not Connected</p>
              <p className="mt-1">For full functionality, start the Python backend:</p>
              <code className="block bg-amber-100 px-2 py-1 rounded mt-1 text-[10px]">
                cd backend && python server.py
              </code>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;