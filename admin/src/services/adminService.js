import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  serverTimestamp,
} from 'firebase/database';
import { database, isFirebaseConfigured, seedData } from './firebase';

// ==========================================
// LOCAL STORAGE PERSISTENCE HELPERS
// ==========================================
const STORAGE_KEYS = {
  products: 'sastabazar_custom_products',
  categories: 'sastabazar_custom_categories',
  banners: 'sastabazar_custom_banners',
  settings: 'sastabazar_custom_settings',
};

function getLocalStored(key, fallback = {}) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(key);
      if (raw) return { ...fallback, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn(`Local storage read error for ${key}:`, e);
  }
  return { ...fallback };
}

function setLocalStored(key, data) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.warn(`Local storage write error for ${key}:`, e);
  }
}

// In-memory mock states initialized from localStorage + seedData
let localProducts = getLocalStored(STORAGE_KEYS.products, seedData.products);
let localCategories = getLocalStored(STORAGE_KEYS.categories, seedData.categories);
let localBanners = getLocalStored(STORAGE_KEYS.banners, seedData.banners);
let localSettings = getLocalStored(STORAGE_KEYS.settings, seedData.settings);
let localAdmins = { ...seedData.admins };
let localClicks = { ...seedData.clicks };

// ==========================================
// PRODUCTS CRUD
// ==========================================

export async function getAdminProducts() {
  // Refresh latest local storage
  localProducts = getLocalStored(STORAGE_KEYS.products, seedData.products);
  const localList = Object.entries(localProducts).map(([id, data]) => ({ id, ...data }));

  if (!isFirebaseConfigured || !database) {
    return localList;
  }

  try {
    const productsRef = ref(database, 'products');
    const snap = await get(productsRef);
    if (snap.exists() && snap.val()) {
      const fbMap = snap.val();
      const mergedMap = new Map();
      // Add Firebase products first
      Object.entries(fbMap).forEach(([id, data]) => mergedMap.set(id, { id, ...data }));
      // Add local products that may not be synced to Firebase yet
      localList.forEach(p => {
        if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
      });
      return Array.from(mergedMap.values());
    }
    return localList;
  } catch (err) {
    console.warn('getAdminProducts Firebase read notice (using local catalog):', err.message);
    return localList;
  }
}

export async function saveProduct(productData) {
  const isNew = !productData.id;
  const id = productData.id || `prod_${Date.now()}`;
  
  // Calculate discount percentage automatically if not provided
  let discountPercent = productData.discountPercent;
  if (productData.price && productData.originalPrice && productData.originalPrice > productData.price) {
    discountPercent = Math.round(
      ((productData.originalPrice - productData.price) / productData.originalPrice) * 100
    );
  }

  const payload = {
    ...productData,
    id,
    discountPercent: discountPercent || 0,
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice) || 0,
    clickCount: Number(productData.clickCount) || 0,
    status: productData.status || 'active',
    updatedAt: Date.now(),
    createdAt: productData.createdAt || Date.now(),
  };

  // Always update in-memory state and localStorage first
  localProducts[id] = payload;
  setLocalStored(STORAGE_KEYS.products, localProducts);

  if (!isFirebaseConfigured || !database) {
    return payload;
  }

  // Attempt sync to Firebase Realtime Database
  try {
    const productRef = ref(database, `products/${id}`);
    await set(productRef, payload);
  } catch (err) {
    // If Firebase returns PERMISSION_DENIED (e.g. demo login mode or unauthenticated token),
    // we log a soft notice and return payload safely without throwing.
    console.warn('Firebase saveProduct sync notice (saved to local catalog):', err.message);
  }

  return payload;
}

