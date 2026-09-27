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
 */
export async function aiParseProduct(rawInput, availableCategories = []) {
  const catList = availableCategories.map(c => c.id).join(', ') || 'electronics, fashion, appliances, home, beauty';

  const systemPrompt = `You are "SastaAI Catalog Copilot", an expert Indian affiliate e-commerce product manager for "SastaBazar".
Your task is to take any raw input (product name, pasted specs, or affiliate URL) and convert it into a complete, high-converting product listing JSON.

RULES:
1. Output ONLY a valid raw JSON object. Do NOT wrap in markdown codeblocks (no \`\`\`json).
2. JSON must strictly follow this structure:
{
  "title": "Clean, attractive product title with key spec (e.g. boAt Airdopes 141 Bluetooth Earbuds with 42H Playtime)",
  "slug": "kebab-case-slugified-title",
  "categoryId": "one of: [${catList}]",
  "subCategory": "Relevant subcategory (e.g. Audio, Smartphone, Sneakers, Kitchen)",
  "platform": "amazon" | "flipkart" | "myntra" | "ajio" | "boat" | "meesho" | "other",
  "price": 999,
  "originalPrice": 2999,
  "description": "Engaging 2-3 sentence overview highlighting why this deal is unmissable, followed by 3-4 bullet points of top features with emojis.",
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
    ], 0.3, 700);

    // Clean any accidental markdown quotes
    const cleaned = rawReply.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
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
  const systemPrompt = `You are "SastaAI Copywriter" for SastaBazar affiliate deals in India.
Take the product title and rough description and rewrite it into an enticing, high-converting deal description.
Include:
- A punchy 1-line hook why it's worth buying today
- 3 to 4 clear bullet points with emojis highlighting key specifications and benefits
- A short reassurance line about warranty or value for money
Format with clean line breaks. Do not use markdown headers (#).`;

  try {
    const reply = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Product: "${title}"\nCurrent description/notes: "${currentDesc}"` }
    ], 0.7, 500);

    return reply.trim();
  } catch (err) {
    console.error('Enhance description failed:', err);
    return currentDesc || `${title} - Best budget deal with premium build quality and high performance.`;
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
  if (title.length < 5) title = 'Special Deal Product';

  return {
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    categoryId: availableCategories[0]?.id || 'electronics',
    subCategory: 'General',
    platform,
    price,
    originalPrice,
    description: `${title} - Best value for money product on ${platform.toUpperCase()}. Heavy discount available for limited time.`,
    tags: ['featured', 'budget_friendly'],
    affiliateLink
  };
}
