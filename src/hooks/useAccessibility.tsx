import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface AccessibilityContextType {
  highContrast: boolean;
  fontScale: number;
  toggleHighContrast: () => void;
  setFontScale: (scale: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  return (
    <AccessibilityContext.Provider value={{ highContrast, fontScale, toggleHighContrast, setFontScale }}>
      <div className={highContrast ? "bg-black text-white" : ""}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
}
