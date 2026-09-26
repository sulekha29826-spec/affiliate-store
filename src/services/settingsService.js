import { ref, get } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

export async function getSiteSettings() {
  if (!isFirebaseConfigured || !database) {
    return seedData.settings || {};
  }

  try {
    const settingsRef = ref(database, 'settings');
    const snapshot = await get(settingsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return seedData.settings || {};
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return seedData.settings || {};
  }
}
