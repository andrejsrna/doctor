import { Subscriber, Category } from "../types";

export interface FetchDataParams {
  currentPage: number;
  itemsPerPage: number;
  debouncedSearchTerm: string;
  filterStatus: string;
  filterCategory: string;
  showSoftDeleted: boolean;
}

export interface FetchDataResult {
  subscribers: Subscriber[];
  categories: Category[];
  totalPages: number;
  totalCount: number;
  stats?: {
    totalSubscribers: number;
    activeSubscribers: number;
    pendingSubscribers: number;
  };
}

export const fetchNewsletterData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  const timestamp = Date.now();
  const searchParams = new URLSearchParams({
    page: params.currentPage.toString(),
    limit: params.itemsPerPage.toString(),
    search: params.debouncedSearchTerm,
    status: params.filterStatus,
    category: params.filterCategory,
    includeInfluencers: '1',
    showSoftDeleted: params.showSoftDeleted.toString(),
    t: timestamp.toString()
  });
  
  const [subscribersResponse, categoriesResponse] = await Promise.all([
    fetch(`/api/admin/newsletter/subscribers?${searchParams}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    }),
    fetch(`/api/admin/newsletter/categories?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  ]);
  
  let subscribers: Subscriber[] = [];
  let categories: Category[] = [];
  let totalPages = 1;
  let totalCount = 0;
  let stats = undefined;
  
  if (subscribersResponse.ok) {
    const data = await subscribersResponse.json();
    if (data.success) {
      subscribers = data.subscribers || [];
      totalPages = data.pagination?.totalPages || 1;
      totalCount = data.pagination?.totalCount || 0;
      stats = data.stats;
    } else {
      console.error('API returned error:', data.error);
    }
  } else {
    console.error('Failed to fetch subscribers:', await subscribersResponse.text());
  }
  
  if (categoriesResponse.ok) {
    const data = await categoriesResponse.json();
    const raw = (data.categories || []) as Category[];
    const seen = new Set<string>();
    categories = raw.filter(c => {
      const key = c.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } else {
    console.error('Failed to fetch categories:', await categoriesResponse.text());
  }
  
  return {
    subscribers,
    categories,
    totalPages,
    totalCount,
    stats
  };
};

export const addSubscriber = async (subscriberData: {
  email: string;
  name: string;
  tags: string;
  category: string;
  notes: string;
}) => {
  const requestBody = {
    email: subscriberData.email,
    name: subscriberData.name,
    tags: subscriberData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    category: subscriberData.category || undefined,
    notes: subscriberData.notes
  };

  const response = await fetch('/api/admin/newsletter/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || 'Failed to add subscriber');
    } catch {
      throw new Error('Failed to add subscriber');
    }
  }

  return await response.json();
};

export const updateExistingSubscriber = async (subscriberData: {
  email: string;
  name: string;
  tags: string;
  category: string;
  notes: string;
}) => {
  const requestBody = {
    email: subscriberData.email,
    name: subscriberData.name,
    tags: subscriberData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    category: subscriberData.category || undefined,
    notes: subscriberData.notes,
    updateExisting: true
  };

  const response = await fetch('/api/admin/newsletter/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || 'Failed to update subscriber');
    } catch {
      throw new Error('Failed to update subscriber');
    }
  }

  return await response.json();
};
