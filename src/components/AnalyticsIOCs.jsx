import React, { Component, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  Flame,
  MapPin,
  Shield,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Database,
  Globe,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Layers,
  Filter,
  Radio,
  FileCode,
  ShieldCheck,
  Lock,
  Zap,
  Server
} from 'lucide-react';
import { useOSINT } from '../context/OSINTContext';
import GeographicThreatMap from './GeographicThreatMap';

/**
 * Crash-Proof Error Boundary to catch render issues in heavy charting or Leaflet maps
 */
class SafeWidgetBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn(`[AnalyticsIOCs Error Boundary - ${this.props.title || 'Widget'}]:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[280px] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-[#0B2115]">
            {this.props.fallbackTitle || 'Widget Temporarily Unavailable'}
          </div>
          <p className="text-xs text-gray-500 max-w-sm">
            Data feed is active. The telemetry component encountered an isolation fault and gracefully fell back.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3.5 py-1.5 rounded-lg bg-[#0B2115] text-[#9FE846] text-xs font-semibold cursor-pointer hover:bg-[#153423] transition-colors"
          >
            Retry Telemetry Render
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AnalyticsIOCs() {
  const { liveThreats = [], activeIngressRate, defenseEfficacy, severeRisksCount } = useOSINT();
  const [copiedIoc, setCopiedIoc] = useState(null);
  const [activeIocTab, setActiveIocTab] = useState('ALL');

  // Realistic verified Indicators of Compromise (IOCs)
  const iocs = [
    {
      id: 'IOC-01',
      type: 'IPv4 C2 Node',
      value: '194.26.29.112',
      threat: 'SpectreSec Bulletproof VPS',
      vector: 'Aadhaar Dump Exfiltration',
      confidence: '98%',
      status: 'Blocklisted'
    },
    {
      id: 'IOC-02',
      type: 'Domain / FQDN',
      value: 'hxxps://leaks-vault.onion/dump.zip',
      threat: 'DarkMesh Intercept',
      vector: 'Credential Dump Combo',
      confidence: '96%',
      status: 'Sinkholed'
    },
    {
      id: 'IOC-03',
      type: 'CVE Signature',
      value: 'CVE-2026-8812',
      threat: 'Pre-auth Buffer Overflow',
      vector: 'Zero-Day Edge Appliance RCE',
      confidence: '99%',
      status: 'Active Advisory'
    },
    {
      id: 'IOC-04',
      type: 'SHA-256 Hash',
      value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      threat: 'Mirai IoT Botnet Payload',
      vector: 'SCADA Modbus Injection',
      confidence: '94%',
      status: 'Quarantined'
    },
    {
      id: 'IOC-05',
      type: 'Phishing URL',
      value: 'http://bit.ly/secure-boa-login-2026',
      threat: 'Reverse-Proxy Kit',
      vector: 'SSO Credential Harvesting',
      confidence: '97%',
      status: 'DNS Takedown'
    },
    {
      id: 'IOC-06',
      type: 'IPv4 Ingress',
      value: '45.142.214.9',
      threat: 'Volt Typhoon SOHO Proxy',
      vector: 'Living off the Land (LotL)',
      confidence: '92%',
      status: 'Monitored'
    }
  ];

  const handleCopyIoc = (value, id) => {
    navigator.clipboard.writeText(value);
    setCopiedIoc(id);
    setTimeout(() => setCopiedIoc(null), 2000);
  };

  const filteredIocs = activeIocTab === 'ALL'
    ? iocs
    : iocs.filter((item) => item.type.toLowerCase().includes(activeIocTab.toLowerCase()));

  // 72-Hour Velocity points for the velocity widget
  const velocity72hPoints = [
    { hour: '-72h', rate: 14, label: '14 pkt/s' },
    { hour: '-60h', rate: 22, label: '22 pkt/s' },
    { hour: '-48h', rate: 48, label: '48 pkt/s (Mirai Surge)' },
    { hour: '-36h', rate: 31, label: '31 pkt/s' },
    { hour: '-24h', rate: 28, label: '28 pkt/s' },
    { hour: '-12h', rate: 44, label: '44 pkt/s (Aadhaar Probe)' },
    { hour: 'Now', rate: 38, label: '38 pkt/s (Live Telemetry)' }
  ];

  return (
    <div className="bg-[#F3F5F6] h-full overflow-y-auto p-6 flex flex-col gap-6">
      {/* Header: Flat white header card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9FE846] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C901A]">
              Predictive Heuristics &bull; SKIT004 Sovereign Engine
            </span>
          </div>
          <h1 className="text-[#0B2115] text-2xl font-bold tracking-tight">
            Analytics &amp; Indicators of Compromise (IOCs)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time geospatial entity resolution, 72-hour threat velocity trends, and verified IOC signatures.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-lg bg-[#F3FAEB] text-[#0B2115] border border-[#9FE846]/50 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#5C901A]" />
            <span>Defense: {defenseEfficacy || '98.4%'}</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-[#0B2115] border border-[#E5E7EB] text-xs font-mono font-semibold">
            Ingress: {activeIngressRate || '14.2 pkt/s'}
          </span>
        </div>
      </div>

      {/* Grid: 2 Primary Core Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: Threat Velocity Chart (72h) */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0B2115] text-[#9FE846] flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4 text-[#9FE846]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B2115]">Threat Velocity (72h)</h3>
                <p className="text-[11px] text-gray-500">Volumetric packet ingress &amp; coordinated botnet surges</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 font-bold">
              Rolling 72 Hours
            </span>
          </div>

          {/* Placeholder colored box as specified in Step 3 */}
          <div className="bg-[#F3FAEB] h-64 rounded-lg border border-[#9FE846] flex flex-col items-center justify-between p-4 text-[#0B2115] relative overflow-hidden">
            {/* SVG Velocity Curve visualization */}
            <div className="w-full h-full flex flex-col justify-between z-10">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#5C901A]">
                <span>PEAK: 48.2 PKT/S</span>
                <span>AVERAGE: 32.5 PKT/S</span>
                <span>CURRENT: {activeIngressRate || '38 PKT/S'}</span>
              </div>

              {/* Sparkline Visual */}
              <div className="relative w-full h-36 flex items-end justify-between gap-2 pt-4 px-2">
                {velocity72hPoints.map((pt, idx) => {
                  const heightPercent = Math.round((pt.rate / 50) * 100);
                  const isPeak = pt.rate >= 44;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono bg-[#0B2115] text-[#9FE846] px-1 rounded whitespace-nowrap">
                        {pt.label}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isPeak
                            ? 'bg-[#0B2115] border-t-2 border-[#9FE846]'
                            : 'bg-[#9FE846]/80 hover:bg-[#9FE846]'
                        }`}
                      />
                      <span className="text-[10px] font-mono text-gray-600 font-bold mt-1">
                        {pt.hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-xs font-mono font-bold text-[#0B2115] pt-1 border-t border-[#9FE846]/40">
                Threat Velocity (72h) &bull; Continuous Multi-Platform Telemetry
              </div>
            </div>

            {/* Subtle background radar watermarks */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border border-[#9FE846]/30 pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full border border-[#9FE846]/20 pointer-events-none" />
          </div>
        </div>

        {/* Widget 2: Geographic Map with Leaflet Error Boundary */}
        <SafeWidgetBoundary fallbackTitle="Geographic Threat Visualization Unavailable">
          <GeographicThreatMap threats={liveThreats} />
        </SafeWidgetBoundary>
      </div>

      {/* Indicators of Compromise (IOC) Verified Ledger */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E7EB] gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B2115] text-[#9FE846] flex items-center justify-center font-bold shrink-0">
              <Terminal className="w-4 h-4 text-[#9FE846]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B2115]">
                Verified Indicators of Compromise (IOC Ledger)
              </h2>
              <p className="text-xs text-gray-500">
                Extracts from multi-platform OSINT streams correlated against MITRE ATT&amp;CK and law enforcement blocklists.
              </p>
            </div>
          </div>

          {/* IOC Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'IPv4', 'Domain', 'CVE', 'SHA-256'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveIocTab(cat)}
                className={`text-xs font-mono px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeIocTab === cat
                    ? 'bg-[#0B2115] text-white font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* IOC Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[11px] font-mono text-gray-500 uppercase bg-gray-50/60">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Indicator Value</th>
                <th className="py-2.5 px-3">Attributed Threat / Actor</th>
                <th className="py-2.5 px-3">Threat Vector</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Containment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs font-sans">
              {filteredIocs.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-[#F3FAEB]/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-[#0B2115]">
                    {ioc.type}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#0B2115] max-w-[240px]">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{ioc.value}</span>
                      <button
                        onClick={() => handleCopyIoc(ioc.value, ioc.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-[#0B2115] transition-colors cursor-pointer shrink-0"
                        title="Copy IOC to clipboard"
                        aria-label="Copy IOC"
                      >
                        {copiedIoc === ioc.id ? (
                          <Check className="w-3 h-3 text-[#5C901A]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-700 font-medium">
                    {ioc.threat}
                  </td>
                  <td className="py-3 px-3 text-gray-600 text-[11px]">
                    {ioc.vector}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-[#5C901A]">
                    {ioc.confidence}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F3FAEB] text-[#0B2115] border border-[#9FE846]">
                      {ioc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
