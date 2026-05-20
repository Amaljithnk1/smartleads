# SmartLeads CRM Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and a stunning dual-theme UI.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + TailwindCSS + Vite |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Containerization | Docker + Docker Compose |

---

## Features

- **JWT Authentication** — Register, login, protected routes, auth middleware
- **Lead CRUD** — Create, read, update, delete leads
- **Advanced Filtering** — Filter by status, source, search by name/email, sort — all combinable
- **Backend Pagination** — 10 records/page with metadata
- **Debounced Search** — 400ms debounce on search input
- **CSV Export** — Download all leads as CSV
- **Role-Based Access Control** — Admin vs Sales User roles
- **Dark / Light Mode** — Circuit grid dark theme, cherry blossom light theme
- **Responsive Design** — Works on all screen sizes

---

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally OR use Docker

### 1. Clone & install

```bash
git clone <repo-url>
cd smartleads

# Backend
cd backend
cp .env.example .env        # Fill in your values
npm install
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## Docker Setup

```bash
# From project root
cp backend/.env.example backend/.env
docker-compose up --build
```

App: http://localhost:5173  
API: http://localhost:5000

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartleads
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### POST `/auth/register`
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "sales"
}
```
Response: `{ token, user }`

#### POST `/auth/login`
```json
{ "email": "rahul@example.com", "password": "password123" }
```
Response: `{ token, user }`

#### GET `/auth/me`
Headers: `Authorization: Bearer <token>`

#### GET `/auth/users` *(Admin only)*
Returns all users.

---

### Leads

All lead routes require `Authorization: Bearer <token>`

#### GET `/leads`
Query params:
- `status` — New | Contacted | Qualified | Lost
- `source` — Website | Instagram | Referral
- `search` — string (searches name + email)
- `sort` — latest | oldest
- `page` — number (default: 1)
- `limit` — number (default: 10, max: 50)

Response:
```json
{
  "success": true,
  "data": { "leads": [...] },
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5, "hasNextPage": true, "hasPrevPage": false }
}
```

#### GET `/leads/stats`
Returns lead counts by status.

#### GET `/leads/export/csv`
Downloads leads as a CSV file.

#### GET `/leads/:id`
Returns single lead.

#### POST `/leads`
```json
{
  "name": "Priya Nair",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in premium plan"
}
```

#### PUT `/leads/:id`
Partial update — send only the fields to update.

#### DELETE `/leads/:id` *(Admin only)*

---

## Project Structure

```
smartleads/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controllers/  # Auth & Lead controllers
│   │   ├── middleware/   # Auth, validation, error handler
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routers
│   │   ├── types/        # TypeScript interfaces
│   │   └── index.ts      # App entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/       # Background images
│   │   ├── components/
│   │   │   ├── auth/     # ProtectedRoute
│   │   │   ├── layout/   # Sidebar, Topbar, DashboardLayout
│   │   │   ├── leads/    # Table, Modals, FiltersBar
│   │   │   └── ui/       # StatCard, Pagination
│   │   ├── context/      # Auth + Theme contexts
│   │   ├── hooks/        # useLeads, useDebounce
│   │   ├── pages/        # Route-level page components
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Helpers
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Roles & Permissions

| Action | Admin | Sales |
|---|---|---|
| View own leads | ✅ | ✅ |
| View all leads | ✅ | ❌ |
| Create leads | ✅ | ✅ |
| Edit own leads | ✅ | ✅ |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ✅ |
| Manage users | ✅ | ❌ |
