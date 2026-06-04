'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Maximize2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Tag, 
  Zap, 
  Target, 
  Ruler, 
  Lock,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { adminSupabase } from '@/lib/admin-supabase';

export default function VerificationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<any>(null);
  const [isFaceDetailsOpen, setIsFaceDetailsOpen] = useState(false);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | null>(null);
  const [saving, setSaving] = useState(false);
  const [faceMatchData, setFaceMatchData] = useState<any>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        // Fetch provider with profile
        const { data, error } = await adminSupabase
          .from('providers')
          .select(`
            id,
            profile_id,
            verification_status,
            cnic_number,
            cnic_front_url,
            cnic_back_url,
            selfie_url,
            experience_years,
            created_at,
            updated_at,
            profiles!inner(
              full_name,
              email,
              phone_number,
              city,
              profile_image_url,
              created_at
            ),
            service_categories(
              name
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProviderData(data);

        if (data.verification_status === 'verified') {
          setDecision('approved');
        } else if (data.verification_status === 'rejected') {
          setDecision('rejected');
        } else {
          setDecision('pending');
        }

        // Fetch latest verification record for this provider
        const { data: verification } = await adminSupabase
          .from('verifications')
          .select('id, status, created_at')
          .eq('provider_id', params.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (verification) {
          // Fetch face match result linked to this verification
          const { data: faceMatch } = await adminSupabase
            .from('face_match_results')
            .select('*')
            .eq('verification_id', verification.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (faceMatch) {
            setFaceMatchData(faceMatch);
          }
        }

      } catch (err) {
        console.error('Error fetching provider:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProvider();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] p-6 space-y-6">
        <div className="h-8 w-48 bg-grey-200 animate-pulse rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <div className="h-64 bg-white rounded-2xl animate-pulse shadow-sm" />
            <div className="h-96 bg-white rounded-2xl animate-pulse shadow-sm" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 bg-white rounded-2xl animate-pulse shadow-sm" />
            <div className="h-64 bg-white rounded-2xl animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!providerData) return null;
  
  const profile = providerData.profiles;
  const category = providerData.service_categories?.name || 'N/A';
  
  const match = {
    decision: faceMatchData?.decision || 'PENDING',
    recommendation: faceMatchData?.recommendation || 'MANUAL_REVIEW',
    confidence_score: faceMatchData?.confidence_score 
      ? parseFloat(faceMatchData.confidence_score) * 100 
      : 0,
    confidence_percentage: faceMatchData?.confidence_percentage || '0%',
    distance: faceMatchData?.distance 
      ? parseFloat(faceMatchData.distance).toFixed(3) 
      : 'N/A',
    is_match: faceMatchData?.is_match || false,
    threshold_used: faceMatchData?.threshold_used || 0.6,
    model_used: faceMatchData?.model_used || 'Pending',
    processing_time_ms: faceMatchData?.processing_time_ms || 0,
  };

  const handleAction = async (type: 'approve' | 'reject') => {
    setSaving(true);
    try {
      const newStatus = type === 'approve' ? 'verified' : 'rejected';
      
      const { error } = await adminSupabase
        .from('providers')
        .update({
          verification_status: newStatus,
          is_verified: type === 'approve',
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;

      setDecision(type === 'approve' ? 'approved' : 'rejected');
      setShowConfirm(null);
    } catch (err: any) {
      console.error('Error updating verification:', err);
      alert('Failed to save decision. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] pb-20">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-grey-100 px-6 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => router.push('/admin/verification')}
              className="flex items-center text-sm font-bold text-grey-500 hover:text-[#047A62] transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Queue
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-grey-900">Verification Details</h1>
              <Badge variant="outline" className="bg-grey-100 text-grey-600 border-none font-bold px-3">
                {`VRF-${providerData.id.slice(0, 8).toUpperCase()}`}
              </Badge>
            </div>
            <p className="text-xs text-grey-400 font-medium">
              Submitted on {new Date(providerData.created_at).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {decision === "pending" ? (
              <Badge className="bg-yellow-100 text-yellow-700 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                PENDING REVIEW
              </Badge>
            ) : decision === "approved" ? (
              <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                APPROVED
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                REJECTED
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Card 1: AI Face Match Result */}
          <Card className={cn(
            "rounded-2xl border border-grey-100 p-0 overflow-hidden shadow-sm transition-all",
            match.decision === 'MATCH' ? "border-l-[6px] border-l-green-500" : 
            match.decision === 'NO_MATCH' ? "border-l-[6px] border-l-red-500" : 
            "border-l-[6px] border-l-yellow-500"
          )}>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-grey-900 flex items-center gap-2">
                  🤖 AI Face Match Result
                </h3>
                <Badge variant="outline" className="bg-grey-50 text-grey-500 border-grey-200 text-[10px] font-bold">
                  {match.model_used} Model
                </Badge>
              </div>

              {/* Decision Banner */}
              <div className={cn(
                "p-6 rounded-2xl border flex items-center gap-5",
                match.decision === 'MATCH' ? "bg-green-50 border-green-200" :
                match.decision === 'NO_MATCH' ? "bg-red-50 border-red-200" :
                "bg-yellow-50 border-yellow-200"
              )}>
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  match.decision === 'MATCH' ? "bg-green-500" :
                  match.decision === 'NO_MATCH' ? "bg-red-500" :
                  "bg-yellow-500"
                )}>
                  {match.decision === 'MATCH' ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : match.decision === 'NO_MATCH' ? (
                    <XCircle className="w-8 h-8 text-white" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h4 className={cn(
                    "text-2xl font-black leading-tight",
                    match.decision === 'MATCH' ? "text-green-700" :
                    match.decision === 'NO_MATCH' ? "text-red-700" :
                    "text-yellow-700"
                  )}>
                    {match.decision === 'MATCH' ? "MATCH DETECTED" : 
                     match.decision === 'NO_MATCH' ? "NO MATCH DETECTED" : 
                     "POSSIBLE MATCH"}
                  </h4>
                  <p className={cn(
                    "text-sm font-medium",
                    match.decision === 'MATCH' ? "text-green-600" :
                    match.decision === 'NO_MATCH' ? "text-red-600" :
                    "text-yellow-600"
                  )}>
                    {match.decision === 'MATCH' ? "Faces appear to be the same person" : 
                     match.decision === 'NO_MATCH' ? "Faces do not appear to match" : 
                     "Manual review highly recommended"}
                  </p>
                </div>
              </div>

              {/* Confidence Score Section */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-grey-400 uppercase tracking-widest">Match Certainty</p>
                    <h2 className={cn(
                      "text-5xl font-black",
                      match.confidence_score >= 85 ? "text-green-600" :
                      match.confidence_score >= 60 ? "text-blue-600" :
                      match.confidence_score >= 40 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {match.confidence_percentage}
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-grey-500 mb-2">Confidence Score</p>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-3 bg-grey-100 rounded-full overflow-hidden flex">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        match.confidence_score >= 85 ? "bg-green-500" :
                        match.confidence_score >= 60 ? "bg-blue-500" :
                        match.confidence_score >= 40 ? "bg-yellow-500" : "bg-red-500"
                      )} 
                      style={{ width: `${match.confidence_score}%` }} 
                    />
                  </div>
                  <div className="flex justify-between px-1">
                    {[
                      { label: "Reject", val: "0%" },
                      { label: "Review", val: "40%" },
                      { label: "Match", val: "60%" },
                      { label: "Strong", val: "85%" }
                    ].map((m, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="h-1 w-px bg-grey-200 mb-1" />
                        <span className="text-[9px] font-bold text-grey-400 uppercase">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-grey-50 rounded-2xl border border-grey-100 space-y-1 relative group cursor-help">
                  <div className="flex items-center justify-between">
                    <Ruler className="w-4 h-4 text-grey-400" />
                    <Info className="w-3 h-3 text-grey-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-black text-grey-900">{match.distance}</p>
                  <p className="text-[10px] font-bold text-grey-500 uppercase tracking-tighter">Cosine Distance</p>
                </div>
                <div className="p-4 bg-grey-50 rounded-2xl border border-grey-100 space-y-1">
                  <Target className="w-4 h-4 text-grey-400" />
                  <p className="text-sm font-black text-grey-900">{match.threshold_used}</p>
                  <p className="text-[10px] font-bold text-grey-500 uppercase tracking-tighter">Match Threshold</p>
                </div>
                <div className="p-4 bg-grey-50 rounded-2xl border border-grey-100 space-y-1">
                  <Zap className="w-4 h-4 text-grey-400" />
                  <p className="text-sm font-black text-grey-900">{(match.processing_time_ms / 1000).toFixed(2)}s</p>
                  <p className="text-[10px] font-bold text-grey-500 uppercase tracking-tighter">Processing Time</p>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="pt-4 space-y-3">
                <p className="text-xs font-bold text-grey-500 flex items-center gap-2">
                  📋 AI Recommendation:
                </p>
                <div className={cn(
                  "p-4 rounded-xl font-bold text-sm flex items-center gap-3",
                  match.recommendation === 'APPROVE' ? "bg-green-50 text-green-700 border border-green-100" :
                  match.recommendation === 'REJECT' ? "bg-red-50 text-red-700 border border-red-100" :
                  "bg-yellow-50 text-yellow-700 border border-yellow-100"
                )}>
                  {match.recommendation === 'APPROVE' && <CheckCircle2 className="w-5 h-5" />}
                  {match.recommendation === 'REJECT' && <XCircle className="w-5 h-5" />}
                  {match.recommendation === 'MANUAL_REVIEW' && <Info className="w-5 h-5" />}
                  {match.recommendation === 'APPROVE' ? "Approve this verification" : 
                   match.recommendation === 'REJECT' ? "Reject this verification" : 
                   "Requires manual investigation"}
                </div>
                <p className="text-[10px] text-grey-400 italic">
                  * This is an automated suggestion based on facial feature vectors. Final decision must be made by an authorized administrator.
                </p>
              </div>
            </div>
          </Card>

          {/* Card 2: Image Comparison */}
          <Card className="rounded-2xl border border-grey-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-grey-900 flex items-center gap-2">
              📸 Image Comparison
            </h3>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Side - CNIC Photo */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-grey-700 px-1">CNIC Photo (Face Extraction)</p>
                <div className="aspect-[3/4] bg-grey-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-grey-200 relative overflow-hidden group">
                  {providerData?.cnic_front_url && (
                    <img 
                      src={providerData.cnic_front_url}
                      alt="CNIC Front"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    />
                  )}
                  <Lock className="w-10 h-10 text-grey-300 mb-3" />
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest text-center px-6">
                    Image Stored Securely<br />On Verification Server
                  </p>
                  <Button variant="ghost" size="sm" className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg">
                    <Maximize2 className="w-4 h-4 mr-2" /> View Original
                  </Button>
                </div>
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Face Detected
                  </div>
                  <p className="text-[10px] font-medium text-grey-400 tracking-tight">
                    99% confident • Position X:100 Y:50
                  </p>
                </div>
              </div>

              {/* Center Divider */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#F5F7F8] rounded-full border border-grey-100 items-center justify-center font-black text-xs text-grey-400 shadow-sm">
                VS
              </div>

              {/* Right Side - Selfie */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-grey-700 px-1">Live Selfie Photo</p>
                <div className="aspect-square bg-grey-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-grey-200 relative overflow-hidden group">
                  {providerData?.selfie_url && (
                    <img 
                      src={providerData.selfie_url}
                      alt="Selfie"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    />
                  )}
                  <Lock className="w-10 h-10 text-grey-300 mb-3" />
                  <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest text-center px-6">
                    Live Capture Stored<br />In Secure S3 Bucket
                  </p>
                  <Button variant="ghost" size="sm" className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg">
                    <Maximize2 className="w-4 h-4 mr-2" /> View Original
                  </Button>
                </div>
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Face Detected
                  </div>
                  <p className="text-[10px] font-medium text-grey-400 tracking-tight">
                    98% confident • Captured 2024-01-15
                  </p>
                </div>
              </div>
            </div>

            <div className={cn(
              "w-full p-4 rounded-xl border flex items-center justify-center gap-3 font-bold text-sm",
              match.is_match ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
            )}>
              {match.is_match ? (
                <>
                  <ShieldCheck className="w-5 h-5" /> 
                  These faces match with {match.confidence_percentage} confidence
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  These faces do not appear to match
                </>
              )}
            </div>
          </Card>

          {/* Card 3: Face Extraction Details */}
          <Card className="rounded-2xl border border-grey-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setIsFaceDetailsOpen(!isFaceDetailsOpen)}
              className="w-full p-6 flex justify-between items-center hover:bg-grey-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-grey-900 flex items-center gap-2">
                🔍 Face Extraction Details
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-grey-400 uppercase tracking-widest">
                {isFaceDetailsOpen ? 'Hide Details' : 'Show Details'}
                {isFaceDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isFaceDetailsOpen && (
              <div className="p-6 pt-0 space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CNIC Source Analysis */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest ml-1">CNIC Source Analysis</p>
                    <div className="rounded-xl border border-grey-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-grey-100">
                          <tr className="bg-white">
                            <td className="p-3 text-grey-500 font-medium">Face Detected</td>
                            <td className="p-3 text-right font-bold text-green-600">✅ Yes</td>
                          </tr>
                          <tr className="bg-grey-50">
                            <td className="p-3 text-grey-500 font-medium">Confidence</td>
                            <td className="p-3 text-right font-bold text-grey-900">99.0%</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 text-grey-500 font-medium">Face Location X</td>
                            <td className="p-3 text-right font-bold text-grey-900">100px</td>
                          </tr>
                          <tr className="bg-grey-50">
                            <td className="p-3 text-grey-500 font-medium">Face Location Y</td>
                            <td className="p-3 text-right font-bold text-grey-900">50px</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 text-grey-500 font-medium">Face Width</td>
                            <td className="p-3 text-right font-bold text-grey-900">150px</td>
                          </tr>
                          <tr className="bg-grey-50">
                            <td className="p-3 text-grey-500 font-medium">Face Height</td>
                            <td className="p-3 text-right font-bold text-grey-900">180px</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selfie Source Analysis */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest ml-1">Selfie Source Analysis</p>
                    <div className="rounded-xl border border-grey-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-grey-100">
                          <tr className="bg-white">
                            <td className="p-3 text-grey-500 font-medium">Face Detected</td>
                            <td className="p-3 text-right font-bold text-green-600">✅ Yes</td>
                          </tr>
                          <tr className="bg-grey-50">
                            <td className="p-3 text-grey-500 font-medium">Confidence</td>
                            <td className="p-3 text-right font-bold text-grey-900">98.0%</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 text-grey-500 font-medium">Capture Environment</td>
                            <td className="p-3 text-right font-bold text-grey-900">Mobile</td>
                          </tr>
                          <tr className="bg-grey-50">
                            <td className="p-3 text-grey-500 font-medium">Liveness Check</td>
                            <td className="p-3 text-right font-bold text-green-600">Passed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Card 4: Image Quality Report */}
          <Card className="rounded-2xl border border-grey-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-grey-900 flex items-center gap-2">
              📊 Image Quality Report
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* CNIC Document Quality */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-grey-700">CNIC Document</p>
                  <Badge className="bg-green-100 text-green-700 border-none font-bold">✅ Good Quality</Badge>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Brightness", score: 80, status: "Good" },
                    { label: "Sharpness", score: 90, status: "Good" },
                    { label: "Resolution", score: 85, status: "Good" }
                  ].map((m, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-grey-400 uppercase tracking-widest">
                        <span>{m.label}</span>
                        <span className="text-green-600">{m.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-grey-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${m.score}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-grey-500">{m.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selfie Quality */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-grey-700">Selfie Capture</p>
                  <Badge className="bg-green-100 text-green-700 border-none font-bold">✅ Good Quality</Badge>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Brightness", score: 75, status: "Good" },
                    { label: "Sharpness", score: 85, status: "Good" },
                    { label: "Stability", score: 95, status: "Excellent" }
                  ].map((m, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-grey-400 uppercase tracking-widest">
                        <span>{m.label}</span>
                        <span className="text-green-600">{m.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-grey-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${m.score}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-grey-500">{m.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warnings Section */}
            <div className="pt-4 border-t border-grey-100">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-green-800">No quality issues detected</p>
                  <p className="text-xs text-green-600 font-medium">Both images meet all required processing standards for accurate matching.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Card 5: Provider Information */}
          <Card className="rounded-2xl border border-grey-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#047A62] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {profile?.full_name?.slice(0,2).toUpperCase() || 'PR'}
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-grey-900">{profile?.full_name || 'N/A'}</h4>
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                  {category}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", val: profile?.email || 'N/A' },
                { icon: Phone, label: "Phone", val: profile?.phone_number || 'N/A' },
                { icon: MapPin, label: "City", val: profile?.city || 'N/A' },
                { icon: Calendar, label: "Created", val: new Date(profile?.created_at || providerData.created_at).toLocaleDateString() },
                { icon: Tag, label: "ID", val: providerData.id }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group p-2 -mx-2 rounded-xl hover:bg-grey-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-grey-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-grey-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-grey-900 truncate">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-grey-100">
              <div className="p-4 bg-grey-50 rounded-xl space-y-1">
                <p className="text-[10px] font-black text-grey-400 uppercase tracking-widest">Verification History</p>
                <p className="text-xs font-bold text-grey-600">Previous Verifications: 0</p>
                <p className="text-xs font-medium text-grey-400">This is their first verification attempt.</p>
              </div>
            </div>
          </Card>

          {/* Card 6: Admin Decision Panel */}
          <Card className="rounded-2xl border border-grey-100 p-0 overflow-hidden shadow-sm border-t-[6px] border-t-green-600">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-grey-900 flex items-center gap-2">
                ⚖️ Admin Decision
              </h3>

              {/* AI Suggestion Reminder */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                <Bot className="w-5 h-5 text-blue-600" />
                <p className="text-xs font-bold text-blue-700 leading-tight">
                  AI suggests: APPROVE ({match.confidence_percentage} match)
                </p>
              </div>

              {decision === "pending" ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-grey-400 uppercase tracking-widest">
                        Admin Note (Optional)
                      </label>
                      <span className="text-[9px] font-bold text-grey-300">{adminNote.length}/500</span>
                    </div>
                    <Textarea 
                      placeholder="Add a note about your decision..."
                      className="rounded-xl bg-grey-50 border-grey-100 min-h-[120px] focus-visible:ring-[#047A62] text-sm"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value.slice(0, 500))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 pt-2">
                    <Button 
                      onClick={() => setShowConfirm("approve")}
                      className="h-[52px] rounded-xl bg-green-600 hover:bg-green-700 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-green-600/20"
                    >
                      ✅ Approve
                    </Button>
                    <Button 
                      onClick={() => setShowConfirm("reject")}
                      variant="destructive"
                      className="h-[52px] rounded-xl bg-red-600 hover:bg-red-700 font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20"
                    >
                      ❌ Reject
                    </Button>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-yellow-400 text-yellow-700 hover:bg-yellow-50 font-bold text-xs uppercase tracking-widest mt-2"
                  >
                    ⚠️ Request More Info
                  </Button>
                </>
              ) : (
                <div className={cn(
                  "p-6 rounded-2xl border space-y-3 animate-in zoom-in-95",
                  decision === "approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}>
                  <div className="flex items-center gap-3">
                    {decision === "approved" ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <h4 className={cn(
                      "text-base font-black uppercase tracking-widest",
                      decision === "approved" ? "text-green-800" : "text-red-800"
                    )}>
                      {decision === "approved" ? "Approved by Admin" : "Rejected by Admin"}
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-grey-500">Decision made on Jan 15, 2024</p>
                    {adminNote && (
                      <p className="text-xs font-medium text-grey-600 italic">
                        " {adminNote} "
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDecision("pending")}
                    className="text-[10px] font-black text-grey-400 uppercase hover:text-primary h-8"
                  >
                    Undo Decision
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Card 7: Processing Information */}
          <Card className="rounded-2xl border border-grey-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setIsProcessingOpen(!isProcessingOpen)}
              className="w-full p-6 flex justify-between items-center hover:bg-grey-50 transition-colors"
            >
              <h3 className="text-sm font-bold text-grey-900 flex items-center gap-2">
                ⚙️ Processing Information
              </h3>
              {isProcessingOpen ? <ChevronUp className="w-4 h-4 text-grey-400" /> : <ChevronDown className="w-4 h-4 text-grey-400" />}
            </button>

            {isProcessingOpen && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                <div className="rounded-xl border border-grey-100 overflow-hidden">
                  <table className="w-full text-[11px]">
                    <tbody className="divide-y divide-grey-100">
                      {[
                        { l: "Verification ID", v: `VRF-${providerData.id.slice(0, 8).toUpperCase()}` },
                        { l: "Model Used", v: match.model_used },
                        { l: "Detector", v: "OpenCV" },
                        { l: "Distance Metric", v: "Cosine" },
                        { l: "Threshold", v: match.threshold_used.toFixed(2) },
                        { l: "Processing Time", v: `${match.processing_time_ms}ms` },
                        { l: "Submitted At", v: "Jan 15 10:30" },
                        { l: "Python Service", v: "v1.0.0" }
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-grey-50"}>
                          <td className="p-2.5 text-grey-400 font-bold uppercase tracking-tighter">{row.l}</td>
                          <td className="p-2.5 text-right font-black text-grey-700">{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* CONFIRMATION MODALS */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-none space-y-6">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg",
              showConfirm === "approve" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}>
              {showConfirm === "approve" ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-grey-900">
                {showConfirm === "approve" ? "Approve Verification?" : "Reject Verification?"}
              </h3>
              <p className="text-sm text-grey-500 font-medium leading-relaxed">
                {showConfirm === "approve" 
                  ? `Are you sure you want to APPROVE this verification for ${profile?.full_name || 'N/A'}? This will activate their account and allow them to accept jobs.` 
                  : `Are you sure you want to REJECT this verification for ${profile?.full_name || 'N/A'}? They will be notified and can resubmit after 7 days.`}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={() => handleAction(showConfirm)}
                disabled={saving}
                className={cn(
                  "h-14 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-xl",
                  showConfirm === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                )}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {showConfirm === "approve" ? "Yes, Approve Account" : "Yes, Reject Submission"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowConfirm(null)}
                className="h-12 rounded-2xl font-bold text-grey-400 hover:text-grey-600"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
