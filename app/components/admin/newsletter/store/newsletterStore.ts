import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Subscriber, Category, RecentlyDeleted } from '../types';
import { fetchNewsletterData, addSubscriber, updateExistingSubscriber } from '../helpers/dataHelpers';
import { 
  createEmptySubscriber, 
  handleSubscriberSelection, 
  handleSelectAll, 
  addToRecentlyDeleted, 
  removeFromRecentlyDeleted, 
  filterExpiredRecentlyDeleted 
} from '../helpers/stateHelpers';
import { 
  createNetworkError 
} from '../helpers/errorHelpers';

interface NewsletterState {
  // UI State
  searchTerm: string;
  debouncedSearchTerm: string;
  filterStatus: string;
  filterCategory: string;
  showSoftDeleted: boolean;
  currentPage: number;
  itemsPerPage: number;
  selectedSubscribers: string[];
  showAddModal: boolean;
  showUpdateOption: boolean;
  
  // Data State
  subscribers: Subscriber[];
  categories: Category[];
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    pendingSubscribers: number;
  };
  totalPages: number;
  totalCount: number;
  
  // Loading States
  loading: boolean;
  listLoading: boolean;
  isAddingSubscriber: boolean;
  sendingNewsletter: boolean;
  
  // Modal State
  newSubscriber: ReturnType<typeof createEmptySubscriber>;
  addSubscriberError: string;
  
  // Recently Deleted
  recentlyDeleted: RecentlyDeleted[];
  
  // Actions
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterCategory: (category: string) => void;
  setShowSoftDeleted: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSelectedSubscribers: (subscribers: string[]) => void;
  setShowAddModal: (show: boolean) => void;
  setShowUpdateOption: (show: boolean) => void;
  setNewSubscriber: (subscriber: ReturnType<typeof createEmptySubscriber>) => void;
  setAddSubscriberError: (error: string) => void;
  setSendingNewsletter: (sending: boolean) => void;
  
  // Complex Actions
  fetchData: (isSearchUpdate?: boolean) => Promise<void>;
  handleSubscriberSelect: (subscriberId: string) => void;
  handleSelectAll: () => void;
  handleBulkDelete: () => Promise<void>;
  handleDeleteSubscriber: (subscriberId: string) => Promise<void>;
  handleUndoDelete: (subscriber: Subscriber) => Promise<void>;
  handleAddSubscriber: () => void;
  handleCloseAddModal: () => void;
  handleSubmitAddSubscriber: () => Promise<void>;
  handleUpdateExistingSubscriber: () => Promise<void>;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (items: number) => void;
  resetPagination: () => void;
  cleanupRecentlyDeleted: () => void;
}

let searchTimeoutId: NodeJS.Timeout | null = null;

