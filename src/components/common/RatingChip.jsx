import React from 'react';
import { Star } from 'lucide-react';

export default function RatingChip({ rating = 4.0, count, size = 'sm' }) {
  const isSmall = size === 'sm';
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-0.5 bg-[#388E3C] text-white font-bold rounded-[3px] ${
          isSmall ? 'text-[11px] px-1.5 py-0.5' : 'text-sm px-2 py-0.5'
        }`}
      >
        <span>{Number(rating).toFixed(1)}</span>
        <Star className={isSmall ? 'w-2.5 h-2.5 fill-current' : 'w-3.5 h-3.5 fill-current'} />
      </span>
      {count && (
        <span className="text-xs text-gray-500 font-normal">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
