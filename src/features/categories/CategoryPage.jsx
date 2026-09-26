import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActiveProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import ProductCard from '../../components/common/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Loader';
import { Filter, SlidersHorizontal, ChevronRight, X } from 'lucide-react';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          getActiveProducts(),
          getCategories(),
        ]);
        setAllProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categorySlug]);

  const currentCategory = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  // Filter products by category and active filters
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category match
        if (categorySlug && categorySlug !== 'all') {
          const matchCat =
            p.categoryId?.toLowerCase() === categorySlug?.toLowerCase();
          if (!matchCat) return false;
        }

        // Platform match
        if (selectedPlatform !== 'all') {
          if (p.platform?.toLowerCase() !== selectedPlatform.toLowerCase()) {
            return false;
          }
        }

        // Price match
        if (p.price > maxPrice) return false;

        // Discount match
        if ((p.discountPercent || 0) < minDiscount) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        // Default: popularity / clicks
        return (b.clickCount || 0) - (a.clickCount || 0);
      });
  }, [allProducts, categorySlug, selectedPlatform, maxPrice, minDiscount, sortBy]);

  // Extract available platforms
  const platforms = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => {
      if (p.platform) set.add(p.platform.toLowerCase());
    });
    return Array.from(set);
  }, [allProducts]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <Link to="/" className="hover:text-[#2874F0]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#212121] font-medium capitalize">
          {currentCategory ? currentCategory.name : categorySlug || 'All Products'}
        </span>
      </nav>

      {/* Title & Mobile Filter Trigger */}
      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-[2px] border border-[#E0E0E0]">
        <div>
          <h1 className="text-base sm:text-xl font-bold text-[#212121] capitalize">
            {currentCategory ? currentCategory.name : categorySlug || 'All Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {filteredProducts.length} deals available
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold px-3 py-2 rounded-[2px] cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar Filters */}
        <aside
          className={`fixed inset-0 z-50 bg-black/50 md:static md:z-auto md:bg-transparent md:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="bg-white w-72 max-w-[85vw] h-full md:h-auto overflow-y-auto p-4 md:border border-[#E0E0E0] md:rounded-[2px] shadow-sm ml-auto md:ml-0 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-sm font-bold uppercase tracking-wider text-[#212121] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2874F0]" />
                  Filters
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="md:hidden text-gray-500 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Merchant / Platform Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#212121] uppercase mb-2">
                  Merchant Platform
                </h4>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="platform"
                      checked={selectedPlatform === 'all'}
                      onChange={() => setSelectedPlatform('all')}
                      className="text-[#2874F0] focus:ring-[#2874F0]"
                    />
                    <span>All Platforms</span>
                  </label>
                  {platforms.map((plat) => (
                    <label key={plat} className="flex items-center gap-2 cursor-pointer capitalize">
                      <input
                        type="radio"
                        name="platform"
                        checked={selectedPlatform === plat}
                        onChange={() => setSelectedPlatform(plat)}
                        className="text-[#2874F0] focus:ring-[#2874F0]"
                      />
                      <span>{plat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Discount Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#212121] uppercase mb-2">
                  Minimum Discount
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[0, 10, 20, 30, 50].map((d) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discount"
                        checked={minDiscount === d}
                        onChange={() => setMinDiscount(d)}
                        className="text-[#2874F0] focus:ring-[#2874F0]"
                      />
                      <span>{d === 0 ? 'All Discounts' : `${d}% off or more`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Max Price:</span>
                  <span>₹{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="150000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#2874F0]"
                />
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  setSelectedPlatform('all');
                  setMaxPrice(150000);
                  setMinDiscount(0);
                  setSortBy('popular');
                }}
                className="w-full text-xs text-[#2874F0] hover:underline font-semibold py-2 text-center"
              >
                Reset All Filters
              </button>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="md:hidden mt-6 w-full bg-[#2874F0] text-white py-2 text-xs font-semibold rounded-[2px]"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* Sorting Header */}
          <div className="bg-white p-2.5 rounded-[2px] border border-[#E0E0E0] mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700 hidden sm:inline">Sort By:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                { key: 'popular', label: 'Popularity' },
                { key: 'price_asc', label: 'Price: Low to High' },
                { key: 'price_desc', label: 'Price: High to Low' },
                { key: 'discount', label: 'Discount %' },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
                    sortBy === s.key
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 animate-fade-in">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center border border-[#E0E0E0] rounded-[2px]">
              <p className="text-gray-500 text-sm">No products found matching your current filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedPlatform('all');
                  setMaxPrice(150000);
                  setMinDiscount(0);
                }}
                className="mt-3 text-xs text-[#2874F0] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
