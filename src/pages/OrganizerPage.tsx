import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trophy, Shield, Trash2, Edit } from 'lucide-react';
import { useData } from '@/context/ScoresContext';
import { useState } from 'react';

const OrganizerPage = () => {
  const navigate = useNavigate();
  const { organizations, teams, halls, criteria, scores, loading, error, clearAllData } = useData();
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('organizerAdminToken') === 'organizer-admin-token';
  });

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  const clearDatabase = async () => {
    if (confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      clearAllData();
      alert('Local data cleared successfully');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Hall',
      'Reviewer',
      'Organization',
      'Team',
      ...criteria.map((c) => `${c.label} (${c.name})`),
      'Total',
      'Timestamp',
    ];

    const rows = scores.map((s) => {
      const hall = halls.find((h) => h.id === s.hallId)?.name ?? '';
      const org = organizations.find((o) => o.id === s.organizationId)?.name ?? '';
      const team = teams.find((t) => t.id === s.teamId);
      return [
        hall,
        s.reviewerName,
        org,
        team?.name ?? '',
        ...criteria.map((c) => s.scores[c.id]?.toString() ?? '0'),
        s.totalScore.toString(),
        new Date(s.timestamp).toLocaleString(),
      ];
    });

    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `judging-scores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <header className="gradient-navy px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-primary-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-gold" />
          <h1 className="text-lg font-bold text-primary-foreground">Organizer Dashboard</h1>
        </div>
        <button
          onClick={exportCSV}
          className="gradient-gold text-gold-foreground font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow-gold hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={toggleAdminMode}
          disabled={localStorage.getItem('organizerAdminToken') === 'organizer-admin-token'}
          className={`font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
            isAdminMode
              ? 'bg-red-500 text-white hover:bg-red-600 disabled:bg-green-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          } ${localStorage.getItem('organizerAdminToken') === 'organizer-admin-token' ? 'cursor-not-allowed' : ''}`}
        >
          <Shield className="w-4 h-4" />
          {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
          {localStorage.getItem('organizerAdminToken') === 'organizer-admin-token' && (
            <span className="text-xs">(Auto-enabled)</span>
          )}
        </button>
      </header>

      <main className="p-6">
        {scores.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No scores submitted yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Reviewers need to submit scores first.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="gradient-navy text-primary-foreground">
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Hall</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Reviewer</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Organization</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Team</th>
                  {criteria.map((c) => (
                    <th key={c.id} className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                      <div className="text-gold">{c.label}</div>
                      <div className="text-xs font-normal text-primary-foreground/60">{c.name}</div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-bold whitespace-nowrap text-gold">Total</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, idx) => {
                  const hall = halls.find((h) => h.id === s.hallId)?.name ?? '';
                  const org = organizations.find((o) => o.id === s.organizationId)?.name ?? '';
                  const team = teams.find((t) => t.id === s.teamId);
                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-border last:border-0 ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">{hall}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground">{s.reviewerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground">{org}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">{team?.name}</td>
                      {criteria.map((c) => (
                        <td key={c.id} className="px-3 py-3 text-center text-foreground">
                          {s.scores[c.id] ?? 0}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center font-bold text-gold text-lg">{s.totalScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isAdminMode && (
        <div className="border-t border-border bg-muted/30 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Admin Panel
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Database Operations
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Clear all local scores and reset to initial team data.
              </p>
              <button
                onClick={clearDatabase}
                className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Frontend-Only Mode</h4>
            <p className="text-sm text-yellow-700">
              This application runs in the browser with local data storage. Data persists across refresh and is only removed when you click "Clear All Data" above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerPage;
