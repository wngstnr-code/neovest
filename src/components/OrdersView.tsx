/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  History, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter 
} from 'lucide-react';
import { Transaction, Screen, Stock } from '../types';

interface OrdersViewProps {
  orders: Transaction[];
  stocks: Stock[];
  onNavigate: (screen: Screen) => void;
  onSelectStock: (code: string) => void;
}

export default function OrdersView({
  orders,
  stocks,
  onNavigate,
  onSelectStock,
}: OrdersViewProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'ALL' || order.type === activeTab;
    const matchesSearch = order.stockCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="orders-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      
      {/* Top Header with Segmented Switcher */}
      <div className="flex items-center justify-between px-5 mb-4">
        {/* Sleek Segmented Switcher for SBN & Saham, Community, and Order */}
        <div className="flex bg-gray-100/80 p-0.5 rounded-full border border-gray-200/50">
          <button
            onClick={() => onNavigate('Market')}
            className="text-xs font-black px-4 py-1.5 rounded-full text-gray-500 hover:text-gray-900 uppercase tracking-wider transition-all"
          >
            SBN &amp; Saham
          </button>
          <button
            onClick={() => onNavigate('Community')}
            className="text-xs font-black px-4 py-1.5 rounded-full text-gray-500 hover:text-gray-900 uppercase tracking-wider transition-all"
          >
            Community
          </button>
          <button
            onClick={() => onNavigate('Orders')}
            className="text-xs font-black px-4 py-1.5 rounded-full bg-white text-primary shadow-sm uppercase tracking-wider"
          >
            Order
          </button>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => onNavigate('Home')}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm text-gray-600 active:scale-95 transition-all"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="px-5 mb-5 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-gray-100 soft-shadow">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Transaksi</span>
          <span className="text-base font-black text-gray-900 block mt-0.5">{orders.length} Order</span>
          <span className="text-xs text-teal-600 font-semibold block mt-0.5">Semua diproses sukses</span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-gray-100 soft-shadow">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Volume</span>
          <span className="text-base font-black text-primary block mt-0.5">
            {orders.reduce((acc, o) => acc + o.lots, 0)} Lots
          </span>
          <span className="text-xs text-gray-400 font-semibold block mt-0.5">Rata-rata 100 lembar/lot</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-5 mb-4">
        <div className="relative flex items-center bg-white border border-gray-150 rounded-2xl py-2.5 px-4 soft-shadow">
          <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
          <input 
            type="text" 
            placeholder="Cari emiten (e.g. BBCA)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder-gray-400 font-bold"
          />
        </div>
      </div>

      {/* Category Segmented Controls */}
      <div className="px-5 mb-4 flex gap-1.5">
        {(['ALL', 'BUY', 'SELL'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const displayLabel = tab === 'ALL' ? 'Semua' : tab === 'BUY' ? 'Beli' : 'Jual';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
                isActive 
                  ? 'bg-primary text-white font-bold' 
                  : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
              }`}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>

      {/* Orders List Container */}
      <div className="px-5 flex-1">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center text-xs text-gray-400 soft-shadow">
            <History className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-extrabold text-gray-800">Tidak ada riwayat order</p>
            <p className="text-xs text-gray-400 mt-1">Lakukan transaksi pembelian saham pada halaman Pasar.</p>
            <button
              onClick={() => onNavigate('Market')}
              className="mt-4 px-4 py-2 bg-primary text-white text-xs uppercase tracking-wide font-black rounded-xl active:scale-95 transition-all shadow"
            >
              Cari Saham Sekarang
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredOrders.map((order) => {
              const liveStock = stocks.find((s) => s.code === order.stockCode);
              const isBuy = order.type === 'BUY';
              
              return (
                <div
                  key={order.id}
                  onClick={() => {
                    onSelectStock(order.stockCode);
                    onNavigate('StockDetail');
                  }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 soft-shadow flex flex-col gap-3 cursor-pointer hover:scale-[1.01] transition-transform active:scale-[0.99]"
                >
                  {/* Top line of Card */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        isBuy ? 'bg-teal-50 text-teal-650' : 'bg-rose-50 text-rose-650'
                      }`}>
                        {isBuy ? <ArrowDownRight className="w-4 h-4 text-teal-650" /> : <ArrowUpRight className="w-4 h-4 text-rose-650" />}
                      </div>
                      <div>
                        <span className="text-xs font-black text-gray-900">{order.stockCode}</span>
                        <span className={`text-xs font-bold uppercase ml-1 px-1.5 py-0.5 rounded-md ${
                          isBuy ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isBuy ? 'Beli' : 'Jual'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                      <span className="text-xs font-black text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-lg">Match</span>
                    </div>
                  </div>

                  {/* Body values of Card */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-gray-500">
                    <div className="text-left">
                      <span className="text-xs text-gray-400 block mb-0.5 font-bold uppercase tracking-wider">Jumlah</span>
                      <span className="text-gray-900 font-extrabold">{order.lots} Lot</span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5 font-bold uppercase tracking-wider">Harga unit</span>
                      <span className="text-gray-900 font-extrabold">{formatIDR(order.price)}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block mb-0.5 font-bold uppercase tracking-wider">Total Dana</span>
                      <span className="text-primary font-black">{formatIDR(order.totalPayment)}</span>
                    </div>
                  </div>

                  {/* Footer metadata of Card */}
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-t border-gray-50 pt-2">
                    <span>ID: {order.id}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
