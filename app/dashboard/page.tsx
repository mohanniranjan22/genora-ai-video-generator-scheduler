import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Lazy sync user to Supabase
  const user = await currentUser();
  if (user) {
    const supabase = createAdminClient();
    
    // Search by user_id since id is an auto-incrementing bigint
    const { data: existingUser } = await supabase.from('users').select('user_id').eq('user_id', userId).single();
    
    if (!existingUser) {
      const email = user.emailAddresses?.[0]?.emailAddress || "";
      const { error } = await supabase.from('users').insert({
        user_id: userId,
        email: email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      });
      
      if (error) {
        console.error("Error inserting user into Supabase:", error);
      }
    }
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground gap-4">
      <h1 className="text-3xl font-bold">Welcome to Genora Dashboard!</h1>
      <p className="text-muted-foreground">Your account has been synced to Supabase successfully.</p>
    </div>
  )
}
