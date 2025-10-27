'use client';

import { Send, Mic, MicOff } from 'lucide-react';
import { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; // Keep listening but we'll control it
        recognitionRef.current.interimResults = true; // Show results as user speaks
        recognitionRef.current.lang = 'en-IN'; // Indian English
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: any) => {
          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          let transcript = '';
          // Get the transcript
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);

          // Set a timer to stop after 2 seconds of silence
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.stop();
            }
          }, 2000); // 2 seconds of silence
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isMobile ? "Ask about Indian law, rights..." : "Ask about Indian law, legal procedures, rights..."}
        disabled={disabled}
        rows={1}
        className="w-full resize-none rounded-2xl border border-zinc-300/70 dark:border-zinc-700/70 bg-white dark:bg-zinc-900 px-3 sm:px-4 py-3.5 sm:py-3.5 pr-20 sm:pr-24 text-sm sm:text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-500/40 focus:border-amber-500/50 dark:focus:border-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all max-h-40 overflow-y-auto shadow-lg leading-5"
        style={{ minHeight: '50px' }}
      />
        {/* Voice Input Button - Inside textarea */}
        <button
          onClick={toggleListening}
          disabled={disabled}
          className={`absolute right-12 sm:right-13 top-1/2 -translate-y-1/2 -mt-0.5 p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
          aria-label={isListening ? 'Stop recording' : 'Dictate'}
          title={isListening ? 'Stop recording' : 'Dictate'}
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
        {/* Send Button - Inside textarea */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 -mt-0.5 p-2 rounded-full bg-orange-400 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          aria-label="Send message"
          title="Send message"
        >
          <Send className="w-4 h-4 text-white -ml-0.5" />
        </button>
    </div>
  );
}