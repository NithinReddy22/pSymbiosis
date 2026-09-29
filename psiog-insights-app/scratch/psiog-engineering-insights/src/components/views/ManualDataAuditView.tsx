import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualEntryModal } from '../common/ManualEntryModal';
import {
  FileSpreadsheet,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  FolderGit2
} from 'lucide-react';

export const ManualDataAuditView: React.FC = () => {
  const { manualEntries, associates, projects } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <FileSpreadsheet size={24} color="var(--accent-primary-light)" />
            Manual Entries, Overlays & Non-Destructive Audit Log
          </h1>
          <p className="section-desc">
            Record ad-hoc engineering metrics for un-integrated tools with immutable author signatures and zero raw data overwrites
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <PlusCircle size={16} /> Record Manual Metric
        </button>
      </div>

      {/* Compliance Notice Card */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 22px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div className="stat-icon emerald" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>
            Strict Non-Destructive Data Overlay Policy (Criteria 2)
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '2px' }}>
            All manual entries are recorded as independent ledger records that layer on top of automated data sources at computation time. Raw source data from JIRA, Azure DevOps, Git, and SharePoint is NEVER modified or deleted.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Historical Audit Log ({manualEntries.length} Recorded Entries)</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Track who entered manual data, for which project, and the documented business reason
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="psiog-table">
            <thead>
              <tr>
                <th>Target Associate</th>
                <th>Project Attribution</th>
                <th>Dimension & Metric</th>
                <th>Credited Value</th>
                <th>Documented Justification</th>
                <th>Author Signature</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {manualEntries.map(entry => {
                const assoc = associates.find(a => a.id === entry.associateId);
                const proj = projects.find(p => p.id === entry.projectId);

                return (
                  <tr key={entry.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {assoc && (
                          <img src={assoc.avatar} alt={assoc.name} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{assoc?.name || entry.associateId}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{assoc?.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="pill-badge blue" style={{ fontSize: '0.75rem' }}>
                        {proj?.name || entry.projectId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{entry.metricName}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary-light)' }}>
                        Dimension: {entry.dimension}
                      </div>
                    </td>
                    <td>
                      <span className="pill-badge green" style={{ fontSize: '0.78rem' }}>
                        +{entry.value} {entry.unit}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {entry.reason}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#fff' }}>{entry.enteredBy}</div>
                      <span className="pill-badge purple" style={{ fontSize: '0.7rem' }}>Authorized</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {new Date(entry.enteredAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <ManualEntryModal
          associateId={associates[0]?.id || 'A001'}
          projectId={projects[0]?.id || 'PROJ-ALPHA'}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};
