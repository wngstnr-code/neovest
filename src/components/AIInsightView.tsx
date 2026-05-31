/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ChevronRight, LayoutGrid, CheckCircle, Zap, Lightbulb, Compass, Landmark, ShoppingBag } from 'lucide-react';
import { Stock, UserProfile, Screen } from '../types';

interface AIInsightViewProps {
  userProfile: UserProfile;
  stocks: Stock[];
  onNavigate: (screen: Screen) => void;
  onSelectStock: (code: string) => void;
}

export default function AIInsightView({
  userProfile,
  stocks,
  onNavigate,
  onSelectStock,
}: AIInsightViewProps) {
  const [rebalanceCompleted, setRebalanceCompleted] = useState(false);

  const bbcaData = stocks.find((s) => s.code === 'BBCA') || stocks[0];
  const bmriData = stocks.find((s) => s.code === 'BMRI') || stocks[1];

  const handleRebalance = () => {
    setRebalanceCompleted(true);
    setTimeout(() => {
      setRebalanceCompleted(false);
    }, 4000);
  };

  return (
    <div id="ai-insight-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      {/* Top Title Section */}
      <div className="px-5 mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Insight</h2>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">Your personalized, data-driven strategy.</p>
        </div>

        {/* Risk profile yellow lighting badge */}
        <div className="inline-flex items-center gap-1 bg-accent/95 text-dark-blue font-bold px-3 py-1 rounded-full text-xs soft-shadow">
          <Zap className="w-3.5 h-3.5" />
          <span>{userProfile.riskProfile}</span>
        </div>
      </div>

      {/* Today's AI Picks section */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3.5 flex items-center gap-1">
          <Sparkles className="w-4.5 h-4.5 text-primary stroke-[2.2]" />
          TODAY'S AI PICKS
        </h3>

        {/* BBCA Pick Card */}
        <div 
          onClick={() => {
            onSelectStock(bbcaData.code);
            onNavigate('StockDetail');
          }}
          className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow mb-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-gray-900">{bbcaData.code}</span>
                <span className="bg-primary text-white text-xs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {bbcaData.aiRecommendation}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium mt-0.5 block">{bbcaData.name}</span>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-primary block">{bbcaData.aiConfidence}%</span>
              <span className="text-xs text-gray-400 font-bold block mt-0.5">Al Confidence</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-4 border-t border-b border-gray-100/60 py-3.5">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Risk Level</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-xs font-bold text-gray-700">Low</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Target Price</span>
              <span className="text-xs font-bold text-gray-900 block mt-1">Rp 10.500</span>
            </div>
          </div>

          {/* Reasoning Bubble */}
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 text-primary">
              <Lightbulb className="w-4 h-4" />
              <span>Kenapa direkomendasikan?</span>
            </h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-2">
              Algoritma kami mendeteksi momentum positif dari laporan keuangan Q3 yang solid, dipadukan dengan sentimen makroekonomi yang mendukung sektor perbankan inti. Arus dana asing menunjukkan akumulasi konsisten selama 5 hari terakhir.
            </p>
          </div>
        </div>

        {/* BMRI Pick Card */}
        <div 
          onClick={() => {
            onSelectStock(bmriData.code);
            onNavigate('StockDetail');
          }}
          className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 soft-shadow flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 font-black text-xs flex items-center justify-center">
              BM
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">{bmriData.code}</h4>
              <span className="text-xs text-gray-400 font-semibold block">{bmriData.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded-lg">
              85% Confidence
            </span>
            <button
              id="ai-insight-buy-bmri"
              onClick={(e) => {
                e.stopPropagation();
                onSelectStock('BMRI');
                onNavigate('TradeBuy');
              }}
              className="bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold px-3.5 py-1.5 focus:outline-none transition-all active:scale-95"
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* Sentimen Pasar gauge layout */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <div className="flex items-center gap-1.5 text-gray-900 font-extrabold text-xs mb-4">
            <Compass className="w-4.5 h-4.5 text-primary stroke-[2.2]" />
            <span>Sentimen Pasar</span>
          </div>

          <div className="flex flex-col items-center">
            {/* Custom SVG Half Gauge Dial */}
            <div className="w-40 h-20 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                {/* Background arc track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Dynamic colored arc (Positive sentiment filled to ~75%) */}
                <path
                  d="M 10 50 A 40 40 0 0 1 78.5 21.5"
                  fill="none"
                  stroke="#0059bb"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Indicator needle pointer */}
                <line x1="50" y1="50" x2="72" y2="28" stroke="#101827" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="50" r="3.5" fill="#101827" />
              </svg>
            </div>
            
            <h4 id="ai-market-sentiment-label" className="text-sm font-extrabold text-primary mb-1 mt-1">Positif</h4>
            <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider mb-4">Market Mood Indicator</span>
          </div>

          {/* Sectors to watch tags */}
          <div>
            <span className="text-xs text-gray-400 font-bold block mb-2 tracking-wider">SECTORS TO WATCH</span>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-primary text-xs font-extrabold px-2.5 py-1 rounded-lg">
                <Landmark className="w-3.5 h-3.5" /> Banking
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                <ShoppingBag className="w-3.5 h-3.5" /> Consumer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Concentration Alarm card */}
      <div className="px-5">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow relative">
          <div className="flex items-center gap-2 text-red-500 font-black text-xs mb-3.5">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            <span>Insight Portofolio</span>
          </div>

          {/* Alert content */}
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100/50">
            <div className="flex items-center gap-1.5 mb-1 text-red-700 font-extrabold text-xs">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <span>Konsentrasi Sektor Tinggi</span>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
              Portofolio Anda memiliki eksposur <span className="font-bold text-gray-900">65% di sektor Perbankan</span>. Mengingat volatilitas harga pasar saat ini, sangat disarankan untuk melakukan diversifikasi taktis.
            </p>
          </div>

          <button
            id="ai-rebalance-btn"
            onClick={handleRebalance}
            disabled={rebalanceCompleted}
            className={`w-full h-11 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 mt-4 transition-all ${
              rebalanceCompleted 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-primary text-white hover:bg-primary-dark shadow-md'
            }`}
          >
            {rebalanceCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                Portofolio Berhasil Direbalance!
              </>
            ) : (
              <>
                Lihat Rekomendasi Rebalancing
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Disclaimer footer */}
        <p className="text-xs text-gray-400 font-medium leading-relaxed text-center px-4 mt-8">
          Disclaimer: Keputusan investasi sepenuhnya berada di tangan investor. Data AI Insight disajikan sebagai referensi pendukung dan tidak menjamin keuntungan pasti. Kinerja masa lalu tidak mencerminkan hasil di masa depan.
        </p>
      </div>
    </div>
  );
}
