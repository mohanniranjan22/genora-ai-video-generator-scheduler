import { inngest } from "./client";
import { createAdminClient } from "@/utils/supabase/admin";
import { GoogleGenAI } from "@google/genai";
import { sendEmail } from "../mail";
import { refreshAccessToken, uploadToYoutube } from "../youtube";

/**
 * Splits text into chunks of maximum character length, trying to preserve words.
 */
function splitIntoChunks(text: string, maxLength: number): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + " " + word).length <= maxLength) {
      currentChunk += (currentChunk ? " " : "") + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-moment", "1s");
    return { message: `Hello ${event.data.name || "World"}!` };
  }
);

export const generateVideo = inngest.createFunction(
  { id: "generate-video", triggers: [{ event: "video/generate" }] },
  async ({ event, step }) => {
    const { seriesId, recordId: existingRecordId } = event.data;

    // 1. Fetch Series data from supabase
    const series = await step.run("fetch-series-data", async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("video_series")
        .select("*")
        .eq("id", seriesId)
        .single();

      if (error) throw new Error(`Failed to fetch series: ${error.message}`);
      return data;
    });

    // 2. Generate Video Script using AI
    const genData = await step.run("generate-video-script", async () => {
      const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

      const isLongVideo = series.duration === "60-70 sec video";
      const numPrompts = isLongVideo ? "5-6" : "4-5";

      const prompt = `
        Generate a viral short-form video script and highly detailed AI image generation prompts for a series about "${series.series_name}" (Niche: ${series.niche}). 
        The video style is: ${series.video_style}. 
        Target Duration: ${series.duration}.

        Requirements:
        - The script should be engaging, natural for a voiceover, and flow logically.
        - Generate exactly ${numPrompts} image prompts that visually represent different scenes in the script.
        - Each image prompt should be a detailed description optimized for an AI image generator (like Midjourney or Flux), incorporating the "${series.video_style}" style.
        - IMPORTANT: Return the result in RAW JSON format ONLY. Do not include any markdown blocks, backticks, or extra text.

        JSON Structure:
        {
          "title": "...",
          "script": "...",
          "image_prompts": ["prompt 1", "prompt 2", ...]
        }
      `;

      const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      
      try {
        // Try to clean up markdown if Gemini includes it despite the prompt
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
      } catch (e) {
        console.error("Gemini JSON parse error:", responseText);
        throw new Error("Failed to generate valid JSON from AI");
      }
    });

    // 3. Generate Voice using TTS model
    const voiceUrl = await step.run("generate-voice", async () => {
      const { model_name, voice, model_language } = series;
      const scriptText = genData.script;
      
      const supabase = createAdminClient();
      const fileName = `voice_${seriesId}_${Date.now()}.mp3`;

      if (model_name === "deepgram") {
        const response = await fetch(`https://api.deepgram.com/v1/speak?model=${voice}`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${process.env.DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: scriptText }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Deepgram TTS failed: ${response.status} ${errorText}`);
        }
        
        const audioBuffer = await response.arrayBuffer();
        const { error } = await supabase.storage
          .from("voiceovers")
          .upload(fileName, audioBuffer, { contentType: "audio/mpeg", upsert: true });

        if (error) throw error;
        return supabase.storage.from("voiceovers").getPublicUrl(fileName).data.publicUrl;

      } else if (model_name === "fonadalab") {
        const chunks = splitIntoChunks(scriptText, 440); // 440 to be safe (limit is 450)
        const audioBuffers: Buffer[] = [];

        for (const chunk of chunks) {
          const res = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.FONADALABS_API_KEY}`
            },
            body: JSON.stringify({
              input: chunk,
              voice: voice,
              language: model_language
            })
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Fonadalabs TTS failed: ${res.status} ${errorText}`);
          }
          const arrayBuffer = await res.arrayBuffer();
          audioBuffers.push(Buffer.from(arrayBuffer));
        }

        const finalBuffer = Buffer.concat(audioBuffers);
        const { error } = await supabase.storage
          .from("voiceovers")
          .upload(fileName, finalBuffer, { contentType: "audio/mpeg", upsert: true });

        if (error) throw error;
        return supabase.storage.from("voiceovers").getPublicUrl(fileName).data.publicUrl;
      }

      throw new Error(`Unsupported TTS engine: ${model_name}`);
    });

    // 4. Save video metadata to database (Update if exists, else Insert)
    const recordId = await step.run("save-to-database", async () => {
      const supabase = createAdminClient();
      let activeRecordId = existingRecordId;

      if (activeRecordId) {
        // Update the existing placeholder record
        const { error } = await supabase
          .from("video_records")
          .update({
            video_title: genData.title,
            video_script: genData.script,
            status: "processing" 
          })
          .eq("id", activeRecordId);

        if (error) throw new Error(`Failed to update video_record: ${error.message}`);
      } else {
        // Fallback: Create a new record if not provided by API
        const { count } = await supabase
          .from("video_records")
          .select("*", { count: "exact", head: true })
          .eq("series_id", seriesId);

        const { data, error } = await supabase
          .from("video_records")
          .insert({
            series_id: seriesId,
            episode_number: (count || 0) + 1,
            video_title: genData.title,
            video_script: genData.script,
            status: "processing" 
          })
          .select("id")
          .single();

        if (error) throw new Error(`Failed to create video_record: ${error.message}`);
        activeRecordId = data.id;
      }
      
      // Save voiceover asset
      const { error: assetError } = await supabase
        .from("video_assets")
        .insert({
          video_record_id: activeRecordId,
          asset_type: "voiceover",
          asset_url: voiceUrl,
          status: "completed"
        });
      
      if (assetError) throw new Error(`Failed to create voiceover asset: ${assetError.message}`);

      return activeRecordId;
    });

    // 5. Generate Caption using Model
    const captions = await step.run("generate-captions", async () => {
      const response = await fetch("https://api.deepgram.com/v1/listen?smart_format=true&utterances=true", {
        method: "POST",
        headers: {
          "Authorization": `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: voiceUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepgram transcription failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const words = data.results?.channels[0]?.alternatives[0]?.words;
      
      if (!words) throw new Error("No captions generated from Deepgram");

      // Update the video record with the captions
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("video_records")
        .update({ captions: words })
        .eq("id", recordId);

      if (error) throw new Error(`Failed to update captions: ${error.message}`);

      return words;
    });

    // 6. Generate Images from image prompt
    const generatedImages = await step.run("generate-images", async () => {
      const prompts = genData.image_prompts;
      const imageUrls: string[] = [];
      const supabase = createAdminClient();

      // Auto-create images bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      if (buckets && !buckets.find(b => b.name === "images")) {
        await supabase.storage.createBucket("images", { public: true });
      }

      for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        
        // Generate image using Hugging Face FLUX.1 (Bypasses Gemini Paywall)
        const response = await fetch("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `${prompt}, ${series.video_style} style, high quality, 4k, vertical portrait 9:16`,
            parameters: {
              width: 768,
              height: 1024 // FLUX optimal vertical ratio
            }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HuggingFace failed: ${response.status} ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const imgBuffer = Buffer.from(arrayBuffer);
        const fileName = `img_${seriesId}_${i}_${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, imgBuffer, { contentType: "image/png" });

        if (uploadError) throw uploadError;

        const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
        
        // Insert individual image asset
        const { error: imgAssetError } = await supabase
           .from("video_assets")
           .insert({
              video_record_id: recordId,
              asset_type: "image",
              asset_index: i + 1,
              prompt_used: prompt,
              asset_url: publicUrl,
              status: "completed"
           });
           
        if (imgAssetError) throw new Error(`Failed to save image asset ${i}: ${imgAssetError.message}`);

        imageUrls.push(publicUrl);
      }

      // Final update to the video record
      const { error: updateError } = await supabase
        .from("video_records")
        .update({ 
          status: "completed" 
        })
        .eq("id", recordId);

      if (updateError) throw new Error(`Failed to finalize video_record: ${updateError.message}`);

      return imageUrls;
    });

    // 8. Render Final Video (Remotion + AWS Lambda)
    const finalVideoUrl = await step.run("render-final-video", async () => {
      const { renderVideo } = await import("@/lib/remotion/lambda");
      const supabase = createAdminClient();

      // Fetch the record to get episode number and any other meta
      const { data: videoRecord } = await supabase
        .from("video_records")
        .select("episode_number")
        .eq("id", recordId)
        .single();
      
      // Calculate duration from Deepgram
      const lastWord = captions[captions.length - 1];
      const durationSeconds = lastWord ? lastWord.end + 1 : 30; // 1s buffer
      const durationInFrames = Math.ceil(durationSeconds * 30);

      const videoUrl = await renderVideo({
        audioUrl: voiceUrl,
        imageUrls: generatedImages,
        captions: captions,
        captionStyle: series.caption_style || "modern-yellow",
        seriesName: series.series_name,
        episodeNumber: videoRecord?.episode_number || 1,
        durationInFrames
      });

      if (!videoUrl) throw new Error("Video rendering failed or returned null URL");

      // Final update to the video record with the playable MP4 URL
      const { error: updateError } = await supabase
        .from("video_records")
        .update({ 
          final_video_url: videoUrl,
          status: "completed" 
        })
        .eq("id", recordId);

      if (updateError) throw new Error(`Failed to finalize video_record with URL: ${updateError.message}`);

      return videoUrl;
    });

    return { 
      message: "Full automation complete! Video is ready.",
      seriesId,
      recordId,
      finalVideoUrl,
      imagesCount: generatedImages.length
    };
  }
);

/**
 * Publishes the generated video to configured platforms.
 */
export const publishVideo = inngest.createFunction(
  { id: "publish-video", triggers: [{ event: "video/publish" }] },
  async ({ event, step }) => {
    const { seriesId, recordId, videoUrl } = event.data;
    
    // 1. Fetch Series & User data
    const { series, user, videoRecord } = await step.run("fetch-publishing-data", async () => {
      const supabase = createAdminClient();
      
      const { data: seriesData, error: sError } = await supabase
        .from("video_series")
        .select("*")
        .eq("id", seriesId)
        .single();
        
      if (sError) throw new Error(`Failed to fetch series data: ${sError.message}`);

      const { data: userData, error: uError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", seriesData.user_id)
        .single();
        
      if (uError) throw new Error(`Failed to fetch user data: ${uError.message}`);
      
      const { data: recordData, error: rError } = await supabase
        .from("video_records")
        .select("episode_number")
        .eq("id", recordId)
        .single();
        
      if (rError) throw new Error(`Failed to fetch video record: ${rError.message}`);
      
      return { series: seriesData, user: userData, videoRecord: recordData };
    });

    const platforms = series.platforms || [];
    const results: any = {};

    // 2. Email Notification
    if (platforms.includes("Email")) {
      results.email = await step.run("send-email-notification", async () => {
        return await sendEmail({
          to: user.email,
          subject: `✨ Your Video for "${series.series_name}" is Ready!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background: #7c3aed; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Genora AI</h1>
              </div>
              <div style="padding: 24px;">
                <h2 style="color: #1e293b; margin-top: 0;">Your content is live! 🎬</h2>
                <p style="color: #475569; line-height: 1.6;">
                  The latest episode for your series <strong>"${series.series_name}"</strong> has been generated and scheduled successfully.
                </p>
                <div style="margin: 32px 0; text-align: center;">
                  <a href="${videoUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Your Video</a>
                </div>
                <p style="color: #94a3b8; font-size: 14px;">
                  Platforms scheduled: ${platforms.join(", ")}
                </p>
              </div>
            </div>
          `
        });
      });
    }

    // 3. Social Media Publishing
    if (platforms.includes("Youtube")) {
      results.youtube = await step.run("publish-youtube-video", async () => {
        const supabase = createAdminClient();
        
        // 1. Fetch channel credentials
        const { data: credentials, error: cError } = await supabase
          .from("social_accounts")
          .select("*")
          .eq("user_id", user.user_id)
          .eq("platform", "youtube")
          .single();

        if (cError || !credentials) {
            console.error("🔴 [Publish] YouTube credentials not found");
            return { error: "YouTube not connected" };
        }

        // 2. Token Refresh Logic
        let { access_token, refresh_token, expires_at } = credentials;
        const now = new Date();
        const expiry = new Date(expires_at);

        if (expiry.getTime() - now.getTime() < 300 * 1000) { // 5 mins buffer
            console.log("🟠 [Publish] Refreshing YouTube access token...");
            const { access_token: new_at, expires_in } = await refreshAccessToken(refresh_token);
            access_token = new_at;
            
            // Save new token back to DB
            await supabase
              .from("social_accounts")
              .update({ 
                access_token: new_at, 
                expires_at: new Date(Date.now() + expires_in * 1000).toISOString() 
              })
              .eq("id", credentials.id);
        }

        // 3. Fetch video into buffer
        const videoRes = await fetch(videoUrl);
        if (!videoRes.ok) throw new Error("Failed to fetch video file from URL");
        const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

        // 4. Upload to YouTube
        const { videoId } = await uploadToYoutube(
            videoBuffer, 
            { 
                title: `${series.series_name} - Episode #${videoRecord.episode_number}`, 
                description: `Created with Genora AI. Series: ${series.series_name}`,
                niche: series.niche 
            }, 
            access_token
        );

        console.log(`🟢 [Publish] YouTube Upload Complete: ${videoId}`);
        return { success: true, videoId };
      });
    }

    if (platforms.includes("Instagram")) {
      results.instagram = await step.run("publish-instagram-placeholder", async () => {
        console.log("🟠 [Publish] Instagram Publishing Placeholder (API Integration Pending)");
        return { success: true, message: "Placeholder: Video would be posted as a Reel" };
      });
    }

    if (platforms.includes("Tiktok")) {
      results.tiktok = await step.run("publish-tiktok-placeholder", async () => {
        console.log("🟠 [Publish] Tiktok Publishing Placeholder (API Integration Pending)");
        return { success: true, message: "Placeholder: Video would be posted to TikTok" };
      });
    }

    return { results };
  }
);

