import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, PlusCircle } from 'lucide-react'
import { Toaster } from 'sonner'
import { useMemo, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Dashboard from '@/pages/Dashboard'
import Applications from '@/pages/Applications'
import AuthPage from '@/pages/AuthPage'
import { useAuth } from '@/hooks/useAuth'

const shellBg = 'bg-[rgba(255,250,243,0.66)]'
const softPanel = 'border border-[var(--border)] bg-[var(--card)] shadow-[0_12px_30px_rgba(88,57,21,0.08)]'
const ghostButton = 'border border-[var(--border)] bg-white/45 text-[var(--text)] hover:-translate-y-0.5'
const primaryButton = 'bg-gradient-to-br from-[var(--accent)] to-[#17a488] text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)] hover:-translate-y-0.5'
const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition'

function AppFrame() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const pageMeta = useMemo(() => {
    if (location.pathname === '/applications') {
      return {
        title: 'Applications',
        description: 'Organize leads, update statuses, and keep every opportunity moving.',
      }
    }

    return {
      title: 'Dashboard',
      description: 'See momentum, conversion signals, and what deserves attention next.',
    }
  }, [location.pathname])

  const triggerQuickAdd = () => {
    navigate('/applications?new=1')
    setMobileOpen(false)
  }

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onQuickAdd={triggerQuickAdd} user={user} onLogout={logout} />

      <div className="min-w-0 px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
        <header className="flex flex-col gap-5 pb-6 md:pb-7 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Job search operating system
            </p>
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">
              {pageMeta.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              {pageMeta.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <div className="rounded-full border border-[var(--border)] bg-white/65 px-4 py-2 text-sm text-[var(--text-muted)]">
              Signed in as <span className="font-semibold text-[var(--text)]">{user?.name}</span>
            </div>
            <button type="button" className={`${buttonBase} ${ghostButton} lg:hidden`} onClick={() => setMobileOpen(true)}>
              <Menu size={16} />
              Menu
            </button>
            <button type="button" className={`${buttonBase} ${primaryButton}`} onClick={triggerQuickAdd}>
              <PlusCircle size={16} />
              Add application
            </button>
            <button type="button" className={`${buttonBase} ${ghostButton}`} onClick={logout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="flex flex-col gap-6">
          <Routes>
            <Route path="/" element={<Dashboard onQuickAdd={triggerQuickAdd} />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--text-muted)]">Loading your workspace...</div>
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: `${shellBg} ${softPanel} text-[var(--text)] backdrop-blur-md`,
        }}
      />
      {user ? <AppFrame /> : <AuthPage />}
    </BrowserRouter>
  )
}

