# Multi-Agent Full-Stack Build: TaskFlow — Project Management Dashboard

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

---
---

# Prompt 2: Multi-Agent Deep Research & Go-To-Market Strategy — "LaunchPad AI"

## 🎯 Goal

Conduct a comprehensive product discovery, market research, technical feasibility analysis, and go-to-market strategy for a new SaaS product called **LaunchPad AI** — an AI-powered developer onboarding platform that automatically generates interactive codebase walkthroughs, architecture diagrams, and personalized learning paths for new engineers joining a team.

The end result should be a complete set of research documents, a validated product strategy, a go-to-market playbook, and a final executive brief — all cross-reviewed, challenged, and refined through multi-agent collaboration.

Create a team called **"launchpad-research"** with 6 teammates. Use **Opus** for each teammate.

---

## 🧠 Why This Matters

> Most research done by a single agent is shallow — it confirms its own assumptions and never stress-tests them. This team structure forces **adversarial review**, **cross-domain synthesis**, and **iterative refinement** — producing research that's significantly more robust than any single pass could achieve.

---

## Agent Roster

---

### 🔍 Agent 1: Market Researcher (`market-researcher`)

**Persona:** You are a senior market analyst with 10 years of experience in B2B SaaS. You think in TAM/SAM/SOM frameworks, obsess over buyer personas, and always back claims with data.

**Phase:** Starts immediately (no dependencies).

**Tasks:**

1. **Market Landscape Analysis** — Research the developer tools and onboarding space thoroughly:
   - Identify the Total Addressable Market (TAM) for developer productivity tools
   - Map the competitive landscape: direct competitors (Swimm, Tango, Loom), adjacent tools (Notion, Confluence, GitHub Copilot), and emerging threats
   - For each competitor, document: pricing model, target customer, key features, funding stage, estimated revenue/users, strengths, weaknesses
   - Identify 3-5 market trends shaping this space (e.g., AI-native documentation, shift-left onboarding, remote-first engineering teams)

2. **Buyer Persona Development** — Create 3 detailed buyer personas:
   - **Primary:** Engineering Manager at a 50-200 person company (the budget holder)
   - **Secondary:** VP of Engineering at a 200-1000 person company (the executive sponsor)
   - **End User:** Senior Developer who actually uses the tool daily
   - For each persona: demographics, goals, frustrations, buying triggers, objections, information sources, decision-making process

3. **Market Signals & Validation** — Gather evidence of demand:
   - Search for relevant discussions on HackerNews, Reddit r/ExperiencedDevs, Twitter/X
   - Identify pain points developers express about onboarding
   - Look for "pull signals" — are people already building hacky solutions to this problem?

4. **Write findings** to `research/MARKET-RESEARCH.md` with data tables, competitor matrix, and persona cards

5. **When done:** Message **Product Strategist** with top 3 market opportunities and persona summaries. Message **Devil's Advocate** with your full findings for challenge.

**Deliverable:** `research/MARKET-RESEARCH.md`

---

### 🏗️ Agent 2: Technical Feasibility Analyst (`tech-analyst`)

**Persona:** You are a principal engineer who has built and scaled 3 developer tools. You think about what's technically possible today vs. what's vapor. You're allergic to handwaving.

**Phase:** Starts immediately (no dependencies).

**Tasks:**

1. **Technical Landscape Audit** — Assess the technology required to build LaunchPad AI:
   - **Code Analysis:** What tools exist for static analysis, AST parsing, dependency graphing? (tree-sitter, LSP, Sourcegraph)
   - **AI/LLM Integration:** What's realistic for AI-generated walkthroughs? Token limits, hallucination risks, cost per analysis
   - **Diagram Generation:** Can architecture diagrams be auto-generated reliably? (Mermaid, D2, Graphviz from code analysis)
   - **Interactive Walkthroughs:** What frontend tech enables step-by-step code walkthroughs? (CodeMirror, Monaco Editor, custom overlays)

2. **Build vs. Buy Analysis** — For each core capability, assess:
   - Can we use an existing open-source tool or API?
   - What would we need to build from scratch?
   - What's the estimated complexity? (Low / Medium / High / Research-required)
   - What are the technical risks?

