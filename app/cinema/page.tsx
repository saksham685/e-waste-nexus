'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  Film,
  Play,
  Languages,
  Sparkles,
  Maximize2,
  Minimize2,
  Tv,
  CheckCircle2,
  Eye,
  Clock,
  Volume2,
} from 'lucide-react';

interface CinemaVideo {
  id: string;
  youtubeId: string;
  title: string;
  hindiTitle?: string;
  description: string;
  language: 'hindi' | 'english';
  category: 'Urban Gold Mining' | 'Documentary' | 'Robotic Disassembly' | 'Hazardous Recycling';
  duration: string;
  resolution: '4K UHD' | '1080p HD';
  narrator: string;
  takeaway: string;
}

const CINEMA_VIDEOS: CinemaVideo[] = [
  // 1. English - Gold Recovery from Electronics
  {
    id: 'vid-1',
    youtubeId: 'Ou-LPYzH3nE',
    title: 'Extracting Gold from Electronic Waste | Modern Hydrometallurgy Assay',
    description:
      'A scientific investigation into modern industrial hydrometallurgy. Discover how high-efficiency refining facilities extract 99.9% fine gold bullion from computer circuit boards with zero cyanide.',
    language: 'english',
    category: 'Urban Gold Mining',
    duration: '14:28',
    resolution: '4K UHD',
    narrator: 'Tech Gold Recovery Science',
    takeaway: '1 metric ton of printed circuit boards contains up to 350 grams of fine gold bullion.',
  },
  // 2. Hindi - E-Waste Management & Seelampur Ground Reality
  {
    id: 'vid-2',
    youtubeId: 'bwljsb2yEYo',
    title: 'भारत में ई-कचरे का प्रबंधन कैसे करें? सरकारी नियम व आधुनिक तकनीकें',
    hindiTitle: 'How to Deal With E-Waste in India? StudyIQ Hindi Special',
    description:
      'जानिए भारत में ई-कचरे का सुरक्षित निस्तारण कैसे किया जाता है और नए CPCB 2022 नियमों के तहत EPR सर्टिफिकेशन क्यों आवश्यक है।',
    language: 'hindi',
    category: 'Hazardous Recycling',
    duration: '18:45',
    resolution: '1080p HD',
    narrator: 'StudyIQ IAS Hindi Special',
    takeaway: 'असुरक्षित तरीके से ई-कचरा जलाने से भूमिगत जल में सीसा और पारा घुल जाता है।',
  },
  // 3. English - The Tragic Costs of Unregulated E-Waste
  {
    id: 'vid-3',
    youtubeId: '4GtWGHvX-rk',
    title: 'The Tragic Costs of Global E-Waste & Why Closed-Loop Is Vital',
    description:
      'An investigative deep-dive tracking informal e-waste dumping and showing why blockchain-verified chain-of-custody tracking is essential for modern electronics.',
    language: 'english',
    category: 'Hazardous Recycling',
    duration: '22:15',
    resolution: '4K UHD',
    narrator: 'Global Environment Documentary',
    takeaway: 'Closed-loop digital manifest systems prevent toxic heavy metals from contaminating aquifers.',
  },
  // 4. English - Apple Daisy Disassembly Robot
  {
    id: 'vid-4',
    youtubeId: 'AYshVbcEmUc',
    title: 'Apple Daisy: The Robot That Recycles 200 iPhones An Hour',
    description:
      'Meet Daisy, Apple’s cutting-edge disassembly robot capable of separating aluminum enclosures, cobalt batteries, and tungsten haptic engines without shredding or material degradation.',
    language: 'english',
    category: 'Robotic Disassembly',
    duration: '11:12',
    resolution: '4K UHD',
    narrator: 'CNET Tech Insider',
    takeaway: 'Robotic component isolation preserves 100% material grade for next-gen manufacturing.',
  },
  // 5. Hindi - Understanding E-Waste Rules & EPR Quotas
  {
    id: 'vid-5',
    youtubeId: 'V9w9h3kU324',
    title: 'ई-वेस्ट मैनेजमेंट नियम और EPR क्या है? भारतीय उद्योगों के लिए गाइड',
    hindiTitle: 'Understanding India E-Waste Rules 2022 & EPR Quotas',
    description:
      'केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB) के नए ई-कचरा नियम और कंपनियों के लिए एक्सटेंडेड प्रोड्यूसर रिस्पॉन्सिबिलिटी (EPR) के नियम कैसे काम करते हैं।',
    language: 'hindi',
    category: 'Documentary',
    duration: '16:05',
    resolution: '1080p HD',
    narrator: 'Drishti IAS Environment Special',
    takeaway: 'कंपनियों को अपने कुल इलेक्ट्रॉनिक उत्पादन का 60% से 100% रीसायकल करना अनिवार्य है।',
  },
  // 6. Hindi - RAM aur Motherboard se Sona Nikalne ki Vidhi
  {
    id: 'vid-6',
    youtubeId: '1nO5q4Fh5kM',
    title: 'पुराने कंप्यूटर और रैम (RAM) से 24 कैरेट सोना कैसे निकाला जाता है?',
    hindiTitle: 'How Gold Is Recovered from Motherboards & RAM Chips',
    description:
      'हाइड्रोमेटालर्जी (Hydrometallurgy) और एसिड-फ्री केमिकल लीचिंग के जरिए सर्किट बोर्ड से शुद्ध 24 कैरेट सोना अलग करने की पूरी प्रयोगशाला प्रक्रिया।',
    language: 'hindi',
    category: 'Urban Gold Mining',
    duration: '13:50',
    resolution: '1080p HD',
    narrator: 'Vigyan Recharge',
    takeaway: 'कॉपर और निकेल को अलग करने के बाद गोल्ड अवक्षेपण (Precipitation) किया जाता है।',
  },
  // 7. English - Redwood Materials Battery Recycling Gigafactory
  {
    id: 'vid-7',
    youtubeId: 'F16g8vLz3h4',
    title: 'Inside Redwood Materials: The Gigafactory of Battery Recycling',
    description:
      'JB Straubel’s high-tech hydrometallurgical facility recovering 95% of cobalt, nickel, and battery-grade lithium from electric vehicles and consumer devices.',
    language: 'english',
    category: 'Urban Gold Mining',
    duration: '15:40',
    resolution: '4K UHD',
    narrator: 'Fully Charged Show',
    takeaway: 'Battery Black Mass refining uses 80% less energy than virgin lithium brines.',
  },
  // 8. Hindi - Future of Clean Tech Startups in India
  {
    id: 'vid-8',
    youtubeId: 't6l9v8m7u2k',
    title: 'भारत में ई-वेस्ट रीसाइक्लिंग का भविष्य: अरबों डॉलर का नया स्वच्छ उद्योग',
    hindiTitle: 'The Multi-Billion Dollar Circular Economy Opportunity',
    description:
      'भारत में उभरते हुए क्लीन-टेक रीसाइक्लिंग प्लांट्स और ग्रीन जॉब्स का एक समग्र विश्लेषण। जानिए कैसे कचरा अब एक मूल्यवान संसाधन बन चुका है।',
    language: 'hindi',
    category: 'Documentary',
    duration: '19:30',
    resolution: '1080p HD',
    narrator: 'Finshots Hindi Special',
    takeaway: 'भारत 2030 तक दुनिया का तीसरा सबसे बड़ा सर्कुलर टेक मार्केट बनने जा रहा है।',
  },
];

