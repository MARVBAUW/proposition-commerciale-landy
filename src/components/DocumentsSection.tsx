import React, { useState, useEffect } from 'react';
import { Download, FileText, Eye, Home, Briefcase, Camera, Building, CreditCard, Workflow, Map, PenTool, CheckCircle, Share2, Copy } from 'lucide-react';
import SignatureModal from './SignatureModal';
import EmailVerificationModal from './EmailVerificationModal';
import DocumentReader from './DocumentReader';
import { subscribeToSignatureUpdates, processDocumentSignature, type DocumentSignatureStatus } from '../services/signatureService';
import { loadDocuments, organizeDocumentsByCategory, type DocumentItem } from '../services/documentsService';
import { generateSecureToken } from '../services/secureTokenService';

// Mapper les icônes de string vers React components
const ICONS_MAP: Record<string, React.ElementType> = {
  'Home': Home,
  'Building': Building,
  'Camera': Camera,
  'Map': Map,
  'FileText': FileText,
  'CreditCard': CreditCard,
  'Briefcase': Briefcase,
  'Workflow': Workflow
};

interface Document extends Omit<DocumentItem, 'icon'> {
  icon: React.ElementType;
}

interface DocumentsSectionProps {
  initialTab?: string | null;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'administratif' | 'processus'>(() => {
    if (initialTab && ['plans', 'administratif', 'processus'].includes(initialTab)) {
      return initialTab as 'plans' | 'administratif' | 'processus';
    }
    return 'plans';
  });

  // Mettre à jour l'onglet actif quand initialTab change
  useEffect(() => {
    if (initialTab && ['plans', 'administratif', 'processus'].includes(initialTab)) {
      setActiveTab(initialTab as 'plans' | 'administratif' | 'processus');
    }
  }, [initialTab]);
  const [signatures, setSignatures] = useState<DocumentSignatureStatus>({});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [signatureModal, setSignatureModal] = useState<{ isOpen: boolean; documentId: string; documentName: string }>(
    { isOpen: false, documentId: '', documentName: '' }
  );
  const [emailVerificationModal, setEmailVerificationModal] = useState<{ 
    isOpen: boolean; 
    documentId: string; 
    documentName: string; 
  }>({ isOpen: false, documentId: '', documentName: '' });
  const [documentReader, setDocumentReader] = useState<{
    isOpen: boolean;
    documentId: string;
    documentName: string;
    documentUrl: string;
  }>({ isOpen: false, documentId: '', documentName: '', documentUrl: '' });
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [verifiedUser, setVerifiedUser] = useState<{ email: string; role: 'client' | 'progineer' } | null>(null);

