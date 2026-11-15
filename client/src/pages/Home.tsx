
import { useState } from 'react'
import { supabase } from '../supabase'
import Profile from './Profile'

const artists = [
  {
    name: 'Tems',
    category: 'Afrobeats · R&B',
    initials: 'T',
    color: 'from-emerald-700 to-teal-950',
    description: 'A space for fans to connect and celebrate the music.',
  },
  {
    name: 'Rema',
    category: 'Afrobeats',
    initials: 'R',
    color: 'from-green-700 to-emerald-950',
    description: 'Stay connected to the artist and the community.',
  },
  {
    name: 'Ayra Starr',
    category: 'Afropop',
    initials: 'A',
    color: 'from-teal-700 to-green-950',
    description: 'Discover updates, conversations and fan moments.',
  },
]

const fandoms = [
  {
    name: 'The Ravers',
    artist: 'Rema',
    members: 'Fan community',
    initials: 'R',
  },
  {
    name: 'Stargazers',
    artist: 'Ayra Starr',
    members: 'Fan community',
    initials: 'A',
  },
  {
    name: 'Rebel Gang',
    artist: 'Tems',
    members: 'Fan community',
    initials: 'T',
  },
]

const events = [
  {
    title: 'Fan Community Hangout',
    date: 'Coming soon',
    type: 'Community',
  },
  {
    title: 'Exclusive Fan Experience',
    date: 'Coming soon',
    type: 'Fan experience',
  },
]

