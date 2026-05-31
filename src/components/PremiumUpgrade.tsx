/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Star, Award, ShieldAlert, CreditCard } from 'lucide-react';
import { Screen, UserProfile } from '../types';

interface PremiumUpgradeProps {
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpgradeSuccess: () => void;
}

export default function PremiumUpgrade({
  userProfile,
  onNavigate,
  onUpgradeSuccess,
}: PremiumUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [paymentFinished, setPaymentFinished] = useState(false);

  const perks = [
    'Rekomendasi emiten harian bertenaga AI dengan akurasi & tingkat keyakinan model tinggi (>80%).',
    'Evaluasi portofolio otomatis & anjuran rebalancing sektoral taktis harian.',
    'Akses grup diskusi forum VIP terverifikasi bersama analis bersertifikat CSA.',
    'Undangan prioritas ke Webinar interaktif eksklusif setiap akhir pekan.',
    'Bebas biaya administrasi penarikan saldo RDN ke rekening bank terdaftar.',
    'Layanan dukungan pelanggan prioritas 24 jam penuh.'
  ];

  const handleStartUpgrade = () => {
    setShowBillingModal(true);
  };

  const handlePayConfirm = () => {
    setPaymentFinished(true);
    onUpgradeSuccess();
  };

  return (
    <div id="premium-upgrade-view" className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto no-scrollbar pb-6 pt-5">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 mb-5">
        <button
          onClick={() => onNavigate('Home')}
          className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white focus:outline-none"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <span className="font-extrabold text-accent text-xs uppercase tracking-widest flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-accent" /> PREMIUM
        </span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Hero Header Area */}
      <div className="text-center px-6 mb-6">
        <div className="w-13 h-13 mx-auto bg-gradient-to-tr from-accent to-yellow-600 rounded-3xl flex items-center justify-center mb-3 shadow overflow-hidden animate-pulse">
          <Sparkles className="w-6 h-6 text-dark-blue stroke-[2.2]" />
        </div>
        <h2 className="text-lg font-black tracking-tight text-white leading-snug">
          Buka Kecerdasan Investasi Tanpa Batas
        </h2>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed px-2 font-medium">
          Dapatkan akurasi analisis AI terbaik untuk maksimalkan profit portofolio Anda hari ini bersama NeoVest Elite.
        </p>
      </div>

      {/* Perks Checklist Cards Panel */}
      <div className="px-5 mb-6">
        <div className="bg-white/5 rounded-3xl border border-white/10 p-5 backdrop-blur-xs flex flex-col gap-4">
          <span className="text-xs text-[#fecb00] font-bold tracking-wider block uppercase">FITUR VIP PREMIUM ELITE</span>

          <div className="flex flex-col gap-3.5">
            {perks.map((perk, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-300">
                <div className="w-4.5 h-4.5 bg-[#fecb00]/10 rounded-full flex items-center justify-center text-[#fecb00] shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="leading-relaxed font-semibold">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selector premium plans options */}
      <div className="px-5 mb-6">
        <div className="flex flex-col gap-3.5">
          {/* Monthly */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-colors ${
              selectedPlan === 'monthly' ? 'bg-primary/25 border-accent' : 'bg-white/5 border-white/10'
            }`}
          >
            <div>
              <span className="text-xs font-black block">Paket Bulanan</span>
              <span className="text-xs text-gray-500 font-medium block mt-1">Dapat dibatalkan kapan saja</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black block text-white">Rp 99.000</span>
              <span className="text-xs text-gray-400 font-semibold block mt-0.5">/ Bulan</span>
            </div>
          </div>

          {/* Yearly (Best Value) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-colors relative overflow-hidden ${
              selectedPlan === 'yearly' ? 'bg-primary/25 border-accent' : 'bg-white/5 border-white/10'
            }`}
          >
            {/* Promo banner badge */}
            <div className="absolute top-0 right-0 bg-accent text-dark-blue text-xs font-black px-2 mt-0 rounded-bl">
              HEMAT 30%
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black block">Paket Tahunan</span>
                <span className="bg-accent/20 text-accent text-xs font-black px-1.5 py-0.5 rounded uppercase">POPULER</span>
              </div>
              <span className="text-xs text-gray-500 font-medium block mt-1">Lebih hemat dan stabil jangka panjang</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black block text-accent">Rp 799.000</span>
              <span className="text-xs text-gray-400 font-semibold block mt-0.5">/ Tahun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proceed CTA button on bottom bar */}
      <div className="px-5 mb-4">
        {userProfile.isPremium ? (
          <div className="bg-green-650 p-3 rounded-2xl text-center text-xs font-bold border border-green-500/30 text-green-300 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-green-300 shrink-0" />
            <span>Anda Sudah Berlangganan Premium! Nikmati semua fitur VIP Anda.</span>
          </div>
        ) : (
          <button
            id="premium-purchase-btn"
            onClick={handleStartUpgrade}
            className="w-full h-12 bg-accent hover:bg-accent-dark text-dark-blue font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow transition-all active:scale-[0.98]"
          >
            <span>Berlangganan Sekarang</span>
            <Sparkles className="w-4 h-4 fill-dark-blue shrink-0" />
          </button>
        )}
      </div>

      {/* BILLING CONFIRMATION DIALOG MODAL */}
      {showBillingModal && (
        <div className="absolute inset-0 bg-dark-blue/80 backdrop-blur-xs flex items-center justify-center z-50 p-5">
          <div className="bg-white text-gray-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl animate-scaleIn duration-200 text-center">
            
            {!paymentFinished ? (
              <div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-gray-950 block">Konfirmasi Pembayaran</h3>
                
                <p className="text-xs text-gray-500 leading-relaxed font-semibold my-4 px-2">
                  Saldo RDN VA Anda akan didebet sebesar <span className="font-extrabold text-primary">{selectedPlan === 'yearly' ? 'Rp 799.000' : 'Rp 99.000'}</span> untuk langganan NeoVest Premium {selectedPlan === 'yearly' ? 'Tahunan' : 'Bulanan'}.
                </p>

                {userProfile.balance < (selectedPlan === 'yearly' ? 799000 : 99000) ? (
                  <div className="p-3 bg-red-50 text-red-655 rounded-xl text-xs font-bold leading-normal mb-4 flex items-center gap-1.5 text-red-600">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-600 shrink-0" />
                    <span>Saldo RDN Rincian Anda tidak mencukupi. Silakan lakukan Top Up atau ganti metode pembayaran.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5 mt-5">
                    <button
                      id="premium-confirm-pay-btn"
                      onClick={handlePayConfirm}
                      className="w-full h-11 bg-primary text-white text-xs font-bold rounded-2xl"
                    >
                      Konfirmasi &amp; Debet Saldo RDN
                    </button>
                    
                    <button
                      onClick={() => setShowBillingModal(false)}
                      className="text-xs text-gray-400 font-semibold focus:outline-none hover:text-gray-600"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3.5">
                  <Check className="w-6 h-6 stroke-[3.5]" />
                </div>
                <h3 className="text-xs font-black text-gray-950 block">Langganan Aktif!</h3>
                <span className="text-xs text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded font-bold uppercase inline-flex items-center gap-1 my-2">
                  <span>NeoVest VIP Elite</span>
                  <Star className="w-3 h-3 fill-teal-600 text-teal-600 shrink-0" />
                </span>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold my-4 px-3">
                  Terima kasih! Pembayaran Anda sukses diproses. Semua fitur Wawasan AI, penyeimbangan ulang otomatis, dan webinar VIP sekarang telah terbuka 100%!
                </p>

                <button
                  id="premium-done-go-home"
                  onClick={() => {
                    setShowBillingModal(false);
                    setPaymentFinished(false);
                    onNavigate('Home');
                  }}
                  className="w-full h-11 bg-primary text-white text-xs font-black rounded-2xl mt-3"
                >
                  Yuk Mulai Eksplorasi!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
