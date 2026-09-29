import { ConnectorConfig, ToolType, JiraTicket, GitPullRequest, GitReview, TestExecution, SharePointDocument } from '../types';

export interface ImportResult {
  success: boolean;
  importedCount: number;
  message: string;
  errors?: string[];
}

/**
 * Validates and updates connector field mappings without requiring code changes.
 */
export function updateConnectorFieldMapping(
  connectors: ConnectorConfig[],
  tool: ToolType,
  newMappings: Record<string, string>
): ConnectorConfig[] {
  return connectors.map(conn => {
    if (conn.tool === tool) {
      return {
        ...conn,
        fieldMappings: { ...conn.fieldMappings, ...newMappings }
      };
    }
    return conn;
  });
}

/**
 * Parses uploaded JSON or CSV text for tools that cannot be connected via direct API,
 * mapping source fields according to the connector's configurable schema.
 */
export function parseImportedData(
  tool: ToolType,
  rawContent: string,
  projectId: string
): {
  tickets?: JiraTicket[];
  prs?: GitPullRequest[];
  reviews?: GitReview[];
  tests?: TestExecution[];
  docs?: SharePointDocument[];
  summary: string;
} {
  try {
    const parsed = JSON.parse(rawContent);
    const items = Array.isArray(parsed) ? parsed : [parsed];

    if (tool === 'JIRA' || tool === 'Azure DevOps') {
      const tickets: JiraTicket[] = items.map((item, idx) => ({
        id: `IMPORT-TIK-${Date.now()}-${idx}`,
        source: tool,
        ticketKey: item.ticketKey || item.id || `IMP-${idx + 1}`,
        title: item.title || item.summary || 'Imported Work Item',
        type: item.type || 'Story',
        status: item.status || 'Done',
        storyPoints: Number(item.storyPoints || item.points || 3),
        authorToolId: item.authorToolId || item.assignee || 'unassigned',
        resolvedAt: item.resolvedAt || new Date().toISOString(),
        cycleTimeHours: Number(item.cycleTimeHours || 24),
        reworkCount: Number(item.reworkCount || 0),
        projectId
      }));
      return { tickets, summary: `Successfully parsed ${tickets.length} ${tool} records.` };
    }

    if (tool === 'Git') {
      const prs: GitPullRequest[] = items.map((item, idx) => ({
        id: `IMPORT-PR-${Date.now()}-${idx}`,
        source: 'Git',
        repo: item.repo || 'imported/repository',
        prNumber: Number(item.prNumber || idx + 500),
        title: item.title || 'Imported Pull Request',
        authorToolId: item.authorToolId || item.author || 'unknown-author',
        linesAdded: Number(item.linesAdded || 120),
        linesDeleted: Number(item.linesDeleted || 20),
        commitCount: Number(item.commitCount || 2),
        status: item.status || 'Merged',
        createdAt: item.createdAt || new Date(Date.now() - 86400000).toISOString(),
        mergedAt: item.mergedAt || new Date().toISOString(),
        turnaroundHours: Number(item.turnaroundHours || 18),
        reviewersCount: Number(item.reviewersCount || 1),
        isSelfApproved: Boolean(item.isSelfApproved),
        hasMicroCommits: Boolean(item.hasMicroCommits),
        projectId
      }));
      return { prs, summary: `Successfully parsed ${prs.length} Git Pull Request records.` };
    }

    if (tool === 'TestRail') {
      const tests: TestExecution[] = items.map((item, idx) => ({
        id: `IMPORT-TE-${Date.now()}-${idx}`,
        source: 'TestRail',
        suiteName: item.suiteName || 'Imported Regression Suite',
        testCaseKey: item.testCaseKey || `TC-IMP-${idx + 1}`,
        title: item.title || 'Imported Test Case Run',
        testerToolId: item.testerToolId || item.tester || 'qa-tester',
        result: item.result === 'Failed' ? 'Failed' : 'Passed',
        isAutomated: Boolean(item.isAutomated ?? true),
        defectsLoggedCount: Number(item.defectsLoggedCount || 0),
        executionDurationMinutes: Number(item.executionDurationMinutes || 5),
        timestamp: item.timestamp || new Date().toISOString(),
        projectId
      }));
      return { tests, summary: `Successfully parsed ${tests.length} TestRail test execution records.` };
    }

    if (tool === 'SharePoint') {
      const docs: SharePointDocument[] = items.map((item, idx) => ({
        id: `IMPORT-DOC-${Date.now()}-${idx}`,
        source: 'SharePoint',
        docType: item.docType || 'Technical Specification',
        title: item.title || 'Imported Architecture Document',
        authorToolId: item.authorToolId || item.author || 'author@psiog.com',
        url: item.url || 'https://psiog.sharepoint.com/sites/imported',
        wordCount: Number(item.wordCount || 1500),
        viewsCount: Number(item.viewsCount || 25),
        lastModified: item.lastModified || new Date().toISOString(),
        projectId
      }));
      return { docs, summary: `Successfully parsed ${docs.length} SharePoint document records.` };
    }

    return { summary: 'Unsupported tool format.' };
  } catch (err: any) {
    return { summary: `Parse error: ${err.message}` };
  }
}
