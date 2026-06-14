'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Banknote,
  Star,
  ShieldAlert,
  Loader2,
  Lock,
  Maximize2,
  Shield,
  Info,
  MessageSquare,
  Eye,
  Flag,
  Building2,
  ExternalLink,
  UserX,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  FileCheck,
  ThumbsUp,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { adminSupabase } from '@/lib/admin-supabase';

export default function ManageAccountPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch base profile
        const { data: profile, error: profileError } = await adminSupabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (profileError) throw profileError;
        setUserData(profile);

        // Fetch role-specific data
        if (profile.role === 'provider') {
          const { data: providerData } = await adminSupabase
            .from('providers')
            .select('*')
            .eq('profile_id', profile.id)
            .single();
          setUserData({ ...profile, providerDetails: providerData });

          // Fetch provider jobs
          const { data: jobsData } = await adminSupabase
            .from('jobs')
            .select('id, title, status, total_amount, created_at')
            .eq('provider_id', providerData?.id)
            .order('created_at', { ascending: false })
            .limit(5);
          setJobs(jobsData || []);

          // Fetch complaints against provider
          const { data: complaintsData } = await adminSupabase
            .from('complaints')
            .select('id, description, status, created_at')
            .eq('provider_id', providerData?.id)
            .order('created_at', { ascending: false })
            .limit(5);
          setComplaints(complaintsData || []);

          // Fetch reviews for provider
          const { data: reviewsData } = await adminSupabase
            .from('reviews')
            .select('id, rating, review, created_at')
            .eq('provider_id', providerData?.id)
            .order('created_at', { ascending: false })
            .limit(5);
          setReviews(reviewsData || []);

          // Fetch provider documents
          console.log('Fetching docs for provider ID:', providerData?.id);
          const { data: docsData } = await adminSupabase
            .from('provider_documents')
            .select('id, file_name, document_type, status, file_url, expiry_date, uploaded_at')
            .eq('provider_id', providerData?.id)
            .order('uploaded_at', { ascending: false });
          console.log('Documents found:', docsData);
          setDocuments(docsData || []);

        } else if (profile.role === 'customer') {
          const { data: customerData } = await adminSupabase
            .from('customers')
            .select('*')
            .eq('profile_id', profile.id)
            .single();
          setUserData({ ...profile, customerDetails: customerData });

          // Fetch customer jobs
          const { data: jobsData } = await adminSupabase
            .from('jobs')
            .select('id, title, status, total_amount, created_at')
            .eq('customer_id', customerData?.id)
            .order('created_at', { ascending: false })
            .limit(5);
          setJobs(jobsData || []);

          // Fetch complaints by customer
          const { data: complaintsData } = await adminSupabase
            .from('complaints')
            .select('id, description, status, created_at')
            .eq('customer_id', customerData?.id)
            .order('created_at', { ascending: false })
            .limit(5);
          setComplaints(complaintsData || []);

        } else if (profile.role === 'vendor') {
          const { data: vendorData } = await adminSupabase
            .from('vendors')
            .select('*')
            .eq('profile_id', profile.id)
            .single();
          setUserData({ ...profile, vendorDetails: vendorData });
        }

      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchUserData();
  }, [params.id]);

  const handleSuspend = async () => {
    setSaving(true);
    try {
      const { error } = await adminSupabase
        .from('profiles')
        .update({
          is_suspended: !userData?.is_suspended,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;
      setUserData((prev: any) => ({
        ...prev,
        is_suspended: !prev?.is_suspended
      }));
      toast({
        title: userData?.is_suspended ? 'Account Unsuspended' : 'Account Suspended',
        description: 'Profile status updated successfully.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update account status.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = () => {
    if (!userData?.email) {
      toast({
        variant: 'destructive',
        title: 'No Email',
        description: 'This user has no email address on file.',
      });
      return;
    }
    const subject = encodeURIComponent('Muawin Platform - Important Notice');
    const body = encodeURIComponent(
      `Dear ${userData?.full_name || 'User'},\n\nThis is a message from the Muawin Admin Team.\n\n`
    );
    window.open(`mailto:${userData.email}?subject=${subject}&body=${body}`, '_blank');
    toast({
      title: 'Email Composer Opened',
      description: `Composing email to ${userData.email}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-6 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-grey-400 uppercase tracking-widest">Fetching Account Profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <p className="text-grey-400 font-bold">User not found.</p>
      </div>
    );
  }

  const activeJobs = ['provider', 'customer'].includes(userData?.role)
    ? jobs?.filter((j: any) => ['In Progress', 'Scheduled', 'in_progress', 'scheduled', 'pending', 'assigned'].includes(j.status)) || []
    : [];

  const historyJobs = ['provider', 'customer'].includes(userData?.role)
    ? jobs?.filter((j: any) => ['Completed', 'Cancelled', 'completed', 'cancelled'].includes(j.status)) || []
    : [];

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/admin/users')}
              className="rounded-full hover:bg-grey-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-grey-900">{userData?.full_name || 'N/A'}</h1>
                <Badge className={cn(
                  "border-none font-bold text-[10px] uppercase tracking-wider h-5",
                  userData?.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {userData?.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-xs text-grey-400 font-bold uppercase tracking-widest">Account ID: {userData?.id?.slice(0,8).toUpperCase() || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl font-bold text-red-600 border-red-200 hover:bg-red-50 h-11 px-6"
              onClick={handleSuspend}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {userData?.is_suspended ? 'Unsuspend Account' : 'Suspend Account'}
            </Button>
            <Button 
              className="rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 h-11 px-6"
              onClick={handleSendEmail}
            >
              <Mail className="w-4 h-4 mr-2" /> Send Email
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-8 w-full">
          
          {/* Profile Basic Info Card */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden p-8 md:p-10 w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
              <div className="relative shrink-0">
                <div className="w-36 h-36 rounded-[48px] overflow-hidden border-4 border-white shadow-2xl bg-grey-100 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-4xl">
                    {userData?.full_name?.slice(0,2).toUpperCase() || 'US'}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-primary rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-6 text-center md:text-left w-full">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h2 className="text-3xl font-black text-grey-900">{userData?.full_name || 'N/A'}</h2>
                  </div>
                  <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{userData?.role || 'N/A'} {userData?.providerDetails?.service_categories?.name && `• ${userData.providerDetails.service_categories.name}`}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-6 gap-x-20">
                  <div className="flex items-center justify-center md:justify-start gap-4 text-grey-600">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <Mail className="w-5 h-5 text-primary/60" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Email Address</span>
                      <span className="text-sm font-bold text-grey-800">{userData?.email || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-grey-600">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <Calendar className="w-5 h-5 text-primary/60" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Membership</span>
                      <span className="text-sm font-bold text-grey-800">Joined {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-grey-600">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <Phone className="w-5 h-5 text-primary/60" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Phone Number</span>
                      <span className="text-sm font-bold text-grey-800">{userData?.phone_number || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-grey-600">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <MapPin className="w-5 h-5 text-primary/60" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Location</span>
                      <span className="text-sm font-bold text-grey-800">{userData?.city || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-grey-50 pt-10">
              <div className="p-6 bg-surface rounded-[28px] border border-grey-100 flex items-center gap-5 transition-all hover:shadow-md hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 text-blue-600">
                  <History className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Total Jobs</p>
                  <p className="text-xl font-black text-grey-900">{jobs.length}</p>
                </div>
              </div>
              <div className="p-6 bg-surface rounded-[28px] border border-grey-100 flex items-center gap-5 transition-all hover:shadow-md hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 text-green-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Completed Jobs</p>
                  <p className="text-xl font-black text-grey-900">{historyJobs.filter((j: any) => ['Completed', 'completed'].includes(j.status)).length}</p>
                </div>
              </div>
              <div className="p-6 bg-surface rounded-[28px] border border-grey-100 flex items-center gap-5 transition-all hover:shadow-md hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 text-amber-500">
                  <Star className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Total Reviews</p>
                  <p className="text-xl font-black text-grey-900">{reviews.length}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Vendor Specific: Location & Business Info */}
          {userData?.role === 'vendor' && (
            <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-6 w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location & Accessibility
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <Building2 className="w-5 h-5 text-primary/60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Business Name</p>
                      <p className="text-sm font-bold text-grey-800">{userData?.vendorDetails?.business_name || userData?.full_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <MapPin className="w-5 h-5 text-primary/60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">City / Region</p>
                      <p className="text-sm font-bold text-grey-800">{userData?.city || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-grey-50">
                      <MapPin className="w-5 h-5 text-primary/60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">Exact Business Address</p>
                      <p className="text-sm font-bold text-grey-800">{userData?.vendorDetails?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Role Specific Detailed Lists (Common for Customer and Provider) */}
          {['provider', 'customer'].includes(userData?.role) && (
            <>
              {/* Jobs Section */}
              <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-6 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    {userData?.role === 'customer' ? 'Your Jobs' : 'Active Assignments'}
                  </h3>
                  <Badge variant="outline" className="font-bold text-[10px]">{activeJobs.length} Active / Scheduled</Badge>
                </div>
                <div className="space-y-4">
                  {activeJobs.length > 0 ? activeJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-grey-50 group hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-grey-800">{job.title || 'Job'}</h5>
                          <p className="text-[10px] text-grey-400 font-bold uppercase">
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">{job.total_amount ? `Rs. ${job.total_amount}` : 'N/A'}</p>
                        <Badge className={cn(
                          "border-none text-[9px] h-5",
                          ['In Progress', 'in_progress', 'pending', 'assigned'].includes(job.status) ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        )}>{job.status}</Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-grey-400 text-center py-4">No records found</p>
                  )}
                </div>
              </Card>

              {/* Jobs History */}
              <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-6 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Jobs History
                  </h3>
                  <Badge variant="outline" className="font-bold text-[10px]">{historyJobs.length} Completed / Cancelled</Badge>
                </div>
                <div className="space-y-4">
                  {historyJobs.length > 0 ? historyJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-grey-50 group hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <History className="w-5 h-5 text-grey-400" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-grey-800">{job.title || 'Job'}</h5>
                          <p className="text-[10px] text-grey-400 font-bold uppercase">
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-grey-900">{job.total_amount ? `Rs. ${job.total_amount}` : 'N/A'}</p>
                        <Badge className={cn(
                          "border-none text-[9px] h-5",
                          ['Completed', 'completed'].includes(job.status) ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        )}>{job.status}</Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-grey-400 text-center py-4">No records found</p>
                  )}
                </div>
              </Card>

              {/* Complaint Audit */}
              <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-8 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    Complaint Audit
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <AlertCircle className="w-3.5 h-3.5 text-grey-400" />
                    <h4 className="text-[10px] font-black text-grey-400 uppercase tracking-[0.2em]">Complaints</h4>
                  </div>
                  {complaints.length > 0 ? (
                    <div className="space-y-3">
                      {complaints.map((comp: any) => (
                        <div key={comp.id} className="p-4 bg-surface rounded-2xl border border-grey-50 flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-grey-100 group-hover:border-primary/20">
                              <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-grey-800">{comp.description || 'Complaint'}</h5>
                              <p className="text-[10px] text-grey-400 font-bold uppercase">
                                {new Date(comp.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-blue-50 text-blue-700 border-none font-bold text-[10px] uppercase">{comp.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-grey-400 text-center py-4">No records found</p>
                  )}
                </div>
              </Card>

              {/* Reviews Section */}
              <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-6 w-full">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  {userData?.role === 'customer' ? 'Reviews Given' : 'Reviews Received'}
                </h3>
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map((rev: any) => (
                    <div key={rev.id} className="p-5 bg-surface rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("w-3 h-3", i < rev.rating ? "fill-amber-400 text-amber-400" : "text-grey-200")} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-grey-400 uppercase">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-grey-600 italic leading-relaxed">"{rev.review || 'No comment'}"</p>
                    </div>
                  )) : (
                    <p className="text-sm text-grey-400 text-center py-4">No records found</p>
                  )}
                </div>
              </Card>

              {/* Document Library */}
              {userData?.role === 'provider' && (
                <Card className="rounded-2xl border border-grey-100 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-grey-900 flex items-center gap-2">
                      📁 Document Library
                    </h3>
                    <span className="text-[10px] font-black text-grey-400 uppercase tracking-widest">
                      {documents.length} file{documents.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {documents.length === 0 ? (
                    <p className="text-sm text-grey-400 text-center py-6">
                      No documents uploaded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc: any) => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-grey-50 rounded-xl border border-grey-100 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white border border-grey-200 flex items-center justify-center shrink-0 text-base">
                              {doc.file_name?.endsWith('.pdf') ? '📄' : 
                               doc.file_name?.endsWith('.png') || doc.file_name?.endsWith('.jpg') || doc.file_name?.endsWith('.jpeg') ? '🖼️' : '📎'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-grey-900 truncate max-w-[200px]">
                                {doc.file_name || 'Document'}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-grey-400 uppercase tracking-wider">
                                  {doc.document_type || 'document'}
                                </span>
                                <span className="text-grey-200">•</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  doc.status === 'verified' ? 'text-green-600' :
                                  doc.status === 'rejected' ? 'text-red-500' :
                                  'text-yellow-600'
                                }`}>
                                  {doc.status || 'pending'}
                                </span>
                                {doc.expiry_date && (
                                  <>
                                    <span className="text-grey-200">•</span>
                                    <span className="text-[10px] font-medium text-grey-400">
                                      Expires: {new Date(doc.expiry_date).toLocaleDateString('en-PK')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-grey-300 font-medium hidden group-hover:block">
                              {new Date(doc.uploaded_at).toLocaleDateString('en-PK')}
                            </span>
                            
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 w-8 rounded-lg bg-white border border-grey-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-grey-500"
                              title="View Document"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          {/* Admin Control Actions */}
          <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-6 w-full">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Administrative Actions
            </h3>
            
            <div className="p-4 bg-red-50 rounded-2xl space-y-3 border border-red-100">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Disciplinary</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="w-full justify-start rounded-xl font-bold text-sm h-11 border-red-200 text-red-600 hover:bg-red-100">
                  <ShieldAlert className="w-4 h-4 mr-2" /> Issue Strike
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl font-bold text-sm h-11 border-red-200 text-red-600 hover:bg-red-100">
                  <Flag className="w-4 h-4 mr-2" /> Flag Account
                </Button>
                <Button variant="destructive" className="w-full justify-start rounded-xl font-bold text-sm h-11 shadow-lg shadow-red-600/20">
                  <Ban className="w-4 h-4 mr-2" /> Ban Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}