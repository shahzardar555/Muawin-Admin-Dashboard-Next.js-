'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Crown, 
  CreditCard, 
  Smartphone, 
  Calendar, 
  Mail, 
  ChevronRight,
  SearchX,
  CreditCard as VisaIcon,
  XCircle,
  AlertTriangle,
  Loader2,
  Building2,
  FileText,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { adminSupabase } from '@/lib/admin-supabase';

export default function PremiumCustomersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPremiumCustomers();
  }, []);

  async function loadPremiumCustomers() {
    setIsLoading(true);
    try {
      const { data, error } = await adminSupabase
        .from('subscriptions')
        .select(`
          id,
          plan_name,
          plan_period,
          plan_price,
          is_active,
          start_date,
          end_date,
          created_at,
          customers(
            id,
            profiles!inner(
              id,
              full_name,
              email,
              profile_image_url
            )
          )
        `)
        .eq('is_active', true)
        .not('customer_id', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      setCustomers((data || []).map((s: any) => {
        const expiry = new Date(s.end_date);
        const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: s.customers?.id?.substring(0, 8).toUpperCase() || 'N/A',
          fullId: s.customers?.id || '',
          profileId: s.customers?.profiles?.id || '',
          subId: s.id,
          name: s.customers?.profiles?.full_name || 'Customer',
          email: s.customers?.profiles?.email || '',
          plan: s.plan_period === 'week' ? 'Weekly' : 
                s.plan_period === 'month' ? 'Monthly' : 'Yearly',
          paymentMode: 'Muawin App',
          paymentType: 'card',
          paymentDetails: {
            txId: s.id.substring(0, 8).toUpperCase(),
            amount: `Rs. ${s.plan_price}`,
            date: new Date(s.created_at).toLocaleDateString('en-PK'),
          },
          status: daysLeft <= 7 ? 'Expiring Soon' : 'Active',
          avatar: s.customers?.profiles?.profile_image_url || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(s.customers?.profiles?.full_name || 'U')}&background=047A62&color=fff`,
          joined: new Date(s.created_at).toLocaleDateString('en-PK'),
        };
      }));
    } catch (e) {
      console.error('Error loading premium customers:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRevokeConfirm = async () => {
    if (!revokingId) return;
    setIsProcessing(true);
    try {
      const customer = customers.find(c => c.id === revokingId);
      if (customer?.subId) {
        await adminSupabase
          .from('subscriptions')
          .update({ is_active: false })
          .eq('id', customer.subId);

        if (customer?.fullId) {
          const { error: customerError } = await adminSupabase
            .from('customers')
            .update({ is_pro: false, pro_expiry_date: null })
            .eq('id', customer.fullId);
          
          if (customerError) throw customerError;
        }
      }
      setCustomers(prev => prev.filter(c => c.id !== revokingId));
      setRevokingId(null);
      toast({
        title: "Premium Access Revoked",
        description: "The user has been downgraded to a standard account.",
      });
    } catch (e) {
      console.error('Error revoking premium:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* HEADER */}
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-grey-900">Premium Customers</h1>
              <Badge className="bg-purple-100 text-purple-700 border-none font-bold px-3">
                {customers.length} Active Muawin PRO
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* SEARCH */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by ID or Customer Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white border-grey-100 rounded-2xl focus-visible:ring-primary/20 shadow-sm text-lg"
          />
        </div>

        {/* LIST */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.length > 0 ? filtered.map((customer) => (
            <Card 
              key={customer.fullId}
              className="p-6 muawin-card border-none bg-white hover:bg-grey-50/30 transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[24px] bg-purple-50 flex items-center justify-center shrink-0 shadow-inner relative">
                  <img src={customer.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[24px]" />
                  <div className="absolute -top-1 -right-1 bg-purple-600 text-white p-1 rounded-lg border-2 border-white shadow-sm">
                    <Crown className="w-3 h-3" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => router.push(`/admin/users/${customer.profileId}`)}
                      className="text-lg font-bold text-grey-900 hover:text-primary transition-colors text-left"
                    >
                      {customer.name}
                    </button>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter h-5 px-2 bg-grey-50 border-none">
                      {customer.id}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-grey-500 flex items-center gap-1.5 font-medium">
                      <Mail className="w-3.5 h-3.5" /> {customer.email}
                    </p>
                    <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Member Since {customer.joined}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBSCRIPTION DETAILS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 px-6 border-l border-grey-100 flex-1 max-w-2xl">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none">Service Plan</p>
                  <Badge className={cn(
                    "mt-1 font-bold text-[10px] h-6 px-3 border-none",
                    customer.plan === 'Yearly' ? "bg-emerald-100 text-emerald-700" :
                    customer.plan === 'Monthly' ? "bg-blue-100 text-blue-700" :
                    "bg-purple-100 text-purple-700"
                  )}>
                    {customer.plan}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none">Payment Mode</p>
                  <button 
                    onClick={() => setSelectedPaymentCustomer(customer)}
                    className="flex items-center gap-2 mt-1.5 cursor-pointer hover:bg-surface p-1.5 -ml-1 rounded-lg transition-colors group/pay"
                  >
                    {customer.paymentType === 'card' ? (
                      <VisaIcon className="w-4 h-4 text-blue-600" />
                    ) : customer.paymentType === 'bank' ? (
                      <Building2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Smartphone className={cn("w-4 h-4", customer.paymentType === 'easypaisa' ? 'text-green-600' : 'text-red-600')} />
                    )}
                    <span className="text-sm font-bold text-grey-700 group-hover/pay:text-primary flex items-center gap-1">
                      {customer.paymentMode}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/pay:opacity-100 transition-opacity" />
                    </span>
                  </button>
                </div>

                <div className="space-y-1 hidden md:block">
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none">Current Status</p>
                  <p className={cn(
                    "text-sm font-black mt-1",
                    customer.status === 'Active' ? "text-green-600" : "text-amber-500"
                  )}>
                    {customer.status}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setRevokingId(customer.id)}
                  className="w-full sm:w-auto rounded-xl font-bold h-11 px-6 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-sm"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Revoke Access
                </Button>
              </div>
            </Card>
          )) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <SearchX className="w-16 h-16 text-grey-400" />
              <div className="space-y-1">
                <p className="font-black text-xl text-grey-900">No premium customers found</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">We couldn't find any Muawin PRO accounts matching your search.</p>
              </div>
              <Button variant="link" onClick={() => setSearchQuery('')} className="text-primary font-bold">Clear search</Button>
            </div>
          )}
        </div>
        )}
      </main>

      {/* PAYMENT DETAILS DIALOG */}
      <Dialog open={!!selectedPaymentCustomer} onOpenChange={(open) => !open && setSelectedPaymentCustomer(null)}>
        <DialogContent className="rounded-[32px] max-w-lg border-none shadow-2xl p-0 overflow-hidden">
          {selectedPaymentCustomer && (
            <div className="flex flex-col">
              {/* Header */}
              <div className="bg-primary p-8 text-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 h-6">
                      Payment Verification
                    </Badge>
                    <DialogTitle className="text-2xl font-black">Transaction Summary</DialogTitle>
                    <p className="text-sm text-white/70 font-medium">Audit logs for {selectedPaymentCustomer.name}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/20">
                    <FileText className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                {/* Method Specific Details */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Payment Channel</h4>
                  <Card className="p-5 bg-surface border-none rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      {selectedPaymentCustomer.paymentType === 'card' ? <VisaIcon className="text-blue-600" /> : 
                       selectedPaymentCustomer.paymentType === 'bank' ? <Building2 className="text-primary" /> : 
                       <Smartphone className={selectedPaymentCustomer.paymentType === 'easypaisa' ? 'text-green-600' : 'text-red-600'} />}
                    </div>
                    <div>
                      <p className="font-black text-lg text-grey-900">
                        {selectedPaymentCustomer.paymentType === 'card' ? 'Credit / Debit Card' : 
                         selectedPaymentCustomer.paymentType === 'bank' ? 'Bank Account Transfer' : 
                         selectedPaymentCustomer.paymentType === 'easypaisa' ? 'EasyPaisa Wallet' : 'JazzCash Wallet'}
                      </p>
                      <p className="text-xs text-muted-foreground font-bold">{selectedPaymentCustomer.paymentMode}</p>
                    </div>
                  </Card>
                </section>

                {/* Audit Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-2xl space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</p>
                    <p className="text-sm font-bold text-grey-900">{selectedPaymentCustomer.paymentDetails.txId}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-2xl space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount Paid</p>
                    <p className="text-sm font-black text-primary">{selectedPaymentCustomer.paymentDetails.amount}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-2xl space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Processing Date</p>
                    <p className="text-[11px] font-bold text-grey-900 leading-tight">{selectedPaymentCustomer.paymentDetails.date}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-2xl space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                    <div className="flex items-center gap-1.5 text-green-600 font-black text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                    </div>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="rounded-2xl border border-grey-100 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-grey-100">
                      {selectedPaymentCustomer.paymentType === 'bank' ? (
                        <>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Bank Name</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.bankName}</td></tr>
                          <tr className="bg-grey-50"><td className="p-4 text-grey-400 font-bold uppercase">Account No</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.accountNumber}</td></tr>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Account Title</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.title}</td></tr>
                        </>
                      ) : selectedPaymentCustomer.paymentType === 'card' ? (
                        <>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Card Brand</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.brand}</td></tr>
                          <tr className="bg-grey-50"><td className="p-4 text-grey-400 font-bold uppercase">Holder Name</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.holder}</td></tr>
                        </>
                      ) : (
                        <>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Mobile Number</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.number}</td></tr>
                          <tr className="bg-grey-50"><td className="p-4 text-grey-400 font-bold uppercase">Wallet Title</td><td className="p-4 text-right font-black">{selectedPaymentCustomer.paymentDetails.title}</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bank Proof Section */}
                {selectedPaymentCustomer.paymentType === 'bank' && selectedPaymentCustomer.paymentDetails.proofImage && (
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Transfer Proof</h4>
                    <div className="relative group rounded-[28px] overflow-hidden border-2 border-dashed border-grey-200 aspect-video bg-grey-50 flex items-center justify-center">
                      <img src={selectedPaymentCustomer.paymentDetails.proofImage} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  </section>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-surface border-t border-grey-100">
                <Button 
                  onClick={() => setSelectedPaymentCustomer(null)}
                  className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20"
                >
                  Confirm & Close Audit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REVOKE CONFIRMATION DIALOG */}
      <Dialog open={!!revokingId} onOpenChange={(open) => !open && !isProcessing && setRevokingId(null)}>
        <DialogContent className="rounded-[32px] max-w-md border-none shadow-2xl p-8">
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-center">Confirm Revocation</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium leading-relaxed">
              Are you sure you want to revoke premium access for this user? They will immediately lose all Muawin PRO benefits and priority support.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              variant="ghost" 
              disabled={isProcessing}
              onClick={() => setRevokingId(null)}
              className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest border-2 border-secondary/20"
            >
              Keep Premium
            </Button>
            <Button 
              variant="destructive"
              disabled={isProcessing}
              onClick={handleRevokeConfirm}
              className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/20 bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Revoke Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}