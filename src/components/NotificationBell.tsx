import React, { useState, useEffect } from 'react';
import { Bell, X, FileText, Shield, Clock, Star, Workflow } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'processus_projet' | 'new_document' | 'contact' | 'waiting_approval';
  icon: React.ElementType;
  isNew: boolean;
  isHighlighted?: boolean;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Initialiser les notifications
  useEffect(() => {
    const defaultNotifications: Notification[] = [
      {
        id: 'processus-projet',
        title: '🌟 Guide PROCESSUS PROJET disponible !',
        message: 'Découvrez le guide complet du processus de construction PROGINEER. Ce document détaille toutes les étapes de votre projet, de la conception à la réception. Consultez-le dès maintenant dans Processus Projet !',
        type: 'processus_projet',
        icon: Star,
        isNew: true,
        isHighlighted: true
      },
      {
        id: 'new-documents',
        title: 'Nouveaux documents disponibles',
        message: 'Plan de cadastre et Notice PLU Zone UD sont maintenant consultables dans la section Plans.',
        type: 'new_document',
        icon: FileText,
        isNew: true
      },
      {
        id: 'contact-do',
        title: 'Contact Assurance Dommage-Ouvrage ajouté',
        message: 'Les coordonnées de Nicolas CHERON ont été ajoutées dans la section Exclusions pour votre assurance DO.',
        type: 'contact',
        icon: Shield,
        isNew: true
      },
      {
        id: 'waiting-approval',
        title: 'En attente de votre acceptation',
        message: 'Le devis de maîtrise d\'œuvre et la facture d\'accompte seront disponibles après validation de cette proposition commerciale.',
        type: 'waiting_approval',
        icon: Clock,
        isNew: true
      }
    ];

    // Récupérer les notifications vues depuis localStorage (nouvelle clé pour reset)
    const viewedNotifications = JSON.parse(localStorage.getItem('progineer-landy-notifications-v2') || '[]');
    
    // Marquer les notifications vues
    const updatedNotifications = defaultNotifications.map(notif => ({
      ...notif,
      isNew: !viewedNotifications.includes(notif.id)
    }));

    setNotifications(updatedNotifications);
    setHasUnread(updatedNotifications.some(notif => notif.isNew));
  }, []);

  const handleNotificationClick = (notificationId: string) => {
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
      let targetSection = '';
      
      switch (notificationId) {
        case 'processus-projet':
          targetSection = '[data-section="documents"]';
          break;
        case 'new-documents':
          targetSection = '[data-section="documents"]';
          break;
        case 'contact-do':
          targetSection = '[data-section="exclusions"]';
          break;
        case 'waiting-approval':
          targetSection = '[data-section="documents"]';
          break;
        default:
          return;
      }

      const element = document.querySelector(targetSection);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });

        // Si c'est le processus projet, ouvrir directement l'onglet Processus
        if (notificationId === 'processus-projet') {
          setTimeout(() => {
            const processusTab = document.querySelector('button[data-tab="processus"]') as HTMLButtonElement;
            if (processusTab) {
              processusTab.click();
            }
          }, 1000);
        }
      }
    }, 300);
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
                  const Icon = notification.icon;
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
                          notification.type === 'processus_projet' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' :
                          notification.type === 'new_document' ? 'bg-green-100' :
                          notification.type === 'contact' ? 'bg-blue-100' : 'bg-orange-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            notification.type === 'processus_projet' ? 'text-orange-600' :
                            notification.type === 'new_document' ? 'text-green-600' :
                            notification.type === 'contact' ? 'text-blue-600' : 'text-orange-600'
                          }`} />
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
                    const allNotificationIds = notifications.map(n => n.id);
                    localStorage.setItem('progineer-landy-notifications-v2', JSON.stringify(allNotificationIds));
                    setNotifications(prev => prev.map(notif => ({ ...notif, isNew: false })));
                    setHasUnread(false);
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