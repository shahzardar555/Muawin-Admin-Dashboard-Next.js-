'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Store } from 'lucide-react';
import RoleCard from '@/components/muawin/RoleCard';

/**
 * Provider Type Selection Screen.
 * Allows professionals to distinguish between individual services and business/shop offerings.
 */
export default function ProviderTypeSelectPage() {
  const router = useRouter();

  const handleSelect = (type: 'provider' | 'vendor') => {
    router.push(`/auth/register?role=${type}`);
  };

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto">
      <header className="py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full hover:bg-white/50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Are you a ?</h1>
          <p className="text-muted-foreground font-medium">Tell us more about your business model</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RoleCard 
            icon={User}
            title="Service Provider"
            description="Individual professional (e.g. Maid, Driver, Cook, Gardener)"
            onClick={() => handleSelect('provider')}
          />

          <RoleCard 
            icon={Store}
            title="Vendor"
            description="Business or shop (e.g. Supermarket, Water Plant, Butcher)"
            onClick={() => handleSelect('vendor')}
          />
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto leading-relaxed">
          Choose the option that best describes your professional setup.
        </p>
      </footer>
    </div>
  );
}
