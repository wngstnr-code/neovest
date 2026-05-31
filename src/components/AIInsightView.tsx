/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ChevronRight, LayoutGrid, CheckCircle, Zap, Lightbulb, Compass, Landmark, ShoppingBag, Activity, FileText, Globe } from 'lucide-react';
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
  const [expandedPick, setExpandedPick] = useState<string | null>('BBCA');

  const bbcaData = stocks.find((s) => s.code === 'BBCA') || stocks[0];
  const bmriData = stocks.find((s) => s.code === 'BMRI') || stocks[1];
  const adroData = stocks.find((s) => s.code === 'ADRO') || stocks[2];

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
        <div className="flex items-start gap-2.5">
          <svg className="w-8 h-8 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V12C3 17.5 7.2 21.4 12 22C16.8 21.4 21 17.5 21 12V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M9 13.5L11.5 11L14.5 14L19 8.5" stroke="#fecb00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">AI Insight</h2>
          </div>
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

        {[bbcaData, bmriData, adroData].map((pickData) => {
          const isExpanded = expandedPick === pickData.code;
          return (
            <div 
              key={pickData.code}
              onClick={() => setExpandedPick(isExpanded ? null : pickData.code)}
              className="bg-white rounded-2xl border border-gray-100 p-4 soft-shadow mb-3 cursor-pointer hover:bg-gray-50/50 transition-all overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary font-black text-sm flex items-center justify-center border border-primary/10">
                    {pickData.code.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-gray-900">{pickData.code}</h4>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold block mt-0.5">{pickData.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-primary block">{pickData.aiConfidence}%</span>
                    <span className="text-[10px] text-gray-400 font-bold block">Confidence</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-3.5 mb-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Risk Level</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${pickData.riskLevel === 'Rendah' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-bold text-gray-700">{pickData.riskLevel}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Target Price</span>
                      <span className="text-xs font-bold text-gray-900 block mt-1">Rp {(pickData.price * 1.15).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Reasoning Bubble */}
                  <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Analisis AI</span>
                    </h4>
                    <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
                      {pickData.fundamental}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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

      {/* News Sentiment Highlight */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-4 h-4 text-primary stroke-[2.2]" />
          NEWS SENTIMENT HIGHLIGHT
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 soft-shadow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex flex-col items-center justify-center shrink-0 border border-teal-100">
              <span className="text-teal-700 font-black text-xs">75%</span>
              <span className="text-[8px] text-teal-600 font-bold">POS</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Sentimen TLKM Menguat</h4>
              <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
                Berita terkini menunjukkan sentimen positif pada TLKM akibat rilis rencana strategis ekspansi data center skala besar ke seluruh Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Portfolio Alert */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-500 stroke-[2.2]" />
          EARLY WARNING SYSTEM
        </h3>
        <div className="bg-red-50/50 rounded-2xl border border-red-100 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-800 mb-1">Volatilitas GOTO Meningkat</h4>
              <p className="text-[10px] leading-relaxed text-red-600/90 font-medium">
                AI kami mendeteksi lonjakan volume transaksi GOTO sebesar 300% di atas rata-rata 5 hari terakhir. Harap pantau pergerakan harga dengan seksama.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Recognition */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-primary stroke-[2.2]" />
          PATTERN RECOGNITION
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 soft-shadow">
          <h4 className="text-xs font-bold text-gray-900 mb-1">BBRI - Double Bottom</h4>
          <div className="w-full h-16 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-gray-100">
            <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
              <path d="M10,20 L40,40 L70,25 L100,40 L130,15 L160,10 L190,5" fill="none" stroke="#0059bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="40" cy="40" r="3" fill="#0059bb" />
              <circle cx="100" cy="40" r="3" fill="#0059bb" />
              <line x1="10" y1="40" x2="190" y2="40" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
            <strong className="text-gray-700">BBRI</strong> sedang membentuk pola Double Bottom. Potensi rebound dengan support kuat di 5.300 dan target resistance di 5.600.
          </p>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary stroke-[2.2]" />
          EARNINGS SUMMARY
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 soft-shadow">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <span className="text-primary font-black text-[10px]">Q3</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-0.5">Rangkuman Kinerja BMRI</h4>
              <span className="text-[10px] text-gray-400 font-medium">Laporan Kuartal III - 2026</span>
            </div>
          </div>
          <ul className="text-[10px] leading-relaxed text-gray-500 font-medium list-disc pl-4 space-y-1">
            <li>Laba BMRI naik 15% (Beat estimasi pasar).</li>
            <li>NPL (Kredit Macet) membaik.</li>
            <li>Pertumbuhan kredit solid.</li>
          </ul>
        </div>
      </div>

      {/* Macroeconomic Correlation */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-primary stroke-[2.2]" />
          MACRO CORRELATION
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 soft-shadow">
          <h4 className="text-xs font-bold text-gray-900 mb-1">Keputusan Suku Bunga BI</h4>
          <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
            Suku bunga acuan BI ditahan di 6.00%. Ini menjadi katalis positif bagi emiten perbankan besar.
          </p>
        </div>
      </div>

      {/* Disclaimer footer */}
      <div className="px-5">
        <p className="text-xs text-gray-400 font-medium leading-relaxed text-center mt-2">
          Disclaimer: Keputusan investasi sepenuhnya berada di tangan investor. Data AI Insight disajikan sebagai referensi pendukung dan tidak menjamin keuntungan pasti. Kinerja masa lalu tidak mencerminkan hasil di masa depan.
        </p>
      </div>
    </div>
  );
}
