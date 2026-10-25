# SARA - Responsible AI Decision Support

A design-system prototype exploring how AI recommendations can be made **transparent, controllable and auditable** in high-stakes domains such as credit assessment and healthcare.

The project tackles a core UX problem: users cannot tell when an AI is wrong, leading to either blind trust (*automation bias*) or blanket distrust (*algorithm aversion*). SARA demonstrates interface patterns that give domain experts the context they need to make informed decisions alongside AI.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## Design Principles

The interface is built around four pillars:

| Pillar | What it means |
|---|---|
| **Transparency** | Clearly separate AI-generated content from source data. Show provenance, data freshness and "Why?" explanations with top factors and assumptions. |
| **Uncertainty** | Display confidence with a reason, never just a number. Flag stale, missing or conflicting data and suggest concrete next steps when reliability is low. |
| **Human-in-the-loop** | The user can accept, edit or reject every AI suggestion. No auto-pilot - every decision requires an active choice, and overrides are logged with a mandatory category. |
| **Traceability** | Every state change is logged with input, output, timestamp and user identity. The audit trail is read-only, exportable and readable by third-party compliance reviewers. |

---

## Scenarios

The prototype implements four progressive scenarios using a fictional credit-assessment case:

| Scenario | Description |
|---|---|
| **State 1 - Normal** | AI recommends denial, high confidence, all data current. The baseline flow. |
| **State 2 - Uncertainty** | AI recommends denial, medium confidence. One data source is >6 months old, triggering uncertainty indicators and a disabled approve button. |
| **State 3 - Override** | AI recommends approval, but the analyst overrides to deny. Override modal with category selection, free-text, preview and full audit trail. |
| **State 4 - Audit** | Compliance review mode. Read-only view of the entire decision trail. |

---

## Component Library

17 purpose-built components organized by the four pillars:

**Transparency** - `SourceProvenancePanel`, `SourceDrawer`, `SourceDocumentView`, `SparklineCard`

**Uncertainty** - `ConfidenceIndicator`, `AIRecommendationCard`, `NextBestActionChip`, `CashFlowCard` / `CashFlowSimulationView`

**Human-in-the-loop** - `DecisionActionBar`, `SimulationView`, `KeyMetricSourceDrawer`, `LiquidityGaugeCard`

**Traceability** - `DecisionLogTimeline`, `DebtRatioZoneCard`, `InterestCoverageCard`

Plus 6 shared UI primitives (`Button`, `Card`, `Badge`, `Checkbox`, `Dialog`, `Tabs`) following shadcn/ui conventions.

---

## Tech Stack

- **React 18** - functional components, hooks
- **Vite 5** - dev server and build
- **Tailwind CSS 3** - utility-first styling with HSL design tokens
- **Recharts** - sparklines and data visualizations
- **Lucide React** - icon system

All data is hard-coded mock data (no API calls). Desktop-first layout, minimum 1280px.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the prototype.

---

## Project Context

This is a design-engineering portfolio project demonstrating UX patterns for responsible AI in regulated industries. The focus is on the interface design and interaction patterns, not on the AI/ML models themselves.

Key design decisions:
- **Colour is never the only signal** - every status uses icon + text alongside colour
- **Confidence levels are semantic** (`"low"`, `"medium"`, `"high"`), not numeric percentages
- **Provenance is always visible** in the main view, not hidden behind a drawer
- **Override friction is minimal** - 2 clicks with 3-5 pre-filled category options + optional free-text
