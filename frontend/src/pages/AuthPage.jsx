import { useState } from 'react'
import { BriefcaseBusiness, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const fieldClass = 'w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(14,124,102,0.12)]'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#17a488] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { login, register, getErrorMessage } = useAuth()

  const isRegister = mode === 'register'

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (isRegister) {
        await register(form)
      } else {
        await login({ email: form.email, password: form.password })
      }
    } catch (err) {
      setError(getErrorMessage(err, 'We could not complete authentication'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_50px_rgba(88,57,21,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[rgba(249,239,224,0.95)] to-[rgba(255,253,248,0.98)] p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,124,102,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(243,199,139,0.36),transparent_36%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--text)] backdrop-blur-sm">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#19a98b] text-white">
                <BriefcaseBusiness size={18} />
              </span>
              JobPilot
            </div>
            <p className="mt-10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">Private career workspace</p>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">
              Sign in to track your applications in one secure place.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[var(--text-muted)] sm:text-base">
              Create an account to keep your dashboard, search pipeline, notes, and job links attached to your own workspace.
            </p>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2">
            <FeatureCard title="Private data" text="Each account sees only its own applications and stats." />
            <FeatureCard title="Fast tracking" text="Search, sort, edit, and review the whole pipeline quickly." />
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-full border border-[var(--border)] bg-white/70 p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${!isRegister ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'}`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${isRegister ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)]'}`}
                >
                  Sign up
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {isRegister ? 'Create account' : 'Welcome back'}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-[var(--text)]">
                {isRegister ? 'Start your private job tracker' : 'Continue your search'}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {isRegister ? 'Use your name, email, and a secure password to create your workspace.' : 'Use your email and password to open your dashboard.'}
              </p>
            </div>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              {isRegister && (
                <Field icon={<UserRound size={16} />} label="Full name" value={form.name} onChange={updateField('name')} placeholder="Jahangir Ali" />
              )}
              <Field icon={<Mail size={16} />} label="Email" type="email" value={form.email} onChange={updateField('email')} placeholder="you@example.com" />
              <Field icon={<LockKeyhole size={16} />} label="Password" type="password" value={form.password} onChange={updateField('password')} placeholder="At least 8 characters" />

              {error ? <p className="rounded-2xl border border-[rgba(198,83,83,0.2)] bg-[var(--red-soft)] px-4 py-3 text-sm text-[var(--red)]">{error}</p> : null}

              <button type="submit" className={buttonClass} disabled={submitting}>
                {submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ icon, label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">{label}</span>
      <span className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{icon}</span>
        <input className={`${fieldClass} pl-11`} type={type} value={value} onChange={onChange} placeholder={placeholder} required />
      </span>
    </label>
  )
}

function FeatureCard({ title, text }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 backdrop-blur-sm">
      <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </div>
  )
}
