import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-indigo-600 shrink-0">🛒 AffiliStore</Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="flex">
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg text-sm hover:bg-indigo-700">Search</button>
          </div>
        </form>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link to="/categories" className="hover:text-indigo-600">Categories</Link>
          <Link to="/deals" className="hover:text-indigo-600">Deals</Link>
          {user ? (
            <>
              <Link to="/wishlist" className="hover:text-indigo-600">❤️ Wishlist</Link>
              {user.role === 'admin' && <Link to="/admin" className="text-indigo-600 font-medium">Admin</Link>}
              <button onClick={logout} className="hover:text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link to="/deals" onClick={() => setMenuOpen(false)}>Deals</Link>
          {user ? (
            <>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>❤️ Wishlist</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-indigo-600 font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
