'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Send, Sparkles, Loader2, Brush, Bot, Volume2, Mic, MicOff } from 'lucide-react';
import { aiCustomerSupportAssistant } from '@/ai/flows/ai-customer-support-assistant';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const CartoonRobotIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full drop-shadow-xl"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head - Light Metallic Silver */}
      <circle cx="50" cy="45" r="35" fill="#cbd5e1" />
      
      {/* Face Plate */}
      <rect x="25" y="30" width="50" height="30" rx="15" fill="white" opacity="0.4" />

      {/* Eyes - Large and Expressive */}
      <circle cx="38" cy="42" r="8" fill="white" />
      <circle cx="38" cy="42" r="4" fill="#1e293b" />
      <circle cx="40" cy="40" r="2" fill="white" />
      
      <circle cx="62" cy="42" r="8" fill="white" />
      <circle cx="62" cy="42" r="4" fill="#1e293b" />
      <circle cx="64" cy="40" r="2" fill="white" />

      {/* Smile */}
      <path 
        d="M40 55 C45 60 55 60 60 55" 
        stroke="#1e293b" 
        strokeWidth="3" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Blush Marks */}
      <circle cx="28" cy="50" r="4" fill="#f87171" opacity="0.4" />
      <circle cx="72" cy="50" r="4" fill="#f87171" opacity="0.4" />

      {/* Antenna - Metallic Silver with Glow */}
      <line x1="50" y1="10" x2="50" y2="15" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="8" r="5" fill="#94a3b8" />
      <circle cx="50" cy="8" r="2" fill="white" opacity="0.8" />

      {/* Status Light - Friendly Green Glow */}
      <circle cx="85" cy="25" r="7" fill="#22c55e" stroke="white" strokeWidth="2" className="animate-pulse" />
    </svg>
  </div>
);

type Message = {
  role: 'assistant' | 'user';
  content: string;
  action?: {
    type: string;
    category?: string;
    message?: string;
  };
};

export default function FloatingAssistant() {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'میں آپ کی کیا مدد کر سکتا ہوں؟' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
    } else {
      setShowBubble(true);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await aiCustomerSupportAssistant({ userMessage: userMsg });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.response,
        action: result.suggestedAction
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string, index: number) => {
    if (isSpeaking !== null) return;
    setIsSpeaking(index);
    try {
      const result = await textToSpeech(text);
      const audio = new Audio(result.media);
      audio.onended = () => setIsSpeaking(null);
      audio.play();
    } catch (error) {
      console.error('Failed to play audio', error);
      setIsSpeaking(null);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ur-PK';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="mb-4 w-[320px] max-h-[70vh] h-[450px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5 duration-300 rounded-[24px] overflow-hidden">
          <header className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold text-sm">Muawin Robot Assistant</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 h-8 w-8 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </header>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface"
          >
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex flex-col",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed relative group",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-white text-foreground rounded-tl-none border border-secondary/30 shadow-sm",
                  msg.role === 'assistant' && "font-urdu-modern text-[14px] font-medium"
                )}>
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => handleSpeak(msg.content, i)}
                      disabled={isSpeaking !== null}
                      className={cn(
                        "absolute -right-8 top-0 p-1 rounded-full bg-white border border-secondary/30 shadow-sm transition-opacity opacity-0 group-hover:opacity-100",
                        isSpeaking === i && "opacity-100 animate-pulse text-primary"
                      )}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {msg.action && msg.action.type !== 'none' && (
                  <Card className="mt-2 p-3 bg-secondary/20 border-primary/10 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <Brush className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{msg.action.category}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-[10px] font-bold rounded-lg"
                      onClick={() => router.push(`/customer/post-job?category=${msg.action?.category}`)}
                    >
                      Post Job
                    </Button>
                  </Card>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-2 rounded-xl border border-secondary/30 shadow-sm">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            )}
          </div>

          <footer className="p-3 bg-white border-t border-border flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleListening}
              className={cn(
                "h-10 w-10 shrink-0",
                isListening ? "text-primary animate-pulse" : "text-muted-foreground hover:text-primary"
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask anything..."} 
              className="flex-1 h-10 text-xs rounded-xl bg-surface border-none focus-visible:ring-primary/30"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </footer>
        </Card>
      )}

      {/* Greeting Bubble */}
      {!isOpen && showBubble && (
        <div className="mb-2 mr-2 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white px-4 py-2 rounded-2xl rounded-br-none shadow-lg border border-primary/10 max-w-[200px]">
            <p className="text-[14px] font-urdu-modern text-primary leading-relaxed text-right font-medium">
              میں آپ کی کیا مدد کر سکتا ہوں؟
            </p>
          </div>
          <div className="absolute -bottom-1.5 right-0 w-3 h-3 bg-white border-r border-b border-primary/5 rotate-45" />
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-110 focus:outline-none"
      >
        {isOpen ? (
          <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center shadow-lg">
            <X className="w-7 h-7 text-white" />
          </div>
        ) : (
          <CartoonRobotIcon className="w-full h-full" />
        )}
      </button>
    </div>
  );
}
