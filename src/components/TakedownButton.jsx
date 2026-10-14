import React, { useState } from 'react';
import { useOSINT } from '../context/OSINTContext';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';

export default function TakedownButton({ threat, onTakedownSuccess }) {
  const { executeTakedown, mitigationStates } = useOSINT();
  const [localProcessing, setLocalProcessing] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);

  const globalStatus = mitigationStates?.[threat?.id] || threat?.status;
  const isMitigating = localProcessing || globalStatus === 'mitigating';
  const isMitigated = localSuccess || globalStatus === 'mitigated';

  const isHighRisk =
    threat?.riskLevel === 'Critical' ||
    threat?.riskLevel === 'High' ||
    threat?.threatLevel === 'Critical' ||
    threat?.threatLevel === 'High';

  if (!isHighRisk && !isMitigating && !isMitigated) {
    return null;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMitigating || isMitigated) return;

    setLocalProcessing(true);
    executeTakedown(threat.id, threat.title);

    setTimeout(() => {
      setLocalProcessing(false);
      setLocalSuccess(true);
      onTakedownSuccess?.(threat);
    }, 2500);
  };

  if (isMitigated) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-[#F3FAEB] text-[#5C901A] border border-[#9FE846]/40 shrink-0 whitespace-nowrap shadow-xs"
        title="Firewall takedown executed. IP/Domain null-routed."
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#5C901A]" />
        <span>Takedown Confirmed</span>
      </span>
    );
  }

  if (isMitigating) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg animate-pulse bg-amber-500 text-white border border-amber-600 cursor-not-allowed shrink-0 whitespace-nowrap"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Pushing to Firewall...</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-[#9FE846] hover:bg-[#8fd838] text-[#0B2115] border border-[#8fd838] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 whitespace-nowrap"
      title="Deploy instant cloud firewall null-route to Cloudflare & AWS WAF"
    >
      <Shield className="w-3.5 h-3.5 text-[#0B2115]" />
      <span>Execute Takedown</span>
    </button>
  );
}
