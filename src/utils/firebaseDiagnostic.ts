import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

export const testFirebaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('🔧 Test de connexion Firebase...');
    
    // Test 1: Vérifier la configuration
    if (!db) {
      return {
        success: false,
        message: 'Base de données Firebase non initialisée'
      };
    }
    
    // Test 2: Tentative de lecture
    console.log('🔧 Test lecture des notifications...');
    const notificationsRef = collection(db, 'notifications');
    const testQuery = query(notificationsRef, limit(1));
    const snapshot = await getDocs(testQuery);
    
    console.log('🔧 Lecture réussie, nombre de docs:', snapshot.size);
    
    // Test 3: Tentative d'écriture
    console.log('🔧 Test écriture d\'une notification test...');
    const testDoc = {
      title: 'Test Firebase Connection',
      message: 'Test de connexion Firebase',
      type: 'new_document' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(notificationsRef, testDoc);
    
    console.log('🔧 Écriture réussie, ID:', docRef.id);
    
    return {
      success: true,
      message: 'Firebase fonctionne correctement',
      details: {
        docId: docRef.id,
        existingDocs: snapshot.size
      }
    };
    
  } catch (error: any) {
    console.error('🔧 Erreur test Firebase:', error);
    
    return {
      success: false,
      message: `Erreur Firebase: ${error.message || error}`,
      details: {
        errorCode: error.code,
        errorMessage: error.message,
        fullError: error
      }
    };
  }
};