'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // noop: place to wire client-side logging if needed
  }, [error])

  return (
    <div className="min-h-[60vh] grid place-items-center px-4 py-16 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">The release failed to load. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}


