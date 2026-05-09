"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { FaBook, FaCheckCircle, FaExternalLinkAlt, FaPlus, FaRocket, FaUserCircle } from "react-icons/fa"

type LabArtist = {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  progress: number
  taskSummary: { total: number; done: number; overdue: number }
  members: Array<{ user: { id: string; name: string; email: string; role: string } }>
  labTasks: Array<{ id: string; title: string; category: string; priority: string; status: string; dueAt?: string | null }>
  documents: Array<{ id: string; title: string; type: string; url?: string | null; isPinned: boolean }>
}

type Overview = {
  artists: LabArtist[]
  globalDocuments: Array<{ id: string; title: string; description?: string | null; type: string; url?: string | null; isPinned: boolean }>
  stats: { artists: number; members: number; tasks: number; completedTasks: number; overdueTasks: number; progress: number }
}

const defaultTask = { artistId: "", title: "", category: "Release Growth", priority: "NORMAL", dueAt: "", documentId: "" }
const defaultAccount = { artistId: "", name: "", email: "", password: "" }
const defaultDocument = { artistId: "", title: "", description: "", url: "", content: "", type: "NOTE", isPinned: false }
const fieldClass = "w-full border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-lime-300/60"

export default function ArtistLabAdminPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [taskForm, setTaskForm] = useState(defaultTask)
  const [accountForm, setAccountForm] = useState(defaultAccount)
  const [documentForm, setDocumentForm] = useState(defaultDocument)
  const [saving, setSaving] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    const response = await fetch("/api/admin/artist-lab/overview", { cache: "no-store" })
    if (!response.ok) {
      setError("Artist Lab could not be loaded")
      setLoading(false)
      return
    }
    setData(await response.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const artists = useMemo(() => data?.artists || [], [data?.artists])
  const firstArtistId = artists[0]?.id || ""

  useEffect(() => {
    if (!firstArtistId) return
    setTaskForm((current) => current.artistId ? current : { ...current, artistId: firstArtistId })
    setAccountForm((current) => current.artistId ? current : { ...current, artistId: firstArtistId })
  }, [firstArtistId])

  const selectedArtist = useMemo(() => {
    return artists.find((artist) => artist.id === taskForm.artistId) || artists[0]
  }, [artists, taskForm.artistId])

  async function submit(path: string, body: object, reset: () => void, label: string) {
    setSaving(label)
    setError("")
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving("")
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error || `${label} failed`)
      return
    }
    reset()
    await load()
  }

  if (loading) return <div className="px-6 py-16 text-center text-gray-400">Loading Artist Lab...</div>

  return (
    <div className="space-y-8 px-4">
      <header className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-lime-400/20 bg-[#090d0b] p-8">
          <div className="mb-8 flex items-center gap-3 text-lime-300">
            <FaRocket />
            <span className="text-sm uppercase tracking-[0.22em]">Artist Lab</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-5xl">
            Growth workspace for the roster.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-lime-100/65">
            Assign release missions, connect artist accounts and keep the operational playbook in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            ["Artists", data?.stats.artists || 0],
            ["Artist users", data?.stats.members || 0],
            ["Tasks", data?.stats.tasks || 0],
            ["Complete", `${data?.stats.progress || 0}%`],
          ].map(([label, value]) => (
            <div key={label} className="border border-white/10 bg-black/35 p-5">
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </header>

      {error && <div className="border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

      <section className="grid gap-5 xl:grid-cols-3">
        <form
          className="space-y-4 border border-white/10 bg-black/40 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            submit("/api/admin/artist-lab/accounts", accountForm, () => setAccountForm({ ...defaultAccount, artistId: firstArtistId }), "Account")
          }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><FaUserCircle /> Create artist access</h2>
          <SelectArtist value={accountForm.artistId} artists={artists} onChange={(artistId) => setAccountForm({ ...accountForm, artistId })} />
          <input required value={accountForm.name} onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} placeholder="Artist user name" className={fieldClass} />
          <input required type="email" value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} placeholder="email@artist.com" className={fieldClass} />
          <input required type="password" value={accountForm.password} onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })} placeholder="Temporary password" className={fieldClass} />
          <SubmitButton saving={saving === "Account"} label="Create access" />
        </form>

        <form
          className="space-y-4 border border-white/10 bg-black/40 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            submit("/api/admin/artist-lab/tasks", taskForm, () => setTaskForm({ ...defaultTask, artistId: firstArtistId }), "Task")
          }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><FaCheckCircle /> Assign task</h2>
          <SelectArtist value={taskForm.artistId} artists={artists} onChange={(artistId) => setTaskForm({ ...taskForm, artistId })} />
          <input required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" className={fieldClass} />
          <div className="grid grid-cols-2 gap-3">
            <input value={taskForm.category} onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })} placeholder="Category" className={fieldClass} />
            <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className={fieldClass}>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <select value={taskForm.documentId} onChange={(e) => setTaskForm({ ...taskForm, documentId: e.target.value })} className={fieldClass}>
            <option value="">No document checklist</option>
            {(data?.globalDocuments || []).map((doc) => <option key={doc.id} value={doc.id}>{doc.title}</option>)}
            {(selectedArtist?.documents || []).map((doc) => <option key={doc.id} value={doc.id}>{doc.title}</option>)}
          </select>
          <input type="date" value={taskForm.dueAt} onChange={(e) => setTaskForm({ ...taskForm, dueAt: e.target.value })} className={fieldClass} />
          <SubmitButton saving={saving === "Task"} label="Add task" />
        </form>

        <form
          className="space-y-4 border border-white/10 bg-black/40 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            submit("/api/admin/artist-lab/documents", { ...documentForm, artistId: documentForm.artistId || null }, () => setDocumentForm(defaultDocument), "Document")
          }}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><FaBook /> Add document</h2>
          <select value={documentForm.artistId} onChange={(e) => setDocumentForm({ ...documentForm, artistId: e.target.value })} className={fieldClass}>
            <option value="">All artists</option>
            {artists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
          </select>
          <input required value={documentForm.title} onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })} placeholder="Document title" className={fieldClass} />
          <input value={documentForm.description} onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })} placeholder="Short description" className={fieldClass} />
          <input value={documentForm.url} onChange={(e) => setDocumentForm({ ...documentForm, url: e.target.value })} placeholder="Optional external URL" className={fieldClass} />
          <textarea value={documentForm.content} onChange={(e) => setDocumentForm({ ...documentForm, content: e.target.value })} placeholder="Markdown content" rows={6} className={fieldClass} />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={documentForm.isPinned} onChange={(e) => setDocumentForm({ ...documentForm, isPinned: e.target.checked })} />
            Pin document
          </label>
          <SubmitButton saving={saving === "Document"} label="Add document" />
        </form>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {artists.map((artist) => (
            <div key={artist.id} className="border border-white/10 bg-black/35 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-white">{artist.name}</div>
                  <div className="text-xs text-gray-500">{artist.members.length} users / {artist.taskSummary.total} tasks</div>
                </div>
                <div className="text-2xl font-black text-lime-300">{artist.progress}%</div>
              </div>
              <div className="mt-4 h-2 bg-white/10">
                <div className="h-full bg-lime-300" style={{ width: `${artist.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="border border-white/10 bg-[#070707] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">{selectedArtist?.name || "Artist"} mission board</h2>
            <span className="text-sm text-gray-500">{selectedArtist?.taskSummary.done || 0} completed</span>
          </div>
          <div className="space-y-3">
            {(selectedArtist?.labTasks || []).slice(0, 10).map((task) => (
              <div key={task.id} className="grid gap-3 border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="font-semibold text-white">{task.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-500">{task.category} / {task.priority}</div>
                </div>
                <span className={task.status === "DONE" ? "text-lime-300" : "text-amber-300"}>{task.status}</span>
              </div>
            ))}
            {(selectedArtist?.labTasks || []).length === 0 && (
              <div className="border border-dashed border-white/15 p-8 text-center text-gray-500">No missions assigned yet.</div>
            )}
          </div>
        </div>
      </section>

      {(data?.globalDocuments || []).length > 0 && (
        <section className="border border-white/10 bg-black/30 p-6">
          <h2 className="mb-4 text-xl font-black text-white">Shared documents</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data?.globalDocuments.map((doc) => (
              <a key={doc.id} href={doc.url || "#"} target={doc.url ? "_blank" : undefined} rel={doc.url ? "noreferrer" : undefined} className="flex items-center justify-between border border-white/10 p-4 text-white hover:border-lime-300/50">
                <span>{doc.title}</span>
                {doc.url && <FaExternalLinkAlt className="text-lime-300" />}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SelectArtist({ value, artists, onChange }: { value: string; artists: LabArtist[]; onChange: (id: string) => void }) {
  return (
    <select required value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
      <option value="" disabled>Select artist</option>
      {artists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
    </select>
  )
}

function SubmitButton({ saving, label }: { saving: boolean; label: string }) {
  return (
    <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 bg-lime-300 px-4 py-3 font-black text-black disabled:opacity-60">
      <FaPlus /> {saving ? "Saving..." : label}
    </button>
  )
}
