# 04 - Hooks & Quality Gates

## Overview

Hooks are shell commands (or prompt/agent checks) that run at specific points in an agent's lifecycle. They enforce quality gates, validate operations, and control behavior.

## Agent Team Hooks

These hooks are specific to agent teams and are configured in `settings.json`.

### TeammateIdle

**Fires when:** A teammate is about to go idle after finishing its turn.

**Use for:** Enforcing quality gates before a teammate stops working (e.g., build artifacts must exist, lint must pass).

**Input (stdin JSON):**

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../session.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "TeammateIdle",
  "teammate_name": "researcher",
  "team_name": "my-project"
}
```

**Control behavior:**

| Action | How | Effect |
|--------|-----|--------|
| Keep teammate working | Exit code `2` + stderr message | Teammate receives stderr as feedback and continues |
| Stop teammate entirely | JSON `{"continue": false, "stopReason": "..."}` | Teammate stops, reason shown to user |
| Allow idle | Exit code `0` | Teammate goes idle normally |

**Example: Require build artifact before idle**

```bash
#!/bin/bash
# .claude/hooks/validate-build.sh

if [ ! -f "./dist/output.js" ]; then
  echo "Build artifact missing. Run the build before stopping." >&2
  exit 2  # Teammate gets feedback and continues
fi

exit 0
```

### TaskCompleted

**Fires when:** A task is being marked as completed (either explicitly via TaskUpdate tool, or when a teammate finishes its turn with in-progress tasks).

**Use for:** Enforcing completion criteria like passing tests or lint checks.

**Input (stdin JSON):**

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../session.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "TaskCompleted",
  "task_id": "task-001",
  "task_subject": "Implement user authentication",
  "task_description": "Add login and signup endpoints",
  "teammate_name": "implementer",
  "team_name": "my-project"
}
```

**Control behavior:**

| Action | How | Effect |
|--------|-----|--------|
| Block completion | Exit code `2` + stderr message | Task stays incomplete, model gets feedback |
| Stop teammate | JSON `{"continue": false, "stopReason": "..."}` | Teammate stops entirely |
| Allow completion | Exit code `0` | Task is marked complete |

**Example: Block completion until tests pass**

```bash
#!/bin/bash
# .claude/hooks/check-tests.sh

INPUT=$(cat)
TASK_SUBJECT=$(echo "$INPUT" | jq -r '.task_subject')

if ! npm test 2>&1; then
  echo "Tests not passing. Fix failing tests before completing: $TASK_SUBJECT" >&2
  exit 2
fi

exit 0
```

### Configuration in settings.json

```json
{
  "hooks": {
    "TeammateIdle": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-build.sh"
          }
        ]
      }
    ],
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-tests.sh"
          }
        ]
      }
    ]
  }
}
```

## Subagent Lifecycle Hooks (settings.json)

These hooks fire in the **main session** when subagents start or stop.

### SubagentStart

**Fires when:** A subagent begins execution.
**Matcher:** Agent type name.

### SubagentStop

**Fires when:** A subagent completes.
**Matcher:** Agent type name.

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [
          { "type": "command", "command": "./scripts/setup-db-connection.sh" }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          { "type": "command", "command": "./scripts/cleanup-db-connection.sh" }
        ]
      }
    ]
  }
}
```

## Agent-Scoped Hooks (Frontmatter)

Hooks defined in an agent's YAML frontmatter run **only while that agent is active**.

### Supported Events in Frontmatter

| Event | Matcher Input | When It Fires |
|-------|---------------|---------------|
| `PreToolUse` | Tool name | Before the agent uses a tool |
| `PostToolUse` | Tool name | After the agent uses a tool |
| `Stop` | (none) | When agent finishes (converted to SubagentStop at runtime) |

### Example: Validate Commands + Auto-Lint

```yaml
---
name: code-reviewer
description: Review code changes with automatic linting
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh $TOOL_INPUT"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---
```

### Example: Read-Only Database Queries

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

Validation script:

```bash
#!/bin/bash
# ./scripts/validate-readonly-query.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block SQL write operations (case-insensitive)
if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|REPLACE|MERGE)\b' > /dev/null; then
  echo "Blocked: Write operations not allowed. Use SELECT queries only." >&2
  exit 2
fi

exit 0
```

## Hook Types Reference

| Type | Description | Available In |
|------|-------------|-------------|
| `command` | Runs a shell command | All hook events |
| `prompt` | Evaluates a condition with LLM | Tool events only (PreToolUse, PostToolUse, PermissionRequest) |
| `agent` | Runs an agent with tools | Tool events only |

## Exit Code Behavior

| Exit Code | Meaning |
|-----------|---------|
| `0` | Success - allow the action |
| `1` | Error - hook failed (logged, but action proceeds) |
| `2` | Block - prevent the action, feed stderr back to model as feedback |

## Hook JSON Output Format

Hooks can return JSON to control behavior:

```json
{
  "systemMessage": "Warning shown to user in UI",
  "continue": false,
  "stopReason": "Message shown when blocking",
  "suppressOutput": false,
  "decision": "block",
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Context injected back to model"
  }
}
```

## All Hook Events Reference

| Event | Matcher | Purpose |
|-------|---------|---------|
| `PreToolUse` | Tool name | Run before tool, can block |
| `PostToolUse` | Tool name | Run after successful tool |
| `PostToolUseFailure` | Tool name | Run after tool fails |
| `PermissionRequest` | Tool name | Run before permission prompt |
| `Notification` | Notification type | Run on notifications |
| `Stop` | - | When Claude stops |
| `PreCompact` | "manual"/"auto" | Before compaction |
| `PostCompact` | "manual"/"auto" | After compaction |
| `UserPromptSubmit` | - | When user submits |
| `SessionStart` | - | When session starts |
| `SubagentStart` | Agent type name | When subagent begins |
| `SubagentStop` | Agent type name | When subagent completes |
| `TeammateIdle` | - | When teammate about to go idle |
| `TaskCompleted` | - | When task being marked complete |
