export type Role = 'ADMIN' | 'FOUNDER' | 'INVESTOR';

export interface AuthUser {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export type Category =
  | 'TECH'
  | 'FOOD'
  | 'FASHION'
  | 'HEALTH'
  | 'EDUCATION'
  | 'FINANCE'
  | 'ECOMMERCE'
  | 'AGRICULTURE'
  | 'ENTERTAINMENT'
  | 'OTHER';

export type BusinessStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'LIVE' | 'FUNDED';

export interface Business {
  id: number;
  name: string;
  category: Category;
  description: string;
  askAmount: number;
  equityOffered: number;
  status: BusinessStatus;
  rejectionReason?: string;
  websiteUrl?: string;
  founderId: number;
  founderName: string;
  pitchVideoUrl?: string;
  createdAt: string;
}

export type PitchStatus = 'DRAFT' | 'SUBMITTED';

export interface Pitch {
  id: number;
  businessId: number;
  videoUrl: string;
  description?: string;
  aiFeedback?: string;
  status: PitchStatus;
  submittedAt?: string;
  createdAt: string;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';

export interface Offer {
  id: number;
  businessId: number;
  businessName: string;
  investorId: number;
  investorName: string;
  amount: number;
  equityPercent: number;
  message?: string;
  status: OfferStatus;
  createdAt: string;
}

export interface Conversation {
  id: number;
  businessId: number;
  businessName: string;
  investorId: number;
  investorName: string;
  founderId: number;
  founderName: string;
  unreadCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface FinancialEntry {
  label: string;
  value: number;
}

export interface AiFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  investorQuestions: string[];
  investorPerspective: string;
  pitchTips: string[];
  marketInsights: string;
  summary: string;
  financialData?: {
    revenue?: FinancialEntry[];
    profit?: FinancialEntry[];
    unitEconomics?: { cac?: number; ltv?: number; margin?: number };
    notes?: string;
  };
  error?: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'TECH', label: 'Technology' },
  { value: 'FOOD', label: 'Food & Beverage' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'HEALTH', label: 'Healthcare' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'ECOMMERCE', label: 'E-Commerce' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'OTHER', label: 'Other' },
];
