'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/lib/store';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { soundEffects } from '@/lib/sound';
import {
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  default: `I am NexusGPT, your circular electronics intelligence engine. In circular electronics management, every metric ton of e-waste contains up to 350 grams of gold, 1.5 kilograms of silver, and 130 kilograms of copper. Our platform provides closed-loop lifecycle traceability, certified chain-of-custody, and statutory EPR credit governance. You can ask me about hydrometallurgical refining, battery disposal safety, EPR compliance quotas, or how to schedule an on-demand pickup.`,
  gold: `Gold recovery from printed circuit boards (PCBs) utilizes hydrometallurgical leaching. The gold finger contacts and BGA bond wires are dissolved using thiosulfate or mild eco-friendly acids rather than toxic cyanide. The dissolved auric ions are then precipitated via electro-winning or zinc cementation, achieving a 99.9% fine bullion purity with 80% lower carbon emissions than virgin open-pit mining.`,
  epr: `Extended Producer Responsibility (EPR) under the E-Waste Management Rules mandates that manufacturers and importers take responsibility for the end-of-life collection and recycling of electrical and electronic equipment. In India and the EU, brands must recycle between 60% to 100% of their annual sales volume weight through registered R2/e-Stewards certified recyclers to obtain verifiable digital EPR credits.`,
  pickup: `To schedule an authorized e-waste pickup on our platform:
1. Navigate to the "Schedule Pickup" dashboard.
2. Select your device category (e.g. Computing, Mobile, Industrial PCB).
3. Enter the estimated quantity or weight.
4. Pick your scheduled time window and address.
Our calibrated logistics partner will arrive, issue a tamper-proof QR security seal, and generate your instant digital Certificate of Destruction!`,
  battery: `Lithium-ion batteries require extreme safety protocols due to the risk of thermal runaway. Never puncture, crush, or incinerate them. In our certified facilities, lithium batteries undergo inert atmosphere shredding followed by pyrometallurgical recovery of high-value Black Mass containing 98% pure cobalt, nickel, and battery-grade lithium carbonate.`,
  hindi: `ई-कचरा (E-Waste) प्रबंधन हमारे पर्यावरण के लिए अत्यंत आवश्यक है। पुराने मोबाइल, लैपटॉप, और टीवी में सीसा (Lead), पारा (Mercury) और कैडमियम जैसे हानिकारक तत्व होते हैं जो भूमिगत जल को दूषित कर सकते हैं। हमारी वेबसाइट पर आप मुफ्त पिकअप शेड्यूल कर सकते हैं और सरकार द्वारा मान्य रिसाइक्लिंग सर्टिफिकेट प्राप्त कर सकते हैं।`,
};

function generateAIAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('gold') || q.includes('sona') || q.includes('metal') || q.includes('copper') || q.includes('silver')) {
    return KNOWLEDGE_BASE.gold;
  }
  if (q.includes('epr') || q.includes('rule') || q.includes('target') || q.includes('law') || q.includes('compliance') || q.includes('credit')) {
    return KNOWLEDGE_BASE.epr;
  }
  if (q.includes('pickup') || q.includes('book') || q.includes('schedule') || q.includes('ghar se') || q.includes('collect')) {
    return KNOWLEDGE_BASE.pickup;
  }
  if (q.includes('battery') || q.includes('lithium') || q.includes('cell') || q.includes('fire') || q.includes('danger')) {
    return KNOWLEDGE_BASE.battery;
  }
  if (q.includes('hindi') || q.includes('kaise') || q.includes('kya') || q.includes('namaste') || q.includes('batao') || q.includes('kare')) {
    return KNOWLEDGE_BASE.hindi;
  }

  return `Regarding "${query}": Circular electronics reclamation utilizes standardized closed-loop processing. Electronic devices undergo mechanical dismantling, optical sensor sorting, and pyrometallurgical or hydrometallurgical refining. Toxic constituents including brominated flame retardants (BFRs) and lead solder are neutralized in scrubbed chambers, preventing heavy-metal contamination of groundwater aquifers while capturing scarce strategic minerals. Feel free to ask more specific questions or explore our 4K Video Cinema!`;
}

