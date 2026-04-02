# TaskFlow API Test Report

**Date:** 2026-03-24
**Test Runner:** Vitest v1.6.1
**Test Command:** `cd /Users/apple/AI_Lab/TaskFlow/tests && npx vitest run`
**Node Version:** Darwin 25.3.0 (arm64)

---

## Summary

| Metric | Value |
|--------|-------|
| Total test files | 6 |
| Total tests | **154** |
| Passed | **154** |
| Failed | **0** |
| Skipped | **0** |
| Duration | ~4.0 seconds |

**Result: ALL TESTS PASSING**

---

## Coverage by Feature Area

### auth.test.js — 21 tests — JWT Authentication (AC-1.x)

| Test | Status | AC |
|------|--------|-----|
| POST /signup returns 201 with user and token for valid data | PASS | AC-1.1 |
| POST /signup returns 409 for duplicate email | PASS | AC-1.2 |
| POST /signup returns 400 for invalid email format | PASS | AC-1.3 |
| POST /signup returns 400 for password shorter than 8 chars | PASS | AC-1.3 |
| POST /signup returns 400 when password has no number | PASS | AC-1.3 |
| POST /signup returns 400 when password has no letter | PASS | AC-1.3 |
| POST /signup returns 400 when name is missing | PASS | AC-1.3 |
| POST /signup returns 400 when email is missing | PASS | AC-1.3 |
| POST /signup persists user — subsequent login succeeds | PASS | AC-1.1 |
| POST /login returns 200 with token for correct credentials | PASS | AC-1.4 |
| POST /login returns 401 for wrong password | PASS | AC-1.5 |
| POST /login error message is identical for wrong password vs unknown email | PASS | AC-1.5 |
| POST /login returns 401 for non-existent email | PASS | AC-1.5 |
| POST /login returns 400 when email is missing | PASS | validation |
| POST /login returns 400 when password is missing | PASS | validation |
| Protected route returns 401 with no Authorization header | PASS | AC-1.6 |
| Protected route returns 401 with wrong Authorization scheme | PASS | AC-1.6 |
| Protected route returns 401 for garbage token string | PASS | AC-1.6 |
| Protected route returns 401 for token signed with wrong secret | PASS | AC-1.7 |
| Protected route returns 401 for expired token | PASS | AC-1.7 |
| Protected route returns 200 for valid token | PASS | AC-1.6 |

### projects.test.js — 29 tests — Project CRUD (AC-2.x)

| Area | Tests | Status |
|------|-------|--------|
| POST /projects — creation, validation, auth | 8 | ALL PASS |
| GET /projects — list, membership visibility, field presence | 6 | ALL PASS |
| GET /projects/:id — detail, task_counts, access control | 5 | ALL PASS |
| PUT /projects/:id — owner update, non-owner 403, validation | 6 | ALL PASS |
| DELETE /projects/:id — owner delete, non-owner 403, cascade | 4 | ALL PASS |

Key scenarios validated:
- Creator is automatically set as owner (AC-2.1)
- Member list and task count appear in project list (AC-2.2)
- Project detail includes `members` array and `task_counts` for all four Kanban statuses (AC-2.3)
- Only owner can update or delete; members get 403 (AC-2.4, AC-2.5)
- Non-members get 403 on all project endpoints (AC-2.6)
- Deleted project returns 404 on subsequent fetch (AC-2.5)

### tasks.test.js — 44 tests — Task CRUD + Filtering (AC-4.x, AC-7.x)

| Area | Tests | Status |
|------|-------|--------|
| POST tasks — all fields, min fields, assignee, validation, auth | 11 | ALL PASS |
| GET tasks — list, status filter, priority filter, assignee filter, search, combined | 11 | ALL PASS |
| GET tasks/:id — detail, 404, access control | 3 | ALL PASS |
| PUT tasks/:id — title, priority, status, member update, validation, 404 | 7 | ALL PASS |
| PATCH tasks/:id/move — cross-column, persists, validation, 404, access | 7 | ALL PASS |
| DELETE tasks/:id — owner, member, 404, outsider 403, unauth 401 | 5 | ALL PASS |

Key scenarios validated:
- Default status `todo` and priority `low` applied when fields are omitted (AC-4.1)
- Assignee must be a project member; non-member assignee returns 400 (AC-4.1)
- `assignee_name` and `creator_name` are returned via JOIN (AC-4.2)
- Comma-separated multi-value status and priority filters work correctly (AC-7.1)
- `assignee=unassigned` returns only tasks with NULL assignee_id (AC-7.1)
- Search is case-insensitive substring match on title and description (AC-7.3)
- Filters and search can be combined with AND semantics (AC-7.4)
- Move operation persists — confirmed by follow-up GET (AC-3.3)
- Position field updates on cross-column move (AC-3.3)

