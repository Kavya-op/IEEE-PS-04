import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import {
  Activity,
  Layers,
  Shield,
  Crosshair,
  TrendingUp,
  Cpu,
  BarChart3,
  Globe2,
  FileCode2,
  RefreshCw,
  Code,
  MapPin,
  Clock,
  X
} from 'lucide-react';
import {
  aggregateHistoricalThreatLogs,
  getOfflineThreatAggregationFallback
} from '../geminiAnalyzer';

export default function ThreatAnalyticsView() {
  const { neuButtonProps, shouldReduceMotion } = useAppMotion();
  const defaultThreatLogs = [
    { id: 'LOG-01', timestamp: '2026-10-14T01:00:00Z', region: 'Eastern Europe', severity: 'High', threatType: 'Ransomware' },
    { id: 'LOG-02', timestamp: '2026-10-14T01:15:00Z', region: 'East Asia', severity: 'High', threatType: 'Zero-Day Exploit' },
    { id: 'LOG-03', timestamp: '2026-10-14T01:30:00Z', region: 'North America', severity: 'Medium', threatType: 'Credential Stuffing' },
    { id: 'LOG-04', timestamp: '2026-10-14T02:00:00Z', region: 'Eastern Europe', severity: 'High', threatType: 'Ransomware' },
    { id: 'LOG-05', timestamp: '2026-10-14T02:15:00Z', region: 'Western Europe', severity: 'Medium', threatType: 'Phishing' },
    { id: 'LOG-06', timestamp: '2026-10-14T02:30:00Z', region: 'East Asia', severity: 'High', threatType: 'DDoS' },
    { id: 'LOG-07', timestamp: '2026-10-14T03:00:00Z', region: 'South America', severity: 'Medium', threatType: 'Phishing' },
    { id: 'LOG-08', timestamp: '2026-10-14T03:15:00Z', region: 'North America', severity: 'High', threatType: 'Data Breach' },
    { id: 'LOG-09', timestamp: '2026-10-14T03:30:00Z', region: 'East Asia', severity: 'Medium', threatType: 'DNS Tunneling' },
    { id: 'LOG-10', timestamp: '2026-10-14T04:00:00Z', region: 'Eastern Europe', severity: 'High', threatType: 'Wiper Malware' }
  ];

  const [aggregationData, setAggregationData] = useState(() =>
    getOfflineThreatAggregationFallback(defaultThreatLogs)
  );
  const [loadingAggregation, setLoadingAggregation] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);

  const handleRefreshAggregation = async () => {
    setLoadingAggregation(true);
    try {
      const results = await aggregateHistoricalThreatLogs(defaultThreatLogs);
      setAggregationData(results);
    } catch {
      setAggregationData(getOfflineThreatAggregationFallback(defaultThreatLogs));
    } finally {
      setLoadingAggregation(false);
    }
  };

  const mitreTactics = [
    { id: 'TA0001', name: 'Initial Access', techniques: '12 blocked', coverage: 94, status: 'Secured' },
    { id: 'TA0002', name: 'Execution', techniques: '29 blocked', coverage: 88, status: 'Secured' },
    { id: 'TA0003', name: 'Persistence', techniques: '18 blocked', coverage: 91, status: 'Secured' },
    { id: 'TA0004', name: 'Privilege Escalation', techniques: '15 blocked', coverage: 96, status: 'Secured' },
    { id: 'TA0005', name: 'Defense Evasion', techniques: '34 blocked', coverage: 79, status: 'Monitored' },
    { id: 'TA0006', name: 'Credential Access', techniques: '22 blocked', coverage: 93, status: 'Secured' },
    { id: 'TA0007', name: 'Lateral Movement', techniques: '8 blocked', coverage: 85, status: 'Monitored' },
    { id: 'TA0010', name: 'Exfiltration', techniques: '14 blocked', coverage: 98, status: 'Secured' },
  ];

  const activeAPTs = [
    { name: 'APT29 (Cozy Bear)', country: 'RU', activity: 'High', vector: 'OAuth Abuse & Cloud Token Forgery', confidence: '94%' },
    { name: 'Volt Typhoon', country: 'CN', activity: 'Elevated', vector: 'Living off the Land (SOHO Routers)', confidence: '91%' },
    { name: 'Lazarus Group', country: 'KP', activity: 'Moderate', vector: 'Software Supply Chain Poisoning', confidence: '88%' },
  ];

  const vulnerableAssets = [
    { asset: 'k8s-prod-ingress-worker-01', ip: '10.200.1.4', riskScore: '9.2', cve: 'CVE-2026-1049', patchStatus: 'Hotpatch Ready' },
    { asset: 'auth-vault-primary-eu', ip: '10.200.4.12', riskScore: '8.4', cve: 'CVE-2025-4819', patchStatus: 'Enforcing WAF' },
    { asset: 'customer-data-lake-node-7', ip: '10.200.9.88', riskScore: '7.1', cve: 'CVE-2025-9921', patchStatus: 'Isolated' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60">
        <h2 className="text-xl font-black text-[#1A253C] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2563EB]" />
          Threat Analytics & Predictive Heuristics
        </h2>
        <p className="text-xs text-[#52607B] mt-1">
          Deep telemetry across MITRE ATT&CK vectors, APT group attribution, and neural anomaly trends.
        </p>
      </div>

      {/* MITRE ATT&CK Matrix Card */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60">
        <div className="flex items-center justify-between pb-3 border-b border-[#A3B1C6]/30">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#1A253C]">MITRE ATT&CK&reg; Matrix Defensive Coverage</h3>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-emerald-600 font-bold">
            91.2% Overall Hardening
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {mitreTactics.map((tactic) => (
            <div
              key={tactic.id}
              className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[#2563EB] font-bold">{tactic.id}</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold shadow-[1px_1px_3px_#A3B1C6,-1px_-1px_3px_#FFFFFF] ${
                    tactic.coverage >= 90
                      ? 'text-emerald-600 bg-[#E0E5EC]'
                      : 'text-amber-600 bg-[#E0E5EC]'
                  }`}
                >
                  {tactic.status}
                </span>
              </div>
              <div className="text-xs font-bold text-[#1A253C] mt-2">{tactic.name}</div>
              <div className="text-[11px] text-[#52607B] font-mono mt-0.5">{tactic.techniques}</div>
              <div className="w-full bg-[#A3B1C6]/30 rounded-full h-2 mt-3 overflow-hidden shadow-[inset_1px_1px_2px_#A3B1C6]">
                <div
                  className={`h-2 rounded-full ${
                    tactic.coverage >= 90 ? 'bg-[#2563EB]' : 'bg-amber-500'
                  }`}
                  style={{ width: `${tactic.coverage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: APT Attribution & High-Risk Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* APT Attribution */}
        <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60">
          <div className="flex items-center justify-between pb-3 border-b border-[#A3B1C6]/30">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-[#1A253C]">Known Threat Groups (APT) Tracking</h3>
            </div>
            <span className="text-xs text-rose-600 font-mono font-bold">3 Active Campaigns</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {activeAPTs.map((apt) => (
              <div
                key={apt.name}
                className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#1A253C]">{apt.name}</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-rose-600 font-bold bg-[#E0E5EC] shadow-[1px_1px_3px_#A3B1C6,-1px_-1px_3px_#FFFFFF]">
                    {apt.activity} Threat
                  </span>
                </div>
                <div className="text-xs text-[#52607B] mt-1.5">
                  <span className="font-semibold text-[#1A253C]">Signature Vector: </span>
                  {apt.vector}
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-[#2563EB] mt-2.5 pt-2 border-t border-[#A3B1C6]/20">
                  <span className="text-[#52607B]">Attribution Precision</span>
                  <span className="font-bold">{apt.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Monitored Assets */}
        <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60">
          <div className="flex items-center justify-between pb-3 border-b border-[#A3B1C6]/30">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[#1A253C]">High-Risk Assets & Exposure Scores</h3>
            </div>
            <span className="text-xs text-[#52607B] font-mono font-semibold">CVSS v4.0</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {vulnerableAssets.map((asset) => (
              <div
                key={asset.asset}
                className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[#1A253C]">{asset.asset}</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E0E5EC] text-rose-600 shadow-[1px_1px_3px_#A3B1C6,-1px_-1px_3px_#FFFFFF]">
                    CVSS {asset.riskScore}
                  </span>
                </div>
                <div className="text-xs text-[#52607B] mt-1.5 flex justify-between font-mono">
                  <span>IP: {asset.ip}</span>
                  <span className="text-amber-600 font-bold">{asset.cve}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-emerald-600 mt-2.5 pt-2 border-t border-[#A3B1C6]/20">
                  <span className="text-[#52607B]">Defense Response</span>
                  <span className="font-bold">{asset.patchStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Threat Logs: Spatio-Temporal Aggregation Panel */}
      <div className="p-6 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#A3B1C6]/30 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-base font-bold text-[#1A253C] tracking-tight">
                Historical Threat Logs: Spatio-Temporal Aggregation
              </h3>
            </div>
            <p className="text-xs text-[#52607B] font-mono mt-0.5">
              Simulated time-window telemetry synthesized across temporal progression & geographical origins
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              {...neuButtonProps}
              onClick={() => setShowJsonModal(true)}
              className="px-3.5 py-2 rounded-full bg-[#E0E5EC] text-[#1A253C] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              <Code className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Inspect Strict JSON</span>
            </motion.button>

            <motion.button
              {...neuButtonProps}
              onClick={handleRefreshAggregation}
              disabled={loadingAggregation}
              className="px-4 py-2 rounded-full bg-[#E0E5EC] text-[#2563EB] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAggregation ? 'animate-spin' : ''}`} />
              <span>{loadingAggregation ? 'Synthesizing...' : 'Re-aggregate with Gemini AI'}</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dimension 1: Timeline Progression Buckets */}
          <div className="p-5 rounded-[20px] bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#2563EB] flex items-center gap-1.5 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                1. Timeline Progression Buckets ({aggregationData.timelineBuckets?.length || 0})
              </span>
              <span className="text-[10px] font-mono text-[#52607B]">Chronological Telemetry</span>
            </div>

            <div className="space-y-2.5">
              {aggregationData.timelineBuckets?.map((bucket, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] border border-white/60 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#1A253C] font-bold flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#2563EB]" />
                      {bucket.timestamp}
                    </span>
                    <span className="text-[#52607B] text-[11px]">
                      Total Scanned: <strong className="text-[#1A253C]">{bucket.totalScanned}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF] text-rose-600 font-bold text-[10px]">
                      High Threat: {bucket.highThreatCount}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF] text-amber-600 font-bold text-[10px]">
                      Medium Threat: {bucket.mediumThreatCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 2: Regional Origin Distribution */}
          <div className="p-5 rounded-[20px] bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#2563EB] flex items-center gap-1.5 uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                2. Regional Distribution ({aggregationData.regionalDistribution?.length || 0})
              </span>
              <span className="text-[10px] font-mono text-[#52607B]">Origin Clustering</span>
            </div>

            <div className="space-y-2.5">
              {aggregationData.regionalDistribution?.map((region, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] border border-white/60 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A253C] flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{region.regionName}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#52607B] mt-1">
                      Primary Threat: <span className="text-[#2563EB] font-bold">{region.primaryThreatType}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-[#2563EB]">
                      {region.incidentCount} attacks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Neumorphic JSON Schema Inspection Modal */}
      <AnimatePresence>
        {showJsonModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.95, y: 15 }}
              animate={shouldReduceMotion ? {} : { scale: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#E0E5EC] border border-white/80 rounded-[28px] max-w-xl w-full p-6 text-[#1A253C] shadow-[16px_16px_32px_#A3B1C6,-16px_-16px_32px_#FFFFFF] relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#A3B1C6]/30">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#2563EB]" />
                  <h4 className="text-sm font-mono font-bold text-[#1A253C] uppercase tracking-wider">
                    Strict JSON: Threat Logs Aggregation
                  </h4>
                </div>
                <motion.button
                  {...neuButtonProps}
                  onClick={() => setShowJsonModal(false)}
                  className="w-8 h-8 rounded-full bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] flex items-center justify-center text-[#52607B] hover:text-[#1A253C] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <pre className="p-4 mt-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] text-xs font-mono text-[#1A253C] overflow-y-auto flex-1 border border-white/40">
                {JSON.stringify(aggregationData, null, 2)}
              </pre>

              <div className="mt-4 flex justify-end">
                <motion.button
                  {...neuButtonProps}
                  onClick={() => setShowJsonModal(false)}
                  className="px-5 py-2 rounded-full bg-[#E0E5EC] text-[#1A253C] shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] text-xs font-mono font-bold cursor-pointer transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
