export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

export async function uploadFile(opts: {file: File; kind: "cover"|"preview"; slug: string}) {
  const body = new FormData()
  body.append("file", opts.file)
  body.append("kind", opts.kind)
  body.append("slug", opts.slug)
  body.append("baseDir", "releases")
  const res = await fetch("/api/admin/upload", {method: "POST", body})
  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return data?.url as string
}

export async function uploadFileWithMeta(opts: { file: File; kind: "cover" | "preview" | "download"; slug: string }) {
  const body = new FormData()
  body.append("file", opts.file)
  body.append("kind", opts.kind)
  body.append("slug", opts.slug)
  body.append("baseDir", "releases")
  const res = await fetch("/api/admin/upload", { method: "POST", body })
  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return { url: (data?.url as string | null) ?? null, key: data?.key as string }
}

export const formatDateForForm = (date: Date | null) => {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const parseDateFromForm = (value?: string | null) => {
  if (!value) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number)
    const date = new Date(year, (month || 1) - 1, day || 1)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const isoDate = new Date(value)
  if (Number.isNaN(isoDate.getTime())) return null

  return new Date(
    isoDate.getUTCFullYear(),
    isoDate.getUTCMonth(),
    isoDate.getUTCDate()
  )
}
