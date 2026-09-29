# Performance Scoring Engine — Algorithm Documentation

## Overview

The Perf Insight scoring engine computes a **weighted, multi-dimensional performance score** for each engineer across a given evaluation period. The algorithm is:

- **Explainable** — every score includes a full calculation trace.
- **Fair** — accounts for leave, on-call duty, new joiners, and mid-period project moves.
- **Anti-gaming** — detects patterns that inflate metrics without real contribution.
- **Configurable** — weights and benchmarks are set per persona and offering in the model.

The same algorithm runs both client-side (TypeScript, `scoringEngine.ts`) for interactive previews and server-side (Java, `ScoringService.java`) for persisted, auditable results.

---

## Scoring Pipeline

```
Associate + Period + Model
         │
         ▼
1. TENURE SEGMENTATION (attributionEngine.ts)
   Split activities into project × role × date segments
   based on effective-dated ProjectRoleAssignment records
         │
         ▼
2. CONTEXT ADJUSTMENTS
   Apply ManagerContextNotes:
   - Remove leave/on-call days from the denominator
   - Scale benchmark targets by baselineAdjustmentPercent
         │
         ▼
3. ACTIVITY FILTERING
   Filter all activities to the period window.
   Map tool account handles to this associate via ToolAccountIdentity.
         │
         ▼
4. DIMENSION SCORING (×5 dimensions)
   For each: compute raw metrics, compare to persona+offering benchmark,
   produce a 0–100 dimension score
         │
         ▼
5. WEIGHTED COMPOSITE SCORE
   overallScore = Σ (dimensionScore × dimensionWeight)
         │
         ▼
6. RATING BAND ASSIGNMENT
   ≥90 → Exceeding Expectations
   ≥80 → Strong Performer
   ≥68 → Meeting Expectations
   <68  → Developing / Needs Support
         │
         ▼
7. ANTI-GAMING DETECTION (antiGamingEngine.ts)
   Run 8 rules. Flag patterns. Flags appear in the report
   but do NOT automatically reduce the score.
         │
         ▼
8. AI NARRATIVE SYNTHESIS
   Generate executive summary, key strengths, growth areas,
   and tenure shift narrative from computed facts.
```

---

## Step 1: Tenure Segmentation

`attributionEngine.calculateTenureSegments()` splits the evaluation period into segments based on `ProjectRoleAssignment` records. Each segment represents a period where the engineer held a specific role on a specific project.

**Example:**
- Jan 1 – Jul 31: Senior Engineer on Project A (100% allocation)
- Aug 1 – Sep 30: Lead on Project B (100% allocation)

Activities are attributed to the segment matching the event date. Story points resolved on Jul 15 count for the "Project A / Senior Engineer" segment; PRs merged on Aug 20 count for the "Project B / Lead" segment.

Each segment tracks:
- `activeCalendarDays` — calendar days in the segment within the evaluation period
- `allocationPercentage` — partial allocation (e.g. 50% for a split role)
- `effectiveWorkingDays` — active days × (allocation / 100)

**Why this matters:** Without segmentation, a mid-period promotion could unfairly compare an engineer's output as a Lead against Engineer benchmarks for the full period.

---

## Step 2: Context Adjustments

`ManagerContextNote` records inject fairness adjustments:

| Category | Effect |
|----------|--------|
| Leave | `totalLeaveDays` removed from effective working days denominator |
| On-Call Firefighting | Bonus (+10) added to Reliability dimension score |
| Onboarding | `baselineAdjustmentPercent` scales benchmark targets down |
| Mentorship | `baselineAdjustmentPercent` scales benchmark targets down |
| Special R&D Assignment | `baselineAdjustmentPercent` scales benchmark targets down |

The `baselineScalingFactor` is computed as:

```
baselineScalingFactor = max(0.3, 1 + totalAdjustmentPercent / 100)
effectiveMonths = (totalWorkingDays / 22) × baselineScalingFactor
```

This means benchmark targets shrink proportionally when the engineer has approved leave or other recognised commitments, preventing them from being penalised for time out of the office.

---

## Step 3: Activity Filtering

Activities are filtered by:
1. **Period window** — event date must fall within `[periodStart, periodEnd]`
2. **Identity** — `authorToolId` must match one of the engineer's known `ToolAccountIdentity` handles (case-insensitive)

Manual entries (`ManualDataEntry`) with the matching `associateId` are included on top of automated activities.

---

## Step 4: Dimension Scoring

### Dimension 1 — Delivery (default weight: 30%)

Measures how much work the engineer shipped.

```
rawStoryPoints = sum(ticket.storyPoints) + manualDeliveryPoints
rawMergedPRs = count(prs where status = 'Merged')

expectedStoryPoints = benchmark.expectedStoryPointsPerMonth × effectiveMonths
expectedPRs = benchmark.expectedMergedPRsPerMonth × effectiveMonths

pointsRatio = rawStoryPoints / expectedStoryPoints
prsRatio = rawMergedPRs / expectedPRs

deliveryRawScore = min(100, ((pointsRatio × 0.6) + (prsRatio × 0.4)) × 100)
deliveryScore = max(10, deliveryRawScore)
```

**Story points carry 60% of the delivery score; PR count carries 40%.** The floor of 10 prevents a 0 from a single anomalous period.

---

### Dimension 2 — Quality (default weight: 25%)

Measures the quality of delivered work.

```
totalBugs = count(tickets where type = 'Bug')
bugLeakPercent = (totalBugs / totalTickets) × 100
totalReworkBounces = sum(ticket.reworkCount)

qualityRawScore = 100 - (bugLeakPercent × 1.5) - (totalReworkBounces × 4)
qualityScore = max(30, min(100, qualityRawScore))
```

- Each percentage point of bug leak rate costs **1.5 points**.
- Each QA rework bounce costs **4 points**.
- Floor of 30 prevents extreme penalties for one noisy sprint.

---

### Dimension 3 — Code Review & Collaboration (default weight: 20%)

Measures the depth and quality of peer code reviews.

```
substantiveReviews = reviews where NOT isSuperficial AND substantiveCommentsCount > 0
totalSubstantiveComments = sum(substantiveReviews.substantiveCommentsCount)
expectedReviews = benchmark.expectedReviewsPerPR × rawMergedPRs × effectiveMonths

reviewRatio = substantiveReviews.length / expectedReviews
reviewRawScore = min(100, max(20, reviewRatio × 90 + (totalSubstantiveComments > 10 ? 10 : 0)))
```

**Superficial "LGTM" reviews are filtered out** (`isSuperficial = true`). Only reviews with substantive technical comments count. Engineers with > 10 substantive comments receive a 10-point bonus.

---

### Dimension 4 — Documentation (default weight: 15%)

Measures knowledge sharing through technical writing.

```
effectiveDocs = rawDocsCount + manualDocsAdded
totalDocWords = sum(docs.wordCount)
expectedDocs = max(1, (benchmark.expectedDocsPerQuarter / 3) × (totalWorkingDays / 22))

docRatio = effectiveDocs / expectedDocs
docRawScore = min(100, max(25, docRatio × 85 + (totalDocWords > 3000 ? 15 : 0)))
```

Engineers who write > 3,000 words of technical documentation (ADRs, specs, runbooks) receive a 15-point bonus. Floor of 25 acknowledges that documentation is often the least tooled-for activity.

---

### Dimension 5 — Reliability (default weight: 10%)

Measures operational reliability and incident response.

```
reliabilityRawScore = 85 (base)
if (totalOnCallDays > 0): reliabilityRawScore += 10    (on-call duty bonus)
if (totalReworkBounces > 4): reliabilityRawScore -= 15  (stability penalty)
reliabilityScore = max(40, min(100, reliabilityRawScore))
```

Engineers who serve on-call duty are rewarded with a bonus. High rework counts indicate unstable releases.

---

## Step 5: Weighted Composite Score

```
overallScore = round(
  deliveryScore × deliveryWeight +
  qualityScore × qualityWeight +
  reviewScore × reviewWeight +
  docScore × docWeight +
  reliabilityScore × reliabilityWeight
)
```

