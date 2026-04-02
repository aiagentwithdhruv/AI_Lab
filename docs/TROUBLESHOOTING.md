# Troubleshooting

Common problems and their fixes, organized by category. Each entry follows the pattern: **Problem**, **Cause**, **Fix**.

---

## Agent Teams Not Working

### Agent teams feature not recognized

**Problem:** Claude says it cannot create teams, or treats the prompt as a single-agent task.

**Cause:** The experimental flag `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is not set or not set to `1`.

**Fix:** Enable the flag in one of these ways:
```json
// .claude/settings.local.json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```
```bash
# Or in your shell
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```
Restart Claude Code after making the change.

---

### Claude Code version too old

**Problem:** The experimental flag is set but agent teams still do not work.

**Cause:** Your Claude Code version is below v2.1.32, which is the minimum version that supports agent teams.

**Fix:** Update Claude Code:
```bash
claude update
claude --version  # Verify v2.1.32+
```

---

## Spawning Issues

### Teammate not spawning

**Problem:** The lead announces it will spawn a teammate, but the teammate never appears.

**Cause:** Common causes include hitting a rate limit, running out of concurrent session capacity, or a permissions issue.

**Fix:**
1. Check if you are at your plan's session limit (Claude Pro has lower limits than Max).
2. Try reducing the team size — spawn fewer agents.
3. Restart Claude Code and try again with a smaller team first to confirm spawning works.

---

### Too many permission prompts when spawning

**Problem:** Every teammate triggers multiple permission prompts before it can start working.

**Cause:** Teammates inherit the lead's permission settings, but tool-specific permissions may not be pre-approved.

**Fix:** Pre-approve common operations in `.claude/settings.local.json` before starting the team:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git:*)",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep"
    ]
  }
}
```

---

## Communication Issues

### Agent not waiting for messages

**Problem:** An agent starts working immediately instead of waiting for messages from upstream agents.

**Cause:** The "Wait for" instruction in the prompt is not explicit enough, or the agent interprets its tasks as independent.

**Fix:** Strengthen the wait instruction in the prompt. Instead of:
```
**Wait for:** Message from Product Manager.
```
Use:
```
**Wait for:** DO NOT begin any tasks until you receive a message from Product Manager
containing the P0 feature list. Read the message carefully before proceeding.
```

---

### Messages not delivered between teammates

**Problem:** An agent sends a message but the receiving agent never acknowledges it.

**Cause:** The receiving agent may have already finished and gone idle, or it may be deep in a long task and has not checked for new messages.

**Fix:**
1. Use `Shift+Down` to check the receiving agent's status.
2. If the agent is idle, tell the lead to nudge it: "Tell [agent name] to check for messages."
3. If the agent finished before the message arrived, you may need to spawn a replacement or tell the lead to forward the information.

---

### Agents talking past each other

**Problem:** Agents send messages but the content is too vague to be useful, leading to misaligned work.

**Cause:** The handoff instructions in the prompt do not specify what information to include in the message.

**Fix:** Be explicit about message contents in the prompt:
```
**When done:** Message Backend Dev with:
- The complete API contract (every endpoint, method, path, request/response shapes)
- The database schema (all tables, columns, relationships)
- Any deviations from the initial design
```

---

## Output Quality Issues

### Output is too generic or shallow

**Problem:** Agent produces surface-level content that reads like a template rather than substantive analysis.

**Cause:** The agent's persona and task descriptions are too vague. Without specific instructions, agents default to generic output.

**Fix:** Add a stronger persona with domain expertise and explicit quality standards:
```
**Persona:** You are a principal engineer who has built and scaled 3 developer
tools. You think about what's technically possible today vs. what's vapor.
You're allergic to handwaving. Every claim must have specifics — no "this
should be straightforward" without explaining exactly how.
```

---

### Agents duplicating each other's work

**Problem:** Two or more agents produce overlapping content or edit the same files.

**Cause:** Deliverable ownership is not clearly defined, or agent task boundaries overlap.

**Fix:**
1. Ensure each agent has a unique deliverable file that no other agent writes to.
2. Add explicit ownership boundaries: "You own `src/api/`. Do NOT edit files outside this directory."
3. If file sharing is unavoidable, use task dependencies to make the edits sequential rather than parallel.

---

### Agent ignoring its persona

**Problem:** An agent with a "Devil's Advocate" role produces positive, agreeable output instead of challenging findings.

**Cause:** The persona instructions are not strong enough, or the agent is defaulting to helpful behavior.

**Fix:** Make the adversarial mandate unmistakable:
```
**Your job is NOT to be encouraging — it's to find the holes before the market
does. If your review is all green lights, you are failing at your job. Find at
least 5 substantive issues with each document you review.**
```

---

## Context and Performance Issues

### Context window exceeded

**Problem:** An agent stops mid-task or produces truncated output because it ran out of context.

**Cause:** The agent accumulated too much text in its context window — from reading large files, long conversations, or verbose output.

**Fix:**
1. **Reduce agent scope:** Split the agent's tasks across two agents.
2. **Use Sonnet for simpler roles:** Sonnet has the same context window but processes it faster.
3. **Limit input size:** Tell agents to read only the sections they need rather than entire files.
4. **Be specific in spawn prompts:** Include only the information the agent needs, not everything.

---

### Run taking much longer than expected

**Problem:** The team has been running for over an hour with no sign of completing.

**Cause:** Common causes include agents looping on errors, waiting for messages that were never sent, or doing more work than intended.

**Fix:**
1. Use `Shift+Down` to check each agent's status.
2. Look for agents that are stuck in retry loops or waiting indefinitely.
3. Message stuck agents directly with guidance or tell the lead to redirect them.
4. If an agent is doing unnecessary work, message it to stop and move on.

---

### Token cost higher than expected

**Problem:** The run consumed significantly more tokens than anticipated.

**Cause:** Each agent is a separate Claude session. Adversarial review patterns cause additional rounds of revision. Broadcasting to all agents multiplies cost by team size.

**Fix:**
1. Use Sonnet instead of Opus for agents that do straightforward work.
2. Reduce team size — combine roles where possible.
3. Limit broadcast messages — use direct messages to specific agents instead.
4. Reduce adversarial review iterations — tell the Devil's Advocate to send critiques once, not repeatedly.

---

## tmux and Display Issues

### Split panes not appearing

**Problem:** You expected split panes for each agent, but everything is running in a single terminal.

**Cause:** tmux is not installed, or Claude Code is not running inside a tmux session, or the display mode is set to `in-process`.

**Fix:**
1. Install tmux: `brew install tmux` (macOS) or `sudo apt install tmux` (Linux).
2. Start a tmux session before launching Claude Code: `tmux new -s agents`.
3. Or set the display mode explicitly:
```json
{ "teammateMode": "tmux" }
```

---

### Orphaned tmux sessions after a crash

**Problem:** Agent sessions remain running in tmux after Claude Code exits unexpectedly.

**Cause:** The lead did not have a chance to clean up the team before the session ended.

**Fix:**
```bash
# List all tmux sessions
tmux ls

