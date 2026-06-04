'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorFeedPage() {
  const router = useRouter();

  useEffect(() => {
    // Effectively removing this page by redirecting to home
    router.replace('/vendor/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
