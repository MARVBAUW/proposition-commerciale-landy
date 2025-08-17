import React, { useState, useRef, useEffect } from 'react';
import { X, Save, User, Shield, RotateCcw, Download, Plus, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface SignaturePosition {
  x: number; // Pourcentage 0-100
  y: number; // Pourcentage 0-100
  width: number; // Pourcentage 5-50
  height: number; // Pourcentage 5-30
  page: number; // Numéro de page (1-based)
}

interface MultiSignature {
  id: string;
  label: string;
  position: SignaturePosition;
  signerRole: 'client' | 'progineer';
  required: boolean;
}


interface SignatureConfig {
  documentId: string;
  documentPages: number; // Nombre total de pages
  signatures: MultiSignature[]; // Support signatures multiples
  // Backward compatibility
  clientPosition?: SignaturePosition;
  progineersPosition?: SignaturePosition;
}

interface SignaturePositionPreviewProps {
  documentId: string;
  documentUrl: string;
  onSave: (config: SignatureConfig) => void;
  onClose: () => void;
  initialConfig?: SignatureConfig;
}

const SignaturePositionPreview: React.FC<SignaturePositionPreviewProps> = ({
  documentId,
  documentUrl,
  onSave,
  onClose,
  initialConfig
}) => {
  // États du composant - tous déclarés en premier
  const [signatures, setSignatures] = useState<MultiSignature[]>([]);
  const [clientPosition, setClientPosition] = useState<SignaturePosition>({
    x: 10, y: 80, width: 25, height: 10, page: 1
  });
  const [progineersPosition, setProgineersPosition] = useState<SignaturePosition>({
    x: 60, y: 80, width: 25, height: 10, page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const [activeSignature, setActiveSignature] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedConfig, setLastSavedConfig] = useState<SignatureConfig | null>(null);
  const [detectionMethod, setDetectionMethod] = useState<'auto' | 'filename' | 'manual'>('auto');
  const previewRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Charger la configuration initiale si fournie
  useEffect(() => {
    if (initialConfig) {
      console.log('📋 Chargement de la configuration initiale:', initialConfig);
      setSignatures(initialConfig.signatures || []);
      setTotalPages(initialConfig.documentPages || 1);
      setLastSavedConfig(initialConfig);
      setHasUnsavedChanges(false);
      
      // Backward compatibility
      if (initialConfig.clientPosition) {
        setClientPosition(initialConfig.clientPosition);
      }
      if (initialConfig.progineersPosition) {
        setProgineersPosition(initialConfig.progineersPosition);
      }
    } else {
      // Si aucune configuration, créer une signature par défaut
      console.log('📋 Aucune configuration trouvée, création d\'une signature par défaut');
      const defaultSignatures = [
        {
          id: 'client-1',
          label: 'Signature Client',
          position: { x: 10, y: 80, width: 25, height: 10, page: 1 },
          signerRole: 'client',
          required: false
        }
      ];
      setSignatures(defaultSignatures);
      setHasUnsavedChanges(true); // Nouvelle config = modifications à sauvegarder
    }
  }, [initialConfig]);

  // Détecter les changements pour marquer comme non sauvegardé
  useEffect(() => {
    if (lastSavedConfig && signatures.length > 0) {
      const hasChanges = JSON.stringify(signatures) !== JSON.stringify(lastSavedConfig.signatures);
      setHasUnsavedChanges(hasChanges);
    }
  }, [signatures, lastSavedConfig]);

  // Détecter automatiquement le nombre de pages du PDF
  useEffect(() => {
    const detectPdfPages = async () => {
      try {
        setLoading(true);
        let detectedPages = 1;
        
        try {
          // Essayer de détecter le nombre de pages avec pdf-lib
          console.log(`🔍 Tentative de détection des pages pour: ${documentUrl}`);
          
          const response = await fetch(documentUrl);
          if (response.ok) {
            const pdfBytes = await response.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            detectedPages = pdfDoc.getPageCount();
            setDetectionMethod('auto');
            console.log(`✅ PDF analysé avec pdf-lib: ${detectedPages} pages`);
          } else {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
        } catch (pdfError) {
          console.warn('⚠️ Impossible d\'analyser le PDF avec pdf-lib:', pdfError);
          
          // Fallback: détection basée sur le nom du fichier
          detectedPages = documentUrl.includes('contrat') ? 4 : 
                         documentUrl.includes('devis') ? 2 : 
                         documentUrl.includes('notice') ? 5 : 3;
          
          setDetectionMethod('filename');
          console.log(`📝 Détection par nom de fichier: ${detectedPages} pages`);
        }
        
        // Ne pas écraser si on a déjà une config initiale
        if (!initialConfig?.documentPages) {
          setTotalPages(detectedPages);
        }
        
        console.log(`📄 Nombre de pages final: ${detectedPages}`);
      } catch (error) {
        console.error('❌ Erreur détection pages:', error);
        if (!initialConfig?.documentPages) {
          setTotalPages(3); // Valeur par défaut
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (documentUrl) {
      detectPdfPages();
    }
  }, [documentUrl, initialConfig]);

  const handleMouseDown = (signatureId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSignature(signatureId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent, pageNumber?: number) => {
    if (!isDragging || !activeSignature) return;

    // Trouver l'élément de page le plus proche du clic
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    // Utiliser le numéro de page de l'élément ou détecter automatiquement
    let currentPage = pageNumber;
    if (!currentPage) {
      // Si pas de pageNumber fourni, essayer de le détecter depuis l'élément
      const pageElement = targetElement.closest('[data-page]');
      currentPage = pageElement ? parseInt(pageElement.getAttribute('data-page') || '1') : 1;
    }

    // Mettre à jour la signature active
    setSignatures(prev => prev.map(sig => 
      sig.id === activeSignature 
        ? { ...sig, position: { ...sig.position, x: Math.round(x), y: Math.round(y), page: currentPage } }
        : sig
    ));
    setHasUnsavedChanges(true);

    // Backward compatibility
    if (activeSignature === 'client-1') {
      setClientPosition(prev => ({ ...prev, x: Math.round(x), y: Math.round(y), page: currentPage }));
    } else if (activeSignature === 'progineer-1') {
      setProgineersPosition(prev => ({ ...prev, x: Math.round(x), y: Math.round(y), page: currentPage }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveSignature(null);
  };

  const handleSave = () => {
    const config: SignatureConfig = {
      documentId,
      documentPages: totalPages,
      signatures,
      // Backward compatibility
      clientPosition: signatures.find(s => s.id === 'client-1')?.position || clientPosition,
      progineersPosition: signatures.find(s => s.id === 'progineer-1')?.position || progineersPosition
    };
    onSave(config);
    setLastSavedConfig(config);
    setHasUnsavedChanges(false);
    console.log(`💾 Configuration sauvegardée: ${totalPages} pages (${detectionMethod})`);
  };

  const handleQuickSave = () => {
    const config: SignatureConfig = {
      documentId,
      documentPages: totalPages,
      signatures,
      // Backward compatibility
      clientPosition: signatures.find(s => s.id === 'client-1')?.position || clientPosition,
      progineersPosition: signatures.find(s => s.id === 'progineer-1')?.position || progineersPosition
    };
    onSave(config);
    setLastSavedConfig(config);
    setHasUnsavedChanges(false);
    console.log(`✅ Sauvegarde rapide effectuée: ${totalPages} pages (${detectionMethod})`);
  };

  const resetPositions = () => {
    const defaultSignatures = [
      {
        id: 'client-1',
        label: 'Signature Client',
        position: { x: 10, y: 80, width: 25, height: 10, page: 1 },
        signerRole: 'client',
        required: false
      }
    ];
    
    setSignatures(defaultSignatures);
    setClientPosition({ x: 10, y: 80, width: 25, height: 10, page: 1 });
    setProgineersPosition({ x: 60, y: 80, width: 25, height: 10, page: 1 });
    setHasUnsavedChanges(true); // Marquer comme modifié car on a changé les positions
    setActiveSignature(null); // Désélectionner toute signature active
    console.log('🔄 Positions réinitialisées aux valeurs par défaut');
  };
  
  const addSignature = (signerRole: 'client' | 'progineer', targetPage?: number) => {
    const newId = `${signerRole}-${Date.now()}`;
    
    // Déterminer sur quelle page ajouter la signature
    // Par défaut, essayer de trouver une page avec peu de signatures
    let pageToAddTo = targetPage || 1;
    if (!targetPage) {
      // Trouver la page avec le moins de signatures de ce type
      const signaturesByPage = Array.from({length: totalPages}, (_, i) => i + 1)
        .map(pageNum => ({
          page: pageNum,
          count: signatures.filter(s => s.position.page === pageNum && s.signerRole === signerRole).length
        }));
      
      const pageWithLeastSignatures = signaturesByPage.reduce((min, current) => 
        current.count < min.count ? current : min
      );
      
      pageToAddTo = pageWithLeastSignatures.page;
    }
    
    const newSignature: MultiSignature = {
      id: newId,
      label: `Signature ${signerRole === 'client' ? 'Client' : 'PROGINEER'} ${signatures.filter(s => s.signerRole === signerRole).length + 1}`,
      position: { 
        x: 10 + Math.random() * 30, 
        y: 70 + Math.random() * 20, 
        width: 25, 
        height: 10, 
        page: pageToAddTo 
      },
      signerRole,
      required: false
    };
    
    setSignatures(prev => [...prev, newSignature]);
    setHasUnsavedChanges(true);
    
    // Sélectionner automatiquement la nouvelle signature pour modification
    setActiveSignature(newId);
  };
  
  const removeSignature = (signatureId: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== signatureId));
    setHasUnsavedChanges(true);
    // Si on supprime la signature active, désélectionner
    if (activeSignature === signatureId) {
      setActiveSignature(null);
    }
  };
  
  const updateSignatureProperty = (signatureId: string, property: string, value: any) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === signatureId 
        ? { ...sig, position: { ...sig.position, [property]: value } }
        : sig
    ));
    setHasUnsavedChanges(true);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment fermer sans sauvegarder ?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-gray-900">Configuration des signatures</h3>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
                  Modifications non sauvegardées
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Positionnez les zones de signature en les déplaçant</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[80vh]">
          {/* Panel de contrôles */}
          <div className="w-80 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Informations PDF */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Document PDF</h4>
                  <div className="text-sm text-gray-600">{totalPages} page{totalPages > 1 ? 's' : ''}</div>
                </div>
                
                {/* Contrôle manuel du nombre de pages */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs text-gray-600">Nombre de pages :</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={totalPages}
                    onChange={(e) => {
                      const newPages = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                      setTotalPages(newPages);
                      setDetectionMethod('manual');
                      setHasUnsavedChanges(true);
                      console.log(`📄 Nombre de pages modifié manuellement: ${newPages}`);
                    }}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c1a16a] focus:border-[#c1a16a]"
                  />
                  <button
                    onClick={() => {
                      // Relancer la détection automatique
                      if (documentUrl) {
                        setLoading(true);
                        setTimeout(() => {
                          // Déclencher à nouveau la détection
                          window.location.reload();
                        }, 100);
                      }
                    }}
                    className="text-xs text-[#c1a16a] hover:text-[#787346] underline"
                    title="Relancer la détection automatique"
                  >
                    Re-détecter
                  </button>
                </div>
                
                {/* Indicateur de méthode de détection */}
                <div className="text-xs text-gray-500 mb-2">
                  Détection: {
                    detectionMethod === 'auto' ? '🔍 Automatique (PDF analysé)' :
                    detectionMethod === 'filename' ? '📝 Par nom de fichier' :
                    '✏️ Manuelle'
                  }
                </div>
                
                <p className="text-xs text-gray-500">Déroulez vers le bas pour voir toutes les pages</p>
              </div>
              
              {/* Gestion des signatures */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-blue-900">Signatures</h4>
                  <div className="text-sm text-blue-600">{signatures.length} zones</div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  📝 Utilisez les boutons en haut de chaque page pour ajouter des signatures sur la page spécifique souhaitée.
                </p>
                
                {/* Liste des signatures */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {signatures.map(signature => {
                    const isClient = signature.signerRole === 'client';
                    return (
                      <div key={signature.id} className={`p-3 rounded border-2 ${
                        activeSignature === signature.id ? 'border-yellow-400 bg-yellow-50' :
                        isClient ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{signature.label}</span>
                          <button
                            onClick={() => removeSignature(signature.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            × Suppr.
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>Page {signature.position.page}</div>
                          <div>{signature.position.x}%, {signature.position.y}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Éditeur signature active */}
              {activeSignature && (() => {
                const signature = signatures.find(s => s.id === activeSignature);
                if (!signature) return null;
                
                const isClient = signature.signerRole === 'client';
                const colors = isClient ? {
                  bg: 'bg-blue-50',
                  border: 'border-blue-300', 
                  text: 'text-blue-700',
                  focus: 'focus:ring-blue-500 focus:border-blue-500'
                } : {
                  bg: 'bg-amber-50',
                  border: 'border-amber-300',
                  text: 'text-[#787346]', 
                  focus: 'focus:ring-[#c1a16a] focus:border-[#c1a16a]'
                };
                
                return (
                  <div className={`border rounded-lg p-4 ${colors.bg}`}>
                    <div className="flex items-center mb-4">
                      {isClient ? <User className="w-5 h-5 text-blue-600 mr-2" /> : <Shield className="w-5 h-5 text-[#c1a16a] mr-2" />}
                      <h4 className="font-medium text-gray-900">Modifier: {signature.label}</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className={`block text-xs font-medium ${colors.text} mb-1`}>Page</label>
                          <input
                            type="number"
                            min="1" max={totalPages}
                            value={signature.position.page}
                            onChange={(e) => updateSignatureProperty(signature.id, 'page', Number(e.target.value))}
                            className={`w-full px-2 py-1 text-sm border ${colors.border} rounded ${colors.focus}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium ${colors.text} mb-1`}>X (%)</label>
                          <input
                            type="number"
                            min="0" max="95"
                            value={signature.position.x}
                            onChange={(e) => updateSignatureProperty(signature.id, 'x', Number(e.target.value))}
                            className={`w-full px-2 py-1 text-sm border ${colors.border} rounded ${colors.focus}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium ${colors.text} mb-1`}>Y (%)</label>
                          <input
                            type="number"
                            min="0" max="95"
                            value={signature.position.y}
                            onChange={(e) => updateSignatureProperty(signature.id, 'y', Number(e.target.value))}
                            className={`w-full px-2 py-1 text-sm border ${colors.border} rounded ${colors.focus}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block text-xs font-medium ${colors.text} mb-1`}>Largeur (%)</label>
                          <input
                            type="number"
                            min="10" max="40"
                            value={signature.position.width}
                            onChange={(e) => updateSignatureProperty(signature.id, 'width', Number(e.target.value))}
                            className={`w-full px-2 py-1 text-sm border ${colors.border} rounded ${colors.focus}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium ${colors.text} mb-1`}>Hauteur (%)</label>
                          <input
                            type="number"
                            min="5" max="25"
                            value={signature.position.height}
                            onChange={(e) => updateSignatureProperty(signature.id, 'height', Number(e.target.value))}
                            className={`w-full px-2 py-1 text-sm border ${colors.border} rounded ${colors.focus}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="space-y-3">
                {/* Bouton Enregistrer rapide */}
                <button
                  onClick={handleQuickSave}
                  disabled={!hasUnsavedChanges}
                  className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    hasUnsavedChanges 
                      ? 'bg-[#c1a16a] hover:bg-[#787346] text-white border-transparent' 
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {hasUnsavedChanges ? 'Enregistrer les modifications' : 'Aucune modification'}
                </button>
                
                <button
                  onClick={resetPositions}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser positions
                </button>
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-1">💡 Instructions :</p>
                  <ul className="space-y-1">
                    <li>• Cliquez sur une zone pour la modifier</li>
                    <li>• Déplacez en glissant sur le PDF</li>
                    <li>• Déroulez pour voir toutes les pages</li>
                    <li>• Ajoutez/supprimez des signatures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Preview du PDF avec zones de signature - Défilement vertical */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Aperçu du document ({totalPages} pages)</h4>
                <button
                  onClick={() => window.open(documentUrl, '_blank')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Ouvrir PDF
                </button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1a16a] mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Détection du PDF...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Générer toutes les pages en défilement */}
                  {Array.from({length: totalPages}, (_, pageIndex) => {
                    const pageNumber = pageIndex + 1;
                    return (
                      <div key={pageNumber} className="relative">
                        {/* En-tête de page avec actions */}
                        <div className="flex items-center justify-center mb-2 space-x-2">
                          <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium">
                            Page {pageNumber}
                          </span>
                          <button
                            onClick={() => addSignature('client', pageNumber)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            title="Ajouter signature client sur cette page"
                          >
                            + Client
                          </button>
                          <button
                            onClick={() => addSignature('progineer', pageNumber)}
                            className="bg-[#c1a16a] text-white px-2 py-1 rounded text-xs hover:bg-[#787346] transition-colors"
                            title="Ajouter signature PROGINEER sur cette page"
                          >
                            + PROGINEER
                          </button>
                        </div>
                        
                        {/* Simulation d'une page PDF */}
                        <div
                          ref={pageNumber === 1 ? previewRef : undefined}
                          data-page={pageNumber}
                          className="relative bg-white shadow-lg mx-auto cursor-crosshair select-none"
                          style={{ 
                            width: '600px', 
                            height: '800px',
                            aspectRatio: '210/297' // A4 ratio
                          }}
                          onMouseMove={(e) => handleMouseMove(e, pageNumber)}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {/* Simulation du contenu PDF */}
                          <div className="absolute inset-4 border border-gray-200">
                            <div className="p-4 text-xs text-gray-400 space-y-2">
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                              <div className="mt-4 space-y-1">
                                {[...Array(20)].map((_, i) => (
                                  <div key={i} className="h-2 bg-gray-100 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                                ))}
                              </div>
                              {/* Indicateur de page dans le contenu */}
                              <div className="absolute bottom-4 right-4 text-gray-400 text-xs">
                                Page {pageNumber}/{totalPages}
                              </div>
                            </div>
                          </div>
                          
                          {/* Zones de signature pour cette page */}
                          {signatures
                            .filter(sig => sig.position.page === pageNumber)
                            .map(signature => {
                              const isClient = signature.signerRole === 'client';
                              const borderColor = isClient ? 'border-blue-500' : 'border-[#c1a16a]';
                              const bgColor = isClient ? 'bg-blue-100/50' : 'bg-amber-100/50';
                              const textColor = isClient ? 'text-blue-700' : 'text-[#787346]';
                              const tagBgColor = isClient ? 'bg-blue-600' : 'bg-[#c1a16a]';
                              
                              return (
                                <div
                                  key={signature.id}
                                  className={`absolute border-2 border-dashed ${borderColor} ${bgColor} cursor-move transition-all duration-200 ${
                                    activeSignature === signature.id ? `ring-2 ring-opacity-75 ${isClient ? 'ring-blue-400' : 'ring-[#c1a16a]'}` : ''
                                  }`}
                                  style={{
                                    left: `${signature.position.x}%`,
                                    top: `${signature.position.y}%`,
                                    width: `${signature.position.width}%`,
                                    height: `${signature.position.height}%`,
                                  }}
                                  onMouseDown={(e) => handleMouseDown(signature.id, e)}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`flex items-center space-x-1 ${textColor} text-xs font-medium`}>
                                      {isClient ? <User className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                      <span>{signature.label.replace('Signature ', '').replace(/\s\d+$/, '').toUpperCase()}</span>
                                    </div>
                                  </div>
                                  <div className={`absolute -top-6 left-0 ${tagBgColor} text-white px-2 py-1 text-xs rounded`}>
                                    P{signature.position.page} - {signature.position.x}%, {signature.position.y}%
                                  </div>
                                </div>
                              );
                            })}
                          
                          {/* Grille d'aide pour cette page */}
                          <div className="absolute inset-0 pointer-events-none opacity-10">
                            {/* Lignes verticales */}
                            {[25, 50, 75].map(x => (
                              <div
                                key={`page${pageNumber}-v-${x}`}
                                className="absolute top-0 bottom-0 w-px bg-gray-400"
                                style={{ left: `${x}%` }}
                              />
                            ))}
                            {/* Lignes horizontales */}
                            {[25, 50, 75].map(y => (
                              <div
                                key={`page${pageNumber}-h-${y}`}
                                className="absolute left-0 right-0 h-px bg-gray-400"
                                style={{ top: `${y}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 text-center text-xs text-gray-500">
                <div>Déroulez pour voir toutes les pages - Cliquez sur une zone pour la modifier</div>
                <div className="mt-1 text-blue-600">
                  {signatures.length} signature(s) au total sur {totalPages} page(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-[#c1a16a] hover:bg-[#787346] rounded-md transition-colors"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Sauvegarder configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePositionPreview;