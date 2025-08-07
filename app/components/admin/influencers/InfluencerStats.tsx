"use client";

import { FaUsers, FaCrown, FaBolt, FaEnvelope } from "react-icons/fa";

export default function InfluencerStats({
  total,
  active,
  vip,
  synced,
}: {
  total: number;
  active: number;
  vip: number;
  synced: number;
}) {
  const cards = [
    { label: "Total", value: total, icon: FaUsers, color: "purple" },
    { label: "Active", value: active, icon: FaBolt, color: "green" },
    { label: "VIP", value: vip, icon: FaCrown, color: "yellow" },
    { label: "Synced", value: synced, icon: FaEnvelope, color: "blue" },
  ];

  const colorMap: Record<string, string> = {
    purple: "text-purple-300 border-purple-500/30 bg-purple-900/30",
    green: "text-green-300 border-green-500/30 bg-green-900/30",
    yellow: "text-yellow-300 border-yellow-500/30 bg-yellow-900/30",
    blue: "text-blue-300 border-blue-500/30 bg-blue-900/30",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`p-5 rounded-xl border ${colorMap[c.color]} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{c.label}</div>
                <div className="text-3xl font-bold text-white">{c.value}</div>
              </div>
              <Icon className="w-7 h-7 opacity-80" />
            </div>
          </div>
        );
      })}
    </div>
  );
}


