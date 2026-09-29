# Psiog Pulse | Engineering Performance Insights Platform

> **A standard, fair, explainable, and multi-dimensional engineering intelligence platform built from scratch for Psiog.**

---

## 🌟 Overview & Problem Solved

Most engineering projects at Psiog utilize standard toolsets: **JIRA, Azure DevOps, Git, TestRail, and SharePoint**. Yet engineering performance has historically been assessed qualitatively or with fragmented, ad-hoc spreadsheets.

**Psiog Pulse** unifies these data streams into an explainable, data-backed view of engineering performance. It eliminates the single-metric trap (e.g. lines of code or commit counts), dynamically normalizes for tenure changes and approved leave/on-call duties, and provides AI-driven narrative synthesis and anti-gaming protection.

---

## 🚀 Key Features & Acceptance Criteria Coverage

| Criterion | Implementation in Psiog Pulse |
|---|---|
| **1. Connectors & Mappings** | Native connector adapters for **JIRA, Azure DevOps, Git, TestRail, and SharePoint**. Configurable field mapping schema without code changes. Offline file importer (JSON/CSV) for projects without live API access. |
| **2. Manual Entry & Non-Destructive Edits** | Interactive modal to add ad-hoc metrics or overrides (e.g., offline spikes, ADA audits). All manual data is tagged with `[Manual Entry]`, author signature, timestamp, and justification, **never silently overwriting raw source records**. |
| **3. Organisation & Time-Bound Attribution** | Associates, teams, projects, and offerings. Dynamic tenure engine: when an engineer changes project or role mid-period (e.g. Alex Rivera: Senior Eng on FinTech Core Jan-Feb ➔ Lead on HealthCare Portal in March), activities are strictly attributed to the project and role held on that date. |
| **4. Identity Resolution** | Cross-tool alias matching graph linking corporate emails, GitHub handles, JIRA usernames, and ADO UPNs into a unified profile. Includes a dedicated **Unmatched Activity Triage Queue** for orphan commits/tickets. |
| **5. Configurable Performance Model** | Calibrated across 5 dimensions: **Velocity & Delivery (30%), Code Quality (25%), Code Review Rigor (20%), Technical Documentation (15%), Operational Reliability (10%)**. Tailored weights and benchmarks per Persona & Offering with embedded rationale documentation. |
| **6. Fair & Explainable Scoring** | Mathematical Formula Transparency Drawer. Dynamic capacity normalization by active working days. **Manager Context Notes** (leave, on-call duty, onboarding ramp-up) adjust baselines proportionately. Statistical shrinkage for sparse data. |
| **7. Multi-Level Reporting & Drilldown** | Interactive **Executive Overview** (practice health), **Project in Focus** (team distribution, benchmarks), and **Associate in Focus** (tenure timeline, dimensional meters). Deep drilldowns to underlying tickets, pull requests, code reviews, QA test runs, and SharePoint docs. |
| **8. Scheduled Sync & Version History** | Incremental delta sync simulator tracking watermarks, duration, and delta records inserted. Versioned models (**v2.1-2026 Active** vs **v1.0-2025 Archived**) guarantee historical reviews are never rewritten. |
| **9. AI Insights & Anti-Gaming Engine** | Generative plain-English performance summaries. Heuristic anti-gaming detection flagging: micro-commit bursts before sprint cutoffs, unreviewed/self-approved PR merges, superficial reviews ("LGTM"), and ticket status churning. Interactive AI Sandbox console. |
| **10. Role-Based Access Control (RBAC)** | Dynamic switcher in the header: **Engineer** (self-view only, personal growth roadmap), **Lead** (team & project views, context note entry), **Delivery Head** (organization-wide rollups), and **Admin** (connectors, mappings, identity triage, model builder). |
| **11. Realistic Multi-Offering Seed Data** | Pre-populated with 4 projects across 4 offerings (*FinTech Core Engine, HealthCare Patient Portal, Enterprise Cloud Data Mesh, AutoQA Accelerator*), multi-tool identities, mid-period role promotions, and context adjustments. |

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18 with TypeScript & modern Vanilla CSS Design System (Glassmorphism, custom CSS variables, accessible dark theme, micro-animations).
- **Icons**: Lucide-React.
- **Build Tool**: Vite 5.
- **Runtimes**: Node.js v24.

---

## 🏃‍♂️ How to Run Locally

1. Navigate to the project directory:
   ```powershell
   cd C:\Users\vamsikrishna.batchu\.gemini\antigravity-ide\scratch\psiog-engineering-insights
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to:
   **`http://localhost:5173/`**

---

## 📂 Project Structure

```
psiog-engineering-insights/
├── src/
│   ├── types/
│   │   └── index.ts                 # Type definitions for all 11 acceptance criteria
│   ├── data/
│   │   ├── initialSeedData.ts       # Realistic seed dataset (projects, roles, tickets, PRs, reviews, docs)
│   │   └── defaultModels.ts         # Versioned scoring models (v2.1 & v1.0) with documented rationale
│   ├── services/
│   │   ├── attributionEngine.ts     # Time-bound role & project attribution
│   │   ├── identityResolution.ts    # Cross-tool identity matching & orphan triage
│   │   ├── scoringEngine.ts         # Multi-dimensional calculation, capacity normalization & explainability
│   │   ├── antiGamingEngine.ts      # Micro-commits, self-approvals & superficial review detection
│   │   ├── aiInsightsEngine.ts      # Plain-English synthesis & conversational AI sandbox
│   │   ├── connectorService.ts      # Connectors, field schema mappings & export importer
│   │   └── syncService.ts           # Incremental delta sync engine & watermark tracking
│   ├── context/
│   │   └── AppContext.tsx           # Global state management & RBAC session controller
│   ├── components/
│   │   ├── common/
│   │   │   ├── ScoreBadge.tsx       # Standardized score badge
│   │   │   ├── ExplainModal.tsx     # Step-by-step mathematical breakdown modal
│   │   │   ├── ContextNoteModal.tsx # Manager context notes entry modal
│   │   │   └── ManualEntryModal.tsx # Non-destructive manual data entry modal
│   │   ├── layout/
│   │   │   ├── Header.tsx           # RBAC switcher, period picker, delta sync trigger
│   │   │   └── Sidebar.tsx          # Dynamic role-filtered navigation
│   │   └── views/
│   │       ├── ExecutiveOverview.tsx # Org rollups & offering calibration (Delivery Head)
│   │       ├── ProjectView.tsx      # Project focus, team personas & underlying artifact drilldowns
│   │       ├── AssociateView.tsx    # Multi-tenure timeline, radar meters & deep drilldown
│   │       ├── IdentityResolutionView.tsx # Account graph & orphan activity triage queue
│   │       ├── ConnectorsView.tsx   # 5 connectors, schema editor, offline file importer & sync log
│   │       ├── ManualDataAuditView.tsx # Non-destructive manual entries & audit signatures
│   │       ├── ModelBuilderView.tsx # Configurable weights, version history & documented rationale
│   │       └── AIInsightsView.tsx   # Anti-gaming alerts & conversational AI sandbox
│   ├── App.tsx                      # Root component with RBAC navigation guardrails
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Bespoke dark glassmorphism design system
├── package.json
├── tsconfig.json
└── vite.config.ts
```