  useEffect(() => {
    // Charger les documents depuis Firebase une seule fois au chargement
    loadDocumentsFromFirebase();
    
    // Écouter les mises à jour des signatures en temps réel
    const unsubscribe = subscribeToSignatureUpdates((updatedSignatures) => {
      setSignatures(updatedSignatures);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadDocumentsFromFirebase = async () => {
    try {
      setLoading(true);
      const documentsData = await loadDocuments();
      
      // Convertir les documents avec les icônes React
      // Les documents grisés doivent être affichés mais non-cliquables
      const documentsWithIcons: Document[] = documentsData
        .map(doc => ({
          ...doc,
          icon: ICONS_MAP[doc.icon] || FileText
        }));
      
      setDocuments(documentsWithIcons);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    } finally {
      setLoading(false);
    }
  };


  const tabs = [
    { id: 'plans' as const, label: 'Plans', icon: Home, color: '#6b7280' },
    { id: 'administratif' as const, label: 'Documents administratifs', icon: Briefcase, color: '#7c3aed' },
    { id: 'processus' as const, label: 'Processus projet', icon: Workflow, color: '#c1a16a' }
  ];

  const filteredDocuments = documents.filter(doc => doc.category === activeTab);

  const handleSignature = (doc: Document) => {
    // D'abord ouvrir le lecteur de document pour validation de lecture
    setDocumentReader({
      isOpen: true,
      documentId: doc.id,
      documentName: doc.name,
      documentUrl: doc.url
    });
  };

  const handleValidateReading = () => {
    // Fermer le lecteur et ouvrir la vérification email
    const currentDoc = documentReader;
    setDocumentReader({ isOpen: false, documentId: '', documentName: '', documentUrl: '' });
    
    setEmailVerificationModal({
      isOpen: true,
      documentId: currentDoc.documentId,
      documentName: currentDoc.documentName
    });
  };

  const handleEmailVerified = (email: string, role: 'client' | 'progineer') => {
    setVerifiedUser({ email, role });
    // Fermer la modal email et ouvrir la modal de signature
    setEmailVerificationModal({ isOpen: false, documentId: '', documentName: '' });
    setSignatureModal({
      isOpen: true,
      documentId: emailVerificationModal.documentId,
      documentName: emailVerificationModal.documentName
    });
  };

  const handleSignatureSubmit = async (signatureData: {
    name: string;
    date: string;
    signatureImage: string;
  }) => {
    const { documentId } = signatureModal;
    const docToSign = documents.find(doc => doc.id === documentId);
    
    if (!docToSign) return;

    setIsProcessing(prev => ({ ...prev, [documentId]: true }));

    try {
      const signedPdfUrl = await processDocumentSignature(
        documentId,
        docToSign.url,
        signatureData
      );
      
      // Télécharger automatiquement le document signé
      const link = document.createElement('a');
      link.href = signedPdfUrl;
      link.download = `${docToSign.name.replace(/\s+/g, '_')}_signe.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      alert('Erreur lors de la signature du document. Veuillez réessayer.');
    } finally {
      setIsProcessing(prev => ({ ...prev, [documentId]: false }));
    }
  };

  const getDocumentStatus = (doc: Document) => {
    const signature = signatures[doc.id];
    if (signature?.isSigned) {
      return { isSigned: true, signedUrl: signature.signedDocumentUrl };
    }
    return { isSigned: false };
  };

  const handleShare = async (doc: Document) => {
    // Vérifier si le document nécessite une signature
    if (doc.isSignable) {
      const docStatus = getDocumentStatus(doc);
      
      // Si le document n'est pas encore signé, générer un lien sécurisé avec token
      if (!docStatus.isSigned) {
        // Générer un token sécurisé via Firebase
        const tokenResult = await generateSecureToken(doc.id, 'admin');
        
        if (!tokenResult.success || !tokenResult.token) {
          alert('❌ Erreur lors de la génération du lien sécurisé');
          return;
        }
        
        const secureUrl = `${window.location.origin}/secure-signature/${tokenResult.token}`;
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: doc.name,
              text: `Document sécurisé à signer: ${doc.name}`,
              url: secureUrl,
            });
          } catch (error) {
            console.log('Partage annulé');
          }
        } else {
          // Fallback: copier dans le presse-papier
          try {
            await navigator.clipboard.writeText(secureUrl);
            alert('🔒 Lien sécurisé copié dans le presse-papier !\n\nCe lien expire dans 24h et nécessite une vérification email.');
          } catch (error) {
            console.error('Erreur lors de la copie:', error);
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = secureUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('🔒 Lien sécurisé copié dans le presse-papier !\n\nCe lien expire dans 24h et nécessite une vérification email.');
          }
        }
        return;
      }
    }
    
    // Pour les documents non-signables ou déjà signés, lien standard
    const directUrl = `${window.location.origin}/document/${doc.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: doc.name,
          text: `Document: ${doc.name}`,
          url: directUrl,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier dans le presse-papier
      try {
        await navigator.clipboard.writeText(directUrl);
        alert('Lien copié dans le presse-papier !');
      } catch (error) {
        console.error('Erreur lors de la copie:', error);
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = directUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Lien copié dans le presse-papier !');
      }
    }
  };

  const handleDownload = (doc: Document) => {
    const docStatus = getDocumentStatus(doc);
    
    // Si le document est signé, télécharger la version signée
    if (docStatus.isSigned && docStatus.signedUrl) {
      const link = document.createElement('a');
      link.href = docStatus.signedUrl;
      link.download = `${doc.name.replace(/\s+/g, '_')}_signe.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // Les documents signables non signés peuvent être consultés en version vierge
    // Pas de blocage pour le téléchargement/consultation

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
    const docStatus = getDocumentStatus(doc);
    
    // Les documents signables non signés peuvent être consultés en version vierge
    // Pas de blocage pour la consultation
    
    // Si le document est signé, ouvrir la version signée
    if (docStatus.isSigned && docStatus.signedUrl) {
      window.open(docStatus.signedUrl, '_blank');
      return;
    }
    
    // Sinon, ouvrir la version originale
    window.open(doc.url, '_blank');
  };

  if (loading) {
    return (
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>
            PLANS ET DOCUMENTS
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1a16a] mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des documents...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
            const isDisabled = document.isDisabled || document.status !== 'disponible';
            const tabColor = tabs.find(t => t.id === activeTab)?.color;
            const docStatus = getDocumentStatus(document);
            const isProcessingDoc = isProcessing[document.id];
            
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
                      <div className="flex items-center gap-2">
                        {document.statusLabel && (
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            document.status === 'disponible' && document.statusLabel.toLowerCase().includes('nouveau')
                              ? 'bg-green-100 text-green-700'
                              : document.status === 'en_cours' 
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-200 text-gray-600'
                          }`}>
                            {document.statusLabel}
                          </span>
                        )}
                        {document.isSignable && (
                          <button
                            onClick={() => handleShare(document)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Partager le lien direct"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
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
                  
                  {/* Bouton de signature (uniquement pour les documents signables) */}
                  {document.isSignable && (
                    <button
                      onClick={() => !isDisabled && !docStatus.isSigned && handleSignature(document)}
                      disabled={isDisabled || docStatus.isSigned || isProcessingDoc}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors text-sm ${
                        docStatus.isSigned
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : isDisabled || isProcessingDoc
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                    >
                      {isProcessingDoc ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-700 mr-1"></div>
                          Signature...
                        </>
                      ) : docStatus.isSigned ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Signé ✓
                        </>
                      ) : (
                        <>
                          <PenTool className="w-4 h-4 mr-1" />
                          Signer
                        </>
                      )}
                    </button>
                  )}
                  
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
                    {docStatus.isSigned && docStatus.signedUrl ? (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger signé
                      </>
                    ) : document.url.startsWith('http') ? (
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
                • <strong>Documents administratifs :</strong> Contrats, devis à signer électroniquement, accomptes<br/>
                • <strong>Processus projet :</strong> Guide détaillé du déroulement des étapes avec PROGINEER<br/>
                • <strong>Signature électronique :</strong> Cliquez sur "Signer" pour les documents contractuels<br/>
                • Les documents signés sont automatiquement sauvegardés et téléchargeables<br/>
                • Les documents "En attente" seront activés après signature de la proposition commerciale
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecteur de document avec validation */}
      <DocumentReader
        isOpen={documentReader.isOpen}
        onClose={() => setDocumentReader({ isOpen: false, documentId: '', documentName: '', documentUrl: '' })}
        onValidateReading={handleValidateReading}
        documentName={documentReader.documentName}
        documentUrl={documentReader.documentUrl}
        requireFullRead={true}
      />

      {/* Modal de vérification email */}
      <EmailVerificationModal
        isOpen={emailVerificationModal.isOpen}
        onClose={() => setEmailVerificationModal({ isOpen: false, documentId: '', documentName: '' })}
        onVerified={handleEmailVerified}
        documentId={emailVerificationModal.documentId}
        documentName={emailVerificationModal.documentName}
      />

      {/* Modal de signature */}
      <SignatureModal
        isOpen={signatureModal.isOpen}
        onClose={() => {
          setSignatureModal({ isOpen: false, documentId: '', documentName: '' });
          setVerifiedUser(null);
        }}
        onSign={handleSignatureSubmit}
        documentName={signatureModal.documentName}
      />
    </section>
  );
};

export default DocumentsSection;