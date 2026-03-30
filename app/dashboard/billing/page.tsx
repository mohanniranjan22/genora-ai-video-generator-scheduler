"use client";

import { PricingTable, useUser } from "@clerk/nextjs";
import { 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  History,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useSubscription } from "@clerk/nextjs/experimental";

export default function BillingPage() {
  const { user, isLoaded } = useUser();
  const { data: subscription } = useSubscription();

  if (!isLoaded) return null;

  const isPro = !!subscription || user?.publicMetadata?.plan === "pro";
  
  // Safe plan name detection for Experimental Clerk Billing
  const subscriptionPlanName = (subscription as any)?.plan?.name || 
                               (subscription as any)?.subscriptionItems?.[0]?.plan?.name ||
                               (isPro ? "Basic Plan" : "Free Starter");
  
  const planName = subscriptionPlanName;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-purple-900/5 to-blue-900/5 p-8 rounded-3xl border border-purple-100/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-widest">
            <CreditCard className="w-4 h-4" />
            Billing & Subscription
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Choose your power.</h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
            Unlock premium features, faster generation, and higher video limits to scale your content empire.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPro ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Plan</p>
              <p className="text-lg font-black text-gray-900">{planName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Table Section */}
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        
        <div className="relative bg-white/50 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl shadow-purple-100/50 p-4 md:p-12 min-h-[400px] flex items-center justify-center">
            {/* The Clerk Pricing Table Component */}
            <div className="w-full">
              <PricingTable 
                newSubscriptionRedirectUrl="/dashboard?success=billing"
              />
              
              {/* Fallback info for development setup */}
              <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm hidden group-has-[[data-clerk-error]]:block">
                <p className="font-bold flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" /> 
                  Billing Setup Required
                </p>
                <p>If you see a blank space above, please ensure <strong>Clerk Billing</strong> is enabled in your dashboard and you have created your pricing plans.</p>
              </div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 hover:border-purple-200 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Secure Payments</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            All transactions are handled securely via Stripe and Clerk. Your data stays private and protected.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 hover:border-blue-200 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Instant Activation</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            Credits and premium features are added to your account instantly after a successful checkout.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 hover:border-indigo-200 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Easy Management</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            Upgrade, downgrade, or cancel your subscription at any time with a single click.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-900 rounded-[2.5rem] p-12 text-white">
        <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-purple-400 font-black" />
            <h2 className="text-3xl font-black tracking-tight">Billing FAQ</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-300">How do credits work?</h4>
            <p className="text-gray-400 leading-relaxed">
              Each plan comes with a monthly allowance of video generation credits. One minute of generated video typically consumes one credit.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-300">Can I cancel anytime?</h4>
            <p className="text-gray-400 leading-relaxed">
              Yes, you can cancel your subscription at any point. You will retain access to your plan until the end of the current billing cycle.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-300">Do unused credits roll over?</h4>
            <p className="text-gray-400 leading-relaxed">
              Credits reset every billing cycle. We recommend choosing a plan that matches your monthly production needs.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-300">Is there an Enterprise plan?</h4>
            <p className="text-gray-400 leading-relaxed">
              For high-volume production or custom API access, please reach out to our team at enterprise@genora.ai.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-10">
        <p className="text-gray-400 font-medium">Need more help? Our support team is here for you.</p>
        <button className="flex items-center gap-2 text-purple-600 font-bold hover:gap-4 transition-all">
          Contact Support <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">Genora AI — Subscription Engine v1.0.0</p>
      </div>
    </div>
  );
}
