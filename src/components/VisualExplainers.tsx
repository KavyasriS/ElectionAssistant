import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, HelpCircle, Shield, Cpu, BookOpen, X, ExternalLink } from "lucide-react";

interface Term {
  title: string;
  description: string;
  detailedExplanation?: string;
  icon: React.ReactNode;
  tag: "Protocol" | "Essential" | "Technology" | "Governance" | "Law";
}

const terms: Term[] = [
  {
    title: "Model Code of Conduct",
    description: "Guidelines issued by the Election Commission for parties and candidates during elections regarding speeches, polling days, and election manifestos.",
    detailedExplanation: "The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India (ECI) for conduct and behavior of political parties and candidates during elections. The MCC comes into effect as soon as the ECI announces the election schedule. It ensures that the ruling party does not use its official position to benefit its election prospects. It covers guidelines for general conduct, meetings, processions, polling day behavior, and election manifestos.",
    icon: <Shield className="text-blue-500" />,
    tag: "Protocol"
  },
  {
    title: "Electoral Roll",
    description: "A comprehensive list of people eligible to vote in a specific constituency. Also known as the 'voters list'.",
    detailedExplanation: "An electoral roll is a list of persons who are eligible to vote in a particular constituency. Only individuals whose names are listed in the electoral roll are permitted to cast their votes. The roll is updated periodically (usually annually) to include new voters (those who turn 18) and remove those who have passed away or moved out of the constituency. Regular 'Summary Revisions' are held to keep these lists current.",
    icon: <BookOpen className="text-indigo-500" />,
    tag: "Essential"
  },
  {
    title: "VVPAT Unit",
    description: "The Voter Verifiable Paper Audit Trail allows you to see a slip for 7 seconds confirming your choice before it drops into a secure box.",
    detailedExplanation: "Voter Verifiable Paper Audit Trail (VVPAT) is an independent system attached with the Electronic Voting Machines that allows the voters to verify that their votes are cast as intended. When a vote is cast, a slip is printed on the VVPAT printer containing the serial number, name, and symbol of the candidate. This slip remains visible to the voter through a transparent window for 7 seconds, after which it is automatically cut and falls into the sealed drop box of the VVPAT.",
    icon: <Cpu className="text-orange-500" />,
    tag: "Technology"
  },
  {
    title: "Polling Constituency",
    description: "A specific geographical area defined for electing a representative. Every voter belongs to exactly one constituency.",
    detailedExplanation: "A constituency is a territorial area from which a single member (MLA for State Assembly or MP for Lok Sabha) is elected. The boundaries of constituencies are periodically redefined by a Delimitation Commission to ensure that each elected representative represents a roughly equal number of voters, accounting for population shifts.",
    icon: <Info className="text-green-500" />,
    tag: "Governance"
  },
  {
    title: "Qualifying Date",
    description: "The date (usually Jan 1st of the year) on which an individual must be 18+ to be eligible for that year's electoral roll.",
    detailedExplanation: "The qualifying date is the specific date with reference to which the age of an applicant seeking registration in the electoral roll is calculated. In India, there are now four qualifying dates (January 1st, April 1st, July 1st, and October 1st) in a calendar year. This allows citizens who turn 18 on any of these dates to apply for registration immediately rather than waiting for the next year.",
    icon: <HelpCircle className="text-purple-500" />,
    tag: "Law"
  }
];

export default function VisualExplainers() {
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-3 font-sans tracking-tight">Governance Knowledge Base</h1>
        <p className="text-slate-600">High-fidelity definitions grounded in official Election Commission guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {terms.map((term, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedTerm(term)}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col transition-all cursor-pointer hover:border-brand-navy/30"
          >
            <div className={`px-4 py-2 border-b flex items-center gap-2 ${
              term.tag === 'Technology' ? 'bg-blue-50 border-blue-100' :
              term.tag === 'Protocol' ? 'bg-amber-50 border-amber-100' :
              'bg-slate-50 border-slate-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                term.tag === 'Technology' ? 'bg-blue-500' :
                term.tag === 'Protocol' ? 'bg-amber-500' :
                'bg-slate-400'
              }`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                term.tag === 'Technology' ? 'text-blue-800' :
                term.tag === 'Protocol' ? 'text-amber-800' :
                'text-slate-500'
              }`}>
                {term.tag}
              </span>
            </div>
            
            <div className="p-5 flex-1">
              <h3 className="font-bold text-slate-800 mb-2">{term.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {term.description}
              </p>
            </div>
            
            <div className="p-4 text-xs font-bold text-brand-navy border-t border-slate-100 hover:bg-slate-50 uppercase tracking-tight text-left flex items-center justify-between group">
              View Detailed Explanation
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                    {selectedTerm.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedTerm.title}</h2>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{selectedTerm.tag}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTerm(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed text-sm lg:text-base">
                    {selectedTerm.detailedExplanation || selectedTerm.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://eci.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-navy-dark transition-colors"
                  >
                    ECI Official Guidelines
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={() => setSelectedTerm(null)}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Close Definition
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="mt-16 bg-brand-navy-dark text-white rounded-xl p-8 flex items-center gap-8 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-bold mb-3">Accessibility Standards</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our platform adheres to strict WCAG 2.1 guidelines. Use the sidebar controls to adjust contrast and font scaling for an optimal viewing experience.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <Shield size={200} />
        </div>
      </div>
    </div>
  );
}
