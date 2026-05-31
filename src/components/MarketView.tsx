/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Star, TrendingUp, Flame } from 'lucide-react';
import { Stock, Screen } from '../types';

interface MarketViewProps {
  stocks: Stock[];
  watchlist: string[];
  onToggleWatchlist: (code: string) => void;
  onNavigate: (screen: Screen) => void;
  onSelectStock: (code: string) => void;
  initialSearchQuery?: string;
}

export default function MarketView({
  stocks,
  watchlist,
  onToggleWatchlist,
  onNavigate,
  onSelectStock,
  initialSearchQuery = '',
}: MarketViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'semua' | 'favorit' | 'perbankan' | 'energi' | 'teknologi'>('semua');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showAllGainers, setShowAllGainers] = useState(false);
  const [showAllLosers, setShowAllLosers] = useState(false);

  const categories: { id: 'semua' | 'favorit' | 'perbankan' | 'energi' | 'teknologi'; label: string }[] = [
    { id: 'semua', label: 'Semua' },
    { id: 'favorit', label: 'Favorit' },
    { id: 'perbankan', label: 'Perbankan' },
    { id: 'energi', label: 'Energi' },
    { id: 'teknologi', label: 'Teknologi' },
  ];

  // Filtering stock items
  const filteredStocks = stocks.filter((stock) => {
    const matchesCategory =
      selectedCategory === 'semua' ||
      (selectedCategory === 'favorit' ? watchlist.includes(stock.code) : stock.category === selectedCategory);
    const matchesSearch =
      stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separate assets into Gainers and Losers for clear fintech segments
  const gainers = [...filteredStocks]
    .filter((s) => s.changePercent >= 0)
    .sort((a, b) => b.changePercent - a.changePercent);

  const losers = [...filteredStocks]
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent);

  // Formatting helper
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="market-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-20 rounded-t-3xl pt-5">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-primary/10 text-primary border border-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Market</h2>
        </div>
      </div>

      {/* Embedded Search text input */}
      <div className="px-5 mb-5">
        <div className="flex items-center bg-white border border-gray-100 rounded-2xl h-10 px-3.5 soft-shadow focus-within:border-primary transition-all">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2" />
          <input
            id="market-search-bar"
            type="text"
            placeholder="Cari emiten saham..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-sans outline-none placeholder-gray-400 text-gray-800"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-gray-400 font-bold ml-1.5 focus:outline-none">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 mb-5 shrink-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`market-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap focus:outline-none ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Indeks Pasar Chart Card matching screenshot */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-gray-900">Indeks Pasar (IHSG)</span>
            <span className="text-xs text-teal-600 font-bold flex items-center gap-0.5 bg-teal-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              +0.82%
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900">7.245,80</h3>

          {/* Smooth custom interactive waving chart path */}
          <div className="w-full h-24 mt-4 relative bg-slate-50/20 rounded-2xl overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0059bb" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0059bb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill path */}
              <path
                d="M 0 85 C 50 82, 80 40, 120 62 C 160 84, 200 20, 240 45 L 300 15 L 300 100 L 0 100 Z"
                fill="url(#chartGradient)"
              />
              {/* Wave line */}
              <path
                d="M 0 85 C 50 82, 80 40, 120 62 C 160 84, 200 20, 240 45 L 300 15"
                fill="none"
                stroke="#0059bb"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Decorative end dot */}
              <circle cx="300" cy="15" r="4.5" fill="#0059bb" />
              <circle cx="300" cy="15" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Gainers section listing stocks */}
      <div className="px-5 mb-5 pt-1">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-550 fill-orange-500 shrink-0" />
            <span>TOP GAINERS</span>
          </span>
          <button 
            onClick={() => setShowAllGainers(!showAllGainers)}
            className="text-xs text-gray-400 font-bold hover:text-primary transition-colors focus:outline-none"
          >
            {showAllGainers ? 'Tutup' : 'Lihat Semua'}
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {gainers.length > 0 ? (
            (showAllGainers ? gainers : gainers.slice(0, 3)).map((stock) => {
              const isAdded = watchlist.includes(stock.code);
              return (
                <div
                  key={stock.code}
                  id={`stock-gainer-${stock.code}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow flex items-center justify-between hover:bg-gray-50/40 transition-all cursor-pointer"
                  onClick={() => {
                    onSelectStock(stock.code);
                    onNavigate('StockDetail');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-primary font-black text-xs flex items-center justify-center">
                      {stock.code.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-gray-950">{stock.code}</h4>
                        <span className="bg-primary/5 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                          AI BUY
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium block max-w-28 truncate">{stock.name}</span>
                    </div>
                  </div>

                  {/* spark line mini gradient */}
                  <div className="w-14 h-6">
                    <svg className="w-full h-full animate-pulse" viewBox="0 0 100 40">
                      <path d="M0,35 L20,30 L40,25 L65,15 L100,5" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-gray-900 block">{formatIDR(stock.price)}</span>
                      <span className="text-xs font-bold text-teal-600 block">+{stock.changePercent}%</span>
                    </div>

                    <button
                      id={`star-${stock.code}`}
                      onClick={() => onToggleWatchlist(stock.code)}
                      className="p-1 text-gray-300 hover:text-accent focus:outline-none"
                    >
                      <Star className={`w-4 h-4 stroke-[2.2] ${isAdded ? 'fill-accent text-accent' : 'text-gray-300'}`} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-medium">
              Tidak ada saham ditemukan dalam kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* Top Losers Section */}
      <div className="px-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1">
            TOP LOSERS
          </span>
          <button 
            onClick={() => setShowAllLosers(!showAllLosers)}
            className="text-xs text-gray-400 font-bold hover:text-primary transition-colors focus:outline-none"
          >
            {showAllLosers ? 'Tutup' : 'Lihat Semua'}
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {losers.length > 0 ? (
            (showAllLosers ? losers : losers.slice(0, 3)).map((stock) => {
              const isAdded = watchlist.includes(stock.code);
              return (
                <div
                  key={stock.code}
                  id={`stock-loser-${stock.code}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow flex items-center justify-between hover:bg-gray-50/40 transition-all cursor-pointer"
                  onClick={() => {
                    onSelectStock(stock.code);
                    onNavigate('StockDetail');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 font-black text-xs flex items-center justify-center">
                      {stock.code.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-gray-950">{stock.code}</h4>
                        <span className="bg-amber-50 text-amber-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                          AI HOLD
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium block max-w-28 truncate">{stock.name}</span>
                    </div>
                  </div>

                  {/* Spark line drop */}
                  <div className="w-14 h-6">
                    <svg className="w-full h-full" viewBox="0 0 100 40">
                      <path d="M0,10 L30,15 L60,25 L80,28 L100,35" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-gray-900 block">{formatIDR(stock.price)}</span>
                      <span className="text-xs font-bold text-red-500 block">{stock.changePercent}%</span>
                    </div>

                    <button
                      id={`star-${stock.code}`}
                      onClick={() => onToggleWatchlist(stock.code)}
                      className="p-1 text-gray-300 hover:text-accent focus:outline-none"
                    >
                      <Star className={`w-4 h-4 stroke-[2.2] ${isAdded ? 'fill-accent text-accent' : 'text-gray-300'}`} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400 font-medium">
              Tidak ada loss emiten pencocokan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
