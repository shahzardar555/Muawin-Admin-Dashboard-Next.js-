'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  TrendingUp, 
  Wallet, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const data = [
  { day: 'Mon', amount: 2400 },
  { day: 'Tue', amount: 1800 },
  { day: 'Wed', amount: 3200 },
  { day: 'Thu', amount: 2800 },
  { day: 'Fri', amount: 4500 },
  { day: 'Sat', amount: 5200 },
  { day: 'Sun', amount: 1200 },
];

export default function ProviderEarningsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col max-w-md mx-auto pb-24">
      <header className="py-4 flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">Earnings</h1>
      </header>

      <main className="space-y-6">
        <Card className="p-6 bg-primary text-primary-foreground border-none rounded-[32px] shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Balance</p>
            <h2 className="text-4xl font-bold">Rs. 48,200</h2>
            <div className="flex items-center gap-2 pt-4">
              <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-10 px-6">
                Withdraw
              </Button>
              <Button variant="ghost" className="text-white font-bold rounded-xl h-10 hover:bg-white/10">
                Details
              </Button>
            </div>
          </div>
          <Wallet className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10" />
        </Card>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Weekly Performance</h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3 text-green-500" /> +12% vs last week
            </span>
          </div>
          <Card className="p-4 bg-white border-none shadow-sm h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#115E59' : '#99F6E4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Recent Payouts</h3>
            <Button variant="link" className="text-xs font-bold h-auto p-0">See All</Button>
          </div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Card key={i} className="p-4 bg-white border-none shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Bank Transfer</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">Oct {20-i}, 2024 • 04:30 PM</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">Rs. 12,500</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
