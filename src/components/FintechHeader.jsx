import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import {
  Shield,
  Search,
  Bell,
  RefreshCw,
  Zap,
  Moon,
  Sun,
  ShieldCheck,
  Radio,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Terminal,
  Activity
} from 'lucide-react';

export default function FintechHeader({
  activeTab = 'Overview',
  setActiveTab,
  alertCount = 4,
  onSimulateAlert,
  onRefresh,
  onLockTerminal
}) {
  const { shouldReduceMotion } = useAppMotion();
  const { activeIngressRate, totalScannedPosts, lastIngestedAt, liveThreats } = useOSINT();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const navLinks = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Alerts', label: 'Threat Feed' },
    { id: 'BotSwarms', label: 'Bot Swarms' },
    { id: 'Misinformation', label: 'Analytics' },
    { id: 'TargetedSweep', label: 'Investigations' }
  ];

  const primaryRedditLink = liveThreats[0]?.link || 'https://www.reddit.com/r/cybersecurity';

  return (
    <header className="sticky top-0 z-40 w-full select-none shadow-md">
      {/* =========================================================================
          1. TOP SUB-HEADER / LIVE TICKER STRIP (Dark Cobalt Slim Bar)
          ========================================================================= */}
      <div className="bg-[#172554] text-white/90 text-[11px] font-mono py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between border-b border-blue-900/60 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>DEFCON 2 // MESH SURVEILLANCE ACTIVE</span>
          </span>
          <span className="text-blue-300/40">&bull;</span>
          <span>Scanned Posts: <strong className="text-white">{totalScannedPosts}</strong></span>
          <span className="text-blue-300/40">&bull;</span>
          <span>Live Ingress: <strong className="text-emerald-400">{activeIngressRate}</strong></span>
          <span className="text-blue-300/40">&bull;</span>
          <span className="text-blue-200">24h Ingress Active</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Source: Multi-Platform OSINT (X • Telegram • FB • Reddit)</span>
          </span>

          <a
            href={primaryRedditLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-white flex items-center gap-1 font-bold underline transition-colors"
            title="Open primary live threat intelligence stream"
          >
            <span>[View Stream ↗]</span>
          </a>

          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>24ms</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN NAVIGATION BAR (Solid Vibrant Cobalt Blue #2563EB)
          ========================================================================= */}
      <div className="bg-[#2563EB] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Clean Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Shield className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black tracking-tight leading-none text-white flex items-center gap-1.5">
              <span>ThreatRadar</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
                SKIT004
              </span>
            </div>
            <div className="text-[10px] font-mono text-blue-100/80 leading-tight mt-0.5 hidden sm:block">
              Government Cyber Defense Matrix
            </div>
          </div>
        </div>

        {/* Center: Clean Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id || (link.id === 'Overview' && activeTab === 'Radar');
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#2563EB] shadow-sm font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Quick Actions & Officer Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Rounded White/10 Search Input */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CVE, keyword, IOC..."
              aria-label="Search threat indicators"
              className="bg-white/10 text-white placeholder-white/70 border border-white/20 rounded-full pl-8 pr-4 py-1.5 text-xs w-44 lg:w-56 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-mono"
            />
          </div>

          {/* Simulate Threat Spike Trigger */}
          {onSimulateAlert && (
            <motion.button
              onClick={onSimulateAlert}
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              aria-label="Simulate Inbound Threat Spike"
              title="Simulate Inbound Threat Spike"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all border border-rose-400/40"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Simulate Spike</span>
            </motion.button>
          )}

          {/* Telemetry Refresh Button */}
          <motion.button
            onClick={handleManualRefresh}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Refresh live stream telemetry"
            title="Refresh Telemetry"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Dark Mode Theme Toggle */}
          <motion.button
            onClick={handleToggleTheme}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={isDark ? 'Dark Theme (Click for Light)' : 'Light Theme (Click for Dark)'}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all"
          >
            {isDark ? <Moon className="w-3.5 h-3.5 text-blue-200" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
          </motion.button>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('Alerts')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all"
              aria-label={`${alertCount} active alerts`}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {alertCount}
              </span>
            )}
          </div>

          {/* Officer Profile Badge */}
          <div
            onClick={onLockTerminal}
            title="Officer Vance // Clearance: Level 1 (Click to Lock Terminal)"
            className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/20 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white text-[#2563EB] font-bold text-xs flex items-center justify-center shadow-sm border border-white/40 font-mono">
              IV
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-white leading-tight">INV. VANCE</div>
              <div className="text-[10px] text-blue-200 font-mono leading-tight">TOP SECRET // SCI</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
