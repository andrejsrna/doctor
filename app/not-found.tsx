import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-gray-300 mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
