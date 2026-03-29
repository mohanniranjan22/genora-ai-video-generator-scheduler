async function testPollinations() {
  const prompt = "A beautiful cat, 4k, digital art, high quality";
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&nologo=true`;

  console.log("Fetching:", imageUrl);
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));
    if (!res.ok) {
        const text = await res.text();
        console.log("Error text:", text);
    } else {
        const buffer = await res.arrayBuffer();
        console.log("Length:", buffer.byteLength);
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

testPollinations();