/**
 * Orchestrates the full video workflow: Generate -> Wait -> Publish
 */
export const orchestrateVideoWorkflow = inngest.createFunction(
  { id: "orchestrate-video-workflow", triggers: [{ event: "video/workflow.scheduled" }] },
  async ({ event, step }) => {
    const { seriesId, isTest } = event.data;

    // 1. Fetch Series data
    const series = await step.run("fetch-series-ref", async () => {
      const supabase = createAdminClient();
      const { data } = await supabase.from("video_series").select("*").eq("id", seriesId).single();
      return data;
    });

    // 2. Wait until 2 hours before Publish Time (Generation Start)
    if (!isTest) {
      const [hour, minute] = (series.publish_time || "18:00").split(":").map(Number);
      const genStartDate = new Date();
      genStartDate.setHours(hour - 2, minute, 0, 0);
      
      if (genStartDate.getTime() > Date.now()) {
        await step.sleepUntil("wait-for-generation-start", genStartDate);
      }
    }

    // 3. Trigger Generation
    const genResult = await step.invoke("generate-video-step", {
        function: generateVideo,
        data: { seriesId }
    });

    // 3. Wait until Publish Time
    if (!isTest) {
      const [hour, minute] = (series.publish_time || "18:00").split(":").map(Number);
      const publishDate = new Date();
      publishDate.setHours(hour, minute, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (publishDate.getTime() <= Date.now()) {
        publishDate.setDate(publishDate.getDate() + 1);
      }
      
      await step.sleepUntil("wait-for-publish-time", publishDate);
    } else {
      await step.sleep("test-wait", "2s");
    }

    // 4. Trigger Publishing
    return await step.invoke("publish-video-step", {
        function: publishVideo,
        data: { 
            seriesId, 
            recordId: genResult.recordId, 
            videoUrl: genResult.finalVideoUrl 
        }
    });
  }
);

/**
 * Cron job to check for active series and schedule generation (2 hours before publish).
 */
export const dailyScheduleCron = inngest.createFunction(
  { id: "daily-schedule-cron", triggers: [{ cron: "0 * * * *" }] }, // Run every hour
  async ({ step }) => {
    // 1. Fetch all active series
    const activeSeries = await step.run("fetch-active-series", async () => {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("video_series")
        .select("id, publish_time, status")
        .eq("status", "active");
      return data || [];
    });

    const scheduled = [];

    for (const series of activeSeries) {
      const result = await step.run(`check-series-${series.id}`, async () => {
        const [hour, minute] = (series.publish_time || "18:00").split(":").map(Number);
        
        // Calculate generation start time (2 hours before publish)
        const genStartTime = new Date();
        genStartTime.setHours(hour - 2, minute, 0, 0);
        
        const now = new Date();
        const diffMs = genStartTime.getTime() - now.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        // If generation should start in the next 60 minutes
        if (diffMinutes > 0 && diffMinutes <= 60) {
            // Check if we already scheduled something for this series today
            const supabase = createAdminClient();
            const today = new Date().toISOString().split('T')[0];
            const { count } = await supabase
                .from("video_records")
                .select("*", { count: "exact", head: true })
                .eq("series_id", series.id)
                .gte("created_at", today);

            if (!count || count === 0) {
              return { shouldSchedule: true };
            }
        }
        return { shouldSchedule: false };
      });

      if (result.shouldSchedule) {
        await step.sendEvent(`trigger-workflow-${series.id}`, {
          name: "video/workflow.scheduled",
          data: { seriesId: series.id }
        });
        scheduled.push(series.id);
      }
    }

    return { scheduledCount: scheduled.length, scheduledIds: scheduled };
  }
);
