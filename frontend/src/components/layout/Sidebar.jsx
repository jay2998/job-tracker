import { createElement } from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, BriefcaseBusiness, ListChecks, LogOut, PlusCircle, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Dashboard', icon: BarChart3, note: 'Track progress' },
  { to: '/applications', label: 'Applications', icon: ListChecks, note: 'Manage pipeline' },
]

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition'

export default function Sidebar({ mobileOpen, onClose, onQuickAdd, user, onLogout }) {
  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[min(320px,88vw)] flex-col gap-6 border-r border-[var(--border)] bg-[rgba(255,250,243,0.66)] p-6 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:min-h-screen lg:w-auto lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-[105%]'
        )}
      >
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#19a98b] text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)]">
            <BriefcaseBusiness size={18} />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">Career cockpit</p>
            <h1 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">JobPilot</h1>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex rounded-full p-2 text-[var(--text-muted)] lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_30px_rgba(88,57,21,0.08)]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <UserRound size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.name}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{user?.email}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">Workspace</p>
          <nav className="flex flex-col gap-2.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={onClose}
                className={({ isActive }) => cn(
                  'flex items-center gap-3.5 rounded-[18px] border px-4 py-3 transition',
                  isActive
                    ? 'border-[var(--border)] bg-[var(--card)] shadow-[0_12px_30px_rgba(88,57,21,0.08)]'
                    : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--card)] hover:shadow-[0_12px_30px_rgba(88,57,21,0.08)]'
                )}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  {createElement(link.icon, { size: 16 })}
                </span>
                <span>
                  <strong className="block text-sm text-[var(--text)]">{link.label}</strong>
                  <small className="block text-xs text-[var(--text-muted)]">{link.note}</small>
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">Quick action</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">Add a fresh lead</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Capture new opportunities before they slip out of your pipeline.
          </p>
          <button
            type="button"
            className={`${buttonBase} mt-5 w-full bg-gradient-to-br from-[var(--accent)] to-[#17a488] text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)] hover:-translate-y-0.5`}
            onClick={onQuickAdd}
          >
            <PlusCircle size={16} />
            New application
          </button>
          <button
            type="button"
            className={`${buttonBase} mt-3 w-full border border-[var(--border)] bg-white/65 text-[var(--text)] hover:-translate-y-0.5`}
            onClick={onLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
