import { ref, get } from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

export async function getCategories() {
  if (!isFirebaseConfigured || !database) {
    return Object.entries(seedData.categories || {})
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  try {
    const categoriesRef = ref(database, 'categories');
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return Object.entries(seedData.categories || {})
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}
