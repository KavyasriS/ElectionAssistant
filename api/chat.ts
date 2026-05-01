import { GoogleGenAI } from "@google/genai";

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
      "counting_day": "2026-05-04",
      "total_seats": 294,
      "ruling_party": "All India Trinamool Congress (AITC)",
      "previous_turnout": "81.6%",
      "current_2026_turnout_estimate": "92.9% (Final Overall - Record High)",
      "key_candidates": [
        "Mamata Banerjee (AITC)",
        "Suvendu Adhikari (BJP)",
        "Meenakshi Mukherjee (CPI(M))"
      ]
    },
    "TN": {
      "name": "Tamil Nadu",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling concluded with a historic 85.15% turnout, the highest in the state's election history. EVMs are secured in strongrooms with 24/7 CCTV and paramilitary guard. Counting begins at 8 AM on May 4.",
      "counting_day": "2026-05-04",
      "total_seats": 234,
      "ruling_party": "Dravida Munnetra Kazhagam (DMK)",
      "previous_turnout": "72.8%",
      "current_2026_turnout_estimate": "85.15% (Final - Highest Ever)",
      "key_candidates": [
        "M.K. Stalin (DMK)",
        "Edappadi K. Palaniswami (AIADMK)",
        "K. Annamalai (BJP)",
        "S. Seeman (NTK)",
        "Thalapathy Vijay (TVK - Thamizhaga Vettri Kazhagam)"
      ]
    },
    "Kerala": {
      "name": "Kerala",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling safely concluded with a final turnout of 73.9%. Electronic Voting Machines (EVMs) are sealed and stored in triple-layered security zones.",
      "counting_day": "2026-05-04",
      "total_seats": 140,
      "ruling_party": "Communist Party of India (Marxist) [LDF]",
      "previous_turnout": "74.06%",
      "current_2026_turnout_estimate": "73.9% (Final)",
      "key_candidates": [
        "Pinarayi Vijayan (CPI(M))",
        "V.D. Satheesan (INC)",
        "K. Surendran (BJP)"
      ]
    },
    "Assam": {
      "name": "Assam",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Polling concluded with a final turnout of 84%. VVPAT slips will be verified as per EC random sampling protocols on counting day.",
      "counting_day": "2026-05-04",
      "total_seats": 126,
      "ruling_party": "Bharatiya Janata Party (BJP)",
      "previous_turnout": "82.04%",
      "current_2026_turnout_estimate": "84% (Final)",
      "key_candidates": [
        "Himanta Biswa Sarma (BJP)",
        "Gaurav Gogoi (INC)",
        "Badruddin Ajmal (AIUDF)"
      ]
    },
    "Puducherry": {
      "name": "Puducherry",
      "status": "Polling Completed",
      "next_milestone": "Counting of Votes",
      "date": "2026-05-04",
      "details": "Democratic exercise completed. Results will be declared on May 4.",
      "counting_day": "2026-05-04",
      "total_seats": 30,
      "ruling_party": "All India N.R. Congress (AINRC)",
      "previous_turnout": "81.64%"
    }
  }
};

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
    return res.status(500).json({ error: "MISSING_API_KEY: Gemini API Key is not configured on the server." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nTODAY'S DATE: April 30, 2026\nCONTEXT DATA: ${JSON.stringify(ELECTION_DATA_2026)}\n\nUSER QUESTION: ${message}` }]
        }
      ]
    });

    res.status(200).json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response from Gemini API." });
  }
}
