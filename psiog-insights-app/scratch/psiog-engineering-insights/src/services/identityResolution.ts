import {
  Associate,
  ToolAccountIdentity,
  ToolType,
  JiraTicket,
  GitPullRequest,
  GitReview,
  TestExecution,
  SharePointDocument
} from '../types';

export interface UnmatchedActivityItem {
  id: string;
  sourceTool: ToolType;
  sourceIdentifier: string;
  activityType: 'Ticket' | 'Pull Request' | 'Code Review' | 'Test Run' | 'Document';
  title: string;
  timestamp: string;
  projectId: string;
}

/**
 * Resolves an account handle or email to an Associate ID based on existing mappings.
 */
export function resolveToolAccountToAssociateId(
  tool: ToolType,
  identifier: string,
  identities: ToolAccountIdentity[]
): string | null {
  const match = identities.find(
    id => id.tool === tool && (id.accountHandle.toLowerCase() === identifier.toLowerCase() || (id.accountEmail && id.accountEmail.toLowerCase() === identifier.toLowerCase()))
  );
  return match && match.associateId ? match.associateId : null;
}

/**
 * Suggests an associate match for an unmatched tool account based on heuristic scoring.
 */
export function suggestAssociateMatch(
  toolAccount: ToolAccountIdentity,
  associates: Associate[]
): { associate: Associate; confidence: number; matchReason: string } | null {
  const handle = toolAccount.accountHandle.toLowerCase().replace(/[^a-z0-9]/g, '');
  const email = (toolAccount.accountEmail || '').toLowerCase();

  for (const assoc of associates) {
    const assocEmail = assoc.email.toLowerCase();
    const assocName = assoc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const [firstName, lastName] = assoc.name.toLowerCase().split(' ');

    // 1. Exact email match
    if (email && email === assocEmail) {
      return { associate: assoc, confidence: 100, matchReason: 'Exact corporate email match' };
    }

    // 2. Email username match (e.g. alex.rivera)
    const emailPrefix = assocEmail.split('@')[0].replace(/[^a-z0-9]/g, '');
    if (handle.includes(emailPrefix) || emailPrefix.includes(handle)) {
      return { associate: assoc, confidence: 90, matchReason: 'Email prefix handle match' };
    }

    // 3. Name fuzzy match (first + last initial)
    if (firstName && lastName) {
      const flInitials = (firstName[0] + lastName).toLowerCase();
      const lfInitials = (lastName + firstName[0]).toLowerCase();
      if (handle.includes(flInitials) || handle.includes(lfInitials) || handle.includes(lastName)) {
        return { associate: assoc, confidence: 75, matchReason: 'Name initials/surname match' };
      }
    }
  }

  return null;
}

/**
 * Scans all raw activity records across tools to find items created by tool accounts
 * that are currently unlinked / unmatched to any Associate.
 */
export function findUnmatchedActivities(
  identities: ToolAccountIdentity[],
  tickets: JiraTicket[],
  prs: GitPullRequest[],
  reviews: GitReview[],
  tests: TestExecution[],
  docs: SharePointDocument[]
): UnmatchedActivityItem[] {
  const unmatched: UnmatchedActivityItem[] = [];

  const isResolved = (tool: ToolType, authorToolId: string) => {
    return identities.some(
      id => id.tool === tool && 
            id.associateId !== null &&
            (id.accountHandle.toLowerCase() === authorToolId.toLowerCase() || 
             (id.accountEmail && id.accountEmail.toLowerCase() === authorToolId.toLowerCase()))
    );
  };

  // Check tickets
  for (const t of tickets) {
    if (!isResolved(t.source, t.authorToolId)) {
      unmatched.push({
        id: t.id,
        sourceTool: t.source,
        sourceIdentifier: t.authorToolId,
        activityType: 'Ticket',
        title: `${t.ticketKey}: ${t.title}`,
        timestamp: t.resolvedAt,
        projectId: t.projectId
      });
    }
  }

  // Check PRs
  for (const pr of prs) {
    if (!isResolved('Git', pr.authorToolId)) {
      unmatched.push({
        id: pr.id,
        sourceTool: 'Git',
        sourceIdentifier: pr.authorToolId,
        activityType: 'Pull Request',
        title: `PR #${pr.prNumber}: ${pr.title}`,
        timestamp: pr.mergedAt || pr.createdAt,
        projectId: pr.projectId
      });
    }
  }

  // Check Reviews
  for (const r of reviews) {
    if (!isResolved('Git', r.reviewerToolId)) {
      unmatched.push({
        id: r.id,
        sourceTool: 'Git',
        sourceIdentifier: r.reviewerToolId,
        activityType: 'Code Review',
        title: `Review on ${r.prTitle} (${r.verdict})`,
        timestamp: r.timestamp,
        projectId: r.projectId
      });
    }
  }

  // Check Tests
  for (const te of tests) {
    if (!isResolved('TestRail', te.testerToolId)) {
      unmatched.push({
        id: te.id,
        sourceTool: 'TestRail',
        sourceIdentifier: te.testerToolId,
        activityType: 'Test Run',
        title: `${te.testCaseKey}: ${te.title}`,
        timestamp: te.timestamp,
        projectId: te.projectId
      });
    }
  }

  // Check SharePoint
  for (const d of docs) {
    if (!isResolved('SharePoint', d.authorToolId)) {
      unmatched.push({
        id: d.id,
        sourceTool: 'SharePoint',
        sourceIdentifier: d.authorToolId,
        activityType: 'Document',
        title: `${d.docType}: ${d.title}`,
        timestamp: d.lastModified,
        projectId: d.projectId
      });
    }
  }

  return unmatched;
}
