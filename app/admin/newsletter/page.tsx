"use client";

import { memo, useCallback, useState } from "react";
import SubscriberList from "../../components/admin/newsletter/SubscriberList";
import SimpleControls from "../../components/admin/newsletter/SimpleControls";
import AddSubscriberModal from "../../components/admin/newsletter/modals/AddSubscriberModal";
import EditSubscriberModal from "../../components/admin/newsletter/modals/EditSubscriberModal";
import { useRouter } from "next/navigation";
// simplified view: stats/actions/recently-deleted removed
import NewsletterPageLayout from "../../components/admin/newsletter/NewsletterPageLayout";
import NewsletterLoading from "../../components/admin/newsletter/NewsletterLoading";
import { useNewsletterZustand } from "../../components/admin/newsletter/hooks/useNewsletterZustand";
import SendCustomNewsletterModal from "../../components/admin/newsletter/modals/SendCustomNewsletterModal";
import { useNewsletterActions } from "../../components/admin/newsletter/hooks/useNewsletterActions";
import toast from "react-hot-toast";
import type { Subscriber, NewsletterTemplateOption } from "../../components/admin/newsletter/types";

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
    fetchData,
  } = useNewsletterZustand();
  const { handleSendNewsletter, sending: sendingNewsletter } = useNewsletterActions();
  const [showSendModal, setShowSendModal] = useState(false);

  const handleOpenSendModal = useCallback(() => {
    setShowSendModal(true);
  }, []);

  const handleCloseSendModal = useCallback(() => {
    setShowSendModal(false);
  }, []);

  const handleSendCustomNewsletter = useCallback(async ({ template, categoryIds, manualEmails }: { template: NewsletterTemplateOption; categoryIds: string[]; manualEmails: string[]; }) => {
    if (categoryIds.length === 0 && manualEmails.length === 0) {
      toast.error("Add manual recipients or select at least one category.");
      return;
    }

    const uniqueRecipients = new Map<string, Subscriber>();

    try {
      for (const categoryId of categoryIds) {
        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: "200",
            search: "",
            status: "all",
            category: categoryId,
            includeInfluencers: "1",
            showSoftDeleted: "false",
            t: Date.now().toString(),
          });

          const response = await fetch(`/api/admin/newsletter/subscribers?${params.toString()}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
            },
          });

          if (!response.ok) {
            toast.error("Failed to load subscribers for the selected categories.");
            return;
          }

          const data = await response.json();

          if (!data.success) {
            toast.error(data.error || "Failed to prepare newsletter recipients.");
            return;
          }

          const fetchedSubscribers: Subscriber[] = data.subscribers || [];
          fetchedSubscribers.forEach((subscriber) => {
            uniqueRecipients.set(subscriber.email.toLowerCase(), subscriber);
          });

          hasNextPage = Boolean(data.pagination?.hasNextPage);
          currentPage += 1;
        }
      }
    } catch (error) {
      console.error("Error preparing custom newsletter recipients", error);
      toast.error("Something went wrong while preparing the recipients.");
      return;
    }

    if (manualEmails.length > 0) {
      const normalizedManualEmails = Array.from(new Set(manualEmails.map((email) => email.toLowerCase())));
      const notFound: string[] = [];

      try {
        for (const email of normalizedManualEmails) {
          const params = new URLSearchParams({
            page: "1",
            limit: "25",
            search: email,
            status: "all",
            includeInfluencers: "1",
            showSoftDeleted: "false",
            t: Date.now().toString(),
          });

          const response = await fetch(`/api/admin/newsletter/subscribers?${params.toString()}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
            },
          });

          if (!response.ok) {
            notFound.push(email);
            continue;
          }

          const data = await response.json();
          if (!data.success) {
            notFound.push(email);
            continue;
          }

          const fetchedSubscribers: Subscriber[] = data.subscribers || [];
          const exact = fetchedSubscribers.find((subscriber) => subscriber.email.toLowerCase() === email);

          if (exact) {
            uniqueRecipients.set(exact.email.toLowerCase(), exact);
          } else {
            notFound.push(email);
          }
        }
      } catch (error) {
        console.error("Error resolving manual recipients", error);
        toast.error("Unable to resolve some manual recipients. Please try again.");
        return;
      }

      if (notFound.length > 0) {
        toast.error(`These recipients are not subscribed: ${notFound.join(", ")}`);
        if (uniqueRecipients.size === 0 && categoryIds.length === 0) {
          return;
        }
      }
    }

    const recipients = Array.from(uniqueRecipients.values());

    if (recipients.length === 0) {
      toast.error("No matching subscribers found. Check your categories or manual emails.");
      return;
    }

    const result = await handleSendNewsletter(recipients, {
      subject: template.subject,
      message: template.body,
      template: template.id,
    });

    if (result?.success) {
      setShowSendModal(false);
      await fetchData(true);
    }
  }, [fetchData, handleSendNewsletter]);

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
          onViewTemplates={() => router.push('/admin/newsletter/templates')}
          onSendCustomNewsletter={handleOpenSendModal}
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
      <SendCustomNewsletterModal
        isOpen={showSendModal}
        onClose={handleCloseSendModal}
        onSend={handleSendCustomNewsletter}
        categories={categories}
        initialSelectedCategoryIds={[]}
        isSending={sendingNewsletter}
      />
      
    </>
  );
});

export default NewsletterPage; 
