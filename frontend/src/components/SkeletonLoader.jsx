import React from 'react';

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="aspect-video w-full bg-border-color/30 rounded-xl animate-pulse" />
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-border-color/30 animate-pulse shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 bg-border-color/30 rounded w-full animate-pulse" />
              <div className="h-4 bg-border-color/30 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
