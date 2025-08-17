import React, { useState, useRef, useEffect } from 'react';
import { X, Download, CheckCircle, Clock, Eye, AlertCircle } from 'lucide-react';

interface DocumentReaderProps {
  isOpen: boolean;
  onClose: () => void;
  onValidateReading: () => void;
  documentName: string;
  documentUrl: string;
  requireFullRead?: boolean;
}

const DocumentReader: React.FC<DocumentReaderProps> = ({
  isOpen,
  onClose,
  onValidateReading,
  documentName,
  documentUrl,
  requireFullRead = true
}) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasConfirmed(false);
    }
  }, [isOpen]);



  const handleValidate = () => {
    if (hasConfirmed) {
      onValidateReading();
    }
  };

  const canValidate = hasConfirmed;


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[95vh] mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Lecture du document
            </h3>
            <p className="text-sm text-gray-600 mt-1">{documentName}</p>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu du document - Iframe intégrée avec ratio A4 */}
        <div className="p-3 sm:p-6 flex items-center justify-center" style={{ minHeight: '250px', maxHeight: '45vh' }}>
          <div className="w-full max-w-4xl border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg" style={{ 
            aspectRatio: '210/297', 
            height: '100%',
            minHeight: '250px'
          }}>
            <iframe
              src={`${documentUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=1&zoom=page-width`}
              className="w-full h-full"
              title={documentName}
              frameBorder="0"
              allow="fullscreen"
              style={{ minHeight: '250px' }}
            />
          </div>
        </div>

        {/* Footer avec validation mise en avant - hauteur fixe */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          {/* Case de confirmation - mise en avant */}
          <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
            <div className="mb-3">
              <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${hasConfirmed ? 'text-green-600' : 'text-gray-400'}`} />
              <h4 className="text-base font-semibold text-gray-900 mb-1">Validation de lecture</h4>
              <p className="text-xs text-gray-600">
                Veuillez confirmer que vous avez pris connaissance du document ci-dessus
              </p>
            </div>
            
            <label className="inline-flex items-start bg-white border border-blue-300 rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="rounded border-blue-400 text-blue-600 focus:ring-blue-500 mt-1 mr-3"
              />
              <span className="text-sm text-gray-800 text-left">
                <strong className="block mb-1">Je confirme avoir pris connaissance du document dans son intégralité</strong>
                <span className="text-xs text-gray-600">
                  J'ai lu et compris le contenu de ce document. Je peux maintenant procéder à la signature.
                </span>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => window.open(documentUrl, '_blank')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={handleValidate}
                disabled={!canValidate}
                className={`px-6 py-3 text-base font-semibold rounded-lg transition-all ${
                  canValidate
                    ? 'text-white bg-[#c1a16a] hover:bg-[#787346] shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                ✍️ Procéder à la signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReader;