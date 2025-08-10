'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Option = { value: string; label: string }

export default function NiceSelect({
  value,
  options,
  onChange,
  placeholder = 'Select',
  className = '',
}: {
  value: string
  options: Array<string | Option>
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const normalized = useMemo<Option[]>(
    () =>
      options.map((o) =>
        typeof o === 'string' ? { value: o, label: o || placeholder } : { value: o.value, label: o.label || o.value }
      ),
    [options, placeholder]
  )

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(() => Math.max(0, normalized.findIndex((o) => o.value === value)))
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const selected = normalized.find((o) => o.value === value)
  const display = selected?.label || placeholder

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return
      const t = e.target as Node
      if (buttonRef.current?.contains(t)) return
      if (listRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const idx = Math.max(0, normalized.findIndex((o) => o.value === value))
    setActiveIndex(idx)
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${idx}"]`)
    el?.focus()
  }, [open, normalized, value])

  const move = (dir: 1 | -1) => {
    const next = (activeIndex + dir + normalized.length) % normalized.length
    setActiveIndex(next)
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`)
    el?.focus()
  }

  const handleKeyOnButton = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((p) => !p)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleKeyOnOption = (e: React.KeyboardEvent, idx: number, v: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(v)
      setOpen(false)
      buttonRef.current?.focus()
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(idx)
      move(1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(idx)
      move(-1)
      return
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        onKeyDown={handleKeyOnButton}
        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 text-white focus:border-purple-500 hover:border-purple-500/50 transition-all duration-300 flex items-center justify-between"
      >
        <span className={`truncate ${selected ? '' : 'text-gray-400'}`}>{display}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-lg bg-black/90 backdrop-blur-lg border border-purple-500/20 shadow-xl focus:outline-none"
        >
          {normalized.map((opt, idx) => (
            <div
              key={opt.value + idx}
              data-index={idx}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              onKeyDown={(e) => handleKeyOnOption(e, idx, opt.value)}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
                buttonRef.current?.focus()
              }}
              className={`px-4 py-2 text-sm cursor-pointer select-none ${
                opt.value === value ? 'text-purple-300 bg-purple-500/10' : 'text-gray-300 hover:text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


