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

const corsOptions = {
  origin: [
    'http://localhost:5173',
'resume-builder-c616.vercel.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));
// register a safe OPTIONS handler that runs the CORS middleware without using a path pattern
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // run CORS for this preflight request then end with 204 No Content
    return cors(corsOptions)(req, res, () => res.sendStatus(204));
  }
  next();
});


// Routes
app.get('/', (req, res) => res.send("Server is running"))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))