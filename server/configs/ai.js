import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
const baseURL = process.env.BASE_URL || undefined;

if (!apiKey) {
  console.warn('[ai] Warning: no OpenAI API key found in OPENAI_API_KEY or OPEN_API_KEY');
}

const ai = baseURL ? new OpenAI({ apiKey, baseURL }) : new OpenAI({ apiKey });

console.log('[ai] OpenAI client configured', { hasApiKey: !!apiKey, usingBaseURL: !!baseURL });

export default ai;