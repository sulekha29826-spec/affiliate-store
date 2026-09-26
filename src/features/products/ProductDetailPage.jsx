import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByIdOrSlug, getProductsByCategory } from '../../services/productService';
import PlatformBadge from '../../components/common/PlatformBadge';
import RatingChip from '../../components/common/RatingChip';
import ProductCard from '../../components/common/ProductCard';
import { ProductDetailSkeleton } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { trackAndRedirect } from '../../utils/trackClick';
import { 
  ShieldCheck, 
  ExternalLink, 
  Tag, 
  Truck, 
  RotateCcw, 
  ChevronRight,
  Info,
  Share2,
  CheckCircle2
} from 'lucide-react';

export default function ProductDetailPage() {
  const { idOrSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getProductByIdOrSlug(idOrSlug);
        setProduct(data);
        setActiveImageIndex(0);

        if (data && data.categoryId) {
          const related = await getProductsByCategory(data.categoryId);
          setRelatedProducts(related.filter((p) => p.id !== data.id).slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white my-8 border border-gray-200 rounded-[2px]">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Deal Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">The deal you are looking for has expired or is no longer listed.</p>
        <Link
          to="/"
          className="bg-[#2874F0] text-white text-xs font-semibold px-4 py-2 rounded-[2px] inline-block"
        >
          Return to SastaBazar Home
        </Link>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    images = [],
    price,
    originalPrice,
    discountPercent,
    platform,
    affiliateLink,
    rating = 4.5,
    ratingCount = 1420,
    tags = [],
    categoryId,
  } = product;

  const currentImg = images[activeImageIndex] || images[0] || 'https://via.placeholder.com/500x500';

  const handleBuyNow = () => {
    trackAndRedirect(id, platform, affiliateLink);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
        <Link to="/" className="hover:text-[#2874F0]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/category/${categoryId || 'electronics'}`} className="hover:text-[#2874F0] capitalize">
          {categoryId || 'Catalog'}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#212121] font-medium truncate max-w-xs">{title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-4 sm:p-6 mb-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-96 no-scrollbar shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 border rounded-[2px] p-1 overflow-hidden bg-white shrink-0 cursor-pointer transition-all ${
                      idx === activeImageIndex
                        ? 'border-[#2874F0] ring-1 ring-[#2874F0]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative flex items-center justify-center p-4 border border-gray-100 rounded-[2px] min-h-[300px] sm:min-h-[400px]">
              <img
                key={currentImg}
                src={currentImg}
                alt={title}
                className="max-h-[380px] max-w-full object-contain animate-fade-in transition-all duration-300"
              />
              <div className="absolute top-2 left-2">
                <PlatformBadge platform={platform} size="md" />
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Title & Share */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-base sm:text-xl font-semibold text-[#212121] leading-snug">
                  {title}
                </h1>
                <button
                  onClick={handleShare}
                  title="Share Deal"
                  className="p-1.5 rounded text-gray-500 hover:text-[#2874F0] hover:bg-gray-100 transition cursor-pointer shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mb-2 font-medium">Link copied to clipboard!</p>
              )}

              {/* Rating Chip */}
              <div className="flex items-center gap-2 mb-3">
                <RatingChip rating={rating} count={ratingCount} size="md" />
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 font-medium">100% Genuine Partner Deal</span>
              </div>

              {/* Price Row */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 border border-blue-200/80 p-3.5 sm:p-4 rounded-[4px] mb-4 shadow-xs">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {formatCurrency(price)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <>
                      <span className="text-sm text-slate-400 font-semibold line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-green-600 px-2 py-0.5 rounded shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                  Inclusive of all taxes. Verified deal directly linked to {platform?.toUpperCase()}.
                </p>
              </div>

              {/* Available Offers / Deal Features */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Available Partner Perks:
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct checkout via official merchant storefront</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Fast shipping fulfilled directly by {platform?.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <RotateCcw className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>Standard merchant replacement and warranty protection applies</span>
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="border-t border-slate-200 pt-3 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Product Overview:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop CTA Button */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full sm:flex-1 bg-gradient-to-r from-[#FF5200] via-[#FF6000] to-[#E54800] hover:from-[#E54800] hover:to-[#CC3800] text-white font-black py-4 px-6 rounded shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-base cursor-pointer active:scale-95 transition-all duration-150"
                >
                  <span>BUY NOW ON {platform?.toUpperCase()}</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-medium text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                You will be redirected safely to {platform?.toUpperCase()}'s official website.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Affiliate Notice Box */}
      <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-[2px] mb-6 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>Affiliate Disclosure:</strong> When you purchase through links on SastaBazar, we may earn an affiliate commission from our merchant partner at no extra cost to you. Pricing and stock availability are subject to change by the merchant.
        </p>
      </div>

      {/* Related Deals Carousel */}
      {relatedProducts.length > 0 && (
        <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-4 shadow-xs">
          <h2 className="text-base font-bold text-[#212121] mb-3 pb-2 border-b border-gray-200">
            Similar Deals in This Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-300 p-2.5 z-40 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-lg font-black text-slate-900">
            {formatCurrency(price)}
          </span>
          {discountPercent > 0 && (
            <span className="text-[11px] font-black text-white bg-gradient-to-r from-emerald-600 to-green-600 px-1.5 py-0.5 rounded ml-1.5 shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <button
          onClick={handleBuyNow}
          className="bg-gradient-to-r from-[#FF5200] via-[#FF6000] to-[#E54800] text-white text-xs font-black py-2.5 px-5 rounded shadow-md shadow-orange-500/25 active:scale-95 transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
        >
          <span>BUY ON {platform?.toUpperCase()}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
