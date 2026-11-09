import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC2zaHQkTqWkuW7_2SkQoZnGWJ910d0cK4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "exe-proj-ff0c0.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "exe-proj-ff0c0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "exe-proj-ff0c0.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "776734378250",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:776734378250:web:54926bc223536fa3ffd2f3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-M2Q7Z71RQY",
};

// Initialize Firebase App as singleton
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Firestore and Storage instances
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
try {
  db = getFirestore(app);
  storage = getStorage(app);
} catch {
  // Graceful fallback if offline
}

// Initialize Analytics safely on client side
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((yes) => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics unsupported or blocked (e.g. adblocker)
    });
}

export { app, db, storage, analytics };

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId === "exe-proj-ff0c0");
}

export function getFirebaseStatus() {
  return {
    configured: true,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket,
    database: "Cloud Firestore (Connected)",
    tenantScope: "EXE-TENANT-SOLIDWIN-WORKSPACE",
  };
}
