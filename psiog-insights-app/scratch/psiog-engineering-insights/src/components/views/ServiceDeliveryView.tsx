import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Info, ChevronDown, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */
function rqiStyle(v: number | null): React.CSSProperties {
  if (v === null) return {};
  if (v >= 95)  return { background: '#d1fae5', color: '#065f46' };
  if (v >= 80)  return { background: '#dcfce7', color: '#166534' };
  if (v >= 60)  return { background: '#fef9c3', color: '#854d0e' };
  return          { background: '#fee2e2', color: '#991b1b' };
}

const fmtPct  = (v: number)  => `${v.toFixed(1)}%`;
const fmtNum  = (v: number)  => v.toFixed(2);
const C_COMPLEX = '#93c5fd';
const C_MEDIUM  = '#1d4ed8';
const C_SIMPLE  = '#f97316';
const complexColor: Record<string, string> = {
  Complex: C_COMPLEX, Medium: C_MEDIUM, Simple: C_SIMPLE,
};

/* ─────────────────────────────────────────────────────────────
   Derived types
   ───────────────────────────────────────────────────────────── */
interface ProjectMetrics {
  id: string;
  code: string;
  name: string;
  offering: string;
  healthScore: number;
  releases: number;       // merged PRs
  builds: number;         // total PRs
  reworkPct: number;      // avg rework bounces / ticket (%)
  defLeakPct: number;     // bug tickets / all tickets (%)
  avgCycleDays: number;   // avg cycleTimeHours / 24
  rqi: number;            // 0.3·delivery + 0.4·quality + 0.3·reliability
  gm: number;             // storyPoints / mergedPRs
  utilPct: number;        // avg allocation %
  memberCount: number;
  complexity: 'Complex' | 'Medium' | 'Simple';
  // persona distribution (% of headcount)
  complexPct: number;
  mediumPct: number;
  simplePct: number;
}

/* ─────────────────────────────────────────────────────────────
   Stacked Bar Chart
   ───────────────────────────────────────────────────────────── */
const StackedBarChart: React.FC<{ rows: ProjectMetrics[] }> = ({ rows }) => {
  const W = 560, H = 280, PL = 50, PR = 16, PT = 20, PB = 48;
  const cw = W - PL - PR, ch = H - PT - PB;
  const barW  = Math.max(30, Math.floor(cw / rows.length) - 14);
  const barGap = Math.floor(cw / rows.length);
  const yTicks = [0, 25, 50, 75, 100];
  const getY = (pct: number) => PT + ch - (pct / 100) * ch;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', minWidth: 360 }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PL} y1={getY(v)} x2={W - PR} y2={getY(v)} stroke="#e8edf2" strokeDasharray="3,4" />
            <text x={PL - 6} y={getY(v)} textAnchor="end" dominantBaseline="central" fontSize="10" fill="#9ca3af">{v}%</text>
          </g>
        ))}
        {rows.map((d, i) => {
          const x = PL + i * barGap + 4;
          const segs = [
            { pct: d.complexPct, color: C_COMPLEX, label: fmtPct(d.complexPct) },
            { pct: d.mediumPct,  color: C_MEDIUM,  label: fmtPct(d.mediumPct)  },
            { pct: d.simplePct,  color: C_SIMPLE,  label: fmtPct(d.simplePct)  },
          ];
          let bottom = 0;
          const els: React.ReactNode[] = [];
          segs.forEach((s, si) => {
            if (s.pct <= 0) return;
            const yTop = getY(bottom + s.pct);
            const yBot = getY(bottom);
            const bh   = yBot - yTop;
            const isTop = si === segs.filter(x => x.pct > 0).length - 1;
            els.push(
              <rect key={si} x={x} y={yTop} width={barW} height={bh}
                fill={s.color} rx={isTop ? 3 : 0} />,
            );
            if (bh >= 16) {
              els.push(
                <text key={`t${si}`} x={x + barW / 2} y={yTop + bh / 2}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="9" fill="white" fontWeight="700">{s.label}</text>,
              );
            }
            bottom += s.pct;
          });
          return (
            <g key={d.id}>
              {els}
              <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="10" fill="#6b7280">{d.code}</text>
            </g>
          );
        })}
        <text x={14} y={H / 2} textAnchor="middle" fontSize="10" fill="#6b7280"
          transform={`rotate(-90,14,${H / 2})`}>Releases %</text>
        <text x={W / 2} y={H - 1} textAnchor="middle" fontSize="10.5" fill="#6b7280">Project</text>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Scatter Plot
   ───────────────────────────────────────────────────────────── */
