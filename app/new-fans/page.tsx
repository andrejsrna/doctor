import FeaturedTrack from "../components/FeaturedTrack";
import LatestMusic from "../components/LatestMusic";
import SpotifyPlaylists from "../components/SpotifyPlaylists";
import FeaturedArtists from "../components/FeaturedArtists";
import TrustBadges from "../components/TrustBadges";
import EngagementCTA from "../components/EngagementCTA";
import WhatIsNeurofunk from "../components/WhatIsNeurofunk";
import FreeTrackForm from "../components/FreeTrackForm";
import KeyTracks from "../components/KeyTracks";
import LearnMoreNeurofunk from "../components/LearnMoreNeurofunk";

export const metadata = {
  title: "Start Here | New Fans",
  description: "Start here: hear our sound, meet the artists, and join the community.",
};

export default function NewFansPage() {
  return (
    <main className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[520px] h-[520px] bg-purple-600/20 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[620px] h-[620px] bg-pink-600/10 blur-3xl rounded-full" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs tracking-wider">
            START HERE
          </div>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight">
            New Here?<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Start with the Sound</span>
          </h1>
          <p className="mt-4 max-w-2xl text-gray-300">
            Heavy drums, precise sound design, relentless energy. Dive into essentials and join a community that breathes forward‑thinking DNB.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#listen" className="px-5 py-3 rounded-lg bg-purple-700/90 hover:bg-purple-700 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
              Listen now
            </a>
            <a href="#join" className="px-5 py-3 rounded-lg bg-black/50 border border-white/10 hover:border-white/20">
              Get a free track
            </a>
          </div>

          {/* Quick start cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'One playlist', desc: 'Understand our sound fast', href: '#listen' },
              { title: 'Meet artists', desc: 'Explore key releases', href: '#artists' },
              { title: 'Free track', desc: 'Instant download to your inbox', href: '#join' },
            ].map((c) => (
              <a key={c.title} href={c.href} className="group block bg-black/40 border border-white/10 hover:border-purple-500/40 rounded-xl p-5 transition-colors">
                <div className="text-sm text-gray-400">{c.desc}</div>
                <div className="mt-1 text-lg font-semibold group-hover:text-purple-300">{c.title}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Listen first */}
      <section id="listen" className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Start Listening</h2>
          <p className="mt-2 text-gray-400">One playlist to understand our sound, plus the latest featured drop.</p>
        </div>
        <div className="space-y-12">
          <SpotifyPlaylists />
          <FeaturedTrack />
          <LatestMusic />
        </div>
      </section>

      {/* Key Tracks */}
      <section className="bg-black/40 border-t border-white/10">
        <KeyTracks title="Key Tracks" />
      </section>

      {/* What we’re about */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">What We’re About</h2>
          <p className="mt-2 text-gray-400">A fast intro to the sound, culture, and why we do this.</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
          <WhatIsNeurofunk />
        </div>
      </section>

      {/* Meet the artists */}
      <section id="artists" className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Meet the Artists</h2>
          <p className="mt-2 text-gray-400">Explore the producers behind the sound.</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
          <FeaturedArtists />
        </div>
      </section>

      {/* Learn More CTA */}
      <LearnMoreNeurofunk />

      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <TrustBadges />
      </section>

      {/* Join the community */}
      <section id="join" className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Join the Community</h2>
          <p className="mt-2 text-gray-400">Get early promos, free downloads, and exclusive drops.</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6">
          <FreeTrackForm />
        </div>
        <div className="mt-10">
          <EngagementCTA />
        </div>
      </section>
    </main>
  );
}


