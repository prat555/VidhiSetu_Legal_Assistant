'use client';

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Timeout wrapper for Firestore operations
const withTimeout = <T>(promise: Promise<T>, ms: number = 5000): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Firestore operation timed out')), ms);
  });
  return Promise.race([promise, timeout]);
};

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  cached?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentAnalysis {
  id: string;
  userId: string;
  title: string;
  fileName?: string;
  result: any;
  createdAt: number;
}

export interface SavedForm {
  id: string;
  userId: string;
  formType: string;
  formData: Record<string, any>;
  currentStep: number;
  lastModified: number;
  completed: boolean;
}

// Chat Storage Functions
export const userChatStorage = {
  async getAllChats(userId: string): Promise<ChatSession[]> {
    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const q = query(chatsRef, orderBy('updatedAt', 'desc'), limit(50));
      const snapshot = await withTimeout(getDocs(q), 5000);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        updatedAt: doc.data().updatedAt?.toMillis() || Date.now(),
      })) as ChatSession[];
    } catch (error) {
      console.error('Error getting chats:', error);
      return [];
    }
  },

  async getChat(userId: string, chatId: string): Promise<ChatSession | null> {
    try {
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      const snapshot = await withTimeout(getDoc(chatRef), 5000);
      if (!snapshot.exists()) return null;
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as ChatSession;
    } catch (error) {
      console.error('Error getting chat:', error);
      return null;
    }
  },

  async createChat(userId: string, title?: string): Promise<ChatSession> {
    const chatId = Date.now().toString();
    const newChat: any = {
      title: title || 'New Chat',
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    await setDoc(chatRef, newChat);
    
    return {
      id: chatId,
      title: newChat.title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  async updateChat(userId: string, chatId: string, updates: Partial<ChatSession>): Promise<void> {
    try {
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      await setDoc(chatRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  },

  async deleteChat(userId: string, chatId: string): Promise<void> {
    try {
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      await deleteDoc(chatRef);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  },

  generateTitle(firstMessage: string): string {
    const maxLength = 40;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.substring(0, maxLength) + '...';
  },
};

// Document Analysis Storage
export const userDocumentStorage = {
  async getAllAnalyses(userId: string): Promise<DocumentAnalysis[]> {
    try {
      const analysesRef = collection(db, 'users', userId, 'documentAnalyses');
      const q = query(analysesRef, orderBy('createdAt', 'desc'), limit(30));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
      })) as DocumentAnalysis[];
    } catch (error) {
      console.error('Error getting analyses:', error);
      return [];
    }
  },

  async saveAnalysis(userId: string, analysis: Omit<DocumentAnalysis, 'userId'>): Promise<void> {
    try {
      const analysisRef = doc(db, 'users', userId, 'documentAnalyses', analysis.id);
      await setDoc(analysisRef, {
        ...analysis,
        userId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  },

  async deleteAnalysis(userId: string, analysisId: string): Promise<void> {
    try {
      const analysisRef = doc(db, 'users', userId, 'documentAnalyses', analysisId);
      await deleteDoc(analysisRef);
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  },
};

// Form Storage
export const userFormStorage = {
  async getAllForms(userId: string): Promise<SavedForm[]> {
    try {
      const formsRef = collection(db, 'users', userId, 'savedForms');
      const q = query(formsRef, orderBy('lastModified', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().lastModified?.toMillis() || Date.now(),
      })) as SavedForm[];
    } catch (error) {
      console.error('Error getting forms:', error);
      return [];
    }
  },

  async saveForm(userId: string, form: Omit<SavedForm, 'userId'>): Promise<void> {
    try {
      const formRef = doc(db, 'users', userId, 'savedForms', form.id);
      await setDoc(formRef, {
        ...form,
        userId,
        lastModified: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving form:', error);
    }
  },

  async deleteForm(userId: string, formId: string): Promise<void> {
    try {
      const formRef = doc(db, 'users', userId, 'savedForms', formId);
      await deleteDoc(formRef);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  },
};
