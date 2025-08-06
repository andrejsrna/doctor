"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMusic, FaUpload, FaEnvelope, FaTrash, FaPlay, FaUsers, FaTags } from "react-icons/fa";

interface DemoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path?: string;
  url?: string;
  duration?: number;
  uploadedAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    recipients: "",
    newsletterCategory: ""
  });
  const [newsletterCategories, setNewsletterCategories] = useState<NewsletterCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailTemplates: EmailTemplate[] = [
    {
      id: "1",
      name: "New Release",
      subject: "New DNB Doctor Release - {artist} - {track}",
      body: "Hi {recipient},\n\nWe're excited to share our latest release with you!\n\nArtist: {artist}\nTrack: {track}\n\nListen and let us know what you think!\n\nBest regards,\nDNB Doctor Team"
    },
    {
      id: "2",
      name: "Demo Feedback",
      subject: "Demo Submission - {artist}",
      body: "Hi {recipient},\n\nThank you for your demo submission.\n\nArtist: {artist}\nTrack: {track}\n\nWe'll review it and get back to you soon.\n\nBest regards,\nDNB Doctor Team"
    },
    {
      id: "3",
      name: "Custom",
      subject: "",
      body: ""
    }
  ];

  useEffect(() => {
    fetchNewsletterCategories();
  }, []);

  const fetchNewsletterCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch('/api/admin/newsletter/categories');
      if (response.ok) {
        const data = await response.json();
        setNewsletterCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching newsletter categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setUploading(true);

    try {
      const formData = new FormData();
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        if (file.type.startsWith('audio/')) {
          formData.append('files', file);
        }
      }

      const response = await fetch('/api/admin/upload-demo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => [...prev, ...result.files]);
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setSelectedFiles(prev => prev.filter(id => id !== fileId));
  };

  const handleSendEmails = async () => {
    if (selectedFiles.length === 0) return;

    setSending(true);

    try {
      const selectedDemoFiles = files.filter(file => selectedFiles.includes(file.id));
      
      const response = await fetch('/api/admin/send-demos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: selectedDemoFiles,
          emailData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Demos sent successfully! ${result.message}`);
        setShowEmailModal(false);
        setSelectedFiles([]);
      } else {
        const error = await response.json();
        alert(`Error sending demos: ${error.error}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      alert('Error sending demos');
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

  const getCategoryColor = (color: string) => {
    const colorMap = {
      purple: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
      green: 'bg-green-900/30 border-green-500/30 text-green-300',
      blue: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
      orange: 'bg-orange-900/30 border-orange-500/30 text-orange-300',
      red: 'bg-red-900/30 border-red-500/30 text-red-300'
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
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
              <FaMusic className="w-10 h-10 text-purple-400" />
              <FaEnvelope className="w-5 h-5 text-green-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Demo Distribution</h1>
              <p className="text-gray-400">Upload and send demo files to recipients</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Upload audio files (WAV, MP3) and distribute them to your email list or newsletter categories.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaMusic className="w-4 h-4" />
                <span>Professional demo distribution system</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
              >
                <FaUpload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">Upload</div>
                <div className="text-xs text-gray-400">Audio Files</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
              >
                <FaEnvelope className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-300">Send</div>
                <div className="text-xs text-gray-400">Via Email</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTags className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Newsletter Categories</h2>
        </div>
        
        {loadingCategories ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsletterCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  emailData.newsletterCategory === category.id
                    ? "bg-blue-900/30 border-blue-500/50"
                    : "bg-black/30 border-gray-500/30 hover:border-blue-500/30"
                }`}
                onClick={() => setEmailData(prev => ({ ...prev, newsletterCategory: category.id }))}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs border ${getCategoryColor(category.color)}`}>
                    {category.name}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaUsers className="w-4 h-4" />
                    <span>{category.subscriberCount}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{category.description}</p>
                {emailData.newsletterCategory === category.id && (
                  <div className="mt-3 text-xs text-blue-300">
                    ✓ Selected for demo distribution
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Demo Files</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-6 py-3 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
          >
            <FaUpload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Files"}
          </motion.button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="grid gap-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                selectedFiles.includes(file.id)
                  ? "bg-purple-900/30 border-purple-500/50"
                  : "bg-black/30 border-gray-500/30 hover:border-purple-500/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleFileSelect(file.id)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FaMusic className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="font-medium text-white">{file.name}</h3>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.size)} • {file.type} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.path && (
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
            <p className="text-sm text-gray-500">Upload WAV or MP3 files to get started</p>
          </div>
        )}
      </motion.div>

      {/* Send Section */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Send Demos</h2>
              <p className="text-gray-400">
                Selected {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
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
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Demo Files</h3>
            
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
                  Email Template
                </label>
                <select
                  onChange={(e) => {
                    const template = emailTemplates.find(t => t.id === e.target.value);
                    if (template) {
                      setEmailData({
                        subject: template.subject,
                        message: template.body,
                        recipients: emailData.recipients,
                        newsletterCategory: emailData.newsletterCategory
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select template...</option>
                  {emailTemplates.map(template => (
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
                  rows={6}
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
                <p className="text-xs text-gray-400">
                  Use {'{name}'} for recipient name, {'{email}'} for email address
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
                onClick={handleSendEmails}
                disabled={sending || !emailData.subject || !emailData.message || (!emailData.recipients && !emailData.newsletterCategory)}
                className="px-6 py-3 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                <FaEnvelope className="w-4 h-4" />
                {sending ? "Sending..." : "Send Demos"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 