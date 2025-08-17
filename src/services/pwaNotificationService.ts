import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp, getApps } from 'firebase/app';

export interface PWANotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export interface PWAResult {
  success: boolean;
  message: string;
  token?: string;
}

// Configuration pour Firebase Cloud Messaging
const VAPID_KEY = 'BN4jWNRzL9bVRNFz-pT3-qTxF8yKZQTZq4vK4A8xC9wLZQhXHjVKxN7u8A3d4mVoWG8jPcHhT7rYGnS2w_qA6wE'; // À remplacer par votre vraie clé VAPID

// Vérifier si les notifications sont supportées
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

// Demander l'autorisation pour les notifications
export const requestNotificationPermission = async (): Promise<PWAResult> => {
  try {
    if (!isNotificationSupported()) {
      return {
        success: false,
        message: 'Les notifications ne sont pas supportées par ce navigateur'
      };
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      return {
        success: true,
        message: 'Autorisation accordée pour les notifications'
      };
    } else if (permission === 'denied') {
      return {
        success: false,
        message: 'Autorisation refusée pour les notifications'
      };
    } else {
      return {
        success: false,
        message: 'Autorisation en attente pour les notifications'
      };
    }
  } catch (error) {
    console.error('Erreur demande autorisation notifications:', error);
    return {
      success: false,
      message: 'Erreur lors de la demande d\'autorisation'
    };
  }
};

// Obtenir le token FCM pour les notifications push
export const getFCMToken = async (): Promise<PWAResult> => {
  try {
    if (!isNotificationSupported()) {
      return {
        success: false,
        message: 'Firebase Cloud Messaging non supporté'
      };
    }

    // Initialiser Firebase si pas déjà fait
    const apps = getApps();
    if (apps.length === 0) {
      // Import de la config Firebase
      const { default: app } = await import('../config/firebase');
    }

    const messaging = getMessaging();
    
    // Demander l'autorisation d'abord
    const permissionResult = await requestNotificationPermission();
    if (!permissionResult.success) {
      return permissionResult;
    }

    // Obtenir le token
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });

    if (currentToken) {
      // Sauvegarder le token localement pour l'envoyer au serveur
      localStorage.setItem('fcm-token', currentToken);
      
      return {
        success: true,
        message: 'Token FCM obtenu avec succès',
        token: currentToken
      };
    } else {
      return {
        success: false,
        message: 'Impossible d\'obtenir le token FCM'
      };
    }
  } catch (error) {
    console.error('Erreur obtention token FCM:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'obtention du token FCM'
    };
  }
};

// Envoyer une notification PWA locale
export const sendLocalPWANotification = async (notificationData: PWANotificationData): Promise<PWAResult> => {
  try {
    if (!isNotificationSupported()) {
      return {
        success: false,
        message: 'Notifications non supportées'
      };
    }

    if (Notification.permission !== 'granted') {
      const permissionResult = await requestNotificationPermission();
      if (!permissionResult.success) {
        return permissionResult;
      }
    }

    // Créer la notification locale
    const notification = new Notification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/icon-192x192.png',
      badge: notificationData.badge || '/icon-192x192.png',
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: true, // Reste visible jusqu'à interaction
      actions: [
        {
          action: 'view',
          title: 'Voir'
        },
        {
          action: 'dismiss',
          title: 'Ignorer'
        }
      ]
    });

    // Gérer les clics sur la notification
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      
      // Naviguer vers l'URL si fournie
      if (notificationData.data?.url) {
        window.location.href = notificationData.data.url;
      }
      
      notification.close();
    };

    return {
      success: true,
      message: 'Notification PWA envoyée avec succès'
    };
  } catch (error) {
    console.error('Erreur envoi notification PWA:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de la notification PWA'
    };
  }
};

// Envoyer une notification push via FCM
export const sendPWANotification = async (notificationData: PWANotificationData): Promise<PWAResult> => {
  try {
    // D'abord essayer d'envoyer une notification locale
    const localResult = await sendLocalPWANotification(notificationData);
    
    // Ensuite, si on a un token FCM, envoyer aussi via le serveur
    const fcmToken = localStorage.getItem('fcm-token');
    if (fcmToken) {
      // Envoyer le token et les données au serveur Firebase Functions
      // pour qu'il envoie la notification push à tous les appareils
      try {
        // Import dynamique de la fonction Firebase
        const { httpsCallable } = await import('firebase/functions');
        const { functions } = await import('../config/firebase');
        
        const sendPushNotification = httpsCallable(functions, 'sendPushNotification');
        
        await sendPushNotification({
          token: fcmToken,
          notification: {
            title: notificationData.title,
            body: notificationData.body,
            icon: notificationData.icon || '/icon-192x192.png'
          },
          data: notificationData.data || {}
        });
      } catch (error) {
        console.log('Notification push serveur non disponible, utilisation locale uniquement');
      }
    }

    return localResult;
  } catch (error) {
    console.error('Erreur notification PWA:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de la notification'
    };
  }
};

// Initialiser les notifications PWA au chargement de l'app
export const initializePWANotifications = async (): Promise<void> => {
  try {
    if (!isNotificationSupported()) {
      console.log('Notifications PWA non supportées');
      return;
    }

    // Obtenir le token FCM si autorisé
    if (Notification.permission === 'granted') {
      const tokenResult = await getFCMToken();
      if (tokenResult.success) {
        console.log('Token FCM initialisé:', tokenResult.token);
      }
    }

    // Écouter les messages Firebase
    if (getApps().length > 0) {
      const messaging = getMessaging();
      
      onMessage(messaging, (payload) => {
        console.log('Message reçu en foreground:', payload);
        
        // Afficher une notification locale pour les messages reçus
        if (payload.notification) {
          sendLocalPWANotification({
            title: payload.notification.title || 'Nouvelle notification',
            body: payload.notification.body || '',
            icon: payload.notification.icon,
            data: payload.data
          });
        }
      });
    }
  } catch (error) {
    console.error('Erreur initialisation PWA notifications:', error);
  }
};

// Vérifier le statut des notifications
export const getNotificationStatus = (): {
  supported: boolean;
  permission: NotificationPermission;
  hasToken: boolean;
} => {
  return {
    supported: isNotificationSupported(),
    permission: Notification.permission || 'default',
    hasToken: !!localStorage.getItem('fcm-token')
  };
};