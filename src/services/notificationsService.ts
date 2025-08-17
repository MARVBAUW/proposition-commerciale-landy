import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface NotificationData {
  id?: string;
  title: string;
  message: string;
  type: 'processus_projet' | 'new_document' | 'contact' | 'waiting_approval' | 'signature_ready';
  isHighlighted?: boolean;
  // Icône personnalisée pour le titre (emoji ou nom d'icône)
  icon?: string;
  // Navigation vers les sections du projet
  targetSection?: 'project-summary' | 'pricing' | 'services' | 'total' | 'exclusions' | 'timeline' | 'documents';
  targetTab?: 'plans' | 'administratif' | 'processus'; // Pour les documents
  customUrl?: string; // URL personnalisée si besoin
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface NotificationResult {
  success: boolean;
  message: string;
  notificationId?: string;
}

// Charger toutes les notifications
export const loadNotifications = async (): Promise<NotificationData[]> => {
  try {
    console.log('🔥 Service notificationsService: Début chargement notifications...');
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('🔥 Service notificationsService: Query réussie, docs récupérés:', querySnapshot.size);
    
    const notifications: NotificationData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('🔥 Service notificationsService: Doc trouvé:', doc.id, data);
      notifications.push({
        id: doc.id,
        ...data
      } as NotificationData);
    });
    
    console.log('🔥 Service notificationsService: Notifications finales:', notifications.length, notifications);
    return notifications;
  } catch (error) {
    console.error('🔥 Service notificationsService: Erreur lors du chargement des notifications:', error);
    return [];
  }
};

// Ajouter une nouvelle notification
export const addNotification = async (notification: Omit<NotificationData, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationResult> => {
  try {
    console.log('🔥 Service notificationsService: Ajout notification', notification);
    
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('🔥 Service notificationsService: Notification ajoutée avec ID:', docRef.id);
    
    return {
      success: true,
      message: 'Notification ajoutée avec succès',
      notificationId: docRef.id
    };
  } catch (error) {
    console.error('🔥 Service notificationsService: Erreur lors de l\'ajout de la notification:', error);
    return {
      success: false,
      message: `Erreur lors de l'ajout de la notification: ${error.message || error}`
    };
  }
};

// Modifier une notification
export const updateNotification = async (notificationId: string, notification: Partial<NotificationData>): Promise<NotificationResult> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      ...notification,
      updatedAt: Timestamp.now()
    });
    
    return {
      success: true,
      message: 'Notification modifiée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la modification de la notification:', error);
    return {
      success: false,
      message: 'Erreur lors de la modification de la notification'
    };
  }
};

// Supprimer une notification
export const deleteNotification = async (notificationId: string): Promise<NotificationResult> => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
    
    return {
      success: true,
      message: 'Notification supprimée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression de la notification'
    };
  }
};

// Créer une notification pour les documents signables
export const createNotificationForSignableDocuments = async (): Promise<void> => {
  try {
    const existingNotifications = await loadNotifications();
    
    // Vérifier si la notification pour les documents signables existe déjà
    const hasSignableNotification = existingNotifications.some(
      notif => notif.type === 'signature_ready' && notif.title.includes('3 fichiers')
    );
    
    if (!hasSignableNotification) {
      // Créer une notification spécifique pour les 3 documents signables
      await addNotification({
        title: '📋 3 fichiers prêts pour signature',
        message: 'Devis mission complète, devis mission partielle et contrat de maîtrise d\'œuvre sont disponibles pour signature électronique dans l\'onglet Administratif.',
        type: 'signature_ready',
        isHighlighted: true
      });
      
      console.log('Notification pour documents signables créée');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la notification documents signables:', error);
  }
};

// Initialiser les notifications par défaut (à utiliser une seule fois)
export const initializeDefaultNotifications = async (): Promise<void> => {
  try {
    console.log('🔥 Initialisation des notifications par défaut...');
    const existingNotifications = await loadNotifications();
    console.log('🔥 Notifications existantes trouvées:', existingNotifications.length);
    
    // Si des notifications existent déjà, ne pas initialiser
    if (existingNotifications.length > 0) {
      console.log('🔥 Notifications déjà existantes, vérification des documents signables...');
      // Vérifier si on doit ajouter la notification des documents signables
      await createNotificationForSignableDocuments();
      return;
    }
    
    console.log('🔥 Aucune notification existante, création des notifications par défaut...');

    const defaultNotifications: Omit<NotificationData, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Système de signature électronique activé !',
        message: 'Vous pouvez maintenant signer électroniquement vos documents directement depuis cette application. Vérifiez votre email pour recevoir les codes de vérification.',
        type: 'signature_ready',
        isHighlighted: true,
        icon: '✨',
        targetSection: 'documents',
        targetTab: 'administratif'
      },
      {
        title: 'Guide PROCESSUS PROJET disponible !',
        message: 'Découvrez le guide complet du processus de construction PROGINEER. Ce document détaille toutes les étapes de votre projet, de la conception à la réception. Consultez-le dès maintenant dans Processus Projet !',
        type: 'processus_projet',
        isHighlighted: true,
        icon: '🌟',
        targetSection: 'documents',
        targetTab: 'processus'
      },
      {
        title: '3 fichiers prêts pour signature',
        message: 'Devis mission complète, devis mission partielle et contrat de maîtrise d\'œuvre sont disponibles pour signature électronique dans l\'onglet Administratif.',
        type: 'signature_ready',
        isHighlighted: true,
        icon: '📋',
        targetSection: 'documents',
        targetTab: 'administratif'
      },
      {
        title: 'Nouveaux documents disponibles',
        message: 'Plan de cadastre et Notice PLU Zone UD sont maintenant consultables dans la section Plans.',
        type: 'new_document',
        icon: '📄',
        targetSection: 'documents',
        targetTab: 'plans'
      },
      {
        title: 'Contact Assurance Dommage-Ouvrage ajouté',
        message: 'Les coordonnées de Nicolas CHERON ont été ajoutées dans la section Exclusions pour votre assurance DO.',
        type: 'contact',
        icon: '👤',
        targetSection: 'exclusions'
      },
      {
        title: 'En attente de votre acceptation',
        message: 'Le devis de maîtrise d\'œuvre et la facture d\'accompte seront disponibles après validation de cette proposition commerciale.',
        type: 'waiting_approval',
        icon: '⏳',
        targetSection: 'total'
      }
    ];

    // Ajouter chaque notification par défaut
    for (const notification of defaultNotifications) {
      await addNotification(notification);
    }
    
    console.log('Notifications par défaut initialisées');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des notifications:', error);
  }
};