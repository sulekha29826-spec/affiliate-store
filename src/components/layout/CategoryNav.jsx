import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-[#E0E0E0] shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-start sm:justify-around overflow-x-auto no-scrollbar py-2 sm:py-3 gap-6 sm:gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug || cat.id}`}
              className="flex flex-col items-center shrink-0 group text-center px-1"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-150">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#212121] mt-1 group-hover:text-[#2874F0] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
