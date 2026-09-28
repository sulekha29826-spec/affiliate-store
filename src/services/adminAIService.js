const ATRIA_API_KEY = import.meta.env.VITE_ATRIA_API_KEY || 'atr_5hupTz5ZY9UwtjvGVk6qH_W5fYjRULX8';
const ATRIA_API_BASE = import.meta.env.VITE_ATRIA_API_BASE || 'https://api.atria-asi.ai/v1';
const ATRIA_MODEL = import.meta.env.VITE_ATRIA_MODEL || 'Atria-Dawn-Preview';

/**
 * Universal caller for SastaAI Backend LLM
 */
async function callLLM(messages, temperature = 0.5, maxTokens = 800) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${ATRIA_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ATRIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: ATRIA_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn('AI API response status:', response.status, errText);
      throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('LLM API Call Error:', err);
    throw err;
  }
}

/**
 * Parse raw link, product title, or deal notes into a structured catalog product
 * @param {string} rawInput 
 * @param {Array} availableCategories 
 * @returns {Promise<Object>}
/**
 * Curated high-resolution 3-4 multi-image gallery matching eCommerce categories
 */
export function getCuratedGalleryForProduct(category = '', title = '') {
  const text = `${category} ${title}`.toLowerCase();
  if (text.includes('earbud') || text.includes('airdope') || text.includes('headphone') || text.includes('audio') || text.includes('tws') || text.includes('neckband') || text.includes('nord bud')) {
    return [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    ];
  }
  if (text.includes('watch') || text.includes('wearable') || text.includes('band') || text.includes('fit') || text.includes('pulse')) {
    return [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80',
    ];
  }
  if (text.includes('shoe') || text.includes('sneaker') || text.includes('running') || text.includes('footwear') || text.includes('puma')) {
    return [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    ];
  }
  if (text.includes('trimmer') || text.includes('shaver') || text.includes('grooming') || text.includes('philips') || text.includes('beauty')) {
    return [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80',
    ];
  }
  if (text.includes('kettle') || text.includes('kitchen') || text.includes('appliance') || text.includes('cookware') || text.includes('pigeon')) {
    return [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    ];
  }
  if (text.includes('fashion') || text.includes('shirt') || text.includes('t-shirt') || text.includes('cloth') || text.includes('jeans')) {
    return [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    ];
  }
  // Default Electronics / Tech Gadgets
  return [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
  ];
}

/**
 * Parse raw link, product title, or deal notes into a structured catalog product
 * @param {string} rawInput 
 * @param {Array} availableCategories 
 * @returns {Promise<Object>}
 */
