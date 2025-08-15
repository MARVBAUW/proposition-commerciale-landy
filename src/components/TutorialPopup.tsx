import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Smartphone, Monitor, Table, MousePointer2, Clock } from 'lucide-react';

interface TutorialPopupProps {
  isDesktopMode?: boolean;
  onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ isDesktopMode = false, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('progineer-landy-tutorial-seen');
    if (!tutorialSeen) {
      setIsVisible(true);
    }
  }, []);

  const tutorialSteps = [
    {
      title: "Bienvenue dans votre proposition !",
      content: "Ce guide rapide vous aidera à explorer toutes les fonctionnalités de cette proposition commerciale interactive. Cette application mobile restera disponible pendant toute la durée de votre projet pour vous permettre de suivre l'avancement du bout des doigts.",
      icon: <MousePointer2 className="w-6 h-6 text-[#c1a16a]" />,
      highlight: null
    },
    {
      title: "Mode d'affichage (Mobile)",
      content: "Sur mobile, ce bouton vous permet de basculer entre un affichage adapté au mobile et un mode 'Desktop' pour voir la version complète sans défilement horizontal.",
      icon: isDesktopMode ? <Smartphone className="w-6 h-6 text-[#c1a16a]" /> : <Monitor className="w-6 h-6 text-[#c1a16a]" />,
      highlight: "#toggle-button-container"
    },
    {
      title: "Navigation rapide",
      content: "Utilisez la barre latérale (ou la barre du bas sur mobile) pour naviguer rapidement entre les différentes sections de la proposition (Synthèse, Coûts, Planning...).",
      icon: <MousePointer2 className="w-6 h-6 text-[#c1a16a]" />,
      highlight: "#navigation-sidebar"
    },
    {
      title: "Télécharger le PDF",
      content: "Cliquez sur ce bouton pour télécharger une version PDF complète et imprimable de cette proposition commerciale.",
      icon: <Download className="w-6 h-6 text-[#c1a16a]" />,
      highlight: "#download-pdf-button"
    },
    {
      title: "Tableaux et chiffres",
      content: "Certains tableaux contiennent beaucoup d'informations. Sur mobile, vous pouvez les faire défiler horizontalement pour voir toutes les colonnes.",
      icon: <Table className="w-6 h-6 text-[#c1a16a]" />,
      highlight: ".overflow-x-auto"
    },
    {
      title: "Application mobile dédiée",
      content: "Cette application reste accessible pendant toute la durée de votre projet. Vous pourrez suivre l'avancement des travaux, consulter les documents et communiquer avec l'équipe à chaque phase : conception, démarches administratives, chantier et réception.",
      icon: <Clock className="w-6 h-6 text-[#c1a16a]" />,
      highlight: null
    },
    {
      title: "Prêt à explorer !",
      content: "Vous avez maintenant toutes les clés pour une exploration optimale. N'hésitez pas à nous contacter pour toute question.",
      icon: <MousePointer2 className="w-6 h-6 text-[#c1a16a]" />,
      highlight: null
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
    localStorage.setItem('progineer-landy-tutorial-seen', 'true');
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const currentHighlight = tutorialSteps[currentStep].highlight;
    if (currentHighlight) {
      const elements = document.querySelectorAll(currentHighlight);
      elements.forEach(el => {
        el.classList.add('tutorial-highlight');
      });
      return () => {
        elements.forEach(el => {
          el.classList.remove('tutorial-highlight');
        });
      };
    }
  }, [currentStep, tutorialSteps]);

  if (!isVisible) return null;

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000]" onClick={handleClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-[10001] w-11/12 max-w-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{currentStepData.title}</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-[#c1a16a] h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex items-center justify-center mb-4">
          {currentStepData.icon}
        </div>

        <p className="text-gray-600 text-center mb-6">{currentStepData.content}</p>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Précédent
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-[#c1a16a] text-white rounded-lg flex items-center"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Terminer' : 'Suivant'} <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      <style>{`
        .tutorial-highlight {
          box-shadow: 0 0 0 4px rgba(193, 161, 106, 0.5), 0 0 0 8px rgba(193, 161, 106, 0.3);
          transition: box-shadow 0.3s ease-in-out;
          z-index: 10002;
          position: relative;
        }
      `}</style>
    </>
  );
};

export default TutorialPopup;