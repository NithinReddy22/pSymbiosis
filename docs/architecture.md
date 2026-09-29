# Frontend Architecture — Perf Insight UI (`psiog-engineering-insights`)

## Overview

The Perf Insight frontend is a **React 18 + TypeScript + Vite** single-page application. It provides role-based dashboard views for engineers, managers, and delivery heads. All scoring logic runs **client-side** for real-time interactive previews, mirroring the backend algorithm exactly.

---

## Technology Stack

| Concern | Technology |
|---------|-----------|
| Framework | React 18 |
| Language | TypeScript 5.6 |
| Build Tool | Vite 5.4 |
| Icons | Lucide React |
| Styling | Tailwind CSS |
| State | React Context API (`AppContext`) |
| Auth | Azure AD Bearer JWT |

---

## Application Structure

```
src/
├── main.tsx                    Entry point
├── App.tsx                     Root router, role-based view switching
├── index.css
├── types/index.ts              All TypeScript interfaces
├── context/AppContext.tsx      Global state (single source of truth)
├── services/
│   ├── scoringEngine.ts        5-dimension weighted scoring
│   ├── antiGamingEngine.ts     8 anomaly/gaming detection rules
│   ├── attributionEngine.ts    Tenure-based attribution (mid-period moves)
│   ├── identityResolution.ts   Tool account → associate mapping
│   ├── aiInsightsEngine.ts     AI narrative generation
│   ├── connectorService.ts     Tool connector management
│   └── syncService.ts          Backend sync coordination
├── data/
│   ├── defaultModels.ts        Seed performance model configs
│   └── initialSeedData.ts      Demo dataset
└── components/
    ├── layout/Header.tsx
    ├── layout/Sidebar.tsx
    ├── views/                  8 main views (see below)
    └── common/                 Shared UI components
```

---

## Component Tree

```mermaid
graph TD
    App["App.tsx\nRoot · role-based routing"]

    App --> Header["Header\ntop nav · user profile"]
    App --> Sidebar["Sidebar\nview switcher · role-filtered"]
    App --> Views["Active View"]

    Views --> EO["ExecutiveOverview\nOrg KPI dashboard"]
    Views --> AV["AssociateView\nIndividual engineer report"]
    Views --> PV["ProjectView\nProject-level team view"]
    Views --> CV["ConnectorsView\nTool integration config"]
    Views --> IV["IdentityResolutionView\nMap tool accounts"]
    Views --> MDA["ManualDataAuditView\nManual entries & overrides"]
    Views --> MB["ModelBuilderView\nScoring model config"]
    Views --> AI["AIInsightsView\nAI narrative panel"]

    AV --> RC["RadarChart\n5-axis dimensional score"]
    AV --> SB["ScoreBadge\nscore + rating band"]
    AV --> TC["SprintTrendChart\nmonthly sparkline"]
    AV --> EM["ExplainModal\nfull calculation trace"]
    AV --> XM["ExportReportModal\nPDF / CSV export"]
    AV --> CN["ContextNoteModal\nadd leave / on-call note"]

    EO --> SB
    EO --> TC

    MB --> CG["CriteriaGuideModal\nscoring criteria help"]
    MDA --> ME["ManualEntryModal\nadd manual data"]

    style App fill:#e3f2fd,stroke:#90caf9
    style Views fill:#f5f5f5,stroke:#bbb
    style AV fill:#f3e5f5,stroke:#ce93d8
```

---

## Data Flow

```mermaid
flowchart TD
    subgraph CTX["AppContext — Global State"]
        direction LR
        ORG["associates\nprojects\nroleAssignments"]
        ACT["tickets · prs\nreviews · tests · docs"]
        CFG["connectors\nidentities\ncontextNotes\nmanualEntries"]
        MDL["performanceModel\n(active version)"]
    end

    subgraph SCORE["Scoring Pipeline (client-side)"]
        direction TB
        SEG["attributionEngine\ntenure segmentation\nproject × role × dates"]
        DIM["scoringEngine\n5-dimension calculation\nweighted composite"]
        AG["antiGamingEngine\n8 detection rules\nflag anomalies"]
        AIN["aiInsightsEngine\nnarrative generation\nstrengths · growth areas"]
    end

    subgraph OUT["Calculated Output"]
        RPT["CalculatedPerformanceReport\noverallScore · ratingBand\ndimensions · flags · insights"]
    end

    CTX --> SEG
    SEG --> DIM
    DIM --> AG
    DIM --> AIN
    AG & AIN --> RPT

    RPT --> AV2["AssociateView"]
    RPT --> EO2["ExecutiveOverview"]
    RPT --> PV2["ProjectView"]

    style CTX fill:#e8f5e9,stroke:#a5d6a7
    style SCORE fill:#f3e5f5,stroke:#ce93d8
    style OUT fill:#fff3e0,stroke:#ffcc80
```

---

## State Management

`AppContext` is the **single source of truth**. No component maintains its own copy of shared data.

```mermaid
flowchart LR
    subgraph State["AppContext State Slices"]
        direction TB
        S1["currentUser\nrole · associateId"]
        S2["associates · projects\nroleAssignments"]
        S3["identities\nconnectors · syncLogs"]
        S4["contextNotes\nmanualEntries"]
        S5["tickets · prs · reviews\ntests · docs"]
        S6["performanceModel"]
        S7["calculatedReports\ncached per associate"]
        S8["currentView\nselectedAssociateId\nselectedProjectId"]
    end

    subgraph Consumers["Consuming Components"]
        C1["AssociateView"]
        C2["ExecutiveOverview"]
        C3["ConnectorsView"]
        C4["ModelBuilderView"]
        C5["IdentityResolutionView"]
    end

    State -->|"useContext(AppContext)"| Consumers
```

---

## Scoring Dimensions (client-side)

```mermaid
pie title Default Dimension Weights (Senior Engineer)
    "Delivery" : 30
    "Quality" : 25
    "Review & Collaboration" : 20
    "Documentation" : 15
    "Reliability" : 10
```

Weights are configurable per persona in `ModelBuilderView`. See [scoring-engine.md](scoring-engine.md) for the full algorithm.

---

## Role-Based View Access

```mermaid
flowchart LR
    LOGIN["Azure AD Login\nBearer JWT"]

    LOGIN --> EMP["Employee"]
    LOGIN --> MGR["Manager"]
    LOGIN --> SH["Service Head"]
    LOGIN --> ADM["Admin"]

    EMP --> V1["My Performance\n(own data only)"]
    EMP --> V2["Projects\n(read)"]

    MGR --> V1
    MGR --> V3["Team Dashboard"]
    MGR --> V2
    MGR --> V4["Identity Resolution"]
    MGR --> V5["Manual Data Audit"]

    SH --> V6["Executive Overview"]
    SH --> V3
    SH --> V7["AI Insights"]
    SH --> V2

    ADM --> V6
    ADM --> V3
    ADM --> V4
    ADM --> V5
    ADM --> V7
    ADM --> V8["Connectors Config"]
    ADM --> V9["Model Builder"]

    style EMP fill:#e8f5e9,stroke:#a5d6a7
    style MGR fill:#e3f2fd,stroke:#90caf9
    style SH fill:#fff3e0,stroke:#ffcc80
    style ADM fill:#fce4ec,stroke:#f48fb1
```

---

## Running Locally

```bash
cd psiog-insights-app/scratch/psiog-engineering-insights
npm install
npm run dev       # http://localhost:5173
npm run build     # verify 0 TypeScript errors
npm run preview   # preview production build
```

Backend expected at `http://localhost:8080`. See the backend repo for setup.
