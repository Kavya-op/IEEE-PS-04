import React from 'react';

/**
 * Pulsing Neumorphic Skeleton Loader for Alert Cards
 */
export function NeumorphicAlertCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 w-full" aria-label="Loading threat intelligence feed" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#E0E5EC] rounded-2xl p-4 sm:p-5 shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] border border-white/60 animate-pulse transition-all space-y-3"
        >
          {/* Top row badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
              <div className="h-5 w-20 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
            </div>
            <div className="h-4 w-16 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
          </div>

          {/* Author & Title skeleton */}
          <div className="space-y-2 pt-1">
            <div className="h-4 w-1/3 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
            <div className="h-5 w-5/6 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
          </div>

          {/* Post content body snippet */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
            <div className="h-3.5 w-4/5 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
          </div>

          {/* Inset AI Analysis Box skeleton */}
          <div className="p-3.5 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] space-y-2">
            <div className="h-3.5 w-1/4 rounded-full bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF]" />
            <div className="h-3 w-11/12 rounded-full bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF]" />
          </div>

          {/* Bottom row: keywords & action button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1.5">
              <div className="h-5 w-16 rounded-md bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF]" />
              <div className="h-5 w-20 rounded-md bg-[#E0E5EC] shadow-[inset_1px_1px_3px_#A3B1C6,inset_-1px_-1px_3px_#FFFFFF]" />
            </div>
            <div className="h-7 w-28 rounded-full bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Pulsing Neumorphic Skeleton Loader for KPI Metric Cards
 */
export function NeumorphicKPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="status" aria-label="Loading KPI Metrics">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#E0E5EC] rounded-3xl p-5 shadow-[9px_9px_16px_#A3B1C6,-9px_-9px_16px_#FFFFFF] border border-white/60 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
            <div className="w-8 h-8 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-8 w-24 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]" />
            <div className="h-3.5 w-32 rounded-full bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]" />
          </div>
          <div className="h-10 w-full rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] mt-2" />
        </div>
      ))}
    </div>
  );
}

/**
 * Pulsing Neumorphic Skeleton Loader for Emerging Topics
 */
export function NeumorphicTopicsSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse" role="status" aria-label="Loading emerging topics">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF] space-y-2"
        >
          <div className="flex justify-between items-center">
            <div className="h-3.5 w-16 rounded-full bg-[#E0E5EC] shadow-[inset_1px_1px_2px_#A3B1C6,inset_-1px_-1px_2px_#FFFFFF]" />
            <div className="h-3 w-8 rounded-full bg-[#E0E5EC] shadow-[1px_1px_3px_#A3B1C6,-1px_-1px_3px_#FFFFFF]" />
          </div>
          <div className="h-2 w-full rounded-full bg-[#A3B1C6]/30 shadow-[inset_1px_1px_2px_#A3B1C6]" />
        </div>
      ))}
    </div>
  );
}

export default {
  NeumorphicAlertCardSkeleton,
  NeumorphicKPISkeleton,
  NeumorphicTopicsSkeleton
};
