import crypto from 'crypto'
import User from './User.js'

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function fromBase64url(input) {
  return Buffer.from(input, 'base64url').toString('utf8')
}

function getSecret() {
  return process.env.AUTH_SECRET || 'dev-auth-secret-change-me'
}

function getUserId(user) {
  return user?._id || user?.id || ''
}

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

export function sanitizeAuthPayload(payload = {}, requireName = false) {
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = normalizeEmail(payload.email)
  const password = typeof payload.password === 'string' ? payload.password : ''

  if (requireName && !name) {
    throw new Error('Name is required')
  }

  if (!email || !email.includes('@')) {
    throw new Error('A valid email is required')
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }

  return { name, email, password }
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

export function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')
  const expected = Buffer.from(expectedHash, 'hex')

  if (hash.length !== expected.length) {
    return false
  }

  return crypto.timingSafeEqual(hash, expected)
}

export function signToken(user) {
  const userId = String(getUserId(user))

  if (!userId || userId === 'undefined') {
    throw new Error('Cannot sign token without a valid user id')
  }

  const payload = {
    sub: userId,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }

  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64url(JSON.stringify(header))
  const encodedPayload = base64url(JSON.stringify(payload))
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token) {
  if (!token) {
    throw new Error('Missing token')
  }

  const [encodedHeader, encodedPayload, signature] = token.split('.')

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Invalid token')
  }

  const expectedSignature = crypto
    .createHmac('sha256', getSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url')

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new Error('Invalid token signature')
  }

  const payload = JSON.parse(fromBase64url(encodedPayload))

  if (!payload.exp || !payload.sub || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired or invalid')
  }

  return payload
}

export function getBearerToken(req) {
  const authorization = req.headers.authorization || ''
  if (!authorization.startsWith('Bearer ')) return ''
  return authorization.slice(7)
}

export async function requireUser(req) {
  const token = getBearerToken(req)
  const payload = verifyToken(token)
  const user = await User.findById(payload.sub).select('_id name email')

  if (!user) {
    throw new Error('User not found')
  }

  req.user = {
    id: String(user._id),
    name: user.name,
    email: user.email,
  }

  return req.user
}

export function serializeUser(user) {
  return {
    id: String(getUserId(user)),
    name: user.name,
    email: user.email,
  }
}
