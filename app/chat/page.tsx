'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Menu, ArrowDown } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatSidebar from '../components/ChatSidebar';
import { chatStorage, ChatSession, Message } from '../lib/chatStorage';

export default function ChatPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);

  // Load chats from localStorage on mount
  useEffect(() => {
    const loadedChats = chatStorage.getAllChats();
    setChats(loadedChats);
    
    const activeChatId = chatStorage.getActiveChat();
    if (activeChatId && loadedChats.find(c => c.id === activeChatId)) {
      setActiveChat(activeChatId);
      const chat = chatStorage.getChat(activeChatId);
      if (chat) {
        setMessages(chat.messages);
        // Scroll to bottom after loading messages on refresh
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 100);
      }
    }
    
    // Start with sidebar open on desktop, closed on mobile
    const isDesktop = window.innerWidth >= 768;
    setSidebarOpen(isDesktop);
  }, []);

  // Save messages to active chat whenever they change
  useEffect(() => {
    if (activeChat && messages.length > 0) {
      const currentChat = chatStorage.getChat(activeChat);
      if (currentChat) {
        // Update title from first user message if still default
        let newTitle = currentChat.title;
        if (currentChat.title.startsWith('New Chat') && messages.length >= 1) {
          const firstUserMessage = messages.find(m => m.role === 'user');
          if (firstUserMessage) {
            newTitle = chatStorage.generateTitle(firstUserMessage.content);
          }
        }
        
        chatStorage.updateChat(activeChat, {
          messages,
          title: newTitle,
        });
        
        // Refresh chat list
        setChats(chatStorage.getAllChats());
      }
    }
  }, [messages, activeChat]);

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

  const handleCreateChat = () => {
    const newChat = chatStorage.createChat();
    setChats(chatStorage.getAllChats());
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    chatStorage.setActiveChat(id);
    const chat = chatStorage.getChat(id);
    if (chat) {
      setMessages(chat.messages);
    }
  };

  const handleDeleteChat = (id: string) => {
    chatStorage.deleteChat(id);
    const updatedChats = chatStorage.getAllChats();
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
    // Create a new chat if none exists
    if (!activeChat) {
      const newChat = chatStorage.createChat();
      setActiveChat(newChat.id);
      setChats(chatStorage.getAllChats());
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

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
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
        {/* Vertical Pull Tab - Only show when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="fixed top-1/3 -translate-y-1/2 left-0 z-50 h-16 w-5 bg-zinc-200/40 dark:bg-zinc-700/40 backdrop-blur-sm border-r border-zinc-300/50 dark:border-zinc-600/50 rounded-r-md shadow-sm hover:shadow-md transition-all duration-200 hover:w-6 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 cursor-pointer flex items-center justify-center group touch-none"
            aria-label="Open sidebar"
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-2.5 h-0.5 bg-zinc-400 dark:bg-zinc-500 rounded-full transition-all group-hover:w-3"></div>
              <div className="w-2.5 h-0.5 bg-zinc-400 dark:bg-zinc-500 rounded-full transition-all group-hover:w-3"></div>
              <div className="w-2.5 h-0.5 bg-zinc-400 dark:bg-zinc-500 rounded-full transition-all group-hover:w-3"></div>
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
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm bg-white dark:bg-zinc-800/95 border border-zinc-200/50 dark:border-zinc-700/50">
                    <div className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 font-medium">
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
                className="p-2.5 bg-white dark:bg-zinc-900 border-2 border-zinc-400/80 dark:border-zinc-600/80 text-zinc-600 dark:text-zinc-400 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
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
