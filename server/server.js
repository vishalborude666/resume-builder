import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import resumeRouter from "./routes/resumeroutes.js";
import requestLogger from "./middlewares/requestLogger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed Frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://resume-builder-eight-liart.vercel.app",
  "https://resume-builder-c616-vishalborude666s-projects.vercel.app"
];

// CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// Body parser
app.use(express.json());

// Logger
app.use(requestLogger);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await connectDB();
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB connection error:", err);
  }
});