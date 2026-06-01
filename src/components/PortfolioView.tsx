/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Shield, ChevronRight, X, Eye, EyeOff } from 'lucide-react';
import { Stock, PortfolioItem, Screen, UserProfile } from '../types';
import NeoVestLogo from './NeoVestLogo';

interface PortfolioViewProps {
  userProfile: UserProfile;
  portfolio: PortfolioItem[];
  stocks: Stock[];
  onNavigate: (screen: Screen) => void;
  onSelectStock: (code: string) => void;
}

export default function PortfolioView({
  userProfile,
  portfolio,
  stocks,
  onNavigate,
  onSelectStock,
}: PortfolioViewProps) {
  const [performanceTab, setPerformanceTab] = useState<'1W' | '1M' | '3M' | '1Y'>('1M');
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  // Let's compute actual dynamic investments sum
  const calculateTotalInvestment = () => {
    return portfolio.reduce((acc, item) => acc + (item.lots * 100 * item.avgPrice), 0);
  };

  const calculateTotalCurrent = () => {
    return portfolio.reduce((acc, item) => {
      const liveStock = stocks.find((s) => s.code === item.stockCode);
      const price = liveStock ? liveStock.price : item.currentPrice;
      return acc + (item.lots * 100 * price);
    }, 0);
  };

  const totalCurrentValue = calculateTotalCurrent();
  const totalInvestment = calculateTotalInvestment();
  const netProfitLoss = totalCurrentValue - totalInvestment;
  const netProfitPercent = totalInvestment > 0 ? (netProfitLoss / totalInvestment) * 100 : 5.24;

  const totalAssets = userProfile.balance + totalCurrentValue;
  const categoryLabels: Record<Stock['category'], string> = {
    perbankan: 'Perbankan',
    energi: 'Energi',
    teknologi: 'Teknologi',
  };
  const categoryColors: Record<Stock['category'], string> = {
    perbankan: '#0059bb',
    energi: '#fecb00',
    teknologi: '#0ea5e9',
  };
  const allocation = portfolio.reduce<Record<Stock['category'], number>>((acc, item) => {
    const stock = stocks.find((s) => s.code === item.stockCode);
    const category = stock?.category || 'perbankan';
    const livePrice = stock ? stock.price : item.currentPrice;
    acc[category] = (acc[category] || 0) + item.lots * 100 * livePrice;
    return acc;
  }, { perbankan: 0, energi: 0, teknologi: 0 });
  const allocationRows = (Object.entries(allocation) as [Stock['category'], number][])
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      category,
      label: categoryLabels[category],
      color: categoryColors[category],
      percent: totalCurrentValue > 0 ? Math.round((value / totalCurrentValue) * 100) : 0,
    }));
  const primaryConcentration = allocationRows[0]?.percent || 0;

  const chartCoordinates: Record<'1W' | '1M' | '3M' | '1Y', { labels: string[]; area: string; line: string; markers: { x: number; y: number }[]; change: string; positive: boolean }> = {
    '1W': {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'],
      line: 'M 15 70 C 60 42, 95 92, 140 58 C 185 28, 230 52, 285 34',
      area: 'M 15 70 C 60 42, 95 92, 140 58 C 185 28, 230 52, 285 34 L 285 120 L 15 120 Z',
      markers: [{ x: 15, y: 70 }, { x: 140, y: 58 }, { x: 285, y: 34 }],
      change: '+1.8%',
      positive: true,
    },
    '1M': {
      labels: ['W1', 'W2', 'W3', 'W4'],
      line: 'M 15 96 C 80 84, 120 52, 170 64 C 210 72, 238 34, 285 18',
      area: 'M 15 96 C 80 84, 120 52, 170 64 C 210 72, 238 34, 285 18 L 285 120 L 15 120 Z',
      markers: [{ x: 15, y: 96 }, { x: 170, y: 64 }, { x: 285, y: 18 }],
      change: '+5.2%',
      positive: true,
    },
    '3M': {
      labels: ['Mar', 'Apr', 'Mei'],
      line: 'M 15 46 C 70 28, 108 34, 150 72 C 190 104, 240 92, 285 82',
      area: 'M 15 46 C 70 28, 108 34, 150 72 C 190 104, 240 92, 285 82 L 285 120 L 15 120 Z',
      markers: [{ x: 15, y: 46 }, { x: 150, y: 72 }, { x: 285, y: 82 }],
      change: '-2.4%',
      positive: false,
    },
    '1Y': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      line: 'M 15 100 C 70 94, 105 72, 150 76 C 198 80, 225 42, 285 24',
      area: 'M 15 100 C 70 94, 105 72, 150 76 C 198 80, 225 42, 285 24 L 285 120 L 15 120 Z',
      markers: [{ x: 15, y: 100 }, { x: 150, y: 76 }, { x: 285, y: 24 }],
      change: '+11.6%',
      positive: true,
    },
  };

  // Convert points to SVG height offsets
  const activeSeries = chartCoordinates[performanceTab];

  // Helper formatting values
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="portfolio-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Portofolio</h2>
        </div>
        <NeoVestLogo />
      </div>

      {/* Net Portfolio Summary Box matching design screen */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-primary via-primary to-[#0070ea] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute left-1/3 -top-12 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
          <span className="text-xs text-white/80 font-medium tracking-wide block relative">Total Nilai</span>
          <div className="flex items-center gap-3 mt-1 relative z-10">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {showBalance ? formatIDR(totalAssets) : 'Rp •••••••'}
            </h2>
            <button
              type="button"
              onClick={() => setShowBalance((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:text-white transition-colors focus:outline-none"
              aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl text-teal-200 mt-4 select-none backdrop-blur-sm relative">
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs text-white font-bold tracking-wide">
              {netProfitLoss >= 0 ? '+' : ''}{formatIDR(netProfitLoss)} hari ini
            </span>
          </div>
        </div>
      </div>

      {/* Performa Line Graph Card */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-900">Performa</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeSeries.positive ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-500'}`}>
              {activeSeries.change}
            </span>

            {/* Scale Tab Buttons: 1W, 1M, 3M, 1Y */}
            <div className="flex gap-1.5 bg-gray-50 border border-gray-100/50 p-1 rounded-xl">
              {(['1W', '1M', '3M', '1Y'] as const).map((tab) => {
                const isActive = performanceTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setPerformanceTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      isActive ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Responsive Graph mapping coordinates */}
          <div className="w-full h-40 mt-4 relative bg-gray-50/20 rounded-2xl">
            {/* Horizontal guidelines */}
            <div className="absolute top-[20%] left-0 right-0 h-px border-t border-dashed border-gray-100" />
            <div className="absolute top-[40%] left-0 right-0 h-px border-t border-dashed border-gray-100" />
            <div className="absolute top-[60%] left-0 right-0 h-px border-t border-dashed border-gray-100" />
            <div className="absolute top-[80%] left-0 right-0 h-px border-t border-dashed border-gray-100" />

            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              {/* Plot dynamic line */}
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0059bb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0059bb" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Generate point nodes */}
              {/* Standard upward curved line corresponding to 1M, etc */}
              <path d={activeSeries.area} fill="url(#curveGradient)" />
              <path
                d={activeSeries.line}
                fill="none"
                stroke={activeSeries.positive ? '#0059bb' : '#ef4444'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Markers */}
              {activeSeries.markers.map((marker, index) => (
                <circle key={index} cx={marker.x} cy={marker.y} r="4.5" fill={activeSeries.positive ? '#0059bb' : '#ef4444'} />
              ))}
              <circle cx={activeSeries.markers[activeSeries.markers.length - 1].x} cy={activeSeries.markers[activeSeries.markers.length - 1].y} r="1.5" fill="#ffffff" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold px-2 mt-2">
              {activeSeries.labels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alokasi Aset Donut Widget matching screen */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
          <span className="text-xs font-bold text-gray-900 block mb-1">Alokasi Aset</span>

          <div className="flex items-center gap-6 mt-4">
            <div className="w-28 h-28 relative shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {allocationRows.map((row, index) => {
                  const offset = -allocationRows.slice(0, index).reduce((sum, item) => sum + item.percent, 0);
                  return (
                    <circle
                      key={row.category}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={row.color}
                      strokeWidth="3"
                      strokeDasharray={`${row.percent} ${100 - row.percent}`}
                      strokeDashoffset={offset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-gray-900 leading-none">{allocationRows.length}</span>
                <span className="text-xs text-gray-400 font-bold block mt-0.5">Sektor</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              {allocationRows.map((row) => (
                <div key={row.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-semibold text-gray-500">{row.label}</span>
                  </div>
                  <span className="font-extrabold text-gray-900">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ownership items layout */}
      <div className="px-5 mb-6">
        <span className="text-xs font-bold text-gray-900 tracking-wider block mb-3 uppercase">Daftar Kepemilikan</span>

        <div className="flex flex-col gap-3">
          {portfolio.map((item) => {
            const stock = stocks.find((s) => s.code === item.stockCode);
            const livePrice = stock ? stock.price : item.currentPrice;
            const diffPrice = livePrice - item.avgPrice;
            const diffPercent = (diffPrice / item.avgPrice) * 100;
            const isGain = diffPrice >= 0;

            return (
              <div
                key={item.stockCode}
                onClick={() => {
                  onSelectStock(item.stockCode);
                  onNavigate('StockDetail');
                }}
                className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {item.stockCode.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#001a41]">{item.stockCode}</h4>
                    <span className="text-xs text-gray-400 font-medium block mt-0.5">{(item.lots * 100).toLocaleString('id-ID')} Lembar · Rata-rata {formatIDR(item.avgPrice)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 block">{formatIDR(livePrice)}</span>
                  <span className={`text-xs font-bold ${isGain ? 'text-teal-600' : 'text-red-500'}`}>
                    {isGain ? '▲' : '▼'} {isGain ? '+' : ''}{diffPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portfolio Risk Analyzer with smart warning display */}
      <div className="px-5">
        <div className="bg-white border border-gray-100 rounded-3xl p-5 soft-shadow">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3">
            <Shield className="w-4.5 h-4.5 text-accent stroke-[2.5]" />
            <span>Analisis Risiko</span>
          </div>

          <div className="risk-profile-panel rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="risk-profile-title text-xs font-extrabold">Profil Risiko Anda</span>
              <span className="bg-accent text-dark-blue font-bold px-2.5 py-0.5 rounded-lg text-xs uppercase">
                {userProfile.riskProfile}
              </span>
            </div>
            <p className="risk-profile-copy text-xs font-medium leading-relaxed mt-1">
              Konsentrasi portofolio terbesar saat ini ada di sektor {allocationRows[0]?.label || 'Perbankan'} ({primaryConcentration}%). Pertimbangkan diversifikasi agar risiko tidak bertumpu pada satu sektor.
            </p>
          </div>

          <button
            onClick={() => setShowAllocationModal(true)}
            className="w-full h-11 bg-primary/5 text-primary hover:bg-primary/10 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all"
          >
            Lihat Rekomendasi Alokasi Aset
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAllocationModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-blue/70 p-5 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-950">Rekomendasi Alokasi</h3>
                <p className="mt-0.5 text-xs font-medium text-gray-400">Saran berbasis profil {userProfile.riskProfile}</p>
              </div>
              <button
                onClick={() => setShowAllocationModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                aria-label="Tutup rekomendasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 rounded-2xl bg-primary/5 p-4 text-xs font-semibold leading-relaxed text-gray-700">
              AI menyarankan mengurangi konsentrasi sektor terbesar secara bertahap dan menambah aset defensif agar volatilitas portofolio lebih stabil.
            </div>

            <div className="flex flex-col gap-3">
              {[
                'Batasi sektor terbesar maksimal 50% dari nilai saham.',
                'Tambahkan eksposur energi atau teknologi bila valuasi masih sehat.',
                'Sisihkan 10-15% saldo ke instrumen defensif seperti pasar uang atau obligasi.',
              ].map((item) => (
                <div key={item} className="flex gap-2.5 text-xs font-semibold leading-relaxed text-gray-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllocationModal(false)}
              className="mt-5 h-11 w-full rounded-2xl bg-primary text-xs font-bold text-white"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
