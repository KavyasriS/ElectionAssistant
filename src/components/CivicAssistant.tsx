import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { ELECTION_DATA_2026 } from "../data/election_data";

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        const statusText = response.statusText || "No status text";
        throw new Error(`SERVER_ERROR (${response.status} ${statusText}): The server returned an invalid response (likely an error page). This usually happens if the API route is missing or crashing. Please check your deployment logs.`);
      }

      if (!response.ok) {
        // Detailed error extraction
        const errorData = data || {};
        const errorMsg = errorData.message || errorData.error || `HTTP ${response.status}`;
        const errorCode = errorData.error || "CONNECTION_ERROR";
        
        throw new Error(`${errorCode}: ${errorMsg}`);
      }

      setMessages(prev => [...prev, { role: "bot", text: data.text }]);
    } catch (error: any) {
      console.error("Assistant Communication Error:", error);
      
      const displayError = error.message;

      setMessages(prev => [...prev, { 
        role: "bot", 
        text: `⚠️ CHAT ERROR\nStatus: ${displayError}\n\nPlease verify your Vercel environment variables and redeploy.` 
      }]);
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
