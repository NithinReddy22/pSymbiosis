import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  Fingerprint,
  Sliders,
  Scale,
  ShieldAlert,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

interface CriteriaGuideModalProps {
  onClose: () => void;
}

export const CriteriaGuideModal: React.FC<CriteriaGuideModalProps> = ({ onClose }) => {
  const { setActiveTab, setUserRole, setSelectedAssociateId, setSelectedProjectId, triggerSync } = useApp();

  const criteria = [
    {
      num: 1,
      title: 'Connect & Ingestion',
      desc: 'Connectors to JIRA, Azure DevOps, Git, TestRail, SharePoint. No-code field mapping schema & JSON/CSV offline import.',
      actionLabel: 'View Connectors & Schema',
      action: () => {
        setActiveTab('connectors');
        onClose();
      }
    },
    {
      num: 2,
      title: 'Manual Entry & Non-Destructive Overlays',
      desc: 'Add/edit data on top of integrations with author signatures and timestamps. Never silently overwrites raw source data.',
      actionLabel: 'View Manual Audit Log',
      action: () => {
        setActiveTab('manual-data');
        onClose();
      }
    },
    {
      num: 3,
      title: 'Organisation & Time-Bound Attribution',
      desc: 'Mid-period movers (e.g. Alex Rivera: FinTech Core Sr. Eng Jan-Feb -> HealthCare Portal Lead Mar). Activity mapped to role held on timestamp.',
      actionLabel: 'Inspect Alex Rivera Tenure',
      action: () => {
        setSelectedAssociateId('A001');
        setActiveTab('associate');
        onClose();
      }
    },
    {
      num: 4,
      title: 'Identity Resolution & Orphan Triage',
      desc: 'Unified account graph linking disparate handles. Unmatched activity triage queue for orphan PRs, tickets, and test runs.',
      actionLabel: 'Inspect Identity Triage',
      action: () => {
        setActiveTab('identity');
        onClose();
      }
    },
    {
      num: 5,
      title: 'Configurable Performance Model',
      desc: 'Multi-dimensional weights (Delivery, Quality, Review, Docs, Reliability) calibrated by Persona & Offering with documented rationale.',
      actionLabel: 'Explore Model Weights',
      action: () => {
        setActiveTab('models');
        onClose();
      }
    },
    {
      num: 6,
      title: 'Fair & Explainable Scoring',
      desc: 'Step-by-step formula breakdown, capacity normalization by active working days, manager context notes (leave, on-call), anti-single-metric guardrails.',
      actionLabel: 'Open Associate View',
      action: () => {
        setSelectedAssociateId('A001');
        setActiveTab('associate');
        onClose();
      }
    },
    {
      num: 7,
      title: 'Reporting & Deep Drilldown',
      desc: 'Executive, Project, and Associate views with drilldowns to underlying tickets, pull requests, reviews, test runs, and SharePoint docs.',
      actionLabel: 'View Project Drilldown',
      action: () => {
        setSelectedProjectId('PROJ-ALPHA');
        setActiveTab('project');
        onClose();
      }
    },
    {
      num: 8,
      title: 'Incremental Sync & Version History',
      desc: 'Watermark tracking, incremental delta refresh, and immutable model version snapshots (v2.1 active vs v1.0 archived).',
      actionLabel: 'Trigger Delta Sync',
      action: () => {
        triggerSync();
        setActiveTab('connectors');
        onClose();
      }
    },
    {
      num: 9,
      title: 'AI Insights & Anti-Gaming Engine',
      desc: 'Plain-English performance narrative, heuristic anti-gaming detection (micro-commits, self-approved PRs, superficial reviews), conversational AI.',
      actionLabel: 'Inspect AI & Anti-Gaming',
      action: () => {
        setActiveTab('ai-insights');
        onClose();
      }
    },
    {
      num: 10,
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Engineer (self-view only), Lead (team/project view), Delivery Head (organization view), Admin (full configuration).',
      actionLabel: 'Test Role Switcher',
      action: () => {
        setUserRole('Engineer');
        setActiveTab('associate');
        onClose();
      }
    },
    {
      num: 11,
      title: 'Comprehensive Multi-Offering Seed Data',
      desc: '4 projects across 4 practice offerings, associates with varying tool identities, and mid-period role changers.',
      actionLabel: 'View Executive Dashboard',
      action: () => {
        setUserRole('Delivery Head');
        setActiveTab('overview');
        onClose();
      }
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-icon indigo" style={{ width: '40px', height: '40px' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>11 Acceptance Criteria Interactive Verification Guide</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Click 'Jump to Feature' on any criterion to verify its end-to-end implementation in Psiog Pulse
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '65vh', overflowY: 'auto' }}>
          {criteria.map(c => (
            <div
              key={c.num}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  {c.num}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{c.desc}</div>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ flexShrink: 0, fontSize: '0.78rem' }}
                onClick={c.action}
              >
                {c.actionLabel} <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
