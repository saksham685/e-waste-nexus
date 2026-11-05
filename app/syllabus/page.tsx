'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { soundEffects } from '@/lib/sound';
import { useAuthStore } from '@/lib/store';
import {
  Code2,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Globe2,
  Server,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Terminal,
  Activity,
  Database,
  Lock,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';

interface SyllabusModule {
  id: string;
  course: 'React.js' | 'Next.js';
  unit: string;
  title: string;
  topics: string[];
  implementationFile: string;
  demoType: 'immutability' | 'zod' | 'useMemo' | 'serverActions' | 'middleware' | 'zustand';
}

const SYLLABUS_MODULES: SyllabusModule[] = [
  {
    id: 'react-js-refresh',
    course: 'React.js',
    unit: 'Module 1',
    title: 'Refreshing JavaScript (ES6+ & Immutability)',
    topics: [
      'Arrow Functions & lexical this',
      'Block-scoped variables (let and const)',
      'Array methods (.map, .filter, .reduce, .find)',
      'Destructuring assignments & Spread/Rest operators',
      'Immutability principles & Deep copying',
      'Referential equality and state comparison',
    ],
    implementationFile: 'lib/db.ts, components/ImpactCalculator.tsx, lib/smsService.ts',
    demoType: 'immutability',
  },
  {
    id: 'react-fundamentals',
    course: 'React.js',
    unit: 'Module 2',
    title: 'React Fundamentals & Component Design',
    topics: [
      'Declarative UI paradigm & Component-based architecture',
      'JSX syntax, expressions & render lifecycle',
      'Props-driven reusability & Composition patterns',
      'Lifting state up in component hierarchies',
      'Tailwind CSS utility-first styling & Responsive breakpoints',
    ],
    implementationFile: 'components/TiltCard3D.tsx, components/Navbar.tsx',
    demoType: 'zustand',
  },
  {
    id: 'react-states-hooks',
    course: 'React.js',
    unit: 'Unit III',
    title: 'States, Events, Hooks & Side Effects',
    topics: [
      'Event handling & local state using useState',
      'State update batching & derived state concepts',
      'Built-in hooks: useState, useEffect, useContext',
      'Effect cleanup & dependency array semantics',
      'Performance optimization: useCallback & useMemo',
      'Custom hooks for logic reuse',
    ],
    implementationFile: 'components/RealtimeWorldIntelligence.tsx, components/LiveActivityFeed.tsx',
    demoType: 'useMemo',
  },
  {
    id: 'react-forms-zod',
    course: 'React.js',
    unit: 'Unit IV',
    title: 'Form Handling & Zod Schema Validation',
    topics: [
      'Controlled and uncontrolled components',
      'Handling form submission workflows',
      'Reusable form component design & accessibility',
      'Client-side form validation patterns',
      'Schema-based validation principles using Zod',
      'Integrating schema validation with error handling',
    ],
    implementationFile: 'lib/validations.ts, app/signup/page.tsx, app/login/page.tsx',
    demoType: 'zod',
  },
  {
    id: 'next-fundamentals',
    course: 'Next.js',
    unit: 'Unit I & II',
    title: 'Next.js App Router, Routing & Rendering Strategies',
    topics: [
      'App Router architecture & Development workflow',
      'File-based routing, Dynamic routes ([id], [slug])',
      'Nested routes, Root Layouts (layout.tsx)',
      'Error & Loading UI boundaries (error.tsx, loading.tsx)',
      'Server-Side Rendering (SSR) & Static Site Generation (SSG)',
      'Server Components vs Client Components ("use client")',
    ],
    implementationFile: 'app/layout.tsx, app/pickups/[id]/page.tsx, app/centers/[slug]/page.tsx',
    demoType: 'serverActions',
  },
  {
    id: 'next-api-actions',
    course: 'Next.js',
    unit: 'Unit III & IV',
    title: 'Route Handlers, Server Actions & Authentication',
    topics: [
      'Route Handlers (REST APIs: GET, POST, PUT, DELETE)',
      'Request and Response Handling (NextRequest, NextResponse)',
      'Server Actions ("use server") for data mutations',
      'Authentication & Session Management with HttpOnly cookies',
      'Protected Routes & Edge Runtime Middleware (middleware.ts)',
      'Role-based Access Control (RBAC: Citizen, Partner, Recycler, Admin)',
    ],
    implementationFile: 'actions/authActions.ts, middleware.ts, app/api/market-rates/route.ts',
    demoType: 'middleware',
  },
  {
    id: 'next-perf-state',
    course: 'Next.js',
    unit: 'Unit V & VI',
    title: 'Global State (Zustand), SEO & Production Deployment',
    topics: [
      'Lightweight global state management using Zustand (with persistence)',
      'Comparison of local state, global state, and server state',
      'Image Optimization & Metadata API for SEO',
      'Code splitting and lazy loading via dynamic()',
      'Production build optimization & Security Best Practices',
    ],
    implementationFile: 'lib/store.ts, components/AuthGuard.tsx, app/page.tsx',
    demoType: 'zustand',
  },
];

// Sample Zod Schema for live interactive test
const demoUserSchema = z.object({
  fullName: z.string().min(3, 'Full name must have at least 3 characters'),
  email: z.string().email('Please enter a valid official email address'),
  hardwareWeightKg: z.coerce.number().min(0.5, 'Minimum weight is 0.5 kg').max(1000, 'Max weight is 1000 kg'),
});

export default function SyllabusPage() {
  const [selectedModule, setSelectedModule] = useState<SyllabusModule>(SYLLABUS_MODULES[0]);
  const [courseFilter, setCourseFilter] = useState<'all' | 'React.js' | 'Next.js'>('all');

  // Zustand Store verification
  const { user, token } = useAuthStore();

  // 1. Live Interactive Demo: Immutability test state
  const [itemsList, setItemsList] = useState<string[]>(['Motherboard (4.2kg)', 'Li-Ion Battery (1.1kg)']);
  const [newItemText, setNewItemText] = useState('');

  // 2. Live Interactive Demo: Zod validation state
  const [zodName, setZodName] = useState('Dr. Evelyn Vance');
  const [zodEmail, setZodEmail] = useState('user@nexus.eco');
  const [zodWeight, setZodWeight] = useState('14.5');
  const [zodResult, setZodResult] = useState<{ success: boolean; message: string }>({
    success: true,
    message: 'Schema validation passed successfully',
  });

  // 3. Live Interactive Demo: useMemo compute benchmark
  const [benchmarkNumber, setBenchmarkNumber] = useState(25);
  const expensiveCalculation = useMemo(() => {
    // Heavy compute to demonstrate useMemo optimization awareness
    let total = 0;
    for (let i = 0; i < benchmarkNumber * 50000; i++) {
      total += Math.sqrt(i);
    }
    return Math.round(total).toLocaleString('en-IN');
  }, [benchmarkNumber]);

  // Handle immutability test
  const handleAddItemImmutable = () => {
    if (!newItemText.trim()) return;
    soundEffects.playClick();
    // Immutability principle: using array spread operator [...] instead of .push()
    setItemsList((prev) => [...prev, newItemText.trim()]);
    setNewItemText('');
  };

  const handleResetImmutable = () => {
    soundEffects.playClick();
    setItemsList(['Motherboard (4.2kg)', 'Li-Ion Battery (1.1kg)']);
  };

  // Handle Zod validation test
  const handleValidateZod = useCallback(() => {
    soundEffects.playClick();
    const result = demoUserSchema.safeParse({
      fullName: zodName,
      email: zodEmail,
      hardwareWeightKg: zodWeight,
    });

    if (result.success) {
      soundEffects.playSuccess();
      setZodResult({
        success: true,
        message: '✓ Zod Schema Valid: All data constraints satisfied.',
      });
    } else {
      soundEffects.playError();
      setZodResult({
        success: false,
        message: `✗ Zod Error: ${result.error.issues[0]?.message}`,
      });
    }
  }, [zodName, zodEmail, zodWeight]);

  const filteredModules = useMemo(() => {
    if (courseFilter === 'all') return SYLLABUS_MODULES;
    return SYLLABUS_MODULES.filter((m) => m.course === courseFilter);
  }, [courseFilter]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Academic Curriculum &amp; Architecture Map</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          React.js &amp; Next.js 14{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
            Syllabus Implementation
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
          Comprehensive mapping of every academic topic from the syllabus to real working source code, interactive demonstrators, and enterprise architecture in this application.
        </p>

        {/* Course Filter Tabs */}
        <div className="pt-4 flex items-center justify-center space-x-3">
          {(['all', 'React.js', 'Next.js'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setCourseFilter(filter);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                courseFilter === filter
                  ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark shadow-glow-green scale-105'
                  : 'bg-nexus-card border border-emerald-500/20 text-gray-400 hover:text-white'
              }`}
            >
              {filter === 'all' ? 'All Units & Modules' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Module Selector + Right Interactive Code & Architecture Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Modules List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center justify-between">
            <span>Syllabus Modules (Click to Inspect):</span>
            <span className="text-emerald-400 font-bold">{filteredModules.length} Modules</span>
          </div>

          <div className="space-y-3">
            {filteredModules.map((mod) => {
              const isSelected = selectedModule.id === mod.id;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedModule(mod);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-emerald-400 bg-nexus-card shadow-glow-green scale-101'
                      : 'border-emerald-500/20 bg-nexus-dark/70 hover:border-emerald-500/50 hover:bg-nexus-card/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-lime-400" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          mod.course === 'React.js'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {mod.course} &bull; {mod.unit}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{mod.title}</h3>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {mod.topics.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nexus-dark border border-emerald-500/15 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                    {mod.topics.length > 3 && (
                      <span className="text-[10px] font-mono text-gray-500 px-1 py-0.5">
                        +{mod.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] font-mono text-gray-400 flex items-center space-x-1.5 pt-2 border-t border-emerald-500/15">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">Source: {mod.implementationFile}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Concept Lab & Deep Dive */}
        <div className="lg:col-span-6 rounded-3xl bg-nexus-card border-2 border-emerald-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-20">
          {/* Header */}
          <div className="border-b border-emerald-500/20 pb-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE INTERACTIVE CODE LAB</span>
            </div>
            <h2 className="text-xl font-black text-white">{selectedModule.title}</h2>
            <div className="text-xs text-gray-400 font-mono mt-1">
              Course: <span className="text-emerald-400 font-bold">{selectedModule.course}</span> &bull;{' '}
              {selectedModule.unit}
            </div>
          </div>

          {/* Topics Covered in this Unit */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold mb-2">
              Syllabus Topics Verified in Codebase:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedModule.topics.map((t, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-nexus-dark/90 border border-emerald-500/20 text-xs text-gray-200 flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="leading-snug">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Demonstrators based on DemoType */}
          <div className="pt-2 border-t border-emerald-500/20">
            {/* 1. Immutability & Array Spread Demo */}
            {selectedModule.demoType === 'immutability' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Demo: React Immutability &amp; Spread Operator
                  </span>
                  <button
                    onClick={handleResetImmutable}
                    className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-nexus-dark/95 border border-emerald-500/30 space-y-3 font-mono text-xs">
                  <div className="text-gray-400 text-[11px]">
                    Current State Array: ({itemsList.length} items, referentially immutable)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {itemsList.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. Copper Wire (2.5kg)"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      className="flex-1 bg-nexus-card border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={handleAddItemImmutable}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-nexus-dark font-black text-xs hover:scale-105 transition-all shadow-glow-green"
                    >
                      [...prev, item]
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Zod Schema Validation Demo */}
            {selectedModule.demoType === 'zod' && (
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Demo: Zod Schema-Based Validation Lab
                </span>

                <div className="p-4 rounded-2xl bg-nexus-dark/95 border border-emerald-500/30 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">
                        FULL NAME (min 3 chars)
                      </label>
                      <input
                        type="text"
                        value={zodName}
                        onChange={(e) => setZodName(e.target.value)}
                        className="w-full bg-nexus-card border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">
                        OFFICIAL EMAIL
                      </label>
                      <input
                        type="email"
                        value={zodEmail}
                        onChange={(e) => setZodEmail(e.target.value)}
                        className="w-full bg-nexus-card border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">
                      HARDWARE WEIGHT (0.5 to 1000 kg)
                    </label>
                    <input
                      type="number"
                      value={zodWeight}
                      onChange={(e) => setZodWeight(e.target.value)}
                      className="w-full bg-nexus-card border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    onClick={handleValidateZod}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-nexus-dark font-black text-xs hover:scale-102 transition-all shadow-glow-green"
                  >
                    Run demoUserSchema.safeParse()
                  </button>

                  <div
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-2 ${
                      zodResult.success
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/15 border-red-500/40 text-red-300'
                    }`}
                  >
                    {zodResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{zodResult.message}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. useMemo & Benchmark Demo */}
            {selectedModule.demoType === 'useMemo' && (
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Demo: useMemo &amp; State Batching Optimization
                </span>

                <div className="p-4 rounded-2xl bg-nexus-dark/95 border border-emerald-500/30 space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">COMPUTE COMPLEXITY:</span>
                    <span className="text-emerald-400 font-bold">{benchmarkNumber * 50000} iterations</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={benchmarkNumber}
                    onChange={(e) => setBenchmarkNumber(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="p-3 rounded-xl bg-nexus-card border border-emerald-500/20 text-center">
                    <div className="text-[10px] text-gray-400">Memoized Result Value:</div>
                    <div className="text-xl font-black text-emerald-400 mt-1">{expensiveCalculation}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5">
                      Recalculated only when dependency `benchmarkNumber` changes.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Zustand Store Demo */}
            {selectedModule.demoType === 'zustand' && (
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Demo: Zustand Global Store Telemetry
                </span>

                <div className="p-4 rounded-2xl bg-nexus-dark/95 border border-emerald-500/30 space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                    <span className="text-gray-400">Store Provider:</span>
                    <span className="text-emerald-400 font-bold">Zustand 4.5 (lib/store.ts)</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                    <span className="text-gray-400">Active User:</span>
                    <span className="text-white font-bold">{user ? user.name : 'Unauthenticated (Strict Wall)'}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                    <span className="text-gray-400">Active Role:</span>
                    <span className="text-cyan-400 font-bold uppercase">{user ? user.role : 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">JWT Session Token:</span>
                    <span className="text-emerald-400 truncate max-w-[200px]">
                      {token || 'nexus_token cookie active'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Server Actions & Middleware Demo */}
            {(selectedModule.demoType === 'serverActions' || selectedModule.demoType === 'middleware') && (
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Architecture: Next.js Edge Middleware &amp; Server Actions
                </span>

                <div className="p-4 rounded-2xl bg-nexus-dark/95 border border-emerald-500/30 space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-nexus-card border border-emerald-500/20 text-gray-300">
                    <span className="text-emerald-400 font-bold">1. Edge Middleware (`middleware.ts`):</span>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Intercepts every incoming HTTP request on Edge runtime. Validates `nexus_token` cookie. Unauthenticated requests are immediately redirected to `/login` with 307 headers.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-nexus-card border border-cyan-500/20 text-gray-300">
                    <span className="text-cyan-400 font-bold">2. Server Actions (`actions/authActions.ts`):</span>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      `&apos;use server&apos;` functions handle mutations with zero client API boilerplate, bcrypt password verification, and HttpOnly cookie generation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-gray-400 font-mono text-[11px]">
              Exact File: <span className="text-emerald-300 font-bold">{selectedModule.implementationFile.split(',')[0]}</span>
            </span>
            <Link
              href="/"
              onClick={() => soundEffects.playClick()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold transition-all"
            >
              <span>Back to Ecosystem Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
