'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MoreVertical, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type Message = {
  id: string;
  role: 'sender' | 'receiver';
  content: string;
  time: string;
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const chatName = searchParams.get('name') || 'Chat';
  const chatAvatar = searchParams.get('avatar') || `https://picsum.photos/seed/${params.id}/200/200`;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'receiver', content: 'Assalam-o-Alaikum! How can I help you today?', time: '10:00 AM' },
    { id: '2', role: 'sender', content: 'Walaikum Assalam. I wanted to confirm the timing.', time: '10:02 AM' },
    { id: '3', role: 'receiver', content: 'Yes, I will be there by 10 AM sharp.', time: '10:05 AM' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'sender',
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'receiver',
        content: 'Got it! See you then.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7F8]">
      <header className="bg-white px-4 py-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden border border-border">
              <img src={chatAvatar} alt={chatName} className="object-cover w-full h-full" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">{chatName}</h1>
              <span className="text-[10px] text-green-500 font-bold flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" /> Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-10 w-10">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <div className="flex justify-center my-4">
          <span className="text-[10px] font-bold text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm uppercase tracking-widest">Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex flex-col",
            msg.role === 'sender' ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl shadow-sm relative group",
              msg.role === 'sender' 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-white text-foreground rounded-tl-none border border-secondary/30"
            )}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <div className={cn(
                "flex items-center gap-1 mt-1 justify-end",
                msg.role === 'sender' ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                <span className="text-[8px] font-bold">{msg.time}</span>
                {msg.role === 'sender' && <CheckCheck className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-4 bg-white border-t border-border flex items-center gap-3 sticky bottom-0 z-20">
        <div className="flex-1 relative">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('type_message')} 
            className="rounded-2xl h-12 pr-12 bg-surface border-none shadow-inner focus-visible:ring-primary/50"
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl shadow-md transition-all active:scale-95 bg-primary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