export const NexusGPTChat: React.FC = () => {
  const { isNexusGPTOpen, setNexusGPTOpen } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am NexusGPT, your circular electronics and e-waste intelligence assistant. Ask me anything about e-waste recycling, gold extraction, EPR credits, pickup bookings, or battery safety — in English or Hindi!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isNexusGPTOpen) {
      scrollToBottom();
    }
  }, [messages, isNexusGPTOpen]);

  // Listen to external voice queries triggered from VoiceCompanion
  useEffect(() => {
    const handleVoiceQuery = (e: any) => {
      if (e.detail?.query) {
        handleSendMessage(e.detail.query);
      }
    };
    window.addEventListener('nexusgpt-voice-query', handleVoiceQuery);
    return () => window.removeEventListener('nexusgpt-voice-query', handleVoiceQuery);
  }, []);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    soundEffects.playClick();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const fullAnswer = generateAIAnswer(text);
    const assistantId = `msg-${Date.now()}-assistant`;

    // Typewriter effect simulation
    let currentLength = 0;
    const initialAssistantMsg: ChatMessage = {
      id: assistantId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    const interval = setInterval(() => {
      currentLength += Math.floor(Math.random() * 4) + 2;
      if (currentLength >= fullAnswer.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: fullAnswer, isStreaming: false } : m))
        );
        setIsTyping(false);
        soundEffects.playNotification();

        // Automatically speak answer if voice is desired
        voiceAssistant.speak(fullAnswer.slice(0, 200) + '... Full report generated on screen.');
        setCurrentlySpeakingId(assistantId);
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: fullAnswer.slice(0, currentLength) } : m
          )
        );
      }
    }, 25);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    soundEffects.playClick();
    if (currentlySpeakingId === id && voiceAssistant.isSpeaking()) {
      voiceAssistant.stop();
      setCurrentlySpeakingId(null);
    } else {
      setCurrentlySpeakingId(id);
      voiceAssistant.speak(text, () => setCurrentlySpeakingId(null));
    }
  };

  const handleCopy = (id: string, text: string) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMicToggle = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundEffects.playClick();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        soundEffects.playSuccess();
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn('Mic start failed:', err);
      setIsListening(false);
    }
  };

  if (!isNexusGPTOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full bg-nexus-card border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-w-5xl h-[90vh]' : 'max-w-2xl h-[650px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-nexus-dark/90 border-b border-emerald-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-glow-green">
              <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">NexusGPT 4.0</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  AI Voice Active
                </span>
              </div>
              <p className="text-xs text-gray-400">Circular Electronics Expert & Realtime Voice Speaker</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                voiceAssistant.stop();
                setNexusGPTOpen(false);
              }}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                    : 'bg-gradient-to-tr from-emerald-500 to-lime-500 text-nexus-dark'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 shadow-lg text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-50'
                    : 'bg-nexus-dark/80 border border-emerald-500/20 text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Footer Controls for AI response */}
                {msg.sender === 'assistant' && !msg.isStreaming && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono text-[11px] text-gray-500">{msg.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeakMessage(msg.id, msg.text)}
                        title="Read out loud with AURA Voice"
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
                          currentlySpeakingId === msg.id
                            ? 'bg-emerald-500 text-nexus-dark font-semibold'
                            : 'hover:bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">
                          {currentlySpeakingId === msg.id ? 'Speaking...' : 'Listen'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy text"
                        className="hover:text-emerald-300 p-1 rounded transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>NexusGPT is analyzing circular telemetry...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2 bg-nexus-dark/60 border-t border-emerald-500/10 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-gray-400 shrink-0 font-mono text-[11px]">Suggested:</span>
          {[
            'How is Gold recovered from RAM?',
            'EPR Compliance Quotas 2026',
            'How to book free pickup?',
            'ई-कचरा क्या है और इसे कैसे दें?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-nexus-dark/95 border-t border-emerald-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Mic Speech Button */}
            <button
              type="button"
              onClick={handleMicToggle}
              title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
              className={`p-3 rounded-2xl border transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-glow-green'
                  : 'bg-emerald-950/50 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening to voice...' : 'Ask NexusGPT anything in English or Hindi...'}
              className="flex-1 bg-nexus-card border border-emerald-500/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-sans"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark rounded-2xl font-semibold shadow-glow-green hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
