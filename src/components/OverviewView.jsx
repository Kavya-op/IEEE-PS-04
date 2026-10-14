import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import PlatformMetricStrip from './PlatformMetricStrip';
import ThreatVelocityChart from './ThreatVelocityChart';
import { OfficerClearanceCard, IncidentDispatchCard } from './RightOperationalPanel';
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
  User
} from 'lucide-react';

export default function OverviewView({ alerts = [], onIsolateThreat, onNavigateToAlerts }) {
  const { shouldReduceMotion } = useAppMotion();
  const {
    liveThreats,
    loading: osintLoading,
    pollCountdown,
    thematicClusters,
    refreshNow,
    mitigationStates
  } = useOSINT();

  const [activeThreatDetail, setActiveThreatDetail] = useState(null);
  const [selectedDossierThreat, setSelectedDossierThreat] = useState(null);

  return (
    <div className="w-full space-y-6 overflow-hidden">
      {/* 1. Top Platform Metric Strip (Active Telemetry Nodes: 4 cards) */}
      <PlatformMetricStrip />

      {/* 2. Timeline / Volume Chart ("Candle/Timeline Charts" style) */}
      <ThreatVelocityChart />

      {/* 3. Investigator Profile & Incident Dispatch Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <OfficerClearanceCard />
        <IncidentDispatchCard />
      </div>

      {/* 4. Live OSINT Ingress Stream (Multi-Platform Feeds) - Crisp White Cards */}
      <section
        aria-label="Live OSINT Ingress Stream"
        className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-5 sm:p-6 border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-slate-800 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  Live OSINT Ingress Stream
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Multi-Platform OSINT</span>
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Real-Time Ingestion (X • Telegram • Facebook • Reddit) &bull; SKIT004 Government Threat Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span>Poll loop ({pollCountdown}s)</span>
            </span>

            <motion.button
              onClick={refreshNow}
              disabled={osintLoading}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              className="px-3 py-1 rounded-xl bg-[#2563EB] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
              title="Poll multi-platform intelligence stream now"
            >
              <RefreshCw className={`w-3 h-3 ${osintLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{osintLoading ? 'Syncing...' : 'Poll Now'}</span>
            </motion.button>
          </div>
        </div>

        {/* Live Threat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {liveThreats.slice(0, 6).map((threat) => {
            const isCrit = threat.riskLevel === 'Critical';
            const isHigh = threat.riskLevel === 'High';
            const isMed = threat.riskLevel === 'Medium';
            const isMitigated = mitigationStates?.[threat.id] === 'mitigated' || threat.status === 'mitigated';

            return (
              <motion.div
                key={threat.id}
                whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: '0 12px 28px rgba(37,99,235,0.08)' }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
                className={`min-w-0 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl p-4 border transition-all flex flex-col justify-between cursor-pointer group overflow-hidden ${
                  isMitigated
                    ? 'border-emerald-300 dark:border-emerald-800/60'
                    : 'border-[#E5E9F2] dark:border-slate-800 hover:border-[#2563EB]/40'
                }`}
                onClick={() => setActiveThreatDetail(threat)}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
                    {isMitigated ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Mitigated</span>
                      </span>
                    ) : isCrit || isHigh ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                        <span className="truncate">{threat.riskLevel} Threat</span>
                      </span>
                    ) : isMed ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">Medium</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">Low</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-[#2563EB]" />
                      <span>{threat.timestamp || 'Live'}</span>
                    </span>
                  </div>

                  {/* Threat Title (dimmed and struck-through when mitigated) */}
                  <h4 className={`text-sm font-bold leading-snug line-clamp-2 mb-2 transition-all ${
                    isMitigated
                      ? 'text-slate-400 opacity-50 line-through'
                      : 'text-slate-900 dark:text-white group-hover:text-[#2563EB]'
                  }`}>
                    {threat.title}
                  </h4>

                  {/* Threat Narrative Body (dimmed and struck-through when mitigated) */}
                  <p className={`text-xs line-clamp-2 leading-relaxed mb-3 transition-all ${
                    isMitigated
                      ? 'text-slate-400 opacity-50 line-through'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {threat.content}
                  </p>

                  {/* AI Explanation Box */}
                  <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 mb-3">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#2563EB] dark:text-blue-400 mb-0.5">
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      <span>Explainable AI Analysis:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-2 font-mono">
                      {threat.aiExplanation}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Verified Badge, Takedown Button & Clickable Link */}
                <div className="pt-2.5 border-t border-[#E5E9F2] dark:border-slate-800 flex items-center justify-between text-[11px] font-mono gap-1.5 min-w-0 flex-wrap">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold truncate">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate">{threat.platform || 'OSINT'} Intercept</span>
                  </span>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <a
                      href={threat.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-[#E5E9F2] dark:border-slate-700 text-[10px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 shadow-2xs hover:border-[#2563EB] transition-colors"
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
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      title="Correlate threat actor identity across platforms"
                    >
                      <User className="w-3 h-3" />
                      <span>Correlate Actor</span>
                    </button>

                    <span className="text-slate-400 group-hover:text-[#2563EB] transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Thematic Bot Swarms & Incident Clusters Summary */}
      <section
        aria-label="Thematic Threat Clusters"
        className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-5 sm:p-6 border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F2] dark:border-slate-800 min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                Coordinated Bot Swarms & Threat Clusters
              </h3>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                AI classification into coordinated disinformation narratives, credential leaks, and zero-day exploits
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
            {thematicClusters.length} Active Swarms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {thematicClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-[#E5E9F2] dark:border-slate-800 flex flex-col justify-between min-w-0"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#2563EB] border border-[#E5E9F2] dark:border-slate-700">
                    {cluster.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
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
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">
                  {cluster.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                  {cluster.narrative}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E9F2] dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{cluster.postsCount} nodes</span>
                <span className="text-emerald-600 font-bold">{cluster.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Threat Telemetry Detail Modal */}
      <AnimatePresence>
        {activeThreatDetail && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#151E32] rounded-2xl p-6 border border-[#E5E9F2] dark:border-slate-800 shadow-2xl max-w-lg w-full flex flex-col max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F2] dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-[#2563EB]" />
                  <h4 className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    OSINT Live Threat Telemetry Packet
                  </h4>
                </div>
                <button
                  onClick={() => setActiveThreatDetail(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                  <span>Verified Source: r/cybersecurity (Reddit Native API)</span>
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    activeThreatDetail.riskLevel === 'Critical' || activeThreatDetail.riskLevel === 'High'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {activeThreatDetail.riskLevel} Threat
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-2 font-mono">
                {activeThreatDetail.title}
              </h3>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-mono">
                "{activeThreatDetail.content}"
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs mb-4">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Source Platform:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">r/cybersecurity (Reddit Native API)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Ingress Pipeline:</span>
                  <span className="font-bold text-[#2563EB]">redditFetcher.js Live Polling</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Chain of Custody:</span>
                  <span className="font-bold text-[#2563EB]">COC-REDDIT-LIVE-HASH-9982</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Timestamp:</span>
                  <span>{activeThreatDetail.timestamp || 'Real-time Ingress'}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 block mb-1">Explainable AI Analysis:</span>
                  <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {activeThreatDetail.aiExplanation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E5E9F2] dark:border-slate-800">
                {activeThreatDetail.link ? (
                  <a
                    href={activeThreatDetail.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E9F2] dark:border-slate-700 text-[#2563EB] hover:text-[#1D4ED8] text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs hover:border-[#2563EB] transition-colors"
                  >
                    <span>View Reddit Post ↗</span>
                  </a>
                ) : <div />}

                <button
                  onClick={() => setActiveThreatDetail(null)}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-mono font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  Close Telemetry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Actor Dossier Modal */}
      <ActorDossierModal
        isOpen={!!selectedDossierThreat}
        onClose={() => setSelectedDossierThreat(null)}
        threat={selectedDossierThreat}
      />
    </div>
  );
}
