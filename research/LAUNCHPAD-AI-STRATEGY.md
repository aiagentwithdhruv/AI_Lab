# LaunchPad AI -- Master Strategy Document

**Date:** 2026-03-24
**Status:** Synthesis of all research workstreams -- ready for founder decision
**Sources:** Market Research, Technical Feasibility, Product Strategy, GTM Playbook, Devil's Advocate Review

---

## 1. Executive Summary

A CEO should walk away with these five points:

- **The market is real but smaller than initially modeled.** Developer onboarding costs mid-market companies $480K-$750K/year in direct costs plus $1.3M-$2.3M in lost productivity. No commercial product auto-generates interactive codebase walkthroughs. However, the realistic Year 3 revenue target is $5M-$8M ARR, not the $120M-$180M SOM initially projected -- Swimm's $8.8M ARR after 5+ years is the honest comparable. *(Market Research, refined by Devil's Advocate)*

- **The product is technically feasible with a 16-week MVP timeline.** The core pipeline -- tree-sitter AST parsing, SCIP cross-references, LLM narration with RAG, CodeMirror 6 walkthrough player -- uses proven components. The integration layer and hallucination mitigation are the real engineering challenges, not any single component. Two senior engineers can ship a usable MVP targeting TypeScript/Python codebases under 200K LOC. *(Technical Feasibility)*

- **The wedge is auto-generated interactive walkthroughs, not diagrams or learning paths.** Diagrams have a 60-70% accuracy ceiling that erodes trust. Personalized learning paths are unproven (rated "needs spike"). Walkthroughs occupy an empty competitive quadrant (high code understanding + active/interactive learning) and address the senior developer's core pain: "I spend 20-30% of my time explaining our codebase to new hires." *(Product Strategy)*

