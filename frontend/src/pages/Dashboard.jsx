import { useEffect, useState } from 'react'
import { ArrowRight, BriefcaseBusiness, ChartColumn, Sparkles, Target } from 'lucide-react'
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getStats, getApiError } from '@/lib/api'
import StatusBadge from '@/components/ui/StatusBadge'
import { cn, formatDate, getProgressValue, getTopStatus, STATUS_CONFIG } from '@/lib/utils'

const STATUS_COLORS = [
  STATUS_CONFIG.Applied.chartColor,
  STATUS_CONFIG.Interview.chartColor,
  STATUS_CONFIG.Offer.chartColor,
  STATUS_CONFIG.Rejected.chartColor,
]

const panelClass = 'rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)] sm:p-6'
const kickerClass = 'text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#17a488] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)] transition hover:-translate-y-0.5'

export default function Dashboard({ onQuickAdd }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    getStats()
      .then((response) => {
        if (!active) return
        setStats(response.data)
      })
      .catch((err) => {
        if (!active) return
        setError(getApiError(err, 'Unable to load dashboard'))
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <div className={panelClass}>Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className={`${panelClass} text-center`}>
        <p className={kickerClass}>Dashboard unavailable</p>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">We could not load your stats</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{error}</p>
      </div>
    )
  }

  const progressValue = getProgressValue(stats)
  const topStatus = getTopStatus(stats)

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[20px] border border-[var(--border)] bg-gradient-to-br from-[rgba(255,253,248,0.94)] to-[rgba(249,239,224,0.92)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={kickerClass}>Momentum snapshot</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
              Your search is moving. Keep the strongest leads close.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              Watch your pipeline volume, response signals, and monthly pace without digging through spreadsheets.
            </p>
          </div>
          <button type="button" className={buttonClass} onClick={onQuickAdd}>
            <ArrowRight size={16} />
            Add the next application
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <HeroStat value={stats.total} label="Tracked applications" />
          <HeroStat value={`${stats.responseRate}%`} label="Response rate" />
          <HeroStat value={`${stats.offerRate}%`} label="Offer rate" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pipeline strength"
          value={stats.total}
          meta={`${stats.monthlyDelta >= 0 ? '+' : ''}${stats.monthlyDelta} vs last month`}
          icon={<BriefcaseBusiness size={18} />}
          tint="bg-[var(--accent-soft)] text-[var(--accent)]"
        />
        <MetricCard
          title="Interviews"
          value={stats.interview}
          meta="Opportunities in conversation"
          icon={<ChartColumn size={18} />}
          tint="bg-[var(--amber-soft)] text-[var(--amber)]"
        />
        <MetricCard
          title="Offers"
          value={stats.offer}
          meta="Highest value outcomes"
          icon={<Sparkles size={18} />}
          tint="bg-[var(--green-soft)] text-[var(--green)]"
        />
        <MetricCard
          title="Primary status"
          value={topStatus}
          meta="Where most of your pipeline sits"
          icon={<Target size={18} />}
          tint="bg-[var(--blue-soft)] text-[var(--blue)]"
          compact
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <div className={panelClass}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={kickerClass}>Monthly pace</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">Applications trend</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">Last 6 months</p>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[rgba(45,36,22,0.08)]">
              <span className="block h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#24b69a]" style={{ width: `${progressValue}%` }} />
            </div>
            <p className="text-sm text-[var(--text-muted)]">Pipeline quality score: {progressValue}/100</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.monthlyApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(105,74,34,0.12)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(14,124,102,0.07)' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {stats.monthlyApplications.map((_, index) => (
                    <Cell key={index} fill={index === stats.monthlyApplications.length - 1 ? 'var(--accent)' : 'rgba(14,124,102,0.35)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={panelClass}>
            <p className={kickerClass}>What to focus on</p>
            <strong className="mt-3 block font-display text-lg font-bold text-[var(--text)]">
              {stats.interview > 0 ? 'Interview momentum is your biggest lever right now.' : 'Your top opportunity is generating more responses.'}
            </strong>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              {stats.interview > 0
                ? `You have ${stats.interview} active interview-stage role${stats.interview === 1 ? '' : 's'}. Tight follow-up and prep here will move the needle fastest.`
                : 'Most of your applications are still early stage. Increasing application quality and consistent outreach will help lift reply volume.'}
            </p>
          </div>

          <div className={panelClass}>
            <div>
              <p className={kickerClass}>Status split</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">Pipeline breakdown</h2>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {stats.statusBreakdown.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-sm text-[var(--text)]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[index] }} />
                    <span>{item.status}</span>
                  </div>
                  <strong className="text-sm font-bold text-[var(--text)]">{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={panelClass}>
        <div>
          <p className={kickerClass}>Recent activity</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">Latest applications</h2>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {stats.recent?.length ? (
            stats.recent.map((application) => (
              <div key={application._id} className="grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-[74px_minmax(0,1fr)]">
                <div>{formatDate(application.appliedDate)}</div>
                <div>
                  <strong className="block text-sm font-bold text-[var(--text)]">{application.company}</strong>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">
                    {application.role}{application.location ? ` • ${application.location}` : ''}
                  </div>
                  <div className="mt-3">
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-white/50 px-6 py-10 text-center">
              <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">No applications yet</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Add your first opportunity to unlock charts and progress insights.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function HeroStat({ value, label }) {
  return (
    <div className="min-w-[150px] rounded-[18px] border border-[var(--border)] bg-white/70 px-4 py-3">
      <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--text)]">{value}</div>
      <div className="mt-1 text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  )
}

function MetricCard({ title, value, meta, icon, tint, compact = false }) {
  return (
    <div className={panelClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold tracking-[-0.03em] text-[var(--text)]">{title}</h3>
          <div className={cn('mt-2 font-display font-bold tracking-[-0.04em] text-[var(--text)]', compact ? 'text-[28px]' : 'text-[34px]')}>
            {value}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">{meta}</div>
        </div>
        <div className={cn('grid h-11 w-11 place-items-center rounded-[14px]', tint)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