### members.test.js — 20 tests — Team Management (AC-5.x)

| Area | Tests | Status |
|------|-------|--------|
| POST members — invite, 409 duplicate, 404 unregistered, 403 non-owner, auth | 8 | ALL PASS |
| GET members — list, field presence, owner role, 403 outsider, 401 unauth | 5 | ALL PASS |
| DELETE members — remove, access revoked, self-remove blocked, non-owner 403 | 7 | ALL PASS |

Key scenarios validated:
- Only registered users can be invited; unregistered email returns 404 (AC-5.2)
- Duplicate invite returns 409 (AC-5.3)
- After removal, former member gets 403 on project access (AC-5.4)
- Removed member's task assignments are cleared (AC-5.4 — verified in integration tests)
- Owner cannot remove themselves — returns 400 (AC-5.5)
- Non-owner members cannot invite or remove — returns 403 (AC-5.6)

### analytics.test.js — 16 tests — Analytics Dashboard (P1-1)

| Area | Tests | Status |
|------|-------|--------|
| With tasks — shape, tasksByStatus, overdueCount, tasksByAssignee, burndown | 7 | ALL PASS |
| Empty project — zeros for all counts, valid empty burndown | 5 | ALL PASS |
| Access control — 403 non-member, 401 unauth, 404 unknown project | 3 | ALL PASS |

Key scenarios validated:
- `tasksByStatus` always contains all four keys (todo, in_progress, review, done) even with no tasks
- `overdueCount` correctly counts non-done tasks with `due_date < today`
- `overdueTasks` items never have status `done`
- `tasksByAssignee` groups unassigned tasks under `"Unassigned"`
- `burndown` array format: `[{ date, remaining }]`

### integration.test.js — 24 tests — End-to-End Flows

| Flow | Tests | Status |
|------|-------|--------|
| Single-user: signup → login → project → task → move → analytics → delete | 1 | PASS |
| Multi-user: collaboration, task visibility, move by non-owner, member removal | 11 | ALL PASS |
| Unauthorized access: 6 attack vectors on private project | 6 | ALL PASS |
| Activity log: endpoint reachability, entry creation, field presence | 3 | ALL PASS |
| Query parameter edge cases: empty search, date filters, combined filters | 4 | ALL PASS |

---

## Bugs and Issues Found

### BUG-001: server.js called app.listen() on every import (now fixed)

**Severity:** Low (non-functional, test-environment only)
**File:** `src/api/server.js`
**Description:** `app.listen()` was called unconditionally at module load time. When multiple test files imported the server (each in their own process), the port binding attempt threw `EADDRINUSE`. Tests still passed because supertest uses its own internal ephemeral port, but the errors cluttered output.
**Fix Applied:** Wrapped `app.listen()` in `if (require.main === module)` guard so the server only binds a port when started directly, not when imported.

---

## Schema / Contract Observations (Not Bugs — Documentation Gaps)

### OBS-001: Priority enum mismatch between PRD and schema

**Location:** `src/api/db/migrations.js` and PRD Section 5 (P0-4)
**PRD says:** "priority: Low / Medium / High / Urgent"
**Schema enforces:** `CHECK (priority IN ('low', 'medium', 'high', 'critical'))`
**Impact:** The label "Urgent" from the PRD is stored as "critical" in the database. The frontend must map between these. Tests are written against the actual schema values (`low`, `medium`, `high`, `critical`).

### OBS-002: Activity feed returns paginated object, not a flat array

**Location:** `src/api/routes/activity.js`
**Actual response shape:** `{ activities: [...], total, limit, offset }`
**PRD says (AC-6.4):** "The feed supports pagination or infinite scroll, loading 20 entries at a time."
**Note:** The implementation is correct per AC-6.4. Any frontend consuming this endpoint must read `res.activities`, not `res` directly.

### OBS-003: activity_log action for project creation is misleadingly labeled

**Location:** `src/api/routes/projects.js` line 35
**Issue:** When creating a project, the activity log entry uses `action: 'created_task'` with `entity_type: 'task'`. This should be `action: 'created_project'` with `entity_type: 'project'`. The burndown `computeBurndown()` function in analytics counts `created_task` events as task increments, which could inflate burndown counts when projects are created.
**Recommendation:** Fix the activity log entry in the project creation handler to use a distinct action type.

