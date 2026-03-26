import { useState } from 'react'
import { X } from 'lucide-react'
import { STATUSES } from '@/lib/utils'

const defaultForm = {
  company: '',
  role: '',
  location: '',
  status: 'Applied',
  appliedDate: '',
  link: '',
  notes: '',
  salary: '',
}

function buildForm(initial) {
  if (!initial) return defaultForm

  return {
    ...defaultForm,
    ...initial,
    appliedDate: initial.appliedDate
      ? new Date(initial.appliedDate).toISOString().split('T')[0]
      : '',
  }
}

const fieldClass = 'w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(14,124,102,0.12)]'
const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition'

export default function ApplicationModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(() => buildForm(initial))
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const ok = await onSubmit(form)
    setLoading(false)
    if (ok) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(32,24,12,0.35)] p-4 backdrop-blur-md sm:p-5" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[calc(100vh-32px)] w-full max-w-3xl overflow-auto rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_12px_30px_rgba(88,57,21,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {initial ? 'Edit application' : 'New application'}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-[var(--text)]">
              {initial ? 'Update application details' : 'Capture a new opportunity'}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Keep your pipeline fresh with the right role, location, salary, and notes.
            </p>
          </div>
          <button
            type="button"
            className={`${buttonBase} border border-[var(--border)] bg-white/45 text-[var(--text)] hover:-translate-y-0.5`}
            onClick={onClose}
          >
            <X size={16} />
            Close
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company" value={form.company} onChange={updateField('company')} placeholder="Stripe" required />
            <Field label="Role" value={form.role} onChange={updateField('role')} placeholder="Frontend Engineer" required />
            <Field label="Location" value={form.location} onChange={updateField('location')} placeholder="Remote or Karachi" />
            <Field label="Applied date" type="date" value={form.appliedDate} onChange={updateField('appliedDate')} />
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">Status</label>
              <select id="status" className={fieldClass} value={form.status} onChange={updateField('status')}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <Field label="Salary" value={form.salary} onChange={updateField('salary')} placeholder="$90k or negotiable" />
          </div>

          <Field label="Job link" value={form.link} onChange={updateField('link')} placeholder="https://company.com/job" />
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">Notes</label>
            <textarea
              id="notes"
              className={`${fieldClass} min-h-[120px] resize-y`}
              value={form.notes}
              onChange={updateField('notes')}
              placeholder="Recruiter contact, interview prep, custom resume version, follow-up ideas..."
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-muted)]">Required fields are company and role.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" className={`${buttonBase} border border-[var(--border)] bg-white text-[var(--text)] hover:-translate-y-0.5`} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={`${buttonBase} bg-gradient-to-br from-[var(--accent)] to-[#17a488] text-white shadow-[0_12px_30px_rgba(88,57,21,0.08)] hover:-translate-y-0.5`} disabled={loading}>
                {loading ? 'Saving...' : initial ? 'Save changes' : 'Add application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">{label}</label>
      <input className={fieldClass} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  )
}
