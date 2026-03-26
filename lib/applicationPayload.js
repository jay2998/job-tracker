const STATUS_VALUES = ['Applied', 'Interview', 'Offer', 'Rejected']

function asString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function sanitizeApplicationPayload(payload = {}) {
  const company = asString(payload.company)
  const role = asString(payload.role)
  const location = asString(payload.location)
  const salary = asString(payload.salary)
  const link = asString(payload.link)
  const notes = asString(payload.notes)
  const status = STATUS_VALUES.includes(payload.status) ? payload.status : 'Applied'

  const appliedDate = payload.appliedDate ? new Date(payload.appliedDate) : new Date()

  if (!company) {
    throw new Error('Company is required')
  }

  if (!role) {
    throw new Error('Role is required')
  }

  if (Number.isNaN(appliedDate.getTime())) {
    throw new Error('Applied date is invalid')
  }

  return {
    company,
    role,
    location,
    salary,
    link,
    notes,
    status,
    appliedDate,
  }
}

export function getSortOption(sort = 'newest') {
  switch (sort) {
    case 'oldest':
      return { appliedDate: 1, createdAt: 1 }
    case 'company':
      return { company: 1, createdAt: -1 }
    case 'status':
      return { status: 1, createdAt: -1 }
    default:
      return { createdAt: -1 }
  }
}

