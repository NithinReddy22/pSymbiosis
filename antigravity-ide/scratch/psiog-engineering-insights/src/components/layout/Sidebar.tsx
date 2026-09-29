import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderGit2,
  UserCheck,
  Fingerprint,
  Cpu,
  FileSpreadsheet,
  Sliders,
  Sparkles,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { findUnmatchedActivities } from '../../services/identityResolution';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    identities,
    tickets,
    prs,
    reviews,
    tests,
    docs,
    allReports
  } = useApp();

  // Count unmatched orphan activities
  const orphanActivities = findUnmatchedActivities(identities, tickets, prs, reviews, tests, docs);

  // Count total anti-gaming flags across reports
  const totalAntiGamingAlerts = allReports.reduce((sum, r) => sum + r.antiGamingFlags.length, 0);

  const navItems = [
    // Dashboards
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      roles: ['Delivery Head', 'Admin'],
      section: 'Dashboards'
    },
    {
      id: 'project',
      label: 'Project in Focus',
      icon: FolderGit2,
      roles: ['Lead', 'Delivery Head', 'Admin'],
      section: 'Dashboards'
    },
    {
      id: 'associate',
      label: userRole === 'Engineer' ? 'My Performance View' : 'Associate in Focus',
      icon: UserCheck,
      roles: ['Engineer', 'Lead', 'Delivery Head', 'Admin'],
      section: 'Dashboards'
    },

    // Platform Intelligence
    {
      id: 'ai-insights',
      label: 'AI & Anti-Gaming',
      icon: Sparkles,
      roles: ['Engineer', 'Lead', 'Delivery Head', 'Admin'],
      badge: totalAntiGamingAlerts > 0 ? `${totalAntiGamingAlerts} Alerts` : undefined,
      badgeAlert: true,
      section: 'Intelligence & Trust'
    },
    {
      id: 'identity',
      label: 'Identity Resolution',
      icon: Fingerprint,
      roles: ['Lead', 'Delivery Head', 'Admin'],
      badge: orphanActivities.length > 0 ? `${orphanActivities.length} Orphans` : undefined,
      section: 'Data Operations'
    },
    {
      id: 'connectors',
      label: 'Connectors & Mappings',
      icon: Cpu,
      roles: ['Delivery Head', 'Admin'],
      section: 'Data Operations'
    },
    {
      id: 'manual-data',
      label: 'Manual Entry & Audit',
      icon: FileSpreadsheet,
      roles: ['Engineer', 'Lead', 'Delivery Head', 'Admin'],
      section: 'Data Operations'
    },
    {
      id: 'models',
      label: 'Model Configuration',
      icon: Sliders,
      roles: ['Delivery Head', 'Admin'],
      section: 'Governance'
    }
  ];

  // Filter items visible to current role
  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  // Group by sections
  const sections = ['Dashboards', 'Intelligence & Trust', 'Data Operations', 'Governance'];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <div>
          <div className="brand-title">Psiog Pulse</div>
          <div className="brand-subtitle">Engineering Insights</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(secName => {
          const itemsInSec = visibleItems.filter(i => i.section === secName);
          if (itemsInSec.length === 0) return null;

          return (
            <div key={secName}>
              <div className="nav-section-title">{secName}</div>
              {itemsInSec.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`nav-badge ${item.badgeAlert ? 'alert' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
