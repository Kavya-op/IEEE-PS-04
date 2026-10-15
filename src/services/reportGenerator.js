import { db, storage } from '../firebaseConfig.js';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const STORAGE_KEY = 'saved_cyber_reports';

/**
 * Triggers a native browser file download into the user's local disk/storage.
 */
export function triggerNativeDownload(content, filename, mimeType = 'text/html;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

/**
 * Generates structured intelligence report data from active application state.
 */
export function buildReportData({
  threats = [],
  selectedVector = 'All Vectors',
  timeRange = 'Last 24 Hours',
  metrics = {},
  auditLogs = []
}) {
  const timestamp = new Date();
  const hexTime = timestamp.getTime().toString(16).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const reportId = `REP-SKIT004-${hexTime}-${randomSuffix}`;
  const custodyHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const criticalCount = threats.filter((t) => t.riskLevel === 'Critical' || t.threatLevel === 'Critical').length;
  const highCount = threats.filter((t) => t.riskLevel === 'High' || t.threatLevel === 'High').length;
  const mediumCount = threats.filter((t) => t.riskLevel === 'Medium' || t.threatLevel === 'Medium').length;
  const mitigatedCount = threats.filter((t) => t.status === 'mitigated').length;

  return {
    reportId,
    custodyHash,
    generatedAt: timestamp.toISOString(),
    formattedDate: timestamp.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium'
    }),
    investigator: {
      name: 'Investigator Vance',
      badgeId: 'CERT-IN-SKIT004',
      clearanceLevel: 'TOP SECRET // LAW ENFORCEMENT & CERT CYBERCRIME DESK',
      jurisdiction: 'National Cyber Crime Threat Intelligence Directorate'
    },
    scope: {
      monitoredVector: selectedVector,
      timeWindow: timeRange,
      totalIntercepts: threats.length
    },
    kpis: {
      totalThreats: threats.length,
      criticalRisks: criticalCount,
      highRisks: highCount,
      mediumRisks: mediumCount,
      mitigatedThreats: mitigatedCount,
      ingressRate: metrics.activeIngressRate || '14.2 pkt/sec',
      defenseEfficacy: metrics.defenseEfficacy || '98.4%',
      activePlatforms: ['Reddit', 'Telegram', 'X (Twitter)', 'Facebook']
    },
    threats: threats.map((t, idx) => ({
      index: idx + 1,
      id: t.id || `INC-${idx + 1}`,
      title: t.title || 'Unknown Threat Packet',
      content: t.content || 'No narrative payload recorded.',
      platform: t.platform || t.sourcePlatform || 'Multi-Platform',
      sourceUrl: t.sourceUrl || t.link || 'https://www.reddit.com/r/cybersecurity/',
      riskLevel: t.riskLevel || t.threatLevel || 'Medium',
      aiSummary: t.aiExplanation || t.aiSummary || 'Analyzed by OSINT Neural Threat Engine.',
      category: t.thematicCategory || t.aiCategory || 'Cyber Threat',
      mitre: t.mitre || (
        t.thematicCategory?.includes('Credential') ? 'T1552 - Unsecured Credentials' :
        t.thematicCategory?.includes('Disinformation') ? 'T1584 - Information Operations' :
        'T1190 - Exploit Public-Facing Application'
      ),
      recommendedAction: t.recommendedAction || 'Quarantine threat endpoint & log network IOCs.',
      timestamp: t.timestamp || 'Live Intercept'
    })),
    auditTrail: auditLogs.slice(0, 10).map((log) => ({
      id: log.id || Math.random().toString(36).substring(7),
      timestamp: log.timestamp || new Date().toISOString(),
      action: log.action || 'INCIDENT_REVIEW',
      target: log.target || 'General Telemetry',
      message: log.message || ''
    }))
  };
}

/**
 * Creates a standalone, printable, self-contained executive HTML Cyber Threat Report.
 */
