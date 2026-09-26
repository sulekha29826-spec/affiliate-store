import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminProducts,
  getAdminClickAnalytics,
  getAdminBanners,
} from '../../services/adminService';
import {
  ShoppingBag,
  TrendingUp,
  MousePointerClick,
  Image as ImageIcon,
  Plus,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [prods, bans, stats] = await Promise.all([
          getAdminProducts(),
          getAdminBanners(),
          getAdminClickAnalytics(),
        ]);
        setProducts(prods);
        setBanners(bans);
        setAnalytics(stats);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeProducts = products.filter((p) => p.status === 'active');
  const topClickedProducts = [...products]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 5);
  const recentProducts = [...products]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Console Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor catalog metrics, click traffic, and partner conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/analytics"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>View Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{activeProducts.length}</span>
            <span className="text-xs text-slate-500 ml-2">/ {products.length} total</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">
              {analytics?.totalClicks || products.reduce((acc, p) => acc + (p.clickCount || 0), 0)}
            </span>
            <span className="text-xs text-emerald-400 ml-2 font-medium">All-time</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">7-Day Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">
              {analytics?.clicksLast7Days || 0}
            </span>
            <span className="text-xs text-blue-400 ml-2 font-medium">Recent traffic</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Banners</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">
              {banners.filter((b) => b.active).length}
            </span>
            <span className="text-xs text-slate-500 ml-2">live on homepage</span>
          </div>
        </div>
      </div>

      {/* Two Data Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Clicked Deals */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Top 5 Clicked Deals</span>
            </h2>
            <Link to="/analytics" className="text-xs text-indigo-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {topClickedProducts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-500 w-4">{i + 1}.</span>
                  <img
                    src={p.images?.[0] || 'https://via.placeholder.com/40'}
                    alt={p.title}
                    className="w-10 h-10 object-contain rounded bg-white p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{p.title}</p>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                      {p.platform}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-400">
                    {p.clickCount || 0} clicks
                  </span>
                  <div className="text-[10px] text-slate-400">₹{p.price?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <span>Recently Added</span>
            </h2>
            <Link to="/products" className="text-xs text-indigo-400 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images?.[0] || 'https://via.placeholder.com/40'}
                    alt={p.title}
                    className="w-10 h-10 object-contain rounded bg-white p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{p.title}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        p.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-white">
                    ₹{p.price?.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-slate-400 capitalize">{p.categoryId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
