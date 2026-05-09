"use client"

import Link from "next/link"
import { DragEvent, useCallback, useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaCloudUploadAlt, FaCopy, FaExternalLinkAlt, FaFolderOpen, FaMusic } from "react-icons/fa"

type UploadedFile = {
  name: string
  size: number
  type: string
  key: string
  url: string | null
  uploadedAt?: string | null
}

type UploadProgress = {
  fileName: string
  totalParts: number
  doneParts: number
}

const MULTIPART_THRESHOLD = 100 * 1024 * 1024
const PART_SIZE = 50 * 1024 * 1024

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

export default function ArtistSharePage() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(true)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [progress, setProgress] = useState<UploadProgress | null>(null)

  const loadFiles = useCallback(async () => {
    setLoadingFiles(true)
    const response = await fetch("/api/artist-lab/share/files", { cache: "no-store" })
    setLoadingFiles(false)

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      setError(payload?.error || "Files could not be loaded")
      return
    }

    setFiles(payload?.files || [])
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  async function uploadSmall(file: File) {
    const presignResponse = await fetch("/api/artist-lab/share/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, size: file.size, type: file.type || "application/octet-stream" }),
    })

    const presignPayload = await presignResponse.json().catch(() => null)
    if (!presignResponse.ok) throw new Error(presignPayload?.error || `Upload could not start for ${file.name}`)

    const uploadResponse = await fetch(presignPayload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    })

    if (!uploadResponse.ok) throw new Error(`Upload failed for ${file.name}. R2 returned ${uploadResponse.status}.`)
  }

  async function uploadMultipart(file: File) {
    const initResponse = await fetch("/api/artist-lab/share/multipart/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, size: file.size, type: file.type || "application/octet-stream" }),
    })

    const initPayload = await initResponse.json().catch(() => null)
    if (!initResponse.ok) throw new Error(initPayload?.error || `Multipart init failed for ${file.name}`)

    const { uploadId, key, parts } = initPayload as {
      uploadId: string
      key: string
      parts: { partNumber: number; url: string }[]
    }

    setProgress({ fileName: file.name, totalParts: parts.length, doneParts: 0 })

    const completedParts: { PartNumber: number; ETag: string }[] = []

    for (const { partNumber, url } of parts) {
      const start = (partNumber - 1) * PART_SIZE
      const chunk = file.slice(start, start + PART_SIZE)

      const partResponse = await fetch(url, { method: "PUT", body: chunk })
      if (!partResponse.ok) throw new Error(`Part ${partNumber} upload failed for ${file.name}`)

      const etag = partResponse.headers.get("ETag")
      if (!etag) throw new Error(`Missing ETag for part ${partNumber} of ${file.name}`)

      completedParts.push({ PartNumber: partNumber, ETag: etag })
      setProgress(prev => prev ? { ...prev, doneParts: partNumber } : null)
    }

    const completeResponse = await fetch("/api/artist-lab/share/multipart/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, uploadId, parts: completedParts }),
    })

    const completePayload = await completeResponse.json().catch(() => null)
    if (!completeResponse.ok) throw new Error(completePayload?.error || `Could not finalize upload for ${file.name}`)
  }

  async function upload(selected: FileList | File[]) {
    const list = Array.from(selected)
    if (!list.length) return

    setUploading(true)
    setError("")
    setProgress(null)
    try {
      for (const file of list) {
        if (file.size >= MULTIPART_THRESHOLD) {
          await uploadMultipart(file)
        } else {
          await uploadSmall(file)
        }
      }
      await loadFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setProgress(null)
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    upload(event.dataTransfer.files)
  }

  async function copy(value: string | null) {
    if (!value) return
    await navigator.clipboard.writeText(value)
  }

  const progressPct = progress
    ? Math.round((progress.doneParts / progress.totalParts) * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Link href="/admin/artist" className="inline-flex items-center gap-2 text-sm text-lime-300 hover:text-lime-200">
        <FaArrowLeft /> Back to workspace
      </Link>

      <header className="border border-lime-400/20 bg-[#080c0a] p-8">
        <div className="mb-5 flex items-center gap-3 text-lime-300">
          <FaFolderOpen />
          <span className="text-sm uppercase tracking-[0.24em]">Sharing is caring</span>
        </div>
        <h1 className="text-4xl font-black text-white md:text-5xl">Shared sample drop</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-lime-100/65">
          Upload samples, loops, project snippets, artwork refs or promo assets for the DnB Doctor crew. Keep it useful, labeled and ready for others to understand.
        </p>
      </header>

      {error && <div className="border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

      <section
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border p-10 text-center transition ${dragging ? "border-lime-300 bg-lime-300/10" : "border-dashed border-white/20 bg-black/35"}`}
      >
        <FaCloudUploadAlt className="mx-auto mb-5 text-5xl text-lime-300" />
        <h2 className="text-2xl font-black text-white">Drop files here</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
          Audio, video, images or zip packs. Max 10 files at once, 5GB per file. Use clear file names like <span className="text-lime-200">artist-loop-174bpm.wav</span>.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-6 inline-flex items-center gap-2 bg-lime-300 px-5 py-3 font-black text-black disabled:opacity-60"
        >
          <FaMusic /> {uploading ? "Uploading..." : "Choose files"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="audio/*,video/*,image/*,.zip"
          onChange={(event) => {
            if (event.target.files) upload(event.target.files)
            event.currentTarget.value = ""
          }}
        />

        {uploading && progress && (
          <div className="mx-auto mt-6 max-w-sm space-y-2">
            <div className="text-xs text-gray-400 truncate">{progress.fileName}</div>
            <div className="h-1.5 w-full overflow-hidden bg-white/10">
              <div
                className="h-full bg-lime-300 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{progress.doneParts} / {progress.totalParts} parts</div>
          </div>
        )}

        {uploading && !progress && (
          <p className="mt-4 text-sm text-gray-500">Uploading...</p>
        )}
      </section>

      <section className="border border-white/10 bg-black/35 p-6">
        <h2 className="mb-4 text-xl font-black text-white">Uploaded links</h2>
        <div className="space-y-3">
          {loadingFiles && <div className="text-sm text-gray-500">Loading shared files...</div>}
          {files.map((file) => (
            <div key={`${file.key}-${file.name}`} className="grid gap-3 border border-white/10 p-4 md:grid-cols-[1fr_auto]">
              <div>
                <div className="font-semibold text-white">{file.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-500">{formatSize(file.size)} / {file.type}</div>
                {file.uploadedAt && <div className="mt-1 text-xs text-gray-600">{new Date(file.uploadedAt).toLocaleString()}</div>}
                <div className="mt-2 break-all text-sm text-gray-400">{file.url || file.key}</div>
              </div>
              <div className="flex items-center gap-2">
                {file.url && (
                  <a href={file.url} target="_blank" rel="noreferrer" className="border border-white/10 p-3 text-lime-300 hover:border-lime-300/50" aria-label={`Open ${file.name}`}>
                    <FaExternalLinkAlt />
                  </a>
                )}
                <button type="button" onClick={() => copy(file.url || file.key)} className="border border-white/10 p-3 text-lime-300 hover:border-lime-300/50" aria-label={`Copy link for ${file.name}`}>
                  <FaCopy />
                </button>
              </div>
            </div>
          ))}
          {!loadingFiles && files.length === 0 && <div className="text-sm text-gray-500">Uploaded files will appear here with shareable links.</div>}
        </div>
      </section>
    </div>
  )
}
