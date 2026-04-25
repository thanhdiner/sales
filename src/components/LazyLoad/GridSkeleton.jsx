import React from 'react';

export default function GridSkeleton() {
  return (
    <div className="DailySuggestions-root" style={{ opacity: 0.7 }}>
      {/* Fake Tabs header */}
      <div style={{ height: '50px', marginBottom: '20px', borderRadius: '12px' }} className="bg-gray-200 dark:bg-[#151719] animate-pulse w-full max-w-md mx-auto" />
      
      <div className="Suggestions-grid">
        {/* Fake Banner */}
        <div className="col-span-2 md:col-span-2 row-span-2 rounded-2xl bg-gray-200 dark:border dark:border-white/10 dark:bg-[#101213] animate-pulse" style={{ minHeight: '300px' }} />
        
        {/* Fake Products */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`grid-skeleton-${i}`} className="product mt-1 flex flex-col h-full">
            <div className="rounded-2xl border border-gray-200 bg-white p-3 animate-pulse flex-1 flex flex-col h-full dark:border-white/10 dark:bg-[linear-gradient(180deg,#101213_0%,#151719_100%)]">
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-[#202327]" />
              <div className="mt-3 space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-[#202327] rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-[#202327] rounded w-2/3" />
              </div>
              <div className="mt-3 h-6 bg-gray-200 dark:bg-[#202327] rounded w-1/2" />
              <div className="mt-3 h-8 bg-gray-200 dark:bg-green-500/25 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
