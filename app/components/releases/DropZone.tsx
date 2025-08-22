"use client"

import { RefObject } from "react"

interface DropZoneProps {
  label: string
  accept: string
  inputRef: RefObject<HTMLInputElement | null>
  value: string
  onChange: (v: string) => void
  onFile: (file: File) => void
}

export default function DropZone({
  label,
  accept,
  inputRef,
  value,
  onChange,
  onFile,
}: DropZoneProps) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
    >
      <label className="text-sm text-gray-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
      />
      <div className="mt-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = (e.target as HTMLInputElement).files?.[0]
            if (f) onFile(f)
          }}
        />
        <button 
          onClick={() => inputRef.current?.click()} 
          className="px-3 py-1 border border-purple-500/30 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  )
}
