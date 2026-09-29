import React, { useState, FormEvent } from 'react';
import { useJiraUserSummary } from '../../hooks/useJiraUserSummary';
import { JiraIssue } from '../../types/jira';
import {
  Search, RefreshCw, ExternalLink, CheckCircle2, Clock, AlertCircle,
  GitCommit, GitMerge, GitPullRequest, Tag, BookOpen, User, FolderKanban,
  BarChart2, ChevronRight, Info,
} from 'lucide-react';

/* ── Mini radial arc for a percentage ── */
const Arc: React.FC<{ pct: number; color: string; size?: number; strokeWidth?: number }> = ({
  pct, color, size = 56, strokeWidth = 6,
}) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8edf2" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
};

/* ── Status pill ── */
const StatusPill: React.FC<{ category: string; label: string }> = ({ category, label }) => {
  const map: Record<string, string> = {
    done: 'green', indeterminate: 'blue', new: 'amber',
  };
  return <span className={`pill-badge ${map[category] ?? 'amber'}`}>{label}</span>;
};

/* ── Priority dot ── */
const PriorityDot: React.FC<{ priority: string | null }> = ({ priority }) => {
  const colors: Record<string, string> = {
    Highest: '#f43f5e', High: '#fb923c', Medium: '#f59e0b',
    Low: '#34d399', Lowest: '#94a3b8',
  };
  const c = colors[priority ?? ''] ?? '#c8d0da';
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: c, marginRight: 6 }} />;
};

/* ── Stat card ── */
const StatCard: React.FC<{
  label: string; value: string | number; icon: React.ReactNode;
  sub?: string; color?: string;
}> = ({ label, value, icon, sub, color = '#2DC4C2' }) => (
  <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="metric-card-label" style={{ marginBottom: 0 }}>{label}</span>
      <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: `${color}18` }}>
        {icon}
      </div>
    </div>
    <div className="metric-card-value" style={{ fontSize: '1.8rem' }}>{value}</div>
    {sub && <div className="metric-card-sub" style={{ fontSize: '0.74rem' }}>{sub}</div>}
  </div>
);

