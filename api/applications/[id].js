import { connectDB } from '../../lib/db.js'
import Application from '../../lib/Application.js'
import { requireUser } from '../../lib/auth.js'
import { sanitizeApplicationPayload } from '../../lib/applicationPayload.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()
  const { id } = req.query

  try {
    const user = await requireUser(req)
    const query = { _id: id, user: user.id }

    if (req.method === 'PUT') {
      const payload = sanitizeApplicationPayload(req.body)
      const application = await Application.findOneAndUpdate(query, payload, { new: true, runValidators: true })
      if (!application) return res.status(404).json({ error: 'Application not found' })
      return res.status(200).json(application)
    }

    if (req.method === 'DELETE') {
      const application = await Application.findOneAndDelete(query)
      if (!application) return res.status(404).json({ error: 'Application not found' })
      return res.status(200).json({ message: 'Deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
