import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#212121] mb-2">
          Contact SastaBazar Team
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Have a question about a deal, partnership opportunity, or feedback? Get in touch.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-[2px] text-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-green-900">Message Received!</h3>
            <p className="text-xs text-green-700 mt-1">
              Thank you for contacting us. Our deals team will respond within 24–48 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Your Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-[2px] p-2.5 focus:outline-none focus:ring-1 focus:ring-[#2874F0]"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-[2px] p-2.5 focus:outline-none focus:ring-1 focus:ring-[#2874F0]"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Subject</label>
              <input
                required
                type="text"
                placeholder="Deal inquiry / Partnership"
                className="w-full border border-gray-300 rounded-[2px] p-2.5 focus:outline-none focus:ring-1 focus:ring-[#2874F0]"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us what's on your mind..."
                className="w-full border border-gray-300 rounded-[2px] p-2.5 focus:outline-none focus:ring-1 focus:ring-[#2874F0]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#2874F0] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-[2px] flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
