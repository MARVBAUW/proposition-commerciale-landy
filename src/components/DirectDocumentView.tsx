import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Eye, PenTool, CheckCircle, ArrowLeft, Home } from 'lucide-react';
import SignatureModal from './SignatureModal';
import { subscribeToSignatureUpdates, processDocumentSignature, getSignatureStatus } from '../services/signatureService';

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  isSignable?: boolean;
}

const documents: Document[] = [
  {
    id: 'devis-mission-complete',
    name: 'Devis mission complète maîtrise d\'œuvre',
    type: 'Devis n°13',
    description: 'Devis pour mission complète de maîtrise d\'œuvre architecte',
    url: '/documents/Devis-D202508-13.pdf',
    isSignable: true
  },
  {
    id: 'devis-mission-partielle',
    name: 'Devis mission partielle conception permis',
    type: 'Devis n°14',
    description: 'Devis pour mission partielle conception et permis de construire',
    url: '/documents/Devis-D202508-14.pdf',
    isSignable: true
  },
  {
    id: 'contrat-moe',
    name: 'Contrat de maîtrise d\'œuvre',
    type: 'Contrat',
    description: 'Contrat de maîtrise d\'œuvre et mandat de délégation LANDY',
    url: '/documents/CONTRAT DE MAITRISE D\'OEUVRE ET MANDAT DE DÉLÉGATION LANDY.pdf',
    isSignable: true
  }
];

const DirectDocumentView: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [signatureStatus, setSignatureStatus] = useState<{
    isSigned: boolean;
    signedUrl?: string;
  }>({ isSigned: false });
  const [signatureModal, setSignatureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Trouver le document
    const foundDoc = documents.find(doc => doc.id === documentId);
    if (foundDoc) {
      setDocument(foundDoc);
      
      // Vérifier le statut de signature
      getSignatureStatus(documentId!).then(status => {
        setSignatureStatus(status);
      });
    }
  }, [documentId]);

  useEffect(() => {
    if (!document) return;

    // Écouter les mises à jour de signature
    const unsubscribe = subscribeToSignatureUpdates((signatures) => {
      const docSignature = signatures[document.id];
      if (docSignature) {
        setSignatureStatus({
          isSigned: docSignature.isSigned,
          signedUrl: docSignature.signedDocumentUrl
        });
      }
    });

    return () => unsubscribe();
  }, [document]);

  const handleSignature = () => {
    setSignatureModal(true);
  };

  const handleSignatureSubmit = async (signatureData: {
    name: string;
    date: string;
    signatureImage: string;
  }) => {
    if (!document) return;

    setIsProcessing(true);
    setSignatureModal(false);

    try {
      const signedPdfUrl = await processDocumentSignature(
        document.id,
        document.url,
        signatureData
      );
      
      // Télécharger automatiquement le document signé
      const link = document.createElement('a');
      link.href = signedPdfUrl;
      link.download = `${document.name.replace(/\s+/g, '_')}_signe.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      alert('Erreur lors de la signature du document. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!document) return;

    // Si le document est signé, télécharger la version signée
    if (signatureStatus.isSigned && signatureStatus.signedUrl) {
      const link = document.createElement('a');
      link.href = signatureStatus.signedUrl;
      link.download = `${document.name.replace(/\s+/g, '_')}_signe.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Télécharger le document original
    const link = document.createElement('a');
    link.href = document.url;
    link.download = `${document.name.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (!document) return;
    window.open(document.url, '_blank');
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document non trouvé</h1>
          <p className="text-gray-600 mb-6">Le document demandé n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la proposition
            </button>
            <img 
              src="/Diapositive10-removebg-preview.png" 
              alt="PROGINEER Logo" 
              className="h-8 w-auto" 
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête du document */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{document.type}</p>
              <p className="text-gray-500">{document.description}</p>
            </div>
            
            {/* Statut de signature */}
            {document.isSignable && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                signatureStatus.isSigned
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {signatureStatus.isSigned ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Document signé
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    À signer
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleView}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualiser
            </button>

            {document.isSignable && !signatureStatus.isSigned && (
              <button
                onClick={handleSignature}
                disabled={isProcessing}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  isProcessing
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                    Signature en cours...
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Signer le document
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {signatureStatus.isSigned ? 'Télécharger signé' : 'Télécharger'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h3>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>Visualiser :</strong> Consultez le document avant signature</p>
            {document.isSignable && (
              <p>• <strong>Signer :</strong> Signature électronique sécurisée avec valeur légale</p>
            )}
            <p>• <strong>Télécharger :</strong> Obtenez une copie {signatureStatus.isSigned ? 'signée' : 'du document'}</p>
            {document.isSignable && !signatureStatus.isSigned && (
              <p className="font-medium">⚠️ Ce document nécessite votre signature électronique</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de signature */}
      <SignatureModal
        isOpen={signatureModal}
        onClose={() => setSignatureModal(false)}
        onSign={handleSignatureSubmit}
        documentName={document.name}
      />
    </div>
  );
};

export default DirectDocumentView;