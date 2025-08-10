"use client";

import { memo } from "react";
import SubscriberList from "../../components/admin/newsletter/SubscriberList";
import SimpleControls from "../../components/admin/newsletter/SimpleControls";
import AddSubscriberModal from "../../components/admin/newsletter/modals/AddSubscriberModal";
import EditSubscriberModal from "../../components/admin/newsletter/modals/EditSubscriberModal";
import { useRouter } from "next/navigation";
// simplified view: stats/actions/recently-deleted removed
import NewsletterPageLayout from "../../components/admin/newsletter/NewsletterPageLayout";
import NewsletterLoading from "../../components/admin/newsletter/NewsletterLoading";
import { useNewsletterZustand } from "../../components/admin/newsletter/hooks/useNewsletterZustand";

const NewsletterPage = memo(function NewsletterPage() {
  const router = useRouter();
  const {
    // State
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    // showSoftDeleted,
    // setShowSoftDeleted,
    currentPage,
    itemsPerPage,
    // recentlyDeleted,
    // sendingNewsletter,
    subscribers,
    categories,
    loading,
    listLoading,
    selectedSubscribers,
    totalPages,
    totalCount,
    showAddModal,
    showEditModal,
    newSubscriber,
    setNewSubscriber,
    addSubscriberError,
    isAddingSubscriber,
    showUpdateOption,
    editingSubscriber,
    isEditing,
    editError,
    
    // Actions
    // handleUndoDeleteSubmit,
    handleDeleteSubscriberClick,
    handleSubscriberSelect,
    handleSelectAll,
    // handleBulkDelete,
    handleEditSubscriber,
    handleAddSubscriber,
    handleCloseAddModal,
    handleSubmitAddSubscriber,
    handleUpdateExistingSubscriber,
    handleCloseEditModal,
    handleSubmitEditSubscriber,
    // handleManageCategories,
    // handleSendNewsletter,
    handlePageChange,
    handleItemsPerPageChange,
    // fetchData,
  } = useNewsletterZustand();

  if (loading) {
    return <NewsletterLoading />;
  }

  return (
    <>
      <NewsletterPageLayout>
        <SimpleControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
          onAddSubscriber={handleAddSubscriber}
          onManageCategories={() => router.push('/admin/newsletter/categories')}
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

      <EditSubscriberModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        subscriber={editingSubscriber}
        categories={categories}
        onSubmit={handleSubmitEditSubscriber}
        isLoading={isEditing}
        error={editError}
      />
      
    </>
  );
});

export default NewsletterPage; 