
import React from 'react';
import { PredictionExplanationResponse } from '../types';

interface PredictionResultProps {
  data: PredictionExplanationResponse;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ data }) => {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return { color: 'text-green-600', bg: 'bg-green-100', icon: 'fa-circle-check' };
      case 'medium': return { color: 'text-amber-600', bg: 'bg-amber-100', icon: 'fa-circle-dot' };
      default: return { color: 'text-red-600', bg: 'bg-red-100', icon: 'fa-circle-xmark' };
    }
  };

  const confidence = getConfidenceLevel(data.confidence_level);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Executive Summary */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-file-invoice text-indigo-500"></i> Prediction Summary
          </h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${confidence.bg} ${confidence.color}`}>
            <i className={`fa-solid ${confidence.icon}`}></i>
            Confidence: {data.confidence_level.toUpperCase()}
          </div>
        </div>
        <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
          {data.prediction_summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contributing Factors */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-indigo-500"></i> Key Driving Factors
          </h3>
          <div className="space-y-6">
            {data.key_factors.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">{item.factor}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${getImpactColor(item.impact)} text-white`}>
                    {item.impact} impact
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getImpactColor(item.impact)} rounded-full transition-all duration-1000`} 
                    style={{ width: item.impact === 'high' ? '100%' : item.impact === 'medium' ? '60%' : '30%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Plan */}
        <section className="bg-indigo-600 p-8 rounded-3xl shadow-xl text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-rocket"></i> Recommended Action Plan
          </h3>
          <ul className="space-y-4">
            {data.recommended_actions.map((action, idx) => (
              <li key={idx} className="flex gap-4 items-start bg-indigo-500/30 p-4 rounded-2xl backdrop-blur-sm border border-indigo-400/20">
                <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold">
                  {idx + 1}
                </div>
                <p className="text-indigo-50 leading-relaxed font-medium">
                  {action}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PredictionResult;
