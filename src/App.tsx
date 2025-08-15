import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProjectSummary from './components/ProjectSummary';
import PricingBreakdown from './components/PricingBreakdown';
import Services from './components/Services';
import TotalSummary from './components/TotalSummary';
import Exclusions from './components/Exclusions';
import Timeline from './components/Timeline';
import DocumentsSection from './components/DocumentsSection';
import NavigationSidebar from './components/NavigationSidebar';
import InstallPrompt from './components/InstallPrompt';
import TutorialPopup from './components/TutorialPopup';
import Footer from './components/Footer';
import { Monitor, Smartphone } from 'lucide-react';
// Stagewise imports - Commented out for now due to plugin issues
// import { StagewiseToolbar } from '@stagewise/toolbar-react';
// import ReactPlugin from '@stagewise-plugins/react';

function App() {
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Détecter si on est sur un device mobile ou une fenêtre étroite
    const checkMobile = () => {
      const realScreenWidth = window.screen.width;
      const viewportWidth = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Afficher le bouton si :
      // - Device mobile réel OU viewport étroit avec tactile OU viewport très étroit (dev/test)
      const showMobileToggle = (realScreenWidth < 768 && isTouchDevice && isMobileUA) || 
                              (viewportWidth < 768 && isTouchDevice) ||
                              (viewportWidth < 640); // Forcer sur très petits écrans
      setIsMobile(showMobileToggle);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Vérifier si le tutoriel doit être affiché
    const tutorialSeen = localStorage.getItem('progineer-landy-tutorial-seen');
    if (!tutorialSeen) {
      // Afficher le tutoriel après un court délai pour laisser la page se charger
      setTimeout(() => setShowTutorial(true), 1000);
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleDesktopMode = () => {
    const newMode = !isDesktopMode;
    setIsDesktopMode(newMode);
    
    // Forcer le dézoom sur mobile quand on passe en mode desktop
    if (newMode && isMobile) {
      // Attendre que le CSS soit appliqué avant de dézoomer
      setTimeout(() => {
        // Forcer le viewport à être plus large pour dézoomer modérément
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=1200, initial-scale=0.65, maximum-scale=3.0, user-scalable=yes');
        }
      }, 100);
    } else {
      // Restaurer le viewport normal en mode responsive
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${isDesktopMode ? 'force-desktop' : ''}`}>
      {/* {import.meta.env.DEV && (
        <StagewiseToolbar config={{ plugins: [ReactPlugin()] }} />
      )} */}
      
      {/* Bouton de basculement mode desktop/mobile - visible sur mobiles et tablettes */}
      {isMobile && (
        <div 
          id="toggle-button-container"
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: 99999,
            transform: isDesktopMode ? 'scale(1.8)' : 'scale(1)',
            transformOrigin: 'top right',
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={toggleDesktopMode}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              border: '4px solid #c1a16a',
              backgroundColor: isDesktopMode ? '#c1a16a' : 'rgba(255,255,255,0.95)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
            title={isDesktopMode ? "Passer en mode mobile" : "Passer en mode desktop"}
          >
            {isDesktopMode ? (
              <Smartphone size={16} color="white" strokeWidth={2} />
            ) : (
              <Monitor size={20} color="#c1a16a" strokeWidth={2} />
            )}
          </button>
        </div>
      )}

      <NavigationSidebar isDesktopMode={isDesktopMode} />
      
      {/* Contenu principal avec padding pour éviter le chevauchement */}
      <div className={`${isDesktopMode ? 'pl-16 pb-0' : 'lg:pl-16 pb-20 lg:pb-0'}`}>
        <Header isDesktopMode={isDesktopMode} />
        <div data-section="project-summary">
          <ProjectSummary />
        </div>
        <div data-section="pricing">
          <PricingBreakdown />
        </div>
        <div data-section="services">
          <Services />
        </div>
        <div data-section="total">
          <TotalSummary />
        </div>
        <div data-section="exclusions">
          <Exclusions />
        </div>
        <div data-section="timeline">
          <Timeline />
        </div>
        <div data-section="documents">
          <DocumentsSection />
        </div>
        <Footer />
      </div>
      
      {/* Styles CSS pour forcer le mode desktop - rendu fidèle au web */}
      {isDesktopMode && (
        <style>{`
          .force-desktop {
            min-width: 1200px !important;
            overflow-x: auto !important;
            font-size: 16px !important;
          }
          
          /* Forcer TOUTES les classes lg: à s'appliquer sur mobile */
          @media (max-width: 1023px) {
            .force-desktop .sm\\:py-8 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
            .force-desktop .sm\\:px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
            .force-desktop .sm\\:mb-6 { margin-bottom: 1.5rem !important; }
            .force-desktop .sm\\:space-x-3 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.75rem !important; }
            .force-desktop .sm\\:h-16 { height: 4rem !important; }
            .force-desktop .sm\\:text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
            .force-desktop .sm\\:text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .force-desktop .sm\\:text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            .force-desktop .sm\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
            .force-desktop .sm\\:gap-6 { gap: 1.5rem !important; }
            .force-desktop .sm\\:p-6 { padding: 1.5rem !important; }
            .force-desktop .sm\\:w-5 { width: 1.25rem !important; }
            .force-desktop .sm\\:h-5 { height: 1.25rem !important; }
            .force-desktop .sm\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            
            .force-desktop .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .force-desktop .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .force-desktop .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            
            .force-desktop .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .force-desktop .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .force-desktop .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            .force-desktop .lg\\:flex-row { flex-direction: row !important; }
            .force-desktop .lg\\:block { display: block !important; }
            .force-desktop .lg\\:hidden { display: none !important; }
            /* S'assurer que le bouton toggle reste visible */
            #toggle-button-container {
              position: fixed !important;
              top: 20px !important;
              right: 20px !important;
              z-index: 99999 !important;
              pointer-events: auto !important;
            }
            .force-desktop .lg\\:text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
            .force-desktop .lg\\:text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            .force-desktop .lg\\:text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .force-desktop .lg\\:text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .force-desktop .lg\\:p-6 { padding: 1.5rem !important; }
            .force-desktop .lg\\:p-8 { padding: 2rem !important; }
            .force-desktop .lg\\:py-12 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
            .force-desktop .lg\\:px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
            .force-desktop .lg\\:mb-8 { margin-bottom: 2rem !important; }
            .force-desktop .lg\\:mb-6 { margin-bottom: 1.5rem !important; }
            .force-desktop .lg\\:gap-8 { gap: 2rem !important; }
            .force-desktop .lg\\:gap-6 { gap: 1.5rem !important; }
            .force-desktop .lg\\:space-x-6 > :not([hidden]) ~ :not([hidden]) { margin-left: 1.5rem !important; }
            .force-desktop .lg\\:w-5 { width: 1.25rem !important; }
            .force-desktop .lg\\:h-5 { height: 1.25rem !important; }
            .force-desktop .lg\\:w-6 { width: 1.5rem !important; }
            .force-desktop .lg\\:h-6 { height: 1.5rem !important; }
            
            /* Navigation */
            .force-desktop .lg\\:pl-16 { padding-left: 4rem !important; }
            .force-desktop .lg\\:pb-0 { padding-bottom: 0 !important; }
            
            /* Tableaux */
            .force-desktop .min-w-\\[600px\\] { min-width: 600px !important; }
            
            /* Text sizes spécifiques */
            .force-desktop .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            .force-desktop .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .force-desktop .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
            .force-desktop .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .force-desktop .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .force-desktop .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            .force-desktop .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
          }
        `}</style>
      )}
      
      {/* Install Prompt PWA */}
      <InstallPrompt />
      
      {/* Tutorial Popup */}
      {showTutorial && (
        <TutorialPopup 
          isDesktopMode={isDesktopMode}
          onClose={() => setShowTutorial(false)} 
        />
      )}
    </div>
  );
}

export default App;