export async function softDeleteProduct(productId) {
  if (localProducts[productId]) {
    localProducts[productId].status = 'inactive';
    localProducts[productId].updatedAt = Date.now();
    setLocalStored(STORAGE_KEYS.products, localProducts);
  }

  if (!isFirebaseConfigured || !database) {
    return true;
  }

  try {
    const productRef = ref(database, `products/${productId}`);
    await update(productRef, {
      status: 'inactive',
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firebase softDelete notice (updated locally):', err.message);
  }

  return true;
}

// ==========================================
// CATEGORIES CRUD
// ==========================================

export async function getAdminCategories() {
  localCategories = getLocalStored(STORAGE_KEYS.categories, seedData.categories);
  const localList = Object.entries(localCategories)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (!isFirebaseConfigured || !database) {
    return localList;
  }

  try {
    const categoriesRef = ref(database, 'categories');
    const snap = await get(categoriesRef);
    if (snap.exists() && snap.val()) {
      return Object.entries(snap.val())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return localList;
  } catch (err) {
    console.warn('getAdminCategories Firebase read notice (using local):', err.message);
    return localList;
  }
}

export async function saveCategory(categoryData) {
  const id = categoryData.id || `cat_${Date.now()}`;
  const payload = {
    ...categoryData,
    id,
    order: Number(categoryData.order) || 1,
  };

  localCategories[id] = payload;
  setLocalStored(STORAGE_KEYS.categories, localCategories);

  if (!isFirebaseConfigured || !database) {
    return payload;
  }

  try {
    const catRef = ref(database, `categories/${id}`);
    await set(catRef, payload);
  } catch (err) {
    console.warn('Firebase saveCategory notice (saved locally):', err.message);
  }

  return payload;
}

export async function deleteCategory(categoryId) {
  delete localCategories[categoryId];
  setLocalStored(STORAGE_KEYS.categories, localCategories);

  if (!isFirebaseConfigured || !database) {
    return true;
  }

  try {
    const catRef = ref(database, `categories/${categoryId}`);
    await remove(catRef);
  } catch (err) {
    console.warn('Firebase deleteCategory notice (removed locally):', err.message);
  }

  return true;
}

// ==========================================
// BANNERS CRUD
// ==========================================

export async function getAdminBanners() {
  localBanners = getLocalStored(STORAGE_KEYS.banners, seedData.banners);
  const localList = Object.entries(localBanners)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (!isFirebaseConfigured || !database) {
    return localList;
  }

  try {
    const bannersRef = ref(database, 'banners');
    const snap = await get(bannersRef);
    if (snap.exists() && snap.val()) {
      return Object.entries(snap.val())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return localList;
  } catch (err) {
    console.warn('getAdminBanners Firebase read notice (using local):', err.message);
    return localList;
  }
}

export async function saveBanner(bannerData) {
  const id = bannerData.id || `banner_${Date.now()}`;
  const payload = {
    ...bannerData,
    id,
    order: Number(bannerData.order) || 1,
    active: bannerData.active !== undefined ? bannerData.active : true,
  };

  localBanners[id] = payload;
  setLocalStored(STORAGE_KEYS.banners, localBanners);

  if (!isFirebaseConfigured || !database) {
    return payload;
  }

  try {
    const bannerRef = ref(database, `banners/${id}`);
    await set(bannerRef, payload);
  } catch (err) {
    console.warn('Firebase saveBanner notice (saved locally):', err.message);
  }

  return payload;
}

export async function deleteBanner(bannerId) {
  delete localBanners[bannerId];
  setLocalStored(STORAGE_KEYS.banners, localBanners);

  if (!isFirebaseConfigured || !database) {
    return true;
  }

  try {
    const bannerRef = ref(database, `banners/${bannerId}`);
    await remove(bannerRef);
  } catch (err) {
    console.warn('Firebase deleteBanner notice (removed locally):', err.message);
  }

  return true;
}

// ==========================================
// CLICK ANALYTICS
// ==========================================

export async function getAdminClickAnalytics() {
  let rawClicks = localClicks;
  let products = await getAdminProducts();

  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, 'clicks'));
      if (snap.exists()) {
        rawClicks = snap.val();
      }
    } catch (err) {
      console.warn('Could not read /clicks (using local mock):', err.message);
    }
  }

  // Parse total clicks, clicks per platform, recent click logs
  let totalClicks = 0;
  const platformCounts = {};
  const clickLogs = [];

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  let clicksLast7Days = 0;

  Object.entries(rawClicks || {}).forEach(([productId, clickMap]) => {
    const prod = products.find((p) => p.id === productId);
    const prodTitle = prod ? prod.title : productId;

    Object.entries(clickMap || {}).forEach(([clickId, cData]) => {
      totalClicks++;
      const plat = cData.platform || prod?.platform || 'other';
      platformCounts[plat] = (platformCounts[plat] || 0) + 1;

      const ts = cData.timestamp || now;
      if (ts >= sevenDaysAgo) {
        clicksLast7Days++;
      }

      clickLogs.push({
        id: clickId,
        productId,
        productTitle: prodTitle,
        platform: plat,
        timestamp: ts,
      });
    });
  });

  clickLogs.sort((a, b) => b.timestamp - a.timestamp);

  return {
    totalClicks,
    clicksLast7Days,
    platformCounts,
    clickLogs: clickLogs.slice(0, 100),
  };
}

