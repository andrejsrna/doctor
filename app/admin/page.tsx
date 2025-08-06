"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaSyringe, FaShieldAlt, FaUsers, FaChartLine, FaEnvelope, FaEnvelopeOpen, FaTimes, FaHome, FaInstagram, FaMusic, FaNewspaper, FaStar, FaCog } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const productivityMessages = [
  "Today contact a producer and ask him for a demo",
  "Send your latest track to 3 new labels",
  "Update your artist bio and social media profiles",
  "Create a new playlist and share it with your network",
  "Reach out to a DJ you admire for collaboration",
  "Practice your DJ skills for at least 2 hours today",
  "Listen to 5 new tracks from artists you don't know",
  "Organize your sample library and delete unused files",
  "Write down 3 new track ideas in your notebook",
  "Connect with 2 new music industry professionals",
  "Review and update your production workflow",
  "Share your music on 3 different platforms today",
  "Study the structure of your favorite tracks",
  "Backup all your projects and samples",
  "Set up a studio session with another producer",
  // --- 50 new DNB label manager tips ---
  "Schedule a listening session for new demo submissions.",
  "Reach out to a radio DJ and pitch your latest release.",
  "Update your label's EPK with recent achievements.",
  "Send a thank you note to your top supporters.",
  "Research new DNB artists for potential signings.",
  "Plan a social media campaign for your next release.",
  "Check in with your mastering engineer about upcoming projects.",
  "Organize your release calendar for the next quarter.",
  "Review your label's streaming analytics.",
  "Contact a graphic designer for fresh cover art ideas.",
  "Pitch your latest track to Spotify playlist curators.",
  "Write a press release for your next single.",
  "Connect with a promoter about label showcase events.",
  "Update your label's website with new content.",
  "Send out promo packs to key tastemakers.",
  "Follow up with artists about pending contracts.",
  "Review your label's royalty statements.",
  "Plan a remix contest for your latest release.",
  "Reach out to blogs for coverage of your artists.",
  "Schedule a team meeting to brainstorm new ideas.",
  "Check your label's inbox for demo submissions.",
  "Update your mailing list with new subscribers.",
  "Share a behind-the-scenes video on social media.",
  "Contact a videographer for a music video project.",
  "Review your label's branding and visual identity.",
  "Send out a monthly newsletter to your fans.",
  "Organize a virtual listening party for your next EP.",
  "Reach out to international distributors.",
  "Check in with artists about their upcoming projects.",
  "Plan a merchandise drop for your label.",
  "Update your SoundCloud and Bandcamp profiles.",
  "Research new trends in the DNB scene.",
  "Connect with other label managers for collaboration.",
  "Review your label's financial goals.",
  "Schedule a feedback session with your artists.",
  "Create a content calendar for your social media.",
  "Reach out to a photographer for artist promo shots.",
  "Plan a label takeover on a popular DNB channel.",
  "Update your artist roster on your website.",
  "Send out digital download codes to fans.",
  "Check your label's YouTube analytics.",
  "Organize a Q&A session with your artists.",
  "Plan a charity event or fundraiser.",
  "Review your label's submission guidelines.",
  "Reach out to vinyl pressing plants for quotes.",
  "Update your label's press kit.",
  "Contact a booking agent for tour opportunities.",
  "Plan a collaborative release with another label.",
  "Check in with your PR agency about campaign results.",
  "Celebrate a recent success with your team!",
  // --- 50 more DNB label manager tips ---
  "Host a live stream to showcase your label's artists.",
  "Reach out to a podcast for a guest mix opportunity.",
  "Update your artist contracts with the latest terms.",
  "Create a playlist featuring your label's back catalog.",
  "Send a survey to your fans for feedback.",
  "Plan a special release for your label's anniversary.",
  "Check in with your distributor about upcoming releases.",
  "Organize a remix swap between your artists.",
  "Review your label's social media engagement stats.",
  "Contact a music journalist for an interview feature.",
  "Update your label's YouTube channel with new content.",
  "Plan a vinyl reissue of a classic release.",
  "Reach out to a festival about label stage hosting.",
  "Create a press kit for your top artist.",
  "Send a birthday message to an artist on your roster.",
  "Review your label's digital ad campaigns.",
  "Plan a collaborative playlist with another label.",
  "Check your label's sync licensing opportunities.",
  "Organize a feedback session for demo submissions.",
  "Update your label's logo and branding assets.",
  "Reach out to a club for a label night event.",
  "Create a highlight reel of your label's achievements.",
  "Send a thank you package to your top DJs.",
  "Review your label's merchandise sales.",
  "Plan a limited edition release for collectors.",
  "Update your artist bios with recent milestones.",
  "Contact a mastering engineer for a special project.",
  "Organize a listening party for your staff.",
  "Check in with your web developer about site updates.",
  "Plan a social media takeover by one of your artists.",
  "Send out a press release for a charting track.",
  "Review your label's playlist placements.",
  "Reach out to a visual artist for cover collaborations.",
  "Update your label's EPK with new press quotes.",
  "Plan a series of artist interviews for your blog.",
  "Check your label's analytics for top-performing tracks.",
  "Organize a contest for fans to remix a label track.",
  "Send a care package to an artist on tour.",
  "Review your label's YouTube monetization.",
  "Plan a charity compilation with your artists.",
  "Update your label's FAQ for demo submissions.",
  "Contact a PR firm for a new campaign.",
  "Organize a virtual meet-and-greet for fans.",
  "Review your label's international reach.",
  "Plan a series of educational posts for your audience.",
  "Send out a thank you email to your mailing list.",
  "Check in with your accountant about royalties.",
  "Update your label's press contacts list.",
  "Plan a behind-the-scenes documentary.",
  "Celebrate a milestone with a special release party!"
];

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FaHome,
    description: "Overview & Analytics"
  },
  {
    name: "Instagram",
    href: "/admin/instagram",
    icon: FaInstagram,
    description: "Message Management"
  },
  {
    name: "Demo Distribution",
    href: "/admin/demo",
    icon: FaMusic,
    description: "Upload & Send Demos"
  },
  {
    name: "Newsletter",
    href: "/admin/newsletter",
    icon: FaNewspaper,
    description: "Subscriber Management"
  },
  {
    name: "Influencers",
    href: "/admin/influencers",
    icon: FaStar,
    description: "Influencer Database"
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: FaUsers,
    description: "User Management"
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: FaChartLine,
    description: "Reports & Stats"
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: FaCog,
    description: "System Configuration"
  }
];

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
  const { data: session } = useSession();
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard/stats');
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
    // Set random productivity message
    const randomIndex = Math.floor(Math.random() * productivityMessages.length);
    setCurrentMessage(productivityMessages[randomIndex]);

    // Fetch dashboard data
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

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading dashboard</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-6 py-24 flex items-center justify-center">
        <div className="text-white text-xl">No data available</div>
      </div>
    );
  }

  const { stats, recentActivity } = dashboardData;

  const dashboardStats = [
    {
      name: "Total Subscribers",
      value: formatNumber(stats.totalSubscribers),
      change: `${stats.growthPercentage >= 0 ? '+' : ''}${stats.growthPercentage}%`,
      changeType: stats.growthPercentage >= 0 ? "positive" : "negative",
      icon: FaUsers,
      color: "green"
    },
    {
      name: "Active Subscribers",
      value: formatNumber(stats.activeSubscribers),
      change: `${Math.round((stats.activeSubscribers / stats.totalSubscribers) * 100)}%`,
      changeType: "positive",
      icon: FaEnvelopeOpen,
      color: "blue"
    },
    {
      name: "Email Campaigns",
      value: formatNumber(stats.totalCampaigns),
      change: `${stats.recentEmails} sent`,
      changeType: "positive",
      icon: FaEnvelope,
      color: "purple"
    },
    {
      name: "Success Rate",
      value: stats.recentEmails > 0 ? `${Math.round((stats.successfulEmails / stats.recentEmails) * 100)}%` : "0%",
      change: `${stats.failedEmails} failed`,
      changeType: stats.failedEmails > 0 ? "negative" : "positive",
      icon: FaTimes,
      color: "yellow"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-24 space-y-8">
      {/* Navigation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Admin Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.href)}
                className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-all duration-200 border border-purple-500/30 text-center group"
              >
                <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
                <div className="text-xs font-medium text-white">{item.name}</div>
                <div className="text-xs text-gray-400 mt-1">{item.description}</div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-green-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <FaSyringe className="w-10 h-10 text-green-400" />
              <FaShieldAlt className="w-5 h-5 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
              <p className="text-gray-400">Welcome back, {session?.user?.name || "Admin"}!</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Here&apos;s what&apos;s happening with your newsletter today.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaShieldAlt className="w-4 h-4" />
                <span>System is running smoothly</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
              >
                <FaEnvelope className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">
                  {formatNumber(stats.recentEmails)}
                </div>
                <div className="text-xs text-gray-400">Emails Today</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
              >
                <FaUsers className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-300">
                  {formatNumber(stats.recentSubscribers)}
                </div>
                <div className="text-xs text-gray-400">New This Week</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Mission Section */}
      {currentMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl shadow-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-300 text-lg">💡</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Today&apos;s Mission</h2>
              <p className="text-sm text-blue-300">Your daily productivity goal</p>
            </div>
          </div>
          <p className="text-white text-lg leading-relaxed">{currentMessage}</p>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: "text-green-400 border-green-500/30 bg-green-900/30",
            purple: "text-purple-400 border-purple-500/30 bg-purple-900/30",
            blue: "text-blue-400 border-blue-500/30 bg-blue-900/30",
            yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-900/30"
          };
          
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-black/50 backdrop-blur-sm border rounded-xl p-6 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-75" />
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs opacity-75 ml-2">from last period</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-green-500/20">
            <h2 className="text-xl font-bold text-white">Recent Subscribers</h2>
            <p className="text-sm text-gray-400">Latest newsletter signups</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.email}</span>
                      {activity.name && ` (${activity.name})`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</p>
                      {activity.category && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(activity.category.color)}`}>
                          {activity.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <p className="text-sm text-gray-400">Common admin tasks</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/admin/newsletter')}
                className="w-full text-left p-4 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-colors border border-purple-500/30"
              >
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-medium text-white">Send Newsletter</div>
                    <div className="text-sm text-gray-400">Create and send email campaign</div>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/admin/newsletter')}
                className="w-full text-left p-4 rounded-lg bg-green-900/30 hover:bg-green-900/50 transition-colors border border-green-500/30"
              >
                <div className="flex items-center gap-3">
                  <FaUsers className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">Manage Subscribers</div>
                    <div className="text-sm text-gray-400">View and edit subscriber list</div>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/admin/analytics')}
                className="w-full text-left p-4 rounded-lg bg-yellow-900/30 hover:bg-yellow-900/50 transition-colors border border-yellow-500/30"
              >
                <div className="flex items-center gap-3">
                  <FaChartLine className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="font-medium text-white">View Analytics</div>
                    <div className="text-sm text-gray-400">Check detailed reports</div>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
