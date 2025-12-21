'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const unique = useMemo(() => Array.from(new Set(images.filter((u) => typeof u === 'string' && u.length > 0))), [images])
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const current = unique[active] || unique[0]

  const openAt = (idx: number) => {
    setActive(Math.min(Math.max(0, idx), unique.length - 1))
    setOpen(true)
  }

  const close = () => setOpen(false)

  const prev = () => setActive((v) => (v - 1 + unique.length) % unique.length)
  const next = () => setActive((v) => (v + 1) % unique.length)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, unique.length])

  if (!current) {
    return (
      <div className="rounded-3xl overflow-hidden border border-purple-500/20 bg-white/5">
        <div className="aspect-[4/3] flex items-center justify-center text-gray-400 text-sm">No image</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => openAt(active)}
        className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-white/5 text-left w-full"
        aria-label="Open image"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/40 to-green-500/10" />
        <div className="relative aspect-[4/3]">
          <Image src={current} alt={alt} fill className="object-contain bg-black" sizes="(max-width: 1024px) 100vw, 55vw" />
        </div>
      </button>

      {unique.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {unique.slice(0, 10).map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => openAt(idx)}
              className={[
                'relative aspect-square rounded-xl overflow-hidden border transition-colors',
                idx === active ? 'border-purple-400' : 'border-white/10 hover:border-purple-400/60',
              ].join(' ')}
              aria-label={`View image ${idx + 1}`}
            >
              <Image src={src} alt={alt} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}

      {open && mounted && unique.length > 0
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Image viewer"
              onMouseDown={(e) => {
                const target = e.target as Node
                if (!modalRef.current) return
                if (!modalRef.current.contains(target)) close()
              }}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

              <div ref={modalRef} className="relative w-full max-w-5xl">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={current}
                      alt={alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      priority
                    />
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    className="absolute top-3 right-3 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm"
                  >
                    Close
                  </button>

                  {unique.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm"
                        aria-label="Previous image"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm"
                        aria-label="Next image"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {unique.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {unique.slice(0, 12).map((src, idx) => (
                      <button
                        key={`modal-${src}-${idx}`}
                        type="button"
                        onClick={() => setActive(idx)}
                        className={[
                          'relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border',
                          idx === active ? 'border-purple-400' : 'border-white/10 hover:border-purple-400/60',
                        ].join(' ')}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image src={src} alt={alt} fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
