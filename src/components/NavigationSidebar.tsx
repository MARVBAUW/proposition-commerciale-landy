import React, { useState, useEffect } from 'react';
import { Home, Calculator, Wrench, DollarSign, AlertTriangle, Clock, FileText, Handshake, TrendingUp } from 'lucide-react';

interface NavigationSidebarProps {
  isDesktopMode?: boolean;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ isDesktopMode = false }) => {
  const [activeSection, setActiveSection] = useState('project-summary');
  const [showLabels, setShowLabels] = useState(false);

  const sections = [
    { id: 'project-summary', label: 'Synthèse', labelMobile: 'Synthèse', icon: FileText },
    { id: 'pricing', label: 'Coût des travaux', labelMobile: 'Coûts', icon: Calculator },
    { id: 'services', label: 'Maîtrise d\'œuvre', labelMobile: 'Services', icon: Wrench },
    { id: 'potential', label: 'Potentiel immobilier', labelMobile: 'Potentiel', icon: TrendingUp },
    { id: 'total', label: 'Récapitulatif', labelMobile: 'Total', icon: DollarSign },
    { id: 'exclusions', label: 'Exclusions', labelMobile: 'Exclusions', icon: AlertTriangle },
    { id: 'timeline', label: 'Planning', labelMobile: 'Planning', icon: Clock },
    { id: 'footer', label: 'Collaboration', labelMobile: 'Collaboration', icon: Handshake }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let currentSection = 'project-summary';
      
      // Chercher toutes les sections disponibles
      const sectionElements = [
        { id: 'project-summary', element: document.querySelector('[data-section="project-summary"]') },
        { id: 'pricing', element: document.querySelector('[data-section="pricing"]') },
        { id: 'services', element: document.querySelector('[data-section="services"]') },
        { id: 'potential', element: document.querySelector('[data-section="potential"]') },
        { id: 'total', element: document.querySelector('[data-section="total"]') },
        { id: 'exclusions', element: document.querySelector('[data-section="exclusions"]') },
        { id: 'timeline', element: document.querySelector('[data-section="timeline"]') },
        { id: 'footer', element: document.querySelector('footer') }
      ].filter(section => section.element !== null);

      // Trouver la section actuellement visible
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          // Une section est active si son top est visible ou si on a dépassé son milieu
          if (rect.top <= window.innerHeight / 2) {
            currentSection = section.id;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Si c'est la synthèse, on va tout en haut de la page
    if (sectionId === 'project-summary') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    let element: Element | null = null;
    
    // Mapping des sections avec leurs sélecteurs
    const sectionMap: { [key: string]: string } = {
      'pricing': '[data-section="pricing"]',
      'services': '[data-section="services"]',
      'potential': '[data-section="potential"]',
      'total': '[data-section="total"]',
      'exclusions': '[data-section="exclusions"]',
      'timeline': '[data-section="timeline"]',
      'footer': 'footer'
    };

    const selector = sectionMap[sectionId];
    if (selector) {
      element = document.querySelector(selector);
    }

    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const offset = 80; // Offset pour éviter le masquage par le header
      
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Version desktop - Latérale */}
      <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-30 ${isDesktopMode ? 'block' : 'hidden lg:block'}`}>
        <div className="flex flex-col items-center">
          <nav
            className="relative"
            onMouseEnter={() => setShowLabels(true)}
            onMouseLeave={() => setShowLabels(false)}
          >
            {/* Ligne verticale principale */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 transform -translate-x-1/2"></div>
            
            {/* Ligne de progression pour la section active */}
            <div 
              className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-[#c1a16a] to-[#b8a994] transform -translate-x-1/2 transition-all duration-500 ease-out"
              style={{
                height: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
              }}
            ></div>
              
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isPassed = sections.findIndex(s => s.id === activeSection) >= index;
              
              return (
                <div key={section.id} className="relative mb-6 last:mb-0">
                  <div className="flex items-center">
                    {/* Point de navigation - largeur fixe */}
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 group backdrop-blur-sm flex-shrink-0
                        ${
                          isActive
                            ? 'border-[#c1a16a] shadow-lg shadow-[#c1a16a]/30 transform scale-110'
                            : isPassed
                            ? 'border-[#b8a994] hover:border-[#c1a16a] hover:scale-105'
                            : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                        }
                      `}
                      style={{
                        backgroundColor: isActive ? '#c1a16a' : isPassed ? '#f8f9fa' : 'white',
                      }}
                      title={section.label}
                    >
                      <Icon 
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive 
                            ? 'text-white' 
                            : isPassed 
                            ? 'text-[#b8a994] group-hover:text-[#c1a16a]' 
                            : 'text-gray-500 group-hover:text-gray-700'
                        }`} 
                      />
                    </button>
                    
                    {/* Label au survol avec position absolue pour éviter le décalage */}
                    {showLabels && (
                      <div className="absolute left-12 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-20">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          {section.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Version mobile/tablette - Horizontale en bas avec titres */}
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 ${isDesktopMode ? 'hidden' : 'lg:hidden'}`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg px-4 py-3 max-w-[98vw] overflow-x-auto">
          <div className="flex items-center space-x-3 min-w-max">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isPassed = sections.findIndex(s => s.id === activeSection) >= index;
              
              return (
                <div key={section.id} className="flex flex-col items-center min-w-[60px]">
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 group flex-shrink-0 mb-1.5
                      ${
                        isActive
                          ? 'border-[#c1a16a] transform scale-110'
                          : isPassed
                          ? 'border-[#b8a994] hover:border-[#c1a16a] hover:scale-105'
                          : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      }
                    `}
                    style={{
                      backgroundColor: isActive ? '#c1a16a' : isPassed ? '#f8f9fa' : 'white',
                    }}
                    title={section.label}
                  >
                    <Icon 
                      className={`w-4 h-4 transition-all duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : isPassed 
                          ? 'text-[#b8a994] group-hover:text-[#c1a16a]' 
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`} 
                    />
                  </button>
                  
                  {/* Titre de la section */}
                  <span className={`text-[10px] leading-tight text-center transition-all duration-300 ${
                    isActive 
                      ? 'text-[#c1a16a] font-semibold' 
                      : isPassed 
                      ? 'text-[#b8a994]' 
                      : 'text-gray-500'
                  }`}>
                    {section.labelMobile}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Barre de progression horizontale pour mobile */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#c1a16a] to-[#b8a994] rounded-full transition-all duration-500"
            style={{
              width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;