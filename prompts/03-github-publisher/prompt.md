# Prompt 3: Multi-Agent GitHub Repository Publisher — "Ship It Beautiful"

## Goal

Take everything in the current workspace — prompts, docs, research, code — and transform it into a **professionally structured, publicly shareable GitHub repository** that makes anyone who lands on it think: "This is exactly what I needed."

The end result should be a **public GitHub repo** with a stunning README, clear navigation, proper folder structure, usage examples, visual diagrams, and contributor-friendly setup — so that anyone from a beginner to an experienced developer can clone it, understand it, and start using it within 5 minutes.

Create a team called **"github-publisher"** with 6 teammates. Use **Opus** for each teammate.

---

## Why This Matters

> A great project with a bad README is invisible. A good project with a great README gets starred, forked, shared, and remembered. This team doesn't just push code — it **packages knowledge** so others can actually use it.

---

## Agent Roster

---

### Agent 1: Repo Researcher (`repo-researcher`)

**Persona:** You are an open-source strategist who has studied 500+ trending GitHub repos. You know exactly what makes a repo go from 0 stars to 1,000. You reverse-engineer what works.

**Phase:** Starts immediately (no dependencies).

**Tasks:**

1. **Audit the Current Workspace** — Read every file in the project directory:
   - List all existing files with a 1-line summary of each
   - Identify what's ready to publish vs. what needs cleanup
   - Flag any sensitive data, hardcoded paths, or personal info that must NOT go public
   - Note any missing files that a professional repo would need (LICENSE, .gitignore, CONTRIBUTING.md, etc.)

2. **Research Best Practices** — Study what top-tier GitHub repos do:
   - README patterns from repos with 10k+ stars (structure, badges, visuals, tone)
   - Folder structures used by popular multi-prompt / AI-agent repos
   - What makes a repo "beginner-friendly" (quick start, examples, FAQ)
   - What makes a repo "expert-friendly" (architecture docs, API reference, advanced config)
   - Badge conventions (license, build status, stars, etc.)

3. **Competitive Repo Analysis** — Find 5 similar repos (AI agents, prompt collections, multi-agent systems) and document:
   - Repo name, stars, folder structure
   - What their README does well
   - What their README is missing
   - How they organize prompts / examples

4. **Write findings** to `docs/REPO-RESEARCH.md` with:
   - Current workspace audit results
   - Top 10 README best practices with examples
   - Recommended folder structure (with rationale)
   - List of all files to create / rename / move / delete

5. **When done:** Message **Repo Architect** with the recommended folder structure and file inventory. Message **README Writer** with the best practices research. Message **Quality Reviewer** with the audit findings.

**Deliverable:** `docs/REPO-RESEARCH.md`

---

### Agent 2: Repo Architect (`repo-architect`)

**Persona:** You are a systems organizer who thinks in folder trees, naming conventions, and information architecture. Your repos are so well-structured that people understand the project just from the file tree.

**Phase:** Waits for message from **Repo Researcher** (folder structure recommendation + file inventory).

**Tasks:**

1. **Design the Folder Structure** — Create the definitive directory layout:
   ```
   /
   ├── README.md                    # Main entry point (the hero)
   ├── LICENSE                      # MIT or Apache 2.0
   ├── .gitignore                   # Proper ignores for Node, Python, macOS, IDE files
   ├── CONTRIBUTING.md              # How to contribute
   ├── CODE_OF_CONDUCT.md           # Community standards
   ├── CHANGELOG.md                 # Version history
   │
   ├── prompts/                     # All agent team prompts
   │   ├── README.md                # Index of all prompts with descriptions
   │   ├── 01-taskflow-build/       # Prompt 1
   │   │   ├── README.md            # Quick overview + how to use
   │   │   └── prompt.md            # The full prompt
   │   ├── 02-launchpad-research/   # Prompt 2
   │   │   ├── README.md
   │   │   └── prompt.md
   │   └── 03-github-publisher/     # Prompt 3 (this one — meta!)
   │       ├── README.md
   │       └── prompt.md
   │
   ├── docs/                        # Supporting documentation
   │   ├── ARCHITECTURE.md          # How agent teams work (concepts, patterns)
   │   ├── GETTING-STARTED.md       # Step-by-step first-time setup
   │   ├── FAQ.md                   # Common questions answered
   │   ├── GLOSSARY.md              # Terms: agent, team, message, handoff, etc.
   │   └── TROUBLESHOOTING.md       # Common issues and fixes
   │
   ├── examples/                    # Ready-to-run examples
   │   ├── README.md                # Index of examples
   │   ├── quick-start/             # Minimal 2-agent example to try first
   │   └── advanced/                # Complex multi-agent patterns
   │
   └── assets/                      # Images, diagrams, banners
       ├── banner.png               # Repo banner for README
       ├── architecture-diagram.png # Visual system overview
       └── screenshots/             # Output screenshots
   ```

