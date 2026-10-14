import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import {
  Search,
  Scan,
  FileText,
  Image as ImageIcon,
  Video,
  Zap,
  Sparkles
} from 'lucide-react';

export default function FintechThreatSearch({ onInitiateDeepSweep, onNavigateToSweep }) {
  const { shouldReduceMotion } = useAppMotion();
  const { totalScannedPosts, activeIngressRate, severeRisksCount } = useOSINT();

  const [query, setQuery] = useState('Critical Infrastructure SCADA');
  const [selectedMediaTypes, setSelectedMediaTypes] = useState(['text', 'images', 'videos']);

  const quickPresets = [
    { label: '⚡ SCADA Grid Anomaly', query: 'SCADA municipal grid command injection malware' },
    { label: '🔑 Corporate SSO Dump', query: 'Corporate SSO credential dump combo list 850k' },
    { label: '🗳️ Foreign Disinfo Swarm', query: 'Voting infrastructure ballot machine malware hoax' },
    { label: '🪱 Zero-Day VPN Exploit', query: 'Unpatched enterprise VPN zero-day RCE PoC' },
    { label: '💧 Water Treatment Infil', query: 'Water supply chemical dosing SCADA exploit leak' }
  ];

  const toggleMedia = (type) => {
    setSelectedMediaTypes((prev) =>
      prev.includes(type) ? (prev.length > 1 ? prev.filter((t) => t !== type) : prev) : [...prev, type]
    );
  };

  const handleSweepClick = () => {
    if (onInitiateDeepSweep) {
      onInitiateDeepSweep(query, selectedMediaTypes);
    } else if (onNavigateToSweep) {
      onNavigateToSweep(query);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#151E32] rounded-2xl p-5 border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 overflow-hidden">
      {/* Global Threat Interrogator Banner Header */}
      <div className="flex flex-col gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0">
            <Scan className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono font-black text-slate-800 dark:text-white uppercase tracking-wider truncate">
                GLOBAL THREAT INTERROGATOR
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shrink-0">
                ACTIVE SURVEILLANCE
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
              On-Demand Keyword, Media & IOC Deep Sweep
            </div>
          </div>
        </div>

        {/* Volume & Cadence Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono text-slate-600 dark:text-slate-300">
          <div className="truncate">
            <span className="text-slate-400 block truncate">Scanned</span>
            <span className="font-black text-slate-900 dark:text-white text-xs truncate">{totalScannedPosts}</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-700 pl-2 truncate">
            <span className="text-slate-400 block truncate">Velocity</span>
            <span className="font-black text-emerald-600 text-xs truncate">{activeIngressRate}</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-700 pl-2 truncate">
            <span className="text-slate-400 block truncate">Severe</span>
            <span className="font-black text-rose-600 text-xs truncate">{severeRisksCount} IOCs</span>
          </div>
        </div>
      </div>

      {/* Main Search Query Bar */}
      <div className="space-y-3 w-full">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSweepClick();
            }}
            placeholder="Keywords, Hashtags, or Phrases..."
            aria-label="Keywords, Hashtags, or Target Phrases"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-[#1A253C] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Instant Action Button: [+ Initiate Deep Sweep] (w-full, truncate / whitespace-normal) */}
        <motion.button
          onClick={handleSweepClick}
          whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate whitespace-normal">+ Initiate Deep Sweep</span>
        </motion.button>
      </div>

      {/* Media Type Toggles Row */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
          Target Media Channels:
        </span>
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
          <button
            onClick={() => toggleMedia('text')}
            className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border truncate ${
              selectedMediaTypes.includes('text')
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate">Text</span>
          </button>

          <button
            onClick={() => toggleMedia('images')}
            className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border truncate ${
              selectedMediaTypes.includes('images')
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="w-3 h-3 shrink-0" />
            <span className="truncate">Memes</span>
          </button>

          <button
            onClick={() => toggleMedia('videos')}
            className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border truncate ${
              selectedMediaTypes.includes('videos')
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <Video className="w-3 h-3 shrink-0" />
            <span className="truncate">Reels</span>
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Quick Presets:</span>
        <div className="flex flex-wrap gap-1">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(preset.query)}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer truncate max-w-full"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
