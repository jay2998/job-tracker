import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import applicationsHandler from './backend/api/applications/index.js'
import statsHandler from './backend/api/applications/stats.js'
import idHandler from './backend/api/applications/[id].js'
import registerHandler from './backend/api/auth/register.js'
import loginHandler from './backend/api/auth/login.js'
import meHandler from './backend/api/auth/me.js'

const envPath = fileURLToPath(new URL('./.env.local', import.meta.url))
dotenv.config({ path: envPath })

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/auth/register', (req, res) => registerHandler(req, res))
app.post('/api/auth/login', (req, res) => loginHandler(req, res))
app.get('/api/auth/me', (req, res) => meHandler(req, res))
app.all('/api/applications', (req, res) => applicationsHandler(req, res))
app.get('/api/applications/stats', (req, res) => statsHandler(req, res))
app.all('/api/applications/:id', (req, res) => {
  req.query = { ...(req.query ?? {}), id: req.params.id }
  return idHandler(req, res)
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
