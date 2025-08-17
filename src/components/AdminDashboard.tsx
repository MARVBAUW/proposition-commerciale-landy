import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Mail, 
  BarChart3, 
  Plus, 
  Settings, 
  LogOut,
  Shield,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  X,
  User,
  Layout,
  Bell,
  Smartphone
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DocumentsManager from './DocumentsManager';
import SignaturePositionPreview from './SignaturePositionPreview';
import { subscribeToSignatureUpdates, resetDocument } from '../services/signatureService';
import { loadNotifications, addNotification, updateNotification, deleteNotification, initializeDefaultNotifications, type NotificationData } from '../services/notificationsService';
import { sendCompleteNotification } from '../services/emailNotificationService';
import ProjectManager from './ProjectManager';
import { testFirebaseConnection } from '../utils/firebaseDiagnostic';
import { getAllSections, getAllTabs, getSectionLabel, getTabLabel } from '../services/navigationService';

// Import des types depuis SignaturePositionPreview
interface SignaturePosition {
  x: number;
  y: number; 
  width: number;
  height: number;
  page: number;
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
  documentPages: number;
  signatures: MultiSignature[];
  clientPosition?: SignaturePosition;
  progineersPosition?: SignaturePosition;
}

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  category: 'plans' | 'administratif' | 'processus';
  isSignable: boolean;
  status: 'disponible' | 'en_cours' | 'en_attente';
  statusLabel?: string;
  clientEmail?: string;
  progineersEmail?: string;
  clientSigned?: boolean;
  progineersigned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentAccess {
  clientEmail: string;
  progineersEmail: string;
  documentName: string;
}

interface Signature {
  documentId: string;
  signerType: 'client' | 'progineer';
  signerName: string;
  signerEmail: string;
  signatureData: string;
  signedAt: any;
  status: 'signed';
}

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

interface DocumentSignatureConfig {
  documentId: string;
  clientSignaturePosition: SignaturePosition;
  progineersSignaturePosition: SignaturePosition;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'signatures' | 'emails' | 'content' | 'notifications' | 'stats'>('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentAccess, setDocumentAccess] = useState<Record<string, DocumentAccess>>({});
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [realTimeSignatures, setRealTimeSignatures] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editingAccess, setEditingAccess] = useState<{docId: string, access: DocumentAccess} | null>(null);
  const [configuringSignatures, setConfiguringSignatures] = useState<string | null>(null);
  const [signatureConfigs, setSignatureConfigs] = useState<Record<string, SignatureConfig>>({});
  const [siteContent, setSiteContent] = useState<any>({});
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [editingNotification, setEditingNotification] = useState<NotificationData | null>(null);
  const [showAddNotificationModal, setShowAddNotificationModal] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les vraies données depuis Firebase
  useEffect(() => {
    loadDataFromFirebase();
    
    // Écouter les mises à jour temps réel des signatures
    const unsubscribe = subscribeToSignatureUpdates((signatures) => {
      setRealTimeSignatures(signatures);
    });

    // Écouter les événements de notification pour recharger automatiquement
    const handleNotificationUpdate = async () => {
      console.log('🔔 AdminDashboard: Rechargement automatique des notifications...');
      const notificationsData = await loadNotifications();
      setNotifications(notificationsData);
    };

    window.addEventListener('notificationAdded', handleNotificationUpdate);
    window.addEventListener('notificationDeleted', handleNotificationUpdate);
    
    return () => {
      unsubscribe();
      window.removeEventListener('notificationAdded', handleNotificationUpdate);
      window.removeEventListener('notificationDeleted', handleNotificationUpdate);
    };
  }, []);

