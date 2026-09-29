// Client for the backend Dashboard API (proxied to localhost:8080 by Vite, see vite.config.ts).

export interface ScoreComponent {
  metric: string;
  value: number;
  normalised: number;
  weight: number;
  effectiveWeight: number;
  contribution: number;
  included: boolean;
  note: string | null;
}

export interface DeveloperSummary {
  userId: number;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  totalStories: number;
  completedStories: number;
  inProgressStories: number;
  toDoStories: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  completionRatePct: number;
  avgCycleTimeDays: number;
  pullRequests: number;
  mergedPullRequests: number;
  prMergeRatePct: number;
  commits: number;
  linesAdded: number;
  linesRemoved: number;
  score: number;
  band: string;
  rank: number;
  scoreBreakdown: ScoreComponent[];
}

export interface DashboardOverview {
  from: string | null;
  to: string | null;
  kpis: Record<string, number>;
  statusDistribution: Record<string, number>;
  storyPointsByDeveloper: { name: string; completedPoints: number; openPoints: number; completedStories: number }[];
  githubByDeveloper: { name: string; pullRequests: number; merged: number; commits: number; linesAdded: number; linesRemoved: number }[];
  weeklyTrend: { weekStart: string; storiesCompleted: number; pointsCompleted: number; prsMerged: number; commits: number }[];
  leaderboard: DeveloperSummary[];
  insights: string[];
  method?: string;
}

export interface DashboardUser {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface DeveloperDetail {
  metrics: DeveloperSummary;
  teamSize: number;
  stories: { storyId: string; title: string; storyPoints: number; status: string; createdDate: string; completedDate: string | null; cycleDays: number | null; jiraUrl: string }[];
  pullRequests: { repository: string; pullRequestId: string; commits: number; linesAdded: number; linesRemoved: number; merged: boolean; activityDate: string }[];
  insights: string[];
  liveJira: unknown | null;
  method?: string;
}

const BASE = '/api/dashboard';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      msg = body.message || body.error || msg;
    } catch { /* non-JSON body */ }
    throw new Error(msg);
  }
  return res.json();
}

const qs = (params: Record<string, string | undefined>) => {
  const p = Object.entries(params).filter(([, v]) => v) as [string, string][];
  return p.length ? `?${new URLSearchParams(p)}` : '';
};

export const dashboardApi = {
  users: () => request<DashboardUser[]>('/users'),
  overview: (from?: string, to?: string) => request<DashboardOverview>(`/overview${qs({ from, to })}`),
  developers: () => request<DeveloperSummary[]>('/developers'),
  developer: (id: number, opts: { live?: boolean; jiraName?: string; viewerEmail?: string } = {}) =>
    request<DeveloperDetail>(
      `/developers/${id}${qs({
        live: opts.live ? 'true' : undefined,
        jiraName: opts.jiraName,
        viewerEmail: opts.viewerEmail,
      })}`,
    ),
  me: (email: string) => request<DashboardOverview | DeveloperDetail>(`/me${qs({ email })}`),
  syncJira: (projectKey = 'SCRUM') =>
    request<unknown>(`/jira/sync${qs({ projectKey })}`, { method: 'POST' }),
};
