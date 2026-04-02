# TaskFlow -- Build Summary

**Date:** March 24, 2026
**Version:** 1.0.0

---

## What Was Built

### P0 Features (Must Have)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| P0-1 | JWT Authentication | Working | Signup, login, and logout (client-side token removal). Passwords hashed with bcryptjs. Tokens expire in 24 hours. Protected routes enforce valid Bearer token. |
| P0-2 | Project CRUD | Working | Create, list, view detail, update, and delete projects. Owner-only enforcement on update and delete. Projects include member counts and task counts in list view. |
| P0-3 | Kanban Board with Drag-and-Drop | Working | Four columns (To Do, In Progress, Review, Done). Drag-and-drop powered by `@hello-pangea/dnd`. Position persistence on the server via PATCH `/tasks/:id/move` with transactional reordering. |
| P0-4 | Task CRUD | Working | Full create, read, update, delete. Tasks have title, description, assignee, priority (low/medium/high/critical), due date, status, and position. Assignee validation ensures only project members can be assigned. |
| P0-5 | Team Management | Working | Project owners can invite members by email and remove members. Removing a member clears their task assignments. Member list available per project. |
| P0-6 | Activity Feed | Working | Chronological log of all project actions: task created, moved, updated, deleted; member added/removed. Paginated with limit/offset. Includes actor name and entity name resolution. |
| P0-7 | Task Filtering and Search | Working | Backend supports filtering by status, assignee, priority, due date range, and full-text search on title/description. Filters are combinable. Frontend KanbanBoard component consumes these. |

### P1 Features (Should Have)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| P1-1 | Analytics Dashboard | Working | Server endpoint returns tasks by status, tasks by assignee, overdue task count/list, and burndown chart data. Frontend `AnalyticsTab` renders charts with Recharts. |
| P1-2 | Responsive Design | Partial | Tailwind CSS v4 is configured. Layout components exist. Full responsive testing across breakpoints has not been performed. |
| P1-3 | Empty, Loading, and Error States | Partial | Spinner component exists. ProtectedRoute handles auth redirects. The API client handles 401 with automatic redirect. Comprehensive empty-state illustrations and retry buttons may not cover every view. |

### P2 Features (Backlog -- Not Implemented)

| # | Feature | Status |
|---|---------|--------|
| P2-1 | Real-Time Updates (WebSocket) | Not implemented |
| P2-2 | Dark Mode | Not implemented |
| P2-3 | File Attachments | Not implemented |
| P2-4 | Notifications | Not implemented |

---

## Architecture Decisions

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 19 + Vite 8 | Fast dev server with HMR; modern React with latest features |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) | Utility-first CSS; no build-step CSS extraction needed |
| **State Management** | Zustand | Minimal boilerplate compared to Redux; works well with React 19 |
| **Drag-and-Drop** | @hello-pangea/dnd | Community-maintained fork of react-beautiful-dnd; stable with React 19 |
| **Charts** | Recharts | Declarative charting library built on D3; easy to integrate with React |
| **Routing** | React Router v7 | Standard routing for React SPAs |
| **Backend** | Express.js (Node.js) | Simple, well-understood REST API framework |
| **Database** | SQLite via better-sqlite3 | Zero-configuration embedded database; synchronous API eliminates callback complexity; WAL mode for concurrent reads |
| **Authentication** | JWT (jsonwebtoken + bcryptjs) | Stateless auth; tokens signed with a configurable secret; passwords hashed with bcrypt (cost factor 10) |
| **Validation** | Zod | Type-safe schema validation on all API inputs |

### Database Design

- Single SQLite file (`taskflow.db`) created automatically on first server start
- Five tables: `users`, `projects`, `project_members`, `tasks`, `activity_log`
- Foreign keys enforced (`PRAGMA foreign_keys = ON`)
- WAL journal mode for better concurrent read performance
- Migration system tracks applied migrations in `_migrations` table
- Indexes on frequently queried columns (task status, assignee, project members)

### Authentication Approach

- Passwords hashed with bcryptjs (10 salt rounds) before storage
- JWT tokens contain `userId` and `email`; expire in 24 hours
- Token is stored in `localStorage` on the client
- API client automatically redirects to `/login` on 401 responses
- Default dev secret is hardcoded; production deployments should set `JWT_SECRET` environment variable

---

## How to Run the App

### Prerequisites

- Node.js 18+ (tested with Node.js 22)
- npm 9+

### Quick Start

```bash
# 1. Clone the repository
git clone <repo-url> && cd TaskFlow

# 2. Copy environment config (optional -- defaults work for dev)
cp .env.example .env

# 3. Install all dependencies (root + backend + frontend)
npm install
npm run install:all

# 4. Start both backend and frontend in development mode
npm run dev
```

This starts:
- **Backend API** on http://localhost:3001
- **Frontend dev server** on http://localhost:3000 (proxies `/api/*` to the backend)

### Seed Data

The database is automatically created and seeded on first backend start. Seed data includes:

| User | Email | Password |
|------|-------|----------|
| Alice Johnson | alice@example.com | password123 |
| Bob Smith | bob@example.com | password123 |

One demo project ("TaskFlow Demo") is created with 5 sample tasks across all four status columns and 6 activity log entries.

To re-seed, delete `src/api/taskflow.db` and restart the server.

### Individual Commands

```bash
# Start only the backend
npm run dev:api

# Start only the frontend
npm run dev:client

# Build frontend for production
npm run build

# Run the seed script standalone
npm run seed
```

### Production Build

```bash
npm run build
# Serve dist/ with any static file server
# Backend still runs via: npm run dev:api
```

---

## Known Issues and Limitations

1. **Bundle size warning**: The production frontend bundle is ~730 KB (gzip ~218 KB). Vite warns about chunks exceeding 500 KB. Code-splitting with dynamic imports would reduce initial load time.

2. **Unused dependency**: The frontend lists `axios` in `package.json` but the API client uses native `fetch`. Axios can be safely removed.

3. **SQLite is single-file**: Suitable for development and small teams but would need to be replaced with PostgreSQL or similar for multi-server production deployments.

4. **No password reset flow**: Users who forget their password have no recovery mechanism.

5. **No HTTPS**: The dev setup runs on plain HTTP. Production would need a reverse proxy (nginx, Caddy) for TLS termination.

6. **Token storage in localStorage**: Vulnerable to XSS attacks. A production deployment should consider httpOnly cookies with CSRF protection.

7. **No rate limiting**: The API has no rate limiting on authentication endpoints, making it susceptible to brute-force attacks.

8. **CORS wide open**: `cors()` is called with no origin restrictions. Production should restrict to the frontend's origin.

9. **No automated tests**: The `tests/` directory exists but has no test files yet.

10. **Responsive design untested**: Tailwind CSS is configured but the responsive behavior across tablet and mobile breakpoints has not been systematically verified.

---

## What Would Be Built Next

### P1 Remaining Work

- **P1-2 Responsive Design**: Audit all pages at 768px, 1024px, and 1280px breakpoints. Ensure Kanban columns scroll horizontally on tablet. Test touch interactions for drag-and-drop.
- **P1-3 Empty/Loading/Error States**: Add skeleton loaders for the dashboard and board views. Add illustrated empty states with call-to-action buttons (e.g., "Create your first project"). Add retry buttons on error states.

### P2 Features

- **P2-1 Real-Time Updates**: Add a WebSocket layer (Socket.IO or native WS) so board changes broadcast to all connected users viewing the same project. Would require a pub/sub mechanism tied to project rooms.
- **P2-2 Dark Mode**: Add a theme toggle using Tailwind's dark mode support. Persist preference in user profile or localStorage.
- **P2-3 File Attachments**: Add file upload endpoint with multer; store files on disk or S3. Display thumbnails on task cards. Enforce 10 MB size limit.
- **P2-4 Notifications**: In-app notification bell with unread count. Trigger notifications on task assignment, status change, and mentions. Optional email delivery via SendGrid or similar.

### Additional Improvements

- **Automated testing**: Unit tests for API routes (Jest/Vitest + supertest), component tests for React (Vitest + React Testing Library), and E2E tests (Playwright).
- **CI/CD pipeline**: GitHub Actions for lint, test, and build on every PR.
- **Database migration to PostgreSQL**: For production scalability and multi-instance deployments.
- **Rate limiting and security headers**: Add express-rate-limit and helmet middleware.
- **httpOnly cookie auth**: Replace localStorage token storage with secure cookies.
- **Code splitting**: Lazy-load routes with React.lazy() to reduce initial bundle size.
