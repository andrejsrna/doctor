"use client"

import { useState, useEffect } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ReleaseFormValues } from "./types"

interface ReleaseCategoriesProps {
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
}

export default function ReleaseCategories({ setValue, watch }: ReleaseCategoriesProps) {
  const [allCategories, setAllCategories] = useState<string[]>([])

  // Load categories once
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/releases/categories", {cache: "no-store"})
      if (res.ok) {
        const data = await res.json()
        setAllCategories(data?.categories || [])
      }
    })()
  }, [])

  const currentCategories = watch("categories") || []

  return (
    <div className="md:col-span-2">
      <label className="text-sm text-gray-400">Categories</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {currentCategories.map((category: string) => (
          <span key={category} className="text-xs px-2 py-1 rounded border border-purple-500/30 text-purple-300 flex items-center gap-2">
            {category}
            <button
              type="button"
              onClick={() => setValue("categories", currentCategories.filter((x: string) => x !== category), {shouldDirty: true})}
              className="text-gray-400 hover:text-red-300"
              aria-label={`Remove ${category}`}
            >×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <select
          onChange={(e) => {
            const v = e.target.value
            if (!v) return
            const next = Array.from(new Set([...currentCategories, v]))
            setValue("categories", next, {shouldDirty: true})
            e.currentTarget.value = ""
          }}
          className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
        >
          <option value="">Add category…</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          placeholder="New category"
          className="flex-1 px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = (e.currentTarget as HTMLInputElement).value.trim()
              if (v) {
                const next = Array.from(new Set([...currentCategories, v]))
                setValue("categories", next, {shouldDirty: true})
              }
              ;(e.currentTarget as HTMLInputElement).value = ""
            }
          }}
        />
      </div>
    </div>
  )
}
