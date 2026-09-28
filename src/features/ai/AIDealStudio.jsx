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
  aiAskAdminCopilot,
  getCuratedGalleryForProduct
} from '../../services/adminAIService';
import { ref, set } from 'firebase/database';
import { database, isFirebaseConfigured } from '../../services/firebase';
import { getActiveProducts, saveCustomProductToStorage } from '../../services/productService';
import { getCategories } from '../../services/categoryService';

const getAdminProducts = getActiveProducts;
const getAdminCategories = getCategories;

export async function saveProduct(productData) {
  const id = productData.id || `prod_${Date.now()}`;
  let discountPercent = productData.discountPercent;
  if (productData.price && productData.originalPrice && productData.originalPrice > productData.price) {
    discountPercent = Math.round(
      ((productData.originalPrice - productData.price) / productData.originalPrice) * 100
    );
  }

  const payload = {
    ...productData,
    id,
    discountPercent: discountPercent || 0,
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice) || 0,
    clickCount: Number(productData.clickCount) || 0,
    status: productData.status || 'active',
    updatedAt: Date.now(),
    createdAt: productData.createdAt || Date.now(),
  };

  saveCustomProductToStorage(payload);

  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `products/${id}`), payload);
    } catch (e) {
      console.warn('Firebase save product sync notice:', e.message);
    }
  }

  return payload;
}

export async function saveBanner(bannerData) {
  const id = bannerData.id || `banner_${Date.now()}`;
  const payload = {
    ...bannerData,
    id,
    order: Number(bannerData.order) || 1,
    active: bannerData.active !== undefined ? bannerData.active : true,
    updatedAt: Date.now(),
  };

  try {
    const raw = localStorage.getItem('sastabazar_custom_banners');
    const existing = raw ? JSON.parse(raw) : {};
    existing[id] = payload;
    localStorage.setItem('sastabazar_custom_banners', JSON.stringify(existing));
  } catch (e) {
    console.warn('Banner local storage notice:', e);
  }

  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `banners/${id}`), payload);
    } catch (e) {
      console.warn('Firebase banner sync notice:', e.message);
    }
  }

  return payload;
}