3. **Architecture Sketch** — Propose a high-level technical architecture:
   - System components and their responsibilities
   - Data flow: from git repo → analysis → generated content → user-facing walkthrough
   - Infrastructure requirements (can it run locally? cloud-only? hybrid?)
   - Estimated cost per user per month for AI/compute

4. **Feasibility Verdict** — For each proposed feature, rate:
   - ✅ **Feasible now** — proven tech, low risk
   - ⚠️ **Feasible with effort** — requires significant engineering, some unknowns
   - ❌ **Not feasible yet** — research-stage, would need breakthroughs
   - 🔬 **Needs spike** — could go either way, needs a 1-week prototype to validate

5. **Write findings** to `research/TECHNICAL-FEASIBILITY.md`

6. **When done:** Message **Product Strategist** with the feasibility verdicts and architecture sketch. Message **Devil's Advocate** with your full findings for challenge.

**Deliverable:** `research/TECHNICAL-FEASIBILITY.md`

---

### 🎯 Agent 3: Product Strategist (`product-strategist`)

**Persona:** You are a product strategist who has launched 5 B2B SaaS products from 0 → 1. You think in terms of wedge strategies, ICP definition, and "what's the smallest thing we can ship that someone will pay for."

**Phase:** Waits for messages from **Market Researcher** (market opportunities + personas) and **Tech Analyst** (feasibility verdicts).

**Tasks:**

1. **Opportunity Synthesis** — Combine market research and technical feasibility to identify:
   - The single best **wedge opportunity** — the narrow, high-value use case to launch with
   - Why this wedge beats alternatives (competitor gaps × technical feasibility × buyer urgency)
   - The "expand from" strategy — how the wedge grows into a platform over 18 months

2. **Product Positioning** — Define:
   - **One-liner:** A single sentence that explains what LaunchPad AI does (under 15 words)
   - **Positioning statement:** For [target user] who [pain point], LaunchPad AI is a [category] that [key benefit]. Unlike [alternative], we [differentiator].
   - **3 Pillars:** The three core value propositions, each with a supporting proof point
   - **Anti-positioning:** What LaunchPad AI is NOT (to avoid scope creep)

3. **Pricing Strategy** — Propose a pricing model:
   - Free tier (what's included, what's the hook)
   - Pro tier (price point, what unlocks)
   - Enterprise tier (what justifies the call-us pricing)
   - Benchmark against competitor pricing
   - Estimate target ACV (Annual Contract Value) for each segment

4. **MVP Feature Scoping** — Define the Minimum Viable Product:
   - List every feature as: Must-Have (launch blocker) / Should-Have (month 2) / Nice-to-Have (quarter 2)
   - For each Must-Have feature, write a user story and acceptance criteria
   - Estimate launch timeline based on feasibility verdicts from Tech Analyst

5. **Write findings** to `research/PRODUCT-STRATEGY.md`

6. **When done:** Message **GTM Planner** with positioning, pricing, and ICP definition. Message **Devil's Advocate** with your full strategy for challenge.

**Deliverable:** `research/PRODUCT-STRATEGY.md`

---

### 📣 Agent 4: Go-To-Market Planner (`gtm-planner`)

**Persona:** You are a growth marketer who has driven 0-to-1 launches for 4 dev tools. You know that developers hate being marketed to — so you think in terms of community, content, and earned distribution.

**Phase:** Waits for message from **Product Strategist** (positioning, pricing, ICP).

**Tasks:**

1. **Launch Strategy** — Design a 90-day launch plan across 3 phases:
   - **Pre-launch (Day -30 to 0):** Audience building, waitlist, early access program
   - **Launch Week (Day 0-7):** Product Hunt launch, HackerNews post, Twitter/X campaign, demo video
   - **Post-launch (Day 7-90):** Content engine, community building, first 100 paying customers

2. **Channel Strategy** — For each channel, define the play:
   | Channel | Strategy | Content Type | Frequency | KPI |
   |---------|----------|-------------|-----------|-----|
   | Twitter/X | Build-in-public thread series | Threads, demos, hot takes | 3x/week | Followers, engagement |
   | HackerNews | Show HN launch + follow-up posts | Technical deep dives | 2x/month | Upvotes, signups |
   | Dev.to / Hashnode | SEO + thought leadership | Long-form tutorials | 1x/week | Organic traffic |
   | YouTube | Product demos + "how we built it" | Screen recordings | 2x/month | Views, subscribers |
   | GitHub | Open-source components, samples | Code + docs | Ongoing | Stars, contributors |
   | Cold outreach | Personalized DMs to ICP matches | DMs + demos | 10/day | Demo bookings |

