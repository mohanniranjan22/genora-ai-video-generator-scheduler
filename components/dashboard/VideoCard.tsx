"use client";

import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Loader2, 
  Play, 
  CheckCircle2,
  AlertCircle,
  FileVideo
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  video: {
    id: string;
    video_title: string;
    video_script: string;
    status: string;
    created_at: string;
    episode_number: number;
    final_video_url?: string;
    video_series?: {
      series_name: string;
    };
    video_assets?: {
      asset_url: string;
      asset_type: string;
    }[];
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const isGenerating = video.status === "processing";
  const isFailed = video.status === "failed";
  const isCompleted = video.status === "completed";
  
  // Find the first image asset as a thumbnail
  const thumbnail = video.video_assets?.find(a => a.asset_type === "image")?.asset_url;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail Section */}
      <div className="relative aspect-[9/16] w-full bg-gray-900 overflow-hidden group-hover:bg-gray-800 transition-colors">
        {thumbnail ? (
          <Image 
            src={thumbnail}
            alt={video.video_title || "Video thumbnail"}
            fill
            className={`object-cover transition-all duration-700 ${isGenerating ? 'opacity-40 scale-105 blur-sm' : 'group-hover:scale-110'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
              <FileVideo className="w-8 h-8 text-purple-600/40" />
            </div>
          </div>
        )}

        {/* Overlay for Generating State */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative">
                <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
                <div className="absolute inset-0 blur-lg bg-white/20 animate-pulse" />
            </div>
            <p className="text-white font-black text-sm uppercase tracking-widest drop-shadow-md">
              AI Generation in Progress
            </p>
            <p className="text-white/60 text-[10px] mt-2 font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 italic">
              Generating script & images...
            </p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                EP #{video.episode_number}
            </div>
            
            {isCompleted && (
                 <div className="px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                </div>
            )}

            {isFailed && (
                 <div className="px-2.5 py-1 rounded-lg bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <AlertCircle className="w-3 h-3" /> Failed
                </div>
            )}
        </div>

        {/* Bottom Play Button (Overlay) */}
        {isCompleted && video.final_video_url && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Link 
                    href={video.final_video_url} 
                    target="_blank"
                    className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:bg-purple-700"
                >
                    <Play className="w-6 h-6 fill-current ml-1" />
                </Link>
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 text-sm leading-tight mb-1">
            {video.video_title || "Untitled Episode"}
          </h3>
          <p className="text-[10px] text-purple-600 font-black uppercase tracking-tighter opacity-70">
            {video.video_series?.series_name || "Generated Video"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-gray-300" />
                {formatDate(video.created_at)}
            </div>
            {isCompleted && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    Complete
                </div>
            )}
        </div>

        {isCompleted && (
             <Link 
                href={`/dashboard/videos/${video.id}`}
                className="mt-2 w-full h-9 px-4 flex items-center justify-center gap-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-purple-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:border-purple-500 shadow-sm"
             >
                <ExternalLink className="w-3 h-3" /> View Video Details
             </Link>
        )}
      </div>
    </div>
  );
}
