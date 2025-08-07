"use client";

import { FaUserPlus } from "react-icons/fa";

export default function InfluencersHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Influencer Database</h1>
        <p className="text-gray-400 mt-2">Manage influencers and sync with newsletter subscribers</p>
      </div>
      <button
        onClick={onAdd}
        className="bg-purple-900/50 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-900/70 border border-purple-500/30 flex items-center gap-2"
      >
        <FaUserPlus />
        Add Influencer
      </button>
    </div>
  );
}


