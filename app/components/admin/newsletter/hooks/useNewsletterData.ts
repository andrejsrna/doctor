import { useState, useCallback } from "react";

interface Subscriber {
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

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

interface Stats {
  totalSubscribers: number;
  activeSubscribers: number;
  pendingSubscribers: number;
}

export function useNewsletterData() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    pendingSubscribers: 0
  });

  const fetchSubscribers = useCallback(async (params: {
    page: number;
    limit: number;
    search: string;
    status: string;
    category: string;
  }) => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        search: params.search,
        status: params.status,
        category: params.category,
        t: timestamp.toString()
      });
      
      searchParams.append('includeInfluencers', '0');
      const response = await fetch(`/api/admin/newsletter/subscribers?${searchParams}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
        if (data.stats) {
          setStats(data.stats);
        }
        return data;
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/newsletter/categories', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  return {
    subscribers,
    categories,
    loading,
    stats,
    fetchSubscribers,
    fetchCategories
  };
}
