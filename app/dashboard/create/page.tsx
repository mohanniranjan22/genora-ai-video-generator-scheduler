"use client";

import { useState, useRef, useEffect } from "react";
import {
  Check, ChevronRight, Sparkles, Ghost, Zap, Brain,
  Flame, Globe, Leaf, BookOpen, Rocket, Heart,
  Play, Pause, Volume2, User, Mail
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Niche" },
  { id: 2, label: "Voice" },
  { id: 3, label: "Music" },
  { id: 4, label: "Style" },
  { id: 5, label: "Captions" },
  { id: 6, label: "Schedule" },
];

const Youtube = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
);
const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
);

const CAPTION_STYLES = [
  { id: "modern-yellow", name: "Modern Yellow", style: "text-[#FCFF00] font-black uppercase [text-shadow:4px_4px_0_#000] text-3xl", animation: "animate-pulse" },
  { id: "minimalist", name: "Minimalist", style: "text-white font-medium drop-shadow-lg text-2xl", animation: "animate-in fade-in duration-1000 infinite" },
  { id: "netflix", name: "Netflix style", style: "text-white bg-black/80 px-4 py-1 rounded-sm font-sans text-xl", animation: "animate-in slide-in-from-bottom-2 duration-700 infinite" },
  { id: "cyber-neon", name: "Cyber Neon", style: "text-[#00FF00] font-bold [text-shadow:0_0_10px_#00FF00,0_0_20px_#00FF00] text-3xl italic", animation: "animate-pulse" },
  { id: "highlight", name: "Highlight", style: "text-white bg-purple-600 px-2 rounded font-black text-2xl", animation: "animate-bounce" },
  { id: "pop-up", name: "Pop Up", style: "text-white font-black text-4xl", animation: "animate-in zoom-in duration-500 infinite" },
];

const VIDEO_STYLES = [
  { id: "realistic", name: "Realistic", image: "/video-style/realistic.png" },
  { id: "cinematic", name: "Cinematic", image: "/video-style/cinematic.png" },
  { id: "anime", name: "Anime", image: "/video-style/anime.png" },
  { id: "gta", name: "GTA Style", image: "/video-style/gta.png" },
  { id: "cyberpunk", name: "Cyberpunk", image: "/video-style/cyberpunk.png" },
  { id: "3d-render", name: "3D Render", image: "/video-style/3d-render.png" },
];

const BG_MUSIC_OPTIONS = [
  { id: "1", name: "Trending Instagram Reels", url: "https://ik.imagekit.io/Tubeguruji/BgMusic/trending-instagram-reels-music-447249.mp3" },
  { id: "2", name: "Basketball Instagram Reels", url: "https://ik.imagekit.io/Tubeguruji/BgMusic/basketball-instagram-reels-music-461852.mp3" },
  { id: "3", name: "Instagram Reels Marketing", url: "https://ik.imagekit.io/Tubeguruji/BgMusic/instagram-reels-marketing-music-384448.mp3" },
  { id: "4", name: "Instagram Reels Marketing (V2)", url: "https://ik.imagekit.io/Tubeguruji/BgMusic/instagram-reels-marketing-music-469052.mp3" },
  { id: "5", name: "Dramatic Hip Hop / Jazz", url: "https://ik.imagekit.io/Tubeguruji/BgMusic/dramatic-hip-hop-music-background-jazz-music-for-short-video-148505.mp3" },
];

