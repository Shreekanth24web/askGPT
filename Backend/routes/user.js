import express from 'express';
const router = express.Router();
import User from '../models/userSchema.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body

        // console.log("Signup data received:", req.body);
        // console.log("Signup data received:", name, email, password);
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: email === "admin@gmail.com" ? "admin" : "user"
        })
        console.log(newUser)
        await newUser.save()
        res.status(201).json({ message: "User Sign up successfully" });

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: "Invalid password credentials" })

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '3d' })
        res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email,role:user.role } });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


export default router;