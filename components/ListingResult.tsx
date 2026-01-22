
import React, { useState } from 'react';
import { ListingGenerationResponse } from '../types';

interface ListingResultProps {
  data: ListingGenerationResponse;
}

const ListingResult: React.FC<ListingResultProps> = ({ data }) => {
  const [activeVariant, setActiveVariant] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Keywords Shelf */}
      <div className="glass-panel p-6 rounded-3xl border shadow-sm flex flex-wrap items-center gap-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2">Core SEO Pulse</span>
        <div className="flex flex-wrap gap-2">
          {data.primary_keywords.map((kw, i) => (
            <span key={i} className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wider">
              {kw}
            </span>
          ))}
          {data.secondary_keywords.map((kw, i) => (
            <span key={i} className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Variant Switcher */}
      <div className="flex bg-gray-200/50 p-1.5 rounded-2xl w-fit mx-auto">
        {data.product_title_variants.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveVariant(i)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeVariant === i ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Variant {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Col: Titles & Description */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[2rem] border shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-gray-900">Optimized Title</h3>
              <button 
                onClick={() => copyToClipboard(data.product_title_variants[activeVariant], 'title')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
              >
                {copied === 'title' ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>}
                {copied === 'title' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-2xl font-bold text-indigo-900 leading-tight">
              {data.product_title_variants[activeVariant]}
            </p>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] border shadow-sm space-y-6">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-gray-900">Narrative Description</h3>
              <button 
                onClick={() => copyToClipboard(data.full_description_variants[activeVariant], 'desc')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
              >
                {copied === 'desc' ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>}
                {copied === 'desc' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
              {data.full_description_variants[activeVariant]}
            </div>
          </div>
        </div>

        {/* Right Col: Bullets */}
        <div className="xl:col-span-1 glass-panel p-8 rounded-[2rem] border shadow-sm flex flex-col h-full bg-indigo-50/30">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-gray-900">Key Highlights</h3>
            <button 
                onClick={() => copyToClipboard(data.bullet_point_variants[activeVariant].join('\n'), 'bullets')}
                className="p-2 text-indigo-400 hover:text-indigo-600 transition"
                title="Copy All"
              >
                {copied === 'bullets' ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy text-lg"></i>}
            </button>
          </div>
          <ul className="space-y-6 flex-grow">
            {data.bullet_point_variants[activeVariant]?.map((bullet, j) => (
              <li key={j} className="flex gap-4 group">
                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-[10px] text-indigo-600 font-black mt-1">
                  {j + 1}
                </div>
                <span className="text-sm font-semibold text-gray-700 leading-relaxed group-hover:text-indigo-700 transition-colors">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListingResult;
