import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, Shield, User } from 'lucide-react';

export default function AdminHeader({ onMenuClick }) {
  const { currentUser, adminRole, isSuperAdmin, logout } = useAuth();

  return (
    <header className="h-14 sm:h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs text-slate-400">Environment: </span>
          <span className="text-xs font-semibold text-emerald-400">Production Ready</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* User profile & Role pill */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200">
              {currentUser?.email || 'admin@sastabazar.com'}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              Role: {adminRole || 'Superadmin'}
            </span>
          </div>
        </div>

        {/* Role badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isSuperAdmin
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isSuperAdmin ? 'Super Admin' : 'Editor'}
        </span>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
