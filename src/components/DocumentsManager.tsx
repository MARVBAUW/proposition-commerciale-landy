import React, { useState, useEffect } from 'react';
import { loadDocuments, saveDocument, deleteDocument as deleteDocumentService, addDocument, updateDocumentsOrder, organizeDocumentsByCategory, type DocumentItem as DocumentItemType, type DocumentCategory as DocumentCategoryType } from '../services/documentsService';
import { addNotification } from '../services/notificationsService';
import { sendCompleteNotification } from '../services/emailNotificationService';
import { getDefaultClientEmail } from '../services/projectService';
import FileUpload from './FileUpload';
import { Bell, FileText, Shield, Clock, Star, Workflow, PenTool, Mail, Smartphone } from 'lucide-react';
import { 
  Home, 
  Briefcase, 
  Camera, 
  Building, 
  CreditCard, 
  Map,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  GripVertical,
  EyeOff,
  Settings
} from 'lucide-react';

// Utiliser les types du service
type DocumentItem = DocumentItemType;
type DocumentCategory = DocumentCategoryType & {
  icon: React.ElementType; // Override pour React component
};

const ICONS_MAP: Record<string, React.ElementType> = {
  'FileText': FileText,
  'Home': Home,
  'Briefcase': Briefcase,
  'Camera': Camera,
  'Building': Building,
  'CreditCard': CreditCard,
  'Workflow': Workflow,
  'Map': Map,
  'Download': Download,
  'Eye': Eye
};

// Fonction utilitaire pour ajouter une notification complète
const addNotificationToFirebase = async (
  notification: {
    title: string;
    message: string;
    type: 'processus_projet' | 'new_document' | 'contact' | 'waiting_approval' | 'signature_ready';
    documentName?: string;
  },
  options: {
    sendEmail?: boolean;
    sendPWA?: boolean;
  } = {}
) => {
  try {
    console.log('🔔 Tentative d\'ajout de notification:', notification);
    
    // Ajouter la notification à Firebase
    const result = await addNotification(notification);
    
    console.log('📝 Résultat ajout notification:', result);
    
    if (result.success) {
      console.log('✅ Notification ajoutée avec succès, déclenchement de l\'événement');
      
      // Déclencher un événement pour que le NotificationBell se mette à jour
      window.dispatchEvent(new CustomEvent('notificationAdded'));
      
      // Envoyer les notifications supplémentaires si demandé
      if (options.sendEmail || options.sendPWA) {
        console.log('📧 Envoi des notifications supplémentaires:', options);
        
        const notificationResult = await sendCompleteNotification(
          {
            title: notification.title,
            message: notification.message,
            type: notification.type === 'new_document' ? 'new_document' : 
                  notification.type === 'contact' ? 'custom_notification' :
                  'custom_notification',
            documentName: notification.documentName
          },
          {
            sendEmail: options.sendEmail,
            sendPWA: options.sendPWA
          }
        );
        
        console.log('📬 Résultat envoi notifications:', notificationResult);
        
        // Log des résultats
        if (notificationResult.errors.length > 0) {
          console.warn('Erreurs envoi notifications:', notificationResult.errors);
        }
      }
    } else {
      console.error('❌ Échec ajout notification:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Erreur lors de l\'ajout de la notification:', error);
    return { success: false, message: 'Erreur lors de l\'ajout de la notification' };
  }
};

// Fonction pour déterminer si un document devrait avoir une notification par défaut
const shouldHaveNotificationByDefault = (document: DocumentItem | Partial<DocumentItem>) => {
  // Documents signables
  if (document.isSignable) return true;
  
  // Documents avec certains statuts
  if (document.status === 'disponible' && document.statusLabel?.toLowerCase().includes('nouveau')) return true;
  
  // Documents de type processus
  if (document.category === 'processus') return true;
  
  // Documents administratifs importants
  if (document.category === 'administratif' && (
    document.name?.toLowerCase().includes('devis') ||
    document.name?.toLowerCase().includes('contrat')
  )) return true;
  
  return false;
};

const DocumentsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'administratif' | 'processus'>('plans');
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newDocument, setNewDocument] = useState<Partial<DocumentItem>>({
    category: 'plans',
    icon: 'FileText',
    status: 'disponible',
    isSignable: false,
    isDisabled: false,
    order: 0
  });

  useEffect(() => {
    loadDocumentsFromFirebase();
  }, []);

  const loadDocumentsFromFirebase = async () => {
    try {
      setLoading(true);
      const documents = await loadDocuments();
      const organizedCategories = organizeDocumentsByCategory(documents);
      
      // Convertir les icônes string en React components
      const categoriesWithIcons: DocumentCategory[] = organizedCategories.map(cat => ({
        ...cat,
        icon: cat.id === 'plans' ? Home : cat.id === 'administratif' ? Briefcase : Workflow
      }));
      
      setCategories(categoriesWithIcons);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentsOld = () => {
    // Charger tous les documents de l'application cliente
    const initialCategories: DocumentCategory[] = [
      {
        id: 'plans',
        name: 'Plans & Études',
        icon: Home,
        documents: [
          {
            id: 'plans-esquisse',
            name: 'Plans esquisse',
            type: 'Plans préliminaires',
            description: 'Premiers plans de la maison à étage avec piscine',
            url: '/documents/plans-esquisse.pdf',
            category: 'plans',
            icon: 'Home',
            status: 'en_attente',
            statusLabel: 'En attente de poursuite',
            isDisabled: true,
            order: 1
          },
          {
            id: 'plan-terrain',
            name: 'Plan de situation',
            type: 'Implantation',
            description: 'Plan de situation et implantation sur terrain Le Lavandou',
            url: '/documents/plan-situation.pdf',
            category: 'plans',
            icon: 'Building',
            status: 'en_attente',
            statusLabel: 'En attente',
            isDisabled: true,
            order: 2
          },
          {
            id: 'photos-terrain',
            name: 'Photos du terrain',
            type: 'État des lieux',
            description: 'Photos du terrain argileux pentu avant construction',
            url: '/documents/photos-terrain',
            category: 'plans',
            icon: 'Camera',
            status: 'en_attente',
            statusLabel: 'À fournir',
            isDisabled: true,
            order: 3
          },
          {
            id: 'plan-cadastre',
            name: 'Plan de division pour cadastre',
            type: 'Cadastre',
            description: 'Plan de division cadastrale du terrain Le Lavandou',
            url: '/documents/Plan de division pour cadastre.pdf',
            category: 'plans',
            icon: 'Map',
            status: 'disponible',
            statusLabel: 'Nouveau !',
            isDisabled: false,
            order: 4
          },
          {
            id: 'recap-plu',
            name: 'Notice PLU Zone UD Lavandou',
            type: 'Urbanisme',
            description: 'Récapitulatif des règles PLU Zone UD pour Le Lavandou',
            url: '/documents/NOTICE PLU ZONE UD LAVANDOU.pdf',
            category: 'plans',
            icon: 'FileText',
            status: 'disponible',
            statusLabel: 'Nouveau !',
            isDisabled: false,
            order: 5
          }
        ]
      },
      {
        id: 'administratif',
        name: 'Administratif & Contrats',
        icon: Briefcase,
        documents: [
          {
            id: 'devis-mission-complete',
            name: 'Devis mission complète maîtrise d\'œuvre',
            type: 'Devis n°13',
            description: 'Devis pour mission complète de maîtrise d\'œuvre architecte',
            url: '/documents/Devis-D202508-13.pdf',
            category: 'administratif',
            icon: 'CreditCard',
            status: 'disponible',
            statusLabel: 'Nouveau !',
            isSignable: true,
            isDisabled: false,
            order: 1
          },
          {
            id: 'devis-mission-partielle',
            name: 'Devis mission partielle conception permis',
            type: 'Devis n°14',
            description: 'Devis pour mission partielle conception et permis de construire',
            url: '/documents/Devis-D202508-14.pdf',
            category: 'administratif',
            icon: 'CreditCard',
            status: 'disponible',
            statusLabel: 'Nouveau !',
            isSignable: true,
            isDisabled: false,
            order: 2
          },
          {
            id: 'contrat-moe',
            name: 'Contrat de maîtrise d\'œuvre',
            type: 'Contrat',
            description: 'Contrat de maîtrise d\'œuvre et mandat de délégation LANDY',
            url: '/documents/CONTRAT DE MAITRISE D\'OEUVRE ET MANDAT DE DÉLÉGATION LANDY.pdf',
            category: 'administratif',
            icon: 'Briefcase',
            status: 'disponible',
            statusLabel: 'Nouveau !',
            isSignable: true,
            isDisabled: false,
            order: 3
          }
        ]
      },
      {
        id: 'processus',
        name: 'Processus Projet',
        icon: Workflow,
        documents: [
          {
            id: 'processus-projet',
            name: 'Guide processus de construction PROGINEER',
            type: 'Guide',
            description: 'Guide complet du processus de votre projet de construction',
            url: '/documents/PROCESSUS-PROGINEER.pdf',
            category: 'processus',
            icon: 'Workflow',
            status: 'disponible',
            statusLabel: 'Nouveau !',
            isDisabled: false,
            order: 1
          }
        ]
      }
    ];

    setCategories(initialCategories);
  };

  const getCurrentCategoryDocuments = () => {
    return categories.find(cat => cat.id === activeTab)?.documents || [];
  };

  const handleSaveDocument = async (
    document: DocumentItem, 
    notificationOptions: { 
      createNotification: boolean; 
      sendEmail?: boolean; 
      sendPWA?: boolean; 
    } = { createNotification: false }
  ) => {
    try {
      const result = await saveDocument(document);
      if (result.success) {
        // Mettre à jour localement
        setCategories(prev => prev.map(category => {
          if (category.id === document.category) {
            return {
              ...category,
              documents: category.documents.map(doc => 
                doc.id === document.id ? document : doc
              )
            };
          }
          return category;
        }));
        
        // Créer une notification si demandé
        if (notificationOptions.createNotification) {
          console.log('🔔 Création notification pour modification document:', document.name);
          const notifResult = await addNotificationToFirebase({
            title: 'Document modifié',
            message: `Le document "${document.name}" a été mis à jour.`,
            type: 'new_document',
            documentName: document.name
          }, {
            sendEmail: notificationOptions.sendEmail,
            sendPWA: notificationOptions.sendPWA
          });
          
          if (!notifResult.success) {
            console.error('❌ Échec création notification:', notifResult.message);
            alert(`Document sauvegardé, mais erreur notification: ${notifResult.message}`);
          } else {
            console.log('✅ Notification créée avec succès');
          }
        }
        
        setEditingDocument(null);
        alert('Document sauvegardé avec succès');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        const result = await deleteDocumentService(documentId);
        if (result.success) {
          setCategories(prev => prev.map(category => ({
            ...category,
            documents: category.documents.filter(doc => doc.id !== documentId)
          })));
          alert('Document supprimé avec succès');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleAddDocument = async (
    notificationOptions: { 
      createNotification: boolean; 
      sendEmail?: boolean; 
      sendPWA?: boolean; 
    } = { createNotification: false }
  ) => {
    if (!newDocument.name || !newDocument.type || !newDocument.url) {
      alert('Veuillez renseigner au minimum le nom, le type et l\'URL du document');
      return;
    }

    try {
      const documentToAdd = {
        ...newDocument,
        category: activeTab,
        order: getCurrentCategoryDocuments().length + 1
      } as Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt'>;

      const result = await addDocument(documentToAdd);
      if (result.success && result.documentId) {
        // Recharger tous les documents pour avoir les données à jour
        await loadDocumentsFromFirebase();
        
        // Créer une notification si demandé
        if (notificationOptions.createNotification) {
          console.log('🔔 Création notification pour nouveau document:', documentToAdd.name);
          const notifResult = await addNotificationToFirebase({
            title: 'Nouveau document ajouté',
            message: `Le document "${documentToAdd.name}" a été ajouté à la section ${categories.find(c => c.id === activeTab)?.name}.`,
            type: 'new_document',
            documentName: documentToAdd.name
          }, {
            sendEmail: notificationOptions.sendEmail,
            sendPWA: notificationOptions.sendPWA
          });
          
          if (!notifResult.success) {
            console.error('❌ Échec création notification:', notifResult.message);
            alert(`Document ajouté, mais erreur notification: ${notifResult.message}`);
          } else {
            console.log('✅ Notification créée avec succès');
          }
        }
        
        setNewDocument({
          category: activeTab,
          icon: 'FileText',
          status: 'disponible',
          isSignable: false,
          isDisabled: false,
          order: 0
        });
        setShowAddModal(false);
        alert('Document ajouté avec succès');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur ajout:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const moveDocument = async (documentId: string, direction: 'up' | 'down') => {
    const documents = getCurrentCategoryDocuments();
    const docIndex = documents.findIndex(d => d.id === documentId);
    
    if (
      (direction === 'up' && docIndex === 0) ||
      (direction === 'down' && docIndex === documents.length - 1)
    ) return;

    const newDocuments = [...documents];
    const targetIndex = direction === 'up' ? docIndex - 1 : docIndex + 1;
    
    [newDocuments[docIndex], newDocuments[targetIndex]] = 
    [newDocuments[targetIndex], newDocuments[docIndex]];

    // Mettre à jour les ordres
    newDocuments.forEach((doc, index) => {
      doc.order = index + 1;
    });

    try {
      // Sauvegarder l'ordre dans Firebase
      const result = await updateDocumentsOrder(newDocuments);
      if (result.success) {
        setCategories(prev => prev.map(category => {
          if (category.id === activeTab) {
            return { ...category, documents: newDocuments };
          }
          return category;
        }));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur réorganisation:', error);
      alert('Erreur lors de la réorganisation');
    }
  };

  const renderDocument = (document: DocumentItem) => {
    const IconComponent = ICONS_MAP[document.icon] || FileText;
    
    return (
      <div
        key={document.id}
        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
          document.isDisabled 
            ? 'bg-gray-100 border-gray-200 opacity-60' 
            : 'bg-white border-gray-200 hover:border-[#c1a16a] hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${
              document.isDisabled ? 'bg-gray-200' : 'bg-[#c1a16a]/10'
            }`}>
              <IconComponent className={`w-6 h-6 ${
                document.isDisabled ? 'text-gray-400' : 'text-[#c1a16a]'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold ${
                  document.isDisabled ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {document.name}
                </h3>
                {document.statusLabel && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    document.status === 'disponible' ? 'bg-green-100 text-green-800' :
                    document.status === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {document.statusLabel}
                  </span>
                )}
                {document.isSignable && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Signable
                  </span>
                )}
              </div>
              <p className={`text-sm ${
                document.isDisabled ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {document.type} • {document.description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => moveDocument(document.id, 'up')}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Monter"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingDocument(document)}
              className="p-1 text-[#c1a16a] hover:text-[#787346] transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            {document.isDisabled ? (
              <EyeOff className="w-4 h-4 text-gray-400" title="Grisé" />
            ) : (
              <Eye className="w-4 h-4 text-green-500" title="Visible" />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(document.url, '_blank')}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteDocument(document.id)}
              className="p-1 text-red-400 hover:text-red-600 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1a16a] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-[#c1a16a] text-[#c1a16a]'
                    : 'border-transparent text-gray-500 hover:text-[#787346] hover:border-[#c1a16a]/30'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {category.name}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  isActive ? 'bg-amber-100 text-[#787346]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.documents.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Gestion de la section : {categories.find(c => c.id === activeTab)?.name}
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c1a16a] hover:bg-[#787346] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un document
        </button>
      </div>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getCurrentCategoryDocuments()
          .sort((a, b) => a.order - b.order)
          .map(renderDocument)}
      </div>

      {/* Modal d'édition */}
      {editingDocument && (
        <DocumentEditModal
          document={editingDocument}
          onSave={handleSaveDocument}
          onClose={() => setEditingDocument(null)}
        />
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <DocumentAddModal
          document={newDocument}
          onChange={setNewDocument}
          onSave={handleAddDocument}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

// Modal d'édition (composant séparé pour plus de clarté)
const DocumentEditModal: React.FC<{
  document: DocumentItem;
  onSave: (document: DocumentItem, notificationOptions: { createNotification: boolean; sendEmail?: boolean; sendPWA?: boolean; }) => void;
  onClose: () => void;
}> = ({ document, onSave, onClose }) => {
  const [editDoc, setEditDoc] = useState({ ...document });
  const [createNotification, setCreateNotification] = useState(() => 
    shouldHaveNotificationByDefault(document)
  );
  const [sendEmail, setSendEmail] = useState(false);
  const [sendPWA, setSendPWA] = useState(false);
  const [defaultClientEmail, setDefaultClientEmail] = useState<string>('');

  // Charger l'email client par défaut du projet
  useEffect(() => {
    const loadDefaultEmail = async () => {
      const email = await getDefaultClientEmail();
      if (email) {
        setDefaultClientEmail(email);
        // Si le document n'a pas d'email client défini, utiliser celui du projet
        if (!editDoc.clientEmail) {
          setEditDoc(prev => ({ ...prev, clientEmail: email }));
        }
      }
    };
    loadDefaultEmail();
  }, []);

  // Mettre à jour la case notification quand les propriétés du document changent
  useEffect(() => {
    setCreateNotification(shouldHaveNotificationByDefault(editDoc));
  }, [editDoc.isSignable, editDoc.status, editDoc.statusLabel, editDoc.category, editDoc.name]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Modifier le document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={editDoc.name}
                onChange={(e) => setEditDoc({ ...editDoc, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={editDoc.type}
                onChange={(e) => setEditDoc({ ...editDoc, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editDoc.description}
              onChange={(e) => setEditDoc({ ...editDoc, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={editDoc.status}
                onChange={(e) => setEditDoc({ ...editDoc, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              >
                <option value="disponible">Disponible</option>
                <option value="en_cours">En cours</option>
                <option value="en_attente">En attente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label du statut</label>
              <input
                type="text"
                value={editDoc.statusLabel || ''}
                onChange={(e) => setEditDoc({ ...editDoc, statusLabel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editDoc.isSignable || false}
                onChange={(e) => setEditDoc({ ...editDoc, isSignable: e.target.checked })}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <span className="ml-2 text-sm text-gray-700">Document signable</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editDoc.isDisabled || false}
                onChange={(e) => setEditDoc({ ...editDoc, isDisabled: e.target.checked })}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <span className="ml-2 text-sm text-gray-700">Grisé (non accessible)</span>
            </label>
          </div>

          {/* Section Emails pour documents signables */}
          {editDoc.isSignable && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Configuration des emails pour signature
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email client
                  </label>
                  <input
                    type="email"
                    value={editDoc.clientEmail || ''}
                    onChange={(e) => setEditDoc({ ...editDoc, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                    placeholder={defaultClientEmail || "email@client.com"}
                  />
                  {defaultClientEmail && (
                    <p className="text-xs text-gray-500 mt-1">
                      Par défaut du projet : {defaultClientEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email PROGINEER
                  </label>
                  <input
                    type="email"
                    value={editDoc.progineersEmail || ''}
                    onChange={(e) => setEditDoc({ ...editDoc, progineersEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                    placeholder="contact@progineer.fr"
                  />
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Info :</strong> Ces emails seront utilisés pour l'envoi des codes de vérification 
                  et notifications de signature. L'email client peut être personnalisé pour chaque document 
                  ou utiliser celui configuré dans la gestion de projet.
                </p>
              </div>
            </div>
          )}

          {/* Section Upload et URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Mettre à jour le document</label>
            
            {/* Option 1: Upload de fichier */}
            <div className="mb-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Option 1 : Uploader un nouveau fichier pour remplacer l'URL actuelle</p>
                <FileUpload
                  onFileUploaded={(url, fileName) => {
                    setEditDoc({ 
                      ...editDoc, 
                      url
                    });
                  }}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Option 2: URL manuelle */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Option 2 : Modifier l'URL manuellement</p>
              <input
                type="text"
                value={editDoc.url}
                onChange={(e) => setEditDoc({ ...editDoc, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                placeholder="/documents/mon-document.pdf"
              />
            </div>
          </div>
          
          {/* Section notifications */}
          <div className={`p-4 rounded-lg border ${createNotification ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={createNotification}
                onChange={(e) => setCreateNotification(e.target.checked)}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <Bell className={`w-4 h-4 ml-2 mr-1 ${createNotification ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${createNotification ? 'text-blue-800' : 'text-gray-700'}`}>
                Créer une notification pour informer de la modification
              </span>
              {shouldHaveNotificationByDefault(editDoc) && (
                <span className="ml-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                  Recommandé
                </span>
              )}
            </label>
            
            {createNotification && (
              <div className="ml-6 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
                  />
                  <Mail className="w-4 h-4 ml-2 mr-1 text-blue-600" />
                  <span className="text-sm text-blue-800">Envoyer par email au client</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendPWA}
                    onChange={(e) => setSendPWA(e.target.checked)}
                    className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
                  />
                  <Smartphone className="w-4 h-4 ml-2 mr-1 text-blue-600" />
                  <span className="text-sm text-blue-800">Notification push PWA</span>
                </label>
              </div>
            )}
            
            <p className={`text-xs mt-2 ml-6 ${createNotification ? 'text-blue-600' : 'text-gray-500'}`}>
              Une notification apparaîtra dans la cloche du header pour informer de cette modification.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(editDoc, { 
              createNotification, 
              sendEmail: createNotification ? sendEmail : false, 
              sendPWA: createNotification ? sendPWA : false 
            })}
            className="px-4 py-2 text-sm font-medium text-white bg-[#c1a16a] hover:bg-[#787346] rounded-md transition-colors"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal d'ajout
const DocumentAddModal: React.FC<{
  document: Partial<DocumentItem>;
  onChange: (document: Partial<DocumentItem>) => void;
  onSave: (notificationOptions: { createNotification: boolean; sendEmail?: boolean; sendPWA?: boolean; }) => void;
  onClose: () => void;
}> = ({ document, onChange, onSave, onClose }) => {
  const [createNotification, setCreateNotification] = useState(() => 
    shouldHaveNotificationByDefault(document)
  );
  const [sendEmail, setSendEmail] = useState(false);
  const [sendPWA, setSendPWA] = useState(false);
  const [defaultClientEmail, setDefaultClientEmail] = useState<string>('');

  // Charger l'email client par défaut du projet
  useEffect(() => {
    const loadDefaultEmail = async () => {
      const email = await getDefaultClientEmail();
      if (email) {
        setDefaultClientEmail(email);
        // Si le document n'a pas d'email client défini, utiliser celui du projet
        if (!document.clientEmail) {
          onChange({ ...document, clientEmail: email });
        }
      }
    };
    loadDefaultEmail();
  }, []);

  // Mettre à jour la case notification quand les propriétés du document changent
  useEffect(() => {
    setCreateNotification(shouldHaveNotificationByDefault(document));
  }, [document.isSignable, document.status, document.statusLabel, document.category, document.name]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Ajouter un nouveau document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={document.name || ''}
                onChange={(e) => onChange({ ...document, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                placeholder="Nom du document"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={document.type || ''}
                onChange={(e) => onChange({ ...document, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                placeholder="Type de document"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={document.description || ''}
              onChange={(e) => onChange({ ...document, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              placeholder="Description du document"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Document</label>
            
            {/* Option 1: Upload de fichier */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Option 1 : Uploader un nouveau fichier</p>
              <FileUpload
                onFileUploaded={(url, fileName) => {
                  onChange({ 
                    ...document, 
                    url, 
                    name: document.name || fileName.replace(/\.[^/.]+$/, ''), // Utiliser le nom du fichier si pas de nom
                    type: document.type || 'Document', // Type par défaut
                    description: document.description || `Document uploadé : ${fileName}` // Description par défaut
                  });
                }}
                className="w-full"
              />
            </div>
            
            {/* Option 2: URL manuelle */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Option 2 : Spécifier une URL manuellement</p>
              <input
                type="text"
                value={document.url || ''}
                onChange={(e) => onChange({ ...document, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                placeholder="/documents/mon-document.pdf"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={document.isSignable || false}
                onChange={(e) => onChange({ ...document, isSignable: e.target.checked })}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <span className="ml-2 text-sm text-gray-700">Document signable</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={document.isDisabled || false}
                onChange={(e) => onChange({ ...document, isDisabled: e.target.checked })}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <span className="ml-2 text-sm text-gray-700">Grisé (non accessible)</span>
            </label>
          </div>

          {/* Section Emails pour documents signables */}
          {document.isSignable && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Configuration des emails pour signature
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email client
                  </label>
                  <input
                    type="email"
                    value={document.clientEmail || ''}
                    onChange={(e) => onChange({ ...document, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                    placeholder={defaultClientEmail || "email@client.com"}
                  />
                  {defaultClientEmail && (
                    <p className="text-xs text-gray-500 mt-1">
                      Par défaut du projet : {defaultClientEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email PROGINEER
                  </label>
                  <input
                    type="email"
                    value={document.progineersEmail || ''}
                    onChange={(e) => onChange({ ...document, progineersEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                    placeholder="contact@progineer.fr"
                  />
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Info :</strong> Ces emails seront utilisés pour l'envoi des codes de vérification 
                  et notifications de signature. L'email client peut être personnalisé pour chaque document 
                  ou utiliser celui configuré dans la gestion de projet.
                </p>
              </div>
            </div>
          )}
          
          {/* Section notifications */}
          <div className={`p-4 rounded-lg border ${createNotification ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={createNotification}
                onChange={(e) => setCreateNotification(e.target.checked)}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <Bell className={`w-4 h-4 ml-2 mr-1 ${createNotification ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${createNotification ? 'text-blue-800' : 'text-gray-700'}`}>
                Créer une notification pour informer de l'ajout
              </span>
              {shouldHaveNotificationByDefault(document) && (
                <span className="ml-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                  Recommandé
                </span>
              )}
            </label>
            
            {createNotification && (
              <div className="ml-6 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
                  />
                  <Mail className="w-4 h-4 ml-2 mr-1 text-blue-600" />
                  <span className="text-sm text-blue-800">Envoyer par email au client</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendPWA}
                    onChange={(e) => setSendPWA(e.target.checked)}
                    className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
                  />
                  <Smartphone className="w-4 h-4 ml-2 mr-1 text-blue-600" />
                  <span className="text-sm text-blue-800">Notification push PWA</span>
                </label>
              </div>
            )}
            
            <p className={`text-xs mt-2 ml-6 ${createNotification ? 'text-blue-600' : 'text-gray-500'}`}>
              Une notification apparaîtra dans la cloche du header pour informer de ce nouveau document.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave({ 
              createNotification, 
              sendEmail: createNotification ? sendEmail : false, 
              sendPWA: createNotification ? sendPWA : false 
            })}
            disabled={!document.name || !document.type || !document.url}
            className="px-4 py-2 text-sm font-medium text-white bg-[#c1a16a] hover:bg-[#787346] disabled:bg-gray-400 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsManager;