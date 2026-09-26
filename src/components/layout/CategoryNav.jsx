import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { CategoryNavSkeleton } from '../common/Loader';

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CategoryNavSkeleton />;
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-start sm:justify-around overflow-x-auto no-scrollbar py-2.5 sm:py-3.5 gap-6 sm:gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug || cat.id}`}
              className="flex flex-col items-center shrink-0 group text-center px-1.5 transition-transform duration-200"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center p-1 border-2 border-slate-200 group-hover:border-blue-600 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-blue-500/20 transition-all duration-300 ease-out shadow-xs">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs sm:text-xs font-bold text-slate-800 mt-2 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
