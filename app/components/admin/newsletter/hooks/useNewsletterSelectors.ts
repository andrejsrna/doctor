import { useNewsletterStore } from '../store/newsletterStore';

export const useNewsletterStats = () => {
  return useNewsletterStore((state) => state.stats);
};

export const useNewsletterLoading = () => {
  return useNewsletterStore((state) => ({
    loading: state.loading,
    listLoading: state.listLoading,
    isAddingSubscriber: state.isAddingSubscriber,
    sendingNewsletter: state.sendingNewsletter
  }));
};

export const useNewsletterFilters = () => {
  return useNewsletterStore((state) => ({
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
    filterStatus: state.filterStatus,
    setFilterStatus: state.setFilterStatus,
    filterCategory: state.filterCategory,
    setFilterCategory: state.setFilterCategory,
    showSoftDeleted: state.showSoftDeleted,
    setShowSoftDeleted: state.setShowSoftDeleted
  }));
};

export const useNewsletterPagination = () => {
  return useNewsletterStore((state) => ({
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalCount: state.totalCount,
    itemsPerPage: state.itemsPerPage,
    handlePageChange: state.handlePageChange,
    handleItemsPerPageChange: state.handleItemsPerPageChange
  }));
};

export const useNewsletterSubscribers = () => {
  return useNewsletterStore((state) => ({
    subscribers: state.subscribers,
    categories: state.categories,
    selectedSubscribers: state.selectedSubscribers,
    handleSubscriberSelect: state.handleSubscriberSelect,
    handleSelectAll: state.handleSelectAll,
    handleDeleteSubscriber: state.handleDeleteSubscriber,
    handleBulkDelete: state.handleBulkDelete
  }));
};

export const useNewsletterModal = () => {
  return useNewsletterStore((state) => ({
    showAddModal: state.showAddModal,
    newSubscriber: state.newSubscriber,
    setNewSubscriber: state.setNewSubscriber,
    addSubscriberError: state.addSubscriberError,
    isAddingSubscriber: state.isAddingSubscriber,
    showUpdateOption: state.showUpdateOption,
    handleAddSubscriber: state.handleAddSubscriber,
    handleCloseAddModal: state.handleCloseAddModal,
    handleSubmitAddSubscriber: state.handleSubmitAddSubscriber,
    handleUpdateExistingSubscriber: state.handleUpdateExistingSubscriber
  }));
};
