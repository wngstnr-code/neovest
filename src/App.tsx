/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Screen, UserProfile, PortfolioItem, Stock, LearnModule, Transaction } from './types';
import {
  INITIAL_STOCKS,
  INITIAL_MODULES,
  INITIAL_USER,
  INITIAL_PORTFOLIO,
  INITIAL_WATCHLIST,
} from './data';

// Component Imports
import BottomNav from './components/BottomNav';
import LandingViews from './components/LandingViews';
import HomeDashboard from './components/HomeDashboard';
import MarketView from './components/MarketView';
import PortfolioView from './components/PortfolioView';
import AIInsightView from './components/AIInsightView';
import LearnView from './components/LearnView';
import StockDetailView from './components/StockDetailView';
import RiskProfileQuizViews from './components/RiskProfileQuizViews';
import ProfileView from './components/ProfileView';
import OrderViews from './components/OrderViews';
import PremiumUpgrade from './components/PremiumUpgrade';
import CommunityView from './components/CommunityView';
import OrdersView from './components/OrdersView';

export default function App() {
  // Mobile app navigation state router
  const [currentScreen, setCurrentScreen] = useState<Screen>('Welcome');
  
  // Selected post context for Community detail view
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Live mockup states
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [watchlist, setWatchlist] = useState<string[]>(INITIAL_WATCHLIST);
  const [modules, setModules] = useState<LearnModule[]>(INITIAL_MODULES);

  // Orders tracker state
  const [orders, setOrders] = useState<Transaction[]>([
    {
      id: 'ORD-5819',
      stockCode: 'BBCA',
      type: 'BUY',
      lots: 10,
      price: 10250,
      date: '31 Mei 2026',
      totalPayment: 10265375,
    },
    {
      id: 'ORD-4920',
      stockCode: 'BBRI',
      type: 'BUY',
      lots: 5,
      price: 5450,
      date: '28 Mei 2026',
      totalPayment: 2729087,
    },
  ]);

  // Focus stock details context
  const [selectedStockCode, setSelectedStockCode] = useState<string>('BBCA');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Watchlist Star bookmark updates
  const handleToggleWatchlist = (code: string) => {
    if (watchlist.includes(code)) {
      setWatchlist((prev) => prev.filter((item) => item !== code));
    } else {
      setWatchlist((prev) => [...prev, code]);
    }
  };

  // Learning progress multiplier
  const handleUpdateProgress = (moduleId: string, newProgress: number) => {
    setModules((prev) =>
      prev.map((mod) => (mod.id === moduleId ? { ...mod, progress: newProgress } : mod))
    );
  };

  // User details modification
  const handleUpdateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  // Upgrades premium statuses
  const handleUpgradeSuccess = () => {
    setUserProfile((prev) => ({ ...prev, isPremium: true }));
  };

  const handleLoginSuccess = (userData: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...userData }));
  };

  // Stocks purchase algorithm decreases cash and appends portfolio rows
  const handleExecuteTrade = (lotsNum: number, pricePerUnit: number) => {
    // Total calculation
    const priceSharesAmount = pricePerUnit * 100 * lotsNum;
    const transactionCharge = Math.round(priceSharesAmount * 0.0015);
    const totalDeducted = priceSharesAmount + transactionCharge;

    if (totalDeducted > userProfile.balance) return;

    // Deduct cash from RDN balance
    setUserProfile((prev) => ({
      ...prev,
      balance: prev.balance - totalDeducted,
    }));

    // Append to trade order state
    const newOrder: Transaction = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      stockCode: selectedStockCode,
      type: 'BUY',
      lots: lotsNum,
      price: pricePerUnit,
      date: 'Hari ini',
      totalPayment: totalDeducted,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Update stocks list with matching code to simulate tiny positive momentum
    setStocks((prev) =>
      prev.map((s) => {
        if (s.code === selectedStockCode) {
          const rawPrice = s.price + 25;
          const diff = rawPrice - s.prevPrice;
          const percent = parseFloat(((diff / s.prevPrice) * 100).toFixed(2));
          return {
            ...s,
            price: rawPrice,
            changeAmount: diff,
            changePercent: percent,
          };
        }
        return s;
      })
    );

    // Update portfolio holdings
    setPortfolio((prev) => {
      const existingIdx = prev.findIndex((item) => item.stockCode === selectedStockCode);

      if (existingIdx !== -1) {
        // Recalculate average weighted buying price
        const target = prev[existingIdx];
        const prevTotalShares = target.lots * 100;
        const newTotalShares = lotsNum * 100;
        const weightedCost =
          (target.avgPrice * prevTotalShares + pricePerUnit * newTotalShares) /
          (prevTotalShares + newTotalShares);

        const copies = [...prev];
        copies[existingIdx] = {
          ...target,
          lots: target.lots + lotsNum,
          avgPrice: Math.round(weightedCost),
        };
        return copies;
      } else {
        // Appends new holding
        const stockReferenced = stocks.find((s) => s.code === selectedStockCode);
        return [
          ...prev,
          {
            stockCode: selectedStockCode,
            name: stockReferenced ? stockReferenced.name : 'Saham Terbeli',
            lots: lotsNum,
            avgPrice: pricePerUnit,
            currentPrice: pricePerUnit,
          },
        ];
      }
    });
  };

  // Stock model selected context helper
  const activeStockObj = stocks.find((s) => s.code === selectedStockCode) || stocks[0];

  const handleSelectStock = (code: string) => {
    setSelectedStockCode(code);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Navigates cleanly
  const handleNavigate = (screen: any) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-dvh bg-surface-bg select-none font-sans antialiased overflow-hidden">
      <div className="relative w-full h-dvh bg-surface-bg overflow-hidden flex flex-col">
        <div className="flex-1 h-full w-full relative overflow-hidden bg-surface-bg">
          {currentScreen === 'Welcome' && (
            <LandingViews
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentScreen === 'Login' && (
            <LandingViews
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentScreen === 'Register' && (
            <LandingViews
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentScreen === 'Home' && (
            <HomeDashboard
              userProfile={userProfile}
              portfolio={portfolio}
              stocks={stocks}
              onNavigate={handleNavigate}
              onSelectStock={handleSelectStock}
              onSearchChange={handleSearchChange}
            />
          )}

          {currentScreen === 'Watchlist' && (
            <MarketView
              stocks={stocks}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
              onSelectStock={handleSelectStock}
              initialSearchQuery=""
            />
          )}

          {currentScreen === 'Market' && (
            <MarketView
              stocks={stocks}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
              onSelectStock={handleSelectStock}
              initialSearchQuery={searchQuery}
            />
          )}

          {currentScreen === 'Portfolio' && (
            <PortfolioView
              userProfile={userProfile}
              portfolio={portfolio}
              stocks={stocks}
              onNavigate={handleNavigate}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentScreen === 'Insight' && (
            <AIInsightView
              userProfile={userProfile}
              stocks={stocks}
              onNavigate={handleNavigate}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentScreen === 'Learn' && (
            <LearnView
              modules={modules}
              onNavigate={handleNavigate}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {currentScreen === 'StockDetail' && (
            <StockDetailView
              stock={activeStockObj}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
            />
          )}

          {(currentScreen === 'RiskProfileQuiz' || currentScreen === 'RiskProfileResult') && (
            <RiskProfileQuizViews
              currentScreen={currentScreen}
              userProfile={userProfile}
              onNavigate={handleNavigate}
              onUpdateUserProfile={handleUpdateUserProfile}
            />
          )}

          {currentScreen === 'Profile' && (
            <ProfileView
              userProfile={userProfile}
              onUpdateUserProfile={handleUpdateUserProfile}
              onNavigate={handleNavigate}
            />
          )}

          {(currentScreen === 'TradeBuy' || currentScreen === 'TradeReview') && (
            <OrderViews
              currentScreen={currentScreen}
              stock={activeStockObj}
              userProfile={userProfile}
              onNavigate={handleNavigate}
              onExecuteTrade={handleExecuteTrade}
            />
          )}

          {currentScreen === 'PremiumUpgrade' && (
            <PremiumUpgrade
              userProfile={userProfile}
              onNavigate={handleNavigate}
              onUpgradeSuccess={handleUpgradeSuccess}
            />
          )}

          {(currentScreen === 'Community' || currentScreen === 'CommunityPostDetail') && (
            <CommunityView
              userProfile={userProfile}
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              selectedPostId={selectedPostId}
              setSelectedPostId={setSelectedPostId}
            />
          )}

          {currentScreen === 'Orders' && (
            <OrdersView
              orders={orders}
              stocks={stocks}
              onNavigate={handleNavigate}
              onSelectStock={handleSelectStock}
            />
          )}
        </div>

        {/* Global Bottom Tab Navigation bar consistent across pages */}
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
