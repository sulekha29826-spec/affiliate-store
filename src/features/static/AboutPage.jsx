import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Award,
  ShoppingBag,
  Users,
  ArrowRight,
  Search,
  ChevronDown,
  ExternalLink,
  Lock,
  BadgePercent,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
} from 'lucide-react';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const stats = [
    {
      label: 'Loot Deals Curated',
      value: '25,000+',
      desc: 'Hand-vetted discounts with genuine price drops',
      icon: BadgePercent,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: 'Shopper Savings',
      value: '₹4.5 Cr+',
      desc: 'Estimated customer savings across partner sales',
      icon: TrendingDown,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Partner Merchants',
      value: '20+ Top Brands',
      desc: 'Amazon, Flipkart, Myntra, boAt, Croma & more',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Quality & Trust Score',
      value: '4.9 / 5',
      desc: '100% verified merchant links & manufacturer warranty',
      icon: Award,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  const steps = [
    {
      num: '01',
      title: '24/7 Market Price Tracking',
      desc: 'Our deal hunter team continuously monitors thousands of products across India’s leading online retailers to catch sudden price drops, lightning flash sales, and bank discount glitches.',
      icon: Clock,
    },
    {
      num: '02',
      title: 'Fake Discount & MRP Audit',
      desc: 'We cross-reference historical price charts to verify the discount is 100% genuine. We filter out fake markups, counterfeit sellers, and products with poor buyer ratings (below 3.8★).',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Direct Official Store Redirects',
      desc: 'Every "Grab Deal" button links directly and securely to the official product page on Amazon, Flipkart, Myntra, or brand stores with full HTTPS encryption.',
      icon: ExternalLink,
    },
    {
      num: '04',
      title: 'Zero Extra Cost & Official Warranty',
      desc: 'You complete payment directly on the retailer’s secure checkout. You enjoy official brand warranty, return policies, and your card reward points without paying a single rupee extra.',
      icon: CheckCircle2,
    },
  ];

  const pillars = [
    {
      title: '100% Genuine Merchant Links',
      desc: 'We strictly partner with authorized Indian retailers and certified brand stores. No spam, no sketchy third-party gateways.',
      icon: Lock,
    },
    {
      title: 'Zero Artificially Inflated MRPs',
      desc: 'Many stores artificially hike MRPs before sales. We verify real average selling prices so every 40%–85% OFF deal is authentic.',
      icon: BadgePercent,
    },
    {
      title: 'Privacy-First Architecture',
      desc: 'We never ask for or store your credit card, UPI, bank login, or delivery address. Your purchases remain entirely between you and the retailer.',
      icon: ShieldCheck,
    },
    {
      title: 'Clean, Ad-Free Shopping Interface',
      desc: 'Unlike spammy coupon sites littered with pop-ups and misleading clicks, SastaBazar delivers a fast, Flipkart-grade, clean browsing experience.',
      icon: Sparkles,
    },
  ];

  const partnerStores = [
    { name: 'Amazon India', tag: 'A+ Authorized Affiliate' },
    { name: 'Flipkart', tag: 'Verified Commerce Partner' },
    { name: 'Myntra', tag: 'Fashion Deals Network' },
    { name: 'boAt Lifestyle', tag: 'Audio & Wearables Direct' },
    { name: 'Croma Retail', tag: 'Electronics & Appliances' },
    { name: 'Ajio', tag: 'Trends & Apparel Partner' },
    { name: 'Tata CLiQ', tag: 'Premium Tech & Luxury' },
    { name: 'Noise', tag: 'Smart Gadgets & Fitness' },
  ];

  const faqs = [
    {
      q: 'What is SastaBazar and how does it help me save money?',
      a: 'SastaBazar is India’s dedicated deal discovery and price-drop tracking platform. We curate verified discounts, flash sales, and price drops from Amazon, Flipkart, Myntra, and top brand stores into one clean interface so you never have to search multiple sites to find the lowest price.',
    },
    {
      q: 'Do I purchase products directly from SastaBazar or from the retailer?',
      a: 'You purchase directly from the official retailer. When you click "Grab Deal" or "Buy Now", SastaBazar securely redirects you to the product’s official page on Amazon, Flipkart, or the brand website. The retailer fulfills, packs, and ships your order.',
    },
    {
      q: 'Are the products covered by original brand warranties and return policies?',
      a: 'Yes, 100%! Because your transaction takes place directly on verified platforms like Amazon India or Flipkart, you receive the standard tax invoice, official manufacturer warranty, and the retailer’s complete replacement or return policy.',
    },
    {
      q: 'Does SastaBazar charge any fee or subscription from shoppers?',
      a: 'Never. SastaBazar is 100% free for all shoppers. We earn a small referral commission from retailers when you complete an eligible purchase through our links, at zero extra cost to you.',
    },
    {
      q: 'Why do some loot deals expire so quickly?',
      a: 'The highest discounts (often 60% to 85% OFF) are typically lightning flash deals, clearance sales, or limited-inventory price cuts. When the allocated stock sells out or the promo period ends, the retailer reverts the price back to regular MRP.',
    },
    {
      q: 'How does SastaBazar ensure deals are genuine?',
      a: 'Our deal verification team monitors price histories, cross-checks seller ratings, inspects buyer reviews, and validates that the discounted price is truly lower than historical market averages before listing it.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F6] pb-14 text-slate-800">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">About SastaBazar</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-linear-to-b from-[#0B1329] via-[#0F1C3F] to-[#14234E] text-white pt-12 pb-16 px-4 sm:px-6 border-b border-blue-900/60 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>India's Smartest Deal Discovery Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
            Smart Shopping, Real Discounts, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-yellow-200 to-amber-400">
              Zero Marketing Gimmicks.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal mb-8">
            SastaBazar monitors thousands of price drops across Amazon, Flipkart, Myntra & top Indian stores. We filter out fake MRP markups so you grab genuine loot deals with 100% confidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD700] hover:bg-[#F5C800] text-slate-900 font-extrabold shadow-lg hover:shadow-xl transition-all"
            >
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
              <span>Explore Today's Loot Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-xs transition-all"
            >
              <Search className="w-4 h-4 text-blue-300" />
              <span>Search Products by Keyword</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Stats Counters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2.5 rounded-lg border ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-slate-600 mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission & Purpose Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                Empowering Smart Indian Shoppers to Beat Rising E-Commerce Prices
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                With hundreds of sales events like Great Indian Festival, Big Billion Days, and Super Savings Days happening every year, tracking true lowest prices across tens of retailers is exhausting.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                At <strong>SastaBazar</strong>, our goal is crystal clear: provide a lightning-fast, transparent, and uncluttered deal discovery platform. We do the heavy lifting of price tracking, discount verification, and seller auditing so you can shop with peace of mind.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Subscription Fees
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Official Seller Invoices
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Full Brand Warranty Protection
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-xl p-6 sm:p-7 shadow-lg border border-blue-900">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>The SastaBazar Promise</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                "Paisa Vasool Guarantee"
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                We never recommend a deal just because of an affiliate link. Every product featured on our homepage must meet strict criteria: genuine price drop, reputable seller, positive customer satisfaction, and safe checkout.
              </p>
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Deal Verification Team</div>
                  <div className="text-slate-400 text-[11px]">SastaBazar India Network</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  Verified Safe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - 4 Step Process */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            How We Find & Verify Loot Deals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            A transparent look into our 4-step deal discovery and verification pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-200">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Quality Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Why Shoppers Choose Us</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            Built on Trust, Transparency & Speed
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unlike spammy coupon forums, SastaBazar puts buyer safety and genuine savings first.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-slate-900 text-white shrink-0 shadow-sm">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Partner Merchants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Official Partner Platforms & Merchants
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every deal links to authorized platforms with verified merchant seller protections.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {partnerStores.map((partner, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 text-center hover:bg-slate-100 transition-colors"
              >
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {partner.name}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  {partner.tag}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              All merchant logos, brand names, and trademarks belong to their respective owners. SastaBazar is an independent price discovery platform.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            Got Questions? We've Got Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-linear-to-r from-[#0B1329] via-[#1E293B] to-[#0B1329] rounded-2xl p-6 sm:p-10 text-white text-center shadow-xl border border-blue-900/60 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Ready to Save Hundreds on Your Next Purchase?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Browse our freshly audited loot deals, updated live every few minutes across all major categories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFD700] hover:bg-[#F5C800] text-slate-900 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
              >
                <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                <span>Browse All Active Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/affiliate-disclosure"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Read Affiliate Disclosure</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
