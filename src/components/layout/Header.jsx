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
    <header className="sticky top-0 z-50 bg-[#2874F0] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col shrink-0 group">
            <span className="text-xl sm:text-2xl font-black italic tracking-tight text-white leading-none">
              Sasta<span className="text-[#FFE500]">Bazar</span>
            </span>
            <span className="text-[10px] text-gray-200 italic flex items-center gap-1 group-hover:text-white transition-colors">
              Explore <span className="text-[#FFE500] font-bold">Plus Deals</span>
              <Flame className="w-2.5 h-2.5 text-[#FFE500] fill-current" />
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, brands and best deals..."
                className="w-full bg-white text-[#212121] placeholder-gray-500 text-xs sm:text-sm pl-4 pr-10 py-2 sm:py-2.5 rounded-[2px] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-[#2874F0] hover:text-blue-800 transition-colors"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
            <Link
              to="/category/electronics"
              className="hidden md:flex items-center gap-1.5 hover:text-[#FFE500] transition-colors"
            >
              <Flame className="w-4 h-4 text-[#FFE500]" />
              <span>Trending</span>
            </Link>

            <Link
              to="/affiliate-disclosure"
              className="flex items-center gap-1 hover:text-[#FFE500] transition-colors text-[11px] sm:text-xs bg-white/10 px-2 py-1 rounded-[2px]"
              title="FTC & Amazon Associates Disclosure"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFE500]" />
              <span className="hidden sm:inline">Disclosure</span>
            </Link>

            {/* Quick Admin link */}
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-[11px] text-blue-100 hover:text-white transition-colors"
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
