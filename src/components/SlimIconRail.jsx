import React from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import {
  Compass,
  ShieldAlert,
  Bot,
  Scan,
  Flame,
  SlidersHorizontal,
  Lock,
  Radio,
  FileText,
  Activity,
  Layers
} from 'lucide-react';

export default function SlimIconRail({
  activeTab = 'Overview',
  setActiveTab,
  alertCount = 4,
  onLockTerminal
}) {
  const { shouldReduceMotion } = useAppMotion();

  const iconNavItems = [
    { id: 'Overview', alias: 'Radar', label: 'Threat Radar', icon: Compass },
    { id: 'Alerts', alias: 'Live Alerts', label: 'Threat Feed', icon: ShieldAlert, badge: alertCount },
    { id: 'BotSwarms', alias: 'Bot Swarms', label: 'Bot Swarms & Clusters', icon: Bot },
    { id: 'TargetedSweep', alias: 'Targeted Sweep', label: 'Investigations & Sweep', icon: Scan },
    { id: 'AnalyticsIOCs', alias: 'Analytics', to: '/analytics', path: '/analytics', label: 'Analytics & IOCs', icon: Flame },
    { id: 'Settings', alias: 'Settings', label: 'System Configuration', icon: SlidersHorizontal }
  ];

  const isItemActive = (item) => {
    if (activeTab === item.id || activeTab === item.alias) return true;
    if (item.id === 'AnalyticsIOCs') {
      return (
        activeTab === 'AnalyticsIOCs' ||
        activeTab === 'Analytics & IOCs' ||
        activeTab === 'Analytics' ||
        activeTab === 'Threat Analytics' ||
        activeTab === 'Misinformation' ||
        activeTab === '/analytics'
      );
    }
    return false;
  };

  return (
    <aside
      aria-label="Navigation Icon Rail"
      className="hidden md:flex flex-col items-center justify-between w-18 lg:w-20 bg-white dark:bg-[#151E32] border-r border-[#E5E9F2] dark:border-slate-800 py-5 shrink-0 z-20 select-none"
    >
      {/* Top Nav Icons */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {iconNavItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          return (
            <div key={item.id} className="relative group flex items-center justify-center">
              <motion.button
                onClick={() => setActiveTab(item.id)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />

                {item.badge && item.badge > 0 && !active && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </motion.button>

              {/* Tooltip on Hover */}
              <div className="absolute left-full ml-3.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-mono font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Controls: Lock Terminal & System Dot */}
      <div className="flex flex-col items-center space-y-3 pt-4 border-t border-[#E5E9F2] dark:border-slate-800 w-full">
        {onLockTerminal && (
          <div className="relative group flex items-center justify-center">
            <button
              onClick={onLockTerminal}
              aria-label="Lock Investigator Terminal"
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
            <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-900 text-white text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Lock Terminal
            </div>
          </div>
        )}

        <div
          className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
          title="Grid Node Online & Synchronized"
        />
      </div>
    </aside>
  );
}
