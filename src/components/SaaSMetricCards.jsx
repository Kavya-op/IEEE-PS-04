import React from 'react';
import { useOSINT } from '../context/OSINTContext';

export default function SaaSMetricCards() {
  const { totalScannedPosts, severeRisksCount, defenseEfficacy, activeIngressRate } = useOSINT();

  const metrics = [
    {
      id: 'scanned-posts',
      label: 'SCANNED POSTS',
      value: totalScannedPosts,
      trend: '+14.2%',
      trendType: 'positive', // positive/safe
      caption: 'vs. previous 24h window'
    },
    {
      id: 'severe-risks',
      label: 'SEVERE RISKS',
      value: severeRisksCount,
      trend: '+4 Critical',
      trendType: 'negative', // threat
      caption: 'Active threat vectors detected'
    },
    {
      id: 'defense-efficacy',
      label: 'DEFENSE EFFICACY',
      value: defenseEfficacy,
      trend: '+0.8%',
      trendType: 'positive',
      caption: 'Firewall rules enforcing'
    },
    {
      id: 'ingress-rate',
      label: 'INGRESS RATE',
      value: activeIngressRate,
      trend: '18ms Latency',
      trendType: 'positive',
      caption: 'Reddit, X, Telegram mesh'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {metrics.map((card) => {
        const isPositive = card.trendType === 'positive';

        return (
          <div
            key={card.id}
            className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {card.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  isPositive
                    ? 'text-[#5C901A] bg-[#F3FAEB] border border-[#9FE846]/40'
                    : 'text-rose-600 bg-rose-50 border border-rose-200'
                }`}
              >
                {card.trend}
              </span>
            </div>

            <div className="text-3xl font-bold text-[#0B2115] mt-2">
              {card.value}
            </div>

            <div className="text-xs text-gray-400 mt-2 font-mono">
              {card.caption}
            </div>
          </div>
        );
      })}
    </div>
  );
}
