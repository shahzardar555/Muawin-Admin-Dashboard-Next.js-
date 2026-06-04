'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Check, X, Loader2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { adminSupabase } from '@/lib/admin-supabase';

interface VerificationEntry {
  id: string;
  name: string;
  category: string;
  city: string;
  status: string;
  date: string;
  cnic_number: string | null;
}

export default function VerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [providers, setProviders] = useState<VerificationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'under_review' | 'verified' | 'rejected'>('under_review');

  useEffect(() => {
    loadProviders();
  }, [filter]);

  async function loadProviders() {
    setIsLoading(true);
    try {
      let query = adminSupabase
        .from('providers')
        .select(`
          id,
          service_category,
          city,
          verification_status,
          cnic_number,
          created_at,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('verification_status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setProviders((data || []).map((p: any) => ({
        id: p.id,
        name: p.profiles?.full_name || 'Unknown',
        category: p.service_category || '',
        city: p.city || '',
        status: p.verification_status || 'pending',
        date: new Date(p.created_at).toLocaleDateString('en-PK'),
        cnic_number: p.cnic_number,
      })));
    } catch (e) {
      console.error('Error loading providers:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setProcessingId(id);
    try {
      await adminSupabase
        .from('providers')
        .update({
          verification_status: action === 'approve' ? 'verified' : 'rejected',
          is_verified: action === 'approve',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      toast({
        title: action === 'approve' ? 'Provider Verified ✅' : 'Provider Rejected ❌',
        description: action === 'approve'
          ? 'Provider can now accept jobs on Muawin.'
          : 'Provider has been notified of rejection.',
        variant: action === 'approve' ? 'default' : 'destructive',
      });

      loadProviders();
    } catch (e) {
      console.error('Error updating provider:', e);
      toast({
        title: 'Error',
        description: 'Failed to update provider status.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 border-none">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-none">Rejected</Badge>;
      case 'under_review':
        return <Badge className="bg-amber-100 text-amber-700 border-none">Under Review</Badge>;
      default:
        return <Badge className="bg-grey-100 text-grey-700 border-none">Pending</Badge>;
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-grey-900">Verification Queue</h1>
        <p className="text-sm text-muted-foreground">Review and approve provider documents</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['under_review', 'all', 'verified', 'rejected'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="rounded-xl capitalize"
          >
            {f === 'under_review' ? 'Pending' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : providers.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl">
          <ShieldCheck className="w-12 h-12 text-grey-300 mx-auto mb-4" />
          <p className="font-bold text-muted-foreground">No providers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map(p => (
            <Card key={p.id} className="p-4 border-none bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-grey-900">{p.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {p.category} • {p.city} • {p.date}
                    </p>
                    <div className="mt-1">{getStatusBadge(p.status)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.status === 'under_review' && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={processingId === p.id}
                        onClick={() => handleAction(p.id, 'reject')}
                        className="rounded-xl w-10 h-10 text-red-500 hover:bg-red-50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={processingId === p.id}
                        onClick={() => handleAction(p.id, 'approve')}
                        className="rounded-xl w-10 h-10 text-green-500 hover:bg-green-50"
                      >
                        {processingId === p.id 
                          ? <Loader2 className="w-5 h-5 animate-spin" /> 
                          : <Check className="w-5 h-5" />}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/verification/${p.id}`)}
                    className="rounded-xl font-bold"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}