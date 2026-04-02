# Claude Code Agent Teams & Custom Agents - Master Reference

> A comprehensive guide for building effective agent teams and custom subagents in Claude Code.

## Documents

| # | File | Purpose |
|---|------|---------|
| 01 | [Quick Start & Overview](01-OVERVIEW.md) | What agent teams are, when to use them vs subagents, enabling teams, first team launch |
| 02 | [Agent Teams Architecture](02-AGENT-TEAMS-ARCHITECTURE.md) | Components (lead, teammates, task list, mailbox), lifecycle, permissions, context, token costs, display modes |
| 03 | [Custom Agent Definitions](03-CUSTOM-AGENT-DEFINITIONS.md) | File format, YAML frontmatter fields, scoping, tool restrictions, model selection, MCP servers, memory, hooks |
| 04 | [Hooks & Quality Gates](04-HOOKS-AND-QUALITY-GATES.md) | TeammateIdle, TaskCompleted, SubagentStart/Stop hooks, validation scripts, exit code behavior |
| 05 | [Patterns & Best Practices](05-PATTERNS-AND-BEST-PRACTICES.md) | Team sizing, task granularity, file conflict avoidance, prompt engineering, communication patterns |
| 06 | [Prompt Templates & Examples](06-PROMPT-TEMPLATES-AND-EXAMPLES.md) | Ready-to-use team prompts, agent definition templates, real-world scenarios |

## Quick Decision Tree

```
Need parallel work?
  |
  +-- Workers need to talk to each other? --> Agent Teams (this guide)
  |
  +-- Workers just report back results? --> Subagents (simpler, cheaper)
  |
  +-- Sequential steps, shared context? --> Single session or Skills
```

## Requirements

- Claude Code v2.1.32+
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings or env
- For split panes: tmux or iTerm2 with `it2` CLI
