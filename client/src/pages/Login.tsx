import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'

function Login({
  onNavigate,
}: {
  onNavigate: (path: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setMessage(error.message)
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setMessage('Enter your email address first.')
      return
    }

    setResetLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: window.location.origin }
      )

      setMessage(
        error
          ? error.message
          : 'If an account exists for this email, a reset link will be sent. Check your inbox and spam folder.'
      )
    } catch {
      setMessage('Unable to send the reset link. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071A12] px-5 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md space-y-5 rounded-3xl border border-emerald-400/15 bg-[#10291D]/90 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-9"
      >
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-emerald-300">
            YOUR PEOPLE. YOUR WORLD.
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            4EVA<span className="text-emerald-400">.</span>
          </h1>

          <h2 className="mt-6 text-2xl font-bold">Welcome back</h2>

          <p className="mt-2 text-sm text-white/60">
            Your fandom is waiting for you.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-sm font-medium text-white/80"
          >
            Email address
          </label>

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#071A12]/70 p-3.5 outline-none transition placeholder:text-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-white/80"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#071A12]/70 p-3.5 pr-12 outline-none transition placeholder:text-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading || loading}
              className="text-sm text-emerald-300 transition hover:text-emerald-200 disabled:opacity-50"
            >
              {resetLoading ? 'Sending link...' : 'Forgot password?'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || resetLoading}
          className="w-full rounded-xl bg-emerald-500 p-3.5 font-bold text-[#071A12] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Signing you in...' : 'Sign in to 4EVA'}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="break-words text-center text-sm leading-6 text-emerald-200"
          >
            {message}
          </p>
        )}

        <p className="pt-2 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            Sign up
          </button>
        </p>

        <p className="text-center text-xs text-white/40">
          Made for the fans who make the culture.
        </p>
      </form>
    </main>
  )
}

export default Login