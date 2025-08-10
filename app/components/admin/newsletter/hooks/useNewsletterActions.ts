import { useState } from "react";
import toast from 'react-hot-toast'

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

export function useNewsletterActions() {
  const [sending, setSending] = useState(false);
  const [softDelete, setSoftDelete] = useState(true);
  const [recentlyDeleted, setRecentlyDeleted] = useState<{ subscriber: Subscriber, timestamp: number }[]>([]);

  const handleAddSubscriber = async (subscriberData: {
    email: string;
    name: string;
    tags: string;
    category: string;
    notes: string;
  }) => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: subscriberData.email,
          name: subscriberData.name,
          tags: subscriberData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          category: subscriberData.category,
          notes: subscriberData.notes
        }),
      });

      if (response.ok) {
        toast.success('Subscriber added')
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add subscriber')
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
      return { success: false, error: 'Error adding subscriber' };
    }
  };

  const handleEditSubscriber = async (subscriber: Subscriber) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${subscriber.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subscriber.name,
          tags: subscriber.tags,
          categoryId: subscriber.categoryId,
          notes: subscriber.notes,
          status: subscriber.status
        }),
      });

      if (response.ok) {
        toast.success('Subscriber updated')
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update subscriber')
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
      return { success: false, error: 'Error updating subscriber' };
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${subscriberId}?soft=${softDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Subscriber deleted')
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete subscriber')
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      return { success: false, error: 'Error deleting subscriber' };
    }
  };

  const handleBulkDelete = async (subscriberIds: string[]) => {
    try {
      const deletePromises = subscriberIds.map(id =>
        fetch(`/api/admin/newsletter/subscribers/${id}?soft=${softDelete}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter(result => !result.ok);

      if (failedDeletions.length === 0) {
        toast.success('Deleted selected subscribers')
        return { success: true };
      } else {
        toast.error(`Failed to delete ${failedDeletions.length} subscribers`)
        return { success: false, error: `Failed to delete ${failedDeletions.length} subscribers` };
      }
    } catch (error) {
      console.error('Error bulk deleting subscribers:', error);
      return { success: false, error: 'Error bulk deleting subscribers' };
    }
  };

  const handleSendNewsletter = async (subscribers: Subscriber[], emailData: {
    subject: string;
    message: string;
    template: string;
  }) => {
    setSending(true);
    try {
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscribers,
          emailData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || 'Newsletter sent')
        return { success: true, message: result.message };
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send newsletter')
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Send error:', error);
      return { success: false, error: 'Error sending newsletter' };
    } finally {
      setSending(false);
    }
  };

  const handleUndoDelete = async (deletedItem: { subscriber: Subscriber, timestamp: number }) => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: deletedItem.subscriber.email,
          name: deletedItem.subscriber.name,
          tags: deletedItem.subscriber.tags,
          category: deletedItem.subscriber.categoryId,
          notes: deletedItem.subscriber.notes
        }),
      });

      if (response.ok) {
        setRecentlyDeleted(prev => prev.filter(item => item.timestamp !== deletedItem.timestamp));
        toast.success('Restored subscriber')
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to restore subscriber')
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error restoring subscriber:', error);
      return { success: false, error: 'Error restoring subscriber' };
    }
  };

  return {
    sending,
    softDelete,
    setSoftDelete,
    recentlyDeleted,
    setRecentlyDeleted,
    handleAddSubscriber,
    handleEditSubscriber,
    handleDeleteSubscriber,
    handleBulkDelete,
    handleSendNewsletter,
    handleUndoDelete
  };
}
