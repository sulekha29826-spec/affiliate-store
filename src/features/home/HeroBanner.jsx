import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners } from '../../services/bannerService';

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getActiveBanners().then((res) => {
      setBanners(res);
    }).catch(console.error);
  }, []);

  // Auto advance banner every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const active = banners[currentIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden bg-gray-200 sm:rounded-[2px] shadow-xs group my-2 sm:my-3">
      {/* Banner Slide */}
      <Link to={active.link || '/'}>
        <div className="relative h-44 sm:h-64 md:h-80 w-full overflow-hidden">
          <img
            src={active.image}
            alt={active.title || 'Special Deal'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
          />
          {active.title && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#FFE500]">
                Limited Time Deal
              </span>
              <h2 className="text-base sm:text-2xl font-bold">{active.title}</h2>
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