export const JiraSummaryView: React.FC = () => {
  const { data, loading, error, fetch: fetchSummary, reset } = useJiraUserSummary();
  const [nameInput, setNameInput]     = useState('');
  const [fromInput, setFromInput]     = useState('');
  const [toInput, setToInput]         = useState('');
  const [projectKey, setProjectKey]   = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    fetchSummary(nameInput.trim(), {
      from: fromInput || undefined,
      to: toInput || undefined,
      projectKey: projectKey || undefined,
    });
  };

  const ticketCompletionPct = data
    ? Math.round((data.tickets.completed / Math.max(1, data.tickets.total)) * 100)
    : 0;
  const spCompletionPct = data
    ? Math.round((data.storyPoints.completed / Math.max(1, data.storyPoints.total)) * 100)
    : 0;

  return (
    <div className="content-view">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Tag size={22} color="#2DC4C2" /> Jira User Summary
          </h1>
          <p className="section-desc">Pull live ticket, story-point, and development data from Jira for any team member.</p>
        </div>
      </div>

      {/* Search form */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px auto', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <label className="form-label">Team member name</label>
              <div className="header-search" style={{ borderRadius: 10, maxWidth: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                <Search size={14} color="var(--text-dim)" />
                <input
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.875rem',
                    color: 'var(--text-primary)', width: '100%' }}
                  placeholder="e.g. Nithish"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="form-label">From date</label>
              <input type="date" className="form-control" value={fromInput} onChange={e => setFromInput(e.target.value)} />
            </div>
            <div>
              <label className="form-label">To date</label>
              <input type="date" className="form-control" value={toInput} onChange={e => setToInput(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Project key</label>
              <input type="text" className="form-control" placeholder="e.g. SCRUM" value={projectKey}
                onChange={e => setProjectKey(e.target.value.toUpperCase())} />
            </div>
            <div style={{ display: 'flex', gap: 8, paddingBottom: 0 }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                {loading
                  ? <><RefreshCw size={14} className="spin-animation" /> Loading…</>
                  : <><Search size={14} /> Fetch</>
                }
              </button>
              {data && (
                <button type="button" className="btn btn-secondary" onClick={reset} title="Clear">✕</button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 20,
          display: 'flex', gap: 12, alignItems: 'center', color: '#f43f5e', fontSize: '0.875rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          {/* User + Project identity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20, marginBottom: 24 }}>
            {/* User card */}
            <div className="glass-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12,
                background: 'linear-gradient(135deg, #2DC4C2, #C5D000)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '1.25rem', flexShrink: 0 }}>
                {data.user.displayName.slice(0, 1).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                  {data.user.displayName}
                </div>
                {data.user.email && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>{data.user.email}</div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="pill-badge green">Active</span>
                  <span className="pill-badge teal" style={{ fontSize: '0.7rem' }}>
                    Match {Math.round(data.user.matchScore * 100)}%
                  </span>
                  <span className="pill-badge blue">{data.user.accountType}</span>
                </div>
              </div>
              <User size={20} color="var(--text-dim)" />
            </div>

            {/* Project card */}
            <div className="glass-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12,
                background: 'rgba(75,158,248,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FolderKanban size={24} color="#4B9EF8" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                  {data.project.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Key: <strong>{data.project.key}</strong> &nbsp;·&nbsp; ID: {data.project.id}
                </div>
                <span className={`pill-badge ${data.project.userIsAssignable ? 'green' : 'amber'}`}>
                  {data.project.userIsAssignable ? 'Assignable' : 'Not assignable'}
                </span>
              </div>
            </div>
          </div>

          {/* Stat row — tickets & story points with radial arcs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
            {/* Ticket completion arc */}
            <div className="metric-card" style={{ gridColumn: 'span 2', display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Arc pct={ticketCompletionPct} color="#2DC4C2" size={72} strokeWidth={7} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ticketCompletionPct}%</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="metric-card-label" style={{ marginBottom: 6 }}>Ticket completion</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'Done',        value: data.tickets.completed,  color: '#10b981' },
                    { label: 'In Progress', value: data.tickets.inProgress, color: '#4B9EF8' },
                    { label: 'To Do',       value: data.tickets.toDo,       color: '#f59e0b' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                      {r.label} <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--text-primary)' }}>{r.value}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 2 }}>
                    Total: {data.tickets.total}
                  </div>
                </div>
              </div>
            </div>

            {/* Story points arc */}
            <div className="metric-card" style={{ gridColumn: 'span 2', display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Arc pct={spCompletionPct} color="#C5D000" size={72} strokeWidth={7} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{data.storyPoints.completed}</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>/{data.storyPoints.total}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="metric-card-label" style={{ marginBottom: 6 }}>Story points</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'Completed',   value: data.storyPoints.completed,  color: '#10b981' },
                    { label: 'In Progress', value: data.storyPoints.inProgress, color: '#4B9EF8' },
                    { label: 'To Do',       value: data.storyPoints.toDo,       color: '#f59e0b' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                      {r.label} <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--text-primary)' }}>{r.value} pts</span>
                    </div>
                  ))}
                  {data.storyPoints.ticketsWithoutEstimate > 0 && (
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>
                      {data.storyPoints.ticketsWithoutEstimate} ticket(s) unestimated
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time logged */}
            <StatCard
              label="Time logged"
              value={data.timeLogged.hours > 0 ? `${data.timeLogged.hours}h` : '0h'}
              sub={`${data.timeLogged.worklogCount} work log${data.timeLogged.worklogCount !== 1 ? 's' : ''}`}
              icon={<Clock size={16} color="#9b87f5" />}
              color="#9b87f5"
            />
          </div>

          {/* Development activity */}
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <GitCommit size={18} color="#2DC4C2" />
              <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Development Activity</span>
              {!data.development.available && (
                <span className="pill-badge amber" style={{ fontSize: '0.7rem' }}>Not connected</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: data.development.note ? 14 : 0 }}>
              {[
                { label: 'Commits authored', value: data.development.commitsAuthoredByHim, icon: <GitCommit size={16} color="#2DC4C2" />, color: '#2DC4C2' },
                { label: 'PRs authored',      value: data.development.pullRequestsAuthoredByHim, icon: <GitPullRequest size={16} color="#4B9EF8" />, color: '#4B9EF8' },
                { label: 'PRs merged',        value: data.development.pullRequestsMerged,         icon: <GitMerge size={16} color="#10b981" />,       color: '#10b981' },
                { label: 'PRs open',          value: data.development.pullRequestsOpen,            icon: <GitPullRequest size={16} color="#f59e0b" />, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '14px 12px',
                  background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Outfit',sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {data.development.note && (
              <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderRadius: 8,
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
                fontSize: '0.8rem', color: '#92400e' }}>
                <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {data.development.note}
              </div>
            )}
          </div>

          {/* Issues table */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} color="#2DC4C2" />
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Issues ({data.issues.length})
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(data.tickets.byType).map(([type, count]) => (
                  <span key={type} className="pill-badge blue" style={{ fontSize: '0.72rem' }}>{type}: {count}</span>
                ))}
              </div>
            </div>

            {data.issues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                No issues found for this query.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Summary</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th style={{ textAlign: 'right' }}>Points</th>
                      <th style={{ textAlign: 'right' }}>Commits</th>
                      <th style={{ textAlign: 'right' }}>PRs</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.issues.map((issue: JiraIssue) => (
                      <tr key={issue.key}>
                        <td>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
                            color: '#2DC4C2', fontWeight: 600 }}>{issue.key}</span>
                        </td>
                        <td style={{ maxWidth: 260 }}>
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {issue.summary}
                          </span>
                        </td>
                        <td>
                          <span className="pill-badge teal" style={{ fontSize: '0.7rem' }}>{issue.type}</span>
                        </td>
                        <td>
                          <StatusPill category={issue.statusCategory} label={issue.status} />
                        </td>
                        <td>
                          <PriorityDot priority={issue.priority} />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{issue.priority ?? '—'}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{issue.storyPoints ?? '—'}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.84rem', color: issue.commits > 0 ? '#2DC4C2' : 'var(--text-dim)' }}>
                            {issue.commits}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.84rem', color: issue.pullRequests > 0 ? '#4B9EF8' : 'var(--text-dim)' }}>
                            {issue.pullRequests}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                          {new Date(issue.created).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {issue.resolved && (
                            <div style={{ color: '#10b981', fontSize: '0.72rem' }}>
                              ✓ {new Date(issue.resolved).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </div>
                          )}
                        </td>
                        <td>
                          <a href={issue.url} target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--text-dim)', display: 'flex' }}>
                            <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* JQL used */}
            <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: "'JetBrains Mono', monospace" }}>
                JQL: {data.jql}
              </span>
            </div>
          </div>

          {/* Warnings */}
          {data.warnings.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.warnings.map((w, i) => (
                <div key={i} style={{ padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  fontSize: '0.82rem', color: '#92400e', display: 'flex', gap: 8 }}>
                  <AlertCircle size={15} /> {w}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-dim)' }}>
          <Tag size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.35 }} />
          <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
            Search for a team member to view their Jira performance summary.
          </p>
          <p style={{ fontSize: '0.84rem' }}>
            Enter a display name above — the API will fuzzy-match the Jira user.
          </p>
        </div>
      )}
    </div>
  );
};
