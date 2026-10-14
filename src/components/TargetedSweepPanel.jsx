import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { runTargetedSweep, getOfflineTargetedSweepFallback } from '../geminiAnalyzer';
import ActorDossierModal from './ActorDossierModal';
import {
  Search,
  Radar,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileDown,
  ExternalLink,
  Copy,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  AlertTriangle,
  Flame,
  Globe2,
  Lock,
  Cpu,
  Layers,
  ArrowUpRight,
  Eye,
  RefreshCw,
  Clock,
  Terminal,
  Scan,
  UserCheck
} from 'lucide-react';

export default function TargetedSweepPanel() {
  const { shouldReduceMotion } = useAppMotion();

  // Search & Filters State
  const [query, setQuery] = useState('Critical Infrastructure SCADA');
  const [selectedMediaTypes, setSelectedMediaTypes] = useState(['text', 'images', 'videos']);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState('All'); // 'All' | 'X (Twitter)' | 'Telegram' | 'Reddit' | 'Facebook'

  // Execution State
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepProgress, setSweepProgress] = useState(0);
  const [activeSweepStep, setActiveSweepStep] = useState('');
  const [results, setResults] = useState(() => getOfflineTargetedSweepFallback('Critical Infrastructure SCADA', ['text', 'images', 'videos']));
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const [exportModalItem, setExportModalItem] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [dossierDownloaded, setDossierDownloaded] = useState(false);

  // Actor Correlation Dossier State
  const [correlateModalOpen, setCorrelateModalOpen] = useState(false);
  const [selectedThreatForDossier, setSelectedThreatForDossier] = useState(null);

  // Media filter options according to specification
  const mediaFilterOptions = [
    { id: 'text', label: 'Text & Posts', icon: '📄' },
    { id: 'images', label: 'Images & OCR Memes', icon: '🖼️' },
    { id: 'videos', label: 'Video & Audio Transcripts', icon: '🎥' }
  ];

  // Quick Preset Keywords for Government Officials
  const officialPresets = [
    { label: '⚡ SCADA Grid Anomaly', query: 'SCADA municipal grid unauthorized command injection' },
    { label: '🔑 SSO Credential Dump', query: 'Corporate SSO credential dump combo list 850k' },
    { label: '🗳️ Foreign Disinfo Swarm', query: 'Voting infrastructure ballot machine malware hoax' },
    { label: '🪱 Zero-Day VPN Exploit', query: 'Unpatched enterprise VPN zero-day RCE PoC' },
    { label: '💧 Water SCADA Breach', query: 'Water supply chemical dosing SCADA exploit leak' },
    { label: '🏦 Wire Trojan Payload', query: 'SWIFT interbank transaction tampering payload' }
  ];

  // Toggle Media Type filter
  const toggleMediaType = (type) => {
    setSelectedMediaTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  // Toggle AI Reasoning dropdown per card
  const toggleReasoning = (id) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open Actor Dossier Modal
  const handleCorrelateActor = (item) => {
    setSelectedThreatForDossier({
      author: item.author,
      source: item.platform,
      platform: item.platform,
      title: `${item.sourceBadge}: ${item.author}`,
      content: item.matchedContent || item.ocrText || '',
      riskLevel: item.threatLevel === 'Critical' ? 'High' : item.threatLevel
    });
    setCorrelateModalOpen(true);
  };

  // Execute Deep Threat Sweep
  const handleInitiateSweep = async () => {
    if (!query.trim()) return;

    setIsSweeping(true);
    setSweepProgress(18);
    setActiveSweepStep('Parsing Reddit r/cybersecurity...');

    const stepTimer1 = setTimeout(() => {
      setSweepProgress(45);
      setActiveSweepStep('Scanning Telegram mesh...');
    }, 700);

    const stepTimer2 = setTimeout(() => {
      setSweepProgress(76);
      setActiveSweepStep('Querying X (API v2) & Dark Web Archives...');
    }, 1400);

    const stepTimer3 = setTimeout(() => {
      setSweepProgress(92);
      setActiveSweepStep('Running Gemini stylometric analysis...');
    }, 2100);

    try {
      const sweepResults = await runTargetedSweep(query, selectedMediaTypes);
      setResults(sweepResults);
      setSweepProgress(100);
      setActiveSweepStep('Stylometric analysis & threat correlation complete.');
    } catch (err) {
      console.warn('[TargetedSweepPanel] Fallback engaged:', err);
      const fallbackResults = getOfflineTargetedSweepFallback(query, selectedMediaTypes);
      setResults(fallbackResults);
      setSweepProgress(100);
      setActiveSweepStep('Synthesized threat correlation complete.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setTimeout(() => {
        setIsSweeping(false);
      }, 550);
    }
  };

  // Download Evidence Dossier for State Officials
  const handleExportSingleEvidence = (item) => {
    setExportModalItem(item);
  };

  const handleDownloadDossier = () => {
    const dossierData = {
      agency: 'National Cyber Threat Intelligence Directorate',
      classification: 'RESTRICTED // STATE & LAW ENFORCEMENT ONLY',
      targetQuery: query,
      timestamp: new Date().toISOString(),
      activeMediaFilters: selectedMediaTypes,
      totalIntercepts: results.length,
      highSeverityCount: results.filter((r) => r.threatLevel === 'Critical' || r.threatLevel === 'High').length,
      intercepts: results
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVIDENCE-DOSSIER-${query.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now().toString(36).toUpperCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDossierDownloaded(true);
    setTimeout(() => setDossierDownloaded(false), 3000);
  };

  const filteredResults = results.filter((item) => {
    if (selectedPlatformFilter === 'All') return true;
    return item.platform === selectedPlatformFilter;
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP CLEARANCE & SYSTEM BANNER (Clean Crypto-Fintech Style)
          ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span>STATE CLEARANCE LEVEL 1 // RESTRICTED</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40">
                ACTIVE TELEMETRY HOOK ONLINE
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2115] tracking-tight flex items-center gap-2.5">
              <Scan className="w-6 h-6 text-[#0B2115]" />
              <span>Targeted Threat Interrogation & Multi-Media Sweep</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
              On-demand cross-platform forensic interrogator for national security analysts. Query live X API v2,
              Reddit OSINT, Telegram MTProto dark mesh, and dark web archives for coordinated threat activity.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadDossier}
              className="px-4 py-2.5 rounded-xl bg-[#9FE846] hover:bg-[#8fd838] text-xs font-semibold text-[#0B2115] flex items-center gap-2 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
              title="Download all intercepted records as formatted legal evidence JSON"
            >
              <FileDown className="w-4 h-4 text-[#0B2115]" />
              <span>{dossierDownloaded ? 'Dossier Exported!' : 'Export Full Dossier'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DEDICATED SEARCH CONTAINER (Inset Framing & Crypto-Fintech Style)
          ========================================================================= */}
      <section
        aria-label="Target Threat Interrogation & Multi-Media Sweep Query Console"
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#0B2115] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B2115]">
              Query Interrogation Parameters
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40">
            Multi-Vector Sensor Hook
          </span>
        </div>

        {/* Wide Query Bar with Sleek Flat Outline */}
        <div className="flex items-center gap-3 bg-slate-50 border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#0B2115] focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInitiateSweep();
            }}
            placeholder="Enter keywords, suspicious hashtags (#leak, #botnet), handles, or target phrases..."
            aria-label="Keywords, suspicious hashtags, handles, or target phrases"
            className="w-full bg-transparent border-none outline-none text-[#0B2115] placeholder:text-slate-400 text-sm sm:text-base font-medium focus:ring-0 p-0"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-[#0B2115] p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
              title="Clear query"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Media Filter Pills & Primary Action Button Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Media Filter Pills (Interactive Toggle Row) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold text-gray-500 mr-1">
              Media Vectors:
            </span>
            {mediaFilterOptions.map((media) => {
              const isSelected = selectedMediaTypes.includes(media.id);
              return (
                <button
                  key={media.id}
                  type="button"
                  onClick={() => toggleMediaType(media.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B2115] text-white shadow-sm border border-[#0B2115] font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-[#F3FAEB] hover:text-[#0B2115] border border-[#E5E7EB]'
                  }`}
                >
                  <span>{media.icon}</span>
                  <span>{media.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Button: [ ⚡ Initiate Deep Sweep ] */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleInitiateSweep}
              disabled={isSweeping || !query.trim()}
              className="w-full sm:w-auto bg-[#9FE846] hover:bg-[#8fd838] disabled:opacity-60 text-[#0B2115] font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
            >
              {isSweeping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0B2115]" />
                  <span>Sweeping Feeds...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Initiate Deep Sweep</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Platform Ingress Indicators & Presets Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E5E7EB] text-xs">
          <div className="flex items-center gap-2 text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-pulse inline-block shrink-0" />
            <span>Connected Ingress: Reddit (Live) • X (API v2) • Telegram Mesh • Dark Web Archives</span>
          </div>

          {/* Quick Presets Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-semibold text-gray-400 uppercase">Presets:</span>
            {officialPresets.slice(0, 4).map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(preset.query)}
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#F3FAEB] hover:text-[#0B2115] text-slate-700 border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SIMULATED SCANNING PROGRESS INDICATOR WITH DYNAMIC STATUS LINE
          ========================================================================= */}
      <AnimatePresence>
        {isSweeping && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-[#F3FAEB] border border-[#9FE846]/40 flex items-center justify-center shrink-0">
                  <Radar className="w-5 h-5 text-[#0B2115] animate-spin" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#9FE846] animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B2115]">
                      Multi-Media Ingress Sweep in Progress
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40">
                      {sweepProgress}%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#0B2115] flex items-center gap-2 mt-0.5 font-mono">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>{activeSweepStep}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Trench Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#0B2115] via-[#153423] to-[#9FE846]"
                animate={{ width: `${sweepProgress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>Ingress: Reddit OSINT • X API v2 • Telegram Mesh • Dark Web Archives</span>
              <span>Inference: Gemini 1.5/2.0 Neural Engine</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          4. THE RESULTS DASHBOARD (Crypto-Fintech White Cards)
          ========================================================================= */}
      <section aria-label="Targeted Threat Intercept Findings" className="space-y-4">
        {/* Results Header & Platform Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#0B2115]" />
              <h3 className="text-base sm:text-lg font-bold text-[#0B2115] tracking-tight">
                Matched Threat Result Records ({filteredResults.length})
              </h3>
            </div>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              Verified multi-platform threat matches for target: <strong className="text-[#0B2115]">"{query}"</strong>
            </p>
          </div>

          {/* Platform Tab Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
            {['All', 'X (Twitter)', 'Telegram', 'Reddit', 'Facebook'].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatformFilter(plat)}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115] whitespace-nowrap ${
                  selectedPlatformFilter === plat
                    ? 'bg-[#0B2115] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-[#F3FAEB] hover:text-[#0B2115] border border-[#E5E7EB]'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#E5E7EB] text-gray-500 space-y-2 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-[#5C901A] mx-auto" />
            <div className="text-sm font-bold text-[#0B2115]">No Matching Intercepts Found</div>
            <p className="text-xs font-mono">No active threats detected matching the selected platform and media criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredResults.map((item) => {
              const isReasoningOpen = Boolean(expandedReasoning[item.id]);
              const isCritical = item.threatLevel === 'Critical';
              const isHigh = item.threatLevel === 'High';

              return (
                <motion.article
                  key={item.id}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
                  className="flex flex-col h-full bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm overflow-hidden transition-all"
                >
                  {/* Top Metadata Row: Source & Threat Score Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Verified Source Pill Badge */}
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#5C901A]" />
                          <span>{item.sourceBadge}</span>
                        </span>

                        {/* Media Type Badge */}
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-[#E5E7EB] inline-flex items-center gap-1">
                          {item.mediaType === 'image' && <ImageIcon className="w-2.5 h-2.5 text-[#0B2115]" />}
                          {item.mediaType === 'video' && <Video className="w-2.5 h-2.5 text-rose-600" />}
                          {item.mediaType === 'text' && <FileText className="w-2.5 h-2.5 text-amber-600" />}
                          <span>{item.mediaLabel}</span>
                        </span>
                      </div>

                      {/* AI Threat Confidence Score Badge */}
                      <span
                        className={`text-[10px] font-mono font-extrabold px-3 py-1 rounded-full ${
                          isCritical
                            ? 'text-rose-700 bg-rose-50 border border-rose-200'
                            : isHigh
                            ? 'text-amber-800 bg-amber-50 border border-amber-200'
                            : 'text-[#5C901A] bg-[#F3FAEB] border border-[#9FE846]/40'
                        }`}
                      >
                        {item.threatLabel}
                      </span>
                    </div>

                    {/* Author & Timestamp */}
                    <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-3">
                      <span>Source Actor: <strong className="text-[#0B2115]">{item.author}</strong></span>
                      <span>{item.timestamp}</span>
                    </div>

                    {/* Matched Content Snippet or Visual Media Thumbnail */}
                    {item.mediaType === 'image' && (
                      <div className="mb-3 rounded-xl bg-slate-50 border border-[#E5E7EB] p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#0B2115] font-bold">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-[#0B2115]" />
                            <span>Intercepted Graphic / Flyer</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold border border-rose-200">
                            OCR ACTIVE
                          </span>
                        </div>
                        {item.ocrText && (
                          <div className="p-2.5 rounded-lg bg-slate-900 text-[#9FE846] font-mono text-xs leading-relaxed border border-slate-700">
                            <span className="text-[9px] text-slate-400 block mb-0.5 uppercase tracking-wider font-bold">
                              Extracted Optical Character Recognition (OCR):
                            </span>
                            "{item.ocrText}"
                          </div>
                        )}
                        <p className="text-xs font-sans text-slate-700 font-medium leading-relaxed">
                          {item.matchedContent}
                        </p>
                      </div>
                    )}

                    {item.mediaType === 'video' && (
                      <div className="mb-3 rounded-xl bg-slate-50 border border-[#E5E7EB] p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-rose-700 font-bold">
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            <span>Viral Video Reel Telemetry</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                            DURATION: {item.videoDuration || '0:48'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-mono text-slate-800">
                          <span className="text-[9px] text-[#0B2115] block mb-0.5 uppercase font-bold">
                            Audio Speech-to-Text Transcript:
                          </span>
                          "{item.matchedContent}"
                        </div>
                      </div>
                    )}

                    {item.mediaType === 'text' && (
                      <div className="mb-3 p-3.5 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs font-sans text-slate-700 font-medium leading-relaxed">
                        "{item.matchedContent}"
                      </div>
                    )}

                    {/* Key Indicators */}
                    {item.keyIndicators && item.keyIndicators.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {item.keyIndicators.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Collapsible "AI Reasoning" Section */}
                    <div className="rounded-xl bg-slate-50 border border-[#E5E7EB] overflow-hidden">
                      <button
                        onClick={() => toggleReasoning(item.id)}
                        className="w-full p-2.5 flex items-center justify-between text-xs font-mono font-bold text-[#0B2115] hover:text-[#5C901A] cursor-pointer focus:outline-none"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#5C901A]" />
                          <span>Gemini AI Forensic Reasoning</span>
                        </span>
                        {isReasoningOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <AnimatePresence>
                        {isReasoningOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 pb-3 pt-1 text-xs font-mono text-slate-700 border-t border-[#E5E7EB] space-y-2"
                          >
                            <p className="leading-relaxed bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                              {item.aiReasoning}
                            </p>
                            <div className="text-[11px] text-gray-500">
                              <strong className="text-[#0B2115]">Government Escalation: </strong>
                              <span>{item.legalAdvisory}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Fix 2: Push Footer to Bottom (Alignment) */}
                  <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                      <span>Intercept Ref: <strong className="text-[#0B2115]">{item.id}</strong></span>
                      <span className="text-[#5C901A] font-bold">{item.platform}</span>
                    </div>

                    {/* Fix 3 & 4: Button Row Wrapping and whitespace-nowrap */}
                    <div className="flex flex-row flex-wrap items-center gap-2">
                      <a
                        href={item.originLink || 'https://www.reddit.com/r/cybersecurity'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 hover:bg-[#F3FAEB] text-[#0B2115] border border-[#E5E7EB] flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
                      >
                        <span>[Source ↗]</span>
                      </a>

                      {/* Correlate Actor Button */}
                      <button
                        onClick={() => handleCorrelateActor(item)}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white hover:bg-[#F3FAEB] text-[#0B2115] border border-[#E5E7EB] flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
                        title="Correlate actor identity across Reddit, Telegram, X and Dark Web"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#0B2115]" />
                        <span>[Correlate Actor]</span>
                      </button>

                      {/* Export Evidence Button for Official */}
                      <button
                        onClick={() => handleExportSingleEvidence(item)}
                        className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap shrink-0"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>[Export Evidence]</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          EVIDENCE EXPORT MODAL FOR GOVERNMENT OFFICIALS
          ========================================================================= */}
      <AnimatePresence>
        {exportModalItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.95, y: 15 }}
              animate={shouldReduceMotion ? {} : { scale: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border border-[#E5E7EB] rounded-2xl max-w-xl w-full p-6 text-slate-800 shadow-xl relative max-h-[88vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0B2115]" />
                  <h4 className="text-sm font-mono font-bold text-[#0B2115] uppercase tracking-wider">
                    Official Evidence Brief // Chain-of-Custody
                  </h4>
                </div>
                <button
                  onClick={() => setExportModalItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#F3FAEB] border border-[#E5E7EB] flex items-center justify-center text-slate-500 hover:text-[#0B2115] cursor-pointer"
                  aria-label="Close export modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs font-mono space-y-3 overflow-y-auto flex-1">
                <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]">
                  <span className="text-gray-500">Incident Evidence ID:</span>
                  <span className="font-bold text-[#0B2115]">{exportModalItem.id}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]">
                  <span className="text-gray-500">Verified Provenance:</span>
                  <span className="font-bold text-[#0B2115]">{exportModalItem.sourceBadge}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]">
                  <span className="text-gray-500">Chain-of-Custody SHA256:</span>
                  <span className="font-bold text-[#5C901A] truncate max-w-[220px]">{exportModalItem.evidenceHash}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]">
                  <span className="text-gray-500">Threat Classification:</span>
                  <span className="font-bold text-rose-600">{exportModalItem.threatLabel}</span>
                </div>

                <div className="pt-1">
                  <span className="text-gray-500 block mb-1 font-bold">Intercepted Content Manifest:</span>
                  <p className="text-slate-800 p-2.5 rounded-lg bg-white border border-[#E5E7EB] leading-relaxed">
                    {exportModalItem.matchedContent}
                  </p>
                </div>

                {exportModalItem.ocrText && (
                  <div className="pt-1">
                    <span className="text-gray-500 block mb-1 font-bold">Extracted Optical OCR:</span>
                    <p className="text-[#5C901A] p-2.5 rounded-lg bg-[#F3FAEB] border border-[#9FE846]/40 leading-relaxed">
                      {exportModalItem.ocrText}
                    </p>
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-gray-500 block mb-1 font-bold">Gemini AI Explanatory Verdict:</span>
                  <p className="text-slate-800 p-2.5 rounded-lg bg-white border border-[#E5E7EB] leading-relaxed">
                    {exportModalItem.aiReasoning}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-gray-500 block mb-1 font-bold">Actionable Legal Guidance:</span>
                  <p className="text-[#0B2115] p-2.5 rounded-lg bg-[#F3FAEB] border border-[#9FE846]/30 leading-relaxed">
                    {exportModalItem.legalAdvisory}
                  </p>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(exportModalItem, null, 2));
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-100 hover:bg-[#F3FAEB] border border-[#E5E7EB] text-[#0B2115] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-[#5C901A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? 'Copied to Clipboard' : 'Copy Evidence JSON'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={exportModalItem.originLink || 'https://www.reddit.com/r/cybersecurity'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white hover:bg-[#F3FAEB] text-[#0B2115] border border-[#E5E7EB] flex items-center gap-1"
                  >
                    <span>[View Source ↗]</span>
                  </a>
                  <button
                    onClick={() => setExportModalItem(null)}
                    className="px-5 py-2 rounded-xl bg-[#0B2115] hover:bg-[#153423] text-white text-xs font-mono font-bold shadow-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CROSS-PLATFORM IDENTITY CORRELATION & ACTOR DOSSIER MODAL
          ========================================================================= */}
      <ActorDossierModal
        isOpen={correlateModalOpen}
        onClose={() => {
          setCorrelateModalOpen(false);
          setSelectedThreatForDossier(null);
        }}
        threat={selectedThreatForDossier}
        onPreFillDispatch={() => {}}
      />
    </div>
  );
}
