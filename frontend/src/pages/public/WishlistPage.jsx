import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getWishlist, removeFromWishlist } from '../../services/api/wishlistApi';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getWishlist().then((r) => setItems(r.data.data.items)).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  const handleRemove = async (id) => {
    await removeFromWishlist(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <>
      <Helmet><title>My Wishlist — AffiliStore</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">❤️ My Wishlist ({items.length})</h1>
        {loading ? <Spinner /> : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🤍</p>
            <p>Your wishlist is empty.</p>
            <Link to="/products" className="text-indigo-600 hover:underline mt-2 block">Browse products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <Link to={`/products/${item.slug}`} className="font-medium text-gray-800 flex-1 hover:text-indigo-600">{item.title}</Link>
                <span className="text-indigo-600 font-bold">₹{item.price?.toLocaleString()}</span>
                {item.discount > 0 && <span className="text-green-600 text-sm">{Math.round(item.discount)}% off</span>}
                <button onClick={() => handleRemove(item.id)} className="text-red-400 hover:text-red-600 text-xl">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
