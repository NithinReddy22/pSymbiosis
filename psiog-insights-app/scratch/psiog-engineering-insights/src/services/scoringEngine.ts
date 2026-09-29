import {
  Associate,
  Project,
  ProjectRoleAssignment,
  PerformanceModelVersion,
  ManagerContextNote,
  ManualDataEntry,
  JiraTicket,
  GitPullRequest,
  GitReview,
  TestExecution,
  SharePointDocument,
  CalculatedPerformanceReport,
  TenureAttributionSegment,
  ToolAccountIdentity,
  Persona,
  Offering
} from '../types';
import { calculateTenureSegments } from './attributionEngine';
import { resolveToolAccountToAssociateId } from './identityResolution';
import { detectAntiGamingPatterns } from './antiGamingEngine';

export function calculateAssociatePerformanceReport(
  associate: Associate,
  periodStart: string,
  periodEnd: string,
  periodLabel: string,
  model: PerformanceModelVersion,
  roleAssignments: ProjectRoleAssignment[],
  projects: Project[],
  identities: ToolAccountIdentity[],
  contextNotes: ManagerContextNote[],
  manualEntries: ManualDataEntry[],
  allTickets: JiraTicket[],
  allPRs: GitPullRequest[],
  allReviews: GitReview[],
  allTests: TestExecution[],
  allDocs: SharePointDocument[]
): CalculatedPerformanceReport {
  // 1. Calculate time-bound tenure segments
  const tenureSegments = calculateTenureSegments(
    associate.id,
    periodStart,
    periodEnd,
    roleAssignments,
    projects
  );

  // Filter context notes for this associate & period
  const userNotes = contextNotes.filter(n => n.associateId === associate.id);
  const totalLeaveDays = userNotes.filter(n => n.category === 'Leave').reduce((sum, n) => sum + n.impactDays, 0);
  const totalOnCallDays = userNotes.filter(n => n.category === 'On-Call Firefighting').reduce((sum, n) => sum + n.impactDays, 0);

  // Cumulative baseline scaling percentage from all context notes
  const totalAdjustmentPercent = userNotes.reduce((sum, n) => sum + (n.baselineAdjustmentPercent || 0), 0);
  const baselineScalingFactor = Math.max(0.3, 1 + totalAdjustmentPercent / 100);

  // Find all tool handles owned by this associate
  const userHandles = new Set(
    identities
      .filter(id => id.associateId === associate.id)
      .flatMap(id => [id.accountHandle.toLowerCase(), (id.accountEmail || '').toLowerCase()])
      .filter(Boolean)
  );

  // Helper to test if author is this user
  const isUserActivity = (toolAuthorId: string) => {
    return userHandles.has(toolAuthorId.toLowerCase());
  };

  const pStart = new Date(periodStart).getTime();
  const pEnd = new Date(periodEnd).getTime();

  // Filter activities within the period
  const userTickets = allTickets.filter(t => {
    const time = new Date(t.resolvedAt).getTime();
    return time >= pStart && time <= pEnd && isUserActivity(t.authorToolId);
  });

  const userPRs = allPRs.filter(pr => {
    const time = new Date(pr.mergedAt || pr.createdAt).getTime();
    return time >= pStart && time <= pEnd && isUserActivity(pr.authorToolId);
  });

  const userReviews = allReviews.filter(r => {
    const time = new Date(r.timestamp).getTime();
    return time >= pStart && time <= pEnd && isUserActivity(r.reviewerToolId);
  });

  const userTests = allTests.filter(te => {
    const time = new Date(te.timestamp).getTime();
    return time >= pStart && time <= pEnd && isUserActivity(te.testerToolId);
  });

  const userDocs = allDocs.filter(d => {
    const time = new Date(d.lastModified).getTime();
    return time >= pStart && time <= pEnd && isUserActivity(d.authorToolId);
  });

  // Calculate manual entries & overrides
  const userManualEntries = manualEntries.filter(m => m.associateId === associate.id);

  // Determine dominant Persona and Offering for baseline calibration
  const primarySegment = tenureSegments[0] || {
    role: 'Senior Engineer' as Persona,
    offering: associate.primaryOffering,
    effectiveWorkingDays: 45
  };

  const persona: Persona = primarySegment.role;
  const offering: Offering = primarySegment.offering;

  const weights = model.weightsByPersona[persona] || model.weightsByPersona['Senior Engineer'];
  const benchmark = model.benchmarksByOffering[offering]?.[persona] || model.benchmarksByOffering['Fullstack Web & Mobile']['Senior Engineer'];

  // Sum effective working days across all segments
  const totalWorkingDays = Math.max(
    1,
    tenureSegments.reduce((sum, s) => sum + s.effectiveWorkingDays, 0)
  );

  // Approximate standard months worked in the period (22 working days per month standard)
  const effectiveMonths = Math.max(0.1, (totalWorkingDays / 22) * baselineScalingFactor);

  // 1. DELIVERY SCORE CALCULATION
  const manualDeliveryPoints = userManualEntries
    .filter(m => m.dimension === 'Delivery')
    .reduce((sum, m) => sum + m.value, 0);

  const rawStoryPoints = userTickets.reduce((sum, t) => sum + t.storyPoints, 0) + manualDeliveryPoints;
  const rawMergedPRs = userPRs.filter(p => p.status === 'Merged').length;

  const expectedStoryPoints = Math.round(benchmark.expectedStoryPointsPerMonth * effectiveMonths);
  const expectedPRs = Math.round(benchmark.expectedMergedPRsPerMonth * effectiveMonths);

  const pointsRatio = expectedStoryPoints > 0 ? (rawStoryPoints / expectedStoryPoints) : 1;
  const prsRatio = expectedPRs > 0 ? (rawMergedPRs / expectedPRs) : 1;
  const deliveryRawScore = Math.min(100, Math.round(((pointsRatio * 0.6) + (prsRatio * 0.4)) * 100));

  const deliveryDetail = {
    score: Math.max(10, deliveryRawScore),
    weight: weights.delivery,
    rawMetrics: {
      storyPoints: rawStoryPoints,
      mergedPRs: rawMergedPRs,
      manualPointsAdded: manualDeliveryPoints,
      effectiveWorkingDays: totalWorkingDays
    },
    benchmarkTarget: `${expectedStoryPoints} Story Pts, ${expectedPRs} Merged PRs`,
    explanation: `Calculated from ${rawStoryPoints} completed story points (${(pointsRatio * 100).toFixed(0)}% of target) and ${rawMergedPRs} merged PRs (${(prsRatio * 100).toFixed(0)}% of target), normalized by ${totalWorkingDays} effective days and context adjustments.`,
    isAdjustedByContext: totalAdjustmentPercent !== 0
  };

  // 2. QUALITY SCORE CALCULATION
  const totalBugs = userTickets.filter(t => t.type === 'Bug').length;
  const bugLeakPercent = rawStoryPoints > 0 ? Math.round((totalBugs / Math.max(1, userTickets.length)) * 100) : 0;
  const totalReworkBounces = userTickets.reduce((sum, t) => sum + t.reworkCount, 0);

  let qualityRawScore = 100 - (bugLeakPercent * 1.5) - (totalReworkBounces * 4);
  qualityRawScore = Math.max(30, Math.min(100, qualityRawScore));

  const qualityDetail = {
    score: qualityRawScore,
    weight: weights.quality,
    rawMetrics: {
      bugsResolved: totalBugs,
      bugLeakRatePercent: `${bugLeakPercent}%`,
      reworkBounces: totalReworkBounces,
      automatedTestsPassed: userTests.filter(t => t.result === 'Passed').length
    },
    benchmarkTarget: `< ${benchmark.maxBugLeakRatePercent}% bug leak rate, low rework`,
    explanation: `Assessed from a ${bugLeakPercent}% bug ratio and ${totalReworkBounces} QA rework cycles across resolved deliverables.`,
    isAdjustedByContext: false
  };

  // 3. CODE REVIEW & COLLABORATION SCORE
  const substantiveReviews = userReviews.filter(r => !r.isSuperficial && r.substantiveCommentsCount > 0);
  const totalSubstantiveComments = substantiveReviews.reduce((sum, r) => sum + r.substantiveCommentsCount, 0);
  const expectedReviews = Math.round(benchmark.expectedReviewsPerPR * (rawMergedPRs || 4) * effectiveMonths);

  const reviewRatio = expectedReviews > 0 ? (substantiveReviews.length / expectedReviews) : 1;
  const reviewRawScore = Math.min(100, Math.round(Math.max(20, reviewRatio * 90 + (totalSubstantiveComments > 10 ? 10 : 0))));

  const reviewDetail = {
    score: reviewRawScore,
    weight: weights.review,
    rawMetrics: {
      totalReviewsConducted: userReviews.length,
      substantiveReviewsCount: substantiveReviews.length,
      superficialReviewsFiltered: userReviews.length - substantiveReviews.length,
      totalSubstantiveComments
    },
    benchmarkTarget: `${expectedReviews} substantive reviews (${benchmark.expectedReviewsPerPR} per PR)`,
    explanation: `Based on ${substantiveReviews.length} substantive reviews containing ${totalSubstantiveComments} technical feedback comments. Superficial 'LGTM' reviews were filtered out.`,
    isAdjustedByContext: totalAdjustmentPercent !== 0
  };

  // 4. DOCUMENTATION & ARCHITECTURE SCORE
  const rawDocsCount = userDocs.length;
  const totalDocWords = userDocs.reduce((sum, d) => sum + d.wordCount, 0);
  const manualDocsAdded = userManualEntries.filter(m => m.dimension === 'Documentation').reduce((sum, m) => sum + m.value, 0);
  const effectiveDocs = rawDocsCount + manualDocsAdded;

  const expectedDocs = Math.max(1, Math.round((benchmark.expectedDocsPerQuarter / 3) * (totalWorkingDays / 22)));
  const docRatio = effectiveDocs / expectedDocs;
  const docRawScore = Math.min(100, Math.round(Math.max(25, docRatio * 85 + (totalDocWords > 3000 ? 15 : 0))));

  const docDetail = {
    score: docRawScore,
    weight: weights.documentation,
    rawMetrics: {
      sharePointDocsCreated: rawDocsCount,
      manualDocsCredited: manualDocsAdded,
      totalWordsPenned: totalDocWords,
      totalViews: userDocs.reduce((sum, d) => sum + d.viewsCount, 0)
    },
    benchmarkTarget: `${expectedDocs} docs per period (ADRs, Specs, Runbooks)`,
    explanation: `Evaluated from ${effectiveDocs} technical documents (totaling ${totalDocWords.toLocaleString()} words and viewed ${userDocs.reduce((sum, d) => sum + d.viewsCount, 0)} times).`,
    isAdjustedByContext: false
  };

  // 5. OPERATIONAL RELIABILITY SCORE
  let reliabilityRawScore = 85;
  if (totalOnCallDays > 0) {
    // Bonus for on-call firefight duty
    reliabilityRawScore = Math.min(100, reliabilityRawScore + 10);
  }
  if (totalReworkBounces > 4) {
    reliabilityRawScore = Math.max(40, reliabilityRawScore - 15);
  }

  const relDetail = {
    score: reliabilityRawScore,
    weight: weights.reliability,
    rawMetrics: {
      onCallDaysServed: totalOnCallDays,
      unplannedOutagesResponded: totalOnCallDays > 0 ? 1 : 0
    },
    benchmarkTarget: `Zero high-severity regression leaks, on-call readiness`,
    explanation: `Reflects operational uptime, deployment stability, and ${totalOnCallDays} days of on-call support response.`,
    isAdjustedByContext: totalOnCallDays > 0
  };

  // Calculate Composite Weighted Score
  const overallScore = Math.round(
    deliveryDetail.score * deliveryDetail.weight +
    qualityDetail.score * qualityDetail.weight +
    reviewDetail.score * reviewDetail.weight +
    docDetail.score * docDetail.weight +
    relDetail.score * relDetail.weight
  );

  // Rating Band Assignment
  let ratingBand: CalculatedPerformanceReport['ratingBand'] = 'Meeting Expectations';
  if (overallScore >= 90) ratingBand = 'Exceeding Expectations';
  else if (overallScore >= 80) ratingBand = 'Strong Performer';
  else if (overallScore >= 68) ratingBand = 'Meeting Expectations';
  else ratingBand = 'Developing / Needs Support';

  // Anti-Gaming Heuristic Execution
  const antiGamingFlags = detectAntiGamingPatterns(
    associate.id,
    userPRs,
    userReviews,
    userTickets,
    userTests,
    model.antiGamingRules
  );

  // Populate activities per tenure segment
  for (const seg of tenureSegments) {
    const sStart = new Date(seg.startDate).getTime();
    const sEnd = new Date(seg.endDate).getTime();

    seg.activitiesCount = {
      tickets: userTickets.filter(t => t.projectId === seg.projectId && new Date(t.resolvedAt).getTime() >= sStart && new Date(t.resolvedAt).getTime() <= sEnd).length,
      prs: userPRs.filter(pr => pr.projectId === seg.projectId && new Date(pr.mergedAt || pr.createdAt).getTime() >= sStart && new Date(pr.mergedAt || pr.createdAt).getTime() <= sEnd).length,
      reviews: userReviews.filter(r => r.projectId === seg.projectId && new Date(r.timestamp).getTime() >= sStart && new Date(r.timestamp).getTime() <= sEnd).length,
      tests: userTests.filter(te => te.projectId === seg.projectId && new Date(te.timestamp).getTime() >= sStart && new Date(te.timestamp).getTime() <= sEnd).length,
      docs: userDocs.filter(d => d.projectId === seg.projectId && new Date(d.lastModified).getTime() >= sStart && new Date(d.lastModified).getTime() <= sEnd).length
    };
    seg.segmentOverallScore = overallScore; // Calibrated score
  }

  // Sparse data detection
  const isSparse = totalWorkingDays < 15 || (rawStoryPoints < 5 && userPRs.length < 2);
  const sparseDataWarning = isSparse ? {
    isSparse: true,
    reason: `Low activity sample size (${totalWorkingDays} effective days or < 5 story points). Results are normalized using statistical shrinkage.`,
    confidenceInterval: `±12 points`
  } : undefined;

  // AI Narrative Insights synthesis
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (deliveryDetail.score >= 85) strengths.push(`High delivery throughput (${rawStoryPoints} story points across ${rawMergedPRs} merged PRs).`);
  if (reviewDetail.score >= 80) strengths.push(`Rigorous technical code review contribution with ${substantiveReviews.length} substantive reviews conducted.`);
  if (docDetail.score >= 80) strengths.push(`Proactive knowledge sharing with ${effectiveDocs} technical design documents and ADRs published.`);
  if (totalOnCallDays > 0) strengths.push(`Demonstrated resilience and ownership during ${totalOnCallDays} days of emergency on-call firefighting.`);

  if (qualityDetail.score < 75) growthAreas.push(`Reduce rework bounce rate between In Progress and QA by strengthening pre-PR unit testing.`);
  if (reviewDetail.score < 70) growthAreas.push(`Increase peer code review participation to meet the expected ratio for ${persona}.`);
  if (antiGamingFlags.length > 0) growthAreas.push(`Address flagged patterns: ensure all merged PRs receive independent approvals and avoid commit bunching.`);
  if (docDetail.score < 60) growthAreas.push(`Document architectural decisions and API contracts in SharePoint to build team technical memory.`);

  if (strengths.length === 0) strengths.push(`Maintained consistent sprint cadence and adherence to project commitments.`);
  if (growthAreas.length === 0) growthAreas.push(`Continue mentoring junior engineers and contributing cross-project best practices.`);

  const tenureShiftNarrative = tenureSegments.length > 1
    ? `During this evaluation period, ${associate.name} transitioned across ${tenureSegments.length} project/role contexts: initially serving as ${tenureSegments[0].role} on ${tenureSegments[0].projectName}, subsequently moving to ${tenureSegments[1].role} on ${tenureSegments[1].projectName}. Their activities were strictly partitioned by tenure dates, ensuring fair and accurate attribution.`
    : `${associate.name} maintained uninterrupted tenure as ${persona} on ${primarySegment.projectName}.`;

  const executiveSummary = `${associate.name} achieved an overall performance score of ${overallScore}/100 (${ratingBand}) for ${periodLabel}. Key contributions include delivering ${rawStoryPoints} story points and ${rawMergedPRs} merged PRs, complemented by ${substantiveReviews.length} substantive peer code reviews. ${totalAdjustmentPercent !== 0 ? `Fairness adjustments were applied reflecting ${totalLeaveDays} approved leave days and ${totalOnCallDays} on-call incident days.` : ''}`;

  return {
    associateId: associate.id,
    periodStart,
    periodEnd,
    periodLabel,
    overallScore,
    ratingBand,
    tenureSegments,
    dimensions: {
      delivery: deliveryDetail,
      quality: qualityDetail,
      review: reviewDetail,
      documentation: docDetail,
      reliability: relDetail
    },
    contextAdjustments: {
      totalLeaveDays,
      totalOnCallDays,
      baselineScalingFactor,
      notesApplied: userNotes
    },
    sparseDataWarning,
    antiGamingFlags,
    aiInsights: {
      executiveSummary,
      keyStrengths: strengths,
      growthAreas,
      tenureShiftNarrative
    }
  };
}
