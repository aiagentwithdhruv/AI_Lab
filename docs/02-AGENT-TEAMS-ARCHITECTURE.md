# 02 - Agent Teams Architecture

## Core Components

| Component | Role | Storage |
|-----------|------|---------|
| **Team Lead** | Main Claude Code session. Creates team, spawns teammates, coordinates work, synthesizes results | N/A (your active session) |
| **Teammates** | Separate Claude Code instances, each with own context window | Spawned as child processes |
| **Task List** | Shared work items teammates claim and complete | `~/.claude/tasks/{team-name}/` |
| **Mailbox** | Messaging system for inter-agent communication | Automatic delivery |
| **Team Config** | Member registry with names, agent IDs, agent types | `~/.claude/teams/{team-name}/config.json` |

## Team Lifecycle

```
1. User requests team (or Claude proposes, user confirms)
       |
2. Lead creates team config + shared task list
       |
3. Lead spawns teammates (each loads CLAUDE.md, MCP servers, skills)
       |
4. Lead assigns tasks OR teammates self-claim from shared list
       |
5. Teammates work independently, message each other as needed
       |
6. Lead monitors progress, synthesizes results
       |
7. User asks lead to shut down teammates
       |
8. Lead cleans up team resources
```

## Task System

### Task States

| State | Meaning |
|-------|---------|
| `pending` | Not started, waiting to be claimed |
| `in_progress` | Claimed by a teammate, actively being worked on |
| `completed` | Finished |

### Task Dependencies

Tasks can depend on other tasks. A pending task with unresolved dependencies cannot be claimed until those dependencies are completed. The system manages unblocking automatically.

### Task Claiming

- **Lead assigns**: Tell the lead which task to give to which teammate
- **Self-claim**: After finishing a task, a teammate picks up the next unassigned, unblocked task
- **Concurrency-safe**: File locking prevents race conditions when multiple teammates try to claim the same task

## Display Modes

| Mode | How It Works | Setup Required |
|------|-------------|----------------|
| **in-process** (default) | All teammates in one terminal. `Shift+Down` to cycle, `Ctrl+T` for task list | None |
| **split panes (tmux)** | Each teammate gets own pane. Click to interact | tmux installed |
| **split panes (iTerm2)** | Each teammate gets own pane via iTerm2 | iTerm2 + `it2` CLI + Python API enabled |
| **auto** (default setting) | Uses split panes if already in tmux, otherwise in-process | Depends |

### Configuring Display Mode

```json
// settings.json
{
  "teammateMode": "in-process"  // or "tmux" or "auto"
}
```

Or per-session:

```bash
claude --teammate-mode in-process
```

## Permissions

- Teammates **inherit** the lead's permission settings at spawn time
- If lead uses `--dangerously-skip-permissions`, all teammates do too
- You can change individual teammate modes **after** spawning
- You **cannot** set per-teammate modes at spawn time

## Context & Communication

### What Teammates Get At Spawn

- Project context: `CLAUDE.md`, MCP servers, skills (same as regular session)
- Spawn prompt from the lead
- **NOT** the lead's conversation history

### Communication Mechanisms

| Mechanism | Description |
|-----------|-------------|
| **Automatic message delivery** | Messages sent between teammates are delivered automatically; lead doesn't need to poll |
| **Idle notifications** | When a teammate finishes and stops, it auto-notifies the lead |
| **Shared task list** | All agents can see task status and claim available work |
| **Direct messaging** | Send a message to one specific teammate |
| **Broadcast** | Send to all teammates simultaneously (use sparingly - costs scale with team size) |

### Plan Approval Flow

For complex/risky tasks, require teammates to plan before implementing:

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

Flow:
1. Teammate works in read-only plan mode
2. Teammate sends plan approval request to lead
3. Lead reviews and approves or rejects with feedback
4. If rejected, teammate revises and resubmits
5. Once approved, teammate exits plan mode and implements

Influence approval criteria via prompt: "only approve plans that include test coverage"

## Token Usage

- Each teammate has its own full context window
- Token usage scales **linearly** with number of active teammates
- For research/review/new features: usually worthwhile
- For routine tasks: single session is more cost-effective

## Known Limitations

| Limitation | Impact |
|------------|--------|
| No session resumption with in-process teammates | `/resume` and `/rewind` don't restore teammates. Spawn new ones after resume. |
| Task status can lag | Teammates sometimes fail to mark tasks complete. Nudge manually. |
| Shutdown can be slow | Teammates finish current request before shutting down. |
| One team per session | Clean up current team before starting a new one. |
| No nested teams | Teammates cannot spawn their own teams. |
| Lead is fixed | Cannot promote teammate to lead or transfer leadership. |
| Permissions set at spawn | All teammates start with lead's mode. Change individually after. |
| Split panes: tmux/iTerm2 only | Not supported in VS Code terminal, Windows Terminal, or Ghostty. |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Teammates not appearing | `Shift+Down` to check in-process mode; verify task complexity warrants a team; check tmux: `which tmux` |
| Too many permission prompts | Pre-approve common operations in permission settings before spawning |
| Teammates stopping on errors | Check output via `Shift+Down` or pane click; give instructions or spawn replacement |
| Lead shuts down too early | Tell lead to wait for teammates before proceeding |
| Orphaned tmux sessions | `tmux ls` then `tmux kill-session -t <session-name>` |
