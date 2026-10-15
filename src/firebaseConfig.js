import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || "dummy-api-key",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "skit004-threat-monitor.firebaseapp.com",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "skit004-threat-monitor",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "skit004-threat-monitor.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "461071314661",
    appId: env.VITE_FIREBASE_APP_ID || "1:461071314661:web:9caa93b4d3a0b73e0eee0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);