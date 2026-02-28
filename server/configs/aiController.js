import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import fs from "fs";
import pdfParse from "pdf-parse";
import mongoose from "mongoose";

// POST : /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // quick pre-check: ensure OpenAI API key exists to avoid confusing 404s
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
    if (!apiKey) {
      console.error("[ai] OpenAI API key is not set in environment");
      return res.status(503).json({ message: "OpenAI API key not configured on server" });
    }

    try {
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      console.log("[ai] using model for enhanceProfessionalSummary:", model);

      // Prefer chat completions API if available
      if (ai?.chat?.completions && typeof ai.chat.completions.create === "function") {
        const response = await ai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are an expert in resume writing. Enhance the professional summary to 1-2 sentences highlighting key skills and accomplishments. Return only the enhanced text." },
            { role: "user", content: userContent },
          ],
        });
        const enhanceContent = response.choices?.[0]?.message?.content || String(userContent);
        return res.status(200).json({ enhanceContent });
      }

      // If chat completions shape isn't available, try the Responses API as a fallback
      if (ai?.responses && typeof ai.responses.create === "function") {
        const resp = await ai.responses.create({
          model,
          input: `Enhance the following professional summary to 1-2 sentences:\n\n${userContent}`,
        });
        // try multiple ways to extract text depending on SDK response shape
        const outText = resp.output_text || resp.output?.[0]?.content?.[0]?.text || (Array.isArray(resp.output) && resp.output.map(o => o.content?.map(c => c.text || c).join(" ")).join("\n"));
        const enhanceContent = outText || String(userContent);
        return res.status(200).json({ enhanceContent });
      }

      throw new Error("OpenAI client does not expose chat.completions.create or responses.create");
    } catch (aiError) {
      // Log extensive info for debugging
      try {
        console.error("[ai] enhanceProfessionalSummary OpenAI error name:", aiError?.name);
        console.error("[ai] enhanceProfessionalSummary OpenAI error message:", aiError?.message);
        console.error("[ai] enhanceProfessionalSummary OpenAI error code:", aiError?.code);
        console.error("[ai] enhanceProfessionalSummary OpenAI error stack:", aiError?.stack);
        console.error("[ai] enhanceProfessionalSummary OpenAI error response status:", aiError?.response?.status);
        console.error("[ai] enhanceProfessionalSummary OpenAI error response data:", aiError?.response?.data);
        console.error("[ai] enhanceProfessionalSummary OpenAI error request:", aiError?.request);
      } catch (logErr) {
        console.error("[ai] error while logging aiError:", logErr);
      }

      // Fallback: perform a minimal, deterministic enhancement so the client still receives useful text
      const base = String(userContent || "").trim();
      const fallback = base ? `${base.charAt(0).toUpperCase()}${base.slice(1)}.` : "Experienced professional with relevant skills and achievements.";
      // Return a plain fallback summary
      return res.status(200).json({ enhanceContent: fallback });
    }
  } catch (error) {
    console.error("[ai] enhanceProfessionalSummary unexpected error:", error);
    return res.status(500).json({ message: "Server error while generating summary" });
  }
};

