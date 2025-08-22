"use client"

import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ReleaseFormValues } from "./types"

interface ReleaseEditDateFieldProps {
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
}

export default function ReleaseEditDateField({ setValue, watch }: ReleaseEditDateFieldProps) {
  const publishedAt = watch("publishedAt")

  return (
    <div className="md:col-span-2">
      <label className="text-sm text-gray-400">Published At</label>
      <input
        type="date"
        value={publishedAt ? new Date(publishedAt).toISOString().slice(0,10) : ""}
        onChange={(e) => setValue("publishedAt", e.target.value ? new Date(e.target.value + "T00:00:00Z").toISOString() : "", {shouldDirty: true})}
        className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
      />
    </div>
  )
}
