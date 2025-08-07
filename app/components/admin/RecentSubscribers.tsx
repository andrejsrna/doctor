"use client";

import { Card, ActivityItem } from "./AdminUI";

interface RecentSubscribersProps {
  recentActivity: Array<{
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    category: {
      id: string;
      name: string;
      color: string;
    } | null;
  }>;
  formatTimeAgo: (dateString: string) => string;
  getCategoryColor: (color: string) => string;
}

export const RecentSubscribers = ({ 
  recentActivity, 
  formatTimeAgo, 
  getCategoryColor 
}: RecentSubscribersProps) => (
  <Card className="overflow-hidden" delay={0.4} borderColor="green">
    <div className="p-6 border-b border-green-500/20">
      <h2 className="text-xl font-bold text-white">Recent Subscribers</h2>
      <p className="text-sm text-gray-400">Latest newsletter signups</p>
    </div>
    
    <div className="p-6">
      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            index={index}
            formatTimeAgo={formatTimeAgo}
            getCategoryColor={getCategoryColor}
          />
        ))}
      </div>
    </div>
  </Card>
);
