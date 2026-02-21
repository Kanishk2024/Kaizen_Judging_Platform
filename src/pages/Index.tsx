import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-navy flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold shadow-gold mb-6">
          <img src="/Logo.jpeg" alt="NIQR Kaizen Competition Logo" className="w-12 h-12 object-contain" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-3 tracking-tight">
          NIQR Kaizen Competition
        </h1>
        <p className="text-navy-light text-lg" style={{ color: 'hsl(220, 20%, 65%)' }}>
          Competition Scoring Platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        <button
          onClick={() => navigate('/reviewer/login')}
          className="group relative flex flex-col items-center gap-4 rounded-2xl p-8 bg-card shadow-card border border-border hover:shadow-gold hover:border-gold transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
            <ClipboardCheck className="w-7 h-7 text-gold-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Reviewer</h2>
            <p className="text-sm text-muted-foreground mt-1">Score teams as a panel member</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/organizer/login')}
          className="group relative flex flex-col items-center gap-4 rounded-2xl p-8 bg-card shadow-card border border-border hover:shadow-gold hover:border-gold transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
            <BarChart3 className="w-7 h-7 text-gold-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Organizer</h2>
            <p className="text-sm text-muted-foreground mt-1">View scores, export & clear data</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Index;
