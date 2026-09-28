import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from './HeroBanner';
import DealRow from './DealRow';
import CategoryNav from '../../components/layout/CategoryNav';
import ProductCard from '../../components/common/ProductCard';
import { DealRowSkeleton } from '../../components/common/Loader';
import {
  getTrendingProducts,
  getMostClickedProducts,
  getActiveProducts,
  getLatestLootDeals
} from '../../services/productService';
import { ShieldCheck, Zap, ArrowRightLeft, Sparkles, Layers, ChevronDown, Flame } from 'lucide-react';

export default function HomePage() {
  const [latestLoot, setLatestLoot] = useState([]);
  const [trending, setTrending] = useState([]);
  const [mostClicked, setMostClicked] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCatalog, setShowAllCatalog] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [lootData, trendData, clickedData, allData] = await Promise.all([
          getLatestLootDeals(10),
          getTrendingProducts(10),
          getMostClickedProducts(10),
          getActiveProducts(),
        ]);
        setLatestLoot(lootData);
        setTrending(trendData);
        setMostClicked(clickedData);
        setAllProducts(allData);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const displayedCatalogProducts = showAllCatalog
    ? allProducts
    : allProducts.slice(0, 15);

  return (
    <div className="min-h-screen pb-12">
      {/* Category Horizontal Navigation */}
      <CategoryNav />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Promotional Hero Carousel */}
        <HeroBanner />

        {/* Feature / Trust Strip with Rich Color Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4 text-xs font-bold">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/90 text-slate-800 p-2.5 rounded-[4px] shadow-xs flex items-center gap-2.5 transition-all hover:shadow-md hover:border-orange-300">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="block text-slate-900 leading-tight">Fast Direct Redirects</span>
              <span className="text-[10px] text-slate-500 font-normal">Official checkout</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/90 text-slate-800 p-2.5 rounded-[4px] shadow-xs flex items-center gap-2.5 transition-all hover:shadow-md hover:border-emerald-300">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 leading-tight">100% Genuine Links</span>
              <span className="text-[10px] text-slate-500 font-normal">Verified partners</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 text-slate-800 p-2.5 rounded-[4px] shadow-xs flex items-center gap-2.5 transition-all hover:shadow-md hover:border-blue-300">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 leading-tight">Multi-Merchant Deals</span>
              <span className="text-[10px] text-slate-500 font-normal">Best price comparison</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200/90 text-slate-800 p-2.5 rounded-[4px] shadow-xs flex items-center gap-2.5 transition-all hover:shadow-md hover:border-purple-300">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 leading-tight">Live Price Drops</span>
              <span className="text-[10px] text-slate-500 font-normal">{allProducts.length} Verified Products</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 animate-fade-in">
            <DealRowSkeleton count={5} />
            <DealRowSkeleton count={5} />
          </div>
        ) : (
          <>
            {/* SECTION 1: Newest High-Discount AI Deals (45% - 85% OFF) */}
            {latestLoot.length > 0 && (
              <DealRow
                title="🔥 Newest AI Loot Deals (40% - 85% OFF)"
                subtitle="Freshly scouted & verified by our 24/7 Autonomous Agent Swarm"
                products={latestLoot}
                viewAllLink="/category/all"
              />
            )}

            {/* SECTION 2: Deals of the Day / Trending */}
            {trending.length > 0 && (
              <DealRow
                title="⚡ Trending Deals of the Day"
                subtitle="Hand-picked verified discounts with highest savings"
                products={trending}
                viewAllLink="/category/electronics"
              />
            )}

            {/* SECTION 3: Most Clicked Deals This Week */}
            {mostClicked.length > 0 && (
              <DealRow
                title="🎯 Most Clicked This Week"
                subtitle="Trending popular picks preferred by our community"
                products={mostClicked}
                viewAllLink="/category/mobiles"
              />
            )}

            {/* SECTION 4: Full Store Catalog with Expandable View */}
            {allProducts.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-[4px] p-3 sm:p-5 my-4 max-w-7xl mx-auto shadow-sm">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                  <div className="border-l-4 border-l-emerald-600 pl-3">
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-600" />
                      <span>Explore All Store Catalog Deals</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                      Showing {displayedCatalogProducts.length} of {allProducts.length} available deals across Amazon, Flipkart, Myntra & more
                    </p>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{allProducts.length} Total Deals Live</span>
                  </span>
                </div>

                {/* All Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                  {displayedCatalogProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Show More / Show Less Toggle Button */}
                {allProducts.length > 15 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllCatalog(!showAllCatalog)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span>{showAllCatalog ? 'Show Less Deals' : `Show All ${allProducts.length} Deals`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllCatalog ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
