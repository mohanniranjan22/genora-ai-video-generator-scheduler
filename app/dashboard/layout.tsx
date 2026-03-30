"use client"; // Wait, layout cannot be client if it uses server features, but this one doesn't seem to.
// Actually, I'll keep it as is but replace the import.
import Link from "next/link";
import { 
  PlaySquare, 
  Video, 
  BookOpen, 
  CreditCard, 
  Settings,
  Plus,
  Zap,
  Crown
} from "lucide-react";
import HeaderActions from "@/components/dashboard/HeaderActions";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@clerk/nextjs/experimental";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-purple-600">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <PlaySquare className="w-5 h-5" fill="currentColor" />
            </div>
            Genora
          </Link>
        </div>

        {/* Create Button */}
        <div className="p-5">
          <Link href="/dashboard/create" className="w-full h-12 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl font-semibold transition-colors shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]">
            <Plus className="w-5 h-5" /> Create New Series
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto mt-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-base">
            <PlaySquare className="w-6 h-6 text-gray-500" /> Series
          </Link>
          <Link href="/dashboard/videos" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-base">
            <Video className="w-6 h-6 text-gray-500" /> Videos
          </Link>
          <Link href="/dashboard/guides" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-base">
            <BookOpen className="w-6 h-6 text-gray-500" /> Guides
          </Link>
          <Link href="/dashboard/billing" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-base">
            <CreditCard className="w-6 h-6 text-gray-500" /> Billing
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-base">
            <Settings className="w-6 h-6 text-gray-500" /> Settings
          </Link>
        </nav>

        {/* Subscription / Upgrade Plan */}
        <SidebarSubscription />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <HeaderActions />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarSubscription() {
  const { user } = useUser();
  const { data: subscription } = useSubscription();
  
  // Detect pro status from Clerk billing data
  const isPro = !!subscription || user?.publicMetadata?.plan === "pro";
  
  // Safe plan name detection for Experimental Clerk Billing
  const subscriptionPlanName = (subscription as any)?.plan?.name || 
                               (subscription as any)?.subscriptionItems?.[0]?.plan?.name ||
                               (isPro ? "Pro Plan" : "Free Plan");
  
  const planName = subscriptionPlanName;

  return (
    <div className="p-4 border-t border-gray-100">
      <div className={`bg-gradient-to-br ${isPro ? 'from-indigo-50 to-purple-50 border-indigo-100' : 'from-purple-50 to-blue-50 border-purple-100'} border rounded-xl p-4 transition-all duration-500 shadow-sm`}>
        <div className="flex items-center gap-2 mb-1">
          {isPro ? (
            <Crown className="w-4 h-4 text-indigo-600 fill-indigo-600 opacity-80 animate-pulse" />
          ) : (
            <Zap className="w-4 h-4 text-purple-600 fill-purple-600 opacity-80" />
          )}
          <h4 className="text-sm font-bold text-gray-900">{planName}</h4>
        </div>
        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
          {isPro 
            ? "You have full access to premium voices and unlimited generations." 
            : "Upgrade to generate more videos and unlock premium voices."
          }
        </p>
        
        {isPro ? (
          <Link href="/dashboard/billing" className="text-[10px] text-indigo-600 font-bold hover:underline">
            Manage Subscription
          </Link>
        ) : (
          <Link href="/dashboard/billing" className="w-full mt-3 flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-100">
            Upgrade Plan
          </Link>
        )}
      </div>
    </div>
  );
}
