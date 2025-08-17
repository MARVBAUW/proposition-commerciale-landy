import { functions } from '../config/firebase';
import { getDefaultClientEmail } from './projectService';

// Fonction pour construire l'URL de redirection basée sur la section/tab cible
const buildActionUrl = (targetSection?: string, targetTab?: string, customUrl?: string): string => {
  const baseUrl = window.location.origin;
  
  if (customUrl) {
    return customUrl;
  }
  
  if (targetSection && targetTab) {
    return `${baseUrl}?section=${targetSection}&tab=${targetTab}`;
  }
  
  if (targetSection) {
    return `${baseUrl}?section=${targetSection}`;
  }
  
  if (targetTab) {
    return `${baseUrl}?tab=${targetTab}`;
  }
  
  return baseUrl;
};

export interface EmailNotificationData {
  to: string;
  subject: string;
  title: string;
  message: string;
  type: 'new_document' | 'document_modified' | 'custom_notification';
  documentName?: string;
  documentUrl?: string;
  actionUrl?: string;
  targetSection?: string;
  targetTab?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  emailId?: string;
}

// Service d'envoi d'emails pour les notifications
export const sendNotificationEmail = async (emailData: EmailNotificationData): Promise<EmailResult> => {
  try {
    // Appeler la fonction Firebase via HTTP request
    const functionUrl = 'https://us-central1-projet-landy.cloudfunctions.net/sendNotificationEmail';
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        templateData: {
          title: emailData.title,
          message: emailData.message,
          type: emailData.type,
          documentName: emailData.documentName,
          documentUrl: emailData.documentUrl,
          actionUrl: emailData.actionUrl || buildActionUrl(emailData.targetSection, emailData.targetTab),
          companyName: 'PROGINEER',
          year: new Date().getFullYear()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || 'Email envoyé avec succès',
      emailId: result.emailId
    };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    };
  }
};

// Fonction utilitaire pour créer le contenu d'email selon le type
export const createEmailContent = (
  type: 'new_document' | 'document_modified' | 'custom_notification',
  title: string,
  message: string,
  documentName?: string
): { subject: string; title: string; message: string } => {
  switch (type) {
    case 'new_document':
      return {
        subject: `📄 Nouveau document disponible - ${documentName || 'Document'}`,
        title: `Nouveau document disponible`,
        message: `Un nouveau document "${documentName}" a été ajouté à votre espace client PROGINEER. ${message}`
      };
    
    case 'document_modified':
      return {
        subject: `🔄 Document mis à jour - ${documentName || 'Document'}`,
        title: `Document mis à jour`,
        message: `Le document "${documentName}" a été modifié dans votre espace client PROGINEER. ${message}`
      };
    
    case 'custom_notification':
    default:
      return {
        subject: `🔔 ${title} - PROGINEER`,
        title,
        message
      };
  }
};

// Fonction pour obtenir l'email du client depuis la configuration projet
export const getClientEmail = async (): Promise<string | null> => {
  try {
    return await getDefaultClientEmail();
  } catch (error) {
    console.error('Erreur récupération email client:', error);
    return null;
  }
};

// Service de notification complète (Firebase + Email + PWA)
export const sendCompleteNotification = async (
  notificationData: {
    title: string;
    message: string;
    type: 'new_document' | 'document_modified' | 'custom_notification';
    documentName?: string;
    documentUrl?: string;
    targetSection?: string;
    targetTab?: string;
    customUrl?: string;
  },
  options: {
    sendEmail?: boolean;
    sendPWA?: boolean;
    clientEmail?: string;
  } = {}
): Promise<{
  firebaseSuccess: boolean;
  emailSuccess: boolean;
  pwaSuccess: boolean;
  errors: string[];
}> => {
  const results = {
    firebaseSuccess: true, // Firebase notification déjà géré
    emailSuccess: true,
    pwaSuccess: true,
    errors: [] as string[]
  };

  // Envoi d'email si demandé
  if (options.sendEmail) {
    const clientEmail = options.clientEmail || await getClientEmail();
    
    if (clientEmail) {
      const emailContent = createEmailContent(
        notificationData.type,
        notificationData.title,
        notificationData.message,
        notificationData.documentName
      );
      
      const emailResult = await sendNotificationEmail({
        to: clientEmail,
        subject: emailContent.subject,
        title: emailContent.title,
        message: emailContent.message,
        type: notificationData.type,
        documentName: notificationData.documentName,
        documentUrl: notificationData.documentUrl,
        targetSection: notificationData.targetSection,
        targetTab: notificationData.targetTab,
        actionUrl: notificationData.customUrl
      });
      
      if (!emailResult.success) {
        results.emailSuccess = false;
        results.errors.push(`Email: ${emailResult.message}`);
      }
    } else {
      results.emailSuccess = false;
      results.errors.push('Email: Adresse email du client non trouvée');
    }
  }

  // Envoi notification PWA si demandé
  if (options.sendPWA) {
    try {
      // Import dynamique pour éviter les erreurs si pas de service worker
      const { sendPWANotification } = await import('./pwaNotificationService');
      const pwaResult = await sendPWANotification({
        title: notificationData.title,
        body: notificationData.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: `notification-${Date.now()}`,
        data: {
          type: notificationData.type,
          documentName: notificationData.documentName,
          documentUrl: notificationData.documentUrl,
          url: window.location.origin
        }
      });
      
      if (!pwaResult.success) {
        results.pwaSuccess = false;
        results.errors.push(`PWA: ${pwaResult.message}`);
      }
    } catch (error) {
      results.pwaSuccess = false;
      results.errors.push('PWA: Service non disponible');
    }
  }

  return results;
};