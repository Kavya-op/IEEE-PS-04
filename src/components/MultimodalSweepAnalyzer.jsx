import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Link2,
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  X,
  FileCode,
  Terminal,
  Cpu,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { analyzeMultimodalThreat, fileToBase64 } from '../geminiAnalyzer';

export default function MultimodalSweepAnalyzer({ onAssetInterrogated, className = '' }) {
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [base64Payload, setBase64Payload] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [copiedIocs, setCopiedIocs] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);

  // Handle file selection and HTML5 FileReader conversion (Step 2)
  const handleProcessFile = async (file) => {
    if (!file) return;
    setErrorMessage(null);

    try {
      const converted = await fileToBase64(file);
      setUploadedFile(file);
      setBase64Payload(converted.base64);
      setMimeType(converted.mimeType);

      // Create preview for images/audio/video
      if (file.type.startsWith('image/')) {
        setFilePreview({ type: 'image', url: converted.rawResult });
      } else if (file.type.startsWith('audio/')) {
        setFilePreview({ type: 'audio', url: URL.createObjectURL(file) });
      } else if (file.type.startsWith('video/')) {
        setFilePreview({ type: 'video', url: URL.createObjectURL(file) });
      } else {
        setFilePreview({ type: 'generic', name: file.name });
      }
    } catch (err) {
      console.error('File conversion error:', err);
      setErrorMessage('Failed to process file with FileReader API: ' + (err.message || 'Unknown error'));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e) => {
    e?.stopPropagation();
    setUploadedFile(null);
    setFilePreview(null);
    setBase64Payload(null);
    setMimeType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger Gemini 1.5 Pro Multimodal Deep Content Analysis (Step 3)
  const handleInitiateAnalysis = async () => {
    if (!base64Payload && !urlInput.trim()) {
      setErrorMessage('Please provide an image, video, audio file, or a URL to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setIsQuarantined(false);

    try {
      const result = await analyzeMultimodalThreat({
        base64Data: base64Payload,
        mimeType: mimeType,
        url: urlInput.trim(),
        fileName: uploadedFile?.name || '',
        model: 'gemini-1.5-pro'
      });

      setReportData(result);
      if (onAssetInterrogated) {
        onAssetInterrogated(result);
      }
    } catch (err) {
      console.error('Multimodal analysis failed:', err);
      setErrorMessage('Forensic interrogation failed: ' + (err.message || 'Please verify API key and retry.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sample presets for instant testing
  const handleLoadSample = (sampleType) => {
    handleClearFile();
    setErrorMessage(null);

    if (sampleType === 'aadhaar') {
      setUrlInput('');
      setUploadedFile({ name: 'aadhaar_batch_registry_scan.jpg', size: 4821040 });
      setMimeType('image/jpeg');
      setBase64Payload('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
      setFilePreview({
        type: 'image',
        sampleTag: 'INDIAN CITIZEN AADHAAR BATCH LEAK (OCR TARGET)',
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%230B2115"/><text x="20" y="40" fill="%239FE846" font-family="monospace" font-size="14" font-weight="bold">GOVERNMENT OF INDIA // UNIQUE IDENTIFICATION</text><rect x="20" y="60" width="360" height="70" fill="%23153423" stroke="%239FE846" stroke-dasharray="4"/><text x="35" y="95" fill="%23FFFFFF" font-family="monospace" font-size="16" font-weight="bold">AADHAAR: 4829 8812 9930 [DOXXED]</text><text x="35" y="115" fill="%239FE846" font-family="monospace" font-size="12">STATUS: CONFIDENTIAL BIOMETRIC RECORD</text><text x="20" y="170" fill="%23AAAAAA" font-family="monospace" font-size="11">EXFILTRATED VIA ILLEGAL TELEGRAM DROPZONE</text></svg>'
      });
    } else if (sampleType === 'audio') {
      setUrlInput('');
      setUploadedFile({ name: 'voip_sigint_botnet_wiretap.mp3', size: 1540020 });
      setMimeType('audio/mp3');
      setBase64Payload('UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
      setFilePreview({
        type: 'audio_sample',
        sampleTag: 'SIGINT VOIP WIRETAP (BOTNET SYNCHRONIZATION)'
      });
    } else if (sampleType === 'video') {
      setUrlInput('');
      setUploadedFile({ name: 'spox_deepfake_currency_freeze.mp4', size: 28400192 });
      setMimeType('video/mp4');
      setBase64Payload('AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDE=');
      setFilePreview({
        type: 'video_sample',
        sampleTag: 'SYNTHETIC GAN DEEPFAKE BROADCAST (BANKING PANIC)'
      });
    } else if (sampleType === 'phish_url') {
      handleClearFile();
      setUrlInput('https://aadhaar-kyc-gov-update.top/auth/verify?step=biometric_bypass');
    }
  };

  // Copy extracted IOCs to clipboard
  const handleCopyIocs = () => {
    if (!reportData?.extracted_iocs) return;
    const text = reportData.extracted_iocs.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIocs(true);
    setTimeout(() => setCopiedIocs(false), 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* =========================================================================
          STEP 1: THE MULTI-FORMAT INGESTION UI
          Unified Threat Ingestion Dropzone:
          border-2 border-dashed border-[#E5E7EB] bg-white rounded-xl p-8 text-center hover:border-[#9FE846] transition-all
         ========================================================================= */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all bg-white shadow-sm ${
          isDragging
            ? 'border-[#9FE846] bg-[#F3FAEB]'
            : 'border-[#E5E7EB] hover:border-[#9FE846]'
        }`}
      >
        {/* Hidden Native File Input: <input type="file" accept="image/*,video/mp4,audio/mp3"> */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,audio/mp3,audio/wav"
          onChange={(e) => e.target.files && handleProcessFile(e.target.files[0])}
          className="hidden"
          id="multimodal-file-input"
        />

        {/* Dropzone Header / Visual Icon */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2115] text-[#9FE846] flex items-center justify-center mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6 text-[#9FE846]" />
          </div>
          <h3 className="text-base font-bold text-[#0B2115] tracking-tight">
            Unified Threat Ingestion Dropzone
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-lg">
            Upload raw forensic media or provide a target URL for automated deep-content inspection using Gemini 1.5 Pro's native multimodal neural engine.
          </p>
        </div>

        {/* URL Input Bar: w-full bg-[#F3F5F6] border-none rounded-lg px-4 py-2 text-[#0B2115] mb-4 */}
        <div className="max-w-2xl mx-auto mb-4 text-left">
          <label className="block text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-[#0B2115]" />
            <span>Target URL or Suspicious Endpoint Intercept</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://malicious-gateway-sample.top/payload or C2 beacon dropzone..."
              className="w-full bg-[#F3F5F6] border-none rounded-lg px-4 py-2.5 text-[#0B2115] placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#9FE846] transition-all font-mono"
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-[#0B2115] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* File Ingestion Area or Selected File Preview */}
        <div className="max-w-2xl mx-auto mb-5">
          {uploadedFile ? (
            <div className="bg-[#FAFBFC] border border-[#9FE846] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#0B2115] text-[#9FE846] flex items-center justify-center shrink-0">
                  {mimeType.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-[#9FE846]" />
                  ) : mimeType.startsWith('video/') ? (
                    <Video className="w-5 h-5 text-[#9FE846]" />
                  ) : (
                    <Mic className="w-5 h-5 text-[#9FE846]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0B2115] truncate font-mono">
                    {uploadedFile.name}
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    MIME: {mimeType} &bull; {(uploadedFile.size / 1024).toFixed(1)} KB &bull; Base64 Encoded
                  </div>
                </div>
              </div>

              {/* Action: Clear File */}
              <button
                onClick={handleClearFile}
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove Asset</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 hover:bg-[#F3FAEB]/50 hover:border-[#9FE846] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-3 text-gray-600"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B2115]">
                <UploadCloud className="w-4 h-4 text-[#0B2115]" />
                <span>Click to browse media file (Images, MP4, MP3)</span>
              </div>
              <span className="text-gray-400 text-xs hidden sm:inline">&bull;</span>
              <span className="text-[11px] font-mono text-gray-500">
                Supports image/*, video/mp4, audio/mp3 up to 50MB
              </span>
            </div>
          )}

          {/* Render File Preview if available */}
          {filePreview && (
            <div className="mt-3 rounded-lg overflow-hidden border border-[#E5E7EB] bg-black/5 p-2">
              {filePreview.type === 'image' && (
                <div className="max-h-48 overflow-hidden rounded flex items-center justify-center bg-black">
                  <img src={filePreview.url} alt="Uploaded forensic preview" className="max-h-48 object-contain" />
                </div>
              )}
              {filePreview.type === 'audio' && (
                <audio controls src={filePreview.url} className="w-full mt-1" />
              )}
              {filePreview.type === 'video' && (
                <video controls src={filePreview.url} className="w-full max-h-48 rounded bg-black" />
              )}
              {filePreview.sampleTag && (
                <div className="text-[10px] font-mono font-bold text-[#0B2115] bg-[#9FE846]/40 p-1.5 rounded mt-1.5 text-center uppercase tracking-wider">
                  LOADED EVIDENCE: {filePreview.sampleTag}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Sample Presets (For Hackathon Judges / Live Demonstrations) */}
        <div className="max-w-2xl mx-auto mb-6 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase font-semibold mr-1">
            Load Mock Evidence:
          </span>
          <button
            type="button"
            onClick={() => handleLoadSample('aadhaar')}
            className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#F3F5F6] hover:bg-[#9FE846] hover:text-[#0B2115] text-[#0B2115] border border-[#E5E7EB] transition-colors cursor-pointer"
          >
            Aadhaar Leak (Image)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('audio')}
            className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#F3F5F6] hover:bg-[#9FE846] hover:text-[#0B2115] text-[#0B2115] border border-[#E5E7EB] transition-colors cursor-pointer"
          >
            Botnet Wiretap (Audio)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('video')}
            className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#F3F5F6] hover:bg-[#9FE846] hover:text-[#0B2115] text-[#0B2115] border border-[#E5E7EB] transition-colors cursor-pointer"
          >
            Deepfake Feed (Video)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('phish_url')}
            className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#F3F5F6] hover:bg-[#9FE846] hover:text-[#0B2115] text-[#0B2115] border border-[#E5E7EB] transition-colors cursor-pointer"
          >
            Spoofed Portal (URL)
          </button>
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button: [ ⚡ Initiate Deep Content Analysis ] (bg-[#0B2115] text-[#9FE846] font-semibold) */}
        <button
          onClick={handleInitiateAnalysis}
          disabled={isAnalyzing}
          className="bg-[#0B2115] hover:bg-[#081a10] text-[#9FE846] font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2.5 mx-auto transition-all cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-75"
        >
          <Zap className={`w-4 h-4 text-[#9FE846] ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing with Gemini 1.5 Pro Neural Engine...' : 'Initiate Deep Content Analysis'}</span>
        </button>
      </div>

      {/* =========================================================================
          STEP 4: THE CYBER CRIME REPORT RENDER
          Render an "Official Cyber Crime Report" card below the dropzone:
          Header: bg-[#0B2115] text-[#9FE846] px-4 py-3 rounded-t-xl font-bold uppercase tracking-wider
          Body: bg-white border-x border-b border-[#E5E7EB] p-6 rounded-b-xl
         ========================================================================= */}
      {reportData && (
        <article
          aria-label="Official Cyber Crime Report"
          className="rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header: bg-[#0B2115] text-[#9FE846] px-4 py-3 rounded-t-xl font-bold uppercase tracking-wider */}
          <div className="bg-[#0B2115] text-[#9FE846] px-5 py-3.5 rounded-t-xl font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-3 border-b border-[#153423]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#9FE846]" />
              <span className="text-sm font-mono tracking-widest">
                FORENSIC REPORT // {reportData.risk_category || 'CYBER CRIME DETECTED'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="bg-[#153423] text-gray-300 px-2 py-0.5 rounded border border-[#9FE846]/30">
                GEMINI 1.5 PRO MULTIMODAL
              </span>
              <span className="text-gray-400">STATUS: VERIFIED</span>
            </div>
          </div>

          {/* Body: bg-white border-x border-b border-[#E5E7EB] p-6 rounded-b-xl */}
          <div className="bg-white border-x border-b border-[#E5E7EB] p-6 rounded-b-xl space-y-6">
            {/* Top Row: Threat Score Gauge & Risk Category Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pb-6 border-b border-[#E5E7EB]">
              
              {/* Threat Score Gauge: Display threat_score prominently.
                  If > 80: red (text-rose-600); if medium: yellow; if safe: lime green (text-[#9FE846]) */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#F3F5F6] border border-[#E5E7EB] text-center">
                <span className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider mb-1">
                  Threat Severity Score
                </span>
                
                <div className="flex items-baseline gap-1 my-1">
                  <span
                    className={`text-5xl font-black font-mono tracking-tight ${
                      reportData.threat_score > 80
                        ? 'text-rose-600'
                        : reportData.threat_score >= 50
                        ? 'text-amber-500'
                        : 'text-[#9FE846]'
                    }`}
                  >
                    {reportData.threat_score}
                  </span>
                  <span className="text-sm font-mono text-gray-400 font-bold">/ 100</span>
                </div>

                {/* Score Level Tag */}
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 ${
                    reportData.threat_score > 80
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : reportData.threat_score >= 50
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-[#F3FAEB] text-[#0B2115] border border-[#9FE846]'
                  }`}
                >
                  {reportData.threat_score > 80
                    ? 'CRITICAL OPERATION THREAT'
                    : reportData.threat_score >= 50
                    ? 'ELEVATED SUSPICION'
                    : 'LOW RISK / BENIGN'}
                </span>
              </div>

              {/* Classification & Metadata Panel */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Risk Category Classification
                  </div>
                  <div className="text-lg font-bold text-[#0B2115]">
                    {reportData.risk_category}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-[#F3F5F6] p-2.5 rounded-lg border border-[#E5E7EB]">
                    <span className="text-gray-500 block text-[10px] uppercase">Inspection Target</span>
                    <span className="font-bold text-[#0B2115] truncate block">
                      {uploadedFile?.name || urlInput || 'Multimodal Stream'}
                    </span>
                  </div>
                  <div className="bg-[#F3F5F6] p-2.5 rounded-lg border border-[#E5E7EB]">
                    <span className="text-gray-500 block text-[10px] uppercase">MIME Encoding</span>
                    <span className="font-bold text-[#0B2115] truncate block">
                      {mimeType || 'URL Web Resource'}
                    </span>
                  </div>
                  <div className="bg-[#F3F5F6] p-2.5 rounded-lg border border-[#E5E7EB]">
                    <span className="text-gray-500 block text-[10px] uppercase">Evidence Integrity</span>
                    <span className="font-bold text-[#5C901A] block">
                      SHA-256 Validated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* IOCs (Indicators of Compromise): Map extracted_iocs into flat gray tags:
                bg-[#F3F5F6] text-gray-700 px-2 py-1 rounded text-sm font-mono */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0B2115]" />
                  <span className="text-xs font-mono font-bold text-[#0B2115] uppercase tracking-wider">
                    Extracted IOCs (Indicators of Compromise)
                  </span>
                </div>
                <button
                  onClick={handleCopyIocs}
                  className="text-xs font-mono text-[#0B2115] hover:text-[#5C901A] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedIocs ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5C901A]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All IOCs</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {reportData.extracted_iocs && reportData.extracted_iocs.length > 0 ? (
                  reportData.extracted_iocs.map((ioc, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F5F6] text-gray-700 px-2 py-1 rounded text-sm font-mono border border-gray-200"
                    >
                      {ioc}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 font-mono italic">
                    No discrete indicators of compromise extracted.
                  </span>
                )}
              </div>
            </div>

            {/* Forensic Summary: Render forensic_summary in distinct text block (text-[#0B2115] leading-relaxed) */}
            <div className="bg-[#F3FAEB] border border-[#9FE846] p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-[#0B2115] uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-[#0B2115]" />
                <span>Forensic Intelligence Evaluation & Synthesis</span>
              </div>
              <p className="text-sm text-[#0B2115] leading-relaxed font-sans">
                {reportData.forensic_summary}
              </p>
            </div>

            {/* Report Footer Actions */}
            <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Chain-of-Custody Logged &bull; SKIT004 Government Evidence Dossier</span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Quarantine Asset Toggle */}
                <button
                  onClick={() => setIsQuarantined(!isQuarantined)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    isQuarantined
                      ? 'bg-[#9FE846] text-[#0B2115]'
                      : 'bg-[#0B2115] hover:bg-[#081a10] text-white'
                  }`}
                >
                  {isQuarantined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Quarantined & Gate Isolated ✓</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-[#9FE846]" />
                      <span>Quarantine Asset</span>
                    </>
                  )}
                </button>

                {/* Reset / New Inspection */}
                <button
                  onClick={() => {
                    handleClearFile();
                    setUrlInput('');
                    setReportData(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#0B2115] hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  New Ingestion
                </button>
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
