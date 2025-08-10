"use client";

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast'
import { motion } from 'framer-motion';
import { 
  FaMusic, 
  FaCheck, 
  FaSearch,
  FaFilter,
  FaEdit
} from 'react-icons/fa';

interface DemoSubmission {
  id: string;
  email: string;
  artistName: string;
  genre: string;
  trackLink: string;
  status: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function DemosPage() {
  const [submissions, setSubmissions] = useState<DemoSubmission[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<DemoSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/demos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateSubmission = async (id: string, status: string, notes?: string) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/admin/demos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, notes }),
      });

      if (response.ok) {
        await fetchSubmissions();
        setShowModal(false);
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Update failed')
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300',
      REVIEWED: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
      APPROVED: 'bg-green-900/30 border-green-500/30 text-green-300',
      REJECTED: 'bg-red-900/30 border-red-500/30 text-red-300',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FaMusic className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Demo Submissions</h1>
              <p className="text-gray-400">
                {pagination.total} total submissions
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by artist, email, or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8">
            <FaMusic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No demo submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/30 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-white">
                        {submission.artistName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-white">{submission.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Genre</p>
                        <p className="text-white">{submission.genre}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-400">Track Link</p>
                        <a 
                          href={submission.trackLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 break-all"
                        >
                          {submission.trackLink}
                        </a>
                      </div>
                    </div>
                    
                    {submission.notes && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm">Notes</p>
                        <p className="text-white text-sm">{submission.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 text-xs text-gray-500">
                      Submitted: {formatDate(submission.createdAt)}
                      {submission.updatedAt !== submission.createdAt && (
                        <span className="ml-4">
                          Updated: {formatDate(submission.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                    >
                      <FaEdit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </motion.button>
            
            <span className="text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </motion.button>
          </div>
        )}
      </motion.div>

      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Update Demo Submission
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => setSelectedSubmission(prev => prev ? { ...prev, status: e.target.value as DemoSubmission['status'] } : null)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={selectedSubmission.notes || ''}
                  onChange={(e) => setSelectedSubmission(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  rows={4}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add notes about this submission..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowModal(false);
                  setSelectedSubmission(null);
                }}
                className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateSubmission(selectedSubmission.id, selectedSubmission.status, selectedSubmission.notes)}
                disabled={updating}
                className="px-6 py-3 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-300"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    Update
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
