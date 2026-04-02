# Frequently Asked Questions

---

## Setup

### What version of Claude Code do I need?

Claude Code v2.1.32 or later. Check your version with `claude --version`. Agent teams are not available in earlier versions.

### How do I enable agent teams?

Set the experimental flag in one of three ways:

1. **Project settings** (recommended): Add `"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"` to `.claude/settings.local.json` under `"env"`.
2. **Shell variable**: `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in your shell profile.
3. **Inline**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude` for a single session.

See [GETTING-STARTED.md](GETTING-STARTED.md) for full instructions.

### Do I need Claude Pro or Claude Max?

You can use agent teams with Claude Pro, but prompts with 6+ agents will likely hit usage limits before completing. **Claude Max is strongly recommended** for the prompts in this repo, especially TaskFlow Build (8 agents) and Fortress Security (10 agents). For smaller custom teams (2-3 agents), Pro is usually sufficient.

### Does this work on Windows?

Yes, through WSL 2 (Windows Subsystem for Linux). Native Windows terminals are not supported for split-pane mode. Install Claude Code inside your WSL environment and use tmux for the best experience.

### Can I use this in VS Code's integrated terminal?

Yes, for in-process mode (the default). Split-pane mode requires tmux or iTerm2, which are not available in the VS Code terminal. Agent teams will still work — you just will not get separate panes for each teammate.

---

## Usage

### What model should I use?

All prompts in this repo are designed for **Opus** (the most capable model). You can substitute **Sonnet** for agents that do simpler work (documentation formatting, file organization) to reduce cost. **Haiku** is suitable only for agents that do fast, narrow lookups — not for agents that need to reason deeply, write strategy documents, or coordinate with other agents.

| Model | Best for | Trade-off |
|-------|----------|-----------|
| Opus | Strategy, architecture, adversarial review, synthesis | Most capable, highest cost |
| Sonnet | Implementation, documentation, formatting, testing | Good balance of speed and capability |
| Haiku | Quick lookups, simple file operations, code search | Fastest and cheapest, but limited reasoning |

### How many agents is too many?

The recommended range is 3-6 agents. The prompts in this repo push to 8 and 10 agents for specific reasons (full-stack builds and enterprise security audits have genuinely independent workstreams). Above 6 agents, you get diminishing returns — coordination overhead increases and token cost scales linearly with team size.

**Rule of thumb:** Start with 3 agents. Add more only when you can clearly articulate what independent work the new agent would do that no existing agent covers.

### Can agents actually message each other?

Yes. Agents use an automatic message delivery system (the mailbox). Any agent can send a message to any other agent by name. The lead does not need to relay messages. This is the key differentiator between agent teams and sub-agents.

### How long does a typical run take?

| Prompt | Typical duration | Primary factor |
|--------|-----------------|----------------|
| TaskFlow Build | 30-60 minutes | Code generation and wiring |
| LaunchPad Research | 20-40 minutes | Research depth and adversarial review |
| GitHub Publisher | 15-30 minutes | File reorganization and content writing |
| Fortress Security | 30-60 minutes | Security analysis depth |

Actual time varies based on model speed, task complexity, and how much revision the adversarial reviewer triggers.

### What if an agent gets stuck?

Use `Shift+Down` to cycle to the stuck agent and see what it is doing. Common fixes:

- **Agent is waiting for a message that was never sent:** Check if the upstream agent finished. If it did but forgot to send the message, tell the lead to nudge it.
- **Agent is looping on an error:** Read the error in the agent's output and give it specific guidance.
- **Agent ran out of context:** The agent may have consumed its context window. Spawn a replacement with a tighter prompt.

You can also message the agent directly to redirect it or tell the lead to shut it down and spawn a replacement.

### Can I interact with individual teammates?

Yes. In **in-process mode**, use `Shift+Down` to cycle through teammates and type to message them directly. In **split-pane mode** (tmux/iTerm2), click on the pane for the agent you want to interact with.

### What happens if I close my terminal mid-run?

- **Without tmux:** All agents are lost. You will need to start over.
- **With tmux:** Your tmux sessions survive. Reattach with `tmux attach` to resume monitoring. However, if agents were mid-task, their state may be inconsistent.

---

## Customization

### How do I change the product/topic while keeping the team structure?

The team structure (roles, dependencies, communication flow) is independent of the subject matter. To reuse a prompt for a different project:

1. Open the prompt file.
2. Replace the product name and description in the Goal section.
3. Update any product-specific details in individual agent task descriptions.
4. Keep the agent roster, communication flow, and constraints unchanged.

For example, you can change LaunchPad Research from analyzing "LaunchPad AI" to analyzing your own product idea by updating the Goal and product references.

### How do I add a new agent to an existing team?

1. Add a new agent section to the prompt following the template (Role, Persona, Phase, Tasks, Deliverable).
2. Define what the new agent waits for (dependencies) and who it messages when done (handoffs).
3. Update the Communication Flow diagram to include the new agent.
4. Update the Final Deliverables table.

See the agent team design framework in [ARCHITECTURE.md](ARCHITECTURE.md) for guidance.

### How do I remove an agent from a team?

1. Delete the agent's section from the prompt.
2. Reassign any tasks that were unique to that agent to another agent.
3. Update any agents that depended on the removed agent's messages — redirect them to wherever that information will now come from.
4. Update the Communication Flow diagram and Final Deliverables table.

### Can I mix models within a team?

Yes. Each agent can use a different model. Use Opus for agents that need deep reasoning (architects, strategists, adversarial reviewers) and Sonnet for agents that do more mechanical work (formatters, test runners, file organizers). Specify the model in the prompt: "Use Sonnet for this teammate."

### How do I create a prompt from scratch?

Follow the framework in [ARCHITECTURE.md](ARCHITECTURE.md#designing-your-own-agent-team). The key steps are:

1. Define the goal and deliverables
2. Decompose into roles
3. Map dependencies
4. Assign deliverables (one per agent, no shared files)
5. Define handoffs
6. Add adversarial review (optional)
7. Add a synthesizer (optional)

Use the [CONTRIBUTING.md](../CONTRIBUTING.md) template for formatting.

---

## Troubleshooting

### The agents are not being created — Claude just does the work itself

This usually means agent teams are not enabled. Verify the experimental flag is set:

```bash
echo $CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
```

If it returns empty or `0`, see [Step 1 in Getting Started](GETTING-STARTED.md#step-1-enable-agent-teams).

### Agents are duplicating each other's work

The prompt needs clearer ownership boundaries. Make sure:
- Each agent has a unique deliverable file that no other agent writes to.
- Each agent's tasks do not overlap with another agent's tasks.
- The communication flow diagram clearly shows who sends what to whom.

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more issues and fixes.

### What is the cost of running these prompts?

Token cost scales linearly with the number of agents. Each agent is a full independent Claude session consuming its own context window. A rough estimate:

| Prompt | Agents | Estimated tokens (total across all agents) |
|--------|--------|-------------------------------------------|
| TaskFlow Build | 8 | 400K-800K |
| LaunchPad Research | 6 | 300K-600K |
| GitHub Publisher | 6 | 200K-500K |
| Fortress Security | 10 | 500K-1M |

Actual usage depends on task complexity, how many revisions the adversarial reviewer triggers, and how much context each agent accumulates. Use Claude Max to avoid hitting rate limits.

### Can I run this with tools other than Claude Code?

These prompts are designed specifically for Claude Code's agent teams feature (the mailbox system, shared task list, and teammate spawning). They will not work as-is in other tools. However, the prompt structures, role definitions, and communication patterns are transferable concepts — you could adapt them for other multi-agent frameworks like CrewAI, AutoGen, or LangGraph with significant rewriting.

### Is there a way to resume a failed run?

Not directly. Claude Code's `/resume` and `/rewind` commands do not restore teammates. If a run fails partway through, your best options are:

1. **Restart with the same prompt** — agents will recreate any missing deliverables.
2. **Modify the prompt** to skip completed work — remove agents whose deliverables already exist and adjust dependencies accordingly.
3. **Run individual agents manually** — copy just one agent's instructions and run them in a regular Claude Code session to fill in the gap.
