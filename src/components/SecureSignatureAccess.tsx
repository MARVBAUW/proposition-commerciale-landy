import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateSecureToken } from '../services/secureTokenService';
import EmailVerificationModal from './EmailVerificationModal';
import SignatureModal from './SignatureModal';
import DocumentReader from './DocumentReader';
import { processDocumentSignature } from '../services/signatureService';
import { loadDocuments } from '../services/documentsService';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

const SecureSignatureAccess: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [document, setDocument] = useState<any>(null);
  const [step, setStep] = useState<'validation' | 'reading' | 'email' | 'signature'>('validation');
  const [verifiedUser, setVerifiedUser] = useState<{ email: string; role: 'client' | 'progineer' } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token manquant dans l\'URL');
      setLoading(false);
      return;
    }
    validateTokenAndLoadDocument();
  }, [token]);

  const validateTokenAndLoadDocument = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        throw new Error('Token manquant');
      }
      
      // Valider le token sécurisé
      const tokenResult = await validateSecureToken(token);
      
      if (!tokenResult.success || !tokenResult.documentId) {
        setError(tokenResult.message);
        return;
      }
      
      setDocumentId(tokenResult.documentId);
      
      // Charger les informations du document
      const documents = await loadDocuments();
      const doc = documents.find(d => d.id === tokenResult.documentId);
      
      if (!doc) {
        setError('Document non trouvé');
        return;
      }
      
      setDocument(doc);
      setStep('reading');
      
    } catch (error) {
      console.error('Erreur validation token:', error);
      setError('Erreur lors de la validation du lien');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateReading = () => {
    setStep('email');
  };

  const handleEmailVerified = (email: string, role: 'client' | 'progineer') => {
    setVerifiedUser({ email, role });
    setStep('signature');
  };

  const handleSignatureSubmit = async (signatureData: {
    name: string;
    date: string;
    signatureImage: string;
  }) => {
    if (!document || !documentId) return;

    try {
      const signedPdfUrl = await processDocumentSignature(
        documentId,
        document.url,
        signatureData
      );
      
      // Télécharger automatiquement le document signé
      const link = window.document.createElement('a');
      link.href = signedPdfUrl;
      link.download = `${document.name.replace(/\\s+/g, '_')}_signe.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Rediriger vers une page de succès
      setStep('validation');
      setError(null);
      
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      setError('Erreur lors de la signature du document. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1a16a] mx-auto mb-4"></div>
          <p className="text-gray-600">Validation du lien sécurisé...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Le lien a peut-être expiré (validité 24h)</p>
            <p>• Le token a peut-être déjà été utilisé</p>
            <p>• Demandez un nouveau lien de signature</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'validation' && document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Signature terminée</h2>
          <p className="text-gray-600 mb-6">
            Le document "{document.name}" a été signé avec succès.
          </p>
          <p className="text-sm text-gray-500">
            Vous pouvez fermer cette page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sécurisé */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-[#c1a16a] mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Signature sécurisée</h1>
              <p className="text-sm text-gray-600">Accès via lien temporaire sécurisé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto p-6">
        {document && (
          <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{document.name}</h2>
            <p className="text-gray-600">{document.description}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              <span>Document nécessitant une signature électronique</span>
            </div>
          </div>
        )}

        {/* Étapes du processus */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            {['Lecture', 'Vérification', 'Signature'].map((stepName, index) => {
              const stepNumber = index + 1;
              const isActive = (step === 'reading' && stepNumber === 1) || 
                              (step === 'email' && stepNumber === 2) || 
                              (step === 'signature' && stepNumber === 3);
              const isCompleted = (step === 'email' && stepNumber === 1) || 
                                (step === 'signature' && stepNumber <= 2);
              
              return (
                <div key={stepName} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-[#c1a16a] text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  <span className={`ml-2 text-sm ${
                    isActive ? 'text-[#c1a16a] font-medium' : 'text-gray-500'
                  }`}>
                    {stepName}
                  </span>
                  {index < 2 && <div className="w-8 h-px bg-gray-300 mx-4" />}
                </div>
              );
            })}
          </div>

          {step === 'reading' && document && (
            <DocumentReader
              isOpen={true}
              onClose={() => {}} // Pas de fermeture possible
              onValidateReading={handleValidateReading}
              documentName={document.name}
              documentUrl={document.url}
              requireFullRead={true}
            />
          )}

          {step === 'email' && (
            <EmailVerificationModal
              isOpen={true}
              onClose={() => {}} // Pas de fermeture possible
              onVerified={handleEmailVerified}
              documentId={documentId || ''}
              documentName={document?.name || ''}
            />
          )}

          {step === 'signature' && (
            <SignatureModal
              isOpen={true}
              onClose={() => {}}
              onSign={handleSignatureSubmit}
              documentName={document?.name || ''}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureSignatureAccess;