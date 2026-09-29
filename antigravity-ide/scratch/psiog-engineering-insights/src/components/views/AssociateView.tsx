import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScoreBadge } from '../common/ScoreBadge';
import { ExplainModal } from '../common/ExplainModal';
import { ContextNoteModal } from '../common/ContextNoteModal';
import { ManualEntryModal } from '../common/ManualEntryModal';
import { RadarChart } from '../common/RadarChart';
import { ExportReportModal } from '../common/ExportReportModal';
import {
  User,
  Calendar,
  Briefcase,
  GitPullRequest,
  CheckCircle,
  FileText,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Cpu,
  Layers,
  Clock,
  BookOpen,
  Download
} from 'lucide-react';

export const AssociateView: React.FC = () => {
  const {
    associates,
    selectedAssociateId,
    setSelectedAssociateId,
    userRole,
    currentUserId,
    allReports,
    selectedPeriod,
    tickets,
    prs,
    reviews,
    tests,
    docs,
    identities,
    contextNotes,
    manualEntries
  } = useApp();

  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [drilldownTab, setDrilldownTab] = useState<'tickets' | 'prs' | 'reviews' | 'tests' | 'docs' | 'notes'>('tickets');

  // If role is Engineer, force view to current user (Criteria 10: RBAC)
  const effectiveAssociateId = userRole === 'Engineer' ? currentUserId : selectedAssociateId;
  const currentAssociate = associates.find(a => a.id === effectiveAssociateId) || associates[0];
  const report = allReports.find(r => r.associateId === currentAssociate.id);

  // Associated tool identities
  const userIdentities = identities.filter(id => id.associateId === currentAssociate.id);

  // Activities specifically mapped to this user's handles
  const userHandles = new Set(
    userIdentities.flatMap(id => [id.accountHandle.toLowerCase(), (id.accountEmail || '').toLowerCase()]).filter(Boolean)
  );

  const userTickets = tickets.filter(t => userHandles.has(t.authorToolId.toLowerCase()));
  const userPRs = prs.filter(p => userHandles.has(p.authorToolId.toLowerCase()));
  const userReviews = reviews.filter(r => userHandles.has(r.reviewerToolId.toLowerCase()));
  const userTests = tests.filter(te => userHandles.has(te.testerToolId.toLowerCase()));
  const userDocs = docs.filter(d => userHandles.has(d.authorToolId.toLowerCase()));
  const userNotes = contextNotes.filter(n => n.associateId === currentAssociate.id);
  const userManual = manualEntries.filter(m => m.associateId === currentAssociate.id);

  if (!report) {
    return <div className="content-view">Loading report...</div>;
  }

  const { dimensions, tenureSegments, aiInsights, antiGamingFlags, contextAdjustments } = report;

  return (
    <div className="content-view">
      {/* Top Associate Header Profile Card */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <img
              src={currentAssociate.avatar}
              alt={currentAssociate.name}
              style={{ width: '74px', height: '74px', borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent-primary-light)', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {userRole !== 'Engineer' ? (
                  <select
                    className="form-control"
                    style={{ fontSize: '1.35rem', fontWeight: 700, padding: '4px 10px', height: 'auto', background: 'transparent', border: '1px solid var(--border-color)', color: '#fff' }}
                    value={currentAssociate.id}
                    onChange={e => setSelectedAssociateId(e.target.value)}
                  >
                    {associates.map(a => (
                      <option key={a.id} value={a.id} style={{ background: '#111827' }}>
                        {a.name} ({a.title})
                      </option>
                    ))}
                  </select>
                ) : (
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff' }}>
                    {currentAssociate.name}
                  </h1>
                )}
                <span className="pill-badge blue">{currentAssociate.primaryOffering}</span>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>{currentAssociate.title}</span>
                <span>•</span>
                <span>{currentAssociate.email}</span>
                <span>•</span>
                <span>{currentAssociate.location}</span>
                <span>•</span>
                <span>Tenure: {selectedPeriod.label}</span>
              </div>
            </div>
          </div>

          {/* Overall Composite Score Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', fontWeight: 600 }}>
                Performance Rating
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                {report.ratingBand}
              </div>
            </div>
            <ScoreBadge score={report.overallScore} size="lg" />
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowExplainModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Scale size={15} /> Explain Formula
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowExportModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export Dossier
            </button>
          </div>
        </div>

        {/* Time-Bound Multi-Tenure Segments (Criteria 3 & 11) */}
        <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '10px', fontWeight: 700 }}>
            Time-Bound Project & Role Attribution Timeline ({selectedPeriod.label})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {tenureSegments.map((seg, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{seg.projectName}</span>
                    <span className="pill-badge purple" style={{ fontSize: '0.7rem' }}>{seg.role}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Dates: {seg.startDate} → {seg.endDate} ({seg.activeCalendarDays} days, {seg.allocationPercentage}% alloc)
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.76rem', color: 'var(--accent-cyan)' }}>
                  <div>{seg.activitiesCount.tickets} tickets • {seg.activitiesCount.prs} PRs</div>
                  <div>{seg.activitiesCount.reviews} reviews • {seg.activitiesCount.docs} docs</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Tool Identifiers Pill List */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Unified Tool Accounts:
          </span>
          {userIdentities.map(id => (
            <span
              key={id.id}
              style={{
                fontSize: '0.74rem',
                padding: '2px 8px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-primary-light)',
                fontFamily: 'JetBrains Mono'
              }}
            >
              <strong>{id.tool}:</strong> {id.accountHandle}
            </span>
          ))}
        </div>
      </div>

      {/* AI Performance Narrative Card (Criteria 9) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles size={18} color="var(--accent-primary-light)" />
          <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>
            AI Plain-English Evaluation & Tenure Summary
          </h3>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          {aiInsights.executiveSummary}
        </p>

        {aiInsights.tenureShiftNarrative && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginTop: '12px',
            fontSize: '0.82rem',
            color: 'var(--accent-cyan)'
          }}>
            <strong>Tenure Transition Analysis:</strong> {aiInsights.tenureShiftNarrative}
          </div>
        )}

        <div className="grid-2" style={{ marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '6px' }}>
              Key Demonstrated Strengths
            </div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {aiInsights.keyStrengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '6px' }}>
              Growth & Coaching Recommendations
            </div>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {aiInsights.growthAreas.map((gr, idx) => (
                <li key={idx}>{gr}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Anti-Gaming Alerts Box if any (Criteria 9) */}
      {antiGamingFlags.length > 0 && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <AlertTriangle size={18} color="var(--accent-rose)" />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              Anti-Gaming Pattern Alert Detected ({antiGamingFlags.length})
            </h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {antiGamingFlags.map(flag => (
              <div key={flag.id} style={{ fontSize: '0.82rem', color: '#fff', background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 600 }}>{flag.title}</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{flag.description}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary-light)', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  {flag.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 Core Performance Dimensions */}
      <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={18} color="var(--accent-primary-light)" />
        Multi-Dimensional Score Breakdown & Radar Balance
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Radar Chart Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <h4 style={{ fontSize: '0.92rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>
            Dimensional Equilibrium vs Target Baseline
          </h4>
          <RadarChart
            dimensions={{
              delivery: dimensions.delivery.score,
              quality: dimensions.quality.score,
              review: dimensions.review.score,
              documentation: dimensions.documentation.score,
              reliability: dimensions.reliability.score
            }}
            size={280}
          />
        </div>

        {/* Dimension Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {/* Dimension 1: Delivery */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Velocity & Delivery</span>
              <ScoreBadge score={dimensions.delivery.score} size="sm" />
            </div>
            <div className="progress-bar-container" style={{ margin: '6px 0 10px' }}>
              <div className="progress-bar-fill" style={{ width: `${dimensions.delivery.score}%`, background: 'var(--accent-primary-gradient)' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <strong>{dimensions.delivery.rawMetrics.storyPoints} Story Points</strong> • {dimensions.delivery.rawMetrics.mergedPRs} Merged PRs
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Weight: {Math.round(dimensions.delivery.weight * 100)}%
            </div>
          </div>

          {/* Dimension 2: Quality */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Code Quality & Rework</span>
              <ScoreBadge score={dimensions.quality.score} size="sm" />
            </div>
            <div className="progress-bar-container" style={{ margin: '6px 0 10px' }}>
              <div className="progress-bar-fill" style={{ width: `${dimensions.quality.score}%`, background: 'var(--accent-emerald)' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Bug Leak: <strong>{dimensions.quality.rawMetrics.bugLeakRatePercent}</strong> • {dimensions.quality.rawMetrics.reworkBounces} Reworks
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Weight: {Math.round(dimensions.quality.weight * 100)}%
            </div>
          </div>

          {/* Dimension 3: Review */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Peer Review Rigor</span>
              <ScoreBadge score={dimensions.review.score} size="sm" />
            </div>
            <div className="progress-bar-container" style={{ margin: '6px 0 10px' }}>
              <div className="progress-bar-fill" style={{ width: `${dimensions.review.score}%`, background: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <strong>{dimensions.review.rawMetrics.substantiveReviewsCount} Substantive Reviews</strong> ({dimensions.review.rawMetrics.totalSubstantiveComments} comments)
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Weight: {Math.round(dimensions.review.weight * 100)}%
            </div>
          </div>

          {/* Dimension 4: Documentation */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Architecture & Docs</span>
              <ScoreBadge score={dimensions.documentation.score} size="sm" />
            </div>
            <div className="progress-bar-container" style={{ margin: '6px 0 10px' }}>
              <div className="progress-bar-fill" style={{ width: `${dimensions.documentation.score}%`, background: 'var(--accent-purple)' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <strong>{dimensions.documentation.rawMetrics.sharePointDocsCreated} Tech Specs / ADRs</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Weight: {Math.round(dimensions.documentation.weight * 100)}%
            </div>
          </div>

          {/* Dimension 5: Reliability */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Operational Reliability</span>
              <ScoreBadge score={dimensions.reliability.score} size="sm" />
            </div>
            <div className="progress-bar-container" style={{ margin: '6px 0 10px' }}>
              <div className="progress-bar-fill" style={{ width: `${dimensions.reliability.score}%`, background: 'var(--accent-amber)' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              On-Call Served: <strong>{dimensions.reliability.rawMetrics.onCallDaysServed} Days</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Weight: {Math.round(dimensions.reliability.weight * 100)}%
            </div>
          </div>

          {/* Quick Context & Manual Action Card */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowContextModal(true)} style={{ fontSize: '0.78rem' }}>
              <PlusCircle size={13} /> Add Context Note
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowManualModal(true)} style={{ fontSize: '0.78rem' }}>
              <PlusCircle size={13} /> Add Manual Overlay
            </button>
          </div>
        </div>
      </div>

      {/* Underlying Activity Drilldown Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
        {[
          { id: 'tickets', label: `JIRA / ADO Tickets (${userTickets.length})` },
          { id: 'prs', label: `Git Pull Requests (${userPRs.length})` },
          { id: 'reviews', label: `Code Reviews Conducted (${userReviews.length})` },
          { id: 'tests', label: `QA Test Executions (${userTests.length})` },
          { id: 'docs', label: `SharePoint ADRs (${userDocs.length})` },
          { id: 'notes', label: `Context Notes & Overlays (${userNotes.length + userManual.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDrilldownTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: drilldownTab === tab.id ? '2px solid var(--accent-primary-light)' : '2px solid transparent',
              color: drilldownTab === tab.id ? '#fff' : 'var(--text-muted)',
              fontWeight: drilldownTab === tab.id ? 600 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drilldown Tables */}
      {drilldownTab === 'tickets' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Points</th>
                  <th>Cycle Time</th>
                  <th>QA Bounces</th>
                  <th>Resolved Date</th>
                </tr>
              </thead>
              <tbody>
                {userTickets.map(t => (
                  <tr key={t.id}>
                    <td><code>{t.ticketKey}</code></td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{t.title}</td>
                    <td><span className="pill-badge blue">{t.projectId}</span></td>
                    <td><strong>{t.storyPoints} pts</strong></td>
                    <td>{t.cycleTimeHours}h</td>
                    <td>{t.reworkCount}</td>
                    <td>{new Date(t.resolvedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drilldownTab === 'prs' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>PR #</th>
                  <th>Title</th>
                  <th>Repository</th>
                  <th>Net Lines</th>
                  <th>Turnaround</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userPRs.map(pr => (
                  <tr key={pr.id}>
                    <td><code>#{pr.prNumber}</code></td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{pr.title}</td>
                    <td>{pr.repo}</td>
                    <td>
                      <span style={{ color: 'var(--accent-emerald)', marginRight: '6px' }}>+{pr.linesAdded}</span>
                      <span style={{ color: 'var(--accent-rose)' }}>-{pr.linesDeleted}</span>
                    </td>
                    <td>{pr.turnaroundHours}h</td>
                    <td>
                      <span className="pill-badge green">{pr.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drilldownTab === 'reviews' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>PR Title</th>
                  <th>Verdict</th>
                  <th>Substantive Comments</th>
                  <th>Quality Category</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {userReviews.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{r.prTitle}</td>
                    <td><span className="pill-badge green">{r.verdict}</span></td>
                    <td><strong>{r.substantiveCommentsCount} technical comments</strong></td>
                    <td>
                      {r.isSuperficial ? (
                        <span className="pill-badge amber">Filtered (Superficial)</span>
                      ) : (
                        <span className="pill-badge green">Substantive</span>
                      )}
                    </td>
                    <td>{new Date(r.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drilldownTab === 'tests' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Test Case</th>
                  <th>Title</th>
                  <th>Suite</th>
                  <th>Result</th>
                  <th>Duration</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {userTests.map(te => (
                  <tr key={te.id}>
                    <td><code>{te.testCaseKey}</code></td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{te.title}</td>
                    <td>{te.suiteName}</td>
                    <td><span className="pill-badge green">{te.result}</span></td>
                    <td>{te.executionDurationMinutes} min</td>
                    <td>{new Date(te.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drilldownTab === 'docs' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Title</th>
                  <th>Word Count</th>
                  <th>Views</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {userDocs.map(d => (
                  <tr key={d.id}>
                    <td><span className="pill-badge purple">{d.docType}</span></td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{d.title}</td>
                    <td>{d.wordCount.toLocaleString()} words</td>
                    <td>{d.viewsCount} views</td>
                    <td>{new Date(d.lastModified).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drilldownTab === 'notes' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Recorded Manager Context Notes ({userNotes.length})</h4>
            {userNotes.map(n => (
              <div key={n.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="pill-badge green">{n.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Recorded by {n.authorName} on {new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '6px' }}>{n.description}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary-light)', marginTop: '4px' }}>
                  Impact: {n.impactDays} working days • Baseline adjustment: {n.baselineAdjustmentPercent}%
                </div>
              </div>
            ))}

            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginTop: '14px' }}>Manual Data Overlays ({userManual.length})</h4>
            {userManual.map(m => (
              <div key={m.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="pill-badge blue">{m.dimension}: {m.metricName}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Signed by {m.enteredBy} on {new Date(m.enteredAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '6px' }}>Reason: {m.reason}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                  Credited Value: +{m.value} {m.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showExplainModal && (
        <ExplainModal
          report={report}
          associate={currentAssociate}
          onClose={() => setShowExplainModal(false)}
        />
      )}

      {showContextModal && (
        <ContextNoteModal
          associateId={currentAssociate.id}
          projectId={tenureSegments[0]?.projectId || 'PROJ-ALPHA'}
          onClose={() => setShowContextModal(false)}
        />
      )}

      {showManualModal && (
        <ManualEntryModal
          associateId={currentAssociate.id}
          projectId={tenureSegments[0]?.projectId || 'PROJ-ALPHA'}
          onClose={() => setShowManualModal(false)}
        />
      )}

      {showExportModal && (
        <ExportReportModal
          report={report}
          associate={currentAssociate}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
