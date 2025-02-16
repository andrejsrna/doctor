import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guidelines | Label Name',
  description: 'Submission guidelines for producers',
}

const GuidelinesPage = () => {
  const sections = [
    { id: "general", title: "1. General Requirements" },
    { id: "technical", title: "2. Technical Requirements" },
    { id: "whatwelook", title: "3. What We Look For" },
    { id: "additional", title: "4. Additional Notes" },
    { id: "resources", title: "5. Resources" },
  ];

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl mt-12">
      <nav className="mb-12 sticky top-4 bg-neutral-900/95 p-4 rounded-lg backdrop-blur-sm z-10">
        <ul className="flex flex-wrap gap-4 justify-center">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <h1 className="text-3xl font-bold mb-8">Producer Guidelines</h1>
      
      <section id="general" className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">1. General Requirements</h2>
        
        <p className="mb-6">
          Before submitting your tracks, ensure they align with the vision and quality 
          of our label. We focus on cutting-edge neurofunk with high production standards.
        </p>

        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Genre</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p>Neurofunk, techy DnB, deep and dark vibes</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <p>Not Accepted: Liquid, jump-up, minimal, breakcore, etc.</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Quality Standard</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p>Proper mixdown & mastering preferred (but we can handle mastering if needed)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <p>No Unfinished Demos: Only fully completed tracks</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Originality</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p>Your own work, no bootlegs or unlicensed samples</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <p>AI-generated or AI-processed submissions, (AI elements are allowed)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="technical" className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">2. Technical Requirements</h2>
        
        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔊</span>
                <div>
                  <h3 className="text-xl font-medium mb-2">Format</h3>
                  <p>WAV, 24-bit, 44.1kHz or higher</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">🎼</span>
                <div>
                  <h3 className="text-xl font-medium mb-2">BPM</h3>
                  <p>170-178 (unless you have something unique)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">🎚️</span>
                <div>
                  <h3 className="text-xl font-medium mb-2">Mixing</h3>
                  <p>Well-balanced mix, no heavy limiting or distortion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="whatwelook" className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">3. What We Look For</h2>
        
        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Desired Elements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <p>Innovative Sound Design</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">💀</span>
                <p>Dark, Heavy, & Punchy</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🎭</span>
                <p>Emotional Depth & Atmosphere</p>
              </div>
            </div>
          </div>

          <div className="bg-red-950/30 p-6 rounded-lg border border-red-900/50">
            <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
              <span>🚫</span> What We Don&apos;t Want
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Generic copy-paste neurofunk</li>
              <li>Weak sound design / bad mixdowns</li>
              <li>Overly chaotic, unstructured ideas</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="additional" className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">4. Additional Notes</h2>
        
        <div className="bg-neutral-900 p-6 rounded-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-neutral-200">
                  We prefer exclusive releases but may consider non-exclusives if the track fits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-neutral-200">
                  If accepted, we&apos;ll discuss contract, royalties, and release schedule
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl">🔗</span>
              <div className="flex-1">
                <p className="text-neutral-200">
                  Follow our socials for updates & inspiration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">5. Resources</h2>
        
        <p className="mb-6 text-neutral-200">
          We want to support producers in enhancing their craft. Here are some resources 
          to help you improve your production skills and align your sound with our 
          label&apos;s expectations:
        </p>

        <div className="space-y-8">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Mixing & Mastering</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Complete Neurofunk Production Guide
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  In-depth tutorial covering sound design, mixing and mastering techniques.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/_X0Ej_DGqvs"
                    title="How to make NEUROFUNK DNB | SOUND DESIGN, MIXING, MASTERING"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@PHENOMSOUND" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ PHENOMSOUND
                </a>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  How to make Neuro Drum & Bass (2025 Updated)
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Comprehensive beginner tutorial for producing neurofunk in Ableton Live Lite.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/wZ3hFRBtG2M"
                    title="How to make Neuro Drum & Bass UPDATED Ableton Live Lite - Beginner Tutorial"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@dnbacademy" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ DNB Academy
                </a>
              </div>
            </div>
            
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Sound Design</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Neuro Bass Design
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Creating aggressive basslines with Serum.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/B1xItXbUvIg"
                    title="How to make HARD Neurofunk DNB like MEFJUS"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@InverseAudio" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ Inverse Audio
                </a>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Drum Processing
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Crafting punchy, hard-hitting neurofunk drums.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/KkPxJluyTLw"
                    title="Basics of Drum & Bass drum patterns"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@ARTFX" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ ARTFX
                </a>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Arrangement & Structure</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Drum Pattern Arrangement
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  How to structure your drum pattern for maximum impact.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/aF5G1WeeQ8A?start=469"
                    title="DnB Arrangement Tips"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@STRANJAH" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ Stranjah
                </a>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Bass Patterns
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Learn how to create effective bass patterns for neurofunk.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/t5oDmmwBuS4?start=751"
                    title="DnB Bass Pattern Tips"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@STRANJAH" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ Stranjah
                </a>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Bass Patterns
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Learn how to create effective bass patterns and phrases for modern neurofunk.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/lGZXssulIAg?start=530"
                    title="How To Make Bass Patterns for Neurofunk"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@DnBAcademy" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ DnB Academy
                </a>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">General Production</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Call & Response Techniques
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Learn how to create dynamic arrangements using call and response patterns.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/qfahdH8nIgI"
                    title="Call and Response in DnB"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@DnBAcademy" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ DnB Academy
                </a>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Arrangement Tips
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Learn a simple but powerful rule for better arrangements.
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.youtube.com/embed/7rCAKRKskxA?start=13"
                    title="This Simple Rule Will Improve Your Arrangements"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a href="https://www.youtube.com/@AlexRome" className="text-blue-400 mt-4 hover:text-blue-300 text-sm">
                  @ Alex Rome
                </a>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Downloadable Resources</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  TeddyKillerz - Patreon
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Downloadable resources from TeddyKillerz.
                </p>
                <a href="https://www.patreon.com/teddykillerz" className="text-blue-400 hover:text-blue-300 text-sm">
                https://www.patreon.com/teddykillerz
                </a>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Aggresor Bunx - Patreon
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                  Downloadable resources from Aggresor Bunx, (Serum presets, etc).
                </p>
                <a href="https://www.patreon.com/agressorbunx" className="text-blue-400 hover:text-blue-300 text-sm">
                https://www.patreon.com/agressorbunx
                </a>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Gydra - Patreon
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                Downloadable resources from Gydra, (Serum presets, etc).
                </p>
                <a href="https://www.patreon.com/gydra" className="text-blue-400 hover:text-blue-300 text-sm">
                https://www.patreon.com/gydra
                </a>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  PRDK - Patreon
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                Downloadable resources from PRDK, (Serum presets, etc).
                </p>
                <a href="https://www.patreon.com/prdkmusic" className="text-blue-400 hover:text-blue-300 text-sm">
                https://www.patreon.com/prdkmusic
                </a>
              </div>
              <div>
                <h4 className="text-lg font-medium text-neutral-200 mb-1">
                  Splice
                </h4>
                <p className="text-sm text-neutral-400 mb-1">
                Downloadable resources from Splice, (Serum presets, etc).
                </p>
                <a href="https://www.splice.com/sounds/search?q=neurofunk" className="text-blue-400 hover:text-blue-300 text-sm">
                https://www.splice.com/sounds/search?q=neurofunk
                </a>
              </div>


            </div>
            
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              VSTs & Plugins
            </h3>
            <p className="text-sm text-neutral-400 mb-1">
            Serum (Xfer Records) - Synth Plugin
            </p>
            <a href="https://xferrecords.com/products/serum/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://xferrecords.com/products/serum/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Master Plan (Music Hack) - Mastering Suite
            </p>
            <a href="https://www.musikhack.com/products/masterplan/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.musikhack.com/products/masterplan/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Thermal (Output) - Distortion Plugin
            </p>
            <a href="https://shop.output.com/products/thermal" className="text-blue-400 hover:text-blue-300 text-sm">
            https://shop.output.com/products/thermal
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Stealth Limiter (IK Multimedia) - Limiter Plugin
            </p>
            <a href="https://www.ikmultimedia.com/products/trstealthlimiter/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.ikmultimedia.com/products/trstealthlimiter/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Massive (Native Instruments) - Synth Plugin
            </p>
            <a href="https://www.native-instruments.com/en/products/komplete/synths/massive/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.native-instruments.com/en/products/komplete/synths/massive/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Rift (Minimal Audio) - Distortion Plugin
            </p>
            <a href="https://www.minimal.audio/products/rift" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.minimal.audio/products/rift
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Pro Q4 (Fabfilter) - EQ Plugin
            </p>
            <a href="https://www.fabfilter.com/products/pro-q-4-equalizer-plug-in" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.fabfilter.com/products/pro-q-4-equalizer-plug-in
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Ableton Live Lite (Ableton) - DAW
            </p>
            <a href="https://www.ableton.com/en/live/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.ableton.com/en/live/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Plugin Boutique (Plugin Boutique) - Plugin Store
            </p>
            <a href="https://www.pluginboutique.com/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.pluginboutique.com/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Vital - Free Synth Plugin
            </p>
            <a href="https://vital.audio/" className="text-blue-400 hover:text-blue-300 text-sm">
            https://vital.audio/
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Loopmasters - Sample Pack Store
            </p>
            <a href="https://www.loopmasters.com/search?utf8=%E2%9C%93&q=neurofunk" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.loopmasters.com/search?utf8=%E2%9C%93&q=neurofunk
            </a>
            <p className="text-sm text-neutral-400 mb-1 mt-4">
            Movement (Output) - FX Engine
            </p>
            <a href="https://www.output.com/products/movement" className="text-blue-400 hover:text-blue-300 text-sm">
            https://www.output.com/products/movement
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default GuidelinesPage
