/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, ArrowRight, Award, RotateCcw, Heart, TrendingUp, Target } from 'lucide-react';
import { Screen, UserProfile } from '../types';
import NeoVestLogo from './NeoVestLogo';

interface RiskProfileQuizViewsProps {
  currentScreen: Screen;
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpdateUserProfile: (updates: Partial<UserProfile>) => void;
}

export default function RiskProfileQuizViews({
  currentScreen,
  userProfile,
  onNavigate,
  onUpdateUserProfile,
}: RiskProfileQuizViewsProps) {
  // Questionnaire active index
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const questions = [
    {
      title: 'Apa tujuan utama rencana investasi keuangan Anda?',
      options: [
        { label: 'Menjaga nilai pokok modal agar aman dari inflasi dasar.', points: 1 },
        { label: 'Menyiapkan dana jangka menengah seperti uang muka rumah atau pendidikan anak.', points: 2 },
        { label: 'Memaksimalkan pertumbuhan aset jangka panjang berskala besar.', points: 3 },
        { label: 'Mendapatkan keuntungan trading spekulatif secepat mungkin.', points: 4 },
      ],
    },
    {
      title: 'Berapa lama jangka waktu rencana penempatan investasi Anda?',
      options: [
        { label: 'Kurang dari 1 tahun (Jangka Pendek)', points: 1 },
        { label: '1 - 3 tahun (Jangka Menengah-Pendek)', points: 2 },
        { label: '3 - 5 tahun (Jangka Menengah)', points: 3 },
        { label: 'Lebih dari 5 tahun (Jangka Panjang)', points: 4 },
      ],
    },
    {
      title: 'Bagaimana reaksi Anda jika nilai portofolio anjlok turun 20% dalam sebulan?',
      options: [
        { label: 'Sangat panik dan segera melakukan likuidasi total untuk menghindari kerugian lanjutan.', points: 1 },
        { label: 'Khawatir namun tetap menahan posisi investasi demi pemulihan jangka panjang.', points: 2 },
        { label: 'Mengambil peluang untuk menambah investasi di harga diskon (DCA).', points: 3 },
        { label: 'Sangat senang dan memanfaatkan leverage trading margin tingkat tinggi.', points: 4 },
      ],
    },
    {
      title: 'Berapa bagian porsi pendapatan bulanan Anda yang siap dialokasikan?',
      options: [
        { label: 'Kurang dari 10% pendapatan bulanan.', points: 1 },
        { label: '10% - 20% pendapatan bulanan.', points: 2 },
        { label: '25% - 40% pendapatan bulanan.', points: 3 },
        { label: 'Lebih dari 40% pendapatan bulanan.', points: 4 },
      ],
    }
  ];

  const handleSelectOption = (points: number) => {
    const updatedScores = [...scores, points];
    setScores(updatedScores);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finished all questions, compute profile category!
      const totalScore = updatedScores.reduce((acc, c) => acc + c, 0);
      let calculatedProfile: 'Konservatif' | 'Moderat' | 'Agresif' = 'Moderat';

      if (totalScore <= 6) {
        calculatedProfile = 'Konservatif';
      } else if (totalScore <= 12) {
        calculatedProfile = 'Moderat';
      } else {
        calculatedProfile = 'Agresif';
      }

      onUpdateUserProfile({
        riskProfile: calculatedProfile,
      });
      onNavigate('RiskProfileResult');
    }
  };

  const resetQuizProcess = () => {
    setCurrentQuestion(0);
    setScores([]);
    onNavigate('RiskProfileQuiz');
  };

  // Dedicated asset allocation specifications based on computed profile
  const allocations: Record<'Konservatif' | 'Moderat' | 'Agresif', { name: string; percentage: number; colorClass: string; wStyle: string }[]> = {
    Konservatif: [
      { name: 'Kas & Deposito Terbuka', percentage: 40, colorClass: 'bg-teal-500', wStyle: '40%' },
      { name: 'Obligasi Pemerintah / SBN', percentage: 40, colorClass: 'bg-amber-500', wStyle: '40%' },
      { name: 'Saham Kualitas Blue Chip', percentage: 15, colorClass: 'bg-primary', wStyle: '15%' },
      { name: 'Reksadana Campuran', percentage: 5, colorClass: 'bg-purple-550', wStyle: '5%' },
    ],
    Moderat: [
      { name: 'Saham Kualitas Blue Chip', percentage: 40, colorClass: 'bg-primary', wStyle: '40%' },
      { name: 'Obligasi / SBN Jangka Menengah', percentage: 30, colorClass: 'bg-amber-500', wStyle: '30%' },
      { name: 'Reksadana Campuran & Emas', percentage: 20, colorClass: 'bg-teal-500', wStyle: '20%' },
      { name: 'Kas Likuid & Deposito', percentage: 10, colorClass: 'bg-slate-300', wStyle: '10%' },
    ],
    Agresif: [
      { name: 'Saham Kualitas Blue Chip (DCA)', percentage: 50, colorClass: 'bg-primary', wStyle: '50%' },
      { name: 'Saham Sektor Bertumbuh (Mid Cap)', percentage: 25, colorClass: 'bg-purple-600', wStyle: '25%' },
      { name: 'Obligasi / SBN Kupon Tetap', percentage: 15, colorClass: 'bg-amber-500', wStyle: '15%' },
      { name: 'Emas Fisik & Reksa Dana', percentage: 10, colorClass: 'bg-teal-500', wStyle: '10%' },
    ],
  };

  const activeAllocations = allocations[userProfile.riskProfile || 'Moderat'];

  if (currentScreen === 'RiskProfileQuiz') {
    return (
      <div id="risk-quiz-screen" className="flex flex-col h-full bg-white px-5 pt-8 pb-4 justify-between overflow-y-auto no-scrollbar">
        {/* Onboarding top checklist bar */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs font-bold text-gray-400">
              <span>Uji Profil Risiko</span>
              <span className="block">Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
            </div>
            <NeoVestLogo />
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex gap-2 items-center bg-primary-light p-3.5 rounded-2xl border border-primary/10 mb-5">
            <HelpCircle className="w-5 h-5 text-primary shrink-0 stroke-[2.2]" />
            <p className="text-xs text-primary font-bold leading-normal">
              Bantu NeoVest me-rekomendasikan portofolio terbaik sesuai ketahanan emosional keuangan Anda.
            </p>
          </div>

          <h3 className="text-sm font-black text-gray-950 mb-5 leading-normal">
            {questions[currentQuestion].title}
          </h3>

          <div className="flex flex-col gap-3">
            {questions[currentQuestion].options.map((opt, optIndex) => (
              <button
                key={optIndex}
                id={`quiz-opt-${optIndex}`}
                onClick={() => handleSelectOption(opt.points)}
                className="w-full text-left p-4 rounded-2xl border border-gray-100 bg-white hover:border-primary/50 hover:bg-gray-50/50 transition-all text-xs font-semibold leading-relaxed text-gray-800 soft-shadow flex items-start gap-2 focus:outline-none"
              >
                <span className="font-extrabold text-primary shrink-0">{String.fromCharCode(65 + optIndex)}.</span>
                <span className="font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigate('Profile')}
          className="text-center text-xs font-semibold text-gray-400 hover:text-gray-600 mt-6"
        >
          Batal &amp; Kembali ke Profil
        </button>
      </div>
    );
  }

  if (currentScreen === 'RiskProfileResult') {
    return (
      <div id="risk-result-screen" className="flex flex-col h-full bg-surface-bg px-5 pt-6 pb-4 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="font-extrabold text-[#001a41] text-sm">Hasil Risiko</span>
          <NeoVestLogo />
        </div>

        {/* Card Body Container */}
        <div className="bg-white rounded-3xl p-5 soft-shadow border border-gray-100 flex-1 flex flex-col justify-between">
          <div className="text-center pt-2">
            <div className="w-14 h-14 bg-accent/20 text-accent-dark rounded-full flex items-center justify-center mx-auto mb-3.5">
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Profil Risiko Kamu</span>
            
            <span id="risk-profile-result-badge" className="bg-accent text-dark-blue font-black tracking-wide px-5 py-1.5 rounded-full text-xs uppercase inline-block shadow-sm mt-1.5 mb-4">
              {userProfile.riskProfile}
            </span>

            {/* Explanation box */}
            <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-6 bg-gray-50 p-3.5 rounded-2xl border border-gray-100/50">
              {userProfile.riskProfile === 'Konservatif' && 'Anda memprioritaskan keamanan modal utama di atas keuntungan eskalatif. Skenario fluktuasi pasar yang sangat kecil sudah sesuai dengan kenyamanan Anda.'}
              {userProfile.riskProfile === 'Moderat' && 'Anda mencari keseimbangan optimal antara pertumbuhan modal jangka panjang dan toleransi risiko jangka pendek yang terukur.'}
              {userProfile.riskProfile === 'Agresif' && 'Anda siap menghadapi fluktuasi harga saham yang ekstrem demi mengejar potensi hasil imbal investasi eksponensial di masa depan.'}
            </p>

            {/* Asset allocation progress columns */}
            <div className="text-left mb-6">
              <span className="text-xs font-bold text-gray-900 block mb-3.5 uppercase tracking-wide">Rekomendasi Alokasi Aset</span>

              <div className="flex flex-col gap-3">
                {activeAllocations.map((alloc, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1">
                      <span>{alloc.name}</span>
                      <span className="font-extrabold text-gray-950">{alloc.percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${alloc.colorClass} h-full rounded-full transition-all duration-500`}
                        style={{ width: alloc.wStyle }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Tips */}
            <div className="text-left border-t border-gray-150 pt-4 bg-transparent mb-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">Saran Ahli Analis</span>
              <ul className="flex flex-col gap-2">
                <li className="text-xs text-gray-650 font-medium leading-relaxed flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Terapkan metode Dollar Cost Averaging (DCA) agar akumulasi posisi stabil.</span>
                </li>
                <li className="text-xs text-gray-650 font-medium leading-relaxed flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Lakukan evaluasi ulang profil risiko Anda setiap 6 bulan sekali.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-6 w-full">
            <button
              id="risk-inspect-ai-btn"
              onClick={() => onNavigate('Insight')}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              Lihat Rekomendasi Saham AI
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="risk-retake-btn"
              onClick={resetQuizProcess}
              className="w-full h-11 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
              Ulangi Tes Profil Risiko
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
