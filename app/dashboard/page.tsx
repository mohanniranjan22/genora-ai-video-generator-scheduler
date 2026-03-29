import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import SeriesList from "@/components/dashboard/SeriesList";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Sync user and fetch series
  const user = await currentUser();
  const supabase = createAdminClient();

  if (user) {
    const { data: existingUser } = await supabase.from('users').select('user_id').eq('user_id', userId).single();
    if (!existingUser) {
      const email = user.emailAddresses?.[0]?.emailAddress || "";
      await supabase.from('users').insert({
        user_id: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: email,
      });
    }
  }

  const { data: series } = await supabase
    .from('video_series')
    .select(`
      *,
      video_records (
        id,
        status,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Add derived properties for the UI
  const seriesWithMeta = series?.map(s => {
    const records = s.video_records || [];
    const latestRecord = records.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    return {
      ...s,
      videoCount: records.length,
      latestStatus: latestRecord?.status || 'idle'
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, {user?.firstName || "Creator"}! 👋
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">Ready to scale your content today?</p>
        </div>
        
        {series && series.length > 0 && (
          <Link 
            href="/dashboard/create"
            className="h-11 px-6 flex items-center justify-center rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            + Create New Series
          </Link>
        )}
      </div>

      <SeriesList series={seriesWithMeta || []} />
    </div>
  );
}
