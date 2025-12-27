"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  ReleaseHeader,
  ReleaseBasicFields,
  ReleaseContentEditor,
  ReleaseUploadFields,
  ReleaseLinkFields,
  ReleaseCategories,
  ReleaseDateField,
  useSaveHotkey,
  ReleaseSchema,
  ReleaseFormValues,
  slugify
} from "../../../components/releases"

export default function NewReleasePage() {
  const router = useRouter()
  const [slugEdited, setSlugEdited] = useState(false)

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

  const { setValue, handleSubmit, formState, watch } = form
  const title = watch("title")
  const releaseType = watch("releaseType")
  const prevReleaseTypeRef = useRef(releaseType)

  // Auto-slug when title changes (until user edits slug manually)
  useEffect(() => {
    if (!slugEdited) setValue("slug", slugify(title || ""))
  }, [title, slugEdited, setValue])

  useEffect(() => {
    const prev = prevReleaseTypeRef.current
    prevReleaseTypeRef.current = releaseType
    if (prev === "FREE_DOWNLOAD" && releaseType !== "FREE_DOWNLOAD") {
      setValue("downloadFileUrl", "", { shouldDirty: true })
      setValue("downloadFileKey", "", { shouldDirty: true })
      setValue("downloadFileName", "", { shouldDirty: true })
    }
  }, [releaseType, setValue])

  const onSubmit = useCallback(async (values: ReleaseFormValues) => {
    try {
      // map publishedAt (yyyy-MM-dd) to ISO or null
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

      const res = await fetch("/api/admin/releases", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const e = await res.json().catch(() => null)
        throw new Error(e?.error || "Creation failed")
      }

      toast.success("Release created successfully")
      router.push("/admin/releases")
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err?.message || "Creation failed")
    }
  }, [router])

  useSaveHotkey(() => handleSubmit(onSubmit)())



  return (
    <div className="space-y-6">
      <ReleaseHeader 
        isSubmitting={formState.isSubmitting} 
        onSubmit={handleSubmit(onSubmit)} 
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReleaseBasicFields
          register={form.register}
          setValue={form.setValue}
          watch={form.watch}
          errors={form.formState.errors}
          slugEdited={slugEdited}
          setSlugEdited={setSlugEdited}
        />

        <ReleaseContentEditor 
          setValue={form.setValue} 
          watch={form.watch} 
        />

        <ReleaseUploadFields 
          setValue={form.setValue} 
          watch={form.watch} 
        />

        <ReleaseLinkFields register={form.register} />

        <ReleaseCategories 
          setValue={form.setValue} 
          watch={form.watch} 
        />

        <ReleaseDateField 
          setValue={form.setValue} 
          watch={form.watch} 
        />
      </section>
    </div>
  )
}
