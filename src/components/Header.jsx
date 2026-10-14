import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import {
  Menu,
  Bell,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Header({
  setMobileOpen,
  alertCount = 4,
  onSimulateAlert,
  onRefresh,
  onLockTerminal
}) {
  const { shouldReduceMotion, neuButtonProps } = useAppMotion();
  const [time, setTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#E0E5EC] py-3 px-4 sm:px-6 lg:px-8 select-none">
      <div className="bg-[#E0E5EC] rounded-3xl p-3 sm:p-4 shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Platform Title */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            onClick={() => setMobileOpen(true)}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            className="lg:hidden p-2.5 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-[#1A253C] focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-[#1A253C] flex items-center gap-2 truncate">
              <span>AI Social Media Threat Monitoring System</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-blue-700 bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                SKIT004
              </span>
            </h1>
            <span className="text-[11px] text-[#52607B] font-mono hidden md:block">
              Perimeter Telemetry &bull; Strict Soft UI &bull; Neural Node: active
            </span>
          </div>
        </div>

        {/* Center: Inset Search Bar */}
        <div className="relative hidden md:block flex-1 max-w-xs">
          <label htmlFor="header-search-input" className="sr-only">
            Search Threat Indicators, Handles, or CVEs
          </label>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52607B] pointer-events-none" />
          <input
            id="header-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats, IOCs, #hashtags..."
            className="w-full bg-[#E0E5EC] text-xs font-mono text-[#1A253C] pl-10 pr-4 py-2.5 rounded-2xl shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] placeholder:text-[#52607B] focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Right Controls: Refresh, Simulation, UTC Clock (spaced for floating a11y panel) */}
        <div className="flex items-center gap-2.5 shrink-0 pr-0 lg:pr-40">
          {/* Simulated Inbound Spike Button with whileHover/whileTap */}
          {onSimulateAlert && (
            <motion.button
              onClick={onSimulateAlert}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF' }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98, boxShadow: 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF' }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 25 }}
              aria-label="Simulate Inbound Threat Spike"
              title="Simulate Inbound Threat Spike"
              className="px-3.5 py-2 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-xs font-mono font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate Spike</span>
            </motion.button>
          )}

          {/* Refresh Telemetry Button with whileHover/whileTap */}
          <motion.button
            onClick={handleManualRefresh}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF' }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95, boxShadow: 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF' }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 25 }}
            aria-label="Refresh telemetry data"
            title="Refresh Telemetry"
            className="p-2.5 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-[#52607B] hover:text-[#1A253C] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </motion.button>

          {/* Live UTC Clock */}
          <div className="hidden xl:flex items-center px-3 py-2 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] text-[11px] font-mono font-bold text-[#1A253C]">
            {time || 'SYNCING...'}
          </div>
        </div>
      </div>
    </header>
  );
}
