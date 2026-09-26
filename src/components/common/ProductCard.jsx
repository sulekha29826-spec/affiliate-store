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
    <div className="group relative bg-white border border-[#E0E0E0] rounded-[2px] p-3 flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all duration-300 ease-out hover:-translate-y-1.5 animate-fade-in">
      <Link to={`/product/${slug || id}`} className="block">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <PlatformBadge platform={platform} size="xs" />
          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-[#388E3C] bg-green-50 px-1.5 py-0.5 rounded-[2px] border border-green-200/50 group-hover:bg-[#388E3C] group-hover:text-white transition-colors duration-200">
              {discountPercent}% off
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
          className="text-xs sm:text-sm font-medium text-[#212121] leading-tight line-clamp-2 min-h-[2.5rem] mb-1.5 group-hover:text-[#2874F0] transition-colors duration-200"
        >
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-2">
          <RatingChip rating={rating} count={ratingCount} size="sm" />
        </div>

        {/* Price Row */}
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-3">
          <span className="text-base sm:text-lg font-bold text-[#212121] group-hover:text-[#2874F0] transition-colors duration-200">
            {formatCurrency(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-gray-500 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </Link>

      {/* CTA Button */}
      <button
        onClick={handleBuyNow}
        type="button"
        className="w-full bg-[#FB641B] hover:bg-[#e05612] text-white text-xs sm:text-sm font-semibold py-2 px-3 rounded-[2px] flex items-center justify-center gap-1.5 shadow-sm hover:shadow-orange-500/30 active:scale-95 transition-all duration-150 cursor-pointer"
      >
        <span>Buy Now</span>
        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
