# 06 - Prompt Templates & Examples

## Agent Team Prompts (Copy & Customize)

### Parallel Code Review

```
Create an agent team to review PR #__. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review independently and report findings.
Wait for all teammates before synthesizing.
```

### Competing Hypothesis Debugging

```
Users report [SYMPTOM]. Spawn 5 agent teammates to investigate
different hypotheses. Have them talk to each other to try to
disprove each other's theories, like a scientific debate.
Update the findings doc with whatever consensus emerges.
```

### Cross-Layer Feature Implementation

```
Create a team for the [FEATURE] feature:
- Frontend teammate: React components in src/components/[feature]/
- Backend teammate: API endpoints in src/api/[feature]/
- Test teammate: Integration tests in tests/[feature]/
Each owns their own files. No overlap. Use Sonnet for all.
Require plan approval before implementation begins.
```

### Research & Design Exploration

```
I'm designing [PRODUCT/FEATURE]. Create an agent team to explore
this from different angles:
- One teammate on UX and user experience
- One on technical architecture and feasibility
- One playing devil's advocate, challenging assumptions
Have them discuss and debate, then synthesize into a recommendation.
```

### Codebase Audit

```
Create a team to audit our codebase:
- Teammate 1: Security audit (OWASP top 10, secrets, injection)
- Teammate 2: Performance audit (N+1 queries, memory leaks, bottlenecks)
- Teammate 3: Code quality (duplication, complexity, test coverage)
- Teammate 4: Dependency audit (outdated packages, vulnerabilities)
Each teammate should produce a report with severity ratings.
```

### Migration Planning

```
Create a team to plan migration from [OLD] to [NEW]:
- Researcher: Map all usages of [OLD] across the codebase
- Architect: Design the migration strategy and ordering
- Risk analyst: Identify breaking changes and rollback plan
Have them coordinate. Researcher shares findings with architect,
architect's plan reviewed by risk analyst.
```

---

## Custom Agent Definition Templates

### Code Reviewer (Read-Only)

```markdown
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### Debugger (Read + Write)

```markdown
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not the symptoms.
```

### Data Scientist

```markdown
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

### Database Query Validator (Hook-Guarded)

```markdown
---
name: db-reader
description: Execute read-only database queries. Use when analyzing data or generating reports.
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---

You are a database analyst with read-only access. Execute SELECT queries
to answer questions about the data.

When asked to analyze data:
1. Identify which tables contain the relevant data
2. Write efficient SELECT queries with appropriate filters
3. Present results clearly with context

You cannot modify data. If asked to INSERT, UPDATE, DELETE, or modify
schema, explain that you only have read access.
```

### Test Runner

```markdown
---
name: test-runner
description: Runs tests, writes missing tests, and validates code quality. Use after code changes to verify nothing is broken.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
---

You are a testing specialist. Your job is to ensure code quality through testing.

When invoked:
1. Run the existing test suite first
2. Analyze any failures
3. If asked to write tests, follow existing test patterns in the project
4. Verify all tests pass after changes

Testing priorities:
- Unit tests for new functions/methods
- Integration tests for API endpoints
- Edge cases and error paths
- Regression tests for bug fixes

Report format:
- Tests run: X passed, Y failed, Z skipped
- Failures: root cause + suggested fix for each
- Coverage gaps: untested code paths identified
```

### Security Auditor

```markdown
---
name: security-auditor
description: Audits code for security vulnerabilities including OWASP Top 10, secrets exposure, injection flaws, and auth issues.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a security specialist conducting code audits.

When invoked, systematically check for:

OWASP Top 10:
1. Injection (SQL, NoSQL, OS command, LDAP)
2. Broken authentication
3. Sensitive data exposure
4. XML External Entities (XXE)
5. Broken access control
6. Security misconfiguration
7. Cross-Site Scripting (XSS)
8. Insecure deserialization
9. Using components with known vulnerabilities
10. Insufficient logging & monitoring

Additional checks:
- Hardcoded secrets, API keys, passwords
- Insecure dependencies (check package.json/requirements.txt)
- Missing input validation
- Insecure file operations
- Race conditions
- Information leakage in error messages

Report format:
- CRITICAL: Immediate action required
- HIGH: Fix before next release
- MEDIUM: Plan to fix
- LOW: Improvement opportunity

Include: location, description, proof of concept, remediation steps.
```

### Architecture Researcher (Memory-Enabled)

```markdown
---
name: architect
description: Researches codebase architecture, maps dependencies, and documents system design. Accumulates knowledge over time.
tools: Read, Grep, Glob, Bash
model: sonnet
memory: project
---

You are a software architect who builds deep understanding of codebases.

When invoked:
1. Check your memory for prior knowledge about this codebase
2. Explore the areas relevant to the current question
3. Map dependencies and data flow
4. Document findings
5. Update your memory with new discoveries

What to track in memory:
- Module boundaries and responsibilities
- Key abstractions and interfaces
- Data flow between components
- Configuration patterns
- Deployment architecture
- Known pain points and tech debt

Always consult your memory before starting fresh exploration.
After completing a task, save what you learned.
```

---

## Validation Script Templates

### Read-Only SQL Validator

```bash
#!/bin/bash
# ./scripts/validate-readonly-query.sh
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|REPLACE|MERGE)\b' > /dev/null; then
  echo "Blocked: Write operations not allowed. Use SELECT queries only." >&2
  exit 2
fi

exit 0
```

### Build Artifact Check (TeammateIdle)

```bash
#!/bin/bash
# .claude/hooks/validate-build.sh

if [ ! -f "./dist/output.js" ]; then
  echo "Build artifact missing. Run the build before stopping." >&2
  exit 2
fi

exit 0
```

### Test Gate (TaskCompleted)

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

### Lint Gate (PostToolUse)

```bash
#!/bin/bash
# .claude/hooks/run-linter.sh

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')

if [ -z "$FILE" ]; then
  exit 0
fi

# Run linter on the modified file
npx eslint "$FILE" --fix 2>/dev/null || true
```

---

## Settings.json Templates

### Minimal Agent Teams Setup

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Full Agent Teams Setup With Quality Gates

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "in-process",
  "hooks": {
    "TeammateIdle": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/validate-build.sh"
          }
        ]
      }
    ],
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/check-tests.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; npx prettier --write \"$f\"; } 2>/dev/null || true"
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git:*)"
    ]
  }
}
```
