"use client";

import { StatCard } from "./AdminUI";

import { IconType } from "react-icons";

interface StatsGridProps {
  stats: Array<{
    name: string;
    value: string;
    change: string;
    changeType: "positive" | "negative";
    icon: IconType;
    color: string;
  }>;
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
      <StatCard key={stat.name} stat={stat} index={index} />
    ))}
  </div>
);
