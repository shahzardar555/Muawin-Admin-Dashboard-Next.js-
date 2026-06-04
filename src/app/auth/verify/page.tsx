'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Camera, 
  ShieldCheck, 
  FileText,
  User,
  Loader2,
  ImagePlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/**
 * Provider Verification Screen.
 * Implements a high-fidelity document capture flow for CNIC and Selfie.
 */
export default function VerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4); // Enter Pending State
    }, 2000);
  };

  // State 4: Final Success/Pending Screen
  if (step === 4) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-primary/20">
            <ShieldCheck className="w-16 h-16 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Verification Pending</h1>
          <p className="text-muted-foreground px-6 font-medium leading-relaxed">
            We are reviewing your professional documents. This usually takes 24-48 hours. You will receive a notification once approved.
          </p>
        </div>

        <Button 
          onClick={() => router.push('/provider/feed')} 
          className="w-full h-14 text-lg rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto">
      {/* Standard Header with Micro-Typography */}
      <header className="py-4 flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()} 
          className="rounded-full hover:bg-white/50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">
          Provider Verification
        </span>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col space-y-10">
        {/* Dynamic Step Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            {step === 1 ? 'CNIC (Front)' : step === 2 ? 'CNIC (Back)' : 'Take a Selfie'}
          </h1>
          <p className="text-muted-foreground font-medium">
            Required for professional background check and platform trust.
          </p>
        </div>

        {/* The Capture Zone (1.6:1 Aspect Ratio) */}
        <Card className="muawin-card aspect-[1.6/1] w-full border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center text-center p-8 space-y-6 transition-all hover:bg-primary/[0.08] relative group overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-primary/10 group-hover:scale-110 transition-transform">
              {step === 3 ? (
                <User className="w-10 h-10 text-primary" />
              ) : (
                <FileText className="w-10 h-10 text-primary" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-surface shadow-md">
               <ImagePlus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-1 relative z-10">
            <h4 className="font-bold text-foreground">Upload or Take Photo</h4>
            <p className="text-[11px] text-muted-foreground max-w-[200px] mx-auto leading-tight font-medium">
              Ensure the document is clearly visible and within the frame.
            </p>
          </div>

          <Button 
            variant="outline" 
            className="rounded-xl border-primary bg-white text-primary font-bold h-12 px-8 shadow-md hover:bg-primary/5 active:scale-95 transition-all relative z-10"
          >
            <Camera className="mr-2 w-5 h-5" /> Open Camera
          </Button>

          {/* Subtle background decoration */}
          <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-32 h-32 text-primary" />
          </div>
        </Card>

        {/* Privacy Banner */}
        <div className="bg-primary/5 p-5 rounded-2xl flex items-start gap-4 border border-primary/10 shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Privacy Guaranteed</p>
            <p className="text-[12px] font-medium leading-relaxed text-foreground/80">
              Your identity data is encrypted and used only for verification. We never share your details without consent.
            </p>
          </div>
        </div>
      </main>

      {/* Persistent Interaction Row */}
      <footer className="py-8">
        <Button 
          disabled={loading}
          onClick={handleNext} 
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Continue'}
        </Button>
      </footer>
    </div>
  );
}
