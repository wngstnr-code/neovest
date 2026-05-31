/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Phone, Check } from 'lucide-react';
import { Screen, UserProfile } from '../types';

interface LandingViewsProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLoginSuccess: (userData: Partial<UserProfile>) => void;
}

export default function LandingViews({ currentScreen, onNavigate, onLoginSuccess }: LandingViewsProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration States
  const [fullName, setFullName] = useState('Talita Wijaya');
  const [email, setEmail] = useState('talita.wijaya@gmail.com');
  const [phone, setPhone] = useState('081234567890');
  const [password, setPassword] = useState('Rahasia123');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorInput, setErrorInput] = useState('');

  // Login States
  const [loginEmail, setLoginEmail] = useState('nama@email.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Simple strength meter calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Lemah', color: 'bg-gray-200', score: 0 };
    if (password.length < 5) return { label: 'Lemah', color: 'bg-red-500', score: 1 };
    if (password.length < 8) return { label: 'Sedang', color: 'bg-amber-500', score: 2 };
    return { label: 'Kuat', color: 'bg-green-500', score: 3 };
  };

  const strength = getPasswordStrength();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) {
      setErrorInput('Mohon isi semua data.');
      return;
    }
    if (!agreeTerms) {
      setErrorInput('Anda harus menyetujui Syarat dan Ketentuan.');
      return;
    }
    setErrorInput('');
    onLoginSuccess({
      fullName,
      email,
      phone,
    });
    onNavigate('Home');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorInput('Mohon masukkan email dan kata sandi.');
      return;
    }
    setErrorInput('');
    const nameMatch = loginEmail.split('@')[0];
    const cleanName = nameMatch.charAt(0).toUpperCase() + nameMatch.slice(1);
    onLoginSuccess({
      fullName: cleanName || 'Alex Turner',
      email: loginEmail,
    });
    onNavigate('Home');
  };

  if (currentScreen === 'Welcome') {
    return (
      <div id="welcome-screen" className="flex flex-col h-full bg-white px-6 py-8 justify-between">
        {/* Top Space */}
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            {/* Elegant NeoVest Logo Emblem */}
            <div className="p-4 bg-primary/5 rounded-2xl mb-4 soft-shadow">
              <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V12C3 17.5 7.2 21.4 12 22C16.8 21.4 21 17.5 21 12V7L12 2Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9 14.5L11.5 12L14.5 15L19 9.5" stroke="#fecb00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 13L8.5 15.5L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary font-sans">NeoVest</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="text-center px-2">
          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-3">
            Investasi Cerdas,<br />Masa Depan Berkelas
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            Mulai perjalanan finansial Anda dengan platform investasi digital yang cerdas, aman, dan didukung analisis AI terlengkap.
          </p>
        </div>

        {/* Buttons / Bottom action */}
        <div className="flex flex-col gap-3 w-full mb-4">
          <button
            id="welcome-start-btn"
            onClick={() => onNavigate('Register')}
            className="w-full h-13 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full flex items-center justify-center gap-2 soft-shadow-lg transition-transform active:scale-[0.98]"
          >
            Mulai Sekarang
          </button>

          <button
            id="welcome-login-btn"
            onClick={() => {
              setErrorInput('');
              onNavigate('Login');
            }}
            className="w-full h-13 bg-primary-light hover:bg-primary-light/80 text-primary font-semibold rounded-full flex items-center justify-center transition-transform active:scale-[0.98]"
          >
            Masuk
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
            <ShieldCheck className="w-4 h-4 text-green-500 stroke-[2.5]" />
            <span>Aman &amp; Terdaftar</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'Register') {
    return (
      <div id="register-screen" className="flex flex-col h-full bg-surface-bg px-5 pt-6 pb-4 overflow-y-auto no-scrollbar">
        {/* Brand header */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V12C3 17.5 7.2 21.4 12 22C16.8 21.4 21 17.5 21 12V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M9 13.5L11.5 11L14.5 14L19 8.5" stroke="#fecb00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-primary text-base">NeoVest</span>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl p-5 soft-shadow flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Buat Akun Baru</h2>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Lengkapi data diri Anda untuk memulai perjalanan investasi finansial yang optimal.
            </p>

            {errorInput && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                {errorInput}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
              {/* Full Name */}
              <div className="relative">
                <label className="absolute -top-1.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400 tracking-wider">
                  Nama Lengkap
                </label>
                <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
                  <User className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="absolute -top-1.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400 tracking-wider">
                  Email
                </label>
                <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
                  <Mail className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label className="absolute -top-1.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400 tracking-wider">
                  Nomor Telepon
                </label>
                <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
                  <Phone className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="absolute -top-1.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400 tracking-wider">
                  Kata Sandi
                </label>
                <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
                  <Lock className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength meter indicators */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex gap-1">
                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${strength.score >= 1 ? 'bg-red-500' : 'bg-gray-100'}`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${strength.score >= 2 ? 'bg-amber-500' : 'bg-gray-100'}`} />
                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${strength.score >= 3 ? 'bg-green-500' : 'bg-gray-100'}`} />
                </div>
                <div className="flex justify-between items-center text-xs mt-0.5">
                  <span className="text-gray-400">Kekuatan Kata Sandi</span>
                  <span className={`font-semibold ${strength.score === 1 ? 'text-red-500' : strength.score === 2 ? 'text-amber-500 font-semibold' : 'text-green-600'}`}>{strength.label}</span>
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
                <button
                  type="button"
                  id="reg-tc-checkbox"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all focus:outline-none mt-0.5 ${agreeTerms ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'}`}
                >
                  {agreeTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className="text-xs text-gray-500 leading-normal">
                  Saya menyetujui <span className="text-primary font-semibold">Syarat dan Ketentuan</span> serta <span className="text-primary font-semibold">Kebijakan Privasi</span> yang berlaku.
                </span>
              </label>
            </form>
          </div>

          <div className="flex flex-col gap-3.5 mt-6">
            <button
              id="reg-submit-btn"
              onClick={handleRegister}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-full flex items-center justify-center transition-all hover:shadow-md"
            >
              Daftar Akun
            </button>

            <button
              id="reg-login-link"
              onClick={() => {
                setErrorInput('');
                onNavigate('Login');
              }}
              className="text-center text-xs font-medium text-gray-500 hover:text-primary"
            >
              Sudah punya akun? <span className="text-primary font-bold">Masuk</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'Login') {
    return (
      <div id="login-screen" className="flex flex-col h-full bg-white px-5 pt-8 pb-4 justify-between overflow-y-auto no-scrollbar">
        {/* Brand visual header inside card like */}
        <div className="flex flex-col items-center mt-6">
          <div className="p-3 bg-primary/5 rounded-2xl mb-2 soft-shadow flex items-center justify-center">
            <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 17.5 7.2 21.4 12 22C16.8 21.4 21 17.5 21 12V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M9 13.5L11.5 11L14.5 14L19 8.5" stroke="#fecb00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">NeoVest</h2>
          <span className="text-xs text-gray-400 font-medium">Teman finansial tepercaya Anda.</span>
        </div>

        {/* Inputs */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-6 w-full">
          {errorInput && (
            <div className="p-2.5 bg-red-50 text-red-600 text-xs rounded-xl font-medium text-center">
              {errorInput}
            </div>
          )}

          {/* Email Address */}
          <div className="relative">
            <label className="absolute -top-1.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400 tracking-wider">
              Alamat Email
            </label>
            <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
              <Mail className="w-4 h-4 text-gray-400 mr-2.5" />
              <input
                id="login-email-input"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <label className="absolute -top-1.5 left-4 bg-white px-1.5 text-xs font-medium text-gray-400 tracking-wider">
                Kata Sandi
              </label>
              <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
                <Lock className="w-4 h-4 text-gray-400 mr-2.5" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                  placeholder="Kata sandi Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end text-xs font-semibold text-primary mt-1.5 cursor-pointer">
              Lupa Kata Sandi?
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            id="login-submit-btn"
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-full flex items-center justify-center mt-2 soft-shadow transition-all"
          >
            Masuk
          </button>
        </form>

        {/* Divider text */}
        <div className="flex items-center gap-3 w-full my-4 px-2">
          <div className="h-px bg-gray-100 flex-1" />
          <span className="text-xs text-gray-400 font-bold tracking-wider">ATAU</span>
          <div className="h-px bg-gray-100 flex-1" />
        </div>

        {/* Alternate login buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({
                fullName: 'Talita Wijaya',
                email: 'talita.wijaya@gmail.com',
              });
              onNavigate('Home');
            }}
            className="w-full h-11 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.42-.22-2.05H12v3.87h6.62c-.13.96-.85 2.41-2.45 3.38l-.02.13 3.56 2.4.25.02c2.3-1.85 3.54-4.58 3.54-7.75z" />
              <path fill="#34A853" d="M12 23c3.29 0 6.05-.95 8.06-2.59l-3.84-2.94c-1.03.62-2.41 1.06-4.22 1.06-3.22 0-5.95-1.85-6.92-4.41l-.14.01-3.7 2.49-.05.12C3.19 20.45 7.29 23 12 23z" />
              <path fill="#FBBC05" d="M5.08 14.12A5.91 5.91 0 0 1 4.75 12c0-.74.12-1.45.32-2.12l-.01-.13-3.75-2.53-.12.05A10.2 10.2 0 0 0 0 12c0 1.68.44 3.27 1.2 4.73l3.88-2.61z" />
              <path fill="#EA4335" d="M12 5.47c2.29 0 3.83.86 4.71 1.58l3.44-2.92C18.04 2.42 15.29 1.38 12 1.38 7.29 1.38 3.19 3.93 1.2 7.27l3.87 2.61C6.05 7.32 8.78 5.47 12 5.47z" />
            </svg>
            Masuk dengan Google
          </button>

          <button
            type="button"
            onClick={() => {
              onLoginSuccess({
                fullName: 'Alex Turner',
                email: 'alex.turner@gmail.com',
                isPremium: true,
              });
              onNavigate('Home');
            }}
            className="w-full h-11 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-4 h-4 shrink-0 text-gray-950" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.62 13.08c-.02-2.28 1.86-3.38 1.94-3.43-1.06-1.55-2.71-1.76-3.29-1.78-1.4-.14-2.73.82-3.44.82-.72 0-1.82-.8-2.99-.78-1.54.02-2.96.9-3.75 2.28-1.6 2.78-.41 6.9 1.15 9.15.76 1.1 1.67 2.34 2.87 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.13 2.78-2.23.87-1.28 1.23-2.51 1.25-2.58-.03-.02-2.4-.92-2.43-3.73z" />
              <path d="M14.35 6.39c.63-.77 1.06-1.84.94-2.91-.91.04-2.01.61-2.67 1.37-.58.67-1.09 1.76-.96 2.79 1.02.08 2.06-.52 2.69-1.25z" />
            </svg>
            Masuk dengan Apple
          </button>
        </div>

        {/* Bottom register link */}
        <div className="mt-6 mb-2 text-center text-xs">
          <span className="text-gray-400">Belum punya akun? </span>
          <button
            type="button"
            id="login-register-link"
            onClick={() => {
              setErrorInput('');
              onNavigate('Register');
            }}
            className="text-primary font-bold hover:underline"
          >
            Daftar
          </button>
        </div>
      </div>
    );
  }

  return null;
}
