import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useOSINT } from '../context/OSINTContext';
import { fetchRajasthanData, aggregateTimelineTrends } from '../rajasthanPoliceIngester';
import { TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function SaaSChartsSection() {
  const { activeIngressRate, severeRisksCount, totalScannedPosts } = useOSINT();
  const [activeTimeRange, setActiveTimeRange] = useState('ALL');
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);
  const [timelineTrends, setTimelineTrends] = useState(() => aggregateTimelineTrends());

  useEffect(() => {
    fetchRajasthanData().then((data) => {
      if (data && data.length > 0) {
        setTimelineTrends(aggregateTimelineTrends(data));
      }
    });
  }, []);

  const timeRanges = ['7D', '14D', 'ALL'];

  const displayTrends = useMemo(() => {
    if (activeTimeRange === '7D') return timelineTrends.slice(-7);
    if (activeTimeRange === '14D') return timelineTrends.slice(-14);
    return timelineTrends;
  }, [timelineTrends, activeTimeRange]);

  // Donut chart distribution data (Platform Telemetry / Bot Swarm)
  const donutPlatforms = [
    { name: 'State Cyber Police Desk', percent: 44, count: '648,100', color: '#9FE846' },
    { name: 'Reddit OSINT Stream', percent: 26, count: '382,240', color: '#0B2115' },
    { name: 'X (Twitter API v2)', percent: 18, count: '264,500', color: '#2D6A4F' },
    { name: 'Telegram Dark Mesh', percent: 12, count: '176,330', color: '#52B788' }
  ];

  // Circle radius and circumference
  const r = 58;
  const circumference = 2 * Math.PI * r; // ~364.42
  let cumulativePercent = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* 1. Threat & Incident Timeline Chart (spans 2 cols) */}
      <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col justify-between">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#5C901A]" />
              <h3 className="text-sm font-bold text-[#0B2115] tracking-tight">
                Threat Velocity & Incident Surge Dynamics
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              State Cyber Incident Timeline: Online Financial Fraud vs Social Media Crime
            </p>
          </div>

          {/* Timeframe Toggles */}
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg self-start sm:self-auto text-xs font-medium">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveTimeRange(range)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeTimeRange === range
                    ? 'bg-[#0B2115] text-[#9FE846] shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Timeline Velocity Chart */}
        <div className="relative w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayTrends} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="financialFraudGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9FE846" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#9FE846" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="socialMediaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B2115" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0B2115" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#0B2115"
                tick={{ fill: '#0B2115', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis
                stroke="#0B2115"
                tick={{ fill: '#0B2115', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0B2115] border border-[#153423] text-white p-3 rounded-xl shadow-xl text-xs font-mono">
                        <div className="font-bold text-[#9FE846] mb-1.5 flex items-center justify-between gap-4">
                          <span>Incident Date: {label}</span>
                          <span className="text-[10px] bg-[#153423] px-1.5 py-0.5 rounded text-white font-bold">STATE FIRs</span>
                        </div>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span>{entry.name}:</span>
                            </span>
                            <span className="font-bold text-white">{entry.value} cases</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              {/* Primary trend line: #9FE846 */}
              <Area
                type="monotone"
                dataKey="onlineFinancialFraud"
                name="Online Financial Fraud"
                stroke="#9FE846"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#financialFraudGradient)"
                activeDot={{ r: 6, fill: '#9FE846', stroke: '#0B2115', strokeWidth: 2 }}
              />
              {/* Secondary comparison line: Social Media Crime */}
              <Area
                type="monotone"
                dataKey="socialMediaCrime"
                name="Social Media Crime"
                stroke="#0B2115"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#socialMediaGradient)"
                activeDot={{ r: 5, fill: '#0B2115', stroke: '#9FE846', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Metrics */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#E5E7EB] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-pulse" />
            <span>Telemetry Source: Rajasthan Cyber Crime Dataset Aggregations</span>
          </span>
          <span className="text-[#0B2115] font-semibold">
            Primary Surge Vector: <strong className="text-[#5C901A]">Online Financial Fraud</strong>
          </span>
        </div>
      </div>

      {/* 2. Platform Telemetry / Bot Swarm Distribution Donut Chart (spans 1 col) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col justify-between">
        {/* Header */}
        <div className="pb-3 border-b border-[#E5E7EB]">
          <h3 className="text-sm font-bold text-[#0B2115] tracking-tight">
            Platform Telemetry & Bot Swarms
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Ingress distribution by monitored vector
          </p>
        </div>

        {/* Donut Graphic */}
        <div className="relative flex items-center justify-center my-3">
          <svg width="170" height="170" viewBox="0 0 160 160" className="transform -rotate-90">
            {donutPlatforms.map((slice) => {
              const strokeLength = (slice.percent / 100) * circumference;
              const strokeOffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += slice.percent;

              return (
                <circle
                  key={slice.name}
                  cx="80"
                  cy="80"
                  r={r}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="20"
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredDonutSlice(slice)}
                  onMouseLeave={() => setHoveredDonutSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg font-bold text-[#0B2115] leading-tight">
              {hoveredDonutSlice ? `${hoveredDonutSlice.percent}%` : '1.42M'}
            </span>
            <span className="text-[10px] font-medium text-gray-500">
              {hoveredDonutSlice ? hoveredDonutSlice.name.split(' ')[0] : 'Intercepts'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 pt-2 border-t border-[#E5E7EB] text-xs">
          {donutPlatforms.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate max-w-[140px] text-gray-700 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-gray-400">{item.count}</span>
                <span className="font-semibold text-[#0B2115]">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
