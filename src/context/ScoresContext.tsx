import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ScoreEntry } from '@/data/mockData';

interface ScoresContextType {
  scores: ScoreEntry[];
  addScore: (entry: ScoreEntry) => void;
}

const ScoresContext = createContext<ScoresContextType | undefined>(undefined);

export const ScoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scores, setScores] = useState<ScoreEntry[]>(() => {
    const saved = localStorage.getItem('judging-scores');
    return saved ? JSON.parse(saved) : [];
  });

  const addScore = useCallback((entry: ScoreEntry) => {
    setScores((prev) => {
      // Replace if same reviewer + team combo exists
      const filtered = prev.filter(
        (s) => !(s.teamId === entry.teamId && s.reviewerName === entry.reviewerName && s.hallId === entry.hallId)
      );
      const updated = [...filtered, entry];
      localStorage.setItem('judging-scores', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ScoresContext.Provider value={{ scores, addScore }}>
      {children}
    </ScoresContext.Provider>
  );
};

export function useScores() {
  const ctx = useContext(ScoresContext);
  if (!ctx) throw new Error('useScores must be used within ScoresProvider');
  return ctx;
}
