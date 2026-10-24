
import { useState } from 'react'
import { supabase } from '../supabase'

function Home() {
  const [activeTab, setActiveTab] = useState('Home')

  const tabs = ['Home', 'Discover', 'Fandoms', 'Events']

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
      return
    }

    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-[#071A12] text-white">
      <header className="sticky top-0 z-50 border-b border-emerald-900/60 bg-[#071A12]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">

          {/* Logo on the left */}
          <button
            type="button"
            onClick={() => setActiveTab('Home')}
            className="shrink-0 text-3xl font-black tracking-tight"
            aria-label="4EVA Home"
          >
            4EVA<span className="text-emerald-400">.</span>
          </button>

          {/* Navigation in the middle */}
          <nav
            aria-label="Main navigation"
            className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto sm:gap-3 lg:gap-6"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-2 py-3 text-xs font-medium transition sm:px-3 sm:text-sm ${
                  activeTab === tab
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Sign out on the far right */}
          <button
            type="button"
            onClick={handleSignOut}
            className="shrink-0 rounded-full border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/10 sm:px-5 sm:text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-12">
        {/* Hero section */}
        {activeTab === 'Home' && (
          <>
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950 via-[#10291D] to-[#071A12] p-7 sm:p-10 md:p-14">
              <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm">
                  The culture lives here
                </p>

                <h2 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                  Your people.
                  <br />
                  Your world.
                  <br />
                  <span className="text-emerald-400">Your 4EVA.</span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                  Connect with the artists you love, join their communities,
                  and get closer to the moments that matter.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab('Discover')}
                  className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-[#071A12] transition hover:bg-emerald-400"
                >
                  Explore 4EVA
                </button>
              </div>
            </div>

            {/* Discover section */}
            <div className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">
                Your next obsession
              </p>

              <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                Find your fandom
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Discover artist communities, follow updates, and connect
                with fans who love the same things you do.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#10291D]/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40">
                  <span className="text-3xl">🎵</span>
                  <h4 className="mt-4 text-lg font-bold">Music & Artists</h4>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Get closer to the artists behind your favourite songs.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#10291D]/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40">
                  <span className="text-3xl">💚</span>
                  <h4 className="mt-4 text-lg font-bold">Fan Communities</h4>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Find your people and share the love.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#10291D]/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40">
                  <span className="text-3xl">✨</span>
                  <h4 className="mt-4 text-lg font-bold">Exclusive Moments</h4>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Stay close to special experiences and artist updates.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Discover page */}
        {activeTab === 'Discover' && (
          <div className="py-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Explore
            </p>
            <h2 className="mt-3 text-4xl font-black">Discover</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/60">
              Find artists, explore fandoms, and discover your next favourite
              community. Artist discovery features are coming next.
            </p>
          </div>
        )}

        {/* Fandoms page */}
        {activeTab === 'Fandoms' && (
          <div className="py-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Your communities
            </p>
            <h2 className="mt-3 text-4xl font-black">Fandoms</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/60">
              Your favourite artist communities will live here. Join a fandom
              to stay connected with the artists and fans you love.
            </p>
          </div>
        )}

        {/* Events page */}
        {activeTab === 'Events' && (
          <div className="py-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Never miss a moment
            </p>
            <h2 className="mt-3 text-4xl font-black">Events</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/60">
              Artist announcements, fan experiences, meet and greets, and
              upcoming events will appear here as we build them.
            </p>
          </div>
        )}
      </section>

      <footer className="border-t border-emerald-900/50 px-6 py-6 text-center text-xs text-white/35">
        Made for the fans who make the culture. © 4EVA
      </footer>
    </main>
  )
}

export default Home
