'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminSupabase } from '@/lib/admin-supabase';
import { 
  ArrowLeft, 
  AlertTriangle, 
  User, 
  ShieldAlert, 
  Flag, 
  Clock, 
  MapPin, 
  Banknote, 
  CheckCircle2, 
  MessageSquare,
  ChevronRight,
  Info,
  History,
  Scale,
  Loader2,
  Ban,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ComplaintReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  
  // STATE VARIABLES
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'flag' | 'warning' | 'ban' | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [banDuration, setBanDuration] = useState<'7days' | '30days' | 'permanent'>('7days');
  const [permanentConfirmed, setPermanentConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [noteError, setNoteError] = useState('');

  const complaintId = typeof params.id === 'string' ? params.id : '';
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (complaintId) loadComplaint();
  }, [complaintId]);

  async function loadComplaint() {
    setLoading(true);
    try {
      const { data: complaint, error } = await adminSupabase
        .from('complaints')
        .select(`
          id,
          complaint_type,
          description,
          priority,
          status,
          created_at,
          customers(
            id,
            profiles(full_name, profile_image_url)
          ),
          providers(
            id,
            service_category,
            rating,
            completed_jobs,
            warning_count,
            flag_count,
            profiles(full_name, profile_image_url)
          ),
          jobs(
            id,
            total_amount,
            city
          )
        `)
        .eq('id', complaintId)
        .single();

      if (error) throw error;

      const job = Array.isArray(complaint.jobs) ? complaint.jobs[0] : complaint.jobs;
      const prov = Array.isArray(complaint.providers) ? complaint.providers[0] : complaint.providers;
      const cust = Array.isArray(complaint.customers) ? complaint.customers[0] : complaint.customers;
      const custProfile = Array.isArray(cust?.profiles) ? cust.profiles[0] : cust?.profiles;
      const provProfile = Array.isArray(prov?.profiles) ? prov.profiles[0] : prov?.profiles;

      setData({
        id: complaint.id.substring(0, 8).toUpperCase(),
        fullId: complaint.id,
        title: complaint.complaint_type || 'Complaint',
        description: complaint.description || '',
        urgent: complaint.priority === 'high' || complaint.priority === 'critical',
        time: new Date(complaint.created_at).toLocaleDateString('en-PK'),
        status: complaint.status === 'resolved' ? 'Resolved' : 'In Review',
        jobDetails: {
          id: job?.id?.substring(0, 8).toUpperCase() ?? 'N/A',
          date: new Date(complaint.created_at).toLocaleDateString('en-PK'),
          amount: job?.total_amount ? `Rs. ${job.total_amount}` : 'N/A',
          location: job?.city ?? 'N/A',
          category: prov?.service_category ?? 'N/A',
        },
        customer: {
          name: custProfile?.full_name ?? 'Customer',
          id: cust?.id?.substring(0, 8).toUpperCase() ?? 'N/A',
          rating: 0,
          history: '0 Jobs',
          avatar: custProfile?.profile_image_url ?? null,
        },
        provider: {
          name: provProfile?.full_name ?? 'Provider',
          id: prov?.id?.substring(0, 8).toUpperCase() ?? 'N/A',
          rawId: prov?.id ?? null,
          rating: prov?.rating ?? 0,
          history: `${prov?.completed_jobs ?? 0} Jobs`,
          strikes: prov?.warning_count ?? 0,
          flags: prov?.flag_count ?? 0,
          avatar: provProfile?.profile_image_url ?? null,
        },
      });
    } catch (e) {
      console.error('Error loading complaint:', JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  const handleActionConfirm = async () => {
    if (adminNote.trim().length < 20) {
      setNoteError('Please provide a reason (minimum 20 characters)');
      return;
    }
    if (selectedAction === 'ban' && banDuration === 'permanent' && !permanentConfirmed) {
      setNoteError('Please confirm permanent ban checkbox');
      return;
    }
    setIsLoading(true);

    const providerRawId = data?.provider?.rawId;
    if (!providerRawId || !selectedAction) {
      setIsLoading(false);
      return;
    }

    try {
      if (selectedAction === 'warning') {
        const { error } = await adminSupabase
          .from('providers')
          .update({ 
            warning_count: (data.provider.strikes || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', providerRawId);
        if (error) throw error;

      } else if (selectedAction === 'flag') {
        const { error } = await adminSupabase
          .from('providers')
          .update({ 
            flag_count: (data.provider.flags || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', providerRawId);
        if (error) throw error;

      } else if (selectedAction === 'ban') {
        // Calculate suspension end date
        let suspensionUntil = null;
        if (banDuration === '7days') {
          suspensionUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (banDuration === '30days') {
          suspensionUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        } else if (banDuration === 'permanent') {
          suspensionUntil = new Date('2099-12-31').toISOString();
        }

        // Suspend the provider's profile
        const { error: profileError } = await adminSupabase
          .from('profiles')
          .update({
            is_suspended: true,
            suspension_reason: adminNote,
            suspension_until: suspensionUntil,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.provider.rawId);
        if (profileError) throw profileError;
      }

      // Mark complaint as resolved
      const { error: complaintError } = await adminSupabase
        .from('complaints')
        .update({ 
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.fullId);
      if (complaintError) throw complaintError;

      setIsLoading(false);
      setActionCompleted(true);
      setModalOpen(false);

      toast({
        title: 'Action Applied ✅',
        description: selectedAction === 'warning' 
          ? 'Warning issued to provider.'
          : selectedAction === 'flag'
          ? 'Account flagged successfully.'
          : selectedAction === 'ban'
          ? `Account banned successfully. ${data?.provider?.name} banned for ${banDuration}.`
          : 'Action completed.',
      });

    } catch (e: any) {
      setIsLoading(false);
      console.error('Error applying action:', e);
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: e.message || 'Failed to apply action. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-6 space-y-6">
        <div className="h-10 w-64 bg-grey-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="h-64 bg-white rounded-3xl animate-pulse" />
            <div className="h-96 bg-white rounded-3xl animate-pulse" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 bg-white rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-muted-foreground font-bold">Complaint not found</p>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-grey-900">Review Complaint</h1>
              <Badge variant="outline" className="bg-grey-100 text-grey-600 border-none font-bold px-3">
                #{data.id}
              </Badge>
              {actionCompleted && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolved
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {data.urgent && !actionCompleted && (
              <Badge className="bg-red-500 text-white border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] animate-pulse">
                URGENT
              </Badge>
            )}
            <Badge className={cn(
              "border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]",
              actionCompleted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            )}>
              {actionCompleted ? 'RESOLVED' : data.status}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* LEFT COLUMN: COMPLAINT DETAILS */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Card 1: The Grievance */}
          <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold">{data.title}</h3>
              </div>
              
              <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 italic">
                <p className="text-grey-700 leading-relaxed">
                  "{data.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 bg-surface rounded-2xl">
                  <Clock className="w-5 h-5 text-grey-400" />
                  <div>
                    <p className="text-[10px] font-bold text-grey-400 uppercase tracking-widest">Reported</p>
                    <p className="text-sm font-bold">{data.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface rounded-2xl">
                  <Scale className="w-5 h-5 text-grey-400" />
                  <div>
                    <p className="text-[10px] font-bold text-grey-400 uppercase tracking-widest">Category</p>
                    <p className="text-sm font-bold">{data.jobDetails.category}</p>
                  </div>
                </div>
              </div>

              {/* ACTION RESULT BANNER */}
              {actionCompleted && (
                <div className={cn(
                  "mt-4 p-4 rounded-xl border flex items-start gap-3 animate-in zoom-in-95",
                  selectedAction === 'flag' ? "bg-yellow-50 border-yellow-200" :
                  selectedAction === 'warning' ? "bg-orange-50 border-orange-200" :
                  "bg-red-50 border-red-200"
                )}>
                  <div className="text-green-500 text-xl">✅</div>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedAction === 'flag' ? 'Account Flagged Successfully' :
                       selectedAction === 'warning' ? 'Warning Issued Successfully' :
                       'Account Banned Successfully'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedAction === 'flag' ? `${data.provider.name} has been flagged and notified.` :
                       selectedAction === 'warning' ? `Warning 1 of 3 issued to ${data.provider.name}.` :
                       banDuration === 'permanent' ? `${data.provider.name} has been permanently banned.` :
                       `${data.provider.name} banned for ${banDuration === '7days' ? '7 days' : '30 days'}.`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Action taken: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Card 2: Related Job Details */}
          <Card className="rounded-[32px] border-none shadow-sm p-8 space-y-6 bg-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Related Job Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-grey-400 uppercase tracking-widest">Service Location</p>
                    <p className="text-sm font-bold text-grey-700">{data.jobDetails.location}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-grey-400 uppercase tracking-widest">Agreed Payout</p>
                    <p className="text-sm font-bold text-grey-700">{data.jobDetails.amount}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-surface rounded-2xl border border-dashed border-grey-200 flex flex-col justify-center items-center text-center">
                <p className="text-[10px] font-bold text-grey-400 uppercase tracking-widest mb-1">Internal Job ID</p>
                <p className="text-lg font-black text-primary">{data.jobDetails.id}</p>
                <Button variant="link" size="sm" className="h-6 text-xs font-bold text-grey-500">View Full Job Log <ChevronRight className="w-3 h-3 ml-1" /></Button>
              </div>
            </div>
          </Card>

          {/* Card 3: Parties Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Profile */}
            <Card className="rounded-[32px] border-none shadow-sm p-6 bg-white space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h4 className="text-[10px] font-black text-grey-400 uppercase tracking-[0.2em]">Reporter</h4>
                <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px]">CUSTOMER</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-surface shadow-sm bg-grey-100 flex items-center justify-center">
                  {data.customer.avatar ? (
                    <img src={data.customer.avatar} alt="C" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-grey-400">{data.customer.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-grey-900">{data.customer.name}</h5>
                  <p className="text-xs text-grey-500">ID: {data.customer.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="text-center p-2 bg-surface rounded-xl">
                  <p className="text-[9px] font-bold text-grey-400 uppercase tracking-tighter">Rating</p>
                  <p className="text-xs font-bold text-grey-700">{data.customer.rating} ★</p>
                </div>
                <div className="text-center p-2 bg-surface rounded-xl">
                  <p className="text-[9px] font-bold text-grey-400 uppercase tracking-tighter">Usage</p>
                  <p className="text-xs font-bold text-grey-700">{data.customer.history}</p>
                </div>
              </div>
            </Card>

            {/* Provider Profile */}
            <Card className={cn(
              "rounded-[32px] border-none shadow-sm p-6 space-y-4",
              data.provider.strikes > 0 ? "bg-amber-50 ring-1 ring-amber-200" : "bg-white"
            )}>
              <div className="flex items-center justify-between border-b pb-4">
                <h4 className="text-[10px] font-black text-grey-400 uppercase tracking-[0.2em]">Accused</h4>
                <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px]">PROVIDER</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-grey-100 flex items-center justify-center">
                  {data.provider.avatar ? (
                    <img src={data.provider.avatar} alt="P" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-grey-400">{data.provider.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-grey-900">{data.provider.name}</h5>
                  <p className="text-xs text-grey-500">ID: {data.provider.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-white rounded-xl shadow-sm border border-grey-50">
                  <p className="text-[9px] font-bold text-grey-400 uppercase tracking-tighter">Rating</p>
                  <p className="text-xs font-bold text-grey-700">{data.provider.rating} ★</p>
                </div>
                <div className="text-center p-2 bg-white rounded-xl shadow-sm border border-grey-50">
                  <p className="text-[9px] font-bold text-grey-400 uppercase tracking-tighter">Strikes</p>
                  <p className={cn("text-xs font-bold", data.provider.strikes > 0 ? "text-red-600" : "text-grey-700")}>{data.provider.strikes}</p>
                </div>
                <div className="text-center p-2 bg-white rounded-xl shadow-sm border border-grey-50">
                  <p className="text-[9px] font-bold text-grey-400 uppercase tracking-tighter">Jobs</p>
                  <p className="text-xs font-bold text-grey-700">{data.provider.history.split(' ')[0]}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Card 4: Admin Action Panel */}
          <Card className="rounded-[32px] border-none shadow-xl bg-white overflow-hidden border-t-[6px] border-t-primary">
            <div className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-grey-900 flex items-center gap-2">
                ⚖️ Resolution Center
              </h3>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600" />
                <p className="text-xs font-bold text-blue-700 leading-tight">
                  Investigate conversation logs before taking high-impact disciplinary actions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => {
                      setSelectedAction('warning');
                      setSelectedProvider(data.provider);
                      setAdminNote('');
                      setNoteError('');
                      setActionCompleted(false);
                      setModalOpen(true);
                    }}
                    disabled={actionCompleted}
                    className={cn(
                      "h-14 rounded-2xl bg-grey-100 hover:bg-grey-200 text-grey-700 font-bold border-none transition-all active:scale-95",
                      actionCompleted && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Warning
                  </Button>
                  <Button 
                    onClick={() => {
                      setSelectedAction('flag');
                      setSelectedProvider(data.provider);
                      setAdminNote('');
                      setNoteError('');
                      setActionCompleted(false);
                      setModalOpen(true);
                    }}
                    disabled={actionCompleted}
                    className={cn(
                      "h-14 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold border-none transition-all active:scale-95",
                      actionCompleted && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Flag
                  </Button>
                  <Button 
                    onClick={() => {
                      setSelectedAction('ban');
                      setSelectedProvider(data.provider);
                      setAdminNote('');
                      setNoteError('');
                      setBanDuration('7days');
                      setPermanentConfirmed(false);
                      setActionCompleted(false);
                      setModalOpen(true);
                    }}
                    disabled={actionCompleted}
                    className={cn(
                      "h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold border-none transition-all active:scale-95 shadow-lg shadow-red-600/20",
                      actionCompleted && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Ban User
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  disabled={actionCompleted}
                  className="w-full text-grey-400 font-bold text-[10px] uppercase tracking-widest border border-dashed border-grey-200 rounded-2xl h-12"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setModalOpen(false);
                    setSelectedAction(null);
                    try {
                      const { error } = await adminSupabase
                        .from('complaints')
                        .update({ 
                          status: 'dismissed',
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', data.fullId);
                      if (error) throw error;
                      setActionCompleted(true);
                      toast({
                        title: 'Complaint Dismissed ✅',
                        description: 'The complaint has been dismissed.',
                      });
                    } catch (e: any) {
                      toast({
                        variant: 'destructive',
                        title: 'Failed',
                        description: 'Could not dismiss complaint.',
                      });
                    }
                  }}
                >
                  Dismiss Complaint
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* ACTION CONFIRMATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isLoading && setModalOpen(false)}
          />
          
          <div className={cn(
            "relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10 animate-in zoom-in-95 duration-200",
            selectedAction === 'flag' ? "border-t-4 border-yellow-500" : 
            selectedAction === 'warning' ? "border-t-4 border-orange-500" : 
            "border-t-4 border-red-600"
          )}>
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shadow-inner",
                  selectedAction === 'flag' ? "bg-yellow-100 text-yellow-600" :
                  selectedAction === 'warning' ? "bg-orange-100 text-orange-600" :
                  "bg-red-100 text-red-600"
                )}>
                  {selectedAction === 'flag' ? <AlertTriangle className="w-6 h-6" /> :
                   selectedAction === 'warning' ? <ShieldAlert className="w-6 h-6" /> :
                   <Ban className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-none">
                    {selectedAction === 'flag' ? "Flag Provider Account" :
                     selectedAction === 'warning' ? "Issue Formal Warning" :
                     "Ban Provider Account"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedAction === 'flag' ? "This account will be monitored" :
                     selectedAction === 'warning' ? "Account will be restricted" :
                     "Account will be suspended"}
                  </p>
                </div>
              </div>

              {/* PROVIDER ROW */}
              <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                  {selectedProvider?.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedProvider?.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.jobDetails.category}</p>
                </div>
              </div>
            </div>

            {/* ACTION INFO BOX */}
            <div className="space-y-4">
              {selectedAction === 'flag' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs space-y-2">
                  <p className="font-bold text-yellow-800">What flagging does:</p>
                  <ul className="text-yellow-700 space-y-1 ml-4 list-disc">
                    <li>Account stays active</li>
                    <li>Provider gets warning notification</li>
                    <li>Monitored for 30 days</li>
                    <li>Auto-removed after 30 days of good behavior</li>
                  </ul>
                </div>
              )}

              {selectedAction === 'warning' && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs space-y-2">
                  <p className="font-bold text-orange-800">What warning does:</p>
                  <ul className="text-orange-700 space-y-1 ml-4 list-disc">
                    <li>Account restricted</li>
                    <li>Cannot buy featured ads</li>
                    <li>Limited to 3 active bookings</li>
                    <li>Warning 1 of 3 — 3 warnings = automatic ban</li>
                  </ul>
                </div>
              )}

              {selectedAction === 'ban' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Select Ban Duration:</p>
                    <div className="space-y-2">
                      {[
                        { id: '7days', label: '7 Days' },
                        { id: '30days', label: '30 Days' },
                        { id: 'permanent', label: 'Permanent Ban' }
                      ].map((dur) => (
                        <label key={dur.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="banDuration"
                            checked={banDuration === dur.id}
                            onChange={() => {
                              setBanDuration(dur.id as any);
                              if (dur.id !== 'permanent') setPermanentConfirmed(false);
                            }}
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <span className={cn(
                            "text-sm font-bold transition-colors",
                            banDuration === dur.id ? "text-red-700" : "text-gray-500 group-hover:text-gray-700"
                          )}>{dur.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {banDuration === 'permanent' && (
                    <div className="space-y-3 pt-2 border-t border-red-200">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">This cannot be undone!</p>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={permanentConfirmed}
                          onChange={e => setPermanentConfirmed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="text-[11px] font-bold text-red-700 group-hover:text-red-800">
                          I confirm this is a permanent ban
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* ADMIN NOTE FIELD */}
              <div className="mt-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Reason / Note *
                </label>
                <textarea
                  value={adminNote}
                  onChange={e => {
                    setAdminNote(e.target.value);
                    setNoteError('');
                  }}
                  placeholder={
                    selectedAction === 'flag' 
                      ? "Why are you flagging this account..."
                      : selectedAction === 'warning'
                      ? "Describe the violation..."
                      : "Reason for ban..."
                  }
                  className={cn(
                    "w-full border rounded-xl p-4 text-sm resize-none h-28 outline-none transition-all",
                    noteError 
                      ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                      : 'border-gray-200 focus:ring-2 focus:ring-primary/20'
                  )}
                  maxLength={500}
                />
                <div className="flex justify-between mt-1.5 px-1">
                  {noteError && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {noteError}
                    </p>
                  )}
                  <p className={cn(
                    "text-[10px] font-bold ml-auto",
                    adminNote.length < 20 ? "text-gray-400" : "text-primary"
                  )}>
                    {adminNote.length}/500
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={handleActionConfirm}
                disabled={
                  isLoading || 
                  adminNote.trim().length < 20 ||
                  (selectedAction === 'ban' && banDuration === 'permanent' && !permanentConfirmed)
                }
                className={cn(
                  "flex-1 h-12 rounded-xl font-bold text-sm text-white transition-all active:scale-95 shadow-lg",
                  selectedAction === 'flag' ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20" :
                  selectedAction === 'warning' ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" :
                  "bg-red-600 hover:bg-red-700 shadow-red-600/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    {selectedAction === 'flag' ? 'Flag Account' :
                     selectedAction === 'warning' ? 'Issue Warning' :
                     banDuration === 'permanent' ? 'Permanently Ban' : 'Ban Account'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}