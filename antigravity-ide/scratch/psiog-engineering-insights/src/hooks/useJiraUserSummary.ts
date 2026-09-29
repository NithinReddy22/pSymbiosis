import { useState, useCallback } from 'react';
import { JiraUserSummary } from '../types/jira';
import { fetchJiraUserSummary } from '../services/jiraApiService';

interface UseJiraUserSummaryResult {
  data: JiraUserSummary | null;
  loading: boolean;
  error: string | null;
  fetch: (name: string, opts?: { from?: string; to?: string; projectKey?: string }) => Promise<void>;
  reset: () => void;
}

export function useJiraUserSummary(): UseJiraUserSummaryResult {
  const [data, setData]       = useState<JiraUserSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async (
    name: string,
    opts?: { from?: string; to?: string; projectKey?: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchJiraUserSummary(name, opts);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetch, reset };
}
