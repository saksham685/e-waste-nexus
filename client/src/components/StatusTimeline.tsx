import React from 'react';
import { PickupStatus, StatusHistoryEntry } from '../types';
import {
  FileText,
  CheckCircle2,
  Truck,
  PackageCheck,
  Scale,
  Recycle,
  Sparkles,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: PickupStatus;
  history?: StatusHistoryEntry[];
}

const ORDERED_STEPS: { status: PickupStatus; label: string; icon: any }[] = [
  { status: 'Requested', label: 'Requested', icon: FileText },
  { status: 'Approved', label: 'Approved', icon: CheckCircle2 },
  { status: 'Assigned', label: 'Assigned', icon: Truck },
  { status: 'Collected', label: 'Collected', icon: PackageCheck },
  { status: 'Weighed', label: 'Weighed', icon: Scale },
  { status: 'Sent for Recycling', label: 'Recycling Intake', icon: Recycle },
  { status: 'Completed', label: 'Completed', icon: Sparkles }
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history = [] }) => {
  const isCancelled = currentStatus === 'Cancelled';
  const isRejected = currentStatus === 'Rejected';

  if (isCancelled || isRejected) {
    return (
      <div className={`p-4 rounded-xl border flex items-center space-x-3 ${isCancelled ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-red-950/20 border-red-500/30 text-red-300'}`}>
        {isCancelled ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
        <div>
          <div className="font-semibold text-sm">
            {isCancelled ? 'Request Cancelled' : 'Request Rejected'}
          </div>
          <div className="text-xs opacity-80">
            {history[history.length - 1]?.note || 'This pickup request has been terminated.'}
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = ORDERED_STEPS.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full py-4">
      {/* Horizontal Desktop Bar */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[3px] bg-slate-800 -z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(34,197,94,0.6)]"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (ORDERED_STEPS.length - 1)) * 100}%`
            }}
          />
        </div>

        {ORDERED_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const IconComponent = step.icon;
          const historyEntry = history.find(h => h.status === step.status);

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 shadow-glow-green scale-110'
                    : isCompleted
                    ? 'bg-nexus-card border-2 border-emerald-400 text-emerald-400'
                    : 'bg-nexus-dark border-2 border-slate-700 text-slate-500'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-medium whitespace-nowrap ${
                    isCurrent
                      ? 'text-emerald-400 font-bold'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </div>
                {historyEntry && (
                  <div className="text-[10px] text-nexus-muted">
                    {new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical Mobile View */}
      <div className="md:hidden space-y-4">
        {ORDERED_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const IconComponent = step.icon;
          const historyEntry = history.find(h => h.status === step.status);

          return (
            <div key={step.status} className="flex items-start space-x-3">
              <div
                className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                    : 'bg-nexus-dark border border-slate-700 text-slate-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isCurrent ? 'text-emerald-400 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {historyEntry && (
                    <span className="text-[10px] text-nexus-muted">
                      {new Date(historyEntry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-[11px] text-emerald-400/90 mt-0.5">
                    Current stage: {historyEntry?.note || 'In active progression'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
