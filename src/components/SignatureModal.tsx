import React, { useState, useRef } from 'react';
import { X, Pen, RotateCcw, Check, User, Calendar } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: {
    name: string;
    date: string;
    signatureImage: string;
  }) => void;
  documentName: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSign,
  documentName
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isValid, setIsValid] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsValid(false);
    }
  };

  const handleSign = () => {
    if (signatureRef.current && name.trim() && date && !signatureRef.current.isEmpty()) {
      const signatureImage = signatureRef.current.toDataURL();
      onSign({
        name: name.trim(),
        date,
        signatureImage
      });
      onClose();
    }
  };

  const handleSignatureChange = () => {
    if (signatureRef.current) {
      setIsValid(!signatureRef.current.isEmpty() && name.trim() !== '');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Signature électronique
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center text-sm text-blue-800">
              <Pen className="w-4 h-4 mr-2" />
              <span className="font-medium">Document à signer :</span>
            </div>
            <p className="text-blue-900 font-semibold mt-1">{documentName}</p>
          </div>

          {/* Name input */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Nom complet
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleSignatureChange();
              }}
              placeholder="Votre nom et prénom"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date input */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Date de signature
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Signature canvas */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Pen className="w-4 h-4 mr-2" />
              Votre signature
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 400,
                  height: 150,
                  className: 'signature-canvas w-full h-auto rounded-lg'
                }}
                backgroundColor="rgba(255,255,255,1)"
                onEnd={handleSignatureChange}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Dessinez votre signature dans le cadre ci-dessus
              </p>
              <button
                onClick={handleClear}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Effacer
              </button>
            </div>
          </div>

          {/* Legal notice */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-xs text-gray-600">
              <strong>Notice légale :</strong> En signant électroniquement ce document, 
              vous confirmez votre accord avec son contenu. Cette signature a la même 
              valeur juridique qu'une signature manuscrite.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSign}
            disabled={!isValid}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              isValid
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4 mr-2" />
            Signer le document
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .signature-canvas {
            max-width: 100%;
            height: 150px;
          }
        `
      }} />
    </div>
  );
};

export default SignatureModal;