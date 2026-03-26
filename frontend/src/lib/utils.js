export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function formatShortDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

export const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    className: 'border-[rgba(46,108,246,0.16)] bg-[var(--blue-soft)] text-[var(--blue)]',
    dotClassName: 'bg-[var(--blue)] shadow-[0_0_0_4px_rgba(46,108,246,0.14)]',
    chartColor: 'var(--blue)',
  },
  Interview: {
    label: 'Interview',
    className: 'border-[rgba(208,122,31,0.18)] bg-[var(--amber-soft)] text-[var(--amber)]',
    dotClassName: 'bg-[var(--amber)] shadow-[0_0_0_4px_rgba(208,122,31,0.14)]',
    chartColor: 'var(--amber)',
  },
  Offer: {
    label: 'Offer',
    className: 'border-[rgba(17,132,93,0.18)] bg-[var(--green-soft)] text-[var(--green)]',
    dotClassName: 'bg-[var(--green)] shadow-[0_0_0_4px_rgba(17,132,93,0.14)]',
    chartColor: 'var(--green)',
  },
  Rejected: {
    label: 'Rejected',
    className: 'border-[rgba(198,83,83,0.18)] bg-[var(--red-soft)] text-[var(--red)]',
    dotClassName: 'bg-[var(--red)] shadow-[0_0_0_4px_rgba(198,83,83,0.14)]',
    chartColor: 'var(--red)',
  },
}

export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'company', label: 'Company A-Z' },
  { value: 'status', label: 'Status' },
]

export function getProgressValue(stats) {
  if (!stats?.total) return 0
  return Math.min(100, Math.round((((stats.interview || 0) * 2) + ((stats.offer || 0) * 4)) / (stats.total * 4) * 100))
}

export function getTopStatus(stats) {
  if (!stats) return 'Applied'

  return Object.entries({
    Applied: stats.applied || 0,
    Interview: stats.interview || 0,
    Offer: stats.offer || 0,
    Rejected: stats.rejected || 0,
  }).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Applied'
}
