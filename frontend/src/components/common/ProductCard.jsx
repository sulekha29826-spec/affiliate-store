import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addToWishlist } from '../../services/api/wishlistApi';
import { trackClick } from '../../services/api/affiliateApi';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const discount = product.discount ? Math.round(product.discount) : null;

  const handleAffiliateClick = async () => {
    try {
      const res = await trackClick({ product_id: product.id, session_id: sessionStorage.getItem('sid') || crypto.randomUUID() });
      if (res.data.data.redirect_url) window.open(res.data.data.redirect_url, '_blank', 'noopener,noreferrer');
    } catch (e) { console.error('Click tracking failed', e); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative bg-gray-100 aspect-square overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🖼</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">{discount}% OFF</span>
          )}
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1 gap-1">
        <Link to={`/products/${product.slug}`} className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-indigo-600">{product.title}</Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
          {product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.original_price?.toLocaleString()}</span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="text-xs text-yellow-500">{'★'.repeat(Math.round(product.rating))} <span className="text-gray-400">({product.review_count})</span></div>
        )}
        <button onClick={handleAffiliateClick} className="mt-auto w-full bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 transition">
          View Deal →
        </button>
      </div>
    </div>
  );
}
