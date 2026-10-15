import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileDown,
  X,
  CheckCircle2,
  AlertTriangle,
  Database,
  Calendar,
  Shield,
  FileCode,
  HardDrive,
  Trash2,
  ExternalLink,
  RefreshCw,
  FolderDown,
  Sparkles
} from 'lucide-react';
import {
  generateAndStoreReport,
  getSavedReportsFromStorage,
  deleteReportFromStorage,
  triggerNativeDownload
} from '../services/reportGenerator';

export default function ReportModal({
  isOpen,
  onClose,
  threats = [],
  selectedVector = 'All Vectors',
  timeRange = 'Last 24 Hours',
  metrics = {},
  auditLogs = [],
  lastGeneratedResult = null
}) {
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'storage'
  const [format, setFormat] = useState('html'); // 'html' | 'json' | 'all'
  const [isGenerating, setIsGenerating] = useState(false);
  const [successInfo, setSuccessInfo] = useState(lastGeneratedResult);
  const [storedReports, setStoredReports] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStoredReports(getSavedReportsFromStorage());
      if (lastGeneratedResult) {
        setSuccessInfo(lastGeneratedResult);
      }
    }
  }, [isOpen, lastGeneratedResult]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSuccessInfo(null);
    try {
      const result = await generateAndStoreReport({
        threats,
        selectedVector,
        timeRange,
        metrics,
        auditLogs,
        format
      });
      setSuccessInfo(result);
      setStoredReports(getSavedReportsFromStorage());
    } catch (err) {
      console.error('[ReportModal] Error generating report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = (reportId, e) => {
    e.stopPropagation();
    const updated = deleteReportFromStorage(reportId);
    setStoredReports(updated);
    if (successInfo?.reportId === reportId) {
      setSuccessInfo(null);
    }
  };

  const handleDownloadStoredHtml = (report) => {
    if (report.htmlContent) {
      triggerNativeDownload(report.htmlContent, report.filename || `${report.id}.html`, 'text/html;charset=utf-8');
    }
  };

  const handleDownloadStoredJson = (report) => {
    if (report.jsonContent) {
      triggerNativeDownload(report.jsonContent, report.jsonFilename || `${report.id}.json`, 'application/json;charset=utf-8');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#0B2115]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          {/* Header */}
          <div className="bg-[#0B2115] text-white p-5 flex items-center justify-between shrink-0 border-b border-[#153423]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9FE846] text-[#0B2115] flex items-center justify-center font-bold shrink-0 shadow-sm">
                <FileDown className="w-5 h-5 text-[#0B2115]" />
              </div>
              <div>
                <h3 id="report-modal-title" className="text-base font-bold flex items-center gap-2">
                  <span>Cyber Threat Intelligence Dossier</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#9FE846] border border-white/10 uppercase">
                    SKIT004 Gov Engine
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Compile, download, and archive official incident reports into local storage.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtabs: Generate vs Storage */}
          <div className="px-5 pt-3 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center gap-2">
            <button
              onClick={() => setActiveTab('generate')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'generate'
                  ? 'border-[#0B2115] text-[#0B2115]'
                  : 'border-transparent text-gray-500 hover:text-[#0B2115]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5C901A]" />
              <span>Generate New Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'storage'
                  ? 'border-[#0B2115] text-[#0B2115]'
                  : 'border-transparent text-gray-500 hover:text-[#0B2115]'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Reports in Storage</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#E5E7EB] text-gray-700">
                {storedReports.length}
              </span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {activeTab === 'generate' ? (
              <>
                {/* Instant Success Banner if report just downloaded */}
                {successInfo && (
                  <div className="p-4 rounded-xl bg-[#F3FAEB] border border-[#9FE846]/60 text-xs text-[#0B2115] space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#0B2115]">
                        <CheckCircle2 className="w-4 h-4 text-[#5C901A]" />
                        <span>Report Successfully Downloaded to Storage!</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#5C901A] border border-[#9FE846]/40 font-semibold">
                        SAVED TO DISK
                      </span>
                    </div>

                    <p className="text-gray-600 font-mono text-[11px]">
                      File: <strong>{successInfo.filename}</strong> &bull; Archived in local and system storage.
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => handleDownloadStoredHtml(successInfo.record)}
                        className="px-2.5 py-1 rounded bg-[#0B2115] text-[#9FE846] font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#153423]"
                      >
                        <FileDown className="w-3 h-3" />
                        <span>Download HTML Again</span>
                      </button>

                      <button
                        onClick={() => handleDownloadStoredJson(successInfo.record)}
                        className="px-2.5 py-1 rounded bg-white border border-[#E5E7EB] text-gray-700 font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                      >
                        <FileCode className="w-3 h-3 text-[#5C901A]" />
                        <span>Download JSON Data</span>
                      </button>

                      {successInfo.downloadUrl && (
                        <a
                          href={successInfo.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-white border border-[#E5E7EB] text-gray-700 font-mono text-[11px] font-semibold flex items-center gap-1 hover:bg-gray-50 ml-auto"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Firebase Storage Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Scope Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="text-[10px] font-mono uppercase text-gray-500">Monitored Vector</div>
                    <div className="text-xs font-bold text-[#0B2115] truncate mt-0.5">{selectedVector}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="text-[10px] font-mono uppercase text-gray-500">Telemetry Intercepts</div>
                    <div className="text-xs font-bold text-[#0B2115] mt-0.5">{threats.length} Active Packets</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="text-[10px] font-mono uppercase text-gray-500">Classification Tier</div>
                    <div className="text-xs font-bold text-rose-600 mt-0.5">SECRET // LAW ENF</div>
                  </div>
                </div>

                {/* Format Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B2115] uppercase tracking-wider block font-mono">
                    Select Export Format:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormat('html')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        format === 'html'
                          ? 'border-[#0B2115] bg-[#F3FAEB] text-[#0B2115] ring-1 ring-[#0B2115]'
                          : 'border-[#E5E7EB] hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>Executive HTML</span>
                        {format === 'html' && <span className="w-2 h-2 rounded-full bg-[#0B2115]" />}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        Self-contained visual report with Print-to-PDF &amp; tables.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat('json')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        format === 'json'
                          ? 'border-[#0B2115] bg-[#F3FAEB] text-[#0B2115] ring-1 ring-[#0B2115]'
                          : 'border-[#E5E7EB] hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>CERT JSON</span>
                        {format === 'json' && <span className="w-2 h-2 rounded-full bg-[#0B2115]" />}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        Machine-readable SIEM/SOAR incident evidence payload.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat('all')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        format === 'all'
                          ? 'border-[#0B2115] bg-[#F3FAEB] text-[#0B2115] ring-1 ring-[#0B2115]'
                          : 'border-[#E5E7EB] hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>Complete Bundle</span>
                        {format === 'all' && <span className="w-2 h-2 rounded-full bg-[#0B2115]" />}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        Downloads both HTML dossier + JSON telemetry files.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Statutory Certification Advisory */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-mono leading-relaxed">
                  <strong>Statutory Declaration:</strong> Generating this report commits cryptographic chain-of-custody hashes to the system ledger. Admissible under Section 65B of the Indian Evidence Act and IT Act 2000 Section 66F.
                </div>
              </>
            ) : (
              /* Reports in Storage Tab */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                  <span className="text-xs font-mono font-bold uppercase text-gray-600">
                    Archived Reports In Browser &amp; Cloud Storage ({storedReports.length})
                  </span>
                  {storedReports.length > 0 && (
                    <button
                      onClick={() => {
                        localStorage.removeItem('saved_cyber_reports');
                        setStoredReports([]);
                      }}
                      className="text-[11px] font-mono text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Storage</span>
                    </button>
                  )}
                </div>

                {storedReports.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 font-mono text-xs space-y-2">
                    <FolderDown className="w-8 h-8 text-gray-300 mx-auto" />
                    <div>No reports currently stored in storage.</div>
                    <p className="text-[11px] text-gray-500">
                      Generate your first dossier using the &ldquo;Generate New Dossier&rdquo; tab.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {storedReports.map((report) => (
                      <div
                        key={report.id}
                        className="p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#0B2115] bg-white transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0B2115]">
                              {report.id}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 font-semibold">
                              {report.vector}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono text-gray-500">
                            {report.formattedDate || new Date(report.generatedAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                          <div className="text-[11px] font-mono text-gray-500">
                            {report.totalThreats} intercepts &bull; {report.fileSizeKB || 24} KB &bull; {report.storageType}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDownloadStoredHtml(report)}
                              className="px-2.5 py-1 rounded-lg bg-[#0B2115] text-[#9FE846] text-xs font-semibold hover:bg-[#153423] cursor-pointer flex items-center gap-1 transition-colors"
                              title="Download HTML file"
                            >
                              <FileDown className="w-3 h-3" />
                              <span>Download HTML</span>
                            </button>

                            <button
                              onClick={() => handleDownloadStoredJson(report)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                              title="Download JSON file"
                            >
                              <FileCode className="w-3 h-3 text-[#5C901A]" />
                              <span>JSON</span>
                            </button>

                            <button
                              onClick={(e) => handleDeleteReport(report.id, e)}
                              className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete from storage"
                              aria-label="Delete report"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-[#0B2115] hover:bg-gray-200/50 transition-colors cursor-pointer"
            >
              Close
            </button>

            {activeTab === 'generate' && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-[#9FE846] hover:bg-[#8fd838] disabled:opacity-50 text-[#0B2115] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0B2115]" />
                    <span>Compiling &amp; Storing Report...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-[#0B2115]" />
                    <span>Download Report to Storage</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
