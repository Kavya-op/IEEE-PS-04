import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Zap,
  ShieldCheck,
  PlusCircle,
  Radio
} from 'lucide-react';
import AlertFeed from './AlertFeed';
import DashboardAnalytics from './DashboardAnalytics';

export default function LiveAlertsView({ alerts = [], onIsolateThreat, onMitigateThreat, onSimulateAlert }) {
  const { neuButtonProps, getStaggerContainer, staggerItemVariants, shouldReduceMotion } = useAppMotion();
  const [subTab, setSubTab] = useState('social'); // 'infra' | 'social'
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(alerts[0]?.id || null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.vector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Neumorphic Sub-navigation tabs: Social Threat Feed vs Infrastructure */}
      <div className="p-2 rounded-[24px] bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] inline-flex space-x-2">
        <motion.button
          {...neuButtonProps}
          onClick={() => setSubTab('social')}
          className={`flex items-center space-x-2 py-2.5 px-5 rounded-[20px] text-xs font-mono font-bold transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            subTab === 'social'
              ? 'bg-[#E0E5EC] text-[#2563EB] shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF]'
              : 'text-[#52607B] hover:text-[#1A253C]'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Social Threat Feed (OSINT)</span>
        </motion.button>

        <motion.button
          {...neuButtonProps}
          onClick={() => setSubTab('infra')}
          className={`flex items-center space-x-2 py-2.5 px-5 rounded-[20px] text-xs font-mono font-bold transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            subTab === 'infra'
              ? 'bg-[#E0E5EC] text-rose-600 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF]'
              : 'text-[#52607B] hover:text-[#1A253C]'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-rose-500" />
          <span>Perimeter Infrastructure</span>
        </motion.button>
      </div>

      {subTab === 'social' ? (
        <div className="space-y-6">
          <DashboardAnalytics />
          <AlertFeed />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Header & Simulation Trigger */}
          <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#1A253C] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Live Perimeter Alerts & Containment
              </h2>
              <p className="text-xs text-[#52607B] mt-1">
                Real-time heuristic anomalies flagged by the neural defense matrix.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                {...neuButtonProps}
                onClick={onSimulateAlert}
                className="px-4 py-2.5 rounded-full text-xs font-semibold bg-[#E0E5EC] text-rose-600 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] hover:text-rose-700 transition-colors flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                <PlusCircle className="w-4 h-4 text-rose-500" />
                <span>Simulate Threat Event</span>
              </motion.button>
            </div>
          </div>

          {/* Filter and Inset Search Bar */}
          <div className="p-4 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52607B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by CVE, IOC, target IP, or attacker signature..."
                className="w-full bg-[#E0E5EC] text-xs text-[#1A253C] pl-10 pr-4 py-2.5 rounded-2xl shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] placeholder-[#52607B] focus:outline-none focus:ring-4 focus:ring-blue-400 font-mono transition-all"
              />
            </div>

            {/* Severity filter buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs text-[#52607B] mr-1 flex items-center font-medium">
                <Filter className="w-3.5 h-3.5 mr-1" />
                Severity:
              </span>
              {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                    severityFilter === sev
                      ? 'bg-[#E0E5EC] text-[#2563EB] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] font-bold'
                      : 'bg-[#E0E5EC] text-[#52607B] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:text-[#1A253C]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-[24px] bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-[#52607B]">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-[#1A253C]">No matching threat alerts found</p>
                <p className="text-xs text-[#52607B] mt-1">Perimeter heuristics report all clear.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isExpanded = expandedId === alert.id;
                return (
                  <div
                    key={alert.id}
                    className="rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 transition-all duration-200 overflow-hidden"
                  >
                    {/* Header row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase shrink-0 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] ${
                            alert.severity === 'critical'
                              ? 'text-rose-600 bg-[#E0E5EC]'
                              : alert.severity === 'high'
                              ? 'text-amber-600 bg-[#E0E5EC]'
                              : 'text-[#2563EB] bg-[#E0E5EC]'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-semibold text-[#52607B]">{alert.id}</span>
                            <h4 className="text-sm font-bold text-[#1A253C] truncate">{alert.title}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#52607B] font-mono">
                            <span>Target: {alert.target}</span>
                            <span>&bull;</span>
                            <span>Source: {alert.sourceIp}</span>
                            <span>&bull;</span>
                            <span>Vector: {alert.vector}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-mono font-semibold shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] ${
                            alert.status === 'mitigated'
                              ? 'text-emerald-600'
                              : alert.status === 'mitigating'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {alert.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#52607B] font-mono">{alert.timestamp}</span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-[#A3B1C6]/30 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]">
                            <div className="text-[10px] font-mono uppercase text-[#52607B]">MITRE Technique</div>
                            <div className="text-xs font-mono font-bold text-[#1A253C] mt-1">{alert.mitre}</div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]">
                            <div className="text-[10px] font-mono uppercase text-[#52607B]">AI Confidence</div>
                            <div className="text-xs font-mono font-bold text-[#2563EB] mt-1 flex items-center">
                              <Sparkles className="w-3 h-3 mr-1 text-[#2563EB]" />
                              {alert.aiConfidence}
                            </div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]">
                            <div className="text-[10px] font-mono uppercase text-[#52607B]">Recommended Action</div>
                            <div className="text-xs text-[#1A253C] font-medium mt-1">{alert.recommendation}</div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                          <motion.button
                            {...neuButtonProps}
                            onClick={() => onIsolateThreat?.(alert.id)}
                            className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E0E5EC] text-amber-600 shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] hover:text-amber-700 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                          >
                            Isolate Ingress Mesh
                          </motion.button>
                          <motion.button
                            {...neuButtonProps}
                            onClick={() => onMitigateThreat?.(alert.id)}
                            className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E0E5EC] text-emerald-600 shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] hover:text-emerald-700 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                          >
                            Neutralize Incident
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
