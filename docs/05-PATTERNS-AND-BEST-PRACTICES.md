# 05 - Patterns & Best Practices

## Team Sizing

### General Guidelines

| Team Size | Best For | Tasks Per Teammate |
|-----------|----------|-------------------|
| 2-3 | Focused work, debate between perspectives | 5-6 each |
| 3-5 | Most workflows (recommended default) | 5-6 each |
| 5+ | Only when work genuinely benefits from scale | Diminishing returns |

**Rule:** 3 focused teammates often outperform 5 scattered ones. Start small, scale only when parallel work adds real value.

### Sizing Formula

```
If you have N independent tasks:
  teammates = ceil(N / 5)
  cap at 5 unless tasks are truly independent
```

## Task Granularity

### The Goldilocks Zone

| Size | Problem | Example |
|------|---------|---------|
| Too small | Coordination overhead > benefit | "Add a semicolon to line 42" |
| Too large | Work too long without check-ins, wasted effort risk | "Rewrite the entire backend" |
| Just right | Self-contained, clear deliverable | "Implement the auth endpoint with tests" |

Good task = produces a clear deliverable (a function, a test file, a review report).

### Task Splitting Tips

- If a teammate works > 15 min without a check-in, task is probably too large
- If the lead isn't creating enough tasks, tell it: "Split the work into smaller pieces"
- Having 5-6 tasks per teammate keeps everyone productive and lets the lead reassign if someone gets stuck

## Avoiding File Conflicts

**The #1 source of agent team problems: two teammates editing the same file.**

### Strategies

1. **Ownership by file/module**: Each teammate owns a different set of files

```
Teammate A: src/auth/ (all auth files)
Teammate B: src/api/ (all API routes)
Teammate C: tests/ (all test files)
```

2. **Ownership by layer**: Each teammate owns a different layer

```
Teammate A: Frontend components
Teammate B: Backend services
Teammate C: Database migrations + tests
```

3. **Sequential for shared files**: If files MUST be shared, make those tasks sequential (use task dependencies)

4. **New files only**: For greenfield work, each teammate creates new files rather than editing existing ones

## Prompt Engineering for Teams

### Give Teammates Enough Context

Teammates DON'T inherit the lead's conversation history. Include everything they need in the spawn prompt:

```
Spawn a security reviewer with the prompt: "Review the authentication
module at src/auth/ for security vulnerabilities. Focus on token handling,
session management, and input validation. The app uses JWT tokens stored
in httpOnly cookies. Report issues with severity ratings."
```

### Specify Models When It Matters

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Control the Lead's Behavior

| Problem | Solution Prompt |
|---------|----------------|
| Lead implements instead of delegating | "Wait for your teammates to complete their tasks before proceeding" |
| Lead shuts down too early | "Don't clean up until all teammates have reported their findings" |
| Teammates overlap | "Ensure each teammate works on different files - no overlapping ownership" |
| Need approval flow | "Require plan approval before they make any changes" |
| Want criteria for approval | "Only approve plans that include test coverage" |

## Communication Patterns

### Direct Messaging

Best for targeted questions between specific teammates:

```
Have the frontend teammate ask the API teammate about the response format for /users
```

### Broadcasting

Sends to ALL teammates. Use sparingly (cost scales with team size):

```
Broadcast to all teammates: the database schema has changed, update your queries
```

### Adversarial Debate

Powerful for debugging and decision-making:

```
Spawn 5 agent teammates to investigate different hypotheses. Have them
talk to each other to try to disprove each other's theories, like a
scientific debate. Update the findings doc with whatever consensus emerges.
```

This combats anchoring bias - with multiple investigators actively trying to disprove each other, the surviving theory is more likely correct.

## Agent Definition Patterns

### Read-Only Reviewer

```yaml
---
name: reviewer
description: Reviews code for quality. Use proactively after changes.
tools: Read, Grep, Glob, Bash
model: sonnet
---
```

No `Write` or `Edit` = can't modify code. Safe to run on any codebase.

### Domain Specialist

```yaml
---
name: data-scientist
description: Data analysis expert for SQL and BigQuery
tools: Bash, Read, Write
model: sonnet
---
```

Specific tools for the domain. Detailed prompt about the workflow.

### Validated Writer

```yaml
---
name: db-writer
description: Write database queries with validation
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-query.sh"
---
```

Uses hooks for fine-grained control when `tools` field is too coarse.

### Memory-Enabled Learner

```yaml
---
name: code-reviewer
description: Reviews code, accumulates project knowledge
tools: Read, Grep, Glob, Bash
memory: project
---

Review code and update your memory with patterns, conventions,
and recurring issues you discover.
```

Gets smarter over time as memory accumulates.

## Workflow Patterns

### Pattern 1: Parallel Research, Sequential Synthesis

```
Create a team to analyze our authentication system:
- Teammate 1: Review current implementation
- Teammate 2: Research industry best practices
- Teammate 3: Audit for security vulnerabilities
Have each report findings, then synthesize into recommendations.
```

### Pattern 2: Build + Verify

```
Create a team:
- 3 builders implementing different modules
- 1 reviewer that checks each module after completion
Use task dependencies so review tasks depend on build tasks.
```

### Pattern 3: Competing Implementations

```
Spawn 2 teammates to each implement the caching layer differently.
Teammate A: Redis-based approach
Teammate B: In-memory with LRU eviction
Have them document tradeoffs, then we'll pick the winner.
```

### Pattern 4: Cross-Layer Feature

```
Create a team for the user profile feature:
- Frontend teammate: React components in src/components/profile/
- Backend teammate: API endpoints in src/api/profile/
- Test teammate: Integration tests in tests/profile/
Each owns their own files. No overlap.
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running teams for simple tasks | Use single session or subagents instead |
| Not pre-approving permissions | Set up permission rules before spawning to reduce prompts |
| Letting teams run unattended too long | Check in periodically, redirect approaches that aren't working |
| Teammates editing same files | Break work by file/module ownership |
| Starting with implementation | Start with research/review tasks to learn the workflow |
| Too many teammates | Start with 3-5, scale only when justified |
| Vague spawn prompts | Include specific file paths, context, and expected output format |
| Not using task dependencies | Dependent tasks should be marked as such to prevent premature claiming |

## Getting Started Progression

1. **Start with research/review** - Low risk, clear boundaries, shows parallel value
2. **Try debugging with competing hypotheses** - Multiple angles, adversarial debate
3. **Move to new module implementation** - Each teammate owns separate files
4. **Graduate to cross-layer features** - Frontend + backend + tests in parallel
