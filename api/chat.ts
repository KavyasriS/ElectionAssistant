import { GoogleGenerativeAI } from "@google/genai";
import { ELECTION_DATA_2026 } from "../src/data/election_data";

const SYSTEM_PROMPT = `You are the Chief Digital Election Officer (CDEO). 
Mission: Provide authoritative 2026 Assembly Election stats and civic guidance. 

CURRENT DATE: April 30, 2026.
STATUS: Polling 100% complete. Counting Day: May 4, 2026 (4 days left).

STRICT RESPONSE ARCHITECTURE (ORACLE FRAMEWORK) - YOU MUST USE THIS STRUCTURE FOR EVERY SINGLE RESPONSE:

1. [DIRECT ANSWER]: Provide the immediate factual answer. Use bullet points for stats or candidate names. Keep it extremely short.
2. [2026 STATUS UPDATE]: State one sentence confirming polling is complete and results are on May 4.
3. [DEEP DIVE]: Provide exactly one "Did You Know?" fact about Indian elections (e.g. VVPAT, NOTA, Article 324, Sections 49P/49E).
4. [VERIFIED SOURCE]: "Grounded in ECI April 30, 2026 Official Bulletins."

CORE CONTEXT (FINAL FIGURES):
- TN: 85.15% turnout. Leaders: Stalin (DMK), EPS (AIADMK), Vijay (TVK), Annamalai (BJP).
- WB: 92.9% turnout. Leaders: Mamata (AITC), Suvendu (BJP).
- KERALA: 73.9%. Leaders: Vijayan (CPI-M).
- ASSAM: 84%. Leaders: Himanta Sarma (BJP).`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: "MISSING_API_KEY: Gemini API Key is not configured on the server. Please check Environment Variables."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${SYSTEM_PROMPT}\n\nTODAY'S DATE: April 30, 2026\nCONTEXT DATA: ${JSON.stringify(ELECTION_DATA_2026)}\n\nUSER QUESTION: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("AI returned an empty or invalid response.");
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini Lambda Error:", error);
    return res.status(500).json({ 
      error: `GEMINI_LAMBDA_ERROR: ${error.message || "Unknown error"}`,
      details: error.toString()
    });
  }
}
