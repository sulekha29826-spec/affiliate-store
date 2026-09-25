import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProduct } from '../../services/api/productApi';
import { addToWishlist } from '../../services/api/wishlistApi';
import { trackClick } from '../../services/api/affiliateApi';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/common/ProductCard';
import Spinner from '../../components/common/Spinner';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(slug).then((r) => { setProduct(r.data.data.product); }).finally(() => setLoading(false));
  }, [slug]);

  const handleBuyClick = async () => {
    try {
      const r = await trackClick({ product_id: product.id });
      if (r.data.data.redirect_url) window.open(r.data.data.redirect_url, '_blank', 'noopener,noreferrer');
    } catch (e) {}
  };

  const handleWishlist = async () => {
    if (!user) { alert('Please login to use wishlist'); return; }
    try { await addToWishlist(product.id); setWishlisted(true); } catch {}
  };

  if (loading) return <Spinner />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  return (
    <>
      <Helmet>
        <title>{product.meta_title || product.title} — AffiliStore</title>
        <meta name="description" content={product.meta_description || product.short_description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
              {product.images?.[mainImg] ? (
                <img src={product.images[mainImg]} alt={product.title} className="w-full h-full object-cover" />
              ) : <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">🖼</div>}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setMainImg(i)} className={`w-16 h-16 rounded border-2 overflow-hidden ${mainImg === i ? 'border-indigo-500' : 'border-gray-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {product.category_name && <span className="text-xs text-indigo-600 font-medium uppercase">{product.category_name}</span>}
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            {product.brand && <p className="text-sm text-gray-500">Brand: <span className="text-gray-700 font-medium">{product.brand}</span></p>}
            {product.rating > 0 && <div className="text-yellow-500">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))} <span className="text-gray-500 text-sm">({product.review_count} reviews)</span></div>}

            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">₹{product.price?.toLocaleString()}</span>
              {product.original_price > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.original_price?.toLocaleString()}</span>
                  <span className="text-green-600 font-semibold">{Math.round(product.discount)}% off</span>
                </>
              )}
            </div>

            {product.short_description && <p className="text-gray-600 leading-relaxed">{product.short_description}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={handleBuyClick} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                Buy Now →
              </button>
              <button onClick={handleWishlist} className={`px-4 py-3 rounded-xl border-2 transition ${wishlisted ? 'border-red-400 text-red-500' : 'border-gray-300 hover:border-red-400 hover:text-red-500'}`}>
                {wishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {product.merchant_name && (
              <p className="text-xs text-gray-400">Sold by <span className="text-gray-600">{product.merchant_name}</span></p>
            )}

            {product.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((t) => <span key={t.slug} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t.name}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Product Description</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">{product.description}</div>
          </div>
        )}

        {/* Related */}
        {product.related?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {product.related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
