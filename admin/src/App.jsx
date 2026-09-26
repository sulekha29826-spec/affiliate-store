import React, { useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminSidebar from './components/layout/AdminSidebar';
import AdminHeader from './components/layout/AdminHeader';
import AppRoutes from './routes/AppRoutes';

function AdminLayout() {
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // If on login route or unauthenticated, render plain layout without sidebar
  if (!currentUser || location.pathname === '/login') {
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
