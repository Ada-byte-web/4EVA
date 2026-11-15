
import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'

function Signup({
  onNavigate,
}: {
  onNavigate: (path: string) => void
}) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: 'https://4-eva-lyart.vercel.app',
          data: {
            name: name.trim(),
            username: username.trim(),
          },
        },
      })

      if (error) {
        setMessageType('error')
        setMessage(error.message)
      } else if (data.session) {
        setMessageType('success')
        setMessage('Your account has been created successfully!')
      } else {
        setMessageType('success')
        setMessage(
          'Your account has been created. Please check your email to confirm your account before signing in.'
        )
      }
    } catch {
      setMessageType('error')
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle =
    'w-full rounded-xl border border-emerald-400/20 bg-[#071A12]/70 p-3.5 text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071A12] px-5 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

      <form
        onSubmit={handleSignup}
        className="relative w-full max-w-md space-y-5 rounded-3xl border border-emerald-400/15 bg-[#10291D] p-7 shadow-2xl shadow-black/20 sm:p-9"
      >
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-emerald-300">
            YOUR PEOPLE. YOUR WORLD.
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            4EVA<span className="text-emerald-400">.</span>
          </h1>

          <h2 className="mt-6 text-2xl font-bold">
            Join your fandom
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Create your account and find your people.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-name"
            className="text-sm font-medium text-white/80"
          >
            Full name
          </label>

          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-username"
            className="text-sm font-medium text-white/80"
          >
            Username
          </label>

          <input
            id="signup-username"
            type="text"
            autoComplete="username"
            placeholder="Choose a unique username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-white/80"
          >
            Email address
          </label>

          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-password"
            className="text-sm font-medium text-white/80"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputStyle} pr-12`}
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute inset-y-0 right-3 flex items-center text-emerald-300 transition hover:text-emerald-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.3 4.5 9 7-.3 1.1-1 2.3-2 3.4" />
                  <path d="M6.2 6.2C3.9 7.7 2.4 10 2 12c.7 2.5 4 7 10 7 1 0 2-.2 2.9-.5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <p className="text-xs text-white/40">
            Use at least 8 characters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 p-3.5 font-bold text-[#071A12] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating your account...' : 'Create account'}
        </button>

        {message && (
          <p
            role={messageType === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className={`break-words text-center text-sm leading-6 ${
              messageType === 'error'
                ? 'text-red-400'
                : 'text-green-400'
            }`}
          >
            {message}
          </p>
        )}

        <p className="pt-2 text-center text-sm text-white/60">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            Log in
          </button>
        </p>

        <p className="text-center text-xs text-white/40">
          Made for the fans who make the culture.
        </p>
      </form>
    </main>
  )
}

export default Signup
