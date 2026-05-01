import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserPlus, 
  Search, 
  Calendar, 
  Fingerprint, 
  CheckCircle2,
  Vote,
  ExternalLink,
  ChevronRight,
  X,
  ClipboardList,
  UserSearch
} from "lucide-react";
import { ELECTION_DATA_2026 } from "../data/election_data";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  link?: string;
  linkLabel?: string;
}

const steps: Step[] = [
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: "Registration",
    description: "Submit Form 6 to your Local Election Office or online. New voters must register to be included in the electoral roll.",
    color: "bg-brand-navy",
    link: "https://voters.eci.gov.in/",
    linkLabel: "Register Online (Form 6)"
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Verification",
    description: "Verify your name in the electoral roll and confirm your assigned polling station and booth number.",
    color: "bg-brand-navy-light",
    link: "https://electoralsearch.eci.gov.in/",
    linkLabel: "Search Electoral Roll"
  },
  {
    icon: <UserSearch className="w-8 h-8" />,
    title: "Know Candidates",
    description: "View candidate profiles, educational backgrounds, and affidavits on the official KYC portal before heading out.",
    color: "bg-brand-navy",
    link: "https://affidavit.eci.gov.in/",
    linkLabel: "KYC Portal (Candidate Search)"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Election Day",
    description: "Arrive at your assigned booth between 7 AM and 6 PM. Bring your EPIC card or valid alternative identity document.",
    color: "bg-brand-navy-light",
  },
  {
    icon: <Fingerprint className="w-8 h-8" />,
    title: "Identification",
    description: "The polling officer will verify your identity. Your left forefinger will be marked with indelible ink.",
    color: "bg-brand-navy",
  },
  {
    icon: <Vote className="w-8 h-8" />,
    title: "How to Vote",
    description: "Cast your vote on the EVM by pressing the blue button next to your candidate. Verify the VVPAT slip for 7 seconds.",
    color: "bg-brand-navy-light",
  },
  {
    icon: <ClipboardList className="w-8 h-8" />,
    title: "Booth Protocol",
    description: "1. Identify yourself. 2. Get inked. 3. Get ballot slip. 4. Cast vote on EVM. 5. Verify VVPAT.",
    color: "bg-brand-navy",
  }
];

const checklistItems = [
  "Verify your name in the Electoral Roll.",
  "Check your designated Polling Station and Booth.",
  "Ensure you have your EPIC card or an approved alternate ID.",
  "Confirm your qualifying age (18+ as of Jan 1, 2026).",
  "Familiarize yourself with your candidate list.",
  "Wear a mask and maintain social distancing at the booth."
];

export default function VoterJourney() {
  const [schedule] = useState<any>(ELECTION_DATA_2026);
  const [selectedState, setSelectedState] = useState<string>("");
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Roadmap Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm overflow-x-auto">
        <h2 className="text-xl font-bold text-brand-navy mb-10 tracking-tight">Interactive Election Roadmap</h2>
        
        <div className="relative min-w-[1100px] pb-4">
          {/* Connecting Line */}
          <div className="absolute top-5 left-20 right-20 h-0.5 bg-slate-100 z-0" />

          <div className="flex justify-between relative z-10 px-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center w-40 text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center shadow-md border-4 border-white transition-all group-hover:scale-110">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="mt-3 font-bold text-[10px] uppercase tracking-widest text-slate-800">
                  {step.title}
                </p>
                <div className="w-1 h-3 bg-brand-amber mx-auto mt-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* State-Specific Status Card */}
      <div className="bg-brand-navy-dark rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Check Your State Status</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Real-time synchronization with the 2026 Assembly Election cycle. Select your state to see upcoming milestones.
            </p>
            <div className="relative group">
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-200 p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-amber outline-none cursor-pointer transition-all hover:bg-slate-50 font-medium text-sm"
              >
                <option value="">Select your State...</option>
                {schedule && schedule.states && Object.entries(schedule.states).map(([code, details]: any) => (
                  <option key={code} value={code}>
                    {details.name}
                  </option>
                ))}
              </select>
            </div>
            {(!schedule || !schedule.states) && (
              <p className="text-[10px] text-red-400 mt-2">Error: Election database not reachable.</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedState && schedule?.states[selectedState] ? (
              <motion.div
                key={selectedState}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-brand-amber text-brand-navy text-[10px] font-bold rounded uppercase">
                    {schedule.states[selectedState].status}
                  </span>
                  <p className="text-slate-300 text-[10px] font-bold uppercase">Milestone</p>
                </div>
                <h4 className="text-xl font-bold mb-1">{schedule.states[selectedState].name}</h4>
                <p className="text-brand-amber font-bold text-lg mb-4">{schedule.states[selectedState].next_milestone}: {schedule.states[selectedState].date}</p>
                <p className="text-sm text-slate-200 leading-relaxed border-t border-white/10 pt-4">
                  {schedule.states[selectedState].details}
                </p>
              </motion.div>
            ) : (
              <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-400 text-xs uppercase tracking-widest">Select a state to view details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detailed Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`h-1.5 w-full ${step.color}`} />
            <div className="p-6 flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${step.color} text-white shadow-sm`}>
                  {step.icon}
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  0{index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {step.description}
              </p>
            </div>
            {step.link && (
              <a 
                href={step.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mx-6 mb-6 p-3 bg-brand-navy text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-navy-light transition-colors shadow-lg shadow-brand-navy/10"
              >
                {step.linkLabel}
                <ExternalLink size={14} />
              </a>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="p-8 bg-slate-100 rounded-2xl flex items-center justify-between border border-slate-200">
        <div className="flex items-center gap-4">
          <CheckCircle2 className="text-green-600 w-8 h-8" />
          <div>
            <h4 className="font-bold text-slate-900 leading-snug">Voter Verification Complete?</h4>
            <p className="text-xs text-slate-500">Ensure your EPIC details match your latest identity documents.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsChecklistOpen(true)}
          className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          View Protocol Checklist
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Protocol Checklist Modal */}
      <AnimatePresence>
        {isChecklistOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-brand-navy p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-tight">Protocol Checklist</h3>
                </div>
                <button 
                  onClick={() => setIsChecklistOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <p className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-widest">Election Day Preparedness</p>
                <div className="space-y-4">
                  {checklistItems.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-brand-navy/30 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-brand-navy shrink-0 flex items-center justify-center text-[10px] font-bold text-brand-navy">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setIsChecklistOpen(false)}
                  className="w-full mt-8 py-4 bg-brand-navy text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-navy-light transition-colors"
                >
                  Confirm Readiness
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

