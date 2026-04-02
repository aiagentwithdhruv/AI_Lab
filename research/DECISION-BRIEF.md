# Decision Brief: Should We Build LaunchPad AI?

**Date:** 2026-03-24
**Prepared for:** Founding team / investors
**Decision required by:** Before committing engineering resources (Week 0)
**Sources:** Master Strategy Document (synthesizing Market Research, Technical Feasibility, Product Strategy, GTM Playbook, Devil's Advocate Review)

---

## The Question

Should we invest 4 months of engineering time (2 senior engineers) and $15K-$25K in GTM budget to build and launch LaunchPad AI -- an AI-powered platform that auto-generates interactive codebase walkthroughs for developer onboarding?

---

## Three Options

### Option A: Full Build (16-week MVP, all 9 must-have features)

**What it means:** Ship the complete MVP as scoped in the Product Strategy: repo connection, analysis pipeline (TS + Python), AI-generated walkthroughs with validation, interactive player, dependency diagrams, team workspaces, shareable URLs, and feedback mechanism. Launch with PLG free tier + $15/user Team tier. Target: 400 activated accounts, 15-20 paid customers, $8K-$12K MRR by Day 90.

| Pros | Cons |
|------|------|
| First mover in an empty competitive quadrant (high code understanding + interactive learning) | 16 weeks with zero margin for error; LLM pipeline is the most likely schedule risk |
| Market pain is validated: $480K-$750K/year onboarding cost at target companies | Walkthrough quality may be "demo good, not depend-on good" -- the "why" gap is hard |
| Technical components are proven (tree-sitter, SCIP, CodeMirror, LLM APIs) | GitHub Copilot could ship competing feature in 6-12 months |
| $5M-$8M ARR Year 3 outcome puts this in top 5% of dev tool startups | Per-seat pricing on a point-in-time product creates structural retention risk |
| Swimm's $8.8M ARR after 5 years proves market exists but is underpenetrated | Buyer willingness to pay for this specific solution is assumed, not proven |
| Cost structure is viable: $6-$8/user COGS at $15/seat = 47-60% gross margins (small teams), improving at scale | Free tier economics depend on 8-10% conversion (top of industry range) |

**Total investment:** ~$200K-$300K (2 engineers x 4 months @ $100-$150K fully loaded each + $25K GTM)
**Probability of $1M ARR in 18 months:** 15-25%
**Probability of $0 (product fails to find PMF):** 30-40%

---

### Option B: Reduced Scope MVP (8 weeks to concierge-validated core + 8 weeks to product)

**What it means:** Spend 2 weeks running a concierge MVP (manually generate walkthroughs for 5 target companies using tree-sitter CLI + GPT-4 + manual editing, charge $500 each). If 3 of 5 pay, proceed with a narrower product: TypeScript-only, analysis pipeline + walkthrough player only (no diagrams, no team features, no free tier). Ship as a waitlist-gated beta at Week 10. Expand to full MVP by Week 16 based on beta learnings.

| Pros | Cons |
|------|------|
| Validates willingness to pay before writing product code (kills the #1 risk) | 2-week delay before engineering starts; competitors are not waiting |
| Concierge learnings directly inform walkthrough quality and prompt engineering | Narrower scope means less impressive launch; harder to get press/PH traction |
| TypeScript-only reduces analysis pipeline complexity by ~30% | Excludes Python shops from launch; reduces addressable market |
| 6-week beta window (Week 10-16) provides real-world quality data | No free tier means no PLG motion at launch; must rely on direct sales |
| Lower burn: if concierge fails, total waste is 2 weeks + $500 in LLM costs | If concierge succeeds, still on the same 16-week clock for full product |
| Directly answers 3 of the 5 killer questions from Devil's Advocate before committing | Slower path to market in a time-competitive landscape |

**Total investment (if concierge validates):** ~$200K-$300K (same as Option A, but 2 weeks later with higher confidence)
**Total investment (if concierge fails):** ~$5K (2 weeks of founder time + LLM costs)
**Probability of $1M ARR in 18 months:** 20-30% (higher confidence per dollar invested)
**Probability of $0:** 20-30% (lower because bad signal kills the project early)

---

### Option C: Don't Build

**What it means:** The research reveals structural risks that cannot be mitigated by execution alone. Walk away and apply resources to a different opportunity.

| Pros | Cons |
|------|------|
| Preserves capital for a higher-conviction bet | Abandons an empty competitive quadrant with validated pain |
| Avoids the usage cliff problem (onboarding is one-time, retention is structural) | Someone else will build this; Swimm or a new entrant will ship auto-generation |
| Avoids racing GitHub Copilot with a 6-12 month window | The "why" gap and quality concerns apply to every AI-generated content play, not just this one |
| No risk of building a product that is "good enough to demo, not good enough to depend on" | Market timing is favorable now (AI buyer adoption, remote-first onboarding needs) and may not persist |

**Recommended only if:** (1) The founding team does not have 2 senior engineers who can ship in 16 weeks, (2) the team has a higher-conviction opportunity competing for the same resources, or (3) the concierge MVP from Option B fails (0 of 5 companies pay).

---

## Recommendation: Option B (Reduced Scope MVP)

**Reasoning:**

1. **The #1 risk is not technical -- it is demand.** Every technical component is proven. The integration is hard but standard engineering. What is not proven: will engineering managers pay $15/user/month for AI-generated walkthroughs that cover the "what" of code but struggle with the "why"? The concierge MVP answers this in 2 weeks for $500.

2. **The concierge MVP is the highest-ROI activity available.** If 3 of 5 companies pay $500 for manually generated walkthroughs, you have validated: (a) the pain is acute enough to pay for, (b) the output quality bar required, (c) what the AI must get right (and what it currently gets wrong), and (d) which personas actually use the output and how. This data is worth more than any amount of additional research.

3. **The 2-week delay is cheap insurance.** If the concierge fails, you save 4 months of engineering time (~$200K). If it succeeds, you start building with validated demand, real prompt engineering data from 5 real codebases, and 5 potential case study customers. The cost of the delay is negligible against the cost of building the wrong thing.

4. **TypeScript-first is the right narrowing.** The mid-market SaaS target (Series B-D, 50-200 engineers) skews heavily toward TypeScript/React/Node.js stacks. Python can follow in Week 16. Shipping one language well beats shipping two languages at 80%.

5. **Starting beta at Week 10 addresses the quality risk.** The Devil's Advocate correctly identifies that 2 weeks of beta (the original plan) is insufficient for a product whose value proposition is "trust our AI output." Six weeks of beta on real codebases with real new hires is the minimum to know whether walkthrough quality is good enough.

---

## If the Answer Is Yes: Next 5 Actions

### Action 1: Run the Concierge MVP (Week 0-2)

**Owner:** Founder
**What:** Identify 5 companies matching ICP (50-200 engineers, TypeScript/Python, hired 5+ engineers last quarter). Offer to generate a custom codebase walkthrough for $500. Use the open-source CLI (tree-sitter + SCIP) for structural analysis, GPT-4 for narration, and manual editing to get quality right. Deliver as a web page or PDF.
**Success criteria:** 3 of 5 companies pay. At least 1 new hire at each company uses the walkthrough and provides feedback.
**Kill criteria:** 0 of 5 pay, or all 5 say "interesting but not worth paying for."

### Action 2: Start Engineering with "Why" Layer Built In (Week 2)

**Owner:** Engineering lead
**What:** Begin the analysis pipeline with git-blame integration from Day 1 (commit messages, PR descriptions, linked issues per code region). This is the architectural decision that separates "this file handles auth" from "this file handles auth -- migrated from Auth0 in Q3 2025 (PR #482)." The +2-3 weeks are non-negotiable.
**Deliverable:** Analysis pipeline for TypeScript that outputs code graph + git context by Week 8.

### Action 3: Design Multi-Tenancy Isolation (Week 2)

**Owner:** Engineering lead
**What:** Before writing the first line of product code, design strict tenant isolation for the code graph, vector store, and LLM context. Document how embeddings, cached prompts, and generated content are scoped to prevent cross-customer contamination. This is a launch blocker that the current architecture does not address.
**Deliverable:** Tenant isolation design doc reviewed by Week 3.

### Action 4: Begin Beta Recruitment (Week 2-4)

**Owner:** Founder
**What:** From concierge MVP participants and waitlist, recruit 10-15 beta teams. Criteria: 30-150 engineers, TypeScript primary, at least 1 new hire in next 60 days. Offer free Team tier for 6 months in exchange for weekly 15-min feedback calls and a case study commitment. Beta starts at Week 10 with rough product.
**Deliverable:** 10 teams confirmed by Week 4.

### Action 5: Model the Downside and Set Kill Criteria (Week 0)

**Owner:** Founder
**What:** Create the "50% of targets" financial model: 200 signups, 8 paid customers, $4K MRR at Day 90. Calculate runway at that scenario. Write down, today, the decision rules: (a) at what MRR by what date do you raise, (b) at what MRR do you pivot pricing, (c) at what MRR do you shut down. Record these while thinking clearly, before sunk cost fallacy kicks in.
**Deliverable:** One-page financial model with explicit go/no-go thresholds, written before any code is committed.

---

## Summary

| | Option A (Full Build) | Option B (Concierge + Build) | Option C (Don't Build) |
|--|----------------------|----------------------------|----------------------|
| **Time to market** | 16 weeks | 18 weeks (2-week validation delay) | N/A |
| **Capital at risk** | $200K-$300K | $5K (if concierge fails) / $200K-$300K (if it succeeds) | $0 |
| **Demand validation** | Post-launch (hope-based) | Pre-build (evidence-based) | N/A |
| **Quality validation** | 2-week beta (dangerous) | 6-week beta (adequate) | N/A |
| **Risk profile** | Higher risk, same reward | Lower risk, same reward (minus 2 weeks) | Zero risk, zero reward |
| **Recommendation** | | **RECOMMENDED** | |

The opportunity is real. The pain is quantified. The competitive window is open. But the window is measured in months, not years, and the product quality bar is unforgiving. Option B gives you the fastest path to conviction -- or the cheapest path to walking away.

---

*Prepared from synthesis of 5 research documents. All claims sourced. See Master Strategy Document (`/Users/apple/AI_Lab/research/LAUNCHPAD-AI-STRATEGY.md`) for full analysis, risk register, and decision log.*
