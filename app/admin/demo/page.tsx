"use client";

import { useState, useRef, useEffect } from "react";
import toast from 'react-hot-toast'
import { useDebounce } from "../../hooks/useDebounce";
import { motion } from "framer-motion";
import { FaMusic, FaUpload, FaEnvelope, FaTrash, FaPlay, FaImage, FaLink, FaClock } from "react-icons/fa";

interface DemoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  fileCategory?: 'audio' | 'image';
  path?: string;
  url?: string;
  duration?: number;
  uploadedAt: string;
}

interface NewsletterCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

export default function DemoPage() {
  const [files, setFiles] = useState<DemoFile[]>([]);
  // No selection needed: always send all uploaded files
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    recipients: "",
    newsletterCategory: "",
    wpPostId: ""
  });
  const [newsletterCategories, setNewsletterCategories] = useState<NewsletterCategory[]>([]);
  const [releaseQuery, setReleaseQuery] = useState("");
  const debouncedReleaseQuery = useDebounce(releaseQuery, 300);
  const [releaseOptions, setReleaseOptions] = useState<Array<{ id: string; title: string; wpId?: number; coverImageUrl?: string | null }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sent demos history from DB
  const [sentDemos, setSentDemos] = useState<Array<{
    id: string;
    token: string;
    recipientEmail: string;
    subject: string;
    createdAt: string;
    files: Array<{ id: string; name: string; path: string }>;
  }>>([]);
  const [loadingSent, setLoadingSent] = useState(false);

  const fetchSentDemos = async () => {
    setLoadingSent(true);
    try {
      const response = await fetch('/api/admin/feedback?limit=200', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const allItems = data.items || [];

        // Deduplicate by files signature — same files = same demo batch
        const seen = new Map<string, typeof sentDemos[number]>();
        for (const item of allItems) {
          const files = Array.isArray(item.files) ? item.files : [];
          // Build a stable signature from sorted file paths
          const sig = files.map((f: { path: string }) => f.path).sort().join('|');
          if (!sig) continue; // skip entries with no files
          if (!seen.has(sig)) {
            seen.set(sig, { ...item, files });
          }
        }
        setSentDemos(Array.from(seen.values()));
      }
    } catch (error) {
      console.error('Error fetching sent demos:', error);
    } finally {
      setLoadingSent(false);
    }
  };

  useEffect(() => {
    fetchSentDemos();
  }, []);

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  // default template inlined in effect

  // Removed initial category grid, fetch when modal opens only

  useEffect(() => {
    if (showEmailModal) fetchNewsletterCategories();
  }, [showEmailModal]);

  useEffect(() => {
    if (showEmailModal) {
      setEmailData(prev => ({
        subject: prev.subject || "New track for your consideration {name}",
        message: prev.message || "Hello {name},\n\nWe have a new track we’d love you to check out.\n\nArtist: {artist}\nTrack: {track}\n\nLet us know what you think.\n\nBest regards,\nDnB Doctor Team",
        recipients: prev.recipients,
        newsletterCategory: prev.newsletterCategory,
        wpPostId: prev.wpPostId
      }));
    }
  }, [showEmailModal]);

  const fetchNewsletterCategories = async () => {
    try {
      const response = await fetch(`/api/admin/newsletter/categories?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNewsletterCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching newsletter categories:', error);
    }
  };

  const searchReleases = async (q: string) => {
    try {
      const res = await fetch(`/api/releases?search=${encodeURIComponent(q)}&limit=10`, { cache: 'no-store' });
      if (res.ok) {
        const data: { items: Array<{ id: string; title: string; wpId?: number; coverImageUrl?: string | null }> } = await res.json();
        setReleaseOptions(data.items.map((r) => ({ id: r.id, title: r.title, wpId: r.wpId, coverImageUrl: r.coverImageUrl })));
      }
    } catch (e) {
      console.error('Release search error', e);
    }
  };

  useEffect(() => {
    if (debouncedReleaseQuery && debouncedReleaseQuery.length >= 2) {
      searchReleases(debouncedReleaseQuery);
    } else {
      setReleaseOptions([]);
    }
  }, [debouncedReleaseQuery]);

  useEffect(() => {
    if (showEmailModal && (!debouncedReleaseQuery || debouncedReleaseQuery.length < 2)) {
      searchReleases("");
    }
  }, [showEmailModal, debouncedReleaseQuery]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selectedFiles = Array.from(input.files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const uploaded: DemoFile[] = [];
      const skipped: Array<{ name: string; reason: string }> = [];
      const errors: Array<{ name: string; error: string }> = [];

      // Upload files directly to R2 so large audio files do not pass through
      // the Cloudflare-proxied Next.js request body.
      for (const file of selectedFiles) {
        const isAudio = file.type.startsWith('audio/');
        const isImage = file.type.startsWith('image/');

        if (!isAudio && !isImage) {
          skipped.push({ name: file.name, reason: 'Unsupported file type' });
          continue;
        }

        const maxSize = isAudio ? 200 * 1024 * 1024 : 20 * 1024 * 1024;
        if (file.size > maxSize) {
          skipped.push({
            name: file.name,
            reason: `File too large (${Math.round(file.size / 1024 / 1024)}MB, limit: ${Math.round(maxSize / 1024 / 1024)}MB)`,
          });
          continue;
        }

        try {
          const contentType = file.type || 'application/octet-stream';
          const presignResponse = await fetch('/api/admin/upload/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              type: contentType,
              size: file.size,
              kind: 'mailout',
              slug: 'uploads',
              baseDir: isImage ? 'images' : 'demos',
            }),
          });
          const presign = await presignResponse.json().catch(() => null);
          if (!presignResponse.ok || !presign?.uploadUrl) {
            throw new Error(presign?.error || 'Upload could not start');
          }

          const uploadResponse = await fetch(presign.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: file,
          });
          if (!uploadResponse.ok) {
            throw new Error(`R2 returned ${uploadResponse.status}`);
          }

          const path = presign.url || presign.key;
          if (!path) throw new Error('Upload URL is missing');

          uploaded.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            fileCategory: isImage ? 'image' : 'audio',
            path,
            url: presign.url || undefined,
            uploadedAt: new Date().toISOString(),
          });
        } catch (error) {
          errors.push({
            name: file.name,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      if (uploaded.length > 0) {
        setFiles(prev => [...prev, ...uploaded]);
        toast.success(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? '' : 's'} successfully`);
      }
      skipped.forEach(file => toast.error(`Skipped ${file.name}: ${file.reason}`, { duration: 5000 }));
      errors.forEach(file => toast.error(`Failed to upload ${file.name}: ${file.error}`, { duration: 6000 }));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed')
    } finally {
      input.value = '';
      setUploading(false);
    }
  };

  // selection removed

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSendEmails = async () => {
    // Allow sending emails without files (for text-only or image-only emails)
    // if (files.length === 0) return;

    setSending(true);

    try {
      const selectedDemoFiles = files;
      
      const response = await fetch('/api/admin/send-demos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            files: selectedDemoFiles,
            emailData: {
              ...emailData,
              wpPostId: emailData.wpPostId ? Number(emailData.wpPostId) : undefined
            }
          }),
      });

      if (response.ok) {
            const result = await response.json();
            toast.success(`Demos sent! ${result.message || ''}`)
            setShowEmailModal(false);
      } else {
        const error = await response.json();
        toast.error(`Send failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Error sending demos')
    } finally {
      setSending(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // category color utility removed with categories grid

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 border border-purple-500/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-4">
          <FaMusic className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Demo Distribution</h1>
            <p className="text-gray-400 text-sm">Upload audio files and distribute them by email or newsletter category</p>
          </div>
        </div>
      </motion.div>

      {/* Newsletter categories grid removed for a simpler layout */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 border border-green-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Demo Files</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-purple-900/50 text-purple-200 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
          >
            <FaUpload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Files"}
          </motion.button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*,image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="grid gap-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg border transition-all duration-200 bg-black/30 border-gray-500/30 hover:border-purple-500/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {file.fileCategory === 'image' ? (
                      <div className="flex items-center gap-3">
                        <FaImage className="w-5 h-5 text-blue-400" />
                        {file.path && (
                          <div className="w-12 h-12 rounded border border-gray-600 overflow-hidden bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={file.path} 
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <FaMusic className="w-5 h-5 text-purple-400" />
                    )}
                    <div>
                      <h3 className="font-medium text-white">{file.name}</h3>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.size)} • {file.type} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.path && file.fileCategory === 'audio' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FaPlay className="w-4 h-4" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12">
            <FaMusic className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No files uploaded yet</p>
            <p className="text-sm text-gray-500">Upload audio files (WAV, MP3, up to 200MB) or images (JPG, PNG, up to 20MB) to get started</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/50 border border-purple-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Send Email</h2>
            <p className="text-gray-400">
              {files.length > 0 ? (
                <>Selected {files.length} file{files.length !== 1 ? 's' : ''}</>
              ) : (
                <>Send text-only email or upload files first</>
              )}
              {emailData.newsletterCategory && (
                 <span className="text-blue-300">
                  {" "}• Sending to {newsletterCategories.find(cat => cat.id === emailData.newsletterCategory)?.name} category
                </span>
              )}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmailModal(true)}
            className="px-6 py-3 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 transition-all duration-200 flex items-center gap-2"
          >
            <FaEnvelope className="w-4 h-4" />
            Send via Email
          </motion.button>
        </div>
      </motion.div>

      {/* Sent Demos History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/50 border border-blue-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaClock className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Sent Demos</h2>
              <p className="text-gray-400 text-sm">Previously distributed demos — click to copy link</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchSentDemos}
            disabled={loadingSent}
            className="px-4 py-2 bg-blue-900/50 text-blue-200 rounded-lg hover:bg-blue-900/70 disabled:opacity-50 transition-all duration-200 text-sm"
          >
            {loadingSent ? 'Loading...' : 'Refresh'}
          </motion.button>
        </div>

        {loadingSent ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : sentDemos.length === 0 ? (
          <div className="text-center py-8">
            <FaEnvelope className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No demos sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sentDemos.map((demo) => {
              const fileList = Array.isArray(demo.files) ? demo.files : [];
              const feedbackUrl = typeof window !== 'undefined' && demo.token
                ? `${window.location.origin}/demo-feedback?token=${demo.token}`
                : '';
              return (
                <div
                  key={demo.id}
                  className="bg-black/30 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{demo.subject || '(no subject)'}</p>
                      <p className="text-xs text-gray-400">To: {demo.recipientEmail}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{formatDate(demo.createdAt)}</span>
                  </div>

                  {/* Feedback page link */}
                  {feedbackUrl && (
                    <div className="mb-2 flex items-center gap-2 bg-blue-900/20 border border-blue-500/20 rounded-md px-3 py-2">
                      <span className="text-xs text-blue-300 font-medium shrink-0">Demo Page:</span>
                      <span className="text-xs text-blue-200 truncate flex-1">{feedbackUrl}</span>
                      <button
                        onClick={() => copyLink(feedbackUrl)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors shrink-0"
                        title="Copy demo page link"
                      >
                        <FaLink className="w-3 h-3" />
                      </button>
                      <a
                        href={feedbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors shrink-0"
                        title="Open demo page"
                      >
                        <FaPlay className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {fileList.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {fileList.map((file, idx) => (
                        <div key={file.id || idx} className="flex items-center gap-2 bg-black/40 rounded-md px-3 py-2">
                          <FaMusic className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="text-sm text-gray-300 truncate flex-1">{file.name}</span>
                          <button
                            onClick={() => copyLink(file.path)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors shrink-0"
                            title="Copy link"
                          >
                            <FaLink className="w-3 h-3" />
                          </button>
                          <a
                            href={file.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors shrink-0"
                            title="Open"
                          >
                            <FaPlay className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-6 w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Email</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Distribution Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="distribution"
                      value="manual"
                      checked={!emailData.newsletterCategory}
                      onChange={() => setEmailData(prev => ({ ...prev, newsletterCategory: "" }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-white">Manual Email List</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="distribution"
                      value="newsletter"
                      checked={!!emailData.newsletterCategory}
                      onChange={() => setEmailData(prev => ({ ...prev, newsletterCategory: prev.newsletterCategory || newsletterCategories[0]?.id }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-white">Newsletter Category</span>
                  </label>
                </div>
              </div>

              {!emailData.newsletterCategory ? (
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Recipients (comma-separated)
                  </label>
                  <textarea
                    value={emailData.recipients}
                    onChange={(e) => setEmailData(prev => ({ ...prev, recipients: e.target.value }))}
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
                    value={emailData.newsletterCategory}
                    onChange={(e) => setEmailData(prev => ({ ...prev, newsletterCategory: e.target.value }))}
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

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Link to Release (optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={releaseQuery}
                    onChange={(e) => setReleaseQuery(e.target.value)}
                    placeholder="Search releases by title..."
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {releaseOptions.length > 0 && (
                    <div className="max-h-56 overflow-auto border border-purple-500/20 rounded-lg bg-black/90">
                      {releaseOptions.map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setEmailData(prev => ({ ...prev, wpPostId: String(opt.wpId || '') })); setReleaseQuery(opt.title); setReleaseOptions([]); }}
                          className="w-full text-left px-3 py-2 hover:bg-purple-900/30 text-sm flex items-center gap-3"
                        >
                          {opt.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={opt.coverImageUrl} alt="" className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-purple-900/30" />
                          )}
                          <span className="flex-1 truncate">{opt.title}</span>
                          {typeof opt.wpId === 'number' ? <span className="text-xs text-gray-400">WP {opt.wpId}</span> : null}
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    type="number"
                    value={emailData.wpPostId}
                    onChange={(e) => setEmailData(prev => ({ ...prev, wpPostId: e.target.value }))}
                    placeholder="Or enter WordPress Post ID"
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="New track for your consideration {name}"
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
                  rows={6}
                  placeholder="Hello {name},

We have a new track we'd love you to check out.

Artist: {artist}
Track: {track}

Let us know what you think.

Best regards,
DnB Doctor Team"
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-300 mb-2">
                  {emailData.newsletterCategory 
                    ? `Sending to ${newsletterCategories.find(cat => cat.id === emailData.newsletterCategory)?.subscriberCount} subscribers in ${newsletterCategories.find(cat => cat.id === emailData.newsletterCategory)?.name} category`
                    : `Sending to manual email list`
                  }
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Available placeholders: {'{name}'} (recipient name), {'{email}'} (email address), {'{artist}'} (artist name), {'{track}'} (track name), {'{category}'} (newsletter category), {'{subscribedAt}'} (subscription date)
                </p>
                
                {/* Preview section */}
                <div className="border-t border-purple-500/20 pt-3">
                  <p className="text-xs text-purple-300 mb-2">Preview (example values):</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p><strong>Subject (with name):</strong> {emailData.subject.replace(/{name}/g, 'John').replace(/{email}/g, 'john@example.com').replace(/{artist}/g, 'Artist Name').replace(/{track}/g, 'Track Title').replace(/{category}/g, 'Newsletter Category').replace(/{subscribedAt}/g, '01/01/2024')}</p>
                    <p><strong>Subject (no name):</strong> {emailData.subject.replace(/{name}/g, '').replace(/{email}/g, 'john@example.com').replace(/{artist}/g, 'Artist Name').replace(/{track}/g, 'Track Title').replace(/{category}/g, 'Newsletter Category').replace(/{subscribedAt}/g, '01/01/2024').replace(/\s*-\s*$/, "").replace(/\s{2,}/g, " ").replace(/\s*for your consideration\s*$/i, " for your consideration").trim()}</p>
                    <p><strong>Message:</strong> {emailData.message.replace(/{name}/g, 'John').replace(/{email}/g, 'john@example.com').replace(/{artist}/g, 'Artist Name').replace(/{track}/g, 'Track Title').replace(/{category}/g, 'Newsletter Category').replace(/{subscribedAt}/g, '01/01/2024').substring(0, 100)}...</p>
                  </div>
                </div>
                
                {emailData.wpPostId && (
                  <p className="text-xs text-blue-300 mt-1">Linked release (WP Post ID): {emailData.wpPostId}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmailModal(false)}
                className="px-5 py-2.5 text-gray-300 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendEmails}
                disabled={sending || !emailData.subject || !emailData.message || (!emailData.recipients && !emailData.newsletterCategory)}
                className="px-5 py-2.5 bg-green-900/60 text-green-200 rounded-lg hover:bg-green-900/80 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                <FaEnvelope className="w-4 h-4" />
                {sending ? "Sending..." : "Send Email"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
