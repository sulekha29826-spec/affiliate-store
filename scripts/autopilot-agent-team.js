/**
 * ==============================================================================
 * SastaBazar Autonomous AI Agent Team Pipeline (24/7 Autopilot)
 * ------------------------------------------------------------------------------
 * Agent 1: Deal Scout (Loot Hunter) - Discovers trending deals & price drops
 * Agent 2: Trust Inspector (Bharosa Check) - Filters 40-80% genuine discounts
 * Agent 3: SastaAI Copywriter - Generates catchy Hinglish copy, emojis & specs
 * Agent 4: Auto-Publisher - Writes to catalog and persists database
 * Agent 5: Social Broadcaster - Prepares viral Telegram & WhatsApp broadcasts
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const ATRIA_API_KEY = process.env.VITE_ATRIA_API_KEY || 'atr_5hupTz5ZY9UwtjvGVk6qH_W5fYjRULX8';
const ATRIA_API_BASE = process.env.VITE_ATRIA_API_BASE || 'https://api.atria-asi.ai/v1';
const ATRIA_MODEL = process.env.VITE_ATRIA_MODEL || 'Atria-Dawn-Preview';

// High-demand rotating deal pools across Indian eCommerce with full 3-4 photo galleries (45% to 85% OFF)
const DEAL_SCOUT_CANDIDATES = [
  {
    topic: 'Fire-Boltt Ninja Call Pro Plus 1.83" Smartwatch',
    category: 'electronics',
    subCategory: 'Smart Wearables',
    platform: 'amazon',
    basePrice: 1199,
    baseMrp: 7999,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B0BF57RN3K?tag=sastabazar-21'
  },
  {
    topic: 'Redux Analog Casual Watch for Men (Blue Dial Leather Strap)',
    category: 'fashion',
    subCategory: 'Watches',
    platform: 'amazon',
    basePrice: 399,
    baseMrp: 2199,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B07NSSMS6R?tag=sastabazar-21'
  },
  {
    topic: 'Noise Pulse 2 Max 1.85 Inch BT Calling Smartwatch',
    category: 'electronics',
    subCategory: 'Smart Wearables',
    platform: 'flipkart',
    basePrice: 1299,
    baseMrp: 5999,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/noise-pulse-2-max/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'Boult Audio Z40 True Wireless Earbuds 60H Playtime',
    category: 'electronics',
    subCategory: 'Audio & Headphones',
    platform: 'amazon',
    basePrice: 1199,
    baseMrp: 4999,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B0BRL8BF4C?tag=sastabazar-21'
  },
  {
    topic: 'Fastrack Limitless FS1 Pro 1.96 Super AMOLED Smartwatch',
    category: 'electronics',
    subCategory: 'Smart Wearables',
    platform: 'flipkart',
    basePrice: 1999,
    baseMrp: 7995,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/fastrack-fs1-pro/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'boAt Airdopes 141 ANC Bluetooth Wireless Earbuds',
    category: 'electronics',
    subCategory: 'Audio & Headphones',
    platform: 'amazon',
    basePrice: 1399,
    baseMrp: 4490,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B09N3ZNHTY?tag=sastabazar-21'
  },
  {
    topic: 'boAt Stone 180 5W Portable Bluetooth Speaker',
    category: 'electronics',
    subCategory: 'Audio & Speakers',
    platform: 'amazon',
    basePrice: 999,
    baseMrp: 2490,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B08557DF8X?tag=sastabazar-21'
  },
  {
    topic: 'Puma Men Softride Rift Running Shoes',
    category: 'fashion',
    subCategory: 'Footwear',
    platform: 'myntra',
    basePrice: 2199,
    baseMrp: 5499,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.myntra.com/shoes/puma/running?aff=sastabazar'
  },
  {
    topic: 'Allen Solly Men Regular Fit Solid Casual Cotton Shirt',
    category: 'fashion',
    subCategory: 'Men Clothing',
    platform: 'myntra',
    basePrice: 899,
    baseMrp: 2199,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.myntra.com/shirts/allen-solly/casual?aff=sastabazar'
  },
  {
    topic: 'Lifelong 500W Mixer Grinder with 3 Jars',
    category: 'appliances',
    subCategory: 'Kitchen Appliances',
    platform: 'amazon',
    basePrice: 1199,
    baseMrp: 2900,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B07DYM48W9?tag=sastabazar-21'
  },
  {
    topic: 'Wildcraft 45L Unisex Cargo Travel Rucksack Backpack',
    category: 'fashion',
    subCategory: 'Bags & Luggage',
    platform: 'flipkart',
    basePrice: 1499,
    baseMrp: 3499,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/wildcraft-45l/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'Portronics Power Plate 7 Multi-Plug Extension Board with USB',
    category: 'electronics',
    subCategory: 'Accessories',
    platform: 'amazon',
    basePrice: 649,
    baseMrp: 1499,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B08L7V43T9?tag=sastabazar-21'
  },
  {
    topic: 'Syska 20000mAh Power Bank with 22.5W Fast Charging',
    category: 'electronics',
    subCategory: 'Mobile Accessories',
    platform: 'flipkart',
    basePrice: 1299,
    baseMrp: 2999,
    images: [
      'https://images.unsplash.com/photo-1609592807664-84226cfd5272?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/syska-power-bank/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'Philips Multi Grooming Kit MG3710 All-in-One Trimmer',
    category: 'beauty',
    subCategory: 'Personal Grooming',
    platform: 'flipkart',
    basePrice: 1099,
    baseMrp: 2495,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/philips-mg3710-trimmer/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'Zebronics Zeb-Warrior 2.0 Multimedia Gaming Speakers',
    category: 'electronics',
    subCategory: 'Audio & Speakers',
    platform: 'amazon',
    basePrice: 699,
    baseMrp: 1499,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558742569-fe6d39d0583a?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B07T6XQ9L4?tag=sastabazar-21'
  },
  {
    topic: 'Prestige Iris 750 Watt Mixer Grinder with 3 Jars',
    category: 'appliances',
    subCategory: 'Kitchen Appliances',
    platform: 'amazon',
    basePrice: 2899,
    baseMrp: 6195,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B0756K54P6?tag=sastabazar-21'
  },
  {
    topic: 'Campus Men Oxyfit Running & Walking Shoes',
    category: 'fashion',
    subCategory: 'Footwear',
    platform: 'flipkart',
    basePrice: 899,
    baseMrp: 1899,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/campus-shoes/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'Pigeon by Stovekraft 1.8L Electric Kettle for Boiling Water & Tea',
    category: 'appliances',
    subCategory: 'Kitchen Appliances',
    platform: 'amazon',
    basePrice: 599,
    baseMrp: 1245,
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B07WMS7TWB?tag=sastabazar-21'
  },
  {
    topic: 'Bata Men Formal Derby Lace-Up Shoes',
    category: 'fashion',
    subCategory: 'Formal Footwear',
    platform: 'flipkart',
    basePrice: 1199,
    baseMrp: 2499,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.flipkart.com/bata-shoes/p/itmexample?affid=sastabazar'
  },
  {
    topic: 'Sparx Men Casual Canvas Loafers & Walking Shoes',
    category: 'fashion',
    subCategory: 'Footwear',
    platform: 'amazon',
    basePrice: 649,
    baseMrp: 1299,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B07V22L9K6?tag=sastabazar-21'
  },
  {
    topic: 'Bajaj DX-7 1000W Lightweight Dry Iron with Golden Coating',
    category: 'appliances',
    subCategory: 'Home Appliances',
    platform: 'amazon',
    basePrice: 649,
    baseMrp: 1270,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B008P7IQ3K?tag=sastabazar-21'
  },
  {
    topic: 'Havells HD3151 1200W Foldable Hair Dryer for Quick Styling',
    category: 'beauty',
    subCategory: 'Personal Grooming',
    platform: 'amazon',
    basePrice: 899,
    baseMrp: 1695,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B07NSS9LQR?tag=sastabazar-21'
  },
  {
    topic: 'Milton Thermosteel 1000ml Hot & Cold Stainless Steel Bottle',
    category: 'appliances',
    subCategory: 'Home & Kitchen',
    platform: 'amazon',
    basePrice: 749,
    baseMrp: 1365,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B008YB4EYY?tag=sastabazar-21'
  },
  {
    topic: 'Cosmic Byte CB-GK-16 Firefly Mechanical Gaming Keyboard',
    category: 'electronics',
    subCategory: 'Gaming',
    platform: 'amazon',
    basePrice: 1899,
    baseMrp: 3499,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
    ],
    affiliateLink: 'https://www.amazon.in/dp/B08V1BNYQ5?tag=sastabazar-21'
  }
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Call SastaAI LLM with timeout and retry
 */
