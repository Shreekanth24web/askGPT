import 'dotenv/config'
import express from 'express'
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";
import path from 'node:path'
const app = express()

import getGeminiAPiImgResponse from './utils/geminiImg.js';


const run = async () => {
  const imagePath = await getGeminiAPiImgResponse("Generate a photo-realistic apple image");
  console.log("Image available at:", imagePath);
};

// run();
const ai = new GoogleGenAI({});
async function generateImage(promptText) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [
                { text: promptText }
            ],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE]
            }
        })
        // console.log(response.candidates[0].content.parts[1]);
        const parts = response.candidates[0].content.parts
        for (const part of parts) {
            // console.log(part)
            // Based on the part type, either show the text or save the image
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");

                const timeStamp = Date.now()
                const dateObj = new Date(timeStamp);
                const formatted = dateObj.toISOString()
                    .replace(/T/, '_')
                    .replace(/:/g, '-')
                    .split('.')[0];


                const filename = `Image_${formatted}.png`

                const filepath = path.join(IMAGE_DIR, filename)
                fs.writeFileSync(filepath, buffer)

                // fs.writeFileSync("gemini-native-image.png", buffer);
                console.log(`Image saved filename ---> ${filename}`);
            }
        }
    } catch (err) {
        console.log("image generate Error --->", err)
    }

}



const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
    console.log(`Img Server is Running ${PORT}...`)
})