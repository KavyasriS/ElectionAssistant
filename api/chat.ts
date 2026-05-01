import { GoogleGenAI } from "@google/genai";

const ELECTION_DATA_2026 = {
  "WB": "West Bengal: 92.9% turnout, results May 4.",
  "TN": "Tamil Nadu: 85.15% turnout, results May 4.",
  "Kerala": "Kerala: 73.9% turnout, results May 4.",
  "Assam": "Assam: 84% turnout, results May 4."
};

const SYSTEM_PROMPT = `You are the Chief Digital Election Officer. Mission: Provide 2026 election stats. 
Date: April 30, 2026. Counting Day: May 4.
Data Context: ${JSON.stringify(ELECTION_DATA_2026)}

Structure: 
1. [DIRECT ANSWER]
2. [2026 STATUS]
3. [DID YOU KNOW]
4. [SOURCE]: ECI Official Bulletins.`;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return res.status(500).json({ 
      error: "SERVER_CONFIG_ERROR", 
      message: "GEMINI_API_KEY is missing from Vercel environment variables." 
    });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "VALIDATION_ERROR", message: "No message provided." });

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "AI_EMPTY", message: "The AI returned an empty response." });
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Vercel Gemini Error:", error);
    return res.status(500).json({ 
      error: "AI_SERVER_ERROR",
      message: error.message || "An unexpected error occurred during AI processing."
    });
  }
}
