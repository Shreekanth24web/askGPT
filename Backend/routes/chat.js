import express from 'express'
import Thread from '../models/thread.js'
const router = express.Router();
import { adminMiddleware, authMiddleware } from "../middlewareAuth.js";
import { getAllThreads, threads, threadsId, getAllThreadsId, deleteThread, chat, getGenImage, getAllGenImages, generateImage, deleteGenImg, deleteThreadByAdmin } from '../utils/threads.js'


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

//delete admin thread
router.delete('/getAllThreads/:threadId', authMiddleware, adminMiddleware, deleteThreadByAdmin)

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