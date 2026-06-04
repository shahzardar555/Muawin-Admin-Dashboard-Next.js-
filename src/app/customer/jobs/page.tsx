'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  MapPin, 
  ChevronRight, 
  CheckCircle2,
  Brush,
  Star,
  Calendar as CalendarLucide,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CalendarDays,
  MessageSquare,
  Phone,
  ArrowRight,
  Info,
  Banknote,
  User,
  History,
  ArrowLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function MyJobsPage() {
  const router = useRouter();
  const { t, mounted } = useLanguage();
  const { toast } = useToast();

  const [jobs, setJobs] = useState([
    { 
      id: '48291', 
      category: 'Maid', 
      date: 'Today', 
      status: 'In Progress', 
      time: 'Started 15m ago', 
      startTime: '10:15 AM',
      location: 'House #42, Block L, Gulberg III, Lahore',
      description: 'Deep cleaning of the living room and kitchen area including windows and upholstery.',
      price: 'Est. Rs 1200', 
      rated: false,
      provider: {
        name: 'Sarah K.',
        avatar: 'https://picsum.photos/seed/pro2/100/100',
        rating: 4.8,
        phone: '+923001234567'
      }
    },
    { 
      id: '48302', 
      category: 'Gardener', 
      date: 'Oct 26, 2024', 
      status: 'Scheduled', 
      time: '09:00 AM', 
      location: 'DHA Phase 5, Lahore',
      description: 'Lawn trimming and seasonal flower plantation in the front backyard.',
      price: 'Est. Rs 2000', 
      rated: false,
      provider: {
        name: 'Bilal Khan',
        avatar: 'https://picsum.photos/seed/pro5/100/100',
        rating: 4.6,
        phone: '+923119876543'
      }
    },
    { 
      id: '48120', 
      category: 'Driver', 
      date: 'Oct 20, 2024', 
      status: 'Completed', 
      time: '03:30 PM', 
      location: 'Model Town, Lahore',
      description: 'Airport drop-off service.',
      price: 'Rs 1500', 
      rated: false,
      provider: {
        name: 'Ahmed Hassan',
        avatar: 'https://picsum.photos/seed/pro1/100/100',
        rating: 4.9,
        phone: '+923225556667'
      }
    },
  ]);

  // SOS State
  const [isSOSLoading, setIsSOSLoading] = useState<string | null>(null);

  // Job Details state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Rating states
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingJobId, setRatingJobId] = useState<string | null>(null);
  const [currentRating, setCurrentRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Complaint states
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [complaintJobId, setComplaintJobId] = useState<string | null>(null);
  const [complaintText, setComplaintText] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  const handleSOS = (jobId: string) => {
    setIsSOSLoading(jobId);
    setTimeout(() => {
      setIsSOSLoading(null);
      toast({
        title: "SOS Alert Activated",
        description: "Emergency services and your trusted contacts have been notified of your location.",
        variant: "destructive",
        className: "bg-red-600 text-white border-none shadow-2xl"
      });
    }, 2000);
  };

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleOpenRating = (jobId: string) => {
    setRatingJobId(jobId);
    setIsRatingOpen(true);
  };

  const handleSubmitRating = () => {
    if (!ratingJobId) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setJobs(prev => prev.map(job => 
        job.id === ratingJobId ? { ...job, rated: true } : job
      ));
      setIsSubmitting(false);
      setIsRatingOpen(false);
      setComment('');
      setCurrentRating(5);
      
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback! It helps our community grow.",
      });
    }, 1500);
  };

  const handleOpenComplaint = (jobId: string) => {
    setComplaintJobId(jobId);
    setIsComplaintOpen(true);
  };

  const handleSubmitComplaint = () => {
    if (!complaintText.trim()) return;
    
    setIsSubmittingComplaint(true);
    setTimeout(() => {
      setIsSubmittingComplaint(false);
      setIsComplaintOpen(false);
      setComplaintText('');
      
      toast({
        title: t('complaint_submitted'),
        description: t('complaint_desc'),
      });
    }, 1500);
  };

  if (!mounted) return null;

  const ongoingJobs = jobs.filter(j => j.status === 'In Progress' || j.status === 'Scheduled');
  const historyJobs = jobs.filter(j => j.status === 'Completed');

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Header Architecture */}
      <header className="bg-primary px-6 pt-12 pb-8 space-y-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10 text-white">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="animate-in fade-in slide-in-from-left-4">
            <h1 className="text-3xl font-black tracking-tight text-white leading-none">{t('my_jobs')}</h1>
            <p className="text-primary-foreground/80 font-medium text-xs mt-1">{t('track_tasks_desc') || 'Track your tasks and view job history'}</p>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10 rotate-12">
          <ClipboardList className="w-32 h-32 text-white" />
        </div>
      </header>

      <main className="px-6 -mt-6">
        <Tabs defaultValue="ongoing" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-white/80 backdrop-blur-md p-1.5 rounded-[20px] shadow-xl border border-white/20">
            <TabsTrigger 
              value="ongoing" 
              className="rounded-2xl h-full font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              {t('ongoing')}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-2xl h-full font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              {t('history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing" className="space-y-8 m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 'In Progress' Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </div>
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">In Progress</h3>
                </div>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-bold text-[10px]">Active Now</Badge>
              </div>
              
              {ongoingJobs.filter(j => j.status === 'In Progress').map(job => (
                <Card key={job.id} className="p-0 border-none bg-white shadow-xl rounded-[28px] overflow-hidden transition-all active:scale-[0.99] group">
                  <div className="p-5 space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center relative shadow-inner">
                          <Brush className="w-7 h-7 text-primary" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-sm" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-none">{job.category}</h4>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">ID: #{job.id}</p>
                        </div>
                      </div>
                      <Badge className="bg-primary text-primary-foreground border-none font-black px-3 h-6 text-[9px] uppercase tracking-[0.1em] rounded-full">
                        {job.status}
                      </Badge>
                    </div>

                    {/* Assigned Professional Profile Section */}
                    <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-secondary/20 shadow-sm relative group-hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
                          <img src={job.provider.avatar} alt={job.provider.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">Assigned Helper</p>
                          <h5 className="text-sm font-bold leading-tight">{job.provider.name}</h5>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold">{job.provider.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 bg-white shadow-sm hover:bg-primary hover:text-white transition-all active:scale-90" asChild>
                          <a href={`tel:${job.provider.phone}`}><Phone className="w-4 h-4" /></a>
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 bg-white shadow-sm hover:bg-primary hover:text-white transition-all active:scale-90" onClick={() => router.push(`/chat/${job.id}?name=${encodeURIComponent(job.provider.name)}&avatar=${encodeURIComponent(job.provider.avatar)}`)}>
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-surface px-3 py-2 rounded-xl border border-secondary/10">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate">{job.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-surface px-3 py-2 rounded-xl border border-secondary/10">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate">Gulberg III, Lahore</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-secondary/10">
                      <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Total Budget</span>
                          <span className="text-base font-black text-primary">{job.price}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(job)}
                          className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-full px-4 group/btn"
                        >
                          View Details <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                      
                      {/* High-Impact SOS Button */}
                      <Button 
                        variant="destructive" 
                        className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:scale-95 transition-all"
                        onClick={() => handleSOS(job.id)}
                        disabled={isSOSLoading === job.id}
                      >
                        {isSOSLoading === job.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ShieldAlert className="w-5 h-5" />
                        )}
                        {t('sos_emergency')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {ongoingJobs.filter(j => j.status === 'In Progress').length === 0 && (
                <div className="text-center py-8 bg-white/50 rounded-[28px] border border-dashed border-secondary/30">
                  <p className="text-xs text-muted-foreground font-bold italic">No active jobs at the moment.</p>
                </div>
              )}
            </div>

            {/* 'Scheduled' Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Scheduled</h3>
              </div>
              
              {ongoingJobs.filter(j => j.status === 'Scheduled').map(job => (
                <Card key={job.id} className="p-5 border-none bg-white/80 shadow-md rounded-[28px] space-y-4 relative overflow-hidden group">
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center shadow-inner">
                        <Brush className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base leading-none">{job.category}</h4>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">ID: #{job.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-black px-3 h-6 text-[9px] uppercase tracking-wide rounded-full">
                      {job.status}
                    </Badge>
                  </div>

                  {/* Provider Mini Info Box */}
                  <div className="flex items-center justify-between p-3 bg-surface/50 rounded-2xl border border-secondary/10 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                        <img src={job.provider.avatar} alt={job.provider.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-muted-foreground font-black uppercase">Confirmed Pro</span>
                        <span className="text-sm font-bold text-foreground/80">{job.provider.name}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary px-4 bg-white shadow-sm border border-secondary/10" onClick={() => router.push(`/chat/${job.id}?name=${encodeURIComponent(job.provider.name)}&avatar=${encodeURIComponent(job.provider.avatar)}`)}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 relative z-10 pt-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground px-1">
                      <CalendarLucide className="w-4 h-4 text-primary" />
                      <span>{job.date} at {job.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground px-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Gulberg III, Lahore</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-secondary/10 relative z-10">
                    <span className="text-sm font-black text-foreground/60">{job.price}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(job)}
                      className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-full px-4"
                    >
                      Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Empty State System */}
            {ongoingJobs.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 text-muted-foreground animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <ClipboardList className="w-12 h-12 text-primary/30" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg text-foreground">{t('no_active_jobs')}</p>
                  <p className="text-sm max-w-[200px] mx-auto leading-relaxed">When you book a service, it will appear here for you to track.</p>
                </div>
                <Button onClick={() => router.push('/customer/home')} className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest">Explore Services</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            {historyJobs.map(job => (
              <Card key={job.id} className="p-5 border-none bg-white shadow-lg rounded-[28px] space-y-5 group hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-primary/10 transition-colors">
                      <Brush className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-none">{job.category}</h4>
                      <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">ID: #{job.id}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-green-100 text-green-600 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> {t('completed')}
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 py-3 bg-surface rounded-2xl border border-secondary/10 shadow-inner">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <img src={job.provider.avatar} alt={job.provider.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter">Served By</p>
                    <p className="text-sm font-bold text-foreground/80 leading-none">{job.provider.name}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm border border-secondary/5">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold">{job.provider.rating}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-secondary/10">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Total Paid</span>
                    <span className="text-primary font-black text-lg">{job.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.rated ? (
                      <Badge variant="outline" className="h-12 px-6 rounded-2xl border-green-200 text-green-600 bg-green-50 gap-2 font-black text-[10px] uppercase tracking-widest">
                        <Star className="w-4 h-4 fill-green-600" /> Rated
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleOpenRating(job.id)}
                        className="rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-primary font-black h-12 px-8 shadow-md transition-all active:scale-95 flex items-center gap-2 uppercase text-[10px] tracking-widest"
                      >
                        <Star className="w-4 h-4 fill-primary" />
                        Rate
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-secondary/20 flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground font-bold">{job.date}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[9px] text-red-500 font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 px-4 h-9 rounded-xl"
                    onClick={() => handleOpenComplaint(job.id)}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-2" /> {t('register_complaint')}
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Job Details Overlay Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="rounded-[32px] w-[92%] max-w-md p-0 border-none shadow-2xl overflow-hidden outline-none">
          <div className="bg-primary p-6 text-white space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-2xl font-black">{selectedJob?.category}</DialogTitle>
                  <Badge className="bg-white/20 text-white border-none font-black text-[9px] uppercase tracking-widest h-5 px-2 rounded-full">
                    {selectedJob?.status}
                  </Badge>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Job ID: #{selectedJob?.id}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Info className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Assigned Professional</h4>
              <Card className="p-4 bg-surface border-none shadow-sm flex items-center justify-between rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md">
                    <img src={selectedJob?.provider.avatar} alt="Pro" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-base leading-none">{selectedJob?.provider.name}</h5>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">{selectedJob?.provider.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="rounded-xl bg-white shadow-sm h-10 w-10 text-primary" asChild>
                    <a href={`tel:${selectedJob?.provider.phone}`}><Phone className="w-4 h-4" /></a>
                  </Button>
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Task Information</h4>
              <div className="space-y-4 bg-surface p-5 rounded-2xl border border-secondary/10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-foreground/80">{selectedJob?.location}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Banknote className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Agreed Budget</p>
                    <p className="text-base font-black text-primary">{selectedJob?.price}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Job Progress</h4>
              <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-secondary/30">
                <div className="relative flex items-center gap-4">
                  <div className="absolute -left-[33px] w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm flex items-center justify-center z-10">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground/80">Job Posted</p>
                    <p className="text-[10px] text-muted-foreground">Successfully created and matching started.</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-4">
                  <div className="absolute -left-[33px] w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center z-10 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Matching Professional</p>
                    <p className="text-[10px] text-muted-foreground">Finding the best helper for your request.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="p-6 bg-surface border-t border-secondary/10">
            <Button 
              className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20"
              onClick={() => setIsDetailsOpen(false)}
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating & Review Dialog */}
      <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
        <DialogContent className="rounded-[32px] w-[92%] max-w-md p-8 border-none shadow-2xl outline-none">
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-yellow-400/20">
              <Star className="w-8 h-8 text-primary fill-primary" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-center">Rate Your Helper</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Your feedback helps us keep Muawin safe and reliable for everyone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-6 text-center">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setCurrentRating(star)}
                  className="focus:outline-none transition-all active:scale-125"
                >
                  <Star 
                    className={cn(
                      "w-12 h-12 transition-colors", 
                      star <= currentRating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"
                    )} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              {currentRating === 5 ? 'Excellent!' : currentRating === 4 ? 'Very Good' : currentRating === 3 ? 'Good' : 'Fair'}
            </p>
          </div>

          <DialogFooter className="flex flex-row gap-4 pt-2">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest border-2 border-secondary/30"
              onClick={() => setIsRatingOpen(false)}
            >
              Skip
            </Button>
            <Button 
              className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20"
              onClick={handleSubmitRating}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complaint Registration Dialog */}
      <Dialog open={isComplaintOpen} onOpenChange={setIsComplaintOpen}>
        <DialogContent className="rounded-[32px] w-[92%] max-w-md p-8 border-none shadow-2xl outline-none">
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-center">Register Complaint</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              We take quality seriously. Tell us what went wrong and we'll investigate immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Issue Details</Label>
              <Textarea 
                placeholder="Describe the problem you faced in detail..." 
                className="rounded-2xl min-h-[160px] bg-surface border-none shadow-inner text-sm focus-visible:ring-red-200 p-4 leading-relaxed outline-none"
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-4 pt-2">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest border-2 border-secondary/30"
              onClick={() => setIsComplaintOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20 bg-red-600 hover:bg-red-700"
              onClick={handleSubmitComplaint}
              disabled={isSubmittingComplaint || !complaintText.trim()}
            >
              {isSubmittingComplaint ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