export async function aiParseProduct(rawInput, availableCategories = []) {
  const catList = availableCategories.map(c => c.id).join(', ') || 'electronics, fashion, appliances, home, beauty';

  const systemPrompt = `You are "SastaAI Catalog Copilot", an expert Indian affiliate e-commerce product manager for "SastaBazar".
Your task is to take any raw input (product name, pasted specs, or affiliate URL) and convert it into a complete, high-converting product listing JSON with multiple images and structured description.

RULES:
1. Output ONLY a valid raw JSON object. Do NOT wrap in markdown codeblocks (no \`\`\`json).
2. JSON must strictly follow this structure:
{
  "title": "Clean, attractive product title with key spec (e.g. boAt Airdopes 141 ANC Bluetooth Wireless Earbuds with 42H Playtime)",
  "slug": "kebab-case-slugified-title",
  "categoryId": "one of: [${catList}]",
  "subCategory": "Relevant subcategory (e.g. Audio & Headphones, Smart Wearables, Footwear, Kitchen Appliances)",
  "platform": "amazon" | "flipkart" | "myntra" | "ajio" | "boat" | "meesho" | "other",
  "price": 999,
  "originalPrice": 2999,
  "description": "🔥 LOOT DEAL HIGHLIGHT:\n[Punchy hook line]\n\n📋 PRODUCT OVERVIEW:\n[2-3 sentences explaining benefits]\n\n⚡ KEY SPECIFICATIONS & FEATURES:\n• [Emoji] Feature 1\n• [Emoji] Feature 2\n• [Emoji] Feature 3\n• [Emoji] Feature 4\n\n🛡️ BRAND WARRANTY & TRUST:\n100% Original Brand Certified Product with 1 Year Official Brand Warranty.",
  "images": [
    "High quality product image URL 1",
    "High quality product image URL 2",
    "High quality product image URL 3",
    "High quality product image URL 4"
  ],
  "tags": ["featured", "hot", "deal_of_the_day", "budget_friendly"],
  "affiliateLink": "Affiliate URL if detected in the input, otherwise leave empty"
}
3. Estimate realistic Indian Rupee prices and healthy 30-75% discount if prices are not explicitly provided.
4. Categorize accurately.
5. NEVER mention internal AI providers or model names.`;

  try {
    const rawReply = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Extract and generate complete product details for:\n"${rawInput}"` }
    ], 0.3, 800);

    // Clean any accidental markdown quotes
    const cleaned = rawReply.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Ensure 3-4 real high-resolution images are present
    if (!Array.isArray(parsed.images) || parsed.images.length < 2) {
      parsed.images = getCuratedGalleryForProduct(parsed.categoryId || '', parsed.title || '');
    }

    return parsed;
  } catch (err) {
    console.warn('AI Parsing failed, falling back to heuristic parsing:', err);
    return fallbackParse(rawInput, availableCategories);
  }
}

/**
 * Enhance an existing product description into high-converting Hinglish/English deal copy
 */
export async function aiEnhanceDescription(title, currentDesc = '') {
  const systemPrompt = `You are "SastaAI Copywriter" for SastaBazar Indian affiliate eCommerce.
Generate an enticing, highly structured, and authentic deal description for this Indian affiliate product.
Product: "${title}"
Current notes/specs: "${currentDesc}"

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

  try {
    const reply = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Write structured high-converting product description for: "${title}". Current context: "${currentDesc}"` }
    ], 0.6, 600);

    return reply.trim();
  } catch (err) {
    console.error('Enhance description failed:', err);
    return `🔥 LOOT DEAL HIGHLIGHT:
${title} par mil raha hai zabardast discount! Limited-time price drop offer.

📋 PRODUCT OVERVIEW:
Ye product apni category me best-in-class performance aur maximum value deliver karta hai. Daily usage aur premium durability ke liye ideal choice hai.

⚡ KEY SPECIFICATIONS & FEATURES:
• ⚡ Superior Performance & Long-Lasting Reliability
• 💎 Premium Ergonomic Build Quality
• 🚀 Seamless Connectivity & Fast Response
• 🔋 All-Day Battery / Energy Efficient Performance

🛡️ BRAND WARRANTY & TRUST:
100% Original Brand Certified Product with Official 1 Year Warranty & safe merchant delivery.`;
  }
}

/**
 * Generate broadcast post for Telegram / WhatsApp / Instagram
 */
export async function aiGenerateSocialPost(product, channel = 'telegram') {
  const systemPrompt = `You are "SastaAI Deal Broadcast Expert" for Indian Telegram/WhatsApp shopping loot channels.
Create a viral, ready-to-publish deal post for channel: "${channel}".

Format requirements:
- High attention hook (🔥 LOOT DEAL, ⚡ PRICE DROP ALERT)
- Product Name
- ❌ MRP: ₹[originalPrice]
- ✅ Deal Price: ₹[price] ([discountPercent]% OFF)
- 2-3 killer features / reasons to buy
- Direct Buying Link placeholder: [affiliateLink or Storefront URL]
- Urgent CTA ("Stock jaldi khatam ho sakta hai, loot lo!")
- Use plenty of emojis. Keep it concise, energetic, and engaging in Hinglish.`;

  try {
    const userPrompt = `Product:
Title: ${product.title}
Price: ₹${product.price}
MRP: ₹${product.originalPrice}
Discount: ${product.discountPercent || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
Platform: ${product.platform}
Affiliate Link: ${product.affiliateLink || 'https://affiliate-store-kohl.vercel.app'}`;

    const reply = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.7, 500);

    return reply.trim();
  } catch (err) {
    console.error('Generate social post failed:', err);
    const disc = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 50;
    return `🔥 LOOT DEAL ALERT! 🔥\n\n🛍️ ${product.title}\n❌ MRP: ₹${product.originalPrice || 2999}\n✅ Deal Price: ₹${product.price || 999} (${disc}% OFF!)\n\n⚡ Top Value For Money Choice\n🚀 Grab before price increases!\n👉 Buy Now: ${product.affiliateLink || 'https://affiliate-store-kohl.vercel.app'}`;
  }
}

/**
 * Chat with SastaAI Admin Copilot for store strategy & tips
 */
export async function aiAskAdminCopilot(userQuery, history = [], storeSummary = '') {
  const systemPrompt = `You are "SastaAI Admin Copilot", the smart AI advisor for the owner and admins of "SastaBazar".
Your expertise:
- Affiliate marketing in India (Amazon Associates, Flipkart Affiliate, EarnKaro, vCommission)
- Telegram/WhatsApp deal channel monetization
- Product curation, pricing discounts, seasonal sale events (Great Indian Festival, Big Billion Days)
- Conversion optimization and copywriting

Answer in natural, polite Hinglish. Be structured, actionable, and encouraging. Never mention any third-party provider or model names.

${storeSummary ? `=== Current Store Context ===\n${storeSummary}\n=================` : ''}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: userQuery }
    ];

    const reply = await callLLM(messages, 0.7, 700);
    return reply.trim();
  } catch (err) {
    console.error('Admin Copilot error:', err);
    return "Maaf kijiye, abhi AI response generate nahi ho paya. Kripya thodi der baad dobara koshish karein.";
  }
}

