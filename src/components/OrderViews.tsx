/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, CheckCircle, AlertTriangle, Building2, Info, Minus, Plus, Sparkles, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Stock, Screen, UserProfile } from '../types';

interface OrderViewsProps {
  currentScreen: Screen;
  stock: Stock;
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onExecuteTrade: (sharesNum: number, pricePerUnit: number) => void;
}

export default function OrderViews({
  currentScreen,
  stock,
  userProfile,
  onNavigate,
  onExecuteTrade,
}: OrderViewsProps) {
  const [tradePrice, setTradePrice] = useState(stock.price);
  const [tradeShares, setTradeShares] = useState(1000); // 10 lots equivalent, shown as shares
  const [tradeExecuted, setTradeExecuted] = useState(false);
  const [errorWarning, setErrorWarning] = useState('');
  const [showBalance, setShowBalance] = useState(false);

  // Numerical properties
  const priceSharesAmount = tradePrice * tradeShares;
  const brokerageFee = Math.round(priceSharesAmount * 0.0015); // 0.15% fee
  const levyTax = Math.round(priceSharesAmount * 0.00043);
  const totalChargeAmount = priceSharesAmount + brokerageFee + levyTax;

  const handleSharesPills = (num: number) => {
    setTradeShares(Math.max(1, tradeShares + num));
  };

  const handlePriceClickFromOrderBook = (priceVal: number) => {
    setTradePrice(priceVal);
  };

  const handleReviewOrder = () => {
    if (totalChargeAmount > userProfile.balance) {
      setErrorWarning('Dana RDN Anda tidak mencukupi untuk melakukan transaksi ini.');
      return;
    }
    setErrorWarning('');
    onNavigate('TradeReview');
  };

  const handleConfirmSubmit = () => {
    if (totalChargeAmount > userProfile.balance) {
      return;
    }
    // Execution decreases balance and appends to holding array
    onExecuteTrade(tradeShares, tradePrice);
    setTradeExecuted(true);
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  if (currentScreen === 'TradeBuy') {
    return (
      <div id="trade-buy-screen" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-44 pt-5">
        {/* Back navigation header */}
        <div className="flex items-center justify-between px-5 mb-4">
          <button
            onClick={() => onNavigate('StockDetail')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
          
          <span className="font-extrabold text-primary text-sm">Beli {stock.code}</span>
          
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>

        <div className="px-5 mb-4">
          <div className="bg-white rounded-3xl p-4 soft-shadow border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900">{stock.code}</span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full max-w-36 truncate">{stock.name}</span>
                </div>
                <h1 className="text-2xl font-black text-gray-950 mt-2">{formatIDR(tradePrice)}</h1>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-primary">
                <TrendingUp className="w-3 h-3" />
                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Embedded Active Order book lists with filler triggers */}
        <div className="px-5 mb-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 soft-shadow">
            <h2 className="text-lg font-bold text-gray-950 mb-4">Buku Antrean</h2>

            {/* Bids and Asks table */}
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
              <span className="text-gray-500">Lot Beli</span>
              <span className="text-right text-gray-500">Beli</span>
              <span className="text-right text-gray-500">Jual</span>
              <span className="text-right text-gray-500">Lot Jual</span>
              {/* Bid Column (Buying) */}
              {stock.orderBook?.map((ob, idx) => (
                <React.Fragment key={idx}>
                  <button onClick={() => handlePriceClickFromOrderBook(ob.bidPrice)} className="text-left text-primary/80 font-mono">{ob.bidLot}</button>
                  <button onClick={() => handlePriceClickFromOrderBook(ob.bidPrice)} className="text-right text-primary font-black">{ob.bidPrice.toLocaleString('id-ID')}</button>
                  <button onClick={() => handlePriceClickFromOrderBook(ob.askPrice)} className="text-right text-red-500 font-black">{ob.askPrice.toLocaleString('id-ID')}</button>
                  <button onClick={() => handlePriceClickFromOrderBook(ob.askPrice)} className="text-right text-red-400 font-mono">{ob.askLot}</button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Form Inputs Container */}
        <div className="px-5 mb-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 soft-shadow flex flex-col gap-4">
            {errorWarning && (
              <div className="p-3 bg-red-50 text-red-650 text-xs rounded-2xl font-bold leading-relaxed flex items-center gap-1.5 text-red-750">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorWarning}</span>
              </div>
            )}

            {/* Input 1: Harga Beli */}
            <div>
              <label className="text-xs text-gray-400 font-bold block mb-1.5 px-3 bg-white w-fit relative top-3">Harga (Rp)</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-xl h-12 px-2">
                <button
                  type="button"
                  onClick={() => setTradePrice(Math.max(50, tradePrice - 25))}
                  className="w-10 h-10 text-gray-500 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="trade-price-input"
                  type="number"
                  value={tradePrice}
                  onChange={(e) => setTradePrice(Math.max(50, parseInt(e.target.value) || 0))}
                  className="w-24 text-center font-extrabold text-sm text-gray-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTradePrice(tradePrice + 25)}
                  className="w-10 h-10 text-gray-500 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Input 2: Jumlah Lembar */}
            <div>
              <label className="text-xs text-gray-400 font-bold block mb-1.5 px-3 bg-white w-fit relative top-3">Jumlah Lembar</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-xl h-12 px-2">
                <button
                  type="button"
                  onClick={() => setTradeShares(Math.max(1, tradeShares - 1))}
                  className="w-10 h-10 text-gray-500 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="trade-shares-input"
                  type="number"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center font-extrabold text-sm text-gray-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTradeShares(tradeShares + 1)}
                  className="w-10 h-10 text-gray-500 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Incremental pill selectors */}
              <div className="flex gap-2 mt-3 justify-center">
                <button
                  onClick={() => handleSharesPills(100)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs px-4 py-1.5 rounded-full focus:outline-none"
                >
                  +100
                </button>
                <button
                  onClick={() => handleSharesPills(500)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs px-4 py-1.5 rounded-full focus:outline-none"
                >
                  +500
                </button>
                <button
                  onClick={() => setTradeShares(Math.max(1, Math.floor(userProfile.balance / (tradePrice * 1.00193))))}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs px-4 py-1.5 rounded-full focus:outline-none"
                >
                  Maks
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Persistent screen button "Review Order" */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex flex-col gap-3 px-5 py-5 z-40">
          <div className="flex justify-between items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>Saldo Tersedia</span>
              <button
                type="button"
                onClick={() => setShowBalance((prev) => !prev)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700 active:scale-95"
                aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
              >
                {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <span className="text-gray-900">{showBalance ? formatIDR(userProfile.balance) : 'Rp •••••••'}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-black text-gray-900">Estimasi Total</span>
            <span className="text-2xl font-black text-primary">{formatIDR(priceSharesAmount)}</span>
          </div>
          <button
            id="trade-buy-review-btn"
            onClick={handleReviewOrder}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-full text-base font-bold shadow transition-all"
          >
            Beli
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'TradeReview') {
    return (
      <div id="trade-review-screen" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-44 pt-5">
        {/* Back navigational header */}
        <div className="flex items-center justify-between px-5 mb-8">
          <button
            onClick={() => onNavigate('TradeBuy')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </button>
          <span className="font-extrabold text-primary text-sm">Transaksi Aset</span>
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </div>

        <div className="px-5">
          <div className="text-center mb-7">
            <h1 className="text-xl font-black text-gray-950">Tinjau Pesanan Anda</h1>
            <p className="text-xs text-gray-600 mt-2">Pastikan detail berikut sudah benar sebelum dikonfirmasi.</p>
          </div>

          <div className="bg-white rounded-3xl p-4 soft-shadow border border-gray-100 mb-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-gray-950">{stock.code}</h2>
                <p className="text-xs font-semibold text-gray-500 truncate">{stock.name}</p>
              </div>
              <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">Beli</span>
            </div>
            <div className="flex flex-col gap-3 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah</span>
                <span className="font-black text-gray-950">{tradeShares.toLocaleString('id-ID')} Lembar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harga</span>
                <span className="font-black text-gray-950">{formatIDR(tradePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimasi Total</span>
                <span className="font-black text-gray-950">{formatIDR(priceSharesAmount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 soft-shadow border border-gray-100 mb-4">
            <h2 className="text-lg font-black text-gray-950 mb-4">Rincian Biaya</h2>
            <div className="flex flex-col gap-3 text-xs border-b border-gray-100 pb-4">
              <div className="flex justify-between"><span className="text-gray-600">Biaya Transaksi (0,15%)</span><span className="text-gray-900">{formatIDR(brokerageFee)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pajak/Biaya Bursa (0,043%)</span><span className="text-gray-900">{formatIDR(levyTax)}</span></div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-black text-gray-950">Total Pembayaran</span>
              <span className="text-lg font-black text-primary">{formatIDR(totalChargeAmount)}</span>
            </div>
          </div>

          <div className="order-tip-box rounded-xl p-4 flex gap-2.5 text-xs leading-relaxed">
            <Info className="order-tip-icon w-4 h-4 shrink-0 mt-0.5" />
            <p><span className="font-black">Tips Pasar:</span> Harga saham dapat berubah. Ini adalah pesanan limit; harga eksekusi dapat sedikit berbeda mengikuti kondisi pasar.</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-5 z-40">
          <button
            id="trade-buy-confirm-btn"
            onClick={handleConfirmSubmit}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-base font-black rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            Konfirmasi Beli
          </button>
          <button
            onClick={() => onNavigate('TradeBuy')}
            className="w-full mt-4 text-center text-xs font-semibold text-primary hover:text-primary-dark focus:outline-none"
          >
            Batal
          </button>
        </div>

        {/* ORDER SUCCESS POPUP MODAL IF PROCESSED */}
        {tradeExecuted && (
          <div className="absolute inset-0 bg-dark-blue/70 backdrop-blur-xs flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 soft-shadow text-center animate-fadeIn duration-200">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-black text-gray-950 block mb-0.5">Pesanan Berhasil Dikirim!</h3>
              <span className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full font-bold uppercase inline-flex items-center gap-1 my-2">
                Sukses Terbeli <Sparkles className="w-3 h-3 text-teal-600 fill-teal-600" />
              </span>

              {/* Details table inside modal */}
              <div className="bg-gray-50 rounded-2xl p-4.5 my-4.5 flex flex-col gap-2.5 text-xs font-semibold text-gray-600 text-left border border-gray-100">
                <div className="flex justify-between">
                  <span>Emiten Saham:</span>
                  <span className="text-gray-900 font-black">{stock.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga Pembelian:</span>
                  <span className="text-gray-900 font-black">{formatIDR(tradePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah Posisi:</span>
                  <span className="text-gray-900 font-black">{tradeShares.toLocaleString('id-ID')} Lembar</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 text-xs">
                  <span className="text-gray-900 font-black">Sisa Saldo RDN:</span>
                  <span className="text-primary font-black">
                    {showBalance ? formatIDR(userProfile.balance - totalChargeAmount) : 'Rp •••••••'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  id="trade-success-go-portfolio"
                  onClick={() => {
                    setTradeExecuted(false);
                    onNavigate('Portfolio');
                  }}
                  className="w-full h-11 bg-primary text-white text-xs font-black rounded-2xl"
                >
                  Lihat Portofolio Saya
                </button>

                <button
                  onClick={() => {
                    setTradeExecuted(false);
                    onNavigate('Home');
                  }}
                  className="text-xs text-gray-400 font-bold hover:underline"
                >
                  Kembali ke Beranda Utama
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
