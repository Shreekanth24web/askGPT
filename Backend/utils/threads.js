import Thread from '../models/thread.js'
import getGeminiAPIResponse from '../utils/gemini.js'
import getGeminiAPiImgResponse from '../utils/geminiImg.js';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 });
        // console.log('all threads ----->', threads)
        res.json(threads);
    } catch (err) {
        console.log('Get all threads error --->', err)
        res.status(500).json({ error: "Failed to fetch all threads" })
    }
}

export const threads = async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log('Get thread error --->', err)
        res.status(500).json({ error: "Failed to fetch threads" })
    }
}

export const threadsId = async (req, res) => {

    const { threadId } = req.params
    try {
        const thread = await Thread.findOne({ threadId, userId: req.user.id })
        if (!thread) {
            res.status(400).json({ error: "Thread not found" })
        }
        res.json(thread)

    } catch (error) {
        console.log("ThreadId error ---->", error)
        res.status(500).json({ error: "Failed to fetch chat" })
    }
}

export const getAllThreadsId = async (req, res) => {

    const { threadId } = req.params
    try {
        const thread = await Thread.findOne({ threadId })
        if (!thread) {
            res.status(400).json({ error: "Thread not found" })
        }
        res.json(thread)

    } catch (error) {
        console.log("getAllThreads ID error ---->", error)
        res.status(500).json({ error: "Failed to fetch chat" })
    }
}

export const deleteThread = async (req, res) => {
    const { threadId } = req.params

    try {
        const deleteThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id })
        if (!deleteThread) {
            res.status(400).json({ error: "Thread not found" })
        }
        res.status(200).json({ success: "Thread deleted successfuly" })

    } catch (err) {
        console.log("delete thread error ---->", err)
        res.status(500).json({ error: "Failed to delete thread" })
    }
}

export const chat = async (req, res) => {
    const { threadId, message } = req.body
    if (!threadId || !message) {
        res.status(400).json({ error: "Missing required fields" })
    }
    try {
        let thread = await Thread.findOne({ threadId, userId: req.user.id })
        if (!thread) {
            thread = new Thread({
                userId: req.user.id,  // Attach user ID to the thread
                threadId,
                title: message,
                messages: [{ role: 'user', content: message }]
            })
        } else {
            thread.messages.push({ role: 'user', content: message })
        }

        const modelReply = await getGeminiAPIResponse(message)

        thread.messages.push({ role: 'model', content: modelReply })
        thread.updatedAt = new Date()
        await thread.save()
        res.status(200).json({ reply: modelReply })

    } catch (err) {
        console.log("post thread error ---->", err)
        res.status(500).json({ error: "Somthing went worng" })
    }
}

export const getGenImage = async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id, })

        const allGenImgs = threads.flatMap(thread => thread.messages.filter(msg => msg.isImage && msg.content?.imageUrl))

        // console.log(allGenImgs)
        res.send(allGenImgs)
    } catch (error) {
        console.log("Get generated image error", error)
        res.status(500).json({ error: "Failed to get all generated images" })
    }
}

export const getAllGenImages = async (req, res) => {
    try {
        const threads = await Thread.find()

        const allGenImgs = threads.flatMap(thread => thread.messages.filter(msg => msg.isImage && msg.content?.imageUrl))

        // console.log(allGenImgs)
        res.send(allGenImgs)
    } catch (error) {
        console.log("Get generated image error", error)
        res.status(500).json({ error: "Failed to get all generated images" })
    }
}

export const generateImage = async (req, res) => {
    console.log("🔥 /generate-image hit");
    const { threadId, imagePrompt } = req.body
    // console.log(threadId)
    // console.log(imagePrompt)

    if (!threadId || !imagePrompt) {
        res.status(400).json({ error: "Missing required fields" })
    }
    try {
        let thread = await Thread.findOne({ threadId })
        if (!thread) {
            thread = new Thread({
                userId: req.user.id,
                threadId,
                title: imagePrompt,
                messages: []
            })
        }
        thread.messages.push({ role: 'user', content: imagePrompt })

        const imageResponse = await getGeminiAPiImgResponse(imagePrompt)
        console.log("🖼️ Image generated:", imageResponse);

        thread.messages.push({ role: 'model', content: imageResponse, isImage: true })
        thread.updatedAt = new Date()
        await thread.save();
        return res.status(200).json({ image: imageResponse })

    } catch (err) {
        console.log("Error during image generation:", err);
        return res.status(500).json({ error: "Something went wrong while generating the image." });
    }

}

export const deleteGenImg = async (req, res) => {
    console.log('/allGenImages Hit ✅')
    const { filename } = req.params
    console.log(filename)
    try {

        const filePath = path.join(__dirname, "../public/assets", filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // delete from server folder
        } else {
            console.warn("⚠️ File not found on server:", filePath);
        }

        const deleteGenImg = await Thread.findOneAndUpdate(
            { "messages.content.filename": filename }, // Find the document containing the image
            { $pull: { messages: { "content.filename": filename } } }, // Remove only that message
            { new: true }, { userId: req.user.id }
        );

        if (!deleteGenImg) {
            res.status(400).json({ error: "Image not found" })
        }
        res.status(200).json({ success: "Image deleted successfuly" })

    } catch (err) {
        console.log("Generated image delete error", err)
        res.status(500).json({ error: "Generated image delete error" })
    }
}