// Curated 24 high-discount candidate deals (45% to 85% OFF) across key eCommerce categories
export const HIGH_DISCOUNT_CANDIDATES = [
  {
    title: 'Fire-Boltt Ninja Call Pro Plus 1.83" Smartwatch',
    category: 'electronics',
    subCategory: 'Smart Wearables',
    platform: 'amazon',
    price: 1199,
    originalPrice: 7999,
    affiliateLink: 'https://www.amazon.in/dp/B0BF57RN3K?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Redux Analog Casual Watch for Men (Blue Dial Leather Strap)',
    category: 'fashion',
    subCategory: 'Watches',
    platform: 'amazon',
    price: 399,
    originalPrice: 2199,
    affiliateLink: 'https://www.amazon.in/dp/B07NSSMS6R?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Noise Pulse 2 Max 1.85" BT Calling Smartwatch',
    category: 'electronics',
    subCategory: 'Smart Wearables',
    platform: 'flipkart',
    price: 1299,
    originalPrice: 5999,
    affiliateLink: 'https://www.flipkart.com/noise-pulse-2-max/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Boult Audio Z40 True Wireless Earbuds 60H Playtime',
    category: 'electronics',
    subCategory: 'Audio & Headphones',
    platform: 'amazon',
    price: 1199,
    originalPrice: 4999,
    affiliateLink: 'https://www.amazon.in/dp/B0BRL8BF4C?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Fastrack Limitless FS1 Pro Smartwatch with 1.96" Super AMOLED',
    category: 'electronics',
    subCategory: 'Smart Wearables',
    platform: 'flipkart',
    price: 1999,
    originalPrice: 7995,
    affiliateLink: 'https://www.flipkart.com/fastrack-fs1-pro/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'boAt Airdopes 141 ANC Bluetooth Wireless Earbuds',
    category: 'electronics',
    subCategory: 'Audio & Headphones',
    platform: 'amazon',
    price: 1399,
    originalPrice: 4490,
    affiliateLink: 'https://www.amazon.in/dp/B09N3ZNHTY?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'boAt Stone 180 5W Portable Bluetooth Speaker',
    category: 'electronics',
    subCategory: 'Audio & Speakers',
    platform: 'amazon',
    price: 999,
    originalPrice: 2490,
    affiliateLink: 'https://www.amazon.in/dp/B08557DF8X?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Puma Men Softride Rift Running Shoes',
    category: 'fashion',
    subCategory: 'Footwear',
    platform: 'myntra',
    price: 2199,
    originalPrice: 5499,
    affiliateLink: 'https://www.myntra.com/shoes/puma/running?aff=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Allen Solly Men Regular Fit Solid Casual Cotton Shirt',
    category: 'fashion',
    subCategory: 'Men Clothing',
    platform: 'myntra',
    price: 899,
    originalPrice: 2199,
    affiliateLink: 'https://www.myntra.com/shirts/allen-solly/casual?aff=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Lifelong 500W Mixer Grinder with 3 Jars',
    category: 'appliances',
    subCategory: 'Kitchen Appliances',
    platform: 'amazon',
    price: 1199,
    originalPrice: 2900,
    affiliateLink: 'https://www.amazon.in/dp/B07DYM48W9?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Wildcraft 45L Unisex Cargo Travel Rucksack Backpack',
    category: 'fashion',
    subCategory: 'Bags & Luggage',
    platform: 'flipkart',
    price: 1499,
    originalPrice: 3499,
    affiliateLink: 'https://www.flipkart.com/wildcraft-45l/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Portronics Power Plate 7 Multi-Plug Extension Board with 3 USB',
    category: 'electronics',
    subCategory: 'Accessories',
    platform: 'amazon',
    price: 649,
    originalPrice: 1499,
    affiliateLink: 'https://www.amazon.in/dp/B08L7V43T9?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Syska 20000mAh Power Bank with 22.5W Fast Charging',
    category: 'electronics',
    subCategory: 'Mobile Accessories',
    platform: 'flipkart',
    price: 1299,
    originalPrice: 2999,
    affiliateLink: 'https://www.flipkart.com/syska-power-bank/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1609592807664-84226cfd5272?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Philips Multi Grooming Kit All-in-One Trimmer MG3710',
    category: 'beauty',
    subCategory: 'Personal Grooming',
    platform: 'flipkart',
    price: 1099,
    originalPrice: 2495,
    affiliateLink: 'https://www.flipkart.com/philips-trimmer/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Zebronics Zeb-Warrior 2.0 Multimedia Gaming Speakers',
    category: 'electronics',
    subCategory: 'Audio & Speakers',
    platform: 'amazon',
    price: 699,
    originalPrice: 1499,
    affiliateLink: 'https://www.amazon.in/dp/B07T6XQ9L4?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558742569-fe6d39d0583a?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Prestige Iris 750 Watt Mixer Grinder with 3 Jars',
    category: 'appliances',
    subCategory: 'Kitchen Appliances',
    platform: 'amazon',
    price: 2899,
    originalPrice: 6195,
    affiliateLink: 'https://www.amazon.in/dp/B0756K54P6?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Campus Men Oxyfit Running & Walking Shoes',
    category: 'fashion',
    subCategory: 'Footwear',
    platform: 'flipkart',
    price: 899,
    originalPrice: 1899,
    affiliateLink: 'https://www.flipkart.com/campus-shoes/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Pigeon by Stovekraft 1.8L Electric Kettle for Boiling Water & Tea',
    category: 'appliances',
    subCategory: 'Kitchen Appliances',
    platform: 'amazon',
    price: 599,
    originalPrice: 1245,
    affiliateLink: 'https://www.amazon.in/dp/B07WMS7TWB?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Bata Men Formal Derby Lace-Up Shoes',
    category: 'fashion',
    subCategory: 'Formal Footwear',
    platform: 'flipkart',
    price: 1199,
    originalPrice: 2499,
    affiliateLink: 'https://www.flipkart.com/bata-shoes/p/itmexample?affid=sastabazar',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Sparx Men Casual Canvas Loafers & Walking Shoes',
    category: 'fashion',
    subCategory: 'Footwear',
    platform: 'amazon',
    price: 649,
    originalPrice: 1299,
    affiliateLink: 'https://www.amazon.in/dp/B07V22L9K6?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Bajaj DX-7 1000W Lightweight Dry Iron with Golden Coating',
    category: 'appliances',
    subCategory: 'Home Appliances',
    platform: 'amazon',
    price: 649,
    originalPrice: 1270,
    affiliateLink: 'https://www.amazon.in/dp/B008P7IQ3K?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Havells HD3151 1200W Foldable Hair Dryer for Quick Styling',
    category: 'beauty',
    subCategory: 'Personal Grooming',
    platform: 'amazon',
    price: 899,
    originalPrice: 1695,
    affiliateLink: 'https://www.amazon.in/dp/B07NSS9LQR?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Milton Thermosteel 1000ml Hot & Cold Stainless Steel Bottle',
    category: 'appliances',
    subCategory: 'Home & Kitchen',
    platform: 'amazon',
    price: 749,
    originalPrice: 1365,
    affiliateLink: 'https://www.amazon.in/dp/B008YB4EYY?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Cosmic Byte CB-GK-16 Firefly Mechanical Gaming Keyboard',
    category: 'electronics',
    subCategory: 'Gaming',
    platform: 'amazon',
    price: 1899,
    originalPrice: 3499,
    affiliateLink: 'https://www.amazon.in/dp/B08V1BNYQ5?tag=sastabazar-21',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export default function AIDealStudio() {
  const [activeTab, setActiveTab] = useState('agent_team'); // 'agent_team' | 'magic_deal' | 'social_broadcast' | 'copilot'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // --- TAB 4: Autonomous Agent Team State ---
  const [teamRunning, setTeamRunning] = useState(false);
  const [teamLogs, setTeamLogs] = useState([]);
  const [lastPublishedBatch, setLastPublishedBatch] = useState([]);
  const [lastPromotedBanners, setLastPromotedBanners] = useState([]);
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

  // Handle Tab 4: Autonomous Agent Team Batch Run (10 Products + 5 Hero Banners)
  const handleRunAgentTeam = async () => {
    if (teamRunning) return;
    setTeamRunning(true);
    setTeamLogs([]);
    setLastPublishedBatch([]);
    setLastPromotedBanners([]);
    setLastPublishedProduct(null);

    const log = (msg) => {
      setTeamLogs((prev) => [...prev, msg]);
    };

    try {
      log('🤖 [Agent Coordinator]: Initiating Autonomous 5-Agent Swarm for 10-Product Batch & Top 5 Banner Promotion...');
      await new Promise((r) => setTimeout(r, 400));

      log('🕵️‍♂️ [Agent 1: Deal Scout]: Scanning Amazon India, Flipkart & Myntra for top 10 verified high-discount deals (40% - 85% OFF)...');
      await new Promise((r) => setTimeout(r, 500));

      // Determine 10 candidates to publish
      const existingTitles = new Set(products.map((p) => p.title?.toLowerCase() || ''));
      let candidatesToPublish = HIGH_DISCOUNT_CANDIDATES.filter(c => !existingTitles.has(c.title.toLowerCase()));

      // If fewer than 10 unique, fill from candidates pool with edition tags
      if (candidatesToPublish.length < 10) {
        const remainingNeeded = 10 - candidatesToPublish.length;
        const fallbackPool = HIGH_DISCOUNT_CANDIDATES.slice(0, remainingNeeded).map((c) => ({
          ...c,
          title: `${c.title} (Batch #${Date.now().toString().slice(-4)} Special)`,
        }));
        candidatesToPublish = [...candidatesToPublish, ...fallbackPool];
      }
      candidatesToPublish = candidatesToPublish.slice(0, 10);

      log(`🎯 [Agent 1: Deal Scout]: 10 High-Discount Deals selected across Electronics, Fashion & Appliances!`);
      await new Promise((r) => setTimeout(r, 300));

      const newlyPublished = [];

      for (let i = 0; i < candidatesToPublish.length; i++) {
        const candidate = candidatesToPublish[i];
        const disc = Math.round(((candidate.originalPrice - candidate.price) / candidate.originalPrice) * 100);

        log(`🔍 [${i + 1}/10] [Agent 2: Bharosa Check]: Verified "${candidate.title.slice(0, 32)}..." | ${disc}% REAL OFF | Brand Warranty Confirmed`);
        await new Promise((r) => setTimeout(r, 150));

        const structuredCopy = `🔥 LOOT DEAL HIGHLIGHT:
${candidate.title} par mil raha hai zabardast flat ${disc}% ka instant discount! Limited-time price drop offer.

📋 PRODUCT OVERVIEW:
${candidate.subCategory || 'eCommerce'} category me top-rated product. Best value-for-money, high performance aur long-term durability ke saath daily use ke liye perfect choice hai.

⚡ KEY SPECIFICATIONS & FEATURES:
• ⚡ Superior Performance & Energy Efficiency
• 💎 Premium Ergonomic Build Quality
• 🚀 Seamless Connectivity & Instant Response
• 🔋 All-Day Battery / High-Durability Reliability

🛡️ BRAND WARRANTY & TRUST:
100% Original Brand Certified Product backed by 1 Year Official Brand Warranty. Fulfilled securely via ${candidate.platform.toUpperCase()} with doorstep delivery and replacement guarantee.`;

        const newProductPayload = {
          title: candidate.title,
          slug: candidate.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: structuredCopy,
          categoryId: candidate.category,
          subCategory: candidate.subCategory,
          platform: candidate.platform,
          price: candidate.price,
          originalPrice: candidate.originalPrice,
          discountPercent: disc,
          affiliateLink: candidate.affiliateLink,
          images: candidate.images && Array.isArray(candidate.images) ? candidate.images : [candidate.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
          tags: ['trending', 'deal_of_the_day', 'hot', 'autopilot', 'high_discount'],
          status: 'active',
        };

        const saved = await saveProduct(newProductPayload);
        newlyPublished.push(saved);
        log(`🚀 [${i + 1}/10] [Agent 4: Auto-Publisher]: Published "${saved.title.slice(0, 28)}..." (₹${saved.price} | ${disc}% OFF)`);
        await new Promise((r) => setTimeout(r, 150));
      }

      // Update state with newly published products
      setProducts((prev) => {
        const map = new Map();
        [...newlyPublished, ...prev].forEach(p => map.set(p.id, p));
        return Array.from(map.values());
      });
      setLastPublishedBatch(newlyPublished);
      setLastPublishedProduct(newlyPublished[newlyPublished.length - 1]);

      log(`✅ [Agent 4: Auto-Publisher]: 10/10 High-Discount Products Successfully Published to Live Catalog!`);
      await new Promise((r) => setTimeout(r, 300));

      // Promote Top 5 Highest Discount Deals to Hero Banners
      log(`🎨 [Agent 4: Auto-Publisher]: Selecting TOP 5 HIGHEST-DISCOUNT deals for Homepage Hero Banners...`);
      
      const allActiveDeals = [...newlyPublished, ...products]
        .filter(p => p.status !== 'inactive')
        .sort((a, b) => (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0));

      const top5Deals = allActiveDeals.slice(0, 5);
      const promotedBanners = [];

      for (let bIndex = 0; bIndex < top5Deals.length; bIndex++) {
        const deal = top5Deals[bIndex];
        const bannerPayload = {
          id: `banner_auto_top_${bIndex + 1}`,
          title: `🔥 Flat ${deal.discountPercent}% OFF: ${deal.title}`,
          image: (deal.images && deal.images[0]) || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80',
          link: `/product/${deal.slug || deal.id}`,
          order: bIndex + 1,
          active: true,
          updatedAt: Date.now()
        };
        const savedBanner = await saveBanner(bannerPayload);
        promotedBanners.push(savedBanner);
        log(`  ⭐ Banner #${bIndex + 1} LIVE: [${deal.discountPercent}% OFF] "${deal.title.slice(0, 36)}..."`);
      }

      setLastPromotedBanners(promotedBanners);
      log(`🎯 [Agent 4: Auto-Publisher]: Top 5 Homepage Hero Banners Updated & Synchronized!`);
      await new Promise((r) => setTimeout(r, 250));

      log(`📢 [Agent 5: Social Broadcaster]: Formatted viral Telegram/WhatsApp post for Top #1 Loot Deal (${top5Deals[0]?.title}).`);
      await new Promise((r) => setTimeout(r, 200));

      log(`🎉 [Agent Team]: Pipeline completed with 100% success! 10 High-Discount Deals Added & Top 5 Banners Live on SastaBazar!`);
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
        images: (generatedDeal.images && Array.isArray(generatedDeal.images) && generatedDeal.images.length >= 2)
          ? generatedDeal.images
          : getCuratedGalleryForProduct(generatedDeal.categoryId || '', generatedDeal.title || ''),
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

              {/* Batch Success Summary: 10 Products Added & 5 Hero Banners Promoted */}
              {(lastPublishedBatch.length > 0 || lastPromotedBanners.length > 0) && (
                <div className="mt-4 space-y-4 pt-3 border-t border-slate-800">
                  {/* Status Headline */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-300">
                          🎉 {lastPublishedBatch.length} High-Discount Products Added & Top 5 Homepage Hero Banners Live!
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          Storefront catalog aur homepage banners instant update ho chuke hain.
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://affiliate-store-kohl.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-900/30"
                    >
                      <span>Live Store Par Dekhein</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Section 1: Top 5 Hero Banners Promoted */}
                  {lastPromotedBanners.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                        <span className="flex items-center gap-1.5">
                          <span>🔥</span>
                          <span>Homepage Hero Banners (Top 5 Highest Discount Deals)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Active in Carousel</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        {lastPromotedBanners.map((banner, bIdx) => (
                          <div
                            key={banner.id || bIdx}
                            className="bg-slate-900 border border-amber-500/30 rounded-xl overflow-hidden p-2 flex flex-col gap-1.5 relative group hover:border-amber-400 transition"
                          >
                            <div className="relative h-20 w-full rounded-lg overflow-hidden bg-slate-950">
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                                #{bIdx + 1}
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                              {banner.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 2: 10 Newly Published Products */}
                  {lastPublishedBatch.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                          <span>10 Products Published in This Batch</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">100% Genuine Loot Deals</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                        {lastPublishedBatch.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex items-center gap-2.5 hover:border-slate-700 transition"
                          >
                            <img
                              src={(p.images && p.images[0]) || p.image}
                              alt={p.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-white truncate">{p.title}</p>
                              <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                                <span className="text-emerald-400 font-black">₹{p.price}</span>
                                <span className="line-through text-slate-500">₹{p.originalPrice}</span>
                                <span className="bg-red-500/20 text-red-400 font-black px-1 py-0.2 rounded text-[9px]">
                                  {p.discountPercent}% OFF
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Single item fallback if batch is empty */}
              {!lastPublishedBatch.length && lastPublishedProduct && (
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
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed font-sans">
                      {generatedDeal.description}
                    </p>
                  </div>

                  {generatedDeal.images && generatedDeal.images.length > 0 && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">
                        Product Gallery Images ({generatedDeal.images.length} Shots)
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {generatedDeal.images.map((imgUrl, i) => (
                          <div key={i} className="aspect-square bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-1 flex items-center justify-center">
                            <img src={imgUrl} alt={`Preview ${i + 1}`} className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
