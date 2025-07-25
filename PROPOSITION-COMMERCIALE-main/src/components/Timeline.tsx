import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const Timeline: React.FC = () => {
  const phases = [
    { name: "Études et permis de construire", duration: "3-4 mois", start: "À partir de la signature" },
    { name: "Instruction du permis", duration: "2-3 mois", start: "Dépôt en mairie" },
    { name: "Préparation des travaux", duration: "1 mois", start: "Après obtention PC" },
    { name: "Travaux de construction", duration: "10-12 mois", start: "Selon planning détaillé" },
  ];

  const clarifications = [
    {
      title: "Urbanisme et réglementations",
      items: [
        "Validation de l'emprise au sol autorisée selon le PLU du Lavandou",
        "Vérification des prescriptions architecturales locales",
        "Contraintes liées à la proximité de la mer (Plan de Prévention des Risques)"
      ]
    },
    {
      title: "Terrain et contraintes techniques",
      items: [
        "Étude géotechnique approfondie nécessaire (terrain argileux pentu)",
        "Stabilité des sols et fondations adaptées",
        "Gestion des eaux pluviales sur terrain pentu",
        "Accessibilité du chantier"
      ]
    },
    {
      title: "Viabilisation",
      items: [
        "Distance des arrivées électricité et télécom",
        "Coût des raccordements si éloignés de la parcelle",
        "Évacuation des eaux usées et pluviales"
      ]
    }
  ];

  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Planning */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 mr-3" style={{ color: '#b8a994' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#c1a16a' }}>PLANNING PRÉVISIONNEL</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left px-4 py-3 text-gray-600">Phase</th>
                    <th className="text-center px-4 py-3 text-gray-600">Durée</th>
                    <th className="text-left px-4 py-3 text-gray-600">Délai</th>
                  </tr>
                </thead>
                <tbody>
                  {phases.map((phase, index) => (
                    <tr key={index} className="bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{phase.name}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold" style={{ color: '#c1a16a' }}>{phase.duration}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{phase.start}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2" style={{ background: 'linear-gradient(to right, rgba(193, 161, 106, 0.2), rgba(193, 161, 106, 0.1))', borderTopColor: '#c1a16a' }}>
                    <td className="px-4 py-4 font-bold" style={{ color: '#c1a16a' }}>DÉLAI TOTAL</td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-lg" style={{ color: '#c1a16a' }}>16-20 mois</td>
                    <td className="px-4 py-4 font-semibold" style={{ color: '#c1a16a' }}>De la signature à la livraison</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Points à clarifier */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#787346' }}>POINTS À CLARIFIER</h2>
            </div>
            <div className="space-y-6">
              {clarifications.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#c1a16a' }}>{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#787346' }}></div>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;