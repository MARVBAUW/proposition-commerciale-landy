import React from 'react';
import { Shield, CheckCircle, Lock, AlertCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const guarantees = [
    "Assurance Responsabilité Civile Professionnelle",
    "Garantie décennale maîtrise d'œuvre",
    "Suivi jusqu'au parfait achèvement",
    "Assistance pendant la période de garantie"
  ];


  return (
    <footer className="bg-gray-50 py-12 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center">
          {/* Garanties */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm max-w-md">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
              <h2 className="text-xl font-bold" style={{ color: '#787346' }}>NOS GARANTIES</h2>
            </div>
            <div className="space-y-3">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#787346' }} />
                  <span className="text-gray-600 text-sm">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone DCE verrouillée */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-8 border-2 border-gray-400 opacity-75">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <Lock className="w-8 h-8 text-gray-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-600">SECTION DCE - CONSULTATION ENTREPRISES</h3>
              </div>
              
              <div className="flex justify-center items-center mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                <p className="text-gray-700 font-medium">Section verrouillée - Déverrouillage après validation de votre choix de solution</p>
              </div>
              
              <div className="text-gray-600 max-w-3xl mx-auto">
                <p className="mb-3">
                  Cette section contiendra :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    • Cahiers des charges détaillés par corps d'état<br/>
                    • Dossier de consultation des entreprises (DCE)<br/>
                    • Plans d'exécution définitifs<br/>
                    • Métrés et descriptifs techniques
                  </div>
                  <div className="text-left">
                    • Offres des entreprises consultées<br/>
                    • Analyse comparative des prix<br/>
                    • Planification détaillée des travaux<br/>
                    • Contrats d'entreprises finalisés
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                  <p className="text-amber-800 text-sm font-medium">
                    📋 Déverrouillage prévu : Septembre 2025 (après validation de votre solution et réalisation des plans définitifs)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm">
            <p className="text-gray-600 mb-4">
              Cette proposition est établie sur la base des éléments transmis et reste soumise à la validation des contraintes techniques et réglementaires de rénovation, notamment les autorisations de copropriété et les démarches administratives.
            </p>
            <div className="text-center">
              <img src="/Diapositive10-removebg-preview.png" alt="PROGINEER" className="mx-auto h-11 w-auto mb-2" />
              <div className="text-lg" style={{ color: '#787346' }}>Votre partenaire pour un projet réussi</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;