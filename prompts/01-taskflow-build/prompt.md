# Prompt 1: Multi-Agent Full-Stack Build — TaskFlow (Project Management Dashboard)

## Goal

Build a working full-stack **Project Management Dashboard** called **TaskFlow** with authentication, kanban boards, team management, and an analytics dashboard. The end result should be a running app I can view at http://localhost:3000 with full CRUD functionality, real-time task updates, and a polished UI — plus complete documentation (BRD, PRD, system design) and a QA report confirming everything works.

---

## Product Overview

**TaskFlow** is a lightweight project management tool where teams can:
- Sign up / log in (JWT auth)
- Create projects and invite team members
- Manage tasks on a drag-and-drop Kanban board (To Do → In Progress → Review → Done)
- Assign tasks to members with priority levels (Low, Medium, High, Critical)
- View an analytics dashboard (tasks by status, tasks by assignee, overdue tasks, burndown chart)
- Get an activity feed showing recent actions across the project
- Filter and search tasks by assignee, priority, status, and due date

---

## Agent Team (8 Agents — All Using Opus)

Create a team of 8 specialized teammates. Each agent has a defined role, clear deliverables, and explicit handoff points to other agents.

---

### Agent 1: Product Manager (`product-manager`)

**Role:** Own the product vision and define what gets built.

**Tasks:**
1. Write a Product Requirements Document (PRD) at `docs/PRD.md` containing:
   - Product vision and objectives
   - Target users and personas (2-3 personas)
   - Feature list with priority (P0 = must-have, P1 = should-have, P2 = nice-to-have)
   - User stories in "As a [persona], I want [action], so that [outcome]" format (minimum 15 user stories)
   - Acceptance criteria for each P0 feature
   - Success metrics (e.g., all P0 features functional, <2s page load)
2. Once PRD is complete, **message System Architect** with a summary of P0 features and key user flows
3. Once PRD is complete, **message BRD & PRD Docs Agent** with the finalized feature list

**Deliverable:** `docs/PRD.md`

---

### Agent 2: BRD Manager (`brd-manager`)

**Role:** Define the business case and constraints that guide all technical decisions.

**Tasks:**
1. Write a Business Requirements Document (BRD) at `docs/BRD.md` containing:
   - Business objectives and KPIs
   - Stakeholder analysis
   - Scope and boundaries (what's in, what's out)
   - Constraints (tech stack: React + Express/Fastify + SQLite, must run locally, no external paid services)
   - Risk assessment (3-5 risks with mitigation strategies)
   - Timeline assumptions (single sprint, all agents working in parallel)
   - Compliance and data handling requirements (password hashing, no plaintext secrets)
2. Once BRD is complete, **message Product Manager** confirming business constraints are documented
3. Once BRD is complete, **message System Architect** with the technical constraints and non-functional requirements

**Deliverable:** `docs/BRD.md`

---

### Agent 3: System Architect (`system-architect`)

**Role:** Design the technical architecture, database schema, and API contracts that Backend and Frontend will implement.

**Wait for:** Messages from both Product Manager (P0 features) and BRD Manager (technical constraints) before starting detailed design.

**Tasks:**
1. Write a System Design Document at `docs/SYSTEM-DESIGN.md` containing:
   - High-level architecture diagram (described in text/ASCII)
   - Tech stack decisions with rationale
   - Database schema (all tables, columns, types, relationships, indexes)
   - REST API contract (every endpoint: method, path, request body, response shape, status codes)
   - Authentication flow (JWT-based: signup, login, token refresh, middleware)
   - Folder structure for the entire project
   - Error handling strategy (standard error response format)
   - State management approach for frontend
2. Once design is complete, **message Backend Dev** with the full API contract and DB schema
3. Once design is complete, **message Frontend Dev** with the API contract, component hierarchy, and state management plan
4. Once design is complete, **message QA Engineer** with the API contract for test planning

**Deliverable:** `docs/SYSTEM-DESIGN.md`

---

### Agent 4: BRD & PRD Docs Agent (`docs-agent`)

**Role:** Polish, cross-reference, and validate all documentation for consistency and completeness.

**Wait for:** Messages from Product Manager (PRD complete) and BRD Manager (BRD complete).

**Tasks:**
1. Review `docs/PRD.md` and `docs/BRD.md` for:
   - Consistency between business requirements and product features
   - Gaps: any P0 feature missing acceptance criteria? Any business constraint not reflected in the PRD?
   - Terminology alignment (same terms used across both docs)
2. Create a cross-reference matrix at `docs/TRACEABILITY-MATRIX.md` mapping:
   - Business Requirements → Product Features → User Stories → API Endpoints
3. Write an executive summary at `docs/EXECUTIVE-SUMMARY.md` (1 page) that a non-technical stakeholder could read
4. Once docs are validated, **message QA Engineer** with the acceptance criteria extracted from PRD for test case generation

**Deliverables:** `docs/TRACEABILITY-MATRIX.md`, `docs/EXECUTIVE-SUMMARY.md`, updates to PRD/BRD if gaps found

---

### Agent 5: Backend Dev (`backend-dev`)

**Role:** Build the REST API, database layer, and authentication system.

**Wait for:** Message from System Architect with the API contract and DB schema.

**Tasks:**
1. Initialize the backend project in `src/api/` with:
   - Express.js or Fastify server
   - SQLite database with migrations (using better-sqlite3 or similar)
   - All tables from the system design (users, projects, tasks, project_members, activity_log)
2. Implement authentication:
   - `POST /api/auth/signup` — register with email/password (bcrypt hashed)
   - `POST /api/auth/login` — return JWT token
   - Auth middleware for protected routes
3. Implement core CRUD endpoints:
   - Projects: create, list, get, update, delete
   - Tasks: create, list (with filters), get, update (including status changes), delete
   - Team: invite member to project, list members, remove member
   - Activity: log all mutations, list recent activity per project
   - Analytics: tasks by status, tasks by assignee, overdue count
4. Implement proper error handling, input validation, and status codes per the API contract
5. Seed the database with sample data (2 users, 1 project, 5 tasks, some activity)
6. When done, **message Frontend Dev** with confirmed API endpoints and any deviations from the original contract
7. When done, **message QA Engineer** confirming the API is ready for testing

**Deliverable:** Complete working API in `src/api/`

---

### Agent 6: Frontend Dev (`frontend-dev`)

**Role:** Build the React UI with all pages, components, and API integration.

**Wait for:** Message from System Architect with component hierarchy and API contract. Then wait for Backend Dev's confirmation that the API is live.

**Tasks:**
1. Initialize the frontend in `src/components/` (or `src/client/`) with:
   - React (Vite or Create React App)
   - React Router for page navigation
   - Tailwind CSS or CSS Modules for styling
   - State management (Context API or Zustand)
2. Build pages:
   - **Login / Signup** — forms with validation, error display, redirect on success
   - **Dashboard** — list of user's projects with create-new button
   - **Project View** — Kanban board with 4 columns, drag-and-drop task cards
   - **Task Detail Modal** — edit title, description, assignee, priority, due date, status
   - **Analytics Page** — charts showing task distribution, overdue tasks, burndown
   - **Team Management** — list members, invite by email, remove
   - **Activity Feed** — timeline of recent project actions
3. Wire up all API calls using fetch or axios with JWT token in headers
4. Handle loading states, empty states, and error states gracefully
5. Make the UI responsive (works on desktop and tablet)
6. When done, **message QA Engineer** confirming the UI is ready for integration testing

**Deliverable:** Complete working UI in `src/client/` or `src/components/`

---

### Agent 7: QA Engineer (`qa-engineer`)

**Role:** Write and run comprehensive tests, produce a test report.

**Wait for:** Messages from System Architect (API contract for test planning), Docs Agent (acceptance criteria), Backend Dev (API ready), and Frontend Dev (UI ready).

**Tasks:**
1. Start early (after receiving API contract) by writing test scaffolding in `tests/`:
   - Unit test setup (Jest or Vitest)
   - API test helpers (base URL, auth token management, request wrappers)
   - Test data factories
2. Write unit tests for:
   - Auth endpoints (signup, login, invalid credentials, duplicate email)
   - Project CRUD (create, list, get, update, delete, authorization checks)
   - Task CRUD (create with all fields, filter by status/assignee/priority, status transitions)
   - Team management (invite, list, remove, permission checks)
   - Analytics endpoints (correct counts, edge cases with no tasks)
