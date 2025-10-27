'use client';

import { Scale, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 sm:gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-fade-in`}>
      {!isUser && (
        <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-amber-500/20">
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm ${
          isUser
            ? 'bg-orange-500 text-white shadow-orange-500/20'
            : 'bg-white dark:bg-zinc-800/95 text-zinc-800 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50'
        }`}
      >
        <div className={`text-sm sm:text-[15px] leading-[1.6] prose prose-sm max-w-none ${
          isUser 
            ? 'prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-li:text-white prose-a:text-white prose-code:text-white' 
            : 'prose-zinc dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-code:text-amber-700 dark:prose-code:text-amber-400 prose-code:bg-amber-50 dark:prose-code:bg-amber-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded'
        }`}>
          {isUser ? (
            content
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
      {isUser && (
        <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center shadow-lg ring-2 ring-zinc-600/20">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
    </div>
  );
}
