import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // 1. Delete all user data from Supabase
    // Cascading deletes should handle video_series, social_accounts, etc. if set up, 
    // but we'll manually ensure critical data is gone.
    const { error: dbError } = await supabase
      .from("users")
      .delete()
      .eq("user_id", userId);

    if (dbError) {
      console.error("Supabase user deletion error:", dbError);
      return NextResponse.json({ error: "Failed to delete user data from database" }, { status: 500 });
    }

    // 2. Delete user from Clerk (This will effectively log them out and terminate the account)
    // We use the Clerk Backend API via the clerkClient
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    
    await client.users.deleteUser(userId);

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete Account API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
