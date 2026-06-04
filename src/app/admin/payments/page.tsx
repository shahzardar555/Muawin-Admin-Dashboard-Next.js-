'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ArrowDownToLine,
  SearchX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { adminSupabase } from '@/lib/admin-supabase';

export default function WithdrawalManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [withdrawals, setWithdrawals] = useState<Array<{
    id: string;
    fullId: string;
    provider: string;
    proId: string;
    amount: number;
    date: string;
    status: string;
    method: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function loadWithdrawals() {
    setIsLoading(true);
    try {
      const { data, error } = await adminSupabase
        .from('withdrawals')
        .select(`
          id,
          amount,
          status,
          withdrawal_method,
          created_at,
          provider_id,
          providers(
            id,
            profiles(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWithdrawals((data || []).map((w: any) => ({
        id: w.id.substring(0, 8).toUpperCase(),
        fullId: w.id,
        provider: w.providers?.profiles?.full_name || 'Provider',
        proId: w.providers?.id?.substring(0, 8).toUpperCase() || 'N/A',
        amount: Number(w.amount) || 0,
        date: new Date(w.created_at).toLocaleDateString('en-PK'),
        status: w.status === 'completed' ? 'Processed' : 'Pending',
        method: w.withdrawal_method || 'Bank Transfer',
      })));
    } catch (e) {
      console.error('Error loading withdrawals:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleProcess = (id: string, fullId: string) => {
    router.push(`/admin/payments/execute/${fullId}`);
  };

  const filteredRequests = withdrawals.filter(w => {
    const matchesSearch = w.provider.toLowerCase().includes(searchQuery.toLowerCase()) || w.id.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const APP_FEE_PERCENTAGE = 0.1;

  return (
    <div className="min-h-screen bg-surface">
      {/* HEADER */}
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-grey-900">Payment Withdrawals</h1>
              <Badge className="bg-primary/10 text-primary border-none font-bold px-3">
                {withdrawals.filter(w => w.status === 'Pending').length} Pending Requests
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'Processed'].map((f) => (
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

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* SEARCH */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by Provider Name or Request ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white border-grey-100 rounded-2xl focus-visible:ring-primary/20 shadow-sm text-lg"
          />
        </div>

        {/* WITHDRAWAL LIST */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
        <div className="space-y-4">
          {filteredRequests.length > 0 ? filteredRequests.map((req) => {
            const appFee = req.amount * APP_FEE_PERCENTAGE;
            const payout = req.amount - appFee;
            
            return (
              <Card 
                key={req.id}
                className={cn(
                  "p-6 muawin-card border-none space-y-4 bg-white transition-all group",
                  req.status === 'Pending' ? "border-l-4 border-l-amber-500" : "opacity-80"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                      req.status === 'Pending' ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                    )}>
                      <ArrowDownToLine className="w-6 h-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-grey-900">{req.provider}</h4>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter h-5 px-2">
                          ID: {req.proId}
                        </Badge>
                      </div>
                      <p className="text-xs text-grey-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Requested {req.date} • {req.method}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 max-w-xl border-x border-grey-50 px-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none">Requested</p>
                      <p className="text-lg font-black text-grey-900 leading-tight">Rs. {req.amount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none">App Fee (10%)</p>
                      <p className="text-lg font-black text-red-500 leading-tight">- Rs. {appFee.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Final Payout</p>
                      <p className="text-xl font-black text-primary leading-tight">Rs. {payout.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === 'Pending' ? (
                      <Button 
                        onClick={() => handleProcess(req.id, req.fullId)}
                        className="bg-grey-900 text-white rounded-xl font-bold h-11 px-6 hover:bg-black transition-all active:scale-95"
                      >
                        Approve & Pay
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 border-none font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Paid Successfully
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          }) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <SearchX className="w-16 h-16 text-grey-400" />
              <div className="space-y-1">
                <p className="font-black text-xl text-grey-900">No withdrawal requests found</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">We couldn't find any payment requests matching your current search or filters.</p>
              </div>
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  );
}