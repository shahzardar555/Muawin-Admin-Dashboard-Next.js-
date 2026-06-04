'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('').length < 4) return;
    setLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      toast({
        title: role === 'vendor' ? "Store Verified" : "Phone Verified",
        description: role === 'vendor' ? "Your business contact has been successfully verified." : "Your phone number has been successfully verified.",
      });
    }, 2000);
  };

  const handleContinue = () => {
    if (role === 'provider') {
      router.push('/auth/verify');
    } else if (role === 'vendor') {
      router.push('/vendor/home');
    } else {
      router.push('/customer/home');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center animate-bounce shadow-lg">
          <CheckCircle2 className="w-14 h-14 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            {role === 'provider' ? 'Phone Verified!' : role === 'vendor' ? 'Store Verified!' : 'Verification Complete!'}
          </h1>
          <p className="text-muted-foreground px-6 font-medium leading-relaxed">
            {role === 'provider' 
              ? "Great! Your contact details are verified. Now let's complete your professional profile with document verification." 
              : role === 'vendor'
              ? 'Excellent! Your business contact is verified. You can now start managing your store and receiving orders.'
              : 'Your account is active. You can now start using Muawin to find services or manage your business.'}
          </p>
        </div>
        <Button 
          onClick={handleContinue} 
          className="w-full h-14 text-lg rounded-2xl font-bold shadow-md transition-all active:scale-95"
        >
          {role === 'provider' ? 'Continue to Verification' : 'Go to Dashboard'}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto">
      <header className="py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full hover:bg-white/50"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col justify-center space-y-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Phone className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2 px-4">
            <h1 className="text-3xl font-headline font-bold tracking-tight">Verify Phone</h1>
            <p className="text-muted-foreground font-medium text-sm">We've sent a 4-digit code to your registered mobile number.</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {otp.map((digit, i) => (
            <Input
              key={i}
              ref={el => (inputs.current[i] = el)}
              type="number"
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-14 h-16 text-center text-2xl font-bold rounded-2xl bg-white border-none shadow-sm focus-visible:ring-primary"
            />
          ))}
        </div>

        <div className="space-y-6">
          <Button 
            disabled={loading || otp.join('').length < 4} 
            onClick={handleVerify}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-md transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Didn't receive the code? <button className="text-primary font-bold hover:underline transition-colors">Resend</button>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 flex items-center justify-center gap-2 text-muted-foreground">
        <Mail className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Verification ensures account security</span>
      </footer>
    </div>
  );
}
