import React from 'react';
import { Star } from 'lucide-react';

export default function RatingChip({ rating = 4.0, count, size = 'sm' }) {
  const isSmall = size === 'sm';
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-[3px] shadow-xs border border-emerald-700/50 ${
          isSmall ? 'text-[11px] px-1.5 py-0.5' : 'text-sm px-2.5 py-0.5'
        }`}
      >
        <span>{Number(rating).toFixed(1)}</span>
        <Star className={isSmall ? 'w-3 h-3 text-[#FFD700] fill-[#FFD700]' : 'w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]'} />
      </span>
      {count && (
        <span className="text-xs text-slate-500 font-medium">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
