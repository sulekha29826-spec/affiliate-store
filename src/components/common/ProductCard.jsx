import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import PlatformBadge from './PlatformBadge';
import RatingChip from './RatingChip';
import { formatCurrency } from '../../utils/formatCurrency';
import { trackAndRedirect } from '../../utils/trackClick';

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    id,
    title,
    slug,
    images = [],
    price,
    originalPrice,
    discountPercent,
    platform,
    affiliateLink,
    rating = 4.5,
    ratingCount,
  } = product;

  const displayImage = images[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    trackAndRedirect(id, platform, affiliateLink);
  };

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-[4px] p-3 flex flex-col justify-between hover:shadow-xl hover:border-blue-400 transition-all duration-300 ease-out hover:-translate-y-1.5 animate-fade-in shadow-xs">
      <Link to={`/product/${slug || id}`} className="block">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <PlatformBadge platform={platform} size="xs" />
          {discountPercent > 0 && (
            <span className="text-[11px] font-black text-white bg-gradient-to-r from-emerald-600 to-green-600 px-2 py-0.5 rounded shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative w-full h-44 sm:h-48 flex items-center justify-center overflow-hidden bg-white mb-3">
          <img
            src={displayImage}
            alt={title}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out will-change-transform"
          />
        </div>

        {/* Title */}
        <h3
          title={title}
          className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight line-clamp-2 min-h-[2.5rem] mb-1.5 group-hover:text-blue-600 transition-colors duration-200"
        >
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-2">
          <RatingChip rating={rating} count={ratingCount} size="sm" />
        </div>

        {/* Price Row */}
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-3">
          <span className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
            {formatCurrency(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-slate-400 font-semibold line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </Link>

      {/* CTA Button */}
      <button
        onClick={handleBuyNow}
        type="button"
        className="w-full bg-gradient-to-r from-[#FF5200] via-[#FF6000] to-[#E54800] hover:from-[#E54800] hover:to-[#CC3800] text-white text-xs sm:text-sm font-bold py-2.5 px-3 rounded shadow-md shadow-orange-500/25 active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>BUY NOW</span>
        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
