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

    const systemPrompt = `You are "SastaAI", a smart, energetic, and highly knowledgeable Indian shopping assistant for the deal-discovery platform "SastaBazar".

Your mission:
1. Help users find the best value-for-money deals, gadget recommendations, fashion picks, and budget life hacks.
2. Reply in natural, conversational Hinglish (Hindi + English) with polite enthusiasm and emojis.
3. Recommend 1 to 3 relevant products from the SastaBazar Live Catalog below whenever possible.
4. For each recommendation, highlight the key reason to buy (price drop, performance, budget fit).
5. At the very end of your response, ALWAYS include a hidden tag with the exact IDs of the products you recommended in this format:
<!--RECOMMENDED:[id1,id2]-->
6. NEVER mention any underlying AI provider, company, or model name (such as Atria, ASI, etc.). You are strictly, solely, and proudly "SastaAI", built exclusively for SastaBazar.
If no catalog product matches, answer helpfully with general buying advice and suggest the closest alternative.

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
  const q = userQuery.toLowerCase();

  const matched = catalog.filter((p) => {
    const title = p.title?.toLowerCase() || '';
    const cat = p.categoryId?.toLowerCase() || '';
    return title.includes(q) || cat.includes(q) || q.split(' ').some((w) => w.length > 3 && title.includes(w));
  }).slice(0, 2);

  if (matched.length > 0) {
    return {
      reply: `Bhai, aapke liye SastaBazar par yeh top deals mili hain! Inme abhi zabardast discount chal raha hai:`,
      products: matched,
    };
  }

  return {
    reply: `Namaste! Main SastaAI hoon. Main aapke liye best electronics, fashion aur budget deals dhundh sakta hoon. Aap kis category ya budget me deal dekhna chahte hain? (Jaise: "Earbuds under ₹2000" ya "Best smartwatch deals")`,
    products: catalog.slice(0, 2),
  };
}
