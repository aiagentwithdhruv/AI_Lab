# LaunchPad AI -- Go-To-Market Playbook

**Date:** 2026-03-24
**Author:** Growth Marketing Lead
**Status:** V1 -- Ready for founder review
**Inputs:** Market Research (2026-03-24), Technical Feasibility (2026-03-24), Product Strategy (2026-03-24)

---

## Executive Summary

This playbook maps the first 90 days of LaunchPad AI's market entry. The strategy is built on one principle: developers do not want to be marketed to, but they will share tools that save them real time. Every tactic below is designed to earn attention through demonstrated value rather than bought impressions.

The approach: seed a waitlist through genuine community engagement, launch with enough social proof to break through noise on Product Hunt and Hacker News, then sustain momentum with a content engine that targets the exact frustrations our three personas -- Sarah (EM), Priya (senior dev), and Marcus (VP Eng) -- voice in their own communities.

**Target outcomes at Day 90:** 1,200+ waitlist signups, 400+ activated free accounts, 15-20 paid Team conversions, $8K-$12K MRR, and a pipeline of 5+ enterprise conversations.

---

## 1. 90-Day Launch Strategy

### Phase 1: Pre-Launch (Day -30 to Day 0)

**Objective:** Build a waitlist of 800+ qualified signups and establish credibility in three communities before the product ships.

#### Week -4 to -3: Foundation

| Action | Detail | Owner | Deliverable |
|--------|--------|-------|-------------|
| **Landing page live** | Single-page site with one-liner ("AI-generated codebase walkthroughs that get new engineers productive in days, not months"), a 90-second explainer video (screen recording of a walkthrough being generated from a real OSS repo), email capture, and a "Request Early Access" CTA. Built on Next.js, deployed on Vercel. | Founder + 1 designer | launchpadai.com live by Day -28 |
| **Open-source the analysis CLI** | Ship `launchpad analyze <repo>` as an open-source CLI (MIT license) that runs tree-sitter + SCIP analysis locally and outputs a JSON code graph + Mermaid dependency diagram. This is the CodeBoarding play -- give away the analysis layer, monetize the walkthrough generation and team features. | Engineering | GitHub repo live by Day -25, README with GIF demo |
| **Seed Twitter/X account** | Begin posting 2x/day from @LaunchPadAI. Content: observations about onboarding pain, retweets of developers complaining about stale docs, short threads about how code analysis works (tree-sitter, SCIP, AST parsing). No product promotion yet -- just become a voice in the conversation. | Founder | 50+ followers by Day -14 |
| **Personal brand posts** | Founder writes 2 LinkedIn posts and 1 Twitter/X thread: "I spent 6 months building onboarding docs. They were outdated in 3 weeks. Here is what I learned." Frame the problem, not the solution. | Founder | Published by Day -21 |

#### Week -2 to -1: Community Seeding

| Action | Detail | Owner | Deliverable |
|--------|--------|-------|-------------|
| **HackerNews "Show HN" for the CLI** | Post the open-source CLI as a "Show HN: I built a CLI that generates dependency maps from your codebase using tree-sitter + SCIP." This is not the product launch -- it is a proof of credibility. If it gets 50+ upvotes, it validates interest. Title must be technical and specific, not marketing-speak. | Founder | Posted on a Tuesday or Wednesday, 9-10am ET |
| **Dev.to article #1** | "What tree-sitter actually tells you about your codebase (and what it doesn't)" -- a technical deep-dive explaining AST parsing, its limits, and how SCIP fills the semantic gap. Include real code examples. Mention the CLI at the end as a practical tool. | Founder or senior engineer | Published Day -12 |
| **Early access program** | Select 10-15 beta teams from waitlist signups. Criteria: 30-150 engineers, TypeScript or Python primary language, at least 1 new hire in the next 30 days. Offer: free Team tier for 6 months in exchange for weekly 15-minute feedback calls and a case study commitment. | Founder | 10 teams confirmed by Day -5 |
| **Engineering manager community posts** | Post in Rands Leadership Slack, Engineering Managers Slack, and r/ExperiencedDevs: "Curious how other EMs handle codebase onboarding at 50+ engineers. We are building something in this space and want to learn from your experience." Genuine research, not stealth marketing. Collect 20+ responses to inform launch messaging. | Founder | 20+ responses collected by Day -7 |
| **Demo video production** | Record a 3-minute demo: connect a real open-source TypeScript repo (e.g., cal.com or twenty), watch the analysis run, walk through the generated interactive walkthrough. No narration fluff -- just the product working. Hosted on YouTube, embedded on landing page. | Founder + designer | Final cut ready by Day -3 |

#### Day -1: Launch Prep

