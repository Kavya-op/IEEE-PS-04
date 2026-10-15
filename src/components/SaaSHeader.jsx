import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Calendar,
  RefreshCw,
  FileDown,
  ShieldAlert,
  ChevronDown,
  Check,
  Bug,
  KeyRound,
  Radio,
  AlertTriangle,
  Zap,
  Clock
} from 'lucide-react';
import { useOSINT, matchesThreatVector } from '../context/OSINTContext';
import { generateAndStoreReport } from '../services/reportGenerator';
import ReportModal from './ReportModal';

export const VECTOR_OPTIONS = [
  {
    id: 'all',
    name: 'All Vectors',
    category: 'All',
    description: 'Complete multi-platform threat telemetry across all vectors',
    icon: ShieldAlert,
    badge: 'Global'
  },
  {
    id: 'zeroday',
    name: 'Zero-Day Exploits & Botnets',
    category: 'Malware',
    description: 'Pre-auth RCE exploits, edge appliances, Mirai botnets',
    icon: Bug,
    badge: 'Critical'
  },
  {
    id: 'credentials',
    name: 'Credential & Identity Leaks',
    category: 'Credential Harvesting',
    description: 'Citizen Aadhaar dumps, enterprise SSO session tokens',
    icon: KeyRound,
    badge: 'Critical'
  },
  {
    id: 'phishing',
    name: 'Phishing Lures & Scams',
    category: 'Phishing',
    description: 'Reverse-proxy phishing kits, wire transfer lures, fraud',
    icon: Radio,
    badge: 'Active'
  },
  {
    id: 'disinformation',
    name: 'Disinformation & Deepfakes',
    category: 'Misinformation',
    description: 'Synthesized AI audio/video, viral civil panic narratives',
    icon: AlertTriangle,
    badge: 'High'
  },
  {
    id: 'scada',
    name: 'SCADA & Infrastructure Sabotage',
    category: 'Cybercrime',
    description: 'Modbus / DNP3 command injection on regional power grids',
    icon: Zap,
    badge: 'Critical'
  }
];

export const TIME_OPTIONS = [
  'Last 1 Hour',
  'Last 6 Hours',
  'Last 24 Hours',
  'Last 7 Days',
  'Last 30 Days'
];

