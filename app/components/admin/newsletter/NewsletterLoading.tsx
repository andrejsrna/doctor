"use client";

export default function NewsletterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto animate-spin" />
        <p className="mt-4 text-purple-300">Loading newsletter data...</p>
      </div>
    </div>
  );
}
