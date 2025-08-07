'use client';

import { useState, useEffect, useCallback } from 'react';
 
import InfluencersHeader from "../../components/admin/influencers/InfluencersHeader";
import InfluencerStats from "../../components/admin/influencers/InfluencerStats";
import InfluencerFilters from "../../components/admin/influencers/InfluencerFilters";
import InfluencersTable from "../../components/admin/influencers/InfluencersTable";
import EditInfluencerModal, { Influencer as InfluencerForModal } from "../../components/admin/influencers/EditInfluencerModal";

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

// removed Category type; no manual sync UI

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<InfluencerForModal | null>(null);
  

  const fetchInfluencers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      params.append('includeStats', '1');
      const response = await fetch(`/api/admin/influencers?${params}` , {
        cache: 'no-store',
        headers: { 'cache-control': 'no-cache' }
      });
      if (!response.ok) throw new Error('Failed to fetch influencers');
      
      const data = await response.json();
      setInfluencers(Array.isArray(data) ? data : (data?.influencers || []));
    } catch (error) {
      setError('Failed to load influencers');
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  // syncing is automatic via category/subscriber APIs

  // legacy helpers removed

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
    <div className="container mx-auto px-6 py-8 text-white">
      <InfluencersHeader onAdd={() => alert('Add influencer functionality coming soon!')} />
      <InfluencerStats
        total={influencers.length}
        active={influencers.filter(i => i.status === 'ACTIVE').length}
        vip={influencers.filter(i => i.priority === 'VIP').length}
        synced={influencers.filter(i => i.subscriber).length}
      />

      <InfluencerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {filteredInfluencers.length > 0 ? (
        <InfluencersTable
          influencers={filteredInfluencers}
          onEdit={(infl) => { setEditing(infl as unknown as InfluencerForModal); setEditOpen(true); }}
          onDelete={(id) => confirm('Delete influencer?') && alert(`Delete ${id} coming soon`)}
        />
      ) : (
        <div className="bg-black/40 border border-purple-500/20 rounded-xl p-8 text-center">
          <div className="text-xl text-gray-300">No influencers yet</div>
        </div>
      )}

      <EditInfluencerModal
        open={editOpen}
        influencer={editing}
        onClose={() => setEditOpen(false)}
        onSaved={(updated) => {
          setInfluencers((prev) => prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)));
        }}
      />

    </div>
  );
} 