- Queue all launch day posts (Product Hunt, HN, Twitter/X thread, LinkedIn)
- Email the full waitlist: "We launch tomorrow. Here is your early access link."
- Brief the 10-15 beta teams: "Share your honest experience on launch day if you found the product useful."
- Prepare a "Frequently Asked Questions" doc for comment responses (hallucination concerns, security, pricing rationale, comparison to Swimm/Copilot)

---

### Phase 2: Launch Week (Day 0 to Day 7)

**Objective:** 500+ signups in 7 days, top 5 on Product Hunt, front page of Hacker News, 50+ GitHub stars on the OSS CLI.

#### Day 0 (Tuesday -- optimal for PH + HN)

| Time (ET) | Action | Detail |
|-----------|--------|--------|
| 12:01 AM | **Product Hunt launch** | Title: "LaunchPad AI -- AI-generated codebase walkthroughs for new engineers." Tagline: "Connect your repo. Get an interactive walkthrough in 5 minutes." First comment from founder: the personal story (I onboarded 12 engineers in 2 years, spent 400+ hours on manual walkthroughs, built this to get that time back). Include the 3-minute demo video. Have 5+ beta users post reviews in the first 2 hours. |
| 9:00 AM | **Hacker News "Show HN"** | Title: "Show HN: LaunchPad AI -- auto-generates interactive codebase walkthroughs from AST + SCIP analysis." HN hates marketing language. The post must lead with the technical approach (tree-sitter parsing, SCIP cross-references, LLM narration with post-validation), link to the open-source CLI, and include a live demo link where anyone can try it on a public repo. Founder monitors and responds to every comment for 12 hours. |
| 9:30 AM | **Twitter/X launch thread** | 8-tweet thread: (1) The problem: "New engineers take 3-9 months to get productive. Your wiki is a graveyard. Your Loom recordings are outdated." (2-3) How it works technically. (4) Live demo GIF. (5) What makes it different from Swimm/Copilot/Confluence. (6) Pricing (free tier highlighted). (7) The open-source CLI. (8) "Try it now" link. Pin the thread. |
| 10:00 AM | **LinkedIn post** | Founder personal post targeting EMs: "Last year I calculated that my team spent $180K in senior engineer time just explaining our codebase to new hires. Today we are launching LaunchPad AI to fix that." Tag 5-10 engineering leaders from beta program who have agreed to engage. |
| 12:00 PM | **Email to waitlist** | Subject: "LaunchPad AI is live -- your free account is ready." Direct link to sign up and connect first repo. Include the 3-minute demo video for those who want to watch before trying. |
| 2:00 PM | **Reddit posts** | Post in r/programming ("Show r/programming: auto-generating codebase walkthroughs from static analysis") and r/ExperiencedDevs ("We built a tool that generates onboarding walkthroughs from your codebase -- looking for feedback"). Follow subreddit rules exactly. |

#### Day 1-3: Momentum Maintenance

- Respond to every Product Hunt comment, HN comment, and Twitter reply within 2 hours
- Publish a Dev.to article: "How we use tree-sitter and SCIP to validate AI-generated code walkthroughs" -- technical credibility piece timed to ride launch traffic
- Cross-post the Dev.to article to Hashnode
- DM 20 developers who engaged positively on HN/Twitter and offer early access
- Track: signups, repo connections, walkthrough completions, and drop-off points in real-time

#### Day 4-7: Consolidation

- Publish a "Launch Week Learnings" Twitter thread: transparent metrics (signups, repo connections, most common feedback, bugs found)
- Send a "Week 1 product update" email to all signups: features shipped, bugs fixed, what is next
- Begin cold outreach to 50 engineering managers at companies matching ICP (50-200 engineers, Series B-D, TypeScript/Python stack) -- LinkedIn connection request + personalized message referencing the launch

**Launch Week Targets:**

| Metric | Target | Stretch |
|--------|--------|---------|
| Waitlist + signups | 500 | 800 |
| Repos connected | 150 | 250 |
| Walkthroughs completed (full) | 50 | 100 |
| Product Hunt rank | Top 5 of the day | #1 of the day |
| HN front page | Yes, 4+ hours | Yes, 8+ hours |
| GitHub stars (OSS CLI) | 50 | 150 |
| Twitter/X followers | 300 | 500 |

---

### Phase 3: Post-Launch (Day 7 to Day 90)

**Objective:** Convert launch momentum into a sustainable growth engine. Hit 15-20 paid Team customers and $8K-$12K MRR by Day 90.

#### Weeks 2-4: Activation Focus

The #1 priority post-launch is not more signups -- it is activating the signups you have. A signup who never connects a repo is worthless.

