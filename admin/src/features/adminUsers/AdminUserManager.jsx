import React, { useState, useEffect } from 'react';
import {
  getAdminUsers,
  saveAdminUser,
  deleteAdminUser,
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Trash2, Shield, UserCheck, AlertTriangle } from 'lucide-react';

export default function AdminUserManager() {
  const { currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const uid = newUid.trim() || `uid_${Date.now()}`;
      await saveAdminUser(uid, newEmail.trim(), newRole);
      setNewUid('');
      setNewEmail('');
      setNewRole('editor');
      await loadData();
    } catch (err) {
      console.error('Failed to save admin user:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (uid, email) => {
    if (uid === currentUser?.uid) {
      alert('You cannot revoke access from your own active session!');
      return;
    }
    if (window.confirm(`Revoke administrative access for ${email}?`)) {
      await deleteAdminUser(uid);
      await loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Administrator Access Control</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage authorized administrator accounts and privilege delegations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Provision New Admin */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Grant Admin Access</h2>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Admin Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="colleague@sastabazar.com"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Firebase User UID (Optional if manual)
              </label>
              <input
                type="text"
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                placeholder="Firebase Auth UID"
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg p-2.5 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Matches the user's UID in Firebase Authentication console.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Assigned Role *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="editor">Editor (Product, Category, Banner CRUD)</option>
                <option value="superadmin">Super Admin (Full System & User Access)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Authorizing...' : 'Authorize Admin'}
            </button>
          </form>
        </div>

        {/* Current Admins List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Provisioned Administrators</span>
            </h2>
            <span className="text-xs text-slate-400">{admins.length} active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">UID Reference</th>
                  <th className="py-3 px-4 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">
                      Loading admin list...
                    </td>
                  </tr>
                ) : (
                  admins.map((adm) => (
                    <tr key={adm.uid} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">
                        {adm.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            adm.role === 'superadmin'
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {adm.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                        {adm.uid}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(adm.uid, adm.email)}
                          disabled={adm.uid === currentUser?.uid}
                          className="p-1.5 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
