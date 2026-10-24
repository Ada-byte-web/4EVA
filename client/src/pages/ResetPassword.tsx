
import { useState, type FormEvent } from 'react'
import { supabase } from '../supabase'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleUpdatePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (password.length < 8) {
      setMessage('Your password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Your passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Your password has been updated successfully!')
        setSuccess(true)
        setPassword('')
        setConfirmPassword('')
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle =
    'w-full rounded-xl border border-emerald-400/20 bg-[#071A12]/70 p-3.5 pr-12 text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'

  function PasswordIcon({ visible }: { visible: boolean }) {
    return visible ? (
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
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071A12] px-5 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

      <form
        onSubmit={handleUpdatePassword}
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
            Create a new password
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Choose a new password for your 4EVA account.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="text-sm font-medium text-white/80"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputStyle}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute inset-y-0 right-3 flex items-center text-emerald-300 transition hover:text-emerald-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              <PasswordIcon visible={showPassword} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-white/80"
          >
            Confirm new password
          </label>

          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter the password again"
              className={inputStyle}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              className="absolute inset-y-0 right-3 flex items-center text-emerald-300 transition hover:text-emerald-200"
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
              title={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              <PasswordIcon visible={showConfirmPassword} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-xl bg-emerald-500 p-3.5 font-bold text-[#071A12] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Updating password...'
            : success
              ? 'Password updated'
              : 'Save new password'}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`break-words text-center text-sm leading-6 ${
              success ? 'text-emerald-300' : 'text-emerald-100'
            }`}
          >
            {message}
          </p>
        )}

        {success && (
          <button
            type="button"
            onClick={() => {
              window.location.hash = ''
              window.location.href = '/login'
            }}
            className="w-full rounded-xl border border-emerald-400/20 p-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
          >
            Return to login
          </button>
        )}
      </form>
    </main>
  )
}

export default ResetPassword
