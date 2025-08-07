"use client";

import { FaEnvelope, FaUserEdit, FaUserTimes, FaGlobe, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

interface Influencer {
  id: string;
  email: string;
  name: string | null;
  platform: string | null;
  handle: string | null;
  followers: number | null;
  engagement: number | null;
  category: string | null;
  location: string | null;
  notes: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'CONTACTED' | 'RESPONDED' | 'COLLABORATING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP';
  lastContact: Date | null;
  nextContact: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  subscriber?: {
    id: string;
    name: string | null;
    category?: {
      id: string;
      name: string;
      color: string;
    } | null;
  } | null;
  stats?: {
    newsletter: { sent: number; opened: number; clicked: number; lastSentAt: string | null };
    feedbacks: { total: number; avgRating: number | null; lastSubmittedAt: string | null };
  };
}

export default function InfluencersTable({
  influencers,
  onEdit,
  onDelete,
}: {
  influencers: Influencer[];
  onEdit: (infl: Influencer) => void;
  onDelete: (id: string) => void;
}) {
  const platformIcon = (platform: string | null) => {
    if (!platform) return <FaGlobe className="w-4 h-4" />;
    const map: Record<string, React.ComponentType<{ className?: string }>> = {
      instagram: FaInstagram,
      youtube: FaYoutube,
      tiktok: FaTiktok,
    };
    const Icon = map[platform.toLowerCase()] || FaGlobe;
    return <Icon className="w-4 h-4" />;
  };

  const statusBadge = (status: string) => {
    const classes: Record<string, string> = {
      ACTIVE: 'bg-green-900/30 border-green-500/30 text-green-300',
      INACTIVE: 'bg-gray-800/30 border-gray-500/30 text-gray-300',
      CONTACTED: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
      RESPONDED: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300',
      COLLABORATING: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
    };
    return `px-2 py-1 rounded-full text-xs border ${classes[status]}`;
  };

  const priorityBadge = (priority: string) => {
    const classes: Record<string, string> = {
      LOW: 'bg-gray-800/30 border-gray-500/30 text-gray-300',
      MEDIUM: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
      HIGH: 'bg-orange-900/30 border-orange-500/30 text-orange-300',
      VIP: 'bg-red-900/30 border-red-500/30 text-red-300',
    };
    return `px-2 py-1 rounded-full text-xs border ${classes[priority]}`;
  };

  return (
    <div className="bg-black/50 border border-purple-500/20 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black/40 text-gray-300">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Influencer</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Followers</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Newsletter</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {influencers.map((influencer) => (
              <tr key={influencer.id} className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{influencer.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-400">{influencer.email}</div>
                    {influencer.handle && (
                      <div className="text-xs text-gray-500">@{influencer.handle}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-white">
                    {platformIcon(influencer.platform)}
                    <span className="text-sm">{influencer.platform || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    {influencer.followers ? `${influencer.followers.toLocaleString()}` : 'N/A'}
                  </div>
                  {influencer.engagement && (
                    <div className="text-xs text-gray-400">{influencer.engagement}% engagement</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={statusBadge(influencer.status)}>{influencer.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={priorityBadge(influencer.priority)}>{influencer.priority}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {influencer.subscriber ? (
                    <div className="flex items-center gap-2 text-white">
                      <FaEnvelope className="text-green-400" />
                      <span className="text-sm">
                        {influencer.subscriber.category?.name || 'Subscriber'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not synced</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {influencer.stats ? (
                    <div className="space-y-1">
                      <div className="text-gray-300">Sent: {influencer.stats.newsletter.sent} · Opened: {influencer.stats.newsletter.opened} · Clicked: {influencer.stats.newsletter.clicked}</div>
                      {influencer.stats.feedbacks.total > 0 ? (
                        <div className="text-gray-300">Feedbacks: {influencer.stats.feedbacks.total} · Avg: {influencer.stats.feedbacks.avgRating?.toFixed(1) || '—'}</div>
                      ) : (
                        <div className="text-gray-500">No feedback yet</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(influencer)} className="px-3 py-1 rounded bg-blue-900/40 border border-blue-500/30 text-blue-200 hover:bg-blue-900/60">Edit</button>
                    <button onClick={() => onDelete(influencer.id)} className="px-3 py-1 rounded bg-red-900/40 border border-red-500/30 text-red-200 hover:bg-red-900/60">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


