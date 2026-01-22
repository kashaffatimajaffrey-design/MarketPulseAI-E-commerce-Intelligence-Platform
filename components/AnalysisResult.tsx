
import React from 'react';
import { ReviewAnalysisResponse, Sentiment } from '../types';
import FrequencyBadge from './FrequencyBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisResultProps {
  data: ReviewAnalysisResponse;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const getSentimentStyling = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.POSITIVE: 
        return { icon: 'fa-face-smile', color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Positive Pulse' };
      case Sentiment.NEGATIVE: 
        return { icon: 'fa-face-frown', color: 'text-rose-500', bg: 'bg-rose-50', label: 'Negative Pulse' };
      default: 
        return { icon: 'fa-face-meh', color: 'text-amber-500', bg: 'bg-amber-50', label: 'Neutral Pulse' };
    }
  };

  const style = getSentimentStyling(data.overall_sentiment);

  const chartData = [
    { name: 'Pain Points', count: data.top_pain_points.length, color: '#f43f5e' },
    { name: 'Strengths', count: data.top_positive_features.length, color: '#10b981' },
    { name: 'Gaps', count: data.competitive_gaps.length, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-panel p-8 rounded-[2rem] border shadow-sm flex flex-col justify-center items-center text-center space-y-4">
          <div className={`${style.bg} ${style.color} w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner`}>
            <i className={`fa-solid ${style.icon}`}></i>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{style.label}</h3>
            <p className="text-3xl font-extrabold capitalize text-gray-900">{data.overall_sentiment}</p>
          </div>
        </div>
        
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] border shadow-sm">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Metric Distribution</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: '600' }} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pain Points */}
        <div className="glass-panel rounded-[2rem] border shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <h3 className="font-bold text-gray-900">Critical Pain Points</h3>
          </div>
          <div className="p-8 space-y-6">
            {data.top_pain_points.map((item, idx) => (
              <div key={idx} className="group space-y-2 pb-6 border-b last:border-0 last:pb-0">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-gray-800 group-hover:text-rose-600 transition-colors leading-snug">{item.issue}</h4>
                  <FrequencyBadge frequency={item.frequency_estimate} />
                </div>
                <div className="relative pl-4 border-l-2 border-rose-100">
                  <p className="text-sm text-gray-500 italic leading-relaxed">"{item.example_review_excerpt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Positive Features */}
        <div className="glass-panel rounded-[2rem] border shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <i className="fa-solid fa-star"></i>
            </div>
            <h3 className="font-bold text-gray-900">Top Strengths</h3>
          </div>
          <div className="p-8 space-y-6">
            {data.top_positive_features.map((item, idx) => (
              <div key={idx} className="group space-y-2 pb-6 border-b last:border-0 last:pb-0">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors leading-snug">{item.feature}</h4>
                  <FrequencyBadge frequency={item.frequency_estimate} />
                </div>
                <div className="relative pl-4 border-l-2 border-emerald-100">
                  <p className="text-sm text-gray-500 italic leading-relaxed">"{item.example_review_excerpt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-indigo-900 text-white rounded-[2rem] p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <i className="fa-solid fa-lightbulb text-indigo-300"></i>
            Actionable Roadmap
          </h3>
          <div className="space-y-4">
            {data.actionable_recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-default">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-[10px] font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="text-sm md:text-base font-medium opacity-90 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] border shadow-sm p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
            <i className="fa-solid fa-chess-knight text-indigo-500"></i>
            Competitive Intelligence
          </h3>
          <div className="space-y-4">
            {data.competitive_gaps.map((item, idx) => (
              <div key={idx} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2 card-hover">
                <div className="font-bold text-gray-900">{item.gap}</div>
                <div className="text-sm text-indigo-600 font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-angles-right"></i>
                  Edge: {item.competitor_advantage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
