import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp, Info, Layers, User as UserIcon, ArrowRight,
  GitMerge, Tag, CheckCircle2, FileText, Sparkles, ArrowUpRight,
} from 'lucide-react';

/* ── Simple SVG line/area chart ── */
const ScoreTrendChart: React.FC<{ data: { label: string; value: number }[]; color?: string }> = ({
  data,
  color = '#2DC4C2',
}) => {
  const W = 540, H = 200, PL = 38, PR = 16, PT = 16, PB = 32;
  const cw = W - PL - PR, ch = H - PT - PB;
  const getX = (i: number) => PL + (i / (data.length - 1)) * cw;
  const getY = (v: number) => PT + ch - (v / 100) * ch;
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
  const area = `${line} L ${getX(data.length - 1)} ${PT + ch} L ${getX(0)} ${PT + ch} Z`;
  const gid = `hg${color.replace('#', '')}`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', minWidth: 320 }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 20, 40, 60, 80, 100].map(v => (
          <g key={v}>
            <line x1={PL} y1={getY(v)} x2={W - PR} y2={getY(v)} stroke="#e8edf2" strokeDasharray="3,4" />
            <text x={PL - 5} y={getY(v)} textAnchor="end" dominantBaseline="central"
              fill="#c0c8d4" fontSize="10" fontFamily="Inter">{v}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.value)} r="5" fill="white" stroke={color} strokeWidth="2.5" />
            <text x={getX(i)} y={H - 6} textAnchor="middle" fill="#b0bac8" fontSize="10.5" fontFamily="Inter">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ── Horizontal score bar row ── */
const ScoreBar: React.FC<{ label: string; icon: React.ReactNode; value: number; color: string }> = ({
  label, icon, value, color,
}) => (
  <div className="score-bar-row" style={{ borderBottom: '1px solid #f3f5f8', paddingBottom: 10, marginBottom: 4 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 130 }}>
      {icon}
      <span className="score-bar-label" style={{ width: 'auto' }}>{label}</span>
    </div>
    <div className="score-bar-track">
      <div className="score-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="score-bar-num">{value}</span>
  </div>
);

/* ── Recent activity icon map ── */
const activityIcons: Record<string, React.ReactNode> = {
  pr:   <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(45,196,194,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GitMerge size={16} color="#2DC4C2" /></div>,
  jira: <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(75,158,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tag size={16} color="#4B9EF8" /></div>,
  test: <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={16} color="#10b981" /></div>,
  doc:  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color="#8b5cf6" /></div>,
};

export const HomeView: React.FC = () => {
  const { activeAssociate, selectedAssociateReport, allReports, associates, setActiveTab } = useApp();

  const firstName = activeAssociate?.name?.split(' ')[0] ?? 'there';
  const report = selectedAssociateReport;
  const score = report?.overallScore ?? 82;

  const trendData = [
    { label: 'Jul 2026', value: 48 },
    { label: 'Aug 2026', value: 60 },
    { label: 'Sep 2026', value: 65 },
    { label: 'Oct 2026', value: 68 },
    { label: 'Nov 2026', value: 76 },
    { label: 'Dec 2026', value: score },
  ];

  const dims = report?.dimensions;

  const recentActivity = [
    { type: 'pr',   title: 'Merged PR #4821',       sub: 'feat: add analytics dashboard',    time: '2 hours ago' },
    { type: 'jira', title: 'Closed JIRA-1293',       sub: 'Fix: dashboard filters issue',     time: '5 hours ago' },
    { type: 'test', title: 'Test run completed',     sub: 'Regression Suite – Build #1264',   time: '1 day ago' },
    { type: 'doc',  title: 'Updated documentation', sub: 'API integration guide',             time: '2 days ago' },
  ];

  const strengths = [
    'Consistent on-time delivery',
    'High code review quality',
    'Strong test coverage contributions',
    'Active participation in team discussions',
  ];

  const improvements = [
    'Increase documentation contributions',
    'Take on more complex tasks',
    'Expand cross-project collaboration',
  ];

  return (
    <div className="content-view">
      {/* Welcome header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.75rem', fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 4 }}>
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Here's your performance overview for {/* period */}Oct – Dec 2026.
        </p>
      </div>

      {/* Top metric cards */}
      <div className="metric-cards-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {/* Overall Score */}
        <div className="metric-card">
          <div className="metric-card-label">
            Overall Score <Info size={13} color="var(--text-dim)" />
          </div>
          <div className="metric-card-value">{score}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="metric-card-badge">Good</span>
            <span className="metric-card-trend">
              <ArrowUpRight size={12} /> 8%
            </span>
          </div>
          <div className="metric-card-sub" style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>vs previous period</div>
        </div>

        {/* Evidence Coverage */}
        <div className="metric-card">
          <div className="metric-card-label">
            Evidence Coverage <Info size={13} color="var(--text-dim)" />
          </div>
          <div className="metric-card-value">91%</div>
          <div className="metric-card-bar">
            <div className="metric-card-bar-fill" style={{ width: '91%' }} />
          </div>
        </div>

        {/* Active Projects */}
        <div className="metric-card">
          <div className="metric-card-label">Active Projects</div>
          <div className="metric-card-value" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span>2</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(45,196,194,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} color="#2DC4C2" />
            </div>
          </div>
          <div className="metric-card-sub">1 Primary &nbsp;•&nbsp; 1 Secondary</div>
        </div>

        {/* Role */}
        <div className="metric-card">
          <div className="metric-card-label">Role</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>
            {activeAssociate?.title ?? 'Software Engineer'}
          </div>
          <div className="metric-card-sub">Since Jul 2026</div>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(155,135,245,0.1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
            <UserIcon size={16} color="#9b87f5" />
          </div>
        </div>
      </div>

      {/* Middle row: chart + score breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Performance Trend */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Performance Trend</span>
              <Info size={14} color="var(--text-dim)" />
            </div>
            <select style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)',
              borderRadius: 8, padding: '5px 10px', fontSize: '0.82rem', color: 'var(--text-primary)',
              cursor: 'pointer', outline: 'none' }}>
              <option>Overall Score</option>
            </select>
          </div>
          <ScoreTrendChart data={trendData} />
        </div>

        {/* Score Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Score Breakdown</span>
              <Info size={14} color="var(--text-dim)" />
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('associate')}
              style={{ fontSize: '0.78rem', gap: 4, color: '#2DC4C2', borderColor: 'rgba(45,196,194,0.3)' }}
            >
              View Details <ArrowRight size={12} />
            </button>
          </div>
          <ScoreBar label="Delivery"      icon={<TrendingUp size={14} color="#2DC4C2" />}   value={dims?.delivery?.score ?? 85}     color="#2DC4C2" />
          <ScoreBar label="Quality"       icon={<CheckCircle2 size={14} color="#4B9EF8" />} value={dims?.quality?.score ?? 78}      color="#4B9EF8" />
          <ScoreBar label="Collaboration" icon={<Layers size={14} color="#9b87f5" />}       value={dims?.review?.score ?? 80}       color="#9b87f5" />
          <ScoreBar label="Consistency"   icon={<TrendingUp size={14} color="#C5D000" />}   value={dims?.reliability?.score ?? 86}  color="#C5D000" />
        </div>
      </div>

      {/* Bottom row: projects + recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Current Projects */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Current Projects</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('project')}
              style={{ fontSize: '0.78rem', gap: 4 }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Role</th>
                <th>Allocation</th>
                <th>Period</th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1e3a5f',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>V</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Velocidy</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>B2B SaaS Platform</div>
                    </div>
                  </div>
                </td>
                <td>Software Engineer</td>
                <td>
                  <span className="pill-badge teal" style={{ fontWeight: 700 }}>70%</span>
                </td>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Jul 2026 – Present</td>
                <td>
                  <span className="score-badge good" style={{ fontSize: '0.82rem', fontWeight: 700 }}>84</span>
                </td>
                <td><ArrowRight size={15} color="var(--text-dim)" /></td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a4a3a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>S</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Simplicity</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Legacy Platform</div>
                    </div>
                  </div>
                </td>
                <td>Software Engineer</td>
                <td>
                  <span className="pill-badge purple" style={{ fontWeight: 700 }}>30%</span>
                </td>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Jul 2026 – Present</td>
                <td>
                  <span className="score-badge average" style={{ fontSize: '0.82rem', fontWeight: 700 }}>78</span>
                </td>
                <td><ArrowRight size={15} color="var(--text-dim)" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Recent Activity</span>
            <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem', gap: 4 }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {activityIcons[a.type]}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>{a.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: AI summary + strengths + improvements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
        {/* AI Summary */}
        <div className="glass-card ai-insight-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="#2DC4C2" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>AI Summary</span>
            <span className="pill-badge teal" style={{ fontSize: '0.68rem', padding: '1px 8px' }}>Beta</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
            You've shown consistent improvement this period, with strong delivery and quality contributions on Velocidy.
            Your PR cycle time has decreased by 28% and you've maintained a high test pass rate.
            Focus area: increase documentation contributions and cross-project collaboration.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('ai-insights')}
            style={{ fontSize: '0.8rem', gap: 4 }}>
            View Full Insights <ArrowRight size={12} />
          </button>
        </div>

        {/* Key Strengths */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <TrendingUp size={18} color="#2DC4C2" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Key Strengths</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {strengths.map((s, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Focus */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#f59e0b' }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Areas to Focus</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {improvements.map((s, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid #f59e0b', flexShrink: 0 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
