# GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript throughout.

![Stack](https://img.shields.io/badge/React-18-blue) ![Stack](https://img.shields.io/badge/Node.js-20-green) ![Stack](https://img.shields.io/badge/TypeScript-5-blue) ![Stack](https://img.shields.io/badge/MongoDB-7-green)

## Features

- **JWT Authentication** – Register, login, protected routes, bcrypt password hashing
- **Leads CRUD** – Create, read, update, delete leads with full validation
- **Advanced Filtering** – Filter by status, source, search by name/email, sort latest/oldest (combined filters)
- **Backend Pagination** – 10 records per page with metadata
- **Debounced Search** – 500ms debounce on frontend search input
- **CSV Export** – Admin-only CSV export with current filters applied
- **Role-Based Access Control** – Admin vs Sales User permissions
- **Dark Mode** – Toggle between light and dark themes
- **Docker Setup** – Full containerized deployment with docker-compose
- **Responsive UI** – Mobile-friendly dashboard with loading, empty, and error states

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, TailwindCSS, Vite, React Router |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcryptjs |
| DevOps | Docker, Docker Compose |

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/        # Database connection
│       ├── controllers/   # Route handlers
│       ├── middleware/    # Auth, validation, error handling
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API routes
│       ├── types/         # TypeScript interfaces
│       ├── utils/         # Helpers (CSV, responses)
│       └── validators/    # express-validator rules
├── frontend/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── contexts/      # Auth & Theme providers
│       ├── hooks/         # useDebounce, etc.
│       ├── pages/         # Route pages
│       ├── services/      # API client layer
│       └── types/         # TypeScript interfaces
├── docker-compose.yml
├── API_DOCUMENTATION.md
└── README.md
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd "GigFlow – Smart Leads Dashboard"
```

Copy environment files:

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Start MongoDB

Ensure MongoDB is running locally on port `27017`, or update `MONGODB_URI` to your Atlas connection string.

### 3. Run Backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Docker Setup

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api |
| MongoDB | localhost:27017 |

## Default Usage

1. Open `http://localhost:5173` (or `http://localhost` with Docker)
2. Register a new account (choose **Admin** or **Sales User** role)
3. Log in and start managing leads from the dashboard

### Role Permissions

| Feature | Admin | Sales User |
|---------|-------|------------|
| View leads | Yes | Yes |
| Create / Update leads | Yes | No |
| Delete leads | Yes | No |
| Export CSV | Yes | No |

**Create an admin account** (registration is sales-only):

```bash
cd backend
npm run create-admin -- admin@example.com YourPassword123 "Admin Name"
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full endpoint reference.

### Quick Examples

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"password123","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Get leads (with filters)
curl "http://localhost:5000/api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1" \
  -H "Authorization: Bearer <token>"
```

## Lead Model

| Field | Type | Values |
|-------|------|--------|
| name | string | Required |
| email | string | Required, valid email |
| status | enum | New, Contacted, Qualified, Lost |
| source | enum | Website, Instagram, Referral |
| createdAt | date | Auto-generated |

## Scripts

### Backend

```bash
npm run dev      # Development with hot reload
npm run build    # Compile TypeScript
npm start        # Run production build
```

### Frontend

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Variables

See [.env.example](./.env.example) for all required variables.

## Submission Checklist

- [x] TypeScript (frontend + backend)
- [x] JWT Authentication with bcrypt
- [x] Leads CRUD
- [x] Filtering, search, sort (combined)
- [x] Backend pagination (10/page)
- [x] Debounced search
- [x] CSV export (Admin)
- [x] RBAC (Admin / Sales User)
- [x] Docker setup
- [x] Dark mode
- [x] README.md
- [x] .env.example
- [x] API Documentation

## Author

Built for the GigFlow MERN Internship Assignment.
