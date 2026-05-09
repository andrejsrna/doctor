"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { FaArrowLeft, FaCheck, FaExternalLinkAlt, FaRegCircle } from "react-icons/fa"
import MarkdownDocument from "@/app/components/artist-lab/MarkdownDocument"

type Task = {
  id: string
  title: string
  description?: string | null
  category: string
  priority: string
  status: string
}

type ArtistDocument = {
  id: string
  title: string
  description?: string | null
  content?: string | null
  url?: string | null
  tasks: Task[]
}

export default function ArtistDocumentPage() {
  const params = useParams<{ id: string }>()
  const [document, setDocument] = useState<ArtistDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")
  const documentId = params?.id

  const load = useCallback(async () => {
    if (!documentId) return
    setLoading(true)
    const response = await fetch(`/api/artist-lab/documents/${documentId}`, { cache: "no-store" })
    if (!response.ok) {
      setError("Document could not be loaded")
      setLoading(false)
      return
    }
    const payload = await response.json()
    setDocument(payload.document)
    setError("")
    setLoading(false)
  }, [documentId])

  useEffect(() => {
    load()
  }, [load])

  async function updateTask(task: Task, done: boolean) {
    setUpdatingId(task.id)
    const response = await fetch(`/api/artist-lab/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: done ? "DONE" : "TODO" }),
    })
    setUpdatingId("")
    if (!response.ok) {
      setError("Task could not be updated")
      return
    }
    await load()
  }

  if (loading) return <div className="px-6 py-16 text-center text-gray-400">Loading document...</div>
  if (error && !document) return <div className="mx-4 border border-red-500/30 bg-red-950/40 p-6 text-red-200">{error}</div>

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Link href="/admin/artist" className="inline-flex items-center gap-2 text-sm text-lime-300 hover:text-lime-200">
        <FaArrowLeft /> Back to workspace
      </Link>

      <header className="border border-lime-400/20 bg-[#080c0a] p-8">
        <div className="text-sm uppercase tracking-[0.22em] text-lime-300">Artist document</div>
        <h1 className="mt-4 text-4xl font-black text-white">{document?.title}</h1>
        {document?.description && <p className="mt-4 max-w-3xl text-sm leading-6 text-lime-100/65">{document.description}</p>}
        {document?.url && (
          <a href={document.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 bg-lime-300 px-4 py-3 font-black text-black">
            Open external resource <FaExternalLinkAlt />
          </a>
        )}
      </header>

      {error && <div className="border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="border border-white/10 bg-black/35 p-7">
          <MarkdownDocument content={document?.content || "No content has been added yet."} />
        </div>

        <aside className="border border-white/10 bg-[#070707] p-5">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">Checklist</div>
          <div className="space-y-3">
            {(document?.tasks || []).map((task) => {
              const done = task.status === "DONE"
              return (
                <button
                  key={task.id}
                  onClick={() => updateTask(task, !done)}
                  disabled={updatingId === task.id}
                  className={`w-full border p-4 text-left transition ${done ? "border-lime-300/30 bg-lime-300/5" : "border-white/10 bg-white/[0.03] hover:border-lime-300/45"}`}
                >
                  <span className="flex items-start gap-3">
                    <span className="pt-1 text-lime-300">{done ? <FaCheck /> : <FaRegCircle />}</span>
                    <span>
                      <span className="block font-semibold text-white">{task.title}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-gray-500">{updatingId === task.id ? "Saving" : task.status}</span>
                    </span>
                  </span>
                </button>
              )
            })}
            {(document?.tasks || []).length === 0 && (
              <div className="border border-dashed border-white/15 p-5 text-sm text-gray-500">Checklist tasks will appear here once assigned.</div>
            )}
          </div>
        </aside>
      </section>
    </div>
  )
}
