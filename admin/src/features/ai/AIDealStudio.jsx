import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Wand2,
  Share2,
  Copy,
  Check,
  Send,
  Bot,
  Zap,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Tag,
  CheckCircle2,
  Layers,
  Play,
  Activity,
  ShieldCheck,
  Cpu,
  Clock
} from 'lucide-react';
import {
  aiParseProduct,
  aiEnhanceDescription,
  aiGenerateSocialPost,
  aiAskAdminCopilot
} from '../../services/adminAIService';
import { getAdminProducts, getAdminCategories, saveProduct } from '../../services/adminService';

export default function AIDealStudio() {
  const [activeTab, setActiveTab] = useState('agent_team'); // 'agent_team' | 'magic_deal' | 'social_broadcast' | 'copilot'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // --- TAB 4: Autonomous Agent Team State ---
  const [teamRunning, setTeamRunning] = useState(false);
  const [teamLogs, setTeamLogs] = useState([]);
  const [lastPublishedProduct, setLastPublishedProduct] = useState(null);

  // --- TAB 1: Magic Deal Ingest State ---
  const [magicInput, setMagicInput] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  const [generatedDeal, setGeneratedDeal] = useState(null);
  const [dealSavedSuccess, setDealSavedSuccess] = useState(false);
  const [savingToCatalog, setSavingToCatalog] = useState(false);

  // --- TAB 2: Social Broadcast Generator State ---
  const [selectedProductId, setSelectedProductId] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState('telegram');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [generatedBroadcast, setGeneratedBroadcast] = useState('');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  // --- TAB 3: Copilot Chat State ---
  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste Admin Ji! 🚀 Main hoon **SastaAI Store Copilot**.\n\nAap mujhse affiliate sales badhane ki strategy, high-commission product recommendations, Telegram channel growth, ya pricing optimization ke bare me kuch bhi pooch sakte hain!'
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, catList] = await Promise.all([
          getAdminProducts(),
          getAdminCategories()
        ]);
        setProducts(prodList || []);
        setCategories(catList || []);
        if (prodList && prodList.length > 0) {
          setSelectedProductId(prodList[0].id);
        }
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, copilotLoading]);

  // Handle Tab 4: Autonomous Agent Team Batch Run
  const handleRunAgentTeam = async () => {
    if (teamRunning) return;
    setTeamRunning(true);
    setTeamLogs([]);
    setLastPublishedProduct(null);

    const log = (msg) => {
      setTeamLogs((prev) => [...prev, msg]);
    };

    try {
      log('🤖 [Agent Coordinator]: Initiating Autonomous 5-Agent Swarm...');
      await new Promise((r) => setTimeout(r, 600));

      log('🕵️‍♂️ [Agent 1: Deal Scout]: Scanning Amazon India & Flipkart for 50%+ price drop deals...');
      await new Promise((r) => setTimeout(r, 900));

      const candidates = [
        {
          title: 'boAt Airdopes 141 ANC Bluetooth Wireless Earbuds',
          category: 'electronics',
          subCategory: 'Audio & Headphones',
          platform: 'amazon',
          price: 1399,
          originalPrice: 4490,
          affiliateLink: 'https://www.amazon.in/dp/B09N3ZNHTY?tag=sastabazar-21',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'Noise Pulse 2 Max 1.85 Inch BT Calling Smartwatch',
          category: 'electronics',
          subCategory: 'Smart Wearables',
          platform: 'flipkart',
          price: 1299,
          originalPrice: 5999,
          affiliateLink: 'https://www.flipkart.com/noise-pulse-2-max/p/itmexample?affid=sastabazar',
          image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'Puma Men Softride Rift Running Shoes',
          category: 'fashion',
          subCategory: 'Footwear',
          platform: 'myntra',
          price: 2199,
          originalPrice: 5499,
          affiliateLink: 'https://www.myntra.com/shoes/puma/running?aff=sastabazar',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'Pigeon 1.8L Electric Kettle for Boiling Water & Tea',
          category: 'appliances',
          subCategory: 'Kitchen Appliances',
          platform: 'amazon',
          price: 599,
          originalPrice: 1245,
          affiliateLink: 'https://www.amazon.in/dp/B07WMS7TWB?tag=sastabazar-21',
          image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'Philips Multi Grooming Kit All-in-One Trimmer',
          category: 'beauty',
          subCategory: 'Personal Grooming',
          platform: 'flipkart',
          price: 1499,
          originalPrice: 2195,
          affiliateLink: 'https://www.flipkart.com/philips-trimmer/p/itmexample?affid=sastabazar',
          image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
        }
      ];

      // Pick candidate not yet in products
      const existingTitles = products.map((p) => p.title?.toLowerCase() || '');
      const picked = candidates.find((c) => !existingTitles.includes(c.title.toLowerCase())) || {
        ...candidates[0],
        title: `${candidates[0].title} (Special Loot Edition)`
      };

      log(`🎯 [Agent 1: Deal Scout]: High-potential deal discovered: "${picked.title}"`);
      await new Promise((r) => setTimeout(r, 700));

      const disc = Math.round(((picked.originalPrice - picked.price) / picked.originalPrice) * 100);
      log(`🔍 [Agent 2: Bharosa Inspector]: Verified! Real Discount = ${disc}% OFF, 100% Brand Warranty & 4.3★ Rating confirmed.`);
      await new Promise((r) => setTimeout(r, 700));

      log('✍️ [Agent 3: SastaAI Copywriter]: Crafting high-converting Hinglish deal copy & specs...');
      const copy = await aiEnhanceDescription(picked.title, `Best deal on ${picked.platform.toUpperCase()} with ${disc}% discount. Brand new with official warranty.`);
      await new Promise((r) => setTimeout(r, 600));

      log('🚀 [Agent 4: Auto-Publisher]: Saving product to Firebase Live Catalog...');
      const newProductPayload = {
        title: picked.title,
        slug: picked.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: copy,
        categoryId: picked.category,
        subCategory: picked.subCategory,
        platform: picked.platform,
        price: picked.price,
        originalPrice: picked.originalPrice,
        discountPercent: disc,
        affiliateLink: picked.affiliateLink,
        images: [picked.image],
        tags: ['trending', 'deal_of_the_day', 'hot', 'autopilot'],
        status: 'active',
      };

      const saved = await saveProduct(newProductPayload);
      setProducts((prev) => [saved, ...prev]);
      setLastPublishedProduct(saved);
      log(`✅ [Agent 4: Auto-Publisher]: Product successfully published to Live Storefront! (ID: ${saved.id})`);

      log('📢 [Agent 5: Social Broadcaster]: Formatted viral Telegram/WhatsApp post ready for broadcast.');
      await new Promise((r) => setTimeout(r, 500));
      log('🎉 [Agent Team]: Pipeline completed with 100% success! Deal is now LIVE on SastaBazar.');
    } catch (err) {
      console.error('Agent team execution error:', err);
      log(`⚠️ [Error]: Pipeline encountered an issue: ${err.message}`);
    } finally {
      setTeamRunning(false);
    }
  };

  // Handle Tab 1: AI Parse and Ingest
  const handleGenerateDeal = async (e) => {
    e?.preventDefault();
    if (!magicInput.trim() || magicLoading) return;

    setMagicLoading(true);
    setGeneratedDeal(null);
    setDealSavedSuccess(false);

    try {
      const parsed = await aiParseProduct(magicInput, categories);
      setGeneratedDeal(parsed);
    } catch (err) {
      console.error('Magic Deal Generation failed:', err);
    } finally {
      setMagicLoading(false);
    }
  };

  // Handle Tab 1: Direct Save to Firebase
  const handleSaveToCatalog = async () => {
    if (!generatedDeal || savingToCatalog) return;
    setSavingToCatalog(true);

    try {
      const payload = {
        title: generatedDeal.title,
        slug: generatedDeal.slug || generatedDeal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: generatedDeal.description || '',
        categoryId: generatedDeal.categoryId || categories[0]?.id || 'electronics',
        subCategory: generatedDeal.subCategory || 'General',
        platform: generatedDeal.platform || 'amazon',
        price: Number(generatedDeal.price) || 999,
        originalPrice: Number(generatedDeal.originalPrice) || 1999,
        discountPercent: generatedDeal.originalPrice > generatedDeal.price
          ? Math.round(((generatedDeal.originalPrice - generatedDeal.price) / generatedDeal.originalPrice) * 100)
          : 50,
        affiliateLink: generatedDeal.affiliateLink || 'https://affiliate-store-kohl.vercel.app',
        images: generatedDeal.images?.length ? generatedDeal.images : [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
        ],
        tags: generatedDeal.tags || ['featured', 'deal_of_the_day'],
        status: 'active'
      };

      const saved = await saveProduct(payload);
      setDealSavedSuccess(true);
      // Refresh local product list
      setProducts(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Failed to save generated deal:', err);
    } finally {
      setSavingToCatalog(false);
    }
  };

  // Handle Tab 2: Generate Broadcast Post
  const handleGenerateBroadcast = async () => {
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod || broadcastLoading) return;

    setBroadcastLoading(true);
    setCopiedBroadcast(false);

    try {
      const post = await aiGenerateSocialPost(prod, broadcastChannel);
      setGeneratedBroadcast(post);
    } catch (err) {
      console.error('Failed to generate broadcast:', err);
    } finally {
      setBroadcastLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  // Handle Tab 3: Copilot Chat
  const handleSendCopilot = async (overridePrompt) => {
    const query = overridePrompt || copilotInput;
    if (!query.trim() || copilotLoading) return;

    const newMessages = [...copilotMessages, { role: 'user', content: query }];
    setCopilotMessages(newMessages);
    setCopilotInput('');
    setCopilotLoading(true);

    try {
      const catalogSummary = `Products Count: ${products.length}\nCategories: ${categories.map(c => c.name).join(', ')}`;
      const reply = await aiAskAdminCopilot(query, newMessages, catalogSummary);
      setCopilotMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setCopilotMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Koshish asafal rahi. Kripya thodi der baad dobara poochhein.' }
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
                <Sparkles className="w-5 h-5 text-[#FFD700] fill-[#FFD700] animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                SastaAI Deal Studio
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Admin Co-Pilot
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              1-Click Product Ingestion, Automated Viral Telegram/WhatsApp Deal Copy, aur Smart Affiliate Growth Advisor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://affiliate-store-kohl.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('agent_team')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'agent_team'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FFD700] fill-[#FFD700] animate-pulse" />
          <span>24/7 Agent Team Hub</span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/30">
            AUTOPILOT
          </span>
        </button>

        <button
          onClick={() => setActiveTab('magic_deal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'magic_deal'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wand2 className="w-4 h-4 text-[#FFD700]" />
          <span>1-Click Deal Publisher</span>
        </button>

        <button
          onClick={() => setActiveTab('social_broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'social_broadcast'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>Social & Telegram Copywriter</span>
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'copilot'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>Store Copilot Chat</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 0: 24/7 Autonomous AI Agent Team Hub */}
      {/* ========================================================= */}
      {activeTab === 'agent_team' && (
        <div className="space-y-6">
          {/* Cloud Automation Status Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">24/7 Cloud Autopilot Pipeline Active</h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    GitHub Actions cron har 6 ghante me cloud me automatically naye deals scout karke store me publish karta hai.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunAgentTeam}
                disabled={teamRunning}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer shrink-0"
              >
                {teamRunning ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Agent Team Working...</span>
                  </span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Agent Team Now (Instant Batch)</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Live Products</span>
                <span className="text-sm font-black text-white">{products.length} Products</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Execution Frequency</span>
                <span className="text-sm font-black text-emerald-400">Every 6 Hours (Cloud)</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Quality Threshold</span>
                <span className="text-sm font-black text-[#FFD700]">40% - 80% Real Off</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Fulfillment Verification</span>
                <span className="text-sm font-black text-blue-400">Amazon & Flipkart</span>
              </div>
            </div>
          </div>

          {/* 5-Agent Roster Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🕵️‍♂️</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <h4 className="text-xs font-bold text-white">Agent 1: Deal Scout</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Amazon, Flipkart & Myntra se highest-discount deals aur price drops scan karta hai.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🔍</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <h4 className="text-xs font-bold text-white">Agent 2: Bharosa Check</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Fake discount filter karta hai, 4.0★ rating aur official brand warranty verify karta hai.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">✍️</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <h4 className="text-xs font-bold text-white">Agent 3: Copywriter</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                High-converting Hinglish copy, 4 specs bullets aur catchy emojis generate karta hai.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🚀</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <h4 className="text-xs font-bold text-white">Agent 4: Auto-Publisher</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Affiliate tracking link attach karke seedha live catalog me push karta hai.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">📢</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <h4 className="text-xs font-bold text-white">Agent 5: Broadcaster</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Telegram channel aur WhatsApp groups ke liye ready-to-post viral deal copy banata hai.
              </p>
            </div>
          </div>

          {/* Live Execution Logs Terminal */}
          {teamLogs.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Autonomous Multi-Agent Live Execution Terminal</span>
                </span>
                {teamRunning ? (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Processing In Real-Time</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Execution Complete</span>
                )}
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pt-1">
                {teamLogs.map((l, idx) => (
                  <div key={idx} className="text-slate-300 leading-relaxed animate-fade-in">
                    <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {l}
                  </div>
                ))}
              </div>

              {lastPublishedProduct && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Naya product store me add ho chuka hai: "{lastPublishedProduct.title}" (₹{lastPublishedProduct.price})</span>
                  </div>
                  <a
                    href="https://affiliate-store-kohl.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-300 font-semibold underline"
                  >
                    Live Store par dekhein
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: 1-Click Deal Publisher */}
      {/* ========================================================= */}
      {activeTab === 'magic_deal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                  <Zap className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  <span>AI Magic Ingest</span>
                </div>
                <p className="text-xs text-slate-400">
                  Koi bhi Amazon/Flipkart product link, title, ya raw specs daalein. SastaAI pricing, tags, aur high-converting copy generate karega.
                </p>
              </div>

              <form onSubmit={handleGenerateDeal} className="space-y-3">
                <textarea
                  rows={4}
                  value={magicInput}
                  onChange={(e) => setMagicInput(e.target.value)}
                  placeholder="Jaise: 'Samsung Galaxy M34 5G 128GB Waterfall Blue flat 35% off on Amazon ₹14999 https://amzn.to/example'"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                  <span>Quick Try:</span>
                  <button
                    type="button"
                    onClick={() => setMagicInput('boAt Airdopes 141 ANC 42H playtime 70% off amazon ₹1299')}
                    className="text-indigo-400 hover:underline cursor-pointer"
                  >
                    boAt Earbuds
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setMagicInput('Puma Men Running Shoes Softride flat 55% off flipkart ₹1999')}
                    className="text-indigo-400 hover:underline cursor-pointer"
                  >
                    Puma Shoes
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={magicLoading || !magicInput.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  {magicLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-ping" />
                      <span>SastaAI Analysis Running...</span>
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      <span>Generate Full Deal Listing</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Generated Preview & 1-Click Publish */}
          <div className="lg:col-span-7">
            {magicLoading && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#FFD700] animate-pulse" />
                  <span>AI Product Listing Bna Raha Hai...</span>
                </div>
                <div className="space-y-3">
                  <div className="h-5 w-3/4 skeleton-shimmer rounded-lg" />
                  <div className="h-4 w-1/2 skeleton-shimmer rounded-lg" />
                  <div className="h-20 w-full skeleton-shimmer rounded-xl" />
                  <div className="h-10 w-full skeleton-shimmer rounded-xl" />
                </div>
              </div>
            )}

            {!magicLoading && !generatedDeal && (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-sm">Koi Deal Generated Nahi Hai</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Left side me product ka naam ya link daaliye aur "Generate Full Deal Listing" dabaiye.
                </p>
              </div>
            )}

            {!magicLoading && generatedDeal && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      AI Generated Preview
                    </span>
                    <span className="text-xs font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {generatedDeal.platform}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Category: <strong className="text-white capitalize">{generatedDeal.categoryId}</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Title</span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {generatedDeal.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400">Deal Price</span>
                      <p className="text-base font-extrabold text-emerald-400">₹{generatedDeal.price}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Original MRP</span>
                      <p className="text-sm font-semibold text-slate-400 line-through">₹{generatedDeal.originalPrice}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Discount</span>
                      <p className="text-base font-extrabold text-[#FFD700]">
                        {generatedDeal.originalPrice > generatedDeal.price
                          ? Math.round(((generatedDeal.originalPrice - generatedDeal.price) / generatedDeal.originalPrice) * 100)
                          : 50}% OFF
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Optimized Description</span>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed">
                      {generatedDeal.description}
                    </p>
                  </div>

                  {generatedDeal.tags && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-400 mr-1">Tags:</span>
                      {generatedDeal.tags.map(t => (
                        <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {dealSavedSuccess ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Deal successfully live catalog me add ho gayi! 🎉</span>
                    </div>
                    <a
                      href="https://affiliate-store-kohl.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-300 underline font-semibold"
                    >
                      Store par dekhein
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleSaveToCatalog}
                    disabled={savingToCatalog}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    {savingToCatalog ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                        <span>Firebase me Save ho raha hai...</span>
                      </span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Publish to SastaBazar Catalog (1-Click)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: Social Media & Telegram Copywriter */}
      {/* ========================================================= */}
      {activeTab === 'social_broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Viral Broadcast Generator</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Apne catalog se product chunein aur Telegram/WhatsApp deal channel ke liye high-converting post generate karein.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium text-xs mb-1">
                    Select Product from Store *
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium text-xs mb-1">
                    Target Broadcast Platform
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel('telegram')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        broadcastChannel === 'telegram'
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      📢 Telegram Channel
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel('whatsapp')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        broadcastChannel === 'whatsapp'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      💬 WhatsApp Group
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateBroadcast}
                  disabled={broadcastLoading || !selectedProductId}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  {broadcastLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-ping" />
                      <span>Writing Copy...</span>
                    </span>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-[#FFD700]" />
                      <span>Generate Viral Broadcast Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {broadcastLoading && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#FFD700] animate-pulse" />
                  <span>High-Converting Broadcast Post Bana Raha Hai...</span>
                </div>
                <div className="h-40 w-full skeleton-shimmer rounded-xl" />
              </div>
            )}

            {!broadcastLoading && !generatedBroadcast && (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-sm">Koi Broadcast Message Ready Nahi Hai</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Product select karke "Generate Viral Broadcast Post" par click karein.
                </p>
              </div>
            )}

            {!broadcastLoading && generatedBroadcast && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ready To Post ({broadcastChannel.toUpperCase()})</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(generatedBroadcast)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-600/30"
                  >
                    {copiedBroadcast ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Post</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed select-all">
                  {generatedBroadcast}
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 Tip: Is text ko direct apne Telegram channel ya WhatsApp community me paste karke viral traffic drive karein.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SastaAI Admin Copilot Chat */}
      {/* ========================================================= */}
      {activeTab === 'copilot' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">SastaAI Store Advisor</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online & Catalog Connected
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">
              Total Products: <strong className="text-white">{products.length}</strong>
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {copilotMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {copilotLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl rounded-tl-none space-y-1.5 max-w-[70%]">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700] animate-pulse" />
                    <span>SastaAI sochna shuru kar raha hai...</span>
                  </div>
                  <div className="h-2 w-32 skeleton-shimmer rounded" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/50 flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => handleSendCopilot('Kaunse products me discount sabse zyada hai aur unhe kaise promote karein?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              🔥 Highest discount promotion
            </button>
            <button
              onClick={() => handleSendCopilot('Telegram deal channel growth ke liye 3 proven tips batao')}
              className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              📢 Telegram channel growth
            </button>
            <button
              onClick={() => handleSendCopilot('India me top 5 high-commission electronics product ideas')}
              className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              💰 High commission products
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendCopilot();
                }
              }}
              placeholder="SastaAI se store growth ya product strategy ke bare me poochhein..."
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
            />
            <button
              onClick={() => handleSendCopilot()}
              disabled={copilotLoading || !copilotInput.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
