import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const supabase = await createClient();

    // Map frontend data to database schema
    const { error } = await supabase
      .from("video_series")
      .upsert({
        id: data.id, // Will be undefined for new series, inducing an insert
        user_id: userId,
        series_name: data.seriesName,
        niche: data.niche,
        custom_niche: data.customNiche,
        niche_type: data.nicheType,
        language: data.language,
        voice: data.voice,
        background_music: data.backgroundMusic,
        video_style: data.videoStyle,
        caption_style: data.captionStyle,
        duration: data.duration,
        platforms: data.platforms,
        publish_time: data.publishTime,
        status: data.status || "active"
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
