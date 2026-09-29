import {
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
  SyncLogEntry
} from '../types';

export const initialProjects: Project[] = [
  {
    id: 'PROJ-ALPHA',
    name: 'FinTech Core Payment Engine',
    code: 'FCP',
    offering: 'Cloud & DevOps',
    client: 'Apex Global Financial',
    startDate: '2025-06-01',
    status: 'Active',
    healthScore: 92,
    deliveryHeadId: 'A006',
    leadId: 'A003',
    description: 'High-throughput payment orchestration and microservice cloud infrastructure on AWS & Kubernetes.',
    connectedTools: ['JIRA', 'Git', 'SharePoint']
  },
  {
    id: 'PROJ-BETA',
    name: 'HealthCare Patient Portal & Telehealth',
    code: 'HPP',
    offering: 'Fullstack Web & Mobile',
    client: 'WellSpring Health Network',
    startDate: '2025-09-15',
    status: 'Active',
    healthScore: 88,
    deliveryHeadId: 'A006',
    leadId: 'A001', // Alex Rivera became lead here on March 1st!
    description: 'HIPAA-compliant React/Node.js telehealth dashboard, scheduling portal, and mobile-friendly consultations.',
    connectedTools: ['Azure DevOps', 'Git', 'TestRail', 'SharePoint']
  },
  {
    id: 'PROJ-GAMMA',
    name: 'Enterprise Cloud Data Mesh',
    code: 'CDM',
    offering: 'Data & AI',
    client: 'Nordic Retail Group',
    startDate: '2025-11-01',
    status: 'Active',
    healthScore: 84,
    deliveryHeadId: 'A006',
    leadId: 'A005',
    description: 'Scalable data products, Snowflake/dbt orchestration, Kafka streaming, and ML model inference pipelines.',
    connectedTools: ['JIRA', 'Git', 'SharePoint']
  },
  {
    id: 'PROJ-DELTA',
    name: 'AutoQA Test Acceleration Suite',
    code: 'AQA',
    offering: 'QA & Test Automation',
    client: 'Psiog Internal Innovation Lab',
    startDate: '2026-01-10',
    status: 'Active',
    healthScore: 95,
    deliveryHeadId: 'A006',
    leadId: 'A002',
    description: 'Playwright & Appium automated test framework, synthetic test data generation, and CI/CD quality gates.',
    connectedTools: ['JIRA', 'Git', 'TestRail', 'SharePoint']
  }
];

export const initialAssociates: Associate[] = [
  {
    id: 'A001',
    name: 'Alex Rivera',
    email: 'alex.rivera@psiog.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Software Engineer',
    primaryOffering: 'Fullstack Web & Mobile',
    joinedDate: '2024-03-15',
    location: 'Bangalore, India'
  },
  {
    id: 'A002',
    name: 'Priya Sharma',
    email: 'priya.sharma@psiog.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior QA Automation Engineer',
    primaryOffering: 'QA & Test Automation',
    joinedDate: '2024-07-01',
    location: 'Hyderabad, India'
  },
  {
    id: 'A003',
    name: 'Marcus Chen',
    email: 'marcus.chen@psiog.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Principal Lead Architect',
    primaryOffering: 'Cloud & DevOps',
    joinedDate: '2023-01-10',
    location: 'Singapore'
  },
  {
    id: 'A004',
    name: 'Elena Rostova',
    email: 'elena.rostova@psiog.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Software Engineer',
    primaryOffering: 'Fullstack Web & Mobile',
    joinedDate: '2025-11-01',
    location: 'Warsaw, Poland'
  },
  {
    id: 'A005',
    name: 'Devon Miller',
    email: 'devon.miller@psiog.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Cloud Data Engineer',
    primaryOffering: 'Data & AI',
    joinedDate: '2024-02-20',
    location: 'Austin, USA'
  },
  {
    id: 'A006',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@psiog.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'VP of Delivery & Engineering Head',
    primaryOffering: 'Cloud & DevOps',
    joinedDate: '2022-04-10',
    location: 'London, UK'
  }
];

// Project Role Assignments with exact time-bounded ranges (Demonstrates criteria 3 & 11)
export const initialRoleAssignments: ProjectRoleAssignment[] = [
  // Alex Rivera moved mid-period:
  // Jan 1 to Feb 28: Senior Engineer on PROJ-ALPHA (FinTech)
  {
    id: 'PRA-001',
    associateId: 'A001',
    projectId: 'PROJ-ALPHA',
    role: 'Senior Engineer',
    startDate: '2025-06-01',
    endDate: '2026-02-28',
    allocationPercentage: 100,
    notes: 'Primary backend contributor to payment microservices'
  },
  // Mar 1 onward: Promoted to Lead on PROJ-BETA (HealthCare Portal)
  {
    id: 'PRA-002',
    associateId: 'A001',
    projectId: 'PROJ-BETA',
    role: 'Lead',
    startDate: '2026-03-01',
    endDate: null,
    allocationPercentage: 100,
    notes: 'Promoted to Lead; driving telehealth sprint releases and architecture'
  },
  // Priya Sharma: QA Engineer on Beta, then split 50/50 with Delta in March
  {
    id: 'PRA-003',
    associateId: 'A002',
    projectId: 'PROJ-BETA',
    role: 'Senior Engineer',
    startDate: '2025-09-15',
    endDate: '2026-02-28',
    allocationPercentage: 100,
    notes: 'Full-time QA Lead on HealthCare patient journeys'
  },
  {
    id: 'PRA-004',
    associateId: 'A002',
    projectId: 'PROJ-BETA',
    role: 'Senior Engineer',
    startDate: '2026-03-01',
    endDate: null,
    allocationPercentage: 50,
    notes: '50% allocation on HealthCare regression automation'
  },
  {
    id: 'PRA-005',
    associateId: 'A002',
    projectId: 'PROJ-DELTA',
    role: 'Lead',
    startDate: '2026-03-01',
    endDate: null,
    allocationPercentage: 50,
    notes: '50% allocation leading AutoQA framework core'
  },
  // Marcus Chen: Lead on Alpha
  {
    id: 'PRA-006',
    associateId: 'A003',
    projectId: 'PROJ-ALPHA',
    role: 'Lead',
    startDate: '2025-06-01',
    endDate: null,
    allocationPercentage: 100,
    notes: 'Principal architect and delivery lead'
  },
  // Elena Rostova: Engineer on Beta
  {
    id: 'PRA-007',
    associateId: 'A004',
    projectId: 'PROJ-BETA',
    role: 'Engineer',
    startDate: '2025-11-01',
    endDate: null,
    allocationPercentage: 100,
    notes: 'Frontend UI specialist'
  },
  // Devon Miller: Senior Engineer on Gamma
  {
    id: 'PRA-008',
    associateId: 'A005',
    projectId: 'PROJ-GAMMA',
    role: 'Senior Engineer',
    startDate: '2025-11-01',
    endDate: null,
    allocationPercentage: 100,
    notes: 'Lead data streaming pipelines'
  }
];

