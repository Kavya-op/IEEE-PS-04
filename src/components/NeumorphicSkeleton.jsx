import React from 'react';

/**
 * Pulsing Flat SaaS Skeleton Loader for Alert Cards
 */
export function NeumorphicAlertCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 w-full" aria-label="Loading threat intelligence feed" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm animate-pulse space-y-3"
        >
          {/* Top row badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded bg-gray-100 border border-gray-200" />
              <div className="h-5 w-20 rounded bg-gray-100 border border-gray-200" />
            </div>
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>

          {/* Author & Title skeleton */}
          <div className="space-y-2 pt-1">
            <div className="h-4 w-1/3 rounded bg-gray-100" />
            <div className="h-5 w-5/6 rounded bg-gray-100" />
          </div>

          {/* Post content body snippet */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full rounded bg-gray-100" />
            <div className="h-3.5 w-4/5 rounded bg-gray-100" />
          </div>

          {/* AI Analysis Box skeleton */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
            <div className="h-3.5 w-1/4 rounded bg-gray-200" />
            <div className="h-3 w-11/12 rounded bg-gray-200" />
          </div>

          {/* Bottom row: keywords & action button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1.5">
              <div className="h-5 w-16 rounded bg-gray-100" />
              <div className="h-5 w-20 rounded bg-gray-100" />
            </div>
            <div className="h-7 w-28 rounded-lg bg-gray-100 border border-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Pulsing Flat SaaS Skeleton Loader for KPI Metric Cards
 */
export function NeumorphicKPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="status" aria-label="Loading KPI Metrics">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="w-8 h-8 rounded-lg bg-gray-100" />
          </div>
          <div className="space-y-1.5">
            <div className="h-8 w-24 rounded bg-gray-100" />
            <div className="h-3.5 w-32 rounded bg-gray-100" />
          </div>
          <div className="h-6 w-full rounded bg-gray-50 mt-2" />
        </div>
      ))}
    </div>
  );
}

/**
 * Pulsing Flat SaaS Skeleton Loader for Emerging Topics
 */
export function NeumorphicTopicsSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse" role="status" aria-label="Loading emerging topics">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2"
        >
          <div className="flex justify-between items-center">
            <div className="h-3.5 w-16 rounded bg-gray-200" />
            <div className="h-3 w-8 rounded bg-gray-200" />
          </div>
          <div className="h-2 w-full rounded bg-gray-200" />
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
