import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ProjectConfig {
  id: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  progineersEmail: string;
  progineersPhone?: string;
  projectDescription?: string;
  createdAt?: any;
  updatedAt?: any;
}

const PROJECT_COLLECTION = 'projectConfig';
const DEFAULT_PROJECT_ID = 'landy-construction';

// Charger la configuration du projet
export const loadProjectConfig = async (): Promise<ProjectConfig | null> => {
  try {
    const docRef = doc(db, PROJECT_COLLECTION, DEFAULT_PROJECT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ProjectConfig;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement de la configuration projet:', error);
    return null;
  }
};

// Sauvegarder la configuration du projet
export const saveProjectConfig = async (config: Omit<ProjectConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const docRef = doc(db, PROJECT_COLLECTION, DEFAULT_PROJECT_ID);
    const docSnap = await getDoc(docRef);
    
    const now = new Date();
    
    if (docSnap.exists()) {
      // Mettre à jour la configuration existante
      await updateDoc(docRef, {
        ...config,
        updatedAt: now
      });
    } else {
      // Créer une nouvelle configuration
      await setDoc(docRef, {
        ...config,
        createdAt: now,
        updatedAt: now
      });
    }
    
    return {
      success: true,
      message: 'Configuration du projet sauvegardée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration projet:', error);
    return {
      success: false,
      message: 'Erreur lors de la sauvegarde de la configuration'
    };
  }
};

// Obtenir l'email client par défaut pour les documents
export const getDefaultClientEmail = async (): Promise<string | null> => {
  try {
    const config = await loadProjectConfig();
    return config?.clientEmail || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'email client:', error);
    return null;
  }
};

// Initialiser la configuration par défaut si elle n'existe pas
export const initializeDefaultProjectConfig = async (): Promise<void> => {
  try {
    const existingConfig = await loadProjectConfig();
    
    if (!existingConfig) {
      const defaultConfig: Omit<ProjectConfig, 'id' | 'createdAt' | 'updatedAt'> = {
        projectName: 'Construction LANDY',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        progineersEmail: 'contact@progineer.fr',
        progineersPhone: '',
        projectDescription: 'Maîtrise d\'œuvre architecturale pour construction individuelle'
      };
      
      await saveProjectConfig(defaultConfig);
      console.log('Configuration projet par défaut initialisée');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la configuration projet:', error);
  }
};