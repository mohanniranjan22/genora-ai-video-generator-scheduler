/**
 * Utility to refresh a Google OAuth access token.
 */
export async function refreshAccessToken(refreshToken: string) {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Google Client ID or Secret is not configured");
    }
  
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
  
    const data = await res.json();
    if (!res.ok) {
      console.error("Token refresh error:", data);
      throw new Error(`Failed to refresh Google token: ${data.error_description || data.error}`);
    }
  
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
}

/**
 * Uploads a video to YouTube using the Resumable Upload protocol.
 */
export async function uploadToYoutube(
    videoBuffer: Buffer, 
    metadata: { title: string; description: string; niche: string }, 
    accessToken: string
) {
    // 1. Initiate Resumable Upload Session
    const initiateRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": videoBuffer.length.toString(),
      },
      body: JSON.stringify({
        snippet: {
          title: metadata.title,
          description: metadata.description,
          categoryId: "24", // Entertainment
          tags: [metadata.niche, "AI", "Genora"],
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false,
        },
      }) as any,
    });
  
    if (!initiateRes.ok) {
      const errorText = await initiateRes.text();
      console.error("YouTube Upload Initiation Error:", errorText);
      throw new Error(`Failed to initiate YouTube upload: ${initiateRes.status} ${errorText}`);
    }
  
    const sessionId = initiateRes.headers.get("Location");
    if (!sessionId) throw new Error("Could not get upload session ID from YouTube");
  
    // 2. Upload Video Binary
    const uploadRes = await fetch(sessionId, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": videoBuffer.length.toString(),
      },
      body: videoBuffer as any,
    });
  
    const result = await uploadRes.json();
    if (!uploadRes.ok) {
      console.error("YouTube Binary Upload Error:", result);
      throw new Error(`Failed to upload video binary to YouTube: ${uploadRes.status}`);
    }
  
    return { videoId: result.id };
}