3. **Content Calendar** — Create a 30-day content calendar with:
   - Specific post titles / topics for each channel
   - Who creates it, when it publishes, expected outcome
   - Tie each piece to a stage of the buyer journey (Awareness → Interest → Decision)

4. **Metrics Framework** — Define success metrics:
   - North Star Metric and why
   - Leading indicators (signup rate, activation rate, time-to-value)
   - Lagging indicators (MRR, churn, NPS)
   - Week 1, Month 1, Month 3 targets

5. **Write findings** to `research/GTM-PLAYBOOK.md`

6. **When done:** Message **Devil's Advocate** with the full GTM plan. Message **Report Synthesizer** confirming your section is ready.

**Deliverable:** `research/GTM-PLAYBOOK.md`

---

### 😈 Agent 5: Devil's Advocate (`devils-advocate`)

**Persona:** You are a brutally honest senior advisor who has seen 200 startups fail. Your job is NOT to be encouraging — it's to find the holes before the market does. You challenge every assumption, flag every risk, and demand evidence for every claim. You are constructive but relentless.

**Phase:** Waits for findings from **Market Researcher**, **Tech Analyst**, **Product Strategist**, and **GTM Planner** (receives messages as each completes).

**Tasks:**

1. **Challenge Market Research:**
   - Is the TAM calculation realistic or inflated? What assumptions does it rest on?
   - Are the competitors listed actually competitors, or is the market being defined too broadly?
   - Are the buyer personas based on real signals or wishful thinking?
   - What market risk is NOT mentioned that should be?

2. **Challenge Technical Feasibility:**
   - Which "Feasible now" ratings are actually optimistic?
   - What's the real cost per user when you factor in LLM API calls at scale?
   - Is the proposed architecture overengineered for an MVP? Or underengineered for the promised features?
   - What happens when the AI generates a wrong walkthrough? What's the failure mode?

3. **Challenge Product Strategy:**
   - Is the wedge narrow enough to win, or too narrow to matter?
   - Does the pricing make sense given competitor benchmarks and buyer willingness to pay?
   - Are the "Must-Have" features truly must-have, or is the MVP still too big?
   - What's the biggest reason this product would fail in the first 6 months?

4. **Challenge GTM Plan:**
   - Is the 90-day plan realistic for a team of this size?
   - Which channels have the highest risk of zero ROI?
   - Is the content calendar sustainable, or will it burn out the team?
   - What's the customer acquisition cost estimate? Does it work with the pricing?

5. **Write critique** to `research/DEVILS-ADVOCATE-REVIEW.md` with:
   - A "Risk Heat Map" rating each area: 🟢 Low Risk / 🟡 Medium Risk / 🔴 High Risk
   - Top 5 "Killer Questions" the team must answer before proceeding
   - Specific recommendations to de-risk each major concern
   - A final **Go / No-Go / Conditional-Go** verdict with reasoning

6. **When done:** Message **ALL other agents** with your top 3 critiques so they can address them in their final versions. Message **Report Synthesizer** confirming your review is ready.

**Deliverable:** `research/DEVILS-ADVOCATE-REVIEW.md`

---

### 📋 Agent 6: Report Synthesizer (`report-synthesizer`)

**Persona:** You are a McKinsey-trained consultant who turns messy research into crisp, decision-ready documents. You never add fluff. Every sentence earns its place. You think in executive summaries, not essays.

**Phase:** Waits for ALL other agents to confirm their sections are complete, AND waits for Devil's Advocate critiques to be addressed.

**Tasks:**

1. **Read all 5 research documents** in `research/` and the Devil's Advocate review

2. **Synthesize into a Master Report** at `research/LAUNCHPAD-AI-STRATEGY.md` with these sections:
   - **Executive Summary** (1 page max) — the entire strategy in 5 bullet points a CEO can read in 2 minutes
   - **Market Opportunity** — synthesized from Market Researcher, refined by Devil's Advocate challenges
   - **Product Vision & MVP** — synthesized from Product Strategist, with feasibility constraints from Tech Analyst
   - **Technical Architecture** — simplified from Tech Analyst for a mixed audience
   - **Go-To-Market Plan** — condensed from GTM Planner with timeline visualization
   - **Risk Register** — consolidated from Devil's Advocate, with mitigation status (addressed / open / accepted)
   - **Decision Log** — key decisions made across all agents with rationale
   - **Open Questions** — unresolved items that need real-world validation (user interviews, prototypes, etc.)
   - **Appendix** — links to all detailed research documents

3. **Create a 1-page Decision Brief** at `research/DECISION-BRIEF.md`:
   - Framed as: "Should we build LaunchPad AI?"
   - Three options: (A) Full build, (B) Reduced scope MVP, (C) Don't build — with pros/cons for each
   - Recommended option with clear reasoning
   - Next 5 concrete actions if the answer is "yes"

4. **Quality Checks:**
   - Every claim has a source (which agent produced it, which document)
   - No contradictions between sections
   - Terminology is consistent throughout
   - Risk items from Devil's Advocate are all addressed (even if the answer is "we accept this risk")

**Deliverables:** `research/LAUNCHPAD-AI-STRATEGY.md`, `research/DECISION-BRIEF.md`

---

## 🔄 Agent Communication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: PARALLEL RESEARCH                   │
│                                                                 │
│   Market Researcher ─────┐                                      │
│   (starts immediately)   ├──→ findings ──→ Product Strategist   │
│                          └──→ findings ──→ Devil's Advocate     │
│                                                                 │
│   Tech Analyst ──────────┐                                      │
│   (starts immediately)   ├──→ verdicts ──→ Product Strategist   │
│                          └──→ findings ──→ Devil's Advocate     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 2: STRATEGY SYNTHESIS                  │
│                                                                 │
│   Product Strategist ────┐                                      │
│   (after Phase 1)        ├──→ strategy ──→ GTM Planner          │
│                          └──→ strategy ──→ Devil's Advocate     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 3: GTM PLANNING                        │
│                                                                 │
│   GTM Planner ───────────┐                                      │
│   (after Phase 2)        ├──→ playbook ──→ Devil's Advocate     │
│                          └──→ ready ─────→ Report Synthesizer   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 4: ADVERSARIAL REVIEW                  │
│                                                                 │
│   Devil's Advocate ──────┐                                      │
│   (after all findings)   ├──→ critiques ──→ ALL other agents    │
│                          └──→ ready ──────→ Report Synthesizer  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 5: FINAL SYNTHESIS                     │
│                                                                 │
│   Report Synthesizer ────→ LAUNCHPAD-AI-STRATEGY.md             │
│   (after all complete)   → DECISION-BRIEF.md                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Final Deliverables

| # | Document | Owner | Purpose |
|---|----------|-------|---------|
| 1 | `research/MARKET-RESEARCH.md` | Market Researcher | Competitive landscape, personas, market signals |
| 2 | `research/TECHNICAL-FEASIBILITY.md` | Tech Analyst | Architecture, build-vs-buy, feasibility verdicts |
| 3 | `research/PRODUCT-STRATEGY.md` | Product Strategist | Positioning, pricing, MVP scope, wedge strategy |
| 4 | `research/GTM-PLAYBOOK.md` | GTM Planner | 90-day launch plan, channels, content calendar |
| 5 | `research/DEVILS-ADVOCATE-REVIEW.md` | Devil's Advocate | Risk heat map, killer questions, go/no-go verdict |
| 6 | `research/LAUNCHPAD-AI-STRATEGY.md` | Report Synthesizer | Master strategy document (the "one doc to read") |
| 7 | `research/DECISION-BRIEF.md` | Report Synthesizer | 1-page decision brief for leadership |

---

## ⚙️ Constraints & Rules

- **All agents use Opus model**
- **No agent writes another agent's document** — each owns their deliverable exclusively
- **Every claim must be substantiated** — no "the market is huge" without numbers, no "this is technically easy" without specifics
- **Devil's Advocate MUST challenge, not validate** — if the review is all green lights, it's not doing its job
- **Agents must respond to critiques** — when Devil's Advocate sends challenges, other agents should update their documents to address them (add a "Response to Review" section at the bottom)
- **Report Synthesizer waits for ALL agents** — do not begin the master report until every agent has confirmed completion AND critique responses are done
- **No generic filler** — every section in every document should contain specific, actionable information. "We should do more research" is not an acceptable conclusion without specifying exactly what research and why
