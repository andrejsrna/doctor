"use client"

import { useRouter } from "next/navigation"
import NextLink from "next/link"

interface ReleaseEditHeaderProps {
  isSaving: boolean
  isAutoSaving: boolean
  isDirty: boolean
  onSave: () => void
  slug?: string | null
}

export default function ReleaseEditHeader({ 
  isSaving, 
  isAutoSaving, 
  isDirty, 
  onSave, 
  slug 
}: ReleaseEditHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Edit Release</h1>
      <div className="flex gap-2">
        <div className="text-sm text-gray-400 flex items-center">
          {isSaving || isAutoSaving ? 'Saving…' : isDirty ? 'Unsaved changes' : 'Saved'}
        </div>
        {slug && (
          <NextLink 
            href={`/music/${slug}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-4 py-2 border border-purple-500/30 rounded"
          >
            View
          </NextLink>
        )}
        <button 
          onClick={() => router.push('/admin/releases')} 
          className="px-4 py-2 border border-purple-500/30 rounded"
        >
          Back
        </button>
        <button 
          onClick={onSave} 
          disabled={isSaving} 
          className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
