# 03 - Custom Agent Definitions

## File Format

Agent definitions are **Markdown files with YAML frontmatter**. The frontmatter configures the agent; the body becomes the system prompt.

```markdown
---
name: my-agent
description: When Claude should delegate to this agent
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a specialist. When invoked, do X then Y then Z.
```

## Scoping & Priority

Agents are loaded from multiple locations. When names collide, higher priority wins.

| Priority | Location | Scope | How to Create |
|----------|----------|-------|---------------|
| 1 (highest) | `--agents` CLI flag | Current session only | Pass JSON on launch |
| 2 | `.claude/agents/` | Current project | `/agents` or manual file |
| 3 | `~/.claude/agents/` | All your projects | `/agents` or manual file |
| 4 (lowest) | Plugin's `agents/` dir | Where plugin is enabled | Installed with plugins |

> Agents are loaded at session start. If you add a file manually, restart your session or use `/agents` to load immediately.

### CLI-Defined Agents (Session-Only)

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on quality, security, best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger. Analyze errors, identify root causes, provide fixes."
  }
}'
```

### Running a Session As an Agent

```bash
claude --agent code-reviewer
```

This replaces the default system prompt with the agent's prompt. `CLAUDE.md` and project memory still load normally.

Make it the project default:

```json
// .claude/settings.json
{ "agent": "code-reviewer" }
```

## All Frontmatter Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Unique identifier. Lowercase letters and hyphens only |
| `description` | Yes | string | When Claude should delegate. Write clearly - Claude uses this to decide |
| `tools` | No | comma-separated or list | Allowlist of tools. Inherits all if omitted |
| `disallowedTools` | No | comma-separated or list | Denylist. Removed from inherited/specified list |
| `model` | No | string | `sonnet`, `opus`, `haiku`, full model ID (e.g. `claude-opus-4-6`), or `inherit`. Default: `inherit` |
| `permissionMode` | No | string | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | integer | Max agentic turns before agent stops |
| `skills` | No | list | Skills to preload into agent's context at startup |
| `mcpServers` | No | list | MCP servers available to this agent (references or inline definitions) |
| `hooks` | No | object | Lifecycle hooks scoped to this agent |
| `memory` | No | string | `user`, `project`, or `local`. Enables persistent cross-session memory |
| `background` | No | boolean | Always run as background task. Default: `false` |
| `effort` | No | string | `low`, `medium`, `high`, `max` (Opus 4.6 only). Overrides session level |
| `isolation` | No | string | `worktree` - run in temporary git worktree for isolated repo copy |

## Tool Configuration

### Available Tools (Internal)

All Claude Code internal tools: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `Agent`, `WebFetch`, `WebSearch`, `NotebookEdit`, plus any MCP tools.

### Allowlist (tools)

Only these tools are available:

```yaml
tools: Read, Grep, Glob, Bash
```

### Denylist (disallowedTools)

Inherit everything except these:

```yaml
disallowedTools: Write, Edit
```

### Combined Behavior

If both are set: `disallowedTools` is applied first, then `tools` is resolved against the remaining pool.

### Restricting Which Subagents Can Be Spawned

Use `Agent(agent_type)` syntax in `tools` to control which agent types can be spawned:

```yaml
tools: Agent(worker, researcher), Read, Bash
```

- `Agent` alone (no parens) = spawn any agent
- `Agent(a, b)` = only spawn agents `a` and `b`
- Omit `Agent` entirely = cannot spawn any agents

> This only applies to agents running as the main thread via `claude --agent`.

### Disabling Specific Agents

In settings.json:

```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(my-custom-agent)"]
  }
}
```

Or via CLI:

```bash
claude --disallowedTools "Agent(Explore)"
```

## Model Selection

| Value | Behavior |
|-------|----------|
| `sonnet` | Use Sonnet (balanced speed/capability) |
| `opus` | Use Opus (highest capability) |
| `haiku` | Use Haiku (fastest, cheapest) |
| `claude-opus-4-6` | Specific model ID |
| `inherit` | Same model as main conversation (default) |

## MCP Server Scoping

Give an agent access to MCP servers not in the main conversation:

```yaml
---
name: browser-tester
description: Tests features using Playwright
mcpServers:
  # Inline: scoped to this agent only
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  # Reference: reuses already-configured server
  - github
---
```

> Define servers inline to keep their tool descriptions out of the main conversation context.

## Persistent Memory

The `memory` field gives agents a persistent directory for cross-session knowledge.

| Scope | Location | Use When |
|-------|----------|----------|
| `user` | `~/.claude/agent-memory/<name>/` | Knowledge applies across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, not checked in |

When enabled:
- System prompt includes instructions for reading/writing memory
- First 200 lines of `MEMORY.md` in the memory dir are injected
- `Read`, `Write`, `Edit` tools are auto-enabled

### Memory Tips

- `project` is the recommended default scope
- Ask agents to consult memory before starting: "Check your memory for patterns you've seen before"
- Ask agents to update memory after tasks: "Save what you learned to your memory"
- Include memory instructions in the agent's prompt:

```markdown
Update your agent memory as you discover codepaths, patterns, library
locations, and key architectural decisions. Write concise notes about
what you found and where.
```

## Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept file edits |
| `dontAsk` | Auto-deny permission prompts (explicitly allowed tools still work) |
| `bypassPermissions` | Skip all permission prompts (use with caution) |
| `plan` | Read-only exploration mode |

> If the parent uses `bypassPermissions`, it takes precedence and cannot be overridden.

## Preloading Skills

```yaml
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---

Implement API endpoints. Follow the conventions from the preloaded skills.
```

Full skill content is injected at startup. Agents don't inherit skills from the parent - list them explicitly.

## Built-In Agents Reference

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| **Explore** | Haiku | Read-only (no Write/Edit) | Fast codebase search and analysis |
| **Plan** | Inherit | Read-only (no Write/Edit) | Research for plan mode |
| **general-purpose** | Inherit | All | Complex multi-step tasks |
| **Bash** | Inherit | Bash | Terminal commands in separate context |
| **statusline-setup** | Sonnet | Read, Edit | `/statusline` configuration |
| **Claude Code Guide** | Haiku | Read-only subset | Questions about Claude Code features |

## Foreground vs Background Agents

| Mode | Behavior | Permissions | Clarifying Questions |
|------|----------|-------------|---------------------|
| **Foreground** | Blocks main conversation | Prompts passed through to user | Passed through |
| **Background** | Runs concurrently | Pre-approved before launch; auto-denies others | Tool call fails, agent continues |

- Claude decides fg/bg based on task
- Override: "run this in the background" or `Ctrl+B`
- Set `background: true` in frontmatter to always run in background
- Disable all background tasks: `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`
