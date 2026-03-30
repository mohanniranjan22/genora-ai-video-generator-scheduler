import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { 
  helloWorld, 
  generateVideo, 
  publishVideo, 
  orchestrateVideoWorkflow, 
  dailyScheduleCron 
} from "@/lib/inngest/functions";

const handler = serve({
  client: inngest,
  functions: [
    helloWorld,
    generateVideo,
    publishVideo,
    orchestrateVideoWorkflow,
    dailyScheduleCron,
  ],
});

export const GET = (req: any, res: any) => {
  console.log("🟢 [Inngest] GET Sync Check");
  return handler.GET(req, res);
};

export const POST = (req: any, res: any) => {
  console.log("🔵 [Inngest] POST Event Received");
  return handler.POST(req, res);
};

export const PUT = handler.PUT;
