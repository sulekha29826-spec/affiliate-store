import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFeatured, getTrending } from '../../services/api/productApi';
import { getCategories } from '../../services/api/categoryApi';
import ProductCard from '../../components/common/ProductCard';
import Spinner from '../../components/common/Spinner';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeatured(), getTrending(), getCategories()])
      .then(([f, t, c]) => {
        setFeatured(f.data.data.products);
        setTrending(t.data.data.products);
        setCategories(c.data.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <Helmet><title>AffiliStore — Best Deals & Offers</title></Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Deals</h1>
        <p className="text-xl text-indigo-100 mb-8">Find the best products from top merchants, all in one place.</p>
        <Link to="/products" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition">
          Shop Now →
        </Link>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/categories/${cat.slug}`}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="w-14 h-14 object-cover rounded-full mb-2" /> : <div className="w-14 h-14 bg-indigo-100 rounded-full mb-2 flex items-center justify-center text-2xl">🗂</div>}
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Link to="/products?featured=true" className="text-indigo-600 text-sm hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🔥 Trending Now</h2>
              <Link to="/products?trending=true" className="text-indigo-600 text-sm hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trending.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
