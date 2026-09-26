import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import CategoryPage from '../features/categories/CategoryPage';
import ProductDetailPage from '../features/products/ProductDetailPage';
import SearchPage from '../features/search/SearchPage';
import AffiliateDisclosurePage from '../features/static/AffiliateDisclosurePage';
import AboutPage from '../features/static/AboutPage';
import ContactPage from '../features/static/ContactPage';
import PrivacyPolicyPage from '../features/static/PrivacyPolicyPage';
import TermsPage from '../features/static/TermsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/product/:idOrSlug" element={<ProductDetailPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
