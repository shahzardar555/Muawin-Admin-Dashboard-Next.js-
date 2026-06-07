'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Clock, MapPin, User, Mail, Phone, Lock, Briefcase } from 'lucide-react';
import { CATEGORIES, VENDORS } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Account Created",
        description: "Welcome to Muawin! Please verify your details to continue.",
      });
      
      if (role === 'vendor' || role === 'provider') {
        router.push(`/auth/verify-otp?role=${role}`);
      } else {
        router.push('/customer/home');
      }
    }, 1500);
  };

  const getTitle = () => {
    if (role === 'vendor') return 'Vendor Account';
    if (role === 'provider') return 'Provider Account';
    return 'Create Account';
  };

  const getSubTitle = () => {
    if (role === 'vendor') return 'Register your business or shop';
    if (role === 'provider') return 'Join as a skilled professional';
    return 'Join Muawin as a customer';
  };

  const LabelStyle = "font-bold text-[10px] uppercase tracking-[0.15em] text-muted-foreground ml-1";
  const InputStyle = "rounded-xl h-12 bg-surface border-none focus-visible:ring-primary shadow-sm";

  return (
    <div className="min-h-screen bg-white p-6 max-w-md mx-auto flex flex-col">
      <header className="py-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 space-y-8 pt-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">{getTitle()}</h1>
          <p className="text-muted-foreground font-medium">{getSubTitle()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={LabelStyle}>{role === 'vendor' ? 'Business Name' : 'Full Name'}</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input id="name" placeholder={role === 'vendor' ? 'Super Grocery Store' : 'John Doe'} required className={cn(InputStyle, "pl-11")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className={LabelStyle}>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" required className={cn(InputStyle, "pl-11")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={LabelStyle}>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input id="email" type="email" placeholder="john@example.com" required className={cn(InputStyle, "pl-11")} />
              </div>
            </div>

            {(role === 'provider' || role === 'vendor') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="category" className={LabelStyle}>{role === 'vendor' ? 'Vendor Category' : 'Service Category'}</Label>
                  <Select required>
                    <SelectTrigger className={cn(InputStyle, "px-4")}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      {(role === 'vendor' ? VENDORS : CATEGORIES).map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()} className="rounded-lg">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience" className={LabelStyle}>{role === 'vendor' ? 'Years in Business' : 'Years of Experience'}</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input id="experience" type="number" min="0" placeholder="e.g. 5" required className={cn(InputStyle, "pl-11")} />
                  </div>
                </div>
              </>
            )}

            {role === 'provider' && (
              <div className="space-y-3 pt-2">
                <Label className={cn(LabelStyle, "flex items-center gap-2")}>
                  <Clock className="w-3 h-3 text-primary" />
                  Standard Working Hours
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="fromTime" className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">From</Label>
                    <Input id="fromTime" type="time" required className={InputStyle} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="toTime" className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">To</Label>
                    <Input id="toTime" type="time" required className={InputStyle} />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className={LabelStyle}>City</Label>
                <Input id="city" placeholder="Lahore" required className={InputStyle} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area" className={LabelStyle}>Area</Label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input id="area" placeholder="Gulberg" required className={InputStyle} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={LabelStyle}>Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input id="password" type="password" required className={cn(InputStyle, "pl-11")} />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-all">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Register Now'}
          </Button>
        </form>

        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground font-medium">
            By registering, you agree to our <button className="text-primary font-bold hover:underline">Terms of Service</button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
