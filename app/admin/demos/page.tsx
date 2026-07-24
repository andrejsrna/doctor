"use client";

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast'
import { motion } from 'framer-motion';
import {
  FaMusic,
  FaSearch,
  FaFilter,
  FaThumbsUp,
  FaThumbsDown,
  FaTimes,
  FaTrash,
  FaShareAlt,
  FaEnvelope,
} from 'react-icons/fa';

interface DemoSubmission {
  id: string;
  email: string;
  artistName: string;
  genre: string;
  trackLink: string;
  status: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
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

interface NewsletterCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
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
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Multi-select + share
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({
    subject: '',
    message: '',
    recipients: '',
    newsletterCategory: '',
  });
  const [newsletterCategories, setNewsletterCategories] = useState<NewsletterCategory[]>([]);
  const [sending, setSending] = useState(false);

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

  // Clear selection when page/filter changes
  useEffect(() => {
    setSelectedIds(new Set());
  }, [pagination.page, statusFilter, search]);

  const handleUpdateSubmission = async (id: string, status: 'APPROVED' | 'REJECTED' | 'ARCHIVED', notes?: string) => {
    setUpdating(true);
    toast.loading('Updating submission...');
    try {
      const response = await fetch('/api/admin/demos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, notes }),
      });

      if (response.ok) {
        toast.dismiss();
        toast.success(`Submission ${status.toLowerCase()} and email sent.`);
        fetchSubmissions();
        if (status === 'REJECTED') {
          setShowRejectionModal(false);
          setRejectionNotes('');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update submission');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleApprove = (submission: DemoSubmission) => {
    if (window.confirm(`Are you sure you want to approve the demo from ${submission.artistName}? An email will be sent.`)) {
      handleUpdateSubmission(submission.id, 'APPROVED');
    }
  };

  const handleReject = () => {
    if (selectedSubmission) {
      handleUpdateSubmission(selectedSubmission.id, 'REJECTED', rejectionNotes);
    }
  };

  const handleArchive = (submission: DemoSubmission) => {
    if (window.confirm(`Are you sure you want to archive the demo from ${submission.artistName}? This will hide it from the main list.`)) {
      handleUpdateSubmission(submission.id, 'ARCHIVED');
    }
  };

  const openRejectionModal = (submission: DemoSubmission) => {
    setSelectedSubmission(submission);
    setRejectionNotes(submission.notes || '');
    setShowRejectionModal(true);
  };

  // --- Multi-select handlers ---
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submissions.map(s => s.id)));
    }
  };

  const openShareModal = async () => {
    const selected = submissions.filter(s => selectedIds.has(s.id));
    if (selected.length === 0) return;

    // Prefill subject/message
    const artistNames = selected.map(s => s.artistName).join(', ');
    setShareData({
      subject: `New demo${selected.length > 1 ? 's' : ''} from ${artistNames.substring(0, 60)}${artistNames.length > 60 ? '…' : ''}`,
      message: `Hello {name},\n\nWe have ${selected.length > 1 ? `${selected.length} tracks` : 'a track'} we'd love you to check out:\n\n${selected.map(s => `Artist: ${s.artistName}\nTrack: ${s.trackLink}`).join('\n\n')}\n\nLet us know what you think.\n\nBest regards,\nDnB Doctor Team`,
      recipients: '',
      newsletterCategory: '',
    });

    // Fetch newsletter categories
    try {
      const response = await fetch(`/api/admin/newsletter/categories?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        setNewsletterCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching newsletter categories:', error);
    }

    setShowShareModal(true);
  };

  const handleShareSend = async () => {
    const selected = submissions.filter(s => selectedIds.has(s.id));
    if (selected.length === 0) return;

    setSending(true);
    try {
      // Map demo submissions to DemoFile format expected by send-demos API
      const files = selected.map(s => ({
        id: s.id,
        name: `${s.artistName} — ${s.genre}`,
        size: 0,
        type: 'audio',
        fileCategory: 'audio' as const,
        path: s.trackLink,
        uploadedAt: s.createdAt,
      }));

      const response = await fetch('/api/admin/send-demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files,
          emailData: shareData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Demos shared! ${result.message || ''}`);
        setShowShareModal(false);
        setSelectedIds(new Set());
      } else {
        const error = await response.json();
        toast.error(`Share failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Error sharing demos');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300',
      REVIEWED: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
      APPROVED: 'bg-green-900/30 border-green-500/30 text-green-300',
      REJECTED: 'bg-red-900/30 border-red-500/30 text-red-300',
      ARCHIVED: 'bg-gray-900/30 border-gray-500/30 text-gray-400',
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
                {selectedIds.size > 0 && (
                  <span className="text-purple-300"> • {selectedIds.size} selected</span>
                )}
              </p>
            </div>
          </div>
          {selectedIds.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openShareModal}
              className="px-5 py-3 bg-purple-900/60 text-purple-200 rounded-lg hover:bg-purple-900/80 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <FaShareAlt className="w-4 h-4" />
              Share Selected ({selectedIds.size})
            </motion.button>
          )}
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
              <option value="ARCHIVED">Archived</option>
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
            {/* Select All bar */}
            <div className="flex items-center gap-3 pb-2 border-b border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === submissions.length && submissions.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-600 bg-black/50 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-400">Select All</span>
              </label>
            </div>

            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-black/30 border rounded-lg p-6 transition-all duration-200 ${
                  selectedIds.has(submission.id)
                    ? 'border-purple-500/50 bg-purple-900/10'
                    : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(submission.id)}
                      onChange={() => toggleSelect(submission.id)}
                      className="w-4 h-4 mt-1 rounded border-gray-600 bg-black/50 text-purple-600 focus:ring-purple-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
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
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {submission.status !== 'APPROVED' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleApprove(submission)}
                        disabled={updating}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Approve"
                      >
                        <FaThumbsUp className="w-4 h-4" />
                      </motion.button>
                    )}
                    {submission.status !== 'REJECTED' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openRejectionModal(submission)}
                        disabled={updating}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Reject"
                      >
                        <FaThumbsDown className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleArchive(submission)}
                      disabled={updating}
                      className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-900/30 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Archive"
                    >
                      <FaTrash className="w-4 h-4" />
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

      {/* Rejection Modal */}
      {showRejectionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Reject Submission: {selectedSubmission.artistName}
              </h3>
              <button onClick={() => setShowRejectionModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Rejection Notes (optional, will be sent to the artist)
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide constructive feedback..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRejectionModal(false)}
                className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReject}
                disabled={updating}
                className="px-6 py-3 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-300"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaThumbsDown className="w-4 h-4" />
                    Confirm Rejection
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Selected Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-6 w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Share Selected Demos</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedIds.size} demo{selectedIds.size !== 1 ? 's' : ''} selected — track links will be included in the email
                </p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Selected demos preview */}
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-xs text-purple-300 mb-2">Selected demos:</p>
                <div className="space-y-1">
                  {submissions.filter(s => selectedIds.has(s.id)).map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-sm">
                      <FaMusic className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="text-white">{s.artistName}</span>
                      <a href={s.trackLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 truncate text-xs">
                        {s.trackLink}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution method */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Distribution Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="share-distribution"
                      value="manual"
                      checked={!shareData.newsletterCategory}
                      onChange={() => setShareData(prev => ({ ...prev, newsletterCategory: '' }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-white">Manual Email List</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="share-distribution"
                      value="newsletter"
                      checked={!!shareData.newsletterCategory}
                      onChange={() => setShareData(prev => ({ ...prev, newsletterCategory: prev.newsletterCategory || newsletterCategories[0]?.id || '' }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-white">Newsletter Category</span>
                  </label>
                </div>
              </div>

              {/* Recipients */}
              {!shareData.newsletterCategory ? (
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Recipients (comma-separated)
                  </label>
                  <textarea
                    value={shareData.recipients}
                    onChange={(e) => setShareData(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="email1@example.com, email2@example.com"
                    rows={3}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Newsletter Category
                  </label>
                  <select
                    value={shareData.newsletterCategory}
                    onChange={(e) => setShareData(prev => ({ ...prev, newsletterCategory: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {newsletterCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.subscriberCount} subscribers)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={shareData.subject}
                  onChange={(e) => setShareData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Message
                </label>
                <textarea
                  value={shareData.message}
                  onChange={(e) => setShareData(prev => ({ ...prev, message: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Placeholders: {'{name}'}, {'{email}'}, {'{artist}'}, {'{track}'}, {'{category}'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2.5 text-gray-300 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShareSend}
                disabled={sending || !shareData.subject || !shareData.message || (!shareData.recipients && !shareData.newsletterCategory)}
                className="px-5 py-2.5 bg-green-900/60 text-green-200 rounded-lg hover:bg-green-900/80 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                <FaEnvelope className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
