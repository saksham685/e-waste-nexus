// E-Waste Nexus Intelligent Voice Assistant Engine (Web Speech Synthesis)
class VoiceAssistant {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((speaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prefer high-clarity natural English voices
    const preferred = voices.find(v =>
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Samantha') || v.name.includes('Ava') || v.name.includes('Zira')) &&
      v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    this.voice = preferred || null;
  }

  public subscribe(callback: (speaking: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(speaking: boolean) {
    this.listeners.forEach(cb => cb(speaking));
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = 1.02; // natural pace
      utterance.pitch = 1.0;  // pleasant pitch
      utterance.volume = 0.9;

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.notify(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        this.notify(false);
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
      this.notify(false);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.notify(false);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }

  // Pre-configured Intelligent Narration Briefings
  public briefTab(tabName: string) {
    const tabBriefs: Record<string, string> = {
      landing: "Welcome to E-Waste Nexus. Explore the global circular ecosystem, live impact telemetry, and interactive 3-D hardware deconstruction.",
      pickups: "Smart Collection portal active. Schedule your discarded electronic device pickup with certified chain-of-custody tracking.",
      centers: "Authorized Collection Hubs. Discover verified drop-off depots, operating hours, and accepted hazardous material categories.",
      epr: "Extended Producer Responsibility Credit Ledger. Trace audited precious metal recovery yields against statutory compliance quotas.",
      analytics: "Environmental Life-Cycle Accounting. Review avoided greenhouse gas emissions, heavy metal diversion, and partner fleet KPIs.",
      partner: "Logistics Partner Operations Center. Record calibrated weigh-scale cargo manifests and photographic evidence.",
      recycler: "Certified Recycler Processing Hub. Document pyrometallurgical separation yields and claim verified EPR compliance credits.",
      cinema: "Nexus 4K Cinema and Documentary Theater. Watch high-definition footage of urban gold mining, Apple Daisy robotic disassembly, and circular supply chain mechanics.",
      admin: "Administrator Control Center. Review pending weight calibration audits, user governance, and cryptographic system logs."
    };

    const brief = tabBriefs[tabName];
    if (brief) {
      this.speak(brief);
    }
  }
}

export const voiceAssistant = new VoiceAssistant();
