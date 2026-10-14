import React, { useState } from 'react';
import { useOSINT } from '../context/OSINTContext';

export default function SaaSChartsSection() {
  const { activeIngressRate, severeRisksCount, totalScannedPosts } = useOSINT();
  const [activeTimeRange, setActiveTimeRange] = useState('24H');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);

  const timeRanges = ['1H', '24H', '7D', '1M'];

  // Data for Threat Timeline
  const timelineData = {
    '1H': [
      { time: '10m', value: 18, label: '18 alerts/min' },
      { time: '20m', value: 24, label: '24 alerts/min' },
      { time: '30m', value: 46, label: '46 alerts/min (Spike)' },
      { time: '40m', value: 32, label: '32 alerts/min' },
      { time: '50m', value: 28, label: '28 alerts/min' },
      { time: 'Live', value: 42, label: '42 alerts/min' }
    ],
    '24H': [
      { time: '00:00', value: 16, label: '16 alerts/min' },
      { time: '04:00', value: 22, label: '22 alerts/min' },
      { time: '08:00', value: 52, label: '52 alerts/min (Peak Surges)' },
      { time: '12:00', value: 38, label: '38 alerts/min' },
      { time: '16:00', value: 31, label: '31 alerts/min' },
      { time: '20:00', value: 44, label: '44 alerts/min' },
      { time: 'Live', value: 49, label: '49 alerts/min (Active)' }
    ],
    '7D': [
      { time: 'Mon', value: 120, label: '120k posts' },
      { time: 'Tue', value: 160, label: '160k posts' },
      { time: 'Wed', value: 280, label: '280k posts (Bot Swarm)' },
      { time: 'Thu', value: 195, label: '195k posts' },
      { time: 'Fri', value: 240, label: '240k posts' },
      { time: 'Sat', value: 180, label: '180k posts' },
      { time: 'Sun', value: 245, label: '245k posts' }
    ],
    '1M': [
      { time: 'W1', value: 650, label: '650k posts' },
      { time: 'W2', value: 920, label: '920k posts' },
      { time: 'W3', value: 1420, label: '1.42M posts (DDoS surge)' },
      { time: 'W4', value: 1100, label: '1.10M posts' }
    ]
  };

  const points = timelineData[activeTimeRange] || timelineData['24H'];
  const maxVal = Math.max(...points.map((p) => p.value)) * 1.15 || 100;
  const svgWidth = 620;
  const svgHeight = 200;

  // Compute smooth spline coordinates
  const coords = points.map((pt, i) => {
    const x = (i / (points.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - (pt.value / maxVal) * (svgHeight - 60) - 20;
    return { ...pt, x, y };
  });

  const pathD = coords.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = coords[i - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight} L ${coords[0].x} ${svgHeight} Z`;

  // Donut chart distribution data (Platform Telemetry / Bot Swarm)
  const donutPlatforms = [
    { name: 'Reddit OSINT Stream', percent: 38, count: '540,240', color: '#9FE846' },
    { name: 'X (Twitter API v2)', percent: 30, count: '426,500', color: '#0B2115' },
    { name: 'Telegram Dark Mesh', percent: 20, count: '284,330', color: '#2D6A4F' },
    { name: 'Meta CrowdTangle Bridge', percent: 12, count: '170,600', color: '#52B788' }
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
            <h3 className="text-sm font-bold text-[#0B2115] tracking-tight">
              Threat & Incident Timeline
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live payload ingress velocity and surge detection
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

        {/* SVG Spline Chart */}
        <div className="relative w-full h-52 pt-3">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="saasLimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9FE846" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#9FE846" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Muted Grid Lines */}
            <line x1="30" y1="40" x2="590" y2="40" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="30" y1="90" x2="590" y2="90" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="30" y1="140" x2="590" y2="140" stroke="#F3F4F6" strokeWidth="1" />

            {/* Gradient Fill under Curve */}
            <path d={areaD} fill="url(#saasLimeGradient)" />

            {/* Smooth Spline Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#0B2115"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {coords.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === i ? 6 : 4}
                className="fill-[#9FE846] stroke-[#0B2115] stroke-2 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>

          {/* Dark Forest Hover Tooltip */}
          {hoveredPoint !== null && coords[hoveredPoint] && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -top-2 bg-[#0B2115] text-white text-xs px-2.5 py-1 rounded shadow-md z-20 whitespace-nowrap border border-[#153423]"
              style={{ left: `${(coords[hoveredPoint].x / svgWidth) * 100}%` }}
            >
              <div className="font-semibold text-[#9FE846]">{coords[hoveredPoint].label}</div>
              <div className="text-[10px] text-gray-300">{coords[hoveredPoint].time}</div>
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-[#E5E7EB] font-mono">
          {coords.map((c, i) => (
            <span key={i}>{c.time}</span>
          ))}
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
