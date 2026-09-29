import { PerformanceModelVersion } from '../types';

export const defaultPerformanceModels: PerformanceModelVersion[] = [
  {
    versionId: 'v2.1-2026',
    name: 'Psiog Balanced Engineering Model (2026 Standard)',
    publishedAt: '2026-01-01T00:00:00Z',
    publishedBy: 'Psiog Engineering Excellence Council',
    isActive: true,
    rationaleDocumentation: `
### Strategic Intent & Rationale
This model evaluates engineering performance holistically across 5 dimensions, calibrated by Persona (Engineer, Senior Engineer, Lead) and Offering (Cloud & DevOps, Fullstack, QA, Data).

#### Key Principles:
1. **Holistic Over Singular**: No single metric (e.g. lines of code or commit counts) dictates performance. Output is balanced with quality, collaboration, and knowledge sharing.
2. **Persona-Specific Expectations**:
   - **Engineer**: High focus on delivery execution (35%), code quality (30%), and learning rigor.
   - **Senior Engineer**: High leverage expected in substantive code reviews (25%), design documentation (15%), and quality architecture (25%).
   - **Lead**: Primary focus shifts to team enablement, review thoroughness (30%), architecture & documentation (25%), and operational stability (10%), while direct feature delivery is dialed to 15%.
3. **Offering Normalization**: Benchmarks account for domain variances (e.g., QA prioritizes test automation coverage & defect discovery over PR volume; Cloud/DevOps prioritizes infrastructure resilience and runbooks).
4. **Fairness Adjustments**: Active calendar tenure, part-time allocations, and approved manager context notes (e.g. parental leave, on-call duty) automatically scale target baselines.
    `,
    weightsByPersona: {
      'Engineer': {
        delivery: 0.35,
        quality: 0.30,
        review: 0.15,
        documentation: 0.10,
        reliability: 0.10
      },
      'Senior Engineer': {
        delivery: 0.25,
        quality: 0.25,
        review: 0.25,
        documentation: 0.15,
        reliability: 0.10
      },
      'Lead': {
        delivery: 0.15,
        quality: 0.20,
        review: 0.30,
        documentation: 0.25,
        reliability: 0.10
      }
    },
    benchmarksByOffering: {
      'Cloud & DevOps': {
        'Engineer': {
          expectedStoryPointsPerMonth: 18,
          expectedMergedPRsPerMonth: 8,
          expectedReviewsPerPR: 1.2,
          maxBugLeakRatePercent: 8,
          expectedDocsPerQuarter: 3,
          expectedTestRunsPerMonth: 10
        },
        'Senior Engineer': {
          expectedStoryPointsPerMonth: 22,
          expectedMergedPRsPerMonth: 12,
          expectedReviewsPerPR: 2.0,
          maxBugLeakRatePercent: 5,
          expectedDocsPerQuarter: 6,
          expectedTestRunsPerMonth: 15
        },
        'Lead': {
          expectedStoryPointsPerMonth: 12,
          expectedMergedPRsPerMonth: 6,
          expectedReviewsPerPR: 3.5,
          maxBugLeakRatePercent: 4,
          expectedDocsPerQuarter: 8,
          expectedTestRunsPerMonth: 12
        }
      },
      'Fullstack Web & Mobile': {
        'Engineer': {
          expectedStoryPointsPerMonth: 24,
          expectedMergedPRsPerMonth: 14,
          expectedReviewsPerPR: 1.5,
          maxBugLeakRatePercent: 10,
          expectedDocsPerQuarter: 2,
          expectedTestRunsPerMonth: 25
        },
        'Senior Engineer': {
          expectedStoryPointsPerMonth: 28,
          expectedMergedPRsPerMonth: 16,
          expectedReviewsPerPR: 2.5,
          maxBugLeakRatePercent: 6,
          expectedDocsPerQuarter: 5,
          expectedTestRunsPerMonth: 35
        },
        'Lead': {
          expectedStoryPointsPerMonth: 14,
          expectedMergedPRsPerMonth: 8,
          expectedReviewsPerPR: 4.0,
          maxBugLeakRatePercent: 5,
          expectedDocsPerQuarter: 7,
          expectedTestRunsPerMonth: 20
        }
      },
      'QA & Test Automation': {
        'Engineer': {
          expectedStoryPointsPerMonth: 20,
          expectedMergedPRsPerMonth: 10,
          expectedReviewsPerPR: 1.2,
          maxBugLeakRatePercent: 6,
          expectedDocsPerQuarter: 3,
          expectedTestRunsPerMonth: 80
        },
        'Senior Engineer': {
          expectedStoryPointsPerMonth: 24,
          expectedMergedPRsPerMonth: 14,
          expectedReviewsPerPR: 2.2,
          maxBugLeakRatePercent: 4,
          expectedDocsPerQuarter: 6,
          expectedTestRunsPerMonth: 120
        },
        'Lead': {
          expectedStoryPointsPerMonth: 12,
          expectedMergedPRsPerMonth: 7,
          expectedReviewsPerPR: 3.2,
          maxBugLeakRatePercent: 3,
          expectedDocsPerQuarter: 8,
          expectedTestRunsPerMonth: 70
        }
      },
      'Data & AI': {
        'Engineer': {
          expectedStoryPointsPerMonth: 18,
          expectedMergedPRsPerMonth: 8,
          expectedReviewsPerPR: 1.3,
          maxBugLeakRatePercent: 8,
          expectedDocsPerQuarter: 3,
          expectedTestRunsPerMonth: 20
        },
        'Senior Engineer': {
          expectedStoryPointsPerMonth: 22,
          expectedMergedPRsPerMonth: 12,
          expectedReviewsPerPR: 2.2,
          maxBugLeakRatePercent: 5,
          expectedDocsPerQuarter: 6,
          expectedTestRunsPerMonth: 30
        },
        'Lead': {
          expectedStoryPointsPerMonth: 12,
          expectedMergedPRsPerMonth: 6,
          expectedReviewsPerPR: 3.5,
          maxBugLeakRatePercent: 4,
          expectedDocsPerQuarter: 8,
          expectedTestRunsPerMonth: 25
        }
      }
    },
    antiGamingRules: {
      maxMicroCommitBurstRatio: 0.45, // if >45% of commits are under 5 lines before sprint close
      minReviewCommentLength: 6, // words
      flagSelfApproval: true,
      maxTicketBounceCount: 3
    }
  },
  {
    versionId: 'v1.0-2025',
    name: 'Psiog Legacy Output Model (2025)',
    publishedAt: '2025-01-01T00:00:00Z',
    publishedBy: 'Psiog Engineering Management',
    isActive: false,
    rationaleDocumentation: `
### Legacy Framework (Preserved for Historical Evaluations)
Heavy emphasis was previously placed on raw story point throughput and commit counts. Version 2.0 superseded this to incorporate peer code review quality, architectural documentation, and anti-gaming protection.
    `,
    weightsByPersona: {
      'Engineer': { delivery: 0.50, quality: 0.25, review: 0.10, documentation: 0.05, reliability: 0.10 },
      'Senior Engineer': { delivery: 0.40, quality: 0.25, review: 0.15, documentation: 0.10, reliability: 0.10 },
      'Lead': { delivery: 0.30, quality: 0.20, review: 0.20, documentation: 0.20, reliability: 0.10 }
    },
    benchmarksByOffering: {
      'Cloud & DevOps': {
        'Engineer': { expectedStoryPointsPerMonth: 20, expectedMergedPRsPerMonth: 10, expectedReviewsPerPR: 1.0, maxBugLeakRatePercent: 12, expectedDocsPerQuarter: 2 },
        'Senior Engineer': { expectedStoryPointsPerMonth: 25, expectedMergedPRsPerMonth: 15, expectedReviewsPerPR: 1.5, maxBugLeakRatePercent: 8, expectedDocsPerQuarter: 4 },
        'Lead': { expectedStoryPointsPerMonth: 18, expectedMergedPRsPerMonth: 10, expectedReviewsPerPR: 2.0, maxBugLeakRatePercent: 6, expectedDocsPerQuarter: 5 }
      },
      'Fullstack Web & Mobile': {
        'Engineer': { expectedStoryPointsPerMonth: 28, expectedMergedPRsPerMonth: 16, expectedReviewsPerPR: 1.0, maxBugLeakRatePercent: 12, expectedDocsPerQuarter: 1 },
        'Senior Engineer': { expectedStoryPointsPerMonth: 32, expectedMergedPRsPerMonth: 20, expectedReviewsPerPR: 1.8, maxBugLeakRatePercent: 8, expectedDocsPerQuarter: 3 },
        'Lead': { expectedStoryPointsPerMonth: 20, expectedMergedPRsPerMonth: 12, expectedReviewsPerPR: 2.5, maxBugLeakRatePercent: 6, expectedDocsPerQuarter: 4 }
      },
      'QA & Test Automation': {
        'Engineer': { expectedStoryPointsPerMonth: 22, expectedMergedPRsPerMonth: 12, expectedReviewsPerPR: 1.0, maxBugLeakRatePercent: 8, expectedDocsPerQuarter: 2, expectedTestRunsPerMonth: 60 },
        'Senior Engineer': { expectedStoryPointsPerMonth: 28, expectedMergedPRsPerMonth: 16, expectedReviewsPerPR: 1.8, maxBugLeakRatePercent: 5, expectedDocsPerQuarter: 4, expectedTestRunsPerMonth: 90 },
        'Lead': { expectedStoryPointsPerMonth: 16, expectedMergedPRsPerMonth: 9, expectedReviewsPerPR: 2.5, maxBugLeakRatePercent: 4, expectedDocsPerQuarter: 5, expectedTestRunsPerMonth: 50 }
      },
      'Data & AI': {
        'Engineer': { expectedStoryPointsPerMonth: 20, expectedMergedPRsPerMonth: 10, expectedReviewsPerPR: 1.0, maxBugLeakRatePercent: 10, expectedDocsPerQuarter: 2 },
        'Senior Engineer': { expectedStoryPointsPerMonth: 24, expectedMergedPRsPerMonth: 14, expectedReviewsPerPR: 1.8, maxBugLeakRatePercent: 7, expectedDocsPerQuarter: 4 },
        'Lead': { expectedStoryPointsPerMonth: 16, expectedMergedPRsPerMonth: 8, expectedReviewsPerPR: 2.5, maxBugLeakRatePercent: 5, expectedDocsPerQuarter: 6 }
      }
    },
    antiGamingRules: {
      maxMicroCommitBurstRatio: 0.60,
      minReviewCommentLength: 3,
      flagSelfApproval: false,
      maxTicketBounceCount: 5
    }
  }
];
