import { connectDB } from '../../lib/db.js'
import Application from '../../lib/Application.js'
import { requireUser } from '../../lib/auth.js'

const STATUS_ORDER = ['Applied', 'Interview', 'Offer', 'Rejected']

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()

  try {
    const user = await requireUser(req)
    const baseQuery = { user: user.id }

    const [total, applied, interview, offer, rejected, recent, allApplications] = await Promise.all([
      Application.countDocuments(baseQuery),
      Application.countDocuments({ ...baseQuery, status: 'Applied' }),
      Application.countDocuments({ ...baseQuery, status: 'Interview' }),
      Application.countDocuments({ ...baseQuery, status: 'Offer' }),
      Application.countDocuments({ ...baseQuery, status: 'Rejected' }),
      Application.find(baseQuery).sort({ createdAt: -1 }).limit(5),
      Application.find(baseQuery).select('status appliedDate company role location createdAt').sort({ appliedDate: 1, createdAt: 1 }),
    ])

    const counts = { Applied: applied, Interview: interview, Offer: offer, Rejected: rejected }
    const statusBreakdown = STATUS_ORDER.map((status) => ({ status, count: counts[status] }))
    const totalResponses = interview + offer + rejected
    const responseRate = total === 0 ? 0 : Math.round((totalResponses / total) * 100)
    const offerRate = total === 0 ? 0 : Math.round((offer / total) * 100)

    const monthBuckets = []
    const now = new Date()

    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      monthBuckets.push({ key: `${date.getFullYear()}-${date.getMonth()}`, label: formatMonthLabel(date), count: 0 })
    }

    allApplications.forEach((application) => {
      const date = new Date(application.appliedDate || application.createdAt)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const bucket = monthBuckets.find((item) => item.key === key)
      if (bucket) bucket.count += 1
    })

    const latestMonthCount = monthBuckets.at(-1)?.count ?? 0
    const previousMonthCount = monthBuckets.at(-2)?.count ?? 0
    const monthlyDelta = latestMonthCount - previousMonthCount

    return res.status(200).json({
      total,
      applied,
      interview,
      offer,
      rejected,
      recent,
      statusBreakdown,
      responseRate,
      offerRate,
      monthlyApplications: monthBuckets.map(({ label, count }) => ({ label, count })),
      monthlyDelta,
    })
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
