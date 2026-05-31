/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import { Stock, PortfolioItem, Screen, UserProfile } from '../types';

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

  // Let's model performance index coordinates depending on tab selected
  const chartCoordinates: Record<'1W' | '1M' | '3M' | '1Y', { label: string; point: number }[]> = {
    '1W': [
      { label: 'Sen', point: 80 },
      { label: 'Sel', point: 75 },
      { label: 'Rab', point: 82 },
      { label: 'Kam', point: 88 },
      { label: 'Jum', point: 92 },
    ],
    '1M': [
      { label: 'Week 1', point: 75 },
      { label: 'Week 2', point: 60 },
      { label: 'Week 3', point: 40 },
      { label: 'Week 4', point: 15 }, // Ends highest to match the upward graph in design!
    ],
    '3M': [
      { label: 'Mar', point: 80 },
      { label: 'Apr', point: 70 },
      { label: 'Mei', point: 25 },
    ],
    '1Y': [
      { label: 'Q1', point: 90 },
      { label: 'Q2', point: 75 },
      { label: 'Q3', point: 55 },
      { label: 'Q4', point: 15 },
    ],
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
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V12C3 17.5 7.2 21.4 12 22C16.8 21.4 21 17.5 21 12V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M9 13.5L11.5 11L14.5 14L19 8.5" stroke="#fecb00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-extrabold text-[#001a41] text-base font-sans">NeoVest</span>
        </div>

        <button
          onClick={() => onNavigate('Profile')}
          className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-600 focus:outline-none"
        >
          <Settings className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Net Portfolio Summary Box matching design screen */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 soft-shadow">
          <span className="text-[10px] text-gray-400 font-extrabold tracking-wide block">Total Nilai</span>
          <h2 className="text-2xl font-black text-gray-900 mt-0.5">{formatIDR(totalAssets)}</h2>

          <div className="inline-flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-xl text-teal-600 mt-3 select-none font-sans font-bold">
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-[10px] text-teal-700 font-extrabold">
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

            {/* Scale Tab Buttons: 1W, 1M, 3M, 1Y */}
            <div className="flex gap-1.5 bg-gray-50 border border-gray-100/50 p-1 rounded-xl">
              {(['1W', '1M', '3M', '1Y'] as const).map((tab) => {
                const isActive = performanceTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setPerformanceTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
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
              <path
                d={`M 15 105 C 80 90, 150 55, 210 50 L 285 18 L 285 120 L 15 120 Z`}
                fill="url(#curveGradient)"
              />
              <path
                d={`M 15 105 C 80 90, 150 55, 210 50 L 285 18`}
                fill="none"
                stroke="#0059bb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Markers */}
              <circle cx="15" cy="105" r="4.5" fill="#0059bb" />
              <circle cx="110" cy="74" r="4.5" fill="#0059bb" />
              <circle cx="210" cy="50" r="4.5" fill="#0059bb" />
              <circle cx="285" cy="18" r="4.5" fill="#0059bb" />
              <circle cx="285" cy="18" r="1.5" fill="#ffffff" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between items-center text-[9px] text-gray-400 font-semibold px-2 mt-2">
              {activeSeries.map((s, index) => (
                <span key={index}>{s.label}</span>
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
            {/* Custom SVG Donut Dial */}
            <div className="w-28 h-28 relative shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background track circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {/* Banking (45%): Blue */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#0059bb"
                  strokeWidth="3"
                  strokeDasharray="45 100"
                  strokeDashoffset="0"
                />
                {/* Tech (25%): Cyan */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                  strokeDasharray="25 100"
                  strokeDashoffset="-45"
                />
                {/* Consumer (20%): Gold Yellow */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#fecb00"
                  strokeWidth="3"
                  strokeDasharray="20 100"
                  strokeDashoffset="-70"
                />
                {/* Others (10%): Gray */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  strokeDasharray="10 100"
                  strokeDashoffset="-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[14px] font-black text-gray-900 leading-none">4</span>
                <span className="text-[8px] text-gray-400 font-bold block mt-0.5">Sektor</span>
              </div>
            </div>

            {/* List entries */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0059bb]" />
                  <span className="font-semibold text-gray-500">Banking</span>
                </div>
                <span className="font-extrabold text-gray-900">45%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />
                  <span className="font-semibold text-gray-500">Tech</span>
                </div>
                <span className="font-extrabold text-gray-900">25%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fecb00]" />
                  <span className="font-semibold text-gray-500">Consumer</span>
                </div>
                <span className="font-extrabold text-gray-900">20%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
                  <span className="font-semibold text-gray-500">Others</span>
                </div>
                <span className="font-extrabold text-gray-900">10%</span>
              </div>
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
                    <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{item.lots} Lots · Avg {formatIDR(item.avgPrice)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 block">{formatIDR(livePrice)}</span>
                  <span className={`text-[10px] font-bold ${isGain ? 'text-teal-600' : 'text-red-500'}`}>
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
            <span>Risk Analyzer</span>
          </div>

          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-amber-800 font-extrabold">Profil Risiko Anda</span>
              <span className="bg-accent text-dark-blue font-bold px-2.5 py-0.5 rounded-lg text-[9px] uppercase">
                {userProfile.riskProfile}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
              Konsentrasi portofolio Anda cukup tinggi di sektor Perbankan ({portfolio[0] ? 'BBCA' : '45%'}). Pertimbangkan untuk mulai mendiversifikasi ke instrumen reksadana pasar uang atau obligasi untuk melestarikan stabilitas.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigate('RiskProfileResult');
            }}
            className="w-full h-11 bg-primary/5 text-primary hover:bg-primary/10 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all"
          >
            Lihat Rekomendasi Alokasi Aset
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
