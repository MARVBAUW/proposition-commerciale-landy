import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface InstallPromptProps {
  // Props if any
}

const InstallPrompt: React.FC<InstallPromptProps> = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé le prompt dans cette session
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e);
      setShowInstallButton(true); // Show your custom install button
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed (optional, but good for UX)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setShowInstallButton(false); // Already installed
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the browser's install prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallButton(false); // Hide button after prompt
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowInstallButton(false);
    // Enregistrer en localStorage pour ne plus afficher pendant cette session
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (!showInstallButton || isDismissed) {
    return null; // Don't render if no prompt is available, already installed, or dismissed
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#c1a16a] text-white p-3 rounded-lg shadow-lg z-[10000] flex items-center space-x-3 max-w-[95vw]">
      <p className="text-sm flex-1 whitespace-nowrap overflow-hidden text-ellipsis">Installez cette app pour une meilleure expérience !</p>
      <button onClick={handleInstallClick} className="bg-white text-[#c1a16a] px-3 py-2 rounded-md font-semibold text-sm whitespace-nowrap flex-shrink-0">
        Installer
      </button>
      <button 
        onClick={handleDismiss} 
        className="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0"
        title="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default InstallPrompt;