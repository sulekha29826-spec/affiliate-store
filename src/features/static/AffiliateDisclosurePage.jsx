import React from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
          <ShieldCheck className="w-8 h-8 text-[#2874F0]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#212121]">
              Affiliate Disclosure Statement
            </h1>
            <p className="text-xs text-gray-500">
              FTC Compliance & Amazon Associates Operating Agreement
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="bg-blue-50 border-l-4 border-[#2874F0] p-4 text-xs text-blue-900">
            <strong>Key Summary:</strong> SastaBazar is an affiliate aggregator website. When you click on product links on our platform and make a purchase, we may earn an affiliate commission from our merchant partners (such as Amazon, Flipkart, Myntra, etc.) at <strong>no extra cost to you</strong>.
          </div>

          <section>
            <h2 className="text-base font-bold text-[#212121] mb-2">
              1. Amazon Associates Program Disclosure
            </h2>
            <p>
              SastaBazar is a participant in the Amazon Services LLC Associates Program and the Amazon India Associates Program, affiliate advertising programs designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and affiliated websites.
            </p>
            <p className="mt-2 text-xs italic text-gray-600">
              "As an Amazon Associate, SastaBazar earns from qualifying purchases."
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#212121] mb-2">
              2. Multi-Merchant Partner Networks
            </h2>
            <p>
              In addition to Amazon, we also partner with other reputable online retail marketplaces including but not limited to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
              <li>Flipkart Internet Private Limited (Flipkart Affiliate Program)</li>
              <li>Myntra Designs Private Limited (Myntra Affiliate Program)</li>
              <li>Reliance Retail Limited (Ajio Partner Program)</li>
              <li>Meesho Affiliate Program</li>
              <li>Brand official direct stores (e.g. boAt, Noise, Samsung)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#212121] mb-2">
              3. Pricing & Product Accuracy
            </h2>
            <p>
              Prices, discounts, coupons, and product stock availability change frequently on merchant websites. While we strive to maintain real-time deal accuracy:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
              <li>Prices and availability displayed on the merchant site at the time of purchase will apply.</li>
              <li>We do not process payments, ship orders, or store customer payment data. All transactions happen on the respective merchant's secure platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#212121] mb-2">
              4. Editorial Integrity
            </h2>
            <p>
              Our recommendation of a product is based on genuine discounts, historical price trends, and customer ratings. The commission received never dictates our curation choices or increases the price paid by the consumer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
