import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';

export default function DealRow({ title, subtitle, products = [], viewAllLink = '/category/electronics' }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-3 sm:p-4 my-3 max-w-7xl mx-auto shadow-xs animate-fade-in">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0F0F0]">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-[#212121] leading-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group/btn bg-[#2874F0] hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-[2px] flex items-center gap-1 shadow-xs transition-all duration-150 shrink-0"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
