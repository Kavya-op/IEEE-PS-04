import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import {
  Menu,
  Bell,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Sun
} from 'lucide-react';

export default function Header({
  setMobileOpen,
  alertCount = 4,
  onSimulateAlert,
  onRefresh,
  onLockTerminal
}) {
  const { shouldReduceMotion, neuButtonProps } = useAppMotion();
  const { activeIngressRate, lastIngestedAt, liveThreats } = useOSINT();
  const [time, setTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Platform Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-gray-900 flex items-center gap-2 truncate">
              <span>AI Social Media Threat Monitoring System</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gray-600 bg-gray-100 border border-gray-200">
                SKIT004
              </span>
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono hidden md:flex">
              <span>Ingress: <strong className="text-emerald-700">{activeIngressRate}</strong></span>
              <span>&bull;</span>
              <span>Synced: <strong className="text-gray-900">{lastIngestedAt}</strong></span>
              <span>&bull;</span>
              <span className="text-blue-600 font-bold">Verified Source: r/cybersecurity (Reddit Native API)</span>
              <a
                href={liveThreats[0]?.link || "https://www.reddit.com/r/cybersecurity"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-bold"
              >
                [View Original Reddit Post ↗]
              </a>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="relative hidden md:block flex-1 max-w-xs">
          <label htmlFor="header-search-input" className="sr-only">
            Search Threat Indicators, Handles, or CVEs
          </label>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="header-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats, IOCs, #hashtags..."
            className="w-full bg-white border border-gray-300 text-xs font-mono text-gray-900 pl-9 pr-3 py-1.5 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Right Controls: Refresh, Simulation, UTC Clock */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Simulated Inbound Spike Button */}
          {onSimulateAlert && (
            <button
              onClick={onSimulateAlert}
              aria-label="Simulate Inbound Threat Spike"
              title="Simulate Inbound Threat Spike"
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm text-xs font-mono font-bold text-rose-600 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate Spike</span>
            </button>
          )}

          {/* Refresh Telemetry Button */}
          <button
            onClick={handleManualRefresh}
            aria-label="Refresh telemetry data"
            title="Refresh Telemetry"
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm text-gray-600 hover:text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Dark Mode Theme Toggle Button */}
          <button
            onClick={handleToggleTheme}
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={isDark ? 'Dark Theme: Active' : 'Light Theme: Active'}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm text-gray-600 hover:text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center transition-colors"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Live UTC Clock */}
          <div className="hidden xl:flex items-center px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[11px] font-mono font-bold text-gray-700">
            {time || 'SYNCING...'}
          </div>
        </div>
      </div>
    </header>
  );
}
