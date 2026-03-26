# JobPilot

JobPilot is a full-stack job application tracker built with React, Vite, Express, and MongoDB. It now includes account-based authentication, so each user only sees their own applications and dashboard metrics.

## What is included

- Email/password authentication
- Per-user job applications and stats
- Responsive dashboard with:
  - total applications
  - interview and offer metrics
  - response and offer rates
  - monthly trend chart
  - recent activity feed
- Applications manager with:
  - search by company, role, and location
  - status filters
  - sorting options
  - notes, salary, location, and job link support
  - create, edit, and delete flows
- Backend API with:
  - MongoDB persistence
  - authentication token verification
  - request validation and sanitization
  - richer stats endpoint

## MongoDB Atlas

Yes, the app works with MongoDB Atlas. Set `MONGODB_URI` in `backend/.env.local` to your Atlas connection string.

## Project structure

- `frontend/` - React + Vite client
- `backend/` - local Express bridge for API routes
- `backend/backend/api/` - auth and application API handlers
- `lib/` - shared MongoDB models and auth/payload utilities

## Setup

### 1. Install dependencies

Root dependencies:

```powershell
npm install
```

Frontend dependencies:

```powershell
cd frontend
npm install
```

### 2. Create environment variables

Copy `backend/.env.example` into `backend/.env.local`.

Required variables:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=replace_with_a_long_random_secret
```

### 3. Start the backend

From the project root:

```powershell
npm run server
```

The backend runs on `http://localhost:5000`.

### 4. Start the frontend

From `frontend/`:

```powershell
npm run dev
```

The frontend will connect to `http://localhost:5000` by default.

## Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Application endpoints

Authenticated routes:

- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/applications/stats`

## Notes

- Production frontend builds are working.
- There is still a non-blocking Vite warning about the final JavaScript bundle size because charting and UI dependencies are bundled together. The app still builds and runs correctly.
