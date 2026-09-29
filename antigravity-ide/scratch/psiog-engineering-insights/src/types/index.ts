// TypeScript Interfaces for Psiog Engineering Performance Insights

export type Persona = 'Engineer' | 'Senior Engineer' | 'Lead';

export type Offering = 
  | 'Cloud & DevOps'
  | 'Fullstack Web & Mobile'
  | 'QA & Test Automation'
  | 'Data & AI';

export type ToolType = 'JIRA' | 'Azure DevOps' | 'Git' | 'TestRail' | 'SharePoint';

export type UserRole = 'Engineer' | 'Lead' | 'Delivery Head' | 'Admin';

export interface Project {
  id: string;
  name: string;
  code: string;
  offering: Offering;
  client: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'On Hold';
  healthScore: number;
  deliveryHeadId: string;
  leadId: string;
  description: string;
  connectedTools: ToolType[];
}

export interface Associate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string; // e.g. "Senior Software Engineer"
  primaryOffering: Offering;
  joinedDate: string;
  location: string;
  managerId?: string;
}

export interface ProjectRoleAssignment {
  id: string;
  associateId: string;
  projectId: string;
  role: Persona;
  startDate: string;
  endDate: string | null; // null means currently ongoing
  allocationPercentage: number; // e.g., 100 for 100% full-time, 50 for split
  notes?: string;
}

export interface ToolAccountIdentity {
  id: string;
  associateId: string | null; // null if unmapped orphan
  tool: ToolType;
  accountHandle: string; // e.g., 'alex-gh' or 'arivera_jira'
  accountEmail?: string;
  accountDisplayName: string;
  confidenceScore: number; // 0 to 100%
  status: 'matched' | 'unmatched' | 'manual_override';
  lastMatchedAt?: string;
  notes?: string;
}

export interface ManagerContextNote {
  id: string;
  associateId: string;
  projectId: string;
  authorId: string;
  authorName: string;
  periodLabel: string; // e.g., 'Q1 2026' or '2026-02'
  category: 'Leave' | 'Onboarding' | 'On-Call Firefighting' | 'Mentorship' | 'Special R&D Assignment';
  impactDays: number;
  description: string;
  baselineAdjustmentPercent: number; // e.g., -25 means reduce expected baseline by 25% for fair evaluation
  createdAt: string;
}

export interface ManualDataEntry {
  id: string;
  associateId: string;
  projectId: string;
  dimension: 'Delivery' | 'Quality' | 'Review' | 'Documentation' | 'Reliability';
  metricName: string; // e.g. "Ad-hoc Architecture Spike Hours"
  value: number;
  unit: string;
  reason: string;
  enteredBy: string;
  enteredAt: string;
  isOverride: boolean; // if true, overlays on top of an automated metric
  originalMetricValue?: number;
}

// Activity Entities
export interface JiraTicket {
  id: string;
  source: 'JIRA' | 'Azure DevOps';
  ticketKey: string;
  title: string;
  type: 'Story' | 'Bug' | 'Spike' | 'Tech Debt' | 'Task';
  status: 'Done' | 'In Progress' | 'In Review' | 'Blocked';
  storyPoints: number;
  authorToolId: string;
  resolvedAt: string; // ISO date
  cycleTimeHours: number;
  reworkCount: number; // bounce count between In Progress & QA
  projectId: string;
}

export interface GitPullRequest {
  id: string;
  source: 'Git';
  repo: string;
  prNumber: number;
  title: string;
  authorToolId: string;
  linesAdded: number;
  linesDeleted: number;
  commitCount: number;
  status: 'Merged' | 'Open' | 'Closed';
  createdAt: string;
  mergedAt: string;
  turnaroundHours: number;
  reviewersCount: number;
  isSelfApproved: boolean;
  hasMicroCommits: boolean; // anti-gaming flag
  projectId: string;
}

export interface GitReview {
  id: string;
  source: 'Git';
  prId: string;
  prTitle: string;
  reviewerToolId: string;
  substantiveCommentsCount: number;
  isSuperficial: boolean; // e.g., under 5 words or pure "+1"
  verdict: 'Approved' | 'Changes Requested' | 'Commented';
  timestamp: string;
  turnaroundHours: number;
  projectId: string;
}

export interface TestExecution {
  id: string;
  source: 'TestRail';
  suiteName: string;
  testCaseKey: string;
  title: string;
  testerToolId: string;
  result: 'Passed' | 'Failed' | 'Blocked';
  isAutomated: boolean;
  defectsLoggedCount: number;
  executionDurationMinutes: number;
  timestamp: string;
  projectId: string;
}

