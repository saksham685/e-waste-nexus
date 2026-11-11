'use client';

import React from 'react';
import { PickupRequest } from '@/lib/types';
import { soundEffects } from '@/lib/sound';
import {
  ShieldCheck,
  Award,
  Download,
  Printer,
  X,
  QrCode,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface CertificateModalProps {
  pickup: PickupRequest;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ pickup, onClose }) => {
  const handlePrint = () => {
    soundEffects.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const certNumber = `CERT-COD-${pickup.id.toUpperCase().slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
      <div className="w-full max-w-3xl bg-nexus-card border-2 border-emerald-500/50 rounded-3xl overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:text-black print:bg-white">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-nexus-dark/90 border-b border-emerald-500/20 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Official Certificate of Destruction & Recovery
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Body */}
        <div className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-nexus-dark/80 via-nexus-card to-nexus-dark/90">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <ShieldCheck className="w-96 h-96 text-emerald-400" />
          </div>

          {/* Border Filigree styling */}
          <div className="border border-emerald-500/30 p-6 sm:p-8 rounded-2xl relative">
            {/* Seal & Institution */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-glow-green">
                <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-emerald-400" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                CERTIFICATE OF DESTRUCTION
              </h1>
              <h2 className="text-xs uppercase font-mono tracking-widest text-emerald-400 mt-1">
                E-Waste Nexus Circular Stewardship & Commodity Recovery Standard
              </h2>
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-mono text-emerald-300">
                Audit Registry ID: {certNumber}
              </div>
            </div>

            {/* Legal Statement */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed text-center max-w-xl mx-auto mb-8 font-light">
              This officially certifies that the decommissioned electronic equipment enumerated below
              has been physically received, dismantled in accordance with ISO 14001 and R2/e-Stewards
              environmental standards, and completely sanitized with zero landfill footprint.
            </p>

            {/* Asset Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-nexus-dark/60 border border-emerald-500/20 mb-8 text-xs">
              <div>
                <span className="text-gray-400 font-mono block">Certificate Holder</span>
                <span className="font-semibold text-white">{pickup.userName || 'Authorized Consignor'}</span>
              </div>
              <div>
                <span className="text-gray-400 font-mono block">Device Category</span>
                <span className="font-semibold text-emerald-400 capitalize">{pickup.category}</span>
              </div>
              <div>
                <span className="text-gray-400 font-mono block">Verified Gross Weight</span>
                <span className="font-semibold text-white">
                  {pickup.actualWeightKg ? `${pickup.actualWeightKg} kg` : `${pickup.estimatedWeightKg || 5} kg (Est.)`}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-mono block">Dispatched Log</span>
                <span className="font-semibold text-gray-300">{pickup.scheduledDate}</span>
              </div>
              <div>
                <span className="text-gray-400 font-mono block">Destruction Standard</span>
                <span className="font-semibold text-cyan-400">NIST SP 800-88 R1</span>
              </div>
              <div>
                <span className="text-gray-400 font-mono block">Statutory Status</span>
                <span className="font-semibold text-lime-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>EPR Certified</span>
                </span>
              </div>
            </div>

            {/* Signatures & Security Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-emerald-500/20 text-xs">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <a
                  href={`/verify/${pickup.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                  title="Click to verify on public CPCB registry"
                >
                  <QrCode className="w-12 h-12 text-black" />
                </a>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Cryptographic Hash</span>
                  <span className="font-mono text-xs text-emerald-400">0x79d...440c</span>
                  <a
                    href={`/verify/${pickup.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-400 hover:underline block mt-0.5 font-mono"
                  >
                    Click to Verify Publicly &rarr;
                  </a>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif italic text-base text-emerald-300 font-bold tracking-wider">
                  Dr. Elena Vance
                </div>
                <div className="text-[11px] font-mono text-gray-400">
                  Chief Environmental Auditor, E-Waste Nexus
                </div>
                <div className="text-[10px] text-gray-400">Issued under Environmental Protection Act 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
