import React, { useState, useEffect, useMemo } from 'react';
import {
  getAdminProducts,
  getAdminCategories,
  saveProduct,
  softDeleteProduct,
} from '../../services/adminService';
import ProductFormModal from './ProductFormModal';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Tag,
} from 'lucide-react';

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products table:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (productData) => {
    await saveProduct(productData);
    await loadData();
  };

  const handleSoftDelete = async (productId, title) => {
    if (window.confirm(`Are you sure you want to deactivate "${title}"? (Soft delete: clicks will be preserved).`)) {
      await softDeleteProduct(productId);
      await loadData();
    }
  };

  // CSV Export utility (Zero dependencies)
  const handleExportCSV = () => {
    if (products.length === 0) return;
    const headers = ['id', 'title', 'slug', 'category', 'platform', 'price', 'originalPrice', 'discountPercent', 'affiliateLink', 'status', 'clickCount'];
    const rows = products.map((p) => [
      `"${p.id || ''}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.slug || ''}"`,
      `"${p.categoryId || ''}"`,
      `"${p.platform || ''}"`,
      p.price || 0,
      p.originalPrice || 0,
      p.discountPercent || 0,
      `"${p.affiliateLink || ''}"`,
      `"${p.status || 'active'}"`,
      p.clickCount || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sastabazar_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered products list
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          p.title?.toLowerCase().includes(q) ||
          p.platform?.toLowerCase().includes(q) ||
          p.subCategory?.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) {
        return false;
      }

      if (platformFilter !== 'all' && p.platform?.toLowerCase() !== platformFilter.toLowerCase()) {
        return false;
      }

      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [products, search, categoryFilter, platformFilter, statusFilter]);

  // Unique platforms for filter
  const platforms = useMemo(() => {
    const s = new Set();
    products.forEach((p) => p.platform && s.add(p.platform.toLowerCase()));
    return Array.from(s);
  }, [products]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage affiliate deals, merchant links, and promotional pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, merchant or tag..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none capitalize text-xs"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Platform */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none capitalize text-xs"
          >
            <option value="all">All Merchants</option>
            {platforms.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none capitalize text-xs"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="expired">Expired Only</option>
          </select>

          <button
            onClick={loadData}
            title="Refresh"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-3">Merchant</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price & MRP</th>
                <th className="py-3 px-3">Clicks</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    No products found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    {/* Title & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://via.placeholder.com/40'}
                          alt={p.title}
                          className="w-10 h-10 object-contain rounded bg-white p-1 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-medium text-white truncate" title={p.title}>
                            {p.title}
                          </p>
                          <a
                            href={p.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>Affiliate Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Platform Badge */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
                        {p.platform}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 capitalize text-slate-400">
                      {p.categoryId}
                    </td>

                    {/* Price & MRP */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">
                        ₹{p.price?.toLocaleString()}
                      </div>
                      {p.originalPrice > p.price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          ₹{p.originalPrice?.toLocaleString()} ({p.discountPercent}% off)
                        </div>
                      )}
                    </td>

                    {/* Clicks */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-400">
                        {p.clickCount || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          p.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsModalOpen(true);
                          }}
                          title="Edit Deal"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSoftDelete(p.id, p.title)}
                          title="Deactivate (Soft Delete)"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
