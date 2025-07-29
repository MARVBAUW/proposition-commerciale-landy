import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Home, Calendar, MapPin, Target } from 'lucide-react';
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

interface PotentialSummaryProps {
  solution?: 'coliving' | 'logements';
}

const PotentialSummary: React.FC<PotentialSummaryProps> = ({ solution = 'coliving' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('max');

  // Calculer le coût total dynamique selon la solution avec TVA différentielle
  const getTotalCost = () => {
    if (solution === 'logements') {
      const amelioration55Ht = 16560 + 12420 + 20184;
      const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 30534 + 27945;
      const variables20Ht = 15600 + 16500 + 14290;
      const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
      const tva55 = Math.round(amelioration55Ht * 0.055);
      const tva10 = Math.round(renovation10Ht * 0.10);
      const tva20 = Math.round(variables20Ht * 0.2);
      const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
      return totalTtc;
    } else {
      const amelioration55Ht = 16560 + 12420 + 13456;
      const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 25876 + 20700;
      const variables20Ht = 10350 + 11730 + 11040;
      const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
      const tva55 = Math.round(amelioration55Ht * 0.055);
      const tva10 = Math.round(renovation10Ht * 0.10);
      const tva20 = Math.round(variables20Ht * 0.2);
      const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
      return totalTtc;
    }
  };

  // Calculer les données selon la solution
  const getPotentialData = () => {
    const coutTotal = getTotalCost();
    
    if (solution === 'logements') {
      const valeurTotale = 471000;
      return {
        valeurTotale: valeurTotale,
        prixM2: 3140,
        coutTotal: coutTotal,
        plusValue: valeurTotale - coutTotal,
        minPrice: Math.round(valeurTotale * 0.85),
        maxPrice: Math.round(valeurTotale * 1.15),
        loyer: 1884,
        loyerM2: 12.56
      };
    } else {
      const valeurTotale = 515000;
      return {
        valeurTotale: valeurTotale,
        prixM2: 3433,
        coutTotal: coutTotal,
        plusValue: valeurTotale - coutTotal,
        minPrice: Math.round(valeurTotale * 0.85),
        maxPrice: Math.round(valeurTotale * 1.15),
        loyer: 2420,
        loyerM2: 16.13
      };
    }
  };

  const potentialData = getPotentialData();

  const evolutionData = [
    { period: '1year', label: '1 AN', change: '+0%', isPositive: false },
    { period: '5years', label: '5 ANS', change: '+16%', isPositive: true },
    { period: '10years', label: '10 ANS', change: '+34%', isPositive: true },
    { period: 'max', label: 'MAX', change: '+283%', isPositive: true }
  ];

  const getPriceData = () => {
    const currentValue = potentialData.valeurTotale;
    const ratio = currentValue / 484300;
    
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
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>POTENTIEL IMMOBILIER</h2>
        
        {/* Estimations principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Prix de vente */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border shadow-sm" style={{ borderColor: '#c1a16a' }}>
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 mr-3" style={{ color: '#c1a16a' }} />
              <h3 className="text-lg font-semibold" style={{ color: '#c1a16a' }}>Prix net vendeur</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{potentialData.valeurTotale.toLocaleString('fr-FR')} €</div>
            <div className="text-sm text-gray-600 mb-3">soit {potentialData.prixM2.toLocaleString('fr-FR')} €/m²</div>
            <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
              <span>Min: {potentialData.minPrice.toLocaleString('fr-FR')} €</span>
              <span>Max: {potentialData.maxPrice.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="mt-3 inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(193, 161, 106, 0.2)', color: '#c1a16a' }}>
              Fiabilité élevée (4/5)
            </div>
          </div>

          {/* Potentiel locatif */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border shadow-sm" style={{ borderColor: '#787346' }}>
            <div className="flex items-center mb-4">
              <Home className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
              <h3 className="text-lg font-semibold" style={{ color: '#787346' }}>Loyer hors charges</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{potentialData.loyer.toLocaleString('fr-FR')} €/mois</div>
            <div className="text-sm text-gray-600 mb-3">soit {potentialData.loyerM2.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} €/m²</div>
            <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
              <span>Min: {Math.round(potentialData.loyer * 0.9).toLocaleString('fr-FR')} €</span>
              <span>Max: {Math.round(potentialData.loyer * 1.1).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="mt-3 inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(184, 169, 148, 0.2)', color: '#b8a994' }}>
              Fiabilité satisfaisante (3/5)
            </div>
          </div>
        </div>

        {/* Évolution des prix */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#c1a16a' }} />
            <h3 className="text-xl font-semibold" style={{ color: '#c1a16a' }}>Évolution du prix de votre bien</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {evolutionData.map((item, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedPeriod(item.period)}
                className={`rounded-lg p-3 text-center border transition-all duration-300 ${
                  selectedPeriod === item.period 
                    ? 'border-c1a16a bg-gray-100' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
                style={{ 
                  borderColor: selectedPeriod === item.period ? '#c1a16a' : undefined,
                  backgroundColor: selectedPeriod === item.period ? 'rgba(193, 161, 106, 0.2)' : undefined
                }}
              >
                <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                <div className={`text-sm font-bold ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change}
                </div>
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="h-64">
              <Line data={getChartData()} options={chartOptions} />
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            ℹ️ Cette courbe est mise à jour mensuellement en fonction des dernières transactions connues dans l'environnement du bien.
          </div>
        </div>

        {/* Caractéristiques du bien */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Home className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
            <h3 className="text-xl font-semibold" style={{ color: '#787346' }}>Caractéristiques du bien</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyDetails.map((detail, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <detail.icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#b8a994' }} />
                <div className="text-lg font-bold text-gray-900 mb-1">{detail.value}</div>
                <div className="text-sm text-gray-500">{detail.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse financière */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 mr-3" style={{ color: '#b8a994' }} />
              <h3 className="text-xl font-semibold" style={{ color: '#c1a16a' }}>Coût au m²</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{Math.round(potentialData.coutTotal / 150).toLocaleString('fr-FR')} € TTC</div>
            <div className="text-gray-600 mb-4">Tout compris (travaux + honoraires)</div>
            <div className="text-sm text-gray-500">
              Estimation basée sur les coûts réels du marché
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
              <h3 className="text-xl font-semibold" style={{ color: '#787346' }}>Plus-value potentielle</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Valeur estimée terminé:</span>
                <span className="font-bold text-gray-900">{potentialData.valeurTotale.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coût total projet:</span>
                <span className="font-bold text-gray-900">{potentialData.coutTotal.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plus-value brute:</span>
                  <span className="font-bold text-2xl" style={{ color: '#787346' }}>{potentialData.plusValue.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  (Hors frais annexes)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyse Comparative des Solutions */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#c1a16a' }} />
            <h3 className="text-xl font-semibold" style={{ color: '#c1a16a' }}>ANALYSE COMPARATIVE DES SOLUTIONS</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solution Coliving */}
            <div className={`bg-gradient-to-br from-white to-gray-50 rounded-lg p-5 border shadow-sm ${
              solution === 'coliving' ? 'border-2' : 'border'
            }`} style={{ 
              borderColor: solution === 'coliving' ? '#c1a16a' : '#e5e7eb'
            }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold" style={{ color: '#787346' }}>Solution COLIVING</h4>
                {solution === 'coliving' && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ 
                    backgroundColor: 'rgba(193, 161, 106, 0.2)', 
                    color: '#c1a16a' 
                  }}>
                    ● Sélectionnée
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Investissement total:</span>
                  <span className="font-bold text-gray-900">{(() => {
                    const amelioration55Ht = 16560 + 12420 + 13456;
                    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 25876 + 20700;
                    const variables20Ht = 10350 + 11730 + 11040;
                    const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
                    const tva55 = Math.round(amelioration55Ht * 0.055);
                    const tva10 = Math.round(renovation10Ht * 0.10);
                    const tva20 = Math.round(variables20Ht * 0.2);
                    const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
                    return totalTtc.toLocaleString('fr-FR');
                  })()} €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valeur de revente:</span>
                  <span className="font-bold text-green-600">515 000 €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plus-value brute:</span>
                  <span className="font-bold text-green-600">{(() => {
                    const amelioration55Ht = 16560 + 12420 + 13456;
                    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 25876 + 20700;
                    const variables20Ht = 10350 + 11730 + 11040;
                    const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
                    const tva55 = Math.round(amelioration55Ht * 0.055);
                    const tva10 = Math.round(renovation10Ht * 0.10);
                    const tva20 = Math.round(variables20Ht * 0.2);
                    const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
                    const plusValue = 515000 - totalTtc;
                    return plusValue.toLocaleString('fr-FR');
                  })()} €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loyer mensuel:</span>
                  <span className="font-bold text-blue-600">2 420 €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rendement brut:</span>
                  <span className="font-bold text-blue-600">{(() => {
                    const amelioration55Ht = 16560 + 12420 + 13456;
                    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 25876 + 20700;
                    const variables20Ht = 10350 + 11730 + 11040;
                    const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
                    const tva55 = Math.round(amelioration55Ht * 0.055);
                    const tva10 = Math.round(renovation10Ht * 0.10);
                    const tva20 = Math.round(variables20Ht * 0.2);
                    const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
                    const rendement = (2420 * 12 / totalTtc * 100);
                    return rendement.toFixed(1);
                  })()}%</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg border border-gray-200" style={{ backgroundColor: 'rgba(193, 161, 106, 0.1)' }}>
                <div className="text-sm font-medium" style={{ color: '#787346' }}>⚡ Points forts</div>
                <div className="text-xs text-gray-700 mt-1">
                  • Plus-value importante • Loyers élevés • Gestion simplifiée
                </div>
              </div>
            </div>

            {/* Solution 3 Logements */}
            <div className={`bg-gradient-to-br from-white to-gray-50 rounded-lg p-5 border shadow-sm ${
              solution === 'logements' ? 'border-2' : 'border'
            }`} style={{ 
              borderColor: solution === 'logements' ? '#c1a16a' : '#e5e7eb'
            }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold" style={{ color: '#787346' }}>Solution 3 LOGEMENTS</h4>
                {solution === 'logements' && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ 
                    backgroundColor: 'rgba(193, 161, 106, 0.2)', 
                    color: '#c1a16a' 
                  }}>
                    ● Sélectionnée
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Investissement total:</span>
                  <span className="font-bold text-gray-900">{(() => {
                    const amelioration55Ht = 16560 + 12420 + 20184;
                    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 30534 + 27945;
                    const variables20Ht = 15600 + 16500 + 14290;
                    const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
                    const tva55 = Math.round(amelioration55Ht * 0.055);
                    const tva10 = Math.round(renovation10Ht * 0.10);
                    const tva20 = Math.round(variables20Ht * 0.2);
                    const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
                    return totalTtc.toLocaleString('fr-FR');
                  })()} €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valeur de revente:</span>
                  <span className="font-bold text-green-600">471 000 €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plus-value brute:</span>
                  <span className="font-bold text-green-600">{(() => {
                    const amelioration55Ht = 16560 + 12420 + 20184;
                    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 30534 + 27945;
                    const variables20Ht = 15600 + 16500 + 14290;
                    const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
                    const tva55 = Math.round(amelioration55Ht * 0.055);
                    const tva10 = Math.round(renovation10Ht * 0.10);
                    const tva20 = Math.round(variables20Ht * 0.2);
                    const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
                    const plusValue = 471000 - totalTtc;
                    return plusValue.toLocaleString('fr-FR');
                  })()} €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loyer mensuel total:</span>
                  <span className="font-bold text-blue-600">1 884 €</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rendement brut:</span>
                  <span className="font-bold text-blue-600">{(() => {
                    const amelioration55Ht = 16560 + 12420 + 20184;
                    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + 30534 + 27945;
                    const variables20Ht = 15600 + 16500 + 14290;
                    const totalHt = amelioration55Ht + renovation10Ht + variables20Ht;
                    const tva55 = Math.round(amelioration55Ht * 0.055);
                    const tva10 = Math.round(renovation10Ht * 0.10);
                    const tva20 = Math.round(variables20Ht * 0.2);
                    const totalTtc = totalHt + tva55 + tva10 + tva20 + 8514 - 2500;
                    const rendement = (1884 * 12 / totalTtc * 100);
                    return rendement.toFixed(1);
                  })()}%</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg border border-gray-200" style={{ backgroundColor: 'rgba(184, 169, 148, 0.1)' }}>
                <div className="text-sm font-medium" style={{ color: '#787346' }}>⚡ Points forts</div>
                <div className="text-xs text-gray-700 mt-1">
                  • Réversibilité facile • Moins de risques locatifs • Flexibilité
                </div>
              </div>
            </div>
          </div>

          {/* Synthèse */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#c1a16a' }}>
                <span className="text-white text-sm font-bold">💡</span>
              </div>
              <div>
                <div className="font-semibold mb-2" style={{ color: '#787346' }}>Synthèse Comparative</div>
                <div className="text-sm text-gray-700">
                  <strong>Solution Coliving</strong> : Rendement et plus-value optimaux pour un profil expérimenté acceptant une gestion spécialisée.<br/>
                  <strong>Solution 3 Logements</strong> : Approche sécurisée avec réversibilité intégrée, adaptée aux investissements prudents.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PotentialSummary;