import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveOverview } from './components/views/ExecutiveOverview';
import { ProjectView } from './components/views/ProjectView';
import { AssociateView } from './components/views/AssociateView';
import { IdentityResolutionView } from './components/views/IdentityResolutionView';
import { ConnectorsView } from './components/views/ConnectorsView';
import { ManualDataAuditView } from './components/views/ManualDataAuditView';
import { ModelBuilderView } from './components/views/ModelBuilderView';
import { AIInsightsView } from './components/views/AIInsightsView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, userRole } = useApp();

  // Role based access guardrail: If an Engineer is on an admin/lead tab, bounce back to associate view
  useEffect(() => {
    if (userRole === 'Engineer') {
      const allowed = ['associate', 'manual-data', 'ai-insights'];
      if (!allowed.includes(activeTab)) {
        setActiveTab('associate');
      }
    } else if (userRole === 'Lead') {
      const allowed = ['project', 'associate', 'identity', 'manual-data', 'ai-insights'];
      if (!allowed.includes(activeTab)) {
        setActiveTab('project');
      }
    }
  }, [userRole, activeTab, setActiveTab]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main>
          {activeTab === 'overview' && <ExecutiveOverview />}
          {activeTab === 'project' && <ProjectView />}
          {activeTab === 'associate' && <AssociateView />}
          {activeTab === 'identity' && <IdentityResolutionView />}
          {activeTab === 'connectors' && <ConnectorsView />}
          {activeTab === 'manual-data' && <ManualDataAuditView />}
          {activeTab === 'models' && <ModelBuilderView />}
          {activeTab === 'ai-insights' && <AIInsightsView />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
