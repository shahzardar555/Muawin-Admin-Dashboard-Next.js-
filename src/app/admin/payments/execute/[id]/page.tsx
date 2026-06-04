'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Info,
  Loader2,
  Banknote,
  ShieldCheck,
  User,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { adminSupabase } from '@/lib/admin-supabase';

const PAKISTANI_BANKS = [
  "Habib Bank Limited (HBL)",
  "National Bank of Pakistan (NBP)",
  "United Bank Limited (UBL)",
  "MCB Bank Limited",
  "Allied Bank Limited (ABL)",
  "Meezan Bank",
  "Bank Alfalah",
  "Faysal Bank",
  "Askari Bank",
  "Bank AL Habib",
  "Habib Metropolitan Bank",
  "Standard Chartered Bank",
  "Al Baraka Bank",
  "Dubai Islamic Bank",
  "Samba Bank",
  "Silkbank",
  "Sindh Bank",
  "Soneri Bank",
  "Summit Bank",
  "The Bank of Khyber",
  "The Bank of Punjab"
];

export default function ExecutePaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [withdrawalData, setWithdrawalData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    const fetchWithdrawal = async () => {
      try {
        const { data, error } = await adminSupabase
          .from('withdrawals')
          .select(`
            *,
            providers(
              id,
              profile_id,
              profiles(
                full_name,
                email,
                phone_number
              )
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setWithdrawalData(data);
        setSelectedBank(
          data.account_details?.bank_name || PAKISTANI_BANKS[0]
        );
      } catch (err) {
        console.error('Error fetching withdrawal:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchWithdrawal();
  }, [params.id]);

  const handleCompletePayout = async () => {
    setIsProcessing(true);
    try {
      const netPayout = Math.round((withdrawalData?.amount || 0) * 0.9);
      const providerId = withdrawalData?.providers?.id;

      console.log('Provider ID:', providerId);
      console.log('Withdrawal amount:', withdrawalData?.amount);

      // Step 1: Mark withdrawal as completed
      const { error: withdrawalError } = await adminSupabase
        .from('withdrawals')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (withdrawalError) throw withdrawalError;

      // Step 2: Deduct from provider wallet balance
      // (balance goes down because money was paid out)
      const { data: wallet, error: walletFetchError } = await adminSupabase
        .from('wallets')
        .select('id, balance, total_earnings')
        .eq('provider_id', providerId)
        .single();

      if (walletFetchError) throw walletFetchError;

      console.log('Wallet found:', wallet);

      const newBalance = Number(wallet.balance) + netPayout;
      const newTotalEarnings = Number(wallet.total_earnings) + netPayout;

      console.log('New balance will be:', newBalance);

      const { error: walletUpdateError } = await adminSupabase
        .from('wallets')
        .update({
          balance: newBalance,
          total_earnings: newTotalEarnings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (walletUpdateError) throw walletUpdateError;

      console.log('Wallet updated successfully');

      // Step 3: Log the transaction
      const { error: transactionError } = await adminSupabase
        .from('transactions')
        .insert({
          wallet_id: wallet.id,
          withdrawal_id: params.id,
          user_id: withdrawalData?.providers?.profile_id,
          type: 'debit',
          amount: netPayout,
          balance_after: newBalance,
          description: `Payout of Rs. ${netPayout} processed by admin`,
        });

      if (transactionError) {
        console.warn('Transaction log failed:', JSON.stringify(transactionError));
      } else {
        console.log('Transaction logged successfully');
      }

      toast({
        title: 'Payout Completed ✅',
        description: `Rs. ${netPayout.toLocaleString()} successfully transferred to ${withdrawalData?.providers?.profiles?.full_name || 'provider'}.`,
      });
      
      router.push('/admin/payments');

    } catch (err: any) {
      console.error('Payout error:', err);
      toast({
        variant: 'destructive',
        title: 'Payout Failed',
        description: err.message || 'Failed to process payout. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-6 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-grey-400 uppercase tracking-widest">Loading Payout Details...</p>
      </div>
    );
  }

  if (!withdrawalData) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <p className="text-grey-400 font-bold">Withdrawal request not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="rounded-full hover:bg-grey-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-grey-900">Process Payout</h1>
              <p className="text-xs text-grey-400 font-bold uppercase tracking-widest">Transaction #WDR-{withdrawalData?.id?.slice(0,8).toUpperCase()}</p>
            </div>
          </div>
          <Badge className={cn(
            "border-none px-4 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest",
            withdrawalData?.status === 'completed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          )}>
            {withdrawalData?.status === 'completed' ? 'Completed' : 'Awaiting Transfer'}
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: PROVIDER & SUMMARY */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[32px] border-none shadow-sm p-6 bg-white space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border-2 border-white shadow-md">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-grey-900">{withdrawalData?.providers?.profiles?.full_name || 'N/A'}</h2>
                <p className="text-xs font-bold text-grey-400 uppercase tracking-widest">ID: {withdrawalData?.providers?.id?.slice(0,8).toUpperCase() || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed border-grey-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-grey-400 uppercase tracking-widest">Requested</span>
                <span className="text-sm font-black text-grey-900">Rs. {(withdrawalData?.amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-grey-400 uppercase tracking-widest">App Fee (10%)</span>
                <span className="text-sm font-black text-red-500">- Rs. {Math.round((withdrawalData?.amount || 0) * 0.1).toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-grey-50 flex justify-between items-end">
                <span className="text-xs font-black text-primary uppercase tracking-widest">Net Payout</span>
                <span className="text-2xl font-black text-primary leading-none">Rs. {Math.round((withdrawalData?.amount || 0) * 0.9).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl bg-blue-50 border-none p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
              Verify the account title matches the provider name before completing the transfer to prevent disputes.
            </p>
          </Card>
        </div>

        {/* RIGHT COLUMN: PAYMENT METHODS */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white overflow-hidden">
            <Tabs defaultValue="bank" className="w-full">
              <TabsList className="w-full h-16 bg-grey-50 rounded-none border-b border-grey-100 grid grid-cols-3 p-1">
                <TabsTrigger value="bank" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Building2 className="w-4 h-4 mr-2" /> Bank
                </TabsTrigger>
                <TabsTrigger value="easypaisa" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Smartphone className="w-4 h-4 mr-2 text-green-500" /> EasyPaisa
                </TabsTrigger>
                <TabsTrigger value="jazzcash" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Smartphone className="w-4 h-4 mr-2 text-red-500" /> JazzCash
                </TabsTrigger>
              </TabsList>

              <div className="p-8">
                {/* BANK TAB */}
                <TabsContent value="bank" className="space-y-6 m-0 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-grey-900">Bank Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Bank Name with Dropdown Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-grey-400 uppercase tracking-widest ml-1">Bank Name</label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="w-full h-14 bg-surface rounded-2xl flex items-center px-5 font-bold text-grey-700 border border-transparent transition-colors">
                              {selectedBank}
                            </div>
                          </div>
                          
                          <Select value={selectedBank} onValueChange={setSelectedBank}>
                            <SelectTrigger className="w-14 h-14 rounded-2xl bg-white border border-grey-100 flex items-center justify-center text-primary shadow-sm hover:bg-grey-50">
                              <ChevronDown className="w-5 h-5" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]">
                              {PAKISTANI_BANKS.map((bank) => (
                                <SelectItem key={bank} value={bank} className="rounded-xl">
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <AccountField label="Account Number" value={withdrawalData?.account_details?.account_number || 'N/A'} />
                      <AccountField label="Account Title" value={withdrawalData?.account_details?.account_title || 'N/A'} />
                    </div>
                  </div>
                </TabsContent>

                {/* EASYPAISA TAB */}
                <TabsContent value="easypaisa" className="space-y-6 m-0 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-bold text-grey-900">EasyPaisa Mobile Wallet</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <AccountField label="Mobile Number" value={withdrawalData?.account_details?.mobile_number || 'N/A'} />
                      <AccountField label="Account Title" value={withdrawalData?.providers?.profiles?.full_name || 'N/A'} />
                    </div>
                  </div>
                </TabsContent>

                {/* JAZZCASH TAB */}
                <TabsContent value="jazzcash" className="space-y-6 m-0 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-red-500" />
                      </div>
                      <h3 className="font-bold text-grey-900">JazzCash Mobile Wallet</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <AccountField label="Mobile Number" value={withdrawalData?.account_details?.mobile_number || 'N/A'} />
                      <AccountField label="Account Title" value={withdrawalData?.providers?.profiles?.full_name || 'N/A'} />
                    </div>
                  </div>
                </TabsContent>

                {/* FOOTER ACTION */}
                <div className="mt-10 space-y-4">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary">Transaction Protection</p>
                      <p className="text-[10px] text-grey-500 font-medium">Recording this payout will deduct Rs. {Math.round((withdrawalData?.amount || 0) * 0.9).toLocaleString()} from the provider's Muawin balance.</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCompletePayout}
                    disabled={isProcessing}
                    className="w-full h-14 rounded-2xl bg-grey-900 hover:bg-black text-white text-lg font-bold shadow-xl shadow-grey-900/20 transition-all active:scale-95"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Finalize & Confirm Payout</>
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}

function AccountField({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-grey-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="w-full h-14 bg-surface rounded-2xl flex items-center px-5 font-bold text-grey-700 border border-transparent transition-colors">
        {value}
      </div>
    </div>
  );
}