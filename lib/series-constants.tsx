import { Mail } from "lucide-react";

// --- Custom SVG Icons ---
export const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.13-1.46-.12 3.43-.03 6.85.02 10.28-.03 2.02-.56 4.12-1.92 5.67-1.49 1.75-3.86 2.45-6.04 2.13-2.15-.31-4.13-1.72-5.14-3.67-1.11-2.13-.96-4.85.45-6.8 1.17-1.63 3.12-2.5 5.12-2.42v4.22c-.68-.06-1.41.06-2.01.42-.72.44-1.11 1.25-1.07 2.08.03.88.59 1.69 1.38 2.02.7.3 1.52.3 2.22-.01.76-.32 1.25-1.11 1.27-1.93.07-3.41.03-6.82.04-10.23.01-2.12.01-4.23.01-6.35z" />
  </svg>
);

export const PLATFORM_OPTIONS = [
  { id: "Tiktok", name: "Tiktok", icon: TiktokIcon },
  { id: "Youtube", name: "Youtube", icon: YoutubeIcon },
  { id: "Instagram", name: "Instagram", icon: InstagramIcon },
  { id: "Email", name: "Email", icon: Mail },
];

export const VIDEO_STYLE_MAP: Record<string, string> = {
  realistic: "/video-style/realistic.png",
  cinematic: "/video-style/cinematic.png",
  anime: "/video-style/anime.png",
  gta: "/video-style/gta.png",
  cyberpunk: "/video-style/cyberpunk.png",
  "3d-render": "/video-style/3d-render.png",
};
