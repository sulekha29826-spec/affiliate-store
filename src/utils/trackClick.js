import { logClickToFirebase } from '../services/clickService';

/**
 * Executes a non-blocking affiliate redirect while logging the click asynchronously.
 * Guarantees the user is redirected immediately without waiting for Firebase.
 *
 * @param {string} productId
 * @param {string} platform
 * @param {string} affiliateLink
 */
export function trackAndRedirect(productId, platform, affiliateLink) {
  if (!affiliateLink) {
    console.warn(`No affiliate link provided for product: ${productId}`);
    return;
  }

  // 1. Immediately open affiliate link in new tab (highest UX priority)
  try {
    const win = window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    if (!win) {
      // If popup blocker intervened, fallback to top-level navigation
      window.location.href = affiliateLink;
    }
  } catch (err) {
    console.error('Error redirecting to affiliate link:', err);
    window.location.href = affiliateLink;
  }

  // 2. Fire-and-forget asynchronous click logging
  try {
    logClickToFirebase(productId, platform).catch((err) => {
      // Catch silently so UI never throws or blocks
      console.warn('Failed to record click in Firebase:', err);
    });
  } catch (e) {
    console.warn('Background click tracking error:', e);
  }
}
