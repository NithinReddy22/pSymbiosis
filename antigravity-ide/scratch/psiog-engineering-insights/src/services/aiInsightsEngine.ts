import {
  Project,
  CalculatedPerformanceReport,
  Associate
} from '../types';

export interface ProjectAISummary {
  healthScore: number;
  executiveBrief: string;
  keyStrengths: string[];
  operationalRisks: string[];
  recommendations: string[];
}

export function generateProjectAISummary(
  project: Project,
  reports: CalculatedPerformanceReport[],
  associates: Associate[]
): ProjectAISummary {
  const projectReports = reports.filter(r => 
    r.tenureSegments.some(s => s.projectId === project.id)
  );

  const avgScore = projectReports.length > 0
    ? Math.round(projectReports.reduce((sum, r) => sum + r.overallScore, 0) / projectReports.length)
    : project.healthScore;

  const totalFlags = projectReports.reduce((sum, r) => sum + r.antiGamingFlags.length, 0);

  const executiveBrief = `${project.name} (${project.offering}) demonstrates robust engineering cadence in Q1 2026 with an aggregated performance health score of ${avgScore}/100 across ${projectReports.length} contributing team members. Sprints reflect high ticket throughput and disciplined documentation in SharePoint. ${totalFlags > 0 ? `${totalFlags} anti-gaming/quality warning signals were detected and require lead intervention.` : 'No anti-gaming anomalies detected.'}`;

  const strengths = [
    `Consistent sprint delivery velocity meeting calibrated benchmarks for ${project.offering}.`,
    `Active participation in peer code review cycles with prompt turnaround times under 28 hours.`,
    `Strong technical governance evidenced by published Architecture Decision Records (ADRs).`
  ];

  const operationalRisks = [
    totalFlags > 0 ? `Unreviewed or self-approved PR merges detected that bypass branch protection rules.` : `Slight uptick in QA rework cycles on complex integration stories.`,
    `Knowledge distribution risk: high concentration of architectural reviews on senior members.`
  ];

  const recommendations = [
    `Implement branch protection policy requiring at least 1 independent peer approval before merge.`,
    `Pair junior engineers with senior leads during sprint design reviews to build review capability.`,
    `Conduct bi-weekly backlog refinement to clarify acceptance criteria and reduce test bounce rate.`
  ];

  return {
    healthScore: avgScore,
    executiveBrief,
    keyStrengths: strengths,
    operationalRisks,
    recommendations
  };
}

export function queryAIAssistant(
  prompt: string,
  context: {
    selectedAssociate?: Associate;
    selectedReport?: CalculatedPerformanceReport;
    selectedProject?: Project;
    allProjects: Project[];
    allReports: CalculatedPerformanceReport[];
    allAssociates: Associate[];
  }
): string {
  const p = prompt.toLowerCase();

  if (p.includes('gaming') || p.includes('flag') || p.includes('anomaly')) {
    if (context.selectedReport && context.selectedReport.antiGamingFlags.length > 0) {
      const flags = context.selectedReport.antiGamingFlags;
      return `### 🚨 Anti-Gaming Analysis for ${context.selectedAssociate?.name || 'Selected Engineer'}
Found **${flags.length} potential anomalies** in the selected period:
${flags.map(f => `- **${f.title}** (${f.severity.toUpperCase()}): ${f.description}\n  *Evidence:* \`${f.evidence}\``).join('\n')}

**Recommendation**: Review these with the engineer during the qualitative 1-on-1. Often micro-commit bursts stem from misunderstanding squash-merge procedures rather than intentional metric gaming.`;
    }
    return `### 🛡️ Anti-Gaming & Anomaly Audit
No high-severity gaming patterns detected in current view.
The heuristics continuously monitor:
1. Micro-commit spamming (<5 lines/commit before sprint cutoffs)
2. Self-approved or unreviewed PR merges
3. Superficial code reviews ("LGTM", "+1" under 6 words)
4. Ticket bouncing between In Progress and QA (>3 bounces)`;
  }

  if (p.includes('alex') || (context.selectedAssociate?.id === 'A001' && p.includes('transition'))) {
    return `### 📊 Transition & Tenure Impact Analysis: Alex Rivera
- **Jan 1 - Feb 28 (PROJ-ALPHA / FinTech Engine)**: Served as **Senior Engineer**. Focused primarily on deep microservice implementation, contributing 26 story points, 4 merged PRs, and architectural ADRs for Kafka event sourcing.
- **Mar 1 Onward (PROJ-BETA / HealthCare Portal)**: Promoted to **Lead**. Output seamlessly shifted: delivery expectations adjusted from 28 to 14 story points, while peer code review volume surged to 4.0 reviews/PR and sprint enablement.
- **Fairness Note**: Paternity leave (10 days in Feb) was automatically accounted for, scaling the baseline expectation down by 22% so Alex was not unfairly penalized. Overall Score: **88/100 (Strong Performer)**.`;
  }

  if (p.includes('compare') || p.includes('project') || p.includes('benchmark')) {
    return `### ⚖️ Cross-Project & Offering Benchmark Summary
1. **FinTech Core Payment Engine (Cloud & DevOps)**: Score **92/100**. Exceptional infrastructure resilience and architecture documentation; lower PR volume is normal and properly calibrated for cloud offerings.
2. **HealthCare Patient Portal (Fullstack Web & Mobile)**: Score **88/100**. High UI velocity and PR throughput (averaging 14 PRs/month per engineer), with balanced test coverage.
3. **Enterprise Cloud Data Mesh (Data & AI)**: Score **84/100**. Robust dbt/Kafka pipelines, though temporarily impacted by on-call firefighting during broker failover.
4. **AutoQA Test Acceleration (QA & Test Automation)**: Score **95/100**. Outstanding test automation coverage with 120+ monthly test executions and low bug leakage.`;
  }

  // Default intelligent assistant response
  return `### 🤖 Psiog AI Insights Engine
Based on real-time activity data across JIRA, Azure DevOps, Git, TestRail, and SharePoint:
- **Evaluation Validity**: All scores are normalized by active working days and calibrated by Persona × Offering benchmarks.
- **Current Focus**: ${context.selectedAssociate ? `${context.selectedAssociate.name} (${context.selectedAssociate.title})` : (context.selectedProject ? context.selectedProject.name : 'Organization-wide Health')}.
- **Explainability**: No single activity count dictates the score. Output combines Delivery (30%), Quality (25%), Code Review Rigor (20%), Technical Documentation (15%), and Reliability (10%).

*Try asking:*
- *"Analyze anti-gaming alerts across projects"*
- *"Explain Alex Rivera's role transition and fair baseline adjustment"*
- *"Compare Fullstack Web benchmarks against Cloud DevOps"*`;
}
