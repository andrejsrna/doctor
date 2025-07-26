import { ComponentType } from 'react'

export interface StreamingLink {
  name: string
  url: string | undefined
  icon: ComponentType<{ className?: string }> | string
  color: string
  bgColor: string
  priority?: number
} 