function Home() {
  const [activeTab, setActiveTab] = useState('Home')
  const [signingOut, setSigningOut] = useState(false)

  const tabs = ['Home', 'Discover', 'Fandoms', 'Events', 'Profile']

  async function handleSignOut() {
    setSigningOut(true)

    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
      setSigningOut(false)
      return
    }

    window.location.reload()
  }

  function navigateTo(tab: string) {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectionTitle = (title: string, subtitle: string) => (
    <div className="mb-7">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/50 sm:text-base">
        {subtitle}
      </p>
    </div>
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#071A12] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071A12]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-[76px] lg:px-10">

          {/* LOGO */}
          <button
            onClick={() => navigateTo('Home')}
            className="shrink-0 text-2xl font-black tracking-tight sm:text-3xl"
          >
            4EVA<span className="text-emerald-400">.</span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-2 lg:flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => navigateTo(tab)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* DESKTOP SIGN OUT */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="hidden rounded-full border border-emerald-400/30 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50 lg:block"
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>

          {/* MOBILE SIGN OUT */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-full border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50 lg:hidden"
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-8 pb-28 sm:px-6 sm:pt-10 sm:pb-28 lg:px-10 lg:py-12">

        {/* HOME SECTION */}
        {activeTab === 'Home' && (
          <div className="space-y-14 sm:space-y-20">

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-[#103B28] via-[#0B2A1C] to-[#071A12] px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl sm:h-96 sm:w-96" />

              <div className="relative max-w-3xl">
                <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-300">
                  OFFICIAL HOME OF AFRICAN FANDOMS
                </span>

                <h1 className="mt-7 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-7xl">
                  Fandom is more than following.
                  <span className="block text-emerald-400">
                    It is belonging.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Discover your favourite artists, find your people and
                  experience the culture beyond the music. Your fandom
                  deserves a home.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigateTo('Discover')}
                    className="rounded-xl bg-emerald-400 px-7 py-3.5 text-sm font-bold text-[#071A12] transition hover:bg-emerald-300"
                  >
                    Explore artists
                  </button>

                  <button
                    onClick={() => navigateTo('Fandoms')}
                    className="rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Find your fandom
                  </button>
                </div>
              </div>
            </section>

            {/* INTRO */}
            <section>
              {sectionTitle(
                'Discover the culture',
                'Find artists and communities worth being part of.'
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {artists.map((artist) => (
                  <article
                    key={artist.name}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10291D] transition hover:-translate-y-1 hover:border-emerald-400/30"
                  >
                    <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${artist.color} sm:h-56`}>
                      <span className="text-7xl font-black text-white/20 transition group-hover:scale-110 sm:text-8xl">
                        {artist.initials}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Featured artist
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        {artist.name}
                      </h3>

                      <p className="mt-1 text-sm text-white/40">
                        {artist.category}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-white/60">
                        {artist.description}
                      </p>

                      <button
                        onClick={() => navigateTo('Discover')}
                        className="mt-5 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                      >
                        Explore artist →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* FANDOMS PREVIEW */}
            <section>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  {sectionTitle(
                    'Find your people',
                    'Communities built around the artists you love.'
                  )}
                </div>

                <button
                  onClick={() => navigateTo('Fandoms')}
                  className="mb-7 self-start text-sm font-semibold text-emerald-300 hover:text-emerald-200 sm:self-auto"
                >
                  View all fandoms →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {fandoms.map((fandom) => (
                  <article
                    key={fandom.name}
                    className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-[#10291D] p-5 transition hover:border-emerald-400/30"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-xl font-black text-emerald-300">
                      {fandom.initials}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold">
                        {fandom.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/50">
                        {fandom.artist}
                      </p>
                      <p className="mt-1 text-xs text-emerald-400">
                        {fandom.members}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* EVENTS PREVIEW */}
            <section>
              {sectionTitle(
                'Experiences that bring us closer',
                'Stay connected to the moments that matter.'
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {events.map((event) => (
                  <article
                    key={event.title}
                    className="rounded-2xl border border-white/10 bg-[#10291D] p-6 sm:p-7"
                  >
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                      {event.type}
                    </span>

                    <h3 className="mt-5 text-lg font-bold sm:text-xl">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                      {event.date}
                    </p>

                    <button
                      onClick={() => navigateTo('Events')}
                      className="mt-5 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                    >
                      Explore events →
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="rounded-3xl border border-emerald-400/15 bg-[#0D3020] px-6 py-10 text-center sm:px-10 sm:py-14">
              <h2 className="text-2xl font-black sm:text-3xl">
                Your fandom. Your people. Your 4EVA.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                The culture is bigger when we experience it together.
                Find your community and be part of something special.
              </p>

              <button
                onClick={() => navigateTo('Discover')}
                className="mt-7 rounded-xl bg-emerald-400 px-7 py-3.5 text-sm font-bold text-[#071A12] hover:bg-emerald-300"
              >
                Start exploring
              </button>
            </section>
          </div>
        )}

        {/* DISCOVER SECTION */}
        {activeTab === 'Discover' && (
          <section>
            <div className="mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
                EXPLORE 4EVA
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                Discover artists
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                Find the artists you love and discover the communities
                growing around them.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {artists.map((artist) => (
                <article
                  key={artist.name}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#10291D]"
                >
                  <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${artist.color} sm:h-56`}>
                    <span className="text-8xl font-black text-white/20">
                      {artist.initials}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold text-emerald-400">
                      ARTIST PREVIEW
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      {artist.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/50">
                      {artist.category}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-white/60">
                      {artist.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* FANDOMS SECTION */}
        {activeTab === 'Fandoms' && (
          <section>
            <div className="mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
                YOUR COMMUNITY
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                Explore fandoms
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                A place for fans to connect, share their passion and
                celebrate the artists they love.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {fandoms.map((fandom) => (
                <article
                  key={fandom.name}
                  className="rounded-2xl border border-white/10 bg-[#10291D] p-6 transition hover:border-emerald-400/30"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-xl font-black text-emerald-300">
                    {fandom.initials}
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    {fandom.name}
                  </h2>

                  <p className="mt-2 text-sm text-white/50">
                    For fans of {fandom.artist}
                  </p>

                  <p className="mt-3 text-xs text-emerald-400">
                    {fandom.members}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* EVENTS SECTION */}
        {activeTab === 'Events' && (
          <section>
            <div className="mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
                BE PART OF THE MOMENT
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                Events and experiences
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                Discover opportunities to connect with artists and
                fellow fans through memorable experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {events.map((event) => (
                <article
                  key={event.title}
                  className="rounded-2xl border border-white/10 bg-[#10291D] p-6 sm:p-8"
                >
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    {event.type}
                  </span>

                  <h2 className="mt-6 text-xl font-bold">
                    {event.title}
                  </h2>

                  <p className="mt-3 text-sm text-white/50">
                    {event.date}
                  </p>

                  <p className="mt-5 text-sm leading-6 text-white/60">
                    More details about upcoming experiences will
                    appear here.
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* PROFILE SECTION */}
        {activeTab === 'Profile' && (
          <Profile onBack={() => navigateTo('Home')} />
        )}

      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xl font-black">
            4EVA<span className="text-emerald-400">.</span>
          </p>

          <p className="text-xs leading-6 text-white/40 sm:text-sm">
            Made for the fans who make the culture.
          </p>

          <p className="text-xs text-white/30">
            © 2026 4EVA. All rights reserved.
          </p>
        </div>
      </footer>

      {/* MOBILE APP BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#071A12]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5">

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => navigateTo(tab)}
              aria-label={tab}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 transition ${
                activeTab === tab
                  ? 'text-emerald-400'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {tab === 'Home' && (
                  <>
                    <path d="m3 10 9-7 9 7" />
                    <path d="M5 9v12h14V9" />
                    <path d="M9 21v-7h6v7" />
                  </>
                )}

                {tab === 'Discover' && (
                  <>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                    <path d="m13.5 8.5-1.5 4-4 1.5 1.5-4z" />
                  </>
                )}

                {tab === 'Fandoms' && (
                  <>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                )}

                {tab === 'Events' && (
                  <>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                    <path d="m9 15 2 2 4-4" />
                  </>
                )}

                {tab === 'Profile' && (
                  <>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </>
                )}
              </svg>

              <span className="text-[10px] font-medium">
                {tab}
              </span>

              {activeTab === tab && (
                <span className="absolute bottom-1 h-1 w-5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}

        </div>
      </nav>

    </main>
  )
}

export default Home
