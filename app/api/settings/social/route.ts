import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    const { data: connections, error } = await supabase
      .from("social_accounts")
      .select("platform, account_name, created_at")
      .eq("user_id", userId);

    if (error) {
      console.error("Fetch social connections error:", error);
      // If table doesn't exist yet, return empty list to avoid UI crash
      return NextResponse.json([]);
    }

    return NextResponse.json(connections || []);
  } catch (error: any) {
    console.error("Settings API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Mock Connect Endpoint
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platform } = await req.json();
    if (!platform) return NextResponse.json({ error: "Platform is required" }, { status: 400 });

    const supabase = createAdminClient();
    
    // Simulate OAuth by saving dummy data
    const mockAccounts: Record<string, string> = {
        youtube: "Genora Studio",
        instagram: "@genora_ai",
        tiktok: "@genora.official"
    };

    const { error } = await supabase
      .from("social_accounts")
      .upsert({
        user_id: userId,
        platform,
        account_name: mockAccounts[platform] || "Connected Account",
        access_token: "mock_access_token_" + Math.random().toString(36).substring(7),
        refresh_token: "mock_refresh_token_" + Math.random().toString(36).substring(7),
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
      });

    if (error) {
      console.error("Upsert social connection error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, account_name: mockAccounts[platform] });
  } catch (error: any) {
    console.error("Connect API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Disconnect Endpoint
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platform } = await req.json();
    if (!platform) return NextResponse.json({ error: "Platform is required" }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("social_accounts")
      .delete()
      .eq("user_id", userId)
      .eq("platform", platform);

    if (error) {
      console.error("Delete social connection error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Disconnect API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
