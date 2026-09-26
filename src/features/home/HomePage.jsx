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

        {/* Feature / Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3 text-xs bg-white p-3 rounded-[2px] border border-[#E0E0E0] shadow-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <Zap className="w-4 h-4 text-[#FB641B] shrink-0" />
            <span>Fast Direct Redirects</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <ShieldCheck className="w-4 h-4 text-[#388E3C] shrink-0" />
            <span>100% Genuine Partner Links</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <ArrowRightLeft className="w-4 h-4 text-[#2874F0] shrink-0" />
            <span>Multi-Merchant Comparison</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Live Price Drop Alerts</span>
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
