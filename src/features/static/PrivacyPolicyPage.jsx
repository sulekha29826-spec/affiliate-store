import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#212121] mb-4">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            At SastaBazar, accessible from our storefront, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information recorded and how we utilize it.
          </p>
          <h2 className="text-base font-bold text-[#212121]">Log Files & Analytics</h2>
          <p>
            SastaBazar logs outbound clicks when users click on merchant referral links. This data includes anonymous timestamps, merchant identifiers, and standard browser headers. We do not store sensitive payment, banking, or credit card details.
          </p>
          <h2 className="text-base font-bold text-[#212121]">Cookies & Third-Party Merchants</h2>
          <p>
            When you click on an affiliate link to Amazon, Flipkart, or any merchant, third-party cookies may be placed on your device by the merchant's network to credit sales commissions according to their standard operating guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
