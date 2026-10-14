import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FintechHeader from './components/FintechHeader';
import SlimIconRail from './components/SlimIconRail';
import FintechThreatSearch from './components/FintechThreatSearch';
import { SystemSopChecklistCard, LiveStreamTickerCard, SystemAuditLogCard } from './components/RightOperationalPanel';
import OverviewView from './components/OverviewView';
import LiveAlertsView from './components/LiveAlertsView';
import ThreatAnalyticsView from './components/ThreatAnalyticsView';
import SettingsView from './components/SettingsView';
import TargetedSweepPanel from './components/TargetedSweepPanel';
import Login from './components/Login';
import AccessibilityControls from './components/AccessibilityControls';
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

  const [isAuthenticated, setIsAuthenticated] = useState(true);
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
    <div className="min-h-screen bg-[#F0F3F8] dark:bg-[#0B1120] text-[#1E293B] dark:text-slate-100 relative flex flex-col font-sans overflow-x-hidden selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
      {/* Skip to Main Content Link for Keyboard Users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="skip-to-content focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        Skip to Main Threat Intelligence Content
      </a>

      {/* Screen Reader Live Status Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {toast ? `${toast.title}: ${toast.message}` : ''}
      </div>

      {/* Crisp Toast Notification Alert */}
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
            <div
              className="p-4 rounded-2xl bg-white dark:bg-[#151E32] shadow-xl border border-[#E5E9F2] dark:border-slate-800 flex items-start space-x-3"
            >
              {toast.type === 'danger' ? (
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
              ) : toast.type === 'success' ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
              )}
              <div className="text-xs flex-1">
                <div className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">{toast.title}</div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
          <motion.div
            key="login"
            initial={pageVariants.initial}
            animate={pageVariants.animate}
            exit={pageVariants.exit}
            transition={pageVariants.transition}
            className="w-full min-h-screen"
          >
            <Login
              onLoginSuccess={() => {
                setIsAuthenticated(true);
                showToast('Clearance Verified', 'Welcome back, Investigator Vance', 'success');
              }}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col flex-1 min-w-0">
            {/* Top Dual Header System (Sub-Header Live Ticker + Solid Cobalt Blue Main Navbar) */}
            <FintechHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              alertCount={activeAlertCount}
              onSimulateAlert={handleSimulateAlert}
              onRefresh={() => {
                refreshNow();
                showToast('Telemetry Synced', 'Live Reddit OSINT stream refreshed', 'info');
              }}
              onLockTerminal={() => {
                setIsAuthenticated(false);
                showToast('Terminal Locked', 'Investigator session secured', 'info');
              }}
            />

            {/* Layout Wrapper with Slim Nav Icon Rail */}
            <div className="flex flex-1 min-w-0 w-full relative">
              <SlimIconRail
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                alertCount={activeAlertCount}
                onLockTerminal={() => {
                  setIsAuthenticated(false);
                  showToast('Terminal Locked', 'Investigator session secured', 'info');
                }}
              />

              {/* Master Content Area below Navbar */}
              <main
                id="main-content"
                role="main"
                tabIndex="-1"
                aria-label="Main Threat Intelligence Dashboard"
                className="flex-1 min-w-0 overflow-x-hidden focus:outline-none"
              >
                {/* Master Container: Responsive Flex Layout */}
                <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 w-full max-w-[1600px] mx-auto">
                  {/* Left Column (Threat Surveillance/Interrogate): w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 space-y-6 */}
                  <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 space-y-6">
                    {/* Accessibility & Display Controls Bar */}
                    <AccessibilityControls />

                    {/* Threat Surveillance Query Banner */}
                    <FintechThreatSearch
                      onInitiateDeepSweep={(query) => {
                        setActiveTab('TargetedSweep');
                        showToast('Deep Sweep Launched', `Investigating query: "${query}"`, 'info');
                      }}
                      onNavigateToSweep={(query) => {
                        setActiveTab('TargetedSweep');
                        showToast('Targeted Interrogate', `Targeting query: "${query}"`, 'info');
                      }}
                    />

                    {/* Operational SOP Defense Checklist */}
                    <SystemSopChecklistCard />

                    {/* Live Stream Ingress Ticker with Simulated Takedowns */}
                    <LiveStreamTickerCard
                      onSelectThreat={(threat) => {
                        setActiveTab('TargetedSweep');
                        showToast('Threat Loaded', `Loaded ${threat.id} into Investigation Sandbox`, 'info');
                      }}
                    />

                    {/* Live Firewall & Mitigation Audit Log */}
                    <SystemAuditLogCard />
                  </div>

                  {/* Right Column (Investigator Profile & Dispatch): w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6 */}
                  <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6 min-w-0">
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

                        {(activeTab === 'Alerts' || activeTab === 'Live Alerts' || activeTab === 'Threat Feed') && (
                          <LiveAlertsView
                            alerts={alerts}
                            onIsolateThreat={handleIsolateThreat}
                            onMitigateThreat={handleMitigateThreat}
                            onSimulateAlert={handleSimulateAlert}
                          />
                        )}

                        {(activeTab === 'BotSwarms' || activeTab === 'Bot Swarms') && (
                          <OverviewView
                            alerts={alerts}
                            onIsolateThreat={handleIsolateThreat}
                            onNavigateToAlerts={() => setActiveTab('Alerts')}
                          />
                        )}

                        {(activeTab === 'TargetedSweep' || activeTab === 'Targeted Sweep' || activeTab === 'Investigations') && (
                          <TargetedSweepPanel />
                        )}

                        {(activeTab === 'Misinformation' || activeTab === 'Threat Analytics' || activeTab === 'Analytics') && (
                          <ThreatAnalyticsView />
                        )}

                        {activeTab === 'Settings' && <SettingsView />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </main>
            </div>

            {/* Clean Footer Bar */}
            <footer className="px-6 py-4 bg-white dark:bg-[#151E32] border-t border-[#E5E9F2] dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  ThreatRadar // SKIT004 &bull; DEFCON 2 Surveillance Mesh Online
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#2563EB] dark:text-blue-400 font-semibold flex items-center gap-2">
                <span>Real-Time OSINT Data Stream</span>
                <span>&bull;</span>
                <a
                  href="https://www.reddit.com/r/cybersecurity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>r/cybersecurity</span>
                </a>
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
