import React from 'react';

export default function Loader({ text = 'Loading top deals...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div className="w-10 h-10 border-4 border-[#2874F0]/20 border-t-[#2874F0] rounded-full animate-spin" />
      {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white p-3 border border-gray-200 rounded-[2px] animate-pulse flex flex-col justify-between">
      <div className="w-full h-44 bg-gray-200 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
        <div className="h-8 bg-gray-200 rounded w-full mt-3" />
      </div>
    </div>
  );
}
