import express from 'express'
import cors from 'cors'
import "dotenv/config"
import mongoose from 'mongoose'
import connectDB from './configs/db.js' 
import userRouter from './routes/userRoutes.js'
import aiRouter from "./routes/aiRoutes.js"
import resumeRouter from './routes/resumeroutes.js'
import requestLogger from './middlewares/requestLogger.js'

const app = express()
const PORT = process.env.PORT || 3000;

// ---- CORS (belt-and-suspenders) ----
// 1) Manual headers – guarantees every response (including errors) has them
const allowedOrigins = [
  "http://localhost:5173",
  "https://resume-builder-eight-liart.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// 2) cors package as a second layer
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Other middlewares
app.use(express.json());
app.use(requestLogger);
app.use(cors());
// Routes
app.get('/', (req, res) => res.send("Server is running"))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

// Start server first, THEN connect to DB so the process doesn't hang
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB().catch(err => console.error("DB connection error:", err));
})