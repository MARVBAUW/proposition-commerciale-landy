import React, { useState } from 'react';
import { Download, FileText, Eye, Home, Briefcase, Camera, Building, CreditCard, Workflow, Map } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  category: 'plans' | 'administratif' | 'processus';
  icon: React.ElementType;
  status?: 'disponible' | 'en_cours' | 'en_attente';
  statusLabel?: string;
}

const DocumentsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'administratif' | 'processus'>('plans');

  const documents: Document[] = [
    // Plans
    {
      id: 'plans-esquisse',
      name: 'Plans esquisse',
      type: 'Plans préliminaires',
      description: 'Premiers plans de la maison à étage avec piscine',
      url: '/documents/plans-esquisse.pdf',
      category: 'plans',
      icon: Home,
      status: 'en_attente',
      statusLabel: 'En attente de poursuite'
    },
    {
      id: 'plan-terrain',
      name: 'Plan de situation',
      type: 'Implantation',
      description: 'Plan de situation et implantation sur terrain Le Lavandou',
      url: '/documents/plan-situation.pdf',
      category: 'plans',
      icon: Building,
      status: 'en_attente',
      statusLabel: 'En attente'
    },
    {
      id: 'photos-terrain',
      name: 'Photos du terrain',
      type: 'État des lieux',
      description: 'Photos du terrain argileux pentu avant construction',
      url: '/documents/photos-terrain',
      category: 'plans',
      icon: Camera,
      status: 'en_attente',
      statusLabel: 'À fournir'
    },
    {
      id: 'plan-cadastre',
      name: 'Plan de division pour cadastre',
      type: 'Cadastre',
      description: 'Plan de division cadastrale du terrain Le Lavandou',
      url: '/documents/Plan de division pour cadastre.pdf',
      category: 'plans',
      icon: Map,
      status: 'disponible',
      statusLabel: 'Nouveau !'
    },
    {
      id: 'recap-plu',
      name: 'Notice PLU Zone UD Lavandou',
      type: 'Urbanisme',
      description: 'Récapitulatif des règles PLU Zone UD pour Le Lavandou',
      url: '/documents/NOTICE PLU ZONE UD LAVANDOU.pdf',
      category: 'plans',
      icon: FileText,
      status: 'disponible',
      statusLabel: 'Nouveau !'
    },

    // Administratif
    {
      id: 'devis-mission-complete',
      name: 'Devis mission complète maîtrise d\'œuvre',
      type: 'Devis n°13',
      description: 'Devis pour mission complète de maîtrise d\'œuvre architecte',
      url: '/documents/Devis-D202508-13.pdf',
      category: 'administratif',
      icon: FileText,
      status: 'disponible',
      statusLabel: 'Nouveau !'
    },
    {
      id: 'devis-mission-partielle',
      name: 'Devis mission partielle conception permis',
      type: 'Devis n°14',
      description: 'Devis pour mission partielle conception et permis de construire',
      url: '/documents/Devis-D202508-14.pdf',
      category: 'administratif',
      icon: FileText,
      status: 'disponible',
      statusLabel: 'Nouveau !'
    },
    {
      id: 'proposition-signee',
      name: 'Proposition commerciale signée',
      type: 'Contrat',
      description: 'Proposition commerciale validée et signée par M. et Mme LANDY',
      url: '/documents/proposition-signee.pdf',
      category: 'administratif',
      icon: FileText,
      status: 'en_attente',
      statusLabel: 'En attente signature'
    },
    {
      id: 'accompte',
      name: 'Accompte',
      type: 'Accompte',
      description: 'Accompte de démarrage 20% = 6 548,04 € TTC',
      url: '/documents/accompte.pdf',
      category: 'administratif',
      icon: CreditCard,
      status: 'en_attente',
      statusLabel: 'En attente'
    },
    {
      id: 'contrat-moe',
      name: 'Contrat de maîtrise d\'œuvre',
      type: 'Contrat',
      description: 'Contrat de maîtrise d\'œuvre architecte pour construction neuve',
      url: '/documents/contrat-moe.pdf',
      category: 'administratif',
      icon: Briefcase,
      status: 'en_attente',
      statusLabel: 'En attente'
    },

    // Processus
    {
      id: 'processus-projet',
      name: 'Processus projet PROGINEER',
      type: 'Guide',
      description: 'Guide complet du processus de construction avec PROGINEER',
      url: '/documents/PROCESSUS PROJET PROGINEER.pdf',
      category: 'processus',
      icon: Workflow,
      status: 'disponible',
      statusLabel: 'Disponible'
    }
  ];

  const tabs = [
    { id: 'plans' as const, label: 'Plans', icon: Home, color: '#6b7280' },
    { id: 'administratif' as const, label: 'Documents administratifs', icon: Briefcase, color: '#7c3aed' },
    { id: 'processus' as const, label: 'Processus projet', icon: Workflow, color: '#c1a16a' }
  ];

  const filteredDocuments = documents.filter(doc => doc.category === activeTab);

  const handleDownload = (doc: Document) => {
    // Pour les liens externes, ouvrir dans un nouvel onglet
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
                  data-tab={tab.id}
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

        {/* Liste des documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const Icon = document.icon;
            const isDisabled = document.status !== 'disponible';
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
                • <strong>Plans :</strong> Plans esquisse et situation du projet (disponibles après validation)<br/>
                • <strong>Documents administratifs :</strong> Contrats, accomptes, assurances et validations<br/>
                • <strong>Processus projet :</strong> Guide détaillé du déroulement des étapes avec PROGINEER<br/>
                • Les documents seront disponibles au fur et à mesure de l'avancement du projet<br/>
                • Les documents "En attente" seront activés après signature de la proposition commerciale
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;