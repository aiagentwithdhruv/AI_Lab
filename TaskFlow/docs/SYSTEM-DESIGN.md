# TaskFlow -- System Design Document

**Version:** 1.0
**Date:** 2026-03-24
**Author:** System Architect
**Status:** Approved
**Traceability:** BRD v1.0, PRD v1.0

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Tech Stack Decisions with Rationale](#2-tech-stack-decisions-with-rationale)
3. [Database Schema](#3-database-schema)
4. [REST API Contract](#4-rest-api-contract)
5. [Authentication Flow](#5-authentication-flow)
6. [Folder Structure](#6-folder-structure)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [State Management (Frontend)](#8-state-management-frontend)

---

## 1. High-Level Architecture

### 1.1 System Overview

TaskFlow is a locally hosted, monorepo application composed of three layers: a React single-page application (SPA) served by Vite's dev server, an Express.js REST API, and a SQLite database. All three run on the user's machine with zero external service dependencies.

### 1.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User's Machine                                 │
│                                                                         │
│  ┌──────────────────────┐         ┌──────────────────────────────────┐  │
│  │   React SPA (Vite)   │  HTTP   │       Express.js REST API        │  │
│  │   Port 5173          │────────>│       Port 3000                  │  │
│  │                      │<────────│                                  │  │
│  │  ┌────────────────┐  │  JSON   │  ┌────────────┐ ┌────────────┐  │  │
│  │  │  React Router   │  │         │  │  Middleware │ │   Routes   │  │  │
│  │  │  (client-side)  │  │         │  │  ┌────────┐│ │ ┌────────┐ │  │  │
│  │  ├────────────────┤  │         │  │  │  CORS  ││ │ │  auth  │ │  │  │
│  │  │  Zustand Store  │  │         │  │  ├────────┤│ │ ├────────┤ │  │  │
│  │  ├────────────────┤  │         │  │  │ Morgan ││ │ │projects│ │  │  │
│  │  │  API Client     │  │         │  │  ├────────┤│ │ ├────────┤ │  │  │
│  │  │  (fetch + JWT)  │  │         │  │  │  Auth  ││ │ │ tasks  │ │  │  │
│  │  ├────────────────┤  │         │  │  ├────────┤│ │ ├────────┤ │  │  │
│  │  │  Components     │  │         │  │  │Project ││ │ │members │ │  │  │
│  │  │  (Kanban, etc.) │  │         │  │  │Access  ││ │ ├────────┤ │  │  │
│  │  └────────────────┘  │         │  │  └────────┘│ │ │activity│ │  │  │
│  └──────────────────────┘         │  └────────────┘ │ ├────────┤ │  │  │
│                                    │                 │ │analytic│ │  │  │
│                                    │                 │ └────────┘ │  │  │
│                                    │                 └────────────┘  │  │
│                                    │                                  │  │
│                                    │  ┌────────────────────────────┐  │  │
│                                    │  │    better-sqlite3          │  │  │
│                                    │  │    (synchronous driver)    │  │  │
│                                    │  │                            │  │  │
│                                    │  │  ┌──────────────────────┐  │  │  │
│                                    │  │  │  taskflow.db (WAL)   │  │  │  │
│                                    │  │  │  ┌────────────────┐  │  │  │  │
│                                    │  │  │  │ users          │  │  │  │  │
│                                    │  │  │  │ projects       │  │  │  │  │
│                                    │  │  │  │ project_members│  │  │  │  │
│                                    │  │  │  │ tasks          │  │  │  │  │
│                                    │  │  │  │ activity_log   │  │  │  │  │
│                                    │  │  │  └────────────────┘  │  │  │  │
│                                    │  │  └──────────────────────┘  │  │  │
│                                    │  └────────────────────────────┘  │  │
│                                    └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Request Flow: Authenticated Request

```
Browser                    React SPA                  Express API               SQLite
  │                          │                            │                       │
  │  User clicks action      │                            │                       │
  │─────────────────────────>│                            │                       │
  │                          │                            │                       │
  │                          │  fetch('/api/projects', {  │                       │
  │                          │    headers: {              │                       │
  │                          │      Authorization:        │                       │
  │                          │        'Bearer <JWT>'      │                       │
  │                          │    }                       │                       │
  │                          │  })                        │                       │
  │                          │──────────────────────────>│                       │
  │                          │                            │                       │
  │                          │                            │  1. CORS middleware   │
  │                          │                            │     checks origin     │
  │                          │                            │                       │
  │                          │                            │  2. Morgan logs       │
  │                          │                            │     method + path     │
  │                          │                            │                       │
  │                          │                            │  3. Auth middleware   │
  │                          │                            │     extracts JWT from │
  │                          │                            │     Authorization hdr │
  │                          │                            │     verifies signature│
  │                          │                            │     checks expiry     │
  │                          │                            │     attaches req.user │
  │                          │                            │     = { id, email }   │
  │                          │                            │                       │
  │                          │                            │  4. Route handler     │
  │                          │                            │     executes query    │
  │                          │                            │────────────────────> │
  │                          │                            │                       │
  │                          │                            │  <── rows returned ── │
  │                          │                            │<────────────────────  │
  │                          │                            │                       │
  │                          │                            │  5. JSON response     │
  │                          │  <── 200 { data: [...] } ─│                       │
  │                          │<──────────────────────────│                       │
  │                          │                            │                       │
  │  UI updates with data    │                            │                       │
  │<─────────────────────────│                            │                       │
  │                          │                            │                       │
```

### 1.4 Request Flow: Unauthenticated Request

```
Browser                    React SPA                  Express API
  │                          │                            │
  │  User submits login form │                            │
  │─────────────────────────>│                            │
  │                          │                            │
  │                          │  POST /api/auth/login      │
  │                          │  { email, password }       │
  │                          │  (no Authorization header) │
  │                          │──────────────────────────>│
  │                          │                            │
  │                          │                            │  1. CORS middleware
  │                          │                            │  2. Morgan logs
  │                          │                            │  3. NO auth middleware
  │                          │                            │     (route is public)
  │                          │                            │  4. Route handler:
  │                          │                            │     - looks up user by email
  │                          │                            │     - bcrypt.compare(password, hash)
  │                          │                            │     - if valid: sign JWT, return
  │                          │                            │     - if invalid: return 401
  │                          │                            │
  │                          │  <── 200 { user, token } ─│
  │                          │<──────────────────────────│
  │                          │                            │
  │                          │  Store token in Zustand +  │
  │                          │  localStorage              │
  │                          │                            │
  │  Redirect to dashboard   │                            │
  │<─────────────────────────│                            │
```

### 1.5 Request Flow: Protected Project-Scoped Request

For endpoints under `/api/projects/:projectId/*`, an additional middleware layer verifies that the authenticated user is a member of the specified project.

```
Auth Middleware          projectAccess Middleware        Route Handler
     │                           │                           │
     │  req.user = { id: 7 }    │                           │
     │─────────────────────────>│                           │
     │                           │                           │
     │                           │  SELECT * FROM            │
     │                           │  project_members          │
     │                           │  WHERE project_id = :pid  │
     │                           │  AND user_id = 7          │
     │                           │                           │
     │                           │  Row found?               │
     │                           │  ├─ YES: req.membership   │
     │                           │  │       = { role: '...'} │
     │                           │  │       next()           │
     │                           │  │──────────────────────>│
     │                           │  │                        │  (handles request)
     │                           │  │                        │
     │                           │  └─ NO: return 403        │
     │                           │        { error:           │
     │                           │          code: 'FORBIDDEN'│
     │                           │        }                  │
```

---

## 2. Tech Stack Decisions with Rationale

### 2.1 Frontend

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **React** | 18.x | UI component library | Component-based architecture maps cleanly to TaskFlow's UI (boards, cards, modals). Massive ecosystem for hiring and library support. Required by BRD Section 5.1. |
| **Vite** | 5.x | Build tool and dev server | Sub-second hot module replacement (HMR) vs. CRA's 5-10 second rebuilds. Native ES module support. Produces optimized production bundles well under the 500 KB gzipped target (BRD 9.1). |
| **Tailwind CSS** | 3.x | Utility-first CSS framework | Eliminates CSS naming debates, produces small production bundles via purging, and enables rapid UI iteration. No runtime cost. Responsive breakpoint utilities map directly to BRD 9.3 requirements (desktop >= 1024px, tablet >= 768px). |
| **React Router** | 6.x | Client-side routing | The standard SPA routing library for React. Supports nested routes, loaders, and protected route patterns needed for auth gating. BRD mandates SPA with no server-side rendering. |
| **@hello-pangea/dnd** | 16.x | Drag-and-drop | Community-maintained fork of `react-beautiful-dnd` (Atlassian). Purpose-built for list/board reordering with keyboard accessibility. Delivers the < 100 ms interaction latency required by PRD P0-3 (AC-3.5). Chosen over `dnd-kit` for its simpler mental model for Kanban-style column-to-column moves. |
| **Zustand** | 4.x | Client-side state management | Minimal API surface (no providers, no reducers, no boilerplate). Supports selectors for re-render optimization. Lightweight (< 2 KB) compared to Redux Toolkit (~ 11 KB). Sufficient for TaskFlow's state complexity (auth, projects, tasks, UI). |
| **recharts** | 2.x | Charting library | Built on React and D3. Declarative API matches React's component model. Supports bar charts, pie charts, and line charts needed for the analytics dashboard (PRD P1-1: tasks by status, tasks by assignee, burndown). |

### 2.2 Backend

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Express.js** | 4.x | HTTP framework | Industry-standard Node.js framework. Mature middleware ecosystem (CORS, Morgan, body-parser). BRD Section 5.1 specifies Express.js or Fastify; Express was chosen for its larger middleware ecosystem and simpler learning curve for parallel agent development. |
| **better-sqlite3** | 9.x | SQLite driver | Synchronous API eliminates callback/promise complexity for database operations. 2-5x faster than the async `sqlite3` package for single-machine workloads. BRD Section 9.2 recommends it. WAL mode support satisfies BRD Risk R-1 (write contention mitigation). |
| **bcrypt** | 5.x | Password hashing | Adaptive cost factor resists brute-force attacks. BRD Section 8.1 mandates bcrypt with minimum cost factor of 10. Industry standard with no meaningful alternatives for this use case. |
| **jsonwebtoken** | 9.x | JWT signing and verification | The most widely used Node.js JWT library. Supports HS256 signing, expiration claims, and custom payloads. BRD Section 8.1 requires JWT with `exp` claim and 24-hour TTL. |
| **zod** | 3.x | Request validation | TypeScript-first schema validation with excellent error messages. Produces structured field-level errors that map directly to BRD Section 9.4 error format (`error.details[].field` + `error.details[].message`). Chosen over Joi (larger bundle, less TypeScript-friendly) and Ajv (JSON Schema syntax is verbose for this scale). |
| **cors** | 2.x | Cross-Origin Resource Sharing | The SPA (port 5173) and API (port 3000) run on different ports during development, requiring CORS headers. This middleware handles preflight requests and configurable origin whitelisting. |
| **morgan** | 1.x | HTTP request logging | Logs method, path, status code, and response time for every request (BRD Section 9.5). Tiny footprint, zero-config for development, and a `combined` format available for production-like output. |

### 2.3 Why Not [Alternatives]

| Rejected Alternative | Reason |
|---------------------|--------|
| **Next.js / Remix** | BRD mandates a pure SPA with no server-side rendering. These frameworks add unnecessary SSR complexity. |
| **Redux Toolkit** | Overkill for TaskFlow's state complexity. Zustand achieves the same result with one-fifth the boilerplate. |
| **PostgreSQL / MySQL** | BRD requires zero-config, file-based storage with no separate server process. SQLite is the only option that satisfies this. |
| **Prisma / TypeORM** | ORM abstraction adds startup latency and binary dependencies. better-sqlite3's synchronous API with raw SQL is simpler and faster for a schema of five tables. |
| **Fastify** | Slightly faster than Express but smaller middleware ecosystem. Given parallel agent development, Express's larger community and documentation base reduces integration risk (BRD Risk R-2). |
| **dnd-kit** | More flexible but requires more configuration for Kanban board patterns. @hello-pangea/dnd provides Kanban-optimized primitives out of the box. |

---

## 3. Database Schema

### 3.1 Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │  project_members  │       │   projects   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id       PK  │──┐    │ id           PK  │    ┌──│ id       PK  │
│ name         │  │    │ project_id   FK  │────┘  │ name         │
│ email  UQ    │  ├───>│ user_id      FK  │       │ description  │
│ password_hash│  │    │ role             │       │ owner_id FK  │──┐
│ created_at   │  │    │ joined_at        │       │ created_at   │  │
│ updated_at   │  │    └──────────────────┘       │ updated_at   │  │
└──────────────┘  │    UNIQUE(project_id,user_id) └──────────────┘  │
                  │                                                  │
                  │                                                  │
                  │    ┌──────────────────┐                          │
                  │    │      tasks       │                          │
                  │    ├──────────────────┤                          │
                  │    │ id           PK  │                          │
                  ├───>│ assignee_id  FK? │                          │
                  │    │ created_by   FK  │<─────────────────────────┤
                  │    │ project_id   FK  │─────────────────────────>│
                  │    │ title            │                          │
                  │    │ description      │                          │
                  │    │ status           │                          │
                  │    │ priority         │                          │
                  │    │ due_date         │                          │
                  │    │ position         │                          │
                  │    │ created_at       │                          │
                  │    │ updated_at       │                          │
                  │    └──────────────────┘                          │
                  │                                                  │
                  │    ┌──────────────────┐                          │
                  │    │  activity_log    │                          │
                  │    ├──────────────────┤                          │
                  │    │ id           PK  │                          │
                  ├───>│ user_id      FK  │                          │
                  │    │ project_id   FK  │─────────────────────────>│
                       │ action           │
                       │ entity_type      │
                       │ entity_id        │
                       │ details          │
                       │ created_at       │
                       └──────────────────┘
```

### 3.2 Table Definitions

#### 3.2.1 `users`

Stores registered user accounts. Passwords are never stored in plaintext (BRD 8.1).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier. |
| `name` | TEXT | NOT NULL | Display name. 1-100 characters. |
| `email` | TEXT | NOT NULL, UNIQUE | Login email address. Validated for email format. |
| `password_hash` | TEXT | NOT NULL | bcrypt hash (cost factor >= 10). Never returned in API responses. |
| `created_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 timestamp of account creation. |
| `updated_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 timestamp of last profile update. |

```sql
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

#### 3.2.2 `projects`

Top-level container for tasks and team members. Each project has exactly one owner.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique project identifier. |
| `name` | TEXT | NOT NULL | Project name. 1-100 characters. |
| `description` | TEXT | DEFAULT '' | Project description. Up to 500 characters. |
| `owner_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES users(id) | The user who created the project. Has full administrative rights. |
| `created_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 creation timestamp. |
| `updated_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 last-modified timestamp. |

```sql
CREATE TABLE projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    owner_id    INTEGER NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

#### 3.2.3 `project_members`

Junction table linking users to projects. The project owner is always a member with role `'owner'`. Additional members have role `'member'`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique membership identifier. |
| `project_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES projects(id) ON DELETE CASCADE | The project. |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE | The member. |
| `role` | TEXT | NOT NULL, DEFAULT 'member' | Either `'owner'` or `'member'`. |
| `joined_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 timestamp of when the user joined the project. |

**Composite unique constraint:** `UNIQUE(project_id, user_id)` -- a user can only be a member of a project once.

```sql
CREATE TABLE project_members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'member',
    joined_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (project_id, user_id)
);
```

#### 3.2.4 `tasks`

Work items within a project. Each task belongs to exactly one project and has a status that maps to a Kanban column.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique task identifier. |
| `project_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES projects(id) ON DELETE CASCADE | Parent project. |
| `title` | TEXT | NOT NULL | Task title. 1-200 characters. |
| `description` | TEXT | DEFAULT '' | Task description. Up to 2000 characters. |
| `status` | TEXT | NOT NULL, DEFAULT 'todo', CHECK(status IN ('todo','in_progress','review','done')) | Current Kanban column. Maps to: To Do, In Progress, Review, Done. |
| `priority` | TEXT | NOT NULL, DEFAULT 'low', CHECK(priority IN ('low','medium','high','critical')) | Task priority level. |
| `assignee_id` | INTEGER | NULLABLE, FOREIGN KEY REFERENCES users(id) ON DELETE SET NULL | Assigned team member. NULL means unassigned. SET NULL on user deletion preserves the task. |
| `due_date` | TEXT | NULLABLE | ISO 8601 date string (YYYY-MM-DD). NULL means no deadline. |
| `position` | INTEGER | NOT NULL, DEFAULT 0 | Sort order within a Kanban column. Lower values appear first. Used for drag-and-drop reordering. |
| `created_by` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES users(id) | The user who created the task. |
| `created_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 creation timestamp. |
| `updated_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 last-modified timestamp. |

```sql
CREATE TABLE tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'todo'
                        CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority    TEXT    NOT NULL DEFAULT 'low'
                        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assignee_id INTEGER,
    due_date    TEXT,
    position    INTEGER NOT NULL DEFAULT 0,
    created_by  INTEGER NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id)    ON DELETE SET NULL,
    FOREIGN KEY (created_by)  REFERENCES users(id)
);
```

#### 3.2.5 `activity_log`

Immutable audit trail of actions within a project. Entries are never updated or deleted (except on project deletion via CASCADE).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique activity entry identifier. |
| `project_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES projects(id) ON DELETE CASCADE | The project where the action occurred. |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY REFERENCES users(id) | The user who performed the action. |
| `action` | TEXT | NOT NULL | Human-readable action verb. One of: `'created_task'`, `'updated_task'`, `'moved_task'`, `'deleted_task'`, `'added_member'`, `'removed_member'`. |
| `entity_type` | TEXT | NOT NULL | The type of entity affected. One of: `'task'`, `'member'`. |
| `entity_id` | INTEGER | NOT NULL | The ID of the affected entity (task ID or user ID). |
| `details` | TEXT | DEFAULT '{}' | JSON string containing action-specific details. For example: `{"from_status": "todo", "to_status": "in_progress"}` for a task move, or `{"field": "priority", "old": "low", "new": "high"}` for a task update. |
| `created_at` | TEXT | NOT NULL, DEFAULT (datetime('now')) | ISO 8601 timestamp of when the action occurred. |

```sql
CREATE TABLE activity_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    action      TEXT    NOT NULL,
    entity_type TEXT    NOT NULL,
    entity_id   INTEGER NOT NULL,
    details     TEXT    DEFAULT '{}',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)
);
```

### 3.3 Indexes

These indexes are required for query performance targets specified in BRD Section 9.1 (< 100 ms for indexed queries returning up to 500 rows).

```sql
-- Tasks: filter by project and status (Kanban board loads all tasks for a project, grouped by status)
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);

-- Tasks: filter by assignee (analytics dashboard: tasks by assignee; filter bar: assignee filter)
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);

-- Project members: look up all members of a project (team list, assignee dropdown)
CREATE INDEX idx_project_members_project ON project_members(project_id);

-- Project members: look up all projects for a user (project list page)
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- Activity log: paginated feed for a project, ordered by timestamp (newest first)
CREATE INDEX idx_activity_project_created ON activity_log(project_id, created_at);
```

### 3.4 Database Configuration

Applied on connection initialization in `database.js`:

```sql
PRAGMA journal_mode = WAL;          -- Write-Ahead Logging for concurrent read performance (BRD R-1)
PRAGMA foreign_keys = ON;           -- Enforce referential integrity
PRAGMA busy_timeout = 5000;         -- Wait up to 5 seconds on SQLITE_BUSY before returning error
```

### 3.5 Migration Strategy

Migrations are versioned JavaScript files that run automatically on server startup. The `migrations.js` module:

1. Creates a `_migrations` metadata table if it does not exist: `CREATE TABLE IF NOT EXISTS _migrations (id INTEGER PRIMARY KEY, name TEXT, applied_at TEXT)`.
2. Scans for unapplied migrations by comparing the `_migrations` table against a hardcoded ordered list.
3. Runs each unapplied migration inside a transaction.
4. Records the migration in `_migrations`.

For MVP, a single migration (`001_initial_schema.js`) creates all five tables and all indexes listed above.

---

## 4. REST API Contract

### 4.1 General Conventions

| Convention | Detail |
|-----------|--------|
| **Base URL** | `http://localhost:3000/api` |
| **Content-Type** | All requests and responses use `application/json`. |
| **Authentication** | Protected endpoints require `Authorization: Bearer <JWT>` header. |
| **Timestamps** | All timestamps are ISO 8601 strings in UTC (e.g., `"2026-03-24T14:30:00.000Z"`). |
| **Pagination** | List endpoints that can grow unbounded (activity) support `limit` and `offset` query parameters. |
| **Error format** | All errors follow the structure defined in BRD Section 9.4 (see Section 7 of this document). |

### 4.2 Auth Endpoints (Public)

---

#### `POST /api/auth/signup`

Create a new user account and return a JWT.

**Request Body:**

```json
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "securePass1"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 1-100 characters. |
| `email` | string | Yes | Valid email format. |
| `password` | string | Yes | Minimum 8 characters. At least one letter and one number (BRD 8.1). |

**Success Response: `201 Created`**

```json
{
    "user": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "created_at": "2026-03-24T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Missing/invalid fields (name, email format, password too short). |
| 409 | CONFLICT | Email already registered. |

---

#### `POST /api/auth/login`

Authenticate an existing user and return a JWT.

**Request Body:**

```json
{
    "email": "jane@example.com",
    "password": "securePass1"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format. |
| `password` | string | Yes | Non-empty. |

**Success Response: `200 OK`**

```json
{
    "user": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "created_at": "2026-03-24T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Missing/invalid fields. |
| 401 | UNAUTHORIZED | Email not found or password incorrect. Message must not reveal which (PRD AC-1.5). |

---

### 4.3 Project Endpoints (Protected)

All project endpoints require a valid JWT. Endpoints scoped to a specific project (`:id`) also require project membership.

---

#### `POST /api/projects`

Create a new project. The authenticated user becomes the owner and is automatically added as a member with role `'owner'`.

**Request Body:**

```json
{
    "name": "Q2 Website Redesign",
    "description": "Redesign the marketing site for Q2 launch."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 1-100 characters. |
| `description` | string | No | Up to 500 characters. Defaults to `""`. |

**Success Response: `201 Created`**

```json
{
    "id": 1,
    "name": "Q2 Website Redesign",
    "description": "Redesign the marketing site for Q2 launch.",
    "owner_id": 1,
    "created_at": "2026-03-24T10:00:00.000Z",
    "updated_at": "2026-03-24T10:00:00.000Z"
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Name missing or exceeds 100 chars; description exceeds 500 chars. |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |

---

#### `GET /api/projects`

List all projects where the authenticated user is an owner or member.

**Query Parameters:** None.

**Success Response: `200 OK`**

```json
[
    {
        "id": 1,
        "name": "Q2 Website Redesign",
        "description": "Redesign the marketing site for Q2 launch.",
        "owner_id": 1,
        "member_count": 4,
        "task_count": 23,
        "created_at": "2026-03-24T10:00:00.000Z",
        "updated_at": "2026-03-24T10:00:00.000Z"
    }
]
```

**Implementation Note:** Uses a JOIN on `project_members` filtered by `user_id = req.user.id`, with subqueries for `member_count` and `task_count`.

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |

---

#### `GET /api/projects/:id`

Get full details of a single project including its members and task count breakdown by status.

**Success Response: `200 OK`**

```json
{
    "id": 1,
    "name": "Q2 Website Redesign",
    "description": "Redesign the marketing site for Q2 launch.",
    "owner_id": 1,
    "created_at": "2026-03-24T10:00:00.000Z",
    "updated_at": "2026-03-24T10:00:00.000Z",
    "members": [
        {
            "id": 1,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "role": "owner",
            "joined_at": "2026-03-24T10:00:00.000Z"
        }
    ],
    "task_counts": {
        "todo": 8,
        "in_progress": 5,
        "review": 3,
        "done": 7
    }
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of this project. |
| 404 | NOT_FOUND | Project does not exist. |

---

#### `PUT /api/projects/:id`

Update a project's name and/or description. Only the project owner can perform this action (PRD AC-2.4).

**Request Body:**

```json
{
    "name": "Q2 Website Redesign (Updated)",
    "description": "Updated scope for Q2."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | No | 1-100 characters if provided. |
| `description` | string | No | Up to 500 characters if provided. |

At least one field must be provided.

**Success Response: `200 OK`**

```json
{
    "id": 1,
    "name": "Q2 Website Redesign (Updated)",
    "description": "Updated scope for Q2.",
    "owner_id": 1,
    "created_at": "2026-03-24T10:00:00.000Z",
    "updated_at": "2026-03-24T12:00:00.000Z"
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Validation failures. |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not the project owner. |
| 404 | NOT_FOUND | Project does not exist. |

---

#### `DELETE /api/projects/:id`

Delete a project and all associated data (tasks, members, activity). Only the project owner can perform this action (PRD AC-2.5). CASCADE delete handles related records.

**Request Body:** None.

**Success Response: `204 No Content`**

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not the project owner. |
| 404 | NOT_FOUND | Project does not exist. |

---

### 4.4 Task Endpoints (Protected + Project Membership Required)

All task endpoints require a valid JWT and project membership (enforced by `projectAccess` middleware).

---

#### `POST /api/projects/:projectId/tasks`

Create a new task in the project. The authenticated user is recorded as the creator. A new task is placed at the end of its status column (highest `position` + 1). An activity log entry is created.

**Request Body:**

```json
{
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockup for the new homepage layout.",
    "status": "todo",
    "priority": "high",
    "assignee_id": 2,
    "due_date": "2026-04-15"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | 1-200 characters. |
| `description` | string | No | Up to 2000 characters. Defaults to `""`. |
| `status` | string | No | One of: `todo`, `in_progress`, `review`, `done`. Defaults to `"todo"`. |
| `priority` | string | No | One of: `low`, `medium`, `high`, `critical`. Defaults to `"low"`. |
| `assignee_id` | integer | No | Must be a valid member of the project. `null` for unassigned. |
| `due_date` | string | No | ISO 8601 date (YYYY-MM-DD). Must be today or in the future. `null` for no deadline. |

**Success Response: `201 Created`**

```json
{
    "id": 1,
    "project_id": 1,
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockup for the new homepage layout.",
    "status": "todo",
    "priority": "high",
    "assignee_id": 2,
    "assignee_name": "John Doe",
    "due_date": "2026-04-15",
    "position": 3,
    "created_by": 1,
    "created_at": "2026-03-24T10:00:00.000Z",
    "updated_at": "2026-03-24T10:00:00.000Z"
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Title missing/too long, invalid status/priority, assignee not a member, due date in the past. |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of the project. |
| 404 | NOT_FOUND | Project does not exist. |

---

#### `GET /api/projects/:projectId/tasks`

List all tasks in a project, with optional filters. Used to populate the Kanban board.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status. Comma-separated for multiple: `todo,in_progress`. |
| `assignee` | integer or `"unassigned"` | Filter by assignee user ID. Use `"unassigned"` for tasks with no assignee. |
| `priority` | string | Filter by priority. Comma-separated for multiple: `high,critical`. |
| `search` | string | Full-text search on title and description (case-insensitive LIKE). |
| `due_before` | string | ISO 8601 date. Return tasks with due_date <= this value. |
| `due_after` | string | ISO 8601 date. Return tasks with due_date >= this value. |

**Success Response: `200 OK`**

```json
[
    {
        "id": 1,
        "project_id": 1,
        "title": "Design homepage mockup",
        "description": "Create high-fidelity mockup for the new homepage layout.",
        "status": "todo",
        "priority": "high",
        "assignee_id": 2,
        "assignee_name": "John Doe",
        "due_date": "2026-04-15",
        "position": 0,
        "created_by": 1,
        "created_at": "2026-03-24T10:00:00.000Z",
        "updated_at": "2026-03-24T10:00:00.000Z"
    }
]
```

Tasks are returned ordered by `status` column order (`todo`, `in_progress`, `review`, `done`), then by `position` ASC within each status.

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of the project. |
| 404 | NOT_FOUND | Project does not exist. |

---

#### `GET /api/projects/:projectId/tasks/:id`

Get full details of a single task.

**Success Response: `200 OK`**

```json
{
    "id": 1,
    "project_id": 1,
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockup for the new homepage layout.",
    "status": "todo",
    "priority": "high",
    "assignee_id": 2,
    "assignee_name": "John Doe",
    "due_date": "2026-04-15",
    "position": 0,
    "created_by": 1,
    "creator_name": "Jane Smith",
    "created_at": "2026-03-24T10:00:00.000Z",
    "updated_at": "2026-03-24T10:00:00.000Z"
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of the project. |
| 404 | NOT_FOUND | Task or project does not exist. |

---

#### `PUT /api/projects/:projectId/tasks/:id`

Update any fields on a task. Generates an activity log entry with change details.

**Request Body (all fields optional, at least one required):**

```json
{
    "title": "Updated title",
    "description": "Updated description",
    "status": "in_progress",
    "priority": "critical",
    "assignee_id": 3,
    "due_date": "2026-05-01"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | No | 1-200 characters. |
| `description` | string | No | Up to 2000 characters. |
| `status` | string | No | One of: `todo`, `in_progress`, `review`, `done`. |
| `priority` | string | No | One of: `low`, `medium`, `high`, `critical`. |
| `assignee_id` | integer or null | No | Must be a project member or `null`. |
| `due_date` | string or null | No | ISO 8601 date or `null`. |

**Implementation Note:** If `status` is changed, the task's `position` is set to the end of the target column (max position + 1). The `updated_at` field is set to the current timestamp.

**Success Response: `200 OK`** -- Returns the full updated task (same shape as GET single task).

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Invalid field values. |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of the project. |
| 404 | NOT_FOUND | Task or project does not exist. |

---

#### `PATCH /api/projects/:projectId/tasks/:id/move`

Move a task to a new column and/or reorder it within a column. This is the endpoint called by the drag-and-drop handler. Generates an activity log entry if the status changes.

**Request Body:**

```json
{
    "status": "in_progress",
    "position": 2
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `status` | string | Yes | One of: `todo`, `in_progress`, `review`, `done`. |
| `position` | integer | Yes | >= 0. The target index within the destination column. |

**Implementation Logic:**

1. Read the task's current `status` and `position`.
2. If `status` changed (cross-column move):
   a. Decrement `position` of all tasks in the **source** column where `position > old_position`.
   b. Increment `position` of all tasks in the **destination** column where `position >= new_position`.
   c. Update the task with the new `status` and `position`.
   d. Log a `moved_task` activity entry with `details: {"from_status": "...", "to_status": "..."}`.
3. If `status` unchanged (within-column reorder):
   a. If moving down (new_position > old_position): decrement `position` of tasks where `position > old_position AND position <= new_position`.
   b. If moving up (new_position < old_position): increment `position` of tasks where `position >= new_position AND position < old_position`.
   c. Update the task's `position`.
4. All position updates run inside a single transaction for consistency.

**Success Response: `200 OK`** -- Returns the full updated task.

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Invalid status or negative position. |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of the project. |
| 404 | NOT_FOUND | Task or project does not exist. |

---

#### `DELETE /api/projects/:projectId/tasks/:id`

Delete a task. Decrements `position` of all tasks in the same column with a higher position to maintain contiguous ordering. Generates an activity log entry.

**Request Body:** None.

**Success Response: `204 No Content`**

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of the project. |
| 404 | NOT_FOUND | Task or project does not exist. |

---

### 4.5 Team Member Endpoints (Protected + Project Membership Required)

---

#### `POST /api/projects/:projectId/members`

Invite a registered user to the project by email. Only the project owner can invite members (PRD AC-5.6). The invited user is added with role `'member'`. An activity log entry is created.

**Request Body:**

```json
{
    "email": "john@example.com"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format. |

**Success Response: `201 Created`**

```json
{
    "id": 5,
    "project_id": 1,
    "user_id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "joined_at": "2026-03-24T12:00:00.000Z"
}
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Invalid email format. |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not the project owner. |
| 404 | NOT_FOUND | No registered user with that email (PRD AC-5.2). |
| 409 | CONFLICT | User is already a member of this project (PRD AC-5.3). |

---

#### `GET /api/projects/:projectId/members`

List all members of a project.

**Success Response: `200 OK`**

```json
[
    {
        "id": 1,
        "user_id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "owner",
        "joined_at": "2026-03-24T10:00:00.000Z"
    },
    {
        "id": 5,
        "user_id": 2,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "member",
        "joined_at": "2026-03-24T12:00:00.000Z"
    }
]
```

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of this project. |
| 404 | NOT_FOUND | Project does not exist. |

---

#### `DELETE /api/projects/:projectId/members/:userId`

Remove a member from the project. Only the project owner can remove members (PRD AC-5.6). The owner cannot remove themselves (PRD AC-5.5). Tasks assigned to the removed member have their `assignee_id` set to `NULL`. An activity log entry is created.

**Request Body:** None.

**Success Response: `204 No Content`**

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Attempting to remove the project owner (self-removal). |
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not the project owner. |
| 404 | NOT_FOUND | Project does not exist or user is not a member. |

---

### 4.6 Activity Endpoints (Protected + Project Membership Required)

---

#### `GET /api/projects/:projectId/activity`

Retrieve the activity feed for a project in reverse-chronological order (PRD AC-6.1).

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Number of entries to return. Max 100. |
| `offset` | integer | 0 | Number of entries to skip (for pagination). |

**Success Response: `200 OK`**

```json
{
    "activities": [
        {
            "id": 42,
            "project_id": 1,
            "user_id": 1,
            "user_name": "Jane Smith",
            "action": "moved_task",
            "entity_type": "task",
            "entity_id": 7,
            "entity_name": "Design homepage mockup",
            "details": {
                "from_status": "todo",
                "to_status": "in_progress"
            },
            "created_at": "2026-03-24T14:30:00.000Z"
        }
    ],
    "total": 156,
    "limit": 20,
    "offset": 0
}
```

**Implementation Note:** The `entity_name` field is resolved via a LEFT JOIN against the `tasks` table (for `entity_type = 'task'`) or the `users` table (for `entity_type = 'member'`). If the entity has been deleted, `entity_name` is `null`.

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of this project. |
| 404 | NOT_FOUND | Project does not exist. |

---

### 4.7 Analytics Endpoints (Protected + Project Membership Required)

---

#### `GET /api/projects/:projectId/analytics`

Return aggregated analytics data for a project. All data is computed from the current state of the `tasks` table.

**Success Response: `200 OK`**

```json
{
    "tasksByStatus": {
        "todo": 8,
        "in_progress": 5,
        "review": 3,
        "done": 12
    },
    "tasksByAssignee": [
        {
            "assignee_id": 1,
            "assignee_name": "Jane Smith",
            "count": 10
        },
        {
            "assignee_id": 2,
            "assignee_name": "John Doe",
            "count": 8
        },
        {
            "assignee_id": null,
            "assignee_name": "Unassigned",
            "count": 10
        }
    ],
    "overdueCount": 3,
    "overdueTasks": [
        {
            "id": 5,
            "title": "Update API docs",
            "assignee_id": 2,
            "assignee_name": "John Doe",
            "due_date": "2026-03-20",
            "status": "in_progress",
            "priority": "high"
        }
    ],
    "burndown": [
        {
            "date": "2026-03-18",
            "remaining": 28
        },
        {
            "date": "2026-03-19",
            "remaining": 25
        },
        {
            "date": "2026-03-20",
            "remaining": 22
        },
        {
            "date": "2026-03-24",
            "remaining": 16
        }
    ]
}
```

**Field Descriptions:**

| Field | Computation |
|-------|-------------|
| `tasksByStatus` | `SELECT status, COUNT(*) FROM tasks WHERE project_id = :id GROUP BY status`. Fill in zero for any missing status. |
| `tasksByAssignee` | `SELECT assignee_id, COUNT(*) FROM tasks WHERE project_id = :id GROUP BY assignee_id`. JOIN with `users` for names. NULL assignee mapped to `"Unassigned"`. |
| `overdueCount` | Count of tasks where `due_date < date('now')` AND `status != 'done'`. |
| `overdueTasks` | Full list of overdue tasks (same criteria as `overdueCount`). |
| `burndown` | Derived from `activity_log`: for each day in the project's lifetime, count the number of tasks not yet in `'done'` status. Computed by replaying task creation and status-change events. Returns one data point per day where a change occurred. |

**Error Responses:**

| Status | Code | Condition |
|--------|------|-----------|
| 401 | UNAUTHORIZED | Missing or invalid JWT. |
| 403 | FORBIDDEN | User is not a member of this project. |
| 404 | NOT_FOUND | Project does not exist. |

---

## 5. Authentication Flow

### 5.1 Signup Flow

```
Client                           Server                              Database
  │                                │                                    │
  │  POST /api/auth/signup         │                                    │
  │  { name, email, password }     │                                    │
  │──────────────────────────────>│                                    │
  │                                │                                    │
  │                                │  1. Validate with Zod:            │
  │                                │     - name: 1-100 chars           │
  │                                │     - email: valid format         │
  │                                │     - password: >= 8 chars,       │
  │                                │       at least 1 letter + 1 number│
  │                                │     If invalid → 400              │
  │                                │                                    │
  │                                │  2. Check email uniqueness         │
  │                                │────────────────────────────────>  │
  │                                │  SELECT id FROM users              │
  │                                │  WHERE email = :email              │
  │                                │  <────────────────────────────── │
  │                                │  If exists → 409 CONFLICT          │
  │                                │                                    │
  │                                │  3. Hash password                  │
  │                                │     bcrypt.hashSync(password, 10)  │
  │                                │     (cost factor = 10)             │
  │                                │                                    │
  │                                │  4. Insert user                    │
  │                                │────────────────────────────────>  │
  │                                │  INSERT INTO users                 │
  │                                │  (name, email, password_hash)      │
  │                                │  VALUES (?, ?, ?)                  │
  │                                │  <────── lastInsertRowid ──────  │
  │                                │                                    │
  │                                │  5. Generate JWT                   │
  │                                │     jwt.sign(                      │
  │                                │       { userId: user.id,           │
  │                                │         email: user.email },       │
  │                                │       process.env.JWT_SECRET,      │
  │                                │       { expiresIn: '24h' }         │
  │                                │     )                              │
  │                                │                                    │
  │  <── 201 { user, token } ────│                                    │
  │<──────────────────────────────│                                    │
  │                                │                                    │
  │  Store token in Zustand +      │                                    │
  │  localStorage                  │                                    │
  │  Redirect to /dashboard        │                                    │
```

### 5.2 Login Flow

```
Client                           Server                              Database
  │                                │                                    │
  │  POST /api/auth/login          │                                    │
  │  { email, password }           │                                    │
  │──────────────────────────────>│                                    │
  │                                │                                    │
  │                                │  1. Validate with Zod:            │
  │                                │     - email: valid format         │
  │                                │     - password: non-empty         │
  │                                │     If invalid → 400              │
  │                                │                                    │
  │                                │  2. Look up user by email         │
  │                                │────────────────────────────────>  │
  │                                │  SELECT * FROM users               │
  │                                │  WHERE email = :email              │
  │                                │  <────────────────────────────── │
  │                                │  If not found → 401               │
  │                                │  "Invalid email or password"       │
  │                                │                                    │
  │                                │  3. Verify password                │
  │                                │     bcrypt.compareSync(            │
  │                                │       password,                    │
  │                                │       user.password_hash           │
  │                                │     )                              │
  │                                │     If mismatch → 401             │
  │                                │     "Invalid email or password"    │
  │                                │     (same message as not found)    │
  │                                │                                    │
  │                                │  4. Generate JWT (same as signup)  │
  │                                │     jwt.sign(                      │
  │                                │       { userId: user.id,           │
  │                                │         email: user.email },       │
  │                                │       process.env.JWT_SECRET,      │
  │                                │       { expiresIn: '24h' }         │
  │                                │     )                              │
  │                                │                                    │
  │  <── 200 { user, token } ────│                                    │
  │<──────────────────────────────│                                    │
  │                                │                                    │
  │  Store token in Zustand +      │                                    │
  │  localStorage                  │                                    │
  │  Redirect to /dashboard        │                                    │
```

### 5.3 Auth Middleware (`middleware/auth.js`)

Applied to all protected routes. Extracts the JWT from the `Authorization` header, verifies it, and attaches the decoded payload to `req.user`.

**Pseudocode:**

```javascript
function authMiddleware(req, res, next) {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required. Provide a valid Bearer token.'
            }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify token signature and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user info to request
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (err) {
        // Handles: TokenExpiredError, JsonWebTokenError, NotBeforeError
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid or expired token.'
            }
        });
    }
}
```

### 5.4 Project Access Middleware (`middleware/projectAccess.js`)

Applied to all routes under `/api/projects/:projectId/*`. Verifies that the authenticated user is a member of the specified project.

**Pseudocode:**

```javascript
function projectAccessMiddleware(req, res, next) {
    const projectId = parseInt(req.params.projectId || req.params.id, 10);
    const userId = req.user.id;

    // 1. Verify project exists
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
        return res.status(404).json({
            error: {
                code: 'NOT_FOUND',
                message: 'Project not found.'
            }
        });
    }

    // 2. Verify membership
    const membership = db.prepare(
        'SELECT * FROM project_members WHERE project_id = ? AND user_id = ?'
    ).get(projectId, userId);

    if (!membership) {
        return res.status(403).json({
            error: {
                code: 'FORBIDDEN',
                message: 'You are not a member of this project.'
            }
        });
    }

    // 3. Attach project and membership to request for downstream use
    req.project = project;
    req.membership = membership;

    next();
}
```

### 5.5 JWT Payload Structure

```json
{
    "userId": 1,
    "email": "jane@example.com",
    "iat": 1711270800,
    "exp": 1711357200
}
```

| Claim | Type | Description |
|-------|------|-------------|
| `userId` | integer | The user's database ID. Used by auth middleware to identify the requester. |
| `email` | string | The user's email. Convenience field to avoid a DB lookup for logging. |
| `iat` | integer | Issued-at timestamp (auto-set by jsonwebtoken). |
| `exp` | integer | Expiration timestamp. Set to `iat + 24 hours` (BRD 8.1). |

### 5.6 Logout

Logout is entirely client-side. The SPA removes the JWT from Zustand state and `localStorage`. No server-side endpoint is needed because JWTs are stateless. The token naturally expires after 24 hours.

---

## 6. Folder Structure

```
TaskFlow/
├── docs/
│   ├── BRD.md                          # Business Requirements Document
│   ├── PRD.md                          # Product Requirements Document
│   └── SYSTEM-DESIGN.md               # This document
├── src/
│   ├── api/                            # Backend (Express.js REST API)
│   │   ├── package.json                # Backend dependencies (express, better-sqlite3, etc.)
│   │   ├── server.js                   # Entry point: creates Express app, mounts middleware & routes, starts listener
│   │   ├── db/
│   │   │   ├── database.js             # Creates/opens SQLite connection, enables WAL + foreign_keys, exports db instance
│   │   │   ├── migrations.js           # Schema migration runner: creates tables, indexes on first launch
│   │   │   └── seed.js                 # Seed script: inserts sample users, projects, tasks for dev/demo (npm run seed)
│   │   ├── middleware/
│   │   │   ├── auth.js                 # JWT verification middleware: extracts Bearer token, verifies, sets req.user
│   │   │   └── projectAccess.js        # Project membership middleware: verifies req.user is a member of :projectId
│   │   ├── routes/
│   │   │   ├── auth.js                 # POST /api/auth/signup, POST /api/auth/login
│   │   │   ├── projects.js             # CRUD /api/projects, /api/projects/:id
│   │   │   ├── tasks.js                # CRUD /api/projects/:projectId/tasks, PATCH .../move
│   │   │   ├── members.js              # POST/GET/DELETE /api/projects/:projectId/members
│   │   │   ├── activity.js             # GET /api/projects/:projectId/activity
│   │   │   └── analytics.js            # GET /api/projects/:projectId/analytics
│   │   └── utils/
│   │       ├── errors.js               # AppError class, error code constants, global error handler middleware
│   │       └── validation.js           # Shared Zod schemas (signup, login, project, task, etc.)
│   └── client/                         # Frontend (React SPA)
│       ├── package.json                # Frontend dependencies (react, tailwindcss, zustand, etc.)
│       ├── index.html                  # Vite HTML entry point
│       ├── vite.config.js              # Vite config: dev server proxy to API on port 3000
│       ├── tailwind.config.js          # Tailwind: content paths, custom theme extensions
│       ├── postcss.config.js           # PostCSS: Tailwind + autoprefixer
│       ├── src/
│       │   ├── main.jsx                # React entry: renders <App /> into #root
│       │   ├── App.jsx                 # Top-level component: React Router provider, route definitions, auth guards
│       │   ├── index.css               # Tailwind @layer directives + global styles
│       │   ├── api/
│       │   │   └── client.js           # Fetch wrapper: base URL, attaches JWT, parses JSON, handles errors
│       │   ├── store/
│       │   │   └── useStore.js         # Zustand store: auth, projects, tasks, ui slices
│       │   ├── components/
│       │   │   ├── Layout.jsx          # App shell: sidebar navigation, top bar, main content area
│       │   │   ├── ProtectedRoute.jsx  # Route guard: redirects to /login if no valid token
│       │   │   ├── KanbanBoard.jsx     # DragDropContext + four Droppable columns
│       │   │   ├── KanbanColumn.jsx    # Single droppable column with header and task cards
│       │   │   ├── TaskCard.jsx        # Draggable card: title, assignee, priority badge, due date
│       │   │   ├── TaskModal.jsx       # Create/edit task dialog: form fields + validation
│       │   │   ├── FilterBar.jsx       # Assignee, priority, due date filters + search input
│       │   │   ├── ProjectCard.jsx     # Project list item: name, description, member/task counts
│       │   │   ├── MemberList.jsx      # Team member list with invite form and remove button
│       │   │   ├── ActivityFeed.jsx    # Paginated activity entries with relative timestamps
│       │   │   ├── AnalyticsCharts.jsx # recharts: bar/pie for status, bar for assignee, line for burndown
│       │   │   ├── ConfirmDialog.jsx   # Reusable confirmation modal for delete actions
│       │   │   ├── EmptyState.jsx      # Reusable empty state with icon, message, and CTA button
│       │   │   ├── LoadingSpinner.jsx  # Reusable loading indicator
│       │   │   └── ErrorMessage.jsx    # Reusable error display with retry button
│       │   └── pages/
│       │       ├── Login.jsx           # Login form page
│       │       ├── Signup.jsx          # Registration form page
│       │       ├── Dashboard.jsx       # Project list + create project button
│       │       ├── ProjectView.jsx     # Kanban board + filter bar + activity feed sidebar
│       │       ├── Analytics.jsx       # Analytics dashboard for a project
│       │       └── TeamManagement.jsx  # Member list + invite form for a project
│       └── ...
├── tests/                              # Test suites
│   ├── api/                            # Backend tests (integration + unit)
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   ├── tasks.test.js
│   │   ├── members.test.js
│   │   └── analytics.test.js
│   └── client/                         # Frontend tests (component + integration)
│       ├── KanbanBoard.test.jsx
│       ├── TaskModal.test.jsx
│       └── store.test.js
├── package.json                        # Root package.json: workspace config, shared dev scripts
├── .env.example                        # Environment variable template
├── .gitignore                          # Ignores: node_modules, .env, *.db, dist/
└── README.md                           # Setup and run instructions
```

### 6.1 Key File Responsibilities

| File | Responsibility |
|------|----------------|
| `src/api/server.js` | Creates the Express app. Mounts `cors()`, `express.json()`, `morgan('dev')`. Registers route files under `/api`. Mounts the global error handler. Calls `migrations.run()` on startup. Starts listening on `PORT` (default 3000). |
| `src/api/db/database.js` | Opens or creates `taskflow.db` in the project root (or path from `DB_PATH` env var). Enables WAL mode. Enables foreign keys. Exports the `db` instance. |
| `src/api/utils/errors.js` | Defines `AppError` class with `statusCode`, `code`, `message`, and `details`. Exports error factory functions: `validationError(details)`, `unauthorizedError(message)`, `forbiddenError()`, `notFoundError(resource)`, `conflictError(message)`. Exports `globalErrorHandler` middleware that catches `AppError` instances and formats them per BRD 9.4. |
| `src/client/src/api/client.js` | Exports functions: `apiGet(path)`, `apiPost(path, body)`, `apiPut(path, body)`, `apiPatch(path, body)`, `apiDelete(path)`. Each reads the JWT from Zustand/localStorage and attaches it as `Authorization: Bearer <token>`. Parses JSON responses. Throws structured errors on non-2xx responses. |
| `src/client/src/store/useStore.js` | Single Zustand store with four slices (see Section 8). |

### 6.2 `.env.example`

```
# Server
PORT=3000
DB_PATH=./taskflow.db

# Authentication
JWT_SECRET=replace-with-a-random-64-char-hex-string
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 7. Error Handling Strategy

### 7.1 Standard Error Response Format

All API errors conform to the structure defined in BRD Section 9.4:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "A human-readable description of what went wrong.",
        "details": [
            {
                "field": "email",
                "message": "Must be a valid email address."
            }
        ]
    }
}
```

### 7.2 Error Codes and HTTP Status Mapping

| Error Code | HTTP Status | When Used |
|-----------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Request body, query params, or path params fail Zod validation. |
| `UNAUTHORIZED` | 401 | No JWT provided, JWT expired, JWT signature invalid, wrong login credentials. |
| `FORBIDDEN` | 403 | Valid JWT but user lacks access (not a project member, not the owner for owner-only actions). |
| `NOT_FOUND` | 404 | Requested resource (project, task, user) does not exist. |
| `CONFLICT` | 409 | Duplicate resource: email already registered, user already a project member. |
| `INTERNAL_ERROR` | 500 | Unexpected server error. Message is generic ("An unexpected error occurred"). Stack trace is logged server-side but never sent to the client (BRD 9.5). |

### 7.3 AppError Class

```javascript
class AppError extends Error {
    constructor(statusCode, code, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;  // Array of { field, message } or null
    }
}
```

### 7.4 Error Factory Functions

These provide consistent error creation throughout the route handlers:

```javascript
function validationError(details) {
    // details: array of { field: string, message: string }
    return new AppError(400, 'VALIDATION_ERROR', 'Validation failed.', details);
}

function unauthorizedError(message = 'Authentication required.') {
    return new AppError(401, 'UNAUTHORIZED', message);
}

function forbiddenError(message = 'You do not have permission to perform this action.') {
    return new AppError(403, 'FORBIDDEN', message);
}

function notFoundError(resource = 'Resource') {
    return new AppError(404, 'NOT_FOUND', `${resource} not found.`);
}

function conflictError(message) {
    return new AppError(409, 'CONFLICT', message);
}
```

### 7.5 Global Error Handler Middleware

Mounted as the last middleware in the Express app. Catches all errors thrown or passed via `next(err)`.

```javascript
function globalErrorHandler(err, req, res, next) {
    // Known application error
    if (err instanceof AppError) {
        const response = {
            error: {
                code: err.code,
                message: err.message
            }
        };
        if (err.details) {
            response.error.details = err.details;
        }
        return res.status(err.statusCode).json(response);
    }

    // Zod validation error (if not already caught in route)
    if (err.name === 'ZodError') {
        const details = err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
        }));
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed.',
                details
            }
        });
    }

    // Unknown error -- log full stack, return generic message
    console.error('Unhandled error:', err);
    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred.'
        }
    });
}
```

### 7.6 Zod Validation Pattern

Each route handler validates input using a Zod schema before processing. If validation fails, the Zod error is transformed into the standard error format.

```javascript
// In a route handler:
const schema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional().default(''),
    status: z.enum(['todo', 'in_progress', 'review', 'done']).optional().default('todo'),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('low'),
    assignee_id: z.number().int().positive().nullable().optional(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional()
});

const result = schema.safeParse(req.body);
if (!result.success) {
    const details = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
    }));
    throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed.', details);
}

const validated = result.data;
// ... proceed with validated data
```

### 7.7 Frontend Error Handling

The API client (`src/client/src/api/client.js`) catches non-2xx responses and throws a structured error object that components can inspect:

```javascript
class ApiError extends Error {
    constructor(status, body) {
        super(body?.error?.message || 'Request failed');
        this.status = status;
        this.code = body?.error?.code || 'UNKNOWN';
        this.details = body?.error?.details || null;
    }
}
```

Components display errors using the `ErrorMessage` component, which shows the `message` field and a retry button. Form components display field-level errors from the `details` array next to the corresponding input fields.

---

## 8. State Management (Frontend)

### 8.1 Zustand Store Structure

The application uses a single Zustand store divided into four logical slices. Slices are combined in a single `create()` call for cross-slice access.

```javascript
import { create } from 'zustand';

const useStore = create((set, get) => ({

    // ─── Auth Slice ───────────────────────────────────────────
    user: null,                   // { id, name, email } or null
    token: localStorage.getItem('taskflow_token') || null,

    login: (user, token) => {
        localStorage.setItem('taskflow_token', token);
        set({ user, token });
    },

    logout: () => {
        localStorage.removeItem('taskflow_token');
        set({ user: null, token: null, projects: [], currentProject: null, tasks: [] });
    },

    setUser: (user) => set({ user }),

    // ─── Projects Slice ───────────────────────────────────────
    projects: [],                 // Array of project summary objects
    currentProject: null,         // Full project object with members and task counts

    setProjects: (projects) => set({ projects }),
    setCurrentProject: (project) => set({ currentProject: project }),

    addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
    })),

    updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        currentProject: state.currentProject?.id === id
            ? { ...state.currentProject, ...updates }
            : state.currentProject
    })),

    removeProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
    })),

    // ─── Tasks Slice ──────────────────────────────────────────
    tasks: [],                    // Array of tasks for the current project

    setTasks: (tasks) => set({ tasks }),

    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
    })),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
    })),

    // Optimistic move for drag-and-drop (see Section 8.3)
    moveTask: (taskId, newStatus, newPosition) => set((state) => {
        const tasks = [...state.tasks];
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return state;

        const task = { ...tasks[taskIndex] };
        const oldStatus = task.status;
        const oldPosition = task.position;

        // Update positions in source column
        if (oldStatus !== newStatus) {
            tasks.forEach(t => {
                if (t.id !== taskId && t.status === oldStatus && t.position > oldPosition) {
                    t.position -= 1;
                }
            });
        }

        // Update positions in destination column
        tasks.forEach(t => {
            if (t.id !== taskId && t.status === newStatus && t.position >= newPosition) {
                t.position += 1;
            }
        });

        task.status = newStatus;
        task.position = newPosition;
        tasks[taskIndex] = task;

        return { tasks };
    }),

    // ─── UI Slice ─────────────────────────────────────────────
    isTaskModalOpen: false,
    editingTask: null,            // Task object being edited, or null for create mode

    filters: {
        assignee: null,           // user ID, 'unassigned', or null (all)
        priority: null,           // priority string or null (all)
        dueDateStart: null,       // ISO date string or null
        dueDateEnd: null,         // ISO date string or null
        search: ''                // search query string
    },

    openTaskModal: (task = null) => set({
        isTaskModalOpen: true,
        editingTask: task
    }),

    closeTaskModal: () => set({
        isTaskModalOpen: false,
        editingTask: null
    }),

    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),

    clearFilters: () => set({
        filters: {
            assignee: null,
            priority: null,
            dueDateStart: null,
            dueDateEnd: null,
            search: ''
        }
    })
}));

export default useStore;
```

### 8.2 API Client Wrapper

The API client reads the JWT from Zustand state and attaches it to every request. It also handles token expiration by redirecting to the login page.

```javascript
// src/client/src/api/client.js

import useStore from '../store/useStore';

const BASE_URL = '/api';  // Proxied to localhost:3000 by Vite dev server

class ApiError extends Error {
    constructor(status, body) {
        super(body?.error?.message || 'Request failed');
        this.status = status;
        this.code = body?.error?.code || 'UNKNOWN';
        this.details = body?.error?.details || null;
    }
}

async function request(method, path, body = null) {
    const token = useStore.getState().token;

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);

    // Handle 204 No Content (e.g., DELETE)
    if (response.status === 204) {
        return null;
    }

    const data = await response.json();

    if (!response.ok) {
        // Auto-logout on 401 (expired/invalid token)
        if (response.status === 401 && token) {
            useStore.getState().logout();
            window.location.href = '/login';
        }
        throw new ApiError(response.status, data);
    }

    return data;
}

export const apiGet    = (path)       => request('GET', path);
export const apiPost   = (path, body) => request('POST', path, body);
export const apiPut    = (path, body) => request('PUT', path, body);
export const apiPatch  = (path, body) => request('PATCH', path, body);
export const apiDelete = (path)       => request('DELETE', path);

export { ApiError };
```

### 8.3 Optimistic Updates for Drag-and-Drop

When a user drags a task card to a new position, the UI must respond within 100 ms (PRD AC-3.5). The flow is:

1. **`onDragEnd` fires** in the `KanbanBoard` component with `source` (column + index) and `destination` (column + index).
2. **Optimistic update:** Call `store.moveTask(taskId, newStatus, newPosition)` immediately. This recomputes positions in memory and triggers a re-render. The board reflects the new state instantly.
3. **API call:** Fire `apiPatch(`/projects/${projectId}/tasks/${taskId}/move`, { status, position })` in the background.
4. **On success:** No further action needed -- the optimistic state is correct.
5. **On failure:** Revert by re-fetching the full task list: `const tasks = await apiGet(`/projects/${projectId}/tasks`); store.setTasks(tasks);`. Display an error toast: "Failed to move task. The board has been refreshed."

```javascript
// In KanbanBoard.jsx (pseudocode)
const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;  // dropped outside a column

    const taskId = parseInt(draggableId, 10);
    const newStatus = destination.droppableId;    // column ID = status string
    const newPosition = destination.index;

    // 1. Optimistic update (instant)
    store.moveTask(taskId, newStatus, newPosition);

    try {
        // 2. Persist to server
        await apiPatch(
            `/projects/${projectId}/tasks/${taskId}/move`,
            { status: newStatus, position: newPosition }
        );
    } catch (err) {
        // 3. Revert on failure
        const tasks = await apiGet(`/projects/${projectId}/tasks`);
        store.setTasks(tasks);
        // Show error notification
    }
};
```

### 8.4 Token Persistence and Rehydration

On application load (`App.jsx`), the store checks `localStorage` for an existing token. If found, it sets the token in state and makes a lightweight validation call (or decodes the JWT client-side to check `exp`). If the token is expired or invalid, it clears state and redirects to `/login`.

```javascript
// In App.jsx (on mount)
useEffect(() => {
    const token = useStore.getState().token;
    if (token) {
        try {
            // Decode JWT payload (base64) to check expiration client-side
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
                useStore.getState().logout();
                return;
            }
            // Token looks valid -- fetch user profile to confirm
            apiGet('/auth/me')  // Optional: lightweight endpoint returning user object
                .then(user => useStore.getState().setUser(user))
                .catch(() => useStore.getState().logout());
        } catch {
            useStore.getState().logout();
        }
    }
}, []);
```

**Note:** If the `/auth/me` endpoint is not implemented (it is not in the required API contract), the client can decode the JWT payload locally to extract `userId` and `email`, then rely on the first authenticated API call to validate the token server-side.

### 8.5 Filtered Task Derivation

Filtering and searching happen client-side for boards with up to 100 tasks (PRD AC-7.6). The filtered task list is derived from the store, not stored separately:

```javascript
// Selector used by KanbanBoard.jsx
const useFilteredTasks = () => {
    const tasks = useStore(state => state.tasks);
    const filters = useStore(state => state.filters);

    return useMemo(() => {
        return tasks.filter(task => {
            // Assignee filter
            if (filters.assignee === 'unassigned' && task.assignee_id !== null) return false;
            if (filters.assignee && filters.assignee !== 'unassigned' && task.assignee_id !== filters.assignee) return false;

            // Priority filter
            if (filters.priority && task.priority !== filters.priority) return false;

            // Due date range filter
            if (filters.dueDateStart && (!task.due_date || task.due_date < filters.dueDateStart)) return false;
            if (filters.dueDateEnd && (!task.due_date || task.due_date > filters.dueDateEnd)) return false;

            // Search filter (case-insensitive, matches title or description)
            if (filters.search) {
                const query = filters.search.toLowerCase();
                const titleMatch = task.title.toLowerCase().includes(query);
                const descMatch = (task.description || '').toLowerCase().includes(query);
                if (!titleMatch && !descMatch) return false;
            }

            return true;
        });
    }, [tasks, filters]);
};
```

---

*This document is the authoritative technical reference for TaskFlow. All implementation decisions by Frontend and Backend developers must conform to the contracts, schemas, and patterns defined here. Any proposed deviation requires review and approval from the System Architect.*
