export interface JiraUserSummary {
  user: {
    accountId: string;
    displayName: string;
    email: string;
    active: boolean;
    accountType: string;
    matchScore: number;
  };
  project: {
    key: string;
    name: string;
    id: string;
    userIsAssignable: boolean;
  };
  from: string | null;
  to: string | null;
  jql: string;
  tickets: {
    total: number;
    completed: number;
    inProgress: number;
    toDo: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  };
  storyPoints: {
    total: number;
    completed: number;
    inProgress: number;
    toDo: number;
    ticketsWithoutEstimate: number;
    fieldsUsed: string[];
  };
  timeLogged: {
    seconds: number;
    hours: number;
    pretty: string;
    worklogCount: number;
    issuesWorkedOn: number;
    originalEstimateSecondsOnAssigned: number;
    hoursByIssue: Record<string, number>;
  };
  development: {
    available: boolean;
    commitsLinkedToHisIssues: number;
    commitsAuthoredByHim: number;
    pullRequestsLinkedToHisIssues: number;
    pullRequestsAuthoredByHim: number;
    pullRequestsMerged: number;
    pullRequestsOpen: number;
    issuesWithDevActivity: number;
    sources: string[];
    note: string;
  };
  issues: JiraIssue[];
  warnings: string[];
}

export interface JiraIssue {
  key: string;
  id: string;
  summary: string;
  type: string;
  status: string;
  statusCategory: 'new' | 'indeterminate' | 'done';
  priority: string | null;
  storyPoints: number;
  hoursLoggedByHim: number | null;
  created: string;
  resolved: string | null;
  commits: number;
  pullRequests: number;
  url: string;
}