const getFlag = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
const LANGUAGESWithOutFlags = [
  { language: "English", countryCode: "US", countryFlag: "🇺🇸", modelName: "deepgram", modelLangCode: "en-US" },
  { language: "Spanish", countryCode: "MX", countryFlag: "🇲🇽", modelName: "deepgram", modelLangCode: "es-MX" },
  { language: "German", countryCode: "DE", countryFlag: "🇩🇪", modelName: "deepgram", modelLangCode: "de-DE" },
  { language: "Hindi", countryCode: "IN", countryFlag: "🇮🇳", modelName: "fonadalab", modelLangCode: "hi-IN" },
  { language: "Marathi", countryCode: "IN", countryFlag: "🇮🇳", modelName: "fonadalab", modelLangCode: "mr-IN" },
  { language: "Telugu", countryCode: "IN", countryFlag: "🇮🇳", modelName: "fonadalab", modelLangCode: "te-IN" },
  { language: "Tamil", countryCode: "IN", countryFlag: "🇮🇳", modelName: "fonadalab", modelLangCode: "ta-IN" },
  { language: "French", countryCode: "FR", countryFlag: "🇫🇷", modelName: "deepgram", modelLangCode: "fr-FR" },
  { language: "Dutch", countryCode: "NL", countryFlag: "🇳🇱", modelName: "deepgram", modelLangCode: "nl-NL" },
  { language: "Italian", countryCode: "IT", countryFlag: "🇮🇹", modelName: "deepgram", modelLangCode: "it-IT" },
  { language: "Japanese", countryCode: "JP", countryFlag: "🇯🇵", modelName: "deepgram", modelLangCode: "ja-JP" },
];


const LANGUAGES = LANGUAGESWithOutFlags.map(lang => ({
  ...lang,
  countryFlag: getFlag(lang.countryCode)
}));
const DEEPGRAM_VOICES = [
  {
    "model": "deepgram",
    "modelName": "aura-2-odysseus-en",
    "preview": "/voice/deepgram-aura-2-odysseus-en.wav",
    "gender": "male"
  },
  {
    "model": "deepgram",
    "modelName": "aura-2-thalia-en",
    "preview": "/voice/deepgram-aura-2-thalia-en.wav",
    "gender": "female"
  },
  {
    "model": "deepgram",
    "modelName": "aura-2-amalthea-en",
    "preview": "/voice/deepgram-aura-2-amalthea-en.wav",
    "gender": "female"
  },
  {
    "model": "deepgram",
    "modelName": "aura-2-andromeda-en",
    "preview": "/voice/deepgram-aura-2-andromeda-en.wav",
    "gender": "female"
  },
  {
    "model": "deepgram",
    "modelName": "aura-2-apollo-en",
    "preview": "/voice/deepgram-aura-2-apollo-en.wav",
    "gender": "male"
  }
]

const FONADALAB_VOICES = [
  { model: "fonadalab", modelName: "vaanee", preview: "/voice/fonadalab-vaanee.mp3", gender: "female" },
  { model: "fonadalab", modelName: "chaitra", preview: "/voice/fonadalab-chaitra.mp3", gender: "female" },
  { model: "fonadalab", modelName: "meghra", preview: "/voice/fonadalab-meghra.mp3", gender: "male" },
  { model: "fonadalab", modelName: "Nirvani", preview: "/voice/fonadalab-Nirvani.mp3", gender: "female" },
];

