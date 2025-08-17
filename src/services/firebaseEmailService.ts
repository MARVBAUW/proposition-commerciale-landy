import { httpsCallable } from 'firebase/functions';
import { collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, functions } from '../config/firebase';

export interface VerificationCode {
  email: string;
  code: string;
  documentId: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  isHtml?: boolean;
}

// Générer un code à 6 chiffres
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Templates d'emails
const emailTemplates = {
  verificationCode: (code: string, documentName: string, expiresIn: string): EmailTemplate => ({
    subject: `Code de vérification - ${documentName}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #c1a16a 0%, #787346 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">PROGINEER</h1>
          <p style="color: white; margin: 5px 0;">Signature électronique</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Code de vérification</h2>
          <p>Bonjour,</p>
          <p>Vous devez signer le document : <strong>${documentName}</strong></p>
          
          <div style="background: white; border: 2px solid #c1a16a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Votre code de vérification :</p>
            <h1 style="margin: 10px 0; color: #c1a16a; font-size: 32px; letter-spacing: 4px; font-family: monospace;">${code}</h1>
            <p style="margin: 0; color: #666; font-size: 14px;">Valide pendant ${expiresIn}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Sécurité :</strong> Ce code est personnel et confidentiel. Ne le partagez avec personne.
          </p>
        </div>
        
        <div style="padding: 20px; background: #333; color: white; text-align: center; font-size: 12px;">
          <p>PROGINEER - Architecture & Maîtrise d'Œuvre</p>
          <p>Email automatique - Ne pas répondre</p>
        </div>
      </div>
    `,
    isHtml: true
  }),

  clientSigned: (documentName: string, clientEmail: string): EmailTemplate => ({
    subject: `✅ Document signé par le client - ${documentName}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">✅ Signature reçue</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Le client a signé</h2>
          <p><strong>Document :</strong> ${documentName}</p>
          <p><strong>Signé par :</strong> ${clientEmail}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          
          <div style="background: #10b981; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Action requise :</strong> Vous devez maintenant signer le document à votre tour.</p>
          </div>
          
          <p>Connectez-vous à votre panel administrateur pour procéder à la signature.</p>
        </div>
      </div>
    `,
    isHtml: true
  }),

  documentFinalized: (documentName: string, downloadUrl: string): EmailTemplate => ({
    subject: `📄 Document finalisé - ${documentName}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">📄 Document finalisé</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Toutes les signatures sont complètes</h2>
          <p><strong>Document :</strong> ${documentName}</p>
          <p><strong>Statut :</strong> ✅ Entièrement signé</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              📥 Télécharger le document signé
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Le document signé est maintenant disponible et a une valeur juridique complète.
          </p>
        </div>
        
        <div style="padding: 20px; background: #333; color: white; text-align: center; font-size: 12px;">
          <p>PROGINEER - Architecture & Maîtrise d'Œuvre</p>
          <p>Merci pour votre confiance</p>
        </div>
      </div>
    `,
    isHtml: true
  })
};

// Envoyer un code de vérification
export const sendVerificationCode = async (
  email: string,
  documentId: string,
  documentName: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Stocker le code dans Firestore
    const codeData: VerificationCode = {
      email,
      code,
      documentId,
      expiresAt,
      attempts: 0,
      createdAt: new Date()
    };
    
    const codeRef = doc(collection(db, 'verificationCodes'), `${email}_${documentId}`);
    await setDoc(codeRef, codeData);

    // Appeler Firebase Function pour envoyer l'email
    const sendEmail = httpsCallable(functions, 'sendVerificationCode');
    const result = await sendEmail({
      email,
      documentName,
      template: emailTemplates.verificationCode(code, documentName, '10 minutes')
    });
    
    console.log('📧 Email envoyé via Firebase Functions:', result.data);

    return {
      success: true,
      message: `Code de vérification envoyé à ${email}`
    };
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi du code. Veuillez réessayer.'
    };
  }
};

// Vérifier un code
export const verifyCode = async (
  email: string,
  documentId: string,
  inputCode: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const codeRef = doc(db, 'verificationCodes', `${email}_${documentId}`);
    const codeDoc = await getDoc(codeRef);
    
    if (!codeDoc.exists()) {
      return {
        success: false,
        message: 'Code expiré ou introuvable. Demandez un nouveau code.'
      };
    }
    
    const codeData = codeDoc.data() as VerificationCode;
    
    // Vérifier l'expiration  
    const expiresAt = codeData.expiresAt instanceof Date ? codeData.expiresAt : codeData.expiresAt.toDate();
    if (new Date() > expiresAt) {
      await deleteDoc(codeRef);
      return {
        success: false,
        message: 'Code expiré. Demandez un nouveau code.'
      };
    }
    
    // Vérifier le nombre de tentatives
    if (codeData.attempts >= 3) {
      await deleteDoc(codeRef);
      return {
        success: false,
        message: 'Trop de tentatives. Demandez un nouveau code.'
      };
    }
    
    // Incrémenter les tentatives
    codeData.attempts++;
    await setDoc(codeRef, codeData);
    
    // Vérifier le code
    if (codeData.code !== inputCode) {
      return {
        success: false,
        message: `Code incorrect. ${3 - codeData.attempts} tentatives restantes.`
      };
    }
    
    // Code valide, le supprimer
    await deleteDoc(codeRef);
    
    return {
      success: true,
      message: 'Email vérifié avec succès'
    };
    
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return {
      success: false,
      message: 'Erreur lors de la vérification.'
    };
  }
};

// Notifier qu'un client a signé (pour PROGINEER)
export const notifyClientSigned = async (
  documentName: string,
  clientEmail: string
): Promise<void> => {
  try {
    const progineersEmail = 'admin@progineer.com'; // À configurer dans Firestore
    
    // Appeler Firebase Function pour envoyer la notification
    const sendNotification = httpsCallable(functions, 'sendNotification');
    await sendNotification({
      email: progineersEmail,
      template: emailTemplates.clientSigned(documentName, clientEmail)
    });
    
    console.log('📧 Notification envoyée à PROGINEER:', progineersEmail);
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error);
  }
};

// Envoyer le document finalisé (aux deux parties)
export const sendFinalDocument = async (
  documentName: string,
  downloadUrl: string,
  clientEmail: string,
  progineersEmail: string
): Promise<void> => {
  try {
    const emails = [clientEmail, progineersEmail];
    
    if (import.meta.env.DEV) {
      console.log('📧 ENVOI DOCUMENT FINAL (DEV MODE)');
      console.log('To:', emails);
      console.log('Document:', documentName);
      console.log('URL:', downloadUrl);
      return;
    }

    // En production, appeler Firebase Function pour chaque email
    // const sendDocument = httpsCallable(functions, 'sendFinalDocument');
    // for (const email of emails) {
    //   await sendDocument({
    //     email,
    //     documentName,
    //     downloadUrl,
    //     template: emailTemplates.documentFinalized(documentName, downloadUrl)
    //   });
    // }
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du document final:', error);
  }
};

// Vérifier si un email est autorisé pour un document
export const isEmailAuthorized = async (
  email: string,
  documentId: string
): Promise<{ authorized: boolean; role?: 'client' | 'progineer' }> => {
  try {
    // En production, récupérer depuis Firestore
    const docRef = doc(db, 'documentAccess', documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const accessData = docSnap.data();
      const emailLower = email.toLowerCase();
      
      if (accessData.clientEmail === emailLower) {
        return { authorized: true, role: 'client' };
      } else if (accessData.progineersEmail === emailLower) {
        return { authorized: true, role: 'progineer' };
      }
    }
    
    // Fallback temporaire (mode dev)
    const authorizedEmails: Record<string, Record<string, 'client' | 'progineer'>> = {
      'devis-mission-complete': {
        'landy.client@email.com': 'client',
        'admin@progineer.com': 'progineer'
      },
      'devis-mission-partielle': {
        'landy.client@email.com': 'client',
        'admin@progineer.com': 'progineer'
      },
      'contrat-moe': {
        'landy.client@email.com': 'client',
        'admin@progineer.com': 'progineer'
      }
    };
    
    const documentEmails = authorizedEmails[documentId];
    if (!documentEmails) {
      return { authorized: false };
    }
    
    const role = documentEmails[email.toLowerCase()];
    if (!role) {
      return { authorized: false };
    }
    
    return { authorized: true, role };
    
  } catch (error) {
    console.error('Erreur lors de la vérification d\'autorisation:', error);
    return { authorized: false };
  }
};

// Configuration pour la production
export const productionSetup = `
🔧 CONFIGURATION FIREBASE FUNCTIONS POUR PRODUCTION :

1. Installer Firebase CLI :
   npm install -g firebase-tools

2. Initialiser Functions :
   firebase init functions

3. Installer dépendances Functions :
   npm install nodemailer @types/nodemailer

4. Créer functions/src/index.ts avec :
   - sendVerificationCode()
   - sendNotification() 
   - sendFinalDocument()

5. Configurer SMTP dans Functions :
   firebase functions:config:set gmail.email="votre@email.com" gmail.password="motdepasse"

6. Déployer :
   firebase deploy --only functions
`;

export { emailTemplates };