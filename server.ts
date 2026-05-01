import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ELECTION_DATA_2026 } from "./src/data/election_data";

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
- TN: 85.15% turnout. Leaders: Stalin (DMK), EPS (AIADMK), Vijay (TVK), Annamalai (BJP).
- WB: 92.9% turnout. Leaders: Mamata (AITC), Suvendu (BJP).
- KERALA: 73.9%. Leaders: Vijayan (CPI-M).
- ASSAM: 84%. Leaders: Himanta Sarma (BJP).`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = (process.env.GEMINI_API_KEY || "").trim();

      if (!apiKey || apiKey === "") {
        return res.status(500).json({ 
          error: "MISSING_API_KEY", 
          message: "API Key is missing in local server environment." 
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: SYSTEM_PROMPT
        }
      });
      
      const text = response.text;

      if (!text) return res.status(500).json({ error: "AI_EMPTY", message: "AI returned empty text." });

      return res.json({ text });
    } catch (error: any) {
      console.error("Local Server API Error:", error);
      return res.status(500).json({ 
        error: "AI_ERROR",
        message: error.message || "Failed to process AI request locally"
      });
    }
  });

  // API Routes (Optional, can be used for extra data)
  app.get("/api/election-data", (req, res) => {
    res.json({ message: "Election data is now bundled in the client." });
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
