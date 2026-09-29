import React, { useState } from 'react';
import { useApp, DatePeriod } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Calendar, RefreshCw, Shield, User, Check, Sparkles, BookOpen } from 'lucide-react';
import { CriteriaGuideModal } from '../common/CriteriaGuideModal';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    currentUserId,
    setCurrentUserId,
    associates,
    activeAssociate,
    selectedPeriod,
    setSelectedPeriod,
    triggerSync
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const periods: DatePeriod[] = [
    { start: '2026-01-01', end: '2026-03-31', label: 'Q1 2026 (Active Period)' },
    { start: '2025-10-01', end: '2025-12-31', label: 'Q4 2025 (Historical)' },
    { start: '2025-01-01', end: '2025-12-31', label: 'Full Year 2025' }
  ];

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    // Automatically switch active user to match the persona role for demo convenience
    if (role === 'Engineer') {
      setCurrentUserId('A004'); // Elena Rostova (Engineer)
    } else if (role === 'Lead') {
      setCurrentUserId('A003'); // Marcus Chen (Lead)
    } else if (role === 'Delivery Head') {
      setCurrentUserId('A006'); // Sarah Jenkins (VP Delivery)
    }
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const res = triggerSync();
      setIsSyncing(false);
      setSyncFeedback(`Delta sync complete: +${res.inserted} new events`);
      setTimeout(() => setSyncFeedback(null), 3500);
    }, 800);
  };

  return (
    <header className="top-header">
      <div className="header-left">
        {/* Period Selector (Criteria 7) */}
        <div className="period-selector">
          <Calendar size={15} color="var(--accent-primary-light)" />
          <select
            className="role-select"
            value={selectedPeriod.label}
            onChange={e => {
              const p = periods.find(item => item.label === e.target.value);
              if (p) setSelectedPeriod(p);
            }}
          >
            {periods.map(p => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Delta Sync Button (Criteria 8) */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleSyncNow}
          disabled={isSyncing}
          title="Incremental delta sync across JIRA, Azure DevOps, Git, TestRail, SharePoint"
        >
          <RefreshCw size={14} className={isSyncing ? 'spin-animation' : ''} />
          <span>{isSyncing ? 'Syncing...' : 'Incremental Sync'}</span>
        </button>

        {syncFeedback && (
          <span className="pill-badge green" style={{ animation: 'fadeIn 0.2s ease' }}>
            <Check size={12} /> {syncFeedback}
          </span>
        )}
      </div>

      <div className="header-right">
        {/* RBAC Role Switcher (Criteria 10) */}
        <div className="role-switcher-card">
          <Shield size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Role:</span>
          <select
            className="role-select"
            value={userRole}
            onChange={e => handleRoleChange(e.target.value as UserRole)}
          >
            <option value="Engineer">Engineer (Self View)</option>
            <option value="Lead">Lead (Team & Project)</option>
            <option value="Delivery Head">Delivery Head (Organization)</option>
            <option value="Admin">Admin (Full Control)</option>
          </select>
        </div>

        {/* Criteria Guide Walkthrough Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowGuide(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} color="var(--accent-cyan)" />
          <span>11-Criteria Tour</span>
        </button>

        {/* User Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeAssociate && (
            <>
              <img
                src={activeAssociate.avatar}
                alt={activeAssociate.name}
                className="role-avatar"
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {activeAssociate.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {activeAssociate.title}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {showGuide && <CriteriaGuideModal onClose={() => setShowGuide(false)} />}
    </header>
  );
};
