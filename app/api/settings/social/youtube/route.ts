import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { GOOGLE_CLIENT_ID, NEXT_PUBLIC_APP_URL } = process.env;
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json({ error: "Google Client ID is not configured" }, { status: 500 });
    }

    const redirectUri = `${NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/settings/social/youtube/callback`;
    const scopes = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid"
    ].join(" ");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        `client_id=${GOOGLE_CLIENT_ID}&` + 
        `redirect_uri=${encodeURIComponent(redirectUri)}&` + 
        `response_type=code&` + 
        `scope=${encodeURIComponent(scopes)}&` + 
        `access_type=offline&` + 
        `prompt=consent`;

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("YouTube Auth Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
