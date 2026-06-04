'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Star,
  ChevronRight,
  History,
  Banknote,
  Clock,
  Check,
  SearchX
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortType = 'latest' | 'oldest' | 'rating';

export default function ProviderHistoryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('latest');

  const jobs = [
    { 
      id: '48120', 
      customer: 'Sarah Khan', 
      date: '2024-10-24', 
      dateLabel: 'Oct 24, 2024',
      amount: 'Rs. 1,200', 
      rating: 5.0, 
      location: 'DHA Phase 5, Lahore', 
      status: 'Completed',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      category: 'Driver'
    },
    { 
      id: '48095', 
      customer: 'Omar Ali', 
      date: '2024-10-22', 
      dateLabel: 'Oct 22, 2024',
      amount: 'Rs. 2,500', 
      rating: 4.8, 
      location: 'Model Town, Lahore', 
      status: 'Completed',
      avatar: 'https://picsum.photos/seed/user12/100/100',
      category: 'Driver'
    },
    { 
      id: '48012', 
      customer: 'Zeeshan Malik', 
      date: '2024-10-19', 
      dateLabel: 'Oct 19, 2024',
      amount: 'Rs. 1,800', 
      rating: 5.0, 
      location: 'Gulberg III, Lahore', 
      status: 'Completed',
      avatar: 'https://picsum.photos/seed/pro2/100/100',
      category: 'Driver'
    },
  ];

  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs.filter(job => 
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.includes(searchQuery)
    );

    result.sort((a, b) => {
      if (sortType === 'latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortType === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortType === 'rating') return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [searchQuery, sortType]);

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Header - Non-sticky */}
      <header className="bg-primary px-6 pt-12 pb-10 space-y-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="animate-in fade-in slide-in-from-left-4">
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">Job History</h1>
              <p className="text-primary-foreground/70 font-medium text-xs mt-1">Review your past earnings</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
            <History className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-6 bottom-4 opacity-10 rotate-12">
          <History className="w-32 h-32 text-white" />
        </div>
      </header>

      <main className="px-6 -mt-6 space-y-6 relative z-20">
        {/* Search & Filter Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers or Job IDs..." 
              className="pl-11 h-14 bg-white border-none rounded-2xl shadow-xl shadow-primary/5 focus-visible:ring-primary/20" 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  "h-14 w-14 rounded-2xl border-none shadow-xl transition-all active:scale-95",
                  sortType !== 'latest' ? "bg-primary text-white" : "bg-white text-primary"
                )}
              >
                <Filter className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48 shadow-xl border-secondary/20">
              <DropdownMenuItem 
                onClick={() => setSortType('latest')}
                className={cn(
                  "rounded-xl py-3 px-3 flex items-center justify-between cursor-pointer",
                  sortType === 'latest' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-sm">Latest First</span>
                {sortType === 'latest' && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortType('oldest')}
                className={cn(
                  "rounded-xl py-3 px-3 flex items-center justify-between cursor-pointer",
                  sortType === 'oldest' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-sm">Oldest First</span>
                {sortType === 'oldest' && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortType('rating')}
                className={cn(
                  "rounded-xl py-3 px-3 flex items-center justify-between cursor-pointer",
                  sortType === 'rating' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-sm">Highest Rated</span>
                {sortType === 'rating' && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredAndSortedJobs.length > 0 ? (
            filteredAndSortedJobs.map((job, idx) => (
              <Card 
                key={job.id} 
                className="p-0 border-none bg-white shadow-xl shadow-primary/[0.03] rounded-[28px] overflow-hidden group hover:shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/20 overflow-hidden border-2 border-white shadow-md">
                        <img src={job.avatar} alt={job.customer} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground leading-none">{job.customer}</h4>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1.5">{job.category}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className="text-sm font-black text-primary">{job.amount}</span>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-yellow-700">{job.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 p-3.5 bg-surface rounded-2xl border border-secondary/10 shadow-inner group-hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-secondary/5">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-[11px] font-bold text-foreground/70 truncate">{job.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-secondary/5">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-[11px] font-bold text-foreground/70">{job.dateLabel}</p>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 font-black px-3 h-6 text-[9px] uppercase tracking-widest">
                      {job.status}
                    </Badge>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter opacity-40">
                      ID: #{job.id}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-xl px-4 h-9 group/btn"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl">
                <SearchX className="w-12 h-12 text-primary/30" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-xl text-foreground">No matches found</p>
                <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                  We couldn't find any past jobs matching "{searchQuery}".
                </p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSearchQuery('')}
                className="text-primary font-bold"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {filteredAndSortedJobs.length > 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-1000">
            <div className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">End of History</p>
              <p className="text-[10px] text-muted-foreground italic">Showing your last {filteredAndSortedJobs.length} completed tasks</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-secondary/10">
              <Clock className="w-5 h-5 text-primary/30" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
