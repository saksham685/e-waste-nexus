'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, DEMO_USERS } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { UserRole } from '@/lib/types';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  Shield,
  Users,
  Database,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function AdminPage() {
  const { user, switchDemoRole } = useAuthStore();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [pickups, setPickups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/pickups');
        if (res.ok) {
          const data = await res.json();
          setPickups(data.pickups || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSwitchRole = (role: UserRole) => {
    soundEffects.playSuccess();
    switchDemoRole(role);
    voiceAssistant.speak(`Active identity switched to ${role} role.`);
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Role-Based Access Control (RBAC) &bull; Security Level 5</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          System Administration &amp; Governance Ledger
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Root Auditor: <span className="text-emerald-400 font-mono">{user?.name}</span> ({user?.email})
        </p>
      </div>

      {/* Instant Role Switching Tester */}
      <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 mb-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Interactive RBAC Persona Simulator</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Test protected routes and authorization boundaries by toggling credentials instantly.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Active Role: {user?.role.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['individual', 'partner', 'recycler', 'admin'] as UserRole[]).map((r) => {
            const isCurrent = user?.role === r;
            return (
              <button
                key={r}
                onClick={() => handleSwitchRole(r)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-green scale-105'
                    : 'bg-nexus-dark/60 border-emerald-500/15 text-gray-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold capitalize">{r}</div>
                <div className="text-[10px] font-mono text-gray-500 mt-1 truncate">
                  {DEMO_USERS[r].name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Governance & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Audit Ledger */}
        <div className="lg:col-span-8 bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Immutable Cryptographic Action Ledger</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                id: 'AUD-8801',
                action: 'STAMP_TARE_WEIGHT',
                entity: 'pickup/pick_01',
                actor: 'Marcus Sterling (Partner)',
                ip: '192.168.1.104',
                time: '12 mins ago',
              },
              {
                id: 'AUD-8800',
                action: 'APPROVE_CONSIGNMENT',
                entity: 'pickup/pick_01',
                actor: 'Dr. Evelyn Vance (Admin)',
                ip: '10.0.0.1',
                time: '45 mins ago',
              },
              {
                id: 'AUD-8799',
                action: 'CREATE_PICKUP',
                entity: 'pickup/pick_02',
                actor: 'Sarah Jenkins (Individual)',
                ip: '172.56.21.9',
                time: '2 hours ago',
              },
            ].map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-nexus-dark/70 border border-emerald-500/15 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-emerald-400 font-bold">{log.id}</span>
                    <span className="text-white">{log.action}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Actor: {log.actor} &bull; Target: {log.entity}
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-gray-500">
                  <span>{log.ip}</span>
                  <div className="text-emerald-400/80">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-xl">
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">
              Infrastructure Health
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">App Router Edge Middleware</span>
                <span className="text-emerald-400 font-mono font-bold">ACTIVE (0ms)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">ISR Engine (60s Cache)</span>
                <span className="text-emerald-400 font-mono font-bold">HEALTHY</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Zod Validation Gateways</span>
                <span className="text-emerald-400 font-mono font-bold">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Web Speech API Voice Engine</span>
                <span className="text-emerald-400 font-mono font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
