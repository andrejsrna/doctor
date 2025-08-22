"use client"

import { useRouter } from "next/navigation"

interface ReleaseHeaderProps {
  isSubmitting: boolean
  onSubmit: () => void
}

export default function ReleaseHeader({ isSubmitting, onSubmit }: ReleaseHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Create New Release</h1>
      <div className="flex gap-2">
        <button 
          onClick={() => router.push("/admin/releases")} 
          className="px-4 py-2 border border-purple-500/30 rounded"
        >
          Back
        </button>
        <button 
          onClick={onSubmit} 
          disabled={isSubmitting} 
          className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded"
        >
          {isSubmitting ? "Creating..." : "Create Release"}
        </button>
      </div>
    </header>
  )
}
