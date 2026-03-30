import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  helloWorld,
  generateVideo,
  publishVideo,
  orchestrateVideoWorkflow,
  dailyScheduleCron
} from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  landingPage: true,
  functions: [
    helloWorld,
    generateVideo,
    publishVideo,
    orchestrateVideoWorkflow,
    dailyScheduleCron,
  ],
});