// Tool Account Identities across tools (Demonstrating criteria 4)
export const initialToolIdentities: ToolAccountIdentity[] = [
  // Alex Rivera (disparate handles across tools)
  {
    id: 'TA-001',
    associateId: 'A001',
    tool: 'Git',
    accountHandle: 'alex-rivera-dev',
    accountEmail: 'arivera@github.corp',
    accountDisplayName: 'Alex Rivera (Staff)',
    confidenceScore: 98,
    status: 'matched'
  },
  {
    id: 'TA-002',
    associateId: 'A001',
    tool: 'JIRA',
    accountHandle: 'arivera_jira',
    accountEmail: 'alex.rivera@psiog.com',
    accountDisplayName: 'Alex Rivera',
    confidenceScore: 100,
    status: 'matched'
  },
  {
    id: 'TA-003',
    associateId: 'A001',
    tool: 'Azure DevOps',
    accountHandle: 'alex.rivera@clienthealth.org',
    accountEmail: 'alex.rivera@clienthealth.org',
    accountDisplayName: 'Alex Rivera (Consultant)',
    confidenceScore: 92,
    status: 'matched'
  },
  {
    id: 'TA-004',
    associateId: 'A001',
    tool: 'SharePoint',
    accountHandle: 'alex.rivera@psiog.com',
    accountEmail: 'alex.rivera@psiog.com',
    accountDisplayName: 'Alex Rivera',
    confidenceScore: 100,
    status: 'matched'
  },
  // Priya Sharma
  {
    id: 'TA-005',
    associateId: 'A002',
    tool: 'TestRail',
    accountHandle: 'psharma_qa',
    accountEmail: 'priya.sharma@psiog.com',
    accountDisplayName: 'Priya S.',
    confidenceScore: 95,
    status: 'matched'
  },
  {
    id: 'TA-006',
    associateId: 'A002',
    tool: 'Git',
    accountHandle: 'priyasharma-git',
    accountEmail: 'priya.sharma@psiog.com',
    accountDisplayName: 'Priya Sharma',
    confidenceScore: 99,
    status: 'matched'
  },
  {
    id: 'TA-007',
    associateId: 'A002',
    tool: 'Azure DevOps',
    accountHandle: 'psharma@clienthealth.org',
    accountEmail: 'psharma@clienthealth.org',
    accountDisplayName: 'Priya Sharma (QA)',
    confidenceScore: 94,
    status: 'matched'
  },
  // Marcus Chen
  {
    id: 'TA-008',
    associateId: 'A003',
    tool: 'Git',
    accountHandle: 'marcus-c-lead',
    accountEmail: 'marcus.chen@psiog.com',
    accountDisplayName: 'Marcus Chen',
    confidenceScore: 100,
    status: 'matched'
  },
  {
    id: 'TA-009',
    associateId: 'A003',
    tool: 'JIRA',
    accountHandle: 'mchen_jira',
    accountEmail: 'marcus.chen@psiog.com',
    accountDisplayName: 'Marcus Chen',
    confidenceScore: 100,
    status: 'matched'
  },
  {
    id: 'TA-010',
    associateId: 'A003',
    tool: 'SharePoint',
    accountHandle: 'marcus.chen@psiog.com',
    accountEmail: 'marcus.chen@psiog.com',
    accountDisplayName: 'Marcus Chen',
    confidenceScore: 100,
    status: 'matched'
  },
  // Elena Rostova
  {
    id: 'TA-011',
    associateId: 'A004',
    tool: 'Azure DevOps',
    accountHandle: 'elena.rostova@clienthealth.org',
    accountEmail: 'elena.rostova@clienthealth.org',
    accountDisplayName: 'Elena Rostova',
    confidenceScore: 96,
    status: 'matched'
  },
  {
    id: 'TA-012',
    associateId: 'A004',
    tool: 'Git',
    accountHandle: 'elena-rostova-fe',
    accountEmail: 'elena.rostova@psiog.com',
    accountDisplayName: 'Elena Rostova',
    confidenceScore: 99,
    status: 'matched'
  },
  // Devon Miller
  {
    id: 'TA-013',
    associateId: 'A005',
    tool: 'JIRA',
    accountHandle: 'dmiller_jira',
    accountEmail: 'devon.miller@psiog.com',
    accountDisplayName: 'Devon Miller',
    confidenceScore: 100,
    status: 'matched'
  },
  {
    id: 'TA-014',
    associateId: 'A005',
    tool: 'Git',
    accountHandle: 'devon-m-data',
    accountEmail: 'devon.miller@psiog.com',
    accountDisplayName: 'Devon Miller',
    confidenceScore: 100,
    status: 'matched'
  },
  // UNMATCHED / ORPHAN IDENTITIES (Demonstrates Criteria 4 Unmatched Activity triage!)
  {
    id: 'TA-090',
    associateId: null,
    tool: 'Git',
    accountHandle: 'ghost-committer-88',
    accountEmail: 'unknown.coder@protonmail.com',
    accountDisplayName: 'Ghost Committer',
    confidenceScore: 15,
    status: 'unmatched',
    notes: 'Pushed 4 commits to PROJ-ALPHA repo in mid February'
  },
  {
    id: 'TA-091',
    associateId: null,
    tool: 'TestRail',
    accountHandle: 'ext_contractor_qa_temp',
    accountEmail: 'temp_qa@externalvendor.net',
    accountDisplayName: 'External QA Vendor',
    confidenceScore: 20,
    status: 'unmatched',
    notes: 'Ran 18 manual tests on PROJ-BETA sprint 14'
  },
  {
    id: 'TA-092',
    associateId: null,
    tool: 'JIRA',
    accountHandle: 'service_bot_auto',
    accountEmail: 'jira-bot@psiog.com',
    accountDisplayName: 'JIRA Automation Bot',
    confidenceScore: 35,
    status: 'unmatched',
    notes: 'Automated ticket transitions'
  }
];

