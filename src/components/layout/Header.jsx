import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Flame, ShieldAlert, X, ArrowRight, Tag, TrendingUp } from 'lucide-react';
import { getActiveProducts } from '../../services/productService';
import { handleImageError } from '../../utils/imageFallback';

const POPULAR_SEARCH_TAGS = [
  'Smartwatch',
  'boAt Earbuds',
  'Running Shoes',
  'Under ₹999',
  'Noise Buds',
  'Flat 70% Off',
  'Fastrack Watch',
  'Gaming Headphones',
  'Power Bank'
];

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Preload products for instant instant-search suggestions
  useEffect(() => {
    let isMounted = true;
    getActiveProducts()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.warn('Could not preload search products:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectKeyword = (keyword) => {
    setSearchTerm(keyword);
    setIsFocused(false);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const handleSelectProduct = (product) => {
    setIsFocused(false);
    navigate(`/product/${product.slug || product.id}`);
  };

  // Filter products dynamically based on search keywords
  const matchedSuggestions = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    const tokens = term.split(/\s+/).filter(Boolean);

    return products
      .filter((p) => {
        const searchableText = `${p.title || ''} ${p.brand || ''} ${p.categoryId || ''} ${p.subCategory || ''} ${p.platform || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
        return tokens.every((token) => searchableText.includes(token));
      })
      .slice(0, 5);
  }, [searchTerm, products]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1746B3] via-[#1D4ED8] to-[#2563EB] text-white shadow-lg border-b border-blue-400/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col shrink-0 group transition-transform duration-200 group-hover:scale-102">
            <span className="text-xl sm:text-2xl font-black italic tracking-tight text-white leading-none">
              Sasta<span className="text-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">Bazar</span>
            </span>
            <span className="text-[10px] text-blue-100 italic flex items-center gap-1 group-hover:text-white transition-colors">
              Explore <span className="text-[#FFD700] font-black">Plus Deals</span>
              <Flame className="w-2.5 h-2.5 text-[#FFD700] fill-current animate-pulse" />
            </span>
          </Link>

          {/* Search Bar with Autocomplete Suggestions Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center transition-all duration-200 shadow-md rounded-[3px] overflow-hidden bg-white">
                <input
                  type="text"
                  value={searchTerm}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsFocused(false);
                  }}
                  placeholder="Search for products, brands and best deals..."
                  className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-4 pr-16 py-2 sm:py-2.5 focus:outline-none"
                />

                {/* Clear Button with comfortable touch target */}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                    className="absolute right-12 top-0 bottom-0 px-2.5 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Search Submit Button */}
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-blue-950 font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>
              </div>
            </form>

            {/* Mobile Backdrop Overlay when search is focused */}
            {isFocused && (
              <div
                className="fixed inset-0 bg-black/40 z-40 sm:hidden backdrop-blur-2xs"
                onClick={() => setIsFocused(false)}
              />
            )}

            {/* Keyword Suggestions Dropdown */}
            {isFocused && (
              <div className="fixed left-2 right-2 sm:left-0 sm:right-auto sm:absolute top-[56px] sm:top-full mt-1.5 w-auto sm:w-full sm:min-w-[520px] sm:max-w-2xl bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in-50 duration-150 max-h-[75vh] sm:max-h-[520px] overflow-y-auto">
                {/* Mode 1: Typing text with live product matches */}
                {searchTerm.trim().length > 0 ? (
                  <div>
                    {matchedSuggestions.length > 0 ? (
                      <div className="py-1">
                        <div className="px-3.5 sm:px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 bg-slate-50/60">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-blue-600" />
                            <span>Matching Verified Deals ({matchedSuggestions.length})</span>
                          </div>
                          <span className="text-[10px] text-slate-400 lowercase font-medium">tap to view deal</span>
                        </div>
                        {matchedSuggestions.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelectProduct(product)}
                            className="w-full text-left px-3.5 sm:px-4 py-2.5 flex items-center gap-3 sm:gap-3.5 hover:bg-blue-50/70 transition-colors border-b border-slate-100 last:border-0 cursor-pointer min-h-[56px] group"
                          >
                            <img
                              src={product.imageUrl || (product.images && product.images[0]) || 'https://via.placeholder.com/60'}
                              alt={product.title}
                              onError={(e) => handleImageError(e, product.categoryId)}
                              className="w-11 h-11 sm:w-12 sm:h-12 object-contain bg-white p-1 rounded-md border border-slate-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0 pr-1">
                              <p className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                                {product.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] flex-wrap">
                                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                  ₹{product.price ? Number(product.price).toLocaleString('en-IN') : '0'}
                                </span>
                                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                  <span className="text-[11px] text-slate-400 line-through">
                                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                                  </span>
                                )}
                                {product.discountPercent > 0 && (
                                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded text-[10px]">
                                    {product.discountPercent}% OFF
                                  </span>
                                )}
                                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 px-1.5 py-0.2 rounded capitalize">
                                  {product.platform || 'Online'}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="w-full text-center py-3 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border-t border-slate-100"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>See all deals matching "{searchTerm}"</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 text-center">
                        <p className="text-xs sm:text-sm text-slate-500">
                          No direct matches found for <span className="font-bold text-slate-800">"{searchTerm}"</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-bold"
                        >
                          <span>Search entire store catalog</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Mode 2: Search input focused with popular search keywords */
                  <div className="p-3.5 sm:p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                      <span>Popular Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleSelectKeyword(tag)}
                          className="text-xs sm:text-sm bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav Links - Customer Facing Only */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
            <Link
              to="/category/electronics"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2 sm:px-3 py-1.5 rounded-[4px] text-white hover:text-[#FFD700] transition-all duration-200 shadow-xs shrink-0"
            >
              <Flame className="w-4 h-4 text-[#FFD700] fill-current" />
              <span className="hidden sm:inline">Trending Deals</span>
              <span className="sm:hidden text-xs">Deals</span>
            </Link>

            <Link
              to="/affiliate-disclosure"
              className="hidden sm:flex items-center gap-1 hover:text-[#FFD700] bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded-[4px] transition-all duration-200 text-[11px] sm:text-xs shadow-xs"
              title="FTC & Amazon Associates Disclosure"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Disclosure</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
