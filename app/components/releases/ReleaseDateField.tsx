"use client"

import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import DatePicker from "react-datepicker"

import { formatDateForForm, parseDateFromForm } from "./utils"
import { ReleaseFormValues } from "./types"

import "react-datepicker/dist/react-datepicker.css"
import "@/app/styles/react-datepicker.css"

interface ReleaseDateFieldProps {
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
}

export default function ReleaseDateField({ setValue, watch }: ReleaseDateFieldProps) {
  const publishedAt = watch("publishedAt")
  const selectedDate = parseDateFromForm(publishedAt)

  return (
    <div className="md:col-span-2 space-y-1">
      <label className="text-sm text-gray-400">Published At</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => (
          setValue("publishedAt", formatDateForForm(date), { shouldDirty: true })
        )}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select publish date"
        className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-gray-100 focus:outline-none focus:border-purple-400"
        wrapperClassName="w-full"
        popperClassName="admin-datepicker-popper"
        showPopperArrow={false}
        isClearable
      />
    </div>
  )
}
