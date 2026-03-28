import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { 
  Wand2, CalendarClock, Mail, 
  ArrowRight, PlayCircle, Zap, Sparkles, BarChart3, Clock
} from "lucide-react";

// Add SVG components for brand icons that are missing in lucide-react
const Youtube = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const Twitter = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const Github = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.247a10 10 0 00-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175-.112-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.012-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.012 2.412-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0012 2.247z"/></svg>
);
const Linkedin = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Genora</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            {userId ? (
              <>
                <Link href="/dashboard" className="hidden md:flex h-9 px-4 items-center justify-center rounded-full bg-background border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard"><button className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</button></SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard"><button className="h-9 px-4 flex items-center justify-center rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">Get Started</button></SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center">
          {/* Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none dark:bg-purple-600/20" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm text-purple-600 dark:text-purple-400 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Genora AI 2.0 is now live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Create & Schedule AI Videos on Autopilot
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              The ultimate SaaS platform to generate AI short videos and schedule them across YouTube, Instagram, TikTok, and Email. Scale your content 10x faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {userId ? (
                <Link href="/dashboard" className="h-12 px-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:shadow-[0_0_60px_rgba(147,51,234,0.5)]">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard"><button className="h-12 px-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:shadow-[0_0_60px_rgba(147,51,234,0.5)]">Start Generating Free <ArrowRight className="w-4 h-4" /></button></SignUpButton>
              )}
              <Link href="#demo" className="h-12 px-8 flex items-center justify-center gap-2 rounded-full bg-muted/50 hover:bg-muted border border-border text-foreground font-medium transition-colors">
                <PlayCircle className="w-4 h-4" /> Watch Demo
              </Link>
            </div>
            
            {/* Dashboard Mockup */}
            <div className="mt-20 w-full max-w-5xl rounded-2xl border border-border bg-background/50 backdrop-blur-md p-2 overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="rounded-xl border border-border bg-muted/30 overflow-hidden flex aspect-[16/9] md:aspect-[21/9]">
                {/* Sidebar mock */}
                <div className="w-48 border-r border-border p-4 hidden md:flex flex-col gap-4 bg-muted/10">
                  <div className="w-full h-8 rounded bg-foreground/5 mb-4" />
                  <div className="w-3/4 h-4 rounded bg-foreground/10" />
                  <div className="w-full h-4 rounded bg-foreground/10" />
                  <div className="w-5/6 h-4 rounded bg-foreground/10" />
                </div>
                {/* Content mock */}
                <div className="flex-1 p-6 flex flex-col gap-6">
                  {/* Top Bar Mock */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground tracking-tight">Analytics Overview</h3>
                      <p className="text-xs text-muted-foreground mt-1">Last 7 days performance</p>
                    </div>
                    <div className="hidden sm:flex text-sm font-medium text-white px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
                      Generate New Video
                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="flex gap-4">
                    <div className="flex-1 h-32 rounded-xl border border-border bg-gradient-to-br from-red-500/5 to-transparent p-4 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <Youtube className="text-[#FF0000] w-6 h-6" />
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+124%</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">1.2M</div>
                        <div className="text-xs text-muted-foreground mt-1">Total YouTube Views</div>
                      </div>
                    </div>
                    <div className="flex-1 h-32 rounded-xl border border-border bg-gradient-to-br from-pink-500/5 to-transparent p-4 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <Instagram className="text-[#E1306C] w-6 h-6" />
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+82%</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">450K</div>
                        <div className="text-xs text-muted-foreground mt-1">Instagram Reach</div>
                      </div>
                    </div>
                    <div className="flex-1 h-32 rounded-xl border border-border bg-gradient-to-br from-zinc-500/5 to-transparent p-4 flex flex-col justify-between relative overflow-hidden group hidden sm:flex">
                      <div className="flex justify-between items-start">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="text-zinc-300 w-6 h-6"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a5.63 5.63 0 0 1-1.04-.1z" /></svg>
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+200%</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">8.9M</div>
                        <div className="text-xs text-muted-foreground mt-1">TikTok Impressions</div>
                      </div>
                    </div>
                  </div>

                  {/* Feed Mock */}
                  <div className="flex-1 rounded-xl border border-border bg-background flex flex-col overflow-hidden shadow-inner relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500" />
                    <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                      <span className="font-medium text-sm text-foreground">Upcoming AI Schedule</span>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">Autopilot Active</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <Youtube className="w-5 h-5 text-[#FF0000]" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">Top 10 AI Tools 2026</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-400" /> Script & Voice Generated
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-emerald-400 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" /> Scheduled
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Today, 2:00 PM</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                            <Instagram className="w-5 h-5 text-[#E1306C]" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">SaaS Marketing Hooks</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-blue-400" /> Rendering video...
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-400 animate-pulse flex items-center gap-1 justify-end">
                            <PlayCircle className="w-3 h-3" /> Processing
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Tomorrow, 9:00 AM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Integration */}
        <section className="py-10 border-y border-border bg-muted/20">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Publish effortlessly across all platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2"><Youtube className="w-8 h-8 text-[#FF0000]" /><span className="text-xl font-semibold">YouTube</span></div>
              <div className="flex items-center gap-2"><Instagram className="w-7 h-7 text-[#E1306C]" /><span className="text-xl font-semibold">Instagram</span></div>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a5.63 5.63 0 0 1-1.04-.1z" /></svg>
                <span className="text-xl font-semibold">TikTok</span>
              </div>
              <div className="flex items-center gap-2"><Mail className="w-8 h-8 text-blue-500" /><span className="text-xl font-semibold">Email Hooks</span></div>
            </div>
          </div>
        </section>

        {/* Features list */}
        <section id="features" className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need to dominate short-form</h2>
              <p className="text-muted-foreground text-lg">Genora automates the entire lifecycle of a short video. From script generation using AI to scheduling it on your favorite social platforms.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-border bg-gradient-to-b from-muted/30 to-transparent hover:bg-muted/50 transition-colors relative group">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Video Generation</h3>
                <p className="text-muted-foreground leading-relaxed">Instantly convert prompts, articles, or ideas into highly engaging short videos with AI voiceovers, captions, and dynamic visuals.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-border bg-gradient-to-b from-muted/30 to-transparent hover:bg-muted/50 transition-colors relative group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CalendarClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Auto-Scheduling</h3>
                <p className="text-muted-foreground leading-relaxed">Connect your accounts once and schedule months of content in advance. Our smart calendar optimizes posting times for maximum reach.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-border bg-gradient-to-b from-muted/30 to-transparent hover:bg-muted/50 transition-colors relative group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Viral Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Track views, engagement, and conversion rates across all platforms in one unified dashboard to see what content performs best.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-background z-0" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to 10x your content output?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of creators and marketers using Genora to automate their short-form video strategies.</p>
            {userId ? (
              <Link href="/dashboard" className="inline-flex h-14 px-10 items-center justify-center gap-2 rounded-full bg-foreground text-background font-semibold text-lg hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(255,255,255,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard"><button className="inline-flex h-14 px-10 items-center justify-center gap-2 rounded-full bg-foreground text-background font-semibold text-lg hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(255,255,255,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]">Get Started for Free <ArrowRight className="w-5 h-5" /></button></SignUpButton>
            )}
            <p className="mt-4 text-sm text-muted-foreground">No credit card required • 14-day free trial</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/10 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">Genora</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-xs">
                The leading AI video generation and scheduling platform for modern creators and marketing teams.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-3 flex flex-col text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-3 flex flex-col text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Creator Guides</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3 flex flex-col text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Genora Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for Creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
