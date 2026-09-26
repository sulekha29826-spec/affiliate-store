import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#212121] mb-4">
          Terms of Service
        </h1>
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            By accessing or browsing SastaBazar, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h2 className="text-base font-bold text-[#212121]">Merchant Transactions & Fulfillment</h2>
          <p>
            SastaBazar acts solely as a discovery platform and affiliate curator. We do not sell items directly, process payments, or guarantee merchant inventory. Any warranty, dispute, or customer service request regarding purchased goods must be directed to the selling platform (e.g. Amazon, Flipkart).
          </p>
          <h2 className="text-base font-bold text-[#212121]">Accuracy of Information</h2>
          <p>
            We endeavor to keep product pricing, discounts, and links accurate. However, e-commerce promotions can change rapidly. We cannot guarantee that promotional prices will be honored if modified by the retailer prior to purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
