"use client"

import { UseFormRegister } from "react-hook-form"
import { ReleaseFormValues, linkFields } from "./types"

interface ReleaseLinkFieldsProps {
  register: UseFormRegister<ReleaseFormValues>
}

export default function ReleaseLinkFields({ register }: ReleaseLinkFieldsProps) {
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
