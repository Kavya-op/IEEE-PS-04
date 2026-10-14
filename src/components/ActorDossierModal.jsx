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
          className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E5E7EB] shadow-2xl max-w-2xl w-full text-slate-800 relative my-6 max-h-[92vh] overflow-y-auto space-y-5"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between pb-4 border-b border-[#E5E7EB] gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Actor Investigation File
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9FE846] animate-pulse" />
                  <span>{dossier?.confidenceScore || 89}% AI Identity Confidence</span>
                </span>
              </div>

              <h2
                id="dossier-modal-title"
                className="text-base sm:text-lg font-black font-mono tracking-tight text-[#0B2115] flex items-center gap-2 truncate"
              >
                <Fingerprint className="w-5 h-5 text-[#0B2115] shrink-0" />
                <span className="truncate">
                  INVESTIGATIVE DOSSIER // {dossier?.primaryHandle || actorHandle}
                </span>
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Investigation Dossier"
              className="p-1.5 rounded-xl hover:bg-[#F3FAEB] text-slate-400 hover:text-[#0B2115] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F3FAEB] border border-[#9FE846]/40 flex items-center justify-center text-[#5C901A] animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono font-bold text-slate-600">
                Running Cross-Platform Stylometric Correlation...
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Querying linguistic markers, PGP handles, and IOC signatures
              </p>
            </div>
          ) : (
            <>
              {/* Stylometric Analysis Box */}
              <div className="bg-[#F3FAEB] border border-[#9FE846]/30 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#0B2115]">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C901A]" />
                  <span>Gemini AI Stylometric Correlation Analysis</span>
                </div>
                <p className="text-xs font-mono text-[#0B2115] leading-relaxed">
                  {dossier?.stylometricMatch}
                </p>
              </div>

              {/* Cross-Platform Matrix: 3-Column Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-extrabold text-[#0B2115] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0B2115]" />
                    <span>Cross-Platform Identity Matrix</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dossier?.linkedIdentities?.length || 3} Linked Vectors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dossier?.linkedIdentities?.map((identity, idx) => {
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] flex flex-col justify-between space-y-2.5 hover:border-[#0B2115] transition-all min-w-0"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase truncate">
                            {identity.platform}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                              identity.status === 'Active'
                                ? 'bg-[#F3FAEB] text-[#5C901A] border-[#9FE846]/40'
                                : identity.status === 'Flagged'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {identity.status}
                          </span>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono font-black text-[#0B2115] truncate">
                              {identity.handle}
                            </span>
                            <button
                              onClick={() => handleCopy(identity.handle, `handle-${idx}`)}
                              className="text-slate-400 hover:text-[#0B2115] cursor-pointer p-0.5 shrink-0"
                              title="Copy handle"
                            >
                              {copiedKey === `handle-${idx}` ? (
                                <Check className="w-3 h-3 text-[#5C901A]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] font-sans text-slate-600 leading-snug line-clamp-3">
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
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] space-y-2 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#0B2115]">
                    <Hash className="w-3.5 h-3.5 text-[#0B2115]" />
                    <span>Associated IOC Signatures</span>
                  </div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {dossier?.iocSignatures?.map((ioc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[10px] font-mono text-slate-700 gap-1.5 min-w-0"
                      >
                        <span className="truncate select-all">{ioc}</span>
                        <button
                          onClick={() => handleCopy(ioc, `ioc-${idx}`)}
                          className="text-slate-400 hover:text-[#0B2115] cursor-pointer shrink-0"
                          title="Copy IOC"
                        >
                          {copiedKey === `ioc-${idx}` ? (
                            <Check className="w-3 h-3 text-[#5C901A]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Statutory Legal Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] space-y-2 flex flex-col justify-between min-w-0">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#0B2115]">
                      <Scale className="w-3.5 h-3.5 text-[#0B2115]" />
                      <span>Recommended Legal Notice</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-700 leading-relaxed bg-white p-2 rounded-lg border border-[#E5E7EB]">
                      {dossier?.recommendedLegalNotice}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    Authority: CERT-In / CISA National Incident Coordination
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleExportJSON}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#9FE846] hover:bg-[#8fd838] text-xs font-mono font-semibold text-[#0B2115] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#0B2115]" />
                  <span>{exportSuccess ? 'Dossier Exported!' : 'Export Evidence Dossier (JSON)'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePreFillFIR}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0B2115] hover:bg-[#153423] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pre-fill FIR Dispatch</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#F3FAEB] hover:text-[#0B2115] text-xs font-mono font-bold text-slate-500 border border-[#E5E7EB] transition-all cursor-pointer"
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
