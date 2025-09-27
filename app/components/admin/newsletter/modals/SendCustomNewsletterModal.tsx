"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEnvelopeOpenText, FaCheckCircle, FaListUl } from "react-icons/fa";
import type { Category, NewsletterTemplateOption } from "../types";
import { NEWSLETTER_TEMPLATE_OPTIONS } from "../constants/templates";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SendCustomNewsletterModalProps {
  isOpen: boolean;
  categories: Category[];
  initialSelectedCategoryIds?: string[];
  initialManualRecipients?: string;
  isSending: boolean;
  onClose: () => void;
  onSend: (payload: { template: NewsletterTemplateOption; categoryIds: string[]; manualEmails: string[] }) => void;
}

export default function SendCustomNewsletterModal({
  isOpen,
  categories,
  initialSelectedCategoryIds = [],
  initialManualRecipients = "",
  isSending,
  onClose,
  onSend,
}: SendCustomNewsletterModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    NEWSLETTER_TEMPLATE_OPTIONS[0]?.id || ""
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialSelectedCategoryIds);
  const [manualRecipients, setManualRecipients] = useState<string>(initialManualRecipients);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryIds(initialSelectedCategoryIds);
      setManualRecipients(initialManualRecipients);
    }
  }, [initialManualRecipients, initialSelectedCategoryIds, isOpen]);

  const selectedTemplate = useMemo(
    () => NEWSLETTER_TEMPLATE_OPTIONS.find((template) => template.id === selectedTemplateId) || null,
    [selectedTemplateId]
  );

  const manualRecipientEmails = useMemo(() =>
    manualRecipients
      .split(/[\s,;]+/)
      .map((email) => email.trim())
      .filter(Boolean),
  [manualRecipients]);

  const validManualEmails = useMemo(
    () => manualRecipientEmails.filter((email) => EMAIL_PATTERN.test(email)),
    [manualRecipientEmails]
  );

  const invalidManualEmails = useMemo(
    () => manualRecipientEmails.filter((email) => !EMAIL_PATTERN.test(email)),
    [manualRecipientEmails]
  );

  const canSend = Boolean(selectedTemplate && (selectedCategoryIds.length > 0 || validManualEmails.length > 0));

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategoryIds(categories.map((category) => category.id));
  };

  const handleClearCategories = () => {
    setSelectedCategoryIds([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl border border-purple-500/30 bg-black/90 p-6 shadow-2xl flex max-h-[90vh] flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Send a Custom Newsletter</h3>
              <p className="text-sm text-gray-400">
                Choose a template, mix manual recipients, or select whole categories for delivery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {NEWSLETTER_TEMPLATE_OPTIONS.map((template) => {
              const isSelected = template.id === selectedTemplateId;
              return (
                <label
                  key={template.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-green-400/60 bg-green-900/20"
                      : "border-purple-500/20 bg-black/40 hover:border-purple-400/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="newsletter-template"
                    value={template.id}
                    checked={isSelected}
                    onChange={() => setSelectedTemplateId(template.id)}
                    className="mt-1 h-4 w-4 text-purple-500 focus:ring-purple-500"
                  />
                  <div className="grow space-y-2">
                    <div className="flex items-center gap-2">
                      <FaEnvelopeOpenText className="h-4 w-4 text-purple-300" />
                      <span className="text-lg font-semibold text-white">{template.name}</span>
                      {isSelected && (
                        <FaCheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{template.description}</p>
                    <div className="rounded border border-purple-500/20 bg-black/40 p-3 text-xs text-gray-300">
                      <p className="mb-1 text-purple-200 text-sm">Subject: {template.subject}</p>
                      <p className="text-gray-400">Preview: {template.preview}</p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-black/60 p-4">
            <label className="block text-sm font-semibold text-purple-200 mb-2">
              Manual recipients
            </label>
            <textarea
              value={manualRecipients}
              onChange={(event) => setManualRecipients(event.target.value)}
              rows={3}
              placeholder="email1@example.com, email2@example.com"
              className="w-full rounded-lg border border-purple-500/30 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="mt-2 text-xs text-gray-400">
              Separate emails with commas, spaces, or new lines. Only subscribers already in the system will be sent to.
            </p>
            {invalidManualEmails.length > 0 && (
              <p className="mt-2 text-xs text-red-300">
                Invalid addresses will be ignored: {invalidManualEmails.join(", ")}
              </p>
            )}
            {validManualEmails.length > 0 && (
              <p className="mt-2 text-xs text-green-300">
                {validManualEmails.length} valid email{validManualEmails.length === 1 ? "" : "s"} detected.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-black/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white">
                <FaListUl className="h-4 w-4 text-purple-300" />
                <span className="font-semibold">Target Categories</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllCategories}
                  className="rounded bg-purple-900/40 px-3 py-1 text-purple-200 transition hover:bg-purple-900/60"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={handleClearCategories}
                  className="rounded bg-gray-900/50 px-3 py-1 text-gray-300 transition hover:bg-gray-900/70"
                >
                  Clear
                </button>
              </div>
            </div>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400">No newsletter categories available yet. Create one to start targeting subscribers.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {categories.map((category) => {
                  const checked = selectedCategoryIds.includes(category.id);
                  return (
                    <label
                      key={category.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                        checked
                          ? "border-green-400/60 bg-green-900/20"
                          : "border-purple-500/20 bg-black/40 hover:border-purple-400/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(category.id)}
                        className="mt-1 h-4 w-4 text-purple-500 focus:ring-purple-500"
                      />
                      <div>
                        <p className="font-semibold text-white">{category.name}</p>
                        {category.description && (
                          <p className="text-xs text-gray-400">{category.description}</p>
                        )}
                        <p className="text-xs text-purple-200">{category.subscriberCount} subscribers</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900/50 px-5 py-2 text-gray-300 transition-colors duration-200 hover:bg-gray-900/70"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSend || isSending}
            onClick={() => selectedTemplate && onSend({ template: selectedTemplate, categoryIds: selectedCategoryIds, manualEmails: validManualEmails })}
            className="flex items-center gap-2 rounded-lg bg-green-900/60 px-5 py-2 text-green-200 transition-colors duration-200 hover:bg-green-900/80 disabled:opacity-50"
          >
            {isSending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-200 border-t-transparent" />
            ) : (
              <FaEnvelopeOpenText className="h-4 w-4" />
            )}
            {isSending ? "Sending..." : "Send Newsletter"}
          </button>
        </div>
      </div>
    </div>
  );
}
