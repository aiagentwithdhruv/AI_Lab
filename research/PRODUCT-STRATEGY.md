# LaunchPad AI -- Product Strategy

**Date:** 2026-03-24
**Author:** Product Strategy Lead
**Status:** V1 -- Ready for founder review
**Inputs:** Market Research Report (2026-03-24), Technical Feasibility Analysis (2026-03-24)

---

## 1. Opportunity Synthesis

### 1.1 The Wedge: AI-Generated Codebase Walkthroughs for Mid-Market Engineering Teams

Of the five capabilities LaunchPad AI could lead with -- codebase summaries, architecture diagrams, interactive walkthroughs, personalized learning paths, onboarding analytics -- **auto-generated interactive codebase walkthroughs** is the wedge.

Here is why this specific capability wins on all three axes:

**Competitor gap:** No commercial product auto-generates interactive, step-by-step codebase walkthroughs from static analysis + LLM narration. Swimm ($8.8M ARR after 5+ years) requires manual doc creation with AI assistance. CodeBoarding is OSS, Python-only, and generates diagrams, not guided walkthroughs. Loom produces videos that go stale on day two. Confluence/Notion require manual maintenance that 60% of teams admit they do not do. The "high code understanding + active/interactive learning" quadrant on the competitive positioning map is empty.

**Technical feasibility:** The Tech Analyst rates the core pipeline -- tree-sitter AST parsing, SCIP cross-file references, LLM narration with RAG, CodeMirror 6 walkthrough player -- as "feasible with effort" on a 14-16 week timeline with 2 senior engineers. The hardest component (personalized learning paths) is explicitly excluded from this wedge. The kill risk (hallucination) has a concrete mitigation path: ground every generated reference in verified AST/SCIP data, post-validate all symbol names and file paths, and label output as editable drafts.

**Buyer urgency:** Engineering managers at 50-200 person companies are hiring 5+ engineers per quarter and losing $480K-$750K/year in direct onboarding costs, plus $1.3M-$2.3M in lost productivity. Their current solution is ad-hoc: a senior engineer spends 2 weeks per new hire doing manual walkthroughs, Loom recordings, and answering Slack DMs. 78% of new developers rate codebase navigation as a 4-5/5 difficulty. The buying trigger is immediate and recurring -- every new hire surfaces the pain again.

**Why not diagrams as the wedge?** Architecture diagrams are compelling but the Tech Analyst flags 60-70% accuracy on well-structured codebases and 30-40% on complex ones. Leading with a 60% accurate product erodes the trust that is our lifeblood. Diagrams are a powerful supporting feature inside walkthroughs, not a standalone wedge.

**Why not learning paths as the wedge?** The Tech Analyst rates personalized learning paths as "needs spike" -- the concept dependency graph and adaptive sequencing are unsolved. Over-investing in personalization before nailing walkthrough quality is explicitly called out as a kill risk.

**Why not analytics as the wedge?** Analytics (time-to-first-PR, knowledge coverage) are a manager feature, not a developer feature. The senior developer (Priya persona) has veto power on adoption. We must win Priya first with a tool that saves her time, then sell the manager dashboard to Sarah.

### 1.2 Why This Wedge Beats Alternatives

| Evaluation Axis | Auto-Generated Walkthroughs | Architecture Diagrams | Learning Paths | Analytics Dashboard |
|----------------|---------------------------|----------------------|---------------|-------------------|
| Competitive gap | No commercial competitor | CodeBoarding (OSS) partially covers | No competitor, but also no validated demand | Jellyfish, LinearB already exist |
| Technical readiness | Feasible with effort (14-16 weeks) | Feasible but 60-70% accuracy ceiling | Needs spike (unproven) | Feasible now (but low differentiation) |
| Buyer urgency | "My senior engineers spend 20-30% of time onboarding" | "We need architecture docs" (lower urgency) | "Nice to have" for most buyers | Only matters after adoption |
| End-user value | Saves senior devs 2+ weeks/quarter | Useful but one-time consumption | Useful but needs content to sequence | Zero value to the developer |
| PLG compatibility | Connect repo, get walkthrough in minutes | Connect repo, get diagram | Requires configuration | Requires team data |

### 1.3 The "Expand From" Strategy (18-Month Platform Roadmap)

The wedge (auto-generated walkthroughs) earns the right to expand into a full onboarding platform:

