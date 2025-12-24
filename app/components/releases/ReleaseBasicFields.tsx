"use client"

import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form"
import { ReleaseFormValues } from "./types"

interface ReleaseBasicFieldsProps {
  register: UseFormRegister<ReleaseFormValues>
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
  errors: FieldErrors<ReleaseFormValues>
  slugEdited: boolean
  setSlugEdited: (edited: boolean) => void
}

export default function ReleaseBasicFields({
  register,
  setValue,
  watch,
  errors,
  setSlugEdited
}: ReleaseBasicFieldsProps) {
  const releaseType = watch("releaseType")
  return (
    <>
      <div className="md:col-span-2">
        <label className="text-sm text-gray-400">Title *</label>
        <input
          {...register("title")}
          className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          placeholder="Enter release title"
        />
        {errors.title && (
          <p className="text-xs text-red-300 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-400">Slug *</label>
        <input
          {...register("slug")}
          onChange={(e) => { 
            setSlugEdited(true); 
            setValue("slug", e.target.value) 
          }}
          className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          placeholder="release-slug"
        />
        {errors.slug && (
          <p className="text-xs text-red-300 mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-400">Release type</label>
        <select
          {...register("releaseType")}
          className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
        >
          <option value="NORMAL">Normal</option>
          <option value="FREE_DOWNLOAD">Free download</option>
        </select>
        {releaseType === "FREE_DOWNLOAD" && (
          <p className="text-xs text-gray-400 mt-1">Frontend shows email form instead of streaming/purchase buttons.</p>
        )}
      </div>
    </>
  )
}
