import emailjs from '@emailjs/browser';

// Configuration EmailJS (à remplacer par vos vraies valeurs)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface VerificationCode {
  email: string;
  code: string;
  documentId: string;
  expiresAt: Date;
  attempts: number;
}

// Stockage temporaire des codes (en production, utiliser Redis ou Firebase)
const verificationCodes = new Map<string, VerificationCode>();

// Générer un code à 6 chiffres
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nettoyer les codes expirés
const cleanExpiredCodes = () => {
  const now = new Date();
  verificationCodes.forEach((code, key) => {
    if (code.expiresAt < now) {
      verificationCodes.delete(key);
    }
  });
};

// Envoyer un code de vérification par email
export const sendVerificationCode = async (
  email: string,
  documentId: string,
  documentName: string
): Promise<{ success: boolean; message: string }> => {
  try {
    cleanExpiredCodes();
    
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Stocker le code
    const key = `${email}_${documentId}`;
    verificationCodes.set(key, {
      email,
      code,
      documentId,
      expiresAt,
      attempts: 0
    });

    // Paramètres pour le template email
    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0],
      document_name: documentName,
      verification_code: code,
      expires_in: '10 minutes',
      company_name: 'PROGINEER'
    };

    // Envoyer l'email (simulation en développement)
    if (import.meta.env.DEV) {
      console.log('📧 EMAIL SIMULATION (DEV MODE)');
      console.log('To:', email);
      console.log('Code:', code);
      console.log('Document:', documentName);
      console.log('Expires:', expiresAt.toLocaleString());
      
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Code envoyé à ${email} (vérifiez la console en mode dev)`
      };
    }

    // Envoi réel avec EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return {
      success: true,
      message: `Code de vérification envoyé à ${email}`
    };
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi du code. Veuillez réessayer.'
    };
  }
};

// Vérifier un code
export const verifyCode = (
  email: string,
  documentId: string,
  inputCode: string
): { success: boolean; message: string } => {
  cleanExpiredCodes();
  
  const key = `${email}_${documentId}`;
  const storedCode = verificationCodes.get(key);
  
  if (!storedCode) {
    return {
      success: false,
      message: 'Code expiré ou introuvable. Demandez un nouveau code.'
    };
  }
  
  // Vérifier le nombre de tentatives
  if (storedCode.attempts >= 3) {
    verificationCodes.delete(key);
    return {
      success: false,
      message: 'Trop de tentatives. Demandez un nouveau code.'
    };
  }
  
  // Incrémenter les tentatives
  storedCode.attempts++;
  
  // Vérifier le code
  if (storedCode.code !== inputCode) {
    return {
      success: false,
      message: `Code incorrect. ${3 - storedCode.attempts} tentatives restantes.`
    };
  }
  
  // Code valide, le supprimer
  verificationCodes.delete(key);
  
  return {
    success: true,
    message: 'Email vérifié avec succès'
  };
};

// Vérifier si un email est autorisé pour un document
export const isEmailAuthorized = async (
  email: string,
  documentId: string
): Promise<{ authorized: boolean; role?: 'client' | 'progineer' }> => {
  // Configuration des emails autorisés par document
  // En production, ceci serait stocké dans Firebase
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
};

// Template email par défaut pour EmailJS
export const emailTemplate = `
Bonjour {{to_name}},

Vous devez signer le document suivant : {{document_name}}

Votre code de vérification est : {{verification_code}}

Ce code expire dans {{expires_in}}.

Cordialement,
L'équipe {{company_name}}
`;

// Configuration des variables d'environnement à ajouter dans .env.local
export const requiredEnvVars = `
# Configuration EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
`;