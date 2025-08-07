"use client";

import { DashboardHeader } from "./DashboardHeader";
import { ProductivityMessage } from "./ProductivityMessage";
import { StatsGrid } from "./StatsGrid";
import { RecentSubscribers } from "./RecentSubscribers";
import { QuickActions } from "./QuickActions";
import { NavigationCard } from "./AdminUI";
import { FaUsers, FaEnvelopeOpen, FaEnvelope, FaTimes } from "react-icons/fa";
import { IconType } from "react-icons";

interface DashboardContentProps {
  userName: string;
  currentMessage: string;
  dashboardData: {
    stats: {
      totalSubscribers: number;
      activeSubscribers: number;
      recentSubscribers: number;
      totalCampaigns: number;
      recentEmails: number;
      successfulEmails: number;
      failedEmails: number;
      growthPercentage: number;
    };
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
  };
  navigationItems: Array<{
    name: string;
    href: string;
    icon: IconType;
    description: string;
  }>;
  formatNumber: (num: number) => string;
  formatTimeAgo: (dateString: string) => string;
  getCategoryColor: (color: string) => string;
  onNavigate: (href: string) => void;
}

export const DashboardContent = ({
  userName,
  currentMessage,
  dashboardData,
  navigationItems,
  formatNumber,
  formatTimeAgo,
  getCategoryColor,
  onNavigate
}: DashboardContentProps) => {
  const { stats, recentActivity } = dashboardData;

  const dashboardStats = [
    {
      name: "Total Subscribers",
      value: formatNumber(stats.totalSubscribers),
      change: `${stats.growthPercentage >= 0 ? '+' : ''}${stats.growthPercentage}%`,
      changeType: (stats.growthPercentage >= 0 ? "positive" : "negative") as "positive" | "negative",
      icon: FaUsers,
      color: "green"
    },
    {
      name: "Active Subscribers",
      value: formatNumber(stats.activeSubscribers),
      change: `${Math.round((stats.activeSubscribers / stats.totalSubscribers) * 100)}%`,
      changeType: "positive" as const,
      icon: FaEnvelopeOpen,
      color: "blue"
    },
    {
      name: "Email Campaigns",
      value: formatNumber(stats.totalCampaigns),
      change: `${stats.recentEmails} sent`,
      changeType: "positive" as const,
      icon: FaEnvelope,
      color: "purple"
    },
    {
      name: "Success Rate",
      value: stats.recentEmails > 0 ? `${Math.round((stats.successfulEmails / stats.recentEmails) * 100)}%` : "0%",
      change: `${stats.failedEmails} failed`,
      changeType: (stats.failedEmails > 0 ? "negative" : "positive") as "positive" | "negative",
      icon: FaTimes,
      color: "yellow"
    }
  ];

  return (
    <div className="container mx-auto space-y-8">
      <NavigationCard 
        items={navigationItems} 
        onNavigate={onNavigate} 
      />

      <DashboardHeader 
        userName={userName}
        stats={{
          recentEmails: stats.recentEmails,
          recentSubscribers: stats.recentSubscribers
        }}
        formatNumber={formatNumber}
      />

      {currentMessage && (
        <ProductivityMessage message={currentMessage} />
      )}

      <StatsGrid stats={dashboardStats} />

      <div className="grid lg:grid-cols-2 gap-8">
        <RecentSubscribers 
          recentActivity={recentActivity}
          formatTimeAgo={formatTimeAgo}
          getCategoryColor={getCategoryColor}
        />

        <QuickActions onNavigate={onNavigate} />
      </div>
    </div>
  );
};
