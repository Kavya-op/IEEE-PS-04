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
  X,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useOSINT } from '../context/OSINTContext';
import GeographicThreatMap from './GeographicThreatMap';
import {
  aggregateHistoricalThreatLogs,
  getOfflineThreatAggregationFallback
} from '../geminiAnalyzer';

export default function ThreatAnalyticsView() {
  const { neuButtonProps, shouldReduceMotion } = useAppMotion();
  const { liveThreats, severeRisksCount, defenseEfficacy, activeIngressRate, lastIngestedAt } = useOSINT();
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
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B2115] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0B2115]" />
            Threat Analytics & Predictive Heuristics
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Deep telemetry across MITRE ATT&CK vectors, APT group attribution, and neural anomaly trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-md bg-gray-100 text-[#0B2115] inline-flex items-center gap-1 border border-[#E5E7EB]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B2115]" />
            <span>Verified Source: r/cybersecurity (Reddit Native API)</span>
          </span>
          <a
            href={liveThreats[0]?.link || "https://www.reddit.com/r/cybersecurity"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white border border-[#E5E7EB] text-[#0B2115] hover:bg-[#F3FAEB] hover:text-[#5C901A] hover:border-[#9FE846]/40 flex items-center gap-1 transition-colors shadow-sm"
          >
            <span>[View Original Reddit Post ↗]</span>
          </a>
        </div>
      </div>

      {/* Real-Time Geographic Threat Mapping Engine */}
      <GeographicThreatMap threats={liveThreats} liveThreatData={liveThreats} />

      {/* MITRE ATT&CK Matrix Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#0B2115]" />
            <h3 className="text-sm font-bold text-[#0B2115]">MITRE ATT&CK&reg; Matrix Defensive Coverage</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 font-bold">
            {defenseEfficacy} Overall Hardening
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {mitreTactics.map((tactic) => (
            <div
              key={tactic.id}
              className="p-4 rounded-xl bg-gray-50 border border-[#E5E7EB] transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-[#0B2115] font-bold">{tactic.id}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    tactic.coverage >= 90
                      ? 'text-[#5C901A] bg-[#F3FAEB] border-[#9FE846]/40'
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}
                >
                  {tactic.status}
                </span>
              </div>
              <div className="text-xs font-bold text-[#0B2115] mt-2">{tactic.name}</div>
              <div className="text-xs text-gray-500 font-mono mt-0.5">{tactic.techniques}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    tactic.coverage >= 90 ? 'bg-[#0B2115]' : 'bg-[#9FE846]'
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
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-[#0B2115]">Known Threat Groups (APT) Tracking</h3>
            </div>
            <span className="text-xs text-rose-600 font-mono font-bold">3 Active Campaigns</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {activeAPTs.map((apt) => (
              <div
                key={apt.name}
                className="p-4 rounded-xl bg-gray-50 border border-[#E5E7EB]"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#0B2115]">{apt.name}</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded font-semibold text-rose-700 bg-rose-50 border border-rose-200">
                    {apt.activity} Threat
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1.5">
                  <span className="font-semibold text-[#0B2115]">Signature Vector: </span>
                  {apt.vector}
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-[#0B2115] mt-2.5 pt-2 border-t border-[#E5E7EB]">
                  <span className="text-gray-500">Attribution Precision</span>
                  <span className="font-bold">{apt.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Monitored Assets */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[#0B2115]">High-Risk Assets & Exposure Scores</h3>
            </div>
            <span className="text-xs text-gray-500 font-mono font-medium">CVSS v4.0</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {vulnerableAssets.map((asset) => (
              <div
                key={asset.asset}
                className="p-4 rounded-xl bg-gray-50 border border-[#E5E7EB]"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[#0B2115]">{asset.asset}</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    CVSS {asset.riskScore}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1.5 flex justify-between font-mono">
                  <span>IP: {asset.ip}</span>
                  <span className="text-amber-600 font-bold">{asset.cve}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-[#5C901A] mt-2.5 pt-2 border-t border-[#E5E7EB]">
                  <span className="text-gray-500">Defense Response</span>
                  <span className="font-bold">{asset.patchStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Threat Logs: Spatio-Temporal Aggregation Panel */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E7EB] gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-[#0B2115]" />
              <h3 className="text-base font-bold text-[#0B2115] tracking-tight">
                Historical Threat Logs: Spatio-Temporal Aggregation
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Simulated time-window telemetry synthesized across temporal progression & geographical origins
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJsonModal(true)}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0B2115] hover:bg-[#F3FAEB] hover:text-[#5C901A] hover:border-[#9FE846]/40 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-[#0B2115]" />
              <span>Inspect Strict JSON</span>
            </button>

            <button
              onClick={handleRefreshAggregation}
              disabled={loadingAggregation}
              className="px-4 py-2 rounded-lg bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAggregation ? 'animate-spin' : ''}`} />
              <span>{loadingAggregation ? 'Synthesizing...' : 'Re-aggregate with Gemini AI'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dimension 1: Timeline Progression Buckets */}
          <div className="p-5 rounded-xl bg-gray-50 border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#0B2115] flex items-center gap-1.5 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#0B2115]" />
                1. Timeline Progression Buckets ({aggregationData.timelineBuckets?.length || 0})
              </span>
              <span className="text-[10px] font-mono text-gray-500">Chronological Telemetry</span>
            </div>

            <div className="space-y-2.5">
              {aggregationData.timelineBuckets?.map((bucket, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#0B2115] font-bold flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#0B2115]" />
                      {bucket.timestamp}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Total Scanned: <strong className="text-[#0B2115]">{bucket.totalScanned}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono mt-1">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[10px]">
                      High Threat: {bucket.highThreatCount}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[10px]">
                      Medium Threat: {bucket.mediumThreatCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 2: Regional Origin Distribution */}
          <div className="p-5 rounded-xl bg-gray-50 border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#0B2115] flex items-center gap-1.5 uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#0B2115]" />
                2. Regional Distribution ({aggregationData.regionalDistribution?.length || 0})
              </span>
              <span className="text-[10px] font-mono text-gray-500">Origin Clustering</span>
            </div>

            <div className="space-y-2.5">
              {aggregationData.regionalDistribution?.map((region, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#0B2115] flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{region.regionName}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500 mt-1">
                      Primary Threat: <span className="text-[#0B2115] font-bold">{region.primaryThreatType}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40">
                      {region.incidentCount} attacks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* JSON Schema Inspection Modal */}
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
              className="bg-white border border-[#E5E7EB] rounded-2xl max-w-xl w-full p-6 text-gray-900 shadow-xl relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#0B2115]" />
                  <h4 className="text-sm font-mono font-bold text-[#0B2115] uppercase tracking-wider">
                    Strict JSON: Threat Logs Aggregation
                  </h4>
                </div>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <pre className="p-4 mt-4 rounded-xl bg-gray-50 border border-[#E5E7EB] text-xs font-mono text-gray-800 overflow-y-auto flex-1">
                {JSON.stringify(aggregationData, null, 2)}
              </pre>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-5 py-2 rounded-lg bg-[#0B2115] hover:bg-[#153423] text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
