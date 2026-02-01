'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Menu, ArrowDown, Home, Scale, Lock } from 'lucide-react';
import Link from 'next/link';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatSidebar from '../components/ChatSidebar';
import { useAuth } from '../context/AuthContext';
import { userChatStorage, ChatSession, Message } from '../lib/userStorage';

export default function ChatPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);

  // Load chats from Firebase on mount
  useEffect(() => {
    async function loadChats() {
      if (!user) {
        setInitialLoading(false);
        return;
      }
      
      try {
        const loadedChats = await userChatStorage.getAllChats(user.uid);
        setChats(loadedChats);
        
        if (loadedChats.length > 0) {
          const firstChat = loadedChats[0];
          setActiveChat(firstChat.id);
          setMessages(firstChat.messages);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
          }, 100);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setInitialLoading(false);
      }
      
      // Start with sidebar open on desktop, closed on mobile
      const isDesktop = window.innerWidth >= 768;
      setSidebarOpen(isDesktop);
    }
    
    loadChats();
  }, [user]);

  // Save messages to active chat whenever they change
  useEffect(() => {
    async function saveMessages() {
      if (!user || !activeChat || messages.length === 0) return;
      
      const currentChat = chats.find(c => c.id === activeChat);
      if (currentChat) {
        // Update title from first user message if still default
        let newTitle = currentChat.title;
        if (currentChat.title.startsWith('New Chat') && messages.length >= 1) {
          const firstUserMessage = messages.find(m => m.role === 'user');
          if (firstUserMessage) {
            newTitle = firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '');
          }
        }
        
        await userChatStorage.updateChat(user.uid, activeChat, {
          messages,
          title: newTitle,
        });
        
        // Refresh chat list
        const updatedChats = await userChatStorage.getAllChats(user.uid);
        setChats(updatedChats);
      }
    }
    
    saveMessages();
  }, [messages, activeChat, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only auto-scroll when user sends a message, not when assistant responds
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        scrollToBottom();
      }
      // Don't scroll when assistant responds - maintain current scroll position
    }
  }, [messages]);

  // Handle scroll to show/hide scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);

  const handleCreateChat = async () => {
    if (!user) return;
    const newChat = await userChatStorage.createChat(user.uid);
    const updatedChats = await userChatStorage.getAllChats(user.uid);
    setChats(updatedChats);
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = async (id: string) => {
    if (!user) return;
    setActiveChat(id);
    const chat = await userChatStorage.getChat(user.uid, id);
    if (chat) {
      setMessages(chat.messages);
    }
  };

  const handleDeleteChat = async (id: string) => {
    if (!user) return;
    await userChatStorage.deleteChat(user.uid, id);
    const updatedChats = await userChatStorage.getAllChats(user.uid);
    setChats(updatedChats);
    
    if (activeChat === id) {
      if (updatedChats.length > 0) {
        const newActiveId = updatedChats[0].id;
        setActiveChat(newActiveId);
        setMessages(updatedChats[0].messages);
      } else {
        setActiveChat(null);
        setMessages([]);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    
    // Create a new chat if none exists
    if (!activeChat) {
      const newChat = await userChatStorage.createChat(user.uid);
      setActiveChat(newChat.id);
      const updatedChats = await userChatStorage.getAllChats(user.uid);
      setChats(updatedChats);
    }

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please make sure your Gemini API key is configured correctly.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle touch swipe for sidebar
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchCurrentX.current - touchStartX.current;
    // If swiped right from the left edge by at least 50px, open sidebar
    if (touchStartX.current < 50 && diff > 50) {
      setSidebarOpen(true);
    }
    touchStartX.current = 0;
    touchCurrentX.current = 0;
  };

  // Handle mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const diff = e.clientX - dragStartX.current;
    // If dragged left by more than 100px, close sidebar
    if (diff < -100) {
      setSidebarOpen(false);
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Add mouse event listeners for drag
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Show loading state
  if (authLoading || initialLoading) {
    return (
      <div className="flex h-screen bg-zinc-900 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Show sign-in required screen
  if (!user) {
    return (
      <div className="flex h-screen bg-zinc-900 items-center justify-center p-4">
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Sign In Required</h2>
          <p className="text-zinc-400 mb-6">
            Sign in to use the Legal Assistant chatbot. Your chat history will be saved to your account.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-900 overflow-hidden">
      {/* Sidebar - Overlay on mobile, fixed on desktop */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onDeleteChat={handleDeleteChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {/* Drag Handle - Desktop only */}
        {sidebarOpen && (
          <div
            onMouseDown={handleMouseDown}
            className="hidden md:block absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:w-1.5 hover:bg-amber-500/30 transition-all z-50"
            title="Drag to close"
          />
        )}
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Home Button - Always visible when sidebar is closed */}
        {!sidebarOpen && (
          <Link
            href="/"
            className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-all text-zinc-300 hover:text-white text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        )}

        {/* Vertical Pull Tab - Only show when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="fixed top-1/3 -translate-y-1/2 left-0 z-40 h-16 w-5 bg-zinc-700/40 backdrop-blur-sm border-r border-zinc-600/50 rounded-r-md shadow-sm hover:shadow-md transition-all duration-200 hover:w-6 hover:bg-zinc-600/50 cursor-pointer flex items-center justify-center group touch-none"
            aria-label="Open sidebar"
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-2.5 h-0.5 bg-zinc-500 rounded-full transition-all group-hover:w-3"></div>
              <div className="w-2.5 h-0.5 bg-zinc-500 rounded-full transition-all group-hover:w-3"></div>
              <div className="w-2.5 h-0.5 bg-zinc-500 rounded-full transition-all group-hover:w-3"></div>
            </div>
          </button>
        )}

        {/* Messages Area - Full Height */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-24" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <WelcomeScreen onQuestionClick={handleSendMessage} />
          ) : (
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 sm:gap-3.5 justify-start mb-3 sm:mb-4">
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-amber-500/20">
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-spin" />
                  </div>
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm bg-zinc-800/50 backdrop-blur-sm/95 border border-zinc-200/50 dark:border-zinc-700/50">
                    <div className="text-sm sm:text-[15px] text-zinc-400 font-medium">
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Area - Full width on mobile, shifts with sidebar on desktop */}
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:max-w-3xl ${
          sidebarOpen ? 'md:left-[calc(144px+50%)] md:w-[calc(100%-288px-2rem)]' : 'md:left-1/2 md:w-[calc(100%-2rem)]'
        }`}>
          {/* Scroll to Bottom Button - Positioned just above textarea */}
          {showScrollButton && (
            <div className="flex justify-center mb-3">
              <button
                onClick={scrollToBottom}
                className="p-2.5 bg-white dark:bg-zinc-900 border-2 border-zinc-400/80 dark:border-zinc-600/80 text-zinc-400 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