| Action | Detail | Trigger |
|--------|--------|---------|
| **Activation email sequence** | 5-email drip over 14 days. Email 1 (Day 0): "Connect your first repo in 60 seconds." Email 2 (Day 2): "Your walkthrough is ready -- here is what it found." Email 3 (Day 5): "3 things teams discover in their first walkthrough." Email 4 (Day 9): "Invite your team -- here is how onboarding changes." Email 5 (Day 14): "You are on Free. Here is what Team unlocks." | Signup without repo connected triggers Email 1. Repo connected without walkthrough viewed triggers Email 2 variant. |
| **In-app onboarding flow** | After repo connection: show a "walkthrough of your walkthrough" -- a 5-step guided tour of the walkthrough player itself. Reduce time-to-aha to under 3 minutes. | First login after analysis completes |
| **Weekly office hours** | 30-minute Zoom, Thursdays 12pm ET. Founder + engineer answer questions live. Record and post to YouTube. Low effort, high signal. Builds community. | Announce to all signups |
| **Feedback-driven shipping** | Ship 2-3 improvements per week based on beta feedback. Announce each one on Twitter with a "You asked, we built" format. | Continuous |

#### Weeks 4-8: Content Engine

Launch a sustainable content cadence that drives organic traffic and builds SEO authority on "developer onboarding" and "codebase walkthrough" keywords.

| Content Type | Cadence | Purpose |
|-------------|---------|---------|
| Blog post (launchpadai.com/blog) | 2x/week | SEO + thought leadership. Alternating: 1 technical deep-dive, 1 onboarding best-practices piece. |
| Twitter/X threads | 5x/week | Community engagement. Mix of product updates, onboarding tips, technical insights, and developer frustration retweets. |
| Dev.to / Hashnode articles | 1x/week | Cross-posting blog content + platform-native pieces for discoverability. |
| YouTube video | 1x/2 weeks | Demo walkthroughs on popular OSS repos, office hours recordings, "how we built X" technical content. |
| GitHub README updates | Weekly | Keep the OSS CLI repo active with releases, contributor engagement, and documentation improvements. |

**Specific blog post schedule (Weeks 4-8):**

1. "The real cost of onboarding: we surveyed 50 engineering managers" (original research -- survey beta users and waitlist)
2. "How cal.com's codebase looks through an AI-generated walkthrough" (demo on a popular OSS repo)
3. "Why your Confluence wiki fails at onboarding (and what to do instead)"
4. "Under the hood: how we validate AI-generated code references against AST data"
5. "5 patterns of codebases that are easy to onboard vs. impossible (based on 200 repos analyzed)"
6. "Engineering manager's guide to measuring onboarding effectiveness"
7. "tree-sitter, SCIP, and the future of automated code understanding"
8. "We analyzed 200 repos: here is what correlates with fast developer onboarding"

#### Weeks 8-12: Conversion Machine

| Action | Detail | Target |
|--------|--------|--------|
| **Usage-based upgrade triggers** | In-app prompt when: (a) 4th user tries to join workspace (Free limit = 3), (b) team tries to connect 2nd repo, (c) user tries to edit a walkthrough. Each trigger shows the specific feature they are hitting and the Team price. | 10% conversion on triggered prompts |
| **Case study #1** | Publish the first beta customer case study. Format: problem (onboarding took X weeks), solution (LaunchPad AI generated Y walkthroughs), result (onboarding time reduced by Z%). Real company name, real numbers. | Published by Day 60 |
| **Case study #2** | Second case study from a different industry/stack. | Published by Day 75 |
| **Engineering manager email campaign** | 3-email sequence to 200 targeted EMs identified from LinkedIn Sales Navigator. Email 1: share the case study with a "Does this resonate?" CTA. Email 2: offer a free walkthrough generation on their repo (no signup needed -- we run it and send them the result). Email 3: invite to a 15-minute demo. | 5% reply rate, 2% demo conversion |
| **Partner integration launch** | Ship a GitHub Action that auto-regenerates walkthroughs on push to main. Announce on GitHub Marketplace. This converts passive users into daily active ones and creates a visible integration touchpoint. | 30+ installs in first month |
| **Referral program** | "Give your friend 3 months of Team for free, get 1 month free yourself." Shared via a unique link in the product. | 10 referral signups by Day 90 |

#### Day 90 Targets

| Metric | Target |
|--------|--------|
| Total signups (free) | 400+ activated (repo connected) |
| Paid Team customers | 15-20 |
| MRR | $8,000-$12,000 |
| Enterprise pipeline | 5+ qualified conversations |
| NPS (from in-app survey) | 40+ |
| Walkthrough reference accuracy | >95% |
| GitHub stars (OSS CLI) | 300+ |
| Twitter/X followers | 1,500+ |
| Blog organic traffic | 5,000+ monthly visits |

---

## 2. Channel Strategy

