import React from 'react';
import { Home, Users, Mountain, MapPin, Waves, Building } from 'lucide-react';

const ProjectSummary: React.FC = () => {
  const characteristics = [
    { icon: Home, label: 'Surface habitable', value: '150 m²' },
    { icon: Building, label: 'Configuration', value: 'Bâtiment 3 niveaux à rénover' },
    { icon: Mountain, label: 'Type de projet', value: 'Rénovation lourde' },
    { icon: Waves, label: 'Solutions proposées', value: '2 options : Coliving ou 3 logements' },
    { icon: Users, label: 'Option Coliving', value: '4-5 chambres sur 3 niveaux' },
    { icon: MapPin, label: 'Option 3 logements', value: '1 logement par niveau' },
  ];

  const technical = [
    'Démolition complète : planchers, cloisons, équipements existants',
    'Gros œuvre : reprise structure, planchers bois, réseaux évacuation',
    'Charpente : rénovation traditionnelle avec renforcement',
    'Isolation thermique réglementaire renforcée',
    'Menuiseries bois neuves avec porte anti-effraction',
    'Installations électriques complètes selon NFC 15-100',
    'Plomberie et sanitaire : prestations avancées complètes',
    'Chauffage PAC air/air et climatisation avec régulation',
    'Cloisons de distribution et finitions plâtrerie',
    'Revêtements : carrelage, faïence, parquet selon zones',
    'Peinture et finitions dans tous les locaux',
    'Équipements cuisine et sanitaires (2 salles d\'eau)'
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
              <h4 className="text-lg font-semibold mb-3" style={{ color: '#787346' }}>Distribution actuelle</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>RDC:</span> Espaces à restructurer selon solution choisie
                </div>
                <div className="text-gray-600">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>R+1:</span> Niveau intermédiaire à aménager
                </div>
                <div className="text-gray-600">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>R+2:</span> Combles à réhabiliter
                </div>
                <div className="text-gray-600 mt-3 p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium" style={{ color: '#c1a16a' }}>Note:</span> Plans détaillés disponibles pour les 2 solutions (Coliving 4-5 chambres ou 3 logements distincts)
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