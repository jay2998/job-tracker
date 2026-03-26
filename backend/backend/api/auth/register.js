import { connectDB } from '../../../../lib/db.js'
import User from '../../../../lib/User.js'
import { hashPassword, sanitizeAuthPayload, serializeUser, signToken } from '../../../../lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  await connectDB()

  try {
    const { name, email, password } = sanitizeAuthPayload(req.body, true)
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ error: 'An account with that email already exists' })
    }

    const { salt, hash } = hashPassword(password)
    const user = await User.create({
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
    })

    const safeUser = serializeUser(user)
    return res.status(201).json({ token: signToken(user), user: safeUser })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
