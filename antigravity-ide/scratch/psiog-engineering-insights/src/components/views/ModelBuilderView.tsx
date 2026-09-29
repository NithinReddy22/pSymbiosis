import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Persona, Offering, PerformanceModelVersion } from '../../types';
import {
  Sliders,
  BookOpen,
  History,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Scale,
  Sparkles
} from 'lucide-react';

export const ModelBuilderView: React.FC = () => {
  const { models, activeModel, updateModelWeights } = useApp();

  const [selectedPersona, setSelectedPersona] = useState<Persona>('Senior Engineer');
  const [selectedOffering, setSelectedOffering] = useState<Offering>('Cloud & DevOps');
  const [weights, setWeights] = useState({ ...activeModel.weightsByPersona[selectedPersona] });
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const personas: Persona[] = ['Engineer', 'Senior Engineer', 'Lead'];
  const offerings: Offering[] = ['Cloud & DevOps', 'Fullstack Web & Mobile', 'QA & Test Automation', 'Data & AI'];

  const handlePersonaChange = (p: Persona) => {
    setSelectedPersona(p);
    setWeights({ ...activeModel.weightsByPersona[p] });
  };

  const handleWeightChange = (dimension: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [dimension]: value }));
  };

  const totalWeightPercent = Math.round(
    (weights.delivery + weights.quality + weights.review + weights.documentation + weights.reliability) * 100
  );

  const handleSaveModel = () => {
    const updated: PerformanceModelVersion = {
      ...activeModel,
      weightsByPersona: {
        ...activeModel.weightsByPersona,
        [selectedPersona]: weights
      }
    };
    updateModelWeights(updated);
    setSaveFeedback('Model weights updated and saved to version ' + activeModel.versionId);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const currentBenchmark = activeModel.benchmarksByOffering[selectedOffering]?.[selectedPersona];

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Sliders size={24} color="var(--accent-primary-light)" />
            Performance Model Configuration & Versioning
          </h1>
          <p className="section-desc">
            Define, calibrate, and version standard evaluation weights and benchmarks per persona, offering, and project
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill-badge green">Active: {activeModel.versionId}</span>
        </div>
      </div>

      {/* Model Versioning History Banner (Criteria 8) */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <History size={20} color="var(--accent-primary-light)" />
          <div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
              Model Immutability & Version Snapshots
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Historical evaluations preserve the exact model version active at that time (e.g. 2025 vs 2026).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {models.map(m => (
            <span
              key={m.versionId}
              className={`pill-badge ${m.isActive ? 'green' : 'blue'}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              {m.versionId} ({m.name.split('(')[0].trim()}) {m.isActive ? '• Active' : '• Archived'}
            </span>
          ))}
        </div>
      </div>

      {/* Rationale Documentation & Weight Calibration Grid */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Dimension Weights Calibrator */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Calibrate Dimension Weights</h3>
            <span className={`pill-badge ${totalWeightPercent === 100 ? 'green' : 'amber'}`}>
              Sum: {totalWeightPercent}% / 100%
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {personas.map(p => (
              <button
                key={p}
                className={`btn btn-sm ${selectedPersona === p ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handlePersonaChange(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Delivery Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: '#fff' }}>Velocity & Delivery Throughput</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary-light)' }}>
                  {Math.round(weights.delivery * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                value={weights.delivery}
                onChange={e => handleWeightChange('delivery', parseFloat(e.target.value))}
              />
            </div>

            {/* Quality Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: '#fff' }}>Code Quality & Low Rework</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {Math.round(weights.quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                value={weights.quality}
                onChange={e => handleWeightChange('quality', parseFloat(e.target.value))}
              />
            </div>

            {/* Review Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: '#fff' }}>Peer Code Review Rigor</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {Math.round(weights.review * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                value={weights.review}
                onChange={e => handleWeightChange('review', parseFloat(e.target.value))}
              />
            </div>

            {/* Documentation Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: '#fff' }}>Architecture & Documentation</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                  {Math.round(weights.documentation * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                value={weights.documentation}
                onChange={e => handleWeightChange('documentation', parseFloat(e.target.value))}
              />
            </div>

            {/* Reliability Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: '#fff' }}>Operational Reliability</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {Math.round(weights.reliability * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                value={weights.reliability}
                onChange={e => handleWeightChange('reliability', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {saveFeedback && (
            <div className="pill-badge green" style={{ width: '100%', margin: '14px 0 0', justifyContent: 'center' }}>
              <CheckCircle size={14} /> {saveFeedback}
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleSaveModel}>
            Save Weights Calibration
          </button>
        </div>

        {/* Documented Rationale (Criteria 5: Teams document the model and the reasoning behind it) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <BookOpen size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Documented Model Rationale</h3>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '0.84rem',
            lineHeight: 1.6,
            color: 'var(--text-main)',
            maxHeight: '340px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: 'var(--accent-primary-light)', marginBottom: '6px' }}>1. Persona Calibration Philosophy</h4>
            <p style={{ marginBottom: '10px', color: 'var(--text-muted)' }}>
              • <strong>Engineers</strong> focus heavily on direct delivery (35%) and quality (30%).<br />
              • <strong>Senior Engineers</strong> balance execution with high-leverage code reviews (25%) and design specifications (15%).<br />
              • <strong>Leads</strong> emphasize team unblocking, architecture governance (25%), and peer review rigor (30%).
            </p>

            <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '6px' }}>2. Anti-Single-Metric Enforcement</h4>
            <p style={{ marginBottom: '10px', color: 'var(--text-muted)' }}>
              No single count, such as raw commits or lines of code, can independently drive more than 15% of the score. High commit volumes are verified against substantive changes and review rigor.
            </p>

            <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '6px' }}>3. Fairness & Capacity Normalization</h4>
            <p style={{ color: 'var(--text-muted)' }}>
              Active working days and approved manager context notes (e.g. parental leave, on-call duty) dynamically scale down monthly benchmark expectations so engineers are evaluated on a fair playing field.
            </p>
          </div>
        </div>
      </div>

      {/* Calibrated Benchmarks Table per Offering */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Practice Offering Target Benchmarks</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Domain-specific monthly targets per persona to reflect varying deliverable types
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {offerings.map(off => (
              <button
                key={off}
                className={`btn btn-sm ${selectedOffering === off ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedOffering(off)}
              >
                {off}
              </button>
            ))}
          </div>
        </div>

        {currentBenchmark && (
          <div className="grid-3">
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Delivery Velocity:</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {currentBenchmark.expectedStoryPointsPerMonth} Story Pts / mo
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Target PRs: {currentBenchmark.expectedMergedPRsPerMonth} merged PRs / mo
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Review Rigor & Quality:</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {currentBenchmark.expectedReviewsPerPR} Reviews per PR
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Max Bug Leak Rate: &lt;{currentBenchmark.maxBugLeakRatePercent}%
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Architecture & Documentation:</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {currentBenchmark.expectedDocsPerQuarter} Tech Docs / quarter
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                ADRs, Tech Specs, Knowledge Base
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
