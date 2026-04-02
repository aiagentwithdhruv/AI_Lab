# LaunchPad AI -- Technical Feasibility Analysis

**Date:** 2026-03-24
**Author:** Principal Engineering Assessment
**Status:** Initial feasibility analysis -- not a design doc

---

## Executive Summary

LaunchPad AI proposes to automatically generate interactive codebase walkthroughs, architecture diagrams, and personalized learning paths for new engineers. After auditing the technical landscape, the core value proposition is **feasible with effort** -- the individual pieces exist, but the integration layer and the quality bar required for developer trust are where the real engineering lives. The riskiest bet is not any single component but the end-to-end reliability: developers will abandon the tool after one hallucinated walkthrough.

---

## 1. Technical Landscape Audit

### 1.1 Code Analysis: AST Parsing, Dependency Graphing, Code Intelligence

#### Tree-sitter (AST Parsing)

- **Maturity:** Production-proven. Powers syntax highlighting and code navigation in VS Code, Neovim, Emacs, and Zed.
- **Language coverage:** 100+ language grammars available via community parsers (see [tree-sitter wiki](https://github.com/tree-sitter/tree-sitter/wiki/List-of-parsers)). The `tree-sitter-language-pack` PyPI package bundles pre-built wheels for ~40 languages.
- **Key capability:** Incremental parsing -- can re-parse only changed regions. Produces concrete syntax trees, not abstract ones, so you get full fidelity including comments and whitespace.
- **Limitation:** Tree-sitter gives you syntax, not semantics. It cannot resolve imports, track types across files, or follow function calls across module boundaries. For that you need a semantic layer on top.
- **Integration cost:** Low. C library with bindings for Rust, Python, Node.js, Go, WASM.

#### Language Server Protocol (LSP)

- **What it gives you:** Go-to-definition, find-references, document symbols, workspace symbols, hover info. Semantic understanding per-language.
- **Programmatic use:** LSP was designed for editor-server communication, but can be driven programmatically. You spin up a language server (e.g., `typescript-language-server`, `rust-analyzer`, `gopls`), send JSON-RPC requests, get structured responses.
- **Limitation:** Each language needs its own server process. Startup time varies (rust-analyzer on a large repo: 30-60s for initial indexing). Not all LSP servers support all features equally. Running N language servers for a polyglot repo adds operational complexity.
- **Alternative -- SCIP:** Sourcegraph's [SCIP protocol](https://github.com/sourcegraph/scip) generates offline indexes. SCIP indexes are ~4x smaller than LSIF equivalents. Indexers exist for Java, TypeScript/JavaScript, Python, Go, Rust, C++, Ruby, and others. You run the indexer once in CI, produce a protobuf file, and query it without running a live language server.

#### Dependency Graphing

| Tool | Languages | Output Formats | Notes |
|------|-----------|---------------|-------|
| **dependency-cruiser** | JS/TS (ES6, CJS, AMD) | DOT, JSON, HTML, Mermaid | Most robust for JS/TS. Custom rule engine for CI enforcement. |
| **madge** | JS/TS | DOT, JSON, SVG (via Graphviz) | Simpler API, but visualizations get unwieldy at scale (200+ modules). |
| **code2flow** | Python, JS, Ruby, PHP | DOT, SVG | Call-graph approximation for dynamic languages. Skips unresolved functions. Has MCP server integration as of March 2025. |
| **pyan** | Python only | DOT, HTML | Static call-graph analyzer. |
| **go callvis** | Go only | DOT | Leverages Go's static analysis tools. |

**Gap:** No single tool handles polyglot dependency graphing. For a real product, you would need to run language-specific analyzers and merge results into a unified graph model.

#### Sourcegraph

- **Pricing:** Enterprise-only as of July 2025. Cody Enterprise: $59/user/month. Deep Search: 3 searches/month included per Code Search seat. Free and Pro plans discontinued.
- **What it offers:** Cross-repo code search, SCIP-powered code navigation, Cody AI assistant.
- **Build vs. buy consideration:** Using Sourcegraph as infrastructure would be expensive at scale and creates a hard vendor dependency. The SCIP protocol itself is open source -- you can run SCIP indexers independently without Sourcegraph's platform.

### 1.2 AI/LLM Integration: What's Realistic for AI-Generated Walkthroughs

#### Model Landscape (March 2026 Pricing)

| Model | Input $/1M tokens | Output $/1M tokens | Context Window | Code Benchmark (SWE-bench) |
|-------|-------------------|--------------------|--------------|-----------------------------|
| **GPT-4.1** | $2.00 | $8.00 | 1M tokens | 54.6% |
| **GPT-4.1 nano** | $0.05 | $0.20 | 1M tokens | Lower (not published) |
| **GPT-4o** | $2.50 | $10.00 | 128K tokens | ~33% |
| **Claude Sonnet 4.5** | $3.00 | $15.00 | 200K tokens | Competitive |
| **Claude Opus 4.6** | $5.00 | $25.00 | 1M tokens | Top tier |
| **Gemini 2.0 Flash** | $0.10 | $0.40 | 1M tokens | Deprecated June 2026 |

**Key insight:** 1M-token context windows are now standard at the frontier. A typical medium codebase (50K-100K lines) compresses to ~200K-400K tokens depending on language verbosity. This means you can now feed substantial portions of a codebase into a single prompt -- but you should not. Dumping raw code is wasteful and degrades output quality.

#### Cost Modeling Per Analysis

Assume a medium repo: 80K lines of code, ~300K tokens raw.

| Operation | Model | Input Tokens | Output Tokens | Cost |
|-----------|-------|-------------|---------------|------|
| Full codebase summary | GPT-4.1 | 300K | 5K | $0.64 |
| Architecture extraction | GPT-4.1 | 150K (key files) | 3K | $0.32 |
| Per-module walkthrough (x20) | GPT-4.1 nano | 15K each | 2K each | $0.10 total |
| Learning path generation | GPT-4.1 | 50K (summaries) | 5K | $0.14 |
| **Total initial analysis** | | | | **~$1.20** |

With prompt caching (50% off repeated prefixes on OpenAI, 90% off on Anthropic), iterative re-analysis drops significantly. **Estimated ongoing cost: $0.30-0.50 per re-analysis after initial run.**

#### Hallucination Risk -- The Hard Problem

Research shows 19.7% of LLM-generated package names are hallucinated, and 29-45% of AI-generated code contains security vulnerabilities. For documentation/walkthrough generation, the risk profile is different but still real:

- **Likely hallucinations:** Invented function names, wrong module relationships, fabricated architectural decisions, incorrect data flow descriptions.
- **Mitigation strategy (required, not optional):**
  1. **Ground every claim in AST/SCIP data.** The LLM should explain code that has been structurally verified to exist, not invent code.
  2. **RAG over the actual codebase.** Chunk code files, embed them, retrieve relevant chunks per query. Stanford research shows RAG + RLHF + guardrails achieves 96% hallucination reduction vs. baseline.
  3. **Post-generation validation.** Every function name, file path, and import referenced in generated content must be verified against the actual code index. Flag or remove any reference that doesn't resolve.
  4. **Confidence scoring.** Mark sections as "high confidence" (backed by structural analysis) vs. "inferred" (LLM interpretation of intent).

**Bottom line:** Raw LLM output is not shippable as a walkthrough. You need a structured pipeline: code analysis first, LLM narration second, validation third. This is the core engineering challenge.

### 1.3 Diagram Generation

#### Feasibility of Auto-Generated Architecture Diagrams

| Approach | Reliability | Quality | Notes |
|----------|------------|---------|-------|
| **Dependency graph -> Mermaid/D2** | High | Medium | You get accurate module relationships, but the layout is mechanical, not architectural. Shows "what calls what," not "how the system is designed." |
| **LLM-generated Mermaid from code** | Medium | Medium-High | LLMs produce syntactically valid Mermaid ~85% of the time. The architecture interpretation can be surprisingly good for well-structured code, but degrades on messy codebases. |
| **Hybrid: structural analysis + LLM labeling** | High | High | Best approach. Use dependency-cruiser/SCIP for the graph structure, then use an LLM to label nodes, group components, and add architectural context. |

#### Rendering Options

- **Mermaid.js:** 82K+ GitHub stars. Native rendering in GitHub, GitLab, Notion, Obsidian. Architecture diagram syntax added in v11.1.0+. Supports 200K+ icons via iconify. Limitation: layout algorithm struggles with 50+ node graphs.
- **D2 (Terrastruct):** More expressive than Mermaid. Uses ELK layout engine. Better handling of large graphs. Less ecosystem support (not rendered natively in GitHub).
- **Graphviz DOT:** The workhorse. Handles large graphs but spline routing is O(n^3) -- gets slow above 500 nodes. Not interactive.
- **Recommendation:** Generate Mermaid for portability (renders everywhere), D2 for complex diagrams, and provide an interactive web view using a custom renderer (e.g., React Flow, ELK.js) for the in-app experience.

#### What "Auto-Generated" Actually Means

Honest assessment: you can auto-generate **dependency diagrams** reliably. You cannot auto-generate **architecture diagrams** reliably -- because architecture is a human decision about boundaries, and those boundaries are not always encoded in code structure. The LLM can make educated guesses based on directory structure, naming conventions, and import patterns, but it will get the boundaries wrong for any non-trivial system.

**Practical approach:** Generate a draft diagram, clearly label it as AI-generated, and provide an editor (Mermaid live editor or custom UI) for humans to correct it.

### 1.4 Interactive Walkthroughs

#### Existing Art

- **Microsoft CodeTour:** VS Code extension for recording/playing step-by-step code tours. Tours are JSON files mapping steps to file:line positions with markdown descriptions. Open source ([github.com/microsoft/codetour](https://github.com/microsoft/codetour)). Limitation: requires VS Code, tours are manually authored, format is proprietary to the extension.
- **Sourcegraph Notebooks:** Markdown + code snippets with live code intelligence. Requires Sourcegraph deployment.

#### Frontend Technology for Web-Based Walkthroughs

| Component | Option A | Option B | Recommendation |
|-----------|----------|----------|---------------|
| Code display | Monaco Editor (~5-10MB) | CodeMirror 6 (~300KB core) | **CodeMirror 6** -- smaller bundle, modular, better mobile support. Sourcegraph migrated from Monaco to CodeMirror for these reasons. |
| Syntax highlighting | Monaco built-in (TextMate) | CodeMirror + tree-sitter WASM | CodeMirror + tree-sitter for consistency with analysis pipeline |
| Annotations/overlays | Custom decorations API | CodeMirror decoration system | CodeMirror's decoration API is purpose-built for this |
| Step navigation | Custom state machine | React/Svelte state management | Standard frontend state management |
| Diagram embedding | Mermaid.js renderer | React Flow for interactive | Both, depending on context |

**Key technical decision:** Build a web-based walkthrough player, not a VS Code extension. Reasons: (1) lower friction for new engineers who may not have VS Code configured yet, (2) shareable URLs, (3) analytics on walkthrough completion, (4) no dependency on a specific editor.

**CodeTour compatibility:** Export to CodeTour JSON format as an option for teams that prefer in-editor walkthroughs.

---

## 2. Build vs. Buy Analysis

| Capability | Buy/Reuse | Build | Complexity | Technical Risk |
|------------|-----------|-------|-----------|----------------|
| **AST parsing** | tree-sitter (OSS) | Language-specific configuration, query patterns for extracting functions/classes/imports | Low | Low -- battle-tested |
| **Semantic code intelligence** | SCIP indexers (OSS) | Index orchestration, storage, query layer | Medium | Medium -- not all languages have mature SCIP indexers (C++ is rough) |
| **Dependency graphing** | dependency-cruiser (JS/TS), language-specific tools | Unified cross-language graph model, merger logic | Medium | Medium -- polyglot merging is non-trivial |
| **LLM-powered narration** | OpenAI/Anthropic/Google APIs | Prompt engineering pipeline, RAG system, validation layer, caching | High | High -- hallucination mitigation is ongoing work, not a one-time solve |
| **Diagram generation** | Mermaid.js / D2 (OSS renderers) | Structural analysis -> diagram DSL conversion, LLM-assisted labeling, interactive editor | Medium | Medium -- layout quality for large codebases |
| **Interactive walkthrough UI** | CodeMirror 6 (OSS) | Custom walkthrough player, annotation system, step navigation, progress tracking | Medium-High | Low-Medium -- well-understood frontend engineering |
| **Personalized learning paths** | No off-the-shelf solution | Knowledge graph of codebase concepts, skill assessment, adaptive sequencing, spaced repetition | High | High -- "personalization" is easy to promise, hard to make genuinely useful |
| **Git integration** | libgit2 / simple-git (OSS) | Incremental analysis on push, PR-triggered updates, branch-aware walkthroughs | Medium | Low -- standard git operations |

### What Must Be Built From Scratch

1. **The orchestration layer** -- connecting code analysis to LLM narration to validation to rendering. This is the product.
2. **The validation pipeline** -- ensuring every generated reference resolves to real code. No off-the-shelf solution.
3. **The unified code graph** -- merging tree-sitter ASTs, SCIP indexes, and dependency graphs into a single queryable model.
4. **The walkthrough authoring format** -- a schema that maps narrative steps to code locations, diagrams, and learning objectives.
5. **The personalization engine** -- if pursued (see feasibility verdict below).

---

## 3. Architecture Sketch

### 3.1 System Components

```
+--------------------------------------------------+
|                  LaunchPad AI                      |
+--------------------------------------------------+
|                                                    |
|  [1] Ingestion Layer                               |
|      - Git clone / shallow fetch                   |
|      - File system walker                          |
|      - Language detection (linguist)               |
|                                                    |
|  [2] Analysis Engine                               |
|      - tree-sitter AST parsing (per-file)          |
|      - SCIP indexing (cross-file references)       |
|      - Dependency graph extraction                 |
|      - Metrics collection (LOC, complexity, age)   |
|      Output: Code Graph (stored in DB)             |
|                                                    |
|  [3] AI Narration Pipeline                         |
|      - Chunking strategy (by module/package)       |
|      - RAG: embed code chunks -> vector store      |
|      - LLM prompt chain:                           |
|          a. Summarize each module                  |
|          b. Identify key entry points              |
|          c. Generate walkthrough narrative          |
|          d. Generate diagram DSL                   |
|      - Post-generation validator                   |
|      Output: Walkthrough JSON + Diagram DSL        |
|                                                    |
|  [4] Content Store                                 |
|      - Walkthrough definitions (steps, narration)  |
|      - Generated diagrams (Mermaid/D2 source)      |
|      - Code graph snapshots (for offline use)      |
|      - User progress / completion state            |
|                                                    |
|  [5] Walkthrough Player (Frontend)                 |
|      - CodeMirror 6 with annotation overlays       |
|      - Mermaid.js / React Flow diagram renderer    |
|      - Step-by-step navigation                     |
|      - Search within walkthrough                   |
|      - Feedback mechanism (thumbs up/down per step)|
|                                                    |
|  [6] Learning Path Engine (v2)                     |
|      - Concept dependency graph                    |
|      - Skill assessment (quiz / self-report)       |
|      - Adaptive ordering                           |
|      - Spaced repetition scheduling                |
|                                                    |
+--------------------------------------------------+
```

### 3.2 Data Flow

```
Git Repo (GitHub/GitLab/local)
    |
    v
[Ingestion] -- clone/fetch, detect languages
    |
    v
[Analysis Engine] -- parallel per-language analysis
    |   - tree-sitter: extract functions, classes, imports per file
    |   - SCIP indexer: cross-file references, call hierarchy
    |   - dep-cruiser/custom: module dependency graph
    |
    v
[Code Graph DB] -- PostgreSQL + pg_vector (or SQLite for local)
    |   Stores: files, symbols, references, dependencies, embeddings
    |
    v
[AI Narration Pipeline] -- triggered after analysis completes
    |   1. Retrieve top-level structure from Code Graph
    |   2. For each module: retrieve code chunks via RAG
    |   3. LLM generates: summary, walkthrough steps, diagram DSL
    |   4. Validator checks all symbol/file references against Code Graph
    |   5. Failed references: retry with corrected context or flag for human review
    |
    v
[Content Store] -- walkthrough JSON, diagram sources, metadata
    |
    v
[Walkthrough Player] -- web app served to end user
    |   Fetches walkthrough steps, renders code + annotations + diagrams
    |   Tracks user progress, collects feedback
    |
    v
[Learning Path Engine] -- orders walkthroughs based on user profile
```

### 3.3 Infrastructure Options

| Deployment Model | Pros | Cons | Viable? |
|-----------------|------|------|---------|
| **Cloud SaaS** | Easiest to operate, can use GPU instances for embedding, scales horizontally | Code leaves customer premises, security/compliance concerns | Yes -- primary model for startups/SMBs |
| **Local CLI** | Code never leaves machine, zero trust issues, fast iteration for individual devs | No GPU for embeddings (CPU fallback), limited LLM options (API calls still go to cloud), no team features | Yes -- for individual use / OSS version |
| **Hybrid (analysis local, LLM cloud)** | Code structure extracted locally, only summaries/chunks sent to LLM API, good privacy/capability balance | More complex architecture, some data still leaves premises | Yes -- best model for enterprise |
| **Fully on-prem** | Maximum security | Requires self-hosted LLM (e.g., Llama 3 70B+), significant GPU infrastructure, lower quality than frontier models | Possible but expensive -- enterprise-only |

### 3.4 Cost Estimation Per User Per Month

Assumptions: team of 10 engineers, 3 repos (medium: ~80K LOC each), 2 new engineers onboarded per month, walkthroughs regenerated weekly.

| Cost Component | Monthly Cost | Per User |
|---------------|-------------|----------|
| **LLM API (initial analysis x3 repos)** | $3.60 (one-time, amortized ~$0.90/mo) | $0.09 |
| **LLM API (weekly re-analysis x3 repos x4 weeks)** | $4.80 | $0.48 |
| **LLM API (ad-hoc queries, 50/month @ $0.02 each)** | $1.00 | $0.10 |
| **Embedding generation (OpenAI ada-002: ~1M tokens @ $0.10/1M)** | $0.30 | $0.03 |
| **Compute (analysis workers, 2 vCPU spot)** | $15.00 | $1.50 |
| **Storage (code graphs, vector DB, content)** | $5.00 | $0.50 |
| **Frontend hosting (static + API)** | $10.00 | $1.00 |
| **Total** | **~$40.00** | **~$4.00/user/month** |

At scale (100 users), per-user cost drops to ~$2.00-2.50/month due to shared infrastructure. Using GPT-4.1 nano for bulk operations and reserving GPT-4.1/Claude Opus for high-quality summaries keeps LLM costs manageable.

**Comparison:** Sourcegraph Cody Enterprise is $59/user/month. GitHub Copilot Enterprise is $39/user/month. A $10-15/user/month price point for LaunchPad AI would be competitive and profitable at the cost structure above.

---

## 4. Feasibility Verdict

### Feature-by-Feature Assessment

#### 4.1 Automated Codebase Analysis (AST + Dependencies + Cross-References)

**Verdict: FEASIBLE NOW**

- Tree-sitter, SCIP, dependency-cruiser are production-ready.
- The integration work (unified code graph) is standard engineering, not research.
- Polyglot support requires per-language configuration but no invention.
- Estimated build time: 4-6 weeks for a senior engineer to build the analysis pipeline for JS/TS + Python + Go. Each additional language: 1-2 weeks.

#### 4.2 AI-Generated Codebase Summaries and Module Descriptions

**Verdict: FEASIBLE WITH EFFORT**

- LLMs produce genuinely useful summaries when given well-structured code context.
- The effort is in the RAG pipeline, chunking strategy, and validation layer.
- Hallucination mitigation is not a "solve once" problem -- it requires ongoing tuning.
- Quality will vary by codebase: well-structured code with good naming -> excellent results; legacy spaghetti code -> mediocre results requiring human editing.
- Estimated build time: 6-8 weeks for the pipeline. Ongoing: 20% of eng time on quality improvement.

#### 4.3 Auto-Generated Architecture Diagrams

**Verdict: FEASIBLE WITH EFFORT -- with caveats**

- Dependency diagrams from structural analysis: reliable, shippable.
- "Architecture" diagrams (showing logical boundaries, data flow, deployment topology): the LLM will get these 60-70% right on well-structured codebases. On complex/legacy codebases: 30-40% right.
- Must be positioned as "AI-generated draft" with easy human editing, not "ground truth."
- Rendering via Mermaid.js/D2 is proven. The hard part is generating the right graph, not rendering it.
- Estimated build time: 3-4 weeks for structural diagrams. +4 weeks for LLM-assisted architecture diagrams with editing UI.

#### 4.4 Interactive Step-by-Step Walkthroughs

**Verdict: FEASIBLE WITH EFFORT**

- CodeMirror 6 provides the editor component. The step navigation, annotation overlay, and progress tracking are standard frontend work.
- The hard part is walkthrough generation quality, not the player UI.
- Microsoft CodeTour proves the UX pattern works -- but their format is VS Code-only and manually authored. Auto-generating equivalent quality is the challenge.
- Estimated build time: 6-8 weeks for the walkthrough player. Walkthrough generation quality is coupled to the AI narration pipeline timeline.

#### 4.5 Personalized Learning Paths

**Verdict: NEEDS SPIKE**

- The concept is sound: model the codebase as a knowledge graph of concepts, assess what the new engineer already knows, and sequence their learning.
- The problem: "personalization" requires knowing both the codebase's concept graph AND the learner's current knowledge state. The former is hard to extract automatically; the latter requires assessment mechanisms that don't exist yet for codebase-specific knowledge.
- Research in this area (graph reinforcement learning for learning path optimization) is active but academic. No production system does this well for code-specific onboarding.
- **Recommended spike:** 1 week to prototype a simple version: (1) extract a module dependency DAG from the code graph, (2) use topological sort + LLM-generated prerequisite annotations to order modules, (3) let the user self-report familiarity to skip modules. Evaluate whether this simple approach is "good enough" before investing in adaptive learning algorithms.
- Risk: over-engineering personalization before validating that curated walkthroughs are insufficient.

#### 4.6 Incremental Updates (Re-Analysis on Code Changes)

**Verdict: FEASIBLE NOW**

- tree-sitter's incremental parsing is designed for this.
- Git diff -> changed files -> re-analyze only those files -> update code graph -> flag outdated walkthrough sections.
- SCIP re-indexing is the bottleneck (full re-index required for most languages), but can run in CI and takes 1-5 minutes for medium repos.
- Estimated build time: 2-3 weeks on top of the base analysis pipeline.

#### 4.7 Multi-Repo / Monorepo Support

**Verdict: FEASIBLE WITH EFFORT**

- Monorepos add complexity: partial analysis, workspace detection, internal package resolution.
- Multi-repo: cross-repo references are hard (need to understand package registry mappings).
- Estimated build time: +4-6 weeks beyond single-repo support.

---

## 5. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LLM hallucinations erode developer trust | High | Critical | Validation pipeline, confidence scoring, human-in-the-loop editing |
| Analysis fails on non-standard project structures | Medium | High | Configurable project detection, fallback to directory-based grouping |
| Cost per analysis exceeds budget at scale | Medium | Medium | Aggressive caching, tiered model usage (nano for bulk, frontier for summaries), prompt caching |
| SCIP indexer gaps for certain languages | Medium | Medium | Fallback to tree-sitter-only analysis (less accurate cross-file refs) |
| Walkthrough quality too low for complex/legacy codebases | High | High | Position as "draft" with editing tools, focus on well-structured codebases for v1 |
| Diagram layout unreadable for large codebases | Medium | Medium | Hierarchical zoom, collapsible groups, focus-on-module view |

---

## 6. Recommended Build Sequence

### Phase 1: Foundation (Weeks 1-8) -- 2 engineers

- Analysis pipeline: tree-sitter + SCIP for JS/TS and Python
- Unified code graph storage (PostgreSQL + embeddings)
- Basic LLM summarization pipeline with validation
- Structural dependency diagrams (Mermaid output)
- CLI tool: `launchpad analyze <repo-path>` -> generates JSON + Mermaid

### Phase 2: Walkthrough Player (Weeks 6-14) -- 2 engineers (overlapping)

- Web-based walkthrough player (CodeMirror 6 + React)
- Auto-generated walkthrough from analysis output
- Diagram rendering (Mermaid.js inline)
- User progress tracking
- Feedback collection per step

### Phase 3: Quality + Polish (Weeks 12-18) -- 2 engineers

- Hallucination reduction: improved RAG, post-generation validation v2
- LLM-assisted architecture diagrams with editing
- Incremental re-analysis on git push
- CodeTour export format
- Additional language support (Go, Java, Rust)

### Phase 4: Personalization Spike (Week 14, 1 week)

- Prototype simple learning path ordering
- User testing with 5-10 engineers
- Go/no-go decision on advanced personalization

### Phase 5: Scale + Enterprise (Weeks 18-26)

- Hybrid deployment (local analysis, cloud LLM)
- Multi-repo support
- Team admin dashboard
- SSO / audit logging
- If personalization spike succeeded: build v1 learning path engine

**Total estimated timeline to MVP (usable product, not perfect):** 14-16 weeks with 2 senior engineers.

---

## 7. Competitive Landscape

| Product | What It Does | How LaunchPad AI Differs |
|---------|-------------|-------------------------|
| **Sourcegraph Cody** | AI code assistant, code search, code navigation | Cody answers questions; LaunchPad proactively generates structured onboarding content. Different use case. |
| **GitHub Copilot Workspace** | AI-powered development environment | Focused on code generation, not onboarding. Copilot's codebase understanding is a component, not a product. |
| **Microsoft CodeTour** | Manual walkthrough recording for VS Code | Requires manual authoring. LaunchPad auto-generates. CodeTour is a feature, not a platform. |
| **Swimm** | Documentation that stays synced with code | Closest competitor. Swimm requires manual doc creation with code references. LaunchPad would auto-generate the initial content. |
| **ReadMe / GitBook** | Developer documentation platforms | Static docs, no code analysis integration. |

**Key differentiator:** No existing product auto-generates interactive walkthroughs from code analysis. The closest (Swimm) still requires manual authoring. The gap is real -- but the quality bar to fill it credibly is high.

---

## 8. Final Assessment

**Should we build this?** The technology is ready. The individual components (tree-sitter, SCIP, LLM APIs, CodeMirror, Mermaid) are mature. The integration is where the value and the difficulty both live.

**What would kill this project:**
1. Hallucination rates that make developers distrust the output.
2. Generated walkthroughs that are too generic to be useful ("this file handles routing" -- no kidding).
3. Over-investing in personalization before nailing the base walkthrough quality.

**What would make it succeed:**
1. A validation pipeline that catches hallucinations before they reach the user.
2. Walkthroughs that surface non-obvious architectural decisions and "why" explanations, not just "what."
3. Starting with a narrow language/framework focus (e.g., TypeScript + React + Node.js) and doing it well before going polyglot.
4. Treating auto-generated content as a draft that humans refine, not as a finished product.

**Go/No-Go Recommendation:** **Go** -- with the explicit constraint that v1 targets TypeScript/Python codebases under 200K LOC, positions all generated content as editable drafts, and defers personalized learning paths to a post-MVP spike.

---

## Sources

- [Tree-sitter](https://tree-sitter.github.io/) -- AST parsing library
- [Tree-sitter Parser List](https://github.com/tree-sitter/tree-sitter/wiki/List-of-parsers) -- Language grammar coverage
- [SCIP Protocol](https://github.com/sourcegraph/scip) -- Code intelligence indexing
- [Sourcegraph Pricing](https://sourcegraph.com/pricing) -- Enterprise pricing details
- [OpenAI API Pricing](https://openai.com/api/pricing/) -- GPT-4.1, GPT-4o token costs
- [Anthropic Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing) -- Claude model pricing and context windows
- [Google Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing) -- Gemini API costs
- [GPT-4.1 Announcement](https://openai.com/index/gpt-4-1/) -- 1M context, SWE-bench results
- [Mermaid.js Architecture Diagrams](https://mermaid.ai/open-source/syntax/architecture.html) -- Diagram-as-code syntax
- [D2 Language](https://blog.stackademic.com/diagram-as-code-from-mermaid-to-d2-13cb0ff49357) -- Alternative diagram DSL
- [CodeMirror 6](https://codemirror.net/) -- Browser code editor
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) -- VS Code's editor component
- [Sourcegraph: Monaco to CodeMirror Migration](https://sourcegraph.com/blog/migrating-monaco-codemirror) -- Migration rationale
- [Microsoft CodeTour](https://github.com/microsoft/codetour) -- VS Code walkthrough extension
- [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser) -- JS/TS dependency analysis
- [code2flow](https://github.com/scottrogowski/code2flow) -- Call graph generation
- [LLM Hallucinations in Code Review](https://diffray.ai/blog/llm-hallucinations-code-review/) -- Hallucination rate data
- [Package Hallucinations Study](https://arxiv.org/html/2406.10279v1) -- 19.7% hallucinated package names
- [RAG Hallucination Mitigation (2025 review)](https://community.openai.com/t/mitigating-hallucinations-in-rag-a-2025-review/1362063) -- Mitigation strategies
- [Graphviz Layout Engines](https://graphviz.org/docs/layouts/) -- Graph rendering performance
- [LSP Specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/) -- Protocol capabilities
- [Personalized Learning Paths via Knowledge Graphs](https://www.mdpi.com/2079-9292/15/1/238) -- Academic survey
