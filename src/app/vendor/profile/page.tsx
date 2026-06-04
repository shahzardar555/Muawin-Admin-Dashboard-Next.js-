'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Store, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Star,
  Edit2,
  MapPin,
  Bell,
  Loader2,
  Check,
  Smartphone,
  Mail,
  MessageSquare,
  Lock,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  Moon,
  Languages,
  CheckCircle,
  Map as MapIcon,
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
import { cn } from '@/lib/utils';

export default function VendorProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, language, setLanguage, mounted } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState("https://picsum.photos/seed/vendor-store/200/200");
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Editable store data
  const [vendorData, setVendorData] = useState({
    name: "Metro Supermarket",
    category: "Supermarket",
    location: "Block L, Gulberg III, Lahore",
    rating: "4.8",
    reviews: "2.4k",
    phone: "+92 300 1234567",
    description: "Wide variety of groceries, household items, and electronics. Best prices and quality in the area.",
    mapUrl: "https://maps.google.com/?q=Metro+Supermarket+Gulberg+III+Lahore"
  });

  // Notification states
  const [notifications, setNotifications] = useState({
    messages: true,
    promos: false,
    system: true
  });

  // Security states
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [editForm, setEditForm] = useState({ ...vendorData });

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
          description: "Your store profile photo has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStoreInfo = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setVendorData({ ...editForm });
      setIsUpdating(false);
      setIsStoreInfoOpen(false);
      toast({
        title: "Information Updated",
        description: "Your business details have been saved successfully.",
      });
    }, 1500);
  };

  const handleSaveNotifications = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsNotificationsOpen(false);
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Mismatch",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsSecurityOpen(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      toast({
        title: "Password Updated",
        description: "Your business account password has been changed.",
      });
    }, 2000);
  };

  const menuItems = [
    { label: 'Store Information', icon: Store, onClick: () => setIsStoreInfoOpen(true) },
    { label: 'Notification Settings', icon: Bell, onClick: () => setIsNotificationsOpen(true) },
    { label: 'Account Security', icon: ShieldCheck, onClick: () => setIsSecurityOpen(true) },
    { label: 'Help & Support', icon: HelpCircle, onClick: () => setIsHelpOpen(true) },
    { label: 'General Settings', icon: Settings, onClick: () => setIsGeneralSettingsOpen(true) },
  ];

  const handleMenuClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.href === '#') {
      toast({
        title: item.label,
        description: `${item.label} features are coming soon for vendors!`,
      });
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const faqs = [
    {
      q: "How do I attract more customers?",
      a: "Ensure your store profile is complete with a clear description and high-quality photo. Responding quickly to customer chats also improves your ranking."
    },
    {
      q: "How can I change my delivery area?",
      a: "Currently, delivery areas are tied to your store's primary location. To update your location, use the 'Store Information' section."
    },
    {
      q: "What should I do if a customer is unreachable?",
      a: "Try messaging them through the Muawin chat first. If they remain unreachable for a scheduled delivery, contact our support team."
    },
    {
      q: "How are reviews calculated?",
      a: "Your rating is an average of all verified customer reviews. Providing consistent, high-quality service is the best way to maintain a 5-star rating."
    }
  ];

  const languageOptions = [
    { id: 'en', label: 'English', sub: 'Standard English interface' },
    { id: 'ur', label: 'اردو', sub: 'اردو زبان (Urdu)', isUrdu: true },
    { id: 'bilingual', label: 'English / اردو', sub: 'Bilingual support active', isUrdu: true },
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
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-secondary/20 overflow-hidden shadow-xl bg-white dark:bg-secondary/10 flex items-center justify-center">
              <img src={avatar} alt="Vendor Logo" className="object-cover w-full h-full" />
            </div>
            <Button 
              size="icon" 
              onClick={handleEditPhoto}
              className="absolute -bottom-2 -right-2 rounded-xl w-9 h-9 border-4 border-white dark:border-background shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
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
              <h1 className="text-2xl font-bold text-foreground">{vendorData.name}</h1>
              <div className="bg-primary/30 p-1 rounded-full border border-primary/20">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-black text-primary uppercase tracking-[0.15em] bg-white/40 dark:bg-white/10 px-3 py-1 rounded-full border border-primary/10">
                {vendorData.category}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-white/60 dark:bg-secondary/20 px-3 py-1 rounded-full border border-primary/10 shadow-sm backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-bold">{vendorData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 mt-6 space-y-8 relative z-10">
        <Card className="muawin-card p-6 bg-white dark:bg-card border-none shadow-xl flex justify-around">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <p className="text-lg font-bold text-foreground">{vendorData.rating}</p>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rating</p>
          </div>
          <div className="w-px h-10 bg-border self-center" />
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-primary">{vendorData.reviews}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reviews</p>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold px-1 text-muted-foreground uppercase tracking-widest">Store Management</h3>
          <div className="grid gap-3">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => handleMenuClick(item)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-card rounded-2xl border border-secondary/20 dark:border-border shadow-sm active:scale-[0.98] transition-all hover:bg-primary/5 dark:hover:bg-primary/10 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface dark:bg-secondary/20 rounded-xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-card transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80 dark:text-foreground">{item.label}</span>
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
          className="w-full h-14 rounded-2xl border-red-100 dark:border-red-900/50 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <LogOut className="w-5 h-5" /> {mounted ? t('log_out') : 'Log Out'}
        </Button>

        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[3px] py-4">
          Muawin Vendor Hub v1.0.4
        </p>
      </main>

      {/* Store Information Edit Sheet */}
      <Sheet open={isStoreInfoOpen} onOpenChange={setIsStoreInfoOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" />
              Store Information
            </SheetTitle>
            <SheetDescription>
              Update your business details to attract more customers.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="store-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Business Name</Label>
              <Input 
                id="store-name" 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Input 
                id="store-category" 
                value={editForm.category} 
                onChange={e => setEditForm({...editForm, category: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Phone</Label>
              <Input 
                id="store-phone" 
                value={editForm.phone} 
                onChange={e => setEditForm({...editForm, phone: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-location" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location Address</Label>
              <Input 
                id="store-location" 
                value={editForm.location} 
                onChange={e => setEditForm({...editForm, location: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-map" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <MapIcon className="w-3 h-3" /> Google Maps Link
              </Label>
              <Input 
                id="store-map" 
                placeholder="Paste Google Maps URL here"
                value={editForm.mapUrl} 
                onChange={e => setEditForm({...editForm, mapUrl: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground italic px-1">Allows customers to navigate to your shop.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About the Store</Label>
              <Textarea 
                id="store-desc" 
                value={editForm.description} 
                onChange={e => setEditForm({...editForm, description: e.target.value})}
                className="rounded-xl min-h-[120px] bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary text-sm"
              />
            </div>
          </div>

          <SheetFooter className="mt-10">
            <Button 
              disabled={isUpdating}
              onClick={handleSaveStoreInfo}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Notification Settings Sheet */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Notifications
            </SheetTitle>
            <SheetDescription>
              Control how and when you want to be notified.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface dark:bg-secondary/20 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Customer Messages</p>
                  <p className="text-[10px] text-muted-foreground">Notify me when a customer chats</p>
                </div>
              </div>
              <Switch 
                checked={notifications.messages} 
                onCheckedChange={(val) => setNotifications({...notifications, messages: val})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-surface dark:bg-secondary/20 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Email Updates</p>
                  <p className="text-[10px] text-muted-foreground">Receive weekly business summaries</p>
                </div>
              </div>
              <Switch 
                checked={notifications.promos} 
                onCheckedChange={(val) => setNotifications({...notifications, promos: val})}
              />
            </div>
          </div>

          <SheetFooter className="mt-10">
            <Button 
              disabled={isUpdating}
              onClick={handleSaveNotifications}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
              {isUpdating ? 'Saving...' : 'Save Preferences'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Account Security Sheet */}
      <Sheet open={isSecurityOpen} onOpenChange={setIsSecurityOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[70vh]">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Account Security
            </SheetTitle>
            <SheetDescription>
              Manage your business account security credentials.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="curr-pass" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Password</Label>
              <Input 
                id="curr-pass" 
                type="password"
                placeholder="••••••••"
                value={passwordData.current}
                onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-pass" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Password</Label>
              <Input 
                id="new-pass" 
                type="password"
                placeholder="••••••••"
                value={passwordData.new}
                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conf-pass" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirm New Password</Label>
              <Input 
                id="conf-pass" 
                type="password"
                placeholder="••••••••"
                value={passwordData.confirm}
                onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                className="rounded-xl h-12 bg-surface dark:bg-secondary/20 border-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <SheetFooter className="mt-10">
            <Button 
              disabled={isUpdating}
              onClick={handlePasswordChange}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
              {isUpdating ? 'Updating...' : 'Update Password'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Help & Support Sheet */}
      <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Help & Support
            </SheetTitle>
            <SheetDescription>
              Find answers to common questions or reach out to our team.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            {/* Quick Contact Options */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 flex flex-col items-center text-center gap-2 border-secondary/30 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-xs text-foreground">WhatsApp Support</p>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-primary">Chat Now</Button>
              </Card>
              <Card className="p-4 flex flex-col items-center text-center gap-2 border-secondary/30 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-xs text-foreground">Email Support</p>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-primary">Email Us</Button>
              </Card>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground px-1">Common Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-secondary/20 dark:border-border">
                    <AccordionTrigger className="text-sm font-bold text-left hover:no-underline text-foreground">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground px-1">Resources</h3>
              <Card className="p-4 flex items-center justify-between bg-surface dark:bg-secondary/20 border-none rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-card rounded-lg flex items-center justify-center shadow-sm">
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Terms of Service</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Card>
              <Card className="p-4 flex items-center justify-between bg-surface dark:bg-secondary/20 border-none rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-card rounded-lg flex items-center justify-center shadow-sm">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Privacy Policy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Card>
            </div>
          </div>

          <SheetFooter className="mt-10">
            <p className="text-[10px] text-center w-full text-muted-foreground font-medium">
              Muawin Support is available 9 AM - 9 PM daily.
            </p>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* General Settings Sheet */}
      <Sheet open={isGeneralSettingsOpen} onOpenChange={setIsGeneralSettingsOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              General Settings
            </SheetTitle>
            <SheetDescription>
              Manage your app interface and language preferences.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            {/* Theme Toggle */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Appearance</h3>
              <div className="flex items-center justify-between p-4 bg-surface dark:bg-secondary/20 rounded-2xl border border-secondary/10 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
                    <Moon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Dark Mode</p>
                    <p className="text-[10px] text-muted-foreground">Adjust the app's visual style</p>
                  </div>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">App Language</h3>
              <div className="grid gap-3">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLanguage(opt.id as any)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all border",
                      language === opt.id 
                        ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-sm" 
                        : "bg-white dark:bg-card border-secondary/20 dark:border-border hover:bg-surface dark:hover:bg-secondary/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        language === opt.id ? "bg-white dark:bg-card" : "bg-surface dark:bg-secondary/20"
                      )}>
                        <Languages className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className={cn(
                          "text-sm text-foreground",
                          opt.isUrdu && "font-urdu-modern text-base"
                        )}>{opt.label}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">{opt.sub}</span>
                      </div>
                    </div>
                    {language === opt.id && (
                      <CheckCircle className="w-6 h-6 text-primary fill-primary/10" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-10">
            <Button 
              onClick={() => setIsGeneralSettingsOpen(false)}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg"
            >
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
