import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import LiveAlertsView from './components/LiveAlertsView';
import ThreatAnalyticsView from './components/ThreatAnalyticsView';
import SettingsView from './components/SettingsView';
import { INITIAL_ALERTS } from './data/mockData';
import Login from './components/Login';
import AccessibilityControls from './components/AccessibilityControls';
import { useAppMotion } from './context/MotionContext';
import { ShieldAlert, CheckCircle2, X, Info } from 'lucide-react';

export default function App() {
  const { pageVariants, neuButtonProps } = useAppMotion();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState('Radar');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleIsolateThreat = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'mitigating',
              recommendation: 'Target node isolated from ingress mesh. Threat signature archived.'
            }
          : a
      )
    );
    showToast('Threat Node Isolated', `Containment protocol initiated for incident ${alertId}`, 'success');
  };

  const handleMitigateThreat = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'mitigated',
              recommendation: 'Threat neutralized. Heuristic signatures added to edge filter.'
            }
          : a
      )
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
      recommendation: 'Immediate perimeter quarantine & forensic packet capture'
    };

    setAlerts((prev) => [newAlert, ...prev]);
    showToast('HIGH SEVERITY ALERT', `${newAlert.title} (${newAlert.id})`, 'danger');
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#1A253C] relative flex flex-col font-sans overflow-x-hidden selection:bg-blue-600/20 selection:text-[#1A253C]">
      {/* Skip to Main Content Link for Keyboard Users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="skip-to-content focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        Skip to Main Threat Intelligence Content
      </a>

      {/* Floating Universal Accessibility Control Center */}
      <AccessibilityControls />

      {/* Screen Reader Live Status Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {toast ? `${toast.title}: ${toast.message}` : ''}
      </div>

      {/* Neumorphic Toast Notification Alert */}
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
              className={`p-4 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 flex items-start space-x-3`}
            >
              {toast.type === 'danger' ? (
                <div className="w-8 h-8 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 text-rose-500">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
              ) : toast.type === 'success' ? (
                <div className="w-8 h-8 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 text-[#2563EB]">
                  <Info className="w-4 h-4" />
                </div>
              )}
              <div className="text-xs flex-1">
                <div className="font-bold uppercase tracking-wider text-[#1A253C]">{toast.title}</div>
                <div className="text-[#52607B] mt-0.5">{toast.message}</div>
              </div>
              <motion.button
                {...neuButtonProps}
                onClick={() => setToast(null)}
                className="w-7 h-7 rounded-full bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center justify-center text-[#52607B] hover:text-[#1A253C] transition-colors cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
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
          <motion.div
            key="authenticated-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 min-w-0"
          >
            {/* Neumorphic Left Sidebar for Desktop & Mobile Drawer */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              alertCount={activeAlertCount}
              onLockTerminal={() => {
                setIsAuthenticated(false);
                showToast('Terminal Locked', 'Investigator session secured', 'info');
              }}
              onRunManualAnalysis={() => {
                setActiveTab('Alerts');
                showToast('Manual Analysis Dispatched', 'Opening OSINT Threat Analyzer & Feed', 'info');
              }}
            />

            {/* Main Content Area: Offset for Persistent Left Sidebar (lg:pl-64) */}
            <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
              {/* Sticky Top Header */}
              <Header
                setMobileOpen={setMobileOpen}
                alertCount={activeAlertCount}
                onSimulateAlert={handleSimulateAlert}
                onRefresh={() => showToast('Telemetry Synced', 'Global OSINT telemetry refreshed', 'info')}
                onLockTerminal={() => {
                  setIsAuthenticated(false);
                  showToast('Terminal Locked', 'Investigator session secured', 'info');
                }}
              />

              {/* Dynamic Content Views with Semantic Landmarks */}
              <main
                id="main-content"
                role="main"
                tabIndex="-1"
                aria-label="Main Threat Intelligence Dashboard"
                className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto focus:outline-none"
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
                    {(activeTab === 'Radar' || activeTab === 'Overview') && (
                      <OverviewView
                        alerts={alerts}
                        onIsolateThreat={handleIsolateThreat}
                        onNavigateToAlerts={() => setActiveTab('Alerts')}
                      />
                    )}

                    {(activeTab === 'Alerts' || activeTab === 'Live Alerts') && (
                      <LiveAlertsView
                        alerts={alerts}
                        onIsolateThreat={handleIsolateThreat}
                        onMitigateThreat={handleMitigateThreat}
                        onSimulateAlert={handleSimulateAlert}
                      />
                    )}

                    {(activeTab === 'Misinformation' || activeTab === 'Threat Analytics') && (
                      <ThreatAnalyticsView />
                    )}

                    {activeTab === 'Settings' && <SettingsView />}
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* Neumorphic Soft Inset Footer */}
              <footer className="mx-4 sm:mx-6 lg:mx-8 mb-6 p-4 rounded-[20px] bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] text-xs text-[#52607B] flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/40">
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  <span className="font-semibold text-[#1A253C]">
                    SKIT004 OSINT Threat Monitoring Engine &bull; System Operational
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#2563EB] font-semibold">
                  Neumorphism Engine &bull; WCAG 2.1 AA Compliant
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
