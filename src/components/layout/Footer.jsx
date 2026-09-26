import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, HelpCircle } from 'lucide-react';
import { getSiteSettings } from '../../services/settingsService';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const disclosureText =
    settings?.affiliateDisclosure ||
    'SastaBazar is a participant in affiliate advertising programs designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in, Flipkart.com, Myntra.com, Ajio.com and others. Prices and availability are subject to change without prior notice.';

  return (
    <footer className="bg-[#0B1329] text-white pt-10 pb-8 mt-12 border-t border-blue-950 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
          {/* Col 1: About */}
          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-3 text-[11px]">
              ABOUT SASTABAZAR
            </h4>
            <p className="text-slate-300 leading-relaxed mb-3">
              SastaBazar is your smart companion for tracking daily deals, price drops, and hand-picked offers from top Indian e-commerce platforms.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Genuine Redirects</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-3 text-[11px]">
              QUICK NAVIGATION
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li>
                <Link to="/category/electronics" className="hover:text-[#FFD700] transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link to="/category/mobiles" className="hover:text-[#FFD700] transition-colors">
                  Smartphones & Accessories
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="hover:text-[#FFD700] transition-colors">
                  Men & Women Fashion
                </Link>
              </li>
              <li>
                <Link to="/category/appliances" className="hover:text-[#FFD700] transition-colors">
                  Home Appliances
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal Policy */}
          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-3 text-[11px]">
              POLICY & COMPLIANCE
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li>
                <Link to="/affiliate-disclosure" className="text-[#FFD700] font-bold hover:underline">
                  Affiliate Disclosure (FTC & Amazon)
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#FFD700] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-[#FFD700] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFD700] transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Partner platforms */}
          <div>
            <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-3 text-[11px]">
              PARTNER NETWORKS
            </h4>
            <p className="text-slate-300 leading-relaxed mb-3">
              Products listed on our platform are fulfilled and shipped directly by respective official merchants.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-200">
              <span className="bg-slate-800/90 border border-slate-700 px-2 py-1 rounded shadow-xs">Amazon Associates</span>
              <span className="bg-slate-800/90 border border-slate-700 px-2 py-1 rounded shadow-xs">Flipkart Affiliate</span>
              <span className="bg-slate-800/90 border border-slate-700 px-2 py-1 rounded shadow-xs">Myntra Partner</span>
              <span className="bg-slate-800/90 border border-slate-700 px-2 py-1 rounded shadow-xs">Ajio Partner</span>
            </div>
          </div>
        </div>

        {/* Mandatory Affiliate Disclosure Callout */}
        <div className="bg-slate-900/90 border border-blue-900/50 p-4 rounded-[4px] my-6 shadow-inner">
          <div className="flex items-start gap-2.5">
            <span className="text-[#FFD700] font-black text-xs uppercase tracking-wide shrink-0">
              Legal Disclosure:
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              {disclosureText}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SastaBazar. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Built with care for smart shoppers</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
