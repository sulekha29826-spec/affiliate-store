import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from '../features/auth/AdminLogin';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import ProductTable from '../features/products/ProductTable';
import CategoryManager from '../features/categories/CategoryManager';
import BannerManager from '../features/banners/BannerManager';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import AdminUserManager from '../features/adminUsers/AdminUserManager';
import SettingsPage from '../features/settings/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoryManager />
          </ProtectedRoute>
        }
      />

      <Route
        path="/banners"
        element={
          <ProtectedRoute>
            <BannerManager />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admins"
        element={
          <ProtectedRoute requireSuperAdmin={true}>
            <AdminUserManager />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute requireSuperAdmin={true}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
