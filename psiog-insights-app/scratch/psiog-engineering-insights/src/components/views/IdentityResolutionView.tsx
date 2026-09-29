import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolType, ToolAccountIdentity, Associate } from '../../types';
import { findUnmatchedActivities, suggestAssociateMatch } from '../../services/identityResolution';
import {
  Fingerprint,
  Link2,
  Unlink,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Search,
  UserCheck,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const IdentityResolutionView: React.FC = () => {
  const {
    identities,
    associates,
    updateIdentityMapping,
    tickets,
    prs,
    reviews,
    tests,
    docs
  } = useApp();

  const [filterTool, setFilterTool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrphanId, setSelectedOrphanId] = useState<string | null>(null);
  const [targetAssociateId, setTargetAssociateId] = useState<string>(associates[0]?.id || 'A001');

  // Discover unmatched orphan activities
  const orphanActivities = findUnmatchedActivities(identities, tickets, prs, reviews, tests, docs);

  const filteredIdentities = identities.filter(id => {
    if (filterTool !== 'all' && id.tool !== filterTool) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchHandle = id.accountHandle.toLowerCase().includes(q);
      const matchEmail = id.accountEmail?.toLowerCase().includes(q);
      const matchName = id.accountDisplayName.toLowerCase().includes(q);
      return matchHandle || matchEmail || matchName;
    }
    return true;
  });

  const handleLinkIdentity = (identityId: string, assocId: string) => {
    updateIdentityMapping(identityId, assocId, 'manual_override');
    setSelectedOrphanId(null);
  };

  const handleUnlinkIdentity = (identityId: string) => {
    updateIdentityMapping(identityId, null, 'unmatched');
  };

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Fingerprint size={24} color="var(--accent-primary-light)" />
            Identity Resolution & Cross-Tool Account Graph
          </h1>
          <p className="section-desc">
            Resolve disparate accounts across Git, JIRA, Azure DevOps, TestRail, and SharePoint into unified associate profiles
          </p>
        </div>
      </div>

      {/* Unmatched Orphan Activity Triage Notice (Criteria 4) */}
      {orphanActivities.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Unmatched Activity Triage Queue ({orphanActivities.length} orphan items detected)
              </h3>
            </div>
            <span className="pill-badge amber" style={{ fontSize: '0.75rem' }}>Action Required</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '14px' }}>
            The following engineering activities were ingested from tool webhooks/APIs but could not be attributed to any known Psiog Associate. Link them below to ensure fair performance credit.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orphanActivities.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="pill-badge purple" style={{ fontSize: '0.72rem' }}>{item.sourceTool}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Author Tool Identifier: <code>{item.sourceIdentifier}</code> • Project: {item.projectId}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    className="form-control"
                    style={{ fontSize: '0.78rem', padding: '4px 8px', height: 'auto', background: 'var(--bg-input)' }}
                    value={targetAssociateId}
                    onChange={e => setTargetAssociateId(e.target.value)}
                  >
                    {associates.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      // Find or create identity for this identifier
                      const existingId = identities.find(i => i.accountHandle === item.sourceIdentifier);
                      if (existingId) {
                        handleLinkIdentity(existingId.id, targetAssociateId);
                      }
                    }}
                  >
                    <Link2 size={13} /> Link to Associate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by account handle, email, or name..."
              style={{ width: '320px', height: '36px', fontSize: '0.84rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter Tool:</span>
            {['all', 'Git', 'JIRA', 'Azure DevOps', 'TestRail', 'SharePoint'].map(tool => (
              <button
                key={tool}
                className={`btn btn-sm ${filterTool === tool ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterTool(tool)}
              >
                {tool === 'all' ? 'All Tools' : tool}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Identities Master Table */}
      <div className="glass-card">
        <div className="table-container">
          <table className="psiog-table">
            <thead>
              <tr>
                <th>Tool Type</th>
                <th>Account Identifier / Handle</th>
                <th>Resolved Associate Profile</th>
                <th>Confidence Score</th>
                <th>Mapping Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdentities.map(id => {
                const matchedAssoc = associates.find(a => a.id === id.associateId);
                const suggested = !matchedAssoc ? suggestAssociateMatch(id, associates) : null;

                return (
                  <tr key={id.id}>
                    <td>
                      <span className="pill-badge blue" style={{ fontSize: '0.75rem' }}>
                        {id.tool}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
                        {id.accountHandle}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        {id.accountEmail || id.accountDisplayName}
                      </div>
                    </td>
                    <td>
                      {matchedAssoc ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={matchedAssoc.avatar} alt={matchedAssoc.name} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{matchedAssoc.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{matchedAssoc.email}</div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 500 }}>
                            <AlertTriangle size={14} /> Unassigned Orphan
                          </span>
                          {suggested && (
                            <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                              Suggested: <strong>{suggested.associate.name}</strong> ({suggested.matchReason}, {suggested.confidence}%)
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar-container" style={{ width: '60px', height: '6px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${id.confidenceScore}%`,
                              background: id.confidenceScore >= 90 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {id.confidenceScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      {id.status === 'matched' && (
                        <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>
                          <CheckCircle size={12} /> Auto Matched
                        </span>
                      )}
                      {id.status === 'manual_override' && (
                        <span className="pill-badge purple" style={{ fontSize: '0.72rem' }}>
                          <ShieldCheck size={12} /> Manual Override
                        </span>
                      )}
                      {id.status === 'unmatched' && (
                        <span className="pill-badge amber" style={{ fontSize: '0.72rem' }}>
                          <AlertTriangle size={12} /> Unresolved
                        </span>
                      )}
                    </td>
                    <td>
                      {matchedAssoc ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUnlinkIdentity(id.id)}
                          title="Unlink identity and return to triage pool"
                        >
                          <Unlink size={13} /> Unlink
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {suggested && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleLinkIdentity(id.id, suggested.associate.id)}
                            >
                              Accept Match ({suggested.associate.name.split(' ')[0]})
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleLinkIdentity(id.id, associates[0].id)}
                          >
                            Assign...
                          </button>
                        </div>
                      )}
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
