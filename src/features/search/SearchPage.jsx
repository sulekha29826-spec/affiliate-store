import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getActiveProducts } from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Loader';
import { Search, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');

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

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase().trim();
    return products
      .filter((p) => {
        return (
          p.title?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          p.platform?.toLowerCase().includes(lower) ||
          p.categoryId?.toLowerCase().includes(lower) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(lower)))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        return (b.clickCount || 0) - (a.clickCount || 0);
      });
  }, [products, query, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <Link to="/" className="hover:text-[#2874F0]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Search</span>
      </nav>

      {/* Header */}
      <div className="bg-white p-3 rounded-[2px] border border-[#E0E0E0] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#212121]">
            Search results for <span className="text-[#2874F0]">"{query}"</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {searchResults.length} deals found
          </p>
        </div>

        {searchResults.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-[2px] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#2874F0]"
            >
              <option value="popular">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 animate-fade-in">
          {[...Array(5)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[#E0E0E0] rounded-[2px]">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No results found for "{query}"</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try checking your spelling or use more generic terms like "Headphones", "Mobiles", or "Shoes".
          </p>
          <Link
            to="/"
            className="mt-4 inline-block bg-[#2874F0] text-white text-xs font-semibold px-4 py-2 rounded-[2px]"
          >
            Explore All Deals
          </Link>
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
