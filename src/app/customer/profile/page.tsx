'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  User, 
  CreditCard, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight,
  Shield,
  Edit2,
  Mail,
  ShieldCheck,
  Moon,
  Plus,
  Trash2,
  Loader2,
  Check,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  History,
  ExternalLink,
  MessageCircle,
  MapPin,
  Phone,
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
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, mounted } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState("https://picsum.photos/seed/user1/200/200");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+92 300 1234567",
    address: "House #42, Block L, Gulberg III, Lahore"
  });

  const [profileEditForm, setProfileEditForm] = useState({ ...profileData });

  // Security states
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const [savedMethods, setSavedMethods] = useState([
    { id: '1', type: 'visa', last4: '4242', expiry: '12/26', brand: 'Visa' },
    { id: '2', type: 'wallet', name: 'JazzCash', phone: '0300****567' }
  ]);

  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('muawin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('muawin_theme', 'light');
    }
  };

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
          description: "Your profile picture has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProfileData({ ...profileEditForm });
      setIsLoading(false);
      setIsProfileOpen(false);
      toast({
        title: "Profile Saved",
        description: "Your personal information has been updated.",
      });
    }, 1500);
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvc) {
      toast({
        title: "Missing details",
        description: "Please fill in all card information.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const card = {
        id: Date.now().toString(),
        type: 'visa',
        last4: newCard.number.slice(-4),
        expiry: newCard.expiry,
        brand: 'Visa'
      };
      setSavedMethods([...savedMethods, card]);
      setNewCard({ number: '', expiry: '', cvc: '' });
      setIsAddingCard(false);
      setIsLoading(false);
      toast({
        title: "Card Added",
        description: "Your payment method has been saved securely.",
      });
    }, 1500);
  };

  const handleUpdatePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Incomplete Fields",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password Mismatch",
        description: "The new password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      toast({
        title: "Password Updated",
        description: "Your account security has been updated successfully.",
      });
    }, 2000);
  };

  const removeMethod = (id: string) => {
    setSavedMethods(savedMethods.filter(m => m.id !== id));
    toast({
      title: "Method Removed",
      description: "Payment method has been deleted.",
    });
  };

  const menuItems = [
    { label: t('personal_info'), icon: User, onClick: () => setIsProfileOpen(true) },
    { label: t('payment_methods'), icon: CreditCard, onClick: () => setIsPaymentsOpen(true) },
    { label: t('dark_mode'), icon: Moon, type: 'switch', value: isDarkMode, onChange: toggleDarkMode },
    { label: t('security_privacy'), icon: Shield, onClick: () => setIsSecurityOpen(true) },
    { label: t('help_center'), icon: HelpCircle, onClick: () => setIsHelpOpen(true) },
    { label: t('app_settings'), icon: Settings, href: '/provider/settings' },
  ];

  const handleMenuClick = (item: any) => {
    if (item.type === 'switch') return;
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.href === '#') {
      toast({
        title: item.label,
        description: `${item.label} features are coming soon!`,
      });
    } else {
      router.push(item.href);
    }
  };

  const faqs = [
    {
      q: "How do I book a service?",
      a: "Simply go to the Home screen, choose a category or search for a specific service, and tap 'Post Job' or contact a provider directly."
    },
    {
      q: "What is Muawin Pro?",
      a: "Muawin Pro is a premium subscription that offers priority matching, zero platform fees, and enhanced insurance coverage for your tasks."
    },
    {
      q: "How can I contact a provider?",
      a: "You can use the built-in chat feature to message providers. For active jobs, you can also call them directly from the Job card."
    },
    {
      q: "What if I'm not satisfied with a service?",
      a: "You can register a complaint through the My Jobs screen for any completed service. Our support team will investigate and help resolve the issue."
    },
    {
      q: "Are the service providers verified?",
      a: "Yes, every professional on Muawin goes through a strict verification process, including CNIC and background checks."
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-background pb-24 transition-colors duration-300">
      <header className="bg-primary/20 dark:bg-primary/10 px-6 pt-16 pb-14 rounded-b-[40px] relative border-b border-primary/30">
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
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-secondary/20 overflow-hidden shadow-xl bg-white dark:bg-secondary/10">
              <img src={avatar} alt="Avatar" className="object-cover w-full h-full" />
            </div>
            <button 
              onClick={handleEditPhoto}
              className="absolute -bottom-2 -right-2 rounded-xl w-9 h-9 border-4 border-white dark:border-background shadow-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-transform active:scale-90"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
              <div className="bg-primary/30 p-1 rounded-full border border-primary/20">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 justify-center text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium">{profileData.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 mt-6 space-y-8 relative z-10">
        <div className="space-y-4">
          <h3 className="text-sm font-bold px-1 text-muted-foreground uppercase tracking-widest">
            {mounted ? t('account_mgmt') : 'Account Management'}
          </h3>
          <div className="grid gap-3">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  onClick={() => handleMenuClick(item)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 bg-white dark:bg-card rounded-2xl border border-secondary/20 dark:border-border shadow-sm active:scale-[0.98] transition-all group",
                    item.type !== 'switch' && "cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface dark:bg-secondary/20 rounded-xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-card transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80 dark:text-foreground">{mounted ? item.label : ''}</span>
                  </div>
                  {item.type === 'switch' ? (
                    <Switch 
                      checked={item.value} 
                      onCheckedChange={item.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="w-full h-14 rounded-2xl border-red-100 dark:border-red-900/50 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <LogOut className="w-5 h-5" /> {mounted ? t('log_out') : 'Log Out'}
        </Button>

        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[3px] py-4">
          Muawin v1.0.4 Beta
        </p>
      </main>

      {/* Personal Information Sheet */}
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              {t('personal_info')}
            </SheetTitle>
            <SheetDescription>
              Update your contact details and home address.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  value={profileEditForm.name}
                  onChange={e => setProfileEditForm({...profileEditForm, name: e.target.value})}
                  className="pl-11 h-12 rounded-xl bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  type="email"
                  value={profileEditForm.email}
                  onChange={e => setProfileEditForm({...profileEditForm, email: e.target.value})}
                  className="pl-11 h-12 rounded-xl bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  type="tel"
                  value={profileEditForm.phone}
                  onChange={e => setProfileEditForm({...profileEditForm, phone: e.target.value})}
                  className="pl-11 h-12 rounded-xl bg-surface border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Home Address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-primary" />
                <textarea 
                  value={profileEditForm.address}
                  onChange={e => setProfileEditForm({...profileEditForm, address: e.target.value})}
                  className="w-full pl-11 pt-3 pb-3 rounded-xl bg-surface border-none focus-visible:ring-primary text-sm min-h-[100px] outline-none ring-offset-background"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="mt-10">
            <Button 
              disabled={isLoading}
              onClick={handleSaveProfile}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Check className="w-6 h-6" /> Save Profile</>}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Payment Methods Sheet */}
      <Sheet open={isPaymentsOpen} onOpenChange={setIsPaymentsOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              {t('payment_methods')}
            </SheetTitle>
            <SheetDescription>
              Manage your saved cards and digital wallets.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {!isAddingCard ? (
              <>
                <div className="space-y-3">
                  {savedMethods.map((method) => (
                    <Card key={method.id} className="p-4 flex items-center justify-between border-none bg-surface dark:bg-secondary/20 rounded-2xl shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-card flex items-center justify-center shadow-sm">
                          {method.type === 'visa' ? (
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Smartphone className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {method.type === 'visa' ? `${method.brand} **** ${method.last4}` : method.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {method.type === 'visa' ? `Expires ${method.expiry}` : method.phone}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeMethod(method.id)}
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={() => setIsAddingCard(true)}
                  className="w-full h-14 rounded-2xl font-bold bg-primary/10 text-primary border-2 border-dashed border-primary/30 hover:bg-primary/20 shadow-none flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add New Method
                </Button>
              </>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Card Number</Label>
                    <Input 
                      placeholder="**** **** **** ****" 
                      value={newCard.number}
                      onChange={e => setNewCard({...newCard, number: e.target.value})}
                      className="h-12 rounded-xl bg-surface border-none focus-visible:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Expiry (MM/YY)</Label>
                      <Input 
                        placeholder="MM/YY" 
                        value={newCard.expiry}
                        onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                        className="h-12 rounded-xl bg-surface border-none focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">CVC</Label>
                      <Input 
                        placeholder="***" 
                        type="password"
                        maxLength={3}
                        value={newCard.cvc}
                        onChange={e => setNewCard({...newCard, cvc: e.target.value})}
                        className="h-12 rounded-xl bg-surface border-none focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAddingCard(false)}
                    className="flex-1 h-14 rounded-2xl font-bold border border-secondary/30"
                  >
                    Cancel
                  </Button>
                  <Button 
                    disabled={isLoading}
                    onClick={handleAddCard}
                    className="flex-1 h-14 rounded-2xl font-bold shadow-lg"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5 mr-2" /> Save Card</>}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-10">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                PCI-DSS Secure Encryption
              </div>
              <p className="text-[9px] text-center text-muted-foreground/60 px-8 leading-relaxed">
                Your payment data is encrypted and never stored on Muawin servers directly. We use bank-grade security to protect your information.
              </p>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Security & Privacy Sheet */}
      <Sheet open={isSecurityOpen} onOpenChange={setIsSecurityOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Security & Privacy
            </SheetTitle>
            <SheetDescription>
              Protect your account and manage your data.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            {/* Account Protection Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Account Protection</h3>
              <div className="space-y-3">
                <Card className="p-4 bg-white dark:bg-card border border-secondary/20 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface dark:bg-secondary/20 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground">Update Password</span>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Current Password" 
                        value={passwordData.current}
                        onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                        className="rounded-xl h-12 pr-10"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="New Password" 
                      value={passwordData.new}
                      onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                      className="rounded-xl h-12"
                    />
                    <Input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      value={passwordData.confirm}
                      onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="rounded-xl h-12"
                    />
                    <Button 
                      onClick={handleUpdatePassword} 
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl font-bold"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save New Password'}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Privacy & Data</h3>
              <div className="grid gap-3">
                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-card rounded-2xl border border-secondary/20 shadow-sm hover:bg-primary/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface dark:bg-secondary/20 rounded-xl flex items-center justify-center">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80">Account Activity</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-card rounded-2xl border border-secondary/20 shadow-sm hover:bg-primary/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface dark:bg-secondary/20 rounded-xl flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80">Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </button>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-10">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Data Protected by Muawin Guard
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Help Center Sheet */}
      <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              {t('help_center')}
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
                <p className="font-bold text-xs text-foreground">WhatsApp</p>
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
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-secondary/20 dark:border-border">
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
                <button className="w-full flex items-center justify-between p-4 bg-surface dark:bg-secondary/20 border-none rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-card rounded-lg flex items-center justify-center shadow-sm">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Terms of Service</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-surface dark:bg-secondary/20 border-none rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-card rounded-lg flex items-center justify-center shadow-sm">
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
              Support available 9 AM - 9 PM daily PKT.
            </p>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
