import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  UserRole,
  Project,
  Associate,
  ProjectRoleAssignment,
  ToolAccountIdentity,
  ManagerContextNote,
  ManualDataEntry,
  JiraTicket,
  GitPullRequest,
  GitReview,
  TestExecution,
  SharePointDocument,
  ConnectorConfig,
  SyncLogEntry,
  PerformanceModelVersion,
  CalculatedPerformanceReport,
  ToolType
} from '../types';

import {
  initialProjects,
  initialAssociates,
  initialRoleAssignments,
  initialToolIdentities,
  initialContextNotes,
  initialManualEntries,
  initialJiraTickets,
  initialPullRequests,
  initialGitReviews,
  initialTestExecutions,
  initialSharePointDocs,
  initialConnectors,
  initialSyncLogs
} from '../data/initialSeedData';

import { defaultPerformanceModels } from '../data/defaultModels';
import { calculateAssociatePerformanceReport } from '../services/scoringEngine';
import { runDeltaSync } from '../services/syncService';
import { parseImportedData } from '../services/connectorService';

export interface DatePeriod {
  start: string;
  end: string;
  label: string;
}

interface AppContextType {
  // RBAC & User
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  activeAssociate: Associate | undefined;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPeriod: DatePeriod;
  setSelectedPeriod: (period: DatePeriod) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedAssociateId: string;
  setSelectedAssociateId: (id: string) => void;

  // Domain Entities
  projects: Project[];
  associates: Associate[];
  roleAssignments: ProjectRoleAssignment[];
  identities: ToolAccountIdentity[];
  contextNotes: ManagerContextNote[];
  manualEntries: ManualDataEntry[];
  tickets: JiraTicket[];
  prs: GitPullRequest[];
  reviews: GitReview[];
  tests: TestExecution[];
  docs: SharePointDocument[];
  connectors: ConnectorConfig[];
  syncLogs: SyncLogEntry[];
  models: PerformanceModelVersion[];
  activeModel: PerformanceModelVersion;

  // Computed Reports
  allReports: CalculatedPerformanceReport[];
  selectedAssociateReport: CalculatedPerformanceReport | undefined;

