import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolType, ConnectorConfig } from '../../types';
import {
  Cpu,
  RefreshCw,
  UploadCloud,
  FileCode,
  CheckCircle,
  AlertCircle,
  Database,
  SlidersHorizontal,
  History,
  Check,
  Code
} from 'lucide-react';

export const ConnectorsView: React.FC = () => {
  const {
    connectors,
    syncLogs,
    triggerSync,
    updateConnectorMappings,
    importExternalData,
    projects
  } = useApp();

  const [activeTool, setActiveTool] = useState<ToolType>('JIRA');
  const [editingMappings, setEditingMappings] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importProjectId, setImportProjectId] = useState<string>(projects[0]?.id || 'PROJ-ALPHA');
  const [importResultStatus, setImportResultStatus] = useState<string | null>(null);

  const selectedConnector = connectors.find(c => c.tool === activeTool) || connectors[0];

  const handleStartEdit = () => {
    setEditingMappings({ ...selectedConnector.fieldMappings });
    setIsEditing(true);
  };

  const handleSaveMappings = () => {
    updateConnectorMappings(activeTool, editingMappings);
    setIsEditing(false);
  };

  const handleRunSyncForTool = (tool: ToolType) => {
    triggerSync(tool);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    const res = importExternalData(activeTool, importJsonText, importProjectId);
    setImportResultStatus(res.message);
    setImportJsonText('');
    setTimeout(() => setImportResultStatus(null), 4000);
  };

  const sampleJsonFormats: Record<ToolType, string> = {
    'JIRA': JSON.stringify([
      {
        "ticketKey": "FCP-420",
        "title": "Implement multi-region database transaction coordinator",
        "type": "Story",
        "status": "Done",
        "storyPoints": 8,
        "authorToolId": "alex.rivera@psiog.com",
        "resolvedAt": "2026-03-24T12:00:00Z",
        "cycleTimeHours": 32,
        "reworkCount": 0
      }
    ], null, 2),
    'Azure DevOps': JSON.stringify([
      {
        "ticketKey": "HPP-1100",
        "title": "Patient biometric authentication SSO flow",
        "type": "Story",
        "status": "Done",
        "storyPoints": 5,
        "authorToolId": "elena.rostova@clienthealth.org",
        "resolvedAt": "2026-03-22T15:00:00Z",
        "cycleTimeHours": 28,
        "reworkCount": 0
      }
    ], null, 2),
    'Git': JSON.stringify([
      {
        "repo": "psiog/core-gateway",
        "prNumber": 512,
        "title": "feat(grpc): Streaming protobuf endpoint for real-time telemetry",
        "authorToolId": "alex-rivera-dev",
        "linesAdded": 310,
        "linesDeleted": 45,
        "commitCount": 3,
        "status": "Merged",
        "turnaroundHours": 24.5
      }
    ], null, 2),
    'TestRail': JSON.stringify([
      {
        "suiteName": "Regression 2026-Q1",
        "testCaseKey": "TC-882",
        "title": "Validate OAuth token refresh with invalid client secret",
        "testerToolId": "psharma_qa",
        "result": "Passed",
        "isAutomated": true,
        "executionDurationMinutes": 4.2
      }
    ], null, 2),
    'SharePoint': JSON.stringify([
      {
        "docType": "Architecture Decision Record",
        "title": "ADR-099: Zero-Trust Microservice Mutual TLS Migration",
        "authorToolId": "marcus.chen@psiog.com",
        "wordCount": 3100,
        "viewsCount": 180
      }
    ], null, 2)
  };

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Cpu size={24} color="var(--accent-primary-light)" />
            Connectors, Field Mappings & Ingestion Pipeline
          </h1>
          <p className="section-desc">
            Connect live enterprise tools (JIRA, Azure DevOps, Git, TestRail, SharePoint) or load manual exports with configurable field mapping
          </p>
        </div>
      </div>

      {/* 5 Connector Cards Grid (Criteria 1) */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        {connectors.map(conn => {
          const isSelected = conn.tool === activeTool;

          return (
            <div
              key={conn.id}
              className={`glass-card glass-card-interactive ${isSelected ? 'selected-border' : ''}`}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-primary-light)' : undefined,
                background: isSelected ? 'rgba(99, 102, 241, 0.08)' : undefined
              }}
              onClick={() => {
                setActiveTool(conn.tool);
                setIsEditing(false);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{conn.name}</h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Auth: {conn.authType}
                  </span>
                </div>
                <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>
                  <CheckCircle size={11} /> {conn.status}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px', fontFamily: 'JetBrains Mono', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conn.endpointUrl}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>{conn.recordsCount.toLocaleString()} Records</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunSyncForTool(conn.tool);
                  }}
                >
                  <RefreshCw size={12} /> Sync Delta
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Connector Management & Field Mappings (Criteria 1: Configurable without code changes) */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Field Mappings Schema Editor */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SlidersHorizontal size={18} color="var(--accent-primary-light)" />
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Field Mappings Schema: {selectedConnector.tool}
              </h3>
            </div>
            {!isEditing ? (
              <button className="btn btn-secondary btn-sm" onClick={handleStartEdit}>
                Modify Mappings
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleSaveMappings}>
                Save Changes
              </button>
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Map upstream tool fields (e.g. custom JIRA fields or Azure DevOps attributes) to standard Psiog performance metrics without redeploying code.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(isEditing ? editingMappings : selectedConnector.fieldMappings).map(([sourceKey, targetField]) => (
              <div
                key={sourceKey}
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
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Source Tool Field:</span>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: 'var(--accent-primary-light)' }}>
                    {sourceKey}
                  </div>
                </div>

                <div style={{ color: 'var(--text-dim)' }}>→</div>

                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Normalized Metric:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.82rem', padding: '4px 8px', height: 'auto' }}
                      value={targetField}
                      onChange={e => setEditingMappings({ ...editingMappings, [sourceKey]: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      {targetField}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Export File Importer (Criteria 1 & 2: where live API is limited or unavailable) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <UploadCloud size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              Import Offline Tool Exports ({selectedConnector.tool})
            </h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            When direct live APIs cannot be reached due to client firewall restrictions, drop or paste JSON/CSV exports below.
          </p>

          <form onSubmit={handleImportSubmit}>
            <div className="form-group">
              <label className="form-label">Target Project Attribution</label>
              <select
                className="form-control"
                value={importProjectId}
                onChange={e => setImportProjectId(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label">JSON Activity Payload</label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary-light)', fontSize: '0.74rem', cursor: 'pointer' }}
                  onClick={() => setImportJsonText(sampleJsonFormats[activeTool])}
                >
                  Load Sample Template
                </button>
              </div>
              <textarea
                className="form-control"
                style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem' }}
                rows={6}
                placeholder="Paste JSON array of activity objects here..."
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                required
              />
            </div>

            {importResultStatus && (
              <div className="pill-badge green" style={{ width: '100%', marginBottom: '12px', justifyContent: 'center' }}>
                <Check size={14} /> {importResultStatus}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <UploadCloud size={16} /> Parse & Ingest Export Records
            </button>
          </form>
        </div>
      </div>

      {/* Sync History & Watermark Log Table (Criteria 8) */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <History size={18} color="var(--accent-emerald)" />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Incremental Delta Sync Audit Log
          </h3>
        </div>

        <div className="table-container">
          <table className="psiog-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Sync Watermark Timestamp</th>
                <th>Records Fetched</th>
                <th>Delta Inserted</th>
                <th>Records Updated</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {syncLogs.slice(0, 8).map(log => (
                <tr key={log.id}>
                  <td>
                    <span className="pill-badge blue">{log.tool}</span>
                  </td>
                  <td>
                    <code>{new Date(log.syncTimestamp).toLocaleString()}</code>
                  </td>
                  <td>{log.recordsFetched}</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>+{log.recordsInserted}</span>
                  </td>
                  <td>{log.recordsUpdated}</td>
                  <td>{log.durationMs}ms</td>
                  <td>
                    <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
