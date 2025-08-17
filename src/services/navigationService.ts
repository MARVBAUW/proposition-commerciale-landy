import { NotificationData } from './notificationsService';

// Sections disponibles dans le projet
export const PROJECT_SECTIONS = {
  'project-summary': { name: 'Résumé du projet', description: 'Vue d\'ensemble du projet et caractéristiques' },
  'pricing': { name: 'Tarification', description: 'Détail des prix et devis' },
  'services': { name: 'Services', description: 'Services inclus dans le projet' },
  'total': { name: 'Récapitulatif', description: 'Résumé financier avec graphiques' },
  'exclusions': { name: 'Exclusions', description: 'Services non inclus et contacts' },
  'timeline': { name: 'Planning', description: 'Échéancier et phases du projet' },
  'documents': { name: 'Documents', description: 'Documents et pièces administratives' }
} as const;

// Onglets disponibles dans la section documents
export const DOCUMENT_TABS = {
  'plans': { name: 'Plans', description: 'Plans et documents techniques' },
  'administratif': { name: 'Administratif', description: 'Documents administratifs et contrats' },
  'processus': { name: 'Processus', description: 'Guide du processus projet' }
} as const;

// Navigation vers une section spécifique
export const navigateToSection = (notification: NotificationData): boolean => {
  try {
    console.log('🧭 Navigation vers section depuis notification:', notification);

    // Si une URL personnalisée est définie
    if (notification.customUrl) {
      if (notification.customUrl.startsWith('http')) {
        // URL externe
        window.open(notification.customUrl, '_blank');
      } else {
        // URL relative
        window.location.href = notification.customUrl;
      }
      return true;
    }

    // Navigation vers une section du projet
    if (notification.targetSection) {
      const targetElement = document.querySelector(`[data-section="${notification.targetSection}"]`);
      
      if (targetElement) {
        console.log('🧭 Élément trouvé, scroll vers:', notification.targetSection);
        
        // Scroll vers la section
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });

        // Si c'est la section documents et qu'un onglet est spécifié
        if (notification.targetSection === 'documents' && notification.targetTab) {
          setTimeout(() => {
            const tabButton = document.querySelector(`button[data-tab="${notification.targetTab}"]`) as HTMLButtonElement;
            if (tabButton) {
              console.log('🧭 Clic sur onglet:', notification.targetTab);
              tabButton.click();
            }
          }, 1000); // Délai pour laisser le scroll se terminer
        }

        return true;
      } else {
        console.warn('🧭 Section non trouvée:', notification.targetSection);
        return false;
      }
    }

    // Navigation basée sur le type de notification (compatibilité arrière)
    return navigateByType(notification.type);
    
  } catch (error) {
    console.error('🧭 Erreur navigation:', error);
    return false;
  }
};

// Navigation basée sur le type (compatibilité arrière)
const navigateByType = (type: NotificationData['type']): boolean => {
  const typeMapping: Record<NotificationData['type'], { section: string; tab?: string }> = {
    'signature_ready': { section: 'documents', tab: 'administratif' },
    'processus_projet': { section: 'documents', tab: 'processus' },
    'new_document': { section: 'documents', tab: 'administratif' },
    'contact': { section: 'exclusions' },
    'waiting_approval': { section: 'total' }
  };

  const mapping = typeMapping[type];
  if (mapping) {
    const targetElement = document.querySelector(`[data-section="${mapping.section}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      if (mapping.tab) {
        setTimeout(() => {
          const tabButton = document.querySelector(`button[data-tab="${mapping.tab}"]`) as HTMLButtonElement;
          if (tabButton) {
            tabButton.click();
          }
        }, 1000);
      }
      return true;
    }
  }
  
  return false;
};

// Obtenir le label d'une section
export const getSectionLabel = (sectionId: string): string => {
  return PROJECT_SECTIONS[sectionId as keyof typeof PROJECT_SECTIONS]?.name || sectionId;
};

// Obtenir le label d'un onglet
export const getTabLabel = (tabId: string): string => {
  return DOCUMENT_TABS[tabId as keyof typeof DOCUMENT_TABS]?.name || tabId;
};

// Obtenir toutes les sections disponibles pour le sélecteur
export const getAllSections = () => {
  return Object.entries(PROJECT_SECTIONS).map(([id, data]) => ({
    id,
    ...data
  }));
};

// Obtenir tous les onglets disponibles pour le sélecteur
export const getAllTabs = () => {
  return Object.entries(DOCUMENT_TABS).map(([id, data]) => ({
    id,
    ...data
  }));
};