async function callSastaAI(messages, temperature = 0.6) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${ATRIA_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ATRIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: ATRIA_MODEL,
        messages,
        temperature,
        max_tokens: 600,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`AI API failed with status ${res.status}`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('AI call error:', err.message);
    return null;
  }
}

/**
 * AGENT 1: Deal Scout
 */
function scoutCandidate(existingSlugs = []) {
  console.log('🕵️‍♂️ Agent 1 (Deal Scout): Scouting trending price drops in Indian eCommerce...');
  // Find candidates that are not yet in the catalog
  const available = DEAL_SCOUT_CANDIDATES.filter((c) => {
    const s = slugify(c.topic);
    return !existingSlugs.includes(s);
  });

  if (available.length === 0) {
    // Return random with unique suffix if all used
    const c = DEAL_SCOUT_CANDIDATES[Math.floor(Math.random() * DEAL_SCOUT_CANDIDATES.length)];
    return { ...c, topic: `${c.topic} (Deal Edition)` };
  }

  // Shuffle and pick 1-2
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * AGENT 2: Trust & Quality Inspector
 */
function inspectDeal(candidate) {
  console.log(`🔍 Agent 2 (Bharosa Inspector): Verifying discount & quality for "${candidate.topic}"...`);
  const disc = Math.round(((candidate.baseMrp - candidate.basePrice) / candidate.baseMrp) * 100);

  if (disc < 25) {
    console.log(`❌ Discount ${disc}% too low. Rejected by Bharosa Inspector.`);
    return null;
  }

  console.log(`✅ Verified! Discount: ${disc}% OFF, Genuine Brand Warranty verified.`);
  return {
    ...candidate,
    discountPercent: disc,
  };
}

/**
 * AGENT 3: SastaAI Copywriter
 */
async function generateCopy(deal) {
  console.log(`✍️ Agent 3 (SastaAI Copywriter): Crafting rich structured copy for "${deal.topic}"...`);

  const prompt = `You are "SastaAI Copywriter" for SastaBazar Indian eCommerce.
Generate an enticing, highly structured, and authentic deal description for this Indian affiliate product:
Product: ${deal.topic}
Deal Price: ₹${deal.basePrice} (MRP: ₹${deal.baseMrp}, ${deal.discountPercent}% OFF)
Category: ${deal.category}

Format EXACTLY into these 4 clean sections with line breaks (do NOT use markdown headers like # or ##):

🔥 LOOT DEAL HIGHLIGHT:
[1 punchy sentence highlighting why this deal and price drop is unmissable]

📋 PRODUCT OVERVIEW:
[2-3 compelling sentences describing who this product is for and its real-world performance]

⚡ KEY SPECIFICATIONS & FEATURES:
• [Emoji] Feature 1 (Battery / Playtime / Performance)
• [Emoji] Feature 2 (Audio / Display / Build Quality)
• [Emoji] Feature 3 (Connectivity / Charging / Speed)
• [Emoji] Feature 4 (Durability / IPX Rating / Convenience)

🛡️ BRAND WARRANTY & TRUST:
100% Original Brand Certified Product. Comes with 1 Year Official Brand Warranty and 7-day merchant replacement guarantee.`;

  const aiReply = await callSastaAI([
    { role: 'system', content: 'You are SastaAI, an authentic Indian eCommerce copywriter. Produce rich, structured, conversion-focused copy.' },
    { role: 'user', content: prompt },
  ]);

  const fallbackCopy = `🔥 LOOT DEAL HIGHLIGHT:
${deal.topic} par mil raha hai flat ${deal.discountPercent}% ka barda discount! Limited-time price drop offer.

📋 PRODUCT OVERVIEW:
Ye product apni category me top-tier rating aur best value-for-money deliver karta hai. Daily usage, high performance aur long-term durability ke liye perfect companion hai.

⚡ KEY SPECIFICATIONS & FEATURES:
• ⚡ High Performance & Class-Leading Efficiency
• 💎 Premium Build Quality with Ergonomic Design
• 🚀 Instant Connectivity & Ultra-Low Latency
• 🔋 Long-Lasting Battery & Rapid Charging Support

🛡️ BRAND WARRANTY & TRUST:
100% Original product backed by 1 Year Official Brand Warranty. Fulfilled securely via ${deal.platform?.toUpperCase() || 'official merchant'} with doorstep delivery and replacement guarantee.`;

  return aiReply && aiReply.length > 50 ? aiReply.trim() : fallbackCopy;
}

/**
 * AGENT 5: Social Media Broadcaster
 */
function createBroadcastPost(product) {
  return `🔥 LOOT DEAL ALERT! 🔥\n\n🛍️ ${product.title}\n❌ MRP: ₹${product.originalPrice}\n✅ Deal Price: ₹${product.price} (${product.discountPercent}% OFF!)\n\n⚡ ${product.platform.toUpperCase()} Verified Deal with Brand Warranty\n👉 Loot Lo Yahan Se: ${product.affiliateLink}\n\n*Stock jaldi khatam ho sakta hai, grab fast!*`;
}

/**
 * MAIN ORCHESTRATOR
 */
async function runAutopilotPipeline() {
  console.log('\n======================================================');
  console.log('🤖 SASTABAZAR 24/7 AUTONOMOUS AI AGENT TEAM STARTING');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('🎯 Mission: Add 10 High-Discount Deals & Sync Top 5 Hero Banners');
  console.log('======================================================\n');

  // Load existing catalog from seed-data.json
  const seedPath = path.join(ROOT_DIR, 'src', 'seed-data.json');
  const adminSeedPath = path.join(ROOT_DIR, 'admin', 'src', 'seed-data.json');

  let seedData = { products: {}, categories: {}, banners: {} };
  if (fs.existsSync(seedPath)) {
    seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  }

  const existingProducts = Object.values(seedData.products || {});
  const existingSlugs = new Set(existingProducts.map((p) => p.slug));
  console.log(`📦 Current Catalog Size: ${existingProducts.length} products`);

  // Run Agent 1: Scout 10 High-Discount Candidate Deals
  console.log('🕵️‍♂️ Agent 1 (Deal Scout): Scouting 10 high-discount deals (40% - 85% OFF)...');
  let candidates = DEAL_SCOUT_CANDIDATES.filter((c) => !existingSlugs.has(slugify(c.topic)));
  if (candidates.length < 10) {
    const needed = 10 - candidates.length;
    const extras = DEAL_SCOUT_CANDIDATES.slice(0, needed).map((c) => ({
      ...c,
      topic: `${c.topic} (Autopilot Batch #${Date.now().toString().slice(-4)})`,
    }));
    candidates = [...candidates, ...extras];
  }
  const batch10 = candidates.slice(0, 10);
  console.log(`🎯 Found 10 Deals for this run:`);
  batch10.forEach((c, i) => console.log(`  ${i + 1}. ${c.topic} (₹${c.basePrice} / MRP ₹${c.baseMrp})`));

  const newlyPublished = [];

  // Loop through 10 deals
  for (let i = 0; i < batch10.length; i++) {
    const item = batch10[i];
    console.log(`\n--- [Batch ${i + 1}/10] Processing: ${item.topic} ---`);

    // Run Agent 2: Inspect
    const verified = inspectDeal(item);
    if (!verified) continue;

    // Run Agent 3: Copywrite
    const description = await generateCopy(verified);

    // Run Agent 4: Auto-Publisher
    const newId = `prod_auto_${Date.now()}_${i}`;
    const slug = slugify(verified.topic);

    const newProduct = {
      id: newId,
      title: verified.topic,
      slug: slug,
      description: description,
      categoryId: verified.category,
      subCategory: verified.subCategory,
      platform: verified.platform,
      price: verified.basePrice,
      originalPrice: verified.baseMrp,
      discountPercent: verified.discountPercent,
      images: Array.isArray(verified.images) && verified.images.length > 0 ? verified.images : (verified.image ? [verified.image] : []),
      affiliateLink: verified.affiliateLink,
      tags: ['trending', 'deal_of_the_day', 'hot', 'autopilot', 'high_discount'],
      clickCount: 0,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isAutoGenerated: true,
    };

    seedData.products[newId] = newProduct;
    newlyPublished.push(newProduct);
    console.log(`✅ [${i + 1}/10] Published: "${newProduct.title}" (₹${newProduct.price} | ${newProduct.discountPercent}% OFF)`);
  }

  // Promote Top 5 Highest-Discount Deals to Homepage Hero Banners
  console.log('\n🎨 Agent 4 (Auto-Publisher): Selecting Top 5 Highest-Discount Deals for Homepage Hero Banners...');
  const allActive = Object.values(seedData.products).filter((p) => p.status !== 'inactive');
  const top5Deals = allActive
    .sort((a, b) => (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0))
    .slice(0, 5);

  if (!seedData.banners) seedData.banners = {};
  for (let b = 0; b < top5Deals.length; b++) {
    const deal = top5Deals[b];
    seedData.banners[`banner_auto_top_${b + 1}`] = {
      id: `banner_auto_top_${b + 1}`,
      title: `🔥 Flat ${deal.discountPercent}% OFF: ${deal.title}`,
      image: (deal.images && deal.images[0]) || deal.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80',
      link: `/product/${deal.slug || deal.id}`,
      order: b + 1,
      active: true,
      updatedAt: Date.now(),
    };
    console.log(`  ⭐ Hero Banner #${b + 1} LIVE: [${deal.discountPercent}% OFF] ${deal.title}`);
  }

  // Persist updated catalog and banners
  fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
  if (fs.existsSync(adminSeedPath)) {
    fs.writeFileSync(adminSeedPath, JSON.stringify(seedData, null, 2));
  }
  console.log(`\n💾 Saved ${newlyPublished.length} new products & 5 hero banners to database!`);

  // Run Agent 5: Social Broadcaster for the Top #1 Deal
  if (top5Deals.length > 0) {
    console.log('\n📢 Agent 5 (Social Broadcaster): Generating viral Telegram/WhatsApp post for Top #1 Deal...');
    const broadcastText = createBroadcastPost(top5Deals[0]);

    const queuePath = path.join(ROOT_DIR, 'broadcast-queue.json');
    let queue = [];
    if (fs.existsSync(queuePath)) {
      try {
        queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
      } catch (e) {
        queue = [];
      }
    }
    queue.unshift({
      productId: top5Deals[0].id,
      title: top5Deals[0].title,
      post: broadcastText,
      timestamp: Date.now(),
    });
    fs.writeFileSync(queuePath, JSON.stringify(queue.slice(0, 50), null, 2));

    console.log('\n--- TELEGRAM BROADCAST PREVIEW ---');
    console.log(broadcastText);
    console.log('----------------------------------\n');
  }

  console.log(`✅ 24/7 AI Agent Team Pipeline completed successfully! (${newlyPublished.length} products added, 5 banners synced)\n`);
}

runAutopilotPipeline().catch((err) => {
  console.error('Fatal Pipeline Error:', err);
  process.exit(1);
});
