import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin', label: '📊 Dashboard' },
  { path: '/admin/products', label: '📦 Products' },
  { path: '/admin/categories', label: '🗂 Categories' },
  { path: '/admin/merchants', label: '🏪 Merchants' },
  { path: '/admin/banners', label: '🖼 Banners' },
  { path: '/admin/deals', label: '🏷 Deals' },
  { path: '/admin/users', label: '👥 Users' },
  { path: '/admin/analytics', label: '📈 Analytics' },
  { path: '/admin/settings', label: '⚙️ Settings' },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 text-xl font-bold border-b border-gray-700">🛒 Admin</div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`block px-3 py-2 rounded text-sm transition ${location.pathname === item.path ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">Logged in as Admin</div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
