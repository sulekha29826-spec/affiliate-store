import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

/**
 * Normalizes products object from Firebase into an array of active products sorted newest first
 * @param {Object} rawProducts
 * @returns {Array}
 */
function normalizeProducts(rawProducts) {
  if (!rawProducts) return [];
  return Object.entries(rawProducts)
    .map(([id, data]) => ({ id, ...data }))
    .filter((p) => p.status === 'active')
    .sort((a, b) => {
      // Prioritize newest created products first, then highest discount
      const timeDiff = (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      if (timeDiff !== 0) return timeDiff;
      return (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0);
    });
}

const LOCAL_STORAGE_KEY = 'sastabazar_custom_products';

export function getStoredLocalProducts() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    // Ignore in SSR / environments without storage
  }
  return {};
}

export function saveCustomProductToStorage(product) {
  try {
    const existing = getStoredLocalProducts();
    existing[product.id] = product;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('Error saving product to local storage:', e);
  }
}

/**
 * Fetch all active products
 * @returns {Promise<Array>}
 */
export async function getActiveProducts() {
  const localCustom = getStoredLocalProducts();
  const baseCatalog = { ...seedData.products, ...localCustom };

  if (!isFirebaseConfigured || !database) {
    return normalizeProducts(baseCatalog);
  }

  try {
    const productsRef = query(
      ref(database, 'products'),
      orderByChild('status'),
      equalTo('active')
    );
    const snapshot = await get(productsRef);
    if (snapshot.exists() && snapshot.val()) {
      const fbProducts = normalizeProducts(snapshot.val());
      const map = new Map();
      fbProducts.forEach(p => map.set(p.id, p));
      normalizeProducts(localCustom).forEach(p => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      const merged = Array.from(map.values());
      if (merged.length > 0) return merged;
    }
    return normalizeProducts(baseCatalog);
  } catch (error) {
    console.warn('Failed to fetch products from Firebase (using base catalog):', error.message);
    return normalizeProducts(baseCatalog);
  }
}

/**
 * Fetch single product by id or slug
 * @param {string} idOrSlug
 * @returns {Promise<Object|null>}
 */
export async function getProductByIdOrSlug(idOrSlug) {
  const all = await getActiveProducts();
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

/**
 * Fetch products by category slug/id
 * @param {string} categoryId
 * @returns {Promise<Array>}
 */
export async function getProductsByCategory(categoryId) {
  const all = await getActiveProducts();
  return all.filter(
    (p) => p.categoryId?.toLowerCase() === categoryId?.toLowerCase()
  );
}

/**
 * Get newest high-discount products added by Autonomous Agent
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getLatestLootDeals(limit = 10) {
  const all = await getActiveProducts();
  return [...all]
    .sort((a, b) => (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0))
    .slice(0, limit);
}

/**
 * Get trending products
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getTrendingProducts(limit = 10) {
  const all = await getActiveProducts();
  const trending = all.filter((p) => p.tags && p.tags.includes('trending'));
  return (trending.length > 0 ? trending : all).slice(0, limit);
}

/**
 * Get most clicked products
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getMostClickedProducts(limit = 10) {
  const all = await getActiveProducts();
  return [...all].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, limit);
}
