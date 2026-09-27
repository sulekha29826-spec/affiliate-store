import { getActiveProducts } from './productService';

const ATRIA_API_KEY = import.meta.env.VITE_ATRIA_API_KEY || 'atr_5hupTz5ZY9UwtjvGVk6qH_W5fYjRULX8';
const ATRIA_API_BASE = import.meta.env.VITE_ATRIA_API_BASE || 'https://api.atria-asi.ai/v1';
const ATRIA_MODEL = import.meta.env.VITE_ATRIA_MODEL || 'Atria-Dawn-Preview';

/**
 * Clean catalog summary to pass as context without blowing up tokens
 */
function buildCatalogContext(products = []) {
  if (!products || products.length === 0) return 'No products currently listed.';
  
  return products.slice(0, 25).map((p) => {
    return `- ID: "${p.id || p.slug}", Title: "${p.title}", Price: ₹${p.price}, OriginalPrice: ₹${p.originalPrice || p.price}, Discount: ${p.discountPercent || 0}%, Platform: "${p.platform}", Category: "${p.categoryId}"`;
  }).join('\n');
}

/**
 * Ask SastaAI shopping assistant using Atria-ASI Dawn Preview model
 * @param {string} userQuery
 * @param {Array} history - Previous messages [{ role: 'user'|'assistant', content: string }]
 * @returns {Promise<{ reply: string, products: Array }>}
 */
