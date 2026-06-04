'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  Trophy,
  Award,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  
  // Simulated data based on params.id
  const providers = {
    'pro1': {
      name: 'Ahmed Hassan',
      category: 'Driver',
      rating: 4.9,
      reviewCount: 124,
      pricePerHour: 1200,
      pricePerDay: 8000,
      experience: 8,
      location: 'Gulberg III, Lahore',
      distance: '1.2 km away',
      bio: 'Professional driver with 8 years of experience in both manual and automatic vehicles. Punctual, reliable, and familiar with all routes in Lahore.',
      verified: true,
      seed: 'pro1'
    },
    'pro2': {
      name: 'Zeeshan Malik',
      category: 'Maid',
      rating: 4.8,
      reviewCount: 89,
      pricePerHour: 800,
      pricePerDay: 5000,
      experience: 5,
      location: 'DHA Phase 5, Lahore',
      distance: '2.5 km away',
      bio: 'Expert in deep cleaning and home organization. I provide thorough cleaning services for apartments and houses. Available for daily or weekly shifts.',
      verified: true,
      seed: 'pro2'
    },
    'pro3': {
      name: 'Muhammad Ali',
      category: 'Security Guard',
      rating: 4.7,
      reviewCount: 56,
      pricePerHour: 1500,
      pricePerDay: 10000,
      experience: 10,
      location: 'Model Town, Lahore',
      distance: '0.8 km away',
      bio: 'Ex-military personnel with extensive training in security and surveillance. Specialized in residential and corporate security.',
      verified: true,
      seed: 'pro3'
    },
    'pro4': {
      name: 'Fatima Zahra',
      category: 'Babysitter',
      rating: 4.9,
      reviewCount: 42,
      pricePerHour: 1000,
      pricePerDay: 7000,
      experience: 4,
      location: 'Gulberg III, Lahore',
      distance: '3.1 km away',
      bio: 'Experienced caregiver specializing in early childhood development. CPR certified and fluent in English and Urdu.',
      verified: true,
      seed: 'pro4'
    },
    'pro5': {
      name: 'Bilal Khan',
      category: 'Gardener',
      rating: 4.6,
      reviewCount: 31,
      pricePerHour: 900,
      pricePerDay: 6000,
      experience: 6,
      location: 'Johar Town, Lahore',
      distance: '1.5 km away',
      bio: 'Landscape enthusiast with 6 years of experience. I specialize in lawn maintenance, pruning, and seasonal plantation.',
      verified: true,
      seed: 'pro5'
    }
  };

  const provider = providers[params.id as keyof typeof providers] || providers['pro1'];

  const mockReviews = [
    { id: '1', user: 'Usman R.', rating: 5, comment: 'Very professional and punctual. Highly recommended!', date: '2 days ago' },
    { id: '2', user: 'Kiran A.', rating: 4, comment: 'Great service, will book again.', date: '1 week ago' },
    { id: '3', user: 'Zubair M.', rating: 5, comment: 'Excellent work, very thorough.', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-surface pb-32">
      <div className="relative h-72 w-full">
        <Image 
          src={`https://picsum.photos/seed/${provider.seed}/800/600`} 
          alt={provider.name} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="absolute top-12 left-6 bg-white/20 backdrop-blur-md text-white rounded-full h-10 w-10 z-20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <main className="px-6 -mt-16 relative z-10 space-y-6">
        <Card className="p-6 muawin-card border-none bg-white shadow-xl overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {provider.rating >= 4.8 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-none font-bold text-[10px] px-2 py-0.5 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Top Rated
                  </Badge>
                )}
                {provider.experience >= 7 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] px-2 py-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Expert
                  </Badge>
                )}
                {provider.reviewCount >= 100 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-none font-bold text-[10px] px-2 py-0.5 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Customer Favorite
                  </Badge>
                )}
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest pt-1">{provider.category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-bold">{provider.rating}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold">{provider.reviewCount} Reviews</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <Button 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-md bg-primary hover:bg-primary/90 active:scale-95 transition-all text-primary-foreground"
              onClick={() => router.push(`/customer/post-job?category=${provider.category}`)}
            >
              Send Job Request
            </Button>
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted/30 rounded-xl text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <Lock className="w-3 h-3" /> Chat available after request is accepted
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Experience</p>
                <p className="text-sm font-bold">{provider.experience} Years</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold truncate max-w-[100px]">{provider.location}</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <h3 className="text-lg font-bold">Pricing Packages</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-2 border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase">Per Hour</p>
              <p className="text-xl font-black text-primary">Rs. {provider.pricePerHour}</p>
            </Card>
            <Card className="p-4 border-2 border-secondary/30 bg-white rounded-2xl flex flex-col items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase">Per Day</p>
              <p className="text-xl font-black text-primary">Rs. {provider.pricePerDay}</p>
            </Card>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold">About Me</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {provider.bio}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Reviews</h3>
            <Button variant="link" className="text-primary font-bold text-sm">View All</Button>
          </div>
          <div className="space-y-4">
            {mockReviews.map(review => (
              <Card key={review.id} className="p-4 bg-white border-none shadow-sm rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm">{review.user}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-3 h-3", 
                          i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200 fill-gray-200"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">"{review.comment}"</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase text-right">{review.date}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
