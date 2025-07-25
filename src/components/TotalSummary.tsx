import React, { useEffect, useRef, useState } from 'react';
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

const TotalSummary: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('max');

  const evolutionData = [
    { period: '1year', label: '1 AN', change: '+3%', isPositive: true },
    { period: '5years', label: '5 ANS', change: '+23%', isPositive: true },
    { period: '10years', label: '10 ANS', change: '+20%', isPositive: true },
    { period: 'max', label: 'MAX', change: '+23%', isPositive: true }
  ];

  const priceData = {
    max: {
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      data: [1270000, 1285000, 1315000, 1345000, 1375000, 1400000, 1480000, 1540000, 1520000, 1550000, 1563820]
    },
    '10years': {
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      data: [1270000, 1285000, 1315000, 1345000, 1375000, 1400000, 1480000, 1540000, 1520000, 1550000, 1563820]
    },
    '5years': {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      data: [1270000, 1480000, 1540000, 1520000, 1550000, 1563820]
    },
    '1year': {
      labels: ['Juil 2024', 'Sept 2024', 'Nov 2024', 'Jan 2025', 'Mar 2025', 'Mai 2025', 'Juil 2025'],
      data: [1520000, 1535000, 1545000, 1550000, 1558000, 1560000, 1563820]
    }
  };

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
    { label: 'Surface', value: '145 m²', icon: Home },
    { label: 'Configuration', value: 'Maison à étage', icon: Target },
    { label: 'Commune', value: 'Le Lavandou', icon: MapPin },
    { label: 'Estimation', value: '21 juillet 2025', icon: Calendar }
  ];

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>RÉCAPITULATIF GÉNÉRAL</h2>
        
        {/* Récapitulatif général */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 shadow-lg" style={{ borderColor: '#c1a16a' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(193, 161, 106, 0.5)' }}>
                  <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-yellow-400 text-xs sm:text-sm"></th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>MONTANT HT</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>TVA 20%</th>
                  <th className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">COÛT DES TRAVAUX</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono text-xs sm:text-sm whitespace-nowrap">332 725,52 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">66 545,11 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>399 270,63 €</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">HONORAIRES MAÎTRISE D'ŒUVRE</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-900 font-mono text-xs sm:text-sm whitespace-nowrap">27 283,49 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right text-gray-600 font-mono text-xs sm:text-sm whitespace-nowrap">5 456,70 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-3 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>32 740,19 €</td>
                </tr>
                <tr className="border-t-2" style={{ background: 'linear-gradient(to right, rgba(193, 161, 106, 0.2), rgba(193, 161, 106, 0.1))', borderTopColor: '#c1a16a' }}>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-sm sm:text-lg" style={{ color: '#c1a16a' }}>TOTAL GÉNÉRAL</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right font-mono font-bold text-sm sm:text-lg whitespace-nowrap" style={{ color: '#c1a16a' }}>360 009,01 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right font-mono font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: '#c1a16a' }}>72 001,81 €</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right font-mono font-bold text-sm sm:text-xl whitespace-nowrap" style={{ color: '#c1a16a' }}>432 010,82 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Potentiel Immobilier Améliorée */}
        <div className="mb-8" data-section="potential">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>POTENTIEL IMMOBILIER</h2>
          
          {/* Estimations principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Prix de vente */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border shadow-sm" style={{ borderColor: '#c1a16a' }}>
              <div className="flex items-center mb-4">
                <DollarSign className="w-6 h-6 mr-3" style={{ color: '#c1a16a' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#c1a16a' }}>Prix net vendeur</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">1 563 820 €</div>
              <div className="text-sm text-gray-600 mb-3">soit 10 784 €/m²</div>
              <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                <span>Min: 1 479 062 €</span>
                <span>Max: 1 944 692 €</span>
              </div>
              <div className="mt-3 inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(193, 161, 106, 0.2)', color: '#c1a16a' }}>
                Fiabilité très élevée (5/5)
              </div>
            </div>

            {/* Potentiel locatif */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border shadow-sm" style={{ borderColor: '#787346' }}>
              <div className="flex items-center mb-4">
                <Home className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#787346' }}>Loyer hors charges</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">2 460 €/mois</div>
              <div className="text-sm text-gray-600 mb-3">soit 20 €/m²</div>
              <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                <span>Min: 2 214 €</span>
                <span>Max: 2 706 €</span>
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
              <div className="text-3xl font-bold text-gray-900 mb-2">2 979 € TTC</div>
              <div className="text-gray-600 mb-4">Tout compris (travaux + honoraires)</div>
              <div className="text-sm text-gray-500">
                Comparé au marché local: <span className="font-semibold" style={{ color: '#787346' }}>-48%</span>
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
                  <span className="font-bold text-gray-900">1 563 820 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coût total projet:</span>
                  <span className="font-bold text-gray-900">432 011 €</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plus-value brute:</span>
                    <span className="font-bold text-2xl" style={{ color: '#787346' }}>1 131 809 €</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    (Hors coût terrain et frais annexes)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalSummary;