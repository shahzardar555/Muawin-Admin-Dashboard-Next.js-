'use client';

import { useState, useRef, useEffect } from 'react';
import { adminSupabase } from '@/lib/admin-supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3, 
  LogOut,
  ChevronRight,
  Check,
  X,
  Loader2,
  Clock,
  Banknote,
  ShieldAlert,
  Search,
  Crown,
  Award,
  Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import MuawinIcon from '@/components/muawin/MuawinIcon';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  
  const queueRef = useRef<HTMLDivElement>(null);
  const complaintsRef = useRef<HTMLDivElement>(null);

  const [pendingProviders, setPendingProviders] = useState<Array<{
    id: string;
    name: string;
    category: string;
    city: string;
    date: string;
  }>>([]);

  const [complaints, setComplaints] = useState<Array<{
    id: string;
    fullId: string;
    title: string;
    desc: string;
    urgent: boolean;
    time: string;
  }>>([]);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const [stats, setStats] = useState([
    { label: 'Total Users', value: '...', icon: Users, color: 'bg-blue-100 text-blue-600', action: null },
    { label: 'Pending Verifications', value: '...', icon: ShieldCheck, color: 'bg-amber-100 text-amber-600', action: () => scrollToSection(queueRef) },
    { label: 'Open Complaints', value: '...', icon: AlertTriangle, color: 'bg-red-100 text-red-600', action: () => scrollToSection(complaintsRef) },
    { label: 'Completed Jobs', value: '...', icon: BarChart3, color: 'bg-green-100 text-green-600', action: null },
  ]);

  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const quickMenu = [
    { label: 'Complaints', icon: ShieldAlert, href: '/admin/complaint', color: 'bg-red-500' },
    { label: 'Verification', icon: ShieldCheck, href: '/admin/verification', color: 'bg-amber-500' },
    { label: 'Payments', icon: Banknote, href: '/admin/payments', color: 'bg-primary' },
    { label: 'Find User', icon: Search, href: '/admin/users', color: 'bg-blue-600' },
    { label: 'Premium Customers', icon: Crown, href: '/admin/premium', color: 'bg-purple-600' },
    { label: 'Featured Users', icon: Award, href: '/admin/featured', color: 'bg-emerald-600' },
  ];

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoadingStats(true);

      // Get total users count
      const { count: totalUsers } = await adminSupabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get pending verifications
      const { data: pendingData, count: pendingCount } = await adminSupabase
        .from('providers')
        .select(`
          id,
          service_category,
          city,
          created_at,
          profiles!inner(full_name)
        `, { count: 'exact' })
          .in('verification_status', ['pending', 'under_review'])
        .order('created_at', { ascending: false })
        .limit(5);

      // Get open complaints count
      const { count: complaintsCount } = await adminSupabase
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      // Get completed jobs count
      const { count: completedJobs } = await adminSupabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Get recent complaints
      const { data: complaintsData } = await adminSupabase
        .from('complaints')
        .select('id, complaint_type, description, priority, status, created_at')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);

      // Map pending providers
      const mapped = (pendingData || []).map((p: any) => ({
        id: p.id,
        name: p.profiles?.full_name || 'Unknown',
        category: p.service_category || '',
        city: p.city || '',
        date: new Date(p.created_at).toLocaleDateString('en-PK'),
      }));

      setPendingProviders(mapped);

      setComplaints((complaintsData || []).map((c: any) => ({
        id: c.id.substring(0, 8).toUpperCase(),
        fullId: c.id,
        title: c.complaint_type || 'Complaint',
        desc: c.description || '',
        urgent: c.priority === 'high' || c.priority === 'critical',
        time: new Date(c.created_at).toLocaleDateString('en-PK'),
      })));

      setStats([
        { 
          label: 'Total Users', 
          value: (totalUsers || 0).toString(), 
          icon: Users, 
          color: 'bg-blue-100 text-blue-600', 
          action: null 
        },
        { 
          label: 'Pending Verifications', 
          value: (pendingCount || 0).toString(), 
          icon: ShieldCheck, 
          color: 'bg-amber-100 text-amber-600', 
          action: () => scrollToSection(queueRef) 
        },
        { 
          label: 'Open Complaints', 
          value: (complaintsCount || 0).toString(), 
          icon: AlertTriangle, 
          color: 'bg-red-100 text-red-600', 
          action: () => scrollToSection(complaintsRef) 
        },
        { 
          label: 'Completed Jobs', 
          value: (completedJobs || 0).toString(), 
          icon: BarChart3, 
          color: 'bg-green-100 text-green-600', 
          action: null 
        },
      ]);

    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setIsLoadingStats(false);
    }
  }

  const handleAction = async (id: string, type: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      await adminSupabase
        .from('providers')
        .update({
          verification_status: type === 'approve' ? 'verified' : 'rejected',
          is_verified: type === 'approve' ? true : false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      setPendingProviders(prev => prev.filter(p => p.id !== id));
      
      setStats(prev => prev.map(s => 
        s.label === 'Pending Verifications' 
          ? { ...s, value: (parseInt(s.value) - 1).toString() }
          : s
      ));

      toast({
        title: type === 'approve' ? "Provider Verified ✅" : "Verification Rejected ❌",
        description: type === 'approve'
          ? "Provider is now verified and can accept jobs."
          : "Provider has been notified of the rejection.",
        variant: type === 'approve' ? "default" : "destructive"
      });
    } catch (e) {
      console.error('Error updating provider:', e);
      toast({
        title: "Error",
        description: "Failed to update provider status.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleMenuClick = (item: typeof quickMenu[0]) => {
    router.push(item.href);
  };

  const handleLogout = () => {
    router.push('/auth/login');
    toast({
      title: "Logged Out",
      description: "Admin session ended safely.",
    });
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/mlogo.png" alt="Muawin Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Muawin Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-grey-900">Admin Console</h1>
          <p className="text-sm text-muted-foreground">Welcome, CEO Shahzar</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            className="rounded-xl font-bold gap-2 text-primary hover:bg-primary/5"
            onClick={() => router.push('/developer/guide')}
          >
            <Terminal className="w-4 h-4" /> Download Project
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-xl font-bold gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Log Out
          </Button>
        </div>
      </header>

      {/* QUICK MENU SECTION */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickMenu.map((item, i) => (
            <Card 
              key={i} 
              onClick={() => handleMenuClick(item)}
              className="group p-1 rounded-3xl border-none shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] bg-white overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
                  item.color
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-grey-900">{item.label}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Management</p>
                </div>
                <ChevronRight className="w-5 h-5 text-grey-300 group-hover:text-primary transition-colors" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={i} 
              onClick={stat.action || undefined}
              className={cn(
                "muawin-card p-6 border-none shadow-sm flex flex-col gap-3 transition-all bg-white",
                stat.action !== null ? "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" : ""
              )}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-grey-900">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6" ref={queueRef}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-grey-900">Verification Queue</h3>
            <Button 
              variant="link" 
              className="font-bold text-primary"
              onClick={() => router.push('/admin/verification')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {pendingProviders.length > 0 ? pendingProviders.map(p => (
              <Card key={p.id} className="muawin-card p-4 flex justify-between items-center border-none bg-white hover:bg-secondary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 overflow-hidden shrink-0 shadow-sm border border-grey-100">
                    <img src={`https://picsum.photos/seed/adm${p.id}/100/100`} alt="Pro" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-grey-900">{p.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{p.category} • {p.city}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    disabled={processingId === p.id}
                    onClick={() => handleAction(p.id, 'reject')}
                    className="rounded-xl w-10 h-10 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    disabled={processingId === p.id}
                    onClick={() => handleAction(p.id, 'approve')}
                    className="rounded-xl w-10 h-10 text-green-500 hover:bg-green-50 hover:text-green-600"
                  >
                    {processingId === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/admin/verification/${p.id}`)}
                    className="rounded-xl font-bold hidden sm:flex border-grey-200 text-grey-600 hover:bg-grey-50"
                  >
                    Details
                  </Button>
                </div>
              </Card>
            )) : (
              <div className="py-12 text-center bg-white/50 rounded-[24px] border border-dashed border-secondary/30">
                <p className="text-sm font-bold text-muted-foreground">All caught up! No pending verifications.</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6" ref={complaintsRef}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-grey-900">Recent Complaints</h3>
            <Button 
              variant="link" 
              className="font-bold text-primary"
              onClick={() => router.push('/admin/complaint')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card 
                key={complaint.id}
                className={cn(
                  "muawin-card p-6 border-none space-y-4 cursor-pointer hover:shadow-md transition-all",
                  complaint.urgent ? "bg-red-50/50 hover:bg-red-50" : "bg-white hover:bg-grey-50"
                )}
                  onClick={() => router.push(`/admin/complaint/${complaint.fullId}`)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    complaint.urgent ? "bg-red-100" : "bg-grey-100"
                  )}>
                    <AlertTriangle className={cn("w-5 h-5", complaint.urgent ? "text-red-600" : "text-grey-600")} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-sm text-grey-900">{complaint.title}</h4>
                      {complaint.urgent && <Badge className="bg-red-500 text-white border-none font-black text-[10px]">URGENT</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{complaint.desc}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <Button size="sm" className={cn(
                          "rounded-xl font-bold h-8 px-4 text-white shadow-sm",
                          complaint.urgent ? "bg-red-600 hover:bg-red-700" : "bg-grey-800 hover:bg-grey-900"
                        )}>Review Job</Button>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {complaint.time}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-grey-400">#{complaint.id}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
