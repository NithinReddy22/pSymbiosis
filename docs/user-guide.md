# User Guide — Perf Insight

## Introduction

Perf Insight is an engineering performance intelligence platform. It aggregates activity data from the tools your team already uses — JIRA, GitHub, Azure DevOps, TestRail, SharePoint — and generates fair, explainable performance insights for each engineer.

**Important:** Scores are peer-relative positions, not absolute ratings. A score of 75 means the engineer's output was in the 75th percentile of peers in a similar role and offering — not that they're "75% good."

---

## Roles and Access

| Role | What You Can See | What You Can Do |
|------|-----------------|----------------|
| **Employee** | Your own performance data only | View your reports; see your context notes (if visible) |
| **Manager** | Your team's data + projects you lead | Add manual entries, overrides, and context notes for your team |
| **Service Head** | Organisation-wide data | Trigger scoring runs and anomaly detection; dismiss flags |
| **Admin** | Everything | Full configuration access |

---

## Navigation

The **Sidebar** on the left shows the views available to your role:

| View | Icon | Available To |
|------|------|-------------|
| Executive Overview | Dashboard | Service Head, Admin |
| My Performance | Person | Employee (own data) |
| Team | Team | Manager, Service Head, Admin |
| Projects | Folder | All roles |
| Connectors | Plug | Admin |
| Identity Resolution | Link | Manager, Admin |
| Manual Data Audit | Edit | Manager, Admin |
| Model Builder | Settings | Admin |
| AI Insights | Sparkles | Manager, Service Head, Admin |

---

## Viewing Your Performance Report (Employee)

1. Log in — you'll land on **My Performance**.
2. The top of the page shows your **overall score** (0–100) and **rating band**.
3. The **Radar Chart** shows your 5 dimensional scores: Delivery, Quality, Review, Documentation, Reliability.
4. Scroll down to see the **dimensional breakdown** — each dimension shows:
   - Your actual score vs. the benchmark target for your role and offering
   - The raw metrics used (e.g. "38 story points delivered, benchmark: 30")
   - Whether a context adjustment was applied (e.g. leave days)
5. The **AI Summary** section shows narrative insights: executive summary, key strengths, growth areas.
6. If there are **Anti-Gaming Flags**, they appear at the bottom of the report. Flags are surfaced for discussion — they don't automatically change your score.
7. Click **Explain** to open the full calculation trace.
8. Click **Export Report** to download a PDF or CSV of your performance report.

---

## Understanding the Score

### Delivery (30%)
Story points you completed + PRs you merged, compared to the expected output for your persona (Engineer / Senior Engineer / Lead) and offering over the active period. Leave and on-call days are removed from the denominator before comparison.

### Quality (25%)
Assessed from your bug leak rate (bugs as a percentage of total resolved tickets) and rework bounce count (how often tickets bounced between In Progress and QA). Lower bug rates and fewer bounces produce a higher quality score.

### Code Review & Collaboration (20%)
Counts only **substantive** reviews — ones where you left meaningful technical comments. Simple "LGTM" or one-word approvals are filtered out. More substantive reviews with richer feedback produce a higher score.

### Documentation (15%)
Documents you authored or significantly updated in SharePoint: Architecture Decision Records, Technical Specifications, Runbooks, and Knowledge Base articles. Word count and views are taken into account.

### Reliability (10%)
Baseline is 85. On-call duty adds a bonus (+10). High rework bounce counts (> 4) indicate unstable releases and apply a penalty (−15).

---

## Adding Context Notes (Manager)

Context notes let managers document events that affect fair evaluation:

1. Open the associate's performance view.
2. Click **Add Context Note**.
3. Select the category:
   - **Leave** — Approved annual leave or sick leave.
   - **Onboarding** — New to a project or technology stack; expected lower initial output.
   - **On-Call Firefighting** — Unplanned incident response that consumed sprint capacity.
   - **Mentorship** — Substantial time coaching junior team members.
   - **Special R&D Assignment** — Exploration or research work not captured by standard metrics.
4. Enter `Impact Days` and `Baseline Adjustment %` (e.g. 10 leave days = −20% baseline).
5. The next scoring run will apply the adjustment automatically.

