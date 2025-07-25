import React from 'react';
import { CheckCircle, Target, FileText, Hammer, Award } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Target,
      title: "CONCEPTION",
      subtitle: "(Esquisse à Permis de Construire)",
      items: [
        "Esquisse : Étude de faisabilité et premiers plans",
        "Avant-projet sommaire (APS) : Définition des volumes et surfaces",
        "Avant-projet définitif (APD) : Plans définitifs et choix techniques",
        "Dossier de Permis de Construire : Constitution et dépôt du dossier"
      ]
    },
    {
      icon: FileText,
      title: "PRÉPARATION DES TRAVAUX",
      subtitle: "",
      items: [
        "Projet d'exécution : Plans techniques détaillés pour les entreprises",
        "Assistance aux contrats de travaux : Aide à la consultation et sélection des entreprises",
        "Établissement du planning général des travaux"
      ]
    },
    {
      icon: Hammer,
      title: "SUIVI DE CHANTIER",
      subtitle: "",
      items: [
        "Direction d'exécution des travaux (DET) : Coordination et contrôle du chantier",
        "Visites régulières : Vérification de la conformité aux plans",
        "Réunions de chantier : Animation et compte-rendus",
        "Validation des travaux : Contrôle qualité à chaque étape"
      ]
    },
    {
      icon: Award,
      title: "LIVRAISON",
      subtitle: "",
      items: [
        "Opérations préalables à la réception (OPR) : Vérifications finales",
        "Assistance à la réception des travaux : Accompagnement lors de la livraison",
        "Levée des réserves : Suivi jusqu'à parfait achèvement",
        "Remise de la documentation : Dossier des ouvrages exécutés (DOE)"
      ]
    }
  ];

  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>HONORAIRES DE MAÎTRISE D'ŒUVRE</h2>
        
        {/* Honoraires */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#787346' }}>Missions incluses (8,2% du montant des travaux)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left px-4 py-3 text-gray-600">HONORAIRES MAÎTRISE D'ŒUVRE</th>
                  <th className="text-right px-4 py-3 text-gray-600">MONTANT HT</th>
                  <th className="text-right px-4 py-3 text-gray-600">TVA 20%</th>
                  <th className="text-right px-4 py-3 text-gray-600">MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-4 py-4 text-gray-900 font-semibold">Honoraires de maîtrise d'œuvre</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-mono font-bold">27 283,49 €</td>
                  <td className="px-4 py-4 text-right text-gray-600 font-mono">5 456,70 €</td>
                  <td className="px-4 py-4 text-right font-mono font-bold" style={{ color: '#c1a16a' }}>32 740,19 €</td>
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