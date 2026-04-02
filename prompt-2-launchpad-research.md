# Prompt 2: Multi-Agent Deep Research & Go-To-Market Strategy — "LaunchPad AI"

## Goal

Conduct a comprehensive product discovery, market research, technical feasibility analysis, and go-to-market strategy for a new SaaS product called **LaunchPad AI** — an AI-powered developer onboarding platform that automatically generates interactive codebase walkthroughs, architecture diagrams, and personalized learning paths for new engineers joining a team.

The end result should be a complete set of research documents, a validated product strategy, a go-to-market playbook, and a final executive brief — all cross-reviewed, challenged, and refined through multi-agent collaboration.

Create a team called **"launchpad-research"** with 6 teammates. Use **Opus** for each teammate.

---

## Why This Matters

> Most research done by a single agent is shallow — it confirms its own assumptions and never stress-tests them. This team structure forces **adversarial review**, **cross-domain synthesis**, and **iterative refinement** — producing research that's significantly more robust than any single pass could achieve.

---

## Agent Roster

---

### Agent 1: Market Researcher (`market-researcher`)

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

### Agent 2: Technical Feasibility Analyst (`tech-analyst`)

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
   - **Feasible now** — proven tech, low risk
   - **Feasible with effort** — requires significant engineering, some unknowns
   - **Not feasible yet** — research-stage, would need breakthroughs
   - **Needs spike** — could go either way, needs a 1-week prototype to validate

5. **Write findings** to `research/TECHNICAL-FEASIBILITY.md`

6. **When done:** Message **Product Strategist** with the feasibility verdicts and architecture sketch. Message **Devil's Advocate** with your full findings for challenge.

**Deliverable:** `research/TECHNICAL-FEASIBILITY.md`

---

### Agent 3: Product Strategist (`product-strategist`)

**Persona:** You are a product strategist who has launched 5 B2B SaaS products from 0 to 1. You think in terms of wedge strategies, ICP definition, and "what's the smallest thing we can ship that someone will pay for."

**Phase:** Waits for messages from **Market Researcher** (market opportunities + personas) and **Tech Analyst** (feasibility verdicts).

**Tasks:**

1. **Opportunity Synthesis** — Combine market research and technical feasibility to identify:
   - The single best **wedge opportunity** — the narrow, high-value use case to launch with
   - Why this wedge beats alternatives (competitor gaps x technical feasibility x buyer urgency)
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

### Agent 4: Go-To-Market Planner (`gtm-planner`)

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

### Agent 5: Devil's Advocate (`devils-advocate`)

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
   - A "Risk Heat Map" rating each area: Low Risk / Medium Risk / High Risk
   - Top 5 "Killer Questions" the team must answer before proceeding
   - Specific recommendations to de-risk each major concern
   - A final **Go / No-Go / Conditional-Go** verdict with reasoning

6. **When done:** Message **ALL other agents** with your top 3 critiques so they can address them in their final versions. Message **Report Synthesizer** confirming your review is ready.

**Deliverable:** `research/DEVILS-ADVOCATE-REVIEW.md`

---

### Agent 6: Report Synthesizer (`report-synthesizer`)

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

## Agent Communication Flow

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

## Final Deliverables

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

## Constraints & Rules

- **All agents use Opus model**
- **No agent writes another agent's document** — each owns their deliverable exclusively
- **Every claim must be substantiated** — no "the market is huge" without numbers, no "this is technically easy" without specifics
- **Devil's Advocate MUST challenge, not validate** — if the review is all green lights, it's not doing its job
- **Agents must respond to critiques** — when Devil's Advocate sends challenges, other agents should update their documents to address them (add a "Response to Review" section at the bottom)
- **Report Synthesizer waits for ALL agents** — do not begin the master report until every agent has confirmed completion AND critique responses are done
- **No generic filler** — every section in every document should contain specific, actionable information. "We should do more research" is not an acceptable conclusion without specifying exactly what research and why
