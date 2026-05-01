import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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
- TN: 85.15% turnout (Highest ever). Key: MK Stalin (DMK), Edappadi Palaniswami (AIADMK), Thalapathy Vijay (TVK), K Annamalai (BJP).
- WB: 92.9% turnout (Overall record). Key: Mamata Banerjee (AITC), Suvendu Adhikari (BJP).
- KERALA: 73.9%. Key: Pinarayi Vijayan (CPI-M).
- ASSAM: 84%. Key: Himanta Biswa Sarma (BJP).

NEUTRALITY: No predictions. Strictly non-partisan. Voice removal: no conversational filler like "Happy to help". Direct facts only.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API Key is not configured on the server." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const dataPath = path.join(process.cwd(), "src/data/national_election_2026.json");
      const electionData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${SYSTEM_PROMPT}\n\nTODAY'S DATE: April 30, 2026\nCONTEXT DATA: ${JSON.stringify(electionData)}\n\nUSER QUESTION: ${message}` }]
          }
        ]
      });

      res.json({ text: result.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to fetch AI response." });
    }
  });

  // API Routes
  app.get("/api/election-data", (req, res) => {
    const dataPath = path.join(process.cwd(), "src/data/election_data.json");
    if (!fs.existsSync(dataPath)) return res.json({});
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    res.json(data);
  });

  app.get("/api/election-schedule-2026", (req, res) => {
    const dataPath = path.join(process.cwd(), "src/data/national_election_2026.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    res.json(data);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicGuide Server running on http://localhost:${PORT}`);
  });
}

startServer();
