import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getDashboard, getAnalytics } from '../../services/api/adminApi';
import Spinner from '../../components/common/Spinner';

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString() ?? 0}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then((r) => setStats(r.data.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <Helmet><title>Dashboard — Admin</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <StatCard icon="📦" label="Total Products" value={stats?.total_products} />
        <StatCard icon="✅" label="Published" value={stats?.active_products} />
        <StatCard icon="👥" label="Users" value={stats?.total_users} />
        <StatCard icon="🔗" label="Affiliate Clicks" value={stats?.affiliate_clicks} />
        <StatCard icon="⭐" label="Featured" value={stats?.featured_products} />
        <StatCard icon="🏷" label="Active Deals" value={stats?.active_deals} />
      </div>
    </>
  );
}
