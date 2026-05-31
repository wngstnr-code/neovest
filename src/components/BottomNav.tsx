/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, TrendingUp, PieChart, Lightbulb, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  // Map our subviews or detail screens to their respective primary navigation tab
  const getActiveTab = (): string => {
    if (['Welcome', 'Login', 'Register'].includes(currentScreen)) return 'none';
    if (['History', 'PremiumUpgrade', 'Community', 'CommunityPostDetail', 'Learn', 'TradeBuy', 'TradeReview'].includes(currentScreen)) return 'none';
    if (['Home', 'Watchlist'].includes(currentScreen)) return 'Home';
    if (['Market', 'StockDetail', 'Orders'].includes(currentScreen)) return 'Market';
    if (['Portfolio'].includes(currentScreen)) return 'Portfolio';
    if (['Insight'].includes(currentScreen)) return 'Insight';
    if (['Profile', 'RiskProfileResult', 'RiskProfileQuiz'].includes(currentScreen)) return 'Profile';
    return 'Home';
  };

  const activeTab = getActiveTab();

  if (activeTab === 'none') return null;

  const tabs = [
    { id: 'Home', label: 'Home', icon: Home, screen: 'Home' as Screen },
    { id: 'Market', label: 'Market', icon: TrendingUp, screen: 'Market' as Screen },
    { id: 'Portfolio', label: 'Portfolio', icon: PieChart, screen: 'Portfolio' as Screen },
    { id: 'Insight', label: 'Insight', icon: Lightbulb, screen: 'Insight' as Screen },
    { id: 'Profile', label: 'Profile', icon: User, screen: 'Profile' as Screen },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-18 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-40 pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-nav-tab-${tab.id.toLowerCase()}`}
            onClick={() => onNavigate(tab.screen)}
            className="flex flex-col items-center justify-center w-14 h-14 relative focus:outline-none transition-all"
          >
            {isActive ? (
              <div className="flex flex-col items-center justify-center">
                {/* Visual Indicator Pill inspired by Livin Mandiri / Blue style */}
                <div className="absolute -top-1 w-8 h-1 bg-primary rounded-full transition-all" />
                <div className="p-2 bg-primary/10 rounded-full text-primary transition-all">
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-primary mt-1">{tab.label}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                <Icon className="w-5 h-5 stroke-[2]" />
                <span className="text-[10px] font-medium text-gray-400 mt-1">{tab.label}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
