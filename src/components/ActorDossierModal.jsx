import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  ShieldAlert,
  Fingerprint,
  ExternalLink,
  Copy,
  Check,
  X,
  FileDown,
  Send,
  Sparkles,
  Radio,
  Clock,
  Layers,
  Scale,
  Hash
} from 'lucide-react';
import { correlateActorProfile, extractActorHandle } from '../services/identityCorrelator';

export default function ActorDossierModal({ isOpen, onClose, threat, onPreFillDispatch }) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const actorHandle = threat ? extractActorHandle(threat) : 'u/ShadowOperative';

  useEffect(() => {
    let isSubscribed = true;

    if (isOpen && threat) {
      setLoading(true);
      const postText = `${threat.title || ''} ${threat.content || ''}`;
      correlateActorProfile(actorHandle, postText)
        .then((result) => {
          if (isSubscribed) {
            setDossier(result);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error('[ActorDossierModal] Correlation failed:', err);
          if (isSubscribed) {
            setLoading(false);
          }
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, threat, actorHandle]);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJSON = () => {
    if (!dossier) return;
    const evidencePayload = {
      dossierClassification: 'LAW ENFORCEMENT RESTRICTED // SKIT004',
      investigationCaseId: `CASE-ACTOR-${String(dossier.primaryHandle).replace(/[^a-zA-Z0-9]/g, '_')}`,
      generationTimestamp: new Date().toISOString(),
      sourceThreatId: threat?.id || 'UNKNOWN',
      evidenceAuditChain: `SHA256-EVIDENCE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      primaryActor: dossier.primaryHandle,
      aiConfidenceScore: `${dossier.confidenceScore}%`,
      stylometricReasoning: dossier.stylometricMatch,
      correlatedCrossPlatformIdentities: dossier.linkedIdentities,
      iocSignatures: dossier.iocSignatures,
      statutoryLegalNotice: dossier.recommendedLegalNotice
    };

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(evidencePayload, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `EVIDENCE_DOSSIER_${dossier.primaryHandle.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const handlePreFillFIR = () => {
    // Dispatch global custom event for IncidentDispatchCard
    window.dispatchEvent(
      new CustomEvent('prefill-fir-dispatch', {
        detail: {
          threatId: threat?.id,
          targetActor: dossier?.primaryHandle || actorHandle,
          dossier: dossier,
          threat: threat
        }
      })
    );

    if (onPreFillDispatch) {
      onPreFillDispatch(dossier, threat);
    }

    // Close the dossier modal after pre-filling
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#151E32] rounded-3xl p-5 sm:p-7 border border-[#E5E9F2] dark:border-slate-800 shadow-2xl max-w-2xl w-full text-slate-800 dark:text-slate-100 relative my-6 max-h-[92vh] overflow-y-auto space-y-5"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Actor Investigation File
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>{dossier?.confidenceScore || 89}% AI Identity Confidence</span>
                </span>
              </div>

              <h2
                id="dossier-modal-title"
                className="text-base sm:text-lg font-black font-mono tracking-tight text-[#1A253C] dark:text-white flex items-center gap-2 truncate"
              >
                <Fingerprint className="w-5 h-5 text-[#2563EB] shrink-0" />
                <span className="truncate">
                  INVESTIGATIVE DOSSIER // {dossier?.primaryHandle || actorHandle}
                </span>
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Investigation Dossier"
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2563EB] animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                Running Cross-Platform Stylometric Correlation...
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Querying linguistic markers, PGP handles, and IOC signatures
              </p>
            </div>
          ) : (
            <>
              {/* Stylometric Analysis Box */}
              <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#2563EB] dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Gemini AI Stylometric Correlation Analysis</span>
                </div>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  {dossier?.stylometricMatch}
                </p>
              </div>

              {/* Cross-Platform Matrix: 3-Column Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Cross-Platform Identity Matrix</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dossier?.linkedIdentities?.length || 3} Linked Vectors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dossier?.linkedIdentities?.map((identity, idx) => {
                    const isReddit = identity.platform.toLowerCase().includes('reddit');
                    const isTelegram = identity.platform.toLowerCase().includes('telegram');
                    const isTwitter = identity.platform.toLowerCase().includes('x') || identity.platform.toLowerCase().includes('twitter');

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/70 border border-[#E5E9F2] dark:border-slate-800 flex flex-col justify-between space-y-2.5 hover:border-blue-200 transition-all min-w-0"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase truncate">
                            {identity.platform}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                              identity.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                : identity.status === 'Flagged'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                            }`}
                          >
                            {identity.status}
                          </span>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono font-black text-[#1A253C] dark:text-white truncate">
                              {identity.handle}
                            </span>
                            <button
                              onClick={() => handleCopy(identity.handle, `handle-${idx}`)}
                              className="text-slate-400 hover:text-[#2563EB] cursor-pointer p-0.5 shrink-0"
                              title="Copy handle"
                            >
                              {copiedKey === `handle-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400 leading-snug line-clamp-3">
                            {identity.activity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* IOC Signatures & Legal Reference Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* IOC Signatures */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-[#E5E9F2] dark:border-slate-800 space-y-2 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-slate-700 dark:text-slate-200">
                    <Hash className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Associated IOC Signatures</span>
                  </div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {dossier?.iocSignatures?.map((ioc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-mono text-slate-700 dark:text-slate-300 gap-1.5 min-w-0"
                      >
                        <span className="truncate select-all">{ioc}</span>
                        <button
                          onClick={() => handleCopy(ioc, `ioc-${idx}`)}
                          className="text-slate-400 hover:text-[#2563EB] cursor-pointer shrink-0"
                          title="Copy IOC"
                        >
                          {copiedKey === `ioc-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Statutory Legal Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-[#E5E9F2] dark:border-slate-800 space-y-2 flex flex-col justify-between min-w-0">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-slate-700 dark:text-slate-200">
                      <Scale className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Recommended Legal Notice</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      {dossier?.recommendedLegalNotice}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    Authority: CERT-In / CISA National Incident Coordination
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleExportJSON}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{exportSuccess ? 'Dossier Exported!' : 'Export Evidence Dossier (JSON)'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePreFillFIR}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pre-fill FIR Dispatch</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
                  >
                    Close File
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
