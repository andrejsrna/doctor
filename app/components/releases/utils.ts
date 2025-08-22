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
