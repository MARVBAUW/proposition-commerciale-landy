import { doc, setDoc, getDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { PDFDocument, rgb } from 'pdf-lib';

export interface SignatureData {
  documentId: string;
  name: string;
  date: string;
  signatureImage: string;
  signedAt: Date;
  signedDocumentUrl?: string;
  // Support pour positionnement personnalisé
  position?: {
    x: number; // Pourcentage 0-100
    y: number; // Pourcentage 0-100
    page: number; // Numéro de page
    width?: number; // Largeur en points PDF
    height?: number; // Hauteur en points PDF
  };
}

export interface DocumentSignatureStatus {
  [documentId: string]: {
    isSigned: boolean;
    signatureData?: SignatureData;
    signedDocumentUrl?: string;
  };
}

// Convertir base64 en Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// DEPRECATED: Utiliser addMultipleSignaturesToPdf à la place
// Ajouter la signature au PDF avec support multi-positions (ancienne version)
export const addSignatureToPdf = async (
  originalPdfUrl: string,
  signatureData: SignatureData
): Promise<Uint8Array> => {
  try {
    // Charger le PDF original
    const pdfResponse = await fetch(originalPdfUrl);
    const pdfBytes = await pdfResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Charger l'image de signature
    const signatureImageBytes = base64ToBlob(signatureData.signatureImage, 'image/png');
    const signatureImageArrayBuffer = await signatureImageBytes.arrayBuffer();
    const signatureImage = await pdfDoc.embedPng(signatureImageArrayBuffer);

    // Déterminer la page de signature
    const pages = pdfDoc.getPages();
    const targetPageIndex = (signatureData.position?.page || pages.length) - 1;
    const targetPage = pages[Math.max(0, Math.min(targetPageIndex, pages.length - 1))];
    const { width, height } = targetPage.getSize();

    // Utiliser la position personnalisée ou position par défaut
    const defaultPosition = { x: 75, y: 15, width: 25, height: 10 }; // Défaut: bas droite en pourcentages
    const position = signatureData.position || defaultPosition;
    
    // Convertir les pourcentages en coordonnées PDF
    const signatureBlockWidth = (position.width || 25) / 100 * width; // Convertir % en points PDF
    const signatureBlockHeight = (position.height || 10) / 100 * height; // Convertir % en points PDF
    const signatureBlockX = (position.x / 100) * width;
    const signatureBlockY = ((100 - position.y) / 100) * height - signatureBlockHeight; // Y inversé en PDF

    // Fond de la zone de signature (transparent avec bordure fine)
    targetPage.drawRectangle({
      x: signatureBlockX,
      y: signatureBlockY,
      width: signatureBlockWidth,
      height: signatureBlockHeight,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.3,
      // Pas de couleur de fond = transparent
    });

    // Titre "SIGNATURE ÉLECTRONIQUE" (plus petit)
    targetPage.drawText('SIGNATURE ÉLECTRONIQUE', {
      x: signatureBlockX + 8,
      y: signatureBlockY + signatureBlockHeight - 15,
      size: 9,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Nom du signataire
    targetPage.drawText(`Signataire : ${signatureData.name}`, {
      x: signatureBlockX + 8,
      y: signatureBlockY + signatureBlockHeight - 30,
      size: 8,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Date de signature
    const dateStr = new Date(signatureData.date).toLocaleDateString('fr-FR');
    targetPage.drawText(`Date : ${dateStr}`, {
      x: signatureBlockX + 8,
      y: signatureBlockY + signatureBlockHeight - 45,
      size: 8,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Image de signature (proportionnelle au cadre)
    const maxSignatureWidth = signatureBlockWidth * 0.4; // 40% de la largeur du cadre
    const maxSignatureHeight = signatureBlockHeight * 0.4; // 40% de la hauteur du cadre
    
    // Calculer le facteur d'échelle pour respecter les dimensions max
    const originalDims = signatureImage.scale(1);
    const scaleX = maxSignatureWidth / originalDims.width;
    const scaleY = maxSignatureHeight / originalDims.height;
    const scale = Math.min(scaleX, scaleY); // Proportionnel au cadre
    
    const signatureDims = signatureImage.scale(scale);
    
    targetPage.drawImage(signatureImage, {
      x: signatureBlockX + signatureBlockWidth - signatureDims.width - 8,
      y: signatureBlockY + 8,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    // Label "Signature" (positionné au-dessus)
    targetPage.drawText('Signature :', {
      x: signatureBlockX + signatureBlockWidth - signatureDims.width - 8,
      y: signatureBlockY + signatureDims.height + 15,
      size: Math.max(7, signatureBlockHeight * 0.1), // Taille proportionnelle
      color: rgb(0.5, 0.5, 0.5),
    });

    return await pdfDoc.save();
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la signature au PDF:', error);
    throw error;
  }
};

// Sauvegarder la signature dans Firebase
export const saveSignature = async (
  documentId: string,
  signatureData: Omit<SignatureData, 'documentId' | 'signedAt' | 'signedDocumentUrl'>
): Promise<void> => {
  try {
    const signatureDoc = {
      ...signatureData,
      documentId,
      signedAt: new Date(),
    };

    // Sauvegarder dans Firestore
    await setDoc(doc(db, 'signatures', documentId), signatureDoc);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la signature:', error);
    throw error;
  }
};

// Uploader le PDF signé vers Firebase Storage
export const uploadSignedPdf = async (
  documentId: string,
  pdfBytes: Uint8Array
): Promise<string> => {
  try {
    const fileName = `signed_${documentId}_${Date.now()}.pdf`;
    const storageRef = ref(storage, `signed-documents/${fileName}`);
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    // Mettre à jour le document de signature avec l'URL
    await setDoc(doc(db, 'signatures', documentId), {
      signedDocumentUrl: downloadURL
    }, { merge: true });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du PDF signé:', error);
    throw error;
  }
};

// Récupérer le statut de signature d'un document
export const getSignatureStatus = async (documentId: string): Promise<{
  isSigned: boolean;
  signatureData?: SignatureData;
  signedDocumentUrl?: string;
}> => {
  try {
    const signatureDoc = await getDoc(doc(db, 'signatures', documentId));
    
    if (signatureDoc.exists()) {
      const data = signatureDoc.data() as SignatureData;
      return {
        isSigned: true,
        signatureData: data,
        signedDocumentUrl: data.signedDocumentUrl
      };
    }
    
    return { isSigned: false };
  } catch (error) {
    console.error('Erreur lors de la récupération du statut de signature:', error);
    return { isSigned: false };
  }
};

// Écouter les changements de statut des signatures en temps réel
export const subscribeToSignatureUpdates = (
  callback: (signatures: DocumentSignatureStatus) => void
): (() => void) => {
  const unsubscribe = onSnapshot(collection(db, 'signatures'), (snapshot) => {
    const signatures: DocumentSignatureStatus = {};
    
    snapshot.forEach((doc) => {
      const data = doc.data() as SignatureData;
      signatures[doc.id] = {
        isSigned: true,
        signatureData: data,
        signedDocumentUrl: data.signedDocumentUrl
      };
    });
    
    callback(signatures);
  });
  
  return unsubscribe;
};

// Nouvelle fonction pour appliquer plusieurs signatures selon la configuration
export const addMultipleSignaturesToPdf = async (
  originalPdfUrl: string,
  documentId: string,
  signatureData: Omit<SignatureData, 'documentId' | 'signedAt' | 'signedDocumentUrl'>
): Promise<Uint8Array> => {
  try {
    console.log(`🔄 Application des signatures pour le document: ${documentId}`);
    
    // 1. Récupérer la configuration de signatures
    const configDoc = await getDoc(doc(db, 'signatureConfigs', documentId));
    let signatureConfig = null;
    
    if (configDoc.exists()) {
      signatureConfig = configDoc.data();
      console.log(`📋 Configuration trouvée: ${signatureConfig.signatures?.length || 0} signatures configurées`);
    } else {
      console.log(`⚠️ Aucune configuration trouvée pour ${documentId}, utilisation position par défaut`);
    }
    
    // 2. Charger le PDF original
    const pdfResponse = await fetch(originalPdfUrl);
    const pdfBytes = await pdfResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // 3. Charger l'image de signature
    const signatureImageBytes = base64ToBlob(signatureData.signatureImage, 'image/png');
    const signatureImageArrayBuffer = await signatureImageBytes.arrayBuffer();
    const signatureImage = await pdfDoc.embedPng(signatureImageArrayBuffer);
    
    // 4. Appliquer toutes les signatures configurées ou position par défaut
    if (signatureConfig && signatureConfig.signatures && signatureConfig.signatures.length > 0) {
      // Utiliser la configuration multi-signatures
      for (const sigConfig of signatureConfig.signatures) {
        await applySingleSignature(pdfDoc, signatureImage, signatureData, sigConfig.position);
        console.log(`✅ Signature appliquée: ${sigConfig.label} sur page ${sigConfig.position.page}`);
      }
    } else {
      // Fallback: position par défaut ou backward compatibility
      const defaultPosition = signatureConfig?.clientPosition || { x: 75, y: 15, width: 25, height: 10, page: 1 };
      await applySingleSignature(pdfDoc, signatureImage, signatureData, defaultPosition);
      console.log(`✅ Signature appliquée en position par défaut`);
    }
    
    return await pdfDoc.save();
  } catch (error) {
    console.error('❌ Erreur lors de l\'application des signatures multiples:', error);
    throw error;
  }
};

// Fonction helper pour appliquer une signature à une position donnée
const applySingleSignature = async (
  pdfDoc: any,
  signatureImage: any,
  signatureData: any,
  position: { x: number, y: number, width: number, height: number, page: number }
) => {
  const pages = pdfDoc.getPages();
  const targetPageIndex = Math.max(0, Math.min((position.page || 1) - 1, pages.length - 1));
  const targetPage = pages[targetPageIndex];
  const { width, height } = targetPage.getSize();
  
  console.log(`📐 Page ${position.page}: Dimensions PDF = ${width}x${height}px`);
  console.log(`📍 Position configurée: x=${position.x}%, y=${position.y}%, w=${position.width}%, h=${position.height}%`);
  
  // Convertir les pourcentages en coordonnées PDF
  const signatureBlockWidth = (position.width || 25) / 100 * width;
  const signatureBlockHeight = (position.height || 10) / 100 * height;
  const signatureBlockX = (position.x / 100) * width;
  const signatureBlockY = ((100 - position.y) / 100) * height - signatureBlockHeight;
  
  console.log(`📏 Coordonnées PDF calculées: x=${signatureBlockX}, y=${signatureBlockY}, w=${signatureBlockWidth}, h=${signatureBlockHeight}`);
  
  // Fond de la zone de signature (transparent avec bordure fine)
  targetPage.drawRectangle({
    x: signatureBlockX,
    y: signatureBlockY,
    width: signatureBlockWidth,
    height: signatureBlockHeight,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.3,
    // Pas de couleur de fond = transparent
  });
  
  // Titre "SIGNATURE ÉLECTRONIQUE"
  targetPage.drawText('SIGNATURE ÉLECTRONIQUE', {
    x: signatureBlockX + 8,
    y: signatureBlockY + signatureBlockHeight - 15,
    size: Math.max(7, signatureBlockHeight * 0.15),
    color: rgb(0.3, 0.3, 0.3),
  });
  
  // Nom du signataire
  targetPage.drawText(`Signataire : ${signatureData.name}`, {
    x: signatureBlockX + 8,
    y: signatureBlockY + signatureBlockHeight - 30,
    size: Math.max(6, signatureBlockHeight * 0.12),
    color: rgb(0.4, 0.4, 0.4),
  });
  
  // Date de signature
  const dateStr = new Date(signatureData.date).toLocaleDateString('fr-FR');
  targetPage.drawText(`Date : ${dateStr}`, {
    x: signatureBlockX + 8,
    y: signatureBlockY + signatureBlockHeight - 45,
    size: Math.max(6, signatureBlockHeight * 0.12),
    color: rgb(0.4, 0.4, 0.4),
  });
  
  // Image de signature (proportionnelle au cadre)
  const maxSignatureWidth = signatureBlockWidth * 0.4;
  const maxSignatureHeight = signatureBlockHeight * 0.4;
  
  const originalDims = signatureImage.scale(1);
  const scaleX = maxSignatureWidth / originalDims.width;
  const scaleY = maxSignatureHeight / originalDims.height;
  const scale = Math.min(scaleX, scaleY);
  
  const signatureDims = signatureImage.scale(scale);
  
  targetPage.drawImage(signatureImage, {
    x: signatureBlockX + signatureBlockWidth - signatureDims.width - 8,
    y: signatureBlockY + 8,
    width: signatureDims.width,
    height: signatureDims.height,
  });
  
  // Label "Signature"
  targetPage.drawText('Signature :', {
    x: signatureBlockX + signatureBlockWidth - signatureDims.width - 8,
    y: signatureBlockY + signatureDims.height + 15,
    size: Math.max(6, signatureBlockHeight * 0.1),
    color: rgb(0.5, 0.5, 0.5),
  });
};

// Traitement complet de signature (version mise à jour)
export const processDocumentSignature = async (
  documentId: string,
  originalPdfUrl: string,
  signatureData: Omit<SignatureData, 'documentId' | 'signedAt' | 'signedDocumentUrl'>
): Promise<string> => {
  try {
    console.log(`🚀 Début du processus de signature pour: ${documentId}`);
    
    // 1. Appliquer les signatures selon la configuration
    const signedPdfBytes = await addMultipleSignaturesToPdf(originalPdfUrl, documentId, signatureData);
    
    // 2. Uploader le PDF signé
    const signedPdfUrl = await uploadSignedPdf(documentId, signedPdfBytes);
    
    // 3. Sauvegarder les métadonnées de signature
    await saveSignature(documentId, {
      ...signatureData,
      signedDocumentUrl: signedPdfUrl
    });
    
    console.log(`✅ Processus de signature terminé: ${signedPdfUrl}`);
    return signedPdfUrl;
  } catch (error) {
    console.error('❌ Erreur lors du processus de signature:', error);
    throw error;
  }
};

// Supprimer une signature et le document signé
export const deleteSignature = async (documentId: string): Promise<void> => {
  try {
    console.log(`🗑️ Suppression de la signature pour le document: ${documentId}`);
    
    // Récupérer d'abord les données de signature pour obtenir l'URL du document signé
    const signatureDoc = await getDoc(doc(db, 'signatures', documentId));
    
    if (signatureDoc.exists()) {
      const signatureData = signatureDoc.data() as SignatureData;
      
      // Supprimer le fichier PDF signé du storage si il existe
      if (signatureData.signedDocumentUrl) {
        try {
          // Extraire le chemin du fichier depuis l'URL
          const url = new URL(signatureData.signedDocumentUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
          if (pathMatch) {
            const filePath = decodeURIComponent(pathMatch[1]);
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
            console.log('✅ Fichier PDF signé supprimé du storage');
          }
        } catch (storageError) {
          console.warn('⚠️ Erreur lors de la suppression du fichier:', storageError);
          // Continue même si la suppression du fichier échoue
        }
      }
      
      // Supprimer le document de signature de Firestore
      await deleteDoc(doc(db, 'signatures', documentId));
      console.log('✅ Document de signature supprimé de Firestore');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la signature:', error);
    throw error;
  }
};

// Réinitialiser complètement un document (supprimer signature + configuration)
export const resetDocument = async (documentId: string): Promise<void> => {
  try {
    console.log(`🔄 Réinitialisation complète du document: ${documentId}`);
    
    // Supprimer la signature
    await deleteSignature(documentId);
    
    // Supprimer la configuration de signatures si elle existe
    try {
      await deleteDoc(doc(db, 'signatureConfigs', documentId));
      console.log('✅ Configuration de signatures supprimée');
    } catch (configError) {
      console.warn('⚠️ Aucune configuration de signatures à supprimer');
    }
    
    console.log('✅ Document réinitialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation du document:', error);
    throw error;
  }
};