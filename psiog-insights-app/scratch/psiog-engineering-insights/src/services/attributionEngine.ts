import {
  Associate,
  Project,
  ProjectRoleAssignment,
  Persona,
  TenureAttributionSegment
} from '../types';

export interface AttributionResult {
  projectId: string;
  projectName: string;
  role: Persona;
  allocationPercentage: number;
}

/**
 * Attributes an activity to the specific project and role the associate held
 * on the exact date/timestamp of the activity.
 */
export function attributeActivityToProjectAndRole(
  associateId: string,
  activityTimestamp: string,
  roleAssignments: ProjectRoleAssignment[],
  projects: Project[]
): AttributionResult | null {
  const actDate = new Date(activityTimestamp).getTime();

  // Find the role assignment that covers this timestamp
  const assignment = roleAssignments.find(ra => {
    if (ra.associateId !== associateId) return false;
    const start = new Date(ra.startDate).getTime();
    const end = ra.endDate ? new Date(ra.endDate).getTime() : Infinity;
    return actDate >= start && actDate <= end;
  });

  if (!assignment) return null;

  const project = projects.find(p => p.id === assignment.projectId);
  return {
    projectId: assignment.projectId,
    projectName: project ? project.name : assignment.projectId,
    role: assignment.role,
    allocationPercentage: assignment.allocationPercentage
  };
}

/**
 * Calculates the time-bound tenure segments for an associate over a chosen date range.
 * If an associate changed project or role during the period, returns multiple segments.
 */
export function calculateTenureSegments(
  associateId: string,
  periodStart: string,
  periodEnd: string,
  roleAssignments: ProjectRoleAssignment[],
  projects: Project[]
): TenureAttributionSegment[] {
  const windowStart = new Date(periodStart).getTime();
  const windowEnd = new Date(periodEnd).getTime();

  const userAssignments = roleAssignments.filter(ra => ra.associateId === associateId);

  const segments: TenureAttributionSegment[] = [];

  for (const ra of userAssignments) {
    const raStart = new Date(ra.startDate).getTime();
    const raEnd = ra.endDate ? new Date(ra.endDate).getTime() : Infinity;

    // Overlap calculation
    const overlapStart = Math.max(windowStart, raStart);
    const overlapEnd = Math.min(windowEnd, raEnd);

    if (overlapStart <= overlapEnd) {
      const activeCalendarDays = Math.max(1, Math.round((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1);
      // Rough working days (5/7th)
      const effectiveWorkingDays = Math.round(activeCalendarDays * (5 / 7) * (ra.allocationPercentage / 100));

      const project = projects.find(p => p.id === ra.projectId);

      segments.push({
        projectId: ra.projectId,
        projectName: project ? project.name : ra.projectId,
        offering: project ? project.offering : 'Cloud & DevOps',
        role: ra.role,
        startDate: new Date(overlapStart).toISOString().split('T')[0],
        endDate: new Date(overlapEnd).toISOString().split('T')[0],
        activeCalendarDays,
        allocationPercentage: ra.allocationPercentage,
        effectiveWorkingDays,
        segmentOverallScore: 0, // Populated after scoring
        activitiesCount: {
          tickets: 0,
          prs: 0,
          reviews: 0,
          tests: 0,
          docs: 0
        }
      });
    }
  }

  return segments;
}
