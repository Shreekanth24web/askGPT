import 'dotenv/config';
import path from "path";
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from "node:fs";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const modelName = 'gemini-2.0-flash-preview-image-generation';
const apiKey = process.env.GEMINI_API_KEY;

const IMAGE_DIR = path.join(__dirname, "../public/assets");
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true })
}
// const IMAGE_DIR = path.join("Images")
const ai = new GoogleGenerativeAI(apiKey);
const getGeminiAPiImgResponse = async (promptText) => {


  const model = ai.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    }
  });
  try {
    const response = await model.generateContent(promptText)
    const parts = response.response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");

        const timeStamp = Date.now()
        const dateObj = new Date(timeStamp);
        const formatted = dateObj.toISOString()
          .replace(/T/, '_')
          .replace(/:/g, '-')
          .split('.')[0];
        const filename = `Image_${formatted}.png`
        const filepath = path.join(IMAGE_DIR, filename)
        fs.writeFileSync(filepath, buffer)

        console.log("Image saved:", filename);
        // res.set("Content-Type", part.inlineData.mimeType || "image/png")
        // res.send(buffer)
        const imageUrl = `/assets/${filename}`;
        console.log("✅ Image saved:", imageUrl);

        return {
          imageUrl,
          filename
        };

      } else if (part.text) {
        console.log("Text part:", part.text);
      }
    }
  } catch (err) {
    console.log("generate-image Error", err)
    return { error: "Image generation error." };
    // res.send({ error: "Image generating Error" })
    // return res.status(500).json({ error: "Image generation error." });
  }
}

export default getGeminiAPiImgResponse
