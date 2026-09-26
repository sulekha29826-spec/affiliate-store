import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, requireSuperAdmin = false }) {
  const { currentUser, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-slate-800/80 border border-slate-700/60 p-6 rounded-xl space-y-4 animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/2 mx-auto" />
          <div className="h-10 bg-slate-700/50 rounded w-full" />
          <div className="h-10 bg-slate-700/50 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Access Restricted</h2>
        <p className="text-xs text-slate-400 max-w-md">
          This administrative module requires <strong>Super Admin</strong> credentials. Your account is currently provisioned as an Editor.
        </p>
      </div>
    );
  }

  return children;
}
