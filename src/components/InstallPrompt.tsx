import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Reset the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);

    // Optionally, send analytics event with outcome
    console.log(`User response to install prompt: ${outcome}`);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground mb-1">
            Install NIQR Kaizen Competition
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Install this app on your device for a better experience with offline access.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="gradient-gold text-gold-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
            >
              Later
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;