- **The biggest risks are walkthrough quality, usage cliff, and GitHub Copilot.** The AI can extract "what" code does but not "why" it exists -- the exact knowledge that matters most for onboarding. Onboarding is a point-in-time event, creating a structural engagement cliff (80% of seats dormant at any time). GitHub could ship a "good enough" onboarding feature in 6-12 months, not the 18-24 months initially assumed. *(Devil's Advocate)*

- **Verdict: Conditional Go.** Proceed only after validating willingness to pay via a 2-week concierge MVP, testing walkthrough quality on 10 real codebases, and cutting the GTM plan to 3 channels. If concierge validation fails, stop before investing 4 months of engineering. *(Devil's Advocate, synthesized)*

---

## 2. Market Opportunity

### The Problem (Quantified)

| Metric | Data | Source |
|--------|------|--------|
| Time to full productivity for new engineers | 3-9 months | Survey of 80 engineering orgs (Market Research) |
| Onboarding cost per engineer (direct) | $16,000-$25,000 | TeamStation, Whatfix (Market Research) |
| Annual onboarding spend for 200-person eng team (30 hires/yr) | $480K-$750K direct + $1.3M-$2.3M lost productivity | Derived (Market Research) |
| Engineers quitting within first year | 23% | Harvard Business Review (Market Research) |
| New developers rating codebase navigation difficulty 4-5/5 | 78% | Cortex survey (Market Research) |
| Remote workers feeling undertrained | 63% | AIHR (Market Research) |

### Market Sizing (Corrected)

The initial research projected a $120M-$180M SOM (10-15% penetration of 800K US mid-market engineers at $15/user/month within 3 years). The Devil's Advocate review challenged this as 12-18x Swimm's revenue after 5+ years.

| Metric | Initial Estimate | Corrected Estimate | Rationale |
|--------|-----------------|-------------------|-----------|
| TAM (global dev tools) | $8.78B | $8.78B (unchanged) | Mordor Intelligence, but LaunchPad AI addresses a fraction |
| SAM (onboarding/doc tools, 50+ eng companies) | $1.2B-$1.8B | $1.2B-$1.8B (plausible but soft) | 40% company-size split is unsourced; 60% penetration may overcount |
| SOM (Year 3 capturable) | $120M-$180M | **$5M-$8M** | Swimm at $8.8M ARR after 5 years is the honest benchmark; top 5% dev tool outcome |

### Competitive Landscape

**Direct competitor:** Swimm ($8.8M ARR, $33.3M funded, 57 employees). Requires manual doc creation with AI assistance. LaunchPad AI's auto-generation is a structural advantage, but Swimm can add this as a feature. *(Market Research, challenged by Devil's Advocate)*

**Existential threat:** GitHub Copilot (4.7M paid subscribers, 90% of Fortune 100). Already has code understanding infrastructure. The competitive window is **6-12 months**, not 18-24 months. *(Devil's Advocate correction of Market Research)*

**Underweighted threat:** AI-native IDEs (Cursor, Windsurf) are adding codebase understanding features and were not analyzed in the original research. *(Devil's Advocate)*

**Missing from original analysis:** Internal Developer Portals (Backstage, Cortex, Port) may subsume onboarding tooling. LaunchPad AI must decide: platform or plugin? *(Devil's Advocate)*

**Validated gap:** No existing product auto-generates interactive, step-by-step codebase walkthroughs from static analysis + LLM narration. The "high code understanding + active/interactive learning" quadrant is unoccupied. *(Market Research, confirmed by Product Strategy)*

### Market Tailwinds

1. AI-native documentation is replacing manual docs (Mintlify: $10M ARR, Confluence added Rovo AI) *(Market Research)*
2. Onboarding is shifting from HR process to engineering platform (Shopify cut onboarding time 70%, Dropbox from 2 weeks to 2 days) *(Market Research)*
3. Remote-first engineering demands async knowledge transfer (72% of teams fully distributed) *(Market Research)*
4. GitHub Copilot has normalized paying $10-39/seat for AI dev tools *(Market Research)*

### Market Headwinds (from Devil's Advocate)

1. **Economic downturn risk.** If hiring slows, onboarding volume drops and urgency evaporates.
2. **"Good enough" inertia.** The biggest competitor is doing nothing. Ad-hoc onboarding has worked for decades. The pain is real but diffuse, not hair-on-fire.
3. **Budget competition.** At $15/user/month, LaunchPad AI competes for the same line item as Copilot, Datadog, and other tools with more obvious daily-use value.

---

## 3. Product Vision & MVP

### Product Positioning

**One-liner:** "AI-generated codebase walkthroughs that get new engineers productive in days, not months." *(Product Strategy)*

**Category:** AI-powered developer onboarding platform

**Anti-positioning:** Not a code generation tool (Copilot). Not a general documentation platform (Notion/Confluence). Not a code search engine (Sourcegraph). Not analytics-first (Jellyfish/LinearB). Not a replacement for human mentorship -- it automates the "learn the codebase" phase so mentorship time goes to higher-value topics. *(Product Strategy)*

### Three Product Pillars

| Pillar | Promise | Technical Backing |
|--------|---------|------------------|
| **Zero-Effort Generation** | Connect repo, get walkthrough in <5 minutes | Tree-sitter AST + SCIP cross-refs + LLM narration + post-validation pipeline |
| **Always Current** | Auto-updates when code changes | Tree-sitter incremental parsing + git-hook-triggered re-analysis |
| **Grounded in Real Code** | Every reference verified against actual codebase | Three-stage pipeline: structural analysis -> LLM narration -> reference validation |

### MVP Scope (16 Weeks, 2 Senior Engineers)

**Must-Have (Launch Blockers):**

| # | Feature | Effort | Feasibility |
|---|---------|--------|-------------|
| M1 | GitHub/GitLab repo connection (OAuth) | 1 week | Feasible now |
| M2 | Codebase analysis pipeline (tree-sitter + SCIP for TS/Python) | 4-6 weeks | Feasible now |
| M3 | AI-generated module summaries with RAG + validation | 6-8 weeks | Feasible with effort |
| M4 | Interactive walkthrough player (web, CodeMirror 6) | 6-8 weeks | Feasible with effort |
| M5 | Post-generation validation pipeline | Included in M3 | Must build from scratch |
| M6 | Dependency diagrams (structural, Mermaid.js) | 2-3 weeks | Feasible now |
| M7 | Basic auth and team workspace | 2 weeks | Feasible now |
| M8 | Shareable walkthrough URLs | 1 week | Feasible now |
| M9 | Feedback mechanism (thumbs up/down per step) | 1 week | Feasible now |

*(Product Strategy, timelines from Technical Feasibility)*

**Deferred from MVP (with rationale):**

| Feature | Why Deferred | When |
|---------|-------------|------|
| Architecture diagrams (LLM-assisted) | 60-70% accuracy ceiling; leads with weakness *(Tech Feasibility)* | Month 2 (as editable drafts inside walkthroughs) |
| Walkthrough editing | Quality flywheel, but not launch-blocking | Month 2 |
| Incremental re-analysis on push | SCIP requires full re-index; "auto-update on push" is misleading at 20 pushes/day *(Devil's Advocate)* | Month 2 (batch, not real-time) |
| Personalized learning paths | "Needs spike" -- concept dependency graph + adaptive sequencing are unsolved *(Tech Feasibility)* | Post-MVP spike at Month 4 |
| Analytics dashboard | Manager feature; must win developer (Priya) first | Month 9-12 |
| SSO/SCIM/SOC 2 | Enterprise gate; target mid-market first | Month 9-12 |

### Critical Feasibility Constraint: The "Why" Gap

The Devil's Advocate review identifies the core product risk: **the AI can extract "what" code does but not "why" it exists.** The things that matter most for onboarding -- architectural intent, historical decisions, "never touch this because..." warnings -- are not encoded in code structure.

**Mitigation (adopted as requirement):** Build a git-blame integration that surfaces commit messages, PR descriptions, and linked issue titles for each code region. Feed this context into LLM prompts alongside structural analysis. This transforms "this file handles authentication" (useless) into "this file handles authentication -- migrated from Auth0 to in-house JWT in Q3 2025 due to cost concerns (PR #482)" (valuable). **Adds 2-3 weeks to the analysis pipeline.** *(Devil's Advocate Recommendation 4)*

### Pricing

| Tier | Price | Target | Key Limits |
|------|-------|--------|------------|
| **Free** | $0 | PLG adoption | 1 repo, 3 users, 50K LOC cap, read-only walkthroughs |
| **Team** | $15/user/month ($18 monthly) | Mid-market (50-200 eng) | Unlimited repos up to 200K LOC, editable walkthroughs, CI integration |
| **Enterprise** | $28-35/user/month (annual) | 200-1000+ eng | Unlimited LOC, VPC/self-hosted, SSO, analytics, dedicated CSM |

*(Product Strategy)*

**Devil's Advocate pricing challenges (unresolved):**
- Per-seat pricing misaligns with point-in-time value. Alternative models (per-repo, per-onboarding-event) should be tested in buyer interviews.
- The free tier may be too generous (1 repo + 3 users covers many small teams' actual use case). Conversion rate assumption of 8-10% is at the top of industry benchmarks (5-10%).
- Market Research recommended $18/user; Product Strategy dropped to $15 to undercut Swimm. The $3 difference materially affects margins at scale. The price cut signals "less proven," not "better value."

---

## 4. Technical Architecture

### System Overview (Simplified)

```
Git Repo (GitHub/GitLab)
    |
    v
[1. Ingestion] -- shallow clone, language detection (linguist)
    |
    v
[2. Analysis Engine]
    - tree-sitter: per-file AST parsing (functions, classes, imports)
    - SCIP indexers: cross-file references (go-to-definition, call hierarchy)
    - dependency-cruiser (JS/TS) + language-specific tools: module dependency graph
    - git-blame integration: commit messages, PR descriptions per code region
    |
    v
[3. Code Graph DB] -- PostgreSQL + pg_vector (embeddings)
    |
    v
[4. AI Narration Pipeline]
    - RAG: embed code chunks -> vector store -> retrieve per query
    - LLM prompt chain: summarize modules -> identify entry points -> generate walkthrough steps -> generate diagram DSL
    - Post-generation validator: check every symbol, file path, import against code graph
    - Confidence scoring: "verified" vs. "inferred" labels
    |
    v
[5. Content Store] -- walkthrough JSON, Mermaid diagram source, user progress
    |
    v
[6. Walkthrough Player] -- CodeMirror 6 + Mermaid.js, step navigation, annotations, feedback
```

*(Technical Feasibility, Section 3)*

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Code display | CodeMirror 6 (not Monaco) | 300KB vs. 5-10MB; better mobile; Sourcegraph migrated for same reasons *(Tech Feasibility)* |
| Diagram format | Mermaid.js (primary), D2 (complex), React Flow (interactive) | Mermaid renders natively in GitHub/GitLab/Notion; widest portability *(Tech Feasibility)* |
| Semantic analysis | SCIP protocol (not live LSP servers) | Offline indexes; no per-language server processes; 4x smaller than LSIF *(Tech Feasibility)* |
| Deployment (v1) | Cloud SaaS | Minimize ops complexity; self-hosted/VPC deferred to Enterprise tier *(Product Strategy)* |
| LLM strategy | GPT-4.1 for summaries, GPT-4.1 nano for bulk operations | Balances quality and cost; ~$1.20 per initial analysis for 80K LOC repo *(Tech Feasibility)* |
| Web-first (not IDE) | Web-based walkthrough player | Lower friction for new engineers; shareable URLs; analytics; no VS Code dependency *(Tech Feasibility)* |

### Cost Structure (Corrected)

The Technical Feasibility analysis estimated $4/user/month COGS. The Devil's Advocate review identified underestimates in LLM costs, compute, embedding re-generation, and cache hit rates.

| Component | Original Estimate | Corrected Estimate | Gap |
|-----------|------------------|-------------------|-----|
| COGS per user (10-user team) | $4.00/month | $6-$8/month | LLM cache hit rates are 10-20% cross-customer, not 50-90%; SCIP compute underestimated; embedding re-generation missing |
| COGS per user (100-user scale) | $2.00-$2.50/month | $3-$4/month | Shared infrastructure helps but less than modeled |
| Gross margin at $15/seat (10 users) | ~73% | **47-60%** | Viable but tighter |
| Gross margin at $15/seat (100 users) | ~83% | **73-80%** | Healthy at scale |

*(Technical Feasibility costs, Devil's Advocate corrections)*

### Architecture Gaps to Address Before Scale

1. **Multi-tenancy isolation.** Code from different customers must be strictly isolated. Embedding contamination or cache poisoning is a company-ending incident. *(Devil's Advocate)*
2. **Job queue management.** Analysis is async and compute-intensive. Need BullMQ/SQS/Celery -- not mentioned in architecture. *(Devil's Advocate)*
3. **Rate limiting and abuse prevention.** Free tier is vulnerable to abuse (100 repos under different emails). *(Devil's Advocate)*

---

## 5. Go-To-Market Plan

### Strategy Summary

PLG-first: developers discover LaunchPad AI through open-source CLI and technical content, try the free tier with zero friction, then convert when they hit limits (4th user or 2nd repo). Engineering managers are the buyer; senior developers are the gatekeeper. *(GTM Playbook)*

### 90-Day Timeline

```
DAY -30 ──────────────── DAY 0 ──────────── DAY 30 ──────────── DAY 60 ──────────── DAY 90
   |                       |                   |                   |                   |
   PRE-LAUNCH              LAUNCH WEEK         CONTENT ENGINE      CONVERSION PUSH     TARGETS HIT?
   |                       |                   |                   |                   |
   - Landing page          - Product Hunt      - 2 blog posts/wk  - Case study #1     - 400+ activated
   - OSS CLI on GitHub     - Show HN           - Twitter 5x/wk    - EM email campaign  - 15-20 paid
   - Twitter seeding       - Twitter thread    - Dev.to 1x/wk     - Case study #2     - $8K-$12K MRR
   - EM community posts    - LinkedIn post     - Office hours      - GitHub Action     - 5+ enterprise
   - 10-15 beta teams      - Email waitlist    - Activation drip   - Referral program    pipeline
   - Demo video            - Reddit posts      - Ship 2-3 fixes/wk- Upgrade triggers
   - 800+ waitlist         - 500+ signups      - 15/day steady     - Free-to-paid 8%
```

*(GTM Playbook, condensed)*

### Channel Prioritization (Revised per Devil's Advocate)

The original GTM plan requires 40-55 hours/week of dedicated marketing across 8+ channels. This is a burnout prescription for a founding team also building the product. *(Devil's Advocate)*

**Revised to 3 channels for Days 0-30:**

| Priority | Channel | Why | Cut? |
|----------|---------|-----|------|
| 1 | **Hacker News** | OSS CLI launch + product launch; highest-quality dev audience | KEEP |
| 2 | **Twitter/X** | Build-in-public; low-effort daily engagement | KEEP |
| 3 | **Direct outreach (50 EMs)** | Highest conversion probability; personalized | KEEP (but reduce from 200 to 50 targets) |
| 4 | LinkedIn | Founder personal posts for EM persona | ADD at Day 30 |
| 5 | Dev.to/Hashnode | Cross-posted blog content | ADD at Day 30 |
| - | Reddit | Hostile to promotion; likely removed or downvoted | CUT |
| - | YouTube | 6-12 months to build audience; poor 90-day ROI | CUT |
| - | LinkedIn Ads | Marginal unit economics ($750-$1,667 CAC; requires 8-40% conversion to break even) | CUT |
| - | Newsletter | Add when there is an audience to email | DEFER |

*(Devil's Advocate Recommendation 3)*

### Day 90 Targets (with Downside Scenario)

| Metric | Target | 50% Scenario | Action Trigger |
|--------|--------|-------------|----------------|
| Activated free accounts | 400+ | 200 | If <200: reassess product-market fit |
| Paid Team customers | 15-20 | 8 | If <8: tighten free tier, test pricing models |
| MRR | $8K-$12K | $4K | If <$4K by Day 60: pivot pricing or scope |
| Enterprise pipeline | 5+ conversations | 2-3 | Expected; enterprise is slow |
| Walkthrough reference accuracy | >95% | >95% | Non-negotiable quality gate |
| NPS | 40+ | 30+ | If <30: product quality issue |

*(GTM Playbook targets, Devil's Advocate Recommendation 5 adds downside modeling)*

### Budget (90 Days): $15K-$25K

| Category | Allocation | Revised Notes |
|----------|-----------|---------------|
| Landing page + design | $2,500-$3,750 | Unchanged |
| Content production | $3,750-$6,250 | Freelance editor, video editing |
| Cold outreach tooling | $2,250-$3,750 | LinkedIn Sales Nav, Apollo.io |
| Community sponsorships | $1,500-$2,500 | 1-2 podcast/newsletter sponsors |
| Free tier infrastructure | $2,250-$3,750 | LLM + compute for ~100 free users |
| **LinkedIn Ads** | **$0 (was $3K-$5K)** | **Cut per Devil's Advocate** |
| Reserve | $3,000-$5,000 | Reallocated from LinkedIn ads |

---

## 6. Risk Register

| # | Risk | Likelihood | Impact | Source | Mitigation | Status |
|---|------|-----------|--------|--------|-----------|--------|
| R1 | **LLM hallucinations erode developer trust** | High | Critical | Tech Feasibility, Devil's Advocate | Three-stage pipeline (analysis -> narration -> validation); >95% reference accuracy gate; "editable draft" positioning; confidence labels | **Addressed** (in MVP design) |
| R2 | **Walkthroughs are "demo good, not depend-on good"** -- miss architectural intent, historical context, "where the dragons live" | High | Critical | Devil's Advocate (Section 3.4) | Build git-blame "why" layer (+2-3 weeks); user feedback loop for regeneration; position as starting point for team refinement | **Addressed** (adopted as requirement) |
| R3 | **Relationship errors pass validation** -- AI says "A calls B" when A calls C; both exist, so validation passes | High | High | Devil's Advocate (Section 2.4) | Extend validation to check actual call graphs, not just symbol existence; requires SCIP call hierarchy data | **Open** -- needs engineering design |
| R4 | **GitHub Copilot ships onboarding features in 6-12 months** | Medium-High | Critical | Devil's Advocate (Section 1.2) | Build 3+ capabilities Copilot cannot replicate as a feature: team-editable walkthroughs, onboarding analytics, learning paths. Must be in market by Month 6. | **Open** -- existential; speed is the only mitigation |
| R5 | **Usage cliff: onboarding is a one-time event; 80% seats dormant** | High | High | Devil's Advocate (Section 3.1) | Map and validate 3 post-onboarding use cases (explore unfamiliar module, pre-code-review walkthrough, post-reorg self-onboarding); test alternative pricing (per-repo, per-event) | **Open** -- needs user interviews |
| R6 | **Per-seat pricing misaligns with point-in-time value; CFO scrutiny at renewal** | Medium | High | Devil's Advocate (Section 3.2) | Test per-repo ($50/repo/month) and per-event ($500/onboarding) pricing in buyer conversations; decision needed before launch | **Open** -- needs pricing validation |
| R7 | **Swimm adds auto-generation as a feature** | Medium | Medium | Devil's Advocate (Section 1.2) | Swimm's architecture is manual-doc-first; auto-generation requires different pipeline. 12-18 month head start if we ship now. Move fast. | **Accepted** (speed is the mitigation) |
| R8 | **AI-native IDEs (Cursor, Windsurf) ship "tour this codebase"** | Medium | High | Devil's Advocate (Section 1.2) | Not analyzed in original research. Monitor quarterly. Integration strategy (LaunchPad as data source for IDE tours) may be the answer. | **Open** -- needs competitive monitoring |
| R9 | **Free tier economics fail** (10% conversion needed; industry benchmark is 5-10%) | Medium | Medium | Devil's Advocate (Section 3.2) | Aggressive caching; prompt caching (90% on Anthropic); gate expensive operations to paid tier; tighten free tier if conversion <5% by Day 45 | **Addressed** (contingency defined) |
| R10 | **Beta testing window too short** (1-2 weeks in original plan) | High | High | Devil's Advocate (Section 3.3) | Extend beta to 4-6 weeks by starting at Week 10 instead of Week 15 | **Addressed** (schedule change adopted) |
| R11 | **GTM plan requires 40-55 hrs/week marketing effort** | High | High | Devil's Advocate (Section 4.1) | Cut to 3 channels (HN, Twitter/X, 50 direct outreach); defer YouTube, Reddit, LinkedIn Ads, newsletter | **Addressed** (channels cut) |
| R12 | **COGS understated by 50-100%** | Medium | Medium | Devil's Advocate (Section 2.2) | Corrected COGS: $6-$8/user at 10 users. Margins viable at $15/seat but tighter. Consider $18/seat pricing. | **Addressed** (estimates corrected) |
| R13 | **Analysis fails on non-standard project structures** (monorepos, TS path aliases, dynamic imports, generated code) | Medium | High | Tech Feasibility, Devil's Advocate (Section 2.1) | Configurable project detection; fallback to directory-based grouping; scope v1 to "well-structured" codebases | **Addressed** (scope limited in MVP) |
| R14 | **Multi-tenancy breach** -- customer code appears in another customer's output | Low | Critical | Devil's Advocate (Section 2.3) | Must design strict tenant isolation from Day 1; architecture gap in current design | **Open** -- needs architecture work |
| R15 | **SOC 2 blocks enterprise deals** | High | High | Product Strategy, Devil's Advocate | Begin SOC 2 Type II at Month 3 (takes 6-12 months); offer hybrid deployment as interim; target mid-market first | **Accepted** (deferred by design; mid-market first) |
| R16 | **Economic downturn reduces hiring, eliminating onboarding urgency** | Low-Medium | High | Devil's Advocate (Section 1.4) | Cannot mitigate; diversify value prop toward post-onboarding use cases (code exploration, knowledge preservation) | **Accepted** |
| R17 | **Buyer willingness to pay is unproven** -- community signals prove pain, not purchase intent | Medium | Critical | Devil's Advocate (Section 1.3) | Concierge MVP (2 weeks, $500): manually generate walkthroughs for 5 companies; if 3 of 5 pay, demand is validated | **Open** -- must complete before build |

---

## 7. Decision Log

| # | Decision | Options Considered | Choice | Rationale | Source |
|---|----------|-------------------|--------|-----------|--------|
| D1 | **Product wedge** | (a) Walkthroughs, (b) Architecture diagrams, (c) Learning paths, (d) Analytics | **(a) Walkthroughs** | Empty competitive quadrant; highest tech readiness; addresses senior dev pain directly; diagrams have accuracy ceiling; learning paths unproven | Product Strategy Sec 1.1 |
| D2 | **Platform: web vs. IDE** | (a) Web-based player, (b) VS Code extension | **(a) Web-based** | Lower friction for new hires; shareable URLs; analytics; no editor dependency; CodeTour export as fallback | Tech Feasibility Sec 1.4 |
| D3 | **Language scope for v1** | (a) TS only, (b) TS + Python, (c) TS + Python + Go | **(b) TS + Python** | Covers majority of mid-market targets; Go deferred to Month 2 to reduce launch risk | Product Strategy Sec 5 |
| D4 | **Deployment model for v1** | (a) Cloud SaaS, (b) Local CLI, (c) Hybrid | **(a) Cloud SaaS** | Minimizes ops complexity; self-hosted deferred to Enterprise tier (Month 9-12) | Product Strategy Sec 5 |
| D5 | **Pricing** | (a) $18/user (Market Research), (b) $15/user (undercut Swimm) | **(b) $15/user -- CONTESTED** | Product Strategy chose $15 to undercut Swimm; Devil's Advocate argues this signals "less proven" and hurts margins. Recommend testing both in buyer conversations. | Product Strategy Sec 3.1 vs. Devil's Advocate Sec 3.2 |
| D6 | **Content positioning** | (a) "Ground truth" output, (b) "Editable AI draft" | **(b) Editable AI draft** | 60-70% architecture accuracy means claiming ground truth destroys trust; draft positioning builds trust and enables quality flywheel | Tech Feasibility Sec 1.3, Product Strategy Sec 5 |
| D7 | **Diagram generation approach** | (a) Pure LLM-generated, (b) Pure structural, (c) Hybrid | **(c) Hybrid: structural graph + LLM labeling** | Structural analysis provides reliable edges; LLM adds context, grouping, labels; best quality/reliability balance | Tech Feasibility Sec 1.3 |
| D8 | **GTM channel scope** | (a) 8+ channels (original GTM), (b) 3 focused channels | **(b) 3 channels** | Original requires 40-55 hrs/week; unsustainable. Focus on HN + Twitter/X + 50 direct EM outreach. | Devil's Advocate Rec 3, overriding GTM Playbook |
| D9 | **Beta timeline** | (a) Weeks 15-16 (2 weeks), (b) Weeks 10-16 (6 weeks) | **(b) 6 weeks starting Week 10** | For a "trust our AI" product, 2 weeks of beta is dangerously short; earlier feedback on real codebases is essential | Devil's Advocate Rec 2, overriding Product Strategy |
| D10 | **Git-blame "why" layer** | (a) Post-launch feature, (b) Required for v1 | **(b) Required for v1** | The "why" behind code is the highest-value onboarding content and the hardest for AI to generate; git history is an available data source; +2-3 weeks is worth the quality improvement | Devil's Advocate Rec 4 |
| D11 | **Open-source strategy** | (a) Fully proprietary, (b) Open-source analysis CLI, proprietary walkthrough player | **(b) Open core** | OSS CLI builds trust, creates distribution (GitHub trending, HN), and matches CodeBoarding precedent; monetize walkthrough generation + team features | GTM Playbook, Product Strategy Sec 5 |
| D12 | **Personalization approach** | (a) Build adaptive learning engine, (b) Defer to post-MVP spike | **(b) Defer** | Tech Feasibility rates as "needs spike"; over-investing before walkthrough quality is proven is explicitly a kill risk | Tech Feasibility Sec 4.5, Product Strategy Sec 1.1 |

---

## 8. Open Questions

These require real-world validation -- interviews, prototypes, or experiments -- not more desk research.

| # | Question | Why It Matters | How to Answer | Timeline |
|---|----------|---------------|---------------|----------|
| Q1 | **Will EMs pay $15/user/month for a tool 80% of the team uses once?** | Entire business model rests on per-seat pricing for point-in-time usage | 10 pricing conversations with real EMs; test per-seat vs. per-repo vs. per-event pricing; track objections | Before build (2 weeks) |
| Q2 | **What is the "architecturally meaningful error rate" on real codebases?** | Reference accuracy (95%) is easy to measure; explanation accuracy is what determines product value | Run pipeline on 10 real codebases (not clean OSS repos); senior engineer reviews each walkthrough; mark every factual error. If >10%, product is not ready. | Weeks 10-14 (during beta) |
| Q3 | **What does the product do after onboarding is complete?** | If no ongoing value, retention collapses and renewals are questioned | Map and validate 3 post-onboarding use cases with 10 senior engineers: exploring unfamiliar modules, pre-code-review prep, post-reorg self-onboarding | Before launch |
| Q4 | **Platform or plugin?** (re: Backstage/IDPs) | 80% of eng orgs will have platform teams by 2026; if IDPs become the hub, LaunchPad AI must integrate or be disintermediated | Strategic decision for founders; evaluate Backstage plugin feasibility in Month 6 | Month 6 |
| Q5 | **Should the analysis CLI be the free tier?** (local analysis, cloud rendering) | Addresses security concerns earlier; may increase trust and conversion; changes cost structure | A/B test: cloud-only free tier vs. local-CLI + cloud-rendering free tier | Month 2 |
| Q6 | **Is TypeScript-only sufficient for launch, or must Python ship simultaneously?** | Shipping one language is faster but narrows addressable market | Track waitlist language distribution; if >70% are TS-heavy, ship TS-only at Week 14 and add Python at Week 16 | Week 8 (analyze waitlist data) |
| Q7 | **What is the acceptable hallucination rate at launch?** | 95% reference accuracy target is set; but is 95% "good enough" or must it be 98%+? The answer shifts the timeline by 2-4 weeks. | Define with beta feedback: if 95% accuracy gets >40 NPS, ship it; if <30 NPS, invest in reaching 98% | Week 14 (beta data) |

---

## 9. Appendix: Source Documents

All claims in this strategy document are traceable to the following research:

| Document | Path | Key Contribution |
|----------|------|-----------------|
| Market Research | `/Users/apple/AI_Lab/research/MARKET-RESEARCH.md` | TAM/SAM/SOM, competitive landscape, buyer personas, market signals, pricing benchmarks |
| Technical Feasibility | `/Users/apple/AI_Lab/research/TECHNICAL-FEASIBILITY.md` | Component feasibility verdicts, architecture sketch, cost modeling, build timeline, technical risk register |
| Product Strategy | `/Users/apple/AI_Lab/research/PRODUCT-STRATEGY.md` | Wedge selection, positioning, pricing tiers, MVP feature scope, launch timeline, success metrics |
| GTM Playbook | `/Users/apple/AI_Lab/research/GTM-PLAYBOOK.md` | 90-day launch plan, channel strategy, content calendar, metrics framework, budget allocation |
| Devil's Advocate Review | `/Users/apple/AI_Lab/research/DEVILS-ADVOCATE-REVIEW.md` | Market size corrections, competitive threat re-assessment, cost corrections, quality risk identification, 5 killer questions, de-risking recommendations |

---

*This document synthesizes five independent research workstreams. Where sources disagreed, the more conservative position was adopted and the disagreement is noted. The document should be updated after: (1) concierge MVP results, (2) first 10 beta team feedback sessions, (3) first enterprise deal close.*
