'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  History,
  CalendarDays,
  Loader2,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
  Banknote,
  ClipboardList,
  User,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProviderActiveJobsPage() {
  const router = useRouter();
  const { t, mounted } = useLanguage();
  const { toast } = useToast();
  const [isSOSLoading, setIsSOSLoading] = useState(false);
  const [isComplaintLoading, setIsComplaintLoading] = useState<string | null>(null);

  const [activeJobs, setActiveJobs] = useState([
    { 
      id: '48291', 
      customer: 'John Doe', 
      category: 'Driver', 
      status: 'in_progress', 
      location: 'Gulberg III, Lahore',
      time: 'Started 20m ago',
      scheduledTime: '10:30 AM',
      price: 'Rs. 1,500',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      phone: '+923001234567'
    },
    {
      id: '48302',
      customer: 'Amna Khan',
      category: 'Driver', 
      status: 'scheduled',
      location: 'DHA Phase 5, Lahore',
      time: 'Scheduled for 04:00 PM',
      scheduledTime: '04:00 PM',
      price: 'Rs. 1,200',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      phone: '+923119876543'
    }
  ]);

  const [completedJobs, setCompletedJobs] = useState([
    {
      id: '48120',
      customer: 'Sarah Ahmed',
      category: 'Driver',
      status: 'completed',
      location: 'Model Town, Lahore',
      time: 'Completed Yesterday',
      scheduledTime: '11:00 AM',
      price: 'Rs. 2,000',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      phone: '+923225556667'
    }
  ]);

  const handleSOS = () => {
    setIsSOSLoading(true);
    setTimeout(() => {
      setIsSOSLoading(false);
      toast({
        title: "SOS Alert Sent!",
        description: "Your location and status have been shared with emergency services.",
        variant: 'default',
        className: 'bg-red-600 text-white border-none shadow-2xl'
      });
    }, 2000);
  };

  const handleComplaint = (jobId: string) => {
    setIsComplaintLoading(jobId);
    setTimeout(() => {
      setIsComplaintLoading(null);
      toast({
        title: t('complaint_submitted'),
        description: t('complaint_desc'),
      });
    }, 1500);
  };

  const handleMarkAsCompleted = (jobId: string) => {
    const jobToComplete = activeJobs.find(j => j.id === jobId);
    if (!jobToComplete) return;

    setActiveJobs(prev => prev.filter(j => j.id !== jobId));
    setCompletedJobs(prev => [{
      ...jobToComplete,
      status: 'completed',
      time: `Completed ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }, ...prev]);

    // Persist earnings and job count in localStorage for the prototype
    if (typeof window !== 'undefined') {
      const currentEarnings = parseInt(localStorage.getItem('muawin_earnings') || '48200');
      const jobPrice = parseInt(jobToComplete.price.replace(/[^0-9]/g, ''));
      localStorage.setItem('muawin_earnings', (currentEarnings + jobPrice).toString());

      const currentJobsDone = parseInt(localStorage.getItem('muawin_jobs_done') || '45');
      localStorage.setItem('muawin_jobs_done', (currentJobsDone + 1).toString());
    }

    toast({
      title: "Mubarak! Job Completed",
      description: `Job #${jobId} for ${jobToComplete.customer} has been finished successfully.`,
    });
  };

  if (!mounted) return null;

  const renderJobCard = (job: any) => (
    <Card key={job.id} className={cn(
      "p-0 border-none shadow-xl rounded-[28px] overflow-hidden transition-all active:scale-[0.99] group animate-in fade-in slide-in-from-bottom-3",
      job.status === 'in_progress' ? "ring-2 ring-primary bg-white" : "bg-white/80 backdrop-blur-sm"
    )}>
      <div className="p-5 space-y-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-secondary/30 overflow-hidden border border-border shadow-inner">
                <img src={job.avatar} alt={job.customer} className="object-cover w-full h-full" />
              </div>
              {job.status === 'in_progress' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse shadow-sm" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-foreground">{job.customer}</h4>
                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/20 text-primary font-black uppercase tracking-tighter">
                  ID: #{job.id}
                </Badge>
              </div>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{job.category}</p>
            </div>
          </div>
          <Badge className={cn(
            "border-none font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-wider",
            job.status === 'in_progress' ? "bg-primary text-primary-foreground" :
            job.status === 'completed' ? "bg-green-100 text-green-700" :
            "bg-amber-100 text-amber-700"
          )}>
            {job.status === 'in_progress' ? 'Active Now' : job.status === 'completed' ? 'Completed' : 'Scheduled'}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-2.5 p-4 bg-surface rounded-2xl border border-secondary/10 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-secondary/5">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-bold text-foreground/70 truncate">{job.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-secondary/5">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-bold text-foreground/70">{job.time}</p>
          </div>
          <div className="flex items-center gap-3 pt-1 border-t border-secondary/5 mt-1">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-secondary/5">
              <Banknote className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-0.5">Agreed Budget</span>
              <p className="text-sm font-black text-primary leading-none">{job.price}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {job.status !== 'completed' && (
          <div className="flex gap-3 pt-1">
            <Button 
              variant="outline"
              asChild
              className="flex-1 rounded-2xl h-12 border-secondary/30 bg-white text-primary font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-primary/5 active:scale-95 transition-all"
            >
              <a href={`tel:${job.phone}`}>
                <Phone className="w-3.5 h-3.5 mr-2" /> {t('call')}
              </a>
            </Button>
            <Button 
              onClick={() => router.push(`/chat/${job.id}?name=${encodeURIComponent(job.customer)}&avatar=${encodeURIComponent(job.avatar)}`)}
              className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" /> {t('chat')}
            </Button>
          </div>
        )}
      </div>

      {/* Primary Actions for Active Job */}
      {job.status === 'in_progress' && (
        <div className="px-5 pb-5 space-y-3">
          <Button 
            onClick={() => handleMarkAsCompleted(job.id)}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-green-600/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="w-5 h-5" /> {t('mark_completed')}
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSOS}
            disabled={isSOSLoading}
            className="w-full h-12 bg-red-600 hover:bg-red-700 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            {isSOSLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            {t('sos_emergency')}
          </Button>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="p-5 bg-secondary/10 border-t border-secondary/20 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Job Payout</span>
            <span className="text-sm font-black text-primary">{job.price}</span>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            disabled={isComplaintLoading === job.id}
            onClick={() => handleComplaint(job.id)}
            className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl px-4 h-9"
          >
            {isComplaintLoading === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />}
            {t('register_complaint')}
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Redesigned Premium Header - Non-sticky */}
      <header className="bg-primary px-6 pt-12 pb-10 space-y-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4 text-white">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-3xl font-black tracking-tight leading-none">{t('my_jobs')}</h1>
            <p className="text-primary-foreground/80 font-medium text-xs mt-1.5">Manage your active assignments</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl ml-auto">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
        </div>
        {/* Background Decorative Icon */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10 rotate-12">
          <ClipboardList className="w-32 h-32 text-white" />
        </div>
      </header>

      <main className="px-6 -mt-6">
        <Tabs defaultValue="ongoing" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-white/80 backdrop-blur-md p-1.5 rounded-[20px] shadow-xl border border-white/20">
            <TabsTrigger 
              value="ongoing" 
              className="rounded-2xl h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              {t('ongoing')}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-2xl h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              {t('history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing" className="space-y-8 m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeJobs.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Tasks</h3>
                  </div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-black text-[9px] uppercase tracking-wider">Matched: {activeJobs.length}</Badge>
                </div>
                {activeJobs.map(renderJobCard)}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl">
                  <Clock className="w-12 h-12 text-primary/30" />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-xl text-foreground">{t('no_active_jobs')}</p>
                  <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                    Check your feed for new job requests and start earning.
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/provider/feed')} 
                  className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  View Job Feed <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            {completedJobs.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Recently Finished</h3>
                </div>
                {completedJobs.map(renderJobCard)}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <History className="w-16 h-16 text-muted-foreground" />
                <p className="font-black text-lg">{t('no_jobs_found')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
