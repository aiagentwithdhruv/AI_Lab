<div align="center">

# AI Agent Teams Lab

### Copy-paste prompts that turn Claude into coordinated AI agent teams.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Prompts](https://img.shields.io/badge/Prompts-4-blue.svg)](#prompts-at-a-glance)
[![Made with Claude](https://img.shields.io/badge/Made%20with-Claude-blueviolet.svg)](https://claude.ai)

</div>

---

**What You'll Find Here**

- 4 ready-to-use multi-agent prompts you can paste directly into Claude Code
- Real working output — a full-stack TaskFlow app and a complete market research report
- Architecture docs explaining how agent teams coordinate, hand off work, and deliver results
- Templates and patterns for building your own agent teams

---

## Why This Exists

**Single-agent AI is shallow.** You paste a big prompt, get a big response, and then spend hours fixing what it got wrong. The more complex the task, the worse this gets. One agent trying to be an architect, developer, tester, and reviewer all at once produces mediocre results across the board.

**Structured multi-agent teams fix this.** Instead of one agent doing everything, you define a team — each agent has a clear role, specific deliverables, and explicit handoffs to the next agent. An architect designs the system. A developer builds it. A reviewer checks the work. Each agent is focused, accountable, and builds on what came before.

**Who is this for?**

- **Developers** who want to ship real projects faster with Claude Code
- **AI enthusiasts** curious about multi-agent coordination patterns
- **Teams** looking for repeatable workflows they can customize and extend

---

## Prompts at a Glance

| Prompt | Agents | Type | What It Builds |
|--------|--------|------|----------------|
| [TaskFlow Build](prompts/01-taskflow-build/) | 8 | Full-Stack Dev | Project management dashboard with auth, kanban boards, team management, and analytics |
| [LaunchPad Research](prompts/02-launchpad-research/) | 6 | Research & Strategy | Deep market research, product strategy, technical feasibility, GTM playbook, and adversarial review |
| [GitHub Publisher](prompts/03-github-publisher/) | 6 | Repo Automation | Transforms a workspace into a professionally structured, publicly shareable GitHub repo |
| [Fortress Security](prompts/04-fortress-security/) | 10 | Security Audit | Enterprise-grade security audits, threat modeling, pen testing, compliance mapping, and incident response |

---

## Quick Start (Under 60 Seconds)

**Prerequisites:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with agent teams enabled.

**Step 1:** Clone the repo.

```bash
git clone https://github.com/aiagentwithdhruv/AI_Lab.git
cd AI_Lab
```

**Step 2:** Enable the agent teams experimental feature.

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

**Step 3:** Pick a prompt and copy it.

```bash
# Example: copy the TaskFlow Build prompt
cat prompts/01-taskflow-build/prompt.md | pbcopy
```

**Step 4:** Paste it into Claude Code and let the agents run.

```bash
claude
# Paste the prompt when Claude is ready
```

That's it. The agents will coordinate, hand off work, and deliver the final result.

---

## How Agent Teams Work

An **agent team** is a group of AI agents that work together on a single complex task. Each agent has a defined role (like "Architect" or "Security Auditor"), a set of responsibilities, and clear inputs and outputs. Think of it like a well-run engineering team — everyone knows their job, and work flows from one person to the next.

**Communication happens through structured handoffs.** When Agent 1 (say, the Architect) finishes designing the system, it produces a deliverable — a design doc, a schema, a set of specs. Agent 2 (the Developer) picks up that deliverable as its input and builds from it. There is no ambiguous back-and-forth. Each agent receives context, does its work, and passes results forward.

**Dependencies keep things ordered.** Some agents can work in parallel (a frontend developer and a backend developer can build simultaneously if the API contract is defined). Others must wait (the tester can't test until the developer ships code). The prompt structure encodes these dependencies so Claude knows what to run and when.

**The result is dramatically better output.** Instead of one agent producing a surface-level attempt at everything, you get deep, focused work at each stage — architecture that's actually thought through, code that follows the architecture, tests that actually catch bugs, and reviews that actually improve quality.

For the full technical breakdown, see [Architecture docs](docs/02-AGENT-TEAMS-ARCHITECTURE.md).

---

## Prompt Deep Dives

### TaskFlow Build

Eight agents collaborate to build a complete project management dashboard from scratch. You get authentication, kanban boards, team management, analytics, and a polished UI — all from a single prompt. The agents span architecture, backend, frontend, database, testing, and code review.

[Read more &rarr;](prompts/01-taskflow-build/)

### LaunchPad Research

Six agents conduct a thorough market research and product strategy engagement. The team covers market analysis, competitive intelligence, product positioning, technical feasibility, go-to-market planning, and a final adversarial review that stress-tests every assumption.

[Read more &rarr;](prompts/02-launchpad-research/)

### GitHub Publisher

Six agents transform a messy workspace into a clean, professional GitHub repository. They handle repo structure, documentation, CI/CD configuration, code quality tooling, and release packaging — turning your project into something you'd be proud to share publicly.

[Read more &rarr;](prompts/03-github-publisher/)

### Fortress Security

Ten agents perform an enterprise-grade security audit. The team covers threat modeling, static analysis, dependency scanning, penetration testing, compliance mapping (SOC 2, GDPR, HIPAA), infrastructure review, and incident response planning. This is the most comprehensive prompt in the collection.

[Read more &rarr;](prompts/04-fortress-security/)

---

## Customizing Prompts

Every prompt is a Markdown file you can edit freely. Here are common modifications:

**Adjust agent count.** If a prompt has 8 agents and you want a lighter run, remove agents you don't need. For example, drop the "Analytics Agent" from TaskFlow Build if you don't need a dashboard. Just delete that agent's section from the prompt.

**Change the model or parameters.** If you want agents to use specific model settings, add instructions at the top of the prompt. Claude Code will respect model directives included in your prompt text.

**Swap in your own product concept.** The prompts use example products (a project management tool, a SaaS product). Replace the product descriptions with your own — the agent roles and workflow stay the same, but the output targets your idea.

**Add new agents.** Follow the pattern in existing prompts: give the agent a name, a role description, input dependencies, responsibilities, and expected deliverables. Insert it into the agent sequence where it logically fits.

See [Patterns and Best Practices](docs/05-PATTERNS-AND-BEST-PRACTICES.md) and [Prompt Templates](docs/06-PROMPT-TEMPLATES-AND-EXAMPLES.md) for more guidance.

---

## Examples & Output

The [examples/](examples/) folder contains quick-start and advanced usage examples to help you get going.

Want to see what these prompts actually produce? Check out the real output included in this repo:

- **[TaskFlow/](TaskFlow/)** — A working full-stack project management app built entirely by the TaskFlow Build prompt's 8-agent team.
- **[research/](research/)** — A complete market research and product strategy report generated by the LaunchPad Research prompt's 6-agent team.

These aren't mockups. They're actual agent output, committed as-is.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Index](docs/00-INDEX.md) | Documentation table of contents |
| [Overview](docs/01-OVERVIEW.md) | High-level introduction to the project |
| [Architecture](docs/02-AGENT-TEAMS-ARCHITECTURE.md) | How agent teams are structured and coordinate |
| [Custom Agent Definitions](docs/03-CUSTOM-AGENT-DEFINITIONS.md) | Defining your own agents |
| [Hooks & Quality Gates](docs/04-HOOKS-AND-QUALITY-GATES.md) | Validation checkpoints between agents |
| [Patterns & Best Practices](docs/05-PATTERNS-AND-BEST-PRACTICES.md) | Proven patterns for effective agent teams |
| [Prompt Templates & Examples](docs/06-PROMPT-TEMPLATES-AND-EXAMPLES.md) | Starter templates for new prompts |

---

## Contributing

Contributions are welcome — whether it's a new prompt, a bug fix, improved docs, or a better pattern.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License & Credits

This project is licensed under the [MIT License](LICENSE). Use it, modify it, share it.

Built with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) by [@aiagentwithdhruv](https://github.com/aiagentwithdhruv).

---

If this repo helped you build something cool, give it a star. It helps others find it and keeps the project going.
