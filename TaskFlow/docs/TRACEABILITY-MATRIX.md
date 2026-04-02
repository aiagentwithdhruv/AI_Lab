# TaskFlow Traceability Matrix

**Version:** 1.0
**Date:** March 24, 2026
**Purpose:** Cross-reference mapping from Business Requirements to Product Features, User Stories, and API Endpoints.

---

## 1. Business Requirement to Feature / User Story / API Endpoint Mapping

| Business Req ID | Business Requirement | Feature ID | Feature | User Story IDs | API Endpoints |
|-----------------|----------------------|------------|---------|----------------|---------------|
| BO-1 | Streamline task management | P0-2 | Project CRUD | US-04, US-05, US-06, US-07 | `POST /api/projects`, `GET /api/projects`, `GET /api/projects/:id`, `PUT /api/projects/:id`, `DELETE /api/projects/:id` |
| BO-1 | Streamline task management | P0-3 | Kanban Board with Drag-and-Drop | US-09 | `PATCH /api/tasks/:id/move`, `PATCH /api/tasks/:id/reorder` |
| BO-1 | Streamline task management | P0-4 | Task CRUD | US-08, US-10, US-11 | `POST /api/projects/:id/tasks`, `GET /api/projects/:id/tasks`, `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` |
| BO-1 | Streamline task management | P0-5 | Team Management | US-14, US-15, US-16 | `POST /api/projects/:id/members`, `DELETE /api/projects/:id/members/:userId`, `GET /api/projects/:id/members` |
| BO-1 | Streamline task management | P0-7 | Task Filtering and Search | US-12, US-13 | `GET /api/projects/:id/tasks?assignee=&priority=&dueDateStart=&dueDateEnd=&q=` |
| BO-2 | Improve work visibility | P0-3 | Kanban Board with Drag-and-Drop | US-09 | `GET /api/projects/:id/board` |
| BO-2 | Improve work visibility | P0-6 | Activity Feed | US-21, US-22 | `GET /api/projects/:id/activities?page=&limit=` |
| BO-2 | Improve work visibility | P0-7 | Task Filtering and Search | US-12, US-13 | `GET /api/projects/:id/tasks?assignee=&priority=&dueDateStart=&dueDateEnd=&q=` |
| BO-2 | Improve work visibility | P1-1 | Analytics Dashboard | US-17, US-18, US-19, US-20 | `GET /api/projects/:id/analytics/status`, `GET /api/projects/:id/analytics/assignees`, `GET /api/projects/:id/analytics/overdue`, `GET /api/projects/:id/analytics/burndown` |
| BO-2 | Improve work visibility | P1-3 | Empty, Loading, and Error States | -- | N/A (frontend-only; consumes existing endpoints) |
| BO-3 | Zero-friction setup | P0-1 | JWT Authentication | US-01, US-02, US-03 | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` |
| BO-3 | Zero-friction setup | P1-2 | Responsive Design | -- | N/A (frontend-only) |
| BO-4 | Data sovereignty | P0-1 | JWT Authentication | US-01, US-02, US-03 | All endpoints enforce `Authorization: Bearer <token>` |
| BO-4 | Data sovereignty | -- | Local SQLite storage, no external services | -- | All data served from local `/api/*` endpoints; no external calls |

---

## 2. Feature to User Story Detail Mapping

| Feature ID | Feature | User Story ID | User Story Summary |
|------------|---------|---------------|--------------------|
| P0-1 | JWT Authentication | US-01 | New user signs up with email and password |
| P0-1 | JWT Authentication | US-02 | Registered user logs in with credentials |
| P0-1 | JWT Authentication | US-03 | Logged-in user logs out |
| P0-2 | Project CRUD | US-04 | Project manager creates a new project |
| P0-2 | Project CRUD | US-05 | User views list of owned/member projects |
| P0-2 | Project CRUD | US-06 | Project manager edits project details |
| P0-2 | Project CRUD | US-07 | Project manager deletes a project |
| P0-3 | Kanban Board | US-09 | Developer drags task between columns |
| P0-4 | Task CRUD | US-08 | Developer creates a task with details |
| P0-4 | Task CRUD | US-10 | Developer edits task details |
| P0-4 | Task CRUD | US-11 | Developer deletes a task |
| P0-5 | Team Management | US-14 | Project manager invites member by email |
| P0-5 | Team Management | US-15 | Project manager removes a member |
| P0-5 | Team Management | US-16 | Project manager assigns task to member |
| P0-6 | Activity Feed | US-21 | Team lead views project activity feed |
| P0-6 | Activity Feed | US-22 | Project manager sees who did what and when |
| P0-7 | Task Filtering and Search | US-12 | Developer filters board by assignee and priority |
| P0-7 | Task Filtering and Search | US-13 | Developer searches tasks by title or description |
| P1-1 | Analytics Dashboard | US-17 | Team lead views tasks by status breakdown |
| P1-1 | Analytics Dashboard | US-18 | Team lead views tasks grouped by assignee |
| P1-1 | Analytics Dashboard | US-19 | Team lead views overdue tasks |
| P1-1 | Analytics Dashboard | US-20 | Team lead views burndown chart |

---

## 3. Acceptance Criteria to Verification Method Mapping

| Acceptance Criteria | Description | Verification Method |
|---------------------|-------------|---------------------|
| **P0-1: JWT Authentication** | | |
| AC-1.1 | Register with valid email/password; JWT returned, user stored | Automated API test: POST /api/auth/register with valid payload, assert 201 + JWT in response + user in DB |
| AC-1.2 | Duplicate email returns 409 Conflict | Automated API test: register same email twice, assert 409 response |
| AC-1.3 | Invalid email or short password returns 400 with field errors | Automated API test: POST with invalid payloads, assert 400 + error.details fields |
| AC-1.4 | Login with correct credentials returns JWT with user ID and exp | Automated API test: POST /api/auth/login, decode JWT and assert claims |
| AC-1.5 | Wrong credentials return 401; message does not reveal which field is wrong | Automated API test + manual review of error message text |
| AC-1.6 | Protected endpoint without JWT returns 401 | Automated API test: call protected endpoint with no Authorization header |
| AC-1.7 | Expired JWT returns 401 | Automated API test: craft expired token, assert 401 |
| AC-1.8 | Logout clears client-side token; subsequent requests fail | End-to-end UI test: log out, attempt navigation to protected route, assert redirect to login |
| **P0-2: Project CRUD** | | |
| AC-2.1 | Create project with name (1-100 chars) and optional description (up to 500 chars) | Automated API test: POST /api/projects with valid/invalid payloads |
| AC-2.2 | List projects returns owned and member projects with counts | Automated API test: GET /api/projects, assert response shape and counts |
| AC-2.3 | Project detail page shows board, members, activity feed | End-to-end UI test: navigate to project, verify all sections render |
| AC-2.4 | Only owner can update project name/description | Automated API test: PUT as owner (200) vs. PUT as member (403) |
| AC-2.5 | Owner can delete project; cascades to tasks, memberships, activities | Automated API test: DELETE + verify cascade; UI test: confirmation dialog appears |
| AC-2.6 | Non-members receive 403 on project endpoints | Automated API test: call project endpoints as non-member, assert 403 |
| **P0-3: Kanban Board with Drag-and-Drop** | | |
| AC-3.1 | Board displays four columns in correct order | End-to-end UI test: assert column headers and order |
| AC-3.2 | Task card shows title, assignee, priority color, due date | End-to-end UI test: create task with all fields, inspect card rendering |
| AC-3.3 | Drag task between columns updates status; persists after refresh | End-to-end UI test: drag-and-drop action, refresh page, verify new column |
| AC-3.4 | Drag task within column reorders; persists after refresh | End-to-end UI test: reorder within column, refresh, verify order |
| AC-3.5 | Optimistic update with rollback on API failure | Integration test: mock API failure on move, verify card reverts + error shown |
| AC-3.6 | Board loads within 2 seconds with 100 tasks | Performance test: seed 100 tasks, measure time-to-interactive |
| **P0-4: Task CRUD** | | |
| AC-4.1 | Create task with all fields and validation rules | Automated API test: POST with valid/invalid payloads, assert field validation |
| AC-4.2 | Task detail view shows all fields, dates, and creator | End-to-end UI test: open task, verify all fields displayed |
| AC-4.3 | Update any task field; board reflects changes immediately | Automated API test: PUT task fields; UI test: verify board updates |
| AC-4.4 | Delete task with confirmation; card removed from board | UI test: delete flow with confirmation dialog; API test: DELETE returns 200 |
| AC-4.5 | Task mutations generate activity feed entries | Automated API test: perform CRUD, then GET activities and assert entries exist |
| **P0-5: Team Management** | | |
| AC-5.1 | Owner invites registered user by email; user appears in member list | Automated API test: POST /api/projects/:id/members, verify member list |
| AC-5.2 | Inviting unregistered email returns error | Automated API test: POST with non-existent email, assert error response |
| AC-5.3 | Inviting existing member returns error, no duplicate | Automated API test: invite same user twice, assert error on second attempt |
| AC-5.4 | Owner removes member; access revoked, assignee cleared on their tasks | Automated API test: DELETE member, verify 403 on subsequent access + tasks updated |
| AC-5.5 | Owner cannot remove themselves | Automated API test: owner attempts self-removal, assert error |
| AC-5.6 | Non-owners cannot invite or remove members | Automated API test: member attempts invite/remove, assert 403 |
| **P0-6: Activity Feed** | | |
| AC-6.1 | Entries in reverse-chronological order | Automated API test: create multiple activities, GET feed, assert ordering |
| AC-6.2 | Each entry shows actor, action, target, human-readable timestamp | Automated API test + UI test: verify response fields and display format |
| AC-6.3 | All specified actions generate entries | Automated API test: perform each action type, verify corresponding activity entry |
| AC-6.4 | Pagination loads 20 entries at a time | Automated API test: seed >20 entries, verify page size and next-page behavior |
| AC-6.5 | Only project members can view the feed | Automated API test: non-member requests feed, assert 403 |
| **P0-7: Task Filtering and Search** | | |
| AC-7.1 | Filter bar with assignee, priority, and due date range controls | End-to-end UI test: verify filter controls are present and populated |
| AC-7.2 | Filters restrict displayed tasks; empty columns show message | End-to-end UI test: apply filter, verify matching tasks only; check empty column message |
| AC-7.3 | Search by title/description, case-insensitive | End-to-end UI test: type search query, verify matching tasks displayed |
| AC-7.4 | Filters and search combine with AND logic | End-to-end UI test: apply filter + search, verify intersection of results |
| AC-7.5 | "Clear all filters" resets to full board | End-to-end UI test: apply filters, click clear, verify full board restored |
| AC-7.6 | Client-side filtering responds within 200ms for 100 tasks | Performance test: seed 100 tasks, measure filter response time |

---

## 4. API Endpoint Summary

| Method | Endpoint | Feature(s) | Description |
|--------|----------|-------------|-------------|
| POST | `/api/auth/register` | P0-1 | Register a new user |
| POST | `/api/auth/login` | P0-1 | Authenticate and receive JWT |
| POST | `/api/auth/logout` | P0-1 | Logout (client-side token removal) |
| GET | `/api/projects` | P0-2 | List all projects for the authenticated user |
| POST | `/api/projects` | P0-2 | Create a new project |
| GET | `/api/projects/:id` | P0-2, P0-3 | Get project details including board |
| PUT | `/api/projects/:id` | P0-2 | Update project name/description |
| DELETE | `/api/projects/:id` | P0-2 | Delete project and all associated data |
| GET | `/api/projects/:id/tasks` | P0-4, P0-7 | List tasks (with optional filter/search query params) |
| POST | `/api/projects/:id/tasks` | P0-4 | Create a new task in the project |
| GET | `/api/tasks/:id` | P0-4 | Get task details |
| PUT | `/api/tasks/:id` | P0-4 | Update task fields |
| DELETE | `/api/tasks/:id` | P0-4 | Delete a task |
| PATCH | `/api/tasks/:id/move` | P0-3 | Move task to a different column (status change) |
| PATCH | `/api/tasks/:id/reorder` | P0-3 | Reorder task within a column |
| GET | `/api/projects/:id/members` | P0-5 | List project members |
| POST | `/api/projects/:id/members` | P0-5 | Invite a member to the project |
| DELETE | `/api/projects/:id/members/:userId` | P0-5 | Remove a member from the project |
| GET | `/api/projects/:id/activities` | P0-6 | Get paginated activity feed |
| GET | `/api/projects/:id/analytics/status` | P1-1 | Tasks by status breakdown |
| GET | `/api/projects/:id/analytics/assignees` | P1-1 | Tasks grouped by assignee |
| GET | `/api/projects/:id/analytics/overdue` | P1-1 | Overdue task list |
| GET | `/api/projects/:id/analytics/burndown` | P1-1 | Burndown chart data |

---

*This traceability matrix ensures every business requirement is addressed by at least one product feature, every feature is backed by user stories, and every acceptance criterion has a defined verification method. It should be updated as requirements evolve.*
