import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManagerContextNote } from '../../types';
import { X, Calendar, FileText, Percent, UserCheck } from 'lucide-react';

interface ContextNoteModalProps {
  associateId: string;
  projectId: string;
  onClose: () => void;
}

export const ContextNoteModal: React.FC<ContextNoteModalProps> = ({ associateId, projectId, onClose }) => {
  const { addContextNote, associates, activeAssociate } = useApp();
  const targetAssociate = associates.find(a => a.id === associateId);

  const [category, setCategory] = useState<ManagerContextNote['category']>('Leave');
  const [impactDays, setImpactDays] = useState<number>(5);
  const [description, setDescription] = useState<string>('');
  const [adjustmentPercent, setAdjustmentPercent] = useState<number>(-15);

  const handleCategoryChange = (cat: ManagerContextNote['category']) => {
    setCategory(cat);
    if (cat === 'Leave') setAdjustmentPercent(-20);
    else if (cat === 'Onboarding') setAdjustmentPercent(-25);
    else if (cat === 'On-Call Firefighting') setAdjustmentPercent(-15);
    else if (cat === 'Special R&D Assignment') setAdjustmentPercent(0);
    else setAdjustmentPercent(-10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addContextNote({
      associateId,
      projectId,
      authorId: activeAssociate?.id || 'MGR-DEFAULT',
      authorName: activeAssociate ? `${activeAssociate.name} (${activeAssociate.title})` : 'Manager',
      periodLabel: 'Q1 2026',
      category,
      impactDays: Number(impactDays),
      description: description.trim(),
      baselineAdjustmentPercent: Number(adjustmentPercent)
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-icon emerald" style={{ width: '38px', height: '38px' }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Add Manager Context Note</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Apply fair baseline adjustments for {targetAssociate?.name}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Context Category</label>
              <select
                className="form-control"
                value={category}
                onChange={e => handleCategoryChange(e.target.value as any)}
              >
                <option value="Leave">Approved Leave (Parental, Medical, Annual)</option>
                <option value="On-Call Firefighting">24/7 Production On-Call & Firefighting</option>
                <option value="Onboarding">New Hire / Transfer Onboarding Ramp-up</option>
                <option value="Special R&D Assignment">Dedicated R&D Architecture Spike</option>
                <option value="Mentorship">Intensive Junior Engineer Mentorship</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Duration Impact (Working Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="form-control"
                  value={impactDays}
                  onChange={e => setImpactDays(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Baseline Target Scaling (% adjustment)</label>
                <input
                  type="number"
                  min="-80"
                  max="50"
                  className="form-control"
                  value={adjustmentPercent}
                  onChange={e => setAdjustmentPercent(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  e.g., -20% lowers expected story point quota by 20%
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Context Explanation & Justification</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Explain the background reason (e.g. 2 weeks paternity leave approved by HR, or sole on-call responder during cloud gateway migration)..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Context Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
