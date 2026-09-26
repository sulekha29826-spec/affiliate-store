import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

/**
 * Normalizes products object from Firebase into an array of active products
 * @param {Object} rawProducts
 * @returns {Array}
 */
function normalizeProducts(rawProducts) {
  if (!rawProducts) return [];
  return Object.entries(rawProducts)
    .map(([id, data]) => ({ id, ...data }))
    .filter((p) => p.status === 'active');
}

/**
 * Fetch all active products
 * @returns {Promise<Array>}
 */
export async function getActiveProducts() {
  if (!isFirebaseConfigured || !database) {
    return normalizeProducts(seedData.products);
  }

  try {
    const productsRef = query(
      ref(database, 'products'),
      orderByChild('status'),
      equalTo('active')
    );
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      return normalizeProducts(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch products from Firebase:', error);
    // Fallback to seed data on connection issue
    return normalizeProducts(seedData.products);
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
 * Get trending products
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getTrendingProducts(limit = 8) {
  const all = await getActiveProducts();
  const trending = all.filter((p) => p.tags && p.tags.includes('trending'));
  return (trending.length > 0 ? trending : all).slice(0, limit);
}

/**
 * Get most clicked products
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getMostClickedProducts(limit = 8) {
  const all = await getActiveProducts();
  return [...all].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, limit);
}
