import React from 'react';
import { Home, Users, Bath, Car, Waves } from 'lucide-react';

const ProjectSummary: React.FC = () => {
  const characteristics = [
    { icon: Home, label: 'Surface habitable', value: '145 m²' },
    { icon: Users, label: 'Configuration', value: 'Maison à étage avec piscine' },
    { icon: Waves, label: 'Piscine', value: '32 m²' },
    { icon: Car, label: 'Extérieurs', value: 'Terrasse, parking' },
    { icon: Home, label: 'Terrain', value: 'Argileux, pentu' },
  ];

  const technical = [
    'Chauffage par pompe à chaleur réversible',
    'Climatisation complète',
    'Domotique',
    'Menuiseries aluminium double vitrage',
    'Volets roulants électriques',
    'Carrelage milieu de gamme',
    'Toiture tuiles rondes',
    'Façade enduit'
  ];

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>SYNTHÈSE DU PROJET</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Caractéristiques */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#787346' }}>Caractéristiques du bien</h3>
            <div className="space-y-4">
              {characteristics.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" style={{ color: '#b8a994' }} />
                  <span className="text-gray-600">{item.label}:</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold mb-3" style={{ color: '#787346' }}>Distribution</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>Rez-de-chaussée:</span> Entrée, 3 chambres, 1 bureau, salle de bain, salle d'eau, WC, placards
                </div>
                <div className="text-gray-600">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>Étage:</span> Salon/salle à manger, cuisine ouverte, suite parentale, salle d'eau, WC, cellier, terrasse
                </div>
                <div className="text-gray-600">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>Extérieurs:</span> Piscine 32 m², terrasse, parking
                </div>
              </div>
            </div>
          </div>

          {/* Prestations techniques */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#787346' }}>Prestations techniques</h3>
            <div className="space-y-3">
              {technical.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b8a994' }}></div>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSummary;