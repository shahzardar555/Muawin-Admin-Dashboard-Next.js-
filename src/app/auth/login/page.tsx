'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MuawinIcon from '@/components/muawin/MuawinIcon';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin accounts only.');
      }

      toast({ 
        title: "Admin Access", 
        description: "Welcome back!" 
      });
      router.push('/admin/dashboard');

    } catch (err: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message + " | " + JSON.stringify(err),
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col items-center justify-center">
      <main className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-2xl space-y-10 border border-grey-100">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src="/mlogo.png" alt="Muawin Logo" className="w-20 h-20 object-contain" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white transform rotate-12">
              <Sparkles className="w-4 h-4 text-primary" fill="currentColor" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-grey-900">
              Admin Console
            </h1>
            <p className="text-sm text-grey-500 font-medium">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-black text-[10px] uppercase tracking-widest text-grey-400 ml-1">Email</Label>
                <Input 
                  id="username" 
                  placeholder="admin@muawin.com" 
                  required 
                  className="rounded-2xl h-14 bg-surface border-none focus-visible:ring-primary shadow-sm"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="font-black text-[10px] uppercase tracking-widest text-grey-400">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="rounded-2xl h-14 bg-surface border-none focus-visible:ring-primary shadow-sm" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-all">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In to Dashboard'}
            </Button>
          </form>
      </main>
      
      <p className="mt-8 text-[10px] font-black text-grey-300 uppercase tracking-[0.4em]">Muawin v1.0.4 Admin</p>
    </div>
  );
}
