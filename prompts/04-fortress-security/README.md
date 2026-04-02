# Prompt 04: Fortress Security

**10 agents conduct an enterprise-grade security audit with adversarial red/blue team dynamics.**

This is the most comprehensive prompt in the collection. A coordinated team performs threat intelligence, code auditing, infrastructure hardening, compliance mapping, penetration testing, incident response planning, and executive reporting -- all cross-validated through red team/blue team exercises. The output meets standards expected by Fortune 500 companies, financial institutions, and government agencies.

**Tags:** `#security` `#audit` `#compliance` `#pentesting` `#red-team`

---

## Agent Roster

| # | Agent | Role | Key Responsibility |
|---|-------|------|--------------------|
| 1 | **Threat Intel Analyst** | Intelligence analyst | Attack surface inventory, threat actor profiling, MITRE ATT&CK mapping, CVE research |
| 2 | **Security Architect** | Chief security architect | Zero-trust architecture, defense-in-depth layers, crypto standards, SDLC integration |
| 3 | **Code Auditor** | AppSec engineer | OWASP Top 10 audit, code pattern analysis, dependency security, secure coding guide |
| 4 | **Infrastructure Hardener** | Cloud security engineer | Server/container/DB/network hardening, CI/CD pipeline security, environment matrix |
| 5 | **Data Protection Engineer** | Privacy and data officer | Data classification, encryption guide, privacy-by-design, breach response protocol |
| 6 | **Compliance Mapper** | GRC director | Multi-framework compliance matrix (SOC 2, ISO 27001, NIST, PCI-DSS, GDPR, HIPAA) |
| 7 | **Penetration Tester** | Offensive security expert | Recon, exploitation PoCs, attack scenario walkthroughs, API/auth security testing |
| 8 | **Incident Response Planner** | SOC lead | Monitoring architecture, detection rules, incident response playbooks, tabletop exercises |
| 9 | **Red Team Lead** | Adversarial reviewer | Challenges all findings, runs attack simulations, validates controls, rates overall posture |
| 10 | **CISO Briefer** | Executive synthesizer | Master security report, risk dashboard, remediation roadmap, board-ready CISO brief |

---

## Communication Flow

```
Phase 1: Parallel Reconnaissance
  Threat Intel Analyst ──→ threat model ──→ Security Architect
  Threat Intel Analyst ──→ attack surface ──→ Penetration Tester
  Threat Intel Analyst ──→ findings ──→ Red Team Lead

Phase 2: Architecture & Analysis (parallel tracks)
  Security Architect ──→ standards ──→ Code Auditor
  Security Architect ──→ infra design ──→ Infrastructure Hardener
  Security Architect ──→ crypto/key mgmt ──→ Data Protection Engineer
  Code Auditor ──→ findings ──→ Penetration Tester + Compliance Mapper
  Infrastructure Hardener ──→ controls ──→ Compliance Mapper + Incident Response Planner
  Data Protection Engineer ──→ data inventory ──→ Compliance Mapper + Incident Response Planner

Phase 3: Adversarial Testing & Validation
  Penetration Tester ──→ findings ──→ Incident Response Planner + Red Team Lead
  Compliance Mapper ──→ gaps ──→ Red Team Lead
  Red Team Lead ──→ challenges ──→ ALL agents (they address findings)

Phase 4: Synthesis
  All agents ──→ confirmed complete ──→ CISO Briefer
  CISO Briefer ──→ master report + executive brief
```

---

## Expected Deliverables

| Deliverable | Owner |
|-------------|-------|
| `security/01-THREAT-INTELLIGENCE.md` | Threat Intel Analyst |
| `security/02-SECURITY-ARCHITECTURE.md` | Security Architect |
| `security/03-CODE-AUDIT.md` | Code Auditor |
| `security/04-INFRASTRUCTURE-SECURITY.md` | Infrastructure Hardener |
| `security/05-DATA-PROTECTION.md` | Data Protection Engineer |
| `security/06-COMPLIANCE-GOVERNANCE.md` | Compliance Mapper |
| `security/07-PENETRATION-TEST.md` | Penetration Tester |
| `security/08-SECURITY-OPERATIONS.md` | Incident Response Planner |
| `security/09-RED-TEAM-ASSESSMENT.md` | Red Team Lead |
| `security/10-CISO-BRIEF.md` | CISO Briefer |
| `security/SECURITY-MASTER-REPORT.md` | CISO Briefer |

---

## How to Use

1. Copy the contents of [`prompt.md`](./prompt.md) into Claude Code with agent teams enabled.
2. All agents use the Opus model.
3. Run it from the root of the project you want to audit.
4. The agents will analyze existing code, infrastructure, and architecture in the workspace.
5. Collect the full Security Posture Package from the `security/` directory.

## How to Customize

- **Target a specific codebase.** The agents will audit whatever is in the current workspace. Point it at the project you want assessed.
- **Narrow the scope.** If you only need a code audit and pen test, keep agents 3, 7, and 9. Remove compliance and infrastructure agents.
- **Change compliance frameworks.** The prompt covers SOC 2, ISO 27001, NIST 800-53, PCI-DSS, GDPR, and HIPAA. Remove frameworks that do not apply to your organization and add any that do.
- **Adjust threat model.** Update the Threat Intel Analyst's threat actor profiles to match your actual risk environment (startup vs. enterprise vs. government).
- **Scale down for smaller projects.** Merge the Data Protection Engineer into the Security Architect, and the Incident Response Planner into the Infrastructure Hardener, for a 7-agent team.
