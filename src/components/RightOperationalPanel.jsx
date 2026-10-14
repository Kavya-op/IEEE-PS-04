import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import TakedownButton from './TakedownButton';
import ActorDossierModal from './ActorDossierModal';
import {
  ShieldAlert,
  FileText,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  Copy,
  Check,
  X,
  FileDown,
  Terminal,
  ShieldCheck,
  User
} from 'lucide-react';

export function OfficerClearanceCard() {
  const { defenseEfficacy, activeIngressRate } = useOSINT();

  return (
    <section
      aria-label="Officer Clearance and Session Status"
      className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-4.5 sm:p-5 border border-[#E5E7EB] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider truncate">
          Account / Session Identity
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9FE846] animate-pulse" />
          <span>SESSION ACTIVE</span>
        </span>
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-[#0B2115] border-2 border-[#153423] flex items-center justify-center text-[#9FE846] font-mono font-black text-sm shrink-0 shadow-sm">
          IV
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-extrabold text-[#0B2115] dark:text-white truncate">
            Investigator Vance
          </div>
          <div className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 truncate">
            <ShieldAlert className="w-3 h-3 shrink-0" />
            <span className="truncate">TOP SECRET // SCI // HOMELAND</span>
          </div>
          <div className="text-[11px] font-mono text-gray-500 dark:text-slate-400 mt-0.5 truncate">
            Node Region: <strong className="text-slate-700 dark:text-slate-200">US-EAST-1 (NODE 04)</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-[11px]">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[#E5E7EB] dark:border-slate-800 min-w-0">
          <span className="text-gray-500 text-[10px] block truncate">Defense Efficacy</span>
          <span className="font-extrabold text-[#5C901A] truncate block">{defenseEfficacy}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[#E5E7EB] dark:border-slate-800 min-w-0">
          <span className="text-gray-500 text-[10px] block truncate">Ingress Stream</span>
          <span className="font-extrabold text-[#0B2115] dark:text-white truncate block">{activeIngressRate}</span>
        </div>
      </div>
    </section>
  );
}

export function IncidentDispatchCard() {
  const { liveThreats } = useOSINT();
  const [selectedThreatId, setSelectedThreatId] = useState(liveThreats[0]?.id || 'THREAT-01');
  const [targetAgency, setTargetAgency] = useState('CERT-In');
  const [legalTier, setLegalTier] = useState('Emergency Subpoena (18 U.S. Code § 1030)');
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [copiedDispatch, setCopiedDispatch] = useState(false);
  const [correlatedDossier, setCorrelatedDossier] = useState(null);

  // Listen for Pre-fill FIR Dispatch from Actor Dossier
  useEffect(() => {
    const handlePreFill = (e) => {
      if (e.detail?.threatId) {
        setSelectedThreatId(e.detail.threatId);
      }
      if (e.detail?.dossier) {
        setCorrelatedDossier(e.detail.dossier);
      }
      setShowLegalModal(true);
    };
    window.addEventListener('prefill-fir-dispatch', handlePreFill);
    return () => window.removeEventListener('prefill-fir-dispatch', handlePreFill);
  }, []);

  const selectedThreatObj = liveThreats.find((t) => t.id === selectedThreatId) || liveThreats[0] || {
    id: 'THREAT-REF-01',
    title: 'Zero-Day Remote Code Execution Disclosed in Enterprise Edge',
    link: 'https://www.reddit.com/r/cybersecurity',
    riskLevel: 'Critical',
    aiExplanation: 'Autonomous neural analysis flagged active RCE shellcode indicator.'
  };

  const correlatedSection = correlatedDossier
    ? `
--- CORRELATED THREAT ACTOR DOSSIER ---
Primary Identified Handle: ${correlatedDossier.primaryHandle}
AI Identity Confidence: ${correlatedDossier.confidenceScore}%
Stylometric Profile: ${correlatedDossier.stylometricMatch}
Cross-Platform Linkages:
${correlatedDossier.linkedIdentities?.map(id => `  • [${id.platform}] ${id.handle} (${id.status}) - ${id.activity}`).join('\n')}
Correlated IOC Signatures:
${correlatedDossier.iocSignatures?.map(ioc => `  • ${ioc}`).join('\n')}
Statutory Mandate: ${correlatedDossier.recommendedLegalNotice}
`
    : '';

  const generatedFIRContent = `FORMAL INCIDENT DISPATCH & EVIDENCE SUBPOENA
Authority: Homeland Defense & Cybersecurity Command // Node AP-SOUTH-1
Recipient Agency: ${targetAgency}
Statutory Reference: ${legalTier}
Date/Timestamp: ${new Date().toISOString()}

--- INCIDENT DETAILS ---
Incident Tracker ID: ${selectedThreatObj.id || 'INC-99120-X'}
Target Title: ${selectedThreatObj.title || 'Unknown Title'}
Risk Evaluation: ${selectedThreatObj.riskLevel || 'High'}
Verified Telemetry Origin: ${selectedThreatObj.source || 'Multi-Platform OSINT'}
Direct Post URL: ${selectedThreatObj.link || 'https://www.cisa.gov/known-exploited-vulnerabilities'}
${correlatedSection}
--- AI FORENSIC REASONING ---
${selectedThreatObj.aiExplanation || 'Zero-day vulnerability weaponization telemetry verified by neural pipeline.'}

--- DISPATCH DIRECTIVE ---
1. Immediate packet interception on egress edge nodes.
2. Blacklist associated C2 domain hashes and botnet nodes.
3. Cryptographic Chain-of-Custody Archive: SHA256-TELEMETRY-VERIFIED-7781.

Investigator Signature: INV. VANCE (Clearance: TOP SECRET // SCI)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedFIRContent);
    setCopiedDispatch(true);
    setTimeout(() => setCopiedDispatch(false), 3000);
  };

  return (
    <section
      aria-label="Incident Dispatch & FIR Generator"
      className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-4.5 sm:p-5 border border-[#E5E7EB] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText className="w-4 h-4 text-[#0B2115] shrink-0" />
          <h4 className="text-xs font-mono font-extrabold text-[#0B2115] dark:text-white uppercase tracking-wider truncate">
            Incident Dispatch & FIR Generator
          </h4>
        </div>
        <span className="text-[10px] font-mono text-[#0B2115] dark:text-[#9FE846] font-bold shrink-0">LAW ENFORCEMENT FIR</span>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-slate-400 font-mono leading-relaxed">
        Route actionable legal notices and incident dispatches directly to government cyber cells.
      </p>

      {/* Target Threat Selector */}
      <div className="space-y-1 w-full">
        <label className="text-[10px] font-mono font-bold text-gray-600 dark:text-slate-300 block uppercase">
          Target Threat Stream:
        </label>
        <select
          value={selectedThreatId}
          onChange={(e) => setSelectedThreatId(e.target.value)}
          className="w-full text-xs font-mono p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#0B2115] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B2115] truncate"
        >
          {liveThreats.map((t) => (
            <option key={t.id} value={t.id}>
              [{t.riskLevel || 'High'}] {String(t.title || t.id).slice(0, 42)}...
            </option>
          ))}
        </select>
      </div>

      {/* Agency Routing Dropdown */}
      <div className="space-y-1 w-full">
        <label className="text-[10px] font-mono font-bold text-gray-600 dark:text-slate-300 block uppercase">
          Recipient Agency:
        </label>
        <select
          value={targetAgency}
          onChange={(e) => setTargetAgency(e.target.value)}
          className="w-full text-xs font-mono p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#0B2115] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B2115] truncate"
        >
          <option value="CERT-In">CERT-In (Computer Emergency Response Team)</option>
          <option value="Cyber Crime Cell">National Cyber Crime Reporting Portal (NCRP)</option>
          <option value="FBI Cyber Division">FBI Cyber Division // Infragard Relay</option>
          <option value="CISA Incident Desk">CISA Central Incident Handling Portal</option>
        </select>
      </div>

      {/* Legal Action Tier */}
      <div className="space-y-1 w-full">
        <label className="text-[10px] font-mono font-bold text-gray-600 dark:text-slate-300 block uppercase">
          Action Priority:
        </label>
        <select
          value={legalTier}
          onChange={(e) => setLegalTier(e.target.value)}
          className="w-full text-xs font-mono p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#0B2115] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B2115] truncate"
        >
          <option value="Emergency Subpoena (18 U.S. Code § 1030)">Emergency Subpoena (18 U.S. Code § 1030 / IT Act 66F)</option>
          <option value="Critical Infrastructure Advisory">Critical Infrastructure Advisory Warning</option>
          <option value="Heuristic Watch & Archive">Chain-of-Custody Digital Archive Notice</option>
        </select>
      </div>

      {/* Action Button */}
      <button
        onClick={() => setShowLegalModal(true)}
        className="w-full py-2.5 px-4 rounded-xl bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] text-xs font-mono font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
      >
        <Send className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate whitespace-normal">[Generate Formal FIR / Legal Dispatch ↗]</span>
      </button>

      {/* Legal FIR Modal */}
      <AnimatePresence>
        {showLegalModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#151E32] rounded-2xl p-6 border border-[#E5E7EB] dark:border-slate-800 shadow-2xl max-w-xl w-full flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0B2115]" />
                  <h3 className="text-sm font-mono font-bold text-[#0B2115] dark:text-white">
                    Formal Legal Dispatch & Cyber FIR Draft
                  </h3>
                </div>
                <button
                  onClick={() => setShowLegalModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-4 flex-1 overflow-y-auto">
                <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {generatedFIRContent}
                </pre>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 text-[#0B2115] dark:text-slate-200"
                >
                  {copiedDispatch ? <Check className="w-3.5 h-3.5 text-[#5C901A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDispatch ? 'Copied to Clipboard' : 'Copy Dispatch'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob([generatedFIRContent], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `LEGAL-DISPATCH-${selectedThreatObj.id || 'INC'}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Export Document</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function LiveStreamTickerCard({ onSelectThreat }) {
  const { liveThreats, mitigationStates } = useOSINT();
  const [selectedDossierThreat, setSelectedDossierThreat] = useState(null);

  return (
    <section
      aria-label="Live OSINT Ingress Stream"
      className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-4.5 sm:p-5 border border-[#E5E7EB] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-ping shrink-0" />
          <h4 className="text-xs font-mono font-extrabold text-[#0B2115] dark:text-white uppercase tracking-wider truncate">
            Live OSINT Ingress Stream
          </h4>
        </div>
        <span className="text-[10px] font-mono text-[#5C901A] font-bold shrink-0">MULTI-PLATFORM LIVE</span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {liveThreats.slice(0, 5).map((threat, idx) => {
          const isCritical = threat.riskLevel === 'Critical';
          const isHigh = threat.riskLevel === 'High';
          const isMitigated = mitigationStates?.[threat.id] === 'mitigated' || threat.status === 'mitigated';

          return (
            <div
              key={threat.id || idx}
              className={`p-2.5 rounded-xl border transition-all flex flex-col gap-1.5 text-xs font-mono min-w-0 ${
                isMitigated
                  ? 'bg-[#F3FAEB]/50 dark:bg-emerald-950/20 border-[#9FE846]/40'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-[#E5E7EB] dark:border-slate-800 hover:border-[#9FE846]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isMitigated
                        ? 'bg-[#5C901A]'
                        : isCritical
                        ? 'bg-rose-600 animate-ping'
                        : isHigh
                        ? 'bg-amber-500'
                        : 'bg-[#0B2115]'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold truncate transition-all ${
                      isMitigated
                        ? 'text-gray-400 line-through opacity-60'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {threat.title || 'Inbound OSINT Telemetry'}
                  </span>
                </div>
                <span className="text-[9px] text-gray-500 shrink-0">{threat.timestamp || 'Live'}</span>
              </div>

              {/* Action Row: Link + Correlate Actor + Simulated Takedown Button */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] dark:border-slate-700/60 text-[10px] min-w-0 gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <a
                    href={threat.link || 'https://www.reddit.com/r/cybersecurity'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2115] hover:text-[#153423] font-bold inline-flex items-center gap-0.5 underline shrink-0"
                  >
                    <span>Inspect Threat ↗</span>
                  </a>

                  {/* Correlate Actor Action Button */}
                  <button
                    onClick={() => setSelectedDossierThreat(threat)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E5E7EB] text-[#0B2115] hover:bg-[#F3FAEB] hover:text-[#5C901A] dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    title="Correlate threat actor identity across platforms"
                  >
                    <User className="w-3 h-3" />
                    <span>Correlate Actor</span>
                  </button>
                </div>

                {/* Simulated Takedown & Firewall Mitigation Button */}
                <TakedownButton threat={threat} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Actor Dossier Modal */}
      <ActorDossierModal
        isOpen={!!selectedDossierThreat}
        onClose={() => setSelectedDossierThreat(null)}
        threat={selectedDossierThreat}
      />
    </section>
  );
}

export function SystemSopChecklistCard() {
  const [sopTasks, setSopTasks] = useState([
    { id: 'sop-1', text: 'Swarm quarantined & isolated', completed: true },
    { id: 'sop-2', text: 'Blacklist IP pool pushed to firewall', completed: true },
    { id: 'sop-3', text: 'Advisory issued to operators', completed: true },
    { id: 'sop-4', text: 'Coordinate with regional CERT desk', completed: false },
    { id: 'sop-5', text: 'Export chain-of-custody archive', completed: false }
  ]);

  const toggleSopTask = (id) => {
    setSopTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = sopTasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / sopTasks.length) * 100);

  return (
    <section
      aria-label="Active Defense SOPs"
      className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-4.5 sm:p-5 border border-[#E5E7EB] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-[#5C901A] shrink-0" />
          <h4 className="text-xs font-mono font-extrabold text-[#0B2115] dark:text-white uppercase tracking-wider truncate">
            Active Defense SOPs
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#5C901A] shrink-0">
          {progressPct}% DONE
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#0B2115] to-[#9FE846] rounded-full"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-1.5 pt-1">
        {sopTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleSopTask(task.id)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F3FAEB]/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-xs font-mono text-slate-700 dark:text-slate-300 min-w-0"
          >
            <button
              type="button"
              className="text-[#0B2115] dark:text-blue-400 focus:outline-none shrink-0"
              aria-label={`Toggle ${task.text}`}
            >
              {task.completed ? (
                <CheckSquare className="w-4 h-4 text-[#5C901A] fill-[#F3FAEB] dark:fill-emerald-950" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <span className={`text-[11px] truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SystemAuditLogCard() {
  const { auditLogs } = useOSINT();

  return (
    <section
      aria-label="Security Audit Log Stream"
      className="w-full overflow-hidden bg-white dark:bg-[#151E32] rounded-2xl p-4.5 sm:p-5 border border-[#E5E7EB] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          <Terminal className="w-4 h-4 text-[#0B2115] shrink-0" />
          <h4 className="text-xs font-mono font-extrabold text-[#0B2115] dark:text-white uppercase tracking-wider truncate">
            Firewall & Mitigation Audit Log
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 shrink-0">
          {auditLogs?.length || 0} Events
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {auditLogs?.map((log) => (
          <div
            key={log.id}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 font-mono text-[10px] space-y-1"
          >
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-bold text-[#0B2115] dark:text-blue-400">{log.action || 'AUDIT'}</span>
              <span>{log.timestamp}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-snug">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RightOperationalPanel({ onSelectThreatForInvestigation }) {
  return (
    <div className="w-full space-y-6 select-none overflow-hidden">
      <OfficerClearanceCard />
      <IncidentDispatchCard />
      <LiveStreamTickerCard onSelectThreat={onSelectThreatForInvestigation} />
      <SystemAuditLogCard />
      <SystemSopChecklistCard />
    </div>
  );
}
