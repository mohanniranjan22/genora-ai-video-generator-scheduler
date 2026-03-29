"use client";

import { useState } from "react";
import { 
  ImageIcon, 
  Sparkles, 
  ChevronRight, 
  Download, 
  ExternalLink,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface StoryboardProps {
  imageAssets: any[];
  seriesId: string;
}

export default function Storyboard({ imageAssets, seriesId }: StoryboardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const toastId = toast.loading("Regenerating all video assets...");
    
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId }),
      });

      if (response.ok) {
        toast.success("Regeneration started! Redirecting to studio...", { id: toastId });
        window.location.href = "/dashboard/videos";
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error || "Failed to regenerate"}`, { id: toastId });
      }
    } catch (error) {
      console.error("Regenerate error:", error);
      toast.error("Internal server error", { id: toastId });
    } finally {
      setIsRegenerating(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `storyboard-asset-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error("Download failed"));
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 ml-1">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase leading-none">Generated Storyboard</h2>
                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-black text-gray-400">{imageAssets?.length || 0} Assets</span>
            </div>
            <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-50"
            >
                {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Regenerate All"} <Sparkles className="w-3 h-3" />
            </button>
        </div>

        <div className="space-y-4">
            {imageAssets?.map((asset: any, index: number) => (
                <div key={asset.id} className="group bg-white rounded-3xl border border-gray-100 p-4 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-purple-50 transition-all duration-500">
                    <div className="relative w-full md:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 shadow-md">
                        <Image 
                            src={asset.asset_url}
                            alt={`Asset ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-black text-white flex items-center justify-center border border-white/10">
                            {index + 1}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Prompt</p>
                            <div className="h-px flex-1 bg-gray-50" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed italic pr-4">
                            "{asset.prompt_used}"
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <button 
                            onClick={() => downloadImage(asset.asset_url, index)}
                            className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center"
                            title="Download Image"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <a 
                            href={asset.asset_url}
                            target="_blank"
                            className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center"
                            title="View Full Resolution"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