| Channel | Strategy | Content Type | Frequency | KPI | Notes |
|---------|----------|-------------|-----------|-----|-------|
| **Twitter/X** | Build-in-public narrative. Founder account (@LaunchPadAI) shares product progress, technical insights, and developer onboarding observations. Engage in conversations about onboarding pain -- reply to devs complaining about stale docs. | Threads (technical deep-dives), single tweets (product updates, observations), quote tweets (developer frustrations), GIF demos | 5x/week (1 thread, 4 singles) | Followers: 500 by Day 30, 1,500 by Day 90. Engagement rate >3%. Profile clicks >200/week | Never sell in tweets. Share genuinely useful insights. The product link is in the bio, not the tweet. |
| **Hacker News** | Earn credibility through technical substance. Post original technical content (not product launches) 2x/month. Comment thoughtfully on relevant threads about onboarding, documentation, code understanding, and AI dev tools. | "Show HN" posts for OSS CLI and product launch. Comments on relevant threads with genuine expertise. | 2 posts/month + daily comment monitoring | Front page 2x in first 90 days. 100+ points on Show HN posts. | HN has an anti-marketing immune system. Every post must offer standalone value without requiring signup. Never use superlatives. |
| **Dev.to / Hashnode** | Publish technical tutorials and opinion pieces. Cross-post from blog with canonical URL pointing back. Engage with comments on both platforms. | Tutorials ("How to analyze your codebase with tree-sitter"), opinion pieces ("Why onboarding docs fail"), case studies | 1x/week | 500+ followers across both platforms by Day 90. 3+ articles with 100+ reactions. | Dev.to rewards consistency and community engagement. Comment on other people's posts. Use relevant tags (devops, productivity, ai, tutorial). |
| **YouTube** | Product demos on real OSS repos, "how we built it" technical content, recorded office hours. Not polished -- developer-audience appropriate. Screen recordings with face cam. | Demo videos (3-5 min), technical deep-dives (10-15 min), office hours recordings (30 min) | 2x/month | 200+ subscribers by Day 90. 1,000+ views on demo videos. | YouTube SEO: title with "codebase walkthrough" and "developer onboarding" keywords. Thumbnail showing actual code/diagrams, not stock photos. |
| **GitHub** | Open-source CLI repo as a distribution channel. Active issue management, contributor-friendly README, regular releases. Use GitHub Discussions for community Q&A. Sponsor relevant repos. | OSS CLI releases, README documentation, GitHub Actions marketplace listing, GitHub Discussions | Weekly releases for first 90 days. Daily issue triage. | 300+ stars by Day 90. 10+ external contributors. 50+ GitHub Action installs. | The OSS repo is the trust layer. Developers check your GitHub before trying your product. Activity signals (recent commits, responsive maintainers) matter more than star count. |
| **LinkedIn** | Target engineering managers and VPs of Engineering. Founder personal brand posts about onboarding challenges, team scaling, and engineering leadership. Company page for product announcements. | Personal posts (onboarding pain + insights), case study shares, thought leadership on engineering team scaling | 3x/week (founder personal), 1x/week (company page) | 50+ connection requests from ICP per month. 5+ inbound demo requests from LinkedIn by Day 90. | LinkedIn works for the Sarah and Marcus personas. Keep posts authentic -- personal stories about onboarding challenges, not corporate announcements. |
| **Cold outreach** | Targeted outbound to 200 engineering managers at ICP companies (50-200 engineers, Series B-D, TS/Python stack). Personalized emails referencing their specific tech stack (visible from job postings and GitHub org). Offer: "We generated a walkthrough of your open-source repo -- want to see it?" | Personalized email sequences (3-touch: value offer, case study, demo invite). LinkedIn connection + message. | 50 new prospects/week starting Day 14 | 5% reply rate. 2% demo rate. 5+ enterprise conversations by Day 90. | Cold email must offer value upfront. "We analyzed your public repo and here is what we found" is 10x more effective than "would you like a demo of our product." |
| **Email newsletter** | Weekly email to all signups: product updates, best content of the week, onboarding tip. Not a sales pitch -- a genuinely useful engineering leadership digest. | Product changelog, curated content, onboarding insights, community highlights | 1x/week (Thursday) | 40%+ open rate. <1% unsubscribe rate. | Subject lines must be specific ("3 patterns we found in 200 codebases") not generic ("LaunchPad AI Weekly Update"). |
| **Slack communities** | Active presence in Rands Leadership, Engineering Managers Slack, DevOps Chat, relevant Discord servers. Answer onboarding questions. Share relevant content when genuinely helpful. Never spam. | Helpful answers to onboarding/documentation questions, occasional content shares when relevant | Daily monitoring, 3-5 contributions/week | Recognized as a helpful community member. 10+ inbound signups attributed to Slack communities by Day 90. | Slack communities ban self-promotion. The play is to be genuinely helpful for 4+ weeks before ever mentioning your product. When you do, it should be "we built something that addresses exactly this -- happy to share if useful." |

---

## 3. 30-Day Content Calendar (Day 0 to Day 30)

### Week 1: Launch Week

| Day | Channel | Title / Topic | Type | Creator | Buyer Stage | Expected Outcome |
|-----|---------|--------------|------|---------|-------------|-----------------|
| Day 0 (Tue) | Product Hunt | "LaunchPad AI -- AI-generated codebase walkthroughs for new engineers" | Product launch | Founder | Awareness | Top 5 Product of the Day, 200+ upvotes |
| Day 0 (Tue) | Hacker News | "Show HN: LaunchPad AI -- auto-generates interactive codebase walkthroughs from AST + SCIP analysis" | Show HN | Founder | Awareness | Front page, 100+ points, 50+ comments |
| Day 0 (Tue) | Twitter/X | "New engineers take 3-9 months to get productive. Your wiki is a graveyard..." (8-tweet launch thread) | Thread | Founder | Awareness | 50+ retweets, 200+ likes, 100+ profile clicks |
| Day 0 (Tue) | LinkedIn | "Last year my team spent $180K in senior engineer time explaining our codebase to new hires..." | Personal post | Founder | Awareness | 100+ reactions, 20+ comments, 10+ connection requests from EMs |
| Day 0 (Tue) | Email | "LaunchPad AI is live -- your free account is ready" | Launch email to waitlist | Founder | Interest | 50%+ open rate, 30%+ click rate |
| Day 1 (Wed) | Dev.to | "How we use tree-sitter and SCIP to validate AI-generated code walkthroughs" | Technical article | Senior engineer | Awareness | 100+ reactions, 20+ bookmarks |
| Day 2 (Thu) | Twitter/X | "Here is what happened when we ran LaunchPad AI on the cal.com codebase" (5-tweet thread with screenshots) | Thread with demo | Founder | Interest | 30+ retweets, visible to cal.com community |
| Day 3 (Fri) | YouTube | "LaunchPad AI Demo: generating a walkthrough for a 100K LOC TypeScript repo in 4 minutes" | Demo video (3 min) | Founder | Interest | 500+ views in first week |
| Day 4 (Sat) | Twitter/X | "Launch week numbers: X signups, Y repos connected, Z walkthroughs generated. Here is what surprised us..." | Transparency tweet | Founder | Awareness | Builds trust through transparency |
| Day 5 (Sun) | -- | Rest / respond to comments | -- | -- | -- | -- |
| Day 6 (Mon) | Reddit | r/ExperiencedDevs: "We launched a tool that auto-generates codebase walkthroughs -- here is what 200 repos taught us about onboarding" | Community post | Founder | Awareness | 50+ upvotes, genuine discussion |
| Day 7 (Tue) | Email | "Week 1: what we shipped, what broke, and what is next" | Product update to all signups | Founder | Interest | 40%+ open rate |

### Week 2: Technical Credibility

| Day | Channel | Title / Topic | Type | Creator | Buyer Stage | Expected Outcome |
|-----|---------|--------------|------|---------|-------------|-----------------|
| Day 8 (Wed) | Blog | "Under the hood: how LaunchPad AI validates every AI-generated reference against your actual code" | Technical deep-dive | Senior engineer | Interest | 500+ reads, shared in HN comments |
| Day 9 (Thu) | Twitter/X | "The #1 reason AI-generated docs fail: hallucinated function names. Here is how we catch them before they reach you." (thread) | Thread | Founder | Interest | Addresses the top developer objection |
| Day 10 (Fri) | Hashnode | Cross-post of Day 8 blog with Hashnode-native formatting | Technical article | Senior engineer | Interest | 50+ reactions on Hashnode |
| Day 11 (Sat) | Twitter/X | Quick tip: "If you are onboarding new engineers, have them draw the architecture diagram from memory after week 1. Compare it to reality. The gap is your onboarding debt." | Single tweet | Founder | Awareness | Engagement from EMs |
| Day 12 (Sun) | -- | Rest / respond to comments | -- | -- | -- | -- |
| Day 13 (Mon) | Blog | "Why your Confluence wiki fails at developer onboarding (and it is not Confluence's fault)" | Opinion piece | Founder | Awareness | SEO target: "developer onboarding wiki" |
| Day 14 (Tue) | LinkedIn | "I asked 50 engineering managers how they onboard new engineers. The most common answer was 'honestly, it is ad hoc.'" | Personal post with survey data | Founder | Awareness | 50+ reactions, resonates with EM persona |
| Day 14 (Tue) | Email | "Week 2: new feature -- walkthrough search. Plus: the Confluence problem." | Weekly email | Founder | Interest | Newsletter establishing cadence |

### Week 3: Social Proof + Activation

