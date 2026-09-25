import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-3">AffiliStore</h3>
          <p>Discover the best deals from top merchants. We earn a commission from qualifying purchases.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Shop</h3>
          <ul className="space-y-2">
            <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link to="/deals" className="hover:text-white">Deals</Link></li>
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Account</h3>
          <ul className="space-y-2">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-xs text-gray-600">© 2026 AffiliStore. All rights reserved.</div>
    </footer>
  );
}
