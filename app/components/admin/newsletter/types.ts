export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'ACTIVE' | 'PENDING' | 'UNSUBSCRIBED';
  source?: string;
  tags?: string[];
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  notes?: string;
  lastEmailSent?: string;
  emailCount?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

export interface RecentlyDeleted {
  subscriber: Subscriber;
  timestamp: number;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  pendingSubscribers: number;
}