export async function askSastaAI(userQuery, history = []) {
  try {
    const catalog = await getActiveProducts();
    const catalogContext = buildCatalogContext(catalog);

    const systemPrompt = `You are "SastaAI", a trusted, warm, fiercely honest, and street-smart Indian shopping advisor & savings companion for the platform "SastaBazar".

YOUR #1 MISSION: WIN THE USER'S TRUST & CONFIDENCE (BHAROSA).
In India, shoppers are rightfully suspicious of online scam deals, fake products, and duplicate items. 
Your goal is to be their trustworthy, knowledgeable friend who genuinely protects their hard-earned money and guides them to 100% genuine, paisa-vasool deals.

COMMUNICATION STYLE & PERSONA:
1. Warm, Honest & Relatable Hinglish:
   - Talk like a caring, knowledgeable tech/deal guru friend or elder brother ("Bhai / Dost").
   - Use natural conversational Hinglish phrases: "Bhai tension mat lo", "Paisa vasool deal hai", "Aapka ek rupya bhi faltu kharch nahi hone dunga", "Befikar raho, brand warranty ke saath hai".
   - Keep answers punchy, well-spaced, with friendly emojis. Avoid robotic bullet spam.
2. Safety & Trust Anchor (CRITICAL RULE):
   - If user asks if SastaBazar is safe, real, fake, or fraud:
     Explain with pride and complete clarity:
     "Bhai, 100% befikar raho! 🛡️ SastaBazar aapse koi direct payment ya bank details nahi leta. Hum sirf verified discount deals dhoondhte hain. Jab aap 'Loot Lo / Grab Deal' dabate ho, toh seedha Official Amazon, Flipkart, ya Myntra ka verified store page khulta hai. Saari payment, delivery, Original Brand Warranty, aur 7-10 Days Easy Return Guarantee unhi ke official platform se hoti hai. Aapka risk = ZERO!"
3. Genuine Buying Advice (Real Pros & Honest Tips):
   - Don't just blindly push products. Give honest guidance: battery backup, sound quality, build, and why the deal price is a real steal.
4. Recommendations:
   - Recommend 1 to 3 relevant products from the SastaBazar Live Catalog below whenever possible.
   - For each recommended product, give a short 1-line reason why it's a solid choice.
   - At the very end of your response, ALWAYS include this hidden tag with the exact IDs of the products you recommended:
<!--RECOMMENDED:[id1,id2]-->
   If no catalog product matches, answer helpfully with general buying advice and suggest the closest alternative.
5. Strict White-Label:
   - NEVER mention any backend provider, company, or model name (such as Atria, ASI, OpenAI, etc.). You are strictly, solely, and proudly "SastaAI", built exclusively by SastaBazar.

=== SASTABAZAR LIVE CATALOG ===
${catalogContext}
==============================`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: userQuery },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

    const response = await fetch(`${ATRIA_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ATRIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: ATRIA_MODEL,
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Atria-ASI API error status:', response.status, errText);
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || '';

    // Extract recommended product IDs from <!--RECOMMENDED:[...]--> tag
    let recommendedIds = [];
    const match = reply.match(/<!--RECOMMENDED:\[(.*?)\]-->/);
    if (match && match[1]) {
      recommendedIds = match[1]
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''))
        .filter(Boolean);
      // Remove tag from user visible reply
      reply = reply.replace(/<!--RECOMMENDED:\[(.*?)\]-->/, '').trim();
    }

    // Match IDs with full catalog products
    let recommendedProducts = [];
    if (recommendedIds.length > 0) {
      recommendedProducts = catalog.filter((p) =>
        recommendedIds.some((id) => p.id === id || p.slug === id)
      );
    }

    // Fallback: If AI didn't output tag or products were empty, find matching products via keyword
    if (recommendedProducts.length === 0) {
      const q = userQuery.toLowerCase();
      recommendedProducts = catalog.filter((p) => {
        const titleMatch = p.title?.toLowerCase().split(' ').some((word) => word.length > 3 && q.includes(word));
        const catMatch = p.categoryId?.toLowerCase() && q.includes(p.categoryId.toLowerCase());
        return titleMatch || catMatch;
      }).slice(0, 2);
    }

    return {
      reply,
      products: recommendedProducts,
    };
  } catch (error) {
    console.error('SastaAI Error:', error);
    // Intelligent offline fallback
    return getOfflineRecommendation(userQuery);
  }
}

/**
 * Graceful fallback if network drops or API is temporarily unreachable
 */
async function getOfflineRecommendation(userQuery) {
  const catalog = await getActiveProducts();
  const q = (userQuery || '').toLowerCase();

  // Instant reassurance for safety, trust, fraud, scam, return, or warranty questions
  if (
    q.includes('safe') ||
    q.includes('trust') ||
    q.includes('fake') ||
    q.includes('fraud') ||
    q.includes('scam') ||
    q.includes('bharosa') ||
    q.includes('bhrosa') ||
    q.includes('asli') ||
    q.includes('original') ||
    q.includes('return') ||
    q.includes('warranty') ||
    q.includes('kyun') ||
    q.includes('kyu') ||
    q.includes('sach')
  ) {
    return {
      reply: `Bhai, 100% befikar raho! 🛡️\n\nSastaBazar aapse koi direct payment ya bank details nahi leta. Humara kaam bas aapke paise bachana aur verified price-drop loot deals dhoondhna hai.\n\nJab aap 'Loot Lo' dabate ho, toh seedha **Official Amazon, Flipkart ya Myntra** ka secure page open hota hai. Saari payment, **100% Original Brand Warranty**, aur **7-10 Days Replacement/Return Guarantee** unhi ke official platform se hoti hai. Aapka risk = bilkul ZERO! 🤝`,
      products: catalog.slice(0, 2),
    };
  }

  const matched = catalog.filter((p) => {
    const title = p.title?.toLowerCase() || '';
    const cat = p.categoryId?.toLowerCase() || '';
    return title.includes(q) || cat.includes(q) || q.split(' ').some((w) => w.length > 3 && title.includes(w));
  }).slice(0, 2);

  if (matched.length > 0) {
    return {
      reply: `Bhai, aapke budget ke mutabiq maine yeh top-rated aur verified deals shortlist ki hain. Inme full brand warranty aur zabardast discount mil raha hai:`,
      products: matched,
    };
  }

  return {
    reply: `Namaste bhai! Main SastaAI hoon—aapka shopping aur savings partner. 🛍️\n\nAap mujhse kisi bhi product, budget (jaise "Earbuds under ₹1500") ya warranty ke baare me pooch sakte hain. Main aapka ek rupya bhi faltu kharch nahi hone dunga!`,
    products: catalog.slice(0, 2),
  };
}
