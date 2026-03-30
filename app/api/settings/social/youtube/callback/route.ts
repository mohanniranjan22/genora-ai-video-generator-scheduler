import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("YouTube Google Auth Error:", error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=${error}`);
    }

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_APP_URL } = process.env;
    const redirectUri = `${NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/settings/social/youtube/callback`;

    // 1. Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) {
      console.error("Token Exchange Error:", tokens);
      throw new Error(`Failed to exchange token: ${tokens.error_description}`);
    }

    // 2. Fetch YouTube Channel Name
    const channelRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
      headers: { "Authorization": `Bearer ${tokens.access_token}` },
    });

    const channelData = await channelRes.json();
    const accountName = channelData.items?.[0]?.snippet?.title || "My YouTube Channel";

    // 3. Save to Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("social_accounts")
      .upsert({
        user_id: userId,
        platform: "youtube",
        account_name: accountName,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      });

    if (dbError) {
      console.error("Supabase Save Error:", dbError);
      throw dbError;
    }

    // 4. Redirect back to Settings
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?success=youtube`);
  } catch (error: any) {
    console.error("YouTube Callback Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=server_error`);
  }
}
