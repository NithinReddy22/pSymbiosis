import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScoreBadge } from '../common/ScoreBadge';
import {
  TrendingUp,
  FolderKanban,
  Users,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Server,
  Layers,
  Code2,
  Cpu
} from 'lucide-react';

export const ExecutiveOverview: React.FC = () => {
  const {
    projects,
    associates,
    allReports,
    setSelectedProjectId,
    setSelectedAssociateId,
    setActiveTab,
    selectedPeriod
  } = useApp();

  const totalProjects = projects.length;
  const totalAssociates = associates.length;
  const avgOrgScore = Math.round(
    allReports.reduce((sum, r) => sum + r.overallScore, 0) / Math.max(1, allReports.length)
  );

  const totalAntiGamingAlerts = allReports.reduce((sum, r) => sum + r.antiGamingFlags.length, 0);

  // Group by Offerings
  const offerings = ['Cloud & DevOps', 'Fullstack Web & Mobile', 'QA & Test Automation', 'Data & AI'] as const;

  const offeringStats = offerings.map(off => {
    const projList = projects.filter(p => p.offering === off);
    const assocList = associates.filter(a => a.primaryOffering === off);
    const relatedReports = allReports.filter(r => {
      const a = associates.find(item => item.id === r.associateId);
      return a?.primaryOffering === off;
    });
    const avgScore = relatedReports.length > 0
      ? Math.round(relatedReports.reduce((s, r) => s + r.overallScore, 0) / relatedReports.length)
      : 85;

    return {
      offering: off,
      projectsCount: projList.length,
      associatesCount: assocList.length,
      avgScore
    };
  });

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Sparkles size={24} color="var(--accent-primary-light)" />
            Executive Delivery Dashboard
          </h1>
          <p className="section-desc">
            Standardized engineering performance, offering calibration, and project health for {selectedPeriod.label}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('ai-insights')}>
            <Sparkles size={16} /> AI Synthesis Report
          </button>
        </div>
      </div>

      {/* Top Stat Widgets */}
      <div className="stats-grid">
        <div className="stat-widget">
          <div className="stat-icon indigo">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">{avgOrgScore}</div>
            <div className="stat-label">Org Performance Index</div>
            <div className="stat-meta">
              <span>+3.2% vs previous quarter</span>
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon cyan">
            <FolderKanban size={24} />
          </div>
          <div>
            <div className="stat-value">{totalProjects}</div>
            <div className="stat-label">Active Projects</div>
            <div className="stat-meta" style={{ color: 'var(--accent-cyan)' }}>
              <span>4 offerings calibrated</span>
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon emerald">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{totalAssociates}</div>
            <div className="stat-label">Evaluated Engineers</div>
            <div className="stat-meta">
              <span>100% identity resolved</span>
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon rose">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-value">{totalAntiGamingAlerts}</div>
            <div className="stat-label">Anti-Gaming Flags</div>
            <div className="stat-meta" style={{ color: totalAntiGamingAlerts > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              <span>{totalAntiGamingAlerts > 0 ? 'Requires Lead review' : 'Cadence healthy'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offerings Grid */}
      <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={18} color="var(--accent-primary-light)" />
        Performance Benchmarks by Practice Offering
      </h2>
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {offeringStats.map(stat => (
          <div key={stat.offering} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{stat.offering}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {stat.projectsCount} Projects • {stat.associatesCount} Active Engineers
                </span>
              </div>
              <ScoreBadge score={stat.avgScore} size="md" />
            </div>

            <div className="progress-bar-container" style={{ margin: '12px 0 16px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${stat.avgScore}%`,
                  background: stat.avgScore >= 85 ? 'var(--accent-primary-gradient)' : 'var(--accent-cyan)'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span>Target Standard: 80+</span>
              <span style={{ color: 'var(--accent-emerald)' }}>Normalized for domain complexity</span>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Project Portfolios & Health</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Multi-platform tool health and team performance scores
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="psiog-table">
            <thead>
              <tr>
                <th>Project & Client</th>
                <th>Practice Offering</th>
                <th>Lead / Delivery Lead</th>
                <th>Connected Tools</th>
                <th>Status</th>
                <th>Performance Index</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(proj => {
                const lead = associates.find(a => a.id === proj.leadId);

                return (
                  <tr key={proj.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{proj.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Client: {proj.client} • Code: {proj.code}
                      </div>
                    </td>
                    <td>
                      <span className="pill-badge blue" style={{ fontSize: '0.75rem' }}>
                        {proj.offering}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {lead && (
                          <>
                            <img src={lead.avatar} alt={lead.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                            <span style={{ fontSize: '0.85rem' }}>{lead.name}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {proj.connectedTools.map(t => (
                          <span key={t} style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            background: 'var(--bg-input)',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)'
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>
                        {proj.status}
                      </span>
                    </td>
                    <td>
                      <ScoreBadge score={proj.healthScore} size="sm" />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setActiveTab('project');
                        }}
                      >
                        Explore Project <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
