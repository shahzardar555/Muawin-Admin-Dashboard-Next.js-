'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Loader2, User, Store, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adminSupabase } from '@/lib/admin-supabase';

interface UserEntry {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  phone_number: string | null;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'provider' | 'vendor'>('all');

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  async function loadUsers() {
    setIsLoading(true);
    try {
      let query = adminSupabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, phone_number')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      console.error('Error loading users:', e);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getRoleIcon(role: string) {
    switch (role) {
      case 'provider': return <Briefcase className="w-5 h-5 text-amber-600" />;
      case 'vendor': return <Store className="w-5 h-5 text-emerald-600" />;
      default: return <User className="w-5 h-5 text-blue-600" />;
    }
  }

  function getRoleBadge(role: string) {
    switch (role) {
      case 'provider':
        return <Badge className="bg-amber-100 text-amber-700 border-none capitalize">{role}</Badge>;
      case 'vendor':
        return <Badge className="bg-emerald-100 text-emerald-700 border-none capitalize">{role}</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700 border-none capitalize">{role}</Badge>;
    }
  }

  function getRoleIconBg(role: string) {
    switch (role) {
      case 'provider': return 'bg-amber-100';
      case 'vendor': return 'bg-emerald-100';
      default: return 'bg-blue-100';
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-grey-900">User Management</h1>
        <p className="text-sm text-muted-foreground">
          {filteredUsers.length} users found
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl border-grey-200"
        />
      </div>

      {/* Role filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'customer', 'provider', 'vendor'] as const).map(r => (
          <Button
            key={r}
            variant={roleFilter === r ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter(r)}
            className="rounded-xl capitalize"
          >
            {r}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl">
          <Users className="w-12 h-12 text-grey-300 mx-auto mb-4" />
          <p className="font-bold text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map(user => (
            <Card key={user.id} className="p-4 border-none bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push(`/admin/users/${user.id}`)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRoleIconBg(user.role)}`}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h4 className="font-bold text-grey-900">{user.full_name || 'Unknown'}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.phone_number && (
                      <p className="text-xs text-muted-foreground">{user.phone_number}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getRoleBadge(user.role)}
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('en-PK')}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}