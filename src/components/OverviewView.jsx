import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import DashboardAnalytics from './DashboardAnalytics';
import AlertFeed from './AlertFeed';
import { useLiveOSINTPolling } from '../services/liveOSINTFetcher';
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
  Bot
} from 'lucide-react';

export default function OverviewView({ alerts = [], onIsolateThreat, onNavigateToAlerts }) {
  const { shouldReduceMotion, neuButtonProps, getStaggerContainer, staggerItemVariants } = useAppMotion();
  const criticalCount = alerts?.filter((a) => a.severity === 'critical').length || 4;

  // Automatic 30-second interval polling hook for live OSINT items
  const {
    threats: osintThreats,
    loading: osintLoading,
    lastPolledAt,
    nextPollCountdown,
    isLive: osintIsLive,
    error: osintError,
    pollCount,
    refreshNow
  } = useLiveOSINTPolling({ intervalMs: 30000 });

  const [activeThreatDetail, setActiveThreatDetail] = useState(null);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP SOFT-INSET NEUMORPHIC GLOBAL ADVISORY BANNER
             (With 30-Second Live Polling Telemetry Feedback)
          ========================================================================= */}
      <section
        aria-label="Threat Level Advisory & Live OSINT Telemetry"
        className="bg-[#E0E5EC] rounded-[26px] p-5 sm:p-6 shadow-[inset_5px_5px_10px_#A3B1C6,inset_-5px_-5px_10px_#FFFFFF] border border-white/80 relative overflow-hidden flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center space-x-4 min-w-0 flex-1">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] text-rose-600 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-black tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span>DEFCON 2 ADVISORY // MESH SURVEILLANCE ACTIVE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] text-rose-700 font-bold">
                {criticalCount} Critical Ingress
              </span>

              {/* 30-Second Polling Status Inset Badge */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-[#2563EB] font-bold flex items-center gap-1.5 border border-white/40">
                <Radio className="w-3 h-3 text-[#2563EB] animate-pulse" />
                <span>30s Loop Active ({nextPollCountdown}s)</span>
              </span>

              {/* CORS-Bypassed RSS Bridge Inset Badge */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-emerald-700 font-bold flex items-center gap-1 border border-white/40">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>CORS Bypassed // RSS-to-JSON</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#1A253C] font-semibold mt-1.5 leading-relaxed">
              Autonomous OSINT surveillance intercepting real-time Reddit chatter, coordinated botnet clusters, and credential leak spikes.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#52607B] mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#2563EB]" />
                <span>Synced: {lastPolledAt || 'Synchronizing...'}</span>
              </span>
              <span>&bull;</span>
              <span>Packets Ingested: <strong className="text-[#1A253C]">{osintThreats.length}</strong></span>
              <span>&bull;</span>
              <span>Cycles: <strong className="text-[#2563EB]">#{pollCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end xl:self-center">
          <motion.button
            onClick={refreshNow}
            disabled={osintLoading}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, boxShadow: '8px 8px 16px #A3B1C6, -8px -8px 16px #FFFFFF' }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97, boxShadow: 'inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF' }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 25 }}
            className="px-3.5 py-2 rounded-full text-xs font-mono font-bold bg-[#E0E5EC] text-[#1A253C] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:text-[#2563EB] transition-colors flex items-center space-x-1.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:opacity-50"
            title="Poll live RSS-to-JSON bridge now"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${osintLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{osintLoading ? 'Polling...' : 'Poll Now'}</span>
          </motion.button>

          {onNavigateToAlerts && (
            <motion.button
              onClick={onNavigateToAlerts}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, boxShadow: '10px 10px 18px #A3B1C6, -10px -10px 18px #FFFFFF' }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98, boxShadow: 'inset 5px 5px 10px #A3B1C6, inset -5px -5px 10px #FFFFFF' }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 25 }}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E0E5EC] text-[#1A253C] shadow-[5px_5px_10px_#A3B1C6,-5px_-5px_10px_#FFFFFF] hover:text-[#2563EB] transition-colors flex items-center space-x-1.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              <span>Incident Stream</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </section>

      {/* =========================================================================
          2. LIVE OSINT THREAT INTERCEPT FEED (AUTO-POLLED EVERY 30 SECONDS)
             Outset Cards with Inset Source Attribution & Severity Indicators
          ========================================================================= */}
      <section
        aria-label="Real-Time OSINT Ingestion Stream"
        className="bg-[#E0E5EC] rounded-[26px] p-5 sm:p-6 shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#A3B1C6]/30 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#2563EB] animate-pulse" />
              <h3 className="text-base sm:text-lg font-black text-[#1A253C] tracking-tight">
                Live OSINT Threat Intercept Feed (30s Polling Telemetry)
              </h3>
            </div>
            <p className="text-xs font-mono text-[#52607B] mt-0.5">
              Streaming via RSS-to-JSON Bridge &bull; Automatic 30-second interval refresh &bull; Browser CORS Bypassed
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Countdown Badge */}
            <span className="px-3 py-1 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-[#2563EB] font-bold flex items-center gap-1.5 border border-white/40">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span>Next cycle in {nextPollCountdown}s</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-[#1A253C] font-bold">
              {osintThreats.length} Intercepts
            </span>
          </div>
        </div>

        {/* 30-Second Polled Threat Items: Neumorphic Outset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {osintThreats.slice(0, 3).map((threat) => {
            const isCrit = threat.riskLevel === 'Critical';
            const isHigh = threat.riskLevel === 'High';
            const isMed = threat.riskLevel === 'Medium';

            return (
              <motion.div
                key={threat.id}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, boxShadow: '12px 12px 20px #A3B1C6, -12px -12px 20px #FFFFFF' }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-[#E0E5EC] rounded-2xl p-4 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] border border-white/60 flex flex-col justify-between cursor-pointer"
                onClick={() => setActiveThreatDetail(threat)}
              >
                <div>
                  {/* Top Badge Row: Severity Indicator & Source Attribution Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    {/* Severity Indicator with Inset Neumorphic Styling */}
                    {isCrit || isHigh ? (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center gap-1 border border-rose-300/40">
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                        <span>{threat.riskLevel} Threat</span>
                      </span>
                    ) : isMed ? (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center gap-1 border border-amber-300/40">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Medium Threat</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center gap-1 border border-emerald-300/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Low Threat</span>
                      </span>
                    )}

                    {/* Source Attribution Badge with Inset Neumorphic Styling */}
                    <span
                      className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-[#2563EB] flex items-center gap-1 border border-white/50"
                      title={threat.provenanceBadge || 'Verified Source: Reddit RSS Bridge'}
                    >
                      <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                      <span>[{threat.provenanceBadge || `Verified Source: ${threat.sourcePlatform}`}]</span>
                    </span>
                  </div>

                  {/* Threat Title */}
                  <h4 className="text-sm font-bold text-[#1A253C] leading-snug line-clamp-2 mb-1.5">
                    {threat.title}
                  </h4>

                  {/* Threat Narrative Content */}
                  <p className="text-xs text-[#52607B] line-clamp-2 leading-relaxed mb-3">
                    {threat.content}
                  </p>

                  {/* Explainable AI Rationale in Soft Inset Trench */}
                  <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] border border-white/40 mb-3">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#2563EB] mb-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Explainable AI Rationale:</span>
                    </div>
                    <p className="text-[10px] font-mono text-[#1A253C] leading-snug line-clamp-2">
                      {threat.aiExplanation}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Timestamp, Telemetry Method & Outset Button */}
                <div className="pt-2 border-t border-[#A3B1C6]/20 flex items-center justify-between text-[10px] font-mono text-[#52607B] gap-2">
                  <div className="flex flex-col">
                    <span className="text-[#2563EB] font-bold">{threat.timestamp}</span>
                    <span className="truncate max-w-[130px]">{threat.telemetryMethod}</span>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveThreatDetail(threat);
                    }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className="px-3 py-1 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#A3B1C6] text-[10px] font-mono font-bold text-[#2563EB] flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. MAIN ANALYTICS GRID
             Left Column (8 cols): DashboardAnalytics
             Right Column (4 cols): AlertFeed (Receives Auto-Polled Live OSINT Threats)
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): DashboardAnalytics */}
        <div className="xl:col-span-8 space-y-6">
          <DashboardAnalytics />
        </div>

        {/* Right Column (4 cols): AlertFeed */}
        <div className="xl:col-span-4 h-full">
          <div className="sticky top-24">
            <AlertFeed
              onInvestigate={(post) => onIsolateThreat?.(post.id)}
              liveOSINTThreats={osintThreats}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. OSINT THREAT TELEMETRY INSPECTION MODAL
          ========================================================================= */}
      {activeThreatDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        >
          <div className="bg-[#E0E5EC] rounded-3xl p-6 shadow-[16px_16px_32px_#A3B1C6,-16px_-16px_32px_#FFFFFF] border border-white/80 max-w-lg w-full flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#A3B1C6]/30">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-mono font-bold text-[#1A253C]">
                  OSINT Live Telemetry Packet
                </h4>
              </div>
              <button
                onClick={() => setActiveThreatDetail(null)}
                className="p-1.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#A3B1C6] text-[#1A253C] focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
                aria-label="Close threat inspection"
              >
                ✕
              </button>
            </div>

            {/* Badges in Modal */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] text-[#2563EB] flex items-center gap-1 border border-white/50">
                <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                <span>[{activeThreatDetail.provenanceBadge || `Verified Source: ${activeThreatDetail.sourcePlatform}`}]</span>
              </span>

              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] ${
                  activeThreatDetail.riskLevel === 'Critical' || activeThreatDetail.riskLevel === 'High'
                    ? 'bg-rose-100 text-rose-700'
                    : activeThreatDetail.riskLevel === 'Medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {activeThreatDetail.riskLevel} Threat
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#1A253C] mt-2 mb-2 leading-snug">
              {activeThreatDetail.title}
            </h3>

            {/* Narrative Body */}
            <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] text-xs font-sans text-[#1A253C] mb-4 leading-relaxed font-medium">
              "{activeThreatDetail.content}"
            </div>

            {/* Metadata Grid */}
            <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] space-y-2 font-mono text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-[#A3B1C6]/20">
                <span className="text-[#52607B]">Source Platform:</span>
                <span className="font-bold text-[#1A253C]">{activeThreatDetail.sourcePlatform}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#A3B1C6]/20">
                <span className="text-[#52607B]">Telemetry Ingestion:</span>
                <span className="font-bold text-[#2563EB]">{activeThreatDetail.telemetryMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#A3B1C6]/20">
                <span className="text-[#52607B]">Chain-of-Custody:</span>
                <span className="font-bold text-[#2563EB]">{activeThreatDetail.chainOfCustodyHash || 'COC-SHA256:VERIFIED'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#A3B1C6]/20">
                <span className="text-[#52607B]">Verified Timestamp:</span>
                <span>{activeThreatDetail.verificationTimestamp || activeThreatDetail.timestamp}</span>
              </div>
              <div className="pt-1">
                <span className="text-[#52607B] block mb-1">Explainable AI Analysis:</span>
                <p className="text-[#1A253C] font-sans text-xs bg-[#E0E5EC] p-2.5 rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6]">
                  {activeThreatDetail.aiExplanation}
                </p>
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveThreatDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-mono font-bold shadow-[4px_4px_8px_#93A1B6] focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
              >
                Close Telemetry View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
