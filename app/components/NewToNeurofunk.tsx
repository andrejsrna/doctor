"use client"
import Button from './Button'

export default function NewToNeurofunk() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">New to DnB Doctor?</h2>
        <p className="mt-3 text-gray-300 max-w-2xl mx-auto">Start with a curated intro to the sound, key artists, and essential tracks.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/new-fans" variant="infected" size="lg">Start Here</Button>
        </div>
      </div>
    </section>
  )
}


