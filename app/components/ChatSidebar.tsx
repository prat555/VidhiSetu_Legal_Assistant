'use client';

import { ChatSession } from '../lib/chatStorage';
import { MessageSquare, Plus, Trash2, X, Scale } from 'lucide-react';

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({
  chats,
  activeChat,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  isOpen,
  onClose,
}: ChatSidebarProps) {

  return (
    <div
      className={`h-full shrink-0 bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-out flex flex-col overflow-hidden ${
        isOpen ? 'w-72 translate-x-0 opacity-100' : 'w-0 -translate-x-full md:translate-x-0 opacity-0 md:opacity-100'
      }`}
    >
      <div className="w-72 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div>
                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-none tracking-tight">
                  VidhiSetu
                </h1>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-none mt-1">
                  Legal Assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3 pt-4">
          <button
            onClick={onCreateChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          {chats.length === 0 ? (
            <div className="text-center py-12 px-3">
              <div className="w-12 h-12 mx-auto mb-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                No chats yet
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
                Start a new conversation
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-xl transition-all duration-200 ${
                    activeChat === chat.id
                      ? 'bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-sm'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className="w-full text-left px-3.5 py-2.5 pr-10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${
                        activeChat === chat.id
                          ? 'text-amber-600 dark:text-amber-500'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate transition-colors ${
                          activeChat === chat.id
                            ? 'text-amber-900 dark:text-amber-100'
                            : 'text-zinc-700 dark:text-zinc-300'
                        }`}>
                          {chat.title}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this chat?')) {
                        onDeleteChat(chat.id);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 cursor-pointer"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 text-center font-medium">
            {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
          </p>
          {chats.length > 0 && (
            <button
              onClick={() => {
                if (confirm(`Delete all ${chats.length} conversations? This cannot be undone.`)) {
                  chats.forEach(chat => onDeleteChat(chat.id));
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-red-200 dark:border-red-900/30 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
