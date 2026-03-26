import { connectDB } from '../../lib/db.js'
import Application from '../../lib/Application.js'
import { requireUser } from '../../lib/auth.js'
import { getSortOption, sanitizeApplicationPayload } from '../../lib/applicationPayload.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()

  try {
    const user = await requireUser(req)

    if (req.method === 'GET') {
      const { status, search, sort = 'newest' } = req.query
      const query = { user: user.id }

      if (status && status !== 'All') query.status = status
      if (search) {
        query.$or = [
          { company: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ]
      }

      const applications = await Application.find(query).sort(getSortOption(sort))
      return res.status(200).json(applications)
    }

    if (req.method === 'POST') {
      const payload = sanitizeApplicationPayload(req.body)
      const application = await Application.create({ ...payload, user: user.id })
      return res.status(201).json(application)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    const statusCode = err.message === 'Unauthorized' || err.message.includes('token') || err.message.includes('User not found') ? 401 : 400
    return res.status(statusCode).json({ error: statusCode === 401 ? 'Unauthorized' : err.message })
  }
}
