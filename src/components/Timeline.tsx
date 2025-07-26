import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const Timeline: React.FC = () => {
  const phases = [
    { name: "Choix solution et validation client", duration: "1 semaine", start: "31 juillet 2025" },
    { name: "Plans définitifs + autorisations urbanisme", duration: "3 semaines", start: "15 août 2025" },
    { name: "Consultation des entreprises", duration: "3 semaines", start: "Début septembre 2025" },
    { name: "Validation offres + démarrage travaux", duration: "2 semaines", start: "15 octobre 2025" },
    { name: "Travaux de rénovation", duration: "6,5 mois", start: "Octobre 2025 - Avril 2026" },
  ];

  const clarifications = [
    {
      title: "Autorisations et démarches",
      items: [
        "Autorisation de copropriété pour menuiseries et groupe climatisation",
        "Dossier DP menuiseries (Déclaration Préalable)",
        "Consultation de l'ABF (Architecte des Bâtiments de France)",
        "Déclaration d'ouverture de chantier (DROC) en mairie",
        "Occupation du domaine public ou de la cour copropriété"
      ]
    },
    {
      title: "Coordination avec la copropriété",
      items: [
        "Travaux de toiture de la copropriété (phasage à définir)",
        "Protection temporaire durant les travaux copropriété",
        "Attention aux nuisances sonores du groupe climatisation",
        "Accès et stockage matériaux dans les parties communes"
      ]
    },
    {
      title: "Aspects techniques spécifiques",
      items: [
        "Bureau d'études pour plan de démolition et phasage",
        "Mise en sécurité de l'ouvrage pendant la démolition",
        "Vérification des branchements EP et EU sur réseau public",
        "Coordination importante entre les différents corps de métier"
      ]
    }
  ];

  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Planning */}
          <div className="bg-white rounded-lg p-3 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3 sm:mb-6">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" style={{ color: '#b8a994' }} />
              <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#c1a16a' }}>PLANNING PRÉVISIONNEL</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">Phase</th>
                    <th className="text-center px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">Durée</th>
                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">Délai</th>
                  </tr>
                </thead>
                <tbody>
                  {phases.map((phase, index) => (
                    <tr key={index} className="bg-gray-50">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm">{phase.name}</td>
                      <td className="px-1 sm:px-4 py-2 sm:py-3 text-center font-mono font-semibold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>{phase.duration}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">{phase.start}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2" style={{ background: 'linear-gradient(to right, rgba(193, 161, 106, 0.2), rgba(193, 161, 106, 0.1))', borderTopColor: '#c1a16a' }}>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-xs sm:text-sm" style={{ color: '#c1a16a' }}>DÉLAI TOTAL</td>
                    <td className="px-1 sm:px-4 py-2 sm:py-4 text-center font-mono font-bold text-sm sm:text-lg whitespace-nowrap" style={{ color: '#c1a16a' }}>9 mois</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 font-semibold text-xs sm:text-sm" style={{ color: '#c1a16a' }}>Juillet 2025 - Avril 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Points à clarifier */}
          <div className="bg-white rounded-lg p-3 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3 sm:mb-6">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" style={{ color: '#787346' }} />
              <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#787346' }}>POINTS À CLARIFIER</h2>
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