// Manager Context Notes (Demonstrates Criteria 6: leave, on-call, onboarding)
export const initialContextNotes: ManagerContextNote[] = [
  {
    id: 'MCN-001',
    associateId: 'A001',
    projectId: 'PROJ-ALPHA',
    authorId: 'A003',
    authorName: 'Marcus Chen (Lead)',
    periodLabel: 'Q1 2026',
    category: 'Leave',
    impactDays: 10,
    description: 'Approved paternity leave from Feb 10 to Feb 22 (10 working days). Delivery capacity scaled down by 22% during Sprint 24.',
    baselineAdjustmentPercent: -22,
    createdAt: '2026-02-09T09:00:00Z'
  },
  {
    id: 'MCN-002',
    associateId: 'A001',
    projectId: 'PROJ-BETA',
    authorId: 'A006',
    authorName: 'Sarah Jenkins (Delivery Head)',
    periodLabel: 'Q1 2026',
    category: 'Special R&D Assignment',
    impactDays: 5,
    description: 'Led emergency security audit and HIPAA compliance migration sprint upon transitioning to Lead.',
    baselineAdjustmentPercent: 0,
    createdAt: '2026-03-05T14:30:00Z'
  },
  {
    id: 'MCN-003',
    associateId: 'A005',
    projectId: 'PROJ-GAMMA',
    authorId: 'A006',
    authorName: 'Sarah Jenkins (Delivery Head)',
    periodLabel: 'Q1 2026',
    category: 'On-Call Firefighting',
    impactDays: 7,
    description: 'Critical 24/7 on-call incident response for Kafka broker failover and client data stream recovery.',
    baselineAdjustmentPercent: -20,
    createdAt: '2026-03-10T11:00:00Z'
  },
  {
    id: 'MCN-004',
    associateId: 'A004',
    projectId: 'PROJ-BETA',
    authorId: 'A001',
    authorName: 'Alex Rivera (Lead)',
    periodLabel: 'Q1 2026',
    category: 'Onboarding',
    impactDays: 12,
    description: 'New associate onboarding ramp-up in January. Focus on codebase familiarity and pairing.',
    baselineAdjustmentPercent: -25,
    createdAt: '2026-01-15T10:00:00Z'
  }
];

// Manual Data Entries & Overrides with Audit Trail (Demonstrates Criteria 2)
export const initialManualEntries: ManualDataEntry[] = [
  {
    id: 'MDE-001',
    associateId: 'A001',
    projectId: 'PROJ-ALPHA',
    dimension: 'Delivery',
    metricName: 'Offline Payment Gateway Spike',
    value: 8,
    unit: 'Story Points',
    reason: 'Conducted emergency payment idempotency research spike before official ticket creation',
    enteredBy: 'Marcus Chen',
    enteredAt: '2026-01-28T16:00:00Z',
    isOverride: false
  },
  {
    id: 'MDE-002',
    associateId: 'A003',
    projectId: 'PROJ-ALPHA',
    dimension: 'Documentation',
    metricName: 'Client Executive Architecture Whitepaper',
    value: 1,
    unit: 'Whitepaper Doc',
    reason: 'Prepared high-level executive briefing delivered in client steering committee meeting',
    enteredBy: 'Sarah Jenkins',
    enteredAt: '2026-02-18T10:15:00Z',
    isOverride: false
  },
  {
    id: 'MDE-003',
    associateId: 'A002',
    projectId: 'PROJ-BETA',
    dimension: 'Quality',
    metricName: 'Manual Accessibility ADA Audit Run',
    value: 45,
    unit: 'Test Cases',
    reason: 'Conducted accessibility screen reader compliance verification without TestRail suite integration',
    enteredBy: 'Alex Rivera',
    enteredAt: '2026-03-12T11:20:00Z',
    isOverride: false
  }
];

