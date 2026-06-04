'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageSquare, 
  ChevronRight, 
  Clock,
  User,
  Store,
  Filter,
  Users,
  SearchX,
  Check,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type FilterType = 'all' | 'unread' | 'new';

export default function VendorMessagesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const chats = [
    {
      id: 'c1',
      name: 'Ali Raza',
      lastMessage: 'Is the milk fresh today?',
      time: '5m ago',
      unread: true,
      avatar: 'https://picsum.photos/seed/user10/100/100',
      isNewCustomer: true,
    },
    {
      id: 'c2',
      name: 'Sara Khan',
      lastMessage: 'Thank you for the quick delivery!',
      time: '2h ago',
      unread: false,
      avatar: 'https://picsum.photos/seed/user11/100/100',
      isNewCustomer: false,
    },
    {
      id: 'c3',
      name: 'Usman Ahmed',
      lastMessage: 'Do you have large size gas cylinders?',
      time: 'Yesterday',
      unread: false,
      avatar: 'https://picsum.photos/seed/user12/100/100',
      isNewCustomer: false,
    },
    {
      id: 'c4',
      name: 'Zoya Malik',
      lastMessage: 'What is the price of high-grade beef today?',
      time: '2 days ago',
      unread: false,
      avatar: 'https://picsum.photos/seed/user13/100/100',
      isNewCustomer: true,
    }
  ];

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
                           (filter === 'unread' && chat.unread) || 
                           (filter === 'new' && chat.isNewCustomer);
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  const unreadCount = chats.filter(c => c.unread).length;

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Header - Technical Spec: bg-primary, rounded-b-[40px] */}
      <header className="bg-primary px-6 pt-16 pb-8 space-y-6 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-headline">Customer Chats</h1>
              {unreadCount > 0 && (
                <Badge className="bg-white text-primary font-black px-2 h-5 rounded-full text-[10px] hover:bg-white/90">
                  {unreadCount} NEW
                </Badge>
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-xl">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Search & Filter Row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customers or messages..." 
              className="pl-10 h-12 bg-white/10 border-none rounded-2xl focus-visible:ring-white/30 text-white placeholder:text-white/60 shadow-inner backdrop-blur-sm" 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "w-12 h-12 rounded-2xl border transition-all flex items-center justify-center relative shadow-sm",
                filter !== 'all' ? "bg-white text-primary border-white" : "bg-white/10 border-white/10 text-white hover:bg-white/20"
              )}>
                <Filter className="w-5 h-5" />
                {filter !== 'all' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-primary" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48 shadow-xl border-secondary/20">
              <DropdownMenuItem 
                onClick={() => setFilter('all')}
                className={cn(
                  "rounded-xl py-3 px-3 flex items-center justify-between cursor-pointer",
                  filter === 'all' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-sm">All Messages</span>
                {filter === 'all' && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilter('unread')}
                className={cn(
                  "rounded-xl py-3 px-3 flex items-center justify-between cursor-pointer",
                  filter === 'unread' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-sm">Unread</span>
                {filter === 'unread' && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilter('new')}
                className={cn(
                  "rounded-xl py-3 px-3 flex items-center justify-between cursor-pointer",
                  filter === 'new' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-sm">New Customers</span>
                {filter === 'new' && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messaging Feed */}
      <main className="p-6 space-y-4">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Card 
              key={chat.id} 
              className={cn(
                "p-4 muawin-card border-none flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all",
                chat.unread ? "bg-white shadow-md ring-1 ring-primary/10" : "bg-white/60 opacity-90 shadow-sm"
              )}
              onClick={() => router.push(`/chat/${chat.id}?name=${encodeURIComponent(chat.name)}&avatar=${encodeURIComponent(chat.avatar)}`)}
            >
              {/* Avatar Squircle Anchor */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-secondary overflow-hidden border border-border shadow-sm">
                  <img src={chat.avatar} alt={chat.name} className="object-cover w-full h-full" />
                </div>
                {chat.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse" />
                )}
              </div>

              {/* Text Context Area */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm truncate flex items-center gap-2">
                    {chat.name}
                    {chat.isNewCustomer && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[8px] bg-blue-100 text-blue-700 border-none font-bold uppercase tracking-tighter">
                        New
                      </Badge>
                    )}
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-2.5 h-2.5" /> {chat.time}
                  </span>
                </div>
                <p className={cn(
                  "text-xs truncate leading-relaxed",
                  chat.unread ? "font-bold text-foreground" : "text-muted-foreground"
                )}>
                  {chat.lastMessage}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            </Card>
          ))
        ) : (
          /* Empty State Handling */
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            {searchQuery || filter !== 'all' ? (
              <>
                <SearchX className="w-16 h-16" />
                <div className="space-y-1">
                  <p className="font-bold">No results found</p>
                  <p className="text-xs px-10 leading-relaxed font-medium">Try changing your search or filters.</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <MessageSquare className="w-10 h-10 text-primary opacity-30" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">No customer inquiries yet</p>
                  <p className="text-xs px-10 leading-relaxed font-medium">When customers message your shop about services or products, they will appear here.</p>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
