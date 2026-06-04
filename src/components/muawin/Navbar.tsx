'use client';

/**
 * @fileOverview Responsive top navigation bar for Muawin web application.
 * Implements role-based navigation links, profile management, and language switching.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Bell, 
  User, 
  Languages, 
  ChevronDown,
  LogOut,
  Sparkles,
  ClipboardList,
  MessageSquare,
  Plus,
  Home as HomeIcon,
  Bot,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MuawinIcon from '@/components/muawin/MuawinIcon';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage, mounted } = useLanguage();

  const isHidden = pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/admin');
  if (isHidden) return null;

  const isProvider = pathname.startsWith('/provider');
  const isVendor = pathname.startsWith('/vendor');
  const isCustomer = !isProvider && !isVendor && pathname.startsWith('/customer');

  const customerLinks = [
    { label: t('home'), href: '/customer/home', icon: HomeIcon },
    { label: t('jobs'), href: '/customer/jobs', icon: ClipboardList },
    { label: t('messages'), href: '/customer/messages', icon: MessageSquare },
    { label: 'Assistant', href: '/customer/assistant', icon: Bot },
  ];

  const providerLinks = [
    { label: t('feed'), href: '/provider/feed', icon: HomeIcon },
    { label: t('my_jobs'), href: '/provider/active', icon: ClipboardList },
    { label: 'Earnings', href: '/provider/earnings', icon: Sparkles },
    { label: t('chats'), href: '/provider/messages', icon: MessageSquare },
  ];

  const vendorLinks = [
    { label: t('dashboard'), href: '/vendor/home', icon: LayoutDashboard },
    { label: t('messages'), href: '/vendor/messages', icon: MessageSquare },
  ];

  const links = isVendor ? vendorLinks : isProvider ? providerLinks : customerLinks;

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <nav className="relative z-50 h-20 bg-white border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href={isCustomer ? "/customer/home" : isProvider ? "/provider/feed" : "/vendor/home"} className="flex items-center gap-2 group">
          <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MuawinIcon className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">Muawin</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              {mounted ? link.label : ''}
            </Link>
          ))}
          {isCustomer && (
            <Button 
              onClick={() => router.push('/customer/post-job')}
              className="ml-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 h-10"
            >
              <Plus className="w-4 h-4 mr-2" /> {mounted ? t('post_job') : ''}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full text-muted-foreground hover:text-primary">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                <Languages className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl">
              <DropdownMenuItem onClick={() => setLanguage('en')} className="rounded-lg">English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ur')} className="rounded-lg font-urdu-modern">اردو</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('bilingual')} className="rounded-lg">English / اردو</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden sm:flex items-center gap-2 rounded-full pl-1 pr-3 py-1 h-auto border border-border hover:bg-surface transition-all">
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border shadow-sm">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="object-cover" />
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2">
              <div className="px-3 py-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">My Account</p>
              </div>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link href={isCustomer ? "/customer/profile" : isProvider ? "/provider/profile" : "/vendor/profile"}>
                  <User className="w-4 h-4 mr-2" /> {t('profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" /> {t('log_out')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-primary/5">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-none rounded-l-[32px] shadow-2xl">
              <SheetHeader className="p-6 bg-primary text-white rounded-bl-[32px]">
                <SheetTitle className="text-left text-white flex items-center gap-2">
                  <MuawinIcon className="w-8 h-8 text-white" />
                  Muawin Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full bg-surface">
                <div className="p-4 space-y-2 mt-4">
                  {links.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all",
                        pathname === link.href ? "bg-primary text-white shadow-lg" : "bg-white text-muted-foreground hover:bg-primary/5 shadow-sm"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-bold">{mounted ? link.label : ''}</span>
                    </Link>
                  ))}
                  {isCustomer && (
                    <Button 
                      onClick={() => router.push('/customer/post-job')}
                      className="w-full h-14 rounded-2xl font-bold bg-primary text-white shadow-lg mt-4"
                    >
                      <Plus className="w-5 h-5 mr-2" /> {mounted ? t('post_job') : ''}
                    </Button>
                  )}
                </div>
                
                <div className="mt-auto p-6 border-t border-border bg-white space-y-4 rounded-tl-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                  <Link href={isCustomer ? "/customer/profile" : isProvider ? "/provider/profile" : "/vendor/profile"} className="flex items-center gap-4 text-muted-foreground font-bold hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    {t('profile')}
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 text-red-500 font-bold hover:text-red-600 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    {t('log_out')}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
