import { Subscriber, RecentlyDeleted } from "../types";

export const createEmptySubscriber = () => ({
  email: "",
  name: "",
  tags: "",
  category: "",
  notes: ""
});

export const handleSubscriberSelection = (
  subscriberId: string,
  selectedSubscribers: string[]
): string[] => {
  return selectedSubscribers.includes(subscriberId)
    ? selectedSubscribers.filter(id => id !== subscriberId)
    : [...selectedSubscribers, subscriberId];
};

export const handleSelectAll = (
  subscribers: Subscriber[],
  selectedSubscribers: string[]
): string[] => {
  return selectedSubscribers.length === subscribers.length
    ? []
    : subscribers.map(s => s.id);
};

export const addToRecentlyDeleted = (
  subscriber: Subscriber,
  recentlyDeleted: RecentlyDeleted[]
): RecentlyDeleted[] => {
  return [...recentlyDeleted, { subscriber, timestamp: Date.now() }];
};

export const removeFromRecentlyDeleted = (
  subscriberId: string,
  recentlyDeleted: RecentlyDeleted[]
): RecentlyDeleted[] => {
  return recentlyDeleted.filter(item => item.subscriber.id !== subscriberId);
};

export const filterExpiredRecentlyDeleted = (
  recentlyDeleted: RecentlyDeleted[],
  expirationTime: number = 5000
): RecentlyDeleted[] => {
  return recentlyDeleted.filter(item => Date.now() - item.timestamp < expirationTime);
};

export const resetPagination = (setCurrentPage: (page: number) => void) => {
  setCurrentPage(1);
};
