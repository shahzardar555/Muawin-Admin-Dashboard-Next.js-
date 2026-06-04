'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  SearchX,
  Navigation,
  Check,
  Star,
  Bell,
  Trash2,
  CheckCheck,
  Info,
  User,
  Car,
  Baby,
  WashingMachine,
  Users,
  ChefHat,
  Flower2,
  BookOpen,
  Store,
  Trophy,
  Award,
  ArrowRight,
  Clock,
  X,
  Loader2,
  Sparkles,
  Zap,
  ChevronDown
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CATEGORIES } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import MuawinIcon from '@/components/muawin/MuawinIcon';

const CATEGORY_ICONS: Record<string, any> = {
  'Maid': User,
  'Driver': Car,
  'Babysitter': Baby,
  'Security Guard': ShieldCheck,
  'Washerman': WashingMachine,
  'Domestic Helper': Users,
  'Cook': ChefHat,
  'Gardener': Flower2,
  'Tutor': BookOpen
};

const CATEGORY_COLORS: Record<string, { stroke: string; fill: string }> = {
  'Maid': { stroke: 'text-pink-600', fill: '#FCE7F3' },
  'Driver': { stroke: 'text-blue-600', fill: '#DBEAFE' },
  'Babysitter': { stroke: 'text-amber-900', fill: '#FFDBAC' },
  'Security Guard': { stroke: 'text-slate-900', fill: '#E2E8F0' },
  'Washerman': { stroke: 'text-sky-700', fill: '#BAE6FD' },
  'Domestic Helper': { stroke: 'text-teal-600', fill: '#CCFBF1' },
  'Cook': { stroke: 'text-orange-600', fill: '#FFEDD5' },
  'Gardener': { stroke: 'text-emerald-700', fill: '#D1FAE5' },
  'Tutor': { stroke: 'text-purple-600', fill: '#F3E8FF' }
};

