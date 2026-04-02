# 01 - Quick Start & Overview

## What Are Agent Teams?

Agent teams coordinate **multiple independent Claude Code sessions** working together. One session is the **team lead** that spawns **teammates**, assigns tasks, and synthesizes results. Each teammate has its own context window, tools, and permissions.

### Agent Teams vs Subagents

| Aspect | Subagents | Agent Teams |
|--------|-----------|-------------|
| **Context** | Own context; results return to caller | Own context; fully independent |
| **Communication** | Report results back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list with self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion & collaboration |
| **Token cost** | Lower: results summarized back to main context | Higher: each teammate is a separate Claude instance |
| **Nesting** | Cannot spawn other subagents | Cannot spawn nested teams |

**Rule of thumb:** Use subagents when workers just report back. Use agent teams when workers need to share findings, challenge each other, and coordinate independently.

## Enabling Agent Teams

Add to your settings (project-local recommended):

```json
// .claude/settings.local.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or set in your shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

## Your First Agent Team

Tell Claude to create a team in natural language:

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Claude will:
1. Create the team with a shared task list
2. Spawn teammates for each role
3. Have them work in parallel
4. Synthesize findings when done
5. Clean up the team

### Interacting With Teammates

- **In-process mode** (default): `Shift+Down` to cycle through teammates, type to message directly. `Ctrl+T` toggles the task list.
- **Split-pane mode**: Each teammate gets its own tmux/iTerm2 pane. Click to interact.

## When To Use Agent Teams

### Strong Use Cases

| Use Case | Why It Works |
|----------|-------------|
| Research & review | Multiple angles explored simultaneously |
| New modules/features | Each teammate owns separate files, no conflicts |
| Debugging competing hypotheses | Parallel investigation, adversarial debate |
| Cross-layer coordination | Frontend, backend, tests each owned by different teammate |

### When NOT To Use Teams

- Sequential tasks with dependencies between each step
- Same-file edits (causes overwrites)
- Simple tasks where coordination overhead exceeds benefit
- When token cost is a concern (each teammate = separate context window)

## Starting & Stopping Teams

### Two Ways Teams Start

1. **You request it** - explicitly ask Claude to create a team
2. **Claude proposes it** - Claude suggests a team for complex parallel work; you confirm

Claude never creates a team without your approval.

### Shutting Down

```
Ask the researcher teammate to shut down
```

Then clean up:

```
Clean up the team
```

> Always use the lead to clean up. Teammates should not run cleanup - their team context may not resolve correctly.
