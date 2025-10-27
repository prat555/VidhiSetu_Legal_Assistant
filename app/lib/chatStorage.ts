export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'legal_assistant_chats';
const ACTIVE_CHAT_KEY = 'legal_assistant_active_chat';

export const chatStorage = {
  // Get all chat sessions
  getAllChats(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get a specific chat by ID
  getChat(id: string): ChatSession | null {
    const chats = this.getAllChats();
    return chats.find(chat => chat.id === id) || null;
  },

  // Create a new chat session
  createChat(title?: string): ChatSession {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: title || 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const chats = this.getAllChats();
    chats.unshift(newChat); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    this.setActiveChat(newChat.id);
    
    return newChat;
  },

  // Update a chat session
  updateChat(id: string, updates: Partial<ChatSession>): void {
    const chats = this.getAllChats();
    const index = chats.findIndex(chat => chat.id === id);
    
    if (index !== -1) {
      chats[index] = {
        ...chats[index],
        ...updates,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
  },

  // Delete a chat session
  deleteChat(id: string): void {
    const chats = this.getAllChats();
    const filtered = chats.filter(chat => chat.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // If deleted chat was active, set active to first available
    if (this.getActiveChat() === id && filtered.length > 0) {
      this.setActiveChat(filtered[0].id);
    } else if (filtered.length === 0) {
      this.setActiveChat(null);
    }
  },

  // Get active chat ID
  getActiveChat(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  },

  // Set active chat
  setActiveChat(id: string | null): void {
    if (typeof window === 'undefined') return;
    if (id) {
      localStorage.setItem(ACTIVE_CHAT_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    }
  },

  // Generate a smart title from the first user message
  generateTitle(firstMessage: string): string {
    const maxLength = 40;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.substring(0, maxLength) + '...';
  },
};
