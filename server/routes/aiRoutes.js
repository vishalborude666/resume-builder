import express from "express"
import protect from "../middlewares/authMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../configs/aiController.js";
import upload from "../configs/multer.js";



const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum',protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc',protect, enhanceJobDescription)
// accept a single file under field name 'resumeFile'
aiRouter.post('/upload-resume', protect, upload.single('resumeFile'), uploadResume)

// diagnostic ping
aiRouter.get('/ping', (req, res) => res.status(200).json({ ok: true }))

export default aiRouter;