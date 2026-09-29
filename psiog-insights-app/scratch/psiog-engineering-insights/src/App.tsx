import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomeView } from './components/views/HomeView';
import { ExecutiveOverview } from './components/views/ExecutiveOverview';
import { ProjectView } from './components/views/ProjectView';
import { AssociateView } from './components/views/AssociateView';
import { IdentityResolutionView } from './components/views/IdentityResolutionView';
import { ConnectorsView } from './components/views/ConnectorsView';
import { ManualDataAuditView } from './components/views/ManualDataAuditView';
import { ModelBuilderView } from './components/views/ModelBuilderView';
import { AIInsightsView } from './components/views/AIInsightsView';
import { JiraSummaryView } from './components/views/JiraSummaryView';
import { ServiceDeliveryView } from './components/views/ServiceDeliveryView';
import { DashboardView } from './components/views/DashboardView';
import { LoginPage } from './components/auth/LoginPage';
import { getSession, logout } from './services/authApi';

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { activeTab, setActiveTab, userRole } = useApp();

  useEffect(() => {
    if (userRole === 'Engineer') {
      const allowed = ['home', 'dashboard', 'associate', 'manual-data', 'ai-insights', 'jira'];
      if (!allowed.includes(activeTab)) setActiveTab('home');
    } else if (userRole === 'Lead') {
      const allowed = ['home', 'dashboard', 'project', 'associate', 'identity', 'manual-data', 'ai-insights', 'jira', 'delivery'];
      if (!allowed.includes(activeTab)) setActiveTab('home');
    }
  }, [userRole, activeTab, setActiveTab]);

  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-area">
        <Header />
        <main>
          {activeTab === 'home'        && <HomeView />}
          {activeTab === 'dashboard'   && <DashboardView />}
          {activeTab === 'overview'    && <ExecutiveOverview />}
          {activeTab === 'project'     && <ProjectView />}
          {activeTab === 'associate'   && <AssociateView />}
          {activeTab === 'identity'    && <IdentityResolutionView />}
          {activeTab === 'connectors'  && <ConnectorsView />}
          {activeTab === 'manual-data' && <ManualDataAuditView />}
          {activeTab === 'models'      && <ModelBuilderView />}
          {activeTab === 'ai-insights' && <AIInsightsView />}
          {activeTab === 'jira'        && <JiraSummaryView />}
          {activeTab === 'delivery'    && <ServiceDeliveryView />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getSession() !== null);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <MainLayout onLogout={handleLogout} />
    </AppProvider>
  );
};

export default App;
