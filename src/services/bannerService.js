import { ref, get } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

const LOCAL_STORAGE_BANNERS_KEY = 'sastabazar_custom_banners';

function getStoredLocalBanners() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(LOCAL_STORAGE_BANNERS_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    // Ignore in SSR
  }
  return {};
}

export async function getActiveBanners() {
  const localBans = getStoredLocalBanners();
  const baseBans = Object.keys(localBans).length > 0 ? localBans : (seedData.banners || {});

  if (!isFirebaseConfigured || !database) {
    return Object.entries(baseBans)
      .map(([id, data]) => ({ id, ...data }))
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  try {
    const bannersRef = ref(database, 'banners');
    const snapshot = await get(bannersRef);
    if (snapshot.exists() && snapshot.val()) {
      const fbBanners = Object.entries(snapshot.val())
        .map(([id, data]) => ({ id, ...data }))
        .filter((b) => b.active);
      if (fbBanners.length > 0) {
        return fbBanners.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    return Object.entries(baseBans)
      .map(([id, data]) => ({ id, ...data }))
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Failed to fetch banners from Firebase (using base banners):', error.message);
    return Object.entries(baseBans)
      .map(([id, data]) => ({ id, ...data }))
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}
