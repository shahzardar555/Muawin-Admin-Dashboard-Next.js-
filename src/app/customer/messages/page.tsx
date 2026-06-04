'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageSquare, 
  ChevronRight, 
  Brush,
  Store,
  Clock,
  CheckCheck,
  SearchX,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function MessagesPage() {
  const router = useRouter();
  const { t, mounted } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      type: 'provider',
      category: 'Driver',
      lastMessage: 'I will be there in 10 minutes.',
      time: '2m ago',
      unread: true,
      avatar: 'https://picsum.photos/seed/pro1/100/100',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Sarah K.',
      type: 'provider',
      category: 'Maid',
      lastMessage: 'Thank you for the booking!',
      time: '1h ago',
      unread: false,
      avatar: 'https://picsum.photos/seed/pro2/100/100',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Metro Supermarket',
      type: 'vendor',
      category: 'Grocery',
      lastMessage: 'Your order #123 is ready for pickup.',
      time: '3h ago',
      unread: false,
      avatar: 'https://picsum.photos/seed/ven1/100/100',
      isOnline: true,
    },
    {
      id: '4',
      name: 'Clean Water Co.',
      type: 'vendor',
      category: 'Water Plant',
      lastMessage: 'Delivery scheduled for tomorrow morning.',
      time: '5h ago',
      unread: true,
      avatar: 'https://picsum.photos/seed/ven2/100/100',
      isOnline: false,
    },
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Header */}
      <header className="bg-primary px-6 pt-16 pb-10 space-y-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white leading-none">{t('messages')}</h1>
              <p className="text-primary-foreground/80 font-medium text-xs mt-1">Stay connected with your helpers</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..." 
            className="pl-12 h-14 bg-white border-none rounded-2xl shadow-xl focus-visible:ring-white/20" 
          />
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <MessageSquare className="w-48 h-48 text-white" />
        </div>
      </header>

      <main className="px-6 -mt-4 space-y-4 relative z-20">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Card 
              key={chat.id} 
              className={cn(
                "p-4 muawin-card border-none flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all",
                chat.unread ? "bg-white shadow-xl ring-1 ring-primary/5" : "bg-white/80 opacity-95 shadow-sm"
              )}
              onClick={() => router.push(`/chat/${chat.id}?name=${encodeURIComponent(chat.name)}&avatar=${encodeURIComponent(chat.avatar)}`)}
            >
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-[20px] bg-secondary overflow-hidden border-2 border-white shadow-md">
                  <img src={chat.avatar} alt={chat.name} className="object-cover w-full h-full" />
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white" />
                )}
                <div className="absolute -top-1 -left-1 bg-primary text-white p-1 rounded-lg shadow-sm border border-white">
                  {chat.type === 'provider' ? (
                    <Brush className="w-3 h-3" />
                  ) : (
                    <Store className="w-3 h-3" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-base text-foreground truncate">{chat.name}</h4>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {chat.time}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase tracking-widest h-4 px-1.5",
                    chat.type === 'provider' ? "border-primary/20 text-primary bg-primary/5" : "border-amber-200 text-amber-700 bg-amber-50"
                  )}>
                    {chat.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className={cn(
                    "text-xs truncate max-w-[180px]",
                    chat.unread ? "font-bold text-foreground" : "text-muted-foreground"
                  )}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread ? (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 animate-pulse" />
                  ) : (
                    <CheckCheck className="w-3.5 h-3.5 text-muted-foreground/40" />
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 ml-1" />
            </Card>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl">
              {searchQuery ? (
                <SearchX className="w-12 h-12 text-primary/30" />
              ) : (
                <MessageSquare className="w-12 h-12 text-primary/30" />
              )}
            </div>
            <div className="space-y-2">
              <p className="font-black text-xl text-foreground">
                {searchQuery ? 'No results found' : 'Your inbox is empty'}
              </p>
              <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                {searchQuery 
                  ? `We couldn't find any conversations matching "${searchQuery}".`
                  : 'Start a chat with a service provider or a vendor to see your messages here.'}
              </p>
            </div>
            {!searchQuery && (
              <Button 
                onClick={() => router.push('/customer/home')} 
                className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                Find a Helper
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
