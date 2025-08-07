"use client";

import { memo } from "react";
 
import { FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'ACTIVE' | 'PENDING' | 'UNSUBSCRIBED';
  source?: string;
  tags?: string[];
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  notes?: string;
  lastEmailSent?: string;
  emailCount?: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

interface SubscriberRowProps {
  subscriber: Subscriber;
  categories: Category[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: string) => void;
}

const SubscriberRow = memo(function SubscriberRow({
  subscriber,
  categories,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}: SubscriberRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string, notes?: string) => {
    const isSoftDeleted = notes?.includes('[SOFT DELETED]');
    const colors = {
      ACTIVE: 'bg-green-900/30 border-green-500/30 text-green-300',
      UNSUBSCRIBED: 'bg-red-900/30 border-red-500/30 text-red-300',
      PENDING: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300'
    };
    
    const baseClasses = `px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors] || colors.PENDING}`;
    
    if (isSoftDeleted) {
      return `${baseClasses} opacity-60 line-through`;
    }
    
    return baseClasses;
  };

  const getCategoryBadge = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    const colorMap = {
      purple: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
      green: 'bg-green-900/30 border-green-500/30 text-green-300',
      blue: 'bg-blue-900/30 border border-blue-500/30 text-blue-300',
      orange: 'bg-orange-900/30 border-orange-500/30 text-orange-300',
      red: 'bg-red-900/30 border-red-500/30 text-red-300'
    };
    return `px-2 py-1 rounded-full text-xs border ${colorMap[category.color as keyof typeof colorMap] || colorMap.purple}`;
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 ${
        isSelected
          ? "bg-purple-900/30 border-purple-500/50"
          : "bg-black/30 border-gray-500/30 hover:border-purple-500/30"
      }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(subscriber.id)}
          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <FaEnvelope className="w-4 h-4 text-purple-400" />
            <div>
              <h3 className="font-medium text-white">{subscriber.email}</h3>
              <p className="text-sm text-gray-400">
                {subscriber.name && `${subscriber.name} • `}
                Subscribed {formatDate(subscriber.subscribedAt)}
                {subscriber.source && ` • via ${subscriber.source}`}
                {subscriber.emailCount && ` • ${subscriber.emailCount} emails sent`}
              </p>
              {subscriber.notes && (
                <p className="text-xs text-gray-500 mt-1 italic">&quot;{subscriber.notes}&quot;</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={getStatusBadge(subscriber.status, subscriber.notes)}>
            {subscriber.status}
            {subscriber.notes?.includes('[SOFT DELETED]') && ' (Soft Deleted)'}
          </span>
          
          {subscriber.category && (
            <span className={getCategoryBadge(subscriber.category.id)}>
              {subscriber.category.name}
            </span>
          )}
          
          <button
            onClick={() => onEdit(subscriber)}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(subscriber.id)}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default SubscriberRow;
