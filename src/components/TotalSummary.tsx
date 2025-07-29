import React, { useEffect, useRef, useState } from 'react';

import { TrendingUp, DollarSign, Home, Calendar, MapPin, Target } from 'lucide-react';

interface TotalSummaryProps {
  solution?: 'coliving' | 'logements';
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TotalSummary: React.FC<TotalSummaryProps> = ({ solution = 'coliving' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('max');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculer le coût total dynamique selon la solution avec TVA différentielle
  const getTotalCost = () => {
    if (solution === 'logements') {
      // Coûts variables pour solution 3 logements
      const electriciteHt = 30534;
      const plomberieHt = 27945;
      const pacHt = 20184;
      const menuiseriesIntHt = 15600;
      const cuisineHt = 16500;
      const sanitairesHt = 14290;
      
      // TVA 5.5% : Amélioration énergétique
      const amelioration55Ht = 16560 + 12420 + pacHt; // Isolation + Chauffage + PAC
      
      // TVA 10% : Rénovation
      const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + electriciteHt + plomberieHt;
      
      // TVA 20% : Équipements
      const variables20Ht = menuiseriesIntHt + cuisineHt + sanitairesHt;
      
      const totalTravauxHt = amelioration55Ht + renovation10Ht + variables20Ht;
      const tva55 = Math.round(amelioration55Ht * 0.055);
      const tva10 = Math.round(renovation10Ht * 0.10);
      const tva20 = Math.round(variables20Ht * 0.2);
      const tvaTravauxHt = tva55 + tva10 + tva20;
      const totalTravauxTtc = totalTravauxHt + tvaTravauxHt;
      
      const honorairesHt = 7095;
      const honorairesTtc = Math.round(honorairesHt * 1.2);
      const prime = -2500;
      
      return totalTravauxTtc + honorairesTtc + prime;
    } else {
      // Coûts variables pour solution coliving
      const electriciteHt = 25876;
      const plomberieHt = 20700;
      const pacHt = 13456;
      const menuiseriesIntHt = 10350;
      const cuisineHt = 11730;
      const sanitairesHt = 11040;
      
      // TVA 5.5% : Amélioration énergétique
      const amelioration55Ht = 16560 + 12420 + pacHt; // Isolation + Chauffage + PAC
      
      // TVA 10% : Rénovation
      const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + electriciteHt + plomberieHt;
      
      // TVA 20% : Équipements
      const variables20Ht = menuiseriesIntHt + cuisineHt + sanitairesHt;
      
      const totalTravauxHt = amelioration55Ht + renovation10Ht + variables20Ht;
      const tva55 = Math.round(amelioration55Ht * 0.055);
      const tva10 = Math.round(renovation10Ht * 0.10);
      const tva20 = Math.round(variables20Ht * 0.2);
      const tvaTravauxHt = tva55 + tva10 + tva20;
      const totalTravauxTtc = totalTravauxHt + tvaTravauxHt;
      
      const honorairesHt = 7095;
      const honorairesTtc = Math.round(honorairesHt * 1.2);
      const prime = -2500;
      
      return totalTravauxTtc + honorairesTtc + prime;
    }
  };

  // Calculer les données selon la solution
  const getPotentialData = () => {
    const coutTotal = getTotalCost();
    
    if (solution === 'logements') {
      const valeurTotale = 471000;
      return {
        valeurTotale: valeurTotale, // 163+163+145k€
        prixM2: 3140, // 471000/150
        coutTotal: coutTotal,
        plusValue: valeurTotale - coutTotal,
        minPrice: Math.round(valeurTotale * 0.85), // -15%
        maxPrice: Math.round(valeurTotale * 1.15), // +15%
        loyer: 1884, // Total des 3 logements
        loyerM2: 12.56
      };
    } else {
      const valeurTotale = 515000;
      return {
        valeurTotale: valeurTotale, // Coliving
        prixM2: 3433, // 515000/150
        coutTotal: coutTotal,
        plusValue: valeurTotale - coutTotal,
        minPrice: Math.round(valeurTotale * 0.85), // -15%
        maxPrice: Math.round(valeurTotale * 1.15), // +15%
        loyer: 2420, // Coliving plus élevé
        loyerM2: 16.13
      };
    }
  };

  const potentialData = getPotentialData();

  // Calculer les totaux pour le récapitulatif avec TVA correcte
  const getRecapData = () => {
    if (solution === 'logements') {
      // Coûts variables pour solution 3 logements  
      const electriciteHt = 30534;
      const plomberieHt = 27945;
      const pacHt = 20184;
      const menuiseriesIntHt = 15600;
      const cuisineHt = 16500;
      const sanitairesHt = 14290;
      
      // TVA 5.5% : Amélioration énergétique
      const amelioration55Ht = 16560 + 12420 + pacHt; // Isolation + Chauffage + PAC
      
      // TVA 10% : Rénovation
      const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + electriciteHt + plomberieHt;
      
      // TVA 20% : Équipements
      const variables20Ht = menuiseriesIntHt + cuisineHt + sanitairesHt;
      
      const totalTravauxHt = amelioration55Ht + renovation10Ht + variables20Ht;
      const tva55 = Math.round(amelioration55Ht * 0.055);
      const tva10 = Math.round(renovation10Ht * 0.10);
      const tva20 = Math.round(variables20Ht * 0.2);
      const tvaTravauxHt = tva55 + tva10 + tva20;
      const totalTravauxTtc = totalTravauxHt + tvaTravauxHt;
      
      const honorairesHt = 7095;
      const honorairesTva = Math.round(honorairesHt * 0.2);
      const honorairesTtc = honorairesHt + honorairesTva;
      
      const prime = -2500;
      
      const totalGeneralHt = totalTravauxHt + honorairesHt + prime;
      const totalGeneralTva = tvaTravauxHt + honorairesTva;
      const totalGeneralTtc = totalTravauxTtc + honorairesTtc + prime;
      
      return {
        travauxHt: totalTravauxHt,
        travauxTva: tvaTravauxHt,
        travauxTtc: totalTravauxTtc,
        honorairesHt: honorairesHt,
        honorairesTva: honorairesTva,
        honorairesTtc: honorairesTtc,
        prime: prime,
        totalHt: totalGeneralHt,
        totalTva: totalGeneralTva,
        totalTtc: totalGeneralTtc
      };
    } else {
      // Coûts variables pour solution coliving
      const electriciteHt = 25876;
      const plomberieHt = 20700;
      const pacHt = 13456;
      const menuiseriesIntHt = 10350;
      const cuisineHt = 11730;
      const sanitairesHt = 11040;
      
      // TVA 5.5% : Amélioration énergétique
      const amelioration55Ht = 16560 + 12420 + pacHt; // Isolation + Chauffage + PAC
      
      // TVA 10% : Rénovation
      const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + electriciteHt + plomberieHt;
      
      // TVA 20% : Équipements
      const variables20Ht = menuiseriesIntHt + cuisineHt + sanitairesHt;
      
      const totalTravauxHt = amelioration55Ht + renovation10Ht + variables20Ht;
      const tva55 = Math.round(amelioration55Ht * 0.055);
      const tva10 = Math.round(renovation10Ht * 0.10);
      const tva20 = Math.round(variables20Ht * 0.2);
      const tvaTravauxHt = tva55 + tva10 + tva20;
      const totalTravauxTtc = totalTravauxHt + tvaTravauxHt;
      
      const honorairesHt = 7095;
      const honorairesTva = Math.round(honorairesHt * 0.2);
      const honorairesTtc = honorairesHt + honorairesTva;
      
      const prime = -2500;
      
      const totalGeneralHt = totalTravauxHt + honorairesHt + prime;
      const totalGeneralTva = tvaTravauxHt + honorairesTva;
      const totalGeneralTtc = totalTravauxTtc + honorairesTtc + prime;
      
      return {
        travauxHt: totalTravauxHt,
        travauxTva: tvaTravauxHt,
        travauxTtc: totalTravauxTtc,
        honorairesHt: honorairesHt,
        honorairesTva: honorairesTva,
        honorairesTtc: honorairesTtc,
        prime: prime,
        totalHt: totalGeneralHt,
        totalTva: totalGeneralTva,
        totalTtc: totalGeneralTtc
      };
    }
  };

  const recapData = getRecapData();

  const evolutionData = [
    { period: '1year', label: '1 AN', change: '+0%', isPositive: false },
    { period: '5years', label: '5 ANS', change: '+16%', isPositive: true },
    { period: '10years', label: '10 ANS', change: '+34%', isPositive: true },
    { period: 'max', label: 'MAX', change: '+283%', isPositive: true }
  ];

  const getPriceData = () => {
    const currentValue = potentialData.valeurTotale;
    const ratio = currentValue / 484300; // Ratio par rapport à l'ancienne valeur
    
    return {
      max: {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        data: [126430, 145600, 189500, 210000, 265400, 298000, 345600, 398700, 425100, 465200, currentValue].map(val => val === currentValue ? val : Math.round(val * ratio))
      },
      '10years': {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        data: [126430, 145600, 189500, 210000, 265400, 298000, 345600, 398700, 425100, 465200, currentValue].map(val => val === currentValue ? val : Math.round(val * ratio))
      },
      '5years': {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        data: [298000, 345600, 398700, 425100, 465200, currentValue].map(val => val === currentValue ? val : Math.round(val * ratio))
      },
      '1year': {
        labels: ['Juil 2024', 'Sept 2024', 'Nov 2024', 'Jan 2025', 'Mar 2025', 'Mai 2025', 'Juil 2025'],
        data: [465200, 467100, 470200, 475800, 479500, 481900, currentValue].map(val => val === currentValue ? val : Math.round(val * ratio))
      }
    };
  };

  const priceData = getPriceData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(39, 39, 42, 0.95)',
        titleColor: '#c1a16a',
        bodyColor: '#ffffff',
        borderColor: '#c1a16a',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(113, 113, 122, 0.3)'
        },
        ticks: {
          color: '#a1a1aa',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(113, 113, 122, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#a1a1aa',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value);
          }
        }
      }
    }
  };

  const getChartData = () => {
    const data = priceData[selectedPeriod as keyof typeof priceData];
    return {
      labels: data.labels,
      datasets: [{
        label: 'Prix estimé (€)',
        data: data.data,
        borderColor: '#c1a16a',
        backgroundColor: 'rgba(193, 161, 106, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#c1a16a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#b8a994',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3
      }]
    };
  };

  const propertyDetails = [
    { label: 'Surface', value: '150 m²', icon: Home },
    { label: 'Configuration', value: 'Bâtiment 3 niveaux', icon: Target },
    { label: 'Commune', value: 'Marseille 13001', icon: MapPin },
    { label: 'Estimation', value: '24 juillet 2025', icon: Calendar }
  ];

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>RÉCAPITULATIF GÉNÉRAL</h2>
        
        {/* Récapitulatif général */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 shadow-lg" style={{ borderColor: '#c1a16a' }}>
          <div className={`overflow-x-auto ${isMobile ? 'scroll-hint' : ''}`}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(193, 161, 106, 0.5)' }}>
                  <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-yellow-400 text-xs sm:text-sm"></th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>MONTANT HT</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>TVA</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">COÛT DES TRAVAUX RÉNOVATION</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono text-xs sm:text-sm whitespace-nowrap">{recapData.travauxHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">{recapData.travauxTva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>{recapData.travauxTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">HONORAIRES MAÎTRISE D'ŒUVRE</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono text-xs sm:text-sm whitespace-nowrap">{recapData.honorairesHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">{recapData.honorairesTva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>{recapData.honorairesTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">POTENTIEL PRIME CEE</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono text-xs sm:text-sm whitespace-nowrap">{recapData.prime.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">0,00 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap text-green-600">{recapData.prime.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                <tr className="border-t-2" style={{ background: 'linear-gradient(to right, rgba(193, 161, 106, 0.2), rgba(193, 161, 106, 0.1))', borderTopColor: '#c1a16a' }}>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-sm sm:text-lg" style={{ color: '#c1a16a' }}>TOTAL GÉNÉRAL</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right font-mono font-bold text-sm sm:text-lg whitespace-nowrap" style={{ color: '#c1a16a' }}>{recapData.totalHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>{recapData.totalTva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right font-mono font-bold text-sm sm:text-xl whitespace-nowrap" style={{ color: '#c1a16a' }}>{recapData.totalTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
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

export default TotalSummary;