import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";
import VideoCard from "@/components/dashboard/VideoCard";
import VideoList from "@/components/dashboard/VideoList";
import { 
  PlaySquare, 
  Video, 
  Search, 
  Filter, 
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default async function VideosPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const supabase = createAdminClient();

  // Fetch all video records for the user's series
  // We join with video_series to filter by userId and get the name
  // We join with video_assets to get the first image for the thumbnail
  const { data: videos, error } = await supabase
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

  if (error) {
    console.error("Fetch videos error:", error);
  }

  const hasVideos = videos && videos.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                <Video className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest leading-none">Video Studio</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Generated Videos
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Track every episode of your AI-driven automated series.</p>
        </div>

        {hasVideos && (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 text-sm font-semibold">
                    <Search className="w-4 h-4" />
                    <input type="text" placeholder="Search videos..." className="bg-transparent border-none outline-none w-40 placeholder:text-gray-300" />
                </div>
                <button className="h-10 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wider shadow-sm">
                    <Filter className="w-3.5 h-3.5" /> Filter
                </button>
            </div>
        )}
      </div>

      {!hasVideos ? (
        <div className="flex flex-col items-center justify-center p-12 py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xl shadow-purple-50">
            <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                <PlaySquare className="w-10 h-10 text-purple-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight text-center">No Videos Yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm text-center leading-relaxed font-medium">
                You haven't generated any videos. Head back to your series dashboard and trigger your first automation!
            </p>
            <Link 
                href="/dashboard"
                className="group h-12 px-8 flex items-center justify-center rounded-2xl bg-gray-900 text-white font-black text-sm hover:bg-purple-600 transition-all shadow-xl shadow-gray-200 hover:shadow-purple-200 flex items-center gap-2"
            >
                Go to Series <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      ) : (
        <div className="space-y-12">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Generated</p>
                        <p className="text-2xl font-black text-gray-900">{videos?.length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</p>
                        <p className="text-2xl font-black text-gray-900">{videos?.filter(v => v.status === 'completed').length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating</p>
                        <p className="text-2xl font-black text-gray-900">{videos?.filter(v => v.status === 'processing').length || 0}</p>
                    </div>
                </div>
            </div>

            {/* Client-side Live Video List */}
            <VideoList initialVideos={videos || []} userId={userId} />
        </div>
      )}
    </div>
  );
}
