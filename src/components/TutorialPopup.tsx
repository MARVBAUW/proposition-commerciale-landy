import React, { useState, useEffect } from 'react';
import { X, Monitor, Smartphone, Download, ArrowLeftRight, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface TutorialPopupProps {
  isDesktopMode?: boolean;
  onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ isDesktopMode = false, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tutorialSteps = [
    {
      title: "Bienvenue dans votre proposition !",
      content: "Ce tutoriel va vous expliquer comment naviguer facilement sur mobile et accéder à tous les documents.",
      icon: <FileText className="w-8 h-8 text-[#c1a16a]" />,
      highlight: null
    },
    {
      title: "Basculer entre les modes d'affichage",
      content: "Utilisez le bouton en haut à droite pour passer du mode mobile au mode desktop. Le mode desktop vous donne une vue plus large des tableaux.",
      icon: isDesktopMode ? <Smartphone className="w-8 h-8 text-[#c1a16a]" /> : <Monitor className="w-8 h-8 text-[#c1a16a]" />,
      highlight: "#toggle-button-container"
    },
    {
      title: "Navigation dans les tableaux",
      content: "En mode mobile, faites glisser les tableaux horizontalement pour voir toutes les colonnes. Utilisez votre doigt pour faire défiler de gauche à droite.",
      icon: <ArrowLeftRight className="w-8 h-8 text-[#c1a16a]" />,
      highlight: ".overflow-x-auto"
    },
    {
      title: "Télécharger les documents",
      content: "Cliquez sur 'Télécharger PDF' dans l'en-tête pour la proposition complète, ou naviguez vers la section 'Documents' pour accéder aux plans et fichiers administratifs.",
      icon: <Download className="w-8 h-8 text-[#c1a16a]" />,
      highlight: "a[href*='.pdf'], button[title*='Télécharger']"
    },
    {
      title: "Navigation rapide",
      content: "Utilisez la barre de navigation en bas (mobile) ou sur le côté (desktop) pour accéder rapidement aux différentes sections du projet.",
      icon: <ChevronRight className="w-8 h-8 text-[#c1a16a]" />,
      highlight: ".fixed.bottom-4, .fixed.left-4"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Stocker en cache que le tutoriel a été vu
    localStorage.setItem('progineer-tutorial-seen', 'true');
    setIsVisible(false);
    setTimeout(onClose, 300); // Attendre la fin de l'animation
  };

  const handleSkip = () => {
    handleClose();
  };

  useEffect(() => {
    // Ajouter une classe de highlight si spécifié
    const currentHighlight = tutorialSteps[currentStep].highlight;
    if (currentHighlight) {
      const elements = document.querySelectorAll(currentHighlight);
      elements.forEach(el => {
        el.classList.add('tutorial-highlight');
      });

      // Nettoyer les highlights précédents
      return () => {
        elements.forEach(el => {
          el.classList.remove('tutorial-highlight');
        });
      };
    }
  }, [currentStep]);

  if (!isVisible) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[10000] ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-2xl shadow-2xl z-[10001] transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {currentStepData.icon}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Guide d'utilisation</h2>
              <p className="text-sm text-gray-500">Étape {currentStep + 1} sur {tutorialSteps.length}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#c1a16a] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            {currentStepData.content}
          </p>

          {/* Visual indicator for current step */}
          {currentStep === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#c1a16a] mr-2"></div>
                <span className="text-sm text-blue-800">
                  Regardez en haut à droite de votre écran !
                </span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center">
                <ArrowLeftRight className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-sm text-green-800">Glissez horizontalement ←→</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Passer le tutoriel
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </button>

            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-[#c1a16a] text-white rounded-lg font-medium hover:bg-[#b8a994] transition-colors"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Terminer' : 'Suivant'}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les highlights */}
      <style>{`
        .tutorial-highlight {
          position: relative;
          z-index: 9999 !important;
        }
        
        .tutorial-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: rgba(193, 161, 106, 0.3);
          border: 2px solid #c1a16a;
          border-radius: 8px;
          animation: pulse-highlight 2s infinite;
          pointer-events: none;
          z-index: -1;
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        
        /* Assurer que les éléments fixes restent au-dessus */
        #toggle-button-container {
          z-index: 99999 !important;
        }
      `}</style>
    </>
  );
};

export default TutorialPopup;