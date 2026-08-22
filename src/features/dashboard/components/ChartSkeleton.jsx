import React from 'react';

export const ColumnChartSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end items-center gap-4 px-4">
      {/* Simulate column chart bars */}
      <div className="w-full flex justify-center items-end gap-3 h-[220px]">
        {Array(6).fill(0).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-lg"
            style={{
              width: '32px',
              height: `${40 + i * 25}px`,
            }}
          />
        ))}
      </div>
      {/* X-axis labels skeleton */}
      <div className="w-full flex justify-center items-center gap-3">
        {Array(6).fill(0).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            style={{ width: '32px' }}
          />
        ))}
      </div>
    </div>
  );
};

export const PieChartSkeleton = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700 animate-pulse" />
        {/* Inner circle */}
        <div className="absolute inset-8 rounded-full border-8 border-gray-300 dark:border-gray-600 animate-pulse" />
        {/* Center dot */}
        <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
};

export const LineChartSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-4 px-4">
      {/* Simulate line chart with gradient */}
      <div className="w-full h-[200px] relative">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skeleton-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className="text-gray-300 dark:text-gray-600" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" className="text-gray-300 dark:text-gray-600" />
            </linearGradient>
          </defs>
          <polyline
            points="0,150 50,100 100,130 150,80 200,110 250,60 300,90 350,40 400,70"
            fill="url(#skeleton-gradient)"
            className="animate-pulse"
          />
          <polyline
            points="0,150 50,100 100,130 150,80 200,110 250,60 300,90 350,40 400,70"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-300 dark:text-gray-600 animate-pulse"
          />
        </svg>
      </div>
      {/* X-axis labels skeleton */}
      <div className="w-full flex justify-between items-center gap-2">
        {Array(5).fill(0).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            style={{ width: '40px' }}
          />
        ))}
      </div>
    </div>
  );
};

export const AreaChartSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-4 px-4">
      {/* Simulate area chart */}
      <div className="w-full h-[200px] relative">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="area-skeleton-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="area-skeleton-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* First area */}
          <polygon
            points="0,120 50,80 100,100 150,60 200,80 250,50 300,70 350,40 400,60 400,200 0,200"
            fill="url(#area-skeleton-1)"
            className="animate-pulse"
          />
          {/* Second area */}
          <polygon
            points="0,150 50,120 100,140 150,100 200,120 250,90 300,110 350,80 400,100 400,200 0,200"
            fill="url(#area-skeleton-2)"
            className="animate-pulse"
          />
        </svg>
      </div>
      {/* X-axis labels skeleton */}
      <div className="w-full flex justify-between items-center gap-2">
        {Array(5).fill(0).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            style={{ width: '50px' }}
          />
        ))}
      </div>
    </div>
  );
};
