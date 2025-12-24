"use client"

import { useRef } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { uploadFile, uploadFileWithMeta } from "./utils"
import { ReleaseFormValues } from "./types"
import DropZone from "./DropZone"

interface ReleaseEditUploadFieldsProps {
  setValue: UseFormSetValue<ReleaseFormValues>
  watch: UseFormWatch<ReleaseFormValues>
}

export default function ReleaseEditUploadFields({ setValue, watch }: ReleaseEditUploadFieldsProps) {
  const coverInputRef = useRef<HTMLInputElement>(null)
  const previewInputRef = useRef<HTMLInputElement>(null)
  const downloadInputRef = useRef<HTMLInputElement>(null)
  const slug = watch("slug")

  // Upload handlers
  const handleUpload = async (file: File, kind: "cover"|"preview") => {
    try {
      const url = await uploadFile({file, kind, slug: slug || ""})
      if (kind === "cover") setValue("coverImageUrl", url, {shouldDirty: true})
      if (kind === "preview") setValue("previewUrl", url, {shouldDirty: true})
    } catch (error: unknown) {
      const e = error as Error
      throw new Error(e?.message || "Upload failed")
    }
  }

  const handleDownloadUpload = async (file: File) => {
    const { url, key } = await uploadFileWithMeta({ file, kind: "download", slug: slug || "" })
    setValue("downloadFileUrl", url || "", { shouldDirty: true })
    setValue("downloadFileKey", key || "", { shouldDirty: true })
    setValue("downloadFileName", file.name || "", { shouldDirty: true })
  }

  const isFreeDownload = watch("releaseType") === "FREE_DOWNLOAD"

  return (
    <>
      <DropZone 
        label="Cover Image URL" 
        accept="image/*" 
        inputRef={coverInputRef}
        value={watch("coverImageUrl") || ""}
        onChange={(v: string) => setValue("coverImageUrl", v, {shouldDirty: true})}
        onFile={(f: File) => handleUpload(f, "cover")} 
      />

      <DropZone 
        label="Preview URL" 
        accept="audio/*,video/*" 
        inputRef={previewInputRef}
        value={watch("previewUrl") || ""}
        onChange={(v: string) => setValue("previewUrl", v, {shouldDirty: true})}
        onFile={(f: File) => handleUpload(f, "preview")} 
      />

      {isFreeDownload && (
        <div>
          <DropZone
            label="Free download file (upload)"
            accept="*/*"
            inputRef={downloadInputRef}
            value={watch("downloadFileUrl") || ""}
            onChange={(v: string) => setValue("downloadFileUrl", v, { shouldDirty: true })}
            onFile={handleDownloadUpload}
          />
          <div className="mt-2 text-xs text-gray-400">
            <div>Stored key: <span className="text-gray-300">{watch("downloadFileKey") || "—"}</span></div>
            <div>Filename: <span className="text-gray-300">{watch("downloadFileName") || "—"}</span></div>
          </div>
        </div>
      )}
    </>
  )
}
