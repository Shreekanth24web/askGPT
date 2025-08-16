import express from 'express'
import Thread from '../models/thread.js'
const router = express.Router();
import { adminMiddleware, authMiddleware } from "../middlewareAuth.js";
import { getAllThreads, threads, threadsId, getAllThreadsId, deleteThread, chat, getGenImage, getAllGenImages, generateImage, deleteGenImg } from '../utils/threads.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//admin
router.get('/getAllThreads', authMiddleware, adminMiddleware, getAllThreads)

//user
router.get('/thread', authMiddleware, threads)

//get one thread or one chat
router.get("/thread/:threadId", authMiddleware, threadsId)

//admin get one thread
router.get("/getAllThreads/:threadId", authMiddleware, adminMiddleware, getAllThreadsId)

//delete thread
router.delete('/thread/:threadId', authMiddleware, deleteThread)

//post 
router.post("/chat", authMiddleware, chat)

//get all images
router.get('/allGenImages', authMiddleware, getGenImage)

//Admin get all images
router.get('/allGenImagesAdmin', authMiddleware, adminMiddleware, getAllGenImages)

//generate images
router.post('/generate-image', authMiddleware, generateImage);

//delete images
router.delete('/allGenImages/:filename', authMiddleware, deleteGenImg)

export default router;