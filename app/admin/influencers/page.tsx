'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaUserPlus, FaUserEdit, FaUserTimes, FaSync, FaSearch, FaInstagram, FaYoutube, FaTiktok, FaGlobe, FaEnvelope } from 'react-icons/fa';

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
}

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [syncLoading, setSyncLoading] = useState(false);

  const fetchInfluencers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const response = await fetch(`/api/admin/influencers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch influencers');
      
      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      setError('Failed to load influencers');
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/newsletter/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchInfluencers();
    fetchCategories();
  }, [fetchInfluencers, fetchCategories]);

  const handleSyncCategory = async (categoryId: string) => {
    try {
      setSyncLoading(true);
      const response = await fetch('/api/admin/influencers/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, autoSync: true }),
      });

      if (!response.ok) throw new Error('Failed to sync influencers');
      
      const result = await response.json();
      alert(`Sync completed! Created: ${result.stats.created}, Updated: ${result.stats.updated}, Skipped: ${result.stats.skipped}`);
      fetchInfluencers();
    } catch (error) {
      alert('Failed to sync influencers');
      console.error('Error syncing influencers:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      CONTACTED: 'bg-blue-100 text-blue-800',
      RESPONDED: 'bg-yellow-100 text-yellow-800',
      COLLABORATING: 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>{status}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      VIP: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>{priority}</span>;
  };

  const getPlatformIcon = (platform: string | null) => {
    if (!platform) return <FaGlobe className="w-4 h-4" />;
    
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      instagram: FaInstagram,
      youtube: FaYoutube,
      tiktok: FaTiktok,
    };
    
    const Icon = icons[platform.toLowerCase()] || FaGlobe;
    return <Icon className="w-4 h-4" />;
  };

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = !searchTerm || 
      influencer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.handle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || influencer.status === statusFilter;
    const matchesCategory = !categoryFilter || influencer.category === categoryFilter;
    const matchesPriority = !priorityFilter || influencer.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={fetchInfluencers}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencer Database</h1>
          <p className="text-gray-600 mt-2">Manage influencers and sync with newsletter subscribers</p>
        </div>
        <button
          onClick={() => alert('Add influencer functionality coming soon!')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaUserPlus />
          Add Influencer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Influencers</h3>
          <p className="text-3xl font-bold text-blue-600">{influencers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Active</h3>
          <p className="text-3xl font-bold text-green-600">
            {influencers.filter(i => i.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">VIP</h3>
          <p className="text-3xl font-bold text-purple-600">
            {influencers.filter(i => i.priority === 'VIP').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Synced</h3>
          <p className="text-3xl font-bold text-orange-600">
            {influencers.filter(i => i.subscriber).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CONTACTED">Contacted</option>
                <option value="RESPONDED">Responded</option>
                <option value="COLLABORATING">Collaborating</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="DJ">DJ</option>
                <option value="Producer">Producer</option>
                <option value="Promoter">Promoter</option>
                <option value="Blogger">Blogger</option>
                <option value="Radio">Radio</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Influencer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInfluencers.map((influencer) => (
                <tr key={influencer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{influencer.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{influencer.email}</div>
                      {influencer.handle && (
                        <div className="text-sm text-gray-400">@{influencer.handle}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(influencer.platform)}
                      <span className="text-sm text-gray-900">{influencer.platform || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {influencer.followers ? `${influencer.followers.toLocaleString()}` : 'N/A'}
                    </div>
                    {influencer.engagement && (
                      <div className="text-sm text-gray-500">{influencer.engagement}% engagement</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(influencer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(influencer.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {influencer.subscriber ? (
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-green-500" />
                        <span className="text-sm text-gray-900">
                          {influencer.subscriber.category?.name || 'Subscriber'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not synced</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Edit influencer functionality coming soon!')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaUserEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this influencer?')) {
                            // Handle delete
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaUserTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <span className="text-sm text-gray-500">{category.subscriberCount} subscribers</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <button
                onClick={() => handleSyncCategory(category.id)}
                disabled={syncLoading}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {syncLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaSync />
                )}
                Sync to Influencers
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 