const ScatterPlot: React.FC<{ rows: ProjectMetrics[] }> = ({ rows }) => {
  const W = 480, H = 280, PL = 52, PR = 24, PT = 20, PB = 48;
  const cw = W - PL - PR, ch = H - PT - PB;

  const gms  = rows.map(r => r.gm);
  const rqis = rows.map(r => r.rqi);
  const gmMin  = Math.max(0, Math.floor(Math.min(...gms)  - 1));
  const gmMax  = Math.ceil(Math.max(...gms) + 1);
  const rqiMin = Math.max(0, Math.floor(Math.min(...rqis) - 10));
  const rqiMax = Math.min(100, Math.ceil(Math.max(...rqis) + 5));

  // gm axis: higher gm → LEFT (matches reference)
  const getX = (gm:  number) => PL + ((gmMax - gm) / (gmMax - gmMin)) * cw;
  const getY = (rqi: number) => PT + ((rqiMax - rqi) / (rqiMax - rqiMin)) * ch;

  const xTicks = Array.from({ length: 5 }, (_, i) => +(gmMin + (i / 4) * (gmMax - gmMin)).toFixed(1));
  const yTicks = [rqiMin, rqiMin + (rqiMax - rqiMin) / 3, rqiMin + 2*(rqiMax - rqiMin)/3, rqiMax].map(Math.round);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', minWidth: 340 }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PL} y1={getY(v)} x2={W - PR} y2={getY(v)} stroke="#e8edf2" strokeDasharray="3,4" />
            <text x={PL - 5} y={getY(v)} textAnchor="end" dominantBaseline="central" fontSize="10" fill="#9ca3af">{v}</text>
          </g>
        ))}
        {xTicks.map(v => (
          <g key={v}>
            <line x1={getX(v)} y1={PT} x2={getX(v)} y2={PT + ch} stroke="#e8edf2" strokeDasharray="3,4" />
            <text x={getX(v)} y={PT + ch + 14} textAnchor="middle" fontSize="10" fill="#9ca3af">{v.toFixed(1)}</text>
          </g>
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={PT + ch} stroke="#d1d5db" />
        <line x1={PL} y1={PT + ch} x2={W - PR} y2={PT + ch} stroke="#d1d5db" />
        {rows.map(r => (
          <g key={r.id}>
            <circle cx={getX(r.gm)} cy={getY(r.rqi)} r="8"
              fill={complexColor[r.complexity]} fillOpacity="0.85"
              stroke="white" strokeWidth="1.5" />
            <text x={getX(r.gm)} y={getY(r.rqi) - 13} textAnchor="middle"
              fontSize="8.5" fill="#4b5563" fontWeight="600">{r.code}</text>
          </g>
        ))}
        <text x={14} y={PT + ch / 2} textAnchor="middle" fontSize="10" fill="#6b7280"
          transform={`rotate(-90,14,${PT + ch / 2})`}>RQI Score</text>
        <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="10.5" fill="#6b7280">GM (Story Pts / PR)</text>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Practice Area RQI cross-table
   ───────────────────────────────────────────────────────────── */
const PracticeAreaTable: React.FC<{ rows: ProjectMetrics[] }> = ({ rows }) => {
  const offerings = Array.from(new Set(rows.map(r => r.offering)));

  // For each offering, split by complexity
  const cell = (offering: string, c: 'Complex' | 'Medium' | 'Simple') => {
    const matches = rows.filter(r => r.offering === offering && r.complexity === c);
    if (matches.length === 0) return null;
    const avg = matches.reduce((s, r) => s + r.rqi, 0) / matches.length;
    return +avg.toFixed(2);
  };
  const total = (offering: string) => {
    const matches = rows.filter(r => r.offering === offering);
    if (matches.length === 0) return 0;
    return +(matches.reduce((s, r) => s + r.rqi, 0) / matches.length).toFixed(2);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table" style={{ fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ background: '#f8fafb' }}>
            {['Practice Area / Offering', 'Complex', 'Medium', 'Simple', 'Total'].map((h, hi) => (
              <th key={h} style={{ padding: '8px 12px', fontSize: '0.74rem', fontWeight: 700,
                color: '#374151', textAlign: hi === 0 ? 'left' : 'right',
                borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {offerings.map(off => (
            <tr key={off}>
              <td style={{ padding: '8px 12px', fontWeight: 500, color: 'var(--text-primary)', maxWidth: 180, fontSize: '0.8rem' }}>
                {off}
              </td>
              {(['Complex', 'Medium', 'Simple'] as const).map((c, ci) => {
                const v = cell(off, c);
                return (
                  <td key={ci} style={{ padding: '8px 12px', textAlign: 'right' }}>
                    {v !== null ? (
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                        fontWeight: 600, fontSize: '0.8rem', ...rqiStyle(v) }}>
                        {v.toFixed(2)}
                      </span>
                    ) : <span style={{ color: '#e5e7eb' }}>—</span>}
                  </td>
                );
              })}
              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700,
                color: 'var(--text-primary)', fontSize: '0.84rem' }}>{total(off).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main view
   ───────────────────────────────────────────────────────────── */
export const ServiceDeliveryView: React.FC = () => {
  const {
    projects, associates, roleAssignments, allReports,
    tickets, prs, selectedPeriod,
  } = useApp();

  const [expanded, setExpanded] = useState<string | null>(null);

  /* ── Derive per-project metrics ── */
  const projectRows = useMemo((): ProjectMetrics[] => {
    const pStart = new Date(selectedPeriod.start).getTime();
    const pEnd   = new Date(selectedPeriod.end).getTime();

    return projects.map(proj => {
      /* Members assigned to this project */
      const assignments = roleAssignments.filter(ra => ra.projectId === proj.id);
      const memberIds   = Array.from(new Set(assignments.map(ra => ra.associateId)));
      const memberCount = memberIds.length;

      /* Activity filtered to this project + period */
      const projPRs = prs.filter(pr => {
        const t = new Date(pr.mergedAt || pr.createdAt).getTime();
        return pr.projectId === proj.id && t >= pStart && t <= pEnd;
      });
      const projTickets = tickets.filter(t => {
        const time = new Date(t.resolvedAt).getTime();
        return t.projectId === proj.id && time >= pStart && time <= pEnd;
      });

      const releases     = projPRs.filter(p => p.status === 'Merged').length;
      const builds       = projPRs.length;
      const totalRework  = projTickets.reduce((s, t) => s + t.reworkCount, 0);
      const reworkPct    = projTickets.length > 0 ? (totalRework / projTickets.length) * 100 : 0;
      const bugCount     = projTickets.filter(t => t.type === 'Bug').length;
      const defLeakPct   = projTickets.length > 0 ? (bugCount / projTickets.length) * 100 : 0;
      const totalSP      = projTickets.reduce((s, t) => s + t.storyPoints, 0);
      const avgCycleDays = projTickets.length > 0
        ? projTickets.reduce((s, t) => s + t.cycleTimeHours, 0) / projTickets.length / 24
        : 1;
      const gm = releases > 0 ? +(totalSP / releases).toFixed(2) : 0;

      /* Average allocation */
      const utilPct = assignments.length > 0
        ? assignments.reduce((s, a) => s + a.allocationPercentage, 0) / assignments.length
        : 0;

      /* RQI from computed reports */
      const memberReports = memberIds.map(id => allReports.find(r => r.associateId === id)).filter(Boolean) as typeof allReports;
      let rqi = 50;
      if (memberReports.length > 0) {
        const avgDel = memberReports.reduce((s, r) => s + r.dimensions.delivery.score, 0) / memberReports.length;
        const avgQua = memberReports.reduce((s, r) => s + r.dimensions.quality.score, 0) / memberReports.length;
        const avgRel = memberReports.reduce((s, r) => s + r.dimensions.reliability.score, 0) / memberReports.length;
        rqi = +(0.3 * avgDel + 0.4 * avgQua + 0.3 * avgRel).toFixed(2);
      }

      /* Persona distribution for stacked bar */
      const leadCount   = assignments.filter(a => a.role === 'Lead').length;
      const seniorCount = assignments.filter(a => a.role === 'Senior Engineer').length;
      const engCount    = assignments.filter(a => a.role === 'Engineer').length;
      const total       = Math.max(1, assignments.length);
      const complexPct  = +(leadCount   / total * 100).toFixed(2);
      const mediumPct   = +(seniorCount / total * 100).toFixed(2);
      const simplePct   = +(engCount    / total * 100).toFixed(2);

      /* Project complexity bucket */
      const complexity: 'Complex' | 'Medium' | 'Simple' =
        proj.healthScore < 87 ? 'Complex' :
        proj.healthScore < 93 ? 'Medium'  : 'Simple';

      return {
        id: proj.id, code: proj.code, name: proj.name,
        offering: proj.offering, healthScore: proj.healthScore,
        releases, builds, reworkPct, defLeakPct,
        avgCycleDays: +avgCycleDays.toFixed(1),
        rqi, gm, utilPct: +utilPct.toFixed(0),
        memberCount, complexity, complexPct, mediumPct, simplePct,
      };
    });
  }, [projects, roleAssignments, prs, tickets, allReports, selectedPeriod]);

  /* ── Totals row ── */
  const totals = useMemo(() => {
    const n = Math.max(1, projectRows.length);
    return {
      releases:   projectRows.reduce((s, r) => s + r.releases, 0),
      builds:     projectRows.reduce((s, r) => s + r.builds, 0),
      reworkPct:  +(projectRows.reduce((s, r) => s + r.reworkPct, 0) / n).toFixed(1),
      defLeakPct: +(projectRows.reduce((s, r) => s + r.defLeakPct, 0) / n).toFixed(1),
      rqi:        +(projectRows.reduce((s, r) => s + r.rqi, 0) / n).toFixed(2),
      gm:         +(projectRows.reduce((s, r) => s + r.gm, 0) / n).toFixed(2),
      utilPct:    +(projectRows.reduce((s, r) => s + r.utilPct, 0) / n).toFixed(0),
    };
  }, [projectRows]);

  return (
    <div className="content-view">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Service Delivery</h1>
          <p className="section-desc">
            Project delivery metrics, RQI breakdown by offering, complexity analysis, and maturity scatter — computed from live performance reports for <strong>{selectedPeriod.label}</strong>.
          </p>
        </div>
        <div style={{ background: 'rgba(45,196,194,0.08)', border: '1px solid rgba(45,196,194,0.2)',
          borderRadius: 10, padding: '9px 16px', fontSize: '0.8rem',
          color: '#0f766e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={14} />
          RQI = 0.3 × Delivery + 0.4 × Quality + 0.3 × Reliability
        </div>
      </div>

      {/* Top quadrant row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* ── Q1: Per-project metrics table ── */}
        <div className="glass-card" style={{ padding: '20px 0' }}>
          <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Project Delivery Metrics
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{selectedPeriod.label}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ fontSize: '0.79rem' }}>
              <thead>
                <tr style={{ background: '#f8fafb' }}>
                  {[
                    { label: 'Project',  tip: 'Project code' },
                    { label: 'Releases', tip: 'Merged PRs in period' },
                    { label: 'Builds',   tip: 'Total PRs (merged + open)' },
                    { label: 'Rework',   tip: 'Avg rework bounces / ticket' },
                    { label: 'DefLeak',  tip: 'Bug tickets / all tickets' },
                    { label: 'Cycle',    tip: 'Avg cycle time in days' },
                    { label: 'RQI',      tip: '0.3·Delivery + 0.4·Quality + 0.3·Reliability' },
                    { label: 'GM',       tip: 'Story points / merged PR' },
                    { label: '%U',       tip: 'Avg allocation %' },
                  ].map(h => (
                    <th key={h.label} title={h.tip} style={{ padding: '8px 10px', fontSize: '0.72rem',
                      fontWeight: 700, color: '#374151', whiteSpace: 'nowrap',
                      borderBottom: '1px solid #e5e7eb', cursor: 'help' }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Totals row */}
                <tr style={{ background: '#f0f9ff', fontWeight: 700 }}>
                  <td style={{ padding: '8px 10px', color: 'var(--text-primary)', fontWeight: 700 }}>Total</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{totals.releases}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{totals.builds}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{fmtPct(totals.reworkPct)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{fmtPct(totals.defLeakPct)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>—</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                      fontWeight: 700, fontSize: '0.8rem', ...rqiStyle(totals.rqi) }}>{totals.rqi.toFixed(2)}</span>
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{totals.gm.toFixed(2)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{totals.utilPct}%</td>
                </tr>

                {projectRows.map(row => (
                  <React.Fragment key={row.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
                      <td style={{ padding: '7px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>
                            {expanded === row.id ? '▾' : '▸'}
                          </span>
                          <span style={{ color: '#2DC4C2', fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.8rem' }}>
                            {row.code}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>{row.releases}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>{row.builds}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'right',
                        color: row.reworkPct > 30 ? '#f43f5e' : undefined }}>
                        {fmtPct(row.reworkPct)}
                      </td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>{fmtPct(row.defLeakPct)}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>{row.avgCycleDays}d</td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                          fontWeight: 700, fontSize: '0.8rem', ...rqiStyle(row.rqi) }}>{row.rqi.toFixed(2)}</span>
                      </td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>{row.gm.toFixed(2)}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'right' }}>{row.utilPct}%</td>
                    </tr>

                    {/* Expanded: member-level breakdown */}
                    {expanded === row.id && (() => {
                      const assignments = roleAssignments.filter(a => a.projectId === row.id);
                      return assignments.map(a => {
                        const member = associates.find(x => x.id === a.associateId);
                        const rep    = allReports.find(r => r.associateId === a.associateId);
                        if (!member || !rep) return null;
                        const memberRqi = +(0.3 * rep.dimensions.delivery.score + 0.4 * rep.dimensions.quality.score + 0.3 * rep.dimensions.reliability.score).toFixed(2);
                        return (
                          <tr key={a.id} style={{ background: '#fafbfc' }}>
                            <td style={{ padding: '6px 10px 6px 26px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                              ↳ {member.name}
                              <span style={{ marginLeft: 6, fontSize: '0.7rem', color: 'var(--text-dim)' }}>({a.role})</span>
                            </td>
                            <td style={{ padding: '6px 10px', textAlign: 'right', fontSize: '0.78rem' }}>
                              {rep.dimensions.delivery.rawMetrics.mergedPRs as number ?? '—'}
                            </td>
                            <td colSpan={3} />
                            <td style={{ padding: '6px 10px', textAlign: 'right', fontSize: '0.78rem' }}>
                              {(+(rep.dimensions.delivery.rawMetrics.effectiveWorkingDays as number) / 22).toFixed(1)}d/mo
                            </td>
                            <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                              <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 4,
                                fontSize: '0.75rem', fontWeight: 700, ...rqiStyle(memberRqi) }}>{memberRqi}</span>
                            </td>
                            <td style={{ padding: '6px 10px', textAlign: 'right', fontSize: '0.78rem' }}>
                              {rep.overallScore}
                            </td>
                            <td style={{ padding: '6px 10px', textAlign: 'right', fontSize: '0.78rem' }}>
                              {a.allocationPercentage}%
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ padding: '10px 20px 0', display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            <span>Releases = merged PRs</span>
            <span>·</span>
            <span>GM = story pts / PR</span>
            <span>·</span>
            <span>%U = avg allocation</span>
            <span>·</span>
            <span>Click row to expand members</span>
          </div>
        </div>

        {/* ── Q2: RQI by Practice Area ── */}
        <div className="glass-card" style={{ padding: '20px 0' }}>
          <div style={{ padding: '0 20px 14px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            RQI by Practice Area &amp; Complexity
          </div>
          <PracticeAreaTable rows={projectRows} />

          <div style={{ margin: '14px 20px 0', padding: '10px 14px', borderRadius: 8,
            background: 'rgba(45,196,194,0.06)', border: '1px solid rgba(45,196,194,0.18)',
            fontSize: '0.79rem', fontWeight: 600, color: '#0f766e', textAlign: 'center' }}>
            RQI = 0.3 × Delivery Score + 0.4 × Quality Score + 0.3 × Reliability Score
          </div>

          {/* Score key */}
          <div style={{ margin: '12px 20px 0', display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.72rem' }}>
            {[
              { label: '≥ 95 Excellent', style: rqiStyle(96) },
              { label: '80–95 Good',     style: rqiStyle(88) },
              { label: '60–80 Fair',     style: rqiStyle(70) },
              { label: '< 60 At Risk',   style: rqiStyle(45) },
            ].map(k => (
              <span key={k.label} style={{ ...k.style, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                {k.label}
              </span>
            ))}
          </div>

          {/* Dimension weights reference */}
          <div style={{ margin: '12px 20px 0', fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Dimension sources:</strong>
            <br/>Delivery → story points + merged PRs vs benchmark
            <br/>Quality → bug leak rate + rework bounces
            <br/>Reliability → on-call duty + deployment stability
          </div>
        </div>
      </div>

      {/* Bottom quadrant row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ── Q3: Project complexity stacked bar ── */}
        <div className="glass-card">
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 10 }}>
            Project by Persona Mix
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.77rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Role Distribution</span>
            {[
              { label: 'Lead (Complex)', color: C_COMPLEX },
              { label: 'Senior Eng (Medium)', color: C_MEDIUM },
              { label: 'Engineer (Simple)', color: C_SIMPLE },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                {c.label}
              </div>
            ))}
          </div>
          <StackedBarChart rows={projectRows} />
        </div>

        {/* ── Q4: Delivery Maturity scatter ── */}
        <div className="glass-card">
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 10 }}>
            Delivery Maturity Plot
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.77rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Project Complexity</span>
            {(['Complex', 'Medium', 'Simple'] as const).map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: complexColor[c], flexShrink: 0 }} />
                {c}
              </div>
            ))}
          </div>
          <ScatterPlot rows={projectRows} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 8, textAlign: 'center' }}>
            Higher GM = more story points per PR (heavier delivery). Higher RQI = better overall quality + delivery + reliability.
          </div>
        </div>
      </div>
    </div>
  );
};
