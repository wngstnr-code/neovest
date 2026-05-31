/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, History, CreditCard, Users, User, BookOpen, ChevronRight, TrendingUp, TrendingDown, X, Check, Sparkles } from 'lucide-react';
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
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

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
  const notifications = [
    {
      id: 'portfolio-up',
      title: 'Portofolio naik',
      message: 'Nilai aset Anda bertambah Rp 320.000 hari ini.',
      time: 'Baru saja',
      tone: 'bg-teal-50 text-teal-700',
      dot: 'bg-teal-500',
    },
    {
      id: 'order-match',
      title: 'Order BBCA berhasil',
      message: 'Pembelian 10 lot BBCA sudah match di harga Rp 10.250.',
      time: '14:30',
      tone: 'bg-blue-50 text-primary',
      dot: 'bg-primary',
    },
    {
      id: 'insight-ready',
      title: 'Insight AI tersedia',
      message: 'Rekomendasi saham harian sudah diperbarui.',
      time: '09:00',
      tone: 'bg-amber-50 text-amber-700',
      dot: 'bg-accent',
    },
  ];
  const unreadNotifications = notifications.filter(
    (notification) => !readNotificationIds.includes(notification.id)
  );

  return (
    <div id="home-dashboard" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-20 rounded-t-3xl pt-5">
      {/* Mock notification panel */}
      {showNotificationToast && (
        <div className="absolute top-16 left-4 right-4 z-50 rounded-3xl bg-white p-4 shadow-xl border border-gray-100">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-950">Notifikasi</h3>
                <p className="text-xs font-medium text-gray-400">Update terbaru akun Anda</p>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700 active:scale-95"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {unreadNotifications.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-bold text-gray-700">Semua notifikasi sudah dibaca</p>
                <p className="mt-0.5 text-xs font-medium text-gray-400">Update baru akan muncul di sini.</p>
              </div>
            ) : (
              unreadNotifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 rounded-2xl bg-gray-50/70 p-3">
                <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black text-gray-900">{notification.title}</h4>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-400">{notification.time}</span>
                      <button
                        onClick={() => setReadNotificationIds((prev) => [...prev, notification.id])}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-400 border border-gray-100 hover:text-primary active:scale-95 transition-all"
                        aria-label="Tandai sudah dibaca"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-gray-500">
                    {notification.message}
                  </p>
                  <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${notification.tone}`}>
                    Belum dibaca
                  </span>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between px-5 mb-5 mt-1">
        <div className="flex items-center gap-2.5">
          {/* Circular avatar with brand outline */}
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center font-bold text-sm text-primary overflow-hidden">
            <User className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500 font-medium">Halo, </span>
              <span className="text-sm font-bold text-gray-900">{userProfile.fullName.split(' ')[0]}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium block leading-none mt-0.5">Masa Depan Berkelas Anda</span>
          </div>
        </div>

        <button
          onClick={() => setShowNotificationToast((prev) => !prev)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 soft-shadow text-gray-600 focus:outline-none relative"
        >
          <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
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
            <span className="absolute top-4 right-4 bg-accent text-dark-blue text-xs font-bold px-2 py-0.5 rounded-full">
              PREMIUM
            </span>
          )}

          <span className="text-xs text-white/80 font-medium tracking-wide">Total Aset</span>
          <h2 id="home-total-assets" className="text-2xl font-bold tracking-tight text-white mt-1 select-all font-sans">
            {formatIDR(totalAssets)}
          </h2>

          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl text-teal-200 mt-4 select-none backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-bold text-white tracking-wide">
              {portfolioValue > 0 ? '+Rp 320.000 hari ini (+3.24%)' : '+Rp 0 hari ini (0.00%)'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Menu Grid (History, Subscription (labeled NeoVest Premium), Community, Learn) */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 bg-white rounded-3xl p-4 soft-shadow border border-gray-100">
          {/* Transaction History */}
          <button
            onClick={() => onNavigate('History')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-blue-50 text-primary rounded-2xl flex items-center justify-center soft-shadow">
              <History className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-gray-750">Riwayat</span>
          </button>

          {/* Premium Subscription */}
          <button
            onClick={() => onNavigate('PremiumUpgrade')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-amber-50 text-accent-dark rounded-2xl flex items-center justify-center soft-shadow relative">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
              {!userProfile.isPremium && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </div>
            <span className="text-xs font-bold text-gray-750">Premium</span>
          </button>

          {/* Community */}
          <button
            onClick={() => onNavigate('Community')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center soft-shadow">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-gray-750">Community</span>
          </button>

          {/* Learn */}
          <button
            onClick={() => onNavigate('Learn')}
            className="flex flex-col items-center justify-center gap-2 focus:outline-none focus:scale-95"
          >
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center soft-shadow">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-gray-750">Learn</span>
          </button>
        </div>
      </div>

      {/* Featured AI Insight: BBCA Card precisely matching design */}
      <div className="px-5 mb-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-gray-900 tracking-tight">Rekomendasi AI Hari Ini</span>
            <p className="mt-0.5 text-xs font-medium text-gray-400 leading-normal">
              Analisis berbasis data, bukan ajakan transaksi mutlak.
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary" aria-label="Rekomendasi AI">
            <Sparkles className="h-4 w-4 stroke-[2.4]" />
          </span>
        </div>
        <div className="relative bg-white rounded-3xl border border-gray-100 p-5 soft-shadow overflow-hidden">
          {/* Subtle colored accent shape in background */}
          <div className="absolute -left-12 -bottom-10 w-24 h-24 bg-teal-500/5 rounded-full blur-lg" />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-primary tracking-tight">{highlightedStock.code}</h3>
              <p className="text-xs text-gray-400 font-medium">{highlightedStock.name}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-xs font-semibold bg-primary-light text-primary px-2.5 py-1 rounded-lg">
                Confidence {highlightedStock.aiConfidence}%
              </span>
              <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg">
                Risiko {highlightedStock.riskLevel}
              </span>
            </div>
          </div>

          {/* Text Summary */}
          <p className="text-xs text-gray-500 leading-relaxed font-medium mb-0 bg-gray-50/50 px-2.5 py-2 rounded-xl border border-gray-50">
            "{highlightedStock.fundamental}"
          </p>

          <button
            id="home-learn-analisis-btn"
            onClick={() => {
              onSelectStock('BBCA');
              onNavigate('StockDetail');
            }}
            className="w-full h-10 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1 transition-all"
          >
            Lihat Detail Analisis
          </button>
        </div>
      </div>

      {/* Indeks Pasar Scrolling items */}
      <div className="mb-6">
        <div className="flex justify-between items-center px-5 mb-3">
          <span className="text-xs font-bold text-gray-905 tracking-tight uppercase">Indeks Pasar</span>
        </div>
        
        {/* Horizontal scroll view */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
          {/* Card 1: IHSG */}
          <div className="min-w-32 bg-white rounded-2xl p-3.5 border border-gray-100 flex-1 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">IHSG</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1">7.245,12</h4>
            <div className="flex items-center gap-0.5 text-teal-600 font-bold text-xs mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.45%</span>
            </div>
          </div>

          {/* Card 2: LQ45 */}
          <div className="min-w-32 bg-white rounded-2xl p-3.5 border border-gray-100 flex-1 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">LQ45</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1">982,40</h4>
            <div className="flex items-center gap-0.5 text-teal-600 font-bold text-xs mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.62%</span>
            </div>
          </div>

          {/* Card 3: IDX30 */}
          <div className="min-w-32 bg-white rounded-2xl p-3.5 border border-gray-100 flex-1 soft-shadow">
            <span className="text-xs text-gray-400 font-bold block">IDX30</span>
            <h4 className="text-xs font-bold text-gray-900 mt-1">495,10</h4>
            <div className="flex items-center gap-0.5 text-red-500 font-bold text-xs mt-2">
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
            className="text-xs font-bold text-primary hover:underline"
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
                    <span className="text-xs text-gray-400 font-medium block max-w-28 truncate">{stock.name}</span>
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
                  <span className={`text-xs font-bold ${isLoss ? 'text-red-500' : 'text-teal-600'}`}>
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
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-905 tracking-tight uppercase">Belajar</span>
        </div>
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
            <span className="text-xs text-gray-400 font-medium block mt-1.5">Modul 2: Analisis Fundamental</span>
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
