import React, { useState } from 'react';
import { Download, FileText, Eye, Building, Users, Home, Briefcase, Camera } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  category: 'etat-lieux' | 'coliving' | 'logements' | 'administratif';
  icon: React.ElementType;
  status?: 'disponible' | 'en_cours' | 'en_attente';
  statusLabel?: string;
}

interface DocumentsSectionProps {
  currentSolution?: 'coliving' | 'logements';
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ currentSolution = 'coliving' }) => {
  const [activeTab, setActiveTab] = useState<'etat-lieux' | 'coliving' | 'logements' | 'administratif'>('etat-lieux');

  const documents: Document[] = [
    {
      id: 'etat-lieux-complet',
      name: 'Plans état des lieux complet',
      type: 'État actuel',
      description: 'Relevé architectural des 3 niveaux (RDC, R+1, R+2)',
      url: '/PDF/Plan état des lieux.pdf',
      category: 'etat-lieux',
      icon: Home,
      status: 'disponible'
    },
    {
      id: 'photos-projet',
      name: 'Photos du projet',
      type: 'État des lieux photographique',
      description: 'Collection de photos de l\'état actuel du bâtiment avant rénovation',
      url: 'https://1drv.ms/f/c/04e6360576b8a472/EtixhT2js91Jo-jgCrksoKkBkE3k8aFmn6DHhZFqhNhc3g?e=VSe1yL',
      category: 'etat-lieux',
      icon: Camera,
      status: 'disponible'
    },
    {
      id: 'coliving-complet',
      name: 'Solution Coliving complète',
      type: 'Proposition',
      description: 'Aménagement coliving 4-5 chambres sur 3 niveaux',
      url: '/PDF/Plans colliving.pdf',
      category: 'coliving',
      icon: Users,
      status: 'disponible'
    },
    {
      id: 'logements-complet',
      name: '3 Logements indépendants',
      type: 'Réversibilité',
      description: 'Plans complets pour 3 logements distincts (1 par niveau)',
      url: '/PDF/Plans 3 appartements.pdf',
      category: 'logements',
      icon: Building,
      status: 'disponible'
    },
    {
      id: 'devis-signe',
      name: '2025 Curiol Devis signé',
      type: 'Devis',
      description: 'Devis des travaux de rénovation signé',
      url: '/PDF/2025 Curiol Devis D202507-11  Progineer.pdf',
      category: 'administratif',
      icon: FileText,
      status: 'disponible'
    },
    {
      id: 'facture-1',
      name: 'Facture 202507-9',
      type: 'Facture',
      description: 'Première facture des prestations',
      url: '/PDF/Facture-202507-9.pdf',
      category: 'administratif',
      icon: FileText,
      status: 'disponible'
    },
    {
      id: 'contrat-moe',
      name: 'Contrat de maîtrise d\'œuvre',
      type: 'Contrat',
      description: 'Contrat de maîtrise d\'œuvre architecte',
      url: '/documents/contrat-moe.pdf',
      category: 'administratif',
      icon: Briefcase,
      status: 'en_attente',
      statusLabel: 'en attente'
    },
    {
      id: 'mandat-delegation',
      name: 'Mandat de délégation',
      type: 'Mandat',
      description: 'Mandat de délégation pour les démarches administratives',
      url: '/documents/mandat-delegation.pdf',
      category: 'administratif',
      icon: Briefcase,
      status: 'en_attente',
      statusLabel: 'en attente'
    },
  ];

  const tabs = [
    { id: 'etat-lieux' as const, label: 'État des lieux', icon: FileText, color: '#6b7280' },
    { id: 'coliving' as const, label: 'Solution Coliving', icon: Users, color: '#c1a16a' },
    { id: 'logements' as const, label: '3 Logements', icon: Building, color: '#059669' },
    { id: 'administratif' as const, label: 'Documents administratifs', icon: Briefcase, color: '#7c3aed' }
  ];

  const filteredDocuments = documents.filter(doc => doc.category === activeTab);

  const handleDownload = (doc: Document) => {
    // Pour les liens externes (OneDrive), ouvrir dans un nouvel onglet
    if (doc.url.startsWith('http')) {
      window.open(doc.url, '_blank');
      return;
    }
    
    // Pour les fichiers locaux, utiliser l'approche de téléchargement
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = `${doc.name.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (doc: Document) => {
    // En production, ceci ouvrirait le PDF dans un viewer
    window.open(doc.url, '_blank');
  };

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>
          PLANS ET DOCUMENTS
        </h2>

        {/* Navigation par onglets */}
        <div className="flex flex-col sm:flex-row justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 max-w-fit mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    backgroundColor: isActive ? tab.color : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicateur solution active */}
        {(activeTab === 'coliving' || activeTab === 'logements') && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full border-2 border-dashed" 
                 style={{ 
                   borderColor: currentSolution === activeTab ? '#c1a16a' : '#9ca3af',
                   backgroundColor: currentSolution === activeTab ? '#fef3e3' : '#f9fafb'
                 }}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                currentSolution === activeTab ? 'bg-[#c1a16a]' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {currentSolution === activeTab 
                  ? 'Solution actuellement sélectionnée' 
                  : 'Solution disponible (non sélectionnée)'
                }
              </span>
            </div>
          </div>
        )}

        {/* Liste des documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const Icon = document.icon;
            const isDisabled = document.status === 'en_cours' || document.status === 'en_attente';
            const tabColor = tabs.find(t => t.id === activeTab)?.color;
            
            return (
              <div
                key={document.id}
                className={`rounded-lg p-6 border transition-all ${
                  isDisabled 
                    ? 'bg-gray-100 border-gray-300 opacity-60' 
                    : 'bg-gray-50 border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start mb-4">
                  <div className="p-2 rounded-lg mr-3" style={{ 
                    backgroundColor: isDisabled ? '#e5e7eb' : tabColor + '20' 
                  }}>
                    <Icon className="w-5 h-5" style={{ 
                      color: isDisabled ? '#9ca3af' : tabColor 
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold mb-1 ${
                        isDisabled ? 'text-gray-500' : 'text-gray-900'
                      }`}>{document.name}</h4>
                      {document.statusLabel && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          document.status === 'en_cours' 
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {document.statusLabel}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-1 ${
                      isDisabled ? 'text-gray-400' : 'text-gray-500'
                    }`}>{document.type}</p>
                    <p className={`text-xs ${
                      isDisabled ? 'text-gray-400' : 'text-gray-400'
                    }`}>{document.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => !isDisabled && handleView(document)}
                    disabled={isDisabled}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors text-sm ${
                      isDisabled 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </button>
                  <button
                    onClick={() => !isDisabled && handleDownload(document)}
                    disabled={isDisabled}
                    className={`flex-1 flex items-center justify-center px-3 py-2 text-white rounded-md transition-opacity text-sm ${
                      isDisabled 
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                    style={{ 
                      backgroundColor: isDisabled ? '#9ca3af' : tabColor 
                    }}
                  >
                    {document.url.startsWith('http') ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Accéder
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note explicative */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">À propos des documents</div>
              <div>
                • <strong>État des lieux :</strong> Plans actuels du bâtiment (3 niveaux)<br/>
                • <strong>Solution Coliving :</strong> Aménagement optimisé pour 4-5 chambres avec espaces partagés<br/>
                • <strong>3 Logements :</strong> Plans de réversibilité pour transformation en logements indépendants<br/>
                • <strong>Documents administratifs :</strong> Devis, factures, contrats et mandats<br/>
                • Les documents disponibles sont consultables en ligne et téléchargeables au format PDF<br/>
                • Les documents "en cours d'élaboration" ou "en attente" seront disponibles prochainement
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;