'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wallet, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Star,
  Edit2,
  Briefcase,
  History,
  MapPin,
  Check,
  Loader2,
  Phone,
  User,
  MessageCircle,
  Mail,
  ExternalLink,
  Lock,
  ArrowLeft
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ProviderProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, mounted } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState("https://picsum.photos/seed/provider/200/200");
  const [dynamicEarnings, setDynamicEarnings] = useState("48,200");
  const [dynamicJobsDone, setDynamicJobsDone] = useState("45");
  
  // Sheet states
  const [isProfProfileOpen, setIsProfProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Provider dynamic data
  const [providerData, setProviderData] = useState({
    name: "Ahmed Hassan",
    category: "Driver",
    location: "Gulberg III, Lahore",
    rating: "4.9",
    reviews: "124",
    experience: "8",
    bio: "Professional driver with extensive experience in both manual and automatic vehicles. Punctual, reliable, and familiar with all major routes in Lahore. I specialize in safe city travel and airport transfers.",
    phone: "+92 300 1234567"
  });

  const [editForm, setEditForm] = useState({ ...providerData });

  useEffect(() => {
    // Load dynamic data from localStorage for prototype persistence
    if (typeof window !== 'undefined') {
      const savedEarnings = localStorage.getItem('muawin_earnings') || "48200";
      const savedJobsDone = localStorage.getItem('muawin_jobs_done') || "45";
      
      setDynamicEarnings(Number(savedEarnings).toLocaleString());
      setDynamicJobsDone(savedJobsDone);
    }
  }, []);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast({
          title: "Profile Updated",
          description: "Your business profile photo has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfProfile = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setProviderData({ ...editForm });
      setIsUpdating(false);
      setIsProfProfileOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your professional profile has been saved successfully.",
      });
    }, 1500);
  };

  const menuItems = [
    { label: t('prof_profile'), icon: Briefcase, onClick: () => {
      setEditForm({ ...providerData });
      setIsProfProfileOpen(true);
    }},
    { label: t('earnings_payouts'), icon: Wallet, href: '/provider/earnings' },
    { label: t('job_history'), icon: History, href: '/provider/history' },
    { label: t('help_support'), icon: HelpCircle, onClick: () => setIsHelpOpen(true) },
    { label: t('settings'), icon: Settings, href: '/provider/settings' },
  ];

  const handleMenuClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.href === '#') {
      toast({
        title: item.label,
        description: `${item.label} features are coming soon!`,
      });
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const providerFaqs = [
    {
      q: "How do I get more job requests?",
      a: "Complete your professional bio and keep your status as 'Available'. High ratings and quick response times significantly increase your visibility to customers."
    },
    {
      q: "How does negotiation work?",
      a: "When you receive a request, you can propose a different price or time if the customer's request doesn't match your availability or standard rate."
    },
    {
      q: "When will I receive my earnings?",
      a: "Earnings are typically processed within 24-48 hours after a job is marked as completed. You can track your balance in the Earnings & Payouts section."
    },
    {
      q: "What is the SOS feature?",
      a: "The SOS button is for your safety. If you feel unsafe during a job, tap it to immediately alert your emergency contacts and our security team with your live location."
    }
  ];

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="bg-primary/20 px-6 pt-16 pb-14 rounded-b-[40px] relative border-b border-primary/30">
        <div className="absolute top-12 left-6 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full bg-white/20 text-primary hover:bg-white/30 backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-xl bg-white">
              <img src={avatar} alt="Provider Avatar" className="object-cover w-full h-full" />
            </div>
            <Button 
              size="icon" 
              onClick={handleEditPhoto}
              className="absolute -bottom-2 -right-2 rounded-xl w-9 h-9 border-4 border-white shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{providerData.name}</h1>
              <div className="bg-primary/30 p-1 rounded-full border border-primary/20">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-black text-primary uppercase tracking-[0.15em] bg-white/40 px-3 py-1 rounded-full border border-primary/10">
                {providerData.category}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-white/60 px-3 py-1 rounded-full border border-primary/10 shadow-sm backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-bold">{providerData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-10 space-y-8 relative z-10">
        <Card className="muawin-card p-6 bg-white border-none shadow-xl flex justify-around">
          <div className="text-center space-y-1">
            <p className="text-lg font-bold">{dynamicJobsDone}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Jobs</p>
          </div>
          <div className="w-px h-10 bg-border self-center" />
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <p className="text-lg font-bold">{providerData.rating}</p>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rating</p>
          </div>
          <div className="w-px h-10 bg-border self-center" />
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-primary">Rs. {dynamicEarnings}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Earnings</p>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold px-1 text-muted-foreground uppercase tracking-widest">{t('business_mgmt')}</h3>
          <div className="grid gap-3">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => handleMenuClick(item)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-secondary/20 shadow-sm active:scale-[0.98] transition-all hover:bg-primary/5 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="w-full h-14 rounded-2xl border-red-100 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <LogOut className="w-5 h-5" /> {t('log_out')}
        </Button>

        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[3px] py-4">
          Muawin Pro v1.0.4 Beta
        </p>
      </main>

      {/* Professional Profile Sheet */}
      <Sheet open={isProfProfileOpen} onOpenChange={setIsProfProfileOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              {t('prof_profile')}
            </SheetTitle>
            <SheetDescription>
              Manage your business expertise and service information.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="rounded-xl h-12 pl-11 bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Contact Phone</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  value={editForm.phone} 
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  className="rounded-xl h-12 pl-11 bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <Select 
                  value={editForm.category} 
                  onValueChange={(val) => setEditForm({...editForm, category: val})}
                >
                  <SelectTrigger className="rounded-xl h-12 bg-surface border-none focus:ring-primary">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Experience (Yrs)</Label>
                <Input 
                  type="number"
                  value={editForm.experience} 
                  onChange={e => setEditForm({...editForm, experience: e.target.value})}
                  className="rounded-xl h-12 bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Service Area</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  value={editForm.location} 
                  onChange={e => setEditForm({...editForm, location: e.target.value})}
                  className="rounded-xl h-12 pl-11 bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Professional Bio</Label>
              <Textarea 
                value={editForm.bio} 
                onChange={e => setEditForm({...editForm, bio: e.target.value})}
                className="rounded-xl min-h-[140px] bg-surface border-none focus-visible:ring-primary text-sm leading-relaxed"
                placeholder="Tell customers why they should hire you..."
              />
            </div>
          </div>

          <SheetFooter className="mt-10">
            <Button 
              disabled={isUpdating}
              onClick={handleSaveProfProfile}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Check className="w-6 h-6" /> Save Profile</>}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Help & Support Sheet */}
      <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              {t('help_support')}
            </SheetTitle>
            <SheetDescription>
              Find answers or contact our dedicated support team.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            {/* Contact Support Options */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 flex flex-col items-center text-center gap-2 border-secondary/30 bg-primary/5 rounded-2xl transition-all active:scale-[0.98]">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-xs text-foreground">WhatsApp Support</p>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-primary hover:bg-primary/10">Chat Now</Button>
              </Card>
              <Card className="p-4 flex flex-col items-center text-center gap-2 border-secondary/30 bg-primary/5 rounded-2xl transition-all active:scale-[0.98]">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-xs text-foreground">Email Support</p>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-primary hover:bg-primary/10">Send Email</Button>
              </Card>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Common Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {providerFaqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-secondary/20">
                    <AccordionTrigger className="text-sm font-bold text-left hover:no-underline text-foreground leading-tight">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Support Resources */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Resources</h3>
              <div className="grid gap-2">
                <button className="w-full flex items-center justify-between p-4 bg-surface border-none rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Terms of Service</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-surface border-none rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-10">
            <p className="text-[10px] text-center w-full text-muted-foreground font-medium opacity-70">
              Muawin Pro Support available 9 AM - 9 PM PKT.
            </p>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
