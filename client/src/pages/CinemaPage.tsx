import React, { useState, useMemo } from 'react';
import { soundEffects } from '../utils/sound';
import { voiceAssistant } from '../utils/voiceAssistant';
import { TiltCard3D } from '../components/TiltCard3D';
import {
  Play,
  Film,
  Sparkles,
  Volume2,
  Tv,
  Clock,
  Eye,
  Cpu,
  Flame,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Share2,
  Maximize2,
  Zap,
  Globe2,
  Search,
  Check
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  language: 'hindi' | 'english';
  category: string;
  duration: string;
  views: string;
  quality: string;
  youtubeId: string;
  description: string;
  briefing: string;
  highlights: { time: string; label: string }[];
  stats: { label: string; value: string; detail: string }[];
  tagColor: string;
}

const VIDEOS: VideoItem[] = [
  // ===================== HINDI VIDEOS =====================
  {
    id: 'hindi-1000cr-business',
    title: 'The ₹1,000 Crore Business Hidden Inside E-Waste | भारत का ई-कचरा रीसाइक्लिंग उद्योग',
    language: 'hindi',
    category: 'Hindi Documentary',
    duration: '13:20',
    views: '1.2M views',
    quality: '4K ULTRA HD',
    youtubeId: 'y3P4YZIID-Y',
    description: 'भारत में ई-वेस्ट रीसाइक्लिंग का ₹1,000 करोड़ से बड़ा उद्योग कैसे काम करता है? इस ग्राउंड रिपोर्ट में देखिए कैसे अनऑर्गनाइज्ड सीलमपुर मार्केट से लेकर आधुनिक हाई-टेक ऑथराइज्ड रीसाइक्लिंग प्लांट्स तक, पुराने मदरबोर्ड और मोबाइल्स से सोना, तांबा और चांदी जैसी कीमती धातुएं सुरक्षित तरीके से निकाली जाती हैं।',
    briefing: 'नमस्ते! इस वीडियो में देखिए भारत में ई-वेस्ट रीसाइक्लिंग का एक हज़ार करोड़ का छिपा हुआ बिज़नेस। कैसे पुराने कंप्यूटर, मोबाइल और मदरबोर्ड को प्रोसेस करके करोड़ों की कीमती धातुएं निकाली जाती हैं और अनऑथराइज्ड डंपिंग से पर्यावरण को बचाया जाता है।',
    tagColor: 'from-amber-500/25 to-orange-500/15 border-amber-500/50 text-amber-300',
    highlights: [
      { time: '01:10', label: 'भारत में ई-वेस्ट की वास्तविक स्थिति' },
      { time: '04:15', label: 'पुराने सर्किट बोर्ड्स की सॉर्टिंग' },
      { time: '08:30', label: 'गोल्ड और कॉपर की रिकवरी प्रक्रिया' },
      { time: '11:20', label: 'EPR नियमों से फॉर्मल रीसाइक्लिंग' }
    ],
    stats: [
      { label: 'Indian Market', value: '₹1,000+ Cr', detail: 'Rapidly growing circular sector' },
      { label: 'Annual E-Waste', value: '3.2M Tonnes', detail: 'Generated across Indian metros' },
      { label: 'Formal Diversion', value: '38% ↑', detail: 'Moving towards certified plants' },
      { label: 'Gold Purity', value: '99.5% 24K', detail: 'High-grade chemical refining' }
    ]
  },
  {
    id: 'hindi-gold-recovery-guide',
    title: 'E-Waste Se Gold Recovery Process (हिंदी गाइड) | Step by Step Pyrometallurgy & Refining',
    language: 'hindi',
    category: 'Precious Metals (हिंदी)',
    duration: '09:45',
    views: '840K views',
    quality: '1080p 60FPS',
    youtubeId: 'TDpzOPxW9OU',
    description: 'जानिए ई-कचरे से शुद्ध 24K सोना निकालने का वैज्ञानिक और इंडस्ट्रियल तरीका। इस ट्यूटोरियल में दिखाया गया है कि कैसे इलेक्ट्रॉनिक स्क्रैप, RAM कनेक्टर पिन्स और CPU से गोल्ड लेयर को सुरक्षित इंडस्ट्रियल प्रोसेस के माध्यम से शुद्ध सोने में बदला जाता है।',
    briefing: 'इस वीडियो में आप ई-वेस्ट से शुद्ध चौबीस कैरेट सोना निकालने की केमिकल और स्मेल्टिंग प्रक्रिया को हिंदी में बारीकी से समझ सकते हैं। यह दिखाता है कि एक टन सर्किट बोर्ड से सोने की कितनी अधिक पैदावार होती है।',
    tagColor: 'from-yellow-500/25 to-amber-500/15 border-yellow-500/50 text-yellow-300',
    highlights: [
      { time: '01:00', label: 'गोल्ड पिन्स और फिंगर्स की कटिंग' },
      { time: '03:20', label: 'केमिकल हाइड्रोमेटालर्जी सॉल्यूशन' },
      { time: '06:10', label: 'गोल्ड प्रेसिपिटेशन (Brown Gold Mud)' },
      { time: '08:30', label: 'फर्नेस मेल्टिंग और शुद्ध गोल्ड बार' }
    ],
    stats: [
      { label: 'Gold Yield', value: '300g / Ton', detail: '60x richer than underground ore' },
      { label: 'Process Temp', value: '1200°C', detail: 'Induction smelting crucible' },
      { label: 'Recovery Rate', value: '98.2%', detail: 'Minimal gold loss in slag' },
      { label: 'By-Product', value: 'Copper & Silver', detail: 'Precipitated simultaneously' }
    ]
  },
  {
    id: 'hindi-cpu-processors-gold',
    title: '250 KG CPU Processors Gold Recovery | पुराने प्रोसेसर से निकला भारी सोना',
    language: 'hindi',
    category: 'Refining Process (हिंदी)',
    duration: '08:15',
    views: '960K views',
    quality: '4K ULTRA HD',
    youtubeId: '01qKXMHOhEc',
    description: '250 किलोग्राम पुराने सिरेमिक और फाइबर CPU प्रोसेसर्स से सोना निकालने की रियल रिफाइनिंग वीडियो। सिरेमिक चिप्स में मौजूद हाई-डेंसिटी गोल्ड बॉन्डिंग वायर्स और गोल्ड-प्लेटेड लेग्स को फर्नेस और एक्वा-रेजिया द्वारा रिफाइन करके असली सोने की सिल्लियां बनाई जाती हैं।',
    briefing: 'देखिए कैसे दो सौ पचास किलो पुराने सीपीयू प्रोसेसर्स से हाई-टेम्परेचर फर्नेस और रिफाइनिंग के ज़रिए शुद्ध सोने का बिस्किट तैयार किया जाता है। इलेक्ट्रॉनिक्स में छुपा सोना अविश्वसनीय है।',
    tagColor: 'from-amber-600/25 to-red-500/15 border-amber-500/50 text-amber-400',
    highlights: [
      { time: '00:50', label: '250 KG CPU बैच की अनलोडिंग' },
      { time: '02:40', label: 'पिन स्ट्रिपिंग और एसिड वॉश' },
      { time: '05:15', label: '24 कैरेट गोल्ड स्पंज फिल्ट्रेशन' },
      { time: '07:20', label: 'फाइनल गोल्ड बुलियन का वजन' }
    ],
    stats: [
      { label: 'Batch Weight', value: '250 KG', detail: 'Old ceramic/fiber CPUs' },
      { label: 'Total Gold', value: '~142 Grams', detail: 'Pure refined 24K bullion' },
      { label: 'Assay Grade', value: '999.0 Fine', detail: 'XRF spectrometer verified' },
      { label: 'Eco Savings', value: '82% Energy', detail: 'Saved vs raw rock extraction' }
    ]
  },
  {
    id: 'hindi-pcb-gold-fingers',
    title: 'Gold in Old PCBs! Extracting Gold Fingers & Pins | कंप्यूटर स्क्रैप से गोल्ड एक्सट्रैक्शन',
    language: 'hindi',
    category: 'PCB Recovery (हिंदी)',
    duration: '11:05',
    views: '670K views',
    quality: '1080p 60FPS',
    youtubeId: 'dtkYybN8gG0',
    description: 'कंप्यूटर मदरबोर्ड, रैम स्टिक्स और पीसीआई कार्ड्स के किनारों पर बनी सुनहरी पट्टियों (Gold Fingers) में शुद्ध सोना होता है। यह वीडियो दिखाता है कि कैसे बिना जहरीली गैसों के पर्यावरण-अनुकूल तरीके से सोना और कॉपर हीटपाइप्स अलग किए जाते हैं।',
    briefing: 'कंप्यूटर रैम और मदरबोर्ड्स के गोल्ड फिंगर्स से सोने की रीसाइक्लिंग कैसे होती है, इस वीडियो में स्टेप बाय स्टेप समझाया गया है। यह ई-वेस्ट का सबसे आकर्षक भाग है।',
    tagColor: 'from-orange-500/25 to-amber-500/15 border-orange-500/50 text-orange-300',
    highlights: [
      { time: '01:15', label: 'RAM और PCI कार्ड्स से फिंगर कटाई' },
      { time: '04:00', label: 'सॉल्यूशन डी-प्लेटिंग बाथ' },
      { time: '07:30', label: 'गोल्ड फ्लेक्स का पृथक्करण' },
      { time: '09:45', label: 'टॉर्च मेल्टिंग और सोने का दाना' }
    ],
    stats: [
      { label: 'Contact Plating', value: '30-50 µin', detail: 'Heavy industrial gold flash' },
      { label: 'Copper Core', value: '100% Recycled', detail: 'Melted into clean ingots' },
      { label: 'Zero Smoke', value: 'Scrubber Filter', detail: 'Non-polluting safe process' },
      { label: 'Circuit Glass', value: 'Aggregate', detail: 'Used in composite tiles' }
    ]
  },

  // ===================== ENGLISH VIDEOS =====================
  {
    id: 'eng-business-insider-6m',
    title: 'How 6 Million Pounds Of E-Waste Gets Recycled A Month | Big Business Documentary',
    language: 'english',
    category: 'Industrial Scale (English)',
    duration: '10:50',
    views: '3.8M views',
    quality: '4K ULTRA HD',
    youtubeId: 'S2lmPIa1iWE',
    description: 'Go inside one of North America’s largest e-waste processing hubs handling over 6 million pounds of discarded tech every single month. See mammoth industrial shredders, optical laser sorters, and magnetic separators pulverize laptops, servers, and monitors into pure commercial-grade commodity flakes.',
    briefing: 'Welcome to Big Business E-Waste. This flagship documentary tours a mega-facility recycling six million pounds of consumer electronics each month. Watch industrial shredders, optical laser sorters, and pyrometallurgical separation in full four-K resolution.',
    tagColor: 'from-cyan-500/25 to-blue-500/15 border-cyan-500/50 text-cyan-300',
    highlights: [
      { time: '00:45', label: 'Intake Manifests & Pallet Sorting' },
      { time: '03:10', label: 'High-Torque Primary Shredder' },
      { time: '06:05', label: 'Eddy Current Non-Ferrous Sorting' },
      { time: '08:40', label: 'Clean Copper & Aluminum Pellets' }
    ],
    stats: [
      { label: 'Monthly Intake', value: '6,000,000 lbs', detail: 'Massive circular throughput' },
      { label: 'Material Yield', value: '97.4%', detail: 'Returned to raw manufacturing' },
      { label: 'Landfill Diversion', value: '100%', detail: 'Zero unmanaged e-waste' },
      { label: 'Data Security', value: 'DoD 5220.22-M', detail: 'Guaranteed certified shredding' }
    ]
  },
  {
    id: 'eng-apple-daisy-robot',
    title: 'Meet Daisy: Apple’s Secret Recycling Robot Disassembling 200 iPhones/Hour',
    language: 'english',
    category: 'Robotics & AI (English)',
    duration: '06:15',
    views: '1.9M views',
    quality: '1080p 60FPS',
    youtubeId: 'oyeAC07CeCg',
    description: 'Take a close look inside Apple’s flagship environmental robot Daisy. Daisy disassembles 15 different iPhone models at an astonishing 200 units per hour. It blasts -80°C cryogenic air to freeze and safely pop lithium-ion batteries out without puncture risks, followed by automated neodymium magnet extraction.',
    briefing: 'This feature showcases Apple Daisy, a high-speed robotics system that disassembles 200 iPhones every hour. It uses minus eighty degree nitrogen blasts to remove lithium-ion batteries safely, allowing ninety-eight percent recovery of rare earth neodymium magnets.',
    tagColor: 'from-emerald-500/25 to-teal-500/15 border-emerald-500/50 text-emerald-300',
    highlights: [
      { time: '00:30', label: 'High-Speed Conveyor Intake' },
      { time: '01:50', label: 'Cryogenic -80°C Battery Release' },
      { time: '03:20', label: 'Haptic Engine & Neodymium Pliers' },
      { time: '05:00', label: 'Unibody Recycled Aluminum Bin' }
    ],
    stats: [
      { label: 'Disassembly Rate', value: '200 Units/Hr', detail: 'Fully autonomous robotics' },
      { label: 'Cobalt Recovery', value: '99%', detail: 'Zero thermal degradation' },
      { label: 'Rare Earths', value: '100% Retained', detail: 'High-purity magnet sorting' },
      { label: 'Models Handled', value: '15+ iPhone Gens', detail: 'Computer vision adaptable' }
    ]
  },
  {
    id: 'eng-apple-robot-revolution',
    title: 'Is This Robot Apple’s Most Important Device Yet? Inside Automated Disassembly',
    language: 'english',
    category: 'Deep Tech (English)',
    duration: '08:40',
    views: '720K views',
    quality: '4K ULTRA HD',
    youtubeId: 'fUXiYecGZs8',
    description: 'An architectural deep-dive into automated electronics recycling robotics. How computer vision, torque-controlled robotic arms, and AI sensors separate hazardous lithium pouch cells from precious gold and tantalum-rich micro-logic boards in fractions of a second.',
    briefing: 'Explore how advanced artificial intelligence and computer vision drive modern e-waste disassembly. Discover why automated robotic tear-downs are the future of circular consumer electronics.',
    tagColor: 'from-blue-500/25 to-indigo-500/15 border-blue-500/50 text-blue-300',
    highlights: [
      { time: '01:10', label: 'Computer Vision Defect Scanning' },
      { time: '03:30', label: 'Precision Screw Extraction' },
      { time: '05:40', label: 'Hazardous Battery Quarantine' },
      { time: '07:30', label: 'Closed-Loop Material Output' }
    ],
    stats: [
      { label: 'Precision', value: '0.1 mm', detail: 'Robotic arm positioning' },
      { label: 'Fire Risk', value: '0.00%', detail: 'Inert nitrogen chamber' },
      { label: 'Tantalum Yield', value: '95% Captured', detail: 'From SMD capacitors' },
      { label: 'Energy Offset', value: '78%', detail: 'vs mining raw lithium' }
    ]
  },
  {
    id: 'eng-autonomous-dismantling',
    title: 'Autonomous Electronics Dismantling & Material Recovery at Enterprise Scale',
    language: 'english',
    category: 'EPR & Circularity (English)',
    duration: '05:25',
    views: '510K views',
    quality: '1080p 60FPS',
    youtubeId: '2Bu-gl7v-P8',
    description: 'A close-up examination of automated hardware recovery workflows supporting Extended Producer Responsibility (EPR) programs. See how verified commodity yields translate directly into audited regulatory offset certificates for global technology corporations.',
    briefing: 'Watch autonomous enterprise hardware disassembly in action. Learn how verified material recovery feeds into immutable EPR credit registries for zero-fraud compliance.',
    tagColor: 'from-lime-500/25 to-emerald-500/15 border-lime-500/50 text-lime-300',
    highlights: [
      { time: '00:40', label: 'RFID Tagged Pallet Verification' },
      { time: '01:50', label: 'Robotic Enclosure Peeling' },
      { time: '03:15', label: 'Continuous Scale Tare Audit' },
      { time: '04:40', label: 'EPR Credit Hash Generation' }
    ],
    stats: [
      { label: 'EPR Audit', value: 'SHA-256', detail: 'Immutable custody certificate' },
      { label: 'Pure Gold Bar', value: '24K Standard', detail: 'Refined at LBMA smelters' },
      { label: 'Carbon Avoided', value: '1.44 kg / kg', detail: 'Life-cycle assessment validated' },
      { label: 'Compliance Fee', value: 'Zero Penalties', detail: 'Audited circular chain' }
    ]
  }
];

