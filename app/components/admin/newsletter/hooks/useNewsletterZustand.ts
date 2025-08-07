import { useEffect } from 'react';
import { useNewsletterStore } from '../store/newsletterStore';

export const useNewsletterZustand = () => {
  const searchTerm = useNewsletterStore(state => state.searchTerm);
  const setSearchTerm = useNewsletterStore(state => state.setSearchTerm);
  const filterStatus = useNewsletterStore(state => state.filterStatus);
  const setFilterStatus = useNewsletterStore(state => state.setFilterStatus);
  const filterCategory = useNewsletterStore(state => state.filterCategory);
  const setFilterCategory = useNewsletterStore(state => state.setFilterCategory);
  const showSoftDeleted = useNewsletterStore(state => state.showSoftDeleted);
  const setShowSoftDeleted = useNewsletterStore(state => state.setShowSoftDeleted);
  const currentPage = useNewsletterStore(state => state.currentPage);
  const itemsPerPage = useNewsletterStore(state => state.itemsPerPage);
  const recentlyDeleted = useNewsletterStore(state => state.recentlyDeleted);
  const sendingNewsletter = useNewsletterStore(state => state.sendingNewsletter);
  const subscribers = useNewsletterStore(state => state.subscribers);
  const categories = useNewsletterStore(state => state.categories);
  const loading = useNewsletterStore(state => state.loading);
  const listLoading = useNewsletterStore(state => state.listLoading);
  const stats = useNewsletterStore(state => state.stats);
  const selectedSubscribers = useNewsletterStore(state => state.selectedSubscribers);
  const totalPages = useNewsletterStore(state => state.totalPages);
  const totalCount = useNewsletterStore(state => state.totalCount);
  const showAddModal = useNewsletterStore(state => state.showAddModal);
  const newSubscriber = useNewsletterStore(state => state.newSubscriber);
  const setNewSubscriber = useNewsletterStore(state => state.setNewSubscriber);
  const addSubscriberError = useNewsletterStore(state => state.addSubscriberError);
  const isAddingSubscriber = useNewsletterStore(state => state.isAddingSubscriber);
  const showUpdateOption = useNewsletterStore(state => state.showUpdateOption);
  const resetPagination = useNewsletterStore(state => state.resetPagination);
  const handleUndoDelete = useNewsletterStore(state => state.handleUndoDelete);
  const handleDeleteSubscriber = useNewsletterStore(state => state.handleDeleteSubscriber);
  const handleSubscriberSelect = useNewsletterStore(state => state.handleSubscriberSelect);
  const handleSelectAll = useNewsletterStore(state => state.handleSelectAll);
  const handleBulkDelete = useNewsletterStore(state => state.handleBulkDelete);
  const handleAddSubscriber = useNewsletterStore(state => state.handleAddSubscriber);
  const handleCloseAddModal = useNewsletterStore(state => state.handleCloseAddModal);
  const handleSubmitAddSubscriber = useNewsletterStore(state => state.handleSubmitAddSubscriber);
  const handleUpdateExistingSubscriber = useNewsletterStore(state => state.handleUpdateExistingSubscriber);
  const handlePageChange = useNewsletterStore(state => state.handlePageChange);
  const handleItemsPerPageChange = useNewsletterStore(state => state.handleItemsPerPageChange);
  const setSendingNewsletter = useNewsletterStore(state => state.setSendingNewsletter);

  useEffect(() => {
    const store = useNewsletterStore.getState();
    if (store.subscribers.length === 0 && !store.loading) {
      store.fetchData();
    }
  }, []);

  useEffect(() => {
    resetPagination();
  }, [searchTerm, filterStatus, filterCategory, showSoftDeleted, resetPagination]);

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
    stats,
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
    handleUndoDeleteSubmit: handleUndoDelete,
    handleDeleteSubscriberClick: handleDeleteSubscriber,
    handleSubscriberSelect,
    handleSelectAll,
    handleBulkDelete,
    handleEditSubscriber: () => console.log('Edit subscriber'),
    handleAddSubscriber,
    handleCloseAddModal,
    handleSubmitAddSubscriber,
    handleUpdateExistingSubscriber,
    handleManageCategories: () => console.log('Manage categories'),
    handleSendNewsletter: () => setSendingNewsletter(true),
    handlePageChange,
    handleItemsPerPageChange,
  };
};
