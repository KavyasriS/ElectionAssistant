import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Info } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";

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

export default function CivicAssistant() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { 
      role: "bot", 
      text: "Greetings. I am the Chief Digital Election Officer (CDEO). Today is April 30, 2026. Polling is now 100% COMPLETE across all regions. Final verified turnout figures are available. Counting Day is in 4 days (May 4). How can I assist you with final stats or civic processes?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Fetch knowledge base and 2026 schedule for context
      const [generalDataRes, scheduleDataRes] = await Promise.all([
        fetch("/api/election-data"),
        fetch("/api/election-schedule-2026")
      ]);
      
      const generalData = await generalDataRes.json();
      const scheduleData = await scheduleDataRes.json();
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const streamResponse = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `TODAY'S DATE: April 30, 2026\nCONTEXT DATA: ${JSON.stringify({ ...generalData, ...scheduleData })}\n\nUSER QUESTION: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.1,
        }
      });

      // Add an empty bot message to start streaming into
      setMessages(prev => [...prev, { role: "bot", text: "" }]);
      
      let fullText = "";
      for await (const chunk of streamResponse) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullText;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "bot", text: "I encountered an error. Please ensure your query is related to the election process." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      <div className="p-4 bg-brand-navy text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="font-bold text-sm tracking-wide text-white">CDEO ASSISTANT</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] font-black uppercase tracking-tighter text-blue-200">Counting Day</span>
            <span className="text-xs font-black text-white">4 DAYS TO GO</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase font-bold tracking-tight">FINAL VERIFIED FIGURES</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? "justify-end flex-row-reverse" : "justify-start"}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? "bg-slate-200" : "bg-brand-navy"
            }`}>
              {msg.role === 'user' ? (
                <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>
              )}
            </div>
            <div className={`max-w-[85%] p-3 rounded-lg shadow-sm text-xs leading-relaxed ${
              msg.role === 'user' 
                ? "bg-white text-slate-700 rounded-tl-none border border-slate-200 ml-2" 
                : "bg-brand-navy text-white rounded-tr-none mr-2"
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-brand-navy" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Processing...</span>
            </div>
          </div>
        )}
        <div className="p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-800 italic">
          "This response is grounded in the 'election_data.json' source file."
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about EVMs, Polling Booths..."
            className="w-full border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-xs focus:ring-2 focus:ring-brand-navy outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 p-1 text-brand-navy hover:scale-110 transition-transform disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
