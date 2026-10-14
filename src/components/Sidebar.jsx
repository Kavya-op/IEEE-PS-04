import React from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import {
  ShieldAlert,
  Flame,
  SlidersHorizontal,
  Compass,
  Plus,
  Shield,
  Activity,
  Lock,
  X,
  Radio,
  FileSearch,
  Scan
} from 'lucide-react';

export default function Sidebar({
  activeTab = 'Radar',
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  alertCount = 4,
  onLockTerminal,
  onRunManualAnalysis
}) {
  const { shouldReduceMotion } = useAppMotion();

  const navItems = [
    {
      id: 'Radar',
      alias: 'Overview',
      label: 'Threat Radar',
      icon: Compass,
      badge: null
    },
    {
      id: 'Alerts',
      alias: 'Live Alerts',
      label: 'Alert Feed',
      icon: ShieldAlert,
      badge: alertCount > 0 ? alertCount : null
    },
    {
      id: 'TargetedSweep',
      alias: 'Targeted Sweep',
      label: 'Targeted Sweep',
      icon: Scan,
      badge: 'Gov'
    },
    {
      id: 'Misinformation',
      alias: 'Threat Analytics',
      label: 'Analytics & IOCs',
      icon: Flame,
      badge: 'Live'
    },
    {
      id: 'Settings',
      alias: 'Settings',
      label: 'System Config',
      icon: SlidersHorizontal,
      badge: null
    }
  ];

  const isItemActive = (item) => {
    return activeTab === item.id || activeTab === item.alias;
  };

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none">
      {/* Top: Logo & System Identity */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E0E5EC] shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center text-blue-600 shrink-0">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-mono font-bold tracking-wider text-blue-600 uppercase">
              SKIT004
            </div>
            <div className="text-sm font-extrabold text-[#1A253C] tracking-tight truncate">
              Threat Monitor
            </div>
          </div>
        </div>

        {/* Center: Navigation with Inset Active States */}
        <nav className="space-y-3" aria-label="Main System Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                aria-current={active ? 'page' : undefined}
                whileHover={active || shouldReduceMotion ? {} : { scale: 1.02, boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF' }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98, boxShadow: 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF' }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 25 }}
                className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between text-xs font-mono font-bold cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                  active
                    ? 'bg-[#E0E5EC] shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] text-blue-600'
                    : 'bg-[#E0E5EC] shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] text-[#52607B] hover:text-[#1A253C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600 stroke-[2.5]' : 'text-[#52607B]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] ${
                      item.badge === 'Live'
                        ? 'text-emerald-700 bg-emerald-100/60'
                        : 'text-rose-700 bg-rose-100/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Prominent Blue Outset Button & Lock Terminal */}
      <div className="space-y-4 pt-6 border-t border-[#A3B1C6]/30">
        {/* Prominent Blue Outset Button with whileHover/whileTap */}
        <motion.button
          onClick={() => {
            if (onRunManualAnalysis) {
              onRunManualAnalysis();
            } else {
              setActiveTab('Alerts');
            }
          }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.02, boxShadow: '10px 10px 22px rgba(37,99,235,0.45), -8px -8px 18px #FFFFFF' }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98, boxShadow: 'inset 4px 4px 10px #1E3A8A' }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 25 }}
          aria-label="Run Manual Threat Analysis"
          className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[6px_6px_14px_#93A1B6,-6px_-6px_14px_#FFFFFF] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Run Manual Analysis</span>
        </motion.button>

        {/* Lock Terminal / Security Status Indicator */}
        <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-[#52607B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="font-semibold text-[#1A253C]">Grid Nominal</span>
          </div>
          {onLockTerminal && (
            <motion.button
              onClick={onLockTerminal}
              whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
              aria-label="Lock terminal and secure session"
              title="Lock Terminal"
              className="p-2 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#A3B1C6] text-[#52607B] hover:text-rose-600 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              <Lock className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Neumorphic Sidebar */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden lg:block fixed left-5 top-5 bottom-5 w-64 bg-[#E0E5EC] rounded-3xl shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] z-40 overflow-hidden"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative m-4 w-72 bg-[#E0E5EC] rounded-3xl shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] z-50 flex flex-col overflow-hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-[#1A253C] focus:outline-none focus:ring-4 focus:ring-blue-400"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