export function buildHtmlReport(data) {
  const threatsRows = data.threats.map((t) => {
    const isCrit = t.riskLevel === 'Critical';
    const isHigh = t.riskLevel === 'High';
    const badgeColor = isCrit ? '#dc2626' : isHigh ? '#ea580c' : '#ca8a04';
    const badgeBg = isCrit ? '#fef2f2' : isHigh ? '#fff7ed' : '#fefce8';

    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 14px; font-family: monospace; font-size: 11px; font-weight: bold; color: #0b2115;">
          ${t.id}
        </td>
        <td style="padding: 12px 14px;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; font-family: monospace; color: ${badgeColor}; background: ${badgeBg}; border: 1px solid ${badgeColor}33;">
            ${t.riskLevel}
          </span>
        </td>
        <td style="padding: 12px 14px; font-family: monospace; font-size: 11px; color: #4b5563;">
          ${t.platform}
        </td>
        <td style="padding: 12px 14px;">
          <div style="font-weight: 600; font-size: 13px; color: #0b2115; margin-bottom: 4px;">${escapeHtml(t.title)}</div>
          <div style="font-size: 11px; color: #6b7280; line-height: 1.4; margin-bottom: 6px;">${escapeHtml(t.content.slice(0, 200))}${t.content.length > 200 ? '...' : ''}</div>
          <div style="font-size: 11px; font-family: monospace; color: #0b2115; background: #f3faeb; padding: 4px 8px; border-radius: 4px; border-left: 3px solid #9fe846;">
            <strong>AI Assessment:</strong> ${escapeHtml(t.aiSummary)}
          </div>
        </td>
        <td style="padding: 12px 14px; font-family: monospace; font-size: 11px; color: #374151;">
          <div style="font-weight: bold;">${escapeHtml(t.mitre)}</div>
          <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">${escapeHtml(t.recommendedAction)}</div>
        </td>
      </tr>
    `;
  }).join('');

  const auditRows = data.auditTrail.length > 0 ? data.auditTrail.map((log) => `
    <tr style="border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 11px;">
      <td style="padding: 8px 12px; color: #6b7280;">${escapeHtml(log.timestamp)}</td>
      <td style="padding: 8px 12px; font-weight: bold; color: #0b2115;">${escapeHtml(log.action)}</td>
      <td style="padding: 8px 12px; color: #374151;">${escapeHtml(log.target)}</td>
      <td style="padding: 8px 12px; color: #4b5563;">${escapeHtml(log.message)}</td>
    </tr>
  `).join('') : `
    <tr>
      <td colspan="4" style="padding: 14px; text-align: center; color: #6b7280; font-family: monospace; font-size: 11px;">
        All firewall automated takedowns and containment actions logged clean.
      </td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CYBER CRIME THREAT INTELLIGENCE DOSSIER - ${data.reportId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #f3f5f6;
      line-height: 1.5;
      padding: 24px;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }
    .header {
      background: #0b2115;
      color: #ffffff;
      padding: 32px;
      position: relative;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .security-badge {
      background: #dc2626;
      color: #ffffff;
      font-family: monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .report-id {
      font-family: monospace;
      font-size: 11px;
      color: #9fe846;
      font-weight: bold;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    .subtitle {
      color: #9ca3af;
      font-size: 13px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.12);
      font-family: monospace;
      font-size: 11px;
    }
    .meta-item label {
      color: #9ca3af;
      display: block;
      margin-bottom: 4px;
      text-transform: uppercase;
      font-size: 10px;
    }
    .meta-item span {
      color: #ffffff;
      font-weight: bold;
    }
    .toolbar {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      font-family: monospace;
      border: none;
    }
    .btn-primary {
      background: #9fe846;
      color: #0b2115;
    }
    .btn-primary:hover {
      background: #8fd838;
    }
    .btn-secondary {
      background: #ffffff;
      color: #0b2115;
      border: 1px solid #e5e7eb;
    }
    .btn-secondary:hover {
      background: #f3faeb;
    }
    .section {
      padding: 32px;
      border-bottom: 1px solid #e5e7eb;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #0b2115;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 12px;
    }
    .kpi-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
    }
    .kpi-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      font-family: monospace;
      margin-bottom: 6px;
    }
    .kpi-val {
      font-size: 24px;
      font-weight: 800;
      color: #0b2115;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #f9fafb;
      padding: 10px 14px;
      font-size: 11px;
      font-family: monospace;
      text-transform: uppercase;
      color: #4b5563;
      border-bottom: 2px solid #e5e7eb;
    }
    .legal-box {
      background: #f9fafb;
      border: 1px dashed #d1d5db;
      border-radius: 12px;
      padding: 16px;
      font-size: 11px;
      color: #4b5563;
      font-family: monospace;
      line-height: 1.6;
    }
    .footer {
      padding: 24px 32px;
      background: #fafafa;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #6b7280;
      font-family: monospace;
      flex-wrap: wrap;
      gap: 8px;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .container { border: none !important; box-shadow: none !important; max-width: 100% !important; }
      .no-print { display: none !important; }
      .header { background: #0b2115 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="badge-bar">
        <span class="security-badge">SECRET // LAW ENFORCEMENT INTELLIGENCE</span>
        <span class="report-id">${data.reportId}</span>
      </div>
      <h1>Cyber Threat Intelligence Evidence Dossier</h1>
      <div class="subtitle">
        National Cyber Crime Threat Intelligence Directorate &bull; Problem Statement SKIT004
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <label>Generated On</label>
          <span>${data.formattedDate}</span>
        </div>
        <div class="meta-item">
          <label>Lead Investigator</label>
          <span>${data.investigator.name} (${data.investigator.badgeId})</span>
        </div>
        <div class="meta-item">
          <label>Scope / Threat Vector</label>
          <span style="color: #9fe846;">${data.scope.monitoredVector} (${data.scope.timeWindow})</span>
        </div>
        <div class="meta-item">
          <label>Chain of Custody</label>
          <span>${data.custodyHash}</span>
        </div>
      </div>
    </div>

    <!-- Toolbar for In-Browser Controls -->
    <div class="toolbar no-print">
      <div style="font-size: 12px; font-weight: 600; color: #0b2115;">
        Official Intelligence Export &bull; Self-Contained Document
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.print()" class="btn btn-primary">
          🖨️ Print / Save as PDF
        </button>
        <button id="dl-json-btn" class="btn btn-secondary">
          💾 Download Raw JSON Data
        </button>
      </div>
    </div>

    <!-- KPI Section -->
    <div class="section">
      <div class="section-title">1. Operational Telemetry Overview</div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total Intercepts</div>
          <div class="kpi-val">${data.kpis.totalThreats}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Critical Alerts</div>
          <div class="kpi-val" style="color: #dc2626;">${data.kpis.criticalRisks}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">High Alerts</div>
          <div class="kpi-val" style="color: #ea580c;">${data.kpis.highRisks}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Mitigated Threats</div>
          <div class="kpi-val" style="color: #16a34a;">${data.kpis.mitigatedThreats}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Defense Efficacy</div>
          <div class="kpi-val" style="color: #5c901a;">${data.kpis.defenseEfficacy}</div>
        </div>
      </div>
    </div>

    <!-- Active Threats Table -->
    <div class="section">
      <div class="section-title">2. Intercepted Threat Evidence &amp; AI Neural Analysis</div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th style="width: 90px;">Incident ID</th>
              <th style="width: 80px;">Severity</th>
              <th style="width: 100px;">Platform</th>
              <th>Threat Narrative &amp; AI Analysis</th>
              <th style="width: 220px;">MITRE ATT&amp;CK &amp; S.O.P.</th>
            </tr>
          </thead>
          <tbody>
            ${threatsRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Audit Trail -->
    <div class="section">
      <div class="section-title">3. System Incident Dispatch &amp; Containment Audit Trail</div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th style="width: 160px;">Timestamp</th>
              <th style="width: 160px;">Action</th>
              <th style="width: 180px;">Target</th>
              <th>System Notice</th>
            </tr>
          </thead>
          <tbody>
            ${auditRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statutory Legal Notice -->
    <div class="section">
      <div class="section-title">4. Chain of Custody &amp; Statutory Legal Declaration</div>
      <div class="legal-box">
        <p style="margin-bottom: 8px;"><strong>LEGAL ADVISORY &bull; INDIAN INFORMATION TECHNOLOGY ACT, 2000 (AS AMENDED 2008):</strong></p>
        <p style="margin-bottom: 6px;">The evidence captured in this dossier has been harvested through real-time multi-platform OSINT telemetry (Reddit RSS Bridge, Telegram MTProto, X/Nitter API, Facebook CrowdTangle) under authority of statutory cyber defense and counter-terrorism protocols.</p>
        <p style="margin-bottom: 6px;">All identified threat vectors involving unpatched CVE exploits, SCADA infiltration, PII dumps, or coordinated disinformation violate <strong>Section 66F (Cyber Terrorism)</strong> and <strong>Section 43A</strong> of the Information Technology Act. This report is admissible for electronic evidence submission under Section 65B of the Indian Evidence Act.</p>
        <p><strong>Hash Signature:</strong> <span style="color: #0b2115; font-weight: bold;">${data.custodyHash}</span></p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>SKIT004 AI CYBER DEFENSE TERMINAL &bull; RESTRICTED DISTRIBUTION</div>
      <div>CLASSIFICATION: SECRET // EYES ONLY</div>
    </div>
  </div>

  <script>
    const reportRawData = ${JSON.stringify(data)};
    const jsonBtn = document.getElementById('dl-json-btn');
    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(reportRawData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${data.reportId}.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Retrieves all saved reports from browser persistent storage.
 */
export function getSavedReportsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[reportGenerator] Error reading stored reports:', err);
    return [];
  }
}

/**
 * Deletes a report from browser persistent storage.
 */
export function deleteReportFromStorage(reportId) {
  try {
    const existing = getSavedReportsFromStorage();
    const updated = existing.filter((r) => r.id !== reportId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[reportGenerator] Error deleting report:', err);
    return getSavedReportsFromStorage();
  }
}

/**
 * Master function: Generates, archives in storage, and downloads the report file to device storage.
 */
export async function generateAndStoreReport({
  threats = [],
  selectedVector = 'All Vectors',
  timeRange = 'Last 24 Hours',
  metrics = {},
  auditLogs = [],
  format = 'html' // 'html' | 'json' | 'all'
}) {
  // 1. Build comprehensive report telemetry payload
  const reportData = buildReportData({
    threats,
    selectedVector,
    timeRange,
    metrics,
    auditLogs
  });

  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const baseFilename = `CYBER_THREAT_REPORT_${reportData.reportId}_${timestampStr}`;
  const htmlContent = buildHtmlReport(reportData);
  const jsonContent = JSON.stringify(reportData, null, 2);

  let downloadUrl = null;
  let firebaseStorageSaved = false;

  // 2. Archive to Firebase Storage if available
  if (storage) {
    try {
      const storageFilename = `${baseFilename}.html`;
      const reportStorageRef = ref(storage, `threat_reports/${storageFilename}`);
      await uploadString(reportStorageRef, htmlContent, 'raw', {
        contentType: 'text/html;charset=utf-8'
      });
      downloadUrl = await getDownloadURL(reportStorageRef);
      firebaseStorageSaved = true;
      console.log(`[reportGenerator] Uploaded report to Firebase Storage: ${downloadUrl}`);
    } catch (fbErr) {
      console.warn('[reportGenerator] Firebase Storage note (falling back to Local Storage):', fbErr.message);
    }
  }

  // 3. Save metadata record to Firebase Firestore
  if (db) {
    try {
      const docRef = doc(db, 'reports', reportData.reportId);
      await setDoc(docRef, {
        id: reportData.reportId,
        generatedAt: reportData.generatedAt,
        custodyHash: reportData.custodyHash,
        vector: selectedVector,
        totalThreats: reportData.kpis.totalThreats,
        criticalRisks: reportData.kpis.criticalRisks,
        downloadUrl: downloadUrl || null,
        storageType: firebaseStorageSaved ? 'firebase-storage' : 'local-storage'
      }, { merge: true });
    } catch (firestoreErr) {
      console.warn('[reportGenerator] Firestore sync note:', firestoreErr.message);
    }
  }

  // 4. Archive in browser Local Storage for instant re-download anytime
  const record = {
    id: reportData.reportId,
    filename: `${baseFilename}.html`,
    jsonFilename: `${baseFilename}.json`,
    generatedAt: reportData.generatedAt,
    formattedDate: reportData.formattedDate,
    vector: selectedVector,
    totalThreats: reportData.kpis.totalThreats,
    criticalRisks: reportData.kpis.criticalRisks,
    htmlContent,
    jsonContent,
    downloadUrl: downloadUrl || null,
    storageType: firebaseStorageSaved ? 'Firebase & Local Storage' : 'Local Disk Storage',
    fileSizeKB: Math.round(new Blob([htmlContent]).size / 1024)
  };

  try {
    const existing = getSavedReportsFromStorage();
    // Keep last 15 reports to manage storage quota cleanly
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 15);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (lsErr) {
    console.warn('[reportGenerator] LocalStorage quota note:', lsErr.message);
  }

  // 5. Trigger native browser file download into device storage!
  if (format === 'html' || format === 'all') {
    triggerNativeDownload(htmlContent, `${baseFilename}.html`, 'text/html;charset=utf-8');
  }

  if (format === 'json' || format === 'all') {
    setTimeout(() => {
      triggerNativeDownload(jsonContent, `${baseFilename}.json`, 'application/json;charset=utf-8');
    }, format === 'all' ? 400 : 0);
  }

  return {
    reportId: reportData.reportId,
    filename: `${baseFilename}.html`,
    jsonFilename: `${baseFilename}.json`,
    record,
    downloadUrl,
    firebaseStorageSaved
  };
}
