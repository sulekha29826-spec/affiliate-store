import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldAlert, Sparkles, Key } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, demoLogin, authError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = (role) => {
    demoLogin(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            S
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            SastaBazar Partner Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administrative Management & Affiliate Analytics
          </p>
        </div>

        {/* Errors */}
        {(errorMsg || authError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-start gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg || authError}</span>
          </div>
        )}

        {/* Email/Pass Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sastabazar.com"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 text-xs"
          >
            {submitting ? 'Verifying...' : 'Sign In with Firebase Auth'}
          </button>
        </form>

        {/* Quick Demo Mode Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-3 font-medium">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Developer / Seed Quick Access:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('superadmin')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 hover:text-white py-2 px-3 rounded-lg text-xs font-medium transition cursor-pointer text-center"
            >
              Enter as Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('editor')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white py-2 px-3 rounded-lg text-xs font-medium transition cursor-pointer text-center"
            >
              Enter as Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
