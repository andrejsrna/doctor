'use client'

import { useState, useEffect, ComponentType } from 'react'

interface SafeIconProps {
  Icon: ComponentType<{ className?: string; [key: string]: unknown }>
  className?: string
  [key: string]: unknown
}

const SafeIcon = ({ Icon, className = '', ...props }: SafeIconProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fallbackClasses = `${className} w-4 h-4 bg-purple-500/20 rounded`

  if (!mounted) {
    // Fallback rendering on the server or before hydration
    return <div className={fallbackClasses} />
  }

  try {
    // Client-side rendering
    return <Icon className={className} {...props} />
  } catch (error) {
    // In case of error (e.g., Firefox SVG issue)
    console.error('Icon rendering failed:', error)
    return <div className={fallbackClasses} />
  }
}

export default SafeIcon 