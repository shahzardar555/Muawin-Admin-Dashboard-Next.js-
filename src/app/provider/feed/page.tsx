
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  ShieldCheck,
  Star,
  Zap,
  AlertCircle,
  Inbox,
  AlertTriangle,
  ChevronDown,
  Clock,
  Moon,
  CheckCircle2,
  Banknote,
  MessageCircle,
  X,
  UserCheck,
  Globe,
  Trophy,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type ProviderStatus = 'available' | 'busy' | 'namaz' | 'offline';

const STATUS_CONFIG: Record<ProviderStatus, { label: string, color: string, dot: string, icon: any }> = {
  available: { label: 'Available', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-green-400', icon: CheckCircle2 },
  busy: { label: 'Busy', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-amber-400', icon: Clock },
  namaz: { label: 'Namaz Break', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-blue-400', icon: Moon },
  offline: { label: 'Offline', color: 'bg-white/20 text-white border-white/20 backdrop-blur-sm', dot: 'bg-slate-400', icon: AlertCircle },
};

export default function ProviderFeedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [status, setStatus] = useState<ProviderStatus>('available');
  const [isPromoting, setIsPromoting] = useState(false);

  // Negotiation states
  const [negotiatingJob, setNegotiatingJob] = useState<any>(null);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [negotiationTime, setNegotiationTime] = useState('');

  // Simulated provider data
  const providerCategory = 'Driver'; 

  const [allJobs, setAllJobs] = useState([
    { 
      id: '48291', 
      customer: 'Sarah K.', 
      category: 'Driver', 
      distance: '1.2 km', 
      time: '10:30 AM', 
      proposedPrice: 'Rs. 1,500',
      location: 'DHA Phase 5, Lahore', 
      detail: 'I saw your profile and really liked your reviews. Can you please help me with an airport drop-off?',
      isHighPriority: true 
    },
    { 
      id: '48295', 
      customer: 'Omar Ali', 
      category: 'Driver', 
      distance: '3.5 km', 
      time: 'Tomorrow, 10:00 AM', 
      proposedPrice: 'Rs. 1,200',
      location: 'Model Town, Lahore', 
      detail: 'Pickup and drop service for children to school. Daily morning shift required.',
      isHighPriority: false 
    },
    { 
      id: '48301', 
      customer: 'Zubair H.', 
      category: 'Driver', 
      distance: '0.8 km', 
      time: 'Today, 02:00 PM', 
      proposedPrice: 'Rs. 2,000',
      location: 'Gulberg III, Lahore', 
      detail: 'Urgent airport transfer needed for a family of four.',
      isHighPriority: false 
    },
    { 
      id: '48305', 
      customer: 'Maria B.', 
      category: 'Tutor', 
      distance: '5.2 km', 
      time: 'Monday, 04:00 PM', 
      proposedPrice: 'Rs. 3,000',
      location: 'Johar Town, Lahore', 
      detail: 'Grade 8 Mathematics home tutoring.',
      isHighPriority: false
    },
  ]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => job.category === providerCategory);
  }, [allJobs, providerCategory]);

  const handleAccept = (jobId: string) => {
    const job = allJobs.find(j => j.id === jobId);
    setAllJobs(prev => prev.filter(j => j.id !== jobId));
    toast({
      title: "Job Accepted!",
      description: `${job?.customer}'s request has been added to My Jobs.`,
    });
  };

  const handlePromoteProfile = () => {
    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      toast({
        title: "Profile Promoted!",
        description: "Your profile is now featured at the top of local search results.",
      });
    }, 1500);
  };

  const handleDecline = (jobId: string) => {
    setAllJobs(prev => prev.filter(j => j.id !== jobId));
    toast({
      title: "Request Declined",
      description: "The request has been removed from your feed.",
      variant: "destructive"
    });
  };

  const handleNegotiateClick = (job: any) => {
    setNegotiatingJob(job);
    setNegotiationPrice(job.proposedPrice.replace(/[^0-9]/g, ''));
    setNegotiationTime(job.time);
  };

  const submitNegotiation = () => {
    if (!negotiatingJob) return;
    
    toast({
      title: "Negotiation Offer Sent",
      description: `Offered Rs. ${negotiationPrice} at ${negotiationTime} to ${negotiatingJob.customer}.`,
    });
    
    setNegotiatingJob(null);
  };

  const currentStatus = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen bg-surface pb-24 max-w-md mx-auto">
      <header className="bg-primary px-6 pt-12 pb-8 space-y-6 rounded-b-[32px] shadow-lg relative">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all shadow-sm h-10 w-10 mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-white/20 overflow-hidden shrink-0 relative">
              <img src="https://picsum.photos/seed/provider/100/100" alt="Profile" />
              <div className={cn(
                "absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full",
                status === 'available' ? 'bg-green-500' : 
                status === 'busy' ? 'bg-amber-500' : 
                status === 'namaz' ? 'bg-blue-500' : 'bg-slate-500'
              )} />
            </div>
            <div>
              <h4 className="font-bold flex items-center text-white text-sm">Ahmed Hassan <ShieldCheck className="w-3.5 h-3.5 ml-1 text-white/70" /></h4>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-bold text-white/90">4.9 (124)</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn("rounded-2xl h-12 px-4 font-bold border flex flex-col items-center justify-center gap-0.5 transition-all", currentStatus.color)}>
                <span className="text-[8px] uppercase tracking-[0.2em] opacity-70 leading-none">STATUS</span>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", status === 'available' ? 'bg-green-400' : status === 'busy' ? 'bg-amber-400' : status === 'namaz' ? 'bg-blue-400' : status === 'namaz' ? 'bg-blue-400' : status === 'bg-slate-400')} />
                  <span className="text-xs">{currentStatus.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48 shadow-xl border-secondary/20">
              {(Object.keys(STATUS_CONFIG) as ProviderStatus[]).map((s) => {
                const config = STATUS_CONFIG[s];
                const dotColor = s === 'available' ? 'bg-green-500' : s === 'busy' ? 'bg-amber-500' : s === 'namaz' ? 'bg-blue-500' : 'bg-slate-500';
                return (
                  <DropdownMenuItem 
                    key={s} 
                    onClick={() => setStatus(s)}
                    className={cn(
                      "rounded-xl py-3 px-3 flex items-center gap-3 cursor-pointer",
                      status === s ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", dotColor)} />
                    <span className="text-sm">{config.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm relative z-10">
          <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Showing Job Alerts for:</p>
          <Badge className="bg-white text-primary text-[10px] font-black hover:bg-white">{providerCategory}</Badge>
        </div>

        {status === 'offline' && (
          <div className="bg-red-50/10 backdrop-blur-sm border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 relative z-10">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-[11px] font-bold text-white leading-tight">
              You are currently Offline. You won't receive any new job alerts until you go back to Available.
            </p>
          </div>
        )}
      </header>

      <main className="p-6 space-y-8">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold">{t('new_requests')}</h3>
          {status === 'available' && filteredJobs.length > 0 && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-500">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span className="text-xs font-bold text-primary">
                {filteredJobs.length} Available
              </span>
            </div>
          )}
        </div>

        {/* Premium Ad Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 p-8 text-white rounded-[32px] shadow-2xl group">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">PRO PROMOTION</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight leading-none">Get <span className="text-yellow-400">Featured</span></h2>
                <p className="text-blue-100 text-sm font-medium max-w-[220px]">Stand out from the crowd and get up to 5x more job requests.</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">Rs. 99</span>
                <span className="text-sm font-bold text-blue-200">/ per day</span>
              </div>

              <ul className="space-y-2">
                {[
                  'Top position in search results',
                  '"Featured" badge on your profile',
                  'Priority alerts for new jobs',
                  'Professional profile review'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-blue-50">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-indigo-900 stroke-[4px]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={handlePromoteProfile}
                disabled={isPromoting}
                className="w-full h-14 bg-white hover:bg-white/90 text-indigo-900 font-black rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform"
              >
                {isPromoting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Promote My Profile'}
                {!isPromoting && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </div>

            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700">
               <Trophy className="w-40 h-48 text-white" />
            </div>
          </Card>
        </section>

        {/* Job List */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <Card 
                key={job.id} 
                className={cn(
                  "muawin-card p-0 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2 duration-500",
                  job.isHighPriority 
                    ? "border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/20 shadow-lg shadow-amber-100" 
                    : "border-primary/10 hover:border-primary/40 bg-white shadow-sm"
                )}
              >
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
                        job.isHighPriority ? "bg-amber-500 text-white" : "bg-primary/20 text-primary"
                      )}>
                        {job.isHighPriority ? <UserCheck className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base leading-none">{job.customer}</h4>
                            {job.isHighPriority && (
                              <div className="bg-amber-600 text-white text-[8px] h-4 uppercase tracking-tighter px-1.5 font-black flex items-center justify-center rounded-full">
                                High Priority
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">ID: #{job.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-bold",
                        job.isHighPriority ? "text-amber-600" : "text-primary"
                      )}>{job.distance}</p>
                    </div>
                  </div>

                  <p className={cn(
                    "text-xs leading-relaxed line-clamp-2",
                    job.isHighPriority ? "text-amber-900 font-medium" : "text-muted-foreground"
                  )}>{job.detail}</p>

                  <div className="grid grid-cols-1 gap-2">
                    <div className={cn(
                      "flex items-center gap-2 text-[11px] font-bold p-2.5 rounded-xl border transition-colors",
                      job.isHighPriority 
                        ? "bg-white border-amber-200 text-amber-700 shadow-sm" 
                        : "bg-surface border-secondary/20 text-foreground"
                    )}>
                      <MapPin className={cn("w-3.5 h-3.5", job.isHighPriority ? "text-amber-500" : "text-primary")} />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className={cn(
                        "flex-1 flex items-center gap-2 text-[11px] font-bold p-2.5 rounded-xl border transition-colors",
                        job.isHighPriority 
                          ? "bg-white border-amber-200 text-amber-700 shadow-sm" 
                          : "bg-surface border-secondary/20 text-foreground"
                      )}>
                        <Clock className={cn("w-3.5 h-3.5", job.isHighPriority ? "text-amber-500" : "text-primary")} />
                        <span className="truncate">{job.time}</span>
                      </div>
                      <div className={cn(
                        "flex-1 flex items-center gap-2 text-[11px] font-bold p-2.5 rounded-xl border transition-colors",
                        job.isHighPriority 
                          ? "bg-white border-amber-200 text-amber-700 shadow-sm" 
                          : "bg-primary/10 border-primary/20 text-primary"
                      )}>
                        <Banknote className={cn("w-3.5 h-3.5", job.isHighPriority ? "text-amber-500" : "text-primary")} />
                        <span className="truncate">{job.proposedPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={cn(
                  "flex border-t",
                  job.isHighPriority ? "border-amber-200" : "border-border"
                )}>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDecline(job.id)}
                    className={cn(
                      "flex-1 h-12 rounded-none border-r font-bold transition-colors",
                      job.isHighPriority 
                        ? "border-amber-200 text-amber-600 hover:bg-amber-100" 
                        : "border-border text-muted-foreground hover:bg-red-50 hover:text-red-500"
                    )}
                  >
                    {t('decline')}
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => handleNegotiateClick(job)}
                    className={cn(
                      "flex-1 h-12 rounded-none border-r font-bold transition-colors hover:bg-primary/5",
                      job.isHighPriority ? "text-amber-600 hover:bg-amber-50" : "text-primary"
                    )}
                  >
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    {t('negotiate')}
                  </Button>
                  <Button 
                    onClick={() => handleAccept(job.id)}
                    className={cn(
                      "flex-1 h-12 rounded-none font-bold transition-all",
                      job.isHighPriority 
                        ? "bg-amber-500 hover:bg-amber-600 text-white active:scale-95" 
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {t('accept_job')}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center space-y-4 opacity-40">
              <Inbox className="w-16 h-16 mx-auto" />
              <p className="font-bold">No new job requests for {providerCategory}.</p>
              <p className="text-xs">We'll notify you as soon as a customer posts a {providerCategory} job in your area.</p>
            </div>
          )}
        </div>
      </main>

      {/* Negotiation Dialog */}
      <Dialog open={!!negotiatingJob} onOpenChange={() => setNegotiatingJob(null)}>
        <DialogContent className="rounded-[32px] w-[90%] max-w-md p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Negotiate Offer
            </DialogTitle>
            <DialogDescription className="text-xs">
              Propose a new price or time to {negotiatingJob?.customer} for Job #{negotiatingJob?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Proposed Price (Rs.)</Label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input 
                  type="number" 
                  value={negotiationPrice}
                  onChange={(e) => setNegotiationPrice(e.target.value)}
                  placeholder="e.g. 1500" 
                  className="rounded-2xl h-14 pl-12 bg-surface border-none shadow-inner text-lg font-bold focus-visible:ring-primary/30"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic px-1">Customer's budget: {negotiatingJob?.proposedPrice}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Proposed Time</Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input 
                  value={negotiationTime}
                  onChange={(e) => setNegotiationTime(e.target.value)}
                  placeholder="e.g. Today, 03:00 PM" 
                  className="rounded-2xl h-14 pl-12 bg-surface border-none shadow-inner font-semibold focus-visible:ring-primary/30"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic px-1">Customer's preference: {negotiatingJob?.time}</p>
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-2xl h-14 font-bold border border-secondary/30"
              onClick={() => setNegotiatingJob(null)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-2xl h-14 font-bold shadow-lg"
              onClick={submitNegotiation}
              disabled={!negotiationPrice || !negotiationTime}
            >
              Send Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
