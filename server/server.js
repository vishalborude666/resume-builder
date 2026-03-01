import express from 'express'
import cors from 'cors'
import "dotenv/config"
import mongoose from 'mongoose'
import connectDB from './configs/db.js' 
import userRouter from './routes/userRoutes.js'
import aiRouter from "./routes/aiRoutes.js"
import resumeRouter from './routes/resumeroutes.js'
import requestLogger from './middlewares/requestLogger.js'

// Database connection
await connectDB();

const app = express()
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json())
app.use(requestLogger)

// CORS (only once 🔥)
app.use(cors({
  origin: "https://resume-builder-c616.vercel.app",
  credentials: true
}));

// Routes
app.get('/', (req, res) => res.send("Server is running"))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))