2. **Move and Rename Files** — Reorganize existing files into the new structure:
   - Move `prompt-1-taskflow-build.md` → `prompts/01-taskflow-build/prompt.md`
   - Move `prompt-2-launchpad-research.md` → `prompts/02-launchpad-research/prompt.md`
   - Move `prompt-3-github-publisher.md` → `prompts/03-github-publisher/prompt.md`
   - Move relevant docs from `docs/` into the new layout
   - Delete any redundant / duplicate files (like the combined `prompt.md` if it still exists)

3. **Create Scaffolding Files:**
   - `.gitignore` — comprehensive for Node.js, Python, macOS, VSCode, JetBrains, .env, .DS_Store
   - `LICENSE` — MIT license with correct year and author name
   - `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
   - `CHANGELOG.md` — Initial release entry

4. **Create Prompt Index** — Write `prompts/README.md`:
   - Table listing all prompts with: name, agent count, difficulty, use case, link
   - Quick comparison: when to use which prompt
   - Tags for easy scanning (e.g., `#full-stack` `#research` `#devops`)

5. **When done:** Message **README Writer** with the finalized folder structure and file locations. Message **Docs Writer** with the list of docs to create. Message **Quality Reviewer** with the complete file tree.

**Deliverable:** Reorganized repo structure, scaffolding files, `prompts/README.md`

---

### Agent 3: README Writer (`readme-writer`)

**Persona:** You are a developer advocate who writes READMEs that people actually read. You know that most visitors spend 10 seconds before deciding to stay or leave. Every line has to earn attention. You write with clarity, not cleverness.

**Phase:** Waits for messages from **Repo Researcher** (best practices) and **Repo Architect** (folder structure + file locations).

**Tasks:**

1. **Write the Main README.md** — This is the hero document. Structure it as:

   **Section 1: Hero Block**
   - Project name + one-line description (what it does in under 15 words)
   - Badges: license, stars, forks, last commit, PRs welcome
   - A "What You'll Find Here" bullet list (3-4 items max)

   **Section 2: Why This Exists**
   - The problem: single-agent AI sessions are shallow and uncoordinated
   - The solution: structured multi-agent teams with roles, handoffs, and deliverables
   - Who this is for (with specific examples: "If you've ever wanted to...")

   **Section 3: Prompts at a Glance**
   - Visual table or card layout showing each prompt:
     | Prompt | Agents | Type | What It Builds |
   - Each row links to the prompt's folder

   **Section 4: Quick Start (under 60 seconds)**
   - Prerequisites (Claude Code / Claude with agent teams feature)
   - Step 1: Clone the repo
   - Step 2: Pick a prompt
   - Step 3: Copy-paste into Claude
   - Step 4: Watch the agents work
   - Include a copy-friendly code block with the exact commands

   **Section 5: How Agent Teams Work**
   - Brief explanation of the core concepts (3-4 paragraphs max):
     - What is an agent team?
     - How do agents communicate via messages?
     - What are handoffs and dependencies?
   - Link to `docs/ARCHITECTURE.md` for deep dive

   **Section 6: Prompt Deep Dives**
   - Short description of each prompt with a "Read more →" link
   - Highlight what makes each one interesting

   **Section 7: Customizing Prompts**
   - How to modify agent count, model (Opus/Sonnet/Haiku), roles
   - How to swap the product concept while keeping the team structure
   - How to add your own agents to an existing prompt

   **Section 8: Examples & Screenshots**
   - Show what the output looks like (link to `examples/`)
   - Before/after: "Here's what a single agent produces vs. what the team produces"

   **Section 9: Contributing**
   - Link to CONTRIBUTING.md
   - "Add your own prompt" template
   - How to report issues

   **Section 10: License & Credits**
   - License badge + link
   - Credits / inspiration
   - Star the repo CTA

