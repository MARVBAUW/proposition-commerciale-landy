import { collection, doc, setDoc, getDoc, deleteDoc, where, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface SecureToken {
  id: string;
  documentId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  createdBy?: string; // Email de celui qui a généré le lien
}

// Générer un token sécurisé pour un document
export const generateSecureToken = async (documentId: string, createdBy?: string): Promise<{ success: boolean; token?: string; message: string }> => {
  try {
    // Générer un token unique
    const token = `${documentId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const tokenId = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Expiration dans 24h
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const secureToken: SecureToken = {
      id: tokenId,
      documentId,
      token,
      createdAt: new Date(),
      expiresAt,
      used: false,
      createdBy
    };
    
    // Sauvegarder dans Firestore
    const tokenRef = doc(db, 'secureTokens', tokenId);
    await setDoc(tokenRef, secureToken);
    
    console.log('🔒 Token sécurisé généré:', token);
    
    return {
      success: true,
      token,
      message: 'Token généré avec succès'
    };
    
  } catch (error) {
    console.error('❌ Erreur génération token:', error);
    return {
      success: false,
      message: 'Erreur lors de la génération du token'
    };
  }
};

// Valider un token sécurisé
export const validateSecureToken = async (token: string): Promise<{ success: boolean; documentId?: string; message: string }> => {
  try {
    // Rechercher le token dans Firestore
    const tokensQuery = query(
      collection(db, 'secureTokens'),
      where('token', '==', token)
    );
    
    const querySnapshot = await getDocs(tokensQuery);
    
    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      };
    }
    
    const tokenDoc = querySnapshot.docs[0];
    const tokenData = tokenDoc.data() as SecureToken;
    
    // Vérifier si le token a expiré
    const now = new Date();
    const expiresAt = tokenData.expiresAt.toDate?.() || new Date(tokenData.expiresAt);
    
    if (now > expiresAt) {
      // Supprimer le token expiré
      await deleteDoc(doc(db, 'secureTokens', tokenDoc.id));
      return {
        success: false,
        message: 'Token expiré'
      };
    }
    
    // Vérifier si le token a déjà été utilisé
    if (tokenData.used) {
      return {
        success: false,
        message: 'Token déjà utilisé'
      };
    }
    
    // Marquer le token comme utilisé (optionnel - selon votre logique)
    // await updateDoc(doc(db, 'secureTokens', tokenDoc.id), { used: true });
    
    console.log('✅ Token validé pour document:', tokenData.documentId);
    
    return {
      success: true,
      documentId: tokenData.documentId,
      message: 'Token valide'
    };
    
  } catch (error) {
    console.error('❌ Erreur validation token:', error);
    return {
      success: false,
      message: 'Erreur lors de la validation'
    };
  }
};

// Nettoyer les tokens expirés (à appeler périodiquement)
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    const now = new Date();
    const tokensQuery = query(collection(db, 'secureTokens'));
    const querySnapshot = await getDocs(tokensQuery);
    
    const deletePromises: Promise<void>[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const tokenData = doc.data() as SecureToken;
      const expiresAt = tokenData.expiresAt.toDate?.() || new Date(tokenData.expiresAt);
      
      if (now > expiresAt) {
        deletePromises.push(deleteDoc(doc.ref));
      }
    });
    
    await Promise.all(deletePromises);
    console.log(`🧹 ${deletePromises.length} tokens expirés supprimés`);
    
  } catch (error) {
    console.error('❌ Erreur nettoyage tokens:', error);
  }
};

// Révoquer un token spécifique
export const revokeSecureToken = async (token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const tokensQuery = query(
      collection(db, 'secureTokens'),
      where('token', '==', token)
    );
    
    const querySnapshot = await getDocs(tokensQuery);
    
    if (!querySnapshot.empty) {
      const tokenDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'secureTokens', tokenDoc.id));
      
      return {
        success: true,
        message: 'Token révoqué avec succès'
      };
    }
    
    return {
      success: false,
      message: 'Token non trouvé'
    };
    
  } catch (error) {
    console.error('❌ Erreur révocation token:', error);
    return {
      success: false,
      message: 'Erreur lors de la révocation'
    };
  }
};