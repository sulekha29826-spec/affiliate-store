import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  ExternalLink, 
  RotateCcw, 
  ShoppingBag,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { askSastaAI } from '../../services/aiService';
import { formatCurrency } from '../../utils/formatCurrency';
import { trackAndRedirect } from '../../utils/trackClick';
import PlatformBadge from '../common/PlatformBadge';

const SUGGESTED_PROMPTS = [
  '⚡ Best earbuds under ₹2000',
  '🔥 Top smartphone deals today',
  '👟 Casual shoes for college',
  '🍳 Daily kitchen gadgets under ₹500',
];

export default function SastaAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! Main **SastaAI** hoon—aapka smart shopping dost! 🛍️\n\nAap mujhse kisi bhi budget, gadget ya fashion deal ke baare me pooch sakte hain. Main aapke liye best offers dhoondhunga!',
      products: [],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      products: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.filter((m) => m.id !== 'welcome');
      const response = await askSastaAI(text, history);

      const aiMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        products: response.products || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Failed to get AI answer:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry bhai! Kuch network issue ho gaya. Aap please dobara pooch sakte hain?',
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: 'Chat clear ho gaya! Ab aap kya dhundhna chahte hain? ⚡',
        products: [],
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2">
          {hasUnread && (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-700 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Deal chahiye? SastaAI se poocho!</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open SastaAI Assistant"
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 sm:px-5 rounded-full shadow-xl shadow-indigo-600/35 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600" />
            </div>
            <span className="text-xs sm:text-sm tracking-wide">Ask SastaAI</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
          </button>
        </div>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-fade-in font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1746B3] via-[#1D4ED8] to-[#2563EB] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5 text-[#FFD700]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-blue-800" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">SastaAI</h3>
                  <span className="text-[10px] bg-[#FFD700] text-blue-950 font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                    Smart AI
                  </span>
                </div>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span>Smart Deal Assistant</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-medium">Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close SastaAI"
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Render Embedded Product Recommendations */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                        ✨ Top Recommended Deals:
                      </span>
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-slate-50 border border-slate-200 p-2 rounded-lg flex items-center justify-between gap-2.5 hover:border-blue-400 transition"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img
                              src={prod.images?.[0] || 'https://via.placeholder.com/80'}
                              alt={prod.title}
                              className="w-10 h-10 object-contain bg-white rounded p-0.5 shrink-0 border border-slate-100"
                            />
                            <div className="truncate">
                              <h4 className="font-semibold text-xs text-slate-900 truncate" title={prod.title}>
                                {prod.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-black text-xs text-slate-900">
                                  {formatCurrency(prod.price)}
                                </span>
                                {prod.discountPercent > 0 && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                                    {prod.discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1">
                            <Link
                              to={`/product/${prod.slug || prod.id}`}
                              onClick={() => setIsOpen(false)}
                              className="p-1 text-slate-400 hover:text-blue-600"
                              title="View Details"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => trackAndRedirect(prod.id, prod.platform, prod.affiliateLink)}
                              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded shadow-xs active:scale-95 transition cursor-pointer flex items-center gap-1"
                            >
                              <span>Buy</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-xs space-y-1.5 max-w-[75%]">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700] animate-pulse" />
                    <span>SastaAI best deals dhoondh raha hai...</span>
                  </div>
                  <div className="h-2 w-36 skeleton-shimmer rounded" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition shadow-2xs active:scale-95 cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything in Hinglish... (e.g. Earbuds under 2000)"
              disabled={loading}
              className="flex-1 bg-slate-100 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2 sm:py-2.5 rounded-full focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
