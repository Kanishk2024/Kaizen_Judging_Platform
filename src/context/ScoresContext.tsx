import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ScoreEntry } from '@/data/mockData';
import { mockOrganizations, mockTeams, mockMembers } from '@/data/excelData';
import { halls as mockHalls, reviewers as mockReviewers, criteria as mockCriteria } from '@/data/mockData';

const STORAGE_KEYS = {
  scores: 'scoreboard_scores',
  organizations: 'scoreboard_organizations',
  teams: 'scoreboard_teams',
  members: 'scoreboard_members',
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

interface Organization {
  id: string;
  name: string;
  gst?: string;
  tax_no?: string;
}

interface Team {
  id: string;
  name: string;
  organizationId: string;
  projectTitle?: string;
}

interface Member {
  id: string;
  name: string;
  teamId: string;
}

interface Hall {
  id: string;
  name: string;
}

interface Reviewer {
  id: string;
  username: string;
  password: string;
  name: string;
  hallId: string;
}

interface Criterion {
  id: string;
  label: string;
  name: string;
  maxMarks: number;
}

interface DataContextType {
  organizations: Organization[];
  teams: Team[];
  members: Member[];
  halls: Hall[];
  reviewers: Reviewer[];
  criteria: Criterion[];
  scores: ScoreEntry[];
  loading: boolean;
  error: string | null;
  addScore: (entry: ScoreEntry) => Promise<void>;
  deleteScore: (scoreId: string) => Promise<void>;
  fetchData: () => Promise<void>;
  clearAllData: () => void;
  getTeamsByOrg: (orgId: string) => Team[];
  getMembersByTeam: (teamId: string) => Member[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE = 'http://localhost:3001/api';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persist to localStorage so data survives refresh; only organiser clear removes it
  const [organizations, setOrganizations] = useState<Organization[]>(() =>
    loadFromStorage(STORAGE_KEYS.organizations, mockOrganizations)
  );
  const [teams, setTeams] = useState<Team[]>(() =>
    loadFromStorage(STORAGE_KEYS.teams, mockTeams)
  );
  const [members, setMembers] = useState<Member[]>(() =>
    loadFromStorage(STORAGE_KEYS.members, mockMembers)
  );
  const [halls] = useState<Hall[]>(mockHalls);
  const [reviewers] = useState<Reviewer[]>(mockReviewers);
  const [criteria] = useState<Criterion[]>(mockCriteria);

  const [scores, setScores] = useState<ScoreEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.scores, [])
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Persist to localStorage when data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.organizations, organizations);
    saveToStorage(STORAGE_KEYS.teams, teams);
    saveToStorage(STORAGE_KEYS.members, members);
  }, [organizations, teams, members]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.scores, scores);
  }, [scores]);

  const fetchData = useCallback(async () => {
    // No API calls - using local persisted data
  }, []);

  const addScore = useCallback(async (entry: ScoreEntry) => {
    setScores(prev => {
      // Check if a non-deleted score already exists for this reviewer + team combination
      const existingScore = prev.find(
        s => s.reviewerName === entry.reviewerName && 
             s.teamId === entry.teamId && 
             !s.deleted
      );
      if (existingScore) {
        throw new Error('A score already exists for this team. It must be deleted by the organizer before you can re-review.');
      }
      return [...prev, { ...entry, deleted: false }];
    });
  }, []);

  const deleteScore = useCallback(async (scoreId: string) => {
    setScores(prev => 
      prev.map(score => 
        score.id === scoreId ? { ...score, deleted: true } : score
      )
    );
  }, []);

  const clearAllData = useCallback(() => {
    setOrganizations(mockOrganizations);
    setTeams(mockTeams);
    setMembers(mockMembers);
    setScores([]);
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        if (typeof window !== 'undefined') localStorage.removeItem(key);
      } catch {
        // ignore
      }
    });
  }, []);

  const getTeamsByOrg = useCallback((orgId: string) => {
    return teams.filter((t) => t.organizationId === orgId);
  }, [teams]);

  const getMembersByTeam = useCallback((teamId: string) => {
    return members.filter((m) => m.teamId === teamId);
  }, [members]);

  return (
    <DataContext.Provider value={{
      organizations,
      teams,
      members,
      halls,
      reviewers,
      criteria,
      scores,
      loading,
      error,
      addScore,
      deleteScore,
      fetchData,
      clearAllData,
      getTeamsByOrg,
      getMembersByTeam,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

// Legacy compatibility - keep useScores for backward compatibility
export const ScoresProvider = DataProvider;
export function useScores() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useScores must be used within ScoresProvider');
  return {
    scores: ctx.scores,
    addScore: ctx.addScore,
  };
}
