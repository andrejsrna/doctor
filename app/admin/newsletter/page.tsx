"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaEnvelope, FaUsers, FaTrash, FaEdit, FaPlus, FaSearch, FaFilter, FaTags, FaCog } from "react-icons/fa";

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

interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    template: ""
  });
  const [newSubscriber, setNewSubscriber] = useState({
    email: "",
    name: "",
    tags: "",
    category: "",
    notes: ""
  });

  const newsletterTemplates: NewsletterTemplate[] = [
    {
      id: "1",
      name: "New Release Announcement",
      subject: "🎵 New DNB Doctor Release: {artist} - {track}",
      body: "Hi {name},\n\nWe're excited to share our latest release with you!\n\n🎵 {artist} - {track}\n\nListen now and let us know what you think!\n\nBest regards,\nDNB Doctor Team",
      category: "Releases"
    },
    {
      id: "2",
      name: "Weekly Newsletter",
      subject: "📰 DNB Doctor Weekly Update",
      body: "Hi {name},\n\nHere's what's new this week:\n\n• Latest releases\n• Artist spotlights\n• Industry news\n\nStay tuned for more!\n\nBest regards,\nDNB Doctor Team",
      category: "Newsletter"
    },
    {
      id: "3",
      name: "Event Announcement",
      subject: "🎉 Upcoming Event: {event_name}",
      body: "Hi {name},\n\nDon't miss our upcoming event!\n\n🎉 {event_name}\n📅 {date}\n📍 {location}\n\nGet your tickets now!\n\nBest regards,\nDNB Doctor Team",
      category: "Events"
    },
    {
      id: "4",
      name: "Custom",
      subject: "",
      body: "",
      category: "Custom"
    }
  ];

  useEffect(() => {
    fetchSubscribers();
    fetchCategories();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/newsletter/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriber.email) return;

    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newSubscriber.email,
          name: newSubscriber.name,
          tags: newSubscriber.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          category: newSubscriber.category,
          notes: newSubscriber.notes
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewSubscriber({ email: "", name: "", tags: "", category: "", notes: "" });
        fetchSubscribers();
      } else {
        const error = await response.json();
        alert(`Error adding subscriber: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
      alert('Error adding subscriber');
    }
  };

  const handleEditSubscriber = async () => {
    if (!selectedSubscriber) return;

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${selectedSubscriber.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedSubscriber.name,
          tags: selectedSubscriber.tags,
          categoryId: selectedSubscriber.categoryId,
          notes: selectedSubscriber.notes,
          status: selectedSubscriber.status
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedSubscriber(null);
        fetchSubscribers();
      } else {
        const error = await response.json();
        alert(`Error updating subscriber: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
      alert('Error updating subscriber');
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${subscriberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubscribers();
      } else {
        const error = await response.json();
        alert(`Error deleting subscriber: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Error deleting subscriber');
    }
  };

  const handleSendNewsletter = async () => {
    if (selectedSubscribers.length === 0) return;

    setSending(true);

    try {
      const selectedSubs = subscribers.filter(sub => selectedSubscribers.includes(sub.id));
      
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscribers: selectedSubs,
          emailData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Newsletter sent successfully! ${result.message}`);
        setShowEmailModal(false);
        setSelectedSubscribers([]);
      } else {
        const error = await response.json();
        alert(`Error sending newsletter: ${error.error}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      alert('Error sending newsletter');
    } finally {
      setSending(false);
    }
  };

  const handleSubscriberSelect = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
    }
  };

  const handleEditSubscriberClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowEditModal(true);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || subscriber.status === filterStatus;
    const matchesCategory = filterCategory === "all" || subscriber.categoryId === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-900/30 border-green-500/30 text-green-300',
      UNSUBSCRIBED: 'bg-red-900/30 border-red-500/30 text-red-300',
      PENDING: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300'
    };
    
    return `px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors] || colors.PENDING}`;
  };

  const getCategoryBadge = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    const colorMap = {
      purple: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
      green: 'bg-green-900/30 border-green-500/30 text-green-300',
      blue: 'bg-blue-900/30 border border-blue-500/30 text-blue-300',
      orange: 'bg-orange-900/30 border-orange-500/30 text-orange-300',
      red: 'bg-red-900/30 border-red-500/30 text-red-300'
    };
    return `px-2 py-1 rounded-full text-xs border ${colorMap[category.color as keyof typeof colorMap] || colorMap.purple}`;
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    categories.forEach(cat => {
      stats[cat.id] = subscribers.filter(sub => sub.categoryId === cat.id).length;
    });
    return stats;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-green-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <FaNewspaper className="w-10 h-10 text-purple-400" />
              <FaEnvelope className="w-5 h-5 text-green-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Newsletter Management</h1>
              <p className="text-gray-400">Manage subscribers and send newsletters</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
            >
              <FaUsers className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-300">{subscribers.length}</div>
              <div className="text-xs text-gray-400">Total Subscribers</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
            >
              <FaEnvelope className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-300">{subscribers.filter(s => s.status === 'ACTIVE').length}</div>
              <div className="text-xs text-gray-400">Active Subscribers</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center"
            >
              <FaTags className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-300">{categories.length}</div>
              <div className="text-xs text-gray-400">Categories</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 text-center"
            >
              <FaEnvelope className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-300">{selectedSubscribers.length}</div>
              <div className="text-xs text-gray-400">Selected</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Category Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => {
            const stats = getCategoryStats();
            const count = stats[category.id] || 0;
            return (
              <div key={category.id} className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg bg-${category.color}-900/50 border border-${category.color}-500/30`}>
                  {count}
                </div>
                <div className="text-sm font-medium text-white">{category.name}</div>
                <div className="text-xs text-gray-400">{category.description}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl shadow-2xl p-6"
      >
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FaTags className="w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 transition-all duration-200 flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Subscriber
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmailModal(true)}
            className="px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70 transition-all duration-200 flex items-center gap-2"
          >
            <FaCog className="w-4 h-4" />
            Manage Categories
          </motion.button>

          {selectedSubscribers.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 transition-all duration-200 flex items-center gap-2"
            >
              <FaEnvelope className="w-4 h-4" />
              Send Newsletter
            </motion.button>
          )}
        </div>

        {/* Subscribers List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading subscribers...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No subscribers found</p>
              <p className="text-sm text-gray-500">Add subscribers to get started</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-gray-500/30">
                <input
                  type="checkbox"
                  checked={selectedSubscribers.length === filteredSubscribers.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-400">
                  {selectedSubscribers.length} of {filteredSubscribers.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {filteredSubscribers.map((subscriber) => (
                  <motion.div
                    key={subscriber.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedSubscribers.includes(subscriber.id)
                        ? "bg-purple-900/30 border-purple-500/50"
                        : "bg-black/30 border-gray-500/30 hover:border-purple-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => handleSubscriberSelect(subscriber.id)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="w-4 h-4 text-purple-400" />
                          <div>
                            <h3 className="font-medium text-white">{subscriber.email}</h3>
                            <p className="text-sm text-gray-400">
                              {subscriber.name && `${subscriber.name} • `}
                              Subscribed {formatDate(subscriber.subscribedAt)}
                              {subscriber.source && ` • via ${subscriber.source}`}
                              {subscriber.emailCount && ` • ${subscriber.emailCount} emails sent`}
                            </p>
                            {subscriber.notes && (
                              <p className="text-xs text-gray-500 mt-1 italic">&quot;{subscriber.notes}&quot;</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={getStatusBadge(subscriber.status)}>
                          {subscriber.status}
                        </span>
                        
                        {subscriber.category && (
                          <span className={getCategoryBadge(subscriber.category.id)}>
                            {subscriber.category.name}
                          </span>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditSubscriberClick(subscriber)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <FaEdit className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Add Subscriber</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Category
                </label>
                <select
                  value={newSubscriber.category}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newSubscriber.tags}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="newsletter, vip, promoter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newSubscriber.notes}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Additional notes about this subscriber..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddSubscriber}
                disabled={!newSubscriber.email}
                className="px-6 py-3 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Add Subscriber
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Subscriber Modal */}
      {showEditModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Edit Subscriber</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedSubscriber.email}
                  disabled
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedSubscriber.name ?? ""}
                  onChange={(e) => setSelectedSubscriber(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedSubscriber.status}
                  onChange={(e) => setSelectedSubscriber(prev => prev ? { ...prev, status: e.target.value as 'ACTIVE' | 'PENDING' | 'UNSUBSCRIBED' } : null)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNSUBSCRIBED">Unsubscribed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedSubscriber.categoryId || ""}
                  onChange={(e) => setSelectedSubscriber(prev => prev ? { ...prev, categoryId: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">No category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={selectedSubscriber.tags?.join(', ') || ""}
                  onChange={(e) => setSelectedSubscriber(prev => prev ? { ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) } : null)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="newsletter, vip, promoter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={selectedSubscriber.notes || ""}
                  onChange={(e) => setSelectedSubscriber(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Additional notes about this subscriber..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditSubscriber}
                className="px-6 py-3 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70 transition-all duration-200 flex items-center gap-2"
              >
                <FaEdit className="w-4 h-4" />
                Update Subscriber
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Send Newsletter Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Newsletter</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Email Template
                </label>
                <select
                  onChange={(e) => {
                    const template = newsletterTemplates.find(t => t.id === e.target.value);
                    if (template) {
                      setEmailData({
                        subject: template.subject,
                        message: template.body,
                        template: template.id
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select template...</option>
                  {newsletterTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Message
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-300 mb-2">Sending to {selectedSubscribers.length} subscribers</p>
                <p className="text-xs text-gray-400">
                  Use {'{name}'} for subscriber name, {'{email}'} for email address
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendNewsletter}
                disabled={sending || !emailData.subject || !emailData.message}
                className="px-6 py-3 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                <FaEnvelope className="w-4 h-4" />
                {sending ? "Sending..." : "Send Newsletter"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 