| Day | Channel | Title / Topic | Type | Creator | Buyer Stage | Expected Outcome |
|-----|---------|--------------|------|---------|-------------|-----------------|
| Day 15 (Wed) | Dev.to | "5 patterns of codebases that are easy to onboard vs. nightmare to navigate (based on 200+ repo analyses)" | Data-driven article | Founder | Awareness | 150+ reactions; original insight from our data |
| Day 16 (Thu) | Twitter/X | Share a beta user quote (with permission): "Our new hire said this was the best onboarding experience they have ever had. It took us 5 minutes to set up." | Social proof tweet | Founder | Decision | Third-party validation |
| Day 17 (Fri) | YouTube | "Office Hours #2: live Q&A + walkthrough of a Python monorepo" | Recorded office hours | Founder + engineer | Interest | 200+ views, community building |
| Day 18 (Sat) | Twitter/X | "Hot take: the best onboarding doc is the one that writes itself and updates when the code changes. Everything else is tech debt with a wiki URL." | Opinion tweet | Founder | Awareness | Engagement / debate |
| Day 19 (Sun) | -- | Rest / respond to comments | -- | -- | -- | -- |
| Day 20 (Mon) | Blog | "Engineering manager's playbook: how to measure onboarding effectiveness (with or without LaunchPad AI)" | Buyer-persona content | Founder | Decision | SEO: "measure developer onboarding"; value even without our product |
| Day 21 (Tue) | LinkedIn | "Hot take: 'pair with a senior engineer for 2 weeks' is not an onboarding program. It is an expensive admission that you do not have one." | Personal post | Founder | Awareness | Controversial enough to drive comments |
| Day 21 (Tue) | Email | "Week 3: beta customer spotlight + new GitHub Action for auto-updates" | Weekly email | Founder | Interest / Decision | Showcase real customer success |

### Week 4: Conversion Push

| Day | Channel | Title / Topic | Type | Creator | Buyer Stage | Expected Outcome |
|-----|---------|--------------|------|---------|-------------|-----------------|
| Day 22 (Wed) | Blog | "Case study: how [Beta Company] reduced engineer onboarding time from 8 weeks to 3 weeks" | Case study | Founder + customer | Decision | The single most important conversion asset |
| Day 23 (Thu) | Twitter/X | Thread: "We analyzed what makes some codebases 3x faster to onboard than others. Here are the 7 factors." | Data thread | Founder | Awareness | Original research earns shares |
| Day 24 (Fri) | Dev.to | "Building an open-source code analysis CLI with tree-sitter: lessons from our first 1,000 users" | Technical / community | Senior engineer | Awareness | OSS community engagement |
| Day 25 (Sat) | Twitter/X | "Month 1 transparency report: X signups, Y paid customers, Z repos analyzed. Revenue: $X. Burn: $Y. Here is what we are learning." | Build-in-public | Founder | Awareness | Developer audience loves transparency |
| Day 26 (Sun) | -- | Rest / respond to comments | -- | -- | -- | -- |
| Day 27 (Mon) | Blog | "The hidden cost of tribal knowledge: what happens when your best engineer quits" | Thought leadership | Founder | Awareness | SEO: "tribal knowledge engineering"; targets Marcus persona |
| Day 28 (Tue) | LinkedIn | Share the case study from Day 22 with a personal anecdote about why onboarding metrics matter | Case study amplification | Founder | Decision | Drive EM clicks to case study |
| Day 28 (Tue) | Hacker News | "Show HN: We open-sourced our codebase dependency visualization tool (Mermaid + tree-sitter)" | Show HN for new OSS feature | Senior engineer | Awareness | Second HN push with new content |
| Day 28 (Tue) | Email | "Month 1 recap: what we shipped, what customers are saying, and what is next" | Monthly recap | Founder | Interest / Decision | Re-engage inactive signups |
| Day 29 (Wed) | YouTube | "Full demo: onboarding a new engineer to a 150K LOC TypeScript monorepo with LaunchPad AI" | Long-form demo (10 min) | Founder | Decision | Detailed walkthrough for decision-stage buyers |
| Day 30 (Thu) | Twitter/X | "30 days in. Here is the honest truth about building a dev tool in 2026..." | Reflection thread | Founder | Awareness | Authentic founder narrative |

---

## 4. Metrics Framework

### 4.1 North Star Metric

**Walkthroughs completed per week (team-level)**

**Why this metric:** A completed walkthrough means a new engineer connected with the product, consumed the generated content, and reached the end. It correlates with the core value proposition -- a new engineer who completes a walkthrough is measurably closer to productive. It is upstream of revenue (teams that complete walkthroughs convert to paid) and downstream of product quality (bad walkthroughs get abandoned).

It is not "repos connected" (that measures setup, not value delivery). It is not MRR (that is a lagging output, not a leading indicator of product-market fit). It is not signups (vanity).

### 4.2 Leading Indicators

