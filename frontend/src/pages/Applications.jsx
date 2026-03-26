import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExternalLink, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react'
import ApplicationModal from '@/components/ui/ApplicationModal'
import StatusBadge from '@/components/ui/StatusBadge'
import { useApplications } from '@/hooks/useApplications'
import { cn, formatDate, formatShortDate, SORT_OPTIONS, STATUSES } from '@/lib/utils'

const panelClass = 'rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)] sm:p-6'
const kickerClass = 'text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]'
const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition'
const primaryButton = `${buttonBase} bg-gradient-to-br from-[var(--accent)] to-[#17a488] text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)] hover:-translate-y-0.5`
const secondaryButton = `${buttonBase} border border-[var(--border)] bg-white text-[var(--text)] hover:-translate-y-0.5`
const ghostButton = `${buttonBase} border border-[var(--border)] bg-white/45 text-[var(--text)] hover:-translate-y-0.5`
const inputClass = 'w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(14,124,102,0.12)]'

export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sort, setSort] = useState('newest')
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const isNewModalOpen = searchParams.get('new') === '1'
  const modalOpen = isNewModalOpen || Boolean(editing)

  const filters = useMemo(() => {
    const next = { sort }
    if (search) next.search = search
    if (statusFilter !== 'All') next.status = statusFilter
    return next
  }, [search, sort, statusFilter])

  const { data, loading, error, add, update, remove } = useApplications(filters)

  const pipelineCounts = useMemo(() => {
    return ['All', ...STATUSES].map((status) => ({
      status,
      count: status === 'All' ? data.length : data.filter((app) => app.status === status).length,
    }))
  }, [data])

  const openNewModal = () => {
    setEditing(null)
    setSearchParams({ new: '1' })
  }

  const closeModal = () => {
    setEditing(null)
    setSearchParams({})
  }

  const handleSubmit = async (form) => {
    if (editing) return update(editing._id, form)
    return add(form)
  }

  const handleDelete = async (application) => {
    if (!window.confirm(`Delete ${application.company} - ${application.role}?`)) return
    setDeletingId(application._id)
    await remove(application._id, application.company)
    setDeletingId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[20px] border border-[var(--border)] bg-gradient-to-br from-[rgba(255,253,248,0.94)] to-[rgba(249,239,224,0.92)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={kickerClass}>Pipeline manager</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
              A clean workspace for every role you are chasing.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              Search by company, role, or location. Sort the list your way. Keep notes and links attached to the right opportunity.
            </p>
          </div>
          <button type="button" className={primaryButton} onClick={openNewModal}>
            <PlusCircle size={16} />
            New application
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {pipelineCounts.slice(0, 3).map((item) => (
            <div key={item.status} className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)]">
              <h3 className="font-display text-base font-bold tracking-[-0.03em] text-[var(--text)]">{item.status}</h3>
              <div className="mt-2 font-display text-[34px] font-bold tracking-[-0.04em] text-[var(--text)]">{item.count}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                {item.status === 'All' ? 'Total records in your pipeline' : `${item.status} stage opportunities`}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={panelClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <label className="mb-2 block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">Search</label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                className={`${inputClass} pl-11`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Company, role, or location"
              />
            </div>
          </div>
          <div className="min-w-full lg:min-w-[220px]">
            <label className="mb-2 block text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">Sort by</label>
            <select className={inputClass} value={sort} onChange={(event) => setSort(event.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {['All', ...STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              className={cn(
                'rounded-full border px-4 py-2.5 text-sm font-bold transition',
                statusFilter === status
                  ? 'border-[rgba(14,124,102,0.22)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--border)] bg-white/65 text-[var(--text-muted)] hover:border-[rgba(14,124,102,0.22)] hover:text-[var(--accent)]'
              )}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className={panelClass}>Loading applications...</div>
      ) : error ? (
        <div className={`${panelClass} text-center`}>
          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">We hit a loading problem</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className={`${panelClass} text-center`}>
          <p className={kickerClass}>No matches</p>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text)]">
            {search || statusFilter !== 'All' ? 'Nothing matches the current filters' : 'Your pipeline is empty'}
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {search || statusFilter !== 'All'
              ? 'Try a broader search or switch the selected status.'
              : 'Add your first application to start tracking momentum.'}
          </p>
          <button type="button" className={`${primaryButton} mt-5`} onClick={openNewModal}>
            <PlusCircle size={16} />
            Add application
          </button>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-4 md:hidden">
            {data.map((application) => (
              <article key={application._id} className={`${panelClass} ${deletingId === application._id ? 'opacity-45' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-lg font-bold tracking-[-0.03em] text-[var(--text)]">{application.company}</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">
                      {application.role}{application.location ? ` • ${application.location}` : ''}
                    </div>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className={kickerClass}>Applied</p>
                    <strong className="mt-1 block text-sm text-[var(--text)]">{formatShortDate(application.appliedDate)}</strong>
                  </div>
                  <div>
                    <p className={kickerClass}>Salary</p>
                    <strong className="mt-1 block text-sm text-[var(--text)]">{application.salary || '-'}</strong>
                  </div>
                  <div>
                    <p className={kickerClass}>Notes</p>
                    <strong className="mt-1 block text-sm text-[var(--text)]">
                      {application.notes ? `${application.notes.slice(0, 28)}${application.notes.length > 28 ? '...' : ''}` : '-'}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {application.link && (
                    <a className={secondaryButton} href={application.link} target="_blank" rel="noreferrer">
                      <ExternalLink size={16} />
                      Open
                    </a>
                  )}
                  <button type="button" className={secondaryButton} onClick={() => { setEditing(application) }}>
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button type="button" className={ghostButton} onClick={() => handleDelete(application)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className={`${panelClass} hidden md:block`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Company', 'Role', 'Status', 'Applied', 'Location', 'Salary', 'Actions'].map((heading) => (
                      <th key={heading} className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((application) => (
                    <tr key={application._id} className={deletingId === application._id ? 'opacity-45' : ''}>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top last:border-b-0">
                        <strong className="block text-sm font-bold text-[var(--text)]">{application.company}</strong>
                        {application.notes ? (
                          <div className="mt-1 text-sm text-[var(--text-muted)]">
                            {application.notes.slice(0, 60)}{application.notes.length > 60 ? '...' : ''}
                          </div>
                        ) : null}
                      </td>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top text-sm text-[var(--text)]">{application.role}</td>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top"><StatusBadge status={application.status} /></td>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top text-sm text-[var(--text)]">{formatDate(application.appliedDate)}</td>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top text-sm text-[var(--text)]">{application.location || '-'}</td>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top text-sm text-[var(--text)]">{application.salary || '-'}</td>
                      <td className="border-b border-[rgba(105,74,34,0.1)] px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-3">
                          {application.link && (
                            <a href={application.link} target="_blank" rel="noreferrer" className={secondaryButton}>
                              <ExternalLink size={15} />
                              Link
                            </a>
                          )}
                          <button type="button" className={secondaryButton} onClick={() => { setEditing(application) }}>
                            <Pencil size={15} />
                            Edit
                          </button>
                          <button type="button" className={ghostButton} onClick={() => handleDelete(application)}>
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <ApplicationModal
        key={editing?._id || (isNewModalOpen ? 'new' : 'closed')}
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  )
}
