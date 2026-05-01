import { GoogleGenerativeAI } from "@google/generative-ai";

const ELECTION_DATA_2026 = {
  "WB": "West Bengal: 92.9% turnout, results May 4.",
  "TN": "Tamil Nadu: 85.15% turnout, results May 4.",
  "Kerala": "Kerala: 73.9% turnout, results May 4.",
  "Assam": "Assam: 84% turnout, results May 4."
};

const SYSTEM_PROMPT = `You are the Chief Digital Election Officer. Mission: Provide 2026 election stats. 
Date: April 30, 2026. Counting Day: May 4.
Structure: 
1. [DIRECT ANSWER]
2. [2026 STATUS]
3. [DID YOU KNOW]
4. [SOURCE]: ECI Official Bulletins.`;

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey || apiKey === "undefined") {
    return res.status(500).json({ 
      error: "SERVER_CONFIG_ERROR", 
      message: "GEMINI_API_KEY is missing from Vercel environment variables." 
    });
  }

  try {
    const { message } = req.body;
    if (!message) throw new Error("MESSAGE_REQUIRED: No message provided in request body.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${SYSTEM_PROMPT}\n\nUSER QUESTION: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("EMPTY_RESPONSE: AI returned no content.");

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Vercel Gemini Error:", error);
    return res.status(500).json({ 
      error: "AI_SERVICE_FAILURE",
      message: error.message || "An unknown error occurred during AI processing."
    });
  }
}
