import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';

export default function DealRow({ title, subtitle, products = [], viewAllLink = '/category/electronics' }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-[4px] p-3 sm:p-5 my-4 max-w-7xl mx-auto shadow-sm animate-fade-in">
      {/* Header Row with strong accent bar */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="border-l-4 border-l-blue-600 pl-3">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all duration-150 shrink-0"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
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