**Months 1-4 (Launch + Validate):**
- Ship the wedge: connect a GitHub/GitLab repo, get an interactive walkthrough in under 5 minutes
- Target: TypeScript/Python codebases under 200K LOC at 50-200 person companies
- Success metric: 100 teams activate free tier, 15 convert to paid within 90 days

**Months 5-8 (Deepen the Wedge):**
- Add architecture diagrams as a layer inside walkthroughs (not standalone)
- Add incremental updates: walkthroughs auto-update when code changes (CI/CD integration)
- Add walkthrough editing: teams can refine AI-generated content (builds quality flywheel)
- Launch Team tier billing
- Success metric: 50 paying teams, net retention >110%, average 4+ walkthroughs per repo

**Months 9-12 (Expand to Platform):**
- Add onboarding analytics dashboard (time-to-first-PR, walkthrough completion, knowledge coverage)
- Add simple learning paths (topological sort of module walkthroughs, not full adaptive learning)
- Add Go and Java language support
- Unlock VP of Engineering buyer with analytics + multi-team views
- Launch Enterprise tier with SSO, SCIM, audit logging
- Success metric: 5 enterprise contracts ($50K+ ACV), $500K ARR

**Months 13-18 (Category Leadership):**
- Advanced personalized learning paths (if spike validates the approach)
- Multi-repo and monorepo support
- Backstage/IDP integration (plugin model)
- Self-hosted/VPC deployment for security-sensitive enterprises
- SOC 2 Type II certification
- Success metric: $2M ARR, 15 enterprise contracts, category recognition (Gartner Cool Vendor or equivalent)

---

## 2. Product Positioning

### 2.1 One-Liner (14 words)

**"AI-generated codebase walkthroughs that get new engineers productive in days, not months."**

### 2.2 Positioning Statement

For **engineering managers at growing mid-market companies** who **lose months of productivity every time they onboard a new engineer**, LaunchPad AI is an **AI-powered developer onboarding platform** that **auto-generates interactive codebase walkthroughs from your actual code -- and keeps them current as the code evolves**. Unlike **Confluence wikis that go stale in weeks or Loom videos that are outdated on day two**, we **generate walkthroughs directly from static code analysis, so every walkthrough is grounded in real, verified code structure -- not tribal knowledge that walks out the door when someone leaves**.

### 2.3 Three Pillars

**Pillar 1: Zero-Effort Generation**
Connect your repo. Get an interactive walkthrough in under 5 minutes. No manual authoring, no doc writing, no maintenance.
- *Proof point:* Tree-sitter AST parsing + SCIP cross-file references analyze your codebase structure. An LLM narrates the walkthrough. Every generated reference (function names, file paths, import chains) is validated against the real code index before it reaches the user. The senior developer saves 2+ weeks per quarter previously spent on manual onboarding.

**Pillar 2: Always Current**
Walkthroughs auto-update when your code changes. No more docs graveyard.
- *Proof point:* Tree-sitter's incremental parsing detects changed code regions. The system re-analyzes only affected files and flags outdated walkthrough sections for regeneration. Unlike Confluence (where 60% of pages are admitted to be outdated), LaunchPad AI ties documentation freshness directly to git history.

**Pillar 3: Grounded in Real Code, Not Hallucinations**
Every walkthrough step links to actual code. AI narrates; static analysis verifies.
- *Proof point:* A three-stage pipeline -- structural analysis first, LLM narration second, post-generation validation third -- ensures that every symbol, file path, and dependency referenced in a walkthrough resolves to real code. Sections are labeled "high confidence" (structurally verified) or "inferred" (LLM interpretation). Teams can edit any step, building a quality flywheel.

### 2.4 Anti-Positioning: What LaunchPad AI is NOT

1. **Not a code generation tool.** We do not write code, complete code, or suggest code changes. GitHub Copilot does that. We explain existing code to humans.

2. **Not a general documentation platform.** We do not replace Notion, Confluence, or GitBook for API docs, runbooks, or product specs. We generate codebase-specific onboarding walkthroughs. That is it.

3. **Not a code search engine.** We do not compete with Sourcegraph on ad-hoc code search. We produce structured, narrative walkthroughs -- a guided experience, not a search box.

4. **Not a monitoring or analytics-first tool.** We are not Jellyfish, LinearB, or Haystack. Onboarding analytics are a supporting feature, not the core product.

