/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import VoterJourney from './components/VoterJourney';
import CivicAssistant from './components/CivicAssistant';
import VisualExplainers from './components/VisualExplainers';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Vote, Users, Info, Layout } from 'lucide-react';

function Overview() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Electoral Knowledge Platform</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Welcome to <span className="font-bold text-[#1a365d]">CivicGuide</span>. Your comprehensive resource for navigating the election process with confidence and clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col gap-4">
          <Vote className="text-blue-600" size={32} />
          <h3 className="font-bold text-blue-900">Empowered Voting</h3>
          <p className="text-sm text-blue-800/80">Every vote counts. Learn how to verify your registration and booth details efficiently.</p>
        </div>
        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col gap-4">
          <Users className="text-indigo-600" size={32} />
          <h3 className="font-bold text-indigo-900">Inclusion for All</h3>
          <p className="text-sm text-indigo-800/80">Accessibility is a right. We provide tools for elderly and first-time voters to understand the process.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
          <ShieldCheck className="text-slate-600" size={32} />
          <h3 className="font-bold text-slate-900">Safe & Secure</h3>
          <p className="text-sm text-slate-800/80">Understanding the security of EVMs and VVPATs builds trust in our democratic architecture.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Final Election Updates (April 30, 2026)</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl border-l-4 border-green-600">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">WB</div>
              <div>
                <h4 className="font-bold text-green-900">West Bengal Polling Concluded</h4>
                <p className="text-sm text-slate-600">All phases including Phase 2 (April 29) are complete. West Bengal recorded a historic overall turnout of 92.9%.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl border-l-4 border-brand-navy">
              <div className="w-12 h-12 bg-blue-50 text-brand-navy rounded-lg flex items-center justify-center font-bold">ALL</div>
              <div>
                <h4 className="font-bold text-brand-navy">Polling 100% Complete</h4>
                <p className="text-sm text-slate-600">Voting has ended across TN, Kerala, Assam, Puducherry and West Bengal. EVMs are under triple-layer security.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <Layout size={300} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'journey': return <VoterJourney />;
      case 'assistant': return <CivicAssistant />;
      case 'terms': return <VisualExplainers />;
      default: return <Overview />;
    }
  };

  const getBreadcrumbLabel = () => {
    switch (activeView) {
      case 'journey': return 'Election Process Roadmap';
      case 'assistant': return 'Civic AI Assistant';
      case 'terms': return 'Governance Knowledge Base';
      default: return 'Overview';
    }
  };

  return (
    <AccessibilityProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="hover:text-brand-navy cursor-pointer" onClick={() => setActiveView('overview')}>EC Digital Portal</span>
              <span>/</span>
              <span className="text-slate-900 font-semibold">{getBreadcrumbLabel()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">TODAY'S DATE</p>
                <p className="text-sm font-bold text-brand-navy leading-none">April 30, 2026</p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </AccessibilityProvider>
  );
}
