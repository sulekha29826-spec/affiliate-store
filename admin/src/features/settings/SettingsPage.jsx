import React, { useState, useEffect } from 'react';
import { getAdminSettings, saveAdminSettings, syncSeedDataToFirebase } from '../../services/adminService';
import { Settings, Save, ShieldCheck, CheckCircle2, Database, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'SastaBazar',
    tagline: 'Best Deals & Price Drops Across Top Retailers',
    logo: '',
    contactEmail: 'support@sastabazar.in',
    affiliateDisclosure: '',
    socialLinks: {
      telegram: '',
      whatsapp: '',
      twitter: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAdminSettings();
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            socialLinks: {
              ...prev.socialLinks,
              ...(data.socialLinks || {}),
            },
          }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await saveAdminSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSyncCatalog = async () => {
    if (!window.confirm('Sync 18 curated products, categories & banners to Firebase Realtime Database?')) {
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncSeedDataToFirebase();
      setSyncResult({ success: true, message: res.message });
      setTimeout(() => setSyncResult(null), 5000);
    } catch (err) {
      setSyncResult({ success: false, message: err.message || 'Failed to sync to Firebase' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Storefront Configuration</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Global brand settings, legal affiliate disclosure, and communication channels.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings successfully published to live storefront!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5 text-xs shadow-sm">
        {/* General Info */}
        <div className="border-b border-slate-800 pb-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Brand Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Storefront Name *
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Store Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Brand Logo URL
            </label>
            <input
              type="url"
              value={settings.logo}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              placeholder="https://... logo image"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="border-b border-slate-800 pb-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Legal Affiliate Disclosure (Amazon & FTC Requirement)</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            This statement renders across every product page footer to comply with merchant affiliate terms.
          </p>

          <div>
            <textarea
              rows={4}
              value={settings.affiliateDisclosure}
              onChange={(e) => setSettings({ ...settings, affiliateDisclosure: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Social / Community Links */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">
            Community & Broadcast Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Telegram Channel Link
              </label>
              <input
                type="url"
                value={settings.socialLinks?.telegram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, telegram: e.target.value },
                  })
                }
                placeholder="https://t.me/..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                WhatsApp Channel Link
              </label>
              <input
                type="url"
                value={settings.socialLinks?.whatsapp || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, whatsapp: e.target.value },
                  })
                }
                placeholder="https://whatsapp.com/..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Twitter / X Profile
              </label>
              <input
                type="url"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                placeholder="https://x.com/..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Database Maintenance & Catalog Sync */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 text-xs shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Catalog & Database Seeding</span>
            </h2>
            <p className="text-slate-400 mt-1">
              Sync 18 curated affiliate products across Amazon, Flipkart, Myntra & Ajio, along with categories and hero banners, directly into your Firebase Realtime Database.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSyncCatalog}
            disabled={syncing}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-amber-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing Catalog...' : 'Sync Catalog to Firebase'}</span>
          </button>
        </div>

        {syncResult && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              syncResult.success
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{syncResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
