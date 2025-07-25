import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';

interface HeaderProps {
  isDesktopMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDesktopMode = false }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculer l'opacité et le flou basés sur le scroll
  // Le brouillard n'apparaît qu'après avoir commencé à défiler
  const backgroundOpacity = scrollY > 0 ? Math.min(0.9, scrollY / 300) : 0;
  const blurAmount = scrollY > 0 ? Math.min(3, scrollY / 200) : 0;

  return (
    <>
      <header className={`bg-gradient-to-r from-white via-gray-50 to-white text-gray-900 border-b border-gray-200 ${
        isDesktopMode 
          ? 'py-8 px-6' 
          : 'py-4 sm:py-8 px-3 sm:px-6'
      }`}>
      <div className="max-w-6xl mx-auto">
        <div className={`flex items-center justify-between relative ${
          isDesktopMode 
            ? 'mb-6' 
            : 'mb-3 sm:mb-6'
        }`}>
          <div className={`flex items-center ${
            isDesktopMode 
              ? 'space-x-3' 
              : 'space-x-2 sm:space-x-3'
          }`}>
            <a href="https://progineer.fr" target="_blank" rel="noopener noreferrer" className="inline-block">
              <img src="/Diapositive13-removebg-preview.png" alt="PROGINEER Logo" className={
                isDesktopMode 
                  ? 'h-16 w-auto' 
                  : 'h-10 sm:h-16 w-auto'
              } />
            </a>
            <div>
              <a href="https://progineer.fr" target="_blank" rel="noopener noreferrer">
                <h1 className={`font-bold hover:opacity-80 transition-opacity ${
                  isDesktopMode 
                    ? 'text-3xl' 
                    : 'text-lg sm:text-3xl'
                }`} style={{ color: '#c1a16a' }}>PROGINEER</h1>
              </a>
              <a href="https://progineer.fr/prestations/construction-neuve" target="_blank" rel="noopener noreferrer">
                <p className={`text-gray-600 hover:text-gray-800 transition-colors ${
                  isDesktopMode 
                    ? 'text-lg' 
                    : 'text-xs sm:text-lg'
                }`}>Architecture & Maîtrise d'Œuvre</p>
              </a>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold mb-1 ${
              isDesktopMode 
                ? 'text-2xl' 
                : 'text-base sm:text-2xl'
            }`} style={{ color: '#c1a16a' }}>PROPOSITION COMMERCIALE</div>
            <a href="https://progineer.fr/prestations/construction-neuve" target="_blank" rel="noopener noreferrer">
              <div className={`text-gray-600 hover:text-gray-800 transition-colors ${
                isDesktopMode 
                  ? 'text-base' 
                  : 'text-xs sm:text-base'
              }`}>Construction neuve individuelle</div>
            </a>
          </div>
          
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-4 bg-white rounded-lg border border-gray-200 shadow-sm ${
          isDesktopMode 
            ? 'gap-6 p-6' 
            : 'gap-3 sm:gap-6 p-3 sm:p-6'
        }`}>
          <div className={`flex items-center ${
            isDesktopMode 
              ? 'space-x-3' 
              : 'space-x-2 sm:space-x-3'
          }`}>
            <div className={`rounded-full ${
              isDesktopMode 
                ? 'w-5 h-5' 
                : 'w-4 h-4 sm:w-5 sm:h-5'
            }`} style={{ backgroundColor: '#787346' }}></div>
            <div>
              <div className={`text-gray-500 ${
                isDesktopMode 
                  ? 'text-sm' 
                  : 'text-xs sm:text-sm'
              }`}>CLIENTS</div>
              <div className={`font-semibold ${
                isDesktopMode 
                  ? 'text-base' 
                  : 'text-sm sm:text-base'
              }`}>M. et Mme LANDY</div>
            </div>
          </div>
          <div className={`flex items-center ${
            isDesktopMode 
              ? 'space-x-3' 
              : 'space-x-2 sm:space-x-3'
          }`}>
            <MapPin className={
              isDesktopMode 
                ? 'w-5 h-5' 
                : 'w-4 h-4 sm:w-5 sm:h-5'
            } style={{ color: '#787346' }} />
            <div>
              <div className={`text-gray-500 ${
                isDesktopMode 
                  ? 'text-sm' 
                  : 'text-xs sm:text-sm'
              }`}>LOCALISATION</div>
              <div className={`font-semibold ${
                isDesktopMode 
                  ? 'text-base' 
                  : 'text-sm sm:text-base'
              }`}>Le Lavandou (83980)</div>
            </div>
          </div>
          <div className={`flex items-center ${
            isDesktopMode 
              ? 'space-x-3' 
              : 'space-x-2 sm:space-x-3'
          }`}>
            <Calendar className={
              isDesktopMode 
                ? 'w-5 h-5' 
                : 'w-4 h-4 sm:w-5 sm:h-5'
            } style={{ color: '#787346' }} />
            <div>
              <div className={`text-gray-500 ${
                isDesktopMode 
                  ? 'text-sm' 
                  : 'text-xs sm:text-sm'
              }`}>DATE</div>
              <div className={`font-semibold ${
                isDesktopMode 
                  ? 'text-base' 
                  : 'text-sm sm:text-base'
              }`}>21 juillet 2025</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <PDFDownloadLink
              document={<PdfDocument />}
              fileName="Proposition_Commerciale_LANDY_Le_Lavandou.pdf"
              style={{
                backgroundColor: '#c1a16a',
                color: 'white',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              {({ loading }) => (
                <>
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{loading ? 'Préparation...' : 'Télécharger PDF'}</span>
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
      </header>
      
      {/* Bande d'arrière-plan avec effet de flou - n'apparaît qu'au défilement */}
      <div 
        className="fixed top-0 left-0 right-0 h-20 transition-all duration-300 pointer-events-none"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          borderBottom: scrollY > 50 ? '1px solid rgba(0,0,0,0.1)' : 'none',
          opacity: scrollY > 0 ? 1 : 0,
          zIndex: 35
        }}
      ></div>
      
      {/* Logo central fixe (toujours net) */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
        <img 
          src="/Diapositive10-removebg-preview.png" 
          alt="PROGINEER" 
          className="h-16 w-auto" 
        />
      </div>
    </>
  );
};

export default Header;