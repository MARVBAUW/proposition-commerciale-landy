import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  category: 'plans' | 'administratif' | 'processus';
  icon: string;
  status?: 'disponible' | 'en_cours' | 'en_attente';
  statusLabel?: string;
  isSignable?: boolean;
  isDisabled?: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentCategory {
  id: 'plans' | 'administratif' | 'processus';
  name: string;
  icon: string;
  documents: DocumentItem[];
}

// Documents par défaut (fallback si Firebase est vide)
const defaultDocuments: DocumentItem[] = [
  // Plans
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
  },
  
  // Administratif
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
  },
  {
    id: 'proposition-signee',
    name: 'Proposition commerciale signée',
    type: 'Contrat',
    description: 'Proposition commerciale validée et signée par M. et Mme LANDY',
    url: '/documents/proposition-signee.pdf',
    category: 'administratif',
    icon: 'FileText',
    status: 'en_attente',
    statusLabel: 'En attente signature',
    isDisabled: true,
    order: 4
  },
  {
    id: 'accompte',
    name: 'Accompte',
    type: 'Accompte',
    description: 'Accompte de démarrage 20% = 6 548,04 € TTC',
    url: '/documents/accompte.pdf',
    category: 'administratif',
    icon: 'CreditCard',
    status: 'en_attente',
    statusLabel: 'En attente paiement',
    isDisabled: true,
    order: 5
  },
  
  // Processus
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
];

// Charger tous les documents depuis Firebase
export const loadDocuments = async (): Promise<DocumentItem[]> => {
  try {
    const documentsSnapshot = await getDocs(collection(db, 'documents'));
    
    if (documentsSnapshot.empty) {
      // Première fois - initialiser avec les documents par défaut
      console.log('📄 Initialisation des documents par défaut dans Firebase...');
      await initializeDefaultDocuments();
      return defaultDocuments;
    }
    
    const documents: DocumentItem[] = [];
    documentsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      documents.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as DocumentItem);
    });
    
    return documents.sort((a, b) => {
      if (a.category !== b.category) {
        const order = { plans: 0, administratif: 1, processus: 2 };
        return order[a.category] - order[b.category];
      }
      return a.order - b.order;
    });
    
  } catch (error) {
    console.error('Erreur chargement documents:', error);
    return defaultDocuments;
  }
};

// Initialiser les documents par défaut dans Firebase
const initializeDefaultDocuments = async (): Promise<void> => {
  try {
    const batch = defaultDocuments.map(async (document) => {
      const docRef = doc(db, 'documents', document.id);
      await setDoc(docRef, {
        ...document,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await Promise.all(batch);
    console.log('✅ Documents par défaut initialisés dans Firebase');
    
  } catch (error) {
    console.error('❌ Erreur initialisation documents:', error);
  }
};

// Sauvegarder un document
export const saveDocument = async (document: DocumentItem): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('💾 Sauvegarde document:', document.id, document.name);
    const docRef = doc(db, 'documents', document.id);
    const documentData = {
      ...document,
      updatedAt: new Date()
    };
    
    await setDoc(docRef, documentData, { merge: true });
    console.log('✅ Document sauvegardé avec succès:', document.id);
    
    return {
      success: true,
      message: 'Document sauvegardé avec succès'
    };
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde document:', error);
    return {
      success: false,
      message: `Erreur lors de la sauvegarde: ${error.message}`
    };
  }
};

// Supprimer un document
export const deleteDocument = async (documentId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await deleteDoc(doc(db, 'documents', documentId));
    
    return {
      success: true,
      message: 'Document supprimé avec succès'
    };
    
  } catch (error) {
    console.error('Erreur suppression document:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression'
    };
  }
};

// Ajouter un nouveau document
export const addDocument = async (document: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string; documentId?: string }> => {
  try {
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const docRef = doc(db, 'documents', documentId);
    
    const newDocument: DocumentItem = {
      ...document,
      id: documentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(docRef, newDocument);
    
    return {
      success: true,
      message: 'Document ajouté avec succès',
      documentId
    };
    
  } catch (error) {
    console.error('Erreur ajout document:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'ajout'
    };
  }
};

// Mettre à jour l'ordre des documents d'une catégorie
export const updateDocumentsOrder = async (documents: DocumentItem[]): Promise<{ success: boolean; message: string }> => {
  try {
    const updatePromises = documents.map(async (document, index) => {
      const docRef = doc(db, 'documents', document.id);
      await updateDoc(docRef, {
        order: index + 1,
        updatedAt: new Date()
      });
    });
    
    await Promise.all(updatePromises);
    
    return {
      success: true,
      message: 'Ordre des documents mis à jour'
    };
    
  } catch (error) {
    console.error('Erreur mise à jour ordre:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour de l\'ordre'
    };
  }
};

// Organiser les documents par catégories
export const organizeDocumentsByCategory = (documents: DocumentItem[]): DocumentCategory[] => {
  const categories: DocumentCategory[] = [
    {
      id: 'plans',
      name: 'Plans & Études',
      icon: 'Home',
      documents: []
    },
    {
      id: 'administratif',
      name: 'Administratif & Contrats',
      icon: 'Briefcase',
      documents: []
    },
    {
      id: 'processus',
      name: 'Processus Projet',
      icon: 'Workflow',
      documents: []
    }
  ];
  
  documents.forEach(document => {
    const category = categories.find(cat => cat.id === document.category);
    if (category) {
      category.documents.push(document);
    }
  });
  
  // Trier les documents par ordre dans chaque catégorie
  categories.forEach(category => {
    category.documents.sort((a, b) => a.order - b.order);
  });
  
  return categories;
};

// Écouter les changements de documents en temps réel
export const subscribeToDocuments = (callback: (documents: DocumentItem[]) => void) => {
  // TODO: Implémenter onSnapshot pour les mises à jour en temps réel
  // Pour l'instant, on charge une fois
  loadDocuments().then(callback);
  
  // Retourner une fonction de désabonnement factice
  return () => {};
};