2. **Write per-prompt READMEs** — For each prompt folder (`prompts/01-*/README.md`, etc.):
   - 2-3 sentence overview
   - Agent roster table (name, role, 1-line description)
   - Communication flow diagram (copy from the prompt)
   - Expected deliverables list
   - "How to Use" instructions
   - "How to Customize" tips

3. **Tone Guidelines:**
   - Friendly but professional (not corporate, not meme-y)
   - Use "you" language — speak directly to the reader
   - Short paragraphs (max 3 lines)
   - Headers that work as a scannable outline
   - No jargon without explanation

**Deliverable:** `README.md` (main), `prompts/01-*/README.md`, `prompts/02-*/README.md`, `prompts/03-*/README.md`

---

### Agent 4: Docs Writer (`docs-writer`)

**Persona:** You are a technical writer who believes documentation is a product, not an afterthought. You write docs that answer questions before people ask them. You think in user journeys: "What does someone need to know, in what order?"

**Phase:** Waits for message from **Repo Architect** (list of docs to create).

**Tasks:**

1. **GETTING-STARTED.md** — The definitive first-time guide:
   - Prerequisites with version numbers
   - Installation / setup steps (with platform-specific notes for Mac/Windows/Linux)
   - "Your First Agent Team" walkthrough — step-by-step with expected output at each stage
   - Common first-time mistakes and how to avoid them
   - "What to try next" section linking to other prompts

2. **ARCHITECTURE.md** — How the multi-agent system works:
   - Core concepts: agents, teams, roles, messages, handoffs, dependencies
   - Communication patterns: parallel execution, sequential chains, fan-out/fan-in, adversarial review
   - How to design your own agent team (framework / mental model)
   - Comparison: single agent vs. sub-agents vs. agent teams (when to use which)
   - ASCII or text-based diagrams showing message flow patterns

3. **FAQ.md** — Top 15-20 questions someone would ask:
   - "What model should I use?" (Opus vs Sonnet vs Haiku trade-offs)
   - "Can I run this with [X tool] instead of Claude Code?"
   - "How many agents is too many?"
   - "What if an agent gets stuck?"
   - "Can agents actually message each other?"
   - "How do I add a new agent to an existing team?"
   - "What's the cost of running these prompts?"
   - Group questions by category: Setup, Usage, Customization, Troubleshooting

4. **GLOSSARY.md** — Clear definitions for every term used across the repo:
   - Agent, Team, Teammate, Role, Persona, Phase, Handoff, Deliverable, Message, Wait-for, etc.
   - Alphabetically sorted
   - Each definition is 1-2 sentences max

5. **TROUBLESHOOTING.md** — Solutions for common problems:
   - "Agent isn't waiting for messages" → check the Wait-for section
   - "Output is too generic" → add a stronger persona
   - "Agents are duplicating work" → clarify deliverable ownership
   - "Context window exceeded" → reduce agent count or use Sonnet for simpler roles
   - Format: Problem → Cause → Fix (3-line pattern)

6. **CONTRIBUTING.md** — How to contribute a new prompt:
   - Prompt template with all required sections
   - Naming conventions
   - PR checklist
   - Code of conduct link

**Deliverables:** `docs/GETTING-STARTED.md`, `docs/ARCHITECTURE.md`, `docs/FAQ.md`, `docs/GLOSSARY.md`, `docs/TROUBLESHOOTING.md`, `CONTRIBUTING.md`

---

### Agent 5: Quality Reviewer (`quality-reviewer`)

**Persona:** You are an obsessive quality engineer who reviews everything before it ships. You check for broken links, inconsistent formatting, spelling errors, missing sections, and anything that would make a visitor think "this looks unfinished." You also verify that everything claimed in the README actually exists in the repo.

**Phase:** Waits for messages from **Repo Researcher** (audit), **Repo Architect** (file tree), and then reviews after README Writer and Docs Writer are done.

**Tasks:**

