'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Brush, UserCheck, ArrowLeft } from 'lucide-react';
import RoleCard from '@/components/muawin/RoleCard';

export default function RoleSelectPage() {
  const router = useRouter();

  const handleSelect = (role: 'customer' | 'provider') => {
    if (role === 'provider') {
      router.push('/auth/provider-type-select');
    } else {
      router.push(`/auth/register?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto">
      <header className="py-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white/50">
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-headline font-bold">Choose your role</h1>
          <p className="text-muted-foreground">How do you want to use Muawin?</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RoleCard 
            icon={UserCheck}
            title="I need a service"
            description="Find and hire local professionals for your household tasks."
            onClick={() => handleSelect('customer')}
          />

          <RoleCard 
            icon={Brush}
            title="I offer a service"
            description="Join our community of pros and earn money providing services."
            onClick={() => handleSelect('provider')}
          />
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </footer>
    </div>
  );
}
