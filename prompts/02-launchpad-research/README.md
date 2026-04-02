# Prompt 02: LaunchPad Research

**6 agents conduct deep market research and go-to-market strategy for a SaaS product.**

This prompt explores whether to build "LaunchPad AI" -- an AI-powered developer onboarding platform that auto-generates interactive codebase walkthroughs, architecture diagrams, and personalized learning paths for new engineers. The team produces a complete research package with adversarial review, culminating in a decision brief.

**Tags:** `#research` `#strategy` `#gtm` `#market-analysis`

---

## Agent Roster

| # | Agent | Role | Key Responsibility |
|---|-------|------|--------------------|
| 1 | **Market Researcher** | Market analyst | TAM/SAM/SOM analysis, competitive landscape, buyer personas, demand signals |
| 2 | **Technical Feasibility Analyst** | Principal engineer | Build-vs-buy analysis, architecture sketch, feasibility verdicts per feature |
| 3 | **Product Strategist** | Product lead | Wedge opportunity, positioning, pricing strategy, MVP feature scoping |
| 4 | **GTM Strategist** | Growth marketer | 90-day launch plan, channel strategy, content calendar, metrics framework |
| 5 | **Devil's Advocate** | Adversarial reviewer | Challenges every assumption, produces risk heat map and go/no-go verdict |
| 6 | **Executive Synthesizer** | Report writer | Master strategy document and 1-page decision brief |

---

## Communication Flow

```
Phase 1: Parallel Research (no dependencies)
  Market Researcher ──→ findings ──→ Product Strategist + Devil's Advocate
  Tech Feasibility Analyst ──→ verdicts ──→ Product Strategist + Devil's Advocate

Phase 2: Strategy Synthesis
  Product Strategist ──→ strategy ──→ GTM Strategist + Devil's Advocate

Phase 3: GTM Planning
  GTM Strategist ──→ playbook ──→ Devil's Advocate
  GTM Strategist ──→ ready ──→ Executive Synthesizer

Phase 4: Adversarial Review
  Devil's Advocate ──→ critiques ──→ ALL other agents (they update docs)
  Devil's Advocate ──→ ready ──→ Executive Synthesizer

Phase 5: Final Synthesis
  Executive Synthesizer ──→ master report + decision brief
```

---

## Expected Deliverables

| Deliverable | Owner |
|-------------|-------|
| `research/MARKET-RESEARCH.md` | Market Researcher |
| `research/TECHNICAL-FEASIBILITY.md` | Technical Feasibility Analyst |
| `research/PRODUCT-STRATEGY.md` | Product Strategist |
| `research/GTM-PLAYBOOK.md` | GTM Strategist |
| `research/DEVILS-ADVOCATE-REVIEW.md` | Devil's Advocate |
| `research/LAUNCHPAD-AI-STRATEGY.md` | Executive Synthesizer |
| `research/DECISION-BRIEF.md` | Executive Synthesizer |

---

## How to Use

1. Copy the contents of [`prompt.md`](./prompt.md) into Claude Code with agent teams enabled.
2. All agents use the Opus model.
3. The agents will self-organize through the five phases above.
4. The final output is the master strategy document and the 1-page decision brief.

## How to Customize

- **Swap the product concept.** Replace "LaunchPad AI" with any product idea you want to research. Update the Goal section and let the agents adapt.
- **Change the market focus.** The prompt targets B2B developer tools. Adjust buyer personas and competitive landscape instructions for your domain.
- **Add or remove agents.** Drop the GTM Strategist if you only need research (not launch planning). Add a Financial Modeler agent for revenue projections.
- **Adjust the Devil's Advocate intensity.** The prompt instructs this agent to be "brutally honest." Soften or sharpen the persona to control review depth.
