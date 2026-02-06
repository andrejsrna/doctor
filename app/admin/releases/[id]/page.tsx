"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  ReleaseEditHeader,
  ReleaseEditBasicFields,
  ReleaseEditContentEditor,
  ReleaseEditUploadFields,
  ReleaseEditLinkFields,
  ReleaseEditCategories,
  ReleaseEditDateField,
  useSaveHotkey,
  ReleaseSchema,
  ReleaseFormValues
} from "../../../components/releases"

export default function ReleaseDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ""
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [clickStats, setClickStats] = useState<Array<{ platform: string; count: number; lastClickedAt?: string | null }>>([])
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<ReleaseFormValues>({
    resolver: zodResolver(ReleaseSchema),
    defaultValues: {
      slug: "",
      title: "",
      content: "",
      releaseType: "NORMAL",
      downloadFileUrl: "",
      downloadFileKey: "",
      downloadFileName: "",
      coverImageUrl: "",
      artworkImageUrl: "",
      artworkImageKey: "",
      previewUrl: "",
      spotify: "",
      appleMusic: "",
      beatport: "",
      deezer: "",
      soundcloud: "",
      youtubeMusic: "",
      junoDownload: "",
      tidal: "",
      gumroad: "",
      bandcamp: "",
      categories: [],
      publishedAt: "",
    },
    mode: "onChange",
  })

  const { watch, reset } = form
  const values = watch()
  const releaseType = watch("releaseType")
  const prevReleaseTypeRef = useRef(releaseType)

  // Load release data
  useEffect(() => {
    if (!id) return
    const load = async () => {
      const res = await fetch(`/api/admin/releases/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const item = data.item
        const { streamingClicks = [], ...rest } = item
        
        // Convert publishedAt from ISO to yyyy-MM-dd format for the form
        const formData = {
          ...rest,
          publishedAt: rest.publishedAt ? new Date(rest.publishedAt).toISOString().slice(0,10) : "",
        }
        
        reset(formData)
        setClickStats(streamingClicks)
        setSlugEdited(false)
        setLastSavedSnapshot(JSON.stringify(formData))
      }
    }
    load()
  }, [id, reset])

  useEffect(() => {
    const prev = prevReleaseTypeRef.current
    prevReleaseTypeRef.current = releaseType
    if (prev === "FREE_DOWNLOAD" && releaseType !== "FREE_DOWNLOAD") {
      form.setValue("downloadFileUrl", "", { shouldDirty: true })
      form.setValue("downloadFileKey", "", { shouldDirty: true })
      form.setValue("downloadFileName", "", { shouldDirty: true })
    }
  }, [releaseType, form])

  const save = useCallback(async () => {
    if (!id) return
    setSaving(true)
    try {
      // Convert publishedAt back to ISO format for API
      const payload = {
        ...values,
        publishedAt: values.publishedAt
          ? new Date(values.publishedAt + "T00:00:00Z").toISOString()
          : null,
        // normalize empty strings to null for URLs
        ...Object.fromEntries(
          Object.entries(values).map(([k, v]) => [
            k,
            typeof v === "string" && v.trim() === "" ? null : v,
          ]),
        ),
      }

      const res = await fetch(`/api/admin/releases/${id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const saved = await res.json().catch(() => null)
        if (saved?.item) {
          const formData = {
            ...saved.item,
            publishedAt: saved.item.publishedAt ? new Date(saved.item.publishedAt).toISOString().slice(0,10) : "",
          }
          reset(formData)
        }
        setLastSavedSnapshot(JSON.stringify(values))
        toast.success('Release saved')
        router.push('/admin/releases')
      } else { 
        const e = await res.json().catch(() => null); 
        toast.error(e?.error || 'Save failed') 
      }
    } finally {
      setSaving(false)
    }
  }, [id, values, reset, router])

  const autoSave = useCallback(async () => {
    if (!id) return
    setAutoSaving(true)
    try {
      const payload = {
        ...values,
        publishedAt: values.publishedAt
          ? new Date(values.publishedAt + "T00:00:00Z").toISOString()
          : null,
        ...Object.fromEntries(
          Object.entries(values).map(([k, v]) => [
            k,
            typeof v === "string" && v.trim() === "" ? null : v,
          ]),
        ),
      }

      const res = await fetch(`/api/admin/releases/${id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const saved = await res.json().catch(() => null)
        if (saved?.item) {
          const formData = {
            ...saved.item,
            publishedAt: saved.item.publishedAt ? new Date(saved.item.publishedAt).toISOString().slice(0,10) : "",
          }
          reset(formData)
        }
        setLastSavedSnapshot(JSON.stringify(values))
      }
    } finally {
      setAutoSaving(false)
    }
  }, [id, values, reset])

  const isDirty = useMemo(() => {
    const snap = lastSavedSnapshot
    if (!snap) return false
    return JSON.stringify(values) !== snap
  }, [values, lastSavedSnapshot])

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      if (isDirty) autoSave()
    }, 1200)
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current) }
  }, [values, isDirty, autoSave])

  // Save hotkey
  useSaveHotkey(save)

  // Before unload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty || saving || autoSaving) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty, saving, autoSaving])



  if (!values.title) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <ReleaseEditHeader 
        isSaving={saving}
        isAutoSaving={autoSaving}
        isDirty={isDirty}
        onSave={save}
        slug={values.slug}
      />

      <section className="border border-purple-500/30 rounded-xl p-4 bg-black/40">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Streaming kliky</h2>
          <span className="text-xs text-gray-400">Beatport, Spotify, YouTube…</span>
        </div>
        {clickStats.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clickStats.map((stat) => (
              <div key={stat.platform} className="border border-purple-500/20 rounded-lg p-3 bg-black/30">
                <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.platform}</div>
                <div className="text-2xl font-semibold text-purple-200">{stat.count.toLocaleString()} klikov</div>
                <div className="text-xs text-gray-500 mt-1">
                  Naposledy: {stat.lastClickedAt ? new Date(stat.lastClickedAt).toLocaleString() : '–'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400">Zatiaľ žiadne kliky zaznamenané.</div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReleaseEditBasicFields
          register={form.register}
          setValue={form.setValue}
          watch={form.watch}
          errors={form.formState.errors}
          slugEdited={slugEdited}
          setSlugEdited={setSlugEdited}
        />

        <ReleaseEditContentEditor 
          setValue={form.setValue} 
          watch={form.watch} 
        />

        <ReleaseEditUploadFields 
          setValue={form.setValue} 
          watch={form.watch} 
        />

        <ReleaseEditLinkFields register={form.register} />

        <ReleaseEditCategories 
          setValue={form.setValue} 
          watch={form.watch} 
        />

        <ReleaseEditDateField 
          setValue={form.setValue} 
          watch={form.watch} 
        />
      </section>
    </div>
  )
}
