import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import seedData from '../seed-data.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAfa-p_jHxJz0OLuf_gw4_xZRVFQXbo5PA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'affiliate-store-7ac22.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://affiliate-store-7ac22-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'affiliate-store-7ac22',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'affiliate-store-7ac22.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '816440111007',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:816440111007:web:c34f86b8940adc5be8d7aa',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-X50JLT6XVP',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL
);

let app = null;
let database = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    database = getDatabase(app);
  } catch (err) {
    console.warn('Firebase init failed, running in offline/seed mode:', err);
  }
} else {
  console.info('Firebase environment variables not set. SastaBazar running in seed demo mode.');
}

export { database, seedData };
