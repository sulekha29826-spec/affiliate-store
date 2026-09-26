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

// Helper for local mock state in demo mode
let localProducts = { ...seedData.products };
let localCategories = { ...seedData.categories };
let localBanners = { ...seedData.banners };
let localSettings = { ...seedData.settings };
let localAdmins = { ...seedData.admins };
let localClicks = { ...seedData.clicks };

// ==========================================
// PRODUCTS CRUD
// ==========================================

export async function getAdminProducts() {
  if (!isFirebaseConfigured || !database) {
    return Object.entries(localProducts).map(([id, data]) => ({ id, ...data }));
  }

  try {
    const productsRef = ref(database, 'products');
    const snap = await get(productsRef);
    if (snap.exists() && snap.val()) {
      return Object.entries(snap.val()).map(([id, data]) => ({ id, ...data }));
    }
    return Object.entries(localProducts).map(([id, data]) => ({ id, ...data }));
  } catch (err) {
    console.error('getAdminProducts error:', err);
    return Object.entries(localProducts).map(([id, data]) => ({ id, ...data }));
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

  if (!isFirebaseConfigured || !database) {
    localProducts[id] = payload;
    return payload;
  }

  const productRef = ref(database, `products/${id}`);
  await set(productRef, payload);
  return payload;
}

export async function softDeleteProduct(productId) {
  if (!isFirebaseConfigured || !database) {
    if (localProducts[productId]) {
      localProducts[productId].status = 'inactive';
      localProducts[productId].updatedAt = Date.now();
    }
    return true;
  }

  const productRef = ref(database, `products/${productId}`);
  await update(productRef, {
    status: 'inactive',
    updatedAt: serverTimestamp(),
  });
  return true;
}

// ==========================================
// CATEGORIES CRUD
// ==========================================

export async function getAdminCategories() {
  if (!isFirebaseConfigured || !database) {
    return Object.entries(localCategories)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  try {
    const categoriesRef = ref(database, 'categories');
    const snap = await get(categoriesRef);
    if (snap.exists() && snap.val()) {
      return Object.entries(snap.val())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return Object.entries(localCategories)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error('getAdminCategories error:', err);
    return Object.entries(localCategories).map(([id, data]) => ({ id, ...data }));
  }
}

export async function saveCategory(categoryData) {
  const id = categoryData.id || `cat_${Date.now()}`;
  const payload = {
    ...categoryData,
    id,
    order: Number(categoryData.order) || 1,
  };

  if (!isFirebaseConfigured || !database) {
    localCategories[id] = payload;
    return payload;
  }

  const catRef = ref(database, `categories/${id}`);
  await set(catRef, payload);
  return payload;
}

export async function deleteCategory(categoryId) {
  if (!isFirebaseConfigured || !database) {
    delete localCategories[categoryId];
    return true;
  }

  const catRef = ref(database, `categories/${categoryId}`);
  await remove(catRef);
  return true;
}

// ==========================================
// BANNERS CRUD
// ==========================================

export async function getAdminBanners() {
  if (!isFirebaseConfigured || !database) {
    return Object.entries(localBanners)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  try {
    const bannersRef = ref(database, 'banners');
    const snap = await get(bannersRef);
    if (snap.exists() && snap.val()) {
      return Object.entries(snap.val())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return Object.entries(localBanners)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error('getAdminBanners error:', err);
    return Object.entries(localBanners).map(([id, data]) => ({ id, ...data }));
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

  if (!isFirebaseConfigured || !database) {
    localBanners[id] = payload;
    return payload;
  }

  const bannerRef = ref(database, `banners/${id}`);
  await set(bannerRef, payload);
  return payload;
}

export async function deleteBanner(bannerId) {
  if (!isFirebaseConfigured || !database) {
    delete localBanners[bannerId];
    return true;
  }

  const bannerRef = ref(database, `banners/${bannerId}`);
  await remove(bannerRef);
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
      console.warn('Could not read /clicks (check security rules):', err);
    }
  }

  // Parse total clicks, clicks per platform, recent click logs
  let totalClicks = 0;
  const platformCounts = {};
  const clickLogs = [];

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  let clicksLast7Days = 0;

  // Flatten /clicks/{productId}/{clickId}
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
    clickLogs: clickLogs.slice(0, 100), // latest 100
  };
}

// ==========================================
// SETTINGS CRUD
// ==========================================

export async function getAdminSettings() {
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
    console.error('getAdminSettings error:', err);
    return localSettings;
  }
}

export async function saveAdminSettings(settingsData) {
  if (!isFirebaseConfigured || !database) {
    localSettings = { ...localSettings, ...settingsData };
    return localSettings;
  }

  const settingsRef = ref(database, 'settings');
  await set(settingsRef, settingsData);
  return settingsData;
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
    console.error('getAdminUsers error:', err);
    return Object.entries(localAdmins).map(([uid, data]) => ({ uid, ...data }));
  }
}

export async function saveAdminUser(uid, email, role = 'editor') {
  const payload = {
    email,
    role,
    createdAt: Date.now(),
  };

  if (!isFirebaseConfigured || !database) {
    localAdmins[uid] = payload;
    return payload;
  }

  const adminRef = ref(database, `admins/${uid}`);
  await set(adminRef, payload);
  return payload;
}

export async function deleteAdminUser(uid) {
  if (!isFirebaseConfigured || !database) {
    delete localAdmins[uid];
    return true;
  }

  const adminRef = ref(database, `admins/${uid}`);
  await remove(adminRef);
  return true;
}

// ==========================================
// SEED / SYNC DATA
// ==========================================

export async function syncSeedDataToFirebase() {
  if (!isFirebaseConfigured || !database) {
    localProducts = { ...seedData.products };
    localCategories = { ...seedData.categories };
    localBanners = { ...seedData.banners };
    localSettings = { ...seedData.settings };
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
    console.error('syncSeedDataToFirebase error:', err);
    throw err;
  }
}

