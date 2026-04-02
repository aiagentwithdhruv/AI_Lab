# Architecture: How Agent Teams Work

> A conceptual guide to multi-agent coordination in Claude Code. For implementation details, see the [reference docs](#deep-dive-references) (01-06).

---

## Core Concepts

### Agents

An agent is a single Claude Code session with its own context window, tools, and permissions. Agents can read files, write code, run commands, and communicate with other agents. Each agent operates independently — it does not share memory or conversation history with other agents unless it explicitly sends a message.

### Teams

A team is a group of agents working together on a shared goal. One agent is the **lead** (the session you interact with directly), and the others are **teammates** (spawned as child sessions). The lead coordinates work, and teammates execute tasks.

### Roles and Personas

Each agent in a team prompt is given a **role** (what it does) and often a **persona** (how it thinks). For example, a "Devil's Advocate" role with the persona of "a brutally honest advisor who has seen 200 startups fail." Roles define responsibilities; personas shape the quality and style of output.

### Messages and Mailbox

Agents communicate through a **mailbox** system. Any agent can send a message to any other agent by name. Messages are delivered automatically — the lead does not need to relay them. This enables direct coordination between teammates without bottlenecking through a central controller.

### Handoffs

A handoff occurs when one agent finishes a phase of work and sends its output to the next agent in the chain. Handoffs are defined in the prompt's communication flow: "When done, message Agent B with your findings." This creates a directed graph of work.

### Dependencies

A dependency means one agent cannot start (or cannot start a specific task) until another agent completes its work and sends a message. Dependencies create the execution order of the team. Agents without dependencies start immediately in parallel.

### Task List

Every team has a shared **task list** stored on disk. Tasks have states (`pending`, `in_progress`, `completed`) and can depend on other tasks. Teammates claim tasks from this list and mark them complete when done.

---

## Communication Patterns

Agent teams use four primary communication patterns. Most real prompts combine several.

### 1. Parallel Execution

Multiple agents start at the same time with no dependencies between them. Each works independently on a different piece of the problem.

```
                 ┌──── Agent A ────┐
                 │                 │
User Prompt ─────┼──── Agent B ────┼──── Lead synthesizes
                 │                 │
                 └──── Agent C ────┘
```

**When to use:** Research tasks, code review from multiple angles, independent module implementation.

**Example from this repo:** In LaunchPad Research, `market-researcher` and `tech-analyst` both start immediately and work in parallel.

### 2. Sequential Chain

Agents execute one after another, where each agent's output feeds the next agent's input.

```
Agent A ──→ Agent B ──→ Agent C ──→ Agent D
  (research)   (strategy)  (plan)    (review)
```

**When to use:** When each phase genuinely depends on the previous phase's output. Strategy must follow research; implementation must follow design.

**Example from this repo:** In TaskFlow Build, `system-architect` waits for both `product-manager` and `brd-manager` before starting its design.

### 3. Fan-Out / Fan-In

One agent distributes work to multiple agents (fan-out), then a single agent collects and synthesizes all results (fan-in).

```
                 ┌──── Agent B ────┐
                 │                 │
Agent A (fan-out)┼──── Agent C ────┼──── Agent E (fan-in)
                 │                 │
                 └──── Agent D ────┘
```

**When to use:** When a problem naturally decomposes into independent sub-problems that need to be recombined. Research synthesis, parallel builds with integration, audit with summary.

**Example from this repo:** In LaunchPad Research, multiple research agents fan out, then `report-synthesizer` fans in to produce the master strategy document.

### 4. Adversarial Review

One or more agents are explicitly tasked with challenging, critiquing, and stress-testing the work of other agents. The reviewers send critiques back, and the original agents revise their work.

```
Agent A ──→ findings ──→ Devil's Advocate ──→ critiques ──→ Agent A (revises)
Agent B ──→ findings ──→ Devil's Advocate ──→ critiques ──→ Agent B (revises)
```

**When to use:** Research validation, security audits, competing hypotheses, any work where confirmation bias is a risk.

**Example from this repo:** In LaunchPad Research, `devils-advocate` receives all findings and challenges every agent. In Fortress Security, a dedicated `red-team-lead` attacks the system while a `blue-team-lead` defends it.

### Combined Pattern

Most real prompts layer these patterns. Here is the LaunchPad Research flow, which uses all four:

```
PARALLEL ──────────────────────────────────────────────────
  market-researcher ──┐
                      ├──→ product-strategist ──→ gtm-planner
  tech-analyst ───────┘           │                    │
                                  │                    │
SEQUENTIAL ───────────┘           │                    │
                                  │                    │
ADVERSARIAL ──────────────────────┘                    │
  devils-advocate ←── findings from ALL agents         │
  devils-advocate ──→ critiques TO all agents           │
                                                       │
FAN-IN ────────────────────────────────────────────────┘
  report-synthesizer ←── all documents + critiques
  report-synthesizer ──→ master report + decision brief
```

---

## Designing Your Own Agent Team

Use this framework to create a new multi-agent prompt.

### Step 1: Define the goal

Write one sentence describing the end result. What deliverables should exist when the team finishes?

### Step 2: Decompose into roles

Ask: "If I hired humans for this, what specialists would I need?" Each specialist becomes an agent. Aim for 3-6 agents. Go above 6 only when the work genuinely requires it.

### Step 3: Map dependencies

For each agent, ask: "What information does this agent need before it can start?" Draw arrows from producers to consumers. This gives you the communication flow.

### Step 4: Assign deliverables

Every agent should own at least one concrete output file. No two agents should write to the same file.

### Step 5: Define handoffs

For each arrow in your dependency graph, write the handoff instruction: "When done, message [Agent Name] with [what to include]."

### Step 6: Add an adversarial reviewer (optional but recommended)

If the work involves research, strategy, or any subjective judgment, add an agent whose sole job is to challenge the others. This dramatically improves output quality.

### Step 7: Add a synthesizer (optional)

If your team produces multiple documents, consider a final agent that reads everything and produces a unified summary.

### Template

```markdown
# Prompt N: [Team Name]

## Goal
[One paragraph describing the end result]

## Agent Team (N Agents)

### Agent 1: [Role] (`agent-id`)
**Persona:** [Who they are and how they think]
**Phase:** [Starts immediately / Waits for X]
**Tasks:**
1. [Task with specific deliverable]
2. [Task with specific deliverable]
3. **When done:** Message [Agent Name] with [what]

**Deliverable:** `path/to/output.md`

### Agent 2: ...

## Agent Communication Flow
[ASCII diagram showing message flow]

## Final Deliverables
[Table listing all outputs]

## Constraints
[Rules all agents must follow]
```

---

## Single Agent vs. Sub-Agents vs. Agent Teams

| Dimension | Single Agent | Sub-Agents | Agent Teams |
|-----------|-------------|------------|-------------|
| **Sessions** | 1 | 1 parent + N children | 1 lead + N teammates |
| **Communication** | N/A | Children report results back to parent | Teammates message each other directly |
| **Coordination** | N/A | Parent manages everything | Shared task list, self-coordination |
| **Context sharing** | N/A | Results summarized into parent context | Each agent fully independent |
| **Best for** | Simple tasks, sequential work | Focused tasks where only the result matters | Complex work requiring discussion and iteration |
| **Token cost** | Lowest | Medium (results compressed) | Highest (each teammate is a full session) |
| **Parallelism** | None | Yes, but no inter-child communication | Yes, with inter-agent messaging |
| **Nesting** | N/A | Cannot spawn other sub-agents | Cannot spawn nested teams |

**Decision rule:**

- Can one agent do it in a single pass? Use a **single agent**.
- Do you need parallel workers that just report back results? Use **sub-agents**.
- Do workers need to share findings, challenge each other, or coordinate independently? Use **agent teams**.

---

## Message Flow Diagrams

### TaskFlow Build (8 agents, full-stack app)

```
BRD Manager ──→ Product Manager (constraints confirmed)
BRD Manager ──→ System Architect (constraints)
Product Manager ──→ System Architect (P0 features)
Product Manager ──→ Docs Agent (feature list)
BRD Manager ──→ Docs Agent (BRD complete)

System Architect ──→ Backend Dev (API contract + DB schema)
System Architect ──→ Frontend Dev (API contract + components)
System Architect ──→ QA Engineer (API contract)

Docs Agent ──→ QA Engineer (acceptance criteria)
Backend Dev ──→ Frontend Dev (API confirmed live)
Backend Dev ──→ QA Engineer (API ready)
Frontend Dev ──→ QA Engineer (UI ready)

Backend Dev ──┐
Frontend Dev ─┼──→ DevOps Agent (wire + ship)
QA Engineer ──┘
```

### LaunchPad Research (6 agents, market research)

```
market-researcher ──→ product-strategist (opportunities + personas)
market-researcher ──→ devils-advocate (findings)
tech-analyst ──→ product-strategist (feasibility verdicts)
tech-analyst ──→ devils-advocate (findings)

product-strategist ──→ gtm-planner (positioning + pricing + ICP)
product-strategist ──→ devils-advocate (strategy)

gtm-planner ──→ devils-advocate (playbook)
gtm-planner ──→ report-synthesizer (ready)

devils-advocate ──→ ALL agents (critiques)
devils-advocate ──→ report-synthesizer (ready)

report-synthesizer ──→ master report + decision brief
```

### Fortress Security (10 agents, security audit)

```
threat-intel ──→ security-architect, pen-tester, red-team-lead
code-auditor ──→ security-architect, pen-tester
compliance-officer ──→ security-architect

security-architect ──→ hardening-engineer
pen-tester ──→ red-team-lead
red-team-lead ←──→ blue-team-lead (adversarial)

ALL agents ──→ ciso-briefer (final synthesis)
```

---

## Deep-Dive References

These documents provide implementation-level detail for everything described above:

| Document | What it covers |
|----------|---------------|
| [01-OVERVIEW.md](01-OVERVIEW.md) | What agent teams are, when to use them, enabling teams, first team launch |
| [02-AGENT-TEAMS-ARCHITECTURE.md](02-AGENT-TEAMS-ARCHITECTURE.md) | Components (lead, teammates, task list, mailbox), lifecycle, permissions, display modes, known limitations |
| [03-CUSTOM-AGENT-DEFINITIONS.md](03-CUSTOM-AGENT-DEFINITIONS.md) | Agent definition file format, YAML frontmatter fields, tool configuration, model selection, MCP servers, memory |
| [04-HOOKS-AND-QUALITY-GATES.md](04-HOOKS-AND-QUALITY-GATES.md) | TeammateIdle, TaskCompleted, SubagentStart/Stop hooks, validation scripts, exit code behavior |
| [05-PATTERNS-AND-BEST-PRACTICES.md](05-PATTERNS-AND-BEST-PRACTICES.md) | Team sizing, task granularity, file conflict avoidance, prompt engineering, communication patterns |
| [06-PROMPT-TEMPLATES-AND-EXAMPLES.md](06-PROMPT-TEMPLATES-AND-EXAMPLES.md) | Ready-to-use team prompts, agent definition templates, validation script templates, settings.json examples |
