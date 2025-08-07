import { useState, useCallback, useMemo, useEffect } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useNewsletterActions } from "./useNewsletterActions";
import { Subscriber, Category, RecentlyDeleted } from "../types";
import { fetchNewsletterData, addSubscriber, updateExistingSubscriber } from "../helpers/dataHelpers";
import { 
  createEmptySubscriber, 
  handleSubscriberSelection, 
  addToRecentlyDeleted, 
  removeFromRecentlyDeleted, 
  filterExpiredRecentlyDeleted,
  resetPagination 
} from "../helpers/stateHelpers";
import { 
  parseSubscriberError, 
  handleSubscriberExistsError, 
  isSubscriberExistsError, 
  createNetworkError 
} from "../helpers/errorHelpers";

export const useNewsletterState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showSoftDeleted, setShowSoftDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [recentlyDeleted, setRecentlyDeleted] = useState<RecentlyDeleted[]>([]);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    pendingSubscribers: 0
  });
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState(createEmptySubscriber());
  const [addSubscriberError, setAddSubscriberError] = useState("");
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [showUpdateOption, setShowUpdateOption] = useState(false);

  const { handleUndoDelete, handleDeleteSubscriber } = useNewsletterActions();

  const fetchData = useCallback(async (isSearchUpdate = false) => {
    if (isSearchUpdate) {
      setListLoading(true);
    } else {
      setLoading(true);
    }
    
    try {
      const result = await fetchNewsletterData({
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        filterStatus,
        filterCategory,
        showSoftDeleted
      });
      
      setSubscribers(result.subscribers);
      setCategories(result.categories);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (isSearchUpdate) {
        setListLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [currentPage, debouncedSearchTerm, filterStatus, filterCategory, showSoftDeleted, itemsPerPage]);

  const handleUndoDeleteSubmit = useCallback(async (subscriber: Subscriber) => {
    try {
      const result = await handleUndoDelete({ 
        subscriber: subscriber, 
        timestamp: Date.now() 
      });
      if (result.success) {
        setRecentlyDeleted(prev => removeFromRecentlyDeleted(subscriber.id, prev));
        fetchData();
      }
    } catch (error) {
      console.error("Failed to undo delete:", error);
    }
  }, [handleUndoDelete, fetchData]);

  const handleDeleteSubscriberClick = useCallback(async (subscriberId: string) => {
    try {
      const result = await handleDeleteSubscriber(subscriberId);
      if (result.success) {
        const subscriber = subscribers.find(s => s.id === subscriberId);
        if (subscriber) {
          setRecentlyDeleted(prev => addToRecentlyDeleted(subscriber, prev));
        }
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
    }
  }, [handleDeleteSubscriber, subscribers, fetchData]);

  const handleSubscriberSelect = useCallback((subscriberId: string) => {
    setSelectedSubscribers(prev => handleSubscriberSelection(subscriberId, prev));
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedSubscribers(prev => {
      const allIds = subscribers.map(s => s.id);
      return prev.length === allIds.length ? [] : allIds;
    });
  }, [subscribers]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedSubscribers.length === 0) return;
    
    try {
      const deletePromises = selectedSubscribers.map(id => handleDeleteSubscriber(id));
      await Promise.all(deletePromises);
      setSelectedSubscribers([]);
      fetchData();
    } catch (error) {
      console.error("Failed to bulk delete subscribers:", error);
    }
  }, [selectedSubscribers, handleDeleteSubscriber, fetchData]);

  const handleEditSubscriber = useCallback((subscriber: Subscriber) => {
    console.log('Edit subscriber:', subscriber.id);
  }, []);

  const handleAddSubscriber = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
    setNewSubscriber(createEmptySubscriber());
    setAddSubscriberError("");
    setShowUpdateOption(false);
  }, []);

  const handleSubmitAddSubscriber = useCallback(async () => {
    setIsAddingSubscriber(true);
    setAddSubscriberError("");
    
    try {
      await addSubscriber(newSubscriber);
      handleCloseAddModal();
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        const parsedError = await parseSubscriberError(error as unknown as Response);
        if (isSubscriberExistsError(parsedError)) {
          setAddSubscriberError(handleSubscriberExistsError(parsedError));
          setShowUpdateOption(true);
        } else {
          setAddSubscriberError(parsedError.error);
          setShowUpdateOption(false);
        }
      } else {
        setAddSubscriberError(createNetworkError(error));
      }
    } finally {
      setIsAddingSubscriber(false);
    }
  }, [newSubscriber, handleCloseAddModal, fetchData]);

  const handleUpdateExistingSubscriber = useCallback(async () => {
    setIsAddingSubscriber(true);
    setAddSubscriberError("");
    
    try {
      await updateExistingSubscriber(newSubscriber);
      handleCloseAddModal();
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        const parsedError = await parseSubscriberError(error as unknown as Response);
        setAddSubscriberError(parsedError.error);
      } else {
        setAddSubscriberError(createNetworkError(error));
      }
    } finally {
      setIsAddingSubscriber(false);
    }
  }, [newSubscriber, handleCloseAddModal, fetchData]);

  const handleManageCategories = useCallback(() => {
    console.log('Manage categories');
  }, []);

  const handleSendNewsletter = useCallback(() => {
    setSendingNewsletter(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const memoizedStats = useMemo(() => stats, [stats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentlyDeleted(prev => filterExpiredRecentlyDeleted(prev));
    }, 5000);
    return () => clearTimeout(timer);
  }, [recentlyDeleted]);

  useEffect(() => {
    resetPagination(setCurrentPage);
  }, [debouncedSearchTerm, filterStatus, filterCategory, showSoftDeleted]);

  useEffect(() => {
    const isSearchUpdate = debouncedSearchTerm !== searchTerm;
    fetchData(isSearchUpdate);
  }, [fetchData, debouncedSearchTerm, searchTerm]);

  return {
    // State
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    showSoftDeleted,
    setShowSoftDeleted,
    currentPage,
    itemsPerPage,
    recentlyDeleted,
    sendingNewsletter,
    subscribers,
    categories,
    loading,
    listLoading,
    stats: memoizedStats,
    selectedSubscribers,
    totalPages,
    totalCount,
    showAddModal,
    newSubscriber,
    setNewSubscriber,
    addSubscriberError,
    isAddingSubscriber,
    showUpdateOption,
    
    // Actions
    handleUndoDeleteSubmit,
    handleDeleteSubscriberClick,
    handleSubscriberSelect,
    handleSelectAll,
    handleBulkDelete,
    handleEditSubscriber,
    handleAddSubscriber,
    handleCloseAddModal,
    handleSubmitAddSubscriber,
    handleUpdateExistingSubscriber,
    handleManageCategories,
    handleSendNewsletter,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
