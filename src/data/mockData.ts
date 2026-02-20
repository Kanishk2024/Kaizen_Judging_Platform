// Organizations
export const organizations = Array.from({ length: 20 }, (_, i) => ({
  id: `org-${i + 1}`,
  name: `Company ${i + 1}`,
}));

// Reviewers
export const reviewers = Array.from({ length: 20 }, (_, i) => ({
  id: `reviewer-${i + 1}`,
  username: `Jury-${String(i + 1).padStart(2, '0')}`,
  password: 'India@2026',
  name: `Judge ${i + 1}`,
  hallId: `hall-${Math.floor(i / 4) + 1}`, // 4 reviewers per hall
}));

// Teams - 6 per organization
export const teams = Array.from({ length: 120 }, (_, i) => {
  const orgIndex = Math.floor(i / 6);
  return {
    id: `team-${i + 1}`,
    name: `Team ${i + 1}`,
    organizationId: organizations[orgIndex].id,
    projectTitle: `Project ${i + 1} — ${['Smart Analytics', 'AI Assistant', 'Health Tracker', 'EcoMonitor', 'FinFlow', 'EduBot'][i % 6]}`,
    members: Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, j) => ({
      id: `member-${i + 1}-${j + 1}`,
      name: `Member ${j + 1} of Team ${i + 1}`,
    })),
  };
});

// Halls
export const halls = Array.from({ length: 5 }, (_, i) => ({
  id: `hall-${i + 1}`,
  name: `Hall ${i + 1}`,
}));

// Criteria (KAIZEN Competition)
export const criteria = [
  { id: 'c1', label: 'C1', name: 'Problem Definition', maxMarks: 10 },
  { id: 'c2', label: 'C2', name: 'Severity of Problem', maxMarks: 10 },
  { id: 'c3', label: 'C3', name: 'Tools Used', maxMarks: 10 },
  { id: 'c4', label: 'C4', name: 'Counter Measures', maxMarks: 15 },
  { id: 'c5', label: 'C5', name: 'Creativity', maxMarks: 15 },
  { id: 'c6', label: 'C6', name: 'Solution & Benefits', maxMarks: 10 },
  { id: 'c7', label: 'C7', name: 'Implementation', maxMarks: 10 },
  { id: 'c8', label: 'C8', name: 'Standardization & Horizontal Deployment', maxMarks: 10 },
  { id: 'c9', label: 'C9', name: 'Presentation & Time Management', maxMarks: 5 },
  { id: 'c10', label: 'C10', name: 'Question & Answers', maxMarks: 5 },
];

// Score entry
export interface ScoreEntry {
  id: string;
  hallId: string;
  reviewerName: string;
  organizationId: string;
  teamId: string;
  membersVerified: boolean;
  scores: Record<string, number>; // criteriaId -> score
  totalScore: number;
  timestamp: string;
}

// Helper to get teams by org
export function getTeamsByOrg(orgId: string) {
  return teams.filter((t) => t.organizationId === orgId);
}
