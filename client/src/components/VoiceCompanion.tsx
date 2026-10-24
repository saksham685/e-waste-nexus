import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { voiceAssistant } from '../utils/voiceAssistant';
import { soundEffects } from '../utils/sound';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Play,
  Square,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface VoiceCompanionProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenChat?: () => void;
}

export const VoiceCompanion: React.FC<VoiceCompanionProps> = ({ currentTab, onNavigate, onOpenChat }) => {
  const { logout } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(voiceAssistant.getIsMuted());
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasSpeechRec, setHasSpeechRec] = useState(false);

  useEffect(() => {
    const unsub = voiceAssistant.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });

    // Check Web Speech Recognition support
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      setHasSpeechRec(true);
    }

    return () => unsub();
  }, []);

  const handleToggleMute = () => {
    soundEffects.playClick();
    const muted = voiceAssistant.toggleMute();
    setIsMuted(muted);
  };

  const handleBriefPage = () => {
    soundEffects.playClick();
    voiceAssistant.briefTab(currentTab);
  };

  const handleExplainEPR = () => {
    soundEffects.playClick();
    voiceAssistant.speak(
      "In E-Waste Nexus, Extended Producer Responsibility credits follow a strict five-stage chain of custody. Discarded electronics are collected by certified fleets, weighed on calibrated scales, verified by QA auditors, and refined into pure secondary commodities by licensed smelters. Credits are awarded only after proof of recycling yield is confirmed."
    );
  };

  const handleStopSpeaking = () => {
    soundEffects.playClick();
    voiceAssistant.stop();
  };

  const startVoiceCommand = () => {
    soundEffects.playClick();
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening for command...');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(`Heard: "${text}"`);

        // Natural Voice Commands
        if (text.includes('pickup') || text.includes('schedule') || text.includes('collection')) {
          voiceAssistant.speak('Opening Smart Pickup Portal.');
          onNavigate('pickups');
        } else if (text.includes('epr') || text.includes('credit')) {
          voiceAssistant.speak('Navigating to EPR Credit Registry.');
          onNavigate('epr');
        } else if (text.includes('center') || text.includes('hub') || text.includes('map')) {
          voiceAssistant.speak('Displaying verified collection centers.');
          onNavigate('centers');
        } else if (text.includes('analytic') || text.includes('trend') || text.includes('stat')) {
          voiceAssistant.speak('Loading environmental analytics and life-cycle telemetry.');
          onNavigate('analytics');
        } else if (text.includes('home') || text.includes('ecosystem') || text.includes('landing')) {
          voiceAssistant.speak('Returning to Ecosystem Overview.');
          onNavigate('landing');
        } else if (text.includes('video') || text.includes('cinema') || text.includes('movie') || text.includes('docu')) {
          voiceAssistant.speak('Opening 4K Video Cinema and Industrial Documentaries.');
          onNavigate('cinema');
        } else if (text.includes('admin') || text.includes('control')) {
          voiceAssistant.speak('Accessing Administrator Control Center.');
          onNavigate('admin');
        } else if (text.includes('logout') || text.includes('log out') || text.includes('sign out') || text.includes('exit')) {
          voiceAssistant.speak('Logging out of your account.');
          logout();
        } else {
          voiceAssistant.speak(`Received: ${text}. Try saying "Schedule pickup" or "Open EPR credits".`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Expanded Control Box */}
      {isExpanded && (
        <div className="mb-3 w-80 rounded-3xl bg-nexus-charcoal/95 border border-emerald-500/40 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-mono uppercase">AURA AI Voice Guide</h4>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {isSpeaking ? '● Speaking Audio Briefing' : '● Standing By'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Equalizer Waveform Animation when Speaking */}
          <div className="h-10 rounded-xl bg-nexus-dark/90 border border-slate-800 flex items-center justify-center space-x-1.5 px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
              <span
                key={bar}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-gradient-to-t from-emerald-500 to-lime-300'
                    : isListening
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-700 h-2'
                }`}
                style={{
                  height: isSpeaking ? `${Math.max(6, Math.sin(Date.now() * 0.005 + bar) * 28 + 12)}px` : undefined
                }}
              />
            ))}
          </div>

          {transcript && (
            <div className="p-2 rounded-lg bg-nexus-dark text-[11px] text-cyan-300 font-mono border border-slate-800 truncate">
              {transcript}
            </div>
          )}

          {/* Voice Actions Grid */}
          <div className="space-y-2">
            {onOpenChat && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsExpanded(false);
                  onOpenChat();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-lime-500/20 border border-emerald-500/50 hover:border-emerald-400 text-left text-xs font-semibold text-emerald-300 hover:text-white flex items-center justify-between transition-all shadow-glow-green"
              >
                <span className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Open NexusGPT (Chat & Speak)</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-300">
                  AI
                </span>
              </button>
            )}

            <button
              onClick={handleBriefPage}
              className="w-full py-2 px-3 rounded-xl bg-nexus-dark border border-slate-800 hover:border-emerald-500/50 text-left text-xs text-slate-200 hover:text-emerald-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Briefing for this Tab</span>
              </span>
              <Play className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={handleExplainEPR}
              className="w-full py-2 px-3 rounded-xl bg-nexus-dark border border-slate-800 hover:border-emerald-500/50 text-left text-xs text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Explain 5-Stage EPR Process</span>
              </span>
              <Play className="w-3 h-3 text-slate-500" />
            </button>

            {hasSpeechRec && (
              <button
                onClick={startVoiceCommand}
                disabled={isListening}
                className={`w-full py-2 px-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isListening
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 animate-pulse'
                    : 'bg-nexus-dark border-slate-800 hover:border-cyan-400 text-slate-200'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isListening ? 'Listening...' : 'Voice Command ("Schedule pickup")'}</span>
                </span>
                <span className="text-[10px] text-nexus-muted">Speak</span>
              </button>
            )}

            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="w-full py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop Audio Narration</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating 3D AI Orb Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleToggleMute}
          className={`p-3 rounded-2xl border backdrop-blur-xl transition-all shadow-xl ${
            isMuted
              ? 'bg-nexus-charcoal/90 border-slate-800 text-slate-500 hover:text-white'
              : 'bg-nexus-charcoal/90 border-emerald-500/40 text-emerald-400'
          }`}
          title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setIsExpanded(!isExpanded);
          }}
          className={`px-4 py-3 rounded-2xl border backdrop-blur-xl transition-all flex items-center space-x-2.5 shadow-glow-green group cursor-pointer ${
            isSpeaking
              ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-bold border-lime-300 scale-105'
              : 'bg-nexus-charcoal/95 border-emerald-500/40 text-white hover:border-emerald-400'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isSpeaking && (
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-slate-950 opacity-50" />
            )}
            <Bot className={`w-4 h-4 ${isSpeaking ? 'text-slate-950' : 'text-emerald-400 group-hover:scale-110 transition-transform'}`} />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold font-mono tracking-tight leading-tight">
              AURA VOICE AI
            </span>
            <span className={`text-[9px] font-mono leading-tight ${isSpeaking ? 'text-slate-900 font-semibold' : 'text-emerald-400'}`}>
              {isSpeaking ? 'Narrating...' : 'Voice Companion'}
            </span>
          </div>

          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 opacity-60" />
          )}
        </button>
      </div>
    </div>
  );
};