| Metric | Definition | Why It Matters | Day 7 Target | Day 30 Target | Day 90 Target |
|--------|-----------|---------------|-------------|--------------|--------------|
| **Signup rate** | New accounts created per day | Top of funnel health | 70/day (launch spike) | 15/day (steady state) | 20/day (content-driven) |
| **Activation rate** | % of signups who connect a repo within 48 hours | Measures onboarding friction | 40% | 50% | 60% |
| **Time-to-first-walkthrough** | Minutes from signup to first walkthrough viewed | The "aha" speed | <15 min (median) | <10 min | <8 min |
| **Walkthrough completion rate** | % of started walkthroughs that are completed (all steps) | Content quality signal | 30% | 40% | 50% |
| **Invite rate** | % of activated users who invite a teammate | Viral coefficient proxy | 5% | 10% | 15% |
| **Weekly active walkthroughs** | Unique walkthroughs viewed per week across all accounts | Engagement depth | 80 | 200 | 500 |
| **Free-to-paid conversion rate** | % of free accounts converting to Team within 90 days | Monetization efficiency | N/A | 3% | 8-10% |
| **Feedback score** | % of thumbs-up on walkthrough steps | Content quality | 70% positive | 75% positive | 80% positive |

### 4.3 Lagging Indicators

| Metric | Definition | Why It Matters | Day 30 Target | Day 90 Target |
|--------|-----------|---------------|--------------|--------------|
| **MRR** | Monthly recurring revenue | Business viability | $1,500-$3,000 | $8,000-$12,000 |
| **Paid customers** | Number of Team/Enterprise accounts | Customer base | 5-8 | 15-20 |
| **Monthly churn (logo)** | % of paid customers canceling per month | Retention health | <5% | <5% |
| **Net revenue retention** | Revenue from existing customers after expansion/contraction/churn | Growth efficiency | N/A (too early) | >100% |
| **NPS** | Net Promoter Score from in-app survey | Product satisfaction | 35+ | 40+ |
| **Average seats per paid account** | Users per paying workspace | Expansion signal | 20 | 30 |
| **Enterprise pipeline value** | Total ACV of active enterprise conversations | Future revenue | $50K | $200K |
| **Walkthrough reference accuracy** | % of AI-generated references that resolve to real code | Core product quality | >95% | >97% |
| **Content organic traffic** | Monthly blog/site visitors from search | Long-term channel health | 1,000 | 5,000 |

### 4.4 Milestone Targets with Comparable Benchmarks

These targets are calibrated against comparable dev tool launches:

**Swimm context:** $8.8M ARR after 5+ years, ~$17.78/user. Slow growth suggests a documentation-first approach has adoption friction. LaunchPad AI's auto-generation removes that friction.

**Mintlify context:** $10M ARR by end of 2025, aggressive PLG motion. Reached 10,000+ companies with a free tier. Our targets are more conservative because our market (onboarding) is narrower than general developer docs.

**Realistic dev tool benchmarks:**
- A strong Product Hunt launch for a dev tool: 500-1,500 upvotes, #1-5 of the day
- A successful Show HN for a dev tool: 100-300 points, 50-150 comments
- Typical PLG dev tool free-to-paid conversion: 5-10% within 90 days
- Typical dev tool activation rate (signup to first meaningful action): 40-60%

| Milestone | Timeline | Target | Confidence |
|-----------|----------|--------|------------|
| 100 repos analyzed | Day 14 | High -- if launch executes well | High |
| First paying customer | Day 14-21 | A beta team converts after early access ends | High |
| 10 paying customers | Day 45-60 | Conversion of early power users hitting free tier limits | Medium |
| First enterprise conversation | Day 30-45 | Inbound from VP Eng persona who saw launch content | Medium |
| $5K MRR | Day 60 | ~22 seats on Team tier across multiple accounts | Medium |
| $10K MRR | Day 90 | ~44 seats on Team tier or mix of Team + first enterprise pilot | Medium-Low |
| First case study published | Day 45-60 | Beta customer with measurable onboarding improvement | High |
| 300 GitHub stars (OSS CLI) | Day 90 | Requires consistent OSS community engagement | Medium |

---

## 5. Budget Allocation (First 90 Days)

Assuming a $15K-$25K marketing budget for the first 90 days (typical for a pre-seed/seed dev tool):

| Category | Allocation | Spend | Notes |
|----------|-----------|-------|-------|
| **Landing page + design** | 15% | $2,500-$3,750 | One-time: landing page, demo video production, brand assets |
| **Content production** | 25% | $3,750-$6,250 | Freelance editor for blog posts, video editing for YouTube |
| **Paid social (LinkedIn only)** | 20% | $3,000-$5,000 | LinkedIn Sponsored Content targeting EMs at 50-200 person companies. Only channel worth paying for at this stage. No Twitter ads, no Google ads yet. |
| **Cold outreach tooling** | 15% | $2,250-$3,750 | LinkedIn Sales Navigator ($100/mo), Apollo.io or similar ($100/mo), email deliverability tools |
| **Community sponsorships** | 10% | $1,500-$2,500 | Sponsor 1-2 engineering podcasts (The Pragmatic Engineer, Software Engineering Daily) or newsletter sponsorships (TLDR, Pointer) |
| **Infrastructure (free tier)** | 15% | $2,250-$3,750 | LLM API costs + compute for free tier users (at ~$4/user/month COGS for ~100 free users) |

