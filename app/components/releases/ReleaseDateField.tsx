"use client"

import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ReleaseFormValues } from "./types"

interface ReleaseDateFieldProps {
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
}

export default function ReleaseDateField({ setValue, watch }: ReleaseDateFieldProps) {
  return (
    <div className="md:col-span-2">
      <label className="text-sm text-gray-400">Published At</label>
      <input
        type="date"
        value={watch("publishedAt") || ""}
        onChange={(e) => setValue("publishedAt", e.target.value || "", {shouldDirty: true})}
        className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
      />
    </div>
  )
}
