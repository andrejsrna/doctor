"use client"

import { UseFormRegister } from "react-hook-form"
import { ReleaseFormValues, linkFields } from "./types"

interface ReleaseLinkFieldsProps {
  register: UseFormRegister<ReleaseFormValues>
}

const DEPRECATED_FIELDS: Array<keyof ReleaseFormValues> = ['junoDownload']

export default function ReleaseLinkFields({ register }: ReleaseLinkFieldsProps) {
  return (
    <>
      {linkFields.map((field) => {
        const isDeprecated = DEPRECATED_FIELDS.includes(field.key)
        return (
          <div key={String(field.key)}>
            <label className="text-sm text-gray-400">
              {field.label}
              {isDeprecated && (
                <span className="ml-2 text-xs text-amber-500 font-normal">— purchases ending, read-only for existing releases</span>
              )}
            </label>
            <input
              {...register(field.key)}
              disabled={isDeprecated}
              className={`w-full px-3 py-2 bg-black/50 border rounded ${
                isDeprecated
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                  : 'border-purple-500/30'
              }`}
              placeholder={isDeprecated ? 'Disabled — JunoDownload is shutting down' : `${field.label} URL`}
            />
          </div>
        )
      })}
    </>
  )
}