**What we do NOT spend on:**
- Google Ads (too expensive for dev tool keywords, low intent)
- Twitter ads (developers use ad blockers and ignore promoted tweets)
- Conference sponsorships (too expensive and too slow for Day 0-90)
- PR agency (earned coverage from launch momentum is more credible)
- Swag (nobody needs another t-shirt before they love the product)

---

## 6. Risk Scenarios and Contingency Plans

| Scenario | Trigger | Contingency |
|----------|---------|-------------|
| **Product Hunt launch underperforms (<100 upvotes)** | Poor timing, weak hunter network, or strong competition that day | Double down on HN and Twitter. PH is a visibility boost, not a dependency. Relaunch on PH with a new angle (e.g., the OSS CLI) in 30 days. |
| **HN commenters attack AI accuracy** | Hallucination concerns dominate the thread | Respond with transparency: share actual accuracy numbers from the test suite, link to the validation pipeline blog post, and acknowledge limitations honestly. "You are right that AI accuracy is the hard problem. Here is exactly how we address it." |
| **Activation rate below 30%** | Signups not connecting repos | Diagnose: is it OAuth friction? Repo size limits? Trust concerns? Ship a "try on a public repo" flow that requires zero auth. Let people see a walkthrough before signing up. |
| **Zero paid conversions by Day 45** | Free tier is too generous or product is not sticky enough | Tighten free tier (reduce from 3 users to 1, or limit walkthrough regeneration). Add more Team-only features. Run 5 customer development calls to understand the conversion blocker. |
| **Enterprise buyers require SOC 2** | First enterprise conversation stalls on security review | Accelerate SOC 2 Type II process. In the interim, offer a "we analyze your code locally, only summaries go to the cloud" hybrid mode. Provide a detailed security whitepaper. |
| **Competitor launches similar feature** | Swimm or GitHub announces auto-generated walkthroughs | Ship faster. Publish a comparison page. Lean into the areas where we are deeper (validation pipeline, interactive player, personalization). First-mover advantage in category framing matters. |

---

## 7. Key Principles (Non-Negotiable)

1. **Never launch a feature you would not use yourself.** Before any marketing, the founder should onboard to a new codebase using LaunchPad AI. If the experience is not genuinely better than reading the README + grepping the codebase, do not launch.

2. **Developers smell marketing.** Every piece of content must pass the "would I share this with my engineering team" test. If it sounds like a press release, rewrite it.

3. **Transparency builds trust faster than polish.** Share real numbers, real limitations, and real challenges. "Our accuracy is 95% and here is how we are improving it" beats "best-in-class AI-powered solutions" every time.

4. **The open-source CLI is the moat.** It builds trust (developers can inspect the code), creates a community (contributors become advocates), and generates organic distribution (GitHub trending, HN posts). Protect and invest in it.

5. **Conversion is a product problem, not a marketing problem.** If users do not convert from Free to Team, the answer is not more emails -- it is a better product. Marketing creates awareness; the product creates revenue.

6. **One channel at a time.** Do not try to be everywhere on Day 1. Master Twitter/X + HN + Dev.to in the first 30 days. Add YouTube and LinkedIn in earnest from Day 30. Add paid channels only after organic is working.

---

## Sources

All strategic inputs derived from:
- **Market Research Report** (2026-03-24): Buyer personas, competitor data, market signals, pricing benchmarks
- **Technical Feasibility Analysis** (2026-03-24): Architecture, cost modeling, build timeline, risk register
- **Product Strategy** (2026-03-24): Positioning, pricing tiers, MVP scope, success metrics

Benchmark data:
- Product Hunt top dev tools typically receive 500-1,500 upvotes on launch day (based on Mintlify, Linear, Raycast launches)
- Show HN dev tool benchmarks: CodeBoarding received significant engagement on its Show HN post (referenced in Market Research)
- PLG dev tool conversion rates of 5-10% are industry standard (OpenView PLG benchmarks, 2025)
- Swimm ARR of $8.8M after 5+ years provides a floor estimate for market size validation (Latka)
- Mintlify reaching $10M ARR with PLG validates the AI-powered dev docs market willingness to pay (Sacra)

---

*This playbook is a living document. Review and adjust weekly based on actual metrics vs. targets. The 90-day plan is a hypothesis -- the market will tell us what is actually working by Day 14.*
