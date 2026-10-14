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
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0B2115] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0B2115]" />
            Security Architecture & AI Engine Configuration
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure autonomous containment parameters, neural heuristics, and SIEM pipeline integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] shadow-sm flex items-center space-x-2 transition-colors self-start sm:self-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-[#0B2115]" />
              <span>Config Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#0B2115]" />
              <span>Save Ruleset</span>
            </>
          )}
        </button>
      </div>

      {/* Interface Appearance & Theme Mode */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E7EB]">
          <Moon className="w-4 h-4 text-[#0B2115]" />
          <h3 className="text-sm font-bold text-[#0B2115]">Interface Appearance & Theme</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="pr-4">
            <div className="text-xs font-bold text-[#0B2115] flex items-center gap-2">
              <span>{isDark ? 'Dark Theme (Deep Slate)' : 'Light Theme (Minimalist SaaS)'}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isDark ? 'text-[#9FE846] bg-[#0B2115] border-[#153423]' : 'text-[#5C901A] bg-[#F3FAEB] border-[#9FE846]/40'
              }`}>
                {isDark ? 'ACTIVE DARK' : 'ACTIVE LIGHT'}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Toggle between Minimalist Light Dashboard and Dark Mode.
            </div>
          </div>
          <button
            onClick={handleToggleTheme}
            aria-label="Toggle Dark Mode Theme"
            className={`w-14 h-7 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0B2115] ${
              isDark ? 'bg-[#0B2115]' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm transition-transform ${
                isDark ? 'translate-x-7 text-[#0B2115]' : 'translate-x-0 text-amber-500'
              }`}
            >
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>
      </div>

      {/* Autonomous Containment Policies */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E7EB]">
          <Shield className="w-4 h-4 text-[#0B2115]" />
          <h3 className="text-sm font-bold text-[#0B2115]">Autonomous Containment Policies</h3>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {/* Option 1 */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-[#0B2115]">
                Auto-Quarantine Compromised Endpoints
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Instantly disconnect Kubernetes pods or VMs when zero-day code execution is detected.
              </div>
            </div>
            <button
              onClick={() => setAutoQuarantine(!autoQuarantine)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0B2115] ${
                autoQuarantine ? 'bg-[#0B2115]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  autoQuarantine ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Option 2 */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-[#0B2115]">
                Autonomous BGP Anycast DDoS Scrubbing
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Reroute volumetric traffic exceeding 100 Gbps to regional neural scrubbers.
              </div>
            </div>
            <button
              onClick={() => setBgpScrubbing(!bgpScrubbing)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0B2115] ${
                bgpScrubbing ? 'bg-[#0B2115]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  bgpScrubbing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Option 3 */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-[#0B2115]">
                Deceptive Honeypot Redirection
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Silently siphon malicious actors to synthetic deception environments to collect telemetry.
              </div>
            </div>
            <button
              onClick={() => setHoneypotRedirect(!honeypotRedirect)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0B2115] ${
                honeypotRedirect ? 'bg-[#0B2115]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  honeypotRedirect ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* AI Threat Model Tuning */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E7EB]">
          <Cpu className="w-4 h-4 text-[#0B2115]" />
          <h3 className="text-sm font-bold text-[#0B2115]">Neural Threat Engine Tuning</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-[#0B2115] block mb-2">
              Anomaly Sensitivity Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['conservative', 'balanced', 'aggressive'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setNeuralSensitivity(mode)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono capitalize transition-colors cursor-pointer border ${
                    neuralSensitivity === mode
                      ? 'bg-[#0B2115] text-[#9FE846] border-[#0B2115] font-semibold shadow-sm'
                      : 'bg-white text-gray-600 border-[#E5E7EB] hover:bg-[#F3FAEB] hover:text-[#5C901A]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Aggressive mode initiates defensive countermeasures at the earliest heuristic anomaly.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#0B2115]">
                Containment Confidence Threshold
              </label>
              <span className="text-xs font-mono font-bold text-[#0B2115]">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B2115] focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
              <span>80% (Broad)</span>
              <span>90% (Standard)</span>
              <span>99% (Definitive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIEM & Integrations */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E5E7EB]">
          <Database className="w-4 h-4 text-[#0B2115]" />
          <h3 className="text-sm font-bold text-[#0B2115]">External SIEM & Ingestion Feeds</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0B2115]">Splunk Cloud HEC</div>
              <div className="text-[10px] text-[#5C901A] font-mono font-semibold">Connected &bull; 1.2k eps</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#9FE846] shadow-sm" />
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0B2115]">Elastic Security</div>
              <div className="text-[10px] text-[#5C901A] font-mono font-semibold">Connected &bull; 850 eps</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#9FE846] shadow-sm" />
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0B2115]">Microsoft Sentinel</div>
              <div className="text-[10px] text-gray-500 font-mono">Standby &bull; 0 eps</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