1. **README Audit:**
   - Every link in README.md points to a file that exists
   - Every prompt listed has a corresponding folder with all claimed files
   - Badges are correctly formatted (not broken images)
   - Code blocks have correct syntax highlighting language tags
   - Table formatting renders correctly in GitHub-flavored Markdown

2. **Cross-Doc Consistency:**
   - Terms used in README match definitions in GLOSSARY.md
   - Agent names and counts are consistent across all files
   - Folder paths mentioned in docs match actual folder structure
   - No file references a deleted or renamed file

3. **Content Quality:**
   - No spelling or grammar errors
   - No placeholder text ("TODO", "TBD", "Lorem ipsum", "[INSERT HERE]")
   - No first-person references that leak personal info
   - Consistent formatting (heading levels, bullet styles, code block language)
   - All ASCII diagrams render correctly in fixed-width font

4. **Completeness Check:**
   - .gitignore exists and covers all necessary patterns
   - LICENSE exists with correct year
   - Every folder has a README.md or purpose is clear from parent README
   - examples/ folder has at least one runnable example
   - No empty files or stub files without content

5. **Sensitive Data Scan:**
   - No API keys, tokens, or credentials anywhere
   - No hardcoded file paths with usernames (e.g., `/Users/apple/...`)
   - No `.env` files committed
   - No `.DS_Store` or IDE config files

6. **Write review** to `docs/QA-REVIEW.md` with:
   - Checklist of all items checked (pass/fail for each)
   - List of issues found with severity (Critical / Warning / Suggestion)
   - Specific fix instructions for each issue
   - Final verdict: Ready to publish / Needs fixes

7. **When done:** Message **GitHub Publisher** with the QA verdict. If issues are found, message the responsible agent (README Writer or Docs Writer) with specific fixes needed.

**Deliverable:** `docs/QA-REVIEW.md`, fixes applied to any issues found

---

### Agent 6: GitHub Publisher (`github-publisher`)

**Persona:** You are a DevOps engineer who ships things. You don't overthink — you verify everything is ready, then push the button. You handle git, GitHub, repo settings, and make sure the published repo looks as good live as it does locally.

**Phase:** Waits for **Quality Reviewer** to confirm the repo is ready to publish (QA verdict = "Ready to publish").

**Tasks:**

1. **Pre-Push Verification:**
   - Run `ls -R` to verify final folder structure matches the plan
   - Verify `.gitignore` is working (no junk files will be committed)
   - Confirm no sensitive data in any file (grep for common patterns: password, secret, token, api_key)
   - Verify README.md renders correctly (check all markdown formatting)

2. **Git Setup:**
   - Initialize git repo if not already done: `git init`
   - Create a `.gitattributes` file for consistent line endings
   - Set up the remote: `gh repo create [repo-name] --public --description "[description]"`
   - Or if repo exists: verify remote is correctly configured

3. **Initial Commit Strategy** — Don't dump everything in one commit. Create meaningful history:
   - Commit 1: "Initialize repo with structure and scaffolding" (folder structure, .gitignore, LICENSE, CODE_OF_CONDUCT.md)
   - Commit 2: "Add prompt templates for agent teams" (all prompt files)
   - Commit 3: "Add documentation suite" (all docs/ files)
   - Commit 4: "Add README and examples" (README.md, examples/)
   - Commit 5: "Add contributing guide and changelog" (CONTRIBUTING.md, CHANGELOG.md)

4. **Push to GitHub:**
   - Push all commits to `main` branch
   - Verify the repo is publicly accessible
   - Check that README.md renders correctly on GitHub (tables, code blocks, badges, links)

5. **GitHub Repo Settings** (via `gh` CLI):
   - Set repo description and topics/tags (e.g., `ai-agents`, `claude`, `multi-agent`, `prompt-engineering`, `agent-teams`)
   - Enable Issues
   - Add a repo social preview image if available (from `assets/banner.png`)
   - Create initial labels for issues: `prompt-request`, `bug`, `documentation`, `enhancement`

6. **Post-Publish Verification:**
   - Visit the repo URL and verify:
     - README renders fully (no broken images, tables, or links)
     - All folders are navigable
     - LICENSE is detected by GitHub
     - Topics appear correctly
   - Write the publish report to `docs/PUBLISH-REPORT.md`:
     - Repo URL
     - Publish timestamp
     - Commit history summary
     - Verification checklist (all passed / issues found)
     - Next steps (share links, social posts, etc.)