export default function CustomerHomePage() {
  const router = useRouter();
  const { t, mounted } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Gulberg III, Lahore');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('muawin_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }

    setIsFetchingLocation(true);
    toast({
      title: "Fetching Location",
      description: "Muawin is identifying your current coordinates...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mockArea = latitude > 31.5 ? "Near Model Town, Lahore" : "Near DHA Phase 6, Lahore";
        
        setLocation(mockArea);
        setIsFetchingLocation(false);
        setIsLocationOpen(false);
        
        toast({
          title: "Location Updated",
          description: "We've updated your location to find the closest pros.",
        });
      },
      (error) => {
        setIsFetchingLocation(false);
        toast({
          title: "Permission Denied",
          description: "Please allow location access in your settings to use this feature.",
          variant: "destructive"
        });
      },
      { timeout: 10000 }
    );
  };

  const handleUpgradePro = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      setIsUpgrading(false);
      toast({
        title: "Welcome to Muawin PRO!",
        description: "Your account has been upgraded. You now have priority matching and zero service fees!",
      });
    }, 1500);
  };

  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return;
    const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 4);
    setRecentSearches(newRecent);
    localStorage.setItem('muawin_recent_searches', JSON.stringify(newRecent));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('muawin_recent_searches');
  };

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Job Accepted', message: 'Ahmed Hassan has accepted your cleaning request.', time: '2 mins ago', read: false },
    { id: '2', title: 'Promo Applied', message: 'Get 20% off on your next cooking service.', time: '1 hour ago', read: false },
    { id: '3', title: 'Order Ready', message: 'Your grocery order from Metro is ready.', time: '3 hours ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const userName = "John";

  const popularLocations = [
    'Gulberg III, Lahore',
    'DHA Phase 5, Lahore',
    'Model Town, Lahore',
    'Johar Town, Lahore',
    'Bahria Town, Lahore',
    'F-7, Islamabad',
    'Clifton, Karachi'
  ];

  const featuredAds = [
    {
      id: 'fa1',
      type: 'provider',
      targetId: 'pro1',
      name: 'Ahmed Hassan',
      category: 'Expert Driver',
      rating: 4.9,
      distance: '1.2 km',
      image: 'https://picsum.photos/seed/pro1/400/300',
      tagline: 'Safe & Reliable City Travel',
      color: 'bg-emerald-600'
    },
    {
      id: 'fa2',
      type: 'vendor',
      targetId: 'v1',
      name: 'Metro Supermarket',
      category: 'Groceries',
      rating: 4.8,
      distance: '0.5 km',
      image: PlaceHolderImages.find(p => p.id === 'ven-supermarket')?.imageUrl || 'https://picsum.photos/seed/v1/400/300',
      tagline: 'Best Prices in Lahore',
      color: 'bg-amber-600'
    },
    {
      id: 'fa3',
      type: 'provider',
      targetId: 'pro4',
      name: 'Fatima Zahra',
      category: 'Professional Babysitter',
      rating: 4.9,
      distance: '3.1 km',
      image: 'https://picsum.photos/seed/pro4/400/300',
      tagline: 'Caring Childcare for your Little Ones',
      color: 'bg-blue-600'
    }
  ];

  const topRatedPros = [
    { id: 'pro1', name: 'Ahmed Hassan', category: 'Driver', exp: 8, rating: 4.9, reviews: 124, seed: 'pro1', distance: '1.2 km', price: 1200 },
    { id: 'pro2', name: 'Zeeshan Malik', category: 'Maid', exp: 5, rating: 4.8, reviews: 89, seed: 'pro2', distance: '2.5 km', price: 800 },
    { id: 'pro3', name: 'Muhammad Ali', category: 'Security Guard', exp: 10, rating: 4.7, reviews: 56, seed: 'pro3', distance: '0.8 km', price: 1500 },
    { id: 'pro4', name: 'Fatima Zahra', category: 'Babysitter', exp: 4, rating: 4.9, reviews: 42, seed: 'pro4', distance: '3.1 km', price: 1000 },
    { id: 'pro5', name: 'Bilal Khan', category: 'Gardener', exp: 6, rating: 4.6, reviews: 31, seed: 'pro5', distance: '1.5 km', price: 900 },
  ];

  const mockVendors = [
    { id: 'v1', name: 'Metro Supermarket', category: 'Supermarkets', rating: 4.8, distance: '0.5 km', seed: 'ven-supermarket', address: 'Block L, Gulberg III' },
    { id: 'v2', name: 'Meat One', category: 'Butchery', rating: 4.9, distance: '1.2 km', seed: 'ven-butchery', address: 'Main Blvd, Gulberg' },
    { id: 'v3', name: 'Dairy Pure', category: 'Milkshops', rating: 4.7, distance: '0.8 km', seed: 'ven-milkshop', address: 'Gurumangat Road' },
    { id: 'v4', name: 'Aqua Safe', category: 'Water Plants', rating: 4.6, distance: '2.0 km', seed: 'ven-waterplant', address: 'Peco Road' },
    { id: 'v5', name: 'Gas Master', category: 'Gas Cylinder Shops', rating: 4.5, distance: '1.5 km', seed: 'ven-gas', address: 'Model Town' },
    { id: 'v6', name: 'Fresh Mart', category: 'Fruits and Vegetables', rating: 4.8, distance: '0.3 km', seed: 'ven-fruits', address: 'H-Block Market' },
  ];

  const topRatedItems = useMemo(() => {
    const combined = [
      ...topRatedPros.map(p => ({ ...p, type: 'provider' as const })),
      ...mockVendors.map(v => ({ ...v, type: 'vendor' as const, seed: v.seed }))
    ];
    return combined.filter(item => item.rating >= 4.9);
  }, []);

  const filteredPros = useMemo(() => {
    return topRatedPros.filter(pro => 
      pro.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredVendors = useMemo(() => {
    return mockVendors.filter(vendor => 
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const vendorCategories = useMemo(() => [
    { name: 'Milkshops', img: PlaceHolderImages.find(p => p.id === 'ven-milkshop')?.imageUrl, hint: 'cow' },
    { name: 'Supermarkets', img: PlaceHolderImages.find(p => p.id === 'ven-supermarket')?.imageUrl, hint: 'supermarket' },
    { name: 'Butchery', img: PlaceHolderImages.find(p => p.id === 'ven-butchery')?.imageUrl, hint: 'butcher' },
    { name: 'Water Plants', img: PlaceHolderImages.find(p => p.id === 'ven-waterplant')?.imageUrl, hint: 'water' },
    { name: 'Gas Cylinder Shops', img: PlaceHolderImages.find(p => p.id === 'ven-gas')?.imageUrl, hint: 'gas' },
    { name: 'Fruits and Vegetables', img: PlaceHolderImages.find(p => p.id === 'ven-fruits')?.imageUrl, hint: 'fruit' },
  ], []);

  const [safeT, setSafeT] = useState(() => (key: string) => key);
  useEffect(() => {
    setSafeT(() => t);
  }, [t]);

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-gradient-to-br from-primary via-primary to-primary/90 px-6 pt-12 pb-10 space-y-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 translate-x-10 -translate-y-10">
          <MuawinIcon className="w-64 h-64 text-white" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-sm">
              <MuawinIcon className="w-7 h-7 text-white" />
            </div>
            <Sheet open={isLocationOpen} onOpenChange={setIsLocationOpen}>
              <SheetTrigger asChild>
                <div className="flex flex-col cursor-pointer active:scale-95 transition-transform">
                  <span className="text-[9px] text-white/60 font-black uppercase tracking-widest">{mounted ? safeT('location') : 'Location'}</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    <h4 className="text-sm font-bold text-white flex items-center">
                      {location}
                      <ChevronDown className="w-3 h-3 ml-1 text-white/50" />
                    </h4>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 shadow-2xl border-none">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left text-xl font-bold">{mounted ? safeT('location') : 'Location'}</SheetTitle>
                </SheetHeader>
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      placeholder={mounted ? safeT('search_placeholder') : 'Search'} 
                      className="pl-12 h-14 bg-surface border-none rounded-2xl"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleUseCurrentLocation}
                    disabled={isFetchingLocation}
                    className="w-full h-14 rounded-2xl border-primary text-primary font-bold flex justify-start px-4 gap-3 bg-primary/5 active:scale-[0.98] transition-transform"
                  >
                    {isFetchingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                    {isFetchingLocation ? 'Locating...' : 'Use Current Location'}
                  </Button>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Popular Areas</p>
                    <div className="space-y-2">
                      {popularLocations.map((loc) => (
                        <button 
                          key={loc}
                          onClick={() => {
                            setLocation(loc);
                            setIsLocationOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl transition-all border",
                            location === loc ? "bg-primary/10 border-primary/20 text-primary font-bold" : "bg-white border-secondary/20 hover:bg-surface"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className={cn("w-4 h-4", location === loc ? "text-primary" : "text-muted-foreground")} />
                            <span className="text-sm">{loc}</span>
                          </div>
                          {location === loc && <Check className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Sheet open={isNotifOpen} onOpenChange={setIsNotifOpen}>
            <SheetTrigger asChild>
              <div className="relative cursor-pointer active:scale-90 transition-transform">
                <div className="w-12 h-12 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-primary font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary shadow-sm animate-in zoom-in duration-300">
                    {unreadCount}
                  </div>
                )}
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[80vh]">
              <SheetHeader className="mb-6 flex flex-row items-center justify-between">
                <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleReadAll} className="text-xs font-bold text-primary h-8">
                    <CheckCheck className="w-3.5 h-3.5 mr-1" /> Read All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs font-bold text-destructive h-8">
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                  </Button>
                </div>
              </SheetHeader>
              <div className="space-y-4 overflow-y-auto max-h-[60vh] no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <Card key={notif.id} className={cn(
                      "p-4 border-none shadow-sm rounded-2xl flex gap-3",
                      notif.read ? "bg-muted/50 opacity-70" : "bg-white border-l-4 border-l-primary"
                    )}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", notif.read ? "bg-muted" : "bg-primary/10")}>
                        <Info className={cn("w-5 h-5", notif.read ? "text-muted-foreground" : "text-primary")} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-sm">{notif.title}</h4>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{notif.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Bell className="w-12 h-12 mb-2" />
                    <p className="font-bold text-sm">No new notifications</p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="animate-in fade-in slide-in-from-left-4 relative z-10 space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white leading-none">
            {mounted ? safeT('welcome') : 'Welcome'}, {userName}!
          </h1>
          <p className="text-white/80 font-medium text-base">
            {mounted ? safeT('how_can_i_help') : 'Aapki Muaawinat kesay karain?'}
          </p>
        </div>

        <div className="relative z-10" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-20" />
          <Input 
            placeholder={mounted ? safeT('search_placeholder') : 'Search services or vendors...'} 
            className="pl-12 h-14 bg-white border-none rounded-[20px] shadow-2xl relative z-10 focus-visible:ring-primary/20 text-sm font-medium" 
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                addToRecentSearches(searchQuery);
                setIsSearchFocused(false);
              }
            }}
          />
          {isSearchFocused && recentSearches.length > 0 && (
            <Card className="absolute top-16 left-0 right-0 z-30 mt-2 p-2 rounded-[24px] border-none shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 bg-white/95 backdrop-blur-md">
              <div className="flex justify-between items-center px-3 py-2 border-b border-muted">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent Searches</p>
                <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="h-6 text-[10px] font-bold text-muted-foreground hover:text-destructive hover:bg-transparent">
                  Clear All
                </Button>
              </div>
              <div className="py-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(term);
                      addToRecentSearches(term);
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-surface rounded-xl transition-colors text-left group"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-bold text-foreground/80">{term}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </header>

      <main className="px-6 py-8 space-y-12">
        {!searchQuery && (
          <>
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="text-xl font-bold">Featured Partners</h3>
              </div>
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {featuredAds.map((ad) => (
                    <CarouselItem key={ad.id} className="pl-4 basis-[90%] md:basis-[45%]">
                      <Card 
                        onClick={() => router.push(`/customer/${ad.type}/${ad.targetId}`)}
                        className={cn(
                          "relative h-48 overflow-hidden border-none shadow-lg rounded-[32px] cursor-pointer group active:scale-[0.98] transition-all",
                          ad.color
                        )}
                      >
                        <Image 
                          src={ad.image} 
                          alt={ad.name} 
                          fill 
                          className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                          data-ai-hint={ad.category.toLowerCase()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Badge className="bg-yellow-400 text-black border-none text-[9px] font-black tracking-widest px-2 py-0.5">
                              FEATURED
                            </Badge>
                          </div>
                          
                          <h4 className="text-xl font-black text-white leading-tight">{ad.name}</h4>
                          <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider mb-1">{ad.category}</p>
                          <p className="text-white/90 text-xs font-medium line-clamp-1 italic">"{ad.tagline}"</p>
                          
                          <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-[10px] font-bold text-white">{ad.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                              <MapPin className="w-3 h-3 text-white" />
                              <span className="text-[10px] font-bold text-white">{ad.distance}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-6">
                           <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 group-hover:bg-white group-hover:text-black transition-colors">
                              <ArrowRight className="w-4 h-4 text-white group-hover:text-black" />
                           </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold px-1">{mounted ? safeT('service_providers') : 'Service Providers'}</h3>
              <div className="bg-gradient-to-br from-primary via-primary to-emerald-900 p-8 rounded-[32px] shadow-xl relative overflow-hidden group/sp">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover/sp:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl opacity-50" />
                <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="grid grid-cols-3 gap-y-8 gap-x-4 relative z-10">
                  {CATEGORIES.map((cat) => {
                    const colors = CATEGORY_COLORS[cat] || { stroke: 'text-primary', fill: '#F3F4F6' };
                    return (
                      <div 
                        key={cat}
                        onClick={() => {
                          setSearchQuery(cat);
                          addToRecentSearches(cat);
                        }}
                        className="flex flex-col items-center gap-3 group cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg active:scale-95">
                          {/* We use an icon component or logic here, but standardizing categor icons for now */}
                          <div className={cn("w-8 h-8", colors.stroke)}>
                             <Users className="w-full h-full" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-center text-white/90 uppercase tracking-wider">{cat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold px-1">{mounted ? safeT('local_vendors') : 'Local Vendors'}</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                {vendorCategories.map((vendor) => (
                  <Card 
                    key={vendor.name} 
                    onClick={() => {
                      setSearchQuery(vendor.name);
                      addToRecentSearches(vendor.name);
                    }}
                    className="shrink-0 w-40 p-0 overflow-hidden border-none shadow-md rounded-[24px] cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="h-32 relative">
                      <Image 
                        src={vendor.img || 'https://picsum.photos/seed/vendor/400/300'} 
                        alt={vendor.name} 
                        fill
                        className="object-cover"
                        data-ai-hint={vendor.hint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <Store className="w-3 h-3 text-white" />
                        <span className="text-white text-[10px] font-bold">{vendor.name}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="px-1">
              <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white rounded-[32px] shadow-2xl group">
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">PREMIUM UPGRADE</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight leading-none">Muawin <span className="text-yellow-400">PRO</span></h2>
                    <p className="text-slate-300 text-sm font-medium max-w-[220px]">Unlock elite features and save more on every task.</p>
                  </div>

                  <ul className="space-y-2">
                    {[
                      'Priority Matching (~2 mins)',
                      'Zero Platform Service Fees',
                      'Premium Insurance Cover',
                      'Exclusive Expert Access'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-200">
                        <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-slate-900 stroke-[4px]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={handleUpgradePro}
                    disabled={isUpgrading}
                    className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black rounded-2xl shadow-lg shadow-yellow-400/20 group-hover:scale-[1.02] transition-transform"
                  >
                    {isUpgrading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Upgrade Now'}
                    {!isUpgrading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </div>

                <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700">
                   <Trophy className="w-40 h-48 text-white" />
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold">Top Rated Pros Nearby</h3>
                </div>
                <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">4.9+ Stars</Badge>
              </div>
              <div className="space-y-4">
                {topRatedItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="p-4 muawin-card flex gap-4 bg-white border-none shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => router.push(`/customer/${item.type}/${item.id}`)}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-secondary overflow-hidden shrink-0 relative">
                      <Image 
                        src={item.type === 'vendor' ? (PlaceHolderImages.find(p => p.id === item.seed)?.imageUrl || `https://picsum.photos/seed/${item.id}/200/200`) : `https://picsum.photos/seed/${item.id}/200/200`} 
                        alt={item.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full text-[9px] font-bold text-yellow-700">
                          <Star className="w-2.5 h-2.5 fill-yellow-700" /> {item.rating}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-medium">{item.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-primary font-bold">Verified</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Service Providers Nearby</h3>
              </div>
              <div className="space-y-4">
                {topRatedPros.map((pro) => (
                  <Card 
                    key={pro.id} 
                    className="p-4 muawin-card flex gap-4 bg-white border-none shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => router.push(`/customer/provider/${pro.id}`)}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-secondary overflow-hidden shrink-0 relative">
                      <Image src={`https://picsum.photos/seed/${pro.id}/200/200`} alt={pro.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-sm">{pro.name}</h4>
                        <span className="text-[10px] text-primary font-bold">{pro.distance}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">{pro.category} • {pro.exp} yrs exp</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold">{pro.rating}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Store className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Vendors Nearby</h3>
              </div>
              <div className="space-y-4">
                {mockVendors.map((vendor) => (
                  <Card 
                    key={vendor.id} 
                    className="p-4 muawin-card flex gap-4 bg-white border-none shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => router.push(`/customer/vendor/${vendor.id}`)}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-secondary overflow-hidden shrink-0 relative">
                      <Image 
                        src={PlaceHolderImages.find(p => p.id === vendor.seed)?.imageUrl || `https://picsum.photos/seed/${vendor.id}/200/200`} 
                        alt={vendor.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-sm">{vendor.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-bold">{vendor.distance}</span>
                      </div>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">{vendor.category}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] font-bold">{vendor.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-green-200 text-green-600 bg-green-50">OPEN</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {searchQuery && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Results for "{searchQuery}"</h3>
            <div className="space-y-6">
              {filteredPros.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Pros Found</p>
                  {filteredPros.map((pro) => (
                    <Card 
                      key={pro.id} 
                      className="p-4 muawin-card flex gap-4 bg-white border-none shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                      onClick={() => router.push(`/customer/provider/${pro.id}`)}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-secondary overflow-hidden shrink-0 relative">
                        <Image src={`https://picsum.photos/seed/${pro.id}/200/200`} alt={pro.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm">{pro.name}</h4>
                            <p className="text-[11px] text-muted-foreground">{pro.category} • {pro.exp} yrs exp</p>
                          </div>
                          <span className="text-[10px] text-primary font-bold">{pro.distance}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold">{pro.rating}</span>
                          </div>
                          <span className="text-xs font-bold text-primary">Rs. {pro.price}/hr</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {filteredVendors.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Vendors Found</p>
                  {filteredVendors.map((vendor) => (
                    <Card 
                      key={vendor.id} 
                      className="p-4 muawin-card flex gap-4 bg-white border-none shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                      onClick={() => router.push(`/customer/vendor/${vendor.id}`)}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-secondary overflow-hidden shrink-0 relative">
                        <Image src={PlaceHolderImages.find(p => p.id === vendor.seed)?.imageUrl || `https://picsum.photos/seed/${vendor.id}/200/200`} alt={vendor.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm">{vendor.name}</h4>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{vendor.category}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-bold">{vendor.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] font-bold">{vendor.rating}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {filteredPros.length === 0 && filteredVendors.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <SearchX className="w-12 h-12" />
                  <p className="font-bold">No results found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
