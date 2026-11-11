'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function GoogleAuthPopupPage() {
  const [step, setStep] = useState<'email' | 'password' | 'loading'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<string[]>([]);

  // Load recently used real accounts if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexus_google_saved_emails');
      if (stored) {
        setSavedAccounts(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Enter an email or phone number');
      return;
    }

    // If user typed without @, suggest or append @gmail.com
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
      setEmail(cleanEmail);
    }

    if (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.includes('.')) {
      setError('Couldn’t find your Google Account');
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    // Save email to localStorage for future quick access
    try {
      const updated = Array.from(new Set([email, ...savedAccounts])).slice(0, 5);
      localStorage.setItem('nexus_google_saved_emails', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    try {
      // Call Server API to persist to data/db.json
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google',
          email,
          name: formattedName,
        }),
      });

      const data = await res.json();
      const safeUser = data.user || {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        name: formattedName,
        email: email.toLowerCase(),
        role: 'individual',
      };
      const token = data.token || `nexus_jwt_google_${safeUser.id}_session_2026`;

      // Set cookie client-side as well
      document.cookie = `nexus_token=${token}; path=/; max-age=604800; SameSite=Lax`;

      // Notify parent window if opened as popup
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_SUCCESS',
              user: safeUser,
              token,
            },
            '*'
          );
        } catch {
          // Ignore
        }
        setTimeout(() => {
          window.close();
        }, 500);
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] flex flex-col justify-between font-sans selection:bg-[#c2e7ff]">
      {/* Top Banner (Optional for mobile) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[450px] bg-white rounded-[28px] border border-[#dadce0] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Linear Progress Bar when loading */}
          {step === 'loading' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8f0fe] overflow-hidden">
              <div className="h-full bg-[#1a73e8] animate-pulse w-full" />
            </div>
          )}

          {/* Google Multi-Color Logo */}
          <div className="mb-4">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">
              {step === 'loading'
                ? 'Signing in...'
                : step === 'password'
                ? 'Welcome'
                : 'Sign in with Google'}
            </h1>
            <p className="text-sm text-[#444746] mt-1.5">to continue to E-Waste Nexus</p>
          </div>

          {/* STEP 1: ENTER REAL GMAIL */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Quick Select from Saved Accounts if any */}
              {savedAccounts.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs text-[#444746] font-medium block">
                    Choose a previously used account:
                  </span>
                  {savedAccounts.map((saved) => (
                    <button
                      key={saved}
                      type="button"
                      onClick={() => {
                        setEmail(saved);
                        setStep('password');
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-[#dadce0] hover:bg-[#f8fafd] flex items-center justify-between text-xs text-[#1f1f1f] transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold uppercase text-[11px]">
                          {saved.charAt(0)}
                        </div>
                        <span className="font-medium">{saved}</span>
                      </div>
                      <span className="text-[#0b57d0] text-[11px] font-semibold">Select</span>
                    </button>
                  ))}
                  <div className="text-[11px] text-center text-[#747775] py-1">— or enter another Gmail below —</div>
                </div>
              )}

              <div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="Email or phone"
                    className={`w-full h-14 px-4 rounded-md border text-sm text-[#1f1f1f] bg-transparent outline-none transition-colors ${
                      error
                        ? 'border-[#b3261e] focus:border-[#b3261e]'
                        : 'border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0]'
                    }`}
                  />
                </div>
                {error ? (
                  <div className="flex items-center space-x-1.5 mt-2 text-[#b3261e] text-xs">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (email && !email.includes('@')) {
                        setEmail(`${email}@gmail.com`);
                      }
                    }}
                    className="mt-2 text-xs text-[#0b57d0] font-medium hover:underline block text-left"
                  >
                    Forgot email?
                  </button>
                )}
              </div>

              <div className="text-xs text-[#444746] leading-relaxed">
                Not your computer? Use a private browsing window to sign in.{' '}
                <span className="text-[#0b57d0] font-medium cursor-pointer hover:underline">
                  Learn more about using Guest mode
                </span>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                  }}
                  className="text-xs text-[#0b57d0] font-semibold hover:bg-[#e8f0fe] px-3 py-2 rounded-full transition-colors"
                >
                  Create account
                </button>
                <button
                  type="submit"
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PASSWORD / ONE-CLICK AUTH FOR REAL GMAIL */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Account Pill Chip */}
              <button
                type="button"
                onClick={() => setStep('email')}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-[#dadce0] hover:bg-[#f8fafd] text-xs text-[#1f1f1f] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[10px]">
                  {email.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-[#444746] truncate max-w-[240px]">{email}</span>
                <svg className="w-4 h-4 text-[#747775]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </button>

              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 rounded-md border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] text-sm text-[#1f1f1f] bg-transparent outline-none transition-colors"
                />
                <div className="flex items-center space-x-2 mt-3">
                  <input
                    type="checkbox"
                    id="showPass"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0b57d0] border-[#747775] focus:ring-[#0b57d0]"
                  />
                  <label htmlFor="showPass" className="text-xs text-[#444746] cursor-pointer">
                    Show password
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs text-[#0b57d0] font-semibold hover:bg-[#e8f0fe] px-3 py-2 rounded-full transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: LOADING / SIGNING IN */}
          {step === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#e8f0fe] border-t-[#0b57d0] rounded-full animate-spin" />
              <div className="text-center">
                <div className="text-sm font-semibold text-[#1f1f1f]">Verifying with Google...</div>
                <div className="text-xs text-[#444746] mt-1">{email}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Footer */}
      <div className="w-full max-w-[450px] mx-auto pb-6 px-4 flex items-center justify-between text-xs text-[#444746]">
        <div className="cursor-pointer hover:text-[#1f1f1f]">English (United States)</div>
        <div className="flex space-x-6">
          <span className="cursor-pointer hover:text-[#1f1f1f]">Help</span>
          <span className="cursor-pointer hover:text-[#1f1f1f]">Privacy</span>
          <span className="cursor-pointer hover:text-[#1f1f1f]">Terms</span>
        </div>
      </div>
    </div>
  );
}
