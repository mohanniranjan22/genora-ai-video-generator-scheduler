import { 
  renderVideoOnLambda, 
  getRenderProgress, 
} from "@remotion/lambda/client";

export const renderVideo = async (props: {
  audioUrl: string;
  imageUrls: string[];
  captions: any[];
  captionStyle: string;
  seriesName: string;
  episodeNumber: number;
  durationInFrames: number;
}) => {
  const { 
    REMOTION_AWS_ACCESS_KEY_ID, 
    REMOTION_AWS_SECRET_ACCESS_KEY,
    REMOTION_AWS_REGION,
    REMOTION_AWS_S3_BUCKET,
    REMOTION_AWS_SERVE_URL,
    REMOTION_AWS_FUNCTION_NAME 
  } = process.env;

  if (!REMOTION_AWS_ACCESS_KEY_ID || !REMOTION_AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS Credentials not configured in .env.local");
  }

  // Define the region and credentials
  const region = (REMOTION_AWS_REGION as any) || "us-east-1";
  
  const funcName = REMOTION_AWS_FUNCTION_NAME || "remotion-render-3-3-92";

  // 1. Trigger the render
  const { renderId, bucketName } = await renderVideoOnLambda({
    region,
    functionName: funcName,
    serveUrl: REMOTION_AWS_SERVE_URL || "", // The URL of the deployed Remotion site
    composition: "MainVideo",
    inputProps: props,
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    privacy: "public",
    downloadBehavior: {
      type: "download",
      fileName: `video_${Date.now()}.mp4`,
    },
    framesPerLambda: 300, // Process 10s per function to prevent timeouts while keeping invocations low
  });

  console.log(`Render started: ${renderId} in bucket ${bucketName}`);

  // 2. Poll for the result
  let progress = 0;
  let finalUrl: string | null = null;
  let networkFailures = 0;
  
  while (progress < 1) {
    // Wait 10 seconds between polls to reduce network overhead
    await new Promise((resolve) => setTimeout(resolve, 10000));
    
    try {
      const status = await getRenderProgress({
        renderId,
        bucketName,
        region,
        functionName: funcName,
      });

      // Reset failure counter on success
      networkFailures = 0;

      if (status.fatalErrorEncountered) {
        throw new Error(`Lambda Render Failed: ${status.errors[0].message}`);
      }

      progress = status.overallProgress;
      console.log(`Render Progress: ${Math.round(progress * 100)}%`);

      if (status.outputFile) {
        finalUrl = status.outputFile;
        break;
      }
    } catch (err: any) {
      // If it's a known fatal error from Remotion, rethrow
      if (err.message.includes('Lambda Render Failed')) throw err;
      
      networkFailures++;
      console.error(`Polling attempt ${networkFailures} failed:`, err.message);
      
      if (networkFailures >= 5) {
        throw new Error(`Polling failed after 5 consecutive network errors: ${err.message}`);
      }
      // Continue loop to retry
    }
  }

  return finalUrl;
};
