import React, { useState, useEffect } from 'react';
import { Bell, X, FileText, Shield, Clock, Star, Workflow, PenTool } from 'lucide-react';
import { loadNotifications, initializeDefaultNotifications, type NotificationData } from '../services/notificationsService';
import { navigateToSection } from '../services/navigationService';

interface Notification extends NotificationData {
  icon: React.ElementType | null;
  customIcon?: string;
  isNew: boolean;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Fonction utilitaire pour obtenir l'icône selon le type
  const getIconForNotificationType = (type: string) => {
    switch (type) {
      case 'signature_ready': return PenTool;
      case 'processus_projet': return Star;
      case 'new_document': return FileText;
      case 'contact': return Shield;
      case 'waiting_approval': return Clock;
      default: return FileText;
    }
  };

  // Recharger les notifications depuis Firebase
  const reloadNotifications = async () => {
    try {
      console.log('🔔 NotificationBell: Rechargement des notifications');
      const notificationsData = await loadNotifications();
      console.log('🔔 NotificationBell: Notifications récupérées:', notificationsData.length);
      
      const viewedNotifications = JSON.parse(localStorage.getItem('progineer-landy-notifications-v2') || '[]');
      
      const notificationsWithIcons: Notification[] = notificationsData
        .filter(notif => notif.id) // S'assurer que l'ID existe
        .map(notif => ({
          ...notif,
          icon: notif.icon ? null : getIconForNotificationType(notif.type), // Utiliser l'icône Lucide seulement si pas d'icône personnalisée
          customIcon: notif.icon, // Garder l'icône personnalisée séparément
          isNew: !viewedNotifications.includes(notif.id!)
        }));

      console.log('🔔 Notifications vues dans localStorage:', viewedNotifications);
      console.log('🔔 Notifications nouvelles:', notificationsWithIcons.filter(n => n.isNew).map(n => n.id));
      
      console.log('🔔 NotificationBell: Notifications avec icônes:', notificationsWithIcons);
      
      setNotifications(notificationsWithIcons);
      setHasUnread(notificationsWithIcons.some(notif => notif.isNew));
    } catch (error) {
      console.error('Erreur lors du rechargement des notifications:', error);
    }
  };

  // Écouter les nouvelles notifications ajoutées dynamiquement
  useEffect(() => {
    const handleNewNotification = () => {
      console.log('🔔 NotificationBell: Événement notificationAdded reçu');
      // Recharger toutes les notifications depuis Firebase
      reloadNotifications();
    };

    const handleNotificationDeleted = () => {
      console.log('🔔 NotificationBell: Événement notificationDeleted reçu');
      // Recharger toutes les notifications depuis Firebase
      reloadNotifications();
    };

    console.log('🔔 NotificationBell: Installation des listeners d\'événements');
    window.addEventListener('notificationAdded', handleNewNotification);
    window.addEventListener('notificationDeleted', handleNotificationDeleted);
    
    return () => {
      window.removeEventListener('notificationAdded', handleNewNotification);
      window.removeEventListener('notificationDeleted', handleNotificationDeleted);
    };
  }, []);

  // Initialiser les notifications
  useEffect(() => {
    const initNotifications = async () => {
      // Initialiser les notifications par défaut si nécessaire
      await initializeDefaultNotifications();
      
      // Charger les notifications depuis Firebase
      await reloadNotifications();
    };
    
    initNotifications();
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    try {
      console.log('🔔 Clic sur notification:', notificationId);
      
      // Trouver la notification complète
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) {
        console.error('🔔 Notification non trouvée:', notificationId);
        return;
      }
      
      // Marquer la notification comme vue
      const viewedNotifications = JSON.parse(localStorage.getItem('progineer-landy-notifications-v2') || '[]');
      if (!viewedNotifications.includes(notificationId)) {
        viewedNotifications.push(notificationId);
        localStorage.setItem('progineer-landy-notifications-v2', JSON.stringify(viewedNotifications));
      }

      // Mettre à jour l'état
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isNew: false } : notif
        )
      );

      // Vérifier s'il reste des notifications non lues
      const hasUnreadLeft = notifications.some(notif => notif.id !== notificationId && notif.isNew);
      setHasUnread(hasUnreadLeft);

      // Fermer le dropdown
      setIsOpen(false);

      // Navigation vers la section correspondante
      setTimeout(() => {
        try {
          const success = navigateToSection(notification);
          if (!success) {
            console.warn('🧭 Navigation échouée pour la notification:', notification);
          }
        } catch (error) {
          console.error('🧭 Erreur lors de la navigation:', error);
        }
      }, 300);
      
    } catch (error) {
      console.error('🔔 Erreur lors du clic sur notification:', error);
      setIsOpen(false); // Fermer le dropdown en cas d'erreur
    }
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const unreadCount = notifications.filter(notif => notif.isNew).length;

  return (
    <div className="relative">
      {/* Cloche de notification */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-[10998]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Contenu des notifications */}
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[10999] max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  if (!notification.id) {
                    console.warn('🔔 Notification sans ID ignorée:', notification);
                    return null;
                  }
                  
                  const Icon = notification.icon || FileText;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`cursor-pointer transition-all duration-300 relative ${
                        notification.isHighlighted 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 p-4 mx-2 my-2 rounded-lg shadow-md hover:shadow-lg' 
                          : `p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.isNew ? 'bg-blue-50 border-l-4 border-l-[#c1a16a]' : ''}`
                      }`}
                    >
                      {notification.isHighlighted && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                            NOUVEAU !
                          </div>
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          notification.type === 'signature_ready' ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
                          notification.type === 'processus_projet' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' :
                          notification.type === 'new_document' ? 'bg-green-100' :
                          notification.type === 'contact' ? 'bg-blue-100' : 'bg-orange-100'
                        }`}>
                          {notification.customIcon ? (
                            <span className="text-lg">{notification.customIcon}</span>
                          ) : (
                            <Icon className={`w-4 h-4 ${
                              notification.type === 'signature_ready' ? 'text-purple-600' :
                              notification.type === 'processus_projet' ? 'text-orange-600' :
                              notification.type === 'new_document' ? 'text-green-600' :
                              notification.type === 'contact' ? 'text-blue-600' : 'text-orange-600'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium text-sm ${
                              notification.isHighlighted ? 'text-orange-900' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            {notification.isNew && (
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                notification.isHighlighted ? 'bg-orange-500' : 'bg-[#c1a16a]'
                              }`}></span>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            notification.isHighlighted ? 'text-orange-800' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Aucune notification</p>
                </div>
              )}
            </div>

            {notifications.some(notif => notif.isNew) && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    try {
                      const allNotificationIds = notifications
                        .filter(n => n.id)
                        .map(n => n.id!);
                      localStorage.setItem('progineer-landy-notifications-v2', JSON.stringify(allNotificationIds));
                      setNotifications(prev => prev.map(notif => ({ ...notif, isNew: false })));
                      setHasUnread(false);
                      console.log('🔔 Toutes les notifications marquées comme lues');
                    } catch (error) {
                      console.error('🔔 Erreur lors de la mise à jour:', error);
                    }
                  }}
                  className="w-full text-center text-sm text-[#c1a16a] hover:text-[#b8a994] font-medium"
                >
                  Marquer tout comme lu
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;