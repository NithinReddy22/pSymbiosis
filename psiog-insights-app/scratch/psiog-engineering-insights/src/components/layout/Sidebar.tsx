import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home, User, FolderKanban, BarChart2, Sparkles,
  Database, Building2, ShieldCheck, Settings,
  HelpCircle, Sliders, Tag, TrendingUp, LucideIcon,
} from 'lucide-react';
import { findUnmatchedActivities } from '../../services/identityResolution';

const PsiogWordmark: React.FC = () => (
  <span className="sidebar-logo-text">
    <span className="t">psi</span><span className="l">og</span>
  </span>
);

export const Sidebar: React.FC = () => {
  const {
    activeTab, setActiveTab, userRole,
    identities, tickets, prs, reviews, tests, docs, allReports,
  } = useApp();

  const orphanCount = findUnmatchedActivities(identities, tickets, prs, reviews, tests, docs).length;
  const alertCount = allReports.reduce((s, r) => s + r.antiGamingFlags.length, 0);

  const isEngineer = userRole === 'Engineer';
  const isLead = userRole === 'Lead' || userRole === 'Delivery Head' || userRole === 'Admin';
  const isHead = userRole === 'Delivery Head' || userRole === 'Admin';

  type NavItem = {
    id: string;
    label: string;
    icon: LucideIcon;
    badge?: string;
    badgeAlert?: boolean;
    show?: boolean;
  };

  const mainNav: NavItem[] = [
    { id: 'home',      label: 'Home',           icon: Home,        show: true },
    { id: 'associate', label: 'My Performance',  icon: User,        show: true },
    { id: 'project',   label: 'Projects',        icon: FolderKanban, show: isLead },
    { id: 'overview',  label: 'Reports',         icon: BarChart2,   show: isHead },
    { id: 'delivery',  label: 'Service Delivery', icon: TrendingUp,  show: isLead },
    { id: 'ai-insights', label: 'AI Insights',   icon: Sparkles,
      badge: alertCount > 0 ? `${alertCount}` : undefined,
      badgeAlert: true, show: true },
  ];

  const adminNav: NavItem[] = [
    { id: 'jira',         label: 'Jira Summary',        icon: Tag,           show: true },
    { id: 'connectors',   label: 'Data & Integrations', icon: Database,      show: isHead },
    { id: 'identity',     label: 'Organization',        icon: Building2,
      badge: orphanCount > 0 ? `${orphanCount}` : undefined, show: isLead },
    { id: 'models',       label: 'Performance Model',   icon: Sliders,       show: isHead },
    { id: 'identity',     label: 'Users & Access',      icon: ShieldCheck,   show: isHead },
    { id: 'manual-data',  label: 'Settings',            icon: Settings,      show: true },
  ];

  const visibleMain  = mainNav.filter(i => i.show !== false);
  const visibleAdmin = adminNav.filter(i => i.show !== false);
  const showAdmin    = visibleAdmin.length > 0;

  const NavBtn: React.FC<Omit<NavItem, 'show'>> = ({ id, label, icon: Icon, badge, badgeAlert }) => (
    <button
      className={`nav-item ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <Icon size={17} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span className={`nav-badge${badgeAlert ? ' alert' : ''}`}>{badge}</span>
      )}
    </button>
  );

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <PsiogWordmark />
      </div>

      {/* Main nav */}
      <nav className="sidebar-nav">
        {visibleMain.map(item => <NavBtn key={item.id + item.label} {...item} />)}

        {/* Admin section */}
        {showAdmin && (
          <>
            <div className="nav-section-title">Admin</div>
            {visibleAdmin.map(item => <NavBtn key={item.id + item.label} {...item} />)}
          </>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Help at bottom */}
        <div className="sidebar-footer" style={{ marginTop: '8px' }}>
          <button
            className="nav-item"
            style={{ color: 'var(--text-dim)' }}
            onClick={() => {/* no-op */}}
          >
            <HelpCircle size={17} />
            <span>Help &amp; Support</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
