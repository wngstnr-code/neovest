/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, TrendingUp, BriefcaseBusiness, Lightbulb, User } from 'lucide-react';
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
    { id: 'Home', label: 'Beranda', icon: Home, screen: 'Home' as Screen },
    { id: 'Market', label: 'Pasar', icon: TrendingUp, screen: 'Market' as Screen },
    { id: 'Portfolio', label: 'Portofolio', icon: BriefcaseBusiness, screen: 'Portfolio' as Screen },
    { id: 'Insight', label: 'Wawasan', icon: Lightbulb, screen: 'Insight' as Screen },
    { id: 'Profile', label: 'Profil', icon: User, screen: 'Profile' as Screen },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(15,23,42,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-nav-tab-${tab.id.toLowerCase()}`}
            onClick={() => onNavigate(tab.screen)}
            className="flex flex-col items-center justify-center w-[68px] h-16 relative focus:outline-none transition-all"
          >
            {isActive ? (
              <div className="bottom-nav-active-pill absolute -top-2 flex h-[58px] w-[72px] flex-col items-center justify-center rounded-[26px] bg-accent text-dark-blue shadow-[0_8px_18px_rgba(250,204,21,0.24)] transition-all">
                <Icon className="w-5 h-5 stroke-[2.6] fill-current" />
                <span className="bottom-nav-active-label text-xs font-semibold mt-1 leading-none">{tab.label}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-all pt-1">
                <Icon className="w-5 h-5 stroke-[2.2]" />
                <span className="text-xs font-medium text-gray-400 mt-1 leading-none">{tab.label}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
