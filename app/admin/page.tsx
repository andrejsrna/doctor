"use client";
import { authClient } from "@/app/lib/authClient";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LoadingState, ErrorState } from "../components/admin/AdminUI";
import DashboardMinimal from "../components/admin/DashboardMinimal";
import { productivityMessages, navigationItems } from "../components/admin/constants";

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  recentSubscribers: number;
  totalCampaigns: number;
  recentEmails: number;
  successfulEmails: number;
  failedEmails: number;
  growthPercentage: number;
  subscribersByCategory: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
    _count: {
      subscribers: number;
    };
  }>;
}

interface RecentActivity {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}



export default function AdminPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard/stats', { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * productivityMessages.length);
    setCurrentMessage(productivityMessages[randomIndex]);
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }, []);

  const formatTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  }, []);

  const getCategoryColor = useCallback((color: string) => {
    const colorMap: { [key: string]: string } = {
      'green': 'text-green-400 bg-green-900/30',
      'blue': 'text-blue-400 bg-blue-900/30',
      'purple': 'text-purple-400 bg-purple-900/30',
      'yellow': 'text-yellow-400 bg-yellow-900/30',
      'red': 'text-red-400 bg-red-900/30'
    };
    return colorMap[color] || 'text-gray-400 bg-gray-900/30';
  }, []);

  if (session?.user?.role === 'EDITOR') {
    router.replace('/admin/demos');
    return <LoadingState message="Redirecting..." />;
  }

  const filteredNavItems = useMemo(() => {
    if (session?.user?.role === 'ADMIN') {
      return navigationItems;
    }
    if (session?.user?.role === 'EDITOR') {
      return navigationItems.filter(item => item.href === '/admin/demos');
    }
    return [];
  }, [session]);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState error={error} onRetry={fetchDashboardData} />;
  if (!dashboardData) return <LoadingState message="No data available" />;

  return (
    <DashboardMinimal
      userName={session?.user?.name || "Admin"}
      currentMessage={currentMessage}
      dashboardData={dashboardData}
      navigationItems={filteredNavItems}
      formatNumber={formatNumber}
      formatTimeAgo={formatTimeAgo}
      getCategoryColor={getCategoryColor}
      onNavigate={(href) => router.push(href)}
      onRefreshMessage={() => {
        const randomIndex = Math.floor(Math.random() * productivityMessages.length);
        setCurrentMessage(productivityMessages[randomIndex]);
      }}
    />
  );
}