// Raw Tickets (JIRA & Azure DevOps)
export const initialJiraTickets: JiraTicket[] = [
  // Alex Rivera on PROJ-ALPHA (Jan-Feb)
  {
    id: 'TIK-101',
    source: 'JIRA',
    ticketKey: 'FCP-304',
    title: 'Implement distributed locking mechanism for Kafka consumer groups',
    type: 'Story',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'arivera_jira',
    resolvedAt: '2026-01-14T15:30:00Z',
    cycleTimeHours: 28,
    reworkCount: 0,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'TIK-102',
    source: 'JIRA',
    ticketKey: 'FCP-319',
    title: 'Optimize payment ledger query indexing with Redis cache aside',
    type: 'Story',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'arivera_jira',
    resolvedAt: '2026-01-26T18:00:00Z',
    cycleTimeHours: 42,
    reworkCount: 1,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'TIK-103',
    source: 'JIRA',
    ticketKey: 'FCP-345',
    title: 'Fix deadlocks during concurrent multi-currency conversion transactions',
    type: 'Bug',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'arivera_jira',
    resolvedAt: '2026-02-05T12:00:00Z',
    cycleTimeHours: 19,
    reworkCount: 0,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'TIK-104',
    source: 'JIRA',
    ticketKey: 'FCP-360',
    title: 'PCI-DSS v4.0 tokenization layer encryption at rest migration',
    type: 'Story',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'arivera_jira',
    resolvedAt: '2026-02-27T17:45:00Z',
    cycleTimeHours: 54,
    reworkCount: 1,
    projectId: 'PROJ-ALPHA'
  },

  // Alex Rivera on PROJ-BETA as Lead (March)
  {
    id: 'TIK-105',
    source: 'Azure DevOps',
    ticketKey: 'HPP-1002',
    title: 'Lead sprint 14 architectural review for real-time video consultation WebRTC',
    type: 'Spike',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'alex.rivera@clienthealth.org',
    resolvedAt: '2026-03-08T16:00:00Z',
    cycleTimeHours: 24,
    reworkCount: 0,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TIK-106',
    source: 'Azure DevOps',
    ticketKey: 'HPP-1045',
    title: 'HIPAA consent audit logging and role-based access enforcement',
    type: 'Story',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'alex.rivera@clienthealth.org',
    resolvedAt: '2026-03-22T14:30:00Z',
    cycleTimeHours: 32,
    reworkCount: 0,
    projectId: 'PROJ-BETA'
  },

  // Elena Rostova on PROJ-BETA
  {
    id: 'TIK-201',
    source: 'Azure DevOps',
    ticketKey: 'HPP-890',
    title: 'Build patient appointment calendar view with timezone conversion',
    type: 'Story',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'elena.rostova@clienthealth.org',
    resolvedAt: '2026-01-20T17:00:00Z',
    cycleTimeHours: 36,
    reworkCount: 1,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TIK-202',
    source: 'Azure DevOps',
    ticketKey: 'HPP-920',
    title: 'Implement prescription refill request flow with push notifications',
    type: 'Story',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'elena.rostova@clienthealth.org',
    resolvedAt: '2026-02-12T15:00:00Z',
    cycleTimeHours: 48,
    reworkCount: 0,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TIK-203',
    source: 'Azure DevOps',
    ticketKey: 'HPP-955',
    title: 'Fix patient vitals charting rendering glitch on mobile browsers',
    type: 'Bug',
    status: 'Done',
    storyPoints: 3,
    authorToolId: 'elena.rostova@clienthealth.org',
    resolvedAt: '2026-02-25T11:00:00Z',
    cycleTimeHours: 14,
    reworkCount: 0,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TIK-204',
    source: 'Azure DevOps',
    ticketKey: 'HPP-1010',
    title: 'Doctor telehealth consultation waiting room queue management',
    type: 'Story',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'elena.rostova@clienthealth.org',
    resolvedAt: '2026-03-18T18:00:00Z',
    cycleTimeHours: 40,
    reworkCount: 0,
    projectId: 'PROJ-BETA'
  },

  // Marcus Chen on PROJ-ALPHA
  {
    id: 'TIK-301',
    source: 'JIRA',
    ticketKey: 'FCP-280',
    title: 'Architect multi-region active-active cluster failover topology',
    type: 'Spike',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'mchen_jira',
    resolvedAt: '2026-01-18T16:00:00Z',
    cycleTimeHours: 40,
    reworkCount: 0,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'TIK-302',
    source: 'JIRA',
    ticketKey: 'FCP-330',
    title: 'Zero-trust network policy hardening for internal microservice mesh',
    type: 'Tech Debt',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'mchen_jira',
    resolvedAt: '2026-02-15T14:00:00Z',
    cycleTimeHours: 30,
    reworkCount: 0,
    projectId: 'PROJ-ALPHA'
  },

  // Devon Miller on PROJ-GAMMA
  {
    id: 'TIK-401',
    source: 'JIRA',
    ticketKey: 'CDM-101',
    title: 'Deploy dbt core orchestration models for sales customer 360 view',
    type: 'Story',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'dmiller_jira',
    resolvedAt: '2026-01-22T19:00:00Z',
    cycleTimeHours: 44,
    reworkCount: 0,
    projectId: 'PROJ-GAMMA'
  },
  {
    id: 'TIK-402',
    source: 'JIRA',
    ticketKey: 'CDM-142',
    title: 'Kafka schema registry governance and dead letter queue routing',
    type: 'Story',
    status: 'Done',
    storyPoints: 8,
    authorToolId: 'dmiller_jira',
    resolvedAt: '2026-02-20T17:30:00Z',
    cycleTimeHours: 38,
    reworkCount: 1,
    projectId: 'PROJ-GAMMA'
  },
  {
    id: 'TIK-403',
    source: 'JIRA',
    ticketKey: 'CDM-180',
    title: 'Resolve partition lag bottleneck on high-volume clickstream topic',
    type: 'Bug',
    status: 'Done',
    storyPoints: 5,
    authorToolId: 'dmiller_jira',
    resolvedAt: '2026-03-15T16:00:00Z',
    cycleTimeHours: 26,
    reworkCount: 0,
    projectId: 'PROJ-GAMMA'
  },

  // Unmatched ticket for orphan triage demonstration!
  {
    id: 'TIK-999',
    source: 'JIRA',
    ticketKey: 'FCP-390',
    title: 'Legacy payment gateway deprecation script verification',
    type: 'Task',
    status: 'Done',
    storyPoints: 3,
    authorToolId: 'legacy_jira_usr_44', // Unmatched handle
    resolvedAt: '2026-02-18T11:00:00Z',
    cycleTimeHours: 15,
    reworkCount: 0,
    projectId: 'PROJ-ALPHA'
  }
];