  const loadDataFromFirebase = async () => {
    try {
      setLoading(true);
      
      // Charger les accès aux documents
      const accessSnapshot = await getDocs(collection(db, 'documentAccess'));
      const accessData: Record<string, DocumentAccess> = {};
      accessSnapshot.docs.forEach(doc => {
        accessData[doc.id] = doc.data() as DocumentAccess;
      });
      setDocumentAccess(accessData);
      
      // Charger les signatures existantes
      const signaturesSnapshot = await getDocs(collection(db, 'signatures'));
      const signaturesData: Signature[] = [];
      signaturesSnapshot.docs.forEach(doc => {
        signaturesData.push({ ...doc.data(), id: doc.id } as Signature);
      });
      setSignatures(signaturesData);
      
      // Charger les configurations de signatures
      const signatureConfigsSnapshot = await getDocs(collection(db, 'signatureConfigs'));
      const configsData: Record<string, SignatureConfig> = {};
      signatureConfigsSnapshot.docs.forEach(doc => {
        configsData[doc.id] = doc.data() as SignatureConfig;
      });
      setSignatureConfigs(configsData);
      console.log('📋 Configurations de signatures chargées:', configsData);
      
      // Charger le contenu du site
      const contentSnapshot = await getDocs(collection(db, 'siteContent'));
      const contentData: any = {};
      contentSnapshot.docs.forEach(doc => {
        contentData[doc.id] = doc.data();
      });
      setSiteContent(contentData);
      console.log('📝 Contenu du site chargé:', contentData);
      
      // Créer les documents avec les vraies données
      const realDocuments: Document[] = [
        {
          id: 'devis-mission-complete',
          name: 'Devis mission complète maîtrise d\'œuvre',
          type: 'Devis n°13',
          description: 'Devis pour mission complète de maîtrise d\'œuvre architecte',
          url: '/documents/Devis-D202508-13.pdf',
          category: 'administratif',
          isSignable: true,
          status: 'disponible',
          statusLabel: 'Nouveau !',
          clientEmail: accessData['devis-mission-complete']?.clientEmail || '',
          progineersEmail: accessData['devis-mission-complete']?.progineersEmail || 'progineer.moe@gmail.com',
          clientSigned: signaturesData.some(s => s.documentId === 'devis-mission-complete' && s.signerType === 'client'),
          progineersigned: signaturesData.some(s => s.documentId === 'devis-mission-complete' && s.signerType === 'progineer'),
          createdAt: new Date('2025-08-15'),
          updatedAt: new Date('2025-08-15')
        },
        {
          id: 'devis-mission-partielle',
          name: 'Devis mission partielle conception permis',
          type: 'Devis n°14',
          description: 'Devis pour mission partielle conception et permis de construire',
          url: '/documents/Devis-D202508-14.pdf',
          category: 'administratif',
          isSignable: true,
          status: 'disponible',
          statusLabel: 'Nouveau !',
          clientEmail: accessData['devis-mission-partielle']?.clientEmail || '',
          progineersEmail: accessData['devis-mission-partielle']?.progineersEmail || 'progineer.moe@gmail.com',
          clientSigned: signaturesData.some(s => s.documentId === 'devis-mission-partielle' && s.signerType === 'client'),
          progineersigned: signaturesData.some(s => s.documentId === 'devis-mission-partielle' && s.signerType === 'progineer'),
          createdAt: new Date('2025-08-15'),
          updatedAt: new Date('2025-08-15')
        },
        {
          id: 'contrat-moe',
          name: 'Contrat de maîtrise d\'œuvre',
          type: 'Contrat',
          description: 'Contrat de maîtrise d\'œuvre et mandat de délégation LANDY',
          url: '/documents/CONTRAT DE MAITRISE D\'OEUVRE ET MANDAT DE DÉLÉGATION LANDY.pdf',
          category: 'administratif',
          isSignable: true,
          status: 'disponible',
          statusLabel: 'Nouveau !',
          clientEmail: accessData['contrat-moe']?.clientEmail || '',
          progineersEmail: accessData['contrat-moe']?.progineersEmail || 'progineer.moe@gmail.com',
          clientSigned: signaturesData.some(s => s.documentId === 'contrat-moe' && s.signerType === 'client'),
          progineersigned: signaturesData.some(s => s.documentId === 'contrat-moe' && s.signerType === 'progineer'),
          createdAt: new Date('2025-08-15'),
          updatedAt: new Date('2025-08-15')
        }
      ];
      setDocuments(realDocuments);
      
      // Charger les notifications
      console.log('🔔 AdminDashboard: Début chargement notifications...');
      const notificationsData = await loadNotifications();
      console.log('🔔 AdminDashboard: Notifications reçues:', notificationsData.length, notificationsData);
      setNotifications(notificationsData);
      console.log('🔔 AdminDashboard: État notifications mis à jour');
      
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSignatureStatus = (doc: Document) => {
    if (!doc.isSignable) return { status: 'not-required', label: 'Signature non requise', color: 'gray' };
    
    // Utiliser les signatures temps réel de Firebase
    const realtimeSignature = realTimeSignatures[doc.id];
    const isSignedInRealTime = realtimeSignature?.isSigned || false;
    
    // Si signé en temps réel, document complet
    if (isSignedInRealTime) {
      return { status: 'completed', label: 'Document signé ✓', color: 'green' };
    }
    
    // Sinon, vérifier les propriétés locales pour les autres cas
    if (doc.clientSigned && doc.progineersigned) {
      return { status: 'completed', label: 'Signé par tous', color: 'green' };
    } else if (doc.clientSigned && !doc.progineersigned) {
      return { status: 'awaiting-progineer', label: 'En attente PROGINEER', color: 'orange' };
    } else if (!doc.clientSigned) {
      return { status: 'awaiting-client', label: 'En attente client', color: 'blue' };
    }
    
    return { status: 'pending', label: 'En attente', color: 'gray' };
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    }
  };

  const handleResetSignatures = async (documentId: string) => {
    // Utiliser la nouvelle fonction de réinitialisation complète
    await handleResetDocument(documentId);
  };

  // Gestion des notifications
  const handleDeleteNotification = async (notificationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      try {
        const result = await deleteNotification(notificationId);
        if (result.success) {
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
          // Déclencher un événement pour que le NotificationBell se mette à jour
          window.dispatchEvent(new CustomEvent('notificationDeleted'));
          alert('Notification supprimée avec succès');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erreur suppression notification:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleUpdateEmails = async (docId: string, access: DocumentAccess) => {
    try {
      await setDoc(doc(db, 'documentAccess', docId), access);
      await loadDataFromFirebase();
      setEditingAccess(null);
      alert('Emails mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour emails:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleAddNewSection = () => {
    setShowAddModal(true);
  };

  const handleSaveSignatureConfig = async (config: SignatureConfig) => {
    try {
      // Sauvegarder la configuration des signatures dans Firebase avec le nouveau format
      const configToSave = {
        documentId: config.documentId,
        documentPages: config.documentPages,
        signatures: config.signatures,
        // Backward compatibility - sauvegarder aussi l'ancien format
        clientSignaturePosition: config.clientPosition,
        progineersSignaturePosition: config.progineersPosition,
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'signatureConfigs', config.documentId), configToSave);
      
      // Mettre à jour l'état local
      setSignatureConfigs(prev => ({
        ...prev,
        [config.documentId]: config
      }));
      
      setConfiguringSignatures(null);
      console.log('✅ Configuration des signatures sauvegardée avec succès');
      alert('Configuration des signatures sauvegardée avec succès');
    } catch (error) {
      console.error('❌ Erreur sauvegarde configuration:', error);
      alert('Erreur lors de la sauvegarde de la configuration');
    }
  };

  const handleResetDocument = async (documentId: string) => {
    if (!confirm('⚠️ ATTENTION : Cette action va supprimer définitivement toutes les signatures et configurations de ce document. Cette action est irréversible. Continuer ?')) {
      return;
    }

    try {
      await resetDocument(documentId);
      
      // Recharger les données pour mettre à jour l'interface
      await loadDataFromFirebase();
      
      alert('✅ Document réinitialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      alert('❌ Erreur lors de la réinitialisation du document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1a16a] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'documents' as const, label: 'Documents', icon: FileText, count: documents.length },
    { id: 'signatures' as const, label: 'Signatures', icon: Users, count: documents.filter(d => d.isSignable).length },
    { id: 'emails' as const, label: 'Emails', icon: Mail, count: signatures.length },
    { id: 'content' as const, label: 'Contenu', icon: Layout, count: null },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, count: notifications.length },
    { id: 'stats' as const, label: 'Statistiques', icon: BarChart3, count: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header admin */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-[#c1a16a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/Diapositive13-removebg-preview.png" alt="PROGINEER Logo" className="h-10 w-auto mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">PROGINEER Admin</h1>
                <p className="text-sm text-[#787346]">Dashboard administrateur</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowProjectManager(true)}
                className="inline-flex items-center px-3 py-2 border border-[#c1a16a] text-sm leading-4 font-medium rounded-md text-[#c1a16a] bg-white hover:bg-[#c1a16a] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1a16a] transition-colors"
                title="Gestion du projet et configuration email client"
              >
                <User className="w-4 h-4 mr-2" />
                Projet
              </button>
              <button 
                onClick={async () => {
                  console.log('🧪 Test diagnostic Firebase');
                  const result = await testFirebaseConnection();
                  console.log('🧪 Résultat diagnostic:', result);
                  
                  if (result.success) {
                    // Déclencher le rechargement des notifications
                    window.dispatchEvent(new CustomEvent('notificationAdded'));
                    alert(`✅ Firebase OK!\n\n${result.message}\n\nDoc créé: ${result.details?.docId}`);
                  } else {
                    console.error('Détails erreur:', result.details);
                    alert(`❌ Erreur Firebase:\n\n${result.message}\n\nVérifiez la console pour plus de détails.`);
                  }
                }}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                title="Test Firebase"
              >
                🧪 Test
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-[#c1a16a] text-[#c1a16a]'
                      : 'border-transparent text-gray-500 hover:text-[#787346] hover:border-[#c1a16a]/30'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      isActive ? 'bg-amber-100 text-[#787346]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'documents' && (
          <div>
            <DocumentsManager />
          </div>
        )}

        {activeTab === 'signatures' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Suivi des signatures</h2>
              <div className="text-sm text-gray-500">
                Gérez les signatures et configurez leur positionnement sur les documents
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {documents.filter(doc => doc.isSignable).map((document) => {
                  const signatureStatus = getSignatureStatus(document);
                  
                  return (
                    <li key={document.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{document.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              signatureStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                              signatureStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                              signatureStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {signatureStatus.label}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className={`flex items-center ${document.clientSigned ? 'text-green-600' : 'text-gray-400'}`}>
                                {document.clientSigned ? <CheckCircle className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
                                Client {document.clientSigned ? 'signé' : 'en attente'}
                              </span>
                              <span className={`flex items-center ${document.progineersigned ? 'text-green-600' : 'text-gray-400'}`}>
                                {document.progineersigned ? <CheckCircle className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
                                PROGINEER {document.progineersigned ? 'signé' : 'en attente'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingAccess({
                                  docId: document.id,
                                  access: {
                                    clientEmail: document.clientEmail || '',
                                    progineersEmail: document.progineersEmail || 'progineer.moe@gmail.com',
                                    documentName: document.name
                                  }
                                })}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                title="Gérer les emails des signataires"
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Emails
                              </button>
                              
                              <button
                                onClick={() => setConfiguringSignatures(document.id)}
                                className="inline-flex items-center px-3 py-1 border border-[#c1a16a] text-xs font-medium rounded-md text-[#c1a16a] bg-white hover:bg-amber-50 transition-colors"
                                title="Configurer la position des signatures"
                              >
                                <Settings className="w-3 h-3 mr-1" />
                                Position
                              </button>
                              
                              <button
                                onClick={() => handleResetSignatures(document.id)}
                                className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded-md text-red-600 bg-white hover:bg-red-50 transition-colors"
                                title="Réinitialiser les signatures"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Reset
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Historique des emails</h2>
            
            {/* Statistiques emails */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Emails envoyés
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {signatures.length * 2} {/* 2 emails par signature (code + notification) */}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Codes vérifiés
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {signatures.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Aujourd'hui
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {signatures.filter(s => {
                            const today = new Date().toDateString();
                            const sigDate = s.signedAt?.toDate?.()?.toDateString?.() || '';
                            return sigDate === today;
                          }).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Liste des activités email */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Activité récente</h3>
                
                {signatures.length > 0 ? (
                  <div className="space-y-4">
                    {signatures.map((signature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Mail className="w-5 h-5 text-[#c1a16a] mt-0.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              Code de vérification envoyé
                            </p>
                            <p className="text-xs text-gray-500">
                              {signature.signedAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || 'Date inconnue'}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            À: {signature.signerEmail} • Document: {signature.documentId} • Role: {signature.signerType === 'client' ? 'Client' : 'PROGINEER'}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Vérifié et signé
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun email envoyé</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      L'historique des emails apparaitra ici après les premières signatures.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Gestion du contenu</h2>
              <button
                onClick={() => setEditingContent('new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c1a16a] hover:bg-[#787346] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle section
              </button>
            </div>

            <div className="space-y-4">
              {/* Section Résumé du projet */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Synthèse du projet</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Caractéristiques du bien et spécifications techniques
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingContent('project-summary')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Pricing */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Devis détaillé</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Prix et détails des prestations
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingContent('pricing')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Services */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Nos prestations</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Description des services proposés
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingContent('services')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Timeline */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Planning</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Calendrier de réalisation du projet
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingContent('timeline')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Gestion des notifications ({notifications.length})</h2>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    console.log('🔄 Force rechargement notifications...');
                    const notificationsData = await loadNotifications();
                    console.log('🔄 Notifications rechargées:', notificationsData.length);
                    setNotifications(notificationsData);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recharger
                </button>
                <button
                  onClick={() => setShowAddNotificationModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c1a16a] hover:bg-[#787346] transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une notification
                </button>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {notification.icon && <span className="mr-2 text-xl">{notification.icon}</span>}
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              notification.type === 'signature_ready' ? 'bg-purple-100 text-purple-800' :
                              notification.type === 'processus_projet' ? 'bg-yellow-100 text-yellow-800' :
                              notification.type === 'new_document' ? 'bg-green-100 text-green-800' :
                              notification.type === 'contact' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {notification.type}
                            </span>
                            {notification.isHighlighted && (
                              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                Mise en avant
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        
                        {/* Informations de navigation */}
                        {(notification.targetSection || notification.customUrl) && (
                          <div className="mt-2 flex items-center space-x-2 text-xs">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700">
                              🧭 {notification.customUrl ? 
                                `URL: ${notification.customUrl}` : 
                                `${getSectionLabel(notification.targetSection!)}${notification.targetTab ? ` → ${getTabLabel(notification.targetTab)}` : ''}`
                              }
                            </span>
                          </div>
                        )}
                        
                        <p className="mt-1 text-xs text-gray-400">
                          Créée le {notification.createdAt?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setEditingNotification(notification)}
                          className="p-2 text-[#c1a16a] hover:text-[#787346] transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification.id!)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune notification</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle notification.</p>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                    <p className="text-xs text-blue-800">
                      Debug: État notifications = {JSON.stringify(notifications.length)} notifications
                    </p>
                    <button
                      onClick={async () => {
                        console.log('🔥 Force initialisation notifications par défaut...');
                        await initializeDefaultNotifications();
                        const notificationsData = await loadNotifications();
                        setNotifications(notificationsData);
                        console.log('🔥 Notifications rechargées après init:', notificationsData.length);
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      🔄 Forcer init notifications par défaut
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Documents totaux
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {documents.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Documents signés
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {documents.filter(d => d.clientSigned && d.progineersigned).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          En attente
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {documents.filter(d => d.isSignable && (!d.clientSigned || !d.progineersigned)).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal édition emails */}
      {editingAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gérer les emails des signataires</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email du client
                </label>
                <input
                  type="email"
                  value={editingAccess.access.clientEmail}
                  onChange={(e) => setEditingAccess({
                    ...editingAccess,
                    access: { ...editingAccess.access, clientEmail: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="client@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email PROGINEER
                </label>
                <input
                  type="email"
                  value={editingAccess.access.progineersEmail}
                  onChange={(e) => setEditingAccess({
                    ...editingAccess,
                    access: { ...editingAccess.access, progineersEmail: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="progineer.moe@gmail.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingAccess(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Annuler
              </button>
              <button
                onClick={() => handleUpdateEmails(editingAccess.docId, editingAccess.access)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#c1a16a] hover:bg-[#787346] rounded-md transition-colors"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajout nouvelle section */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une nouvelle section de documents</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la section
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="ex: Plans esquisse"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="Description de la section..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent">
                  <option value="plans">Plans</option>
                  <option value="administratif">Administratif</option>
                  <option value="processus">Processus</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Annuler
              </button>
              <button
                onClick={() => {
                  // TODO: Implémenter l'ajout de section
                  alert('Fonctionnalité en cours de développement');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#c1a16a] hover:bg-[#787346] rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal configuration signatures */}
      {configuringSignatures && (
        <SignaturePositionPreview
          documentId={configuringSignatures}
          documentUrl={documents.find(d => d.id === configuringSignatures)?.url || ''}
          onSave={handleSaveSignatureConfig}
          onClose={() => setConfiguringSignatures(null)}
          initialConfig={signatureConfigs[configuringSignatures]}
        />
      )}

      {/* Modal ajout notification */}
      {showAddNotificationModal && (
        <NotificationModal
          onSave={async (notification, options) => {
            const result = await addNotification(notification);
            if (result.success) {
              // Fermer le modal immédiatement
              setShowAddNotificationModal(false);
              
              // Recharger les notifications pour obtenir la nouvelle avec son ID
              const notificationsData = await loadNotifications();
              setNotifications(notificationsData);
              
              // Dispatch l'événement et afficher le message immédiatement
              window.dispatchEvent(new CustomEvent('notificationAdded'));
              alert('Notification ajoutée avec succès');
              
              // Envoyer les notifications supplémentaires en arrière-plan (sans attendre)
              if (options.sendEmail || options.sendPWA) {
                sendCompleteNotification(
                  {
                    title: notification.title,
                    message: notification.message,
                    type: 'custom_notification',
                    targetSection: notification.targetSection,
                    targetTab: notification.targetTab,
                    customUrl: notification.customUrl
                  },
                  {
                    sendEmail: options.sendEmail,
                    sendPWA: options.sendPWA
                  }
                ).then(notificationResult => {
                  if (notificationResult.errors.length > 0) {
                    console.warn('Erreurs envoi notifications:', notificationResult.errors);
                  }
                }).catch(error => {
                  console.error('Erreur envoi notification:', error);
                });
              }
            } else {
              alert(result.message);
            }
          }}
          onClose={() => setShowAddNotificationModal(false)}
        />
      )}

      {/* Modal édition notification */}
      {editingNotification && (
        <NotificationModal
          notification={editingNotification}
          onSave={async (notification, options) => {
            const result = await updateNotification(editingNotification.id!, notification);
            if (result.success) {
              // Fermer le modal immédiatement pour une meilleure UX
              setEditingNotification(null);
              
              // Mettre à jour localement la notification dans la liste
              setNotifications(prev => 
                prev.map(n => n.id === editingNotification.id 
                  ? { ...notification, id: editingNotification.id, createdAt: n.createdAt, updatedAt: new Date() } 
                  : n
                )
              );
              
              // Dispatch l'événement et afficher le message immédiatement
              window.dispatchEvent(new CustomEvent('notificationAdded'));
              alert('Notification modifiée avec succès');
              
              // Envoyer les notifications supplémentaires en arrière-plan (sans attendre)
              if (options.sendEmail || options.sendPWA) {
                sendCompleteNotification(
                  {
                    title: notification.title,
                    message: notification.message,
                    type: 'custom_notification',
                    targetSection: notification.targetSection,
                    targetTab: notification.targetTab,
                    customUrl: notification.customUrl
                  },
                  {
                    sendEmail: options.sendEmail,
                    sendPWA: options.sendPWA
                  }
                ).then(notificationResult => {
                  if (notificationResult.errors.length > 0) {
                    console.warn('Erreurs envoi notifications:', notificationResult.errors);
                  }
                }).catch(error => {
                  console.error('Erreur envoi notification:', error);
                });
              }
            } else {
              alert(result.message);
            }
          }}
          onClose={() => setEditingNotification(null)}
        />
      )}

      {/* Modal gestion de projet */}
      {showProjectManager && (
        <ProjectManager
          onClose={() => setShowProjectManager(false)}
        />
      )}
    </div>
  );
};

// Modal pour ajouter/modifier une notification
const NotificationModal: React.FC<{
  notification?: NotificationData;
  onSave: (
    notification: Omit<NotificationData, 'id' | 'createdAt' | 'updatedAt'>,
    options: { sendEmail: boolean; sendPWA: boolean; }
  ) => void;
  onClose: () => void;
}> = ({ notification, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: notification?.title || '',
    message: notification?.message || '',
    type: notification?.type || 'new_document' as const,
    isHighlighted: notification?.isHighlighted || false,
    icon: notification?.icon || '',
    targetSection: notification?.targetSection || '',
    targetTab: notification?.targetTab || '',
    customUrl: notification?.customUrl || ''
  });
  const [sendEmail, setSendEmail] = useState(false);
  const [sendPWA, setSendPWA] = useState(false);

  // Récupérer les sections et onglets disponibles
  const availableSections = getAllSections();
  const availableTabs = getAllTabs();

  // Palette d'icônes disponibles
  const availableIcons = [
    // Génériques
    '📢', '📣', '💬', '📝', '📋', '📄', '📃', '📑', 
    // Actions
    '✅', '❌', '⚠️', '🔴', '🟢', '🟡', '⭐', '🌟', '✨', '💫',
    // Documents & signature
    '📋', '📝', '📄', '📃', '📑', '📊', '📈', '📉', '🖊️', '✍️', '🖋️',
    // Communication
    '📧', '📨', '📩', '💌', '📬', '📭', '📮', '🔔', '🔕', '📞', '📱',
    // Temps & calendrier
    '⏰', '⏱️', '⏲️', '🕐', '🕑', '🕒', '📅', '📆', '⏳', '⌛',
    // Construction & maison
    '🏠', '🏡', '🏢', '🏗️', '🛠️', '🔧', '🔨', '⚒️', '🪜', '📐', '📏',
    // Personnes & contact
    '👤', '👥', '👨‍💼', '👩‍💼', '🤝', '📞', '💼', '🎯', '🎪',
    // Financier
    '💰', '💵', '💴', '💶', '💷', '💳', '💎', '📊', '📈', '💹',
    // Validation & processus
    '✅', '❌', '⭕', '❓', '❗', '‼️', '⚡', '🔥', '💡', '🎉', '🎊',
    // Flèches & direction
    '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '🔄', '🔃', '🔂'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {notification ? 'Modifier la notification' : 'Ajouter une notification'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              placeholder="Titre de la notification"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
              placeholder="Contenu de la notification"
            />
          </div>

          {/* Sélecteur d'icônes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône du titre {formData.icon && <span className="ml-2 text-lg">{formData.icon}</span>}
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
              <div className="grid grid-cols-10 gap-2">
                {/* Option sans icône */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: '' })}
                  className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                    formData.icon === '' ? 'border-[#c1a16a] bg-[#c1a16a] text-white' : 'border-gray-300 hover:border-gray-400 text-gray-500'
                  }`}
                  title="Aucune icône"
                >
                  ∅
                </button>
                
                {/* Palette d'icônes */}
                {availableIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center text-lg hover:scale-110 transition-transform ${
                      formData.icon === icon ? 'border-[#c1a16a] bg-amber-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={`Icône: ${icon}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Choisissez une icône qui apparaitra avant le titre de la notification
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
            >
              <option value="new_document">Nouveau document</option>
              <option value="signature_ready">Signature prête</option>
              <option value="processus_projet">Processus projet</option>
              <option value="contact">Contact</option>
              <option value="waiting_approval">En attente d'approbation</option>
            </select>
          </div>

          {/* Section Navigation */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              🧭 Navigation vers section
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section de destination
                </label>
                <select
                  value={formData.targetSection}
                  onChange={(e) => setFormData({ ...formData, targetSection: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                >
                  <option value="">Aucune redirection</option>
                  {availableSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Section vers laquelle rediriger quand on clique sur la notification
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onglet documents (optionnel)
                </label>
                <select
                  value={formData.targetTab}
                  onChange={(e) => setFormData({ ...formData, targetTab: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                  disabled={formData.targetSection !== 'documents'}
                >
                  <option value="">Aucun onglet spécifique</option>
                  {availableTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Onglet spécifique si la section Documents est sélectionnée
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL personnalisée (optionnel)
              </label>
              <input
                type="text"
                value={formData.customUrl}
                onChange={(e) => setFormData({ ...formData, customUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1a16a]"
                placeholder="https://example.com ou /page-interne"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si définie, cette URL sera utilisée à la place de la section sélectionnée
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isHighlighted}
                onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
              />
              <span className="ml-2 text-sm text-gray-700">Notification mise en avant</span>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Options d'envoi</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
                  />
                  <Mail className="w-4 h-4 ml-2 mr-1 text-blue-600" />
                  <span className="text-sm text-gray-700">Envoyer par email au client</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendPWA}
                    onChange={(e) => setSendPWA(e.target.checked)}
                    className="rounded border-gray-300 text-[#c1a16a] focus:ring-[#c1a16a]"
                  />
                  <Smartphone className="w-4 h-4 ml-2 mr-1 text-blue-600" />
                  <span className="text-sm text-gray-700">Notification push PWA</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                En plus de la notification dans l'application, vous pouvez choisir d'envoyer des notifications supplémentaires.
              </p>
            </div>
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
            onClick={() => {
              const notificationData = {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                isHighlighted: formData.isHighlighted,
                ...(formData.icon && { icon: formData.icon }),
                ...(formData.targetSection && { targetSection: formData.targetSection }),
                ...(formData.targetTab && { targetTab: formData.targetTab }),
                ...(formData.customUrl && { customUrl: formData.customUrl })
              };
              onSave(notificationData, { sendEmail, sendPWA });
            }}
            disabled={!formData.title || !formData.message}
            className="px-4 py-2 text-sm font-medium text-white bg-[#c1a16a] hover:bg-[#787346] disabled:bg-gray-400 rounded-md transition-colors"
          >
            {notification ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;