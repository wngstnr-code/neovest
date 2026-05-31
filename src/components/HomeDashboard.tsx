/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, Bookmark, CreditCard, Users, BookOpen, ChevronRight, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { Stock, LearnModule, UserProfile, PortfolioItem } from '../types';

interface HomeDashboardProps {
  userProfile: UserProfile;
  portfolio: PortfolioItem[];
  stocks: Stock[];
  onNavigate: (screen: any) => void;
  onSelectStock: (code: string) => void;
  onSearchChange: (query: string) => void;
}

export default function HomeDashboard({
  userProfile,
  portfolio,
  stocks,
  onNavigate,
  onSelectStock,
  onSearchChange,
}: HomeDashboardProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Dynamic calculations
  const calculatePortfolioValue = () => {
    return portfolio.reduce((acc, item) => {
      const stock = stocks.find((s) => s.code === item.stockCode);
      const price = stock ? stock.price : item.currentPrice;
      // 1 lot = 100 shares
      return acc + (item.lots * 100 * price);
    }, 0);
  };

  const portfolioValue = calculatePortfolioValue();
  const totalAssets = userProfile.balance + portfolioValue;

  // Formatting helper
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleSearchKeyPress = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
    onNavigate('Market');
  };

  const highlightedStock = stocks.find((s) => s.code === 'BBCA') || stocks[0];

  return (
    <div id="home-dashboard" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-20 rounded-t-3xl pt-5">
      {/* Search active notification toast */}
      {showNotificationToast && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-primary text-white p-3 rounded-2xl flex items-center justify-between shadow-lg text-xs">
          <span className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 shrink-0" />
            <span>Tidak ada notifikasi baru hari ini. Portofolio Anda aman!</span>
          </span>
          <button onClick={() => setShowNotificationToast(false)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between px-5 mb-5 mt-1">
        <div className="flex items-center gap-2.5">
          {/* Circular avatar with brand outline */}
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center font-bold text-sm text-primary overflow-hidden">
            {userProfile.fullName ? userProfile.fullName.substring(0, 2).toUpperCase() : 'TA'}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-gray-500 font-medium">Halo, </span>
              <span className="text-[14px] font-bold text-gray-900">{userProfile.fullName.split(' ')[0]}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium block leading-none mt-0.5">Masa Depan Berkelas Anda</span>
          </div>
        </div>

        <button
          onClick={() => setShowNotificationToast(true)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 soft-shadow text-gray-600 focus:outline-none relative"
        >
          <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
      </div>

      {/* Cari Saham Search Action */}
      <form onSubmit={handleSearchKeyPress} className="px-5 mb-5">
        <div className="flex items-center bg-white border border-gray-100 rounded-full h-11 px-4 soft-shadow focus-within:border-primary transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2.5" />
          <input
            id="home-search-input"
            type="text"
            placeholder="Cari saham, reksadana, artikel..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full text-xs font-sans text-gray-850 outline-none placeholder-gray-400 font-medium"
          />
        </div>
      </form>

      {/* Total Aset Card with gradient inspired by the screen */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-primary via-primary to-[#0070ea] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          {/* Visual abstract overlay waves */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute left-1/3 -top-12 w-32 h-32 bg-accent/10 rounded-full blur-xl" />

          {/* Premium banner badge indicator if applicable */}
          {userProfile.isPremium && (
            <span className="absolute top-4 right-4 bg-accent text-dark-blue text-[9px] font-bold px-2 py-0.5 rounded-full">
              PREMIUM
            </span>
          )}

          <span className="text-[11px] text-white/80 font-medium tracking-wide">Total Aset</span>
          <h2 id="home-total-assets" className="text-2xl font-bold tracking-tight text-white mt-1 select-all font-sans">
            {formatIDR(totalAssets)}
          </h2>

          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl text-teal-200 mt-4 select-none backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-[10px] font-bold text-white tracking-wide">
              {portfolioValue > 0 ? '+Rp 320.000 hari ini (+3.24%)' : '+Rp 0 hari ini (0.00%)'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Menu Grid (Watchlist, Subscription (labeled NeoVest Premium), Community, Learn) */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 bg-white rounded-3xl p-4 soft-shadow border border-gray-100">
          {/* Watchlist */}
          <button
            onClick={() => onNavigate('Watchlist')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-blue-50 text-primary rounded-2xl flex items-center justify-center soft-shadow">
              <Bookmark className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold text-gray-750">Watchlist</span>
          </button>

          {/* Premium Subscription */}
          <button
            onClick={() => onNavigate('PremiumUpgrade')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-amber-50 text-accent-dark rounded-2xl flex items-center justify-center soft-shadow relative animate-pulse">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-gray-750">Premium</span>
          </button>

          {/* Community */}
          <button
            onClick={() => onNavigate('Community')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center soft-shadow">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold text-gray-750">Community</span>
          </button>

          {/* Learn */}
          <button
            onClick={() => onNavigate('Learn')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center soft-shadow">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold text-gray-750">Learn</span>
          </button>
        </div>
      </div>

      {/* Featured AI Insight: BBCA Card precisely matching design */}
      <div className="px-5 mb-6">
        <div className="relative bg-white rounded-3xl border border-gray-100 p-5 soft-shadow overflow-hidden">
          {/* Subtle colored accent shapes in background */}
          <div className="absolute right-0 top-0 w-28 h-28 bg-primary/5 rounded-full" />
          <div className="absolute -left-12 -bottom-10 w-24 h-24 bg-teal-500/5 rounded-full blur-lg" />

          {/* Header */}
          <div className="flex justify-between items-start mb-3.5 relative">
            <div>
              <h3 className="text-xl font-extrabold text-primary tracking-tight">{highlightedStock.code}</h3>
              <p className="text-[11px] text-gray-400 font-medium">{highlightedStock.name}</p>
            </div>
            <button
              id="home-buy-bbca-btn"
              onClick={() => {
                onSelectStock('BBCA');
                onNavigate('TradeBuy');
              }}
              className="bg-accent hover:bg-accent-dark text-dark-blue text-xs font-bold px-4 py-1.5 rounded-full soft-shadow flex items-center gap-1 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Buy
            </button>
          </div>

          {/* Badges */}
          <div className="flex gap-1.5 mb-4 relative">
            <span className="text-[10px] font-semibold bg-primary-light text-primary px-2.5 py-1 rounded-lg">
              Confidence {highlightedStock.aiConfidence}%
            </span>
            <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg">
              Risiko {highlightedStock.riskLevel}
            </span>
          </div>

          {/* Text Summary */}
          <p className="text-xs text-gray-500 leading-relaxed font-medium mb-5 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
            "{highlightedStock.fundamental}"
          </p>

          <button
            id="home-learn-analisis-btn"
            onClick={() => {
              onSelectStock('BBCA');
              onNavigate('StockDetail');
            }}
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1 transition-all"
          >
            Lihat Detail Analisis
          </button>
        </div>
      </div>

      {/* Indeks Pasar Scrolling items */}
      <div className="mb-6">
        <div className="flex justify-between items-center px-5 mb-3">
          <span className="text-xs font-bold text-gray-905 tracking-tight uppercase">Indeks Pasar</span>
          <span className="text-[10px] font-bold text-gray-400 select-none">Swipe &gt;</span>
        </div>
        
        {/* Horizontal scroll view */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
          {/* Card 1: IHSG */}
          <div className="min-w-32 bg-white rounded-2xl p-3.5 border border-gray-100 flex-1 soft-shadow">
            <span className="text-[10px] text-gray-400 font-bold block">IHSG</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1">7.245,12</h4>
            <div className="flex items-center gap-0.5 text-teal-600 font-bold text-[9px] mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.45%</span>
            </div>
          </div>

          {/* Card 2: LQ45 */}
          <div className="min-w-32 bg-white rounded-2xl p-3.5 border border-gray-100 flex-1 soft-shadow">
            <span className="text-[10px] text-gray-400 font-bold block">LQ45</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1">982,40</h4>
            <div className="flex items-center gap-0.5 text-teal-600 font-bold text-[9px] mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.62%</span>
            </div>
          </div>

          {/* Card 3: IDX30 */}
          <div className="min-w-32 bg-white rounded-2xl p-3.5 border border-gray-100 flex-1 soft-shadow">
            <span className="text-[10px] text-gray-400 font-bold block">IDX30</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1">495,10</h4>
            <div className="flex items-center gap-0.5 text-red-500 font-bold text-[9px] mt-2">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-0.12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Watchlist Watch Section */}
      <div className="px-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-905 tracking-tight uppercase">Saham Populer</span>
          <button
            id="home-view-all-stocks"
            onClick={() => onNavigate('Market')}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            Lihat Semua
          </button>
        </div>

        {/* List mapping */}
        <div className="flex flex-col gap-2.5">
          {stocks.slice(1, 4).map((stock) => {
            const isLoss = stock.changePercent < 0;
            return (
              <div
                key={stock.code}
                onClick={() => {
                  onSelectStock(stock.code);
                  onNavigate('StockDetail');
                }}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 soft-shadow flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-primary/5 text-primary text-xs font-bold flex items-center justify-center">
                    {stock.code.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900">{stock.code}</h4>
                    <span className="text-[10px] text-gray-400 font-medium block max-w-28 truncate">{stock.name}</span>
                  </div>
                </div>

                {/* Simulated minimal sparkline svg */}
                <div className="w-16 h-7">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <path
                      d={isLoss 
                        ? "M0,10 L20,15 L40,8 L60,25 L80,30 L100,35" 
                        : "M0,35 L20,32 L40,25 L60,28 L80,10 L100,5"}
                      fill="none"
                      stroke={isLoss ? "#ef4444" : "#10b981"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 block">Rp {stock.price.toLocaleString('id-ID')}</span>
                  <span className={`text-[10px] font-bold ${isLoss ? 'text-red-500' : 'text-teal-600'}`}>
                    {isLoss ? '' : '+'}{stock.changePercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Static progress banner */}
      <div className="px-5">
        <div
          onClick={() => onNavigate('Learn')}
          className="bg-white rounded-3xl border border-gray-100 p-4 soft-shadow flex items-center gap-3.5 cursor-pointer hover:bg-gray-50/50 transition-all"
        >
          {/* Blue Book Icon Container */}
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary shrink-0">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-gray-900 leading-tight">Dasar Investasi Saham</h4>
            <span className="text-[10px] text-gray-400 font-medium block mt-1.5">Modul 2: Analisis Fundamental</span>
            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '35%' }} />
            </div>
          </div>

          <div className="text-right flex flex-col items-end shrink-0">
            <span className="text-xs font-bold text-primary">35%</span>
            <ChevronRight className="w-4 h-4 text-gray-300 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
