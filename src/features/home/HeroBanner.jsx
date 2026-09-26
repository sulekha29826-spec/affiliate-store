import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners } from '../../services/bannerService';
import { HeroBannerSkeleton } from '../../components/common/Loader';

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveBanners()
      .then((res) => {
        setBanners(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto advance banner every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return <HeroBannerSkeleton />;
  }

  if (!banners || banners.length === 0) return null;

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const active = banners[currentIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden bg-gray-900 sm:rounded-[2px] shadow-sm group my-2 sm:my-3">
      {/* Banner Slide with smooth key-based crossfade */}
      <Link to={active.link || '/'} className="block">
        <div className="relative h-44 sm:h-64 md:h-80 w-full overflow-hidden">
          <img
            key={active.id || currentIndex}
            src={active.image}
            alt={active.title || 'Special Deal'}
            className="w-full h-full object-cover animate-fade-in group-hover:scale-102 transition-transform duration-700 ease-out"
          />
          {active.title && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 text-white animate-fade-in">
              <span className="inline-block text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#FFE500] bg-black/40 px-2 py-0.5 rounded-[2px] mb-1">
                ⚡ Limited Time Deal
              </span>
              <h2 className="text-base sm:text-2xl md:text-3xl font-bold tracking-tight">{active.title}</h2>
            </div>
          )}
        </div>
      </Link>

      {/* Nav Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevBanner();
            }}
            aria-label="Previous Banner"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-r-[4px] shadow transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              nextBanner();
            }}
            aria-label="Next Banner"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-l-[4px] shadow transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-6 bg-[#FFE500]' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