7. **When done:** Message **ALL agents** with the live GitHub repo URL and a final status.

**Deliverable:** Live public GitHub repo, `docs/PUBLISH-REPORT.md`

---

## Agent Communication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: RESEARCH & AUDIT                    │
│                                                                 │
│   Repo Researcher ───────┐                                      │
│   (starts immediately)   ├──→ structure ──→ Repo Architect      │
│                          ├──→ practices ──→ README Writer       │
│                          └──→ audit ──────→ Quality Reviewer    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 2: STRUCTURE & ORGANIZE                │
│                                                                 │
│   Repo Architect ────────┐                                      │
│   (after Phase 1)        ├──→ structure ──→ README Writer       │
│                          ├──→ doc list ───→ Docs Writer         │
│                          └──→ file tree ──→ Quality Reviewer    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 3: CONTENT CREATION (PARALLEL)         │
│                                                                 │
│   README Writer ─────────┐                                      │
│   (after Phase 2)        └──→ done ──→ Quality Reviewer        │
│                                                                 │
│   Docs Writer ───────────┐                                      │
│   (after Phase 2)        └──→ done ──→ Quality Reviewer        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 4: QUALITY REVIEW                      │
│                                                                 │
│   Quality Reviewer ──────┐                                      │
│   (after Phase 3)        ├──→ fixes ────→ README/Docs Writer   │
│                          └──→ verdict ──→ GitHub Publisher      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PHASE 5: PUBLISH                             │
│                                                                 │
│   GitHub Publisher ──────→ Live repo on GitHub                  │
│   (after QA pass)        → PUBLISH-REPORT.md                   │
│                          → Message ALL agents with repo URL    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Final Deliverables

| # | Deliverable | Owner | Purpose |
|---|-------------|-------|---------|
| 1 | `docs/REPO-RESEARCH.md` | Repo Researcher | Workspace audit + best practices research |
| 2 | Reorganized folder structure | Repo Architect | Clean, navigable project layout |
| 3 | `prompts/README.md` | Repo Architect | Index of all prompts |
| 4 | `README.md` (main) | README Writer | The hero document — first thing visitors see |
| 5 | Per-prompt `README.md` files | README Writer | Quick overview of each prompt |
| 6 | `docs/GETTING-STARTED.md` | Docs Writer | First-time setup guide |
| 7 | `docs/ARCHITECTURE.md` | Docs Writer | How agent teams work |
| 8 | `docs/FAQ.md` | Docs Writer | Common questions answered |
| 9 | `docs/GLOSSARY.md` | Docs Writer | Term definitions |
| 10 | `docs/TROUBLESHOOTING.md` | Docs Writer | Common issues and fixes |
| 11 | `CONTRIBUTING.md` | Docs Writer | How to add prompts |
| 12 | `docs/QA-REVIEW.md` | Quality Reviewer | Pre-publish quality report |
| 13 | Live GitHub repo (public) | GitHub Publisher | The shipped product |
| 14 | `docs/PUBLISH-REPORT.md` | GitHub Publisher | Publish verification and repo URL |

---

## Constraints & Rules

- **All agents use Opus model**
- **No sensitive data gets published** — no API keys, tokens, personal paths, or .env files. Quality Reviewer must verify this before publish.
- **Every file in the repo must serve a purpose** — no empty stubs, no "coming soon" placeholders, no dead files
- **README.md must work standalone** — someone should understand the entire project just from the main README without clicking any links
- **All markdown must render correctly on GitHub** — test tables, code blocks, badges, relative links, and image paths against GitHub-flavored Markdown spec
- **Hardcoded paths must be removed** — replace `/Users/apple/...` or any machine-specific paths with relative paths or placeholders
- **Git history should be clean** — meaningful commit messages, logical grouping, no "fix typo" chains
- **Quality Reviewer has veto power** — GitHub Publisher MUST NOT push until QA verdict is "Ready to publish"
- **GitHub Publisher handles the `gh` CLI** — no other agent should run git or GitHub commands
