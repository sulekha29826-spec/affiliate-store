import React, { useEffect, useState } from 'react';
import HeroBanner from './HeroBanner';
import DealRow from './DealRow';
import CategoryNav from '../../components/layout/CategoryNav';
import { DealRowSkeleton } from '../../components/common/Loader';
import { getTrendingProducts, getMostClickedProducts, getActiveProducts } from '../../services/productService';
import { ShieldCheck, Zap, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [mostClicked, setMostClicked] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [trendData, clickedData, allData] = await Promise.all([
          getTrendingProducts(10),
          getMostClickedProducts(10),
          getActiveProducts(),
        ]);
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
              <span className="text-[10px] text-slate-500 font-normal">Real-time alerts</span>
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
            {/* Deals of the Day / Trending */}
            <DealRow
              title="Deals of the Day"
              subtitle="Hand-picked verified discounts with highest savings"
              products={trending}
              viewAllLink="/category/electronics"
            />

            {/* Most Clicked Deals This Week */}
            <DealRow
              title="Most Clicked This Week"
              subtitle="Trending popular picks preferred by our community"
              products={mostClicked}
              viewAllLink="/category/mobiles"
            />

            {/* All Fresh Deals */}
            {allProducts.length > 0 && (
              <DealRow
                title="Curated Catalog Deals"
                subtitle="Browse all available deals across Amazon, Flipkart, Myntra & more"
                products={allProducts.slice(0, 10)}
                viewAllLink="/category/fashion"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