---

## Adding Manual Data Entries (Manager)

For work that isn't captured by connected tools:

1. Open **Manual Data Audit** from the sidebar.
2. Click **Add Manual Entry**.
3. Select the associate, project, and dimension.
4. Enter the metric name, value, unit, and a clear reason.
5. The entry will be included in the next scoring run.

**Examples of valid manual entries:**
- Architecture spike hours (off-tool whiteboarding session)
- Client-facing demo preparation hours
- Documentation written in a non-SharePoint system

---

## Resolving Unmatched Tool Identities (Manager, Admin)

Sometimes a GitHub handle or Jira username can't be automatically matched to an associate:

1. Open **Identity Resolution** from the sidebar.
2. The panel shows all unmatched accounts with a sample of their unattributed activities.
3. Fuzzy match suggestions are shown with confidence scores.
4. Click **Link** to confirm a match, or **Ignore** if the account belongs to a bot or external contractor.

Once linked, all historical activities from that account are attributed to the associate and included in future scoring runs.

---

## Configuring Tool Connectors (Admin)

1. Open **Connectors** from the sidebar.
2. Each project can have up to 5 connectors (one per tool type).
3. Click a connector to configure:
   - **Mode:** LIVE (direct API), MOCK (local JSON files), FILE (CSV/JSON import).
   - **Endpoint URL** and **credentials** (referenced by name, never stored in the UI).
   - **Field mappings** — JSONPath expressions to map custom fields.
4. Click **Sync Now** to trigger an immediate incremental sync.
5. The **Sync Log** shows the result of each sync: records fetched, inserted, updated, and any errors.

---

## Building a Scoring Model (Admin)

1. Open **Model Builder** from the sidebar.
2. View the active model's configuration.
3. Click **New Version** to create a draft from the current model.
4. Adjust:
   - **Dimension weights** per persona (must sum to 100%).
   - **Benchmark targets** per offering and persona.
   - **Anti-gaming thresholds** (minimum review comment length, max micro-commit ratio, etc.).
5. Enter the **rationale documentation** — this is required before publishing.
6. Click **Publish** to make the new model active. All future scoring runs use the new model.

---

## Reviewing Anti-Gaming Flags (Service Head, Admin)

1. Go to **AI Insights** or open any associate's report.
2. Anti-gaming flags are listed with:
   - **Type** (e.g. `SelfApprovedPR`, `SuperficialReview`)
   - **Severity** (low / medium / high)
   - **Evidence** (which activities triggered the flag)
3. Click **Dismiss** to mark a flag as a false positive. Enter a reason — this is recorded in the audit trail.
4. Click **Confirm** to acknowledge the pattern as genuine and note it for the review discussion.

**Flags are starting points for conversation, not score penalties.** A manager reviews them in context during the qualitative review.

---

## Exporting Reports

From any associate's performance view:
1. Click **Export Report**.
2. Choose format: **PDF Summary** or **CSV Breakdown**.
3. The export includes the overall score, dimensional breakdown, key metrics, and AI summary.

---

## FAQ

**Q: My score dropped compared to last quarter even though I did the same work.**  
A: Scores are peer-relative. If your peers raised their output, the percentile shifts. Check the "Explain" trace to see which dimension drove the change.

**Q: I completed a major architecture document that isn't showing in my Documentation score.**  
A: If the document is in SharePoint, it should sync automatically on the next 6-hour cycle. If it's in another system, ask your manager to add a Manual Data Entry.

**Q: I was on leave for 2 weeks but my score doesn't reflect that.**  
A: Ask your manager to add a **Leave** Context Note covering those dates. The scoring denominator will be adjusted before the next scoring run.

**Q: A GitHub handle isn't matched to me.**  
A: Contact your Admin or Manager and ask them to link the handle in the Identity Resolution view.

**Q: What does "Sparse Data Warning" mean?**  
A: Your score was calculated from a small sample of activity (fewer than 15 effective working days or fewer than 5 story points + 2 PRs). The score is still valid but less statistically reliable — treat it as indicative, not definitive.
