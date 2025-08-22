"use client"

import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form"
import { ReleaseFormValues } from "./types"
import { slugify } from "./utils"

interface ReleaseEditBasicFieldsProps {
  register: UseFormRegister<ReleaseFormValues>
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
  errors: FieldErrors<ReleaseFormValues>
  slugEdited: boolean
  setSlugEdited: (edited: boolean) => void
}

export default function ReleaseEditBasicFields({
  register,
  setValue,
  watch,
  errors,
  slugEdited,
  setSlugEdited
}: ReleaseEditBasicFieldsProps) {


  return (
    <>
      <div className="md:col-span-2">
        <label className="text-sm text-gray-400">Title</label>
        <input
          {...register("title")}
          onChange={(e) => {
            const title = e.target.value
            setValue("title", title)
            if (!slugEdited) {
              setValue("slug", slugify(title))
            }
          }}
          className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
        />
        {errors.title && (
          <p className="text-xs text-red-300 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-400">Slug</label>
        <input
          {...register("slug")}
          onChange={(e) => { 
            setSlugEdited(true); 
            setValue("slug", e.target.value) 
          }}
          className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
        />
        {errors.slug && (
          <p className="text-xs text-red-300 mt-1">{errors.slug.message}</p>
        )}
      </div>
    </>
  )
}
