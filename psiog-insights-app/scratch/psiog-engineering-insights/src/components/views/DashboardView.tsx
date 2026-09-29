import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutDashboard, RefreshCw, Sparkles, CheckCircle2, GitMerge, Users, Target, X, ExternalLink,
} from 'lucide-react';
import {
  dashboardApi, DashboardOverview, DeveloperDetail, DeveloperSummary,
} from '../../services/dashboardApi';

const BAND_COLOR: Record<string, string> = {
  STRONG: '#10b981', ON_TRACK: '#4B9EF8', NEEDS_ATTENTION: '#f59e0b', AT_RISK: '#f43f5e',
};
const bandColor = (b: string) => BAND_COLOR[b] ?? '#94a3b8';
const bandLabel = (b: string) => b.replace(/_/g, ' ');

const Bar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => (
  <div className="score-bar-track" style={{ flex: 1 }}>
    <div className="score-bar-fill" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: color }} />
  </div>
);

export const DashboardView: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [detail, setDetail] = useState<DeveloperDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await dashboardApi.overview(from || undefined, to || undefined));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  const sync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      await dashboardApi.syncJira('SCRUM');
      setSyncMsg('Jira sync complete.');
      await load();
    } catch (e) {
      setSyncMsg(`Jira sync failed: ${e instanceof Error ? e.message : 'unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const openDeveloper = async (d: DeveloperSummary) => {
    setDetail(null);
    setDetailError(null);
    try {
      setDetail(await dashboardApi.developer(d.userId));
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Failed to load developer');
    }
  };

  const kpi = data?.kpis ?? {};
  const kpiCards = [
    { label: 'Developers', value: kpi.developers, icon: Users, color: 'indigo' },
    { label: 'Completion Rate', value: kpi.completionRatePct != null ? `${kpi.completionRatePct}%` : '–', icon: CheckCircle2, color: 'emerald',
      meta: `${kpi.completedStories}/${kpi.totalStories} stories` },
    { label: 'Story Points Done', value: kpi.completedStoryPoints, icon: Target, color: 'cyan', meta: `of ${kpi.totalStoryPoints}` },
    { label: 'PRs Merged', value: kpi.mergedPullRequests, icon: GitMerge, color: 'amber', meta: `of ${kpi.pullRequests} · ${kpi.commits} commits` },
    { label: 'Avg Team Score', value: kpi.averageTeamScore, icon: LayoutDashboard, color: 'rose' },
  ];

  const maxPoints = Math.max(1, ...(data?.storyPointsByDeveloper ?? []).map(d => d.completedPoints + d.openPoints));
  const maxWeekly = Math.max(1, ...(data?.weeklyTrend ?? []).map(w => Math.max(w.commits, w.pointsCompleted)));
  const statusTotal = Object.values(data?.statusDistribution ?? {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <LayoutDashboard size={24} color="var(--accent-primary-light)" />
            Team Dashboard
          </h1>
          <p className="section-desc">Live delivery metrics from Jira and GitHub, scored per developer</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="btn btn-secondary btn-sm" />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="btn btn-secondary btn-sm" />
          {(from || to) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>
          )}
          <button className="btn btn-primary btn-sm" onClick={sync} disabled={syncing}>
            <RefreshCw size={14} className={syncing ? 'spin' : ''} /> Sync Jira
          </button>
        </div>
      </div>

      {syncMsg && <div className="glass-card" style={{ marginBottom: 16, padding: '10px 16px' }}>{syncMsg}</div>}
      {error && (
        <div className="glass-card" style={{ marginBottom: 16, borderLeft: '4px solid var(--accent-rose)' }}>
          {error} — is the backend running on localhost:8080?{' '}
          <button className="btn btn-secondary btn-sm" onClick={load}>Retry</button>
        </div>
      )}
      {loading && !data && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}

      {data && (
        <>
          <div className="stats-grid">
            {kpiCards.map(c => (
              <div className="stat-widget" key={c.label}>
                <div className={`stat-icon ${c.color}`}><c.icon size={24} /></div>
                <div>
                  <div className="stat-value">{c.value ?? '–'}</div>
                  <div className="stat-label">{c.label}</div>
                  {c.meta && <div className="stat-meta" style={{ color: 'var(--text-muted)' }}>{c.meta}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          {data.insights.length > 0 && (
            <div className="glass-card" style={{ marginBottom: 24 }}>
              <h3 style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <Sparkles size={18} color="var(--accent-primary-light)" /> Insights
              </h3>
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.88rem' }}>
                {data.insights.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          )}

          {/* Leaderboard */}
          <div className="glass-card" style={{ marginBottom: 24, overflowX: 'auto' }}>
            <h3 style={{ marginBottom: 12 }}>Leaderboard</h3>
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>#</th><th>Developer</th><th>Score</th><th>Stories</th>
                  <th>Points</th><th>PRs merged</th><th>Commits</th><th>Cycle (d)</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map(d => (
                  <tr key={d.userId} style={{ cursor: 'pointer' }} onClick={() => openDeveloper(d)}>
                    <td>{d.rank}</td>
                    <td>{d.name}</td>
                    <td>
                      <strong>{d.score}</strong>{' '}
                      <span className="pill-badge" style={{ color: bandColor(d.band), fontSize: '0.7rem' }}>{bandLabel(d.band)}</span>
                    </td>
                    <td>{d.completedStories}/{d.totalStories}</td>
                    <td>{d.completedStoryPoints}/{d.totalStoryPoints}</td>
                    <td>{d.mergedPullRequests}/{d.pullRequests}</td>
                    <td>{d.commits}</td>
                    <td>{d.avgCycleTimeDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 24 }}>
            {/* Points by developer */}
            <div className="glass-card">
              <h3 style={{ marginBottom: 12 }}>Story Points by Developer</h3>
              {data.storyPointsByDeveloper.map(d => (
                <div key={d.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                    <span>{d.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{d.completedPoints} done · {d.openPoints} open</span>
                  </div>
                  <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: '#eef1f5' }}>
                    <div style={{ width: `${(d.completedPoints / maxPoints) * 100}%`, background: '#10b981' }} />
                    <div style={{ width: `${(d.openPoints / maxPoints) * 100}%`, background: '#cbd5e1' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Status distribution */}
            <div className="glass-card">
              <h3 style={{ marginBottom: 12 }}>Story Status</h3>
              {Object.entries(data.statusDistribution).map(([status, n]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: '0.84rem' }}>
                  <span style={{ width: 90 }}>{status.replace(/_/g, ' ')}</span>
                  <Bar value={n} max={statusTotal} color={status === 'DONE' ? '#10b981' : status === 'IN_PROGRESS' ? '#4B9EF8' : '#cbd5e1'} />
                  <span style={{ width: 24, textAlign: 'right' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly trend */}
          <div className="glass-card" style={{ marginBottom: 24, overflowX: 'auto' }}>
            <h3 style={{ marginBottom: 12 }}>Weekly Trend</h3>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', minHeight: 170, minWidth: 320 }}>
              {data.weeklyTrend.map(w => (
                <div key={w.weekStart} style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', justifyContent: 'center', height: 130 }}>
                    <div title={`${w.commits} commits`} style={{ width: 16, height: `${(w.commits / maxWeekly) * 100}%`, background: '#2DC4C2', borderRadius: 3 }} />
                    <div title={`${w.pointsCompleted} points completed`} style={{ width: 16, height: `${(w.pointsCompleted / maxWeekly) * 100}%`, background: '#10b981', borderRadius: 3 }} />
                  </div>
                  <div style={{ marginTop: 6 }}>{w.weekStart.slice(5)}</div>
                  <div>{w.prsMerged} PR</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', marginTop: 8 }}>
              <span><span style={{ color: '#2DC4C2' }}>■</span> Commits</span>
              <span><span style={{ color: '#10b981' }}>■</span> Points completed</span>
            </div>
          </div>
        </>
      )}

      {/* Developer drill-down */}
      {(detail || detailError) && (
        <div
          onClick={() => { setDetail(null); setDetailError(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}
        >
          <div className="glass-card" onClick={e => e.stopPropagation()} style={{ width: 'min(760px, 100%)', maxHeight: '88vh', overflowY: 'auto', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3>{detail ? `${detail.metrics.name} — score ${detail.metrics.score} (rank ${detail.metrics.rank}/${detail.teamSize})` : 'Error'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => { setDetail(null); setDetailError(null); }}><X size={14} /></button>
            </div>
            {detailError && <p>{detailError}</p>}
            {detail && (
              <>
                <h4 style={{ margin: '8px 0' }}>How the score was built</h4>
                {detail.metrics.scoreBreakdown.map(c => (
                  <div key={c.metric} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', padding: '4px 0', borderBottom: '1px solid #f3f5f8', color: c.included ? undefined : 'var(--text-muted)' }}>
                    <span>{c.metric}: {c.value}</span>
                    <span>{c.included ? `${c.contribution} pts (${Math.round((c.effectiveWeight ?? 0) * 100)}%)` : c.note ?? 'not scored'}</span>
                  </div>
                ))}
                <h4 style={{ margin: '16px 0 8px' }}>Stories</h4>
                <table className="psiog-table">
                  <thead><tr><th>Key</th><th>Title</th><th>Pts</th><th>Status</th></tr></thead>
                  <tbody>
                    {detail.stories.map(s => (
                      <tr key={s.storyId}>
                        <td><a href={s.jiraUrl} target="_blank" rel="noreferrer">{s.storyId} <ExternalLink size={11} /></a></td>
                        <td>{s.title}</td><td>{s.storyPoints}</td><td>{s.status.replace(/_/g, ' ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h4 style={{ margin: '16px 0 8px' }}>Pull Requests</h4>
                <table className="psiog-table">
                  <thead><tr><th>PR</th><th>Repo</th><th>Commits</th><th>+/−</th><th>Merged</th></tr></thead>
                  <tbody>
                    {detail.pullRequests.map(p => (
                      <tr key={p.pullRequestId}>
                        <td>{p.pullRequestId}</td><td>{p.repository}</td><td>{p.commits}</td>
                        <td>+{p.linesAdded} / −{p.linesRemoved}</td><td>{p.merged ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {detail.insights.length > 0 && (
                  <>
                    <h4 style={{ margin: '16px 0 8px' }}>Insights</h4>
                    <ul style={{ paddingLeft: 18, fontSize: '0.86rem' }}>
                      {detail.insights.map((i, idx) => <li key={idx}>{i}</li>)}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