# Kill specific orphaned sessions
tmux kill-session -t <session-name>

# Kill ALL tmux sessions (nuclear option)
tmux kill-server
```

---

### Cannot see what agents are doing (in-process mode)

**Problem:** The terminal shows only the lead's output and you cannot see teammate activity.

**Cause:** In-process mode shows one agent at a time by default.

**Fix:** Use `Shift+Down` to cycle through teammates. Use `Ctrl+T` to toggle the task list, which shows the status of all tasks and which agent is working on each one.

---

## Prompt-Specific Issues

### TaskFlow Build: App does not start after completion

**Problem:** `npm run dev` fails or the app does not load at `http://localhost:3000`.

**Cause:** The DevOps agent may not have successfully wired the frontend and backend, or there are missing dependencies.

**Fix:**
1. Check `docs/build-summary.md` for known issues documented by the DevOps agent.
2. Run `cd src/api && npm install` and `cd src/client && npm install` separately.
3. Start backend and frontend individually to isolate the error.
4. Check for port conflicts (3000 and 3001).

---

### LaunchPad Research: Devil's Advocate review is too mild

**Problem:** The adversarial review reads like a compliment rather than a challenge.

**Cause:** The adversarial persona was not strong enough, or the agent deferred to the other agents' work.

**Fix:** Add an explicit quality bar to the Devil's Advocate instructions:
```
You MUST identify at least 5 substantive problems with each document.
Your final verdict must include a list of "Killer Questions" that the team
cannot answer. If you cannot find real issues, you are not looking hard enough.
```

---

### Fortress Security: Agents overwhelming each other with messages

**Problem:** With 10 agents, the message volume becomes chaotic and agents spend more time reading messages than doing work.

**Cause:** The communication graph is too densely connected — too many agents are messaging too many other agents.

**Fix:** Reduce cross-communication. Have agents message only their direct dependents, not the entire team. Use the lead as a message hub for broadcast-style updates instead of having each agent broadcast independently.
