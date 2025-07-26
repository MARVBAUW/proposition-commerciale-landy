import React from 'react';
import { Building, Users } from 'lucide-react';

interface SolutionToggleProps {
  currentSolution: 'coliving' | 'logements';
  onSolutionChange: (solution: 'coliving' | 'logements') => void;
}

const SolutionToggle: React.FC<SolutionToggleProps> = ({ currentSolution, onSolutionChange }) => {
  return (
    <div className="mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#787346' }}>
            Solutions d'aménagement
          </h3>
          <p className="text-gray-600 text-sm">
            Chaque solution a une estimation financière et un potentiel immobilier différents
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          {/* Option Coliving */}
          <button
            onClick={() => onSolutionChange('coliving')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
              currentSolution === 'coliving'
                ? 'border-[#c1a16a] bg-[#c1a16a] text-white shadow-lg transform scale-105'
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#c1a16a] hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <Users className={`w-6 h-6 mr-2 ${
                currentSolution === 'coliving' ? 'text-white' : 'text-[#c1a16a]'
              }`} />
              <span className="font-semibold text-lg">COLIVING</span>
            </div>
            <div className="text-sm">
              <div className="font-medium mb-1">4-5 chambres sur 3 niveaux</div>
              <div className="opacity-90">
                Espaces partagés • Cuisine commune • Optimisation locative
              </div>
            </div>
          </button>

          {/* Option 3 logements */}
          <button
            onClick={() => onSolutionChange('logements')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
              currentSolution === 'logements'
                ? 'border-[#c1a16a] bg-[#c1a16a] text-white shadow-lg transform scale-105'
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#c1a16a] hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <Building className={`w-6 h-6 mr-2 ${
                currentSolution === 'logements' ? 'text-white' : 'text-[#c1a16a]'
              }`} />
              <span className="font-semibold text-lg">3 LOGEMENTS</span>
            </div>
            <div className="text-sm">
              <div className="font-medium mb-1">1 logement par niveau</div>
              <div className="opacity-90">
                Indépendance totale • Réversibilité • Vente séparée possible
              </div>
            </div>
          </button>
        </div>

        {/* Indicateur de solution active */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
            <div className="w-2 h-2 rounded-full bg-[#c1a16a] mr-2"></div>
            <span className="text-sm font-medium text-gray-700">
              Solution active : <span style={{ color: '#c1a16a' }}>
                {currentSolution === 'coliving' ? 'Coliving 4-5 chambres' : '3 logements indépendants'}
              </span>
            </span>
          </div>
        </div>

        {/* Note importante */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <div className="w-4 h-4 rounded-full bg-amber-400 mt-0.5 mr-3 flex-shrink-0"></div>
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">Réversibilité garantie</div>
              <div>
                La solution Coliving est conçue pour pouvoir être facilement transformée en 3 logements 
                distincts si vos besoins évoluent. Plans de réversibilité inclus dans les documents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionToggle;