import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Détecter si l'app est déjà installée (mode standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Écouter l'événement beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Afficher le prompt seulement sur mobile et si pas déjà installé
      if (window.innerWidth <= 768 && !standalone) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Pour iOS, afficher le prompt si on est sur mobile et pas en standalone
    if (iOS && window.innerWidth <= 768 && !standalone) {
      setShowInstallPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Mémoriser le choix pour ne pas afficher à nouveau pendant cette session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Ne pas afficher si déjà installé ou si dismissé
  if (isStandalone || sessionStorage.getItem('installPromptDismissed') || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#c1a16a] to-[#b8a994] text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <div className="flex items-center space-x-3 flex-1">
          <img 
            src="/Diapositive10-removebg-preview.png" 
            alt="PROGINEER" 
            className="w-8 h-8 rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold">Installer l'app PROGINEER</p>
            <p className="text-xs opacity-90">
              {isIOS 
                ? "Appuyez sur  puis \"Sur l'écran d'accueil\"" 
                : "Accès direct depuis votre écran d'accueil"
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="bg-white text-[#c1a16a] px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Installer</span>
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-black/10 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;