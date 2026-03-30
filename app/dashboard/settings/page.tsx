"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Shield, 
  Share2, 
  Trash2, 
  ChevronRight, 
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TiktokIcon } from "@/lib/series-constants";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SocialAccount {
  platform: string;
  account_name: string;
  created_at: string;
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [connections, setConnections] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
    
    // Check for success/error from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "youtube") {
      toast.success("YouTube account connected successfully!");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get("error")) {
      toast.error(`Failed to connect: ${urlParams.get("error")}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/settings/social");
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      }
    } catch (error) {
      console.error("Failed to fetch connections", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    if (platform === "youtube") {
      window.location.href = "/api/settings/social/youtube";
      return;
    }
    
    setIsActionLoading(platform);
    try {
      const res = await fetch("/api/settings/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Successfully connected ${platform} account!`);
        fetchConnections();
      } else {
        toast.error(`Failed to connect ${platform}`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) return;
    
    setIsActionLoading(platform);
    try {
      const res = await fetch("/api/settings/social", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (res.ok) {
        toast.success(`Disconnected ${platform}`);
        fetchConnections();
      } else {
        toast.error(`Failed to disconnect ${platform}`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt("To confirm deletion, please type 'DELETE MY ACCOUNT' below:");
    if (confirmation !== "DELETE MY ACCOUNT") {
      if (confirmation !== null) toast.error("Confirmation text mismatch");
      return;
    }

    setIsActionLoading("delete-account");
    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Account deleted. Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsActionLoading(null);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const isConnected = (platform: string) => connections.find(c => c.platform.toLowerCase() === platform.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 font-medium italic">Manage your profile, connections, and account preferences.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-8 flex items-center gap-6">
          <div className="relative group">
            <img 
              src={user?.imageUrl} 
              alt="Avatar" 
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-50 group-hover:ring-purple-100 transition-all shadow-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">{user?.fullName}</h3>
            <p className="text-gray-500 font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
            <div className="pt-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100 flex items-center w-fit gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Account
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Connections */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Share2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Social Media Connections</h2>
        </div>
        <div className="p-8 grid md:grid-cols-3 gap-6">
          {[
            { id: 'youtube', name: 'YouTube', icon: YoutubeIcon, color: 'text-red-600', bg: 'bg-red-50' },
            { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
            { id: 'tiktok', name: 'TikTok', icon: TiktokIcon, color: 'text-gray-900', bg: 'bg-gray-100' }
          ].map((platform) => {
            const connection = isConnected(platform.id);
            const Icon = platform.icon;
            
            return (
              <div key={platform.id} className="group relative flex flex-col items-center p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${platform.bg} ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{platform.name}</h3>
                <p className="text-xs text-gray-400 font-medium mb-4">
                  {connection ? `Connected as ${connection.account_name}` : 'Not connected'}
                </p>
                
                {connection ? (
                  <button 
                    onClick={() => handleDisconnect(platform.id)}
                    disabled={isActionLoading === platform.id}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    {isActionLoading === platform.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect(platform.id)}
                    disabled={isActionLoading === platform.id}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-md active:scale-95"
                  >
                    {isActionLoading === platform.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                    Connect Account
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-8 pb-8">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 italic">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    Connecting your social accounts allows Genora to automatically publish videos as posts, reels, or shorts. 
                    Tokens are encrypted and managed securely.
                </p>
            </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50/30 rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-100 flex items-center gap-3 bg-red-50/50">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Once you delete your account, there is no going back. All your projects, generated videos, 
              and data will be permanently erased. Please be certain.
            </p>
          </div>
          <button 
            onClick={handleDeleteAccount}
            disabled={isActionLoading === "delete-account"}
            className="shrink-0 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center gap-2 active:scale-95 disabled:bg-red-400"
          >
            {isActionLoading === "delete-account" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Permanently Delete Account
          </button>
        </div>
      </section>

      <div className="text-center pb-8">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">Genora AI v1.0.0 — Crafted with Passion</p>
      </div>
    </div>
  );
}