3. Write integration tests for key user flows:
   - Full signup → login → create project → add task → move task → view analytics flow
   - Multi-user scenario: user A creates project, invites user B, user B sees the project
   - Edge cases: unauthorized access, invalid data, deleting project with tasks
4. Run all tests and produce a report at `tests/report.md` with:
   - Total tests: passed / failed / skipped
   - Coverage summary by feature area
   - List of any failing tests with details
   - Recommendations for known issues

**Deliverable:** `tests/` directory with all tests, `tests/report.md`

---

### Agent 8: Integration & DevOps Agent (`devops-agent`)

**Role:** Wire everything together, ensure the app runs end-to-end, and produce the final build summary.

**Wait for:** Backend Dev and Frontend Dev to both confirm their work is complete.

**Tasks:**
1. Create a `package.json` at the project root with scripts:
   - `npm install` — installs all dependencies (backend + frontend)
   - `npm run dev` — starts both backend (port 3001) and frontend (port 3000) concurrently
   - `npm run build` — production build of frontend
   - `npm test` — runs the full test suite
2. Create a `.env.example` with all required environment variables
3. Ensure the frontend proxies API requests to the backend correctly
4. Verify the app starts cleanly with `npm run dev` — fix any wiring issues
5. Write the build summary at `docs/build-summary.md` containing:
   - What was built (feature inventory with status: working / partial / not implemented)
   - Architecture decisions and trade-offs
   - How to run the app (step-by-step)
   - Known issues and limitations
   - What would be built next (P1 and P2 features from PRD)
6. **Message all agents** with a final status update once the app is running

**Deliverable:** Root-level config files, `docs/build-summary.md`, a running app

---

## Agent Communication Flow

```
BRD Manager ──────────────────────┐
  │                                │
  ├──→ Product Manager (constraints confirmed)
  │                                │
  └──→ System Architect ←─────────┘ (constraints + P0 features)
          │
          ├──→ Backend Dev (API contract + DB schema)
          ├──→ Frontend Dev (API contract + component plan)
          └──→ QA Engineer (API contract for test planning)

Product Manager ──→ Docs Agent (feature list)
BRD Manager ──────→ Docs Agent (BRD complete)
Docs Agent ───────→ QA Engineer (acceptance criteria)

Backend Dev ──→ Frontend Dev (API confirmed live)
Backend Dev ──→ QA Engineer (API ready for testing)
Frontend Dev ──→ QA Engineer (UI ready for testing)

Backend Dev ──┐
Frontend Dev ─┤──→ DevOps Agent (both complete → wire & ship)
QA Engineer ──┘
```

---

## Final Deliverables

| Deliverable | Owner | Description |
|---|---|---|
| `docs/BRD.md` | BRD Manager | Business requirements and constraints |
| `docs/PRD.md` | Product Manager | Product requirements, user stories, acceptance criteria |
| `docs/SYSTEM-DESIGN.md` | System Architect | Architecture, DB schema, API contract |
| `docs/TRACEABILITY-MATRIX.md` | Docs Agent | Requirements → Features → Stories → APIs mapping |
| `docs/EXECUTIVE-SUMMARY.md` | Docs Agent | Non-technical 1-page overview |
| `src/api/` | Backend Dev | Working REST API with auth, CRUD, analytics |
| `src/client/` | Frontend Dev | React app with all pages and API integration |
| `tests/` | QA Engineer | Unit + integration tests |
| `tests/report.md` | QA Engineer | Test results with pass/fail counts |
| `docs/build-summary.md` | DevOps Agent | How to run, what was built, known issues |
| Running app at http://localhost:3000 | DevOps Agent | The working product |

---

## Constraints

- **Tech Stack:** React + Express/Fastify + SQLite (no external databases, no paid services)
- **All agents use Opus model**
- **No placeholder or mock implementations** — every feature must actually work end-to-end
- **Every agent must communicate via messages** — no agent should assume what another agent built without receiving confirmation
- **If an agent encounters a blocker**, it should message the relevant agent asking for clarification rather than guessing
