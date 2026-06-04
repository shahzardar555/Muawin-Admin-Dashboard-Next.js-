
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { 
  Store, 
  Star,
  ShieldCheck,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Moon,
  XCircle,
  ChevronDown,
  MessageSquareQuote,
  Reply,
  Send,
  Loader2,
  Bell,
  CheckCheck,
  Trash2,
  Info,
  PhoneIncoming,
  MessageSquare,
  ShoppingBag,
  Check,
  ArrowRight,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type VendorStatus = 'open' | 'busy' | 'break' | 'closed';

const STATUS_CONFIG: Record<VendorStatus, { label: string, color: string, dot: string, icon: any }> = {
  open: { label: 'Open', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-green-400', icon: CheckCircle2 },
  busy: { label: 'Busy', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-amber-400', icon: Clock },
  break: { label: 'Break', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-blue-400', icon: Moon },
  closed: { label: 'Closed', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-slate-400', icon: XCircle },
};

type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
};

type Notification = {
  id: string;
  type: 'call' | 'chat' | 'app';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export default function VendorHomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [status, setStatus] = useState<VendorStatus>('open');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'call', title: 'Missed Call', message: 'Customer Ali Raza tried calling you regarding a price inquiry.', time: '2 mins ago', read: false },
    { id: '2', type: 'chat', title: 'New Message', message: 'Sara Khan sent a message about product availability.', time: '15 mins ago', read: false },
    { id: '3', type: 'app', title: 'Weekly Report', message: 'Your business summary for last week is ready to view.', time: '2 hours ago', read: true },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', user: 'Ali Raza', rating: 5, comment: 'Always fresh and high quality. Great service!', date: '1 day ago' },
    { id: '2', user: 'Sara Khan', rating: 4, comment: 'Very reliable vendor. The store is well organized.', date: '3 days ago', reply: 'Thank you Sara! We strive to keep our store tidy for our valued customers.' },
    { id: '3', user: 'Zubair H.', rating: 5, comment: 'Quick response and reasonable prices.', date: '1 week ago' },
  ]);

  const currentStatus = STATUS_CONFIG[status];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handlePromoteStore = () => {
    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      toast({
        title: "Store Promoted!",
        description: "Your shop is now listed at the top of local searches for customers.",
      });
    }, 1500);
  };

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    
    setIsSubmittingReply(true);
    setTimeout(() => {
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, reply: replyText.trim() } : r
      ));
      setReplyingTo(null);
      setReplyText('');
      setIsSubmittingReply(false);
      toast({
        title: "Reply Sent",
        description: "Your response has been posted successfully.",
      });
    }, 1000);
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'call': return <PhoneIncoming className="w-5 h-5 text-red-500" />;
      case 'chat': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Vendor Header - Non-sticky */}
      <header className="bg-primary px-6 pt-12 pb-10 space-y-6 rounded-b-[40px] shadow-xl border-b border-primary/20 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all shadow-sm h-10 w-10 mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white/20 overflow-hidden shrink-0 relative flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-primary" />
              <div className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full",
                currentStatus.dot === 'bg-green-400' ? 'bg-green-500' : 
                currentStatus.dot === 'bg-amber-400' ? 'bg-amber-500' :
                currentStatus.dot === 'bg-blue-400' ? 'bg-blue-500' : 'bg-slate-400'
              )} />
            </div>
            <div>
              <h4 className="font-bold flex items-center text-white text-lg leading-none">Metro Supermarket <ShieldCheck className="w-4 h-4 ml-1.5 text-white/70" /></h4>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] font-bold text-white/90">4.8 (2.4k reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={isNotifOpen} onOpenChange={setIsNotifOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/10 w-12 h-12 hover:bg-white/30 transition-all">
                    <Bell className="w-6 h-6 text-white" />
                  </Button>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-primary font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary shadow-sm animate-in zoom-in duration-300">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[80vh]">
                <SheetHeader className="mb-6 flex flex-row items-center justify-between">
                  <SheetTitle className="text-xl font-bold">Business Alerts</SheetTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleReadAll} className="text-xs font-bold text-primary h-8 hover:bg-primary/5">
                      <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark Read
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs font-bold text-destructive h-8 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                  </div>
                </SheetHeader>
                <div className="space-y-4 overflow-y-auto max-h-[60vh] no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Card key={notif.id} className={cn(
                        "p-4 border-none shadow-sm rounded-2xl flex gap-3 transition-all",
                        notif.read ? "bg-muted/50 opacity-70" : "bg-white ring-1 ring-primary/5 border-l-4 border-l-primary"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          notif.read ? "bg-muted" : "bg-surface shadow-sm"
                        )}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-sm">{notif.title}</h4>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{notif.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium">{notif.message}</p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="font-bold text-sm">All caught up!</p>
                      <p className="text-xs">No new notifications for your store.</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn("rounded-2xl h-12 px-4 font-bold border flex flex-col items-center justify-center gap-0.5 transition-all", currentStatus.color)}>
                  <span className="text-[8px] uppercase tracking-[0.2em] opacity-70 leading-none">STATUS</span>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", currentStatus.dot)} />
                    <span className="text-xs">{currentStatus.label}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48 shadow-xl border-secondary/20">
                {(Object.keys(STATUS_CONFIG) as VendorStatus[]).map((s) => {
                  const config = STATUS_CONFIG[s];
                  return (
                    <DropdownMenuItem 
                      key={s} 
                      onClick={() => setStatus(s)}
                      className={cn(
                        "rounded-xl py-3 px-3 flex items-center gap-3 cursor-pointer",
                        status === s ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", config.dot.replace('400', '500'))} />
                      <span className="text-sm">{config.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-left-4 flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Vendor Hub</h1>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Store Management Dashboard</p>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-8 space-y-8 relative z-10">
        {/* Welcome Card */}
        <Card className="p-6 muawin-card border-none bg-white shadow-xl space-y-4">
          <div className="flex items-center gap-3">
             <div className={cn(
               "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
               status === 'open' ? "bg-green-100 text-green-600" :
               status === 'busy' ? "bg-amber-100 text-amber-600" :
               status === 'break' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
             )}>
                {<currentStatus.icon className="w-6 h-6" />}
             </div>
             <div>
               <h2 className="text-xl font-bold">Store is {currentStatus.label}</h2>
               <p className="text-xs text-muted-foreground font-medium">Update your status to manage visibility</p>
             </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-dashed border-border">
            Manage your store availability and profile from this central hub. Use the navigation bar below to access chats and settings.
          </p>
        </Card>

        {/* Vendor Promotion Advertisement */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-teal-600 via-emerald-700 to-teal-900 p-8 text-white rounded-[32px] shadow-2xl group">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">VENDOR PROMOTION</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight leading-none">Boost Your <span className="text-yellow-400">Sales</span></h2>
                <p className="text-teal-100 text-sm font-medium max-w-[220px]">Appear at the top of local searches and get more customers today.</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">Rs. 99</span>
                <span className="text-sm font-bold text-teal-200">/ per day</span>
              </div>

              <ul className="space-y-2">
                {[
                  '#1 Spot in Vendor listings',
                  '"Verified Partner" gold badge',
                  'Priority inquiries',
                  'Unlimited customer chat access'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-teal-50">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-teal-900 stroke-[4px]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={handlePromoteStore}
                disabled={isPromoting}
                className="w-full h-14 bg-white hover:bg-white/90 text-teal-900 font-black rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform"
              >
                {isPromoting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Promote My Store'}
                {!isPromoting && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </div>

            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700">
               <Trophy className="w-40 h-48 text-white" />
            </div>
          </Card>
        </section>

        {/* Reviews Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
            </div>
            <Button variant="link" size="sm" className="text-primary font-bold text-xs h-auto p-0">View All</Button>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4 bg-white border-none shadow-sm rounded-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-none">{review.user}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold text-yellow-700">{review.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "{review.comment}"
                </p>
                
                {review.reply ? (
                  <div className="mt-3 p-3 bg-secondary/10 rounded-xl border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Your Reply</span>
                    </div>
                    <p className="text-[11px] text-foreground/80 leading-relaxed font-medium">
                      {review.reply}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    {replyingTo === review.id ? (
                      <div className="w-full space-y-2 mt-2 animate-in slide-in-from-top-2">
                        <Textarea 
                          placeholder="Write your professional response..."
                          className="min-h-[80px] rounded-xl text-xs bg-surface border-secondary/30 focus-visible:ring-primary/30"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-lg text-[10px] font-bold"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            disabled={!replyText.trim() || isSubmittingReply}
                            className="h-8 rounded-lg text-[10px] font-bold"
                            onClick={() => handleSendReply(review.id)}
                          >
                            {isSubmittingReply ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 rounded-lg text-primary font-bold text-[10px] hover:bg-primary/5"
                        onClick={() => setReplyingTo(review.id)}
                      >
                        <Reply className="w-3 h-3 mr-1.5" />
                        Reply to Review
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
