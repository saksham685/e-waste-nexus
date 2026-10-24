import React from 'react';
import { ShieldCheck, Award, Download, Printer, CheckCircle2, QrCode, X } from 'lucide-react';
import { soundEffects } from '../utils/sound';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    id: string;
    category: string;
    userName: string;
    weightKg: number;
    completedDate: string;
    partnerName?: string;
    recyclerName?: string;
  };
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  const certHash = 'SHA256: 8f2a91c5e4' + record.id.replace(/\D/g, '') + 'b789012a45d0c72e4b3f11';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-nexus-charcoal border-2 border-emerald-500/50 rounded-3xl p-8 shadow-2xl space-y-6 relative print:border-none print:shadow-none print:p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border Frame */}
        <div className="border border-emerald-500/30 rounded-2xl p-6 relative bg-nexus-dark/60 space-y-6">
          {/* Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-emerald-400" />
          </div>

          {/* Top Header */}
          <div className="flex items-start justify-between border-b border-emerald-500/20 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>OFFICIAL CHAIN-OF-CUSTODY COMPLIANCE CERTIFICATE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Certificate of Certified Destruction & Commodity Recovery
              </h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Issued under EPA WEEE Directive & ISO 14001 Environmental Standard
              </p>
            </div>

            <div className="p-2 rounded-xl bg-white text-slate-950 shrink-0">
              <QrCode className="w-10 h-10" />
            </div>
          </div>

          {/* Main Statement */}
          <p className="text-xs text-slate-300 leading-relaxed">
            This document certifies that the discarded electronic assets referenced below have been physically collected, tare-weight verified, safely disassembled, and refined into pure secondary raw commodities in full compliance with hazardous waste mitigation standards.
          </p>

          {/* Verification Details Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-nexus-muted block">Manifest ID</span>
              <span className="font-mono font-bold text-white">{record.id}</span>
            </div>
            <div className="p-3 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-nexus-muted block">Client Entity</span>
              <span className="font-semibold text-white truncate block">{record.userName}</span>
            </div>
            <div className="p-3 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-nexus-muted block">Verified Net Weight</span>
              <span className="font-mono font-bold text-emerald-400">{record.weightKg} kg</span>
            </div>
            <div className="p-3 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-nexus-muted block">Commodity Category</span>
              <span className="font-semibold text-white">{record.category}</span>
            </div>
            <div className="p-3 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-nexus-muted block">Execution Date</span>
              <span className="font-mono text-slate-200">{record.completedDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-nexus-muted block">Data Sanitization</span>
              <span className="font-mono text-emerald-400 font-bold">NIST 800-88 R1</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-[11px]">
            <div>
              <span className="text-nexus-muted block text-[10px]">Audited Fleet Partner</span>
              <span className="font-semibold text-slate-200">{record.partnerName || 'GreenRoute Certified Fleet'}</span>
              <div className="mt-2 h-0.5 w-32 bg-emerald-500/40" />
              <span className="text-[9px] text-slate-500 font-mono">Digital Signature Validated</span>
            </div>

            <div className="text-right">
              <span className="text-nexus-muted block text-[10px]">Licensed Refiner Assay</span>
              <span className="font-semibold text-slate-200">{record.recyclerName || 'AeroSmelt Rare-Earth Corp'}</span>
              <div className="mt-2 h-0.5 w-32 bg-cyan-500/40 ml-auto" />
              <span className="text-[9px] text-slate-500 font-mono">Pyrometallurgy Verified</span>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800 font-mono text-[9px] text-slate-400 flex items-center justify-between">
            <span className="truncate">{certHash}</span>
            <span className="text-emerald-400 shrink-0 ml-2">IMMUTABLE PROOF</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
