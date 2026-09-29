import {
  GitPullRequest,
  GitReview,
  JiraTicket,
  TestExecution,
  AntiGamingFlag,
  AntiGamingThresholds
} from '../types';

export function detectAntiGamingPatterns(
  associateId: string,
  userPRs: GitPullRequest[],
  userReviews: GitReview[],
  userTickets: JiraTicket[],
  userTests: TestExecution[],
  rules: AntiGamingThresholds
): AntiGamingFlag[] {
  const flags: AntiGamingFlag[] = [];

  // 1. Detect Self-Approved PRs
  if (rules.flagSelfApproval) {
    for (const pr of userPRs) {
      if (pr.isSelfApproved || (pr.reviewersCount === 0 && pr.status === 'Merged')) {
        flags.push({
          id: `AG-SELF-${pr.id}`,
          type: 'SelfApprovedPR',
          severity: 'high',
          title: 'Unreviewed / Self-Approved PR Merge',
          description: `PR #${pr.prNumber} ("${pr.title}") was merged without independent peer review approval.`,
          evidence: `Repository: ${pr.repo} | Status: ${pr.status} | Reviewers: ${pr.reviewersCount}`,
          detectedAt: pr.mergedAt || pr.createdAt
        });
      }
    }
  }

  // 2. Detect Micro-Commit Bursting (Gaming commit count)
  for (const pr of userPRs) {
    const totalLines = pr.linesAdded + pr.linesDeleted;
    if (pr.commitCount >= 5 && totalLines > 0) {
      const avgLinesPerCommit = totalLines / pr.commitCount;
      if (avgLinesPerCommit < 5 || pr.hasMicroCommits) {
        flags.push({
          id: `AG-MICRO-${pr.id}`,
          type: 'MicroCommitSpam',
          severity: 'medium',
          title: 'High Micro-Commit Frequency',
          description: `PR #${pr.prNumber} contains ${pr.commitCount} separate commits for only ${totalLines} total lines altered (${avgLinesPerCommit.toFixed(1)} lines/commit).`,
          evidence: `PR: #${pr.prNumber} | Commits: ${pr.commitCount} | Net lines: +${pr.linesAdded}/-${pr.linesDeleted}`,
          detectedAt: pr.createdAt
        });
      }
    }
  }

  // 3. Detect Superficial Code Reviews
  for (const rev of userReviews) {
    if (rev.isSuperficial || rev.substantiveCommentsCount === 0) {
      flags.push({
        id: `AG-REV-${rev.id}`,
        type: 'SuperficialReview',
        severity: 'low',
        title: 'Superficial Code Review Recorded',
        description: `Review on "${rev.prTitle}" was marked as approval without substantive technical feedback comments.`,
        evidence: `Verdict: ${rev.verdict} | Turnaround: ${rev.turnaroundHours}h | Comments count: ${rev.substantiveCommentsCount}`,
        detectedAt: rev.timestamp
      });
    }
  }

  // 4. Detect Ticket Churning / Status Bouncing
  for (const t of userTickets) {
    if (t.reworkCount >= rules.maxTicketBounceCount) {
      flags.push({
        id: `AG-CHURN-${t.id}`,
        type: 'TicketChurning',
        severity: 'medium',
        title: 'Excessive Ticket Status Rework / Bouncing',
        description: `Ticket ${t.ticketKey} bounced ${t.reworkCount} times between In Progress and QA/Review, indicating premature completion or unclear specifications.`,
        evidence: `Ticket: ${t.ticketKey} | Cycle time: ${t.cycleTimeHours}h | Bounces: ${t.reworkCount}`,
        detectedAt: t.resolvedAt
      });
    }
  }

  return flags;
}