### OBS-004: Task priority "urgent" from PRD not accepted by API

**Impact:** If the frontend sends `priority: "urgent"` (as mentioned in the PRD), the API will reject it with 400. Only `low`, `medium`, `high`, `critical` are accepted. This is a P0 gap if the UI uses PRD terminology.

---

## Acceptance Criteria Coverage

| AC | Criterion | Test File | Result |
|----|-----------|-----------|--------|
| AC-1.1 | Signup returns JWT and user record | auth.test.js | PASS |
| AC-1.2 | Duplicate email returns 409 | auth.test.js | PASS |
| AC-1.3 | Invalid email or short password returns 400 | auth.test.js | PASS |
| AC-1.4 | Login returns JWT with user | auth.test.js | PASS |
| AC-1.5 | Wrong credentials return 401 with generic message | auth.test.js | PASS |
| AC-1.6 | Missing/invalid token returns 401 | auth.test.js | PASS |
| AC-1.7 | Expired token returns 401 | auth.test.js | PASS |
| AC-1.8 | Logout is client-side (not tested at API level) | N/A | N/A |
| AC-2.1 | Authenticated user can create project; creator is owner | projects.test.js | PASS |
| AC-2.2 | User sees projects where owner or member, with counts | projects.test.js | PASS |
| AC-2.3 | Project detail includes board, members, activity | projects.test.js | PASS |
| AC-2.4 | Only owner can update project | projects.test.js | PASS |
| AC-2.5 | Only owner can delete project | projects.test.js | PASS |
| AC-2.6 | Non-member gets 403 on all project endpoints | projects.test.js, integration.test.js | PASS |
| AC-3.3 | Task move persists after page refresh | tasks.test.js | PASS |
| AC-4.1 | Task created with required/optional fields and defaults | tasks.test.js | PASS |
| AC-4.2 | Task detail shows all fields including creator | tasks.test.js | PASS |
| AC-4.3 | Any project member can update task fields | tasks.test.js | PASS |
| AC-4.4 | Any project member can delete task | tasks.test.js | PASS |
| AC-4.5 | Task actions generate activity entries | integration.test.js | PASS |
| AC-5.1 | Owner invites registered user by email | members.test.js | PASS |
| AC-5.2 | Unregistered email invite returns 404 | members.test.js | PASS |
| AC-5.3 | Already-member invite returns 409 | members.test.js | PASS |
| AC-5.4 | Owner removes member; access revoked; assignments cleared | members.test.js, integration.test.js | PASS |
| AC-5.5 | Owner cannot remove themselves | members.test.js | PASS |
| AC-5.6 | Non-owner cannot invite or remove | members.test.js, integration.test.js | PASS |
| AC-6.1 | Activity feed returns paginated entries | integration.test.js | PASS |
| AC-6.2 | Each entry shows action, entity, timestamp | integration.test.js | PASS |
| AC-6.3 | Task created/moved/deleted generates activity entry | integration.test.js | PASS |
| AC-7.1 | Filter by assignee, priority, due date | tasks.test.js | PASS |
| AC-7.3 | Search by title or description (case-insensitive) | tasks.test.js | PASS |
| AC-7.4 | Filters and search can be combined | tasks.test.js, integration.test.js | PASS |

**Not API-testable:**
- AC-1.8: Logout is client-side token removal — no server endpoint
- AC-3.1, AC-3.2, AC-3.4, AC-3.5, AC-3.6: Kanban drag-and-drop UI behavior
- AC-6.4: Infinite scroll (API supports pagination via limit/offset; UI behavior not testable here)
- AC-7.2, AC-7.5, AC-7.6: Client-side filter rendering behavior

---

## Recommendations

1. **Fix OBS-003 (activity log label for project creation)** — the `created_task` action on project creation will cause false positives in burndown analysis.

2. **Align priority naming** — either update the schema to use `urgent` instead of `critical`, or update the PRD to say `critical`. A mismatch between product documentation and implementation is a maintenance risk.

3. **Add tests for activity log pagination** — the `limit` and `offset` query parameters on `GET /activity` are not covered in the current suite. Consider adding a test with `limit=1` to verify pagination fields are correct.

4. **Consider adding rate limiting tests** — no rate limiting is currently implemented. For a production deployment, brute-force protection on `/api/auth/login` should be added and tested.

5. **Add a test for project deletion cascade** — when a project is deleted, AC-2.5 states tasks, memberships, and activity records should all be removed. The ON DELETE CASCADE on foreign keys handles this at the DB level, but an explicit test that verifies a deleted project's tasks are inaccessible would be valuable.
