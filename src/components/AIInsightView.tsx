/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ChevronRight, LayoutGrid, CheckCircle, Zap, Lightbulb, Compass, Landmark, ShoppingBag, Activity, FileText, Globe, X } from 'lucide-react';
import { Stock, UserProfile, Screen } from '../types';
import NeoVestLogo from './NeoVestLogo';

interface AIInsightViewProps {
  userProfile: UserProfile;
  stocks: Stock[];
  onNavigate: (screen: Screen) => void;
  onSelectStock: (code: string) => void;
}

interface InsightDetail {
  title: string;
  eyebrow: string;
  tone: 'primary' | 'teal' | 'red' | 'amber';
  summary: string;
  metrics: { label: string; value: string }[];
  points: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export default function AIInsightView({
  userProfile,
  stocks,
  onNavigate,
  onSelectStock,
}: AIInsightViewProps) {
  const [rebalanceCompleted, setRebalanceCompleted] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<InsightDetail | null>(null);

  const bbcaData = stocks.find((s) => s.code === 'BBCA') || stocks[0];
  const bmriData = stocks.find((s) => s.code === 'BMRI') || stocks[1];
  const adroData = stocks.find((s) => s.code === 'ADRO') || stocks[2];
  const aiPicks = [bbcaData, bmriData, adroData];

  const getStockInsight = (stock: Stock): InsightDetail => ({
    title: `${stock.code} - ${stock.aiRecommendation}`,
    eyebrow: 'Pilihan AI Hari Ini',
    tone: stock.riskLevel === 'Rendah' ? 'teal' : stock.riskLevel === 'Tinggi' ? 'red' : 'amber',
    summary: stock.fundamental,
    metrics: [
      { label: 'Keyakinan AI', value: `${stock.aiConfidence}%` },
      { label: 'Risiko', value: stock.riskLevel },
      { label: 'Target Harga', value: `Rp ${(stock.price * 1.15).toLocaleString('id-ID')}` },
      { label: 'Harga Saat Ini', value: `Rp ${stock.price.toLocaleString('id-ID')}` },
    ],
    points: [
      `Rekomendasi AI saat ini: ${stock.aiRecommendation}.`,
      `Skenario optimistis berada di Rp ${stock.bullCase.toLocaleString('id-ID')}, sedangkan area defensif berada di Rp ${stock.bearCase.toLocaleString('id-ID')}.`,
      `Faktor utama: ${stock.drivers.slice(0, 2).join(', ') || 'momentum harga dan kondisi fundamental emiten'}.`,
    ],
    actionLabel: `Lihat ${stock.code}`,
    onAction: () => {
      onSelectStock(stock.code);
      onNavigate('StockDetail');
    },
  });

  const toneClasses: Record<InsightDetail['tone'], string> = {
    primary: 'bg-primary/5 text-primary border-primary/10',
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  const handleRebalance = () => {
    setRebalanceCompleted(true);
    setTimeout(() => {
      setRebalanceCompleted(false);
    }, 4000);
  };

  return (
    <div id="ai-insight-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      {/* Top Title Section */}
      <div className="px-5 mb-5 flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">Wawasan AI</h2>
          </div>
        </div>

        <NeoVestLogo compact />
      </div>

      {/* Today's AI Picks section */}
      <div className="px-5 mb-6">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-gray-900 tracking-wider flex items-center gap-1">
            <Sparkles className="w-4.5 h-4.5 text-primary stroke-[2.2]" />
            PILIHAN AI HARI INI
          </h3>
          <div className="inline-flex items-center gap-1 bg-accent/95 text-dark-blue font-bold px-3 py-1 rounded-full text-xs soft-shadow">
            <Zap className="w-3.5 h-3.5" />
            <span>{userProfile.riskProfile}</span>
          </div>
        </div>

        {aiPicks.map((pickData) => {
          return (
            <button
              type="button"
              key={pickData.code}
              onClick={() => setSelectedInsight(getStockInsight(pickData))}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 soft-shadow mb-3 cursor-pointer hover:bg-gray-50/50 transition-all overflow-hidden active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary font-black text-sm flex items-center justify-center border border-primary/10">
                    {pickData.code.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-gray-900">{pickData.code}</h4>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold block mt-0.5">{pickData.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-primary block">{pickData.aiConfidence}%</span>
                    <span className="text-[10px] text-gray-400 font-bold block">Keyakinan</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tingkat Risiko</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${pickData.riskLevel === 'Rendah' ? 'bg-teal-500' : pickData.riskLevel === 'Tinggi' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-bold text-gray-700">{pickData.riskLevel}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Target Harga</span>
                    <span className="text-xs font-bold text-gray-900 block mt-1">Rp {(pickData.price * 1.15).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sentimen Pasar gauge layout */}
      <div className="px-5 mb-6">
        <button
          type="button"
          onClick={() => setSelectedInsight({
            title: 'Sentimen Pasar Positif',
            eyebrow: 'Indikator Suasana Pasar',
            tone: 'primary',
            summary: 'Tekanan beli masih mendominasi pasar, terutama pada sektor perbankan dan konsumen.',
            metrics: [
              { label: 'Arah Sentimen', value: 'Positif' },
              { label: 'Kekuatan', value: '75%' },
              { label: 'Sektor Utama', value: 'Perbankan' },
              { label: 'Sektor Kedua', value: 'Konsumen' },
            ],
            points: [
              'Investor cenderung masuk ke saham berkapitalisasi besar.',
              'Momentum positif masih perlu dikonfirmasi oleh volume transaksi harian.',
              'Gunakan pendekatan bertahap agar risiko harga masuk tetap terkendali.',
            ],
          })}
          className="w-full text-left bg-white rounded-3xl border border-gray-100 p-5 soft-shadow active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-1.5 text-gray-900 font-extrabold text-xs mb-4">
            <Compass className="w-4.5 h-4.5 text-primary stroke-[2.2]" />
            <span>Sentimen Pasar</span>
          </div>

          <div className="flex flex-col items-center">
            {/* Custom SVG Half Gauge Dial */}
            <div className="w-40 h-20 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                {/* Background arc track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Dynamic colored arc (Positive sentiment filled to ~75%) */}
                <path
                  d="M 10 50 A 40 40 0 0 1 78.5 21.5"
                  fill="none"
                  stroke="#0059bb"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Indicator needle pointer */}
                <line x1="50" y1="50" x2="72" y2="28" stroke="#101827" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="50" r="3.5" fill="#101827" />
              </svg>
            </div>
            
            <h4 id="ai-market-sentiment-label" className="text-sm font-extrabold text-primary mb-1 mt-1">Positif</h4>
            <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider mb-4">Indikator Suasana Pasar</span>
          </div>

          {/* Sectors to watch tags */}
          <div>
            <span className="text-xs text-gray-400 font-bold block mb-2 tracking-wider">SEKTOR YANG DIPANTAU</span>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-primary text-xs font-extrabold px-2.5 py-1 rounded-lg">
                <Landmark className="w-3.5 h-3.5" /> Perbankan
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                <ShoppingBag className="w-3.5 h-3.5" /> Konsumen
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* News Sentiment Highlight */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-4 h-4 text-primary stroke-[2.2]" />
          SOROTAN SENTIMEN BERITA
        </h3>
        <button
          type="button"
          onClick={() => setSelectedInsight({
            title: 'Sentimen TLKM Menguat',
            eyebrow: 'Sorotan Sentimen Berita',
            tone: 'teal',
            summary: 'Rencana ekspansi data center TLKM memicu sentimen positif karena pasar melihat potensi pertumbuhan pendapatan digital.',
            metrics: [
              { label: 'Sentimen Positif', value: '75%' },
              { label: 'Emiten', value: 'TLKM' },
              { label: 'Tema', value: 'Data Center' },
              { label: 'Dampak', value: 'Katalis' },
            ],
            points: [
              'Berita ekspansi dapat meningkatkan ekspektasi pertumbuhan jangka menengah.',
              'Pantau realisasi belanja modal agar sentimen tidak hanya berbasis narasi.',
              'Pergerakan harga tetap perlu dikonfirmasi oleh volume dan tren sektor telekomunikasi.',
            ],
          })}
          className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 soft-shadow active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex flex-col items-center justify-center shrink-0 border border-teal-100">
              <span className="text-teal-700 font-black text-xs">75%</span>
              <span className="text-[8px] text-teal-600 font-bold">POS</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Sentimen TLKM Menguat</h4>
              <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
                Berita terkini menunjukkan sentimen positif pada TLKM akibat rilis rencana strategis ekspansi data center skala besar ke seluruh Indonesia.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* AI Portfolio Alert */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-500 stroke-[2.2]" />
          SISTEM PERINGATAN DINI
        </h3>
        <button
          type="button"
          onClick={() => setSelectedInsight({
            title: 'Volatilitas GOTO Meningkat',
            eyebrow: 'Sistem Peringatan Dini',
            tone: 'red',
            summary: 'AI mendeteksi lonjakan volume transaksi GOTO yang jauh di atas rata-rata 5 hari terakhir.',
            metrics: [
              { label: 'Lonjakan Volume', value: '300%' },
              { label: 'Emiten', value: 'GOTO' },
              { label: 'Horizon', value: '5 Hari' },
              { label: 'Risiko', value: 'Tinggi' },
            ],
            points: [
              'Lonjakan volume bisa berarti akumulasi, distribusi, atau reaksi terhadap berita.',
              'Hindari keputusan impulsif sebelum arah harga dan support terdekat terkonfirmasi.',
              'Gunakan batas risiko yang jelas jika tetap ingin mengambil posisi.',
            ],
          })}
          className="w-full text-left bg-red-50/50 rounded-2xl border border-red-100 p-4 relative overflow-hidden active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-800 mb-1">Volatilitas GOTO Meningkat</h4>
              <p className="text-[10px] leading-relaxed text-red-600/90 font-medium">
                AI kami mendeteksi lonjakan volume transaksi GOTO sebesar 300% di atas rata-rata 5 hari terakhir. Harap pantau pergerakan harga dengan seksama.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Pattern Recognition */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-primary stroke-[2.2]" />
          PENGENALAN POLA
        </h3>
        <button
          type="button"
          onClick={() => setSelectedInsight({
            title: 'BBRI - Double Bottom',
            eyebrow: 'Pengenalan Pola',
            tone: 'primary',
            summary: 'BBRI sedang membentuk pola dasar ganda yang sering dibaca sebagai sinyal potensi pantulan.',
            metrics: [
              { label: 'Pola', value: 'Double Bottom' },
              { label: 'Support', value: 'Rp 5.300' },
              { label: 'Resistensi', value: 'Rp 5.600' },
              { label: 'Status', value: 'Pantau' },
            ],
            points: [
              'Konfirmasi lebih kuat muncul jika harga mampu bertahan di atas neckline.',
              'Kegagalan mempertahankan support dapat membatalkan pola.',
              'Cocok dipantau bersama volume dan sentimen sektor perbankan.',
            ],
          })}
          className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 soft-shadow active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          <h4 className="text-xs font-bold text-gray-900 mb-1">BBRI - Double Bottom</h4>
          <div className="w-full h-16 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-gray-100">
            <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
              <path d="M10,20 L40,40 L70,25 L100,40 L130,15 L160,10 L190,5" fill="none" stroke="#0059bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="40" cy="40" r="3" fill="#0059bb" />
              <circle cx="100" cy="40" r="3" fill="#0059bb" />
              <line x1="10" y1="40" x2="190" y2="40" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
            <strong className="text-gray-700">BBRI</strong> sedang membentuk pola dasar ganda. Ada potensi pantulan dengan area dukungan kuat di 5.300 dan target resistensi di 5.600.
          </p>
        </button>
      </div>

      {/* Earnings Summary */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary stroke-[2.2]" />
          RANGKUMAN KINERJA
        </h3>
        <button
          type="button"
          onClick={() => setSelectedInsight({
            title: 'Rangkuman Kinerja BMRI',
            eyebrow: 'Laporan Kuartal III 2026',
            tone: 'primary',
            summary: 'Kinerja BMRI terlihat solid karena laba tumbuh, kualitas aset membaik, dan kredit tetap ekspansif.',
            metrics: [
              { label: 'Pertumbuhan Laba', value: '+15%' },
              { label: 'Kualitas Aset', value: 'Membaik' },
              { label: 'Kredit', value: 'Solid' },
              { label: 'Nada AI', value: 'Positif' },
            ],
            points: [
              'Pertumbuhan laba melampaui estimasi pasar.',
              'Perbaikan NPL mengurangi kekhawatiran risiko kredit.',
              'Katalis berikutnya adalah konsistensi margin bunga dan pertumbuhan kredit.',
            ],
          })}
          className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 soft-shadow active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <span className="text-primary font-black text-[10px]">Q3</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-0.5">Rangkuman Kinerja BMRI</h4>
              <span className="text-[10px] text-gray-400 font-medium">Laporan Kuartal III - 2026</span>
            </div>
          </div>
          <ul className="text-[10px] leading-relaxed text-gray-500 font-medium list-disc pl-4 space-y-1">
            <li>Laba BMRI naik 15% (melampaui estimasi pasar).</li>
            <li>NPL (Kredit Macet) membaik.</li>
            <li>Pertumbuhan kredit solid.</li>
          </ul>
        </button>
      </div>

      {/* Macroeconomic Correlation */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-3 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-primary stroke-[2.2]" />
          KORELASI MAKRO
        </h3>
        <button
          type="button"
          onClick={() => setSelectedInsight({
            title: 'Keputusan Suku Bunga BI',
            eyebrow: 'Korelasi Makro',
            tone: 'amber',
            summary: 'Suku bunga BI yang ditahan di 6.00% memberi ruang sentimen positif bagi bank besar.',
            metrics: [
              { label: 'BI Rate', value: '6.00%' },
              { label: 'Dampak', value: 'Positif' },
              { label: 'Sektor', value: 'Perbankan' },
              { label: 'Durasi', value: 'Menengah' },
            ],
            points: [
              'Stabilitas suku bunga dapat membantu ekspektasi biaya dana.',
              'Bank besar biasanya lebih cepat menyerap sentimen makro positif.',
              'Tetap pantau inflasi dan arah kebijakan global sebagai risiko lanjutan.',
            ],
          })}
          className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 soft-shadow active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          <h4 className="text-xs font-bold text-gray-900 mb-1">Keputusan Suku Bunga BI</h4>
          <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
            Suku bunga acuan BI ditahan di 6.00%. Ini menjadi katalis positif bagi emiten perbankan besar.
          </p>
        </button>
      </div>

      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-4 pb-4 pt-16 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Tutup detail wawasan"
            onClick={() => setSelectedInsight(null)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="insight-detail-title"
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 fade-in duration-200"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${toneClasses[selectedInsight.tone]}`}>
                  {selectedInsight.eyebrow}
                </span>
                <h3 id="insight-detail-title" className="mt-3 text-lg font-black tracking-tight text-gray-950">
                  {selectedInsight.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                aria-label="Tutup"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-xs font-semibold leading-relaxed text-gray-600">
              {selectedInsight.summary}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {selectedInsight.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{metric.label}</span>
                  <span className="mt-1 block text-xs font-black text-gray-900">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-3.5">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-black text-primary">
                <Lightbulb className="h-3.5 w-3.5" />
                Detail Analisis
              </h4>
              <ul className="space-y-2 text-xs font-medium leading-relaxed text-gray-600">
                {selectedInsight.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedInsight.actionLabel && selectedInsight.onAction && (
              <button
                type="button"
                onClick={() => {
                  const action = selectedInsight.onAction;
                  setSelectedInsight(null);
                  action?.();
                }}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              >
                {selectedInsight.actionLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer footer */}
      <div className="px-5">
        <p className="text-xs text-gray-400 font-medium leading-relaxed text-center mt-2">
          Penafian: Keputusan investasi sepenuhnya berada di tangan investor. Data Wawasan AI disajikan sebagai referensi pendukung dan tidak menjamin keuntungan pasti. Kinerja masa lalu tidak mencerminkan hasil di masa depan.
        </p>
      </div>
    </div>
  );
}
