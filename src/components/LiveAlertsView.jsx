import React, { useState } from 'react';
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
import TargetedSweepPanel from './TargetedSweepPanel';

export default function LiveAlertsView({ alerts = [], onIsolateThreat, onMitigateThreat, onSimulateAlert }) {
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
      {/* Sub-navigation tabs: Flat Minimalist Container */}
      <div className="p-1 rounded-xl bg-white border border-[#E5E7EB] inline-flex space-x-1 flex-wrap gap-y-1">
        <button
          onClick={() => setSubTab('social')}
          className={`flex items-center space-x-2 py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'social'
              ? 'bg-[#0B2115] text-[#9FE846]'
              : 'text-gray-600 hover:text-[#0B2115]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Social Threat Feed (OSINT)</span>
        </button>

        <button
          onClick={() => setSubTab('sweep')}
          className={`flex items-center space-x-2 py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'sweep'
              ? 'bg-[#0B2115] text-[#9FE846]'
              : 'text-gray-600 hover:text-[#0B2115]'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Targeted Sweep</span>
        </button>

        <button
          onClick={() => setSubTab('infra')}
          className={`flex items-center space-x-2 py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'infra'
              ? 'bg-[#0B2115] text-[#9FE846]'
              : 'text-gray-600 hover:text-[#0B2115]'
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
          <div className="p-5 rounded-xl bg-white border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#0B2115] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Live Perimeter Alerts & Containment</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time heuristic anomalies flagged by the neural defense matrix.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onSimulateAlert}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-[#F3FAEB] text-[#0B2115] border border-[#E5E7EB] hover:border-[#9FE846]/40 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#0B2115]" />
                <span>Simulate Threat Event</span>
              </button>
            </div>
          </div>

          {/* Filter and Inset Search Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by CVE, IOC, target IP, or attacker signature..."
                className="w-full bg-white text-xs text-[#0B2115] pl-10 pr-4 py-2 rounded-lg border border-[#E5E7EB] placeholder-gray-400 focus:outline-none focus:border-[#0B2115] focus:ring-1 focus:ring-[#0B2115] font-mono transition-all"
              />
            </div>

            {/* Severity filter buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs text-gray-500 mr-1 flex items-center font-medium">
                <Filter className="w-3.5 h-3.5 mr-1" />
                Severity:
              </span>
              {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono uppercase transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-[#0B2115] text-[#9FE846] font-semibold'
                      : 'bg-gray-50 text-gray-600 border border-[#E5E7EB] hover:text-[#0B2115]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-white border border-[#E5E7EB] text-gray-500">
                <ShieldCheck className="w-10 h-10 text-[#5C901A] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#0B2115]">No matching threat alerts found</p>
                <p className="text-xs text-gray-500 mt-1">Perimeter heuristics report all clear.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isExpanded = expandedId === alert.id;
                return (
                  <div
                    key={alert.id}
                    className="rounded-xl bg-white border border-[#E5E7EB] transition-all overflow-hidden"
                  >
                    {/* Header row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="flex items-start sm:items-center space-x-3 min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase shrink-0 border ${
                            alert.severity === 'critical'
                              ? 'text-rose-600 bg-rose-50 border-rose-200'
                              : alert.severity === 'high'
                              ? 'text-amber-700 bg-amber-50 border-amber-200'
                              : 'text-[#0B2115] bg-[#F3FAEB] border-[#9FE846]/40'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-semibold text-gray-400">{alert.id}</span>
                            <h4 className="text-sm font-semibold text-[#0B2115] truncate">{alert.title}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-mono">
                            <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5 text-[#5C901A]" />
                              <span>Reddit OSINT</span>
                            </span>
                            <a
                              href={alert.link || "https://www.reddit.com/r/cybersecurity"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono font-medium text-[#0B2115] hover:text-[#5C901A] hover:underline flex items-center gap-1"
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
                          className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                            alert.status === 'mitigated'
                              ? 'bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40'
                              : alert.status === 'mitigating'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {alert.status}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="p-4 border-t border-[#E5E7EB] bg-gray-50/50 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white border border-[#E5E7EB]">
                            <span className="text-xs font-mono text-gray-400 block mb-1">MITRE ATT&CK Mapping</span>
                            <span className="text-xs font-mono font-bold text-[#0B2115]">{alert.mitre}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-[#E5E7EB]">
                            <span className="text-xs font-mono text-gray-400 block mb-1">AI Recommendation</span>
                            <span className="text-xs text-gray-700 font-medium">{alert.recommendation}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-2">
                          {alert.status !== 'mitigated' && (
                            <>
                              <button
                                onClick={() => onIsolateThreat?.(alert.id)}
                                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                Isolate Vector
                              </button>
                              <button
                                onClick={() => onMitigateThreat?.(alert.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] font-semibold text-xs font-mono transition-colors cursor-pointer shadow-sm"
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
