'use client';

import React, { useState } from 'react';
import {
  Coins,
  X,
  Gift,
  TreeDeciduous,
  Zap,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';

interface GreenWalletModalProps {
  onClose: () => void;
}

interface RewardItem {
  id: string;
  title: string;
  costPoints: number;
  partner: string;
  icon: any;
  category: string;
  badge: string;
}

const REWARDS: RewardItem[] = [
  {
    id: 'amazon-voucher',
    title: '₹500 Amazon Eco-Shopping Gift Card',
    costPoints: 1000,
    partner: 'Amazon India',
    icon: Gift,
    category: 'Voucher',
    badge: 'Popular',
  },
  {
    id: 'uber-green',
    title: '₹250 Uber Green Electric Ride Credit',
    costPoints: 500,
    partner: 'Uber Green',
    icon: Zap,
    category: 'Mobility',
    badge: 'Instant',
  },
  {
    id: 'plant-tree',
    title: 'Plant 5 Native Trees in Western Ghats',
    costPoints: 300,
    partner: 'Grow-Trees Foundation',
    icon: TreeDeciduous,
    category: 'Ecology',
    badge: 'Geo-Tagged',
  },
  {
    id: 'cpcb-badge',
    title: 'CPCB Certified Green Citizen Digital NFT',
    costPoints: 150,
    partner: 'CPCB India',
    icon: Award,
    category: 'Credential',
    badge: 'Verified',
  },
];

export const GreenWalletModal: React.FC<GreenWalletModalProps> = ({ onClose }) => {
  const [balance, setBalance] = useState<number>(1450);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const handleRedeem = (reward: RewardItem) => {
    if (balance < reward.costPoints) {
      soundEffects.playError();
      return;
    }

    soundEffects.playSuccess();
    setBalance((prev) => prev - reward.costPoints);
    setRedeemedIds((prev) => [...prev, reward.id]);
    const voucherCode = `ECO-${reward.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setRedeemedCode(`Redeemed ${reward.title}! Your voucher code is: ${voucherCode}`);
    voiceAssistant.speak(`Congratulations! You have redeemed ${reward.title}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-nexus-card border-2 border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl relative space-y-6 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Citizen Green Points Wallet &amp; Rewards
              </h3>
              <p className="text-xs text-gray-400">
                Earned from verified doorstep electronic collections
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-nexus-dark to-teal-950/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              AVAILABLE GREEN WALLET BALANCE
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
              {balance.toLocaleString('en-IN')}{' '}
              <span className="text-emerald-400 text-lg font-sans">Points</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              &asymp; ₹{(balance * 0.75).toFixed(0)} cash equivalent value
            </div>
          </div>

          <div className="p-3 rounded-xl bg-nexus-dark/80 border border-white/10 text-xs font-mono space-y-1">
            <div className="text-gray-400">CO₂ Abated: <strong className="text-emerald-400">145 kg</strong></div>
            <div className="text-gray-400">Trees Planted: <strong className="text-cyan-400">8 Trees</strong></div>
          </div>
        </div>

        {/* Success Alert */}
        {redeemedCode && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{redeemedCode}</span>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Redeem Exclusive Circular Rewards:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REWARDS.map((rew) => {
              const Icon = rew.icon;
              const isRedeemed = redeemedIds.includes(rew.id);
              const canAfford = balance >= rew.costPoints;

              return (
                <div
                  key={rew.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nexus-dark text-emerald-400 border border-emerald-500/20">
                        {rew.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {rew.costPoints} Pts
                      </span>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug">{rew.title}</h4>
                        <div className="text-[10px] text-gray-400 mt-0.5">{rew.partner}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isRedeemed || !canAfford}
                    onClick={() => handleRedeem(rew)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      isRedeemed
                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-glow-green'
                        : 'bg-slate-800 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isRedeemed ? 'Redeemed' : canAfford ? 'Redeem Reward' : 'Insufficient Points'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
