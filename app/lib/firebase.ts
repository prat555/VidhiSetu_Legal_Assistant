import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD71dkZaATyml3fmzd3UWpiLL44yM1ZK7s",
  authDomain: "vidhisetu-852a6.firebaseapp.com",
  projectId: "vidhisetu-852a6",
  storageBucket: "vidhisetu-852a6.firebasestorage.app",
  messagingSenderId: "814661822403",
  appId: "1:814661822403:web:8129ab94bd317dd55fff76",
  measurementId: "G-Q5T51ZPZ9Z"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Initialize Firestore with persistent cache (modern approach)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
