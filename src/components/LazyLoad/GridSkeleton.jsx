import React from 'react';

export default function GridSkeleton() {
  return (
    <div className="DailySuggestions-root" style={{ opacity: 0.7 }}>
      {/* Fake Tabs header */}
      <div style={{ height: '50px', marginBottom: '20px', borderRadius: '12px' }} className="bg-gray-200 dark:bg-gray-800 animate-pulse w-full max-w-md mx-auto" />
      
      <div className="Suggestions-grid">
        {/* Fake Banner */}
        <div className="col-span-2 md:col-span-2 row-span-2 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" style={{ minHeight: '300px' }} />
        
        {/* Fake Products */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`grid-skeleton-${i}`} className="product mt-1 flex flex-col h-full">
            <div className="rounded-2xl border border-gray-200 bg-white p-3 animate-pulse flex-1 flex flex-col h-full dark:bg-gray-800 dark:border-gray-700">
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
              <div className="mt-3 h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="mt-3 h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
