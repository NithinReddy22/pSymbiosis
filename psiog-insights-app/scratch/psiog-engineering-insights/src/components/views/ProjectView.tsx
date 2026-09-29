import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScoreBadge } from '../common/ScoreBadge';
import { ContextNoteModal } from '../common/ContextNoteModal';
import { ManualEntryModal } from '../common/ManualEntryModal';
import { SprintTrendChart } from '../common/SprintTrendChart';
import {
  FolderGit2,
  Users,
  GitPullRequest as GitIcon,
  CheckCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  PlusCircle,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { generateProjectAISummary } from '../../services/aiInsightsEngine';

export const ProjectView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    associates,
    roleAssignments,
    allReports,
    tickets,
    prs,
    reviews,
    tests,
    docs,
    setSelectedAssociateId,
    setActiveTab,
    selectedPeriod
  } = useApp();

  const [activeDrilldownTab, setActiveDrilldownTab] = useState<'members' | 'tickets' | 'prs' | 'reviews' | 'tests' | 'docs'>('members');
  const [modalContextAssociateId, setModalContextAssociateId] = useState<string | null>(null);
  const [modalManualAssociateId, setModalManualAssociateId] = useState<string | null>(null);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Contributing team members in this project during the selected period
  const projectAssignments = roleAssignments.filter(ra => ra.projectId === currentProject.id);
  const projectMemberIds = Array.from(new Set(projectAssignments.map(ra => ra.associateId)));

  const projectMembers = projectMemberIds.map(id => {
    const assoc = associates.find(a => a.id === id)!;
    const assignment = projectAssignments.find(ra => ra.associateId === id);
    const report = allReports.find(r => r.associateId === id);
    return {
      associate: assoc,
      role: assignment?.role || 'Engineer',
      startDate: assignment?.startDate || '2025-01-01',
      endDate: assignment?.endDate || 'Present',
      report
    };
  });

  // Project underlying activities
  const projectTickets = tickets.filter(t => t.projectId === currentProject.id);
  const projectPRs = prs.filter(p => p.projectId === currentProject.id);
  const projectReviews = reviews.filter(r => r.projectId === currentProject.id);
  const projectTests = tests.filter(te => te.projectId === currentProject.id);
  const projectDocs = docs.filter(d => d.projectId === currentProject.id);

  // AI Summary
  const projectAISummary = generateProjectAISummary(currentProject, allReports, associates);

  return (
    <div className="content-view">
      {/* Project Selector Bar */}
      <div className="section-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon indigo" style={{ width: '42px', height: '42px' }}>
              <FolderGit2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  className="form-control"
                  style={{ fontSize: '1.2rem', fontWeight: 700, padding: '4px 10px', height: 'auto', background: 'transparent', border: '1px solid var(--border-color)' }}
                  value={currentProject.id}
                  onChange={e => setSelectedProjectId(e.target.value)}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id} style={{ background: '#111827' }}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
                <span className="pill-badge blue">{currentProject.offering}</span>
              </div>
              <p className="section-desc" style={{ marginTop: '4px' }}>
                Client: {currentProject.client} • Evaluation Period: {selectedPeriod.label}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setModalContextAssociateId(projectMembers[0]?.associate.id || 'A001')}
          >
            <PlusCircle size={14} /> Add Manager Context Note
          </button>
        </div>
      </div>

      {/* Project AI Executive Brief Callout */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 22px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <div className="stat-icon indigo" style={{ width: '38px', height: '38px', flexShrink: 0 }}>
          <Sparkles size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>
              AI Project Delivery & Cadence Brief
            </h4>
            <ScoreBadge score={projectAISummary.healthScore} size="sm" showLabel />
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.5 }}>
            {projectAISummary.executiveBrief}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span><strong>Strengths:</strong> {projectAISummary.keyStrengths[0]}</span>
            <span><strong>Risk to Monitor:</strong> {projectAISummary.operationalRisks[0]}</span>
          </div>
        </div>
      </div>

      {/* Project Activity Counts */}
      <div className="stats-grid">
        <div className="stat-widget">
          <div className="stat-icon indigo">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">{projectMembers.length}</div>
            <div className="stat-label">Active Team Members</div>
            <div className="stat-meta">
              <span>Attributed across tenure</span>
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon cyan">
            <GitIcon size={22} />
          </div>
          <div>
            <div className="stat-value">{projectPRs.length}</div>
            <div className="stat-label">Merged Pull Requests</div>
            <div className="stat-meta">
              <span>{projectReviews.length} code reviews</span>
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon emerald">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-value">{projectTickets.length}</div>
            <div className="stat-label">Resolved Tickets</div>
            <div className="stat-meta">
              <span>{projectTickets.reduce((s, t) => s + t.storyPoints, 0)} story points</span>
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon amber">
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-value">{projectDocs.length}</div>
            <div className="stat-label">SharePoint ADRs / Specs</div>
            <div className="stat-meta">
              <span>{projectTests.length} QA test runs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Trend Line & Velocity Chart */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={18} color="var(--accent-primary-light)" />
            <h3 style={{ fontSize: '1rem', color: '#fff' }}>
              Bi-Weekly Sprint Velocity & Deliverable Throughput
            </h3>
          </div>
          <span className="pill-badge blue" style={{ fontSize: '0.72rem' }}>
            {selectedPeriod.label} Sprint Cadence
          </span>
        </div>
        <SprintTrendChart />
      </div>

      {/* Drilldown Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
        {[
          { id: 'members', label: `Team Members (${projectMembers.length})` },
          { id: 'tickets', label: `Tickets & Stories (${projectTickets.length})` },
          { id: 'prs', label: `Pull Requests (${projectPRs.length})` },
          { id: 'reviews', label: `Code Reviews (${projectReviews.length})` },
          { id: 'tests', label: `QA Test Runs (${projectTests.length})` },
          { id: 'docs', label: `SharePoint Docs (${projectDocs.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDrilldownTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeDrilldownTab === tab.id ? '2px solid var(--accent-primary-light)' : '2px solid transparent',
              color: activeDrilldownTab === tab.id ? '#fff' : 'var(--text-muted)',
              fontWeight: activeDrilldownTab === tab.id ? 600 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Team Members */}
      {activeDrilldownTab === 'members' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Associate</th>
                  <th>Assigned Role</th>
                  <th>Tenure on Project</th>
                  <th>Overall Score</th>
                  <th>Rating Band</th>
                  <th>Anti-Gaming Alerts</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projectMembers.map(({ associate, role, startDate, endDate, report }) => (
                  <tr key={associate.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={associate.avatar} alt={associate.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{associate.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{associate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="pill-badge blue">{role}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {startDate} → {endDate}
                      </div>
                    </td>
                    <td>
                      <ScoreBadge score={report?.overallScore || 85} size="sm" />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {report?.ratingBand || 'Meeting Expectations'}
                      </span>
                    </td>
                    <td>
                      {report && report.antiGamingFlags.length > 0 ? (
                        <span className="pill-badge rose" style={{ fontSize: '0.72rem' }}>
                          <AlertTriangle size={12} /> {report.antiGamingFlags.length} Flagged
                        </span>
                      ) : (
                        <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>
                          <CheckCircle size={12} /> Clean
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedAssociateId(associate.id);
                          setActiveTab('associate');
                        }}
                      >
                        View Full Breakdown <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Tickets Drilldown */}
      {activeDrilldownTab === 'tickets' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Ticket Key</th>
                  <th>Title & Summary</th>
                  <th>Source Tool</th>
                  <th>Story Points</th>
                  <th>Author / Assignee</th>
                  <th>Status</th>
                  <th>Cycle Time</th>
                  <th>QA Rework Bounces</th>
                </tr>
              </thead>
              <tbody>
                {projectTickets.map(t => (
                  <tr key={t.id}>
                    <td>
                      <code style={{ color: 'var(--accent-primary-light)', fontWeight: 600 }}>{t.ticketKey}</code>
                    </td>
                    <td style={{ maxWidth: '350px' }}>
                      <div style={{ fontWeight: 500, color: '#fff' }}>{t.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Resolved: {new Date(t.resolvedAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <span className="pill-badge blue">{t.source}</span>
                    </td>
                    <td>
                      <strong>{t.storyPoints} pts</strong>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.78rem' }}>{t.authorToolId}</code>
                    </td>
                    <td>
                      <span className="pill-badge green">{t.status}</span>
                    </td>
                    <td>{t.cycleTimeHours} hrs</td>
                    <td>
                      {t.reworkCount > 1 ? (
                        <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{t.reworkCount} bounces</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>{t.reworkCount}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Pull Requests Drilldown */}
      {activeDrilldownTab === 'prs' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>PR #</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Lines Altered</th>
                  <th>Commits</th>
                  <th>Turnaround</th>
                  <th>Anti-Gaming Heuristic</th>
                </tr>
              </thead>
              <tbody>
                {projectPRs.map(pr => (
                  <tr key={pr.id}>
                    <td>
                      <code style={{ color: 'var(--accent-cyan)' }}>#{pr.prNumber}</code>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      <div style={{ fontWeight: 500, color: '#fff' }}>{pr.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{pr.repo}</div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.78rem' }}>{pr.authorToolId}</code>
                    </td>
                    <td>
                      <span style={{ color: 'var(--accent-emerald)', marginRight: '6px' }}>+{pr.linesAdded}</span>
                      <span style={{ color: 'var(--accent-rose)' }}>-{pr.linesDeleted}</span>
                    </td>
                    <td>{pr.commitCount} commits</td>
                    <td>{pr.turnaroundHours}h</td>
                    <td>
                      {pr.isSelfApproved && (
                        <span className="pill-badge rose" style={{ fontSize: '0.7rem' }}>
                          Self-Approved
                        </span>
                      )}
                      {pr.hasMicroCommits && (
                        <span className="pill-badge amber" style={{ fontSize: '0.7rem', marginLeft: '4px' }}>
                          Micro-Commits
                        </span>
                      )}
                      {!pr.isSelfApproved && !pr.hasMicroCommits && (
                        <span className="pill-badge green" style={{ fontSize: '0.7rem' }}>
                          Peer Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Code Reviews Drilldown */}
      {activeDrilldownTab === 'reviews' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>PR Title</th>
                  <th>Reviewer</th>
                  <th>Verdict</th>
                  <th>Substantive Comments</th>
                  <th>Quality Category</th>
                  <th>Turnaround</th>
                </tr>
              </thead>
              <tbody>
                {projectReviews.map(r => (
                  <tr key={r.id}>
                    <td>{r.prTitle}</td>
                    <td><code>{r.reviewerToolId}</code></td>
                    <td>
                      <span className={`pill-badge ${r.verdict === 'Approved' ? 'green' : 'amber'}`}>
                        {r.verdict}
                      </span>
                    </td>
                    <td>
                      <strong>{r.substantiveCommentsCount} technical comments</strong>
                    </td>
                    <td>
                      {r.isSuperficial ? (
                        <span className="pill-badge amber" style={{ fontSize: '0.72rem' }}>
                          Filtered ('LGTM')
                        </span>
                      ) : (
                        <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>
                          Substantive Architectural Review
                        </span>
                      )}
                    </td>
                    <td>{r.turnaroundHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Test Executions Drilldown */}
      {activeDrilldownTab === 'tests' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Test Case Key</th>
                  <th>Suite Name & Title</th>
                  <th>Tester</th>
                  <th>Result</th>
                  <th>Automated?</th>
                  <th>Execution Duration</th>
                  <th>Defects Logged</th>
                </tr>
              </thead>
              <tbody>
                {projectTests.map(te => (
                  <tr key={te.id}>
                    <td><code>{te.testCaseKey}</code></td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#fff' }}>{te.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{te.suiteName}</div>
                    </td>
                    <td><code>{te.testerToolId}</code></td>
                    <td>
                      <span className={`pill-badge ${te.result === 'Passed' ? 'green' : 'rose'}`}>
                        {te.result}
                      </span>
                    </td>
                    <td>{te.isAutomated ? 'Yes (Playwright/API)' : 'Manual'}</td>
                    <td>{te.executionDurationMinutes} min</td>
                    <td>{te.defectsLoggedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SharePoint Docs Drilldown */}
      {activeDrilldownTab === 'docs' && (
        <div className="glass-card">
          <div className="table-container">
            <table className="psiog-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Word Count</th>
                  <th>Read Views</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {projectDocs.map(d => (
                  <tr key={d.id}>
                    <td>
                      <span className="pill-badge purple">{d.docType}</span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{d.title}</td>
                    <td><code>{d.authorToolId}</code></td>
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

      {/* Modals */}
      {modalContextAssociateId && (
        <ContextNoteModal
          associateId={modalContextAssociateId}
          projectId={currentProject.id}
          onClose={() => setModalContextAssociateId(null)}
        />
      )}
    </div>
  );
};
