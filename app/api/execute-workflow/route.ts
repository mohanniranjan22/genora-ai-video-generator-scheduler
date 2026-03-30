import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export async function POST(req: NextRequest) {
  try {
    const { seriesId } = await req.json();

    if (!seriesId) {
      return NextResponse.json({ error: "Series ID is required" }, { status: 400 });
    }

    // Trigger the orchestrated workflow with isTest: true
    await inngest.send({
      name: "video/workflow.scheduled",
      data: { 
        seriesId,
        isTest: true
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test Workflow triggered!" 
    });
  } catch (error: any) {
    console.error("Execute Workflow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
