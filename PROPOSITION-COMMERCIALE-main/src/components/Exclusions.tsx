import React from 'react';
import { AlertTriangle, XCircle, Shield } from 'lucide-react';

const Exclusions: React.FC = () => {
  const studies = [
    { name: "Étude de sol G1 et G2", cost: "2 500 à 4 000 €", provider: "Bureau d'études géotechniques agréé (terrain argileux)" },
    { name: "Étude thermique RE2020", cost: "800 à 1 500 €", provider: "Bureau d'études thermiques certifié" },
    { name: "Test de perméabilité", cost: "300 à 500 €", provider: "Organisme agréé" },
    { name: "Contrôle Consuel", cost: "150 à 200 €", provider: "Consuel (sécurité électrique)" },
  ];

  const insurances = [
    { name: "Assurance Dommage-Ouvrage", cost: "3 500 à 5 000 €", period: "À souscrire avant ouverture du chantier" },
  ];

  const exclusions = [
    "Aménagement paysager complet (seul aménagement de base inclus)",
    "Clôtures additionnelles (portail standard inclus)",
    "Raccordements aux réseaux (si éloignés)",
    "Taxes d'aménagement et archéologique",
    "Taxe foncière",
    "Études géotechniques complémentaires si sol complexe"
  ];

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <AlertTriangle className="w-8 h-8 mr-3" style={{ color: '#c1a16a' }} />
          <h2 className="text-3xl font-bold" style={{ color: '#c1a16a' }}>PRESTATIONS NON INCLUSES</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Études obligatoires */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#787346' }}>ÉTUDES OBLIGATOIRES À VOTRE CHARGE</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left px-4 py-3 text-gray-600">Prestation</th>
                    <th className="text-right px-4 py-3 text-gray-600">Coût estimé</th>
                    <th className="text-left px-4 py-3 text-gray-600">Organisme</th>
                  </tr>
                </thead>
                <tbody>
                  {studies.map((study, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-4 py-3 text-gray-700">{study.name}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold whitespace-nowrap" style={{ color: '#c1a16a' }}>{study.cost}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{study.provider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assurances obligatoires */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
              <h3 className="text-xl font-semibold" style={{ color: '#787346' }}>ASSURANCES OBLIGATOIRES À VOTRE CHARGE</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left px-4 py-3 text-gray-600">Assurance</th>
                    <th className="text-right px-4 py-3 text-gray-600">Coût estimé</th>
                    <th className="text-left px-4 py-3 text-gray-600">Période</th>
                  </tr>
                </thead>
                <tbody>
                  {insurances.map((insurance, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-4 py-3 text-gray-700">{insurance.name}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold whitespace-nowrap" style={{ color: '#c1a16a' }}>{insurance.cost}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{insurance.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Les entreprises sont couvertes par leur garantie décennale et garantie parfait achèvement.
              </p>
            </div>
          </div>
        </div>

        {/* Autres exclusions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <XCircle className="w-6 h-6 mr-3" style={{ color: '#c1a16a' }} />
            <h3 className="text-xl font-semibold" style={{ color: '#c1a16a' }}>AUTRES EXCLUSIONS</h3>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700 mb-4">❌ Non inclus dans notre prestation :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b8a994' }}></div>
                  <span className="text-gray-600">{exclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Exclusions;