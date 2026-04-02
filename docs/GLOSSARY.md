# Glossary

Definitions for terms used throughout this repo, sorted alphabetically.

---

| Term | Definition |
|------|-----------|
| **Agent** | A single Claude Code session with its own context window, tools, and permissions. In an agent team, each teammate is an agent. |
| **Agent Team** | A coordinated group of agents working together on a shared goal, consisting of one lead and one or more teammates. |
| **Adversarial Review** | A communication pattern where one agent is explicitly tasked with challenging, critiquing, and stress-testing the work of other agents. |
| **Broadcast** | Sending a message to all teammates simultaneously. Use sparingly — token cost scales with team size. |
| **Context Window** | The maximum amount of text (tokens) an agent can hold in memory during a session. Each agent in a team has its own independent context window. |
| **Deliverable** | A concrete output file that an agent is responsible for producing (e.g., `docs/PRD.md`, `research/MARKET-RESEARCH.md`). |
| **Dependency** | A requirement that one agent or task cannot start until another agent or task completes. Dependencies define execution order. |
| **Fan-Out / Fan-In** | A pattern where one agent distributes work to multiple agents (fan-out), then a single agent collects and synthesizes all results (fan-in). |
| **Haiku** | Anthropic's fastest and most cost-effective Claude model. Best for quick lookups and simple operations, but limited in deep reasoning. |
| **Handoff** | The act of one agent finishing a phase of work and sending its output to the next agent in the chain via a message. |
| **Hook** | A shell command or check that runs at specific points in an agent's lifecycle (e.g., before going idle, when completing a task) to enforce quality gates. |
| **In-Process Mode** | The default display mode where all teammates run in a single terminal. Use `Shift+Down` to cycle between them. |
| **Lead** | The main Claude Code session in an agent team. The lead creates the team, spawns teammates, coordinates work, and synthesizes results. |
| **Mailbox** | The messaging system that enables agents to send and receive messages from each other. Messages are delivered automatically. |
| **Message** | A piece of information sent from one agent to another through the mailbox system. Messages enable coordination without shared context. |
| **Opus** | Anthropic's most capable Claude model. Best for deep reasoning, strategy, architecture, and adversarial review. Highest cost. |
| **Persona** | A description of how an agent thinks and behaves, given in the prompt to shape the style and quality of its output (e.g., "a brutally honest advisor"). |
| **Phase** | A stage in the team's execution timeline. Phases are defined by dependencies — agents in the same phase can run in parallel. |
| **Role** | The functional responsibility assigned to an agent within a team (e.g., Product Manager, Backend Dev, Devil's Advocate). |
| **Sonnet** | Anthropic's balanced Claude model, offering good capability at moderate cost. Best for implementation, documentation, and testing tasks. |
| **Split-Pane Mode** | A display mode where each teammate gets its own terminal pane via tmux or iTerm2. Requires tmux or iTerm2 with the `it2` CLI. |
| **Sub-Agent** | A child Claude session spawned by a parent session to perform a focused task. Unlike teammates, sub-agents report results only back to the parent and cannot message other sub-agents. |
| **Task** | A unit of work in the shared task list. Tasks have states (`pending`, `in_progress`, `completed`) and can depend on other tasks. |
| **Task List** | A shared, file-based list of work items that teammates can claim and complete. Stored in `~/.claude/tasks/{team-name}/`. |
| **Team** | See **Agent Team**. |
| **Teammate** | An agent spawned by the lead as part of an agent team. Teammates work independently and communicate via the mailbox. |
| **Token** | The basic unit of text processed by a Claude model. Roughly 4 characters or 0.75 words per token. Token usage scales linearly with team size. |
| **Wait-For** | A directive in a prompt specifying that an agent should not begin a task until it receives a message from one or more other agents. |
| **Worktree** | An isolated copy of the git repository. Agents with `isolation: worktree` in their definition run in a temporary worktree to avoid file conflicts. |