5. **Not a replacement for human mentorship.** We accelerate the "learn the codebase" phase so that 1:1 time with a mentor can focus on higher-value topics like design philosophy, team norms, and career growth -- not "here is where the auth middleware lives."

---

## 3. Pricing Strategy

### 3.1 Pricing Tiers

| | **Free** | **Team** | **Enterprise** |
|--|---------|---------|---------------|
| **Price** | $0 | $15/user/month (annual) / $18/user/month (monthly) | Custom ($28-35/user/month, annual only) |
| **Repos** | 1 repo, up to 50K LOC | Unlimited repos, up to 200K LOC each | Unlimited repos, unlimited LOC |
| **Users** | Up to 3 | Up to 100 | Unlimited |
| **Languages** | TypeScript, Python | + Go, Java, Rust | + all supported languages |
| **Walkthroughs** | Auto-generated (read-only) | Auto-generated + editable + team sharing | + custom walkthrough templates, approval workflows |
| **Diagrams** | Dependency diagrams only | + AI-assisted architecture diagrams | + editable diagrams, export to Mermaid/D2 |
| **Updates** | Manual re-analysis | Auto-update on push (CI integration) | + PR-triggered walkthrough diffs |
| **Analytics** | None | Basic (walkthrough completion per user) | Full (time-to-first-PR, knowledge coverage, onboarding NPS, manager dashboard) |
| **Support** | Community (GitHub Discussions) | Email, 48hr SLA | Dedicated CSM, Slack channel, 4hr SLA |
| **Security** | Cloud only | Cloud | + VPC/self-hosted option, SSO (SAML/OIDC), SCIM, audit log, SOC 2 report |
| **Target ACV** | $0 | $5,400-$21,600 (30-100 users) | $50,000-$200,000+ |

### 3.2 Rationale and Benchmarks

| Competitor | Price Point | What You Get | LaunchPad AI Comparison |
|-----------|------------|-------------|------------------------|
| Swimm Teams | $17.78/seat/month | Code-coupled docs, AI assistance, IDE integration | LaunchPad Team at $15/seat undercuts Swimm while offering auto-generated walkthroughs (Swimm requires manual creation) |
| Swimm Enterprise Starter | $28/seat/month | + SSO, advanced integrations | LaunchPad Enterprise at $28-35/seat is comparable, with architecture diagrams and analytics that Swimm lacks |
| GitHub Copilot Business | $19/user/month | AI code completion, chat, PR summaries | Different category, but validates the $15-20/seat price point for AI dev tools |
| Confluence Standard | $5.16/user/month | Wiki, templates, Jira integration | LaunchPad is 3x the price but auto-generates and auto-maintains content (Confluence requires manual everything) |
| Loom Business | $15/user/month | Video recording, AI summaries | Same price point; LaunchPad is code-aware and always current; Loom videos go stale |

### 3.3 Free Tier Strategy

**The hook:** Connect a GitHub repo and get a complete auto-generated walkthrough in under 5 minutes. No credit card. No sales call. The free tier must deliver an "aha" moment -- the new engineer opens the walkthrough and thinks "this is better than any onboarding doc I have ever seen."

**What keeps them on free:** 1 repo and 3 users is enough for a single team to trial the product on their primary service. The read-only constraint means they can consume walkthroughs but cannot customize them -- creating upgrade pressure when they want to refine content for their specific onboarding flow.

**Conversion trigger:** The 4th team member who needs access, or the second repo they want to analyze. Both require Team tier.

**Unit economics on free:** At ~$4/user/month COGS (per Tech Analyst), 3 free users cost us $12/month. If 10% of free teams convert to Team tier within 90 days at $15/user x 30 users average = $450/month, the LTV:CAC math works. We need roughly 1 paid conversion per 10 free activations to break even on infrastructure.

### 3.4 Target ACV by Segment

| Segment | Company Size | Typical Deal | Target ACV | Sales Motion |
|---------|-------------|-------------|-----------|-------------|
| Self-serve / SMB | 20-50 engineers | 10-30 seats on Team | $1,800-$5,400 | PLG, no sales touch |
| Mid-market | 50-200 engineers | 30-100 seats on Team | $5,400-$18,000 | PLG + inside sales assist |
| Upper mid-market | 200-500 engineers | 100-300 seats on Enterprise | $50,000-$105,000 | AE-led, EM or VP champion |
| Enterprise | 500-1000+ engineers | 300+ seats on Enterprise | $100,000-$350,000 | AE-led, VP/CTO sponsor, security review |

