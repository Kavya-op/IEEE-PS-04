import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import SaaSMetricCards from './SaaSMetricCards';
import SaaSChartsSection from './SaaSChartsSection';
import TakedownButton from './TakedownButton';
import ActorDossierModal from './ActorDossierModal';
import {
  ShieldAlert,
  ArrowUpRight,
  AlertTriangle,
  Zap,
  Radio,
  RefreshCw,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  X,
  FileText,
  Filter
} from 'lucide-react';

export default function OverviewView({ alerts = [], onIsolateThreat, onNavigateToAlerts }) {
  const { shouldReduceMotion } = useAppMotion();
  const {
    liveThreats,
    filteredLiveThreats,
    selectedVector = 'All Vectors',
    selectedVectorCategory = 'All',
    setVectorFilter,
    loading: osintLoading,
    pollCountdown,
    thematicClusters,
    refreshNow,
    mitigationStates
  } = useOSINT();

  const [activeThreatDetail, setActiveThreatDetail] = useState(null);
  const [selectedDossierThreat, setSelectedDossierThreat] = useState(null);

  const threatsToDisplay = selectedVector === 'All Vectors'
    ? liveThreats
    : (filteredLiveThreats || []);

  return (
    <div className="w-full space-y-6">
      {/* 1. The 4 Top Metric Cards (Flat Design, Thin Border, No Shadows) */}
      <SaaSMetricCards />

      {/* 2. Charts & Data Panels (Threat Timeline Line Chart + Platform Telemetry Donut Chart) */}
      <SaaSChartsSection />

      {/* 3. Live OSINT Ingress Stream (Flat Design, Pure White Card Container) */}
      <section
        aria-label="Live OSINT Ingress Stream"
        className="w-full bg-white rounded-xl p-5 border border-[#E5E7EB] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E7EB] gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0B2115] text-[#9FE846] flex items-center justify-center font-bold shrink-0">
              <Radio className="w-4 h-4 text-[#9FE846]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#0B2115] tracking-tight truncate">
                  Live OSINT Ingress Stream
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9FE846] animate-pulse" />
                  <span>Multi-Platform OSINT</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                Real-Time Ingestion (X • Telegram • Facebook • Reddit) &bull; Problem Statement SKIT004
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-[#F3F5F6] text-gray-600 font-medium flex items-center gap-1.5 border border-[#E5E7EB]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2115]" />
              <span>Poll ({pollCountdown}s)</span>
            </span>

            <button
              onClick={refreshNow}
              disabled={osintLoading}
              className="px-3 py-1 rounded-lg bg-[#0B2115] hover:bg-[#153423] text-white font-medium flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 text-xs shadow-sm"
              title="Poll multi-platform intelligence stream now"
            >
              <RefreshCw className={`w-3 h-3 ${osintLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{osintLoading ? 'Syncing...' : 'Poll Stream'}</span>
            </button>
          </div>
        </div>

        {/* Active Vector Filter Banner */}
        {selectedVector && selectedVector !== 'All Vectors' && (
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#F3FAEB] border border-[#9FE846]/50 text-xs font-mono text-[#0B2115]">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#5C901A]" />
              <span>
                Filtered by threat vector: <strong className="font-bold underline">{selectedVector}</strong> ({threatsToDisplay.length} {threatsToDisplay.length === 1 ? 'threat' : 'threats'} active)
              </span>
            </div>
            <button
              onClick={() => setVectorFilter && setVectorFilter('All Vectors', 'All')}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#5C901A] hover:text-[#0B2115] cursor-pointer bg-white px-2 py-0.5 rounded border border-[#9FE846]/40 hover:border-[#0B2115] transition-all"
            >
              <X className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}

        {/* Live Threat Cards Grid (Flat Thin Border Cards) */}
        {threatsToDisplay.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-xl border border-dashed border-[#E5E7EB] bg-[#F3F5F6]/50 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#5C901A] mx-auto" />
            <div className="text-sm font-semibold text-[#0B2115]">
              No threats detected matching &ldquo;{selectedVector}&rdquo;
            </div>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Perimeter sensors are currently quiet for this vector. Telemetry is monitored 24/7 across all multi-platform OSINT channels.
            </p>
            <button
              onClick={() => setVectorFilter && setVectorFilter('All Vectors', 'All')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2115] text-[#9FE846] text-xs font-semibold cursor-pointer hover:bg-[#153423] transition-colors"
            >
              <span>Reset to All Vectors</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
            {threatsToDisplay.slice(0, 6).map((threat) => {
            const isCrit = threat.riskLevel === 'Critical';
            const isHigh = threat.riskLevel === 'High';
            const isMed = threat.riskLevel === 'Medium';
            const isMitigated = mitigationStates?.[threat.id] === 'mitigated' || threat.status === 'mitigated';

            return (
              <div
                key={threat.id}
                onClick={() => setActiveThreatDetail(threat)}
                className={`flex flex-col h-full bg-white border rounded-xl p-5 overflow-hidden transition-all cursor-pointer group ${
                  isMitigated
                    ? 'border-[#9FE846]/40 bg-[#F3FAEB]/30'
                    : 'border-[#E5E7EB] hover:border-[#0B2115]/40'
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
                    {isMitigated ? (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9FE846]" />
                        <span>Mitigated</span>
                      </span>
                    ) : isCrit || isHigh ? (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>{threat.riskLevel} Threat</span>
                      </span>
                    ) : isMed ? (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <span>Medium</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 flex items-center gap-1">
                        <span>Low</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{threat.timestamp || 'Live'}</span>
                    </span>
                  </div>

                  {/* Threat Title */}
                  <h4 className={`text-sm font-semibold leading-snug line-clamp-2 mb-1.5 transition-all ${
                    isMitigated
                      ? 'text-gray-400 line-through'
                      : 'text-[#0B2115] group-hover:text-[#5C901A]'
                  }`}>
                    {threat.title}
                  </h4>

                  {/* Threat Narrative Body */}
                  <p className={`text-xs line-clamp-2 leading-relaxed mb-3 ${
                    isMitigated ? 'text-gray-400 line-through' : 'text-gray-600'
                  }`}>
                    {threat.content}
                  </p>

                  {/* AI Explanation Box */}
                  <div className="p-2.5 rounded-lg bg-[#F3FAEB] border border-[#9FE846]/30 mb-3">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#0B2115] mb-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-[#0B2115] shrink-0" />
                      <span>Forensic Analysis:</span>
                    </div>
                    <p className="text-[11px] text-[#0B2115] leading-snug line-clamp-2 font-mono">
                      {threat.aiExplanation}
                    </p>
                  </div>
                </div>

                {/* Fix 2: Push Footer to Bottom (Alignment) */}
                <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5C901A] shrink-0" />
                      <span className="truncate">{threat.platform || 'OSINT'} Intercept</span>
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {threat.id}
                    </span>
                  </div>

                  {/* Fix 3 & 4: Button Row Wrapping and whitespace-nowrap */}
                  <div className="flex flex-row flex-wrap items-center gap-2">
                    <a
                      href={threat.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#0B2115] hover:bg-[#F3FAEB] hover:border-[#9FE846]/40 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      <span>{threat.platform || 'Origin'} ↗</span>
                    </a>

                    {/* Interactive Simulated Takedown Button */}
                    <TakedownButton threat={threat} />

                    {/* Correlate Actor Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDossierThreat(threat);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E5E7EB] text-[#0B2115] hover:bg-[#F3FAEB] hover:text-[#5C901A] hover:border-[#9FE846]/40 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                      title="Correlate threat actor identity across platforms"
                    >
                      <User className="w-3 h-3 text-gray-500" />
                      <span>Correlate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </section>

      {/* 4. Thematic Bot Swarms & Threat Clusters Summary (Flat Design) */}
      <section
        aria-label="Thematic Threat Clusters"
        className="w-full bg-white rounded-xl p-5 border border-[#E5E7EB] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0B2115] text-[#9FE846] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#9FE846]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0B2115] truncate">
                Coordinated Bot Swarms & Threat Clusters
              </h3>
              <p className="text-xs text-gray-500 truncate">
                AI classification into coordinated disinformation, credential leaks, and zero-day exploits
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 shrink-0">
            {thematicClusters.length} Active Swarms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {thematicClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-4 rounded-xl bg-white border border-[#E5E7EB] flex flex-col justify-between min-w-0"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#0B2115] border border-[#E5E7EB]">
                    {cluster.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      cluster.severity === 'Critical'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : cluster.severity === 'High'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {cluster.severity}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0B2115] mb-1 truncate">
                  {cluster.name}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {cluster.narrative}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-mono text-gray-500">
                <span>{cluster.postsCount} nodes</span>
                <span className="text-[#5C901A] font-semibold">{cluster.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Threat Telemetry Detail Modal */}
      <AnimatePresence>
        {activeThreatDetail && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs"
          >
            <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#0B2115]" />
                  <h4 className="text-sm font-bold text-[#0B2115] uppercase tracking-wide">
                    Threat Intercept Manifest
                  </h4>
                </div>
                <button
                  onClick={() => setActiveThreatDetail(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-500 font-mono block mb-1">INCIDENT TITLE</span>
                  <div className="font-semibold text-[#0B2115]">{activeThreatDetail.title}</div>
                </div>
                <div>
                  <span className="text-gray-500 font-mono block mb-1">ORIGIN INGRESS</span>
                  <div className="font-mono text-gray-700">{activeThreatDetail.platform} &bull; {activeThreatDetail.author || 'Anonymous'}</div>
                </div>
                <div>
                  <span className="text-gray-500 font-mono block mb-1">RAW NARRATIVE</span>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-700 leading-relaxed border border-[#E5E7EB]">
                    {activeThreatDetail.content}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 font-mono block mb-1">FORENSIC VERDICT</span>
                  <p className="p-3 bg-[#F3FAEB] rounded-lg text-[#0B2115] leading-relaxed font-mono border border-[#9FE846]/30">
                    {activeThreatDetail.aiExplanation}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                <a
                  href={activeThreatDetail.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#0B2115] hover:text-[#5C901A] hover:underline flex items-center gap-1"
                >
                  <span>View Source ↗</span>
                </a>
                <button
                  onClick={() => setActiveThreatDetail(null)}
                  className="px-4 py-1.5 bg-[#0B2115] hover:bg-[#153423] text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Cross-Platform Identity Correlation Dossier Modal */}
      <ActorDossierModal
        isOpen={Boolean(selectedDossierThreat)}
        onClose={() => setSelectedDossierThreat(null)}
        threat={selectedDossierThreat}
        onPreFillDispatch={() => {}}
      />
    </div>
  );
}
