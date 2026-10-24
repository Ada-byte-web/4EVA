
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'

function App() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [page, setPage] = useState(
    window.location.pathname === '/signup' ? 'signup' : 'login'
  )

  useEffect(() => {
    function handleNavigation() {
      setPage(
        window.location.pathname === '/signup' ? 'signup' : 'login'
      )
    }

    function handleHashChange() {
      if (window.location.hash.includes('type=recovery')) {
        setResetMode(true)
      }
    }

    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('hashchange', handleHashChange)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setResetMode(true)
      }

      if (event === 'SIGNED_OUT') {
        setResetMode(false)
      }

      setSignedIn(Boolean(session))
      setSessionChecked(true)
    })

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Unable to check session:', error.message)
      }

      setSignedIn(Boolean(data.session))
      setSessionChecked(true)
    }

    checkSession()

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('hashchange', handleHashChange)
      subscription.unsubscribe()
    }
  }, [])

  function navigateTo(path: string) {
    window.history.pushState({}, '', path)
    setPage(path === '/signup' ? 'signup' : 'login')
  }

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A12] text-white">
        Loading 4EVA...
      </div>
    )
  }

  if (resetMode) {
    return <ResetPassword />
  }

  if (signedIn) {
    return <Home />
  }

  return (
    <div>
      {page === 'signup' ? (
        <Signup onNavigate={navigateTo} />
      ) : (
        <Login onNavigate={navigateTo} />
      )}
    </div>
  )
}

export default App
