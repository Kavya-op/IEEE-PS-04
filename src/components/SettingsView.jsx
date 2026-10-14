import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import {
  Sliders,
  Shield,
  Cpu,
  Save,
  CheckCircle,
  Database,
  Moon,
  Sun
} from 'lucide-react';

export default function SettingsView() {
  const { neuButtonProps } = useAppMotion();
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [bgpScrubbing, setBgpScrubbing] = useState(true);
  const [honeypotRedirect, setHoneypotRedirect] = useState(false);
  const [neuralSensitivity, setNeuralSensitivity] = useState('aggressive');
  const [confidenceThreshold, setConfidenceThreshold] = useState(92);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleThemeEvent = (e) => {
      if (typeof e.detail?.darkMode === 'boolean') {
        setIsDark(e.detail.darkMode);
      }
    };
    window.addEventListener('themechange', handleThemeEvent);
    return () => window.removeEventListener('themechange', handleThemeEvent);
  }, []);

  const handleToggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    if (next) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { darkMode: next } }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1A253C] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#2563EB]" />
            Security Architecture & AI Engine Configuration
          </h2>
          <p className="text-xs text-[#52607B] mt-1">
            Configure autonomous containment parameters, neural heuristics, and SIEM pipeline integrations.
          </p>
        </div>

        <motion.button
          {...neuButtonProps}
          onClick={handleSave}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#E0E5EC] text-[#2563EB] shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center space-x-2 transition-colors self-start sm:self-auto cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Config Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Ruleset</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Interface Appearance & Theme Mode */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#A3B1C6]/30">
          <Moon className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-bold text-[#1A253C]">Interface Appearance & Theme</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="pr-4">
            <div className="text-xs font-bold text-[#1A253C] flex items-center gap-2">
              <span>{isDark ? 'Dark Theme (Cyber Neumorphism)' : 'Light Theme (Soft Grey-Blue UI)'}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shadow-[inset_1px_1px_2px_#A3B1C6,inset_-1px_-1px_2px_#FFFFFF] ${
                isDark ? 'text-blue-400 bg-blue-950/40' : 'text-amber-700 bg-amber-100/60'
              }`}>
                {isDark ? 'ACTIVE DARK' : 'ACTIVE LIGHT'}
              </span>
            </div>
            <div className="text-[11px] text-[#52607B] mt-0.5">
              Toggle between deep Cyber Navy (#0F1422) and Soft Grey-Blue (#E0E5EC) Neumorphic aesthetic.
            </div>
          </div>
          <button
            onClick={handleToggleTheme}
            aria-label="Toggle Dark Mode Theme"
            className={`w-14 h-7 rounded-full transition-all relative shrink-0 p-0.5 cursor-pointer shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] focus:outline-none focus:ring-4 focus:ring-blue-400 ${
              isDark ? 'bg-blue-600' : 'bg-[#E0E5EC]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center bg-[#E0E5EC] shadow-[2px_2px_4px_rgba(0,0,0,0.3)] transition-transform ${
                isDark ? 'translate-x-7 bg-white text-blue-900' : 'translate-x-0 text-amber-600'
              }`}
            >
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>
      </div>

      {/* Autonomous Containment Policies */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#A3B1C6]/30">
          <Shield className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-bold text-[#1A253C]">Autonomous Containment Policies</h3>
        </div>

        <div className="divide-y divide-[#A3B1C6]/30">
          {/* Option 1 */}
          <div className="py-4 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-[#1A253C]">
                Auto-Quarantine Compromised Endpoints
              </div>
              <div className="text-[11px] text-[#52607B] mt-0.5">
                Instantly disconnect Kubernetes pods or VMs when zero-day code execution is detected.
              </div>
            </div>
            <button
              onClick={() => setAutoQuarantine(!autoQuarantine)}
              className={`w-12 h-6 rounded-full transition-all relative shrink-0 p-0.5 cursor-pointer shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                autoQuarantine ? 'bg-blue-600' : 'bg-[#E0E5EC]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#E0E5EC] shadow-[2px_2px_4px_rgba(0,0,0,0.2)] transition-transform ${
                  autoQuarantine ? 'translate-x-6 bg-white' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Option 2 */}
          <div className="py-4 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-[#1A253C]">
                Autonomous BGP Anycast DDoS Scrubbing
              </div>
              <div className="text-[11px] text-[#52607B] mt-0.5">
                Reroute volumetric traffic exceeding 100 Gbps to regional neural scrubbers.
              </div>
            </div>
            <button
              onClick={() => setBgpScrubbing(!bgpScrubbing)}
              className={`w-12 h-6 rounded-full transition-all relative shrink-0 p-0.5 cursor-pointer shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                bgpScrubbing ? 'bg-blue-600' : 'bg-[#E0E5EC]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#E0E5EC] shadow-[2px_2px_4px_rgba(0,0,0,0.2)] transition-transform ${
                  bgpScrubbing ? 'translate-x-6 bg-white' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Option 3 */}
          <div className="py-4 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-[#1A253C]">
                Deceptive Honeypot Redirection
              </div>
              <div className="text-[11px] text-[#52607B] mt-0.5">
                Silently siphon malicious actors to synthetic deception environments to collect telemetry.
              </div>
            </div>
            <button
              onClick={() => setHoneypotRedirect(!honeypotRedirect)}
              className={`w-12 h-6 rounded-full transition-all relative shrink-0 p-0.5 cursor-pointer shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                honeypotRedirect ? 'bg-blue-600' : 'bg-[#E0E5EC]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#E0E5EC] shadow-[2px_2px_4px_rgba(0,0,0,0.2)] transition-transform ${
                  honeypotRedirect ? 'translate-x-6 bg-white' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* AI Threat Model Tuning */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#A3B1C6]/30">
          <Cpu className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-bold text-[#1A253C]">Neural Threat Engine Tuning</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-[#1A253C] block mb-2">
              Anomaly Sensitivity Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['conservative', 'balanced', 'aggressive'].map((mode) => (
                <motion.button
                  key={mode}
                  {...neuButtonProps}
                  onClick={() => setNeuralSensitivity(mode)}
                  className={`py-2 px-3 rounded-2xl text-xs font-mono capitalize transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                    neuralSensitivity === mode
                      ? 'bg-[#E0E5EC] text-[#2563EB] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] font-bold'
                      : 'bg-[#E0E5EC] text-[#52607B] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:text-[#1A253C]'
                  }`}
                >
                  {mode}
                </motion.button>
              ))}
            </div>
            <p className="text-[11px] text-[#52607B] mt-2">
              Aggressive mode initiates defensive countermeasures at the earliest heuristic anomaly.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#1A253C]">
                Containment Confidence Threshold
              </label>
              <span className="text-xs font-mono font-bold text-[#2563EB]">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-[#E0E5EC] rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF] focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
            <div className="flex justify-between text-[10px] text-[#52607B] font-mono mt-1">
              <span>80% (Broad)</span>
              <span>90% (Standard)</span>
              <span>99% (Definitive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIEM & Integrations */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#A3B1C6]/30">
          <Database className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-bold text-[#1A253C]">External SIEM & Ingestion Feeds</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1A253C]">Splunk Cloud HEC</div>
              <div className="text-[10px] text-emerald-600 font-mono font-semibold">Connected &bull; 1.2k eps</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1A253C]">Elastic Security</div>
              <div className="text-[10px] text-emerald-600 font-mono font-semibold">Connected &bull; 850 eps</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1A253C]">Microsoft Sentinel</div>
              <div className="text-[10px] text-[#52607B] font-mono">Standby &bull; 0 eps</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#A3B1C6]" />
          </div>
        </div>
      </div>
    </div>
  );
}