---

## 4. MVP Feature Scoping

### 4.1 Feature Priority Matrix

#### Must-Have (Launch Blockers) -- Ship in v1.0

| # | Feature | Rationale | Tech Feasibility | Est. Effort |
|---|---------|-----------|-----------------|-------------|
| M1 | GitHub/GitLab repo connection (OAuth) | Cannot analyze code without repo access | Feasible now | 1 week |
| M2 | Codebase analysis pipeline (tree-sitter AST + SCIP for TS/Python) | Foundation for everything else | Feasible now | 4-6 weeks |
| M3 | AI-generated module summaries with RAG + validation | The core "aha" -- summaries that are grounded in real code | Feasible with effort | 6-8 weeks (parallel with M2) |
| M4 | Interactive walkthrough player (web-based, CodeMirror 6) | The delivery surface for generated content | Feasible with effort | 6-8 weeks (parallel with M2/M3) |
| M5 | Post-generation validation pipeline | Every symbol/file reference checked against code index | Must build from scratch | Included in M3 timeline |
| M6 | Dependency diagrams (structural, Mermaid.js rendering) | Visual component of walkthroughs; high reliability | Feasible now | 2-3 weeks |
| M7 | Basic user auth and team workspace | Multi-user access to walkthroughs | Feasible now | 2 weeks |
| M8 | Shareable walkthrough URLs | New hires need a link, not an install process | Feasible now | 1 week |
| M9 | Feedback mechanism (thumbs up/down per walkthrough step) | Quality flywheel; identifies weak sections | Feasible now | 1 week |

#### Should-Have (Month 2) -- Ship within 4 weeks of launch

| # | Feature | Rationale |
|---|---------|-----------|
| S1 | Walkthrough editing (teams refine AI-generated content) | Quality flywheel; addresses 60-70% accuracy gap on architecture interpretation |
| S2 | Incremental re-analysis on git push (CI hook) | "Always current" pillar; differentiator vs. Loom/Confluence |
| S3 | AI-assisted architecture diagrams (hybrid: structural graph + LLM labeling) | High-value visual feature; positioned as "editable draft" |
| S4 | Go language support | Expands addressable market to a common backend language |
| S5 | Walkthrough completion tracking (per user) | Basic analytics for managers; first step toward Enterprise value |
| S6 | Confidence scoring on generated content ("verified" vs. "inferred" labels) | Builds trust; addresses hallucination concern transparently |

#### Nice-to-Have (Quarter 2) -- Ship within 3 months of launch

| # | Feature | Rationale |
|---|---------|-----------|
| N1 | Manager analytics dashboard (time-to-first-PR, onboarding NPS) | Unlocks VP of Engineering buyer |
| N2 | Simple learning paths (topological walkthrough ordering by module dependency) | First pass at personalization without the full adaptive engine |
| N3 | Java and Rust language support | Enterprise language coverage |
| N4 | CodeTour export (JSON format for VS Code users) | Meets teams where they are |
| N5 | SSO (SAML/OIDC) and SCIM provisioning | Enterprise gate |
| N6 | Slack integration (notify new hires, share walkthrough links) | Reduces friction in the onboarding workflow |
| N7 | Multi-repo support | Larger codebases and microservice architectures |
| N8 | VPC / self-hosted deployment option | Enterprise security requirement |

### 4.2 User Stories and Acceptance Criteria (Must-Haves)

---

**M1: GitHub/GitLab Repo Connection**

*As an engineering manager, I want to connect my team's GitHub or GitLab repository to LaunchPad AI so that it can analyze our codebase and generate walkthroughs.*

Acceptance Criteria:
- User can authenticate via GitHub OAuth or GitLab OAuth
- User can select a repository from their accessible repos (including org repos where they have read access)
- System performs a shallow clone of the default branch
- System detects primary languages using linguist-style detection
- Connection completes in under 60 seconds for repos up to 200K LOC
- Error states: private repo without access, repo too large (>200K LOC on free tier), unsupported language only

---

**M2: Codebase Analysis Pipeline**

*As a developer, I want LaunchPad AI to automatically analyze my codebase's structure -- files, functions, classes, imports, and cross-file references -- so that walkthroughs are grounded in real code, not guesswork.*

Acceptance Criteria:
- Tree-sitter parses all TypeScript and Python files, extracting: functions, classes, interfaces/types, imports, exports
- SCIP indexer generates cross-file reference index: go-to-definition, find-references, call hierarchy
- Dependency graph extracted at module level (directory/package grouping)
- Analysis completes in under 5 minutes for a 100K LOC repo
- Results stored in a unified code graph (PostgreSQL + embeddings)
- Analysis can be re-triggered manually or via webhook

---

**M3: AI-Generated Module Summaries with Validation**

*As a new engineer joining a team, I want to read clear, accurate summaries of each major module in the codebase so that I understand the system's structure before diving into code.*

Acceptance Criteria:
- System identifies top-level modules/packages from directory structure and dependency graph
- For each module: LLM generates a 200-500 word summary covering purpose, key files, public API surface, and dependencies
- Every function name, file path, and import referenced in the summary is validated against the SCIP/AST index
- References that do not resolve are either corrected via retry or removed and flagged
- Summaries are presented in a readable web UI with links to actual code locations
- Generation completes within 3 minutes of analysis completion for a 20-module codebase
- Cost per initial analysis stays under $2.00 for a repo up to 100K LOC

---

**M4: Interactive Walkthrough Player**

*As a new engineer, I want to follow a step-by-step guided walkthrough of the codebase in my browser, where each step shows me the relevant code with annotations explaining what it does and why.*

Acceptance Criteria:
- Web-based player renders code using CodeMirror 6 with syntax highlighting (tree-sitter WASM)
- Each walkthrough consists of 10-30 ordered steps
- Each step displays: a code file region (highlighted), a narrative explanation (markdown), and optionally an inline diagram
- User can navigate forward/back through steps, jump to any step, or browse the step list
- Code regions are clickable: clicking a referenced function navigates to its definition
- Player is responsive (works on screens 1024px and wider)
- Walkthrough loads in under 2 seconds on a standard broadband connection
- Progress is saved: returning users resume where they left off

---

**M5: Post-Generation Validation Pipeline**

*As a product, we must ensure that every piece of AI-generated content references real code entities so that developers trust the output.*

Acceptance Criteria:
- After LLM generates walkthrough content, a validator checks every extracted reference (function names, class names, file paths, import statements) against the code graph
- References that do not resolve are flagged and either: (a) retried with corrected context, or (b) removed from the output with a visible "[unverified]" marker
- Validation achieves >95% reference accuracy on well-structured TS/Python codebases (measured against a test suite of 10 open-source repos)
- Validation adds no more than 30 seconds to the generation pipeline per module

---

**M6: Dependency Diagrams**

*As a new engineer, I want to see a visual diagram of how the major modules in the codebase depend on each other so that I can understand the system's structure at a glance.*

Acceptance Criteria:
- System generates a module-level dependency diagram from the structural analysis (not LLM-generated)
- Rendered using Mermaid.js in the walkthrough player
- Nodes represent modules/packages; edges represent import dependencies
- Diagrams are interactive: clicking a module navigates to its walkthrough section
- Diagrams render correctly for codebases with up to 50 modules (Mermaid's practical limit)
- For larger codebases: collapsible groups by directory, with expand-on-click

---

**M7: Basic User Auth and Team Workspace**

*As an engineering manager, I want to invite my team members to a shared workspace so that everyone can access the same walkthroughs.*

Acceptance Criteria:
- Email/password auth and GitHub OAuth login
- Workspace with invite-by-email (up to 3 users on Free, up to 100 on Team)
- All connected repos and generated walkthroughs are visible to workspace members
- Role model: Admin (can connect repos, manage members) and Member (can view walkthroughs)
- Free tier: 1 workspace, 1 repo, 3 members
- Team tier: 1 workspace, unlimited repos, up to 100 members

---

**M8: Shareable Walkthrough URLs**

*As a senior developer, I want to share a direct link to a specific walkthrough (or a specific step within a walkthrough) with a new hire so they can start learning immediately.*

Acceptance Criteria:
- Every walkthrough has a unique, stable URL
- Every step within a walkthrough has a deep-link URL (e.g., /walkthrough/abc123/step/7)
- Links respect workspace membership: only workspace members can view (non-members see a "request access" page)
- Links work without requiring the recipient to install anything

---

**M9: Feedback Mechanism**

*As a new engineer, I want to mark walkthrough steps as helpful or unhelpful so that the team can improve content quality over time.*

Acceptance Criteria:
- Each walkthrough step has a thumbs-up / thumbs-down button
- Optional freeform text feedback on thumbs-down
- Feedback is visible to workspace admins in an aggregate view (e.g., "Step 7 has 3 downvotes: 'this function was renamed in PR #482'")
- Feedback data feeds into future re-generation priorities (steps with negative feedback are flagged for regeneration)

---

### 4.3 Launch Timeline

Based on the Tech Analyst's feasibility verdicts and the 2-senior-engineer constraint:

| Week | Engineer A | Engineer B | Milestone |
|------|-----------|-----------|-----------|
| 1-2 | Ingestion layer (git clone, language detection) | Auth + workspace + basic web app scaffold | Repos can be connected |
| 3-6 | Analysis pipeline: tree-sitter + SCIP for TS/Python | LLM summarization pipeline: chunking, RAG, prompt chain | Code graph populated; first summaries generated |
| 7-8 | Dependency diagram generation (Mermaid) | Validation pipeline: reference checking, confidence scoring | Diagrams render; summaries are validated |
| 9-12 | Walkthrough player (CodeMirror 6, step navigation, annotations) | Walkthrough generation (steps from summaries, code region mapping) | Interactive walkthroughs playable in browser |
| 13-14 | Shareable URLs, progress tracking, feedback mechanism | Polish: error handling, loading states, edge cases | Feature-complete MVP |
| 15-16 | Internal testing, bug fixes, performance optimization | Beta testing with 5-10 external teams | Launch-ready |

**Target: MVP launch at Week 16 (4 months from start).**

This aligns with the Tech Analyst's 14-16 week estimate. The critical path is the AI narration pipeline (M3 + M5), which runs in parallel with the walkthrough player (M4) and converges at Week 12.

---

## 5. Key Decisions and Open Questions

### Decisions Made

1. **Wedge is walkthroughs, not diagrams or learning paths.** Diagrams are a supporting feature inside walkthroughs. Learning paths are deferred to a post-MVP spike.

2. **Web-first, not IDE-first.** Lower friction for new engineers (no VS Code setup required), shareable URLs, analytics on completion. CodeTour export as a Nice-to-Have covers IDE users.

3. **TypeScript + Python first.** These two languages cover the majority of the mid-market target (React/Node.js + Python backend/data). Go is month 2. Java/Rust are quarter 2.

4. **Cloud SaaS first, self-hosted later.** Self-hosted/VPC deployment is an Enterprise feature for months 9-12. V1 is cloud-only to minimize operational complexity.

5. **Price below Swimm, above Confluence.** $15/user/month Team tier undercuts Swimm ($17.78) while offering auto-generation that Swimm lacks. Premium to Confluence ($5.16) is justified by the zero-maintenance value prop.

6. **All generated content is labeled as AI-generated and editable.** This is not optional. The Tech Analyst flags 60-70% accuracy on architecture interpretation. Positioning output as "editable drafts" builds trust; positioning it as "ground truth" destroys trust.

### Open Questions Requiring Founder Input

1. **Open-source strategy:** Should the analysis pipeline (tree-sitter + SCIP integration) be open-sourced to build community and competitive moat? CodeBoarding is already OSS. An open core model (OSS analysis, proprietary walkthrough generation + player) could accelerate adoption.

2. **Local CLI as acquisition channel:** The Tech Analyst proposes a CLI tool (`launchpad analyze <repo>`) that runs locally. Should this be the free tier (local analysis, cloud walkthrough rendering) rather than a cloud-only free tier? This addresses security concerns earlier.

3. **Pricing for annual billing:** The $15/user/month team price assumes monthly billing. Should we offer a steeper annual discount (e.g., $12/user/month annual = $144/user/year) to improve cash flow and retention?

4. **First-language priority:** TypeScript + Python is the recommendation. If forced to pick one, TypeScript has higher density in the target segment (mid-market SaaS). Should we ship TS-only in Week 14 and add Python in Week 16, or hold for both?

5. **Hallucination tolerance:** What is the acceptable false reference rate at launch? The acceptance criteria targets >95% reference accuracy. Is 95% good enough to ship, or do we need 98%+ before going to market? The answer materially affects the timeline.

---

## 6. Success Metrics

### Launch (Month 1)
- 100+ teams activate free tier
- Median time from repo connection to first walkthrough viewed: <10 minutes
- Walkthrough reference accuracy: >95% on test suite of 10 OSS repos
- NPS from beta testers: >40

### Month 3
- 15+ teams convert from Free to Team tier
- $10K+ MRR
- <5% monthly churn on paid accounts
- Average 3+ walkthroughs generated per repo

### Month 6
- 50+ paying teams
- $40K+ MRR ($480K ARR run rate)
- 5+ enterprise pipeline deals
- Net revenue retention >110%
- Feature: incremental updates and walkthrough editing live

### Month 12
- $500K+ ARR
- 5+ enterprise contracts ($50K+ ACV)
- 3+ case studies with quantified time-to-productivity improvement
- Category recognition: featured in at least one analyst report or major dev publication

### Month 18
- $2M+ ARR
- 15+ enterprise contracts
- Multi-language (TS, Python, Go, Java, Rust)
- Self-hosted deployment option live

---

## 7. Risk Mitigation Summary

| Risk | Likelihood | Impact | Mitigation Strategy | Owner |
|------|-----------|--------|-------------------|-------|
| **Hallucinated references erode developer trust** | High | Critical | Three-stage pipeline (analysis -> narration -> validation); >95% accuracy gate before launch; "editable draft" positioning; confidence labels | Engineering Lead |
| **Walkthroughs are too generic ("this file handles routing")** | High | High | Prompt engineering that emphasizes "why" over "what"; inject architectural context from git blame, PR descriptions, and commit messages; user feedback loop for regeneration | AI/ML Lead |
| **GitHub Copilot ships onboarding features** | Medium | High | Build deep onboarding workflows (learning paths, analytics, manager dashboards) that Copilot will deprioritize; move fast on category leadership; build switching costs through team-edited content | Product Lead |
| **Swimm pivots to auto-generation** | Medium | Medium | Swimm's 5-year DNA is manual doc creation with AI assistance; full auto-generation requires a different architecture (code analysis pipeline); we have 12-18 month head start if we ship now | Product Lead |
| **Free tier economics do not work** | Medium | Medium | Monitor LLM cost per free user; implement aggressive caching and prompt caching (90% cost reduction on Anthropic); gate expensive operations (full re-analysis) to paid tier | Engineering Lead |
| **Enterprise buyers require SOC 2 before purchase** | High | High | Begin SOC 2 Type II process at Month 3 (takes 6-12 months); offer VPC deployment as interim security measure; target mid-market buyers first (less compliance-heavy) | Operations Lead |
| **Senior developers refuse to adopt ("another tool")** | Medium | High | Zero-effort setup (no manual authoring); integrate into existing workflow (GitHub PR comments, Slack notifications); prove value in 5 minutes via free tier | Product Lead |

---

## Sources

All claims in this document are derived from two input documents:
- **Market Research Report** (2026-03-24): TAM/SAM/SOM, competitor analysis, buyer personas, market signals, pricing benchmarks
- **Technical Feasibility Analysis** (2026-03-24): Component feasibility verdicts, cost modeling, architecture sketch, risk register, build timeline

Specific data points referenced:
- Swimm $8.8M ARR, $17.78-$28/seat pricing: Latka, Swimm pricing page (via Market Research)
- GitHub Copilot 4.7M subscribers, $19-39/seat: GetPanto, GitHub pricing (via Market Research)
- Onboarding cost $480K-$750K/year for 200-person team: derived from TeamStation, Whatfix data (via Market Research)
- Tree-sitter, SCIP, CodeMirror 6 feasibility: Technical Feasibility Analysis sections 1.1, 1.4
- LLM cost ~$1.20/initial analysis, ~$4/user/month COGS: Technical Feasibility Analysis section 3.4
- 14-16 week MVP timeline: Technical Feasibility Analysis section 6
- Hallucination rates (19.7% package names, 29-45% code vulnerabilities): arxiv, diffray.ai (via Technical Feasibility)
- 78% of new developers rate codebase navigation 4-5/5 difficulty: Cortex survey (via Market Research)
- 60% of wiki pages outdated: buyer persona qualitative data (via Market Research)
- 23% engineer annual attrition: Corporate Navigators (via Market Research)

---

*This strategy document is a living artifact. It should be revisited after (1) the personalization spike in Month 4, (2) the first 10 paid conversions, and (3) the first enterprise deal close. Each of those events will validate or invalidate assumptions made here.*
