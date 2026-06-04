'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminSupabase } from '@/lib/admin-supabase';
import { 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  Clock, 
  Filter, 
  ChevronRight,
  MoreVertical,
  User,
  ShieldAlert,
  SearchX,
  History,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AllComplaintsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allComplaints, setAllComplaints] = useState<Array<{
    id: string;
    fullId?: string;
    title: string;
    customer: string;
    provider: string;
    desc: string;
    urgent: boolean;
    time: string;
    status: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    setIsLoading(true);
    try {
      const { data, error } = await adminSupabase
        .from('complaints')
        .select(`
          id,
          complaint_type,
          description,
          priority,
          status,
          created_at,
          customers!inner(
            profiles!inner(full_name)
          ),
          providers(
            profiles!inner(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllComplaints((data || []).map((c: any) => ({
        id: c.id.substring(0, 8).toUpperCase(),
        fullId: c.id,
        title: c.complaint_type || 'Complaint',
        customer: c.customers?.profiles?.full_name || 'Customer',
        provider: c.providers?.profiles?.full_name || 'Provider',
        desc: c.description || '',
        urgent: c.priority === 'high' || c.priority === 'critical',
        time: new Date(c.created_at).toLocaleDateString('en-PK'),
        status: c.status === 'resolved' ? 'Resolved' : 'Pending',
      })));
    } catch (e) {
      console.error('Error loading complaints:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredComplaints = allComplaints.filter(c => {
    const matchesSearch = c.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.id.includes(searchQuery) || 
                         c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Urgent' && c.urgent) ||
                         (statusFilter === 'Resolved' && c.status === 'Resolved') ||
                         (statusFilter === 'Pending' && c.status === 'Pending' && !c.urgent);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* HEADER */}
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-grey-900">Complaint Management</h1>
              <Badge className="bg-red-100 text-red-700 border-none font-bold px-3">
                {allComplaints.filter(c => c.urgent).length} Urgent Issues
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {['All', 'Urgent', 'Pending', 'Resolved'].map((f) => (
              <Button 
                key={f}
                variant={statusFilter === f ? 'default' : 'ghost'}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "rounded-xl font-bold h-10 px-4 transition-all",
                  statusFilter === f ? "bg-primary text-white shadow-md shadow-primary/20" : "text-grey-500 hover:bg-grey-100"
                )}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* SEARCH */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by Job ID, Customer Name or Issue Type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white border-grey-100 rounded-2xl focus-visible:ring-primary/20 shadow-sm text-lg"
          />
        </div>

        {/* COMPLAINT LIST */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
            <Card 
              key={c.id}
              onClick={() => router.push(`/admin/complaint/${c.fullId}`)}
              className={cn(
                "p-6 muawin-card border-none space-y-4 cursor-pointer hover:shadow-md transition-all group",
                c.urgent ? "bg-red-50/50 hover:bg-red-50" : "bg-white hover:bg-grey-50"
              )}
            >
              <div className="flex items-start gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                  c.urgent ? "bg-red-100 text-red-600" : c.status === 'Resolved' ? "bg-green-100 text-green-600" : "bg-grey-100 text-grey-600"
                )}>
                  {c.status === 'Resolved' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base text-grey-900 flex items-center gap-2">
                        {c.title}
                        {c.urgent && <Badge className="bg-red-500 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 h-5">URGENT</Badge>}
                        {c.status === 'Resolved' && <Badge className="bg-green-100 text-green-700 border-none font-black text-[9px] uppercase tracking-widest px-2 h-5">RESOLVED</Badge>}
                      </h4>
                      <p className="text-xs text-grey-400 font-bold uppercase tracking-tighter">Job #{c.id} • {c.customer} vs {c.provider}</p>
                    </div>
                    <span className="text-[10px] text-grey-400 font-bold uppercase tracking-widest flex items-center gap-1.5 bg-grey-50 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" /> {c.time}
                    </span>
                  </div>
                  
                  <p className="text-sm text-grey-600 leading-relaxed italic">"{c.desc}"</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-grey-100">
                    <div className="flex gap-2">
                      <Button size="sm" className={cn(
                        "rounded-xl font-bold h-9 px-5 text-white shadow-sm",
                        c.urgent ? "bg-red-600 hover:bg-red-700" : "bg-grey-800 hover:bg-grey-900"
                      )}>Investigate Case</Button>
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold text-grey-400 hover:bg-grey-100 h-9">Archive</Button>
                    </div>
                    <ChevronRight className="w-5 h-5 text-grey-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </Card>
          )) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40 animate-in fade-in duration-500">
              <SearchX className="w-16 h-16 text-grey-400" />
              <div className="space-y-1">
                <p className="font-black text-xl text-grey-900">No complaints found</p>
                <p className="text-sm text-grey-500 max-w-xs mx-auto">We couldn't find any complaints matching your current search or filter criteria.</p>
              </div>
              <Button variant="link" onClick={() => {setSearchQuery(''); setStatusFilter('All');}} className="text-primary font-bold">Clear all filters</Button>
            </div>
          )}
        </div>

        {filteredComplaints.length > 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-px h-12 bg-gradient-to-b from-grey-200 to-transparent" />
            <p className="text-[10px] font-black text-grey-300 uppercase tracking-[0.3em]">End of Records</p>
          </div>
        )}
      </main>
    </div>
  );
}