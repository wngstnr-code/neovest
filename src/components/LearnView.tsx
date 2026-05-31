/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle, ChevronRight, Bookmark, Play, Video } from 'lucide-react';
import { LearnModule, Screen } from '../types';

interface LearnViewProps {
  modules: LearnModule[];
  onNavigate: (screen: Screen) => void;
  onUpdateProgress: (moduleId: string, newProgress: number) => void;
}

export default function LearnView({
  modules,
  onNavigate,
  onUpdateProgress,
}: LearnViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Pemula' | 'Fundamental' | 'Teknikal'>('Semua');
  const [registeredWebinar, setRegisteredWebinar] = useState(false);
  
  // Interactive knowledge quiz states
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const quizQuestions = [
    {
      question: 'Apa definisi mendasar dari saham?',
      options: [
        'Surat utang negara yang dijamin bunga tetap',
        'Bukti kepemilikan nilai atas suatu bagian perusahaan',
        'Mata uang digital yang digunakan untuk transaksi global',
        'Asuransi perlindungan kerugian modal'
      ],
      correctIndex: 1,
    },
    {
      question: 'Apa arti dari Price to Earnings Ratio (PER) yang rendah?',
      options: [
        'Perusahaan rawan bangkrut dalam waktu singkat',
        'Harga saham relatif murah dibanding laba bersih per saham',
        'Dividen yang disetujui dipotong secara besar',
        'Suku bunga sedang mengalami tren kenaikan'
      ],
      correctIndex: 1,
    },
    {
      question: 'Metode analisis saham dengan mengamati grafik dan pola volume transaksi disebut...',
      options: [
        'Analisis Fundamental',
        'Analisis Teknikal',
        'Analisis Sentiment',
        'Analisis Kuantitatif'
      ],
      correctIndex: 1,
    }
  ];

  const filteredModules = modules.filter((m) => {
    return selectedCategory === 'Semua' || m.category === selectedCategory;
  });

  const handleLanjutkanBelajar = () => {
    // Increment progress of first module to simulate study progress!
    const testMo = modules[0];
    const newProg = Math.min((testMo.progress || 35) + 15, 100);
    onUpdateProgress(testMo.id, newProg);
    alert(`Bagus! Kamu membaca materi baru. Progress belajar kamu meningkat ke ${newProg}%!`);
  };

  const submitAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[activeQuestion].correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (activeQuestion + 1 < quizQuestions.length) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setActiveQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setShowResult(false);
    setShowQuizModal(false);
  };

  return (
    <div id="learn-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      {/* Top Header */}
      <div className="px-5 mb-5">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Belajar Investasi</h2>
        <p className="text-[10px] text-gray-400 font-medium">Tingkatkan pengetahuan finansialmu hari ini.</p>
      </div>

      {/* Interactive learning circular progress card */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 soft-shadow flex flex-col items-center">
          {/* Circular dial progress visual */}
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#0059bb"
                strokeWidth="2.5"
                strokeDasharray="35 100"
                strokeLinecap="round"
                className="transition-all"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-gray-950">35%</span>
              <span className="text-[8px] text-gray-400 font-bold block mt-0.5">Selesai</span>
            </div>
          </div>

          <div className="text-center mb-4 px-2">
            <h4 className="text-xs font-bold text-gray-900 leading-tight">Progress Belajar</h4>
            <p className="text-[11px] text-gray-500 font-medium mt-1">
              Kamu sedang berada di jalur yang tepat! Lanjutkan membaca modul <span className="text-primary font-bold">Analisis Fundamental</span>.
            </p>
          </div>

          <button
            id="learn-continue-btn"
            onClick={handleLanjutkanBelajar}
            className="w-full h-10.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold soft-shadow transition-all active:scale-[0.98]"
          >
            Lanjutkan Belajar
          </button>
        </div>
      </div>

      {/* Category Horizontal filter tab pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 mb-5 shrink-0">
        {(['Semua', 'Pemula', 'Fundamental', 'Teknikal'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap focus:outline-none ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Rekomendasi Modul lists */}
      <div className="px-5 mb-6">
        <span className="text-xs font-black text-gray-900 block mb-3.5 tracking-wide">REKOMENDASI MODUL</span>

        <div className="flex flex-col gap-4">
          {filteredModules.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden soft-shadow flex flex-col hover:scale-[1.01] transition-transform"
            >
              {/* Decorative top header accent based on category */}
              <div className="h-2 bg-primary/10" />

              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2.5">
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${m.tagClass}`}>
                    {m.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{m.durationMinutes} Menit</span>
                </div>

                <h4 className="text-xs font-black text-gray-900 leading-tight mb-2">{m.title}</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-4">{m.description}</p>

                {/* Progress metadata indicator */}
                <div className="flex justify-between items-center mt-3 text-[10px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>{m.modules} Bab Modul</span>
                  </div>
                  <span>{m.progress}% Selesai</span>
                </div>

                <div className="w-full bg-gray-100 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock knowledge micro quiz banner card */}
      <div className="px-5 mb-6">
        <div className="bg-blue-50 border border-blue-100/60 rounded-3xl p-5 soft-shadow text-center">
          <div className="w-11 h-11 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-3 text-sm font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-1.5">Tes Pemahaman Saham Dasar</h3>
          <p className="text-[11px] text-gray-500 font-medium leading-normal mb-4">
            Uji pengetahuanmu dan dapatkan poin NeoVest! Selesaikan mini quiz 3-langkah ini untuk membuka lencana pemula.
          </p>
          <button
            id="learn-start-quiz-btn"
            onClick={() => setShowQuizModal(true)}
            className="bg-accent hover:bg-accent-dark text-dark-blue font-bold text-xs px-6 py-2 rounded-full shadow-md active:scale-95 transition-all"
          >
            Mulai Quiz Sekarang
          </button>
        </div>
      </div>

      {/* Webinar Promo class visual */}
      <div className="px-5">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden soft-shadow border border-slate-800">
          <div className="h-28 bg-gradient-to-br from-primary via-primary-dark to-slate-900 p-5 flex flex-col justify-between relative">
            <div className="absolute right-4 top-4 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-bold text-accent uppercase tracking-wider">
              Webinar
            </div>
            <div className="w-8 h-8 rounded-full bg-accent text-dark-blue flex items-center justify-center animate-bounce">
              <Video className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] text-white/75 font-semibold">Webinar LIVE Akhir Pekan</span>
          </div>

          <div className="p-5">
            <span className="bg-accent text-dark-blue text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wide inline-block mb-1.5">
              WEBINAR
            </span>
            <h4 className="text-xs font-black leading-tight text-white">Cara Membaca Candlestick &amp; Trend line Praktis</h4>
            <span className="text-[10px] text-gray-400 font-medium mt-1 block">Budi Santoso, Analis Senior NeoVest</span>

            <div className="flex gap-4 items-center justify-between border-t border-slate-800/80 mt-4.5 pt-4 bg-transparent">
              <div className="text-left">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Waktu Mulai</span>
                <span className="text-xs font-bold text-white mt-0.5 block">Besok, 19:00 WIB</span>
              </div>

              <button
                id="learn-register-webinar-btn"
                onClick={() => {
                  setRegisteredWebinar(true);
                  alert('Selamat! Anda terdaftar dalam webinar "Cara Membaca Candlestick". Tautan Zoom akan dikirim ke email Anda.');
                }}
                disabled={registeredWebinar}
                className={`h-9 border text-[10px] font-bold rounded-xl px-4 flex items-center justify-center transition-all ${
                  registeredWebinar 
                    ? 'border-transparent bg-teal-600 text-white' 
                    : 'border-primary bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {registeredWebinar ? 'Terdaftar' : 'Daftar Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ INTERACTIVE DIALOG MODAL IF ACTIVE */}
      {showQuizModal && (
        <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-xs flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl w-full max-w-sm soft-shadow-lg p-5 flex flex-col justify-between animate-fadeIn duration-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-accent stroke-[2.5]" />
                <span className="text-xs font-black text-gray-900">Quiz Pemahaman Saham</span>
              </div>
              <button onClick={resetQuiz} className="text-gray-400 font-bold text-sm focus:outline-none hover:text-gray-600">
                X
              </button>
            </div>

            {!showResult ? (
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-[10px] text-gray-450 font-bold mb-1.5">
                  <span>Pertanyaan {activeQuestion + 1} dari {quizQuestions.length}</span>
                  <span>{Math.round(((activeQuestion + 1) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${((activeQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                <h3 className="text-xs font-black text-gray-900 leading-relaxed mb-4">
                  {quizQuestions[activeQuestion].question}
                </h3>

                <div className="flex flex-col gap-2">
                  {quizQuestions[activeQuestion].options.map((opt, oIndex) => {
                    const isSelected = selectedAnswer === oIndex;
                    const isCorrect = oIndex === quizQuestions[activeQuestion].correctIndex;
                    return (
                      <button
                        key={oIndex}
                        onClick={() => {
                          if (selectedAnswer === null) submitAnswer(oIndex);
                        }}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-3.5 text-xs rounded-2xl border transition-all flex items-start gap-2 focus:outline-none ${
                          selectedAnswer === null
                            ? 'border-gray-100 hover:border-primary/40 hover:bg-gray-50'
                            : isSelected
                            ? isCorrect
                              ? 'border-green-400 bg-green-50/70 text-green-800'
                              : 'border-red-400 bg-red-50/70 text-red-800'
                            : isCorrect
                            ? 'border-green-400 bg-green-50/70 text-green-800'
                            : 'border-gray-100 text-gray-405'
                        }`}
                      >
                        <span className="font-extrabold">{String.fromCharCode(65 + oIndex)}.</span>
                        <span className="font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <button
                    onClick={nextQuestion}
                    className="w-full h-11 bg-primary text-white text-xs font-bold rounded-2xl flex items-center justify-center mt-5"
                  >
                    {activeQuestion + 1 === quizQuestions.length ? 'Selesai &amp; Hasil' : 'Pertanyaan Selanjutnya'}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Award className="w-12 h-12 text-accent mx-auto mb-3" />
                <h3 className="text-xs font-black text-gray-900 block mb-1">Hasil Quiz Kamu</h3>
                
                <div className="text-3xl font-black text-primary my-4">
                  {quizScore} / {quizQuestions.length}
                </div>

                <p className="text-xs text-gray-500 leading-relaxed font-semibold px-4 mb-5">
                  {quizScore === quizQuestions.length 
                    ? 'Luar biasa! Kamu memahami dasar investasi saham dengan sempurna! Lencana "Saham Master" telah ditambahkan ke profil Anda.'
                    : 'Bagus sekali! Pelajari beberapa modul lagi untuk memaksimalkan kecerdasan analisis fundamental Anda.'}
                </p>

                <button
                  onClick={resetQuiz}
                  className="w-full h-11 bg-primary text-white text-xs font-bold rounded-2xl"
                >
                  Selesai &amp; Kembali Belajar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