  // Actions
  addManualEntry: (entry: Omit<ManualDataEntry, 'id' | 'enteredAt'>) => void;
  addContextNote: (note: Omit<ManagerContextNote, 'id' | 'createdAt'>) => void;
  updateIdentityMapping: (identityId: string, associateId: string | null, status: 'matched' | 'unmatched' | 'manual_override') => void;
  updateConnectorMappings: (tool: ToolType, mappings: Record<string, string>) => void;
  triggerSync: (tool?: ToolType) => { fetched: number; inserted: number };
  importExternalData: (tool: ToolType, rawContent: string, projectId: string) => { success: boolean; message: string };
  updateModelWeights: (updatedModel: PerformanceModelVersion) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Session / RBAC State
  const [userRole, setUserRole] = useState<UserRole>('Delivery Head'); // Default to Delivery Head for full executive visibility
  const [currentUserId, setCurrentUserId] = useState<string>('A006'); // Sarah Jenkins (VP Delivery)

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<DatePeriod>({
    start: '2026-01-01',
    end: '2026-03-31',
    label: 'Q1 2026'
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PROJ-ALPHA');
  const [selectedAssociateId, setSelectedAssociateId] = useState<string>('A001'); // Alex Rivera

  // Domain State
  const [projects] = useState<Project[]>(initialProjects);
  const [associates] = useState<Associate[]>(initialAssociates);
  const [roleAssignments] = useState<ProjectRoleAssignment[]>(initialRoleAssignments);
  const [identities, setIdentities] = useState<ToolAccountIdentity[]>(initialToolIdentities);
  const [contextNotes, setContextNotes] = useState<ManagerContextNote[]>(initialContextNotes);
  const [manualEntries, setManualEntries] = useState<ManualDataEntry[]>(initialManualEntries);
  
  const [tickets, setTickets] = useState<JiraTicket[]>(initialJiraTickets);
  const [prs, setPrs] = useState<GitPullRequest[]>(initialPullRequests);
  const [reviews, setReviews] = useState<GitReview[]>(initialGitReviews);
  const [tests, setTests] = useState<TestExecution[]>(initialTestExecutions);
  const [docs, setDocs] = useState<SharePointDocument[]>(initialSharePointDocs);

  const [connectors, setConnectors] = useState<ConnectorConfig[]>(initialConnectors);
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>(initialSyncLogs);
  const [models, setModels] = useState<PerformanceModelVersion[]>(defaultPerformanceModels);

  const activeModel = useMemo(() => {
    return models.find(m => m.isActive) || models[0];
  }, [models]);

  const activeAssociate = useMemo(() => {
    return associates.find(a => a.id === currentUserId) || associates[0];
  }, [associates, currentUserId]);

  // Compute Performance Reports across all associates for the active period & model
  const allReports = useMemo(() => {
    return associates.map(assoc => {
      return calculateAssociatePerformanceReport(
        assoc,
        selectedPeriod.start,
        selectedPeriod.end,
        selectedPeriod.label,
        activeModel,
        roleAssignments,
        projects,
        identities,
        contextNotes,
        manualEntries,
        tickets,
        prs,
        reviews,
        tests,
        docs
      );
    });
  }, [
    associates,
    selectedPeriod,
    activeModel,
    roleAssignments,
    projects,
    identities,
    contextNotes,
    manualEntries,
    tickets,
    prs,
    reviews,
    tests,
    docs
  ]);

  const selectedAssociateReport = useMemo(() => {
    return allReports.find(r => r.associateId === selectedAssociateId) || allReports[0];
  }, [allReports, selectedAssociateId]);

  // Actions
  const addManualEntry = (entry: Omit<ManualDataEntry, 'id' | 'enteredAt'>) => {
    const newEntry: ManualDataEntry = {
      ...entry,
      id: `MDE-${Date.now()}`,
      enteredAt: new Date().toISOString()
    };
    setManualEntries(prev => [newEntry, ...prev]);
  };

  const addContextNote = (note: Omit<ManagerContextNote, 'id' | 'createdAt'>) => {
    const newNote: ManagerContextNote = {
      ...note,
      id: `MCN-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setContextNotes(prev => [newNote, ...prev]);
  };

  const updateIdentityMapping = (
    identityId: string,
    associateId: string | null,
    status: 'matched' | 'unmatched' | 'manual_override'
  ) => {
    setIdentities(prev =>
      prev.map(id => {
        if (id.id === identityId) {
          return {
            ...id,
            associateId,
            status,
            confidenceScore: status === 'manual_override' ? 100 : id.confidenceScore,
            lastMatchedAt: new Date().toISOString()
          };
        }
        return id;
      })
    );
  };

  const updateConnectorMappings = (tool: ToolType, mappings: Record<string, string>) => {
    setConnectors(prev =>
      prev.map(c => (c.tool === tool ? { ...c, fieldMappings: { ...c.fieldMappings, ...mappings } } : c))
    );
  };

  const triggerSync = (tool?: ToolType) => {
    const res = runDeltaSync(connectors, tool);
    setConnectors(res.updatedConnectors);
    setSyncLogs(prev => [...res.newLogs, ...prev]);
    return { fetched: res.totalFetched, inserted: res.totalNew };
  };

  const importExternalData = (tool: ToolType, rawContent: string, projectId: string) => {
    const res = parseImportedData(tool, rawContent, projectId);
    if (res.tickets) setTickets(prev => [...res.tickets!, ...prev]);
    if (res.prs) setPrs(prev => [...res.prs!, ...prev]);
    if (res.reviews) setReviews(prev => [...res.reviews!, ...prev]);
    if (res.tests) setTests(prev => [...res.tests!, ...prev]);
    if (res.docs) setDocs(prev => [...res.docs!, ...prev]);
    return { success: true, message: res.summary };
  };

  const updateModelWeights = (updatedModel: PerformanceModelVersion) => {
    setModels(prev =>
      prev.map(m => (m.versionId === updatedModel.versionId ? updatedModel : m))
    );
  };

  const value: AppContextType = {
    userRole,
    setUserRole,
    currentUserId,
    setCurrentUserId,
    activeAssociate,
    activeTab,
    setActiveTab,
    selectedPeriod,
    setSelectedPeriod,
    selectedProjectId,
    setSelectedProjectId,
    selectedAssociateId,
    setSelectedAssociateId,
    projects,
    associates,
    roleAssignments,
    identities,
    contextNotes,
    manualEntries,
    tickets,
    prs,
    reviews,
    tests,
    docs,
    connectors,
    syncLogs,
    models,
    activeModel,
    allReports,
    selectedAssociateReport,
    addManualEntry,
    addContextNote,
    updateIdentityMapping,
    updateConnectorMappings,
    triggerSync,
    importExternalData,
    updateModelWeights
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