export default function CinemaPage() {
  const { theaterMode, setTheaterMode, activeLanguage, setActiveLanguage } = useUIStore();
  const [selectedVideo, setSelectedVideo] = useState<CinemaVideo>(CINEMA_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const handleSelectVideo = (video: CinemaVideo) => {
    soundEffects.playClick();
    setSelectedVideo(video);
    setIsPlaying(true);

    // AI voice announces title briefly
    voiceAssistant.speak(
      `Now playing: ${video.title.slice(0, 70)}. Category: ${video.category}.`
    );
  };

  const filteredVideos = CINEMA_VIDEOS.filter((vid) => {
    if (activeLanguage === 'all') return true;
    return vid.language === activeLanguage;
  });

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>Nexus 4K Cinema Theater</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated E-Waste Documentaries &amp; Tech Assays
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Watch certified urban mining, gold extraction, and robotic disassembly footage in Hindi
            and English.
          </p>
        </div>

        {/* Language Filter Buttons */}
        <div className="flex items-center space-x-2 bg-nexus-card border border-emerald-500/30 p-1.5 rounded-2xl self-start md:self-auto">
          <Languages className="w-4 h-4 text-emerald-400 ml-2 mr-1" />
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveLanguage('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLanguage === 'all'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Videos (8)
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveLanguage('hindi');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLanguage === 'hindi'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveLanguage('english');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLanguage === 'english'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Theater Display */}
      <div
        className={`w-full transition-all duration-500 mb-12 ${
          theaterMode
            ? 'fixed inset-0 z-50 bg-black/95 p-4 sm:p-8 flex flex-col justify-center items-center'
            : 'relative'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto bg-nexus-card border-2 border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Ambient Video Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 via-cyan-500/20 to-lime-500/30 blur-2xl pointer-events-none" />

          {/* Video Player Frame */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </div>

          {/* Video Meta Info Bar */}
          <div className="p-6 bg-nexus-dark/95 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedVideo.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-red-500/20 text-red-300 border border-red-500/30">
                  {selectedVideo.resolution}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedVideo.language === 'hindi' ? 'हिन्दी Audio' : 'English Audio'}
                </span>
                <span className="text-xs font-mono text-gray-400">Duration: {selectedVideo.duration}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-2">
                {selectedVideo.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
                {selectedVideo.description}
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Core Takeaway: {selectedVideo.takeaway}</span>
              </div>
            </div>

            {/* Theater Controls */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setTheaterMode(!theaterMode);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-nexus-card hover:bg-emerald-500/20 border border-emerald-500/30 text-white text-xs font-semibold transition-colors"
              >
                {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{theaterMode ? 'Exit Theater' : 'Theater Mode'}</span>
              </button>

              <button
                onClick={() =>
                  voiceAssistant.speak(
                    `${selectedVideo.title}. ${selectedVideo.description}. Key takeaway: ${selectedVideo.takeaway}`
                  )
                }
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Synopsis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Selection Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Tv className="w-5 h-5 text-emerald-400" />
          <span>Select Documentaries &amp; Deep-Dives</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const isCurrent = video.id === selectedVideo.id;
            return (
              <TiltCard3D key={video.id}>
                <div
                  onClick={() => handleSelectVideo(video)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 h-full flex flex-col bg-nexus-card ${
                    isCurrent
                      ? 'border-emerald-400 shadow-glow-green scale-[1.02]'
                      : 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-glow-green'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-nexus-dark overflow-hidden group">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-nexus-dark flex items-center justify-center shadow-glow-green group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white">
                      {video.duration}
                    </span>

                    {/* Language tag */}
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold ${
                        video.language === 'hindi'
                          ? 'bg-amber-500 text-nexus-dark'
                          : 'bg-cyan-500 text-nexus-dark'
                      }`}
                    >
                      {video.language === 'hindi' ? 'हिन्दी' : 'English'}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1">
                        <span className="text-emerald-400 font-semibold">{video.category}</span>
                        <span>{video.resolution}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                        {video.title}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs text-gray-400">
                      <span className="font-mono text-[11px] text-gray-500">{video.narrator}</span>
                      <span className="text-emerald-400 flex items-center space-x-1 font-semibold text-xs">
                        <span>Play Film</span>
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            );
          })}
        </div>
      </div>
    </div>
  );
}
