import { ref, get } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

export async function getActiveBanners() {
  if (!isFirebaseConfigured || !database) {
    return Object.entries(seedData.banners || {})
      .map(([id, data]) => ({ id, ...data }))
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  try {
    const bannersRef = ref(database, 'banners');
    const snapshot = await get(bannersRef);
    if (snapshot.exists() && snapshot.val()) {
      const bans = Object.entries(snapshot.val())
        .map(([id, data]) => ({ id, ...data }))
        .filter((b) => b.active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      if (bans.length > 0) return bans;
    }
    return Object.entries(seedData.banners || {})
      .map(([id, data]) => ({ id, ...data }))
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return Object.entries(seedData.banners || {})
      .map(([id, data]) => ({ id, ...data }))
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}
