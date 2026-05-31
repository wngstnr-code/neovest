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
      setErrorInput('Mohon masukkan Email dan Password.');
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
                  Full Name
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
                  Phone Number
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
                  Password
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
                  <span className="text-gray-400">Kekuatan Password</span>
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
          <span className="text-xs text-gray-400 font-medium">Your trusted financial companion.</span>
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
              Email Address
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
                Password
              </label>
              <div className="flex items-center border border-gray-200 focus-within:border-primary rounded-xl h-12 px-3.5 bg-white transition-all">
                <Lock className="w-4 h-4 text-gray-400 mr-2.5" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs text-gray-800 outline-none font-sans font-medium"
                  placeholder="Password anda"
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
              Lupa Password?
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
                fullName: 'Alex Turner',
                email: 'alex.turner@gmail.com',
                isPremium: true
              });
              onNavigate('Home');
            }}
            className="w-full h-11 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <span className="p-1 bg-teal-50 text-teal-600 rounded-full">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM18 10L14 10L14 6L10 6L10 10L6 10L6 14L10 14L10 18L14 18L14 14L18 14L18 10Z"/>
              </svg>
            </span>
            Masuk dengan Biometrik (Alex: Premium)
          </button>

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
            {/* Google G icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.6-6.887 4.6-4.33 0-7.866-3.57-7.866-7.97s3.536-7.97 7.866-7.97c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.465 1.05 15.63 0 12.24 0 5.58 0 .17 5.37.17 12s5.41 12 12.07 12c6.95 0 11.57-4.85 11.57-11.75 0-.79-.085-1.4-.19-1.965H12.24z" />
            </svg>
            Lanjutkan dengan Google (Talita: Baru)
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
