'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { soundEffects } from '@/lib/sound';
import { useUIStore } from '@/lib/store';
import { Volume2, VolumeX, Mic, MicOff, Sparkles, Radio, HelpCircle } from 'lucide-react';

export const VoiceCompanion: React.FC = () => {
  const pathname = usePathname();
  const { isMuted, toggleMute, setNexusGPTOpen } = useUIStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsubscribe = voiceAssistant.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });

    // Check SpeechRecognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          soundEffects.playClick();
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setRecognizedText(transcript);
          setIsListening(false);
          soundEffects.playSuccess();
          // Open NexusGPT with this transcript
          setNexusGPTOpen(true);
          // Store recognized question in sessionStorage or dispatch custom event
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('nexusgpt-voice-query', { detail: { query: transcript } })
            );
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognitionInstance(recognition);
      }
    }

    return () => {
      unsubscribe();
    };
  }, [setNexusGPTOpen]);

  // Voice narration triggers when user clicks the speak page brief
  const handleBriefPage = () => {
    soundEffects.playClick();
    if (isSpeaking) {
      voiceAssistant.stop();
    } else {
      voiceAssistant.briefRoute(pathname);
    }
  };

  const handleToggleSound = () => {
    toggleMute();
    const nextMuted = voiceAssistant.toggleMute();
    soundEffects.toggleMute();
    if (!nextMuted) {
      soundEffects.playClick();
    }
  };

  const handleStartListening = () => {
    if (!recognitionInstance) {
      setNexusGPTOpen(true);
      return;
    }

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      try {
        if (isSpeaking) voiceAssistant.stop();
        recognitionInstance.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <aside aria-label="AURA Voice Assistant" className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-auto">
      {/* Speech Visualizer Indicator Banner */}
      {isSpeaking && (
        <div className="bg-nexus-dark/95 border border-emerald-500/50 px-4 py-2 rounded-2xl shadow-glow-green backdrop-blur-xl animate-fade-in flex items-center space-x-3">
          <div className="flex space-x-1 items-end h-4">
            <span className="w-1 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '300ms' }}></span>
            <span className="w-1 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '450ms' }}></span>
          </div>
          <span className="text-xs font-mono text-emerald-300 tracking-wider">AURA Voice Speaking...</span>
          <button
            onClick={() => voiceAssistant.stop()}
            className="text-gray-400 hover:text-red-400 text-xs font-mono ml-2 transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      {isListening && (
        <div className="bg-emerald-950/90 border border-emerald-400 px-4 py-2.5 rounded-2xl shadow-glow-green backdrop-blur-xl animate-pulse flex items-center space-x-3">
          <Radio className="w-4 h-4 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold text-emerald-200">AURA Listening... Say any question!</span>
        </div>
      )}

      {/* Floating Control Cluster */}
      <div className="flex items-center space-x-2 bg-nexus-card/90 border border-emerald-500/30 backdrop-blur-2xl p-1.5 rounded-full shadow-2xl hover:border-emerald-500/60 transition-all duration-300">
        {/* Voice Briefing Button */}
        <button
          onClick={handleBriefPage}
          title={isSpeaking ? 'Stop AURA Narration' : 'Listen to Page AI Voice Briefing'}
          className={`p-3 rounded-full transition-all duration-300 relative group ${
            isSpeaking
              ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
              : 'hover:bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-5 h-5 animate-bounce" />
          ) : (
            <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          <span className="sr-only">Voice briefing</span>
        </button>

        {/* Speech-to-Text Microphone Voice Input */}
        <button
          onClick={handleStartListening}
          title={isListening ? 'Listening...' : 'Voice Search with AURA'}
          className={`p-3 rounded-full transition-all duration-300 relative group ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-glow-green'
              : 'hover:bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {isListening ? (
            <Mic className="w-5 h-5 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          <span className="sr-only">Voice input</span>
        </button>

        {/* Quick Launch ChatGPT Assistant */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setNexusGPTOpen(true);
          }}
          title="Open NexusGPT E-Waste Intelligence Chat"
          className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark font-semibold text-xs tracking-wide shadow-glow-green hover:shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask NexusGPT</span>
        </button>

        {/* Global Sound Mute */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-3 rounded-full hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-300 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          <span className="sr-only">Toggle mute</span>
        </button>
      </div>
    </aside>
  );
};
