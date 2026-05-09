"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FaBookOpen, FaCheck, FaCloudUploadAlt, FaDiscord, FaEnvelope, FaExternalLinkAlt, FaInstagram, FaPhoneAlt, FaRegCircle, FaRocket, FaUsers } from "react-icons/fa"

type Task = {
  id: string
  title: string
  description?: string | null
  category: string
  priority: string
  status: string
  dueAt?: string | null
}

type Document = {
  id: string
  title: string
  description?: string | null
  type: string
  url?: string | null
  content?: string | null
  isPinned: boolean
}

type ArtistLabData = {
  membership: {
    artist: {
      name: string
      slug: string
      labTasks: Task[]
      documents: Document[]
      releasePlans: Array<{ id: string; name: string; status: string; releaseDate?: string | null; tasks: Task[] }>
    }
  }
  globalDocuments: Document[]
  progress: number
}

const defaultDocumentOrder = [
  "artist-onboarding-default",
  "artist-profile-setup-default",
  "release-week-action-plan-default",
  "content-ideas-for-producers-default",
  "short-video-basics-default",
  "assets-we-need-from-you-default",
  "how-to-share-without-spamming-default",
  "monthly-artist-growth-routine-default",
  "fan-engagement-basics-default",
]

export default function ArtistWorkspacePage() {
  const [data, setData] = useState<ArtistLabData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    const response = await fetch("/api/artist-lab/me", { cache: "no-store" })
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error || "Artist workspace could not be loaded")
      setLoading(false)
      return
    }
    setData(await response.json())
    setError("")
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const artist = data?.membership.artist
  const tasks = useMemo(() => artist?.labTasks || [], [artist?.labTasks])
  const nextTasks = useMemo(() => tasks.filter((task) => task.status !== "DONE"), [tasks])
  const documents = useMemo(() => {
    const order = new Map(defaultDocumentOrder.map((id, index) => [id, index]))
    return [...(artist?.documents || []), ...(data?.globalDocuments || [])].sort((a, b) => {
      const aOrder = order.get(a.id) ?? 1000
      const bOrder = order.get(b.id) ?? 1000
      if (aOrder !== bOrder) return aOrder - bOrder
      return a.title.localeCompare(b.title)
    })
  }, [artist?.documents, data?.globalDocuments])

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

  if (loading) return <div className="px-6 py-16 text-center text-gray-400">Loading workspace...</div>
  if (error && !data) return <div className="mx-4 border border-red-500/30 bg-red-950/40 p-6 text-red-200">{error}</div>

  return (
    <div className="space-y-8">
      <header className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="border border-lime-400/20 bg-[#080c0a] p-8">
          <div className="mb-6 flex items-center gap-3 text-lime-300">
            <FaRocket />
            <span className="text-sm uppercase tracking-[0.24em]">Artist Lab</span>
          </div>
          <h1 className="text-4xl font-black text-white md:text-5xl">{artist?.name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-lime-100/65">
            Your release growth board. Clear the next missions, keep your assets tight and stay ready for campaign pushes.
          </p>
        </div>
        <div className="border border-white/10 bg-black/40 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-gray-500">Progress</div>
          <div className="mt-3 text-6xl font-black text-white">{data?.progress || 0}%</div>
          <div className="mt-5 h-3 bg-white/10">
            <div className="h-full bg-lime-300" style={{ width: `${data?.progress || 0}%` }} />
          </div>
          <div className="mt-4 text-sm text-gray-400">{tasks.filter((task) => task.status === "DONE").length} of {tasks.length} missions done</div>
        </div>
      </header>

      {error && <div className="border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-white/10 bg-[#070707] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Next missions</h2>
            <span className="text-sm text-gray-500">{nextTasks.length} open</span>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => {
              const done = task.status === "DONE"
              return (
                <button
                  key={task.id}
                  onClick={() => updateTask(task, !done)}
                  disabled={updatingId === task.id}
                  className={`grid w-full gap-3 border p-4 text-left transition md:grid-cols-[32px_1fr_auto] ${done ? "border-lime-300/30 bg-lime-300/5" : "border-white/10 bg-white/[0.03] hover:border-lime-300/45"}`}
                >
                  <span className="pt-1 text-lime-300">{done ? <FaCheck /> : <FaRegCircle />}</span>
                  <span>
                    <span className="block font-semibold text-white">{task.title}</span>
                    {task.description && <span className="mt-1 block text-sm text-gray-400">{task.description}</span>}
                    <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-gray-500">{task.category} / {task.priority}</span>
                  </span>
                  <span className={done ? "text-lime-300" : "text-amber-300"}>{updatingId === task.id ? "Saving" : task.status}</span>
                </button>
              )
            })}
            {tasks.length === 0 && (
              <div className="border border-dashed border-white/15 p-8 text-center text-gray-500">No missions assigned yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <section className="border border-lime-300/20 bg-[#0a100d] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-lime-300/25 bg-lime-300/10 text-2xl text-lime-300">
                <FaUsers />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-lime-300">Sharing is caring</div>
                <h2 className="mt-2 text-2xl font-black text-white">Build with the crew</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Share samples, loops and ideas with other DnB Doctor DJs and producers. Collabs, feedback and small exchanges move tracks forward faster.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              <Link href="/admin/artist/share" className="flex items-center justify-center gap-2 border border-white/10 px-3 py-3 font-bold text-white hover:border-lime-300/50">
                <FaCloudUploadAlt className="text-lime-300" /> Sample drop
              </Link>
              <a href="https://discord.gg/8WDSWTC8A" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-white/10 px-3 py-3 font-bold text-white hover:border-lime-300/50">
                <FaDiscord className="text-lime-300" /> Join Discord
              </a>
            </div>
          </section>

          <section className="border border-lime-300/20 bg-[#0a100d] p-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden border border-lime-300/25 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/andrej.jpg" alt="Andrej Srna" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-lime-300">Your label contact</div>
                <h2 className="mt-2 text-2xl font-black text-white">Andrej Srna</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  If you need anything around releases, assets, tasks or campaign questions, message me directly.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2 text-sm">
              <a href="mailto:dnbdoctor1@gmail.com" className="flex items-center gap-3 border border-white/10 px-3 py-2 text-white hover:border-lime-300/50">
                <FaEnvelope className="text-lime-300" /> dnbdoctor1@gmail.com
              </a>
              <a href="https://instagram.com/asana.dnb" target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-white/10 px-3 py-2 text-white hover:border-lime-300/50">
                <FaInstagram className="text-lime-300" /> @asana.dnb
              </a>
              <div className="flex items-center gap-3 border border-white/10 px-3 py-2 text-white">
                <FaDiscord className="text-lime-300" /> andrej.srna#0316
              </div>
              <a href="https://wa.me/421914230321" target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-white/10 px-3 py-2 text-white hover:border-lime-300/50">
                <FaPhoneAlt className="text-lime-300" /> +421 914 230 321
              </a>
            </div>
          </section>

          <section className="border border-white/10 bg-black/35 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white"><FaBookOpen /> Documents</h2>
            <div className="space-y-3">
              {documents.map((doc) => (
                <Link key={doc.id} href={`/admin/artist/documents/${doc.id}`} className="flex items-center justify-between border border-white/10 p-4 text-white hover:border-lime-300/50">
                  <span>
                    <span className="block font-semibold">{doc.title}</span>
                    {doc.description && <span className="mt-1 block text-sm text-gray-500">{doc.description}</span>}
                  </span>
                  {doc.url && <FaExternalLinkAlt className="text-lime-300" />}
                </Link>
              ))}
              {documents.length === 0 && <div className="text-sm text-gray-500">No documents yet.</div>}
            </div>
          </section>

          <section className="border border-white/10 bg-black/35 p-6">
            <h2 className="mb-4 text-xl font-black text-white">Release plans</h2>
            <div className="space-y-3">
              {(artist?.releasePlans || []).map((plan) => (
                <div key={plan.id} className="border border-white/10 p-4">
                  <div className="font-semibold text-white">{plan.name}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-500">{plan.status}</div>
                </div>
              ))}
              {(artist?.releasePlans || []).length === 0 && <div className="text-sm text-gray-500">No release plan yet.</div>}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
