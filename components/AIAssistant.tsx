
import React, { useState } from 'react';
import { Item } from '../types';
import { getAIInsights } from '../services/geminiService';

interface AIAssistantProps {
  items: Item[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ items }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const result = await getAIInsights(items);
      setInsights(result || "No response received.");
    } catch (err) {
      setInsights("Error generating insights. Ensure your Gemini API Key is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-4xl font-black text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Neural Insights
        </h2>
        <p className="text-slate-400 mt-2">Powered by Gemini 3 Flash to optimize your technology store.</p>
      </header>

      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-xl shadow-purple-900/30">
            🧠
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Advanced Inventory Intelligence</h3>
            <p className="text-slate-400 max-w-md">
              Our AI analyzes your stock levels, categories, and technical descriptions to provide strategic e-commerce recommendations.
            </p>
          </div>

          {!insights ? (
            <button
              onClick={generateInsights}
              disabled={loading}
              className={`px-10 py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 ${
                loading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/20'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Thinking...</span>
                </div>
              ) : 'Generate Store Analysis'}
            </button>
          ) : (
            <div className="w-full text-left bg-slate-900/50 p-6 rounded-2xl border border-slate-700 prose prose-invert prose-blue max-w-none">
              <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light">
                {insights}
              </div>
              <button
                onClick={() => setInsights(null)}
                className="mt-6 text-sm text-slate-500 hover:text-purple-400 transition-colors underline"
              >
                Clear and refresh analysis
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Capabilities</p>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Market Gap Analysis</li>
            <li>• Strategic Planning</li>
          </ul>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Accuracy</p>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Gemini 3.0 Engine</li>
            <li>• Context-Aware Logic</li>
          </ul>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Privacy</p>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Encrypted Pipelines</li>
            <li>• No Data Retention</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
