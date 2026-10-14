import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import {
  Activity,
  TrendingUp,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function ThreatVelocityChart() {
  const { shouldReduceMotion } = useAppMotion();
  const { activeIngressRate, severeRisksCount, defenseEfficacy } = useOSINT();
  const [activeTimeRange, setActiveTimeRange] = useState('24H'); // '1H' | '24H' | '7D' | '1M'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const timeRanges = ['1H', '24H', '7D', '1M'];

  // Datasets per timeframe
  const dataPointsByRange = {
    '1H': [
      { time: '10m ago', value: 18, label: '18 posts/s' },
      { time: '20m ago', value: 24, label: '24 posts/s' },
      { time: '30m ago', value: 46, label: '46 posts/s (Spike)' },
      { time: '40m ago', value: 32, label: '32 posts/s' },
      { time: '50m ago', value: 28, label: '28 posts/s' },
      { time: 'Live', value: 38, label: '38 posts/s' }
    ],
    '24H': [
      { time: '00:00', value: 14, label: '14 posts/s' },
      { time: '04:00', value: 22, label: '22 posts/s' },
      { time: '08:00', value: 48, label: '48.2 posts/s (Peak Ingress)' },
      { time: '12:00', value: 36, label: '36 posts/s' },
      { time: '16:00', value: 29, label: '29 posts/s' },
      { time: '20:00 - Live', value: 42, label: '42 posts/s (Active Mesh)' }
    ],
    '7D': [
      { time: 'Mon', value: 16, label: '16k posts' },
      { time: 'Tue', value: 28, label: '28k posts' },
      { time: 'Wed', value: 52, label: '52k posts (Mirai DDoS Surge)' },
      { time: 'Thu', value: 34, label: '34k posts' },
      { time: 'Fri', value: 44, label: '44k posts' },
      { time: 'Today', value: 40, label: '40k posts' }
    ],
    '1M': [
      { time: 'W1', value: 120, label: '120k posts' },
      { time: 'W2', value: 180, label: '180k posts' },
      { time: 'W3', value: 290, label: '290k posts (Coordinated Botnet)' },
      { time: 'W4', value: 210, label: '210k posts' },
      { time: 'Current', value: 245, label: '245k posts' }
    ]
  };

  const currentPoints = dataPointsByRange[activeTimeRange] || dataPointsByRange['24H'];

  // Normalize points for 600x180 SVG viewport
  const maxVal = Math.max(...currentPoints.map((p) => p.value)) * 1.15 || 100;
  const svgWidth = 600;
  const svgHeight = 160;

  const coords = currentPoints.map((pt, i) => {
    const x = (i / (currentPoints.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - (pt.value / maxVal) * (svgHeight - 40) - 15;
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

  return (
    <div className="bg-white dark:bg-[#151E32] rounded-2xl p-5 border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4">
      {/* Top Header: Title & Timeframe Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-extrabold text-[#1A253C] dark:text-white tracking-tight">
              Threat Ingress Velocity & Payload Cadence (Spline Analysis)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Spatio-temporal mapping of automated swarms, synchronized bursts, and payload repetition windows
          </p>
        </div>

        {/* Time Toggles: 1H, 24H, 7D, 1M */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto font-mono text-xs">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTimeRange === range
                  ? 'bg-white dark:bg-[#151E32] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Peak Burst Velocity</div>
          <div className="text-sm font-black text-rose-600 mt-0.5">48.2 posts/sec</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Active Mean Ingress</div>
          <div className="text-sm font-black text-[#1A253C] dark:text-white mt-0.5">{activeIngressRate}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Severe Risk Flags</div>
          <div className="text-sm font-black text-amber-600 mt-0.5">{severeRisksCount} Active Flags</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Defense Efficacy</div>
          <div className="text-sm font-black text-emerald-600 mt-0.5">{defenseEfficacy}</div>
        </div>
      </div>

      {/* Interactive Spline Chart */}
      <div className="relative w-full h-44 overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cobaltSplineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="30" x2="580" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" opacity="0.6" />
          <line x1="20" y1="75" x2="580" y2="75" stroke="#E2E8F0" strokeDasharray="3 3" opacity="0.6" />
          <line x1="20" y1="120" x2="580" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" opacity="0.6" />

          {/* Spline Area Fill */}
          <motion.path
            d={areaD}
            fill="url(#cobaltSplineGradient)"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Spline Stroke Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* Interactive Data Points */}
          {coords.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === i ? 6 : 4}
                className="fill-[#2563EB] stroke-white stroke-2 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hovered Tooltip */}
        {hoveredPoint !== null && coords[hoveredPoint] && (
          <div
            className="absolute -top-1 pointer-events-none transform -translate-x-1/2 bg-slate-900 text-white text-[11px] font-mono px-2.5 py-1 rounded shadow-lg z-20 whitespace-nowrap border border-slate-700"
            style={{ left: `${(coords[hoveredPoint].x / svgWidth) * 100}%` }}
          >
            <div className="font-bold text-blue-400">{coords[hoveredPoint].label}</div>
            <div className="text-[9px] text-slate-300">{coords[hoveredPoint].time}</div>
          </div>
        )}
      </div>

      {/* Time Progression Horizontal Grid Header */}
      <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 pt-1 border-t border-slate-100 dark:border-slate-800">
        {currentPoints.map((pt, i) => (
          <span key={i} className="truncate">
            {pt.time}
          </span>
        ))}
      </div>
    </div>
  );
}
