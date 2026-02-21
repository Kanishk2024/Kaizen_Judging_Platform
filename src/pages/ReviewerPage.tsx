import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Save, Trophy, Users, Lock, AlertCircle } from 'lucide-react';
import { useData } from '@/context/ScoresContext';
import { toast } from 'sonner';

type Step = 'setup' | 'select-org' | 'select-team' | 'verify-members' | 'scoring';

const ReviewerPage = () => {
  const navigate = useNavigate();
  const { organizations, teams, halls, criteria, getTeamsByOrg, getMembersByTeam, addScore, scores: allScores, loading, error } = useData();

  const [step, setStep] = useState<Step>('select-org');
  const [reviewerName, setReviewerName] = useState(() => localStorage.getItem('reviewerName') || '');
  const [selectedHall, setSelectedHall] = useState(() => localStorage.getItem('reviewerHallId') || '');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [membersVerified, setMembersVerified] = useState(false);
  const [scores, setScoresLocal] = useState<Record<string, number>>({});
  const [existingScore, setExistingScore] = useState<{ id: string; totalScore: number; timestamp: string } | null>(null);

  const team = teams.find((t) => t.id === selectedTeam);
  const orgTeams = selectedOrg ? getTeamsByOrg(selectedOrg) : [];
  const teamMembers = selectedTeam ? getMembersByTeam(selectedTeam) : [];

  // Check for existing non-deleted score when team is selected
  useEffect(() => {
    if (selectedTeam && reviewerName) {
      const existing = allScores.find(
        s => s.reviewerName === reviewerName.trim() && 
             s.teamId === selectedTeam && 
             !s.deleted
      );
      setExistingScore(existing ? { id: existing.id, totalScore: existing.totalScore, timestamp: existing.timestamp } : null);
    } else {
      setExistingScore(null);
    }
  }, [selectedTeam, reviewerName, allScores]);

  const handleOrgSelect = (orgId: string) => {
    setSelectedOrg(orgId);
    setSelectedTeam('');
    setMembersVerified(false);
    setScoresLocal({});
    setStep('select-team');
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
    setMembersVerified(false);
    setScoresLocal({});
    setStep('verify-members');
  };

  const handleVerify = () => {
    setMembersVerified(true);
    setStep('scoring');
  };

  const handleScoreChange = (criteriaId: string, value: string, maxMarks: number) => {
    const num = parseInt(value);
    if (value === '') {
      setScoresLocal((prev) => ({ ...prev, [criteriaId]: 0 }));
      return;
    }
    if (isNaN(num) || num < 0 || num > maxMarks) return;
    setScoresLocal((prev) => ({ ...prev, [criteriaId]: num }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleSave = async () => {
    const allFilled = criteria.every((c) => scores[c.id] !== undefined);
    if (!allFilled) {
      toast.error('Please enter marks for all criteria');
      return;
    }
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      hallId: selectedHall,
      reviewerName: reviewerName.trim(),
      organizationId: selectedOrg,
      teamId: selectedTeam,
      membersVerified: true,
      scores: { ...scores },
      totalScore,
      timestamp: new Date().toISOString(),
    };
    try {
      await addScore(entry);
      toast.success('Scores saved successfully!');
      // Reset for next team
      setSelectedOrg('');
      setSelectedTeam('');
      setMembersVerified(false);
      setScoresLocal({});
      setStep('select-org');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save scores';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-gold text-gold-foreground rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-navy px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-primary-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-gold" />
          <h1 className="text-lg font-bold text-primary-foreground">Reviewer Panel</h1>
        </div>
        {reviewerName && (
          <span className="ml-auto text-sm text-primary-foreground/70">
            {reviewerName} • {halls.find((h) => h.id === selectedHall)?.name}
          </span>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {/* Step: Select Organization */}
        {step === 'select-org' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Select Organization</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrgSelect(org.id)}
                  className="group rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground hover:border-gold hover:shadow-gold transition-all flex items-center justify-between"
                >
                  {org.name}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Select Team */}
        {step === 'select-team' && (
          <div className="space-y-4">
            <button onClick={() => setStep('select-org')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to organizations
            </button>
            <h2 className="text-2xl font-bold text-foreground">
              Select Team — {organizations.find((o) => o.id === selectedOrg)?.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {orgTeams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTeamSelect(t.id)}
                  className="group rounded-xl border border-border bg-card p-4 text-left hover:border-gold hover:shadow-gold transition-all"
                >
                  <div className="font-semibold text-card-foreground text-sm">{t.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Verify Members */}
        {step === 'verify-members' && team && (
          <div className="space-y-4">
            <button onClick={() => setStep('select-team')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to teams
            </button>
            <h2 className="text-2xl font-bold text-foreground">{team.name}</h2>

            {existingScore && (
              <div className="rounded-xl border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Score Already Submitted
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-200">
                    You have already submitted a score for this team. You cannot re-review until the organizer deletes the existing score.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <Users className="w-4 h-4 text-gold" />
                Team Members
              </div>
              {teamMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg bg-muted px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-foreground">{m.name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={!!existingScore}
              className={`w-full font-bold rounded-xl py-3 transition-opacity flex items-center justify-center gap-2 ${
                existingScore
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'gradient-gold text-gold-foreground shadow-gold hover:opacity-90'
              }`}
            >
              {existingScore ? (
                <>
                  <Lock className="w-5 h-5" />
                  Score Already Submitted
                </>
              ) : (
                'Members Verified — Proceed to Scoring'
              )}
            </button>
          </div>
        )}

        {/* Step: Scoring */}
        {step === 'scoring' && team && (
          <div className="space-y-4">
            <button onClick={() => setStep('verify-members')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{team.name}</h2>
            </div>

            {existingScore ? (
              <div className="rounded-xl border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300">Score Already Submitted</h3>
                </div>
                <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-200">
                  <p>You have already submitted a score for this team.</p>
                  <div className="bg-white dark:bg-yellow-900/40 rounded-lg p-3 space-y-1">
                    <p><span className="font-semibold">Total Score:</span> {existingScore.totalScore} / 100</p>
                    <p><span className="font-semibold">Submitted:</span> {new Date(existingScore.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-yellow-300 dark:border-yellow-700">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs">
                      You cannot change, re-review, or edit this score until it has been deleted by the organizer. 
                      Please contact the organizer if you need to make changes.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="gradient-navy px-5 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-foreground">Criteria</span>
                    <span className="text-sm font-semibold text-primary-foreground">Score</span>
                  </div>
                  {criteria.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0">
                      <div>
                        <span className="font-mono text-xs text-gold font-semibold mr-2">{c.label}</span>
                        <span className="text-sm text-card-foreground">{c.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">(max {c.maxMarks})</span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={c.maxMarks}
                        value={scores[c.id] ?? ''}
                        onChange={(e) => handleScoreChange(c.id, e.target.value, c.maxMarks)}
                        className="w-16 rounded-lg border border-input bg-background px-3 py-1.5 text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="—"
                      />
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-5 py-3 bg-muted">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-lg text-gold">{totalScore} / 100</span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full gradient-gold text-gold-foreground font-bold rounded-xl py-3 shadow-gold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Scores
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewerPage;
