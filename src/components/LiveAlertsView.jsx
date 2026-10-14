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
  Radio,
  Scan,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AlertFeed from './AlertFeed';
import DashboardAnalytics from './DashboardAnalytics';
import TargetedSweepPanel from './TargetedSweepPanel';

export default function LiveAlertsView({ alerts = [], onIsolateThreat, onMitigateThreat, onSimulateAlert }) {
  const { neuButtonProps, shouldReduceMotion } = useAppMotion();
  const [subTab, setSubTab] = useState('social'); // 'social' | 'sweep' | 'infra'
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
      {/* Sub-navigation tabs: Crisp White Container with Cobalt Blue Active Badges */}
      <div className="p-1.5 rounded-2xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] inline-flex space-x-1 flex-wrap gap-y-1">
        <button
          onClick={() => setSubTab('social')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            subTab === 'social'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Social Threat Feed (OSINT)</span>
        </button>

        <button
          onClick={() => setSubTab('sweep')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            subTab === 'sweep'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Targeted AI Sweep</span>
        </button>

        <button
          onClick={() => setSubTab('infra')}
          className={`flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            subTab === 'infra'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Perimeter Infrastructure</span>
        </button>
      </div>

      {subTab === 'sweep' ? (
        <TargetedSweepPanel />
      ) : subTab === 'social' ? (
        <div className="space-y-6">
          <AlertFeed />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Header & Simulation Trigger */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>Live Perimeter Alerts & Containment</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time heuristic anomalies flagged by the neural defense matrix.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onSimulateAlert}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-rose-500" />
                <span>Simulate Threat Event</span>
              </button>
            </div>
          </div>

          {/* Filter and Inset Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by CVE, IOC, target IP, or attacker signature..."
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E9F2] dark:border-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono transition-all"
              />
            </div>

            {/* Severity filter buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs text-slate-500 mr-1 flex items-center font-medium">
                <Filter className="w-3.5 h-3.5 mr-1" />
                Severity:
              </span>
              {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[#E5E9F2] dark:border-slate-800 hover:text-slate-900'
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
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-slate-500">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">No matching threat alerts found</p>
                <p className="text-xs text-slate-500 mt-1">Perimeter heuristics report all clear.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isExpanded = expandedId === alert.id;
                return (
                  <div
                    key={alert.id}
                    className="rounded-2xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all overflow-hidden"
                  >
                    {/* Header row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase shrink-0 border ${
                            alert.severity === 'critical'
                              ? 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900'
                              : alert.severity === 'high'
                              ? 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900'
                              : 'text-[#2563EB] bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-semibold text-slate-500">{alert.id}</span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{alert.title}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 font-mono">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Reddit OSINT Verified</span>
                            </span>
                            <a
                              href={alert.link || "https://www.reddit.com/r/cybersecurity"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>[Reddit Source ↗]</span>
                            </a>
                            <span>&bull;</span>
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
                          className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                            alert.status === 'mitigated'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : alert.status === 'mitigating'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {alert.status}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="p-5 border-t border-[#E5E9F2] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800">
                            <span className="text-xs font-mono text-slate-500 block mb-1">MITRE ATT&CK Mapping</span>
                            <span className="text-sm font-mono font-bold text-[#2563EB]">{alert.mitre}</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white dark:bg-[#151E32] border border-[#E5E9F2] dark:border-slate-800">
                            <span className="text-xs font-mono text-slate-500 block mb-1">AI Recommendation</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{alert.recommendation}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-2">
                          {alert.status !== 'mitigated' && (
                            <>
                              <button
                                onClick={() => onIsolateThreat?.(alert.id)}
                                className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                Isolate Threat Vector
                              </button>
                              <button
                                onClick={() => onMitigateThreat?.(alert.id)}
                                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-mono font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer shadow-xs"
                              >
                                Mitigate & Close
                              </button>
                            </>
                          )}
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
