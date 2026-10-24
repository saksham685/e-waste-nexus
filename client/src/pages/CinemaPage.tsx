import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
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
  {
    id: 'urban-mining-gold',
    title: 'Urban Mining: Extracting 99.9% Pure Gold from E-Waste Circuit Boards',
    category: 'Precious Metals Recovery',
    duration: '11:42',
    views: '1.4M views',
    quality: '4K ULTRA HD',
    youtubeId: 'wzL4dYrE_8M',
    description: 'Witness the high-tech pyrometallurgy and chemical hydrometallurgy process that recovers gold, silver, and palladium from discarded computer motherboards, RAM sticks, and smartphone CPUs. 1 ton of smartphones yields over 300 grams of pure gold—nearly 60 times richer than the best gold mines on Earth.',
    briefing: 'Welcome to Urban Mining. Did you know one ton of discarded smartphones contains 300 grams of pure gold, while one ton of gold ore yields only five grams? This documentary reveals how e-waste is shredded, melted at twelve hundred degrees Celsius, and refined into pure bullion.',
    tagColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-400',
    highlights: [
      { time: '01:15', label: 'Mechanical Shredding & Separation' },
      { time: '03:40', label: 'Eddy Current Metal Sorting' },
      { time: '06:20', label: 'Smelting & Induction Furnaces (1200°C)' },
      { time: '09:05', label: 'Electrolytic Refining & 24K Gold Bar' }
    ],
    stats: [
      { label: 'Gold Yield', value: '300 g / Ton', detail: '60x richer than gold ore' },
      { label: 'Silver Yield', value: '1.1 kg / Ton', detail: 'Recovered from contact pins' },
      { label: 'Energy Saved', value: '85%', detail: 'vs traditional underground mining' },
      { label: 'Carbon Abated', value: '1.8 Tons', detail: 'Per ton of electronics recycled' }
    ]
  },
  {
    id: 'apple-daisy-robot',
    title: 'Robotic Deconstruction: Apple Daisy & Liam Disassembling 200 iPhones/Hour',
    category: 'Automated Robotics',
    duration: '06:28',
    views: '890K views',
    quality: '1080p 60FPS',
    youtubeId: 'AYshVbcEmUc',
    description: 'Take a close look inside Apple’s secretive recycling robot Daisy. Daisy can disassemble 15 different iPhone models at a rate of 200 per hour, freezing batteries with minus 80 degree Celsius air blasts to cleanly pop out cobalt cells without hazardous fire risks.',
    briefing: 'This feature showcases Apple Daisy, a high-speed robotics system that disassembles 200 iPhones every hour. It uses minus eighty degree nitrogen blasts to remove lithium-ion batteries safely, allowing ninety-eight percent recovery of rare earth neodymium magnets.',
    tagColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
    highlights: [
      { time: '00:45', label: 'Cryogenic Battery Release (-80°C)' },
      { time: '02:10', label: 'Taptic Engine & Rare Earth Removal' },
      { time: '04:15', label: 'Logic Board Gold Separation' },
      { time: '05:30', label: '100% Recycled Aluminum Enclosures' }
    ],
    stats: [
      { label: 'Throughput', value: '200 Units/Hr', detail: 'Autonomous disassembly' },
      { label: 'Cobalt Recovery', value: '99%', detail: 'Zero thermal degradation' },
      { label: 'Rare Earths', value: '100%', detail: 'Neodymium & Dysprosium magnets' },
      { label: 'Material Purity', value: '99.4%', detail: 'Zero cross-contamination' }
    ]
  },
  {
    id: 'global-ewaste-journey',
    title: 'The Circular Supply Chain: What Actually Happens to Your Discarded Tech',
    category: 'Global Circular Economy',
    duration: '14:15',
    views: '2.1M views',
    quality: '4K ULTRA HD',
    youtubeId: 'mleQVO1Vd1I',
    description: 'An investigative deep-dive following the journey of discarded consumer electronics from door-step collection to state-of-the-art recycling facilities. Understand how transparent chain-of-custody tracking prevents illegal dumping and guarantees circular remanufacturing.',
    briefing: 'Follow the circular chain of custody. When you book a collection on E-Waste Nexus, this documentary shows every step of the journey: calibrated weigh-ins, certified data destruction, non-toxic dismantling, and circular reallocation to new battery factories.',
    tagColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    highlights: [
      { time: '01:30', label: 'Logistics Fleet Dispatch & Intake' },
      { time: '04:50', label: 'NIST 800-88 Data Sanitization' },
      { time: '08:15', label: 'Polymer & Flame Retardant Sorting' },
      { time: '11:40', label: 'EPR Certificate Cryptographic Minting' }
    ],
    stats: [
      { label: 'Annual E-Waste', value: '62M Tonnes', detail: 'Generated globally each year' },
      { label: 'Recovered Value', value: '$91 Billion', detail: 'In recoverable commodities' },
      { label: 'Landfill Diversion', value: '94.2%', detail: 'Through certified nexus channels' },
      { label: 'Toxic Prevention', value: '100%', detail: 'Lead, mercury & arsenic trapped' }
    ]
  },
  {
    id: 'epr-framework-guide',
    title: 'Extended Producer Responsibility (EPR): How Tech Giants Offset Impact',
    category: 'EPR & Regulatory Compliance',
    duration: '08:50',
    views: '450K views',
    quality: '4K ULTRA HD',
    youtubeId: 'zCRKvDyyHmI',
    description: 'Learn the financial and regulatory mechanics behind Extended Producer Responsibility (EPR). See how electronics manufacturers purchase verified recycling credits generated by authorized platforms like E-Waste Nexus to satisfy annual statutory recycling quotas.',
    briefing: 'Extended Producer Responsibility makes hardware manufacturers legally responsible for their products at end-of-life. Watch this briefing to understand how certified recycling weight translates into marketable EPR credits on the E-Waste Nexus registry.',
    tagColor: 'from-lime-500/20 to-emerald-500/10 border-lime-500/40 text-lime-400',
    highlights: [
      { time: '01:00', label: 'EPR Legislative Directives' },
      { time: '03:15', label: 'Batch Assay & Weight Audits' },
      { time: '05:30', label: 'Dual Authorization Registry' },
      { time: '07:20', label: 'Quarterly Corporate Retirement' }
    ],
    stats: [
      { label: 'Credit Value', value: '$45 - $95', detail: 'Per audited metric tonne' },
      { label: 'Compliance Fee', value: 'Zero Penalties', detail: 'With certified audit trail' },
      { label: 'Verification Stages', value: '5 Steps', detail: 'Dual sign-off before credit mint' },
      { label: 'Fraud Reduction', value: '100%', detail: 'Zero double-crediting via SHA-256' }
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

  const handleSelectVideo = (video: VideoItem) => {
    soundEffects.playClick();
    setSelectedVideo(video);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePlayVoiceover = () => {
    soundEffects.playClick();
    setIsSpeaking(true);
    voiceAssistant.speak(selectedVideo.briefing);
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
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Circular Technology</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
                In Action
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              High-definition video showcases showing urban gold mining, high-speed robotic disassembly, pyrometallurgy smelting, and how Extended Producer Responsibility (EPR) protects our planet.
            </p>
          </div>

          {/* Quick Cinema Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                soundEffects.playClick();
                setTheaterMode(!theaterMode);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-2 transition-all ${
                theaterMode
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-green'
                  : 'bg-nexus-charcoal border-slate-700 text-slate-300 hover:border-emerald-500/50'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>{theaterMode ? 'Theater Mode Active' : 'Theater Mode'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-nexus-charcoal border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-colors"
              title="Copy shareable link"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MAIN VIDEO CINEMA SCREEN */}
        <div className="relative group">
          {/* Reactive Ambient Glow around Video Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-cyan-500/20 to-lime-500/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-700 -z-10" />

          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-emerald-500/30 shadow-2xl">
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
            <div className="p-6 bg-gradient-to-b from-nexus-charcoal/90 to-nexus-dark/95 border-t border-slate-800 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
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

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedVideo.title}
                  </h2>
                </div>

                {/* AI Narration Voiceover Button */}
                <div className="flex items-center space-x-3">
                  {isSpeaking ? (
                    <button
                      onClick={handleStopVoiceover}
                      className="px-4 py-2.5 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2 animate-pulse hover:bg-red-900/80 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-red-400" />
                      <span>Stop Voice Briefing</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePlayVoiceover}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 text-xs font-bold flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all shadow-glow-green"
                    >
                      <Volume2 className="w-4 h-4 fill-current" />
                      <span>Play AI Audio Briefing</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onNavigate('pickups');
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-nexus-charcoal border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <span>Schedule Pickup</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Video Description */}
              <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                {selectedVideo.description}
              </p>

              {/* Real-time Telemetry Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {selectedVideo.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-nexus-dark/80 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 mt-0.5">
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
                  <span>Key Industrial Milestones in this Showcase</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedVideo.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-nexus-dark border border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-300"
                    >
                      <span className="font-mono text-emerald-400 text-[11px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
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

        {/* CURATED VIDEO PLAYLIST SELECTOR */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Select Showcase Reel</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  {VIDEOS.length} EPISODES
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any title below to immediately stream high-definition reference footage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIDEOS.map((vid) => {
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
                      {/* Video Thumbnail Preview Mock */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-3 group/thumb">
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/thumb:bg-black/20 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950 scale-110'
                              : 'bg-white/90 text-slate-950 group-hover/thumb:scale-110'
                          }`}>
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
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
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-nexus-charcoal to-cyan-950/30 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-semibold">
              <Zap className="w-4 h-4 text-lime-400" />
              <span>READY TO RECYCLE YOUR OWN ELECTRONICS?</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Turn Discarded Devices Into Certified EPR Offsets Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule a doorstep collection for your old smartphones, laptops, and batteries. Get instant weight verification and certified commodity certificates.
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
