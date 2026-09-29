import React, { useState } from 'react';
import { useApp, DatePeriod } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Search, Calendar, Bell, ChevronDown, RefreshCw, Check } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    userRole, setUserRole, currentUserId, setCurrentUserId,
    associates, activeAssociate, selectedPeriod, setSelectedPeriod, triggerSync,
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');

  const periods: DatePeriod[] = [
    { start: '2026-10-01', end: '2026-12-31', label: 'Oct 1, 2026 – Dec 31, 2026' },
    { start: '2026-07-01', end: '2026-09-30', label: 'Jul 1, 2026 – Sep 30, 2026' },
    { start: '2026-01-01', end: '2026-03-31', label: 'Jan 1, 2026 – Mar 31, 2026' },
    { start: '2025-10-01', end: '2025-12-31', label: 'Oct 1, 2025 – Dec 31, 2025' },
  ];

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'Engineer') setCurrentUserId('A004');
    else if (role === 'Lead') setCurrentUserId('A003');
    else setCurrentUserId('A006');
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const res = triggerSync();
      setIsSyncing(false);
      setSyncFeedback(`+${res.inserted} synced`);
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 800);
  };

  /* Initials for avatar */
  const initials = activeAssociate
    ? activeAssociate.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    : 'NR';

  return (
    <header className="top-header">
      {/* Search */}
      <div className="header-left">
        <div className="header-search">
          <Search size={15} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search for projects, tickets, people..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </div>

        {/* Sync feedback */}
        {syncFeedback && (
          <span className="pill-badge green fade-in">
            <Check size={11} /> {syncFeedback}
          </span>
        )}
      </div>

      {/* Right controls */}
      <div className="header-right">
        {/* Role switcher — kept for demo */}
        <div className="role-switcher-card" style={{ gap: '6px' }}>
          <select
            className="role-select"
            value={userRole}
            onChange={e => handleRoleChange(e.target.value as UserRole)}
            style={{ fontSize: '0.8rem' }}
          >
            <option value="Engineer">Engineer</option>
            <option value="Lead">Lead</option>
            <option value="Delivery Head">Delivery Head</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Sync button */}
        <button className="btn btn-secondary btn-sm" onClick={handleSync} disabled={isSyncing}>
          <RefreshCw size={13} className={isSyncing ? 'spin-animation' : ''} />
        </button>

        {/* Date range */}
        <div className="header-date-btn">
          <Calendar size={14} color="var(--text-muted)" />
          <select
            style={{ background: 'transparent', border: 'none', outline: 'none',
              fontSize: '0.84rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}
            value={selectedPeriod.label}
            onChange={e => {
              const p = periods.find(x => x.label === e.target.value);
              if (p) setSelectedPeriod(p);
            }}
          >
            {periods.map(p => (
              <option key={p.label} value={p.label}>{p.label}</option>
            ))}
          </select>
          <ChevronDown size={13} color="var(--text-muted)" />
        </div>

        {/* Notification bell */}
        <div className="header-icon-btn">
          <Bell size={16} />
          <span className="header-notif-dot" />
        </div>

        {/* User */}
        <div className="header-user">
          <div className="header-avatar">{initials}</div>
          <div>
            <div className="header-user-name">{activeAssociate?.name ?? 'Nithin Reddy'}</div>
            <div className="header-user-role">{activeAssociate?.title ?? userRole}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
