import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { inngest } from "@/lib/inngest/client";

export async function POST(req: NextRequest) {
  try {
    const { seriesId } = await req.json();

    if (!seriesId) {
      return NextResponse.json({ error: "Series ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Calculate the next episode_number immediately
    const { count } = await supabase
      .from("video_records")
      .select("*", { count: "exact", head: true })
      .eq("series_id", seriesId);

    const episodeNumber = (count || 0) + 1;

    // 2. Create the video record row with 'processing' status
    const { data: record, error: recordError } = await supabase
      .from("video_records")
      .insert({
        series_id: seriesId,
        episode_number: episodeNumber,
        video_title: `Episode #${episodeNumber} - Generating...`,
        status: "processing"
      })
      .select("id")
      .single();

    if (recordError) throw recordError;

    // 3. Send event to Inngest with the pre-created recordId
    await inngest.send({
      name: "video/generate",
      data: { 
        seriesId,
        recordId: record.id
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Generation triggered!", 
      recordId: record.id 
    });
  } catch (error: any) {
    console.error("Trigger error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