interface CinemaPageProps {
  onNavigate: (tab: string) => void;
}

export const CinemaPage: React.FC<CinemaPageProps> = ({ onNavigate }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(VIDEOS[0]);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeLang, setActiveLang] = useState<'all' | 'hindi' | 'english'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVideos = useMemo(() => {
    return VIDEOS.filter(vid => {
      const matchLang = activeLang === 'all' || vid.language === activeLang;
      const matchSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vid.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLang && matchSearch;
    });
  }, [activeLang, searchQuery]);

  const handleSelectVideo = (video: VideoItem) => {
    soundEffects.playClick();
    setSelectedVideo(video);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePlayVoiceover = () => {
    soundEffects.playClick();
    setIsSpeaking(true);
    voiceAssistant.speak(selectedVideo.briefing, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopVoiceover = () => {
    soundEffects.playClick();
    voiceAssistant.stop();
    setIsSpeaking(false);
  };

  const handleShare = () => {
    soundEffects.playSuccess();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={`transition-colors duration-500 ${theaterMode ? 'bg-black text-slate-100' : 'relative'}`}>
      {/* Ambient Theater Backlight Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300">
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>NEXUS 4K CINEMA & DOCUMENTARY THEATER</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-white font-bold">
                HINDI + ENGLISH
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Circular Technology</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
                In Action
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Real high-definition documentaries & industrial showcases in <strong>Hindi and English</strong>. Watch urban gold mining from discarded processors, Apple Daisy robotic teardowns, and circular supply chain mechanics.
            </p>
          </div>

          {/* Quick Cinema Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                soundEffects.playClick();
                setTheaterMode(!theaterMode);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border flex items-center space-x-2 transition-all cursor-pointer ${
                theaterMode
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-green font-bold'
                  : 'bg-nexus-charcoal border-slate-700 text-slate-300 hover:border-emerald-500/50'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>{theaterMode ? 'Theater Mode Active' : 'Theater Mode'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-nexus-charcoal border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-colors cursor-pointer"
              title="Copy shareable link"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MAIN VIDEO CINEMA SCREEN */}
        <div className="relative group">
          {/* Reactive Ambient Glow around Video Frame */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/30 via-amber-500/20 to-cyan-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 -z-10" />

          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-emerald-500/40 shadow-2xl">
            {/* Embedded Responsive High-Def Player */}
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Controls & Information Bar */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-nexus-charcoal/95 to-nexus-dark/95 border-t border-slate-800 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Language Badge */}
                    {selectedVideo.language === 'hindi' ? (
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/25 via-amber-500/20 to-emerald-500/25 border border-orange-500/50 text-amber-300 font-bold uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                        <span>🇮🇳</span>
                        <span>HINDI (हिंदी)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                        <span>🌐</span>
                        <span>ENGLISH</span>
                      </span>
                    )}

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${selectedVideo.tagColor}`}>
                      {selectedVideo.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedVideo.quality}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{selectedVideo.duration}</span>
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{selectedVideo.views}</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {selectedVideo.title}
                  </h2>
                </div>

                {/* AI Narration Voiceover Button */}
                <div className="flex flex-wrap items-center gap-3">
                  {isSpeaking ? (
                    <button
                      onClick={handleStopVoiceover}
                      className="px-5 py-3 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2 animate-pulse hover:bg-red-900/80 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-red-400" />
                      <span>Stop Audio Briefing</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePlayVoiceover}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 text-xs font-bold flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all shadow-glow-green cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 fill-current" />
                      <span>
                        {selectedVideo.language === 'hindi'
                          ? 'Play AI Audio (हिंदी में सुनें)'
                          : 'Play AI Audio Briefing (English)'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onNavigate('pickups');
                    }}
                    className="px-5 py-3 rounded-2xl bg-nexus-charcoal border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>Schedule Pickup</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Video Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                {selectedVideo.description}
              </p>

              {/* Real-time Telemetry Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {selectedVideo.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-nexus-dark/90 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 mt-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {stat.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Timeline Chapter Markers */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Key Process Milestones in this Showcase</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {selectedVideo.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-nexus-dark border border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-300"
                    >
                      <span className="font-mono text-emerald-400 text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 font-bold shrink-0">
                        {h.time}
                      </span>
                      <span className="truncate">{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURATED VIDEO PLAYLIST SELECTOR WITH LANGUAGE FILTER */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
                <span>Showcase Video Library</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  {filteredVideos.length} EPISODES
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Switch between Hindi documentaries and English showcases below.
              </p>
            </div>

            {/* Language Selector Filter Tabs */}
            <div className="flex items-center bg-nexus-dark/90 p-1.5 rounded-2xl border border-slate-800 space-x-1">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveLang('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeLang === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-green font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Videos ({VIDEOS.length})
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveLang('hindi');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeLang === 'hindi'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <span>🇮🇳 Hindi ({VIDEOS.filter(v => v.language === 'hindi').length})</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveLang('english');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  activeLang === 'english'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                <span>🌐 English ({VIDEOS.filter(v => v.language === 'english').length})</span>
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredVideos.map((vid) => {
              const isCurrent = vid.id === selectedVideo.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className="cursor-pointer"
                >
                  <TiltCard3D intensity={12} glare={true}>
                    <div
                      className={`h-full rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-nexus-charcoal border-emerald-400 shadow-glow-green ring-1 ring-emerald-400'
                          : 'bg-nexus-charcoal/70 border-slate-800 hover:border-emerald-500/50 hover:bg-nexus-charcoal'
                      }`}
                    >
                      {/* Video Thumbnail Preview */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-3 group/thumb">
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/thumb:bg-black/20 transition-colors">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950 scale-110'
                              : 'bg-white/90 text-slate-950 group-hover/thumb:scale-110'
                          }`}>
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Language Tag on Thumbnail */}
                        <div className="absolute top-2 left-2">
                          {vid.language === 'hindi' ? (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/40">
                              🇮🇳 HINDI
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/40">
                              🌐 ENGLISH
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white font-semibold">
                          {vid.duration}
                        </span>
                      </div>

                      {/* Video Details */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span className="text-emerald-400 font-semibold">{vid.category}</span>
                            <span className="text-slate-500">{vid.quality}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {vid.title}
                          </h4>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{vid.views}</span>
                          <span className={`text-[10px] font-bold font-mono ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isCurrent ? '● NOW PLAYING' : 'CLICK TO WATCH'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                </div>
              );
            })}
          </div>
        </div>

        {/* EDUCATIONAL IMPACT CALLOUT */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-emerald-950/40 via-nexus-charcoal to-cyan-950/30 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-semibold">
              <Zap className="w-4 h-4 text-lime-400" />
              <span>SCHEDULE ELECTRONICS DISPOSAL TODAY</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Turn Discarded Devices Into Certified EPR Offsets
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule a doorstep collection for old phones, computers, batteries, and appliances. Get instant weigh-scale calibration, certified data sanitization, and official recovery documentation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('pickups');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-glow-green flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Schedule Pickup Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('centers');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-nexus-dark border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-semibold hover:text-white transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Find Drop-off Hubs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
