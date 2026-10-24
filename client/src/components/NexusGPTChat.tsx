import React, { useState, useEffect, useRef } from 'react';
import { voiceAssistant } from '../utils/voiceAssistant';
import { soundEffects } from '../utils/sound';
import {
  Bot,
  User as UserIcon,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  Square,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface NexusGPTChatProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const NexusGPTChat: React.FC<NexusGPTChatProps> = ({ isOpen, onClose, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "Hello! I am NexusGPT, your AI Circular & Environmental Assistant. You can ask me anything about e-waste disposal, Extended Producer Responsibility (EPR) credits, rare metal recovery, or platform navigation. You can also type or speak your questions, and I will write and speak the answers for you!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = voiceAssistant.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const promptSuggestions = [
    "Where can I watch e-waste recycling videos?",
    "How are EPR credits calculated for lithium batteries?",
    "What precious metals can be recovered from laptops?",
    "Can you help me schedule a pickup?"
  ];

  // Domain Knowledge Response Generator
  const generateAIResponse = (prompt: string): string => {
    const q = prompt.toLowerCase().trim();

    if (q.includes('epr credit') || q.includes('calculation') || q.includes('formula') || q.includes('multiplier')) {
      return "In E-Waste Nexus, Extended Producer Responsibility (EPR) credits are calculated by multiplying verified secondary recycled weight (kg) by the statutory material multiplier:\n\n• Batteries & Chargers: 2.0 credits/kg (High cobalt, lithium, nickel intensity)\n• Smartphones & Tablets: 1.8 credits/kg (Gold, palladium, tantalum concentration)\n• Laptops & Computers: 1.2 credits/kg (Multi-layer PCBs, copper heatpipes, aluminum)\n• Televisions & Monitors: 1.0 credit/kg\n• Large Electrical Appliances: 0.5 credit/kg\n\nRule: Credits are never awarded from pickup bookings alone—official verification of smelter refining assay is strictly required.";
    }

    if (q.includes('gold') || q.includes('copper') || q.includes('lithium') || q.includes('metal') || q.includes('precious')) {
      return "Discarded electronics contain rich concentrations of secondary commodities:\n\n• 1 metric ton of circuit boards yields approximately 40 to 800 times more gold than 1 ton of raw geological ore.\n• Typical laptop yield: ~0.22 grams of 24k gold, ~450 grams of industrial copper, and 120 grams of lithium/cobalt.\n• Recovering these metals eliminates open-pit toxic mining and reduces carbon emissions by over 80% compared to virgin extraction.";
    }

    if (q.includes('pickup') || q.includes('schedule') || q.includes('book') || q.includes('collect')) {
      return "To schedule a pickup:\n1. Navigate to the 'Schedule Pickup' tab in the navbar.\n2. Choose from our 7 certified categories (Smartphones, Laptops, Batteries, Monitors, Appliances, etc.).\n3. Enter the approximate quantity and estimated weight.\n4. Select your preferred date, time slot, and address.\n5. Click 'Confirm Pickup Request'. An authorized logistics fleet partner will be dispatched with digital scales to log your physical weight!";
    }

    if (q.includes('custody') || q.includes('verification') || q.includes('unverified') || q.includes('scale')) {
      return "Our Chain-of-Custody follows an immutable 7-step lifecycle:\nRequested → Approved → Assigned → Collected → Weighed → Sent for Recycling → Completed.\n\nStrict Governance Rule: When a collection fleet partner logs physical weight on site, it remains in 'Unverified' status until central QA inspects the weigh-scale calibration slip and tare certificate. This prevents tare-weight inflation.";
    }

    if (q.includes('who are you') || q.includes('what are you') || q.includes('chatgpt') || q.includes('what can you do')) {
      return "I am NexusGPT, the intelligent environmental co-pilot for E-Waste Nexus. I am equipped with real-time domain knowledge regarding electronic waste recovery, WEEE & EPA regulations, EPR credit registries, metallurgical assay yields, and platform navigation. I can write answers to your questions and speak them out loud!";
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
      return "Greetings! Welcome to E-Waste Nexus. How can I assist your circular sustainability operations today? You can ask about scheduling collections, calculating EPR credits, or exploring our 3D hardware assays.";
    }

    if (q.includes('center') || q.includes('drop off') || q.includes('map') || q.includes('location')) {
      return "We operate licensed municipal collection hubs across major clean-tech corridors including Silicon Valley, San Francisco, Seattle, and Austin. You can visit the 'Centers' tab to explore our interactive geographic map, check operating hours, and verify accepted hazardous items.";
    }

    if (q.includes('video') || q.includes('cinema') || q.includes('documentary') || q.includes('movie') || q.includes('watch')) {
      return "We have a dedicated 4K Video Cinema & Documentary Theater right on the platform! You can watch:\n\n1. 'Urban Mining: Extracting 99.9% Pure Gold from E-Waste'\n2. 'Robotic Deconstruction: Apple Daisy Disassembling 200 iPhones/Hour'\n3. 'The Circular Supply Chain: What Actually Happens to Your Tech'\n4. 'EPR Compliance Explained in Action'\n\nClick on the 'Video Cinema' tab in the navbar to start watching with ambient theater mode and audio briefings!";
    }

    if (q.includes('carbon') || q.includes('co2') || q.includes('environment') || q.includes('impact')) {
      return "Based on EPA WEEE Life-Cycle Assessment benchmarks:\n• Every 1 kg of certified recycled e-waste avoids approximately 1.44 kg of CO2e emissions.\n• Diverts 0.082 kg of toxic heavy metals (lead, cadmium, mercury) from leaking into groundwater.\n• Conserves 22.5 liters of aquifer water per kilogram processed.";
    }

    // Default intelligent answering
    return `Regarding "${prompt}": In E-Waste Nexus, all electronic waste streams, processing assays, and Extended Producer Responsibility credits are managed through a verifiable, zero-blindspot circular ledger. Every physical asset is tracked from consumer pickup to secondary raw commodity refining in compliance with WEEE directives. Feel free to ask me more specific questions about scheduling, EPR calculations, or certified collection hubs!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    soundEffects.playClick();

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate ChatGPT intelligent typing delay
    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      soundEffects.playSuccess();

      // If Auto-Voice is active, speak the answer out loud!
      if (autoVoice) {
        // Strip markdown bullets for smoother speech
        const speechText = responseText.replace(/[•*#]/g, '').replace(/\n+/g, ' ');
        voiceAssistant.speak(speechText);
      }
    }, 450);
  };

  const handleVoiceInput = () => {
    soundEffects.playClick();
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setInputValue(spokenText);
        setIsListening(false);
        handleSendMessage(spokenText);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSpeakMessage = (text: string) => {
    soundEffects.playClick();
    const cleanText = text.replace(/[•*#]/g, '').replace(/\n+/g, ' ');
    voiceAssistant.speak(cleanText);
  };

  const handleStopSpeaking = () => {
    soundEffects.playClick();
    voiceAssistant.stop();
  };

  const handleCopy = (id: string, text: string) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    soundEffects.playClick();
    voiceAssistant.stop();
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: "Chat cleared. What would you like to explore next? You can ask about EPR credits, metal recovery, or collection dispatches.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in select-text">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col rounded-3xl bg-nexus-charcoal/95 border-2 border-emerald-500/40 shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-nexus-dark/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-glow-green">
              <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">NexusGPT</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  AI INTELLIGENCE v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Ask anything • Answers written & spoken out loud
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2">
            {/* Auto-voice Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setAutoVoice(!autoVoice);
                if (autoVoice) voiceAssistant.stop();
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center space-x-1.5 transition-all ${
                autoVoice
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-nexus-dark text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle automatic spoken answer reading"
            >
              {autoVoice ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{autoVoice ? 'Voice ON' : 'Voice Muted'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="px-2.5 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center space-x-1 hover:bg-red-900/40 transition-colors"
                title="Stop speaking"
              >
                <Square className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                voiceAssistant.stop();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 relative group shadow-lg ${
                    isAI
                      ? 'bg-nexus-dark/90 border border-slate-800 text-slate-200'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  <div className={`flex items-center justify-between pt-1 border-t text-[10px] font-mono ${
                    isAI ? 'border-slate-800/80 text-slate-500' : 'border-emerald-700/40 text-slate-900'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isAI && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSpeakMessage(msg.text)}
                          className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                          title="Read this answer aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Speak</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-nexus-dark border border-slate-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-bounce [animation-delay:0.3s]" />
                <span className="text-xs text-slate-400 font-mono ml-2">NexusGPT thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 sm:px-6 py-2 border-t border-slate-800/60 bg-nexus-dark/50 flex flex-wrap gap-2">
            {promptSuggestions.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-xl bg-nexus-charcoal border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors flex items-center space-x-1"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-nexus-dark/95">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse shadow-glow-cyan'
                  : 'bg-nexus-charcoal border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
              }`}
              title={isListening ? 'Listening to your voice...' : 'Speak your question (Voice Input)'}
            >
              {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? 'Listening... Speak your question now' : 'Ask anything... (e.g. "How to get EPR credits?", "Recycling gold yield")'}
              className="flex-1 px-4 py-3 rounded-2xl bg-nexus-charcoal border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-emerald-500 placeholder:text-slate-500 transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-glow-green disabled:opacity-40 disabled:hover:bg-emerald-500 cursor-pointer"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
            <span>Ask any question • Answers are written & automatically read aloud</span>
            <span>NexusGPT AI Model 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
