import { ref, push, runTransaction, serverTimestamp } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

/**
 * Logs an outbound click event asynchronously to Firebase RTDB.
 * Writes to /clicks/{productId}/{pushId} and increments /products/{productId}/clickCount.
 *
 * @param {string} productId
 * @param {string} platform
 * @returns {Promise<void>}
 */
export async function logClickToFirebase(productId, platform = 'unknown') {
  if (!productId) return;

  if (!isFirebaseConfigured || !database) {
    // In demo/seed mode, update local in-memory seed data
    if (seedData.products && seedData.products[productId]) {
      seedData.products[productId].clickCount = (seedData.products[productId].clickCount || 0) + 1;
    }
    console.info(`[Demo Mode Click Tracked]: Product ${productId}, Platform ${platform}`);
    return;
  }

  try {
    // 1. Log click record
    const clickRef = ref(database, `clicks/${productId}`);
    await push(clickRef, {
      timestamp: serverTimestamp(),
      platform: platform.toLowerCase(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });

    // 2. Increment product clickCount counter atomically
    const productClickCountRef = ref(database, `products/${productId}/clickCount`);
    await runTransaction(productClickCountRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });
  } catch (error) {
    // Log to console without throwing to caller
    console.warn(`Click log failed for product ${productId}:`, error);
  }
}
