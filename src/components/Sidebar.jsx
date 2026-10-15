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
      id: 'AnalyticsIOCs',
      alias: 'Analytics',
      to: '/analytics',
      path: '/analytics',
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

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none bg-white">
      {/* Top: Logo & System Identity */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-mono font-bold tracking-wider text-blue-600 uppercase">
              SKIT004
            </div>
            <div className="text-sm font-extrabold text-gray-900 tracking-tight truncate">
              Threat Monitor
            </div>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="space-y-1.5" aria-label="Main System Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                aria-current={active ? 'page' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs font-mono font-bold cursor-pointer transition-colors ${
                  active
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white border border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      item.badge === 'Live'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            if (onRunManualAnalysis) {
              onRunManualAnalysis();
            } else {
              setActiveTab('Alerts');
            }
          }}
          aria-label="Run Manual Threat Analysis"
          className="w-full py-2.5 px-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Run Manual Analysis</span>
        </button>

        {/* Lock Terminal / Security Status Indicator */}
        <div className="flex items-center justify-between px-1 pt-1 text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-gray-800">Grid Nominal</span>
          </div>
          {onLockTerminal && (
            <button
              onClick={onLockTerminal}
              aria-label="Lock terminal and secure session"
              title="Lock Terminal"
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden lg:block fixed left-5 top-5 bottom-5 w-64 bg-white rounded-2xl border border-gray-200 shadow-sm z-40 overflow-hidden"
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
          <div className="relative m-4 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 flex flex-col overflow-hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
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
