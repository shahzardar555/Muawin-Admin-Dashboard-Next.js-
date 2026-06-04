'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Store,
  Clock,
  ThumbsUp,
  ChevronRight,
  Info,
  ExternalLink,
  Edit3,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();

  const mockVendors = [
    { id: 'v1', name: 'Metro Supermarket', category: 'Supermarkets', rating: 4.8, distance: '0.5 km', seed: 'ven-supermarket', address: 'Block L, Gulberg III, Lahore', bio: 'Wide variety of groceries, household items, and electronics. Best prices and quality in the area.', phone: '+923000000001', mapUrl: 'https://maps.google.com/?q=Metro+Supermarket+Gulberg+III+Lahore' },
    { id: 'v2', name: 'Meat One', category: 'Butchery', rating: 4.9, distance: '1.2 km', seed: 'ven-butchery', address: 'Main Blvd, Gulberg, Lahore', bio: 'Premium quality fresh meat and cuts. 100% hygienic and verified source.', phone: '+923000000002', mapUrl: 'https://maps.google.com/?q=Meat+One+Gulberg+Lahore' },
    { id: 'v3', name: 'Dairy Pure', category: 'Milkshops', rating: 4.7, distance: '0.8 km', seed: 'ven-milkshop', address: 'Gurumangat Road, Lahore', bio: 'Pure and fresh milk, yogurt, and other dairy products delivered daily.', phone: '+923000000003', mapUrl: 'https://maps.google.com/?q=Dairy+Pure+Gurumangat+Road+Lahore' },
    { id: 'v4', name: 'Aqua Safe', category: 'Water Plants', rating: 4.6, distance: '2.0 km', seed: 'ven-waterplant', address: 'Peco Road, Lahore', bio: 'Clean and mineral-enriched water. Fast delivery service for home and office.', phone: '+923000000004', mapUrl: 'https://maps.google.com/?q=Aqua+Safe+Peco+Road+Lahore' },
    { id: 'v5', name: 'Gas Master', category: 'Gas Cylinder Shops', rating: 4.5, distance: '1.5 km', seed: 'ven-gas', address: 'Model Town, Lahore', bio: 'Reliable gas cylinder refills and new connections. Quick delivery available.', phone: '+923000000005', mapUrl: 'https://maps.google.com/?q=Gas+Master+Model+Town+Lahore' },
    { id: 'v6', name: 'Fresh Mart', category: 'Fruits and Vegetables', rating: 4.8, distance: '0.3 km', seed: 'ven-fruits', address: 'H-Block Market, Lahore', bio: 'Daily fresh arrivals of seasonal fruits and organic vegetables.', phone: '+923000000006', mapUrl: 'https://maps.google.com/?q=Fresh+Mart+H-Block+Market+Lahore' },
  ];

  const vendor = mockVendors.find(v => v.id === params.id) || mockVendors[0];
  const vendorImage = PlaceHolderImages.find(p => p.id === vendor.seed)?.imageUrl || `https://picsum.photos/seed/${vendor.id}/800/600`;

  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', user: 'Ali R.', rating: 5, comment: 'Always fresh and high quality. Great delivery service!', date: '1 day ago' },
    { id: '2', user: 'Sana W.', rating: 4, comment: 'Very reliable vendor. The store is well organized.', date: '3 days ago' },
    { id: '3', user: 'Zubair H.', rating: 5, comment: 'Quick delivery and reasonable prices.', date: '1 week ago' },
  ]);

  // Review states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenMap = () => {
    if (vendor.mapUrl) {
      window.open(vendor.mapUrl, '_blank');
    }
  };

  const handlePostReview = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const review: Review = {
        id: Date.now().toString(),
        user: 'John Doe', // Current logged in user simulation
        rating: newRating,
        comment: newComment.trim(),
        date: 'Just now'
      };
      
      setReviews([review, ...reviews]);
      setIsSubmitting(false);
      setIsReviewOpen(false);
      setNewComment('');
      setNewRating(5);
      
      toast({
        title: "Review Posted",
        description: "Thank you for sharing your experience!",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      <div className="relative h-72 w-full">
        <Image 
          src={vendorImage} 
          alt={vendor.name} 
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
                <h1 className="text-2xl font-bold">{vendor.name}</h1>
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[10px] px-2 py-0.5 flex items-center gap-1">
                  <Store className="w-3 h-3" /> Verified Vendor
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-none font-bold text-[10px] px-2 py-0.5 flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> Customer Favorite
                </Badge>
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest pt-1">{vendor.category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-bold">{vendor.rating}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold">Verified Ratings</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              asChild
              className="h-14 rounded-2xl text-lg font-bold shadow-md bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all border border-blue-200 flex items-center justify-center gap-2"
            >
              <a href={`tel:${vendor.phone}`}>
                <Phone className="w-5 h-5" /> Call Now
              </a>
            </Button>
            <Button 
              onClick={() => router.push(`/chat/${vendor.id}?name=${encodeURIComponent(vendor.name)}&avatar=${encodeURIComponent(vendorImage)}`)}
              className="h-14 rounded-2xl text-lg font-bold shadow-md bg-primary hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 text-primary-foreground"
            >
              <MessageSquare className="w-5 h-5" /> Chat
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-secondary/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold leading-tight">{vendor.address}</p>
                  <p className="text-[11px] text-primary font-bold mt-1">{vendor.distance} away</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenMap}
                className="rounded-xl border-primary/20 text-primary font-bold text-[10px] h-9 px-3 gap-1.5 hover:bg-primary/5 active:scale-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Map
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Store Status</p>
                <p className="text-sm font-bold flex items-center gap-1.5 text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Open Now
                </p>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">About the Store</h3>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {vendor.bio}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Customer Reviews</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsReviewOpen(true)}
              className="text-primary font-bold text-sm flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" /> Write a Review
            </Button>
          </div>
          <div className="space-y-4">
            {reviews.map(review => (
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

      {/* Write a Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="rounded-[32px] w-[90%] max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
            <DialogDescription className="text-xs">
              Share your experience with {vendor.name} to help others.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3 text-center">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Rating</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none transition-transform active:scale-125"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8", 
                        star <= newRating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Feedback</Label>
              <Textarea 
                id="review-comment"
                placeholder="What did you like or dislike about this shop?" 
                className="rounded-2xl min-h-[120px] bg-surface border-none shadow-inner text-sm focus-visible:ring-primary/30"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-2xl h-14 font-bold border border-secondary/30"
              onClick={() => setIsReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-2xl h-14 font-bold shadow-lg"
              onClick={handlePostReview}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
