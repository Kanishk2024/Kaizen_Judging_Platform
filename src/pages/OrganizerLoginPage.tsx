import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OrganizerLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Validate credentials
    if (username === 'Organiser-01' && password === 'India@2026') {
      localStorage.setItem('organizerUsername', username);
      localStorage.setItem('organizerAdminToken', 'organizer-admin-token'); // Grant admin access
      navigate('/organizer');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen gradient-navy flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold shadow-gold mb-6">
          <BarChart3 className="w-8 h-8 text-gold-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-3 tracking-tight">
          NIQR Kaizen Competition
        </h1>
        <p className="text-navy-light text-lg" style={{ color: 'hsl(220, 20%, 65%)' }}>
          Organizer Login
        </p>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-primary-foreground">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card border-border text-card-foreground placeholder:text-muted-foreground pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-gold hover:opacity-90 text-gold-foreground font-semibold py-3"
          >
            Sign In as Organizer
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-navy-light text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gold hover:underline font-medium"
            >
              Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLoginPage;