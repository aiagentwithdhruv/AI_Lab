# Getting Started with AI Agent Teams Lab

> From zero to your first running agent team in under 10 minutes.

---

## Prerequisites

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| **Claude Code** | v2.1.32+ | Check with `claude --version` |
| **Agent Teams feature** | Enabled (see below) | Experimental flag required |
| **Terminal** | Any modern terminal | tmux or iTerm2 recommended for split-pane mode |
| **Git** | Any recent version | To clone this repo |
| **Operating System** | macOS, Linux, or Windows (WSL) | See [Platform Notes](#platform-notes) |

### Claude subscription

Agent teams spawn multiple independent Claude sessions. Each teammate consumes its own context window and tokens. A **Claude Max** subscription is strongly recommended for running prompts with 6-10 agents. Claude Pro works for smaller teams (2-3 agents) but you may hit usage limits on the larger prompts.

---

## Step 1: Enable Agent Teams

Agent teams are behind an experimental flag. You need to enable it before Claude Code will recognize team-related instructions.

### Option A: Project-level setting (recommended)

Create or edit `.claude/settings.local.json` in your project directory:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Option B: Shell environment variable

Add to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Then restart your terminal or run `source ~/.zshrc`.

### Option C: Inline (one session only)

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

### Verify it worked

Launch Claude Code and ask:

```
Can you create an agent team?
```

If enabled, Claude will confirm it can create teams. If not, it will say it does not have that capability.

---

## Step 2: Clone the Repo

```bash
git clone https://github.com/YOUR-USERNAME/ai-agent-teams-lab.git
cd ai-agent-teams-lab
```

---

## Step 3: Pick a Prompt

| Prompt | File | Agents | Best For | Difficulty |
|--------|------|--------|----------|------------|
| **TaskFlow Build** | `prompt-1-taskflow-build.md` | 8 | Building a full-stack app from scratch | Advanced |
| **LaunchPad Research** | `prompt-2-launchpad-research.md` | 6 | Market research and go-to-market strategy | Intermediate |
| **GitHub Publisher** | `prompt-3-github-publisher.md` | 6 | Packaging a repo for public release | Intermediate |
| **Fortress Security** | `prompt-4-fortress-security.md` | 10 | Enterprise security audit | Advanced |

**First-time recommendation:** Start with **LaunchPad Research**. It produces documents (not code), so there are no build failures to debug, and the adversarial review pattern is impressive to watch.

---

## Step 4: Copy-Paste into Claude Code

1. Open your terminal and launch Claude Code:
   ```bash
   claude
   ```

2. Open the prompt file you chose (e.g., `prompt-2-launchpad-research.md`).

3. Copy the **entire contents** of the prompt file.

4. Paste it into the Claude Code session.

5. Press Enter and watch.

Claude will:
- Read the prompt and understand the team structure
- Create a team with a shared task list
- Spawn each teammate as an independent session
- Assign tasks based on the dependency graph in the prompt
- Coordinate handoffs between agents via messages
- Synthesize results when all agents finish

---

## Your First Agent Team: A Walkthrough

This walkthrough uses **LaunchPad Research** (Prompt 2) as the example.

### What you will see

**Stage 1 — Team creation (0-30 seconds)**

Claude reads the prompt and announces it will create a team called `launchpad-research` with 6 teammates. You will see messages like:

```
Creating team "launchpad-research"...
Spawning teammate: market-researcher
Spawning teammate: tech-analyst
Spawning teammate: product-strategist
Spawning teammate: gtm-planner
Spawning teammate: devils-advocate
Spawning teammate: report-synthesizer
```

**Stage 2 — Parallel research (1-10 minutes)**

`market-researcher` and `tech-analyst` start immediately (no dependencies). They work in parallel, each reading files, searching the web, and writing their respective documents.

Use `Shift+Down` to cycle through teammates and see their progress in real time.

**Stage 3 — Strategy synthesis (5-15 minutes)**

Once Market Researcher and Tech Analyst finish, they message `product-strategist` with their findings. Product Strategist then combines market data with technical feasibility to define positioning, pricing, and MVP scope.

**Stage 4 — GTM planning (5-10 minutes)**

`gtm-planner` receives the strategy and builds a 90-day launch plan with channel strategies, content calendars, and metrics frameworks.

**Stage 5 — Adversarial review (5-10 minutes)**

`devils-advocate` has been collecting findings from every agent. Now it tears them apart — challenging assumptions, flagging risks, and demanding evidence. It messages all agents with critiques, and they update their documents in response.

**Stage 6 — Final synthesis (5-10 minutes)**

`report-synthesizer` waits for everyone, then reads all documents and produces a master strategy report and a one-page decision brief.

**Stage 7 — Cleanup**

The lead announces completion. You can review all deliverables in the `research/` directory.

### Expected deliverables

After a successful run, you should find these files:

```
research/
  MARKET-RESEARCH.md
  TECHNICAL-FEASIBILITY.md
  PRODUCT-STRATEGY.md
  GTM-PLAYBOOK.md
  DEVILS-ADVOCATE-REVIEW.md
  LAUNCHPAD-AI-STRATEGY.md
  DECISION-BRIEF.md
```

---

## Platform Notes

### macOS

- Fully supported. Works in Terminal.app, iTerm2, Warp, Alacritty.
- For split-pane mode: install tmux (`brew install tmux`) or use iTerm2 with the `it2` CLI and Python API enabled.
- `.DS_Store` files are automatically ignored if you use the repo's `.gitignore`.

### Linux

- Fully supported. Works in any terminal emulator.
- For split-pane mode: install tmux (`sudo apt install tmux` or equivalent).

### Windows

- Use **WSL 2** (Windows Subsystem for Linux). Native Windows terminals are not supported for split-pane mode.
- Install Claude Code inside your WSL environment.
- tmux works inside WSL for split-pane mode.
- File paths use forward slashes inside WSL.

---

## Common First-Time Mistakes

| Mistake | What happens | Fix |
|---------|-------------|-----|
| Forgetting to enable the experimental flag | Claude says it cannot create teams | Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (see Step 1) |
| Pasting only part of the prompt | Agents spawn but have incomplete instructions | Copy the **entire** prompt file, including all agent definitions and the communication flow section |
| Not having enough token budget | Agents start but get cut off mid-task | Use Claude Max for prompts with 6+ agents. Use Claude Pro only for 2-3 agent teams |
| Editing the same files as an agent | Your changes get overwritten by a teammate | Let agents finish before touching any files they own |
| Closing the terminal mid-run | Orphaned agent sessions | If using tmux, sessions survive. Otherwise, agents are lost. Run `tmux ls` to check for orphaned sessions |
| Running multiple teams at once | Only one team per session is supported | Clean up the current team before starting a new one |
| Expecting immediate results | Teams take 15-45 minutes depending on complexity | This is normal. Use `Shift+Down` to monitor progress, or switch to split-pane mode |

---

## What to Try Next

Once your first team run completes successfully:

1. **Read the output carefully.** Compare what each agent produced. Notice how the adversarial review improved the other documents.

2. **Try a different prompt.** If you started with LaunchPad Research, try GitHub Publisher next — it is the most "meta" prompt since it packages this very repo.

3. **Customize a prompt.** Change the product concept in LaunchPad Research from "LaunchPad AI" to your own product idea. The team structure stays the same; only the subject changes.

4. **Reduce team size.** Try running TaskFlow Build with 4 agents instead of 8 by combining roles. See how the output quality changes.

5. **Design your own team.** Read [ARCHITECTURE.md](ARCHITECTURE.md) for the framework, then create a prompt for your own use case.

6. **Explore the reference docs.** The deep-dive documentation covers everything:
   - [01-OVERVIEW.md](01-OVERVIEW.md) — What agent teams are and when to use them
   - [02-AGENT-TEAMS-ARCHITECTURE.md](02-AGENT-TEAMS-ARCHITECTURE.md) — Components, lifecycle, communication
   - [03-CUSTOM-AGENT-DEFINITIONS.md](03-CUSTOM-AGENT-DEFINITIONS.md) — Building custom agents
   - [04-HOOKS-AND-QUALITY-GATES.md](04-HOOKS-AND-QUALITY-GATES.md) — Enforcing quality with hooks
   - [05-PATTERNS-AND-BEST-PRACTICES.md](05-PATTERNS-AND-BEST-PRACTICES.md) — Team sizing, task design, patterns
   - [06-PROMPT-TEMPLATES-AND-EXAMPLES.md](06-PROMPT-TEMPLATES-AND-EXAMPLES.md) — Templates and examples

---

## Quick Reference

```bash
# Enable agent teams
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Launch Claude Code
claude

# Cycle through teammates (in-process mode)
Shift+Down

# Toggle task list
Ctrl+T

# Check for orphaned tmux sessions
tmux ls

# Kill an orphaned session
tmux kill-session -t <session-name>
```
