import React from 'react';
import {
  Compass,
  ShieldAlert,
  Bot,
  Scan,
  Search,
  Flame,
  SlidersHorizontal,
  Lock,
  Radio,
  FileText,
  Activity,
  Layers,
  ShieldCheck,
  Shield,
  FileCheck,
  Bell,
  LogOut,
  UserCheck
} from 'lucide-react';

export default function SaaSSidebar({
  activeTab = 'Overview',
  setActiveTab,
  alertCount = 4,
  onLockTerminal
}) {
  const sections = [
    {
      title: 'MAIN',
      items: [
        { id: 'Overview', alias: 'Radar', label: 'Threat Radar', icon: Compass },
        { id: 'ThreatVelocity', alias: 'Velocity', label: 'Threat Velocity', icon: Activity }
      ]
    },
    {
      title: 'INVESTIGATE',
      items: [
        { id: 'Alerts', alias: 'Live Alerts', label: 'Alert Feed', icon: ShieldAlert, badge: alertCount },
        { id: 'MediaInterrogation', alias: 'Media Interrogation', label: 'Media Interrogation', icon: Search },
        { id: 'TargetedSweep', alias: 'Targeted Sweep', label: 'Targeted Sweep', icon: Compass },
        { id: 'Misinformation', alias: 'Threat Analytics', label: 'Analytics & IOCs', icon: Flame },
        { id: 'BotSwarms', alias: 'Bot Swarms', label: 'Bot Swarms', icon: Bot }
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'Settings', alias: 'Settings', label: 'System Config', icon: SlidersHorizontal },
        { id: 'AuditLog', alias: 'Audit Log', label: 'Firewall & SOPs', icon: FileCheck }
      ]
    }
  ];

  const isItemActive = (item) => {
    return activeTab === item.id || activeTab === item.alias;
  };

  return (
    <aside
      aria-label="Clean SaaS Sidebar"
      className="hidden md:flex flex-col justify-between w-64 bg-[#0B2115] border-r border-[#153423] h-full py-6 select-none shrink-0 text-white"
    >
      <div>
        {/* Top: Logo & System Identity */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#9FE846] text-[#0B2115] flex items-center justify-center font-bold text-base shadow-sm">
            <Shield className="w-5 h-5 text-[#0B2115]" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">
              CYBERPULSE
            </div>
            <div className="text-[10px] font-mono font-semibold text-[#9FE846]/80 uppercase tracking-wider">
              SKIT004 // DEFCON 2
            </div>
          </div>
        </div>

        {/* Sectioned Navigation */}
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              {/* Section Header */}
              <div className="px-6 text-[11px] font-bold text-[#9FE846]/60 tracking-wider mb-2 uppercase font-mono">
                {section.title}
              </div>

              {/* Section Items */}
              <div className="space-y-1 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item);

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                        active
                          ? 'bg-[#9FE846] text-[#0B2115] font-bold border-l-4 border-[#0B2115] shadow-sm'
                          : 'text-gray-400 hover:text-white hover:bg-[#153423]/50 font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Icon Background */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            active
                              ? 'bg-[#0B2115] text-[#9FE846]'
                              : 'bg-[#153423]/60 text-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Notification Dot / Badge */}
                      {item.badge && item.badge > 0 ? (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-[#0B2115] bg-[#9FE846] rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Officer Status & Lock Terminal */}
      <div className="px-6 pt-4 border-t border-[#153423] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#153423] border border-[#1b432d] flex items-center justify-center text-xs font-bold text-[#9FE846]">
            IV
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Inv. Vance</div>
            <div className="text-[10px] text-[#9FE846] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9FE846] animate-pulse" />
              <span>Clearance L1</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLockTerminal}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#153423] transition-colors cursor-pointer"
          title="Lock Terminal"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