// Raw Git Pull Requests
export const initialPullRequests: GitPullRequest[] = [
  // Alex Rivera PRs on PROJ-ALPHA (Jan-Feb)
  {
    id: 'PR-101',
    source: 'Git',
    repo: 'psiog/fintech-payment-engine',
    prNumber: 142,
    title: 'feat(kafka): Add distributed lock manager with Consul integration',
    authorToolId: 'alex-rivera-dev',
    linesAdded: 340,
    linesDeleted: 45,
    commitCount: 4,
    status: 'Merged',
    createdAt: '2026-01-11T10:00:00Z',
    mergedAt: '2026-01-13T16:30:00Z',
    turnaroundHours: 30.5,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'PR-102',
    source: 'Git',
    repo: 'psiog/fintech-payment-engine',
    prNumber: 156,
    title: 'perf(db): Redis cache-aside queries for ledger settlement tables',
    authorToolId: 'alex-rivera-dev',
    linesAdded: 215,
    linesDeleted: 82,
    commitCount: 3,
    status: 'Merged',
    createdAt: '2026-01-23T14:00:00Z',
    mergedAt: '2026-01-25T17:15:00Z',
    turnaroundHours: 27.2,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'PR-103',
    source: 'Git',
    repo: 'psiog/fintech-payment-engine',
    prNumber: 168,
    title: 'fix(currency): Concurrency race condition on balance reserve updates',
    authorToolId: 'alex-rivera-dev',
    linesAdded: 94,
    linesDeleted: 38,
    commitCount: 2,
    status: 'Merged',
    createdAt: '2026-02-03T11:00:00Z',
    mergedAt: '2026-02-04T15:00:00Z',
    turnaroundHours: 28.0,
    reviewersCount: 1,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'PR-104',
    source: 'Git',
    repo: 'psiog/fintech-payment-engine',
    prNumber: 182,
    title: 'feat(sec): PCI-DSS compliant field-level vault tokenization',
    authorToolId: 'alex-rivera-dev',
    linesAdded: 520,
    linesDeleted: 110,
    commitCount: 6,
    status: 'Merged',
    createdAt: '2026-02-24T09:30:00Z',
    mergedAt: '2026-02-26T18:00:00Z',
    turnaroundHours: 56.5,
    reviewersCount: 3,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-ALPHA'
  },

  // Alex Rivera PRs on PROJ-BETA as Lead (March)
  {
    id: 'PR-105',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 420,
    title: 'refactor(webrtc): Audio/Video room signaling gateway abstraction',
    authorToolId: 'alex-rivera-dev',
    linesAdded: 280,
    linesDeleted: 140,
    commitCount: 3,
    status: 'Merged',
    createdAt: '2026-03-05T13:00:00Z',
    mergedAt: '2026-03-07T11:00:00Z',
    turnaroundHours: 22.0,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'PR-106',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 438,
    title: 'feat(audit): Immutable HIPAA access audit trail with HMAC signatures',
    authorToolId: 'alex-rivera-dev',
    linesAdded: 195,
    linesDeleted: 18,
    commitCount: 3,
    status: 'Merged',
    createdAt: '2026-03-19T14:30:00Z',
    mergedAt: '2026-03-21T16:00:00Z',
    turnaroundHours: 25.5,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-BETA'
  },

  // Elena Rostova PRs on PROJ-BETA
  {
    id: 'PR-201',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 388,
    title: 'feat(ui): Patient schedule calendar month view with slot picker',
    authorToolId: 'elena-rostova-fe',
    linesAdded: 450,
    linesDeleted: 60,
    commitCount: 5,
    status: 'Merged',
    createdAt: '2026-01-16T12:00:00Z',
    mergedAt: '2026-01-19T17:00:00Z',
    turnaroundHours: 53.0,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'PR-202',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 402,
    title: 'feat(rx): Prescription renewal wizard modal and doctor approval flow',
    authorToolId: 'elena-rostova-fe',
    linesAdded: 380,
    linesDeleted: 42,
    commitCount: 4,
    status: 'Merged',
    createdAt: '2026-02-09T14:00:00Z',
    mergedAt: '2026-02-11T16:30:00Z',
    turnaroundHours: 26.5,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'PR-203',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 415,
    title: 'fix(chart): Resolve SVG clipping bug in blood pressure telemetry widget',
    authorToolId: 'elena-rostova-fe',
    linesAdded: 65,
    linesDeleted: 22,
    commitCount: 1,
    status: 'Merged',
    createdAt: '2026-02-23T10:00:00Z',
    mergedAt: '2026-02-24T14:00:00Z',
    turnaroundHours: 28.0,
    reviewersCount: 1,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'PR-204',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 432,
    title: 'feat(queue): Real-time virtual lobby queue position websocket updates',
    authorToolId: 'elena-rostova-fe',
    linesAdded: 310,
    linesDeleted: 55,
    commitCount: 4,
    status: 'Merged',
    createdAt: '2026-03-14T11:00:00Z',
    mergedAt: '2026-03-17T15:00:00Z',
    turnaroundHours: 28.0,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-BETA'
  },

  // Anti-Gaming Demonstration PR: Elena self-approved PR & micro-commits!
  {
    id: 'PR-205',
    source: 'Git',
    repo: 'psiog/healthcare-telehealth-portal',
    prNumber: 440,
    title: 'chore(styles): Quick button color palette tweaks',
    authorToolId: 'elena-rostova-fe',
    linesAdded: 15,
    linesDeleted: 12,
    commitCount: 8, // 8 tiny micro-commits for 15 lines of change!
    status: 'Merged',
    createdAt: '2026-03-25T18:00:00Z',
    mergedAt: '2026-03-25T18:15:00Z',
    turnaroundHours: 0.25,
    reviewersCount: 0,
    isSelfApproved: true, // Self-approved without peer review
    hasMicroCommits: true, // Triggers anti-gaming heuristic alert!
    projectId: 'PROJ-BETA'
  },

  // Devon Miller PRs on PROJ-GAMMA
  {
    id: 'PR-301',
    source: 'Git',
    repo: 'psiog/enterprise-data-mesh',
    prNumber: 78,
    title: 'feat(dbt): Customer Lifetime Value incremental models with Snowflake macros',
    authorToolId: 'devon-m-data',
    linesAdded: 410,
    linesDeleted: 85,
    commitCount: 4,
    status: 'Merged',
    createdAt: '2026-01-18T10:00:00Z',
    mergedAt: '2026-01-21T18:00:00Z',
    turnaroundHours: 32.0,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-GAMMA'
  },
  {
    id: 'PR-302',
    source: 'Git',
    repo: 'psiog/enterprise-data-mesh',
    prNumber: 94,
    title: 'feat(kafka): Dead Letter Queue retry backoff policy and alerts',
    authorToolId: 'devon-m-data',
    linesAdded: 280,
    linesDeleted: 40,
    commitCount: 3,
    status: 'Merged',
    createdAt: '2026-02-16T15:00:00Z',
    mergedAt: '2026-02-19T17:00:00Z',
    turnaroundHours: 26.0,
    reviewersCount: 2,
    isSelfApproved: false,
    hasMicroCommits: false,
    projectId: 'PROJ-GAMMA'
  }
];

// Raw Git Code Reviews (Demonstrating Criteria 5 & 9: Substantive vs Superficial reviews)
export const initialGitReviews: GitReview[] = [
  // Alex Rivera conducting reviews on PROJ-ALPHA as Senior Engineer
  {
    id: 'REV-101',
    source: 'Git',
    prId: 'PR-ALPHA-139',
    prTitle: 'refactor(auth): Migrate JWT verification to RSA-256 asymmetric keys',
    reviewerToolId: 'alex-rivera-dev',
    substantiveCommentsCount: 4,
    isSuperficial: false,
    verdict: 'Changes Requested',
    timestamp: '2026-01-10T14:30:00Z',
    turnaroundHours: 4.2,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'REV-102',
    source: 'Git',
    prId: 'PR-ALPHA-145',
    prTitle: 'feat(settlement): Batch processing engine for daily ACH transfers',
    reviewerToolId: 'alex-rivera-dev',
    substantiveCommentsCount: 6,
    isSuperficial: false,
    verdict: 'Approved',
    timestamp: '2026-01-20T11:15:00Z',
    turnaroundHours: 5.5,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'REV-103',
    source: 'Git',
    prId: 'PR-ALPHA-162',
    prTitle: 'fix(pool): Connection leak in Postgres connection pool during failover',
    reviewerToolId: 'alex-rivera-dev',
    substantiveCommentsCount: 3,
    isSuperficial: false,
    verdict: 'Approved',
    timestamp: '2026-02-08T16:00:00Z',
    turnaroundHours: 2.8,
    projectId: 'PROJ-ALPHA'
  },

  // Alex Rivera conducting reviews on PROJ-BETA as Lead (High review leverage!)
  {
    id: 'REV-104',
    source: 'Git',
    prId: 'PR-201',
    prTitle: 'feat(ui): Patient schedule calendar month view with slot picker',
    reviewerToolId: 'alex-rivera-dev',
    substantiveCommentsCount: 7,
    isSuperficial: false,
    verdict: 'Approved',
    timestamp: '2026-03-04T15:20:00Z',
    turnaroundHours: 3.1,
    projectId: 'PROJ-BETA'
  },
  {
    id: 'REV-105',
    source: 'Git',
    prId: 'PR-204',
    prTitle: 'feat(queue): Real-time virtual lobby queue position websocket updates',
    reviewerToolId: 'alex-rivera-dev',
    substantiveCommentsCount: 5,
    isSuperficial: false,
    verdict: 'Approved',
    timestamp: '2026-03-16T12:45:00Z',
    turnaroundHours: 2.5,
    projectId: 'PROJ-BETA'
  },

  // Marcus Chen conducting reviews on PROJ-ALPHA as Lead
  {
    id: 'REV-201',
    source: 'Git',
    prId: 'PR-101',
    prTitle: 'feat(kafka): Add distributed lock manager with Consul integration',
    reviewerToolId: 'marcus-c-lead',
    substantiveCommentsCount: 5,
    isSuperficial: false,
    verdict: 'Approved',
    timestamp: '2026-01-12T16:00:00Z',
    turnaroundHours: 6.0,
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'REV-202',
    source: 'Git',
    prId: 'PR-104',
    prTitle: 'feat(sec): PCI-DSS compliant field-level vault tokenization',
    reviewerToolId: 'marcus-c-lead',
    substantiveCommentsCount: 8,
    isSuperficial: false,
    verdict: 'Approved',
    timestamp: '2026-02-25T17:30:00Z',
    turnaroundHours: 4.5,
    projectId: 'PROJ-ALPHA'
  },

  // Anti-Gaming Example: Superficial reviews conducted by Devon Miller ("LGTM", "+1")
  {
    id: 'REV-301',
    source: 'Git',
    prId: 'PR-GAMMA-70',
    prTitle: 'docs(readme): Update environment variable setup documentation',
    reviewerToolId: 'devon-m-data',
    substantiveCommentsCount: 0,
    isSuperficial: true, // "LGTM 👍"
    verdict: 'Approved',
    timestamp: '2026-01-15T18:00:00Z',
    turnaroundHours: 0.1,
    projectId: 'PROJ-GAMMA'
  },
  {
    id: 'REV-302',
    source: 'Git',
    prId: 'PR-GAMMA-72',
    prTitle: 'chore: bump dependencies in poetry.lock',
    reviewerToolId: 'devon-m-data',
    substantiveCommentsCount: 0,
    isSuperficial: true, // "+1"
    verdict: 'Approved',
    timestamp: '2026-01-20T19:00:00Z',
    turnaroundHours: 0.2,
    projectId: 'PROJ-GAMMA'
  }
];