export default function SaaSHeader({
  activeTab = 'Overview',
  setActiveTab,
  alertCount = 4,
  onSimulateAlert,
  onRefresh,
  onExportReport,
  onVectorChange,
  currentVector
}) {
  const {
    pollCountdown,
    liveThreats,
    filteredLiveThreats,
    selectedVector = 'All Vectors',
    setVectorFilter,
    activeIngressRate,
    defenseEfficacy,
    auditLogs
  } = useOSINT();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(currentVector || selectedVector || 'All Vectors');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 Hours');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVectorDropdownOpen, setIsVectorDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [lastGeneratedReport, setLastGeneratedReport] = useState(null);

  const vectorDropdownRef = useRef(null);
  const timeDropdownRef = useRef(null);

  // Sync external vector prop or OSINTContext state if changed
  useEffect(() => {
    if (selectedVector && selectedVector !== selectedFilter) {
      setSelectedFilter(selectedVector);
    }
  }, [selectedVector]);

  useEffect(() => {
    if (currentVector && currentVector !== selectedFilter) {
      setSelectedFilter(currentVector);
      if (setVectorFilter) {
        const found = VECTOR_OPTIONS.find((v) => v.name === currentVector);
        setVectorFilter(currentVector, found?.category || 'All');
      }
    }
  }, [currentVector, setVectorFilter]);

  // Click-outside and Escape key listener for robust menu dismissal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (vectorDropdownRef.current && !vectorDropdownRef.current.contains(e.target)) {
        setIsVectorDropdownOpen(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target)) {
        setIsTimeDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsVectorDropdownOpen(false);
        setIsTimeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const handleSelectVector = (vec) => {
    setSelectedFilter(vec.name);
    setIsVectorDropdownOpen(false);

    if (setVectorFilter) {
      setVectorFilter(vec.name, vec.category);
    }

    if (onVectorChange) {
      onVectorChange(vec.name, vec.category);
    }

    // Broadcast system-wide filter change event
    window.dispatchEvent(
      new CustomEvent('vector-filter-change', {
        detail: {
          vector: vec.name,
          category: vec.category
        }
      })
    );
  };

  const handleSelectTimeRange = (time) => {
    setSelectedTimeRange(time);
    setIsTimeDropdownOpen(false);

    window.dispatchEvent(
      new CustomEvent('time-range-change', {
        detail: { timeRange: time }
      })
    );
  };

  // Helper to count active threats per vector
  const getVectorMatchCount = (vec) => {
    if (!liveThreats || liveThreats.length === 0) return 0;
    if (vec.id === 'all') return liveThreats.length;
    return liveThreats.filter((t) => matchesThreatVector(t, vec.name, vec.category)).length;
  };

  const handleGenerateReportClick = async () => {
    setIsGeneratingReport(true);
    try {
      const threatsToExport = (filteredLiveThreats && filteredLiveThreats.length > 0)
        ? filteredLiveThreats
        : liveThreats;

      const result = await generateAndStoreReport({
        threats: threatsToExport,
        selectedVector: selectedFilter,
        timeRange: selectedTimeRange,
        metrics: { activeIngressRate, defenseEfficacy },
        auditLogs: auditLogs || [],
        format: 'html'
      });

      setLastGeneratedReport(result);
      setIsReportModalOpen(true);

      if (onExportReport) {
        onExportReport(result);
      }
    } catch (err) {
      console.error('[SaaSHeader] Error generating report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0 relative z-30">
      {/* Left: Outline Search Bar */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setActiveTab('TargetedSweep');
              }
            }}
            placeholder="Search threats, IOCs, CVEs, or hashes..."
            className="w-full pl-9 pr-4 py-2 text-sm text-[#0B2115] placeholder:text-gray-400 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#0B2115] focus:ring-1 focus:ring-[#0B2115] transition-all"
          />
        </div>
      </div>

      {/* Right: Cluster of Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Interactive Filter / All Vectors Button & Dropdown */}
        <div ref={vectorDropdownRef} className="relative inline-flex items-center">
          <button
            type="button"
            id="all-vectors-filter-btn"
            aria-haspopup="true"
            aria-expanded={isVectorDropdownOpen}
            onClick={() => {
              setIsVectorDropdownOpen((prev) => !prev);
              setIsTimeDropdownOpen(false);
            }}
            className={`border rounded-lg px-3 py-2 text-sm flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              isVectorDropdownOpen
                ? 'border-[#0B2115] bg-[#F3FAEB] text-[#0B2115] ring-2 ring-[#0B2115]/10'
                : selectedFilter !== 'All Vectors'
                ? 'border-[#0B2115] bg-[#0B2115] text-white shadow-sm'
                : 'border-[#E5E7EB] text-gray-700 hover:bg-[#F3FAEB] hover:text-[#0B2115] hover:border-[#0B2115]'
            }`}
          >
            <Filter className={`w-3.5 h-3.5 ${
              isVectorDropdownOpen ? 'text-[#0B2115]' : selectedFilter !== 'All Vectors' ? 'text-[#9FE846]' : 'text-gray-500'
            }`} />
            <span className="max-w-[160px] truncate">{selectedFilter}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isVectorDropdownOpen ? 'rotate-180 text-[#0B2115]' : selectedFilter !== 'All Vectors' ? 'text-[#9FE846]' : 'text-gray-400'
            }`} />
          </button>

          {/* All Vectors Dropdown Menu */}
          {isVectorDropdownOpen && (
            <div
              role="menu"
              aria-label="Monitored Threat Vectors"
              className="absolute top-full right-0 mt-2 w-72 sm:w-84 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-3 py-2 border-b border-[#E5E7EB] flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-bold text-[#0B2115] uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3 h-3 text-[#5C901A]" />
                  <span>Monitored Threat Vectors</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 font-semibold">
                  {VECTOR_OPTIONS.length} Vectors
                </span>
              </div>

              <div className="space-y-1 max-h-[360px] overflow-y-auto custom-scrollbar">
                {VECTOR_OPTIONS.map((vec) => {
                  const Icon = vec.icon;
                  const isSelected = selectedFilter === vec.name;
                  const matchCount = getVectorMatchCount(vec);

                  return (
                    <button
                      key={vec.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectVector(vec)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B2115] text-white shadow-sm'
                          : 'hover:bg-[#F3FAEB] text-gray-700 hover:text-[#0B2115]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#9FE846] text-[#0B2115]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-[#0B2115]'}`}>
                            {vec.name}
                          </div>
                          <div className={`text-[11px] leading-tight truncate mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                            {vec.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 mt-1">
                        {matchCount > 0 && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-white/20 text-[#9FE846]' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {matchCount}
                          </span>
                        )}
                        {isSelected ? (
                          <Check className="w-4 h-4 text-[#9FE846] shrink-0" />
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-[#E5E7EB]">
                            {vec.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Date / Timeframe Outline Button & Dropdown */}
        <div ref={timeDropdownRef} className="relative inline-flex items-center">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isTimeDropdownOpen}
            onClick={() => {
              setIsTimeDropdownOpen((prev) => !prev);
              setIsVectorDropdownOpen(false);
            }}
            className={`border rounded-lg px-3 py-2 text-sm flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              isTimeDropdownOpen
                ? 'border-[#0B2115] bg-[#F3FAEB] text-[#0B2115] ring-2 ring-[#0B2115]/10'
                : 'border-[#E5E7EB] text-gray-700 hover:bg-[#F3FAEB] hover:text-[#0B2115] hover:border-[#0B2115]'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${isTimeDropdownOpen ? 'text-[#0B2115]' : 'text-gray-500'}`} />
            <span>{selectedTimeRange}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180 text-[#0B2115]' : ''}`} />
          </button>

          {/* Time Range Dropdown Menu */}
          {isTimeDropdownOpen && (
            <div
              role="menu"
              aria-label="Timeframe Selection"
              className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-2.5 py-1.5 border-b border-[#E5E7EB] mb-1">
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                  Select Time Window
                </span>
              </div>
              <div className="space-y-0.5">
                {TIME_OPTIONS.map((time) => {
                  const isSelected = selectedTimeRange === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectTimeRange(time)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B2115] text-[#9FE846] font-semibold'
                          : 'text-gray-700 hover:bg-[#F3FAEB] hover:text-[#0B2115]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{time}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#9FE846]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Sync Button */}
        <button
          onClick={handleManualRefresh}
          className="border border-[#E5E7EB] text-gray-700 hover:text-[#0B2115] rounded-lg px-3 py-2 text-sm hover:bg-[#F3FAEB] hover:border-[#0B2115] flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          title={`Sync Live Feeds (Auto-poll in ${pollCountdown}s)`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0B2115]' : 'text-gray-500'}`} />
          <span className="hidden md:inline">Sync</span>
        </button>

        {/* Primary Action Button: Vibrant Lime Green with Deep Forest Green text */}
        <button
          type="button"
          id="generate-report-btn"
          onClick={handleGenerateReportClick}
          disabled={isGeneratingReport}
          className="bg-[#9FE846] hover:bg-[#8fd838] disabled:opacity-75 text-[#0B2115] font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          title="Compile, download, and archive official Cyber Threat Report in storage"
        >
          {isGeneratingReport ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0B2115]" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 text-[#0B2115]" />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Report Generation & Archival Storage Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        threats={(filteredLiveThreats && filteredLiveThreats.length > 0) ? filteredLiveThreats : liveThreats}
        selectedVector={selectedFilter}
        timeRange={selectedTimeRange}
        metrics={{ activeIngressRate, defenseEfficacy }}
        auditLogs={auditLogs || []}
        lastGeneratedResult={lastGeneratedReport}
      />
    </header>
  );
}