// ==========================================
// SETTINGS CRUD
// ==========================================

export async function getAdminSettings() {
  localSettings = getLocalStored(STORAGE_KEYS.settings, seedData.settings);
  if (!isFirebaseConfigured || !database) {
    return localSettings;
  }

  try {
    const snap = await get(ref(database, 'settings'));
    if (snap.exists()) {
      return snap.val();
    }
    return localSettings;
  } catch (err) {
    console.warn('getAdminSettings Firebase read notice (using local):', err.message);
    return localSettings;
  }
}

export async function saveAdminSettings(settingsData) {
  localSettings = { ...localSettings, ...settingsData };
  setLocalStored(STORAGE_KEYS.settings, localSettings);

  if (!isFirebaseConfigured || !database) {
    return localSettings;
  }

  try {
    const settingsRef = ref(database, 'settings');
    await set(settingsRef, settingsData);
  } catch (err) {
    console.warn('Firebase saveAdminSettings notice (saved locally):', err.message);
  }

  return localSettings;
}

// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================

export async function getAdminUsers() {
  if (!isFirebaseConfigured || !database) {
    return Object.entries(localAdmins).map(([uid, data]) => ({ uid, ...data }));
  }

  try {
    const snap = await get(ref(database, 'admins'));
    if (snap.exists()) {
      return Object.entries(snap.val()).map(([uid, data]) => ({ uid, ...data }));
    }
    return [];
  } catch (err) {
    console.warn('getAdminUsers Firebase notice (using local):', err.message);
    return Object.entries(localAdmins).map(([uid, data]) => ({ uid, ...data }));
  }
}

export async function saveAdminUser(uid, email, role = 'editor') {
  const payload = {
    email,
    role,
    createdAt: Date.now(),
  };

  localAdmins[uid] = payload;

  if (!isFirebaseConfigured || !database) {
    return payload;
  }

  try {
    const adminRef = ref(database, `admins/${uid}`);
    await set(adminRef, payload);
  } catch (err) {
    console.warn('Firebase saveAdminUser notice (saved locally):', err.message);
  }

  return payload;
}

export async function deleteAdminUser(uid) {
  delete localAdmins[uid];

  if (!isFirebaseConfigured || !database) {
    return true;
  }

  try {
    const adminRef = ref(database, `admins/${uid}`);
    await remove(adminRef);
  } catch (err) {
    console.warn('Firebase deleteAdminUser notice (removed locally):', err.message);
  }

  return true;
}

// ==========================================
// SEED / SYNC DATA
// ==========================================

export async function syncSeedDataToFirebase() {
  localProducts = { ...seedData.products };
  localCategories = { ...seedData.categories };
  localBanners = { ...seedData.banners };
  localSettings = { ...seedData.settings };
  setLocalStored(STORAGE_KEYS.products, localProducts);
  setLocalStored(STORAGE_KEYS.categories, localCategories);
  setLocalStored(STORAGE_KEYS.banners, localBanners);
  setLocalStored(STORAGE_KEYS.settings, localSettings);

  if (!isFirebaseConfigured || !database) {
    return { success: true, message: 'Local demo state reloaded with 18 products.' };
  }

  try {
    await update(ref(database), {
      products: seedData.products,
      categories: seedData.categories,
      banners: seedData.banners,
      settings: seedData.settings,
    });
    return { success: true, message: 'Products, categories & banners successfully synced to Firebase!' };
  } catch (err) {
    console.warn('syncSeedDataToFirebase warning (reloaded locally):', err.message);
    return { success: true, message: 'Local state reloaded successfully with all products.' };
  }
}
