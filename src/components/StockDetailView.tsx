/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, TrendingUp, TrendingDown, ChevronRight, Shield, RefreshCcw, Check, ShoppingCart } from 'lucide-react';
import { Stock, Screen } from '../types';
import NeoVestLogo from './NeoVestLogo';

interface StockDetailViewProps {
  stock: Stock;
  watchlist: string[];
  onToggleWatchlist: (code: string) => void;
  onNavigate: (screen: Screen) => void;
}

export default function StockDetailView({
  stock,
  watchlist,
  onToggleWatchlist,
  onNavigate,
}: StockDetailViewProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  const timeframes: ('1D' | '1W' | '1M' | '1Y')[] = ['1D', '1W', '1M', '1Y'];

  const isLoss = stock.changePercent < 0;
  const isAdded = watchlist.includes(stock.code);

  // Dynamic coordinates for different timeframes
  const graphCoords: Record<'1D' | '1W' | '1M' | '1Y', string> = {
    '1D': 'M 0 60 L 50 62 L 100 58 L 150 48 L 200 52 L 250 45 L 300 48',
    '1W': 'M 0 55 L 40 50 L 80 62 L 120 45 L 170 30 L 220 25 L 260 28 L 300 20',
    '1M': 'M 0 85 C 50 80, 80 45, 120 62 C 160 84, 200 25, 240 45 L 300 15',
    '1Y': 'M 0 95 C 60 70, 100 80, 150 45 C 200 20, 250 35, 300 10',
  };

  const getGradientColor = () => {
    return isLoss ? '#ef4444' : '#0059bb';
  };

  return (
    <div id="stock-detail-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      {/* Top Navigation Backbar */}
      <div className="flex items-center justify-between px-5 mb-4">
        <button
          onClick={() => onNavigate('Market')}
          className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-700 focus:outline-none"
        >
          <ArrowLeft className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>

        <span className="font-extrabold text-gray-900 text-sm">Detail Saham</span>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleWatchlist(stock.code)}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-700 focus:outline-none"
          >
            <Star className={`w-4.5 h-4.5 stroke-[2.2] ${isAdded ? 'fill-accent text-accent' : 'text-gray-300'}`} />
          </button>
          <NeoVestLogo compact />
        </div>
      </div>

      {/* Main Stock Summary with price and tick change */}
      <div className="px-5 mb-5 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black text-[#001a41]">{stock.code}</span>
          <span className="text-xs bg-primary/5 text-primary font-black uppercase px-2 py-0.5 rounded">
            {stock.category}
          </span>
        </div>
        <h1 className="text-xs font-semibold text-gray-400 mt-0.5">{stock.name}</h1>

        <div className="flex items-end gap-3 mt-3 relative">
          <h2 className="text-2xl font-black text-gray-900 font-sans tracking-tight">
            Rp {stock.price.toLocaleString('id-ID')}
          </h2>

          <div className={`inline-flex items-center gap-0.5 font-sans font-bold text-xs pb-1 ${isLoss ? 'text-red-500' : 'text-teal-600'}`}>
            <span>{isLoss ? '▼' : '▲'}</span>
            <span>{isLoss ? '' : '+'}{stock.changeAmount} ({stock.changePercent}%)</span>
          </div>
        </div>

        <button
          id="stock-detail-inline-buy-btn"
          onClick={() => onNavigate('TradeBuy')}
          className="mt-4 w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span>Beli Saham {stock.code}</span>
        </button>
      </div>

      {/* Timeframe selector toolbar */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <div className="flex justify-between items-center mb-5 bg-gray-50 p-1 rounded-2xl border border-gray-100/35">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-xl transition-all focus:outline-none ${
                  activeTimeframe === tf 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Interactive Sparkline graph path representing selected timeframe */}
          <div className="w-full h-36 relative bg-slate-50/20 rounded-2xl overflow-hidden mb-1">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getGradientColor()} stopOpacity="0.14" />
                  <stop offset="100%" stopColor={getGradientColor()} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Fill path constructed identically */}
              <path
                d={`${graphCoords[activeTimeframe]} L 300 100 L 0 100 Z`}
                fill="url(#detailGradient)"
                className="transition-all duration-300"
              />

              {/* Wave line */}
              <path
                d={graphCoords[activeTimeframe]}
                fill="none"
                stroke={getGradientColor()}
                strokeWidth="3.2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Visual endpoint */}
              <circle cx="300" cy="15" r="4" fill={getGradientColor()} />
              <circle cx="300" cy="15" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recommended AI Insights Alert Card */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full" />

          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black text-gray-900 tracking-wider">WAWASAN AI REKOMENDASI</span>
            <span className="text-xs font-bold text-primary flex items-center gap-0.5 bg-primary-light px-2.5 py-0.5 rounded-full">
              Keyakinan {stock.aiConfidence}%
            </span>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100/40 mb-3 text-xs leading-relaxed font-semibold text-gray-800">
            AI Rekomendasi: <span className="text-primary font-black">{stock.aiRecommendation}</span>  
            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
              "{stock.fundamental}"
            </p>
          </div>
        </div>
      </div>

      {/* Financial Health 2x2 Valuation Grid */}
      <div className="px-5 mb-6">
        <span className="text-xs font-bold text-gray-900 tracking-wider block mb-3 uppercase">Kesehatan Keuangan</span>

        <div className="grid grid-cols-2 gap-3.5">
          {/* PE Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">Rasio PE (PER)</span>
            <h4 className="text-base font-extrabold text-gray-950 mt-1">{stock.pe}</h4>
            <span className="text-xs font-bold text-primary mt-1.5 block bg-primary-light/50 px-2 py-0.5 rounded inline-block">
              {stock.peClassification}
            </span>
          </div>

          {/* PBV Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">Rasio PBV</span>
            <h4 className="text-base font-extrabold text-gray-950 mt-1">{stock.pbv}</h4>
            <span className="text-xs font-bold text-teal-700 mt-1.5 block bg-teal-50 px-2 py-0.5 rounded inline-block animate-pulse">
              {stock.pbvClassification}
            </span>
          </div>

          {/* ROE Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">Imbal Hasil Ekuitas (ROE)</span>
            <h4 className="text-base font-extrabold text-gray-950 mt-1">{stock.roe}</h4>
            <span className="text-xs font-bold text-gray-600 mt-1.5 block bg-gray-100 px-2 py-0.5 rounded inline-block">
              {stock.roeClassification}
            </span>
          </div>

          {/* Dividend Yield Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">Imbal Hasil Dividen</span>
            <h4 className="text-base font-extrabold text-gray-950 mt-1">{stock.divYield}</h4>
            <span className="text-xs font-bold text-amber-700 mt-1.5 block bg-amber-50 px-2 py-0.5 rounded inline-block">
              {stock.divYieldClassification}
            </span>
          </div>
        </div>
      </div>

      {/* Bull and Bear Scenarios layout precisely matching design */}
      <div className="px-5 mb-6">
        <span className="text-xs font-bold text-gray-905 tracking-wider block mb-3 uppercase">Skenario Target Harga</span>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <div className="flex flex-col gap-4">
            {/* Bull Scenario */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-teal-600">Optimis (Skenario Naik)</span>
                <span className="text-xs font-black text-teal-700">Rp {stock.bullCase.toLocaleString('id-ID')}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '82%' }} />
              </div>
              <span className="text-xs text-gray-400 mt-1 block font-medium">Berdasarkan pemulihan margin penuh dan pertumbuhan kredit agresif.</span>
            </div>

            {/* Bear Scenario */}
            <div className="border-t border-gray-100 pt-4 bg-transparent">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-red-500">Konservatif (Skenario Turun)</span>
                <span className="text-xs font-black text-red-600">Rp {stock.bearCase.toLocaleString('id-ID')}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
              <span className="text-xs text-gray-400 mt-1 block font-medium">Penurunan pertumbuhan PDB melanda kredit macet perbankan umum.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers List and Technical Indicators Panel */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <span className="text-xs font-extrabold text-gray-900 block mb-3">FAKTOR PENGUAT UTAMA</span>

          <div className="flex flex-col gap-3">
            {stock.drivers ? (
              stock.drivers.map((drv, i) => (
                <div key={i} className="flex gap-2.5 text-xs text-gray-600 leading-relaxed font-semibold">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{drv}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">Driver fundamental tidak tersedia.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
