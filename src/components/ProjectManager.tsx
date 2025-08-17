import React, { useState, useEffect } from 'react';
import { Settings, Save, User, Mail, Phone, MapPin, FileText, X } from 'lucide-react';
import { ProjectConfig, loadProjectConfig, saveProjectConfig } from '../services/projectService';

interface ProjectManagerProps {
  onClose: () => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ onClose }) => {
  const [config, setConfig] = useState<Omit<ProjectConfig, 'id' | 'createdAt' | 'updatedAt'>>({
    projectName: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    progineersEmail: '',
    progineersPhone: '',
    projectDescription: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      setLoading(true);
      const existingConfig = await loadProjectConfig();
      
      if (existingConfig) {
        setConfig({
          projectName: existingConfig.projectName,
          clientName: existingConfig.clientName,
          clientEmail: existingConfig.clientEmail,
          clientPhone: existingConfig.clientPhone || '',
          clientAddress: existingConfig.clientAddress || '',
          progineersEmail: existingConfig.progineersEmail,
          progineersPhone: existingConfig.progineersPhone || '',
          projectDescription: existingConfig.projectDescription || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await saveProjectConfig(config);
      
      if (result.success) {
        alert('Configuration du projet sauvegardée avec succès !');
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof config, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#c1a16a]"></div>
            <span>Chargement de la configuration...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#c1a16a]/10 rounded-lg">
                <Settings className="w-6 h-6 text-[#c1a16a]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gestion du Projet</h2>
                <p className="text-sm text-gray-600">
                  Configuration générale du projet et des contacts
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Informations Projet */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#c1a16a]" />
              Informations du Projet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={config.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="Ex: Construction LANDY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du projet
                </label>
                <textarea
                  value={config.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  rows={3}
                  placeholder="Description courte du projet..."
                />
              </div>
            </div>
          </div>

          {/* Informations Client */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#c1a16a]" />
              Informations Client
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Important :</strong> L'email client configuré ici sera utilisé par défaut 
                pour l'envoi des notifications et des documents à signer. Vous pourrez toujours 
                le modifier individuellement pour chaque document si nécessaire.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client
                </label>
                <input
                  type="text"
                  value={config.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="Nom et prénom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email du client *
                </label>
                <input
                  type="email"
                  value={config.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone du client
                </label>
                <input
                  type="tel"
                  value={config.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adresse du client
                </label>
                <input
                  type="text"
                  value={config.clientAddress}
                  onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="Adresse complète"
                />
              </div>
            </div>
          </div>

          {/* Informations PROGINEER */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-[#c1a16a]" />
              Informations PROGINEER
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email PROGINEER
                </label>
                <input
                  type="email"
                  value={config.progineersEmail}
                  onChange={(e) => handleInputChange('progineersEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="contact@progineer.fr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone PROGINEER
                </label>
                <input
                  type="tel"
                  value={config.progineersPhone}
                  onChange={(e) => handleInputChange('progineersPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1a16a] focus:border-transparent"
                  placeholder="Téléphone de contact"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !config.clientEmail}
              className="px-4 py-2 bg-[#c1a16a] text-white rounded-lg hover:bg-[#b8956c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;