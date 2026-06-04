'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Bell, 
  Languages, 
  UserCircle, 
  Lock,
  ChevronRight,
  Info,
  Check,
  Plus,
  Trash2,
  Users,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function ProviderSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const [emergencyContacts, setEmergencyContacts] = useState<{name: string, phone: string}[]>([
    { name: 'Family Office', phone: '0300 1234567' }
  ]);
  
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const languageOptions = [
    { id: 'en', label: 'English', sub: 'Standard English interface' },
    { id: 'ur', label: 'اردو', sub: 'اردو زبان (Urdu)', isUrdu: true },
    { id: 'bilingual', label: 'English / اردو', sub: 'Bilingual support active', isUrdu: true },
  ];

  const currentLangLabel = languageOptions.find(opt => opt.id === language)?.label || 'English / اردو';

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const removeContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Missing fields",
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

    setIsUpdatingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setIsPasswordOpen(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 2000);
  };

  const sections = [
    {
      title: 'App Settings',
      items: [
        { label: 'Push Notifications', icon: Bell, type: 'switch', value: true },
        { 
          label: t('app_language'), 
          icon: Languages, 
          type: 'selector', 
          value: currentLangLabel,
          subValue: 'Tap to change',
          onClick: () => setIsLangOpen(true)
        },
        { label: 'Interface Mode', icon: Info, type: 'link', value: 'System Default' },
      ]
    },
    {
      title: 'Safety & Security',
      items: [
        { 
          label: t('emergency_contacts'), 
          icon: Users, 
          type: 'selector', 
          value: `${emergencyContacts.length} Contacts`,
          subValue: 'Manage SOS list',
          onClick: () => setIsContactsOpen(true)
        },
        { 
          label: 'Change Password', 
          icon: Lock, 
          type: 'selector',
          onClick: () => setIsPasswordOpen(true)
        },
        { label: 'Privacy Settings', icon: UserCircle, type: 'link' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto pb-24">
      <header className="py-4 flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
      </header>

      <main className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <Card 
                  key={i} 
                  onClick={() => item.onClick?.()}
                  className={cn(
                    "p-4 bg-white border-none shadow-sm flex items-center justify-between transition-all active:scale-[0.98]",
                    (item.type === 'selector' || item.type === 'link') && "cursor-pointer hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground/80">{item.label}</p>
                      {item.value && (
                        <p className={cn(
                          "text-[10px] font-bold text-primary flex items-center gap-1",
                          item.icon === Languages && "font-urdu-modern text-xs"
                        )}>
                          {item.value}
                          {item.icon === Languages && <Check className="w-3 h-3" />}
                        </p>
                      )}
                      {item.subValue && (
                        <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-tight">{item.subValue}</p>
                      )}
                    </div>
                  </div>
                  {item.type === 'switch' ? (
                    <Switch defaultChecked={item.value as boolean} className="data-[state=checked]:bg-primary" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground/30" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Language Selector Sheet */}
      <Sheet open={isLangOpen} onOpenChange={setIsLangOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-left text-xl font-bold">Select Language</SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            {languageOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setLanguage(opt.id as any);
                  setIsLangOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all border",
                  language === opt.id 
                    ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-sm" 
                    : "bg-white border-secondary/20 hover:bg-surface"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "text-sm",
                    opt.isUrdu && "font-urdu-modern text-base"
                  )}>{opt.label}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">{opt.sub}</span>
                </div>
                {language === opt.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Emergency Contacts Management Sheet */}
      <Sheet open={isContactsOpen} onOpenChange={setIsContactsOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-bold">{t('emergency_contacts')}</SheetTitle>
            <SheetDescription className="text-xs">{t('sos_desc')}</SheetDescription>
          </SheetHeader>
          <div className="space-y-6">
            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
              {emergencyContacts.length > 0 ? emergencyContacts.map((contact, i) => (
                <Card key={i} className="p-4 flex justify-between items-center bg-muted/30 border-none rounded-xl">
                  <div>
                    <p className="font-bold text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeContact(i)} className="text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              )) : (
                <div className="py-8 text-center opacity-40">
                  <p className="text-sm font-bold">No contacts added yet.</p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase">Name</Label>
                  <Input 
                    placeholder="e.g. Brother" 
                    value={newContact.name} 
                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase">Phone</Label>
                  <Input 
                    placeholder="03XX XXXXXXX" 
                    value={newContact.phone} 
                    onChange={e => setNewContact({...newContact, phone: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <Button onClick={addContact} disabled={!newContact.name || !newContact.phone} className="w-full h-12 rounded-xl font-bold shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> {t('add_contact')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Change Password Sheet */}
      <Sheet open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-bold">Change Password</SheetTitle>
            <SheetDescription className="text-xs">Update your security credentials</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Current Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.current}
                onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">New Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.new}
                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Confirm New Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.confirm}
                onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
          </div>
          <SheetFooter className="mt-8">
            <Button 
              disabled={isUpdatingPassword}
              onClick={handlePasswordChange}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-md"
            >
              {isUpdatingPassword ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Save New Password'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <footer className="mt-auto py-6 text-center">
         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[3px]">
          Muawin Pro v1.0.4
        </p>
      </footer>
    </div>
  );
}