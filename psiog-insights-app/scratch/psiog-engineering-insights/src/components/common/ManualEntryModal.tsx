import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManualDataEntry } from '../../types';
import { X, PlusCircle, Edit3, ShieldAlert } from 'lucide-react';

interface ManualEntryModalProps {
  associateId: string;
  projectId: string;
  onClose: () => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ associateId, projectId, onClose }) => {
  const { addManualEntry, associates, projects, activeAssociate } = useApp();
  const targetAssociate = associates.find(a => a.id === associateId);
  const targetProject = projects.find(p => p.id === projectId);

  const [dimension, setDimension] = useState<ManualDataEntry['dimension']>('Delivery');
  const [metricName, setMetricName] = useState<string>('');
  const [value, setValue] = useState<number>(5);
  const [unit, setUnit] = useState<string>('Story Points');
  const [reason, setReason] = useState<string>('');

  const handleDimensionChange = (dim: ManualDataEntry['dimension']) => {
    setDimension(dim);
    if (dim === 'Delivery') setUnit('Story Points');
    else if (dim === 'Quality') setUnit('Test Cases / Defect Fixes');
    else if (dim === 'Review') setUnit('Substantive Reviews');
    else if (dim === 'Documentation') setUnit('Technical Specs / Whitepapers');
    else setUnit('Operational Incidents Resolved');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim() || !reason.trim()) return;

    addManualEntry({
      associateId,
      projectId,
      dimension,
      metricName: metricName.trim(),
      value: Number(value),
      unit,
      reason: reason.trim(),
      enteredBy: activeAssociate ? activeAssociate.name : 'Authorized Manager',
      isOverride: false
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-icon indigo" style={{ width: '38px', height: '38px' }}>
              <Edit3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Add Manual Metric / Overlay</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Non-destructive data entry for {targetAssociate?.name} on {targetProject?.name}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} color="var(--accent-primary-light)" style={{ flexShrink: 0 }} />
              <span>
                <strong>Audit Compliance:</strong> Manual entries never overwrite raw source records. They are tagged as <code>[MANUAL OVERLAY]</code> with your signature and timestamp.
              </span>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Dimension</label>
                <select
                  className="form-control"
                  value={dimension}
                  onChange={e => handleDimensionChange(e.target.value as any)}
                >
                  <option value="Delivery">Delivery & Throughput</option>
                  <option value="Quality">Code Quality & Testing</option>
                  <option value="Review">Code Review & Mentorship</option>
                  <option value="Documentation">Architecture & Documentation</option>
                  <option value="Reliability">Operational Reliability</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Metric Value</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="form-control"
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Metric Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Offline Architecture Spike, Security Audit"
                  value={metricName}
                  onChange={e => setMetricName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Units / Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Business Justification & Audit Reason</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Explain why this data is being added manually (e.g. Work performed on client tool that lacks API integration, or offline design spikes)..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Manual Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
