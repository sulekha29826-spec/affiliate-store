import React from 'react';

/**
 * Base Shimmer Skeleton Element
 */
export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer rounded-[2px] ${className}`}
      style={style}
    />
  );
}

/**
 * High-Fidelity Product Card Skeleton
 * Exactly mirrors ProductCard layout with realistic shimmer blocks
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-3 flex flex-col justify-between shadow-xs">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Skeleton className="h-4 w-16 rounded-[2px]" />
          <Skeleton className="h-4 w-12 rounded-[2px]" />
        </div>

        {/* Product Image Placeholder */}
        <div className="w-full h-44 sm:h-48 flex items-center justify-center p-2 mb-3">
          <Skeleton className="w-full h-full rounded" />
        </div>

        {/* Title Lines */}
        <div className="space-y-1.5 mb-2.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>

        {/* Rating Placeholder */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>

      {/* Button CTA Placeholder */}
      <Skeleton className="h-8.5 w-full rounded-[2px]" />
    </div>
  );
}

/**
 * Skeleton for Category Horizontal Navigation Bar
 */
export function CategoryNavSkeleton() {
  return (
    <div className="bg-white border-b border-[#E0E0E0] shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-start sm:justify-around overflow-x-auto no-scrollbar py-2 sm:py-3 gap-6 sm:gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center shrink-0 text-center px-1 space-y-1.5">
              <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
              <Skeleton className="h-3 w-14 sm:w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Hero Promotional Banner
 */
export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden bg-white sm:rounded-[2px] shadow-xs my-2 sm:my-3">
      <Skeleton className="h-44 sm:h-64 md:h-80 w-full" />
    </div>
  );
}

/**
 * Skeleton for DealRow on HomePage
 */
export function DealRowSkeleton({ count = 5 }) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-3 sm:p-4 my-3 max-w-7xl mx-auto shadow-xs">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0F0F0]">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40 sm:w-56" />
          <Skeleton className="h-3 w-64 sm:w-80" />
        </div>
        <Skeleton className="h-7 w-20 rounded-[2px]" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {[...Array(count)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full Skeleton for Product Detail Page (PDP)
 */
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-3" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-3" />
        <Skeleton className="h-3.5 w-44" />
      </div>

      {/* PDP Container */}
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-4 sm:p-6 mb-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Gallery Skeleton */}
          <div className="md:col-span-5 flex flex-col-reverse sm:flex-row gap-3">
            <div className="flex sm:flex-col gap-2 overflow-hidden shrink-0">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-14 h-14 sm:w-16 sm:h-16 rounded-[2px]" />
              ))}
            </div>
            <Skeleton className="flex-1 min-h-[300px] sm:min-h-[400px] rounded-[2px]" />
          </div>

          {/* Details Skeleton */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 rounded-[2px]" />
              <Skeleton className="h-6 sm:h-7 w-full" />
              <Skeleton className="h-6 sm:h-7 w-4/5" />
              
              <div className="flex items-center gap-3 pt-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="pt-2 flex items-baseline gap-3">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>

              {/* Offer box */}
              <Skeleton className="h-24 w-full rounded-[2px] mt-4" />

              {/* Specs */}
              <div className="space-y-2 pt-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Skeleton className="h-11 flex-1 rounded-[2px]" />
              <Skeleton className="h-11 w-32 rounded-[2px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Category Page Skeleton
 */
export function CategoryPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Filters Sidebar */}
        <div className="hidden md:block md:col-span-3 bg-white border border-[#E0E0E0] p-4 rounded-[2px] space-y-4 shadow-xs">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Product Grid */}
        <div className="md:col-span-9 space-y-3">
          <div className="bg-white border border-[#E0E0E0] p-3 rounded-[2px] flex justify-between items-center">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-36" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Universal Default Loader - Completely Replaces Spinners with Shimmer Skeletons
 */
export default function Loader({ text }) {
  return (
    <div className="w-full my-3 space-y-4 animate-fade-in">
      {text && (
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#2874F0] bg-blue-50/80 border border-blue-100 py-2 px-3 rounded-[2px] max-w-sm mx-auto shadow-xs">
          <div className="w-2 h-2 rounded-full bg-[#2874F0] animate-ping" />
          <span>{text}</span>
        </div>
      )}
      <DealRowSkeleton count={5} />
    </div>
  );
}

// Backward compatibility alias
export const ProductSkeleton = ProductCardSkeleton;
