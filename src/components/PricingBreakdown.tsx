import React, { useEffect, useState } from 'react';
import PricingSection from './PricingTable';

interface PricingBreakdownProps {
  solution?: 'coliving' | 'logements';
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({ solution = 'coliving' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculer les données selon la solution
  const getPricingData = () => {
    if (solution === 'logements') {
      return {
        electriciteHt: 30534, // +18%
        plomberieHt: 27945,   // +35%
        pacHt: 20184,         // *1.5
        menuiseriesIntHt: 15600, // +5250 pour les portes palières
        cuisineHt: 16500,     // 3 cuisines à 5500€
        sanitairesHt: 14290   // +3250 pour salle de douche
      };
    } else {
      return {
        electriciteHt: 25876,
        plomberieHt: 20700,
        pacHt: 13456,
        menuiseriesIntHt: 10350,
        cuisineHt: 11730,
        sanitairesHt: 11040
      };
    }
  };

  const data = getPricingData();

  // Calculer le total des travaux avec TVA correcte
  const getTotalTravaux = () => {
    // TVA 5.5% : Amélioration énergétique uniquement
    const ameliorationEnergetique55 = 16560 + 12420; // Isolation + Chauffage central
    const pacVariable55 = data.pacHt; // PAC variable selon solution
    const total55Ht = ameliorationEnergetique55 + pacVariable55;
    
    // TVA 10% : Rénovation (ex-5.5% incorrects)
    const renovation10 = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006; // Démolition, Gros œuvre, Charpente, Menuiseries ext, Cloisons, Revêtements, Peinture
    const variablesRenovation10 = data.electriciteHt + data.plomberieHt; // Variables TVA 10%
    const total10Ht = renovation10 + variablesRenovation10;
    
    // TVA 20% : Équipements
    const variables20Ht = data.menuiseriesIntHt + data.cuisineHt + data.sanitairesHt;
    
    const totalHt = total55Ht + total10Ht + variables20Ht;
    
    // TVA différentielle
    const tva55 = Math.round(total55Ht * 0.055);
    const tva10 = Math.round(total10Ht * 0.10);
    const tva20 = Math.round(variables20Ht * 0.2);
    const totalTva = tva55 + tva10 + tva20;
    
    const totalTtc = totalHt + totalTva;
    
    return {
      totalHt: totalHt,
      totalTva: totalTva,
      totalTtc: totalTtc
    };
  };

  const totalTravaux = getTotalTravaux();

  const sections = [
    {
      title: "DÉMOLITION ET DÉPOSE",
      icon: "🔨",
      rows: [
        { title: "Démolition complète des cloisons et plâtrerie", htAmount: "3 934,00 €", tva: "216,37 €", ttcAmount: "4 150,37 €" },
        { title: "Dépose des revêtements de sols existants", htAmount: "5 176,00 €", tva: "284,68 €", ttcAmount: "5 460,68 €" },
        { title: "Dépose des menuiseries intérieures", htAmount: "2 070,00 €", tva: "113,85 €", ttcAmount: "2 183,85 €" },
        { title: "Dépose des menuiseries extérieures", htAmount: "1 656,00 €", tva: "91,08 €", ttcAmount: "1 747,08 €" },
        { title: "Dépose complète de la plomberie existante", htAmount: "3 520,00 €", tva: "193,60 €", ttcAmount: "3 713,60 €" },
        { title: "Dépose des équipements sanitaires", htAmount: "1 656,00 €", tva: "91,08 €", ttcAmount: "1 747,08 €" },
        { title: "Dépose de l'installation électrique", htAmount: "3 726,00 €", tva: "204,93 €", ttcAmount: "3 930,93 €" },
      ],
      subtotal: { htAmount: "21 738,00 €", tva: "2 173,80 €", ttcAmount: "23 911,80 €" }
    },
    {
      title: "GROS ŒUVRE ET STRUCTURE",
      icon: "🏗️",
      rows: [
        { title: "Réalisation plancher bois structurel", htAmount: "11 040,00 €", tva: "607,20 €", ttcAmount: "11 647,20 €" },
        { title: "Reprise et création des réseaux d'évacuation", htAmount: "4 140,00 €", tva: "227,70 €", ttcAmount: "4 367,70 €" },
        { title: "Ouverture contrôlée en mur porteur", htAmount: "1 656,00 €", tva: "91,08 €", ttcAmount: "1 747,08 €" },
        { title: "Création de trémie d'escalier", htAmount: "1 242,00 €", tva: "68,31 €", ttcAmount: "1 310,31 €" },
        { title: "Chape de ravoilement et mise à niveau", htAmount: "4 554,00 €", tva: "250,47 €", ttcAmount: "4 804,47 €" },
        { title: "Raccordement aux réseaux urbains", htAmount: "1 001,00 €", tva: "55,06 €", ttcAmount: "1 056,06 €" },
      ],
      subtotal: { htAmount: "23 633,00 €", tva: "1 299,82 €", ttcAmount: "24 932,82 €" }
    },
    {
      title: "CHARPENTE ET TOITURE",
      icon: "🏠",
      rows: [
        { title: "Rénovation complète de la charpente traditionnelle", htAmount: "12 766,00 €", tva: "702,13 €", ttcAmount: "13 468,13 €" },
      ],
      subtotal: { htAmount: "12 766,00 €", tva: "702,13 €", ttcAmount: "13 468,13 €" }
    },
    {
      title: "ISOLATION THERMIQUE",
      icon: "🧱",
      rows: [
        { title: "Isolation thermique réglementaire", htAmount: "16 560,00 €", tva: "910,80 €", ttcAmount: "17 470,80 €" },
      ],
      subtotal: { htAmount: "16 560,00 €", tva: "910,80 €", ttcAmount: "17 470,80 €" }
    },
    {
      title: "MENUISERIES EXTÉRIEURES",
      icon: "🚪",
      rows: [
        { title: "Remplacement des menuiseries extérieures bois", htAmount: "22 426,00 €", tva: "1 233,43 €", ttcAmount: "23 659,43 €" },
        { title: "Création de menuiserie bois sur mesure", htAmount: "898,00 €", tva: "49,39 €", ttcAmount: "947,39 €" },
      ],
      subtotal: { htAmount: "23 324,00 €", tva: "1 282,82 €", ttcAmount: "24 606,82 €" }
    },
    {
      title: "INSTALLATIONS ÉLECTRIQUES",
      icon: "⚡",
      rows: [
        { 
          title: solution === 'logements' ? "Prestations avancées selon NFC 15-100 (+18%)" : "Prestations avancées selon NFC 15-100", 
          htAmount: `${data.electriciteHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          tva: `${(data.electriciteHt * 0.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          ttcAmount: `${(data.electriciteHt * 1.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
        },
      ],
      subtotal: { 
        htAmount: `${data.electriciteHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        tva: `${(data.electriciteHt * 0.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        ttcAmount: `${(data.electriciteHt * 1.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
      }
    },
    {
      title: "PLOMBERIE ET SANITAIRE",
      icon: "🚰",
      rows: [
        { 
          title: solution === 'logements' ? "Prestations avancées complètes (+35%)" : "Prestations avancées complètes", 
          htAmount: `${data.plomberieHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          tva: `${(data.plomberieHt * 0.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          ttcAmount: `${(data.plomberieHt * 1.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
        },
      ],
      subtotal: { 
        htAmount: `${data.plomberieHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        tva: `${(data.plomberieHt * 0.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        ttcAmount: `${(data.plomberieHt * 1.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
      }
    },
    {
      title: "CHAUFFAGE ET CLIMATISATION",
      icon: "🌡️",
      rows: [
        { title: "Installation de chauffage central", htAmount: "12 420,00 €", tva: "683,10 €", ttcAmount: "13 103,10 €" },
        { 
          title: solution === 'logements' ? "Pompes à chaleur air-air multi-split" : "Climatisation réversible avec pompe à chaleur", 
          htAmount: `${data.pacHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          tva: `${(data.pacHt * 0.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          ttcAmount: `${(data.pacHt * 1.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
        },
      ],
      subtotal: { 
        htAmount: `${(12420 + data.pacHt).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        tva: `${((12420 + data.pacHt) * 0.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        ttcAmount: `${((12420 + data.pacHt) * 1.055).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
      }
    },
    {
      title: "CLOISONS ET PLÂTRERIE",
      icon: "🧱",
      rows: [
        { title: "Cloisons de distribution et plâtrerie", htAmount: "19 666,00 €", tva: "1 081,63 €", ttcAmount: "20 747,63 €" },
      ],
      subtotal: { htAmount: "19 666,00 €", tva: "1 081,63 €", ttcAmount: "20 747,63 €" }
    },
    {
      title: "MENUISERIES INTÉRIEURES",
      icon: "🚪",
      rows: solution === 'logements' ? [
        { title: "Menuiseries intérieures standard", htAmount: "10 350,00 €", tva: "2 070,00 €", ttcAmount: "12 420,00 €" },
        { title: "Blocs-portes palières sécurisés", htAmount: "5 250,00 €", tva: "1 050,00 €", ttcAmount: "6 300,00 €" },
      ] : [
        { title: "Menuiseries intérieures standard", htAmount: "10 350,00 €", tva: "2 070,00 €", ttcAmount: "12 420,00 €" },
      ],
      subtotal: { 
        htAmount: `${data.menuiseriesIntHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        tva: `${(data.menuiseriesIntHt * 0.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        ttcAmount: `${(data.menuiseriesIntHt * 1.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
      }
    },
    {
      title: "REVÊTEMENTS DE SOLS ET MURS",
      icon: "🏠",
      rows: [
        { title: "Carrelage grès cérame pour sols", htAmount: "4 554,00 €", tva: "250,47 €", ttcAmount: "4 804,47 €" },
        { title: "Faïence murale salle d'eau", htAmount: "1 450,00 €", tva: "79,75 €", ttcAmount: "1 529,75 €" },
        { title: "Parquet contrecollé chêne", htAmount: "9 108,00 €", tva: "500,94 €", ttcAmount: "9 608,94 €" },
      ],
      subtotal: { htAmount: "15 112,00 €", tva: "831,16 €", ttcAmount: "15 943,16 €" }
    },
    {
      title: "PEINTURE ET FINITIONS",
      icon: "🎨",
      rows: [
        { title: "Peinture complète murs et plafonds", htAmount: "12 006,00 €", tva: "660,33 €", ttcAmount: "12 666,33 €" },
      ],
      subtotal: { htAmount: "12 006,00 €", tva: "660,33 €", ttcAmount: "12 666,33 €" }
    },
    {
      title: "ÉQUIPEMENTS CUISINE",
      icon: "🍳",
      rows: [
        { 
          title: solution === 'logements' ? "Équipements cuisine pour 3 logements" : "Équipement cuisine complet", 
          htAmount: `${data.cuisineHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          tva: `${(data.cuisineHt * 0.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
          ttcAmount: `${(data.cuisineHt * 1.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
        },
      ],
      subtotal: { 
        htAmount: `${data.cuisineHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        tva: `${(data.cuisineHt * 0.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        ttcAmount: `${(data.cuisineHt * 1.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
      }
    },
    {
      title: "ÉQUIPEMENTS SANITAIRES",
      icon: "🚿",
      rows: solution === 'logements' ? [
        { title: "Équipements sanitaires pour salles d'eau", htAmount: "11 040,00 €", tva: "2 208,00 €", ttcAmount: "13 248,00 €" },
        { title: "Équipements salle de douche supplémentaire", htAmount: "3 250,00 €", tva: "650,00 €", ttcAmount: "3 900,00 €" },
      ] : [
        { title: "Équipements sanitaires pour salles d'eau", htAmount: "11 040,00 €", tva: "2 208,00 €", ttcAmount: "13 248,00 €" },
      ],
      subtotal: { 
        htAmount: `${data.sanitairesHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        tva: `${(data.sanitairesHt * 0.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 
        ttcAmount: `${(data.sanitairesHt * 1.2).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` 
      }
    },
  ];

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>ESTIMATION FINANCIÈRE DÉTAILLÉE</h2>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#787346' }}>COÛT DES TRAVAUX</h3>
          
          {sections.map((section, index) => {
            // Déterminer le taux de TVA selon la section
            let tvaRate = '10%'; // Par défaut : rénovation
            if (section.title === "MENUISERIES INTÉRIEURES" || 
                section.title === "ÉQUIPEMENTS CUISINE" || 
                section.title === "ÉQUIPEMENTS SANITAIRES") {
              tvaRate = '20%'; // Équipements
            } else if (section.title === "ISOLATION THERMIQUE" || 
                      section.title === "CHAUFFAGE ET CLIMATISATION") {
              tvaRate = '5.5%'; // Amélioration énergétique
            }
            
            return (
              <PricingSection key={index} {...section} tvaRate={tvaRate} />
            );
          })}
        </div>

        {/* Prime CEE */}
        <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 shadow-lg" style={{ borderColor: '#4ade80' }}>
          <div className={`overflow-x-auto ${isMobile ? 'scroll-hint' : ''}`}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(74, 222, 128, 0.5)' }}>
                  <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg" style={{ color: '#4ade80' }}>POTENTIEL PRIME CEE (Certificats d'Économies d'Énergie)</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#4ade80' }}>DÉDUCTION</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50/30">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-900 font-semibold text-sm sm:text-base">Potentiel CEE - Aide sous conditions</td>
                  <td className="px-1 sm:px-4 py-3 sm:py-4 text-right font-mono font-bold text-sm sm:text-lg whitespace-nowrap" style={{ color: '#4ade80' }}>-2 500,00 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Total des travaux */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 shadow-lg" style={{ borderColor: '#c1a16a' }}>
          <div className={`overflow-x-auto ${isMobile ? 'scroll-hint' : ''}`}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(193, 161, 106, 0.5)' }}>
                  <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg" style={{ color: '#c1a16a' }}>TOTAL TRAVAUX</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>MONTANT HT</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>TVA</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-gray-900 font-semibold text-sm sm:text-base">COÛT DES TRAVAUX</td>
                  <td className="px-1 sm:px-4 py-3 sm:py-4 text-right text-gray-900 font-mono font-bold text-sm sm:text-lg whitespace-nowrap">{totalTravaux.totalHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-3 sm:py-4 text-right text-gray-600 font-mono text-sm sm:text-base whitespace-nowrap">{totalTravaux.totalTva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-3 sm:py-4 text-right font-mono font-bold text-sm sm:text-lg whitespace-nowrap" style={{ color: '#c1a16a' }}>{totalTravaux.totalTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Styles CSS pour l'animation de scroll hint */}
      <style>{`
        .scroll-hint {
          position: relative;
        }
        
        .scroll-hint:hover {
          animation: scrollHint 1.5s ease-in-out;
        }
        
        @keyframes scrollHint {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(8px);
          }
          50% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(8px);
          }
        }
        
        .scroll-hint::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -10px;
          width: 0;
          height: 0;
          border-left: 6px solid #c1a16a;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          transform: translateY(-50%);
          opacity: 0.6;
          animation: arrowPulse 2s infinite;
        }
        
        @keyframes arrowPulse {
          0%, 100% {
            opacity: 0.6;
            transform: translateY(-50%) translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) translateX(3px);
          }
        }
      `}</style>
    </section>
  );
};

export default PricingBreakdown;