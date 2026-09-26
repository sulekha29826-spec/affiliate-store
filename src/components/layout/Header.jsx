import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Flame, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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

          {/* Search Bar with high-contrast search button */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative"
          >
            <div className="relative flex items-center transition-all duration-200 shadow-md rounded-[3px] overflow-hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, brands and best deals..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-4 pr-12 py-2 sm:py-2.5 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 text-blue-950 font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex items-center gap-2.5 sm:gap-5 text-xs sm:text-sm font-semibold">
            <Link
              to="/category/electronics"
              className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-[4px] text-white hover:text-[#FFD700] transition-all duration-200 shadow-xs"
            >
              <Flame className="w-4 h-4 text-[#FFD700] fill-current" />
              <span>Trending</span>
            </Link>

            <Link
              to="/affiliate-disclosure"
              className="flex items-center gap-1 hover:text-[#FFD700] bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded-[4px] transition-all duration-200 text-[11px] sm:text-xs shadow-xs"
              title="FTC & Amazon Associates Disclosure"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="hidden sm:inline">Disclosure</span>
            </Link>

            {/* Quick Admin link */}
            <a
              href="https://admin-livid-six.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-[11px] text-blue-200 hover:text-white hover:underline transition-colors"
              title="Open Admin Console"
            >
              <span>Partner Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
