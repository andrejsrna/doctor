"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMusic, FaImage, FaLock, FaDownload, FaPlay, FaSearch, FaSpinner } from "react-icons/fa";

interface DemoFile {
  name: string;
  key: string;
  size: number;
  url: string;
  uploadedAt: string;
  category: "audio" | "image";
}

export default function DemoLibraryPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [files, setFiles] = useState<DemoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "audio" | "image">("all");

  // Check sessionStorage for saved code
  useEffect(() => {
    const saved = sessionStorage.getItem("demo-library-code");
    if (saved) {
      setCode(saved);
      setUnlocked(true);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/demo-library?code=${encodeURIComponent(code.trim())}`);
      if (!res.ok) {
        throw new Error("Invalid code");
      }
      const data = await res.json();
      setFiles(data.files || []);
      setUnlocked(true);
      sessionStorage.setItem("demo-library-code", code.trim());
    } catch {
      setError("Invalid access code");
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("demo-library-code");
    setUnlocked(false);
    setCode("");
    setFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cleanName = (name: string) => {
    // Strip timestamp-random prefix: 1234567890-abc123-Filename.mp3 → Filename.mp3
    return name.replace(/^\d+-[a-z0-9]+-/i, "");
  };

  const filtered = files.filter((f) => {
    const matchesFilter = filter === "all" || f.category === filter;
    const matchesSearch =
      !search ||
      cleanName(f.name).toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const audioCount = files.filter((f) => f.category === "audio").length;
  const imageCount = files.filter((f) => f.category === "image").length;

  // --- Code entry screen ---
  if (!unlocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-black/60 border border-purple-500/20 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 mb-4">
                <FaLock className="w-7 h-7 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Demo Library</h1>
              <p className="text-gray-400 text-sm mt-1">
                Enter your access code to browse and download demo files.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Access code"
                autoFocus
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center tracking-widest"
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full px-5 py-3 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" /> Checking...
                  </>
                ) : (
                  <>
                    <FaLock className="w-4 h-4" /> Unlock
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- File browser ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Demo Library</h1>
          <p className="text-gray-400 text-sm mt-1">
            {files.length} files • {audioCount} audio • {imageCount} images
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-colors"
        >
          Lock
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "audio", "image"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-purple-700 text-white"
                  : "bg-black/50 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <FaSpinner className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <FaMusic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No files found</p>
        </div>
      )}

      {/* File list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((file, idx) => (
            <motion.div
              key={file.key + idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5) }}
              className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-lg p-3 hover:border-purple-500/30 transition-colors"
            >
              {/* Icon */}
              <div className="shrink-0">
                {file.category === "image" ? (
                  <div className="w-10 h-10 rounded-lg bg-pink-900/30 border border-pink-500/20 flex items-center justify-center">
                    <FaImage className="w-4 h-4 text-pink-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center">
                    <FaMusic className="w-4 h-4 text-purple-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{cleanName(file.name)}</p>
                <p className="text-xs text-gray-500">
                  {formatSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {file.category === "audio" && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors"
                    title="Play"
                  >
                    <FaPlay className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={file.url}
                  download
                  className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded-lg transition-colors"
                  title="Download"
                >
                  <FaDownload className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
