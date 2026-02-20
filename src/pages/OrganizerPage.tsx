import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trophy } from 'lucide-react';
import { organizations, teams, halls, criteria } from '@/data/mockData';
import { useScores } from '@/context/ScoresContext';

const OrganizerPage = () => {
  const navigate = useNavigate();
  const { scores } = useScores();

  const exportCSV = () => {
    const headers = [
      'Hall',
      'Reviewer',
      'Organization',
      'Team',
      'Project Title',
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
        team?.projectTitle ?? '',
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
          className="ml-auto gradient-gold text-gold-foreground font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow-gold hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Export CSV
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
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Project</th>
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
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground max-w-[200px] truncate">
                        {team?.projectTitle}
                      </td>
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
    </div>
  );
};

export default OrganizerPage;