// Raw Test Executions (TestRail / Zephyr)
export const initialTestExecutions: TestExecution[] = [
  // Priya Sharma on PROJ-BETA (Jan-Feb)
  {
    id: 'TE-101',
    source: 'TestRail',
    suiteName: 'Telehealth Video Call End-to-End Suite',
    testCaseKey: 'TC-HPP-201',
    title: 'Verify doctor and patient can initiate encrypted WebRTC session',
    testerToolId: 'psharma_qa',
    result: 'Passed',
    isAutomated: true,
    defectsLoggedCount: 0,
    executionDurationMinutes: 4.5,
    timestamp: '2026-01-18T11:00:00Z',
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TE-102',
    source: 'TestRail',
    suiteName: 'Prescription Refill Verification',
    testCaseKey: 'TC-HPP-215',
    title: 'Validate drug interaction warning alerts triggered upon conflicting prescription',
    testerToolId: 'psharma_qa',
    result: 'Passed',
    isAutomated: true,
    defectsLoggedCount: 0,
    executionDurationMinutes: 3.2,
    timestamp: '2026-01-25T14:30:00Z',
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TE-103',
    source: 'TestRail',
    suiteName: 'HIPAA Access Control Regression',
    testCaseKey: 'TC-HPP-240',
    title: 'Ensure unauthorized role cannot access patient medical history records',
    testerToolId: 'psharma_qa',
    result: 'Failed',
    isAutomated: true,
    defectsLoggedCount: 1, // Logged defect HPP-942
    executionDurationMinutes: 5.0,
    timestamp: '2026-02-14T16:00:00Z',
    projectId: 'PROJ-BETA'
  },
  {
    id: 'TE-104',
    source: 'TestRail',
    suiteName: 'Appointment Booking Stress Tests',
    testCaseKey: 'TC-HPP-290',
    title: 'Simulate 500 concurrent patient booking requests for identical slot',
    testerToolId: 'psharma_qa',
    result: 'Passed',
    isAutomated: true,
    defectsLoggedCount: 0,
    executionDurationMinutes: 12.0,
    timestamp: '2026-02-26T17:15:00Z',
    projectId: 'PROJ-BETA'
  },

  // Priya Sharma leading AutoQA framework on PROJ-DELTA (March)
  {
    id: 'TE-105',
    source: 'TestRail',
    suiteName: 'AutoQA Playwright Core Engine',
    testCaseKey: 'TC-AQA-010',
    title: 'Execute cross-browser parallel visual regression test on Chromium, Firefox, WebKit',
    testerToolId: 'psharma_qa',
    result: 'Passed',
    isAutomated: true,
    defectsLoggedCount: 0,
    executionDurationMinutes: 6.8,
    timestamp: '2026-03-09T10:00:00Z',
    projectId: 'PROJ-DELTA'
  },
  {
    id: 'TE-106',
    source: 'TestRail',
    suiteName: 'AutoQA Self-Healing Locators',
    testCaseKey: 'TC-AQA-035',
    title: 'Verify AI locator automatically resolves mutated DOM selectors without test failure',
    testerToolId: 'psharma_qa',
    result: 'Passed',
    isAutomated: true,
    defectsLoggedCount: 0,
    executionDurationMinutes: 8.2,
    timestamp: '2026-03-23T15:45:00Z',
    projectId: 'PROJ-DELTA'
  }
];

// Raw SharePoint Technical Documents (Demonstrates Criteria 5: Architecture & Knowledge Sharing)
export const initialSharePointDocs: SharePointDocument[] = [
  // Alex Rivera docs on PROJ-ALPHA
  {
    id: 'DOC-101',
    source: 'SharePoint',
    docType: 'Architecture Decision Record',
    title: 'ADR-042: Evaluation of Apache Kafka vs AWS SQS/SNS for Payment Event Sourcing',
    authorToolId: 'alex.rivera@psiog.com',
    url: 'https://psiog.sharepoint.com/sites/FinTechCore/Docs/ADR-042.docx',
    wordCount: 2450,
    viewsCount: 142,
    lastModified: '2026-01-20T17:30:00Z',
    projectId: 'PROJ-ALPHA'
  },
  {
    id: 'DOC-102',
    source: 'SharePoint',
    docType: 'Technical Specification',
    title: 'PCI-DSS v4.0 Zero-Knowledge Tokenization Vault Design Specification',
    authorToolId: 'alex.rivera@psiog.com',
    url: 'https://psiog.sharepoint.com/sites/FinTechCore/Docs/PCI-DSS-Tokenization-Spec.docx',
    wordCount: 3800,
    viewsCount: 215,
    lastModified: '2026-02-18T16:00:00Z',
    projectId: 'PROJ-ALPHA'
  },

  // Alex Rivera docs on PROJ-BETA as Lead
  {
    id: 'DOC-103',
    source: 'SharePoint',
    docType: 'Runbook & Guides',
    title: 'Telehealth WebRTC Production Troubleshooting & Fallback Protocol',
    authorToolId: 'alex.rivera@psiog.com',
    url: 'https://psiog.sharepoint.com/sites/HealthCare/Docs/WebRTC-Runbook.docx',
    wordCount: 1850,
    viewsCount: 96,
    lastModified: '2026-03-12T14:00:00Z',
    projectId: 'PROJ-BETA'
  },

  // Marcus Chen on PROJ-ALPHA
  {
    id: 'DOC-201',
    source: 'SharePoint',
    docType: 'Architecture Decision Record',
    title: 'ADR-038: High-Availability Multi-Region Kubernetes Topology & Calico CNI',
    authorToolId: 'marcus.chen@psiog.com',
    url: 'https://psiog.sharepoint.com/sites/FinTechCore/Docs/ADR-038.docx',
    wordCount: 3200,
    viewsCount: 280,
    lastModified: '2026-01-15T11:00:00Z',
    projectId: 'PROJ-ALPHA'
  },

  // Devon Miller on PROJ-GAMMA
  {
    id: 'DOC-301',
    source: 'SharePoint',
    docType: 'Technical Specification',
    title: 'Enterprise Data Mesh Governance & Contract Schema Specification',
    authorToolId: 'devon.miller@psiog.com',
    url: 'https://psiog.sharepoint.com/sites/DataMesh/Docs/Data-Contract-Spec.docx',
    wordCount: 2900,
    viewsCount: 110,
    lastModified: '2026-02-10T15:30:00Z',
    projectId: 'PROJ-GAMMA'
  }
];

