/**
 * Selling Points System for DNB Doctor Releases
 * 
 * This file contains all selling points organized by category.
 * The system automatically selects relevant points based on release categories,
 * but you can also manually override specific releases.
 * 
 * USAGE:
 * 1. Automatic: Points are selected based on release categories (neurofunk, techstep, etc.)
 * 2. Manual Override: Add specific releases to `manualOverrides` object
 * 3. Daily Rotation: Points are randomized each time the page loads
 * 
 * TO ADD MANUAL OVERRIDES:
 * Add entries to the `manualOverrides` object like:
 * 'release-slug': ['Custom point 1', 'Custom point 2', 'Custom point 3']
 * 
 * TO ADD NEW SELLING POINTS:
 * Add them to the appropriate category in the `sellingPoints` object
 */
export const sellingPoints = {
  // Sound Design & Production
  soundDesign: [
    "Razor-edged neurofunk, sub-heavy pressure",
    "Surgical drums, cinematic tension, ruthless drops",
    "Tech-step roller with ghostly atmospheres",
    "Glitchy edits and precision switch-ups",
    "Half-time bridge, full-time impact",
    "Dirty reese, clean top end",
    "Hypnotic arps, warehouse energy",
    "Industrial textures, laser-focused groove",
    "Crunchy snares, cavernous bass hits",
    "Aggressive yet precise sound design",
    "Analog grit meets digital precision",
    "Mixdown built for weight and clarity",

  ],

  // Structure & Arrangement
  structure: [
    "Dark intro, explosive first drop",
    "Second drop goes even harder",
    "Clean intro and outro, mix-ready",
    "Extended mix for double-drops",
    "8-bar intro, 16-bar outro",
    "Minimal breakdown, maximum momentum",
    "Moshpit energy, screwface guaranteed",
    "Hands-in-the-air second breakdown",
    "Perfect tool for peak hour",
    "Works as opener or closer",
    "DJ-friendly, tight arrangement",
    "Hook you can ID instantly",
    "B-side sleeper built for DJs"
  ],

  // Technical Specifications
  technical: [
    "Club-tested at 174 BPM",
    "Plays nicely at 172–174 BPM",
    "Key-matched for harmonic mixing",
    "Mono-safe sub, wide tops",
    "Punchy master, big-room ready"
  ],
}

// Function to get random selling points for a release
export function getRandomSellingPoints(count: number = 3): string[] {
  const allPoints = Object.values(sellingPoints).flat()
  const shuffled = [...allPoints].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Function to get selling points by category
export function getSellingPointsByCategory(categories: (keyof typeof sellingPoints)[]): string[] {
  const points: string[] = []
  categories.forEach(category => {
    if (sellingPoints[category]) {
      points.push(...sellingPoints[category])
    }
  })
  return points
}

// Function to get curated selling points (mix of categories)
export function getCuratedSellingPoints(): string[] {
  const curated = [
    // Always include one from each main category
    sellingPoints.soundDesign[Math.floor(Math.random() * sellingPoints.soundDesign.length)],
    sellingPoints.structure[Math.floor(Math.random() * sellingPoints.structure.length)],
    sellingPoints.technical[Math.floor(Math.random() * sellingPoints.technical.length)]
  ]
  
  // Add one more random point
  const allPoints = Object.values(sellingPoints).flat()
  const randomPoint = allPoints[Math.floor(Math.random() * allPoints.length)]
  
  return [...curated, randomPoint].filter((point, index, arr) => arr.indexOf(point) === index)
}

// Function to get selling points based on release categories
export function getSellingPointsForRelease(categories: string[] = []): string[] {
  // If no categories, use curated selection
  if (categories.length === 0) {
    return getCuratedSellingPoints()
  }

  const points: string[] = []
  
  // Check for specific release types and add relevant points
  if (categories.some(cat => cat.toLowerCase().includes('neurofunk'))) {
    points.push(...releaseTypeSets.neurofunk.slice(0, 2))
  }
  
  if (categories.some(cat => cat.toLowerCase().includes('techstep') || cat.toLowerCase().includes('tech-step'))) {
    points.push(...releaseTypeSets.techstep.slice(0, 2))
  }
  
  if (categories.some(cat => cat.toLowerCase().includes('liquid'))) {
    points.push(...releaseTypeSets.liquid.slice(0, 2))
  }
  
  if (categories.some(cat => cat.toLowerCase().includes('experimental'))) {
    points.push(...releaseTypeSets.experimental.slice(0, 2))
  }
  
  // If we don't have enough points, fill with random ones
  if (points.length < 3) {
    const remaining = 3 - points.length
    const allPoints = Object.values(sellingPoints).flat()
    const shuffled = [...allPoints].sort(() => 0.5 - Math.random())
    points.push(...shuffled.slice(0, remaining))
  }
  
  return points.slice(0, 3)
}

// Manual overrides for specific releases (by slug)
export const manualOverrides: Record<string, string[]> = {
  // Example: 'release-slug': ['Custom point 1', 'Custom point 2', 'Custom point 3']
  // Add specific releases here when you want custom selling points
}

// Function to get selling points with manual override support
export function getSellingPointsForReleaseWithOverride(slug: string, categories: string[] = []): string[] {
  // Check for manual override first
  if (manualOverrides[slug]) {
    return manualOverrides[slug]
  }
  
  // Otherwise use the regular function
  return getSellingPointsForRelease(categories)
}

// Predefined sets for different release types
export const releaseTypeSets = {
  neurofunk: [
    "Razor-edged neurofunk, sub-heavy pressure",
    "Surgical drums, cinematic tension, ruthless drops",
    "Industrial textures, laser-focused groove",
    "Club-tested at 174 BPM"
  ],
  
  techstep: [
    "Tech-step roller with ghostly atmospheres",
    "Glitchy edits and precision switch-ups",
    "Aggressive yet precise sound design",
    "Plays nicely at 172–174 BPM"
  ],
  
  liquid: [
    "Hypnotic arps, warehouse energy",
    "Clean intro and outro, mix-ready",
    "Key-matched for harmonic mixing",
    "Perfect tool for peak hour"
  ],
  
  experimental: [
    "Half-time bridge, full-time impact",
    "3D stereo imaging, dancefloor focused",
    "Analog grit meets digital precision",
    "Works as opener or closer"
  ]
}
