import React, { useState } from 'react';
import { X, Mail, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { sendVerificationCode, verifyCode, isEmailAuthorized } from '../services/firebaseEmailService';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (email: string, role: 'client' | 'progineer') => void;
  documentId: string;
  documentName: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  documentId,
  documentName
}) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [timeLeft, setTimeLeft] = useState(0);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    try {
      // Vérifier si l'email est autorisé
      const { authorized } = await isEmailAuthorized(email, documentId);
      
      if (!authorized) {
        showMessage('Email non autorisé pour ce document', 'error');
        setIsLoading(false);
        return;
      }

      // Envoyer le code de vérification
      const result = await sendVerificationCode(email, documentId, documentName);
      
      if (result.success) {
        showMessage(result.message, 'success');
        setStep('code');
        setTimeLeft(600); // 10 minutes en secondes
        
        // Décompte du temps
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de l\'envoi du code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    
    try {
      const result = await verifyCode(email, documentId, code);
      
      if (result.success) {
        showMessage(result.message, 'success');
        
        // Obtenir le rôle de l'utilisateur
        const { role } = await isEmailAuthorized(email, documentId);
        
        setTimeout(() => {
          onVerified(email, role!);
          onClose();
          // Reset
          setStep('email');
          setEmail('');
          setCode('');
          setTimeLeft(0);
        }, 1000);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de la vérification', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCode = async () => {
    const result = await sendVerificationCode(email, documentId, documentName);
    if (result.success) {
      showMessage('Nouveau code envoyé', 'success');
      setTimeLeft(600);
    } else {
      showMessage(result.message, 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Vérification sécurisée
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Document info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Document :</strong> {documentName}
            </p>
          </div>

          {/* Étape 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Votre adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Seuls les emails autorisés peuvent signer ce document
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || !email.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer le code
                  </>
                )}
              </button>
            </form>
          )}

          {/* Étape 2: Code */}
          {step === 'code' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Code envoyé !</h4>
                <p className="text-sm text-gray-600">
                  Un code de vérification a été envoyé à<br />
                  <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Code de vérification (6 chiffres)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono"
                    maxLength={6}
                    required
                  />
                  {timeLeft > 0 && (
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Expire dans {formatTime(timeLeft)}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading || code.length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Vérification...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </button>
              </form>

              {/* Actions secondaires */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => {
                    setStep('email');
                    setCode('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Changer d'email
                </button>
                
                <button
                  onClick={handleNewCode}
                  disabled={timeLeft > 540} // Pas de nouveau code dans les 60 premières secondes
                  className={`text-sm ${
                    timeLeft > 540 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  Renvoyer le code
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              messageType === 'success' ? 'bg-green-50 border border-green-200' :
              messageType === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex">
                {messageType === 'success' && <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />}
                {messageType === 'error' && <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />}
                {messageType === 'info' && <Mail className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />}
                <p className={`text-sm ${
                  messageType === 'success' ? 'text-green-800' :
                  messageType === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;