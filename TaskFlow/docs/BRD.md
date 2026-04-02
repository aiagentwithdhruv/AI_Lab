# Business Requirements Document: TaskFlow

**Project:** TaskFlow -- Project Management Dashboard
**Document Version:** 1.0
**Date:** 2026-03-24
**Status:** Approved

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objectives and KPIs](#2-business-objectives-and-kpis)
3. [Stakeholder Analysis](#3-stakeholder-analysis)
4. [Scope and Boundaries](#4-scope-and-boundaries)
5. [Constraints](#5-constraints)
6. [Risk Assessment](#6-risk-assessment)
7. [Timeline Assumptions](#7-timeline-assumptions)
8. [Compliance and Data Handling Requirements](#8-compliance-and-data-handling-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Glossary](#10-glossary)
11. [Revision History](#11-revision-history)

---

## 1. Executive Summary

TaskFlow is a locally hosted, single-page project management dashboard that enables individuals and small teams to organize work into projects, track tasks through customizable workflows, and gain visibility into progress through reporting. The application prioritizes simplicity, zero-configuration setup, and data privacy by running entirely on the user's own machine with no dependency on external paid services.

This document defines the business requirements, constraints, and quality expectations that will govern all technical and design decisions throughout the project lifecycle.

---

## 2. Business Objectives and KPIs

### 2.1 Primary Objectives

| ID | Objective | Description |
|----|-----------|-------------|
| BO-1 | Streamline task management | Provide a single interface for creating, assigning, prioritizing, and tracking tasks across multiple projects. |
| BO-2 | Improve work visibility | Give users and team leads a real-time view of project status, bottlenecks, and workload distribution. |
| BO-3 | Zero-friction setup | Deliver a product that can be installed and running within minutes, with no external service accounts, cloud subscriptions, or database server administration. |
| BO-4 | Data sovereignty | Ensure all project data stays on the user's local machine, under their full control. |

### 2.2 Key Performance Indicators (KPIs)

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Time to first task created | Under 3 minutes from first launch | Manual QA timing from cold start through account creation to first task. |
| Task throughput accuracy | Dashboard counts match database within 1 second of mutation | Automated integration test comparing API response with direct DB query. |
| Page load time (initial) | < 2 seconds on localhost | Lighthouse performance audit on development hardware. |
| API response time (p95) | < 300 ms for all CRUD endpoints | Load test with 100 concurrent simulated users on reference hardware. |
| Error rate | < 1% of API requests return 5xx | Automated test suite and manual soak test over 1-hour session. |
| Crash-free session rate | > 99.5% | Manual regression testing across supported browsers. |
| Test coverage | >= 80% line coverage on backend business logic | Coverage report from test runner (Jest / Vitest or equivalent). |

---

## 3. Stakeholder Analysis

### 3.1 Stakeholder Register

| Stakeholder | Role | Interest / Concern | Influence |
|-------------|------|---------------------|-----------|
| End User (Individual Contributor) | Primary user | Needs a fast, intuitive interface to manage daily tasks. Cares about reliability and ease of use. | High -- product exists to serve this persona. |
| Team Lead / Project Manager | Primary user | Needs cross-project visibility, workload balancing, and progress reporting. | High -- drives feature prioritization for dashboards and filters. |
| Frontend Agent | Builder | Responsible for the React SPA. Needs clear API contracts, design specs, and component boundaries. | Medium -- influences UI/UX decisions. |
| Backend Agent | Builder | Responsible for the Express/Fastify REST API and SQLite data layer. Needs well-defined endpoints, validation rules, and auth requirements. | Medium -- influences data model and API design. |
| DevOps / Integration Agent | Builder | Responsible for build tooling, local dev scripts, and CI configuration. Needs clear dependency and environment constraints. | Medium -- influences developer experience. |
| QA / Testing Agent | Verifier | Responsible for test strategy and execution. Needs acceptance criteria, edge cases, and performance targets. | Medium -- gates release readiness. |
| BRD Manager (this role) | Governance | Ensures all agents align to business requirements and constraints. Resolves scope disputes. | High -- authoritative source for "what" and "why." |

### 3.2 Communication Expectations

- All agents receive this BRD as their primary source of truth for requirements.
- Scope clarifications are resolved through the BRD Manager.
- Technical design documents (API spec, DB schema, component tree) must trace back to requirements defined here.

---

## 4. Scope and Boundaries

### 4.1 In Scope

| Area | Details |
|------|---------|
| User authentication | Registration, login, logout, session management via JWT. |
| Project management | Create, read, update, delete (CRUD) projects. Each project has a name, description, and owner. |
| Task management | CRUD tasks within projects. Fields: title, description, status, priority, assignee, due date, created/updated timestamps. |
| Task statuses | Configurable per project. Default workflow: To Do, In Progress, In Review, Done. |
| Priority levels | Critical, High, Medium, Low (fixed enumeration). |
| Dashboard views | Kanban board (default), list view, and a summary/stats view per project. |
| Filtering and sorting | Filter tasks by status, priority, assignee, due date range. Sort by any column in list view. |
| User profiles | Display name and email. Basic profile editing. |
| Search | Full-text search across task titles and descriptions within a project. |
| Responsive layout | Desktop (>= 1024px) and tablet (>= 768px) breakpoints. |

### 4.2 Out of Scope

| Area | Rationale |
|------|-----------|
| Real-time collaboration / WebSockets | Adds complexity beyond MVP; local-first usage model does not require it. |
| Email notifications | Requires external SMTP service, violating the no-external-paid-services constraint. |
| File attachments / uploads | Storage management is non-trivial and not core to MVP. |
| Mobile-native application | Responsive web covers tablet; native apps are a separate initiative. |
| Role-based access control (RBAC) | MVP treats all authenticated users equally. RBAC is a future enhancement. |
| Third-party integrations | Slack, GitHub, Jira integrations are post-MVP. |
| Data export / import | Useful but not essential for initial release. |
| Internationalization (i18n) | English only for MVP. |
| Dark mode | Cosmetic enhancement deferred to post-MVP. |

### 4.3 Assumptions

1. The application will be used by a small team (1-10 users) accessing it on a single local network or the same machine.
2. SQLite's concurrency limitations are acceptable for this user scale.
3. Users have Node.js (>= 18) and npm installed on their machines.
4. A modern evergreen browser (Chrome, Firefox, Edge, Safari -- latest two major versions) is available.

---

## 5. Constraints

### 5.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React (with Vite or CRA) | Component-based UI, large ecosystem, team familiarity. |
| Backend | Express.js or Fastify | Lightweight Node.js HTTP framework suitable for REST APIs. |
| Database | SQLite (via better-sqlite3 or sqlite3) | Zero-config, file-based, no separate server process. |
| Authentication | JWT (JSON Web Tokens) | Stateless auth suitable for SPA + REST architecture. |
| Password hashing | bcrypt | Industry-standard adaptive hashing. |

### 5.2 Operational Constraints

| Constraint | Detail |
|------------|--------|
| Local execution only | The entire application (frontend, backend, database) must run on the user's local machine. No cloud hosting required for operation. |
| No external paid services | No SaaS dependencies (e.g., Auth0, Stripe, SendGrid, hosted databases). Free/open-source libraries are permitted. |
| Single-page application | The frontend must be a SPA communicating with the backend exclusively through a REST API. No server-side rendering of pages. |
| Single codebase | Monorepo structure preferred. Frontend and backend live in the same repository for ease of setup. |

### 5.3 Development Constraints

| Constraint | Detail |
|------------|--------|
| Single sprint | All work is planned for one sprint. Features must be scoped to fit. |
| Parallel agent execution | All agents (frontend, backend, QA, DevOps) work simultaneously. This demands well-defined interfaces and contracts upfront. |

---

## 6. Risk Assessment

### 6.1 Risk Register

| ID | Risk | Likelihood | Impact | Severity | Mitigation Strategy |
|----|------|------------|--------|----------|---------------------|
| R-1 | **SQLite write contention under concurrent users.** Multiple users writing simultaneously could cause SQLITE_BUSY errors. | Medium | Medium | Medium | Use WAL (Write-Ahead Logging) mode. Implement retry logic with exponential backoff on the backend for write operations. Document the concurrency ceiling (recommend <= 10 concurrent writers). |
| R-2 | **API contract mismatch between frontend and backend agents.** Parallel development increases the chance that request/response shapes diverge. | High | High | Critical | Publish a versioned OpenAPI (Swagger) specification before development begins. Both agents generate types/validation from this single source of truth. Run contract tests in CI. |
| R-3 | **JWT secret management in local environment.** Developers may commit secrets or use weak keys. | Medium | High | High | Generate a random JWT secret at first startup if not present in environment. Store it in a `.env` file that is `.gitignore`-d. Document this in the setup guide. Never log or expose the secret in API responses. |
| R-4 | **Scope creep within the single sprint.** Stakeholders may request features beyond the defined scope, jeopardizing delivery. | Medium | High | High | Enforce the scope boundary defined in Section 4. Any feature not listed under "In Scope" requires a formal amendment to this BRD with sign-off before work begins. |
| R-5 | **Inadequate input validation leading to injection or data corruption.** SQLite is susceptible to SQL injection if queries are not parameterized. | Low | Critical | High | Mandate parameterized queries for all database operations (no string concatenation). Validate and sanitize all user input at the API boundary using a schema validation library (e.g., Zod, Joi, or Ajv). Include injection tests in the QA suite. |

### 6.2 Risk Review Cadence

Risks are reviewed at sprint planning and mid-sprint check-in. Any new risk identified during development must be added to this register and communicated to the BRD Manager.

---

## 7. Timeline Assumptions

### 7.1 Sprint Structure

| Phase | Activities | Duration Assumption |
|-------|------------|---------------------|
| Phase 0: Contracts | Finalize API spec (OpenAPI), DB schema, component hierarchy, and this BRD. | Day 1 |
| Phase 1: Parallel Build | Frontend agent builds UI shell, components, and client-side state. Backend agent builds API endpoints, DB migrations, and auth. DevOps agent sets up build tooling, scripts, and CI. | Days 2-6 |
| Phase 2: Integration | Connect frontend to live API. Resolve contract mismatches. End-to-end smoke testing. | Days 7-8 |
| Phase 3: QA and Hardening | Full test execution, performance validation against KPIs, bug fixing. | Days 9-10 |
| Phase 4: Release | Final review, documentation check, tagged release. | Day 10 |

### 7.2 Parallel Workstream Map

```
Day:  1       2       3       4       5       6       7       8       9       10
      |-------|-------|-------|-------|-------|-------|-------|-------|-------|
BRD:  [Contracts]
FE:           [====== UI Build ======][=Integration=][= QA Fix =][ Release ]
BE:           [====== API Build =====][=Integration=][= QA Fix =][ Release ]
DevOps:       [= Tooling =][====== CI / Scripts ======][ Support ][ Release ]
QA:           [Test Plan][== Unit/Integ Tests ==][=== E2E + Perf ===][ Sign-off ]
```

### 7.3 Key Assumptions

1. All agents begin work on Day 2 with access to finalized contracts from Day 1.
2. No external dependency approval or procurement is required.
3. Agent availability is 100% for the sprint duration.
4. Integration issues are resolved within the integration phase buffer (2 days).

---

## 8. Compliance and Data Handling Requirements

### 8.1 Authentication and Credential Security

| Requirement | Detail | Verification |
|-------------|--------|--------------|
| Password hashing | All user passwords must be hashed using bcrypt with a minimum cost factor of 10. Plaintext passwords must never be stored, logged, or returned in any API response. | Code review + unit test asserting stored password is bcrypt hash. |
| JWT-based authentication | All authenticated endpoints must require a valid JWT in the `Authorization: Bearer <token>` header. Tokens must include an expiration claim (`exp`). Recommended TTL: 24 hours. | Integration test: requests without valid token return 401. |
| JWT secret storage | The signing secret must be loaded from an environment variable (`JWT_SECRET`). It must never be hardcoded in source code or committed to version control. | Code review + grep-based CI check for hardcoded secrets. |
| No plaintext secrets | No API keys, database credentials, or signing secrets may exist in plaintext within the codebase. All secrets are sourced from environment variables or a `.env` file excluded by `.gitignore`. | CI pipeline check: scan for common secret patterns in committed files. |
| Password strength | Minimum 8 characters. At least one letter and one number. Enforced on both client and server. | Unit test on validation function. |

### 8.2 Input Validation

| Requirement | Detail |
|-------------|--------|
| Server-side validation on all endpoints | Every API endpoint that accepts user input must validate the request body, query parameters, and path parameters against a defined schema before processing. |
| Validation library | Use a schema validation library (Zod, Joi, or Ajv). Do not rely solely on client-side validation. |
| Rejection behavior | Invalid requests must be rejected with HTTP 400 and a structured error response (see Section 9.4). |
| SQL injection prevention | All database queries must use parameterized statements. String interpolation or concatenation into SQL is strictly prohibited. |
| XSS prevention | User-generated content rendered in the frontend must be escaped. React's default JSX escaping is acceptable for standard text content. Avoid `dangerouslySetInnerHTML`. |

### 8.3 Data Privacy

| Requirement | Detail |
|-------------|--------|
| Local storage only | All data resides in the local SQLite database file. No telemetry, analytics, or data is transmitted to external servers. |
| No third-party data sharing | The application does not integrate with any third-party data processors. |
| User data deletion | Deleting a user account should remove or anonymize all associated personal data (email, display name). Task data may be retained with anonymized ownership. |

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Metric | Requirement |
|--------|-------------|
| Initial page load | < 2 seconds on localhost (measured via Lighthouse or browser DevTools on standard development hardware). |
| Subsequent navigation | < 500 ms (SPA client-side routing, no full page reload). |
| API response time (p95) | < 300 ms for standard CRUD operations under normal load (up to 10 concurrent users). |
| Database query time | < 100 ms for indexed queries returning up to 500 rows. |
| Bundle size | Frontend production bundle should not exceed 500 KB gzipped (excluding source maps). |

### 9.2 Database

| Requirement | Detail |
|-------------|--------|
| Engine | SQLite 3 accessed via a Node.js binding (better-sqlite3 recommended for synchronous API, or sqlite3 for async). |
| Configuration | Zero-config for the end user. Database file is created automatically on first launch. |
| WAL mode | Enable Write-Ahead Logging for improved concurrent read performance. |
| Migrations | Schema changes managed through versioned migration files that run automatically on startup. |
| Backup | Not required for MVP, but the single-file nature of SQLite makes manual backup trivial (copy the `.db` file). |

### 9.3 Responsive UI

| Breakpoint | Target | Layout Expectations |
|------------|--------|---------------------|
| Desktop | >= 1024px viewport width | Full layout with sidebar navigation, multi-column Kanban board, and expanded list views. |
| Tablet | >= 768px and < 1024px | Collapsible sidebar (hamburger menu), single or dual-column Kanban, and scrollable list views. |
| Below 768px | Not targeted for MVP | Functional but not optimized. No specific layout guarantees. |

### 9.4 Error Response Format

All API error responses must conform to the following JSON structure:

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `error.code` | string | Yes | Machine-readable error code. Enum of known codes (e.g., `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, `INTERNAL_ERROR`, `CONFLICT`). |
| `error.message` | string | Yes | Human-readable summary suitable for display or logging. |
| `error.details` | array | No | Optional array of field-level errors. Present for validation failures. |
| `error.details[].field` | string | Yes (if details present) | The request field that caused the error. |
| `error.details[].message` | string | Yes (if details present) | Explanation of the field-level error. |

**HTTP Status Code Mapping:**

| Code | HTTP Status | Usage |
|------|-------------|-------|
| `VALIDATION_ERROR` | 400 | Malformed or invalid request input. |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token. |
| `FORBIDDEN` | 403 | Valid token but insufficient permissions. |
| `NOT_FOUND` | 404 | Requested resource does not exist. |
| `CONFLICT` | 409 | Duplicate resource (e.g., email already registered). |
| `INTERNAL_ERROR` | 500 | Unexpected server error. No implementation details leaked to client. |

### 9.5 Logging

| Requirement | Detail |
|-------------|--------|
| Request logging | Log HTTP method, path, status code, and response time for every request. |
| Error logging | Log full stack traces for 5xx errors to stdout/stderr. Do not expose stack traces in API responses. |
| Sensitive data | Never log passwords, JWT secrets, or full authorization headers. |

### 9.6 Developer Experience

| Requirement | Detail |
|-------------|--------|
| Single command startup | `npm run dev` (or equivalent) starts both frontend and backend in development mode. |
| Hot reload | Frontend must support hot module replacement (HMR). Backend should restart on file changes (e.g., nodemon). |
| Seed data | Provide a seed script (`npm run seed`) that populates the database with sample projects, tasks, and a test user for development and demo purposes. |
| Environment template | Include a `.env.example` file documenting all required environment variables with placeholder values. |

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **Agent** | An autonomous or semi-autonomous worker (human or AI) responsible for a specific domain (frontend, backend, QA, etc.). |
| **JWT** | JSON Web Token -- a compact, URL-safe token format used for stateless authentication. |
| **KPI** | Key Performance Indicator -- a measurable value that demonstrates progress toward a business objective. |
| **MVP** | Minimum Viable Product -- the smallest set of features that delivers core value. |
| **SPA** | Single-Page Application -- a web application that dynamically rewrites the current page rather than loading entire new pages from the server. |
| **WAL** | Write-Ahead Logging -- an SQLite journaling mode that allows concurrent reads during writes. |
| **bcrypt** | An adaptive password hashing function based on the Blowfish cipher, designed to be computationally expensive to resist brute-force attacks. |

---

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-24 | BRD Manager | Initial release. |

---

*This document is the authoritative source of business requirements for TaskFlow. All technical design documents, implementation decisions, and test plans must trace back to the requirements defined here. Any proposed deviation requires formal approval from the BRD Manager before implementation begins.*