const AVAILABLE_NICHES = [
  { id: "scary-stories", icon: Ghost, label: "Scary Stories", description: "Spine-chilling horror tales and paranormal encounters to keep viewers hooked.", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  { id: "motivation", icon: Zap, label: "Motivation", description: "High-energy quotes and stories to inspire your audience daily.", color: "text-amber-600", bgColor: "bg-amber-50" },
  { id: "fun-facts", icon: Brain, label: "Fun Facts", description: "Fascinating, bite-sized curiosities that educate and entertain.", color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "true-crime", icon: Flame, label: "True Crime", description: "Real-life mysteries and investigations that captivate true crime fans.", color: "text-red-600", bgColor: "bg-red-50" },
  { id: "travel", icon: Globe, label: "Travel & Places", description: "Stunning destinations and hidden gems from around the world.", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { id: "finance-tips", icon: Sparkles, label: "Finance Tips", description: "Practical money-saving and investing advice for everyday creators.", color: "text-green-600", bgColor: "bg-green-50" },
  { id: "health-wellness", icon: Leaf, label: "Health & Wellness", description: "Simple wellness tips for a healthier mind, body, and lifestyle.", color: "text-rose-600", bgColor: "bg-rose-50" },
  { id: "history", icon: BookOpen, label: "History Untold", description: "Surprising historical events and forgotten stories from the past.", color: "text-orange-600", bgColor: "bg-orange-50" },
  { id: "entrepreneurship", icon: Rocket, label: "Entrepreneurship", description: "Stories and lessons from founders building extraordinary businesses.", color: "text-sky-600", bgColor: "bg-sky-50" },
  { id: "love-stories", icon: Heart, label: "Love Stories", description: "Heartwarming and romantic tales that resonate with all ages.", color: "text-pink-600", bgColor: "bg-pink-50" },
];

// ─── Types ──────────────────────────────────────────────────────────────────
interface SeriesData {
  niche: string | null;
  customNiche: string;
  nicheType: "available" | "custom";
  language: string;
  voice: string;
  backgroundMusic: string[];
  videoStyle: string | null;
  captionStyle: string | null;
  seriesName: string;
  duration: string;
  platforms: string[];
  publishTime: string;
}

const INITIAL_DATA: SeriesData = {
  niche: null,
  customNiche: "",
  nicheType: "available",
  language: "English",
  voice: "",
  backgroundMusic: [],
  videoStyle: null,
  captionStyle: null,
  seriesName: "",
  duration: "30-50 sec video",
  platforms: [],
  publishTime: "18:00",
};

// ─── Shared Components ─────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${isCompleted ? "bg-purple-600 border-purple-600 text-white" :
                  isActive ? "bg-white border-purple-600 text-purple-600 shadow-[0_0_0_4px_rgba(147,51,234,0.12)]" :
                    "bg-white border-gray-200 text-gray-400"
                  }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-purple-600" : isCompleted ? "text-purple-500" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${currentStep > step.id ? "bg-purple-500" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormFooter({ onNext, onBack, canContinue, showBack = true }: { onNext: () => void; onBack?: () => void; canContinue: boolean; showBack?: boolean; }) {
  return (
    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
      {showBack ? (
        <button onClick={onBack} className="flex items-center gap-2 h-12 px-6 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all duration-200">
          Back
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="flex items-center gap-2 h-12 px-8 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Steps ──────────────────────────────────────────────────────────────────

function NicheStep({ data, updateData, onNext }: { data: SeriesData; updateData: (updates: Partial<SeriesData>) => void; onNext: () => void; }) {
  const canContinue = data.nicheType === "available" ? !!data.niche : data.customNiche.trim().length > 2;

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Niche</h1>
        <p className="text-gray-500 mt-1">Select a category for your video series.</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {(["available", "custom"] as const).map((t) => (
          <button
            key={t}
            onClick={() => updateData({ nicheType: t })}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${data.nicheType === t
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t === "available" ? "Available Niches" : "Custom Niche"}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {data.nicheType === "available" ? (
          <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-2">
              {AVAILABLE_NICHES.map((niche) => {
                const Icon = niche.icon;
                const isSelected = data.niche === niche.id;
                return (
                  <button
                    key={niche.id}
                    onClick={() => updateData({ niche: niche.id })}
                    className={`group flex flex-col gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 relative ${isSelected
                      ? "border-purple-600 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-purple-600/5"
                      : "border-gray-100 bg-white hover:border-purple-200"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${niche.bgColor}`}>
                        <Icon className={`w-6 h-6 ${niche.color}`} />
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transform scale-110 transition-transform">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-base mb-1 transition-colors ${isSelected ? "text-purple-600" : "text-gray-900 group-hover:text-purple-600"}`}>{niche.label}</p>
                      <p className="text-xs text-gray-500 leading-normal line-clamp-2">{niche.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Niche</label>
              <textarea
                value={data.customNiche}
                onChange={(e) => updateData({ customNiche: e.target.value })}
                placeholder="e.g. Ancient Egyptian mysteries, Space exploration facts, UFC fight breakdowns..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1.5">{data.customNiche.length}/200 characters</p>
            </div>
          </div>
        )}
      </div>

      <FormFooter
        onNext={onNext}
        canContinue={canContinue}
        showBack={false}
      />
    </div>
  );
}

function VoiceStep({ data, updateData, onNext, onBack }: { data: SeriesData; updateData: (updates: Partial<SeriesData>) => void; onNext: () => void; onBack: () => void; }) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedLang = LANGUAGES.find(l => l.language === data.language) || LANGUAGES[0];
  const availableVoices = selectedLang.modelName === "deepgram" ? DEEPGRAM_VOICES : FONADALAB_VOICES;

  const handlePlay = (previewUrl: string) => {
    if (playingVoice === previewUrl) {
      audioRef.current?.pause();
      setPlayingVoice(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = previewUrl;
        audioRef.current.play();
      } else {
        const audio = new Audio(previewUrl);
        audio.onended = () => setPlayingVoice(null);
        audio.play();
        audioRef.current = audio;
      }
      setPlayingVoice(previewUrl);
    }
  };

  useEffect(() => { return () => { audioRef.current?.pause(); }; }, []);
  const canContinue = !!data.voice;

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-start justify-between">
        <div className="w-full md:max-w-[240px]">
          <label className="text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" /> Select Language
          </label>
          <div className="relative">
            <select value={data.language} onChange={(e) => updateData({ language: e.target.value, voice: "" })} className="w-full h-12 pl-4 pr-10 py-2 border-2 border-gray-100 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:border-purple-500 appearance-none cursor-pointer transition-colors shadow-sm">
              {LANGUAGES.map((lang) => (
                <option key={lang.language} value={lang.language}>{lang.countryFlag} &nbsp; {lang.language}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90"><ChevronRight className="w-4 h-4 text-gray-400" /></div>
          </div>
        </div>
        <div className="flex-1 w-full md:max-w-md">
          <div className="bg-purple-50/50 border border-purple-100/50 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0"><span className="text-2xl">{selectedLang.countryFlag}</span></div>
            <div>
              <h3 className="text-purple-700 font-bold flex items-center gap-2 mb-0.5">{selectedLang.language} selected <Check className="w-4 h-4 text-purple-600" /></h3>
              <p className="text-xs text-purple-400 font-medium">Using {selectedLang.modelName} model for high-quality {selectedLang.language} generation.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Available Voices</h2>
        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full tracking-wider">{availableVoices.length} Voices Available</span>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableVoices.map((voice) => {
            const isSelected = data.voice === voice.modelName;
            const isPlaying = playingVoice === voice.preview;
            const displayName = voice.modelName.replace("aura-2-", "").replace("-en", "");
            return (
              <div key={voice.modelName} onClick={() => updateData({ voice: voice.modelName })} className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${isSelected ? "border-purple-500 bg-white shadow-sm ring-1 ring-purple-500/10" : "border-gray-100 bg-white hover:border-purple-200"}`}>
                <div className="min-w-0">
                  <p className={`font-bold text-base mb-1.5 transition-colors ${isSelected ? "text-purple-700" : "text-gray-900 group-hover:text-purple-600"}`}>{displayName.charAt(0).toUpperCase() + displayName.slice(1)}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${isSelected ? "bg-purple-50 text-purple-500" : "bg-gray-50 text-gray-500 group-hover:bg-purple-50/50"}`}>{voice.gender}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${isSelected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400"}`}>{voice.model}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handlePlay(voice.preview); }} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isPlaying ? "bg-purple-600 text-white shadow-lg scale-110" : "bg-gray-50 text-gray-400 hover:bg-purple-100 hover:text-purple-600"}`}>
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <FormFooter onNext={onNext} onBack={onBack} canContinue={canContinue} />
    </div>
  );
}

function MusicStep({ data, updateData, onNext, onBack }: { data: SeriesData; updateData: (updates: Partial<SeriesData>) => void; onNext: () => void; onBack: () => void; }) {
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (url: string) => {
    if (playingMusic === url) {
      audioRef.current?.pause();
      setPlayingMusic(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.play();
      } else {
        const audio = new Audio(url);
        audio.onended = () => setPlayingMusic(null);
        audio.play();
        audioRef.current = audio;
      }
      setPlayingMusic(url);
    }
  };

  const toggleMusic = (url: string) => {
    const isSelected = data.backgroundMusic.includes(url);
    if (isSelected) {
      updateData({ backgroundMusic: data.backgroundMusic.filter(m => m !== url) });
    } else {
      updateData({ backgroundMusic: [...data.backgroundMusic, url] });
    }
  };

  useEffect(() => { return () => { audioRef.current?.pause(); }; }, []);
  const canContinue = data.backgroundMusic.length > 0;

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Background Music</h1>
        <p className="text-gray-500 mt-1">Select one or more tracks for your videos.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BG_MUSIC_OPTIONS.map((music) => {
            const isSelected = data.backgroundMusic.includes(music.url);
            const isPlaying = playingMusic === music.url;
            return (
              <div
                key={music.id}
                onClick={() => toggleMusic(music.url)}
                className={`group flex flex-col justify-between p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer h-full ${isSelected ? "border-purple-500 bg-white shadow-sm ring-1 ring-purple-500/10" : "border-gray-100 bg-white hover:border-purple-200"}`}
              >
                <div className="flex flex-col gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-600"}`}>
                    {isSelected ? <Check className="w-5 h-5 stroke-[3px]" /> : <Volume2 className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm transition-colors line-clamp-2 leading-tight ${isSelected ? "text-purple-700" : "text-gray-900 group-hover:text-purple-600"}`}>{music.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{isSelected ? "Selected" : "Click to select"}</p>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePlay(music.url); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isPlaying ? "bg-purple-600 text-white shadow-lg scale-110" : "bg-gray-50 text-gray-400 hover:bg-purple-100 hover:text-purple-600"}`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <FormFooter onNext={onNext} onBack={onBack} canContinue={canContinue} />
    </div>
  );
}

function VideoStyleStep({ data, updateData, onNext, onBack }: { data: SeriesData; updateData: (updates: Partial<SeriesData>) => void; onNext: () => void; onBack: () => void; }) {
  const canContinue = !!data.videoStyle;

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Style</h1>
        <p className="text-gray-500 mt-1">Select a visual style for your AI-generated videos.</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="flex gap-5 min-w-max px-2">
          {VIDEO_STYLES.map((style) => {
            const isSelected = data.videoStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => updateData({ videoStyle: style.id })}
                className={`group relative flex flex-col w-[200px] rounded-2xl overflow-hidden border-4 transition-all duration-300 ${isSelected ? "border-purple-600 ring-4 ring-purple-600/10 scale-[0.98]" : "border-transparent hover:border-purple-200 hover:scale-[1.02]"}`}
              >
                <div className="aspect-[9/16] relative w-full overflow-hidden bg-gray-100">
                  <img src={style.image} alt={style.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-80"}`} />
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transform animate-in animate-out zoom-in duration-300">
                      <Check className="w-5 h-5 text-white stroke-[3px]" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 left-0 right-0 px-4 text-center">
                    <p className={`text-lg font-bold text-white tracking-wide transition-all ${isSelected ? "scale-110" : "group-hover:translate-y-[-2px]"}`}>{style.name}</p>
                    <div className={`mt-2 h-1 w-12 mx-auto rounded-full bg-purple-500 transition-all duration-300 ${isSelected ? "w-20 opacity-100" : "w-0 opacity-0"}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <FormFooter onNext={onNext} onBack={onBack} canContinue={canContinue} />
    </div>
  );
}

function CaptionStyleStep({ data, updateData, onNext, onBack }: { data: SeriesData; updateData: (updates: Partial<SeriesData>) => void; onNext: () => void; onBack: () => void; }) {
  const canContinue = !!data.captionStyle;

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Caption Style</h1>
        <p className="text-gray-500 mt-1">Choose how your captions will appear in the video.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAPTION_STYLES.map((style) => {
            const isSelected = data.captionStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => updateData({ captionStyle: style.id })}
                className={`group flex flex-col p-0 rounded-2xl border-4 transition-all duration-300 h-[180px] overflow-hidden ${isSelected ? "border-purple-600 ring-4 ring-purple-600/10" : "border-gray-100 hover:border-purple-200"}`}
              >
                <div className="flex-1 bg-gray-900 w-full flex items-center justify-center p-4 relative overflow-hidden">
                  {/* Grid background for preview */}
                  <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  <div className={`${style.style} ${style.animation} text-center select-none`}>
                    Captions
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transform animate-in zoom-in duration-300">
                      <Check className="w-4 h-4 text-white stroke-[3px]" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white w-full border-t border-gray-50 flex justify-between items-center px-4">
                  <span className={`text-sm font-bold transition-colors ${isSelected ? "text-purple-600" : "text-gray-700 group-hover:text-purple-600"}`}>{style.name}</span>
                  {isSelected && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <FormFooter onNext={onNext} onBack={onBack} canContinue={canContinue} />
    </div>
  );
}

const PLATFORM_OPTIONS = [
  { id: "Tiktok", name: "Tiktok", icon: (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )},
  { id: "Youtube", name: "Youtube", icon: Youtube },
  { id: "Instagram", name: "Instagram", icon: Instagram },
  { id: "Email", name: "Email", icon: Mail },
];

function ScheduleStep({ data, updateData, onComplete, onBack }: { data: SeriesData; updateData: (updates: Partial<SeriesData>) => void; onComplete: () => void; onBack: () => void; }) {
  const canContinue = data.seriesName.trim().length > 0 && data.platforms.length > 0 && !!data.publishTime;

  const togglePlatform = (platform: string) => {
    if (data.platforms.includes(platform)) {
      updateData({ platforms: data.platforms.filter(p => p !== platform) });
    } else {
      updateData({ platforms: [...data.platforms, platform] });
    }
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Finalize Series</h1>
        <p className="text-gray-500 mt-1">Set your series details and publishing schedule.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4 space-y-6">
        {/* Series Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Series Name</label>
          <input
            type="text"
            value={data.seriesName}
            onChange={(e) => updateData({ seriesName: e.target.value })}
            placeholder="e.g. Daily Motivation, Scary Stories Vol 1"
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Duration Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Video Duration</label>
          <div className="relative">
            <select
              value={data.duration}
              onChange={(e) => updateData({ duration: e.target.value })}
              className="w-full h-12 pl-4 pr-10 border-2 border-gray-100 rounded-xl bg-white text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="30-50 sec video">30-50 sec video</option>
              <option value="60-70 sec video">60-70 sec video</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Platforms Multi-select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Platforms</label>
          <div className="flex flex-wrap gap-3">
            {PLATFORM_OPTIONS.map((platform) => {
              const isSelected = data.platforms.includes(platform.name);
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.name)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${isSelected
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg scale-105"
                    : "bg-white border-gray-100 text-gray-500 hover:border-purple-200 hover:text-purple-600"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-400 group-hover:text-purple-500"}`} />
                  {platform.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Publish Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Time</label>
          <div className="flex flex-col gap-3">
            <input
              type="time"
              value={data.publishTime}
              onChange={(e) => updateData({ publishTime: e.target.value })}
              className="w-full h-12 px-4 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500 transition-colors"
            />
            <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
              <Sparkles className="w-3.5 h-3.5" /> Video will generate 3-6 hours before video publish
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
        <button onClick={onBack} className="flex items-center gap-2 h-12 px-6 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all duration-200">
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={!canContinue}
          className="flex items-center gap-2 h-12 px-10 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] group"
        >
          Schedule <Zap className="w-4 h-4 fill-white group-hover:animate-pulse" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CreateSeriesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SeriesData>(INITIAL_DATA);
  const [isCompleted, setIsCompleted] = useState(false);

  const updateData = (updates: Partial<SeriesData>) => setFormData(prev => ({ ...prev, ...updates }));
  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleComplete = () => {
    console.log("Series Scheduled:", formData);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 min-h-[500px] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
            <Check className="w-10 h-10 text-green-500 stroke-[3px]" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Series Scheduled Successfully!</h1>
          <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
            Your series &quot;<span className="font-bold text-purple-600">{formData.seriesName}</span>&quot; is now in the queue. 
            Videos will be generated automatically and published to your selected platforms.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="h-12 px-8 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex flex-col">
        <StepIndicator currentStep={currentStep} />
        <div className="flex-1 flex flex-col">
          {currentStep === 1 && <NicheStep data={formData} updateData={updateData} onNext={handleNext} />}
          {currentStep === 2 && <VoiceStep data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <MusicStep data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 4 && <VideoStyleStep data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 5 && <CaptionStyleStep data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 6 && <ScheduleStep data={formData} updateData={updateData} onComplete={handleComplete} onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
}