/**
 * Heuristic fallback parser if offline or API limit
 */
function fallbackParse(input, availableCategories = []) {
  const cleanInput = input.trim();
  let platform = 'amazon';
  const lower = cleanInput.toLowerCase();

  if (lower.includes('flipkart')) platform = 'flipkart';
  else if (lower.includes('myntra')) platform = 'myntra';
  else if (lower.includes('ajio')) platform = 'ajio';
  else if (lower.includes('boat')) platform = 'boat';
  else if (lower.includes('meesho')) platform = 'meesho';

  // Extract possible numbers for price
  const priceMatches = cleanInput.match(/(?:₹|rs\.?|inr)?\s*([0-9]{2,6})/gi);
  let price = 999;
  let originalPrice = 2499;
  if (priceMatches && priceMatches.length > 0) {
    const numbers = priceMatches.map(m => parseInt(m.replace(/\D/g, ''), 10)).filter(n => n > 50);
    if (numbers.length >= 2) {
      numbers.sort((a, b) => a - b);
      price = numbers[0];
      originalPrice = numbers[numbers.length - 1];
    } else if (numbers.length === 1) {
      price = numbers[0];
      originalPrice = Math.round(price * 1.8);
    }
  }

  // Detect URL
  const urlMatch = cleanInput.match(/https?:\/\/[^\s]+/i);
  const affiliateLink = urlMatch ? urlMatch[0] : '';

  // Clean title
  let title = cleanInput.replace(/https?:\/\/[^\s]+/gi, '').replace(/\b(?:amazon|flipkart|myntra|ajio|deal|loot|off|₹|\d+%)\b/gi, '').trim();
  const cat = availableCategories[0]?.id || 'electronics';
  return {
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    categoryId: cat,
    subCategory: 'General',
    platform,
    price,
    originalPrice,
    description: `🔥 LOOT DEAL HIGHLIGHT:
${title} par mil raha hai zabardast discount! Limited-time price drop offer.

📋 PRODUCT OVERVIEW:
Ye product apni category me top-tier rating aur best value-for-money deliver karta hai. Daily usage aur premium durability ke liye ideal choice hai.

⚡ KEY SPECIFICATIONS & FEATURES:
• ⚡ High Performance & Class-Leading Efficiency
• 💎 Premium Build Quality with Ergonomic Design
• 🚀 Instant Connectivity & Ultra-Low Latency
• 🔋 Long-Lasting Battery & Rapid Charging Support

🛡️ BRAND WARRANTY & TRUST:
100% Original Brand Certified Product with Official 1 Year Warranty & safe merchant delivery.`,
    images: getCuratedGalleryForProduct(cat, title),
    tags: ['featured', 'budget_friendly', 'hot'],
    affiliateLink
  };
}
