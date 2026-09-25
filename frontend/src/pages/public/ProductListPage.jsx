import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '../../services/api/productApi';
import { getCategories } from '../../services/api/categoryApi';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Highest Discount' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getProducts(Object.fromEntries(params))
      .then((res) => { setProducts(res.data.data.products); setPagination(res.data.data.pagination); })
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => { getCategories().then((r) => setCategories(r.data.data.categories)); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, val) => { const p = new URLSearchParams(params); val ? p.set(key, val) : p.delete(key); p.delete('page'); setParams(p); };

  return (
    <>
      <Helmet><title>Products — AffiliStore</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-56 shrink-0 hidden md:block space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Category</h3>
            <ul className="space-y-1 text-sm">
              <li><button onClick={() => setParam('category', '')} className={!params.get('category') ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}>All</button></li>
              {categories.map((c) => (
                <li key={c.id}><button onClick={() => setParam('category', c.slug)} className={params.get('category') === c.slug ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}>{c.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Min Discount</h3>
            {[0, 10, 20, 30, 50].map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm mb-1 cursor-pointer">
                <input type="radio" name="discount" checked={params.get('min_discount') === String(d)} onChange={() => setParam('min_discount', d > 0 ? d : '')} />
                {d > 0 ? `${d}% & above` : 'Any'}
              </label>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{pagination.total || 0} products</p>
            <select className="border rounded px-2 py-1 text-sm" value={params.get('sort') || 'newest'} onChange={(e) => setParam('sort', e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading ? <Spinner /> : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <Pagination page={pagination.page} pages={pagination.pages} onPage={(n) => setParam('page', n)} />
        </div>
      </div>
    </>
  );
}
