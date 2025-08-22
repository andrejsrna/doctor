import { useEffect, useRef } from "react"

export function useSaveHotkey(cb: () => void) {
  const cbRef = useRef(cb)
  useEffect(() => { cbRef.current = cb }, [cb])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        cbRef.current()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
}