// POST : /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // quick pre-check: ensure OpenAI API key exists to avoid confusing 404s
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
    if (!apiKey) {
      console.error("[ai] OpenAI API key is not set in environment");
      return res.status(503).json({ message: "OpenAI API key not configured on server" });
    }

    try {
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      console.log("[ai] using model for enhanceJobDescription:", model);

      if (ai?.chat?.completions && typeof ai.chat.completions.create === "function") {
        const response = await ai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are an expert in resume writing. Enhance the job description to 1-2 concise sentences highlighting impact and skills. Return only the enhanced text." },
            { role: "user", content: userContent },
          ],
        });
        const enhanceContent = response.choices?.[0]?.message?.content || String(userContent);
        return res.status(200).json({ enhanceContent });
      }

      if (ai?.responses && typeof ai.responses.create === "function") {
        const resp = await ai.responses.create({ model, input: `Enhance the following job description to 1-2 sentences:\n\n${userContent}` });
        const outText = resp.output_text || resp.output?.[0]?.content?.[0]?.text || (Array.isArray(resp.output) && resp.output.map(o => o.content?.map(c => c.text || c).join(" ")).join("\n"));
        const enhanceContent = outText || String(userContent);
        return res.status(200).json({ enhanceContent });
      }

      throw new Error("OpenAI client does not expose chat.completions.create or responses.create");
    } catch (aiError) {
      try {
        console.error("[ai] enhanceJobDescription OpenAI error message:", aiError && aiError.message ? aiError.message : aiError);
        console.error("[ai] enhanceJobDescription OpenAI error response status:", aiError?.response?.status);
        console.error("[ai] enhanceJobDescription OpenAI error response data:", aiError?.response?.data);
      } catch (logErr) {
        console.error("[ai] error while logging aiError:", logErr);
      }
      const base = String(userContent || "").trim();
      const fallback = base ? `${base.charAt(0).toUpperCase()}${base.slice(1)}.` : "Contributed to projects with measurable impact and strong collaboration.";
      return res.status(200).json({ enhanceContent: fallback });
    }
  } catch (error) {
    console.error("[ai] enhanceJobDescription unexpected error:", error);
    return res.status(500).json({ message: "Server error while enhancing job description" });
  }
};

// post: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    console.log("[ai] uploadResume handler invoked");
    console.log("[ai] headers:", Object.keys(req.headers).length ? { ...req.headers, authorization: req.headers.authorization ? req.headers.authorization.replace(/(.{6}).+/, "$1...[redacted]") : undefined } : {});
    console.log("[ai] file present?", !!req.file);
    console.log("[ai] body keys:", Object.keys(req.body || {}));

    // accept either a text payload (`resumeText`) or a file upload (`req.file`)
    let { resumeText, title } = req.body;
    const userId = req.userId;

    // if a file was uploaded, parse text from PDF on the server
    let uploadedFilePath;
    if (!resumeText && req.file) {
      uploadedFilePath = req.file.path;
      const fileBuffer = fs.readFileSync(uploadedFilePath);
      const parsed = await pdfParse(fileBuffer);
      resumeText = parsed.text;
    }

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt = "You are an expert AI agent to extract structured resume data.";
    const userPrompt = `Extract structured resume JSON from the following resume text. Return only valid JSON with keys: proffessional_summary, skills (array), personal_info (object), experience (array), projects (array), education (array). Resume text:\n\n${resumeText}`;

    let parsedData;
    try {
      if (ai?.chat?.completions && typeof ai.chat.completions.create === "function") {
        const response = await ai.chat.completions.create({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], response_format: { type: "json_object" } });
        const extracteData = response.choices?.[0]?.message?.content;
        parsedData = JSON.parse(extracteData);
      } else if (ai?.responses && typeof ai.responses.create === "function") {
        const resp = await ai.responses.create({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", input: userPrompt });
        const outText = resp.output_text || resp.output?.[0]?.content?.[0]?.text || (Array.isArray(resp.output) && resp.output.map(o => o.content?.map(c => c.text || c).join(" ")).join("\n"));
        parsedData = JSON.parse(outText);
      } else {
        throw new Error("OpenAI client does not expose chat.completions.create or responses.create");
      }
    } catch (aiError) {
      console.error("[ai] OpenAI call failed, falling back to minimal parse:", aiError && aiError.message ? aiError.message : aiError);
      // Fallback: create a minimal resume using the raw resume text so upload still succeeds
      parsedData = {
        proffessional_summary: resumeText.slice(0, 1000),
        skills: [],
        personal_info: { full_name: "", profession: "", email: "", phone: "", location: "", linkedin: "", website: "" },
        experience: [],
        projects: [],
        education: [],
      };
    }

    const newResume = await Resume.create({ userId, title, ...parsedData });
    // return the newly created resume object so client can navigate to it
    res.status(201).json({ resume: newResume });
    // cleanup uploaded file if any
    if (uploadedFilePath) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (e) {
        /* ignore */
      }
    }
  } catch (error) {
    console.error("[ai] uploadResume error:", error);
    return res.status(400).json({ message: error.message });
  }
};
