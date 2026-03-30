"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Volume2, Maximize2, SkipForward, SkipBack } from "lucide-react";
import Image from "next/image";

interface VideoPlayerProps {
  images: { asset_url: string; asset_index: number }[];
  audioUrl: string;
  videoTitle: string;
  seriesName: string;
  episodeNumber: number;
  captions?: any[];
  captionStyle?: string;
}

export default function VideoPlayer({ 
  images, 
  audioUrl, 
  videoTitle, 
  seriesName, 
  episodeNumber,
  captions = [],
  captionStyle = "modern-yellow"
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Group Words into 2-word "bursts" to match the rendering engine
  const bursts = useMemo(() => {
    if (!captions || captions.length === 0) return [];
    const grouped = [];
    const wordsPerBurst = 2;
    for (let i = 0; i < captions.length; i += wordsPerBurst) {
      const chunk = captions.slice(i, i + wordsPerBurst);
      grouped.push({
        text: chunk.map((w: any) => w.word).join(" "),
        start: chunk[0].start,
        end: chunk[chunk.length - 1].end
      });
    }
    return grouped;
  }, [captions]);

  // Dynamic Styling based on the selected ID exactly matching the engine
  const getStyle = (styleId: string): React.CSSProperties => {
    switch (styleId) {
      case "minimalist":
        return {
          color: "white",
          fontWeight: 500,
          fontSize: "1.25rem",
          textShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          textTransform: "none",
        };
      case "netflix":
        return {
          color: "white",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "4px 12px",
          borderRadius: "4px",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.125rem",
          textTransform: "none",
        };
      case "cyber-neon":
        return {
          color: "#00FF00",
          fontWeight: "bold",
          fontSize: "1.5rem",
          fontStyle: "italic",
          textShadow: "0 0 5px #00FF00, 0 0 10px #00FF00",
          textTransform: "uppercase",
        };
      case "highlight":
        return {
          color: "white",
          backgroundColor: "#9333ea", // purple-600
          padding: "4px 12px",
          borderRadius: "6px",
          fontWeight: 900,
          fontSize: "1.5rem",
          textTransform: "uppercase",
        };
      case "pop-up":
        return {
          color: "white",
          fontWeight: 900,
          fontSize: "1.75rem",
          textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
          textTransform: "uppercase",
        };
      case "modern-yellow":
      default:
        return {
          color: "black",
          backgroundColor: "#FFCC00",
          padding: "4px 16px",
          borderRadius: "4px",
          fontWeight: 900,
          fontSize: "1.5rem",
          textTransform: "uppercase",
          letterSpacing: "-0.5px",
        };
    }
  };

  const dynamicStyle = getStyle(captionStyle);

  useEffect(() => {
    if (!duration || images.length === 0) return;
    
    // Distribute images evenly across the audio duration
    const timePerImage = duration / images.length;
    const newIndex = Math.min(
      Math.floor(currentTime / timePerImage),
      images.length - 1
    );
    
    if (newIndex !== activeImageIndex) {
      setActiveImageIndex(newIndex);
    }
  }, [currentTime, duration, images.length, activeImageIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-[9/16] w-full rounded-3xl bg-gray-950 overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-100 group">
        {/* Active Image Slideshow */}
        {images.map((img, idx) => (
          <div 
            key={img.asset_url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image 
              src={img.asset_url}
              alt={`Slide ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
        
        {/* Visual Overlay Badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-20 pointer-events-none" />
        
        {/* Player Controls Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-between items-start">
             <div className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                AI Preview Mode
             </div>
             <button className="text-white/70 hover:text-white transition-colors">
                <Maximize2 className="w-5 h-5" />
             </button>
          </div>

          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Playing Now</p>
                        <p className="text-white text-sm font-bold truncate">{seriesName} - EP #{episodeNumber}</p>
                    </div>
                    <div className="text-[10px] font-mono text-white/50">
                        {Math.floor(currentTime)}s / {Math.floor(duration)}s
                    </div>
                </div>

                {/* Progress Bar */}
                <input 
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                />
            </div>
          </div>
        </div>

        {/* Live Caption Display Rendered Synced to CurrentTime */}
        {captions && captions.length > 0 && isPlaying && (
            <div className="absolute left-0 right-0 bottom-[25%] flex justify-center z-40 pointer-events-none px-4 text-center">
                {bursts.map((burst, i) => {
                    if (currentTime >= burst.start && currentTime <= burst.end) {
                        return (
                            <span 
                              key={i} 
                              style={{...dynamicStyle, lineHeight: '1.2'}} 
                              className="inline-block animate-in zoom-in-95 duration-200"
                            >
                                {burst.text}
                            </span>
                        );
                    }
                    return null;
                })}
            </div>
        )}
        
        {/* Big Play Button for Idle State */}
        {!isPlaying && currentTime === 0 && (
            <div className="absolute inset-0 z-25 flex items-center justify-center">
                <button 
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl group/play"
                >
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-inner">
                        <Play className="w-6 h-6 fill-current ml-1 group-hover/play:scale-110 transition-transform" />
                    </div>
                </button>
            </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Mobile-style Player Controls (Secondary) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-purple-50/50 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex-1 flex items-center gap-3">
              <button className="text-gray-300 hover:text-gray-600 transition-colors">
                  <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button 
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-purple-600 transition-colors shadow-lg"
              >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button className="text-gray-300 hover:text-gray-600 transition-colors">
                  <SkipForward className="w-4 h-4 fill-current" />
              </button>
          </div>
          <div className="flex items-center gap-2">
              <div className="h-1 w-24 bg-gray-100 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-600 w-2/3" />
              </div>
          </div>
      </div>
    </div>
  );
}
