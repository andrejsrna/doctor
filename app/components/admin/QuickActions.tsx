"use client";

import { Card, QuickActionButton } from "./AdminUI";
import { FaEnvelope, FaUsers, FaChartLine } from "react-icons/fa";

interface QuickActionsProps {
  onNavigate: (href: string) => void;
}

export const QuickActions = ({ onNavigate }: QuickActionsProps) => (
  <Card className="overflow-hidden" delay={0.5}>
    <div className="p-6 border-b border-purple-500/20">
      <h2 className="text-xl font-bold text-white">Quick Actions</h2>
      <p className="text-sm text-gray-400">Common admin tasks</p>
    </div>
    
    <div className="p-6">
      <div className="space-y-3">
        <QuickActionButton
          icon={FaEnvelope}
          title="Send Newsletter"
          description="Create and send email campaign"
          color="purple"
          onClick={() => onNavigate('/admin/newsletter')}
        />
        
        <QuickActionButton
          icon={FaUsers}
          title="Manage Subscribers"
          description="View and edit subscriber list"
          color="green"
          onClick={() => onNavigate('/admin/newsletter')}
        />
        
        <QuickActionButton
          icon={FaChartLine}
          title="View Analytics"
          description="Check detailed reports"
          color="yellow"
          onClick={() => onNavigate('/admin/analytics')}
        />
      </div>
    </div>
  </Card>
);