export interface SharePointDocument {
  id: string;
  source: 'SharePoint';
  docType: 'Architecture Decision Record' | 'Technical Specification' | 'Runbook & Guides' | 'Knowledge Base';
  title: string;
  authorToolId: string;
  url: string;
  wordCount: number;
  viewsCount: number;
  lastModified: string;
  projectId: string;
}

// Model Configuration & Weights
export interface DimensionWeights {
  delivery: number; // e.g. 0.30 (30%)
  quality: number; // e.g. 0.25 (25%)
  review: number; // e.g. 0.20 (20%)
  documentation: number; // e.g. 0.15 (15%)
  reliability: number; // e.g. 0.10 (10%)
}

export interface OfferingPersonaBenchmark {
  expectedStoryPointsPerMonth: number;
  expectedMergedPRsPerMonth: number;
  expectedReviewsPerPR: number;
  maxBugLeakRatePercent: number;
  expectedDocsPerQuarter: number;
  expectedTestRunsPerMonth?: number;
}

export interface AntiGamingThresholds {
  maxMicroCommitBurstRatio: number; // commits with < 5 lines / total commits
  minReviewCommentLength: number; // words
  flagSelfApproval: boolean;
  maxTicketBounceCount: number;
}

export interface PerformanceModelVersion {
  versionId: string; // e.g. 'v2.1-2026'
  name: string;
  publishedAt: string;
  publishedBy: string;
  rationaleDocumentation: string;
  isActive: boolean;
  weightsByPersona: Record<Persona, DimensionWeights>;
  benchmarksByOffering: Record<Offering, Record<Persona, OfferingPersonaBenchmark>>;
  antiGamingRules: AntiGamingThresholds;
}

// Calculated Performance Score and Breakdown
export interface DimensionalScoreDetail {
  score: number; // 0 - 100
  weight: number;
  rawMetrics: Record<string, number | string>;
  benchmarkTarget: number | string;
  explanation: string;
  isAdjustedByContext: boolean;
}

export interface TenureAttributionSegment {
  projectId: string;
  projectName: string;
  offering: Offering;
  role: Persona;
  startDate: string;
  endDate: string;
  activeCalendarDays: number;
  allocationPercentage: number;
  effectiveWorkingDays: number;
  segmentOverallScore: number;
  activitiesCount: {
    tickets: number;
    prs: number;
    reviews: number;
    tests: number;
    docs: number;
  };
}

export interface AntiGamingFlag {
  id: string;
  type: 'MicroCommitSpam' | 'SelfApprovedPR' | 'SuperficialReview' | 'TicketChurning' | 'DuplicateTestRun';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  evidence: string;
  detectedAt: string;
  dismissed?: boolean;
}

export interface CalculatedPerformanceReport {
  associateId: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  overallScore: number; // 0 - 100
  ratingBand: 'Exceeding Expectations' | 'Strong Performer' | 'Meeting Expectations' | 'Developing / Needs Support';
  tenureSegments: TenureAttributionSegment[];
  dimensions: {
    delivery: DimensionalScoreDetail;
    quality: DimensionalScoreDetail;
    review: DimensionalScoreDetail;
    documentation: DimensionalScoreDetail;
    reliability: DimensionalScoreDetail;
  };
  contextAdjustments: {
    totalLeaveDays: number;
    totalOnCallDays: number;
    baselineScalingFactor: number;
    notesApplied: ManagerContextNote[];
  };
  sparseDataWarning?: {
    isSparse: boolean;
    reason: string;
    confidenceInterval: string;
  };
  antiGamingFlags: AntiGamingFlag[];
  aiInsights: {
    executiveSummary: string;
    keyStrengths: string[];
    growthAreas: string[];
    tenureShiftNarrative: string;
  };
}

// Connector & Field Mapping Types
export interface ConnectorConfig {
  id: string;
  tool: ToolType;
  name: string;
  status: 'Connected' | 'Error' | 'Mock Active' | 'Syncing';
  endpointUrl: string;
  authType: 'API Token' | 'OAuth2' | 'PAT' | 'Service Principal';
  lastSyncedAt: string;
  recordsCount: number;
  fieldMappings: Record<string, string>; // e.g. { "customfield_10028": "storyPoints", "status.name": "status" }
}

export interface SyncLogEntry {
  id: string;
  tool: ToolType;
  syncTimestamp: string;
  recordsFetched: number;
  recordsInserted: number;
  recordsUpdated: number;
  durationMs: number;
  status: 'Success' | 'Partial' | 'Failed';
  watermark: string;
}
