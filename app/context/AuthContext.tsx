'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isSigningIn = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Prevent multiple popup requests
    if (isSigningIn.current) return;
    
    try {
      isSigningIn.current = true;
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Ignore cancelled popup errors (user closed popup or clicked multiple times)
      if (error?.code === 'auth/cancelled-popup-request' || 
          error?.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was cancelled');
        return;
      }
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      isSigningIn.current = false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
