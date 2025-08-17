import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // en MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'],
  maxSize = 10,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateFile = (file: File): string | null => {
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `Fichier trop volumineux. Taille maximum: ${maxSize}MB`;
    }

    // Vérifier le type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `Type de fichier non autorisé. Types acceptés: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      showMessage(error, 'error');
      return;
    }

    setUploading(true);
    
    try {
      // Upload vers Firebase Storage
      const fileUrl = await uploadToFirebaseStorage(file);
      
      onFileUploaded(fileUrl, file.name);
      showMessage(`Fichier "${file.name}" uploadé avec succès`, 'success');
      
    } catch (error) {
      console.error('Erreur upload:', error);
      showMessage('Erreur lors de l\'upload du fichier', 'error');
    } finally {
      setUploading(false);
    }
  };

  const uploadToFirebaseStorage = async (file: File): Promise<string> => {
    // Import direct des fonctions Firebase Storage
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const { storage } = await import('../config/firebase');
    
    // Créer une référence unique pour le fichier
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `documents/${fileName}`);
    
    // Upload du fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileSelector = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Zone de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
          dragActive 
            ? 'border-[#c1a16a] bg-amber-50' 
            : uploading 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-gray-300 hover:border-[#c1a16a] hover:bg-amber-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1a16a] mb-3"></div>
            <p className="text-gray-600 font-medium">Upload en cours...</p>
            <p className="text-sm text-gray-500">Veuillez patienter</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className={`w-10 h-10 mb-3 ${dragActive ? 'text-[#c1a16a]' : 'text-gray-400'}`} />
            <p className={`font-medium mb-1 ${dragActive ? 'text-[#c1a16a]' : 'text-gray-700'}`}>
              {dragActive ? 'Déposez le fichier ici' : 'Glissez-déposez un fichier ou cliquez'}
            </p>
            <p className="text-sm text-gray-500">
              Types acceptés: {acceptedTypes.join(', ')} • Max {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className={`mt-3 p-3 rounded-md flex items-center ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          {message.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
          {message.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 mr-2" />}
          {message.type === 'info' && <File className="w-4 h-4 text-blue-500 mr-2" />}
          <p className={`text-sm ${
            message.type === 'success' ? 'text-green-800' :
            message.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Instructions pour Firebase Storage */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="text-xs text-green-800">
          <strong>✅ Firebase Storage intégré :</strong> Les fichiers seront uploadés directement vers Firebase Storage.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;