import { connectDB } from '../../../../lib/db.js'
import User from '../../../../lib/User.js'
import { sanitizeAuthPayload, serializeUser, signToken, verifyPassword } from '../../../../lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  await connectDB()

  try {
    const { email, password } = sanitizeAuthPayload(req.body)
    const user = await User.findOne({ email })

    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const safeUser = serializeUser(user)
    return res.status(200).json({ token: signToken(user), user: safeUser })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
