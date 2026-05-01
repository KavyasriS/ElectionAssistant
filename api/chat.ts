import { GoogleGenerativeAI } from "@google/generative-ai";

const ELECTION_DATA_2026 = {
  "election_cycle": "2026 Assembly Elections",
  "current_date": "2026-04-30",
  "states": {
    "WB": {
      "name": "West Bengal",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling for all phases successfully concluded on April 29. West Bengal recorded a massive 92.6% turnout in Phase 2, with an overall turnout of 92.9%. All EVMs are now sealed and stored in robust triple-layered security strongrooms.",
      "total_seats": 294,
      "ruling_party": "All India Trinamool Congress (AITC)",
      "current_2026_turnout_estimate": "92.9% (Final Overall)"
    },
    "TN": {
      "name": "Tamil Nadu",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling concluded with a historic 85.15% turnout. EVMs are secured in strongrooms with 24/7 CCTV.",
      "total_seats": 234,
      "ruling_party": "Dravida Munnetra Kazhagam (DMK)",
      "current_2026_turnout_estimate": "85.15% (Final)"
    },
    "Kerala": {
      "name": "Kerala",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling safely concluded with a final turnout of 73.9%. Electronic Voting Machines (EVMs) are sealed and stored in triple-layered security zones.",
      "total_seats": 140,
      "ruling_party": "Communist Party of India (Marxist) [LDF]",
      "current_2026_turnout_estimate": "73.9% (Final)"
    },
    "Assam": {
      "name": "Assam",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling concluded with a final turnout of 84%.",
      "total_seats": 126,
      "ruling_party": "Bharatiya Janata Party (BJP)",
      "current_2026_turnout_estimate": "84% (Final)"
    }
  }
};

const SYSTEM_PROMPT = `You are the Chief Digital Election Officer (CDEO). 
Mission: Provide authoritative 2026 Assembly Election stats and civic guidance. 

CURRENT DATE: April 30, 2026.
STATUS: Polling 100% complete. Counting Day: May 4, 2026 (4 days left).

STRICT RESPONSE ARCHITECTURE (ORACLE FRAMEWORK):
1. [DIRECT ANSWER]: Provide the factual answer. Keep it extremely short.
2. [2026 STATUS UPDATE]: State one sentence confirming polling is complete and results are on May 4.
3. [DEEP DIVE]: Provide exactly one "Did You Know?" fact about Indian elections.
4. [VERIFIED SOURCE]: "Grounded in ECI April 30, 2026 Official Bulletins."`;

export default async function (req: any, res: any) {
  // Check methodology
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined") {
    return res.status(500).json({ 
      error: "MISSING_API_KEY", 
      message: "The GEMINI_API_KEY environment variable is not set on the server." 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${SYSTEM_PROMPT}\n\nDATA: ${JSON.stringify(ELECTION_DATA_2026)}\n\nUSER: ${message}`;
    
    const result = await model.generateContent(prompt);
    const responseData = await result.response;
    const text = responseData.text();

    if (!text) {
      throw new Error("AI returned empty content");
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ 
      error: "AI_EXECUTION_ERROR",
      message: error.message || "Failed to process AI request",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}
