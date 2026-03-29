import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}`);
    const response = await client.models.generateContent({
      model: modelName,
      contents: "A cute cat",
      config: {
        responseModalities: ["IMAGE"],
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        console.log(`SUCCESS: ${modelName} generated an image!`);
        return true;
    } else {
        console.log(`FAILED: ${modelName} did not return inlineData`);
    }
  } catch (err) {
    console.error(`ERROR on ${modelName}:`, err.message);
  }
  return false;
}

async function runTests() {
  await testModel("gemini-2.5-flash-image");
  await testModel("gemini-3.1-flash-image-preview");
  await testModel("gemini-3-pro-image-preview");
  await testModel("gemini-3.0-flash-image");
  await testModel("gemini-2.5-pro-image");
}

runTests();
