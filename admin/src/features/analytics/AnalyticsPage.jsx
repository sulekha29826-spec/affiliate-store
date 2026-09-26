import React, { useState, useEffect } from 'react';
import { getAdminClickAnalytics } from '../../services/adminService';
import {
  BarChart3,
  MousePointerClick,
  TrendingUp,
  Download,
  Calendar,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminClickAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportClicksCSV = () => {
    if (!analytics || !analytics.clickLogs || analytics.clickLogs.length === 0) {
      alert('No click records to export.');
      return;
    }

    const headers = ['ClickId', 'ProductId', 'ProductTitle', 'MerchantPlatform', 'DateFormatted', 'Timestamp'];
    const rows = analytics.clickLogs.map((log) => [
      `"${log.id}"`,
      `"${log.productId}"`,
      `"${(log.productTitle || '').replace(/"/g, '""')}"`,
      `"${log.platform}"`,
      `"${new Date(log.timestamp).toISOString()}"`,
      log.timestamp,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sastabazar_clicks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalClicks = analytics?.totalClicks || 0;
  const platformCounts = analytics?.platformCounts || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Click & Conversion Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time outbound partner clicks and merchant distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Refresh Analytics"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportClicksCSV}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clicks CSV</span>
          </button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Outbound Clicks</span>
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{totalClicks}</span>
            <span className="text-xs text-emerald-400 ml-2">All time</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">7-Day Velocity</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">
              {analytics?.clicksLast7Days || 0}
            </span>
            <span className="text-xs text-slate-400 ml-2">Last 168 hours</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Leading Merchant</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white capitalize">
              {Object.keys(platformCounts)[0] || 'N/A'}
            </span>
            <span className="text-xs text-amber-400 ml-2">Highest clicks</span>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">
          Merchant Platform Share
        </h2>
        <div className="space-y-3">
          {Object.entries(platformCounts).map(([plat, count]) => {
            const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
            return (
              <div key={plat}>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-300 capitalize">{plat}</span>
                  <span className="text-slate-400">
                    {count} clicks ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Click Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">
            Recent Click Stream Logs
          </h2>
          <span className="text-xs text-slate-400">
            Showing latest {analytics?.clickLogs?.length || 0} events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Product Deal</th>
                <th className="py-2.5 px-4">Target Merchant</th>
                <th className="py-2.5 px-4">Product ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">
                    Loading click stream...
                  </td>
                </tr>
              ) : !analytics?.clickLogs || analytics.clickLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">
                    No clicks recorded yet.
                  </td>
                </tr>
              ) : (
                analytics.clickLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-white truncate max-w-xs">
                      {log.productTitle}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                        {log.platform}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[10px] text-slate-500">
                      {log.productId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
