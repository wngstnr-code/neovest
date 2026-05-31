/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, CheckCircle, AlertTriangle, Building2, Info, Minus, Plus, Sparkles, TrendingUp } from 'lucide-react';
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
  const levyTax = Math.round(priceSharesAmount * 0.00043);
  const totalChargeAmount = priceSharesAmount + brokerageFee + levyTax;

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
          
          <span className="font-extrabold text-primary text-sm">Buy {stock.code}</span>
          
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>

        <div className="px-5 mb-4">
          <div className="bg-white rounded-3xl p-4 soft-shadow border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900">{stock.code}</span>
                  <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full max-w-36 truncate">{stock.name}</span>
                </div>
                <h1 className="text-2xl font-black text-gray-950 mt-2">{formatIDR(tradePrice)}</h1>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold text-primary">
                <TrendingUp className="w-3 h-3" />
                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Embedded Active Order book lists with filler triggers */}
        <div className="px-5 mb-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 soft-shadow">
            <h2 className="text-lg font-bold text-gray-950 mb-4">Order Book</h2>

            {/* Bids and Asks table */}
            <div className="grid grid-cols-4 gap-2 text-[11px] font-semibold">
              <span className="text-gray-500">Bid Lot</span>
              <span className="text-right text-gray-500">Bid</span>
              <span className="text-right text-gray-500">Ask</span>
              <span className="text-right text-gray-500">Ask Lot</span>
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
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5 px-3 bg-white w-fit relative top-3">Price (Rp)</label>
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

            {/* Input 2: Jumlah Lot */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5 px-3 bg-white w-fit relative top-3">Lot Amount</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-xl h-12 px-2">
                <button
                  type="button"
                  onClick={() => setTradeLots(Math.max(1, tradeLots - 1))}
                  className="w-10 h-10 text-gray-500 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  <Minus className="w-4 h-4" />
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
                  className="w-10 h-10 text-gray-500 font-mono font-black rounded-lg flex items-center justify-center text-sm focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Incremental pill selectors */}
              <div className="flex gap-2 mt-3 justify-center">
                <button
                  onClick={() => handleLotsPills(10)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] px-4 py-1.5 rounded-full focus:outline-none"
                >
                  +10
                </button>
                <button
                  onClick={() => handleLotsPills(50)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] px-4 py-1.5 rounded-full focus:outline-none"
                >
                  +50
                </button>
                <button
                  onClick={() => setTradeLots(Math.max(1, Math.floor(userProfile.balance / (tradePrice * 100))))}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] px-4 py-1.5 rounded-full focus:outline-none"
                >
                  Max
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Persistent screen button "Review Order" */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex flex-col gap-3 px-5 py-5 z-40">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Available Balance</span>
            <span className="text-gray-900">{formatIDR(userProfile.balance)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-black text-gray-900">Est. Total</span>
            <span className="text-2xl font-black text-primary">{formatIDR(priceSharesAmount)}</span>
          </div>
          <button
            id="trade-buy-review-btn"
            onClick={handleReviewOrder}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-full text-base font-bold shadow transition-all"
          >
            Buy
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
          <span className="font-extrabold text-primary text-sm">Trade Assets</span>
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </div>

        <div className="px-5">
          <div className="text-center mb-7">
            <h1 className="text-xl font-black text-gray-950">Review Your Order</h1>
            <p className="text-xs text-gray-600 mt-2">Please verify the details below before confirming.</p>
          </div>

          <div className="bg-white rounded-3xl p-4 soft-shadow border border-gray-100 mb-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-gray-950">{stock.code}</h2>
                <p className="text-[10px] font-semibold text-gray-500 truncate">{stock.name}</p>
              </div>
              <span className="rounded-full bg-primary-light px-3 py-1 text-[10px] font-bold text-primary">Buy</span>
            </div>
            <div className="flex flex-col gap-3 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity</span>
                <span className="font-black text-gray-950">{tradeLots} Lots</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-black text-gray-950">{formatIDR(tradePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Total</span>
                <span className="font-black text-gray-950">{formatIDR(priceSharesAmount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 soft-shadow border border-gray-100 mb-4">
            <h2 className="text-lg font-black text-gray-950 mb-4">Fee Breakdown</h2>
            <div className="flex flex-col gap-3 text-xs border-b border-gray-100 pb-4">
              <div className="flex justify-between"><span className="text-gray-600">Transaction Fee (0.15%)</span><span className="text-gray-900">{formatIDR(brokerageFee)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Levy/Tax (0.043%)</span><span className="text-gray-900">{formatIDR(levyTax)}</span></div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-black text-gray-950">Total Payment</span>
              <span className="text-lg font-black text-primary">{formatIDR(totalChargeAmount)}</span>
            </div>
          </div>

          <div className="bg-blue-100 text-dark-blue rounded-xl p-4 flex gap-2.5 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p><span className="font-black">Market Tip:</span> Stock prices fluctuate. This is a limit order; your execution price may slightly vary based on market conditions.</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-5 z-40">
          <button
            id="trade-buy-confirm-btn"
            onClick={handleConfirmSubmit}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-base font-black rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            Confirm Buy
          </button>
          <button
            onClick={() => onNavigate('TradeBuy')}
            className="w-full mt-4 text-center text-xs font-semibold text-primary hover:text-primary-dark focus:outline-none"
          >
            Cancel
          </button>
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
