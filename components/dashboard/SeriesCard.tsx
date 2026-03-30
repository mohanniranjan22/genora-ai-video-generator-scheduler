"use client";

import { useState } from "react";
import { 
  MoreVertical, Edit3, Pause, Play, Trash2, 
  ExternalLink, Zap, Clock, Calendar, Music, 
  Mic2, Timer, CheckCircle2, RotateCw
} from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLATFORM_OPTIONS, VIDEO_STYLE_MAP } from "@/lib/series-constants";
import { toast } from "sonner";

export default function SeriesCard({ series }: { series: any }) {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(series.status === "paused");
  const [isGenerating, setIsGenerating] = useState(series.latestStatus === "processing");
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);
  const thumbnail = VIDEO_STYLE_MAP[series.video_style || "realistic"] || VIDEO_STYLE_MAP.realistic;

  const handleTriggerGeneration = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Triggering video generation...");
    
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: series.id }),
      });

      if (response.ok) {
        toast.success("Generation started!", { id: toastId });
        router.push("/dashboard/videos");
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error || "Failed to trigger"}`, { id: toastId });
      }
    } catch (error) {
      console.error("Trigger error:", error);
      toast.error("Internal server error", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecuteWorkflow = async () => {
    setIsExecutingWorkflow(true);
    const toastId = toast.loading("Executing full workflow (Test)...");
    
    try {
      const response = await fetch("/api/execute-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: series.id }),
      });

      if (response.ok) {
        toast.success("Workflow started! Check generation status.", { id: toastId });
        router.push("/dashboard/videos");
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error || "Failed to execute"}`, { id: toastId });
      }
    } catch (error) {
      console.error("Execute error:", error);
      toast.error("Internal server error", { id: toastId });
    } finally {
      setIsExecutingWorkflow(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Map platform names to their custom icons
  const getPlatformIcon = (platformName: string) => {
    return PLATFORM_OPTIONS.find(p => p.name === platformName)?.icon;
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail Section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image 
          src={thumbnail}
          alt={series.series_name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Right Edit Button */}
        <Link 
          href={`/dashboard/create?edit=${series.id}`}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-purple-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 duration-300"
        >
          <Edit3 className="w-4 h-4" />
        </Link>

        {/* Status Badge */}
        <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border flex items-center gap-1.5 ${
          isPaused 
          ? "bg-amber-500/20 border-amber-500/30 text-amber-200" 
          : "bg-emerald-500/20 border-emerald-500/30 text-emerald-200"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPaused ? "bg-amber-400" : "bg-emerald-400"}`} />
          {isPaused ? "Paused" : "Active Automation"}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 block">
              {series.series_name}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">
              <Calendar className="w-3 h-3 text-purple-400" />
              {formatDate(series.created_at)}
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2 rounded-xl border-gray-100 shadow-xl">
              <div className="space-y-1">
                <Link href={`/dashboard/create?edit=${series.id}`} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-all">
                  <Edit3 className="w-4 h-4" /> Edit Series
                </Link>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-all">
                  {isPaused ? <><Play className="w-4 h-4" /> Resume Series</> : <><Pause className="w-4 h-4" /> Pause Series</>}
                </button>
                {isGenerating && (
                    <button 
                        onClick={async () => {
                            const toastId = toast.loading("Stopping generation...");
                            try {
                                const res = await fetch("/api/admin/reset-generation", { method: "POST" });
                                if (res.ok) {
                                    toast.success("Generation stopped!", { id: toastId });
                                    setIsGenerating(false);
                                    router.refresh();
                                }
                            } catch (e) {
                                toast.error("Failed to stop", { id: toastId });
                            }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-600 hover:bg-amber-50 transition-all"
                    >
                        <RotateCw className="w-4 h-4" /> Force Stop Gen
                    </button>
                )}
                <div className="h-px bg-gray-50 my-1" />
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all">
                  <Trash2 className="w-4 h-4" /> Delete Series
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Platform Icons Mini Section */}
        <div className="flex items-center gap-1.5 mb-4">
          {series.platforms?.map((platformName: string) => {
            const Icon = getPlatformIcon(platformName);
            return Icon ? (
              <div key={platformName} title={platformName} className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-default">
                <Icon className="w-3 h-3" />
              </div>
            ) : null;
          })}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 border-t border-b border-gray-50 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
              <Clock className="w-3 h-3" /> Publish Time
            </span>
            <span className="text-xs font-semibold text-gray-700">{series.publish_time || "18:00"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
              <Timer className="w-3 h-3" /> Duration
            </span>
            <span className="text-xs font-semibold text-gray-700 line-clamp-1">{series.duration || "30-50s"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
              <Mic2 className="w-3 h-3" /> Voice
            </span>
            <span className="text-xs font-semibold text-gray-700 capitalize line-clamp-1">{series.voice?.split('-').slice(2).join(' ') || "Thalia"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
            <RotateCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} /> Next Gen
            </span>
            <span className={`text-[11px] font-bold flex items-center gap-1 ${isGenerating ? "text-purple-600" : "text-amber-600"}`}>
              {isGenerating ? "Generating..." : "Pending"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto space-y-2.5">
          <button className="w-full h-10 px-4 flex items-center justify-between rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all group/btn border border-transparent hover:border-gray-200">
            <span className="text-xs font-bold flex items-center gap-1.5 text-gray-500">
              <ExternalLink className="w-3 h-3" /> Previous Videos
            </span>
            <span className="text-[10px] font-black bg-gray-200 px-1.5 py-0.5 rounded-md text-gray-500 uppercase tracking-tighter">{series.videoCount || 0} Videos</span>
          </button>
          
          <button 
            onClick={handleTriggerGeneration}
            disabled={isGenerating || isExecutingWorkflow}
            className={`w-full h-10 px-4 flex items-center justify-center gap-2 rounded-xl text-white font-bold text-xs transition-all shadow-md group/gen ${
              isGenerating ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-purple-100/50"
            }`}
          >
            <Zap className={`w-3.5 h-3.5 fill-white ${isGenerating ? "animate-spin" : "group-hover/gen:animate-pulse"}`} /> 
            {isGenerating ? "Generating..." : "Trigger Generation"}
          </button>

          <button 
            onClick={handleExecuteWorkflow}
            disabled={isGenerating || isExecutingWorkflow}
            className={`w-full h-10 px-4 flex items-center justify-center gap-2 rounded-xl text-white font-bold text-xs transition-all shadow-md group/workflow ${
              isExecutingWorkflow ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100/50"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isExecutingWorkflow ? "animate-spin" : "group-hover/workflow:rotate-180 transition-transform duration-500"}`} /> 
            {isExecutingWorkflow ? "Executing..." : "Execute Workflow"}
          </button>
        </div>
      </div>
    </div>
  );
}
