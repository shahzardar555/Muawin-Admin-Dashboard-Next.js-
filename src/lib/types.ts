export type UserRole = 'customer' | 'provider' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type JobStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'reviewed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Provider extends User {
  category: string;
  experience: number;
  bio: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  serviceRadius: number;
  verificationStatus: VerificationStatus;
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  selfieUrl?: string;
}

export interface JobRequest {
  id: string;
  customerId: string;
  providerId?: string;
  category: string;
  description: string;
  location: string;
  status: JobStatus;
  createdAt: string;
  scheduledAt: string;
  photos?: string[];
}

export interface Review {
  id: string;
  jobId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const CATEGORIES = [
  'Maid', 'Driver', 'Babysitter', 'Security Guard', 'Washerman', 'Domestic Helper',
  'Cook', 'Gardener', 'Tutor'
];

export const VENDORS = [
  'Supermarkets', 'Butchery', 'Milkshops', 'Water Plants', 'Gas Cylinder Shops', 'Fruits and Vegetables Market'
];
