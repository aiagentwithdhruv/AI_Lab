# Prompt 01: TaskFlow Build

**8 agents build a full-stack project management dashboard from scratch.**

TaskFlow is a lightweight project management tool with JWT authentication, drag-and-drop Kanban boards, team management, analytics dashboards, and activity feeds. The team produces a working app at `localhost:3000` along with complete documentation (BRD, PRD, system design) and a QA report.

**Tags:** `#full-stack` `#build` `#react` `#node` `#testing`

---

## Agent Roster

| # | Agent | Role | Key Responsibility |
|---|-------|------|--------------------|
| 1 | **Product Manager** | Product vision owner | Writes the PRD with user stories, personas, and acceptance criteria |
| 2 | **BRD Manager** | Business case definer | Documents business objectives, constraints, and risk assessment |
| 3 | **System Architect** | Technical designer | Designs DB schema, REST API contract, auth flow, and folder structure |
| 4 | **Docs Agent** | Documentation validator | Cross-references BRD/PRD, builds traceability matrix and executive summary |
| 5 | **Backend Dev** | API builder | Implements Express/Fastify + SQLite API with auth, CRUD, and analytics |
| 6 | **Frontend Dev** | UI builder | Builds React app with Kanban board, analytics charts, and team management |
| 7 | **QA Engineer** | Test author and runner | Writes unit and integration tests, produces a test report |
| 8 | **Integration Tester** | DevOps and wiring | Wires backend + frontend, creates npm scripts, verifies the app runs end-to-end |

---

## Communication Flow

```
Phase 1: Requirements
  BRD Manager ──→ Product Manager (constraints confirmed)
  BRD Manager ──→ System Architect (technical constraints)
  Product Manager ──→ System Architect (P0 features)
  Product Manager ──→ Docs Agent (feature list)
  BRD Manager ──→ Docs Agent (BRD complete)

Phase 2: Architecture
  System Architect ──→ Backend Dev (API contract + DB schema)
  System Architect ──→ Frontend Dev (API contract + component plan)
  System Architect ──→ QA Engineer (API contract for test planning)
  Docs Agent ──→ QA Engineer (acceptance criteria)

Phase 3: Build (parallel)
  Backend Dev ──→ Frontend Dev (API confirmed live)
  Backend Dev ──→ QA Engineer (API ready for testing)
  Frontend Dev ──→ QA Engineer (UI ready for testing)

Phase 4: Integration & QA
  Backend Dev ──┐
  Frontend Dev ─┤──→ Integration Tester (wire & ship)
  QA Engineer ──┘
```

---

## Expected Deliverables

| Deliverable | Owner |
|-------------|-------|
| `docs/BRD.md` | BRD Manager |
| `docs/PRD.md` | Product Manager |
| `docs/SYSTEM-DESIGN.md` | System Architect |
| `docs/TRACEABILITY-MATRIX.md` | Docs Agent |
| `docs/EXECUTIVE-SUMMARY.md` | Docs Agent |
| `src/api/` (working REST API) | Backend Dev |
| `src/client/` (React app) | Frontend Dev |
| `tests/` + `tests/report.md` | QA Engineer |
| `docs/build-summary.md` + running app | Integration Tester |

---

## How to Use

1. Copy the contents of [`prompt.md`](./prompt.md) into Claude Code with agent teams enabled.
2. All agents use the Opus model.
3. The agents will self-organize through the four phases above.
4. When complete, run `npm run dev` to view the app at `http://localhost:3000`.

## How to Customize

- **Swap the product concept.** Replace "TaskFlow" with your own app idea. Keep the 8-agent structure and update the Product Overview section.
- **Adjust the tech stack.** The prompt specifies React + Express + SQLite. Change these in the Constraints section and the System Architect's tasks.
- **Scale agents up or down.** Merge the BRD Manager and Product Manager into one agent for a smaller team, or split Frontend Dev into separate UI and state management agents for a larger team.
- **Change model assignments.** Switch less critical agents (Docs Agent, Integration Tester) to Sonnet to reduce cost while keeping Opus for architecture and development roles.
