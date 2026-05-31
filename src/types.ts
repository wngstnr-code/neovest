/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stock {
  code: string;
  name: string;
  price: number;
  prevPrice: number;
  changePercent: number;
  changeAmount: number;
  category: 'perbankan' | 'energi' | 'teknologi';
  aiConfidence: number;
  aiRecommendation: 'BUY' | 'SELL' | 'HOLD';
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  fundamental: string;
  pe: string;
  pbv: string;
  roe: string;
  divYield: string;
  peClassification: string;
  pbvClassification: string;
  roeClassification: string;
  divYieldClassification: string;
  bullCase: number;
  bearCase: number;
  drivers: string[];
  chartData: { label: string; price: number }[];
  orderBook: { bidPrice: number; bidLot: string; askPrice: number; askLot: string }[];
}

export interface PortfolioItem {
  stockCode: string;
  name: string;
  lots: number; // 1 lot = 100 shares
  avgPrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  stockCode: string;
  type: 'BUY' | 'SELL';
  lots: number;
  shares?: number;
  price: number;
  date: string;
  totalPayment: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  balance: number; // in IDR
  riskProfile: 'Konservatif' | 'Moderat' | 'Agresif';
  isPremium: boolean;
  biometricsEnabled: boolean;
}

export interface LearnModule {
  id: string;
  title: string;
  description: string;
  category: 'Pemula' | 'Fundamental' | 'Teknikal' | 'Psikologi';
  modules: number;
  durationMinutes: number;
  progress: number; // 0 - 100
  isFeatured: boolean;
  tagClass: string;
}

export type Screen =
  | 'Welcome'
  | 'Login'
  | 'Register'
  | 'Home'
  | 'Market'
  | 'Portfolio'
  | 'Insight' // This is the overall AI Insight screen
  | 'Learn'
  | 'StockDetail'
  | 'RiskProfileQuiz'
  | 'RiskProfileResult'
  | 'Watchlist'
  | 'History'
  | 'Profile'
  | 'TradeBuy'
  | 'TradeReview'
  | 'PremiumUpgrade'
  | 'Community'
  | 'CommunityPostDetail'
  | 'Orders';
