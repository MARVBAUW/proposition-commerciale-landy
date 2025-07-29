import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Download, HelpCircle, GitCompare, Users, Building } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import PdfDocumentDual from './PdfDocumentDual';
import MergedPdfDownloadLink from './MergedPdfDownloadLink';

interface HeaderProps {
  isDesktopMode?: boolean;
  solution?: 'coliving' | 'logements';
  onShowTutorial?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDesktopMode = false, solution = 'coliving', onShowTutorial }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
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
            }`} style={{ color: '#c1a16a' }}>AVANT-PROJET</div>
            <a href="https://progineer.fr/prestations/construction-neuve" target="_blank" rel="noopener noreferrer">
              <div className={`text-gray-600 hover:text-gray-800 transition-colors ${
                isDesktopMode 
                  ? 'text-base' 
                  : 'text-xs sm:text-base'
              }`}>Avant-Projet Détaillé</div>
            </a>
          </div>
          
        </div>
        
        <div className={`flex flex-col lg:grid lg:grid-cols-5 bg-white rounded-lg border border-gray-200 shadow-sm ${
          isDesktopMode 
            ? 'gap-2 p-4' 
            : 'gap-3 sm:gap-2 p-3 sm:p-4'
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
              }`}>Pierre Lauzier</div>
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
              }`}>31C rue Curiol, Marseille 13001</div>
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
              }`}>24 juillet 2025</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-1 text-xs lg:text-sm lg:col-span-2">
            {/* Bouton d'aide */}
            {onShowTutorial && (
              <button
                onClick={onShowTutorial}
                className="flex items-center gap-1 px-2 py-1 text-[#787346] hover:bg-gray-100 rounded text-xs transition-colors"
                title="Afficher le guide d'utilisation"
              >
                <HelpCircle className="w-3 h-3" />
                <span className="hidden lg:inline">Aide</span>
              </button>
            )}
            
            {/* Bouton PDF comparatif - 2 solutions */}
            <PDFDownloadLink
              document={<PdfDocumentDual />}
              fileName="Comparatif_2_Solutions_Pierre_Lauzier.pdf"
              className="flex items-center gap-1 px-2 py-1 bg-[#c1a16a] text-white rounded text-xs font-medium hover:bg-[#b8a994] transition-colors whitespace-nowrap"
            >
              {({ loading }) => (
                <>
                  <GitCompare className="w-3 h-3 flex-shrink-0" />
                  <span className="hidden lg:inline">{loading ? 'Génération...' : 'Comparatif'}</span>
                  <span className="lg:hidden">{loading ? '...' : 'Comp'}</span>
                </>
              )}
            </PDFDownloadLink>

            {/* Boutons PDF des deux solutions avec plans intégrés */}
            <MergedPdfDownloadLink
              solution="coliving"
              fileName="Solution_Coliving_avec_Plans_Pierre_Lauzier.pdf"
              className="flex items-center gap-1 px-2 py-1 bg-[#787346] text-white rounded text-xs font-medium hover:bg-[#6b6b3d] transition-colors whitespace-nowrap"
            >
              {({ loading }) => (
                <>
                  <Users className="w-3 h-3 flex-shrink-0" />
                  <span className="hidden lg:inline">{loading ? '...' : 'Coliving'}</span>
                  <span className="lg:hidden">Co</span>
                </>
              )}
            </MergedPdfDownloadLink>
            
            <MergedPdfDownloadLink
              solution="logements"
              fileName="Solution_3_Logements_avec_Plans_Pierre_Lauzier.pdf"
              className="flex items-center gap-1 px-2 py-1 bg-[#059669] text-white rounded text-xs font-medium hover:bg-[#047857] transition-colors whitespace-nowrap"
            >
              {({ loading }) => (
                <>
                  <Building className="w-3 h-3 flex-shrink-0" />
                  <span className="hidden lg:inline">{loading ? '...' : '3 Logts'}</span>
                  <span className="lg:hidden">3L</span>
                </>
              )}
            </MergedPdfDownloadLink>
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
      
      {/* Boutons PDF fixes grisés - visible au scroll */}
      <div 
        className="fixed flex gap-1 transition-all duration-300 z-40"
        style={{
          top: isMobile ? '70px' : '16px', // Position plus basse sur mobile pour éviter le toggle
          right: '16px',
          opacity: scrollY > 100 ? 0.4 : 0,
          pointerEvents: scrollY > 100 ? 'auto' : 'none'
        }}
      >
        <PDFDownloadLink
          document={<PdfDocumentDual />}
          fileName="Comparatif_2_Solutions_Pierre_Lauzier.pdf"
          className={`flex items-center gap-1 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors whitespace-nowrap ${
            isMobile ? 'px-1 py-1 text-xs' : 'px-2 py-1 text-xs'
          }`}
        >
          {({ loading }) => (
            <>
              <GitCompare className={isMobile ? "w-2 h-2 flex-shrink-0" : "w-3 h-3 flex-shrink-0"} />
              <span className="hidden lg:inline">{loading ? '...' : 'Comp'}</span>
            </>
          )}
        </PDFDownloadLink>
        
        <MergedPdfDownloadLink
          solution="coliving"
          fileName="Solution_Coliving_avec_Plans_Pierre_Lauzier.pdf"
          className={`flex items-center gap-1 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors whitespace-nowrap ${
            isMobile ? 'px-1 py-1 text-xs' : 'px-2 py-1 text-xs'
          }`}
        >
          {({ loading }) => (
            <>
              <Users className={isMobile ? "w-2 h-2 flex-shrink-0" : "w-3 h-3 flex-shrink-0"} />
              <span className="hidden lg:inline">{loading ? '...' : 'Co'}</span>
            </>
          )}
        </MergedPdfDownloadLink>
        
        <MergedPdfDownloadLink
          solution="logements"
          fileName="Solution_3_Logements_avec_Plans_Pierre_Lauzier.pdf"
          className={`flex items-center gap-1 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors whitespace-nowrap ${
            isMobile ? 'px-1 py-1 text-xs' : 'px-2 py-1 text-xs'
          }`}
        >
          {({ loading }) => (
            <>
              <Building className={isMobile ? "w-2 h-2 flex-shrink-0" : "w-3 h-3 flex-shrink-0"} />
              <span className="hidden lg:inline">{loading ? '...' : '3L'}</span>
            </>
          )}
        </MergedPdfDownloadLink>
      </div>
    </>
  );
};

export default Header;