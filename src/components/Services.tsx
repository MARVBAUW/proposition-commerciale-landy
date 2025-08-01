import React from 'react';
import { CheckCircle, Target, FileText, Hammer, Award } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Target,
      title: "ÉTUDES PRÉALABLES AVP",
      subtitle: "(Phase actuelle)",
      items: [
        "Diagnostic existant et relevés sur site",
        "Étude de faisabilité des 2 solutions proposées",
        "Estimation financière détaillée des travaux",
        "Analyse du potentiel immobilier et rentabilité"
      ]
    },
    {
      icon: FileText,
      title: "AVANT-PROJET DÉFINITIF",
      subtitle: "(Phase suivante - Déverrouillage après choix solution)",
      items: [
        "Plans d'exécution définitifs de la solution retenue",
        "Dépôt autorisation copropriété et ABF",
        "Finalisation du cahier des charges détaillé",
        "Préparation dossier consultation entreprises"
      ]
    },
    {
      icon: Hammer,
      title: "CONSULTATION ENTREPRISES",
      subtitle: "(DCE - Septembre 2025)",
      items: [
        "Édition cahiers des charges par corps d'état",
        "Consultation et analyse des offres entreprises",
        "Négociation et calage technique des prix",
        "Attribution des marchés et préparation chantier"
      ]
    },
    {
      icon: Award,
      title: "SUIVI DE CHANTIER",
      subtitle: "(Octobre 2025 - Avril 2026)",
      items: [
        "Direction d'exécution des travaux (DET)",
        "Coordination des entreprises et planning",
        "Contrôle qualité et conformité aux plans",
        "Réception des travaux et levée des réserves",
        "⚠️ Note : Cette prestation sera incluse dans l'offre d'ACTIV TRAVAUX"
      ]
    }
  ];

  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>HONORAIRES DE MAÎTRISE D'ŒUVRE</h2>
        
        {/* Honoraires */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200 shadow-sm mb-4 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#787346' }}>Missions incluses (Forfait étude APD)</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm">HONORAIRES MAÎTRISE D'ŒUVRE</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">MONTANT HT</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">TVA 20%</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap">MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">Honoraires de maîtrise d'œuvre</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono font-bold text-xs sm:text-sm whitespace-nowrap">7 095,00 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">1 419,00 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>8 514,00 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Prestations incluses */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#787346' }}>Prestations incluses dans nos honoraires :</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <service.icon className="w-6 h-6 mr-3" style={{ color: '#b8a994' }} />
                  <div>
                    <h4 className="text-lg font-semibold" style={{ color: '#c1a16a' }}>{service.title}</h4>
                    {service.subtitle && <p className="text-sm text-gray-500">{service.subtitle}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#787346' }} />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;