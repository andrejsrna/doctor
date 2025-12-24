import { useState, useEffect } from 'react'

interface UseProgressiveImageProps {
  src: string
}

interface UseProgressiveImageReturn {
  src: string
  blurDataURL: string
  isLoaded: boolean
  error: boolean
}

export function useProgressiveImage({
  src,
}: UseProgressiveImageProps): UseProgressiveImageReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [blurDataURL, setBlurDataURL] = useState('')

  useEffect(() => {
    if (!src) return

    // Create a low-quality placeholder
    const createPlaceholder = async () => {
      try {
        // Create a canvas to generate a low-quality version
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set small dimensions for placeholder
        canvas.width = 20
        canvas.height = 20

        // Create a simple gradient placeholder
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, '#1a1a1a')
        gradient.addColorStop(0.5, '#2a2a2a')
        gradient.addColorStop(1, '#1a1a1a')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Convert to data URL
        const placeholder = canvas.toDataURL('image/jpeg', 0.1)
        setBlurDataURL(placeholder)
      } catch (err) {
        console.warn('Failed to create placeholder:', err)
        // Fallback to a simple base64 placeholder
        setBlurDataURL('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=')
      }
    }

    createPlaceholder()

    // Load the actual image
    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setError(true)
    img.src = src
  }, [src])

  return {
    src,
    blurDataURL,
    isLoaded,
    error,
  }
}