// Initial Connector Configurations (Criteria 1)
export const initialConnectors: ConnectorConfig[] = [
  {
    id: 'CONN-JIRA',
    tool: 'JIRA',
    name: 'Atlassian JIRA Cloud Connector',
    status: 'Connected',
    endpointUrl: 'https://psiog.atlassian.net/rest/api/3',
    authType: 'API Token',
    lastSyncedAt: '2026-03-28T04:00:00Z',
    recordsCount: 412,
    fieldMappings: {
      'customfield_10024': 'storyPoints',
      'fields.status.name': 'status',
      'fields.resolutiondate': 'resolvedAt',
      'fields.assignee.accountId': 'authorToolId',
      'fields.issuetype.name': 'type'
    }
  },
  {
    id: 'CONN-ADO',
    tool: 'Azure DevOps',
    name: 'Azure DevOps Boards & Repos',
    status: 'Connected',
    endpointUrl: 'https://dev.azure.com/psiog-delivery',
    authType: 'PAT',
    lastSyncedAt: '2026-03-28T04:15:00Z',
    recordsCount: 289,
    fieldMappings: {
      'Microsoft.VSTS.Scheduling.StoryPoints': 'storyPoints',
      'System.State': 'status',
      'Microsoft.VSTS.Common.ClosedDate': 'resolvedAt',
      'System.AssignedTo.uniqueName': 'authorToolId'
    }
  },
  {
    id: 'CONN-GIT',
    tool: 'Git',
    name: 'GitHub Enterprise / GitLab Connector',
    status: 'Connected',
    endpointUrl: 'https://api.github.com/orgs/psiog',
    authType: 'OAuth2',
    lastSyncedAt: '2026-03-28T04:30:00Z',
    recordsCount: 840,
    fieldMappings: {
      'pull_request.merged_at': 'mergedAt',
      'pull_request.user.login': 'authorToolId',
      'pull_request.additions': 'linesAdded',
      'pull_request.deletions': 'linesDeleted',
      'pull_request.commits': 'commitCount'
    }
  },
  {
    id: 'CONN-TESTRAIL',
    tool: 'TestRail',
    name: 'TestRail QA Test Suite',
    status: 'Connected',
    endpointUrl: 'https://psiog.testrail.io/index.php?/api/v2',
    authType: 'API Token',
    lastSyncedAt: '2026-03-28T04:45:00Z',
    recordsCount: 154,
    fieldMappings: {
      'test_result.status_id': 'result',
      'test_result.custom_automated': 'isAutomated',
      'test_result.created_by': 'testerToolId',
      'test_result.elapsed': 'executionDurationMinutes'
    }
  },
  {
    id: 'CONN-SP',
    tool: 'SharePoint',
    name: 'Microsoft 365 SharePoint Knowledge Graph',
    status: 'Connected',
    endpointUrl: 'https://graph.microsoft.com/v1.0/sites/psiog',
    authType: 'Service Principal',
    lastSyncedAt: '2026-03-28T05:00:00Z',
    recordsCount: 96,
    fieldMappings: {
      'file.lastModifiedDateTime': 'lastModified',
      'file.createdBy.user.mail': 'authorToolId',
      'file.name': 'title',
      'webUrl': 'url'
    }
  }
];

export const initialSyncLogs: SyncLogEntry[] = [
  {
    id: 'SYNC-001',
    tool: 'JIRA',
    syncTimestamp: '2026-03-28T04:00:00Z',
    recordsFetched: 38,
    recordsInserted: 6,
    recordsUpdated: 32,
    durationMs: 1420,
    status: 'Success',
    watermark: '2026-03-28T03:59:00Z'
  },
  {
    id: 'SYNC-002',
    tool: 'Azure DevOps',
    syncTimestamp: '2026-03-28T04:15:00Z',
    recordsFetched: 24,
    recordsInserted: 4,
    recordsUpdated: 20,
    durationMs: 980,
    status: 'Success',
    watermark: '2026-03-28T04:14:00Z'
  },
  {
    id: 'SYNC-003',
    tool: 'Git',
    syncTimestamp: '2026-03-28T04:30:00Z',
    recordsFetched: 52,
    recordsInserted: 12,
    recordsUpdated: 40,
    durationMs: 2310,
    status: 'Success',
    watermark: '2026-03-28T04:29:00Z'
  },
  {
    id: 'SYNC-004',
    tool: 'TestRail',
    syncTimestamp: '2026-03-28T04:45:00Z',
    recordsFetched: 15,
    recordsInserted: 2,
    recordsUpdated: 13,
    durationMs: 650,
    status: 'Success',
    watermark: '2026-03-28T04:44:00Z'
  },
  {
    id: 'SYNC-005',
    tool: 'SharePoint',
    syncTimestamp: '2026-03-28T05:00:00Z',
    recordsFetched: 8,
    recordsInserted: 1,
    recordsUpdated: 7,
    durationMs: 520,
    status: 'Success',
    watermark: '2026-03-28T04:59:00Z'
  }
];
