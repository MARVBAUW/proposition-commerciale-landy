import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('progineer_admin_auth');
      if (authData) {
        try {
          const { timestamp, username } = JSON.parse(authData);
          const now = Date.now();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          // Vérifier si la session n'a pas expiré (24h)
          if (now - timestamp < twentyFourHours && username === 'progineer.moe@gmail.com') {
            setIsAuthenticated(true);
          } else {
            // Session expirée
            localStorage.removeItem('progineer_admin_auth');
          }
        } catch (error) {
          localStorage.removeItem('progineer_admin_auth');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }): Promise<boolean> => {
    // Authentification admin PROGINEER
    const validCredentials = {
      username: 'progineer.moe@gmail.com',
      password: 'Baullanowens1112.'
    };

    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      
      // Sauvegarder la session (24h)
      const authData = {
        username: credentials.username,
        timestamp: Date.now()
      };
      localStorage.setItem('progineer_admin_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('progineer_admin_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
};

export default AdminPanel;