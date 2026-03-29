import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testTogether() {
  const apiKey = process.env.TOGETHER_API_KEY;
  console.log("Testing Together AI...");
  const res = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "black-forest-labs/FLUX.1-schnell",
      prompt: "A beautiful cat, 4k, digital art",
      width: 768,
      height: 1024,
      steps: 4,
      n: 1,
      response_format: "url"
    })
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

testTogether();
