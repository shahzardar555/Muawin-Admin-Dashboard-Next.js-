'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2,
  Loader2,
  User,
  Car,
  Baby,
  ShieldCheck,
  WashingMachine,
  Users,
  ChefHat,
  Flower2,
  BookOpen,
  Banknote
} from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const CATEGORY_ICONS: Record<string, any> = {
  'Maid': User,
  'Driver': Car,
  'Babysitter': Baby,
  'Security Guard': ShieldCheck,
  'Washerman': WashingMachine,
  'Domestic Helper': Users,
  'Cook': ChefHat,
  'Gardener': Flower2,
  'Tutor': BookOpen
};

function PostJobPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const isDirectRequest = !!searchParams.get('category');

  const [formData, setFormData] = useState({
    category: searchParams.get('category') || '',
    description: '',
    location: '',
    date: new Date(),
    time: '10:00',
    price: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4); // Success step
    }, 2000);
  };

  const SelectedIcon = formData.category ? CATEGORY_ICONS[formData.category] || Users : Users;

  if (step === 4) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-500 shadow-2xl shadow-primary/20">
            <CheckCircle2 className="w-16 h-16 text-primary-foreground animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-lg" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            {isDirectRequest ? 'Request Sent!' : 'Job Posted Successfully!'}
          </h1>
          <p className="text-muted-foreground px-6 font-medium leading-relaxed">
            {isDirectRequest 
              ? `Your request has been sent to the professional. You will be notified when they respond.`
              : `We are matching your request with the best ${formData.category}s nearby. You will be notified shortly.`
            }
          </p>
        </div>

        <Card className="w-full p-6 bg-secondary/10 border-none rounded-[32px] space-y-4 shadow-inner">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-white/50 pb-3">
            <span>Job ID</span>
            <span className="text-foreground">#MUA-48291</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {isDirectRequest ? 'Expected Response' : 'Estimated Match Time'}
            </span>
            <Badge className="bg-white text-primary font-black text-sm px-4 py-1.5 rounded-full shadow-sm">
              {isDirectRequest ? '~15 mins' : '~5 mins'}
            </Badge>
          </div>
        </Card>

        <div className="w-full pt-4 space-y-4">
          <Button 
            onClick={() => router.push('/customer/jobs')} 
            className="w-full h-14 text-lg rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            Track Job Status
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/customer/home')} 
            className="w-full h-14 text-lg rounded-2xl font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto pb-24">
      <header className="py-4 flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="rounded-full hover:bg-white/50"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              step === s ? "w-10 bg-primary" : "w-4 bg-muted"
            )} />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            {step === 1 ? 'Describe the task' : step === 2 ? 'When and where?' : 'Confirm details'}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {!isDirectRequest && (
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Select Category</Label>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map(cat => {
                    const Icon = CATEGORY_ICONS[cat] || Users;
                    return (
                      <div 
                        key={cat}
                        onClick={() => setFormData({...formData, category: cat})}
                        className={cn(
                          "p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all active:scale-95",
                          formData.category === cat 
                            ? "border-primary bg-primary/10 shadow-sm" 
                            : "border-secondary/20 bg-white"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          formData.category === cat ? "bg-white text-primary shadow-sm" : "bg-surface text-muted-foreground"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={cn("text-xs font-bold", formData.category === cat ? "text-primary" : "text-foreground")}>{cat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Task Description</Label>
              <Textarea 
                placeholder="Explain what you need help with in detail..." 
                className="rounded-[24px] min-h-[160px] bg-white border-secondary/20 p-5 focus-visible:ring-primary/30 shadow-inner text-sm leading-relaxed"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Work Location</Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-transform group-focus-within:scale-110" />
                <Input 
                  placeholder="Street address, block, area..." 
                  className="rounded-2xl h-14 pl-12 bg-white border-secondary/20 shadow-sm focus-visible:ring-primary/30"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 rounded-2xl justify-start text-left font-bold px-4 border-secondary/20 bg-white shadow-sm overflow-hidden">
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{formData.date ? format(formData.date, "MMM d") : 'Pick a date'}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(d) => d && setFormData({...formData, date: d})}
                        initialFocus
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="time" 
                      className="rounded-2xl h-14 pl-10 bg-white border-secondary/20 shadow-sm font-bold focus-visible:ring-primary/30"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Propose Price (Rs.)</Label>
                <div className="relative group">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:animate-pulse" />
                  <Input 
                    type="number"
                    placeholder="Enter your proposed budget" 
                    className="rounded-2xl h-14 pl-12 bg-white border-secondary/20 shadow-sm text-lg font-black focus-visible:ring-primary/30"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground px-1 italic font-medium">Providing a budget helps in faster acceptance.</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <Card className="muawin-card p-6 space-y-8 border-primary/20 bg-primary/5 shadow-inner rounded-[32px]">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    <SelectedIcon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground leading-tight">{formData.category}</h3>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary h-5 px-2">
                      {isDirectRequest ? 'Direct Request' : 'Open Marketplace'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-5 pt-6 border-t border-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Work Location</p>
                      <p className="font-bold text-sm text-foreground/80">{formData.location || 'Your Home Address'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Scheduled Date & Time</p>
                      <p className="font-bold text-sm text-foreground/80">{format(formData.date, "PPP")} at {formData.time}</p>
                    </div>
                  </div>
                  {formData.price && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Banknote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Proposed Price</p>
                        <p className="font-black text-lg text-primary">Rs. {formData.price}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="p-5 bg-white rounded-[24px] border border-secondary/10 shadow-sm">
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed font-medium italic">
                "Final price may vary after professional inspection. By sending this request, you agree to Muawin's service terms."
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-border z-10 max-w-md mx-auto rounded-t-[32px] shadow-2xl">
        <Button 
          disabled={loading || (step === 1 && !formData.category)}
          onClick={handleNext} 
          className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {step === 3 ? (isDirectRequest ? 'Confirm & Send' : 'Confirm & Post') : 'Continue'}
              {step !== 3 && <ArrowRight className="ml-2 w-5 h-5" />}
            </>
          )}
        </Button>
      </footer>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <PostJobPageContent />
    </Suspense>
  );
}
