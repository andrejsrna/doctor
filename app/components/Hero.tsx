// server component
import Image from 'next/image'
import Button from './Button'


export default function Hero() {


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/mainbg.jpeg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />
      </div>
      

      {/* Centered Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-green-500 font-mono text-xl mb-4 inline-block">Biohazard Level: Maximum</h2>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
          The<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">Infection</span><br />
          Spreads Tonight
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Enter our contaminated soundscape where we engineer the most virulent strains of neurofunk. Let the bass infection take control as we mutate your audio DNA.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="relative group">
            <Button href="/music" variant="toxic" size="lg" className="relative transition-transform duration-200 hover:scale-105 active:scale-95">Initiate Infection →</Button>
          </div>
          <div className="relative group">
            <Button href="/submit-demo" variant="infected" size="lg" className="relative transition-transform duration-200 hover:scale-105 active:scale-95">Submit Specimen</Button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <a href="/new-fans" className="underline underline-offset-4 hover:text-purple-300 transition-colors">New to DnB Doctor? Start here</a>
        </div>
      </div>

    </div>
  )
} 