import React from "react";
import { 
  Home, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  Info, 
  Sun, 
  Moon, 
  Type,
  Layout
} from "lucide-react";
import { useAccessibility } from "../hooks/useAccessibility";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? "bg-[#2a4a7d] text-white font-medium border-l-4 border-amber-400" 
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function Sidebar({ activeView, onViewChange }: { activeView: string, onViewChange: (view: string) => void }) {
  const { highContrast, toggleHighContrast, setFontScale, fontScale } = useAccessibility();

  return (
    <div className="h-screen w-64 bg-brand-navy text-white flex flex-col border-r border-white/10">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded-md flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-navy" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">CivicGuide</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <NavItem 
            icon={<Home size={20} className={activeView === 'overview' ? "" : "opacity-70"} />} 
            label="Overview" 
            active={activeView === 'overview'} 
            onClick={() => onViewChange('overview')}
          />
          <NavItem 
            icon={<MapPin size={20} className={activeView === 'journey' ? "" : "opacity-70"} />} 
            label="Voter Journey" 
            active={activeView === 'journey'} 
            onClick={() => onViewChange('journey')}
          />
          <NavItem 
            icon={<MessageCircle size={20} className={activeView === 'assistant' ? "" : "opacity-70"} />} 
            label="Civic Assistant" 
            active={activeView === 'assistant'} 
            onClick={() => onViewChange('assistant')}
          />
          <NavItem 
            icon={<Info size={20} className={activeView === 'terms' ? "" : "opacity-70"} />} 
            label="Governance Terms" 
            active={activeView === 'terms'} 
            onClick={() => onViewChange('terms')}
          />
        </nav>
      </div>

      <div className="p-6 bg-brand-navy-dark mt-auto space-y-4">
        <button 
          onClick={toggleHighContrast}
          className="w-full flex items-center justify-center gap-2 bg-white text-brand-navy font-bold py-2 px-4 rounded shadow-sm hover:bg-slate-100 uppercase text-xs transition-colors"
        >
          {highContrast ? <Sun size={14} /> : <Moon size={14} />}
          High Contrast Mode
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setFontScale(1)}
            className={`flex-1 p-2 text-xs font-bold rounded border ${fontScale === 1 ? 'bg-white/20 border-white' : 'bg-transparent border-white/20 text-white/60'}`}
          >
            A
          </button>
          <button 
            onClick={() => setFontScale(1.25)}
            className={`flex-1 p-2 text-sm font-bold rounded border ${fontScale === 1.25 ? 'bg-white/20 border-white' : 'bg-transparent border-white/20 text-white/60'}`}
          >
            A+
          </button>
          <button 
            onClick={() => setFontScale(1.5)}
            className={`flex-1 p-2 text-base font-bold rounded border ${fontScale === 1.5 ? 'bg-white/20 border-white' : 'bg-transparent border-white/20 text-white/60'}`}
          >
            A++
          </button>
        </div>
      </div>
    </div>
  );
}
