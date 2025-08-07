"use client";

import { memo } from "react";
import SubscriberList from "../../components/admin/newsletter/SubscriberList";
import NewsletterControls from "../../components/admin/newsletter/NewsletterControls";
import AddSubscriberModal from "../../components/admin/newsletter/modals/AddSubscriberModal";
import NewsletterStats from "../../components/admin/newsletter/NewsletterStats";
import NewsletterActions from "../../components/admin/newsletter/NewsletterActions";
import RecentlyDeletedNotifications from "../../components/admin/newsletter/RecentlyDeletedNotifications";
import NewsletterPageLayout from "../../components/admin/newsletter/NewsletterPageLayout";
import NewsletterLoading from "../../components/admin/newsletter/NewsletterLoading";
import { useNewsletterZustand } from "../../components/admin/newsletter/hooks/useNewsletterZustand";

const NewsletterPage = memo(function NewsletterPage() {
  const {
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
  } = useNewsletterZustand();

  if (loading) {
    return <NewsletterLoading />;
  }

  return (
    <>
      <NewsletterPageLayout>
        <NewsletterStats />
        
        <NewsletterActions
          onAddSubscriber={handleAddSubscriber}
          onSendNewsletter={handleSendNewsletter}
          sendingNewsletter={sendingNewsletter}
        />

        <NewsletterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          showSoftDeleted={showSoftDeleted}
          setShowSoftDeleted={setShowSoftDeleted}
          categories={categories}
          selectedSubscribersCount={selectedSubscribers.length}
          onAddSubscriber={handleAddSubscriber}
          onManageCategories={handleManageCategories}
          onSendNewsletter={handleSendNewsletter}
          onBulkDelete={handleBulkDelete}
        />

        <SubscriberList
          subscribers={subscribers}
          categories={categories}
          loading={listLoading}
          selectedSubscribers={selectedSubscribers}
          onSubscriberSelect={handleSubscriberSelect}
          onSelectAll={handleSelectAll}
          onEditSubscriber={handleEditSubscriber}
          onDeleteSubscriber={handleDeleteSubscriberClick}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </NewsletterPageLayout>

      <RecentlyDeletedNotifications
        recentlyDeleted={recentlyDeleted}
        onUndoDelete={handleUndoDeleteSubmit}
      />

      <AddSubscriberModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        categories={categories}
        newSubscriber={newSubscriber}
        setNewSubscriber={setNewSubscriber}
        onSubmit={handleSubmitAddSubscriber}
        onUpdateExisting={handleUpdateExistingSubscriber}
        error={addSubscriberError}
        isLoading={isAddingSubscriber}
        showUpdateOption={showUpdateOption}
      />
    </>
  );
});

export default NewsletterPage; 