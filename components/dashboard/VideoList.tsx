"use client";

import { useEffect, useState, useCallback } from "react";
import VideoCard from "@/components/dashboard/VideoCard";
import { createClient } from "@/utils/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";

interface VideoListProps {
  initialVideos: any[];
  userId: string;
}

export default function VideoList({ initialVideos, userId }: VideoListProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [isPolling, setIsPolling] = useState(false);
  const supabase = createClient();

  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from('video_records')
      .select(`
        *,
        video_series!inner (
          series_name,
          user_id
        ),
        video_assets (
          asset_url,
          asset_type,
          asset_index
        )
      `)
      .eq('video_series.user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
      
      // Stop polling if no videos are in 'processing' state
      const hasProcessing = data.some((v: any) => v.status === 'processing');
      if (!hasProcessing) {
        setIsPolling(false);
      }
    }
  }, [userId, supabase]);

  useEffect(() => {
    // Check if we need to start polling
    const hasProcessing = videos?.some((v: any) => v.status === 'processing');
    
    if (hasProcessing) {
      setIsPolling(true);
      const interval = setInterval(() => {
        fetchVideos();
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [videos, fetchVideos]);

  return (
    <div className="space-y-12">
        {/* Real-time Status Indicator */}
        {isPolling && (
            <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-100 rounded-2xl text-purple-600 animate-in fade-in slide-in-from-top-4 duration-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest">Live Syncing... Your AI video is being generated</span>
                <div className="ml-auto flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                    </div>
                </div>
            </div>
        )}

        <div>
             <div className="flex items-center gap-2 mb-6 ml-1">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Archives</h2>
                <div className="h-px bg-gray-100 flex-1" />
                <button 
                  onClick={() => {
                    setIsPolling(true);
                    fetchVideos();
                  }}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
                </button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {videos?.map((video: any) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    </div>
  );
}
