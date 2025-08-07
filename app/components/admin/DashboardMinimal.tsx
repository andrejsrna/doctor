"use client";

import { IconType } from "react-icons";
import { FaUsers, FaEnvelopeOpen, FaEnvelope, FaArrowRight, FaSyncAlt } from "react-icons/fa";

export default function DashboardMinimal({
  userName,
  currentMessage,
  dashboardData,
  navigationItems,
  formatNumber,
  formatTimeAgo,
  getCategoryColor,
  onNavigate,
  onRefreshMessage
}: {
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
      category: { id: string; name: string; color: string } | null;
    }>;
  };
  navigationItems: Array<{ name: string; href: string; icon: IconType; description: string }>;
  formatNumber: (num: number) => string;
  formatTimeAgo: (dateString: string) => string;
  getCategoryColor: (color: string) => string;
  onNavigate: (href: string) => void;
  onRefreshMessage?: () => void;
}) {
  const { stats, recentActivity } = dashboardData;

  const cards = [
    {
      title: "Subscribers",
      value: formatNumber(stats.totalSubscribers),
      sub: `${stats.growthPercentage >= 0 ? "+" : ""}${stats.growthPercentage}%`,
      icon: FaUsers,
      ring: "ring-green-500/40",
      glow: "shadow-[0_0_40px_rgba(34,197,94,0.15)]"
    },
    {
      title: "Active",
      value: formatNumber(stats.activeSubscribers),
      sub: `${Math.round((stats.activeSubscribers / Math.max(stats.totalSubscribers || 1, 1)) * 100)}%`,
      icon: FaEnvelopeOpen,
      ring: "ring-blue-500/40",
      glow: "shadow-[0_0_40px_rgba(59,130,246,0.15)]"
    },
    {
      title: "Campaigns",
      value: formatNumber(stats.totalCampaigns),
      sub: `${stats.recentEmails} sent`,
      icon: FaEnvelope,
      ring: "ring-purple-500/40",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.15)]"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8 text-white space-y-8">
      <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-purple-300/80">Welcome back</div>
            <div className="text-2xl font-semibold">{userName}</div>
            {/* brief subtitle only; full message shown below */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            {cards.map((c, idx) => (
              <div key={idx} className={`rounded-xl bg-black/60 border border-white/10 ring-1 ${c.ring} ${c.glow} px-4 py-3`}> 
                <div className="flex items-center gap-2 text-gray-300">
                  <c.icon className="text-white/80" />
                  <span className="text-sm">{c.title}</span>
                </div>
                <div className="mt-1 text-xl font-semibold">{c.value}</div>
                <div className="text-xs text-gray-400">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentMessage && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-300 text-lg">💡</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Today&apos;s Mission</div>
                <div className="text-sm text-blue-300">Your daily productivity goal</div>
              </div>
            </div>
            {typeof onRefreshMessage === 'function' && (
              <button
                onClick={onRefreshMessage}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-blue-500/30 text-blue-300 hover:bg-black/50"
                aria-label="Refresh message"
              >
                <FaSyncAlt />
                <span>Refresh</span>
              </button>
            )}
          </div>
          <div className="text-white text-base leading-relaxed">{currentMessage}</div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/50 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Admin Shortcuts</div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className="group text-left bg-black/40 border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-white/90 font-medium">{item.name}</div>
                  <FaArrowRight className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-2 text-sm text-gray-400">{item.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black/50 border border-purple-500/20 rounded-2xl p-6">
          <div className="text-lg font-semibold mb-4">Recent activity</div>
          <div className="space-y-3">
            {recentActivity.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-start justify-between">
                <div>
                  <div className="text-white/90 text-sm">{a.name || a.email}</div>
                  <div className="text-xs text-gray-400">{formatTimeAgo(a.createdAt)}</div>
                </div>
                {a.category ? (
                  <span className={`px-2 py-0.5 rounded text-xs border ${getCategoryColor(a.category.color)}`}>{a.category.name}</span>
                ) : (
                  <span className="text-xs text-gray-500">—</span>
                )}
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-sm text-gray-500">No recent events</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


