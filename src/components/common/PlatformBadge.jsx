import React from 'react';

const PLATFORM_STYLES = {
  amazon: {
    label: 'Amazon',
    bg: 'bg-slate-900 text-amber-400 border-amber-500/40 shadow-xs font-bold',
    dot: 'bg-[#FF9900] shadow-[0_0_6px_#FF9900]',
  },
  flipkart: {
    label: 'Flipkart',
    bg: 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold',
    dot: 'bg-[#FFE500] shadow-[0_0_6px_#FFE500]',
  },
  myntra: {
    label: 'Myntra',
    bg: 'bg-[#FF3F6C] text-white border-[#E02654] shadow-xs font-bold',
    dot: 'bg-white',
  },
  meesho: {
    label: 'Meesho',
    bg: 'bg-[#9A217D] text-white border-purple-800 shadow-xs font-bold',
    dot: 'bg-pink-300',
  },
  ajio: {
    label: 'Ajio',
    bg: 'bg-slate-800 text-cyan-300 border-cyan-500/30 shadow-xs font-bold',
    dot: 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]',
  },
  boat: {
    label: 'boAt',
    bg: 'bg-red-600 text-white border-red-700 shadow-xs font-bold',
    dot: 'bg-white',
  },
};

export default function PlatformBadge({ platform = 'other', size = 'sm', className = '' }) {
  const key = platform?.toLowerCase().trim() || 'other';
  const config = PLATFORM_STYLES[key] || {
    label: platform.charAt(0).toUpperCase() + platform.slice(1),
    bg: 'bg-gray-100 text-gray-800 border-gray-300',
    dot: 'bg-gray-500',
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-1.5 py-0.5' 
    : size === 'md'
    ? 'text-xs px-2.5 py-1'
    : 'text-[11px] px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-[3px] uppercase tracking-wider ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