**Default weights by persona:**

| Persona | Delivery | Quality | Review | Documentation | Reliability |
|---------|----------|---------|--------|---------------|-------------|
| Engineer | 35% | 30% | 15% | 10% | 10% |
| Senior Engineer | 30% | 25% | 20% | 15% | 10% |
| Lead | 20% | 20% | 25% | 20% | 15% |

Weights are configurable in `ModelBuilderView` and stored in `PerformanceModelVersion.weightsByPersona`.

---

## Step 6: Rating Band Assignment

| Score | Band |
|-------|------|
| ≥ 90 | Exceeding Expectations |
| ≥ 80 | Strong Performer |
| ≥ 68 | Meeting Expectations |
| < 68 | Developing / Needs Support |

---

## Step 7: Anti-Gaming Detection

`antiGamingEngine.detectAntiGamingPatterns()` checks 8 rules:

| Rule | Flag Type | Severity | Trigger Condition |
|------|-----------|----------|-------------------|
| Micro-commit spam | `MicroCommitSpam` | medium | High ratio of commits with < 5 lines changed |
| Self-approved PRs | `SelfApprovedPR` | high | PRs merged without independent reviewer |
| Superficial reviews | `SuperficialReview` | low | Review comments below word threshold |
| Ticket churning | `TicketChurning` | medium | Ticket bounce count exceeds threshold |
| Duplicate test runs | `DuplicateTestRun` | low | Same test case executed multiple times in quick succession |
| Story point inflation | `PointInflation` | medium | Average story points > 2× peer median |
| PR splitting | `PRSplitting` | medium | Very high PR count with low average lines changed |
| End-of-period spike | `DeliverySpike` | low | ≥ 40% of deliverables in final 3 days of period |

**Flags are prompts for conversation, not automatic score penalties.** They appear in the associate's report and can be dismissed by a manager or service head with a reason.

---

## Step 8: AI Narrative Synthesis

The AI narrative section is generated from computed facts (never raw data):

| Section | Content |
|---------|---------|
| `executiveSummary` | Overall score, rating band, key activity counts, context adjustments applied |
| `keyStrengths` | Dimensions scoring ≥ 80, on-call duty served, strong review contribution |
| `growthAreas` | Dimensions scoring < 75, anti-gaming flags present, documentation gap |
| `tenureShiftNarrative` | Explains project/role transitions within the period if `tenureSegments.length > 1` |

---

## Benchmarks by Offering and Persona

Stored in `PerformanceModelVersion.benchmarksByOffering`. Defaults:

| Offering | Persona | Story Pts/Month | Merged PRs/Month | Reviews/PR | Bug Leak % | Docs/Quarter |
|---------|---------|-----------------|-----------------|-----------|-----------|-------------|
| Cloud & DevOps | Engineer | 20 | 4 | 2 | 8% | 1 |
| Cloud & DevOps | Senior Engineer | 30 | 6 | 3 | 5% | 2 |
| Cloud & DevOps | Lead | 25 | 4 | 4 | 3% | 3 |
| Fullstack Web & Mobile | Engineer | 25 | 5 | 2 | 10% | 1 |
| Fullstack Web & Mobile | Senior Engineer | 35 | 8 | 3 | 6% | 2 |
| QA & Test Automation | Engineer | 15 | 2 | 1 | 5% | 1 |
| Data & AI | Senior Engineer | 20 | 4 | 3 | 4% | 3 |

Benchmarks are configurable in `ModelBuilderView` and stored in `PerformanceModelVersion.benchmarksByOffering`.

---

## Sparse Data Handling

When data is sparse, the report includes a warning:

```typescript
isSparse = totalWorkingDays < 15 || (rawStoryPoints < 5 && prs.length < 2)

sparseDataWarning = {
  isSparse: true,
  reason: "Low activity sample size. Results normalized using statistical shrinkage.",
  confidenceInterval: "±12 points"
}
```

Sparse data warnings are displayed prominently in the report to prevent over-interpretation of scores from short or low-activity periods.
