'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Award, 
  Clock, 
  SearchX,
  Zap,
  MapPin,
  Mail,
  CreditCard,
  Smartphone,
  Building2,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  FileText
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

export default function FeaturedUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFeaturedAds();
  }, []);

  async function loadFeaturedAds() {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await adminSupabase
        .from('featured_ads')
        .select(`
          id,
          plan_type,
          tagline,
          is_active,
          start_date,
          end_date,
          plan_price,
          payment_method,
          created_at,
          providers(
            id,
            service_category,
            city,
            profiles!inner(
              id,
              full_name,
              email,
              profile_image_url
            )
          ),
          vendors(
            id,
            business_name,
            business_type,
            city,
            profiles!inner(
              id,
              full_name,
              email,
              profile_image_url
            )
          )
        `)
        .eq('is_active', true)
        .gt('end_date', now)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now2 = new Date();
      setFeaturedItems((data || []).map((ad: any) => {
        const isProvider = !!ad.providers;
        const expiry = new Date(ad.end_date);
        const hoursLeft = Math.ceil((expiry.getTime() - now2.getTime()) / (1000 * 60 * 60));
        const daysLeft = Math.ceil(hoursLeft / 24);
        const expiresText = hoursLeft < 24 
          ? `${hoursLeft} hours left`
          : `${daysLeft} days left`;

        const profile = isProvider 
          ? ad.providers?.profiles 
          : ad.vendors?.profiles;
        const name = isProvider 
          ? profile?.full_name 
          : ad.vendors?.business_name;
        const category = isProvider 
          ? ad.providers?.service_category 
          : ad.vendors?.business_type;
        const city = isProvider 
          ? ad.providers?.city 
          : ad.vendors?.city;

        return {
          id: ad.id,
          fullId: ad.id,
          providerId: ad.providers?.id || null,
          vendorId: ad.vendors?.id || null,
          profileId: isProvider 
            ? ad.providers?.profiles?.id 
            : ad.vendors?.profiles?.id,
          name: name || 'Unknown',
          role: isProvider ? 'Provider' : 'Vendor',
          category: category || '',
          location: city || '',
          email: profile?.email || '',
          package: ad.plan_type === 'premium' ? 'Monthly' : 
                   ad.plan_type === 'standard' ? 'Weekly' : 'Daily',
          paymentMode: ad.payment_method || 'Muawin App',
          paymentType: 'card',
          paymentDetails: {
            txId: ad.id.substring(0, 8).toUpperCase(),
            amount: `Rs. ${ad.plan_price || 0}`,
            date: new Date(ad.created_at).toLocaleDateString('en-PK'),
          },
          expires: expiresText,
          avatar: profile?.profile_image_url || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=047A62&color=fff`,
        };
      }));
    } catch (e) {
      console.error('Error loading featured ads:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = featuredItems.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveConfirm = async () => {
    if (!removingId) return;
    setIsProcessing(true);
    try {
      await adminSupabase
        .from('featured_ads')
        .update({ is_active: false })
        .eq('id', removingId);

      setFeaturedItems(prev => prev.filter(i => i.id !== removingId));
      setRemovingId(null);
      toast({
        title: "Boost Removed",
        description: "The featured advertisement has been terminated.",
      });
    } catch (e) {
      console.error('Error removing featured ad:', e);
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
              <h1 className="text-2xl font-bold text-grey-900">Featured Ad Management</h1>
              <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-3">
                {featuredItems.length} Active Boosts
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* SEARCH */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search boosted providers or stores..." 
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
          {filtered.length > 0 ? filtered.map((item) => (
            <Card 
              key={item.id}
              className="p-6 muawin-card border-none bg-white hover:bg-emerald-50/20 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-8"
            >
              {/* Primary Info */}
              <div className="flex items-center gap-5 min-w-[280px]">
                <div className="w-16 h-16 rounded-[24px] overflow-hidden relative shadow-md">
                  <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute -top-1 -right-1 bg-emerald-600 text-white p-1 rounded-lg border-2 border-white shadow-sm">
                    <Award className="w-3 h-3" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => router.push(`/admin/users/${item.profileId || item.id}`)}
                    className="text-lg font-bold text-grey-900 hover:text-primary transition-colors text-left"
                  >
                    {item.name}
                  </button>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-4 px-1.5 bg-grey-50 text-grey-500 border-none text-[8px] font-black uppercase tracking-tighter">
                      {item.id}
                    </Badge>
                    <Badge className={cn(
                      "h-4 px-1.5 border-none font-bold text-[8px] uppercase tracking-tighter",
                      item.role === 'Vendor' ? "bg-blue-100 text-blue-700" : "bg-primary/10 text-primary"
                    )}>
                      {item.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Specific Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 flex-1 px-8 border-x border-grey-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-grey-400 uppercase tracking-widest leading-none">Category</p>
                  <p className="text-xs font-bold text-grey-700 mt-1">{item.category}</p>
                  {item.role === 'Vendor' && (
                    <p className="text-[10px] text-grey-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {item.location}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-grey-400 uppercase tracking-widest leading-none">Contact</p>
                  <p className="text-xs font-bold text-grey-700 mt-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-grey-400" /> {item.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-grey-400 uppercase tracking-widest leading-none">Payment & Package</p>
                  <div className="mt-1 flex flex-col gap-1">
                    <button 
                      onClick={() => setSelectedPayment(item)}
                      className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline text-left"
                    >
                      {item.paymentType === 'card' ? <CreditCard className="w-3 h-3" /> : item.paymentType === 'bank' ? <Building2 className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                      {item.paymentMode}
                    </button>
                    <p className="text-[10px] font-black text-grey-500 uppercase tracking-tight">{item.package} Boost</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-grey-400 uppercase tracking-widest leading-none">Time Remaining</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-black text-grey-700">{item.expires}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setRemovingId(item.id)}
                  className="rounded-xl font-bold h-11 px-5 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> End Boost
                </Button>
              </div>
            </Card>
          )) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <SearchX className="w-16 h-16 text-grey-400" />
              <div className="space-y-1">
                <p className="font-black text-xl text-grey-900">No featured users found</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">We couldn't find any boosted profiles matching your search.</p>
              </div>
            </div>
          )}
        </div>
        )}
      </main>

      {/* PAYMENT DETAILS DIALOG */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="rounded-[32px] max-w-lg border-none shadow-2xl p-0 overflow-hidden">
          {selectedPayment && (
            <div className="flex flex-col">
              <div className="bg-emerald-600 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 h-6">
                      Ad Payment Audit
                    </Badge>
                    <DialogTitle className="text-2xl font-black">Transaction Summary</DialogTitle>
                    <p className="text-sm text-white/70 font-medium">Audit logs for {selectedPayment.name}'s boost</p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/20">
                    <FileText className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Promotion Details</h4>
                  <Card className="p-5 bg-surface border-none rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Zap className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-lg text-grey-900">{selectedPayment.package} Package</p>
                      <p className="text-xs text-muted-foreground font-bold">{selectedPayment.paymentMode}</p>
                    </div>
                  </Card>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-2xl space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</p>
                    <p className="text-sm font-bold text-grey-900">{selectedPayment.paymentDetails.txId}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-2xl space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Audit Status</p>
                    <div className="flex items-center gap-1.5 text-green-600 font-black text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-grey-100 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-grey-100">
                      {selectedPayment.paymentType === 'bank' ? (
                        <>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Bank Name</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.bankName}</td></tr>
                          <tr className="bg-grey-50"><td className="p-4 text-grey-400 font-bold uppercase">Account No</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.accountNumber}</td></tr>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Account Title</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.title}</td></tr>
                        </>
                      ) : selectedPayment.paymentType === 'card' ? (
                        <>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Card Brand</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.brand}</td></tr>
                          <tr className="bg-grey-50"><td className="p-4 text-grey-400 font-bold uppercase">Holder Name</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.holder}</td></tr>
                        </>
                      ) : (
                        <>
                          <tr className="bg-white"><td className="p-4 text-grey-400 font-bold uppercase">Wallet Number</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.number}</td></tr>
                          <tr className="bg-grey-50"><td className="p-4 text-grey-400 font-bold uppercase">Wallet Title</td><td className="p-4 text-right font-black">{selectedPayment.paymentDetails.title}</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedPayment.paymentType === 'bank' && selectedPayment.paymentDetails.proofImage && (
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Bank Transfer Proof</h4>
                    <div className="relative group rounded-[28px] overflow-hidden border-2 border-dashed border-grey-200 aspect-video bg-grey-50 flex items-center justify-center">
                      <img src={selectedPayment.paymentDetails.proofImage} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  </section>
                )}
              </div>

              <div className="p-6 bg-surface border-t border-grey-100">
                <Button 
                  onClick={() => setSelectedPayment(null)}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest shadow-xl"
                >
                  Close Audit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REMOVE CONFIRMATION DIALOG */}
      <Dialog open={!!removingId} onOpenChange={(open) => !open && !isProcessing && setRemovingId(null)}>
        <DialogContent className="rounded-[32px] max-w-md border-none shadow-2xl p-8">
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-center">Terminate Ad Boost?</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium leading-relaxed">
              Are you sure you want to end this user's featured advertisement? This action will immediately remove their profile from the top of search results.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              variant="ghost" 
              disabled={isProcessing}
              onClick={() => setRemovingId(null)}
              className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest border-2 border-secondary/20"
            >
              Keep Boost
            </Button>
            <Button 
              variant="destructive"
              disabled={isProcessing}
              onClick={handleRemoveConfirm}
              className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/20 bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Removal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}