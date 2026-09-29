import { JiraUserSummary } from '../types/jira';

const BASE = '/api/jira';

export async function fetchJiraUserSummary(
  name: string,
  options?: { from?: string; to?: string; projectKey?: string }
): Promise<JiraUserSummary> {
  const params = new URLSearchParams();
  if (options?.from)        params.set('from', options.from);
  if (options?.to)          params.set('to', options.to);
  if (options?.projectKey)  params.set('project', options.projectKey);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}/users/${encodeURIComponent(name)}/summary${qs}`);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Jira API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<JiraUserSummary>;
}
