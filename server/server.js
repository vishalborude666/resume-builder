import express from 'express'
import cors from 'cors'
import "dotenv/config"
import mongoose from 'mongoose'
import connectDB from './configs/db.js' 
import userRouter from './routes/userRoutes.js'
import aiRouter from "./routes/aiRoutes.js"
import resumeRouter from './routes/resumeroutes.js'
import requestLogger from './middlewares/requestLogger.js'
//  database connection 
await connectDB();



const app = express()
const PORT = process.env.PORT ||3000 ;
app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.get('/',(req,res)=>res.send("server is running"))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai',aiRouter)
import cors from "cors";

app.use(cors({
  origin: "https://your-frontend-name.vercel.app",
  credentials: true
}));
app.use(cors());
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))