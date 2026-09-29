import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingDown,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Award,
  BadgePercent,
  Clock,
} from 'lucide-react';

export default function AboutSastaBazarSection() {
  const [activeTab, setActiveTab] = useState('how-it-works');

  const tabs = [
    {
      id: 'how-it-works',
      label: 'How We Find Loot Deals',
      icon: TrendingDown,
    },
    {
      id: 'bharosa-guarantee',
      label: 'Zero Fake MRP Guarantee',
      icon: ShieldCheck,
    },
    {
      id: 'safe-checkout',
      label: '100% Safe Merchant Checkout',
      icon: Lock,
    },
  ];

  return (
    <section className="my-8 max-w-7xl mx-auto px-2 sm:px-0">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-xs">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>India's Smart Deal Discovery Platform</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              About SastaBazar — Why Smart Shoppers Check Us First
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              We hunt, track, and verify genuine price drops across Amazon, Flipkart, Myntra & top Indian retailers so you never pay full MRP again.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors shrink-0 group"
          >
            <span>Read Full Story & Mission</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-6 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === 'how-it-works' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Real-Time Price Drop Tracking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our deal hunter team monitors flash discounts, clearance sales, and price drops every few minutes across all major e-commerce categories.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Rigorous Seller & Rating Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deals are audited against real customer reviews (min 3.8★ rating required) and genuine return policies to weed out shady listings.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Instant 1-Click Loot Direct Links
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One click connects you directly to the verified retailer app or site with the lowest active discount code applied.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'bharosa-guarantee' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Historical Price Verification
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We check 90-day price trends before labelling any offer as a "Loot Deal". If a seller inflated their MRP yesterday to show a fake 70% discount today, we reject it.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Official Brand Warranty Guarantee
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You receive official tax invoices directly from Amazon India, Flipkart, or brand stores, ensuring 100% valid manufacturer warranty and support.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safe-checkout' && (
          <div className="p-5 rounded-xl bg-blue-50/40 border border-blue-200/80 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Direct Official Checkout — Zero Intermediary Risk
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    SastaBazar never collects or stores your credit/debit card numbers, UPI credentials, or home address. You pay securely on the merchant's certified checkout system.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-700">
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">Amazon Associates</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">Flipkart Affiliate</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">Myntra Partner</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-sm sm:text-base font-black text-slate-900">25,000+</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Deals Audited</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-sm sm:text-base font-black text-slate-900">₹4.5 Cr+</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Shopper Savings</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-sm sm:text-base font-black text-slate-900">100% Free</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Zero Extra Cost</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-sm sm:text-base font-black text-slate-900">4.9 / 5★</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium">Trust Score</div>
          </div>
        </div>
      </div>
    </section>
  );
}
