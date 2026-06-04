
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Entry point redirecting directly to the Login screen.
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Muawin Admin...</p>
      </div>
    </div>
  );
}
