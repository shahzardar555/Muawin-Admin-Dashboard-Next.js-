'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Sparkles, User, Brush, Loader2, Volume2, Mic, MicOff } from 'lucide-react';
import { aiCustomerSupportAssistant } from '@/ai/flows/ai-customer-support-assistant';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'assistant' | 'user';
  content: string;
  action?: {
    type: string;
    category?: string;
    message?: string;
  };
};

export default function AssistantPage() {
  const router = useRouter();
  const { toast } = useToast();
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
  }, [messages]);

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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
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
    recognition.lang = 'ur-PK'; // Defaults to Urdu but usually picks up English well too
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-surface">
      <header className="bg-white px-6 py-4 flex items-center gap-4 border-b border-border z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Muawin Assistant</h1>
            <span className="text-[10px] text-green-500 font-bold flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" /> Online
            </span>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex flex-col",
            msg.role === 'user' ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 relative group",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-white text-foreground rounded-tl-none border border-secondary/30"
            )}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => handleSpeak(msg.content, i)}
                  disabled={isSpeaking !== null}
                  className={cn(
                    "absolute -right-10 top-2 p-1.5 rounded-full bg-white border border-secondary/30 shadow-sm transition-opacity opacity-0 group-hover:opacity-100",
                    isSpeaking === i && "opacity-100 animate-pulse text-primary"
                  )}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {msg.action && msg.action.type !== 'none' && (
              <Card className="mt-3 p-4 muawin-card bg-secondary/20 border-primary/20 max-w-[85%] space-y-3 animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Brush className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">{msg.action.message || 'Suggested Action'}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{msg.action.category || 'Home Service'}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full rounded-xl text-xs font-bold shadow-sm"
                  onClick={() => router.push(`/customer/post-job?category=${msg.action?.category || ''}`)}
                >
                  Post Job Now
                </Button>
              </Card>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2 animate-pulse">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-secondary/30">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold">Muawin is thinking...</span>
          </div>
        )}
      </div>

      <footer className="p-4 bg-white border-t border-border flex items-center gap-4 z-10 sticky bottom-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleListening}
          className={cn(
            "h-12 w-12 rounded-xl shrink-0 transition-all",
            isListening ? "bg-primary text-primary-foreground animate-pulse" : "text-muted-foreground hover:text-primary"
          )}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
        <div className="flex-1 relative">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Type your question here..."} 
            className="rounded-2xl h-14 pr-16 bg-surface border-none shadow-inner focus-visible:ring-primary/50"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
