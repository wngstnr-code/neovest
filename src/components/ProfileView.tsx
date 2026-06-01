/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Shield, LogOut, CheckCircle, Globe, Landmark, Award, Sun, Moon, Eye, EyeOff, Headphones, MessageCircle, PhoneCall, Mail } from 'lucide-react';
import { UserProfile, Screen } from '../types';
import NeoVestLogo from './NeoVestLogo';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (screen: Screen) => void;
}

export default function ProfileView({
  userProfile,
  onUpdateUserProfile,
  onNavigate,
}: ProfileViewProps) {
  const [showKycModal, setShowKycModal] = useState(false);
  const [showCustomerServiceModal, setShowCustomerServiceModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Switch user profile identity for fast prototype testing
  const toggleIdentity = () => {
    if (userProfile.fullName === 'Talita Feby') {
      onUpdateUserProfile({
        fullName: 'Olitha Kaisha',
        email: 'alex.turner@gmail.com',
        isPremium: true,
        riskProfile: 'Agresif',
      });
    } else {
      onUpdateUserProfile({
        fullName: 'Talita Feby',
        email: 'talita.wijaya@gmail.com',
        isPremium: false,
        riskProfile: 'Moderat',
      });
    }
  };

  const handleBiometricToggle = () => {
    onUpdateUserProfile({
      biometricsEnabled: !userProfile.biometricsEnabled,
    });
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div id="profile-view" className="flex flex-col h-full bg-surface-bg overflow-y-auto no-scrollbar pb-24 rounded-t-3xl pt-5">
      {/* Top Header */}
      <div className="px-5 mb-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Akun Saya</h2>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-gray-400 font-bold">Ver v1.0.8</span>
          <NeoVestLogo compact />
        </div>
      </div>

      {/* User Information Display Card with toggle possibility */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 soft-shadow flex items-start justify-between relative overflow-hidden">
          {userProfile.isPremium && (
            <div className="absolute top-0 right-0 h-10 w-10 bg-accent/20 rounded-bl-3xl flex items-center justify-center">
              <Award className="w-5 h-5 text-accent-dark" />
            </div>
          )}

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
              <User className="w-6 h-6 stroke-[2.4]" />
            </div>
            
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-black text-[#001a41]">{userProfile.fullName}</h3>
                {userProfile.isPremium ? (
                  <span className="bg-amber-100 text-amber-700 text-xs font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Premium
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate('PremiumUpgrade')}
                    className="bg-primary/5 text-primary text-xs font-black px-1.5 py-0.5 rounded-full uppercase hover:bg-primary-light"
                  >
                    Tingkatkan
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 font-medium tracking-normal mt-0.5">{userProfile.email}</p>
              <p className="text-xs text-primary font-bold mt-1.5 cursor-pointer block hover:underline" onClick={toggleIdentity}>
                Ganti Pengguna (Simulasi)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank balance credentials */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-tr from-[#001a41] to-primary-dark rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <span className="text-xs text-white/70 font-semibold block tracking-wider uppercase">Saldo RDN (Rekening Virtual)</span>
          <div className="flex items-center gap-3 mt-0.5">
            <h2 id="profile-rdn-balance" className="text-xl font-extrabold select-all">
              {showBalance ? formatIDR(userProfile.balance) : 'Rp •••••••'}
            </h2>
            <button
              type="button"
              onClick={() => setShowBalance((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:text-white transition-colors focus:outline-none"
              aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex justify-between items-center mt-3.5 border-t border-white/10 pt-3.5 bg-transparent">
            <div>
              <span className="text-xs text-white/50 font-bold block uppercase tracking-wider">Bank Kustodian</span>
              <span className="text-xs font-bold text-white mt-0.5 block">BANK MANDIRI (VA)</span>
            </div>

            <div>
              <span className="text-xs text-white/50 font-bold block uppercase tracking-wider">Nomor Rekening VA</span>
              <span className="text-xs font-mono font-bold text-accent tracking-widest block select-all">8802 0812 3456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Menu Settings options precisely matching Livin layout */}
      <div className="px-5 mb-6">
        <span className="text-xs font-black text-gray-900 block mb-3 uppercase tracking-wider">PREFERENSI PENGATURAN</span>

        <div className="bg-white rounded-3xl p-2 soft-shadow border border-gray-100 flex flex-col gap-1">
          {/* KYC Status Action Button */}
          <button
            onClick={() => setShowKycModal(true)}
            id="profile-kyc-check-btn"
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-left transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Status KYC</span>
                <span className="text-xs text-teal-600 font-bold mt-0.5 flex items-center gap-1">
                  <span>Akun Sudah Terverifikasi</span>
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full inline-block" />
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-300 font-bold">&gt;</span>
          </button>

          {/* Test Profil Risiko Button */}
          <button
            onClick={() => onNavigate('RiskProfileQuiz')}
            id="profile-retake-quiz-btn"
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-left transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Tes Profil Risiko</span>
                <span className="text-xs text-gray-400 font-medium block mt-0.5">Ubah profil risiko ({userProfile.riskProfile})</span>
              </div>
            </div>
            <span className="text-xs text-gray-300 font-bold">&gt;</span>
          </button>

          {/* Bank Accounts */}
          <div className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-left transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Rekening Bank Penarikan</span>
                <span className="text-xs text-gray-400 font-semibold block mt-0.5">BCA - **** 4567 aa/ Talita</span>
              </div>
            </div>
            <span className="text-xs text-gray-300 font-bold">&gt;</span>
          </div>

          {/* Language Selection preference option */}
          <div className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-left transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Bahasa Aplikasi</span>
                <span className="text-xs text-gray-400 font-medium block mt-0.5">Bahasa Indonesia</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-bold shrink-0">ID (Bahasa)</span>
          </div>

          {/* Customer Service */}
          <button
            type="button"
            onClick={() => setShowCustomerServiceModal(true)}
            id="profile-customer-service-btn"
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-left transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Customer Service</span>
                <span className="text-xs text-gray-400 font-medium block mt-0.5">Bantuan cepat untuk akun dan transaksi</span>
              </div>
            </div>
            <span className="text-xs text-gray-300 font-bold">&gt;</span>
          </button>

          {/* Theme Toggle */}
          <div className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-left transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center">
                {isDarkMode ? <Moon className="w-5 h-5 stroke-[2.2]" /> : <Sun className="w-5 h-5 stroke-[2.2]" />}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Tema Gelap</span>
                <span className="text-xs text-gray-400 font-medium block mt-0.5">Ubah tampilan ke mode gelap</span>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              id="profile-theme-toggle-switch"
              className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative flex items-center ${
                isDarkMode ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Log out CTA button exactly matching design layout */}
      <div className="px-5">
        <button
          id="profile-logout-btn"
          onClick={() => onNavigate('Welcome')}
          className="w-full h-11 border border-red-500 bg-red-500 hover:bg-red-600 text-white dark:border-[#9f1239] dark:bg-[#be123c] dark:hover:bg-[#9f1239] dark:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
        >
          <LogOut className="w-4.5 h-4.5 stroke-[2.5]" />
          Keluar dari Akun NeoVest
        </button>
      </div>

      {/* KYC VERIFIED DETAILED INTERACTIVE POPUP */}
      {showKycModal && (
        <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-xs flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-xl animate-fadeIn duration-200 text-center">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-sm font-black text-gray-950 block mb-1">Akun KYC Terverifikasi</h3>
            <span className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full font-bold uppercase inline-block my-2">
              Level 2 Pemula Terverifikasi
            </span>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold my-4 px-2">
              Selamat! Dokumen KTP, Swafoto, dan rekening bank kustodian Anda telah berhasil diproses KYC 100%. Anda memiliki hak penuh untuk membeli dan menjual saham tanpa batas limit penarikan.
            </p>

            <div className="flex flex-col gap-2.5 mt-5">
              <button
                id="kyc-close-btn"
                onClick={() => setShowKycModal(false)}
                className="w-full h-11 bg-primary text-white text-xs font-bold rounded-2xl"
              >
                Kembali ke Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER SERVICE POPUP */}
      {showCustomerServiceModal && (
        <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-xs flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-xl animate-fadeIn duration-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-950 block">Customer Service NeoVest</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                  Tim kami siap membantu kendala akun, KYC, deposit, dan transaksi.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/6281200000000"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4.5 h-4.5 stroke-[2.3]" />
                <div>
                  <span className="text-xs font-black block">Chat WhatsApp</span>
                  <span className="text-xs font-medium opacity-80">Respon cepat setiap hari</span>
                </div>
              </a>

              <a
                href="tel:1500888"
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-50 text-primary border border-blue-100 active:scale-[0.98] transition-all"
              >
                <PhoneCall className="w-4.5 h-4.5 stroke-[2.3]" />
                <div>
                  <span className="text-xs font-black block">Hotline 1500-888</span>
                  <span className="text-xs font-medium opacity-80">Senin-Jumat, 08.00-20.00 WIB</span>
                </div>
              </a>

              <a
                href="mailto:support@neovest.id"
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 text-gray-700 border border-gray-100 active:scale-[0.98] transition-all"
              >
                <Mail className="w-4.5 h-4.5 stroke-[2.3]" />
                <div>
                  <span className="text-xs font-black block">support@neovest.id</span>
                  <span className="text-xs font-medium opacity-80">Untuk laporan detail dan dokumen</span>
                </div>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomerServiceModal(false)}
              className="w-full h-11 bg-primary text-white text-xs font-bold rounded-2xl mt-5"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
