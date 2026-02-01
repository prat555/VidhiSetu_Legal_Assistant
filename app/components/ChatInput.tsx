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
  const finalTranscriptRef = useRef<string>('');
  const inputRef = useRef<string>(''); // Keep track of current input value

  // Keep inputRef in sync with input state
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

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
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English, also supports Hindi mixed
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          let interimTranscript = '';
          
          // Process only new results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              // Append final result to existing text
              const existingText = finalTranscriptRef.current;
              finalTranscriptRef.current = existingText + (existingText ? ' ' : '') + transcript;
            } else {
              interimTranscript = transcript;
            }
          }

          // Show existing text + new final text + interim text
          const displayText = finalTranscriptRef.current + (interimTranscript ? (finalTranscriptRef.current ? ' ' : '') + interimTranscript : '');
          setInput(displayText);

          // Set a timer to stop after 2 seconds of silence
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 2000);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access to use voice input.');
          } else if (event.error === 'no-speech') {
            // No speech detected, just stop quietly
          }
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Capture current input text to continue from
      finalTranscriptRef.current = inputRef.current;
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Recognition might already be running
        recognitionRef.current.stop();
        setTimeout(() => {
          finalTranscriptRef.current = inputRef.current;
          recognitionRef.current.start();
        }, 100);
      }
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      finalTranscriptRef.current = ''; // Reset transcript
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
        onChange={(e) => {
          setInput(e.target.value);
          finalTranscriptRef.current = e.target.value;
        }}
        onKeyPress={handleKeyPress}
        placeholder={isMobile ? "Ask about Indian law, rights..." : "Ask about Indian law, legal procedures, rights..."}
        disabled={disabled}
        rows={1}
        className="w-full resize-none rounded-2xl border border-zinc-300/70 dark:border-zinc-700/70 bg-white dark:bg-zinc-900 px-3 sm:px-4 py-3.5 sm:py-3.5 pr-20 sm:pr-24 text-sm sm:text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-500/40 focus:border-amber-500/50 dark:focus:border-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all max-h-40 overflow-y-auto shadow-lg leading-5"
        style={{ minHeight: '50px' }}
      />
        {/* Voice Input Button - Inside textarea */}
        <button
          onClick={toggleListening}
          disabled={disabled}
          className={`absolute right-12 sm:right-13 top-1/2 -translate-y-1/2 -mt-0.5 p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isListening
              ? 'bg-amber-500 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
          aria-label={isListening ? 'Stop recording' : 'Voice input'}
          title={isListening ? 'Stop' : 'Voice input'}
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