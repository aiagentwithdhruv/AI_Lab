# Prompt 03: GitHub Publisher

**6 agents transform a workspace into a professional, publicly shareable GitHub repository.**

This prompt takes an existing project -- prompts, docs, code, research -- and packages it into a repo with a polished README, clear folder structure, comprehensive documentation, and a clean commit history. The goal: anyone who lands on the repo can understand it and start using it within 5 minutes.

**Tags:** `#devops` `#github` `#documentation` `#open-source`

---

## Agent Roster

| # | Agent | Role | Key Responsibility |
|---|-------|------|--------------------|
| 1 | **Repo Researcher** | Open-source strategist | Audits workspace, researches README best practices, analyzes top repos |
| 2 | **Repo Architect** | Information architect | Designs folder structure, moves/renames files, creates scaffolding (LICENSE, .gitignore) |
| 3 | **README Writer** | Developer advocate | Writes the main README and per-folder READMEs with scannable, compelling copy |
| 4 | **Docs Writer** | Technical writer | Creates Getting Started, Architecture, FAQ, Glossary, Troubleshooting, Contributing guides |
| 5 | **Quality Reviewer** | QA engineer | Checks links, formatting, consistency, sensitive data, and completeness |
| 6 | **GitHub Publisher** | DevOps engineer | Handles git, creates the public repo, pushes with clean commit history, configures repo settings |

---

## Communication Flow

```
Phase 1: Research & Audit
  Repo Researcher ──→ structure recommendation ──→ Repo Architect
  Repo Researcher ──→ best practices ──→ README Writer
  Repo Researcher ──→ audit findings ──→ Quality Reviewer

Phase 2: Structure & Organize
  Repo Architect ──→ finalized structure ──→ README Writer
  Repo Architect ──→ doc list ──→ Docs Writer
  Repo Architect ──→ file tree ──→ Quality Reviewer

Phase 3: Content Creation (parallel)
  README Writer ──→ done ──→ Quality Reviewer
  Docs Writer ──→ done ──→ Quality Reviewer

Phase 4: Quality Review
  Quality Reviewer ──→ fixes needed ──→ README Writer / Docs Writer
  Quality Reviewer ──→ QA verdict ──→ GitHub Publisher

Phase 5: Publish
  GitHub Publisher ──→ live repo URL ──→ ALL agents
```

---

## Expected Deliverables

| Deliverable | Owner |
|-------------|-------|
| `docs/REPO-RESEARCH.md` | Repo Researcher |
| Reorganized folder structure + scaffolding files | Repo Architect |
| `prompts/README.md` (prompt index) | Repo Architect |
| `README.md` (main hero document) | README Writer |
| Per-prompt `README.md` files | README Writer |
| `docs/GETTING-STARTED.md` | Docs Writer |
| `docs/ARCHITECTURE.md` | Docs Writer |
| `docs/FAQ.md` | Docs Writer |
| `docs/GLOSSARY.md` | Docs Writer |
| `docs/TROUBLESHOOTING.md` | Docs Writer |
| `CONTRIBUTING.md` | Docs Writer |
| `docs/QA-REVIEW.md` | Quality Reviewer |
| Live public GitHub repo | GitHub Publisher |
| `docs/PUBLISH-REPORT.md` | GitHub Publisher |

---

## How to Use

1. Copy the contents of [`prompt.md`](./prompt.md) into Claude Code with agent teams enabled.
2. All agents use the Opus model.
3. Run it from the root of the project you want to publish.
4. The GitHub Publisher agent will use the `gh` CLI to create and push the repo.

## How to Customize

- **Target a different project.** This prompt works on whatever is in the current workspace. Point it at any project directory.
- **Skip the publish step.** If you only want the restructuring and documentation, remove the GitHub Publisher agent and stop at the QA Review phase.
- **Adjust documentation scope.** Add or remove docs from the Docs Writer's task list based on your project's needs.
- **Change repo visibility.** The prompt defaults to public. Modify the GitHub Publisher's `gh repo create` command to use `--private` instead.
