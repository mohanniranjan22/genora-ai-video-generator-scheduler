import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Reset all processing records to failed for this emergency cleanup
    const { data, error } = await supabase
      .from('video_records')
      .update({ status: 'failed', video_title: 'Episode Generation Cancelled/Stopped' })
      .eq('status', 'processing');

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: "Emergency reset complete. All stuck generations have been set to 'failed'." 
    });
  } catch (error: any) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
