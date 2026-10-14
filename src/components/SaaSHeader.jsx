import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  RefreshCw,
  FileDown,
  ShieldAlert,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useOSINT } from '../context/OSINTContext';

export default function SaaSHeader({
  activeTab = 'Overview',
  setActiveTab,
  alertCount = 4,
  onSimulateAlert,
  onRefresh,
  onExportReport
}) {
  const { isPolling, pollCountdown, refreshNow, totalScannedPosts } = useOSINT();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Vectors');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 Hours');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0">
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
        {/* Filter Outline Button */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            className="border border-[#E5E7EB] text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-[#F3FAEB] hover:text-[#0B2115] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>{selectedFilter}</span>
          </button>
        </div>

        {/* Date / Timeframe Outline Button */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            className="border border-[#E5E7EB] text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-[#F3FAEB] hover:text-[#0B2115] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{selectedTimeRange}</span>
          </button>
        </div>

        {/* Telemetry Sync Button */}
        <button
          onClick={handleManualRefresh}
          className="border border-[#E5E7EB] text-gray-700 hover:text-[#0B2115] rounded-lg px-3 py-2 text-sm hover:bg-[#F3FAEB] flex items-center gap-1.5 transition-colors cursor-pointer"
          title={`Sync Live Feeds (Auto-poll in ${pollCountdown}s)`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0B2115]' : 'text-gray-500'}`} />
          <span className="hidden md:inline">Sync</span>
        </button>

        {/* Primary Action Button: Vibrant Lime Green with Deep Forest Green text */}
        <button
          onClick={onExportReport}
          className="bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-[#0B2115]" />
          <span>Generate Report</span>
        </button>
      </div>
    </header>
  );
}