export const useNewsletterStore = create<NewsletterState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    searchTerm: '',
    debouncedSearchTerm: '',
    filterStatus: 'all',
    filterCategory: 'all',
    showSoftDeleted: false,
    currentPage: 1,
    itemsPerPage: 20,
    selectedSubscribers: [],
    showAddModal: false,
    showUpdateOption: false,
    
    subscribers: [],
    categories: [],
    stats: {
      totalSubscribers: 0,
      activeSubscribers: 0,
      pendingSubscribers: 0
    },
    totalPages: 1,
    totalCount: 0,
    
    loading: false,
    listLoading: false,
    isAddingSubscriber: false,
    sendingNewsletter: false,
    
    newSubscriber: createEmptySubscriber(),
    addSubscriberError: '',
    
    recentlyDeleted: [],
    
    // Simple Setters
    setSearchTerm: (term) => {
      set({ searchTerm: term });
      
      // Clear previous timeout
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
      
      // Debounce the search term
      searchTimeoutId = setTimeout(() => {
        const state = get();
        if (state.searchTerm === term && state.debouncedSearchTerm !== term) {
          set({ debouncedSearchTerm: term });
          state.fetchData(true);
        }
      }, 300);
    },
    setFilterStatus: (status) => set({ filterStatus: status }),
    setFilterCategory: (category) => set({ filterCategory: category }),
    setShowSoftDeleted: (show) => set({ showSoftDeleted: show }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (items) => set({ itemsPerPage: items }),
    setSelectedSubscribers: (subscribers) => set({ selectedSubscribers: subscribers }),
    setShowAddModal: (show) => set({ showAddModal: show }),
    setShowUpdateOption: (show) => set({ showUpdateOption: show }),
    setNewSubscriber: (subscriber) => set({ newSubscriber: subscriber }),
    setAddSubscriberError: (error) => set({ addSubscriberError: error }),
    setSendingNewsletter: (sending) => set({ sendingNewsletter: sending }),
    
    // Complex Actions
    fetchData: async (isSearchUpdate = false) => {
      const state = get();
      if (isSearchUpdate) {
        set({ listLoading: true });
      } else {
        set({ loading: true });
      }
      
      try {
        const result = await fetchNewsletterData({
          currentPage: state.currentPage,
          itemsPerPage: state.itemsPerPage,
          debouncedSearchTerm: state.debouncedSearchTerm,
          filterStatus: state.filterStatus,
          filterCategory: state.filterCategory,
          showSoftDeleted: state.showSoftDeleted
        });
        
        set({
          subscribers: result.subscribers,
          categories: result.categories,
          totalPages: result.totalPages,
          totalCount: result.totalCount,
          stats: result.stats || state.stats
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isSearchUpdate) {
          set({ listLoading: false });
        } else {
          set({ loading: false });
        }
      }
    },
    
    handleSubscriberSelect: (subscriberId) => {
      const state = get();
      const newSelected = handleSubscriberSelection(subscriberId, state.selectedSubscribers);
      set({ selectedSubscribers: newSelected });
    },
    
    handleSelectAll: () => {
      const state = get();
      const newSelected = handleSelectAll(state.subscribers, state.selectedSubscribers);
      set({ selectedSubscribers: newSelected });
    },
    
    handleBulkDelete: async () => {
      const state = get();
      if (state.selectedSubscribers.length === 0) return;
      
      try {
        const deletePromises = state.selectedSubscribers.map(async (id) => {
          const response = await fetch(`/api/admin/newsletter/subscribers/${id}?soft=true`, {
            method: 'DELETE',
          });
          return response.ok;
        });
        
        await Promise.all(deletePromises);
        set({ selectedSubscribers: [] });
        await get().fetchData();
      } catch (error) {
        console.error("Failed to bulk delete subscribers:", error);
      }
    },
    
    handleDeleteSubscriber: async (subscriberId) => {
      try {
        const response = await fetch(`/api/admin/newsletter/subscribers/${subscriberId}?soft=true`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          const state = get();
          const subscriber = state.subscribers.find(s => s.id === subscriberId);
          if (subscriber) {
            const newRecentlyDeleted = addToRecentlyDeleted(subscriber, state.recentlyDeleted);
            set({ recentlyDeleted: newRecentlyDeleted });
          }
          await get().fetchData();
        }
      } catch (error) {
        console.error("Failed to delete subscriber:", error);
      }
    },
    
    handleUndoDelete: async (subscriber) => {
      try {
        const response = await fetch('/api/admin/newsletter/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: subscriber.email,
            name: subscriber.name,
            tags: subscriber.tags,
            category: subscriber.categoryId,
            notes: subscriber.notes
          }),
        });
        
        if (response.ok) {
          const state = get();
          const newRecentlyDeleted = removeFromRecentlyDeleted(subscriber.id, state.recentlyDeleted);
          set({ recentlyDeleted: newRecentlyDeleted });
          await get().fetchData();
        }
      } catch (error) {
        console.error("Failed to undo delete:", error);
      }
    },
    
    handleAddSubscriber: () => {
      set({ showAddModal: true });
    },
    
    handleCloseAddModal: () => {
      set({
        showAddModal: false,
        newSubscriber: createEmptySubscriber(),
        addSubscriberError: '',
        showUpdateOption: false
      });
    },
    
    handleSubmitAddSubscriber: async () => {
      const state = get();
      set({ isAddingSubscriber: true, addSubscriberError: '' });
      
      try {
        await addSubscriber(state.newSubscriber);
        get().handleCloseAddModal();
        await get().fetchData();
      } catch (error) {
        set({
          addSubscriberError: createNetworkError(error),
          showUpdateOption: false
        });
      } finally {
        set({ isAddingSubscriber: false });
      }
    },
    
    handleUpdateExistingSubscriber: async () => {
      const state = get();
      set({ isAddingSubscriber: true, addSubscriberError: '' });
      
      try {
        await updateExistingSubscriber(state.newSubscriber);
        get().handleCloseAddModal();
        await get().fetchData();
      } catch (error) {
        set({ addSubscriberError: createNetworkError(error) });
      } finally {
        set({ isAddingSubscriber: false });
      }
    },
    
    handlePageChange: (page) => {
      set({ currentPage: page });
    },
    
    handleItemsPerPageChange: (items) => {
      set({ itemsPerPage: items, currentPage: 1 });
    },
    
    resetPagination: () => {
      set({ currentPage: 1 });
    },
    
    cleanupRecentlyDeleted: () => {
      const state = get();
      const filtered = filterExpiredRecentlyDeleted(state.recentlyDeleted);
      set({ recentlyDeleted: filtered });
    }
  }))
);

// Auto-cleanup recently deleted items
setInterval(() => {
  useNewsletterStore.getState().cleanupRecentlyDeleted();
}, 5000);
