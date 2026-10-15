import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SaaSSidebar from './components/SaaSSidebar';
import SaaSHeader from './components/SaaSHeader';
import SaaSChartsSection from './components/SaaSChartsSection';
import { OfficerClearanceCard, IncidentDispatchCard, SystemSopChecklistCard, SystemAuditLogCard } from './components/RightOperationalPanel';
import OverviewView from './components/OverviewView';
import LiveAlertsView from './components/LiveAlertsView';
import ThreatAnalyticsView from './components/ThreatAnalyticsView';
import AnalyticsIOCs from './components/AnalyticsIOCs';
import SettingsView from './components/SettingsView';
import TargetedSweepPanel from './components/TargetedSweepPanel';
import MediaInterrogationView from './components/MediaInterrogationView';
import DashboardAnalytics from './components/DashboardAnalytics';
import Login from './components/Login';
import { useAppMotion } from './context/MotionContext';
import { useOSINT } from './context/OSINTContext';
import { ShieldAlert, CheckCircle2, X, Info } from 'lucide-react';

export default function App() {
  const { pageVariants } = useAppMotion();
  const {
    liveThreats,
    severeRisksCount,
    refreshNow,
    isolateThreat,
    mitigateThreat
  } = useOSINT();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [simulatedAlerts, setSimulatedAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  // Listen for automated or simulated takedown events to show audit notification
  useEffect(() => {
    const handleTakedownEvent = (e) => {
      if (e.detail?.message) {
        showToast('FIREWALL TAKEDOWN CONFIRMED', e.detail.message, 'success');
      }
    };
    window.addEventListener('takedown-success', handleTakedownEvent);
    return () => window.removeEventListener('takedown-success', handleTakedownEvent);
  }, []);

  // Derive all alerts directly from multi-platform OSINT stream (X, Telegram, Facebook, Reddit) + manual simulations
  const alerts = [
    ...simulatedAlerts,
    ...liveThreats.map((t) => ({
      id: t.id,
      timestamp: t.timestamp || 'Live',
      severity: (t.riskLevel || 'medium').toLowerCase(),
      title: t.title,
      target: t.platform === 'Telegram' ? 'MTProto-DarkMesh' : t.platform === 'Facebook' ? 'CrowdTangle-Graph' : t.platform === 'X (Twitter)' ? 'Nitter-Proxy' : 'r/cybersecurity-stream',
      sourceIp: t.source || 'Multi-Platform OSINT Stream',
      vector: t.thematicCategory || 'Government Threat Intelligence',
      mitre: t.thematicCategory?.includes('Identity') || t.thematicCategory?.includes('Credential')
        ? 'T1552 - Unsecured Credentials & PII Dump'
        : t.thematicCategory?.includes('Disinformation')
        ? 'T1584 - Compromise Infrastructure / InfoOps'
        : t.thematicCategory?.includes('Botnet')
        ? 'T1498 - Network Denial of Service'
        : 'T1190 - Exploit Public-Facing Application',
      status: t.status || 'active',
      aiConfidence: `${t.aiConfidence || 95}%`,
      recommendation: t.recommendedAction,
      link: t.link || 'https://www.cisa.gov/known-exploited-vulnerabilities',
      content: t.content
    }))
  ];

  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleIsolateThreat = (alertId) => {
    isolateThreat(alertId);
    setSimulatedAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'mitigating' } : a))
    );
    showToast('Threat Node Isolated', `Containment protocol initiated for incident ${alertId}`, 'success');
  };

  const handleMitigateThreat = (alertId) => {
    mitigateThreat(alertId);
    setSimulatedAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'mitigated' } : a))
    );
    showToast('Threat Mitigated', `Incident ${alertId} successfully marked as neutralized`, 'success');
  };

  const handleSimulateAlert = () => {
    const randomVectors = [
      {
        title: 'Zero-Day Buffer Overflow Inbound',
        target: 'grpc-telemetry-collector-03',
        sourceIp: '194.26.29.112 (Bulletproof VPS)',
        vector: 'CVE-2026-8812 (Arbitrary Memory Write)',
        mitre: 'T1190 - Exploit Public-Facing Application'
      },
      {
        title: 'Anomalous Lateral Pass-the-Hash Movement',
        target: 'vault-secrets-node-02',
        sourceIp: '10.240.12.8 (Internal Infiltration)',
        vector: 'NTLM Hash Replay',
        mitre: 'T1550.002 - Pass the Hash'
      },
      {
        title: 'Autonomous C2 Beaconing Detected',
        target: 'finance-etl-pipeline',
        sourceIp: '89.208.107.5 (Dynamic Fast Flux)',
        vector: 'Encrypted TLS Snippet Tunneling',
        mitre: 'T1071.001 - Web Protocols'
      }
    ];

    const pick = randomVectors[Math.floor(Math.random() * randomVectors.length)];
    const newId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAlert = {
      id: newId,
      timestamp: 'Just now',
      severity: 'critical',
      title: pick.title,
      target: pick.target,
      sourceIp: pick.sourceIp,
      vector: pick.vector,
      mitre: pick.mitre,
      status: 'active',
      aiConfidence: '99.6%',
      recommendation: 'Immediate perimeter quarantine & forensic packet capture',
      link: 'https://www.reddit.com/r/cybersecurity',
      content: `${pick.title} targeting ${pick.target}`
    };

    setSimulatedAlerts((prev) => [newAlert, ...prev]);
    showToast('HIGH SEVERITY ALERT', `${newAlert.title} (${newAlert.id})`, 'danger');
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length || severeRisksCount || 4;

  return (
    <div className="min-h-screen w-full bg-[#F3F5F6] flex items-center justify-center p-2 sm:p-4 text-gray-900 font-sans antialiased overflow-hidden selection:bg-[#0B2115] selection:text-[#9FE846]">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="skip-to-content focus:outline-none focus:ring-2 focus:ring-[#0B2115]"
      >
        Skip to Main Threat Intelligence Content
      </a>

      {/* Screen Reader Live Status Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {toast ? `${toast.title}: ${toast.message}` : ''}
      </div>

      {/* Clean Toast Notification Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-auto"
          >
            <div className="p-4 rounded-xl bg-white shadow-xl border border-[#E5E7EB] flex items-start space-x-3">
              {toast.type === 'danger' ? (
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              ) : toast.type === 'success' ? (
                <div className="w-8 h-8 rounded-lg bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5C901A]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-[#0B2115] flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
              )}
              <div className="text-xs flex-1">
                <div className="font-bold uppercase tracking-wider text-[#0B2115]">{toast.title}</div>
                <div className="text-gray-500 mt-0.5">{toast.message}</div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* If Not Authenticated: Render Login Gateway */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <Login
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              showToast('Clearance Verified', 'Welcome back, Investigator Vance', 'success');
            }}
          />
        ) : (
          /* =========================================================================
              THE 'FLOATING' MASTER CONTAINER:
              Solid light gray background outside: bg-[#F3F5F6]
              Single massive white container: bg-white rounded-[2rem] shadow-xl overflow-hidden flex h-[95vh] w-[98vw] max-w-[1600px] border border-[#E5E7EB]
             ========================================================================= */
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row h-[95vh] w-[98vw] max-w-[1600px] border border-[#E5E7EB] relative">
            {/* The Left Sidebar (Deep Forest Green) */}
            <SaaSSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              alertCount={activeAlertCount}
              onLockTerminal={() => {
                setIsAuthenticated(false);
                showToast('Terminal Locked', 'Investigator session secured', 'info');
              }}
            />

            {/* Right Main Content Column */}
            <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
              {/* The Top Header (Flat & Functional, Pure White) */}
              <SaaSHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                alertCount={activeAlertCount}
                onSimulateAlert={handleSimulateAlert}
                onRefresh={() => {
                  refreshNow();
                  showToast('Telemetry Synced', 'Live multi-platform OSINT stream refreshed', 'info');
                }}
                onExportReport={(result) => {
                  showToast(
                    'Report Downloaded to Storage',
                    `Archived ${result?.filename || 'evidence dossier'} to local and system storage.`,
                    'success'
                  );
                }}
                onVectorChange={(vector) => {
                  showToast('Threat Vector Filter', `Telemetry filtered by: ${vector}`, 'info');
                }}
              />

              {/* Main Content Grid & Panels (Flat Design, Pure White Background) */}
              <main
                id="main-content"
                role="main"
                tabIndex="-1"
                aria-label="Main Threat Intelligence Dashboard"
                className="flex-1 min-w-0 overflow-y-auto p-5 sm:p-6 bg-white focus:outline-none"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={pageVariants.initial}
                    animate={pageVariants.animate}
                    exit={pageVariants.exit}
                    transition={pageVariants.transition}
                    className="w-full"
                  >
                    {(activeTab === 'Overview' || activeTab === 'Radar') && (
                      <OverviewView
                        alerts={alerts}
                        onIsolateThreat={handleIsolateThreat}
                        onNavigateToAlerts={() => setActiveTab('Alerts')}
                      />
                    )}

                    {activeTab === 'ThreatVelocity' && (
                      <div className="space-y-6">
                        <SaaSChartsSection />
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          <OfficerClearanceCard />
                          <IncidentDispatchCard />
                        </div>
                      </div>
                    )}

                    {(activeTab === 'Alerts' || activeTab === 'Live Alerts' || activeTab === 'Threat Feed') && (
                      <LiveAlertsView
                        alerts={alerts}
                        onIsolateThreat={handleIsolateThreat}
                        onMitigateThreat={handleMitigateThreat}
                        onSimulateAlert={handleSimulateAlert}
                      />
                    )}

                    {(activeTab === 'MediaInterrogation' || activeTab === 'Media Interrogation') && (
                      <MediaInterrogationView />
                    )}

                    {(activeTab === 'BotSwarms' || activeTab === 'Bot Swarms') && (
                      <DashboardAnalytics />
                    )}

                    {(activeTab === 'TargetedSweep' || activeTab === 'Targeted Sweep' || activeTab === 'Investigations') && (
                      <TargetedSweepPanel />
                    )}

                    {(activeTab === 'AnalyticsIOCs' || activeTab === 'Analytics & IOCs' || activeTab === 'Analytics' || activeTab === 'Threat Analytics' || activeTab === 'Misinformation' || activeTab === '/analytics') && (
                      <AnalyticsIOCs />
                    )}

                    {activeTab === 'Settings' && <SettingsView />}

                    {activeTab === 'AuditLog' && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <SystemSopChecklistCard />
                        <SystemAuditLogCard />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
