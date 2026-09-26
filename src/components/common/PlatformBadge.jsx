import React from 'react';

const PLATFORM_STYLES = {
  amazon: {
    label: 'Amazon',
    bg: 'bg-amber-50 text-amber-900 border-amber-300',
    dot: 'bg-[#FF9900]',
  },
  flipkart: {
    label: 'Flipkart',
    bg: 'bg-blue-50 text-blue-900 border-blue-300',
    dot: 'bg-[#2874F0]',
  },
  myntra: {
    label: 'Myntra',
    bg: 'bg-pink-50 text-pink-900 border-pink-300',
    dot: 'bg-[#FF3F6C]',
  },
  meesho: {
    label: 'Meesho',
    bg: 'bg-purple-50 text-purple-900 border-purple-300',
    dot: 'bg-[#9A217D]',
  },
  ajio: {
    label: 'Ajio',
    bg: 'bg-slate-100 text-slate-900 border-slate-300',
    dot: 'bg-[#2C4152]',
  },
  boat: {
    label: 'boAt',
    bg: 'bg-red-50 text-red-900 border-red-300',
    dot: 'bg-[#E60000]',
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
