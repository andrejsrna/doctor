import { Big_Shoulders, JetBrains_Mono } from 'next/font/google'

/** Display + utility faces shared by the header and the home hero. */
export const displayFont = Big_Shoulders({ subsets: ['latin'], weight: ['800', '900'], display: 'swap', variable: '--hero-display' })
export const monoFont = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--hero-mono' })
