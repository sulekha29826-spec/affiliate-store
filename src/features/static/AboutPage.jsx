import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#212121] mb-4">
          About SastaBazar
        </h1>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to <strong>SastaBazar</strong> — your premier destination for uncovering the most rewarding discounts, coupon codes, and verified price drops across India's largest e-commerce retailers.
          </p>
          <p>
            With millions of products listed across Amazon, Flipkart, Myntra, and specialty brand stores, finding the truly best price can be exhausting. SastaBazar aggregates top deals into a clean, Flipkart-grade interface so you can compare, discover, and purchase with maximum savings.
          </p>
          <h2 className="text-base font-bold text-[#212121] pt-2">Our Mission</h2>
          <p>
            To empower smart Indian online shoppers with real-time curated price intelligence, zero clutter, and instantaneous redirects to certified sellers.
          </p>
        </div>
      </div>
    </div>
  );
}
