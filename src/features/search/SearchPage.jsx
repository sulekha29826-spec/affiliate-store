import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getActiveProducts } from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Loader';
import { Search, ChevronRight, SlidersHorizontal, Tag, Sparkles, X } from 'lucide-react';

const FILTER_PILLS = [
  { id: 'all', label: 'All Deals' },
  { id: 'discount_70', label: '🔥 Flat 70%+ OFF' },
  { id: 'under_999', label: '⚡ Under ₹999' },
  { id: 'under_1999', label: '🏷️ Under ₹1,999' },
  { id: 'electronics', label: '🎧 Electronics & Audio' },
  { id: 'fashion', label: '👟 Fashion & Footwear' },
  { id: 'amazon', label: '📦 Amazon Deals' },
  { id: 'flipkart', label: '🛍️ Flipkart Deals' }
];

const SUGGESTED_KEYWORDS = [
  'Smartwatch',
  'boAt Earbuds',
  'Sneakers',
  'Noise',
  'Fastrack',
  'Under 999',
  'Bluetooth Speaker',
  'Running Shoes'
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [inputQuery, setInputQuery] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeFilter, setActiveFilter] = useState('all');

  // Keep inputQuery in sync when URL changes
  useEffect(() => {
    setInputQuery(query);
  }, [query]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getActiveProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products for search:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  const handleKeywordClick = (keyword) => {
    setInputQuery(keyword);
    setSearchParams({ q: keyword });
  };

  // Multi-token keyword search with scoring & filtering
  const searchResults = useMemo(() => {
    if (!products.length) return [];
    const trimmedQuery = query.toLowerCase().trim();
    const tokens = trimmedQuery ? trimmedQuery.split(/\s+/).filter(Boolean) : [];

    // Filter by keyword tokens
    let matched = products.filter((p) => {
      if (tokens.length === 0) return true; // Show all if no query

      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const cat = (p.categoryId || '').toLowerCase();
      const subCat = (p.subCategory || '').toLowerCase();
      const platform = (p.platform || '').toLowerCase();
      const tags = (p.tags || []).join(' ').toLowerCase();

      const combined = `${title} ${desc} ${brand} ${cat} ${subCat} ${platform} ${tags}`;

      // Every token should appear somewhere in the product metadata
      return tokens.every((token) => combined.includes(token));
    });

    // Apply quick pill filter
    if (activeFilter === 'discount_70') {
      matched = matched.filter((p) => Number(p.discountPercent) >= 70);
    } else if (activeFilter === 'under_999') {
      matched = matched.filter((p) => Number(p.price) <= 999);
    } else if (activeFilter === 'under_1999') {
      matched = matched.filter((p) => Number(p.price) <= 1999);
    } else if (activeFilter === 'electronics') {
      matched = matched.filter((p) => {
        const cat = (p.categoryId || '').toLowerCase();
        return cat.includes('electronic') || cat.includes('audio') || cat.includes('gadget') || cat.includes('mobile');
      });
    } else if (activeFilter === 'fashion') {
      matched = matched.filter((p) => {
        const cat = (p.categoryId || '').toLowerCase();
        return cat.includes('fashion') || cat.includes('shoe') || cat.includes('wear') || cat.includes('cloth');
      });
    } else if (activeFilter === 'amazon') {
      matched = matched.filter((p) => (p.platform || '').toLowerCase().includes('amazon'));
    } else if (activeFilter === 'flipkart') {
      matched = matched.filter((p) => (p.platform || '').toLowerCase().includes('flipkart'));
    }

    // Apply sorting
    return [...matched].sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'discount') return (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0);
      if (sortBy === 'newest') return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);

      // Default: Relevance scoring
      if (tokens.length > 0) {
        const scoreProduct = (p) => {
          let score = 0;
          const t = (p.title || '').toLowerCase();
          if (t.includes(trimmedQuery)) score += 50;
          tokens.forEach((tok) => {
            if (t.includes(tok)) score += 15;
            if ((p.tags || []).some((tg) => tg.toLowerCase().includes(tok))) score += 10;
          });
          score += (Number(p.discountPercent) || 0) * 0.2;
          return score;
        };
        return scoreProduct(b) - scoreProduct(a);
      }

      return (Number(b.clickCount) || 0) - (Number(a.clickCount) || 0);
    });
  }, [products, query, activeFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-semibold">Search Deals</span>
        {query && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-blue-700 font-bold truncate max-w-[200px]">"{query}"</span>
          </>
        )}
      </nav>

      {/* In-Page Keyword Search Box */}
      <div className="bg-white p-3 sm:p-4 rounded-md border border-slate-200 shadow-xs mb-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search by keywords (e.g., boat smartwatch, shoes 70% off, earbuds under 999)..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-8 py-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => {
                  setInputQuery('');
                  setSearchParams({});
                }}
                aria-label="Clear search"
                className="absolute right-2 top-0 bottom-0 px-2.5 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 min-h-[38px] rounded transition-colors shrink-0 shadow-xs cursor-pointer flex items-center justify-center"
          >
            Search
          </button>
        </form>

        {/* Quick Filter Pills with comfortable touch target */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar border-t border-slate-100 mt-3 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
            Filter:
          </span>
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3.5 py-1.5 min-h-[34px] flex items-center justify-center rounded-full font-semibold shrink-0 transition-all cursor-pointer text-xs ${
                activeFilter === pill.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header / Sorting Bar */}
      <div className="bg-white p-3 rounded-md border border-slate-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            {query ? (
              <>
                <span>Search results for</span>
                <span className="text-blue-600 font-black">"{query}"</span>
              </>
            ) : (
              <span>All Verified Loot Deals</span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Found <span className="font-bold text-slate-800">{searchResults.length}</span> deals matching your criteria
          </p>
        </div>

        {searchResults.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="relevance">Relevance & Discount</option>
              <option value="discount">Highest Discount (Loot)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        )}
      </div>

      {/* Products Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 animate-fade-in">
          {[...Array(10)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 text-center border border-slate-200 rounded-md shadow-xs">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            No deals found for "{query}"
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            We couldn't find exact matching deals. Try checking spelling or click one of the trending popular searches below:
          </p>

          {/* Clickable suggested keyword tags */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {SUGGESTED_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => handleKeywordClick(kw)}
                className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-700 font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-slate-200"
              >
                {kw}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchParams({});
                setInputQuery('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
            >
              Browse All Active Deals
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {searchResults.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
