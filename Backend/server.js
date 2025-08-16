import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js'
import userRoutes from './routes/user.js'


//server connection
const app = express();
const PORT = process.env.PORT || 8001
const URL = process.env.MONGO_URL
app.use(bodyParser.json())

//files
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

app.use(express.json())
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use('/api', chatRoutes)
app.use('/user', userRoutes)


const connectDB = async () => {
    try {
        await mongoose.connect(URL)
        console.log("Database connected....")
    } catch (err) {
        console.log("Database not connected...", err)
    }
}

app.listen(PORT, () => {
    console.log(`Server is Runing at ${PORT}...`);
    connectDB()
})

