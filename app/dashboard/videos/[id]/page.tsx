import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";
import VideoPlayer from "@/components/dashboard/VideoPlayer";
import Storyboard from "@/components/dashboard/Storyboard";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Share2,
  MoreVertical
} from "lucide-react";
import Link from "next/link";

export default async function VideoDetailsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const awaitedParams = await params;
  const id = awaitedParams.id;

  if (!userId) {
    redirect("/");
  }

  const supabase = createAdminClient();

  // Fetch the specific video record with series and assets
  const { data: video, error } = await supabase
    .from('video_records')
    .select(`
      *,
      video_series (
        id,
        series_name,
        user_id,
        video_style,
        voice,
        caption_style
      ),
      video_assets (
        *
      )
    `)
    .eq('id', id)
    .single();

  if (error || !video || video.video_series.user_id !== userId) {
    notFound();
  }

  const voiceoverAsset = video.video_assets?.find((a: any) => a.asset_type === "voiceover");
  const imageAssets = video.video_assets?.filter((a: any) => a.asset_type === "image")
    .sort((a: any, b: any) => a.asset_index - b.asset_index);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <Link 
            href="/dashboard/videos"
            className="group flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors font-bold text-xs uppercase tracking-widest"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Studio
        </Link>
        <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-gray-100 bg-white text-gray-500 hover:text-purple-600 hover:shadow-md transition-all shadow-sm">
                <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-100 bg-white text-gray-500 hover:text-purple-600 hover:shadow-md transition-all shadow-sm">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Smart Slideshow Player (40%) */}
        <div className="lg:col-span-5">
            <VideoPlayer 
                images={imageAssets || []}
                audioUrl={voiceoverAsset?.asset_url || ""}
                videoTitle={video.video_title}
                seriesName={video.video_series.series_name}
                episodeNumber={video.episode_number}
                captions={video.captions || []}
                captionStyle={video.video_series.caption_style || "modern-yellow"}
            />
        </div>

        {/* Right Column: Metadata & Assets (60%) */}
        <div className="lg:col-span-7 space-y-10">
            {/* Metadata Section */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-purple-200">
                        {video.status}
                    </span>
                    <span className="text-gray-300">/</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{video.video_series.video_style} Style</span>
                </div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-[0.95] mb-4">
                    {video.video_title}
                </h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        {formatDate(video.created_at)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                        <Clock className="w-4 h-4 text-purple-400" />
                        {new Date(video.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            {/* Script Breakdown */}
            <div className="p-8 rounded-[40px] bg-gray-50 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText className="w-24 h-24 text-purple-600" />
                </div>
                
                <div className="flex items-center gap-2 mb-6 ml-1">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase leading-none">Video Script</h2>
                </div>
                <div className="relative z-10">
                    <p className="text-gray-700 font-medium leading-[1.8] text-lg bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-inner whitespace-pre-wrap">
                        {video.video_script}
                    </p>
                </div>
            </div>

            {/* Interactive Storyboard Grid */}
            <Storyboard 
                imageAssets={imageAssets || []}
                seriesId={video.video_series.id}
            />
        </div>
      </div>
    </div>
  );
}

