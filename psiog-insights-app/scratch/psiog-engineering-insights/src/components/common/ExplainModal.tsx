import React from 'react';
import { CalculatedPerformanceReport, Associate } from '../../types';
import { ScoreBadge } from './ScoreBadge';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Scale, Info, Sparkles, Rocket, Gem, Search, BookOpen, Shield } from 'lucide-react';

interface ExplainModalProps {
  report: CalculatedPerformanceReport;
  associate: Associate;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ report, associate, onClose }) => {
  const { dimensions, contextAdjustments, sparseDataWarning, tenureSegments, overallScore } = report;

  const dimensionList = [
    { key: 'delivery', name: 'Velocity & Delivery', detail: dimensions.delivery, Icon: Rocket, color: '#2DC4C2' },
    { key: 'quality', name: 'Code Quality & Stability', detail: dimensions.quality, Icon: Gem, color: '#4B9EF8' },
    { key: 'review', name: 'Code Review & Rigor', detail: dimensions.review, Icon: Search, color: '#9b87f5' },
    { key: 'documentation', name: 'Architecture & Documentation', detail: dimensions.documentation, Icon: BookOpen, color: '#C5D000' },
    { key: 'reliability', name: 'Operational Reliability', detail: dimensions.reliability, Icon: Shield, color: '#f59e0b' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon indigo" style={{ width: '40px', height: '40px' }}>
              <Scale size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Formula Transparency & Explainability</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Mathematical breakdown of {associate.name}'s {report.periodLabel} evaluation
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Overall Composite Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary-light)', fontWeight: 600 }}>
                Composite Weighted Score
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {overallScore}/100 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>({report.ratingBand})</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                No single activity metric can dominate the score. Formulated across 5 core dimensions calibrated by role tenure.
              </p>
            </div>
            <ScoreBadge score={overallScore} size="lg" />
          </div>

          {/* Context Notes & Normalization Notice */}
          {contextAdjustments.notesApplied.length > 0 && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <ShieldCheck size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                  Fairness Context Adjustments Applied ({contextAdjustments.notesApplied.length} manager notes)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {contextAdjustments.totalLeaveDays > 0 && `• ${contextAdjustments.totalLeaveDays} approved leave days scaled the delivery expectations down to avoid penalizing time off.\n`}
                  {contextAdjustments.totalOnCallDays > 0 && `• ${contextAdjustments.totalOnCallDays} days of on-call firefighting credited directly toward Operational Reliability.\n`}
                </div>
              </div>
            </div>
          )}

          {/* Sparse Data Warning if applicable */}
          {sparseDataWarning && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <AlertTriangle size={18} color="var(--accent-amber)" />
              <div style={{ fontSize: '0.82rem', color: '#92400e' }}>
                <strong>Sparse Data Notice:</strong> {sparseDataWarning.reason} (Margin of error {sparseDataWarning.confidenceInterval}).
              </div>
            </div>
          )}

          {/* Dimension by Dimension Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dimension Formula Breakdown
            </h4>

            {dimensionList.map(dim => {
              const weightPercent = Math.round(dim.detail.weight * 100);
              const weightedContribution = ((dim.detail.score * dim.detail.weight)).toFixed(1);

              return (
                <div key={dim.key} style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <dim.Icon size={16} color={dim.color} />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{dim.name}</span>
                      <span className="pill-badge blue" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        Weight: {weightPercent}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Contribution: <strong>+{weightedContribution} pts</strong>
                      </span>
                      <ScoreBadge score={dim.detail.score} size="sm" />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {dim.detail.explanation}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px',
                    background: 'var(--bg-input)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Benchmark:</span>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{dim.detail.benchmarkTarget}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase' }}>Raw Activity Metrics:</span>
                      <div style={{ color: 'var(--accent-primary-light)', fontFamily: 'JetBrains Mono' }}>
                        {Object.entries(dim.detail.rawMetrics).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tenure Segmentation Note */}
          {tenureSegments.length > 1 && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px'
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Time-Bound Role Attribution Across Period:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {tenureSegments.map((seg, idx) => (
                  <div key={idx}>
                    • <strong>{seg.startDate} to {seg.endDate}</strong>: {seg.projectName} as <em>{seg.role}</em> ({seg.activeCalendarDays} calendar days, {seg.effectiveWorkingDays} effective days at {seg.allocationPercentage}% capacity)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
