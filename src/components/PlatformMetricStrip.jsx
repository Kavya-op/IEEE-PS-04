import React from 'react';
import { motion } from 'framer-motion';
import { useAppMotion } from '../context/MotionContext';
import { useOSINT } from '../context/OSINTContext';
import {
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export default function PlatformMetricStrip() {
  const { shouldReduceMotion } = useAppMotion();
  const { totalScannedPosts, activeIngressRate, severeRisksCount, liveThreats } = useOSINT();

  const primaryRedditLink = liveThreats.find((t) => t.platform === 'Reddit')?.link || 'https://www.reddit.com/r/cybersecurity';
  const primaryTwitterLink = liveThreats.find((t) => t.platform === 'X (Twitter)')?.link || 'https://twitter.com/search?q=%23cybersecurity';
  const primaryTelegramLink = liveThreats.find((t) => t.platform === 'Telegram')?.link || 'https://t.me/dark_mesh_intel';
  const primaryFacebookLink = liveThreats.find((t) => t.platform === 'Facebook')?.link || 'https://facebook.com/crowdtangle';

  const platforms = [
    {
      id: 'x-firehose',
      name: 'X (Twitter) Feed',
      platform: 'Nitter RSS Proxy',
      indicatorColor: 'bg-emerald-500',
      statusText: '● Online',
      statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      volume: '482,910',
      velocity: '+12.4% / 24h',
      latency: '18ms',
      sourceBadge: 'Nitter RSS Proxy',
      link: primaryTwitterLink
    },
    {
      id: 'reddit-osint',
      name: 'Reddit OSINT Feed',
      platform: 'r/cybersecurity Stream',
      indicatorColor: 'bg-rose-500',
      statusText: '● Ingress Active',
      statusBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 animate-pulse',
      volume: `${totalScannedPosts}`,
      velocity: activeIngressRate,
      latency: '42ms',
      sourceBadge: 'Reddit Native API',
      link: primaryRedditLink
    },
    {
      id: 'telegram-mesh',
      name: 'Telegram Dark Mesh',
      platform: 'MTProto Dark Mesh',
      indicatorColor: 'bg-emerald-500',
      statusText: '● Online',
      statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      volume: '128,400',
      velocity: '+3.8% / 24h',
      latency: '32ms',
      sourceBadge: 'MTProto Dark Mesh Intercept',
      link: primaryTelegramLink
    },
    {
      id: 'facebook-bridge',
      name: 'Facebook CrowdTangle',
      platform: 'CrowdTangle Public Graph',
      indicatorColor: 'bg-emerald-500',
      statusText: '● Online',
      statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      volume: '892,100',
      velocity: '+8.1% / 24h',
      latency: '28ms',
      sourceBadge: 'CrowdTangle Public Graph',
      link: primaryFacebookLink
    }
  ];

  return (
    <section aria-label="Active Telemetry Nodes" className="w-full">
      {/* Active Telemetry Nodes Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-xs font-mono font-extrabold text-[#1A253C] dark:text-white uppercase tracking-wider">
            Active Telemetry Nodes
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          4 Ingress Nodes Monitored
        </span>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {platforms.map((card) => (
          <motion.div
            key={card.id}
            whileHover={shouldReduceMotion ? {} : { translateY: -2 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 p-4 bg-white dark:bg-[#151E32] rounded-2xl border border-[#E5E9F2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative flex flex-col justify-between overflow-hidden"
          >
            {/* Top Colored Indicator Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${card.indicatorColor}`} />

            {/* Header: Platform Name & Online Status Badge */}
            <div className="flex items-center justify-between gap-1.5 mt-1 mb-2">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 truncate">
                {card.name}
              </span>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${card.statusBadgeClass} shrink-0 truncate max-w-[90px]`}
              >
                {card.statusText}
              </span>
            </div>

            {/* Volume Count & Velocity */}
            <div className="my-1 min-w-0">
              <div className="text-2xl xl:text-3xl font-black font-mono text-[#1A253C] dark:text-white tracking-tight truncate">
                {card.volume}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{card.velocity}</span>
                <span>&bull;</span>
                <span className="text-slate-400 shrink-0">{card.latency}</span>
              </div>
            </div>

            {/* Footer: Verified Source & Origin Link */}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono min-w-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold truncate">
                {card.sourceBadge}
              </span>
              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-bold flex items-center gap-0.5 shrink-0 ml-1 truncate"
                >
                  <span className="hidden sm:inline">[View Intercept ↗]</span>
                  <span className="sm:hidden">[↗]</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
