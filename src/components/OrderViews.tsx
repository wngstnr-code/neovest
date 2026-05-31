/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, CheckCircle, Smartphone, AlertTriangle, Pin, Shield, Sparkles } from 'lucide-react';
import { Stock, Screen, UserProfile, PortfolioItem } from '../types';

interface OrderViewsProps {
  currentScreen: Screen;
  stock: Stock;
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onExecuteTrade: (lotsNum: number, pricePerUnit: number) => void;
}

export default function OrderViews({
  currentScreen,
  stock,
  userProfile,
  onNavigate,
  onExecuteTrade,
}: OrderViewsProps) {
  const [tradePrice, setTradePrice] = useState(stock.price);
  const [tradeLots, setTradeLots] = useState(10); // Standard starting lots count
  const [tradeExecuted, setTradeExecuted] = useState(false);
  const [errorWarning, setErrorWarning] = useState('');

  // Numerical properties
  const priceSharesAmount = tradePrice * 100 * tradeLots;
  const brokerageFee = Math.round(priceSharesAmount * 0.0015); // 0.15% fee
  const totalChargeAmount = priceSharesAmount + brokerageFee;

  const handleLotsPills = (num: number) => {
    setTradeLots(Math.max(1, tradeLots + num));
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
    onExecuteTrade(tradeLots, tradePrice);
    setTradeExecuted(true);
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  if (currentScreen === 'TradeBuy') {
    return (
      <div id="trade-buy-screen" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
        {/* Back navigation header */}
        <div className="flex items-center justify-between px-5 mb-4">
          <button
            onClick={() => onNavigate('StockDetail')}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-700 focus:outline-none"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
          
          <span className="font-extrabold text-gray-900 text-sm">Beli {stock.code}</span>
          
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary font-bold text-xs">
            VA
          </div>
        </div>

        {/* Quick Stock and Balance banner */}
        <div className="px-5 mb-5 flex justify-between items-center bg-transparent">
          <div>
            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Saldo RDN Tersedia</h4>
            <span className="text-sm font-black text-primary select-all block mt-0.5">{formatIDR(userProfile.balance)}</span>
          </div>

          <div className="text-right">
            <span className="text-[8px] bg-teal-50 text-teal-700 font-extrabold px-1.5 py-0.5 rounded">
              HARGA LIVE {stock.code}
            </span>
            <span className="text-xs font-bold text-gray-900 block mt-1">{formatIDR(stock.price)}</span>
          </div>
        </div>

        {/* Embedded Active Order book lists with filler triggers */}
        <div className="px-5 mb-5">
          <div className="bg-white rounded-3xl border border-gray-100 p-4.5 soft-shadow">
            <span className="text-[9px] text-gray-400 font-bold flex items-center justify-center gap-1 mb-3 uppercase tracking-wider text-center">
              <Pin className="w-3 h-3 rotate-45" /> Order Book (Klik baris harga untuk mengisi form)
            </span>

            {/* Bids and Asks table */}
            <div className="grid grid-cols-2 gap-3.5 text-[11px] font-semibold">
              {/* Bid Column (Buying) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between border-b border-gray-100 pb-1 text-teal-600 font-bold">
                  <span>Vol Lot</span>
                  <span>Beli (Bid)</span>
                </div>
                {stock.orderBook ? (
                  stock.orderBook.map((ob, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePriceClickFromOrderBook(ob.bidPrice)}
                      className="flex justify-between items-center hover:bg-teal-50 rounded px-1 transition-colors cursor-pointer py-0.5 text-gray-700"
                    >
                      <span className="text-gray-400 font-mono text-[10px]">{ob.bidLot}</span>
                      <span className="text-teal-600 font-extrabold">{ob.bidPrice.toLocaleString('id-ID')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400">No Bids</p>
                )}
              </div>

              {/* Ask Column (Selling) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between border-b border-gray-100 pb-1 text-red-500 font-bold">
                  <span>Jual (Ask)</span>
                  <span>Vol Lot</span>
                </div>
                {stock.orderBook ? (
                  stock.orderBook.map((ob, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePriceClickFromOrderBook(ob.askPrice)}
                      className="flex justify-between items-center hover:bg-red-50 rounded px-1 transition-colors cursor-pointer py-0.5 text-gray-700"
                    >
                      <span className="text-red-500 font-extrabold">{ob.askPrice.toLocaleString('id-ID')}</span>
                      <span className="text-gray-400 font-mono text-[10px]">{ob.askLot}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400">No Asks</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs Container */}
        <div className="px-5 mb-5">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow flex flex-col gap-4">
            {errorWarning && (
              <div className="p-3 bg-red-50 text-red-650 text-xs rounded-2xl font-bold leading-relaxed flex items-center gap-1.5 text-red-750">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorWarning}</span>
              </div>
            )}

            {/* Input 1: Harga Beli */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Harga Saham (Rp)</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-xl h-12 px-2">
                <button
                  type="button"
                  onClick={() => setTradePrice(Math.max(50, tradePrice - 25))}
                  className="w-10 h-10 bg-gray-50 text-gray-600 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  -
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
                  className="w-10 h-10 bg-gray-50 text-gray-600 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Input 2: Jumlah Lot */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Jumlah Lot (1 Lot = 100 Lembar)</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-xl h-12 px-2">
                <button
                  type="button"
                  onClick={() => setTradeLots(Math.max(1, tradeLots - 1))}
                  className="w-10 h-10 bg-gray-50 text-gray-600 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  -
                </button>
                <input
                  id="trade-lots-input"
                  type="number"
                  value={tradeLots}
                  onChange={(e) => setTradeLots(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center font-extrabold text-sm text-gray-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTradeLots(tradeLots + 1)}
                  className="w-10 h-10 bg-gray-50 text-gray-600 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  +
                </button>
              </div>

              {/* Incremental pill selectors */}
              <div className="flex gap-2 mt-3 justify-center">
                <button
                  onClick={() => handleLotsPills(1)}
                  className="bg-primary-light hover:bg-primary-light/80 text-primary font-bold text-[10px] px-3.5 py-1.5 rounded-lg focus:outline-none"
                >
                  +1 Lot
                </button>
                <button
                  onClick={() => handleLotsPills(5)}
                  className="bg-primary-light hover:bg-primary-light/80 text-primary font-bold text-[10px] px-3.5 py-1.5 rounded-lg focus:outline-none"
                >
                  +5 Lot
                </button>
                <button
                  onClick={() => handleLotsPills(10)}
                  className="bg-primary-light hover:bg-primary-light/80 text-primary font-bold text-[10px] px-3.5 py-1.5 rounded-lg focus:outline-none"
                >
                  +10 Lot
                </button>
                <button
                  onClick={() => handleLotsPills(50)}
                  className="bg-primary-light hover:bg-primary-light/80 text-primary font-bold text-[10px] px-3.5 py-1.5 rounded-lg focus:outline-none"
                >
                  +50 Lot
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                <span>Nilai Pokok Saham</span>
                <span className="text-gray-900 font-bold">{formatIDR(priceSharesAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                <span>Brokerage Fee (0.15%)</span>
                <span className="text-gray-900 font-bold">{formatIDR(brokerageFee)}</span>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-dashed border-gray-100 pt-2 text-gray-900 font-black">
                <span>Total Biaya Transaksi</span>
                <span className="text-primary text-sm">{formatIDR(totalChargeAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety indicator message panel */}
        <div className="px-5">
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-primary">
            <Shield className="w-3.5 h-3.5" /> Transaksi Anda dijamin aman, terenskripsi, dan terdaftar di KSEI &amp; OJK.
          </div>
        </div>

        {/* Persistent screen button "Review Order" */}
        <div className="absolute bottom-0 left-0 right-0 h-18 bg-white border-t border-gray-100 flex items-center justify-center px-5 z-40 rounded-b-3xl">
          <button
            id="trade-buy-review-btn"
            onClick={handleReviewOrder}
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow transition-all"
          >
            Review Order Beli Saham
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'TradeReview') {
    return (
      <div id="trade-review-screen" className="flex flex-col h-full bg-surface-bg px-5 pt-6 pb-4 justify-between overflow-y-auto no-scrollbar">
        {/* Back navigational header */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => onNavigate('TradeBuy')}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-700 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </button>
          <span className="font-extrabold text-[#001a41] text-sm">Konfirmasi Order</span>
        </div>

        {/* Confirm content Card */}
        <div className="bg-white rounded-3xl p-5 soft-shadow border border-gray-100 flex-1 flex flex-col justify-between mb-4">
          <div>
            <div className="text-center pb-2">
              <span className="bg-primary/10 text-primary font-black tracking-widest text-[9px] px-3 py-1 rounded-full uppercase inline-block select-none mt-1.5 mb-1">
                KONFIRMASI ORDER BELI
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{stock.code}</h3>
              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">{stock.name}</p>
            </div>

            {/* Calculations summaries */}
            <div className="flex flex-col gap-4.5 mt-6 border-t border-b border-gray-100/65 py-5 text-xs font-bold text-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400">Harga Per Share</span>
                <span className="text-gray-900 font-extrabold">{formatIDR(tradePrice)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400">Porsi Lots (Quantity)</span>
                <span className="text-gray-900 font-extrabold">{tradeLots} Lots ({tradeLots * 100} Lembar)</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400">Pokok Transaksi</span>
                <span className="text-gray-900 font-extrabold">{formatIDR(priceSharesAmount)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400">Biaya Transaksi (Brokerage 0.15%)</span>
                <span className="text-gray-900 font-extrabold">{formatIDR(brokerageFee)}</span>
              </div>

              <div className="flex justify-between items-center border-t border-dashed border-gray-150 pt-3 text-sm text-gray-900">
                <span className="text-gray-900 font-black">Total Tagihan Finansial</span>
                <span className="text-primary font-black">{formatIDR(totalChargeAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              id="trade-buy-confirm-btn"
              onClick={handleConfirmSubmit}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              Konfirmasi &amp; Kirim Order Beli
            </button>

            <button
              onClick={() => onNavigate('TradeBuy')}
              className="text-center text-xs font-semibold text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              Ubah Data Order Beli
            </button>
          </div>
        </div>

        {/* ORDER SUCCESS POPUP MODAL IF PROCESSED */}
        {tradeExecuted && (
          <div className="absolute inset-0 bg-dark-blue/70 backdrop-blur-xs flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 soft-shadow text-center animate-fadeIn duration-200">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h3 className="text-sm font-black text-gray-950 block mb-0.5">Order Berhasil Dikirim!</h3>
              <span className="text-[9px] text-teal-600 bg-teal-50 px-3 py-1 rounded-full font-bold uppercase inline-flex items-center gap-1 my-2">
                Sukses Terbeli <Sparkles className="w-3 h-3 text-teal-600 fill-teal-600" />
              </span>

              {/* Details table inside modal */}
              <div className="bg-gray-50 rounded-2xl p-4.5 my-4.5 flex flex-col gap-2.5 text-[11px] font-semibold text-gray-600 text-left border border-gray-100">
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
                  <span className="text-gray-900 font-black">{tradeLots} Lots ({tradeLots * 100} Lembar)</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 text-xs">
                  <span className="text-gray-900 font-black">Sisa Saldo RDN:</span>
                  <span className="text-primary font-black">{formatIDR(userProfile.balance - totalChargeAmount)}</span>
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
                  className="text-[10px] text-gray-400 font-bold hover:underline"
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
