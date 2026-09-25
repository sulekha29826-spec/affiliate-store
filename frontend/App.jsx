import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProductListPage from './pages/public/ProductListPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import WishlistPage from './pages/public/WishlistPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const NotFound = () => (
  <div className="text-center py-24">
    <p className="text-6xl mb-4">404</p>
    <p className="text-gray-500 text-xl">Page not found</p>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<MainLayout><HomePage /></MainLayout>} path="/" />
            <Route element={<MainLayout><ProductListPage /></MainLayout>} path="/products" />
            <Route element={<MainLayout><ProductDetailPage /></MainLayout>} path="/products/:slug" />
            <Route element={<MainLayout><WishlistPage /></MainLayout>} path="/wishlist" />

            {/* Auth */}
            <Route element={<LoginPage />} path="/login" />
            <Route element={<SignupPage />} path="/signup" />
            <Route element={<LoginPage />} path="/admin/login" />

            {/* Admin */}
            <Route element={<AdminLayout><AdminDashboard /></AdminLayout>} path="/admin" />

            {/* 404 */}
            <Route element={<MainLayout><NotFound /></MainLayout>} path="*" />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
