"use client"

import { UseFormRegister } from "react-hook-form"
import { ReleaseFormValues, linkFields } from "./types"

interface ReleaseEditLinkFieldsProps {
  register: UseFormRegister<ReleaseFormValues>
}

export default function ReleaseEditLinkFields({ register }: ReleaseEditLinkFieldsProps) {
  return (
    <>
      {linkFields.map((field) => (
        <div key={String(field.key)}>
          <label className="text-sm text-gray-400">{field.label}</label>
          <input
            {...register(field.key)}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
            placeholder={`${field.label} URL`}
          />
        </div>
      ))}
    </>
  )
}
