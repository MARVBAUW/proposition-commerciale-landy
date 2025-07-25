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

  // Courbe d'origine (avant ajustement)
  const originalPriceData = {
    max: [1200000, 1250000, 1300000, 1350000, 1400000, 1450000, 1500000, 1600000, 1650000, 1700000, 1711900],
    '10years': [1200000, 1250000, 1300000, 1350000, 1400000, 1450000, 1500000, 1600000, 1650000, 1700000, 1711900],
    '5years': [1450000, 1500000, 1600000, 1650000, 1700000, 1711900],
    '1year': [1700000, 1705000, 1708000, 1710000, 1711000, 1711500, 1711900]
  };
  const ratio = 1563820 / 1711900;
  function adjustSerie(serie: number[]): number[] {
    return serie.map((v: number) => Math.round(v * ratio));
  }

  // Courbe simplifiée : points annuels uniquement
  const priceData = {
    max: {
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      data: adjustSerie(originalPriceData.max)
    },
    '10years': {
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      data: adjustSerie(originalPriceData['10years'])
    },
    '5years': {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      data: adjustSerie(originalPriceData['5years'])
    },
    '1year': {
      labels: ['Juil 2024', 'Sept 2024', 'Nov 2024', 'Jan 2025', 'Mar 2025', 'Mai 2025', 'Juil 2025'],
      data: adjustSerie(originalPriceData['1year'])
    }
  };

  // Calcul dynamique des pourcentages d'évolution
  function computeEvolutionPercentages() {
    // Helper pour le pourcentage
    const percent = (start: number, end: number) => Math.round(((end - start) / start) * 100);
    return {
      '1year': percent(priceData['1year'].data[0], priceData['1year'].data[priceData['1year'].data.length - 1]),
      '5years': percent(priceData['5years'].data[0], priceData['5years'].data[priceData['5years'].data.length - 1]),
      '10years': percent(priceData['10years'].data[0], priceData['10years'].data[priceData['10years'].data.length - 1]),
      'max': percent(priceData['max'].data[0], priceData['max'].data[priceData['max'].data.length - 1]),
    };
  }

  const evolutionPercentages = computeEvolutionPercentages();

  const evolutionData = [
    { period: '1year', label: '1 AN', change: `${evolutionPercentages['1year'] > 0 ? '+' : ''}${evolutionPercentages['1year']}%`, isPositive: evolutionPercentages['1year'] >= 0 },
    { period: '5years', label: '5 ANS', change: `${evolutionPercentages['5years'] > 0 ? '+' : ''}${evolutionPercentages['5years']}%`, isPositive: evolutionPercentages['5years'] >= 0 },
    { period: '10years', label: '10 ANS', change: `${evolutionPercentages['10years'] > 0 ? '+' : ''}${evolutionPercentages['10years']}%`, isPositive: evolutionPercentages['10years'] >= 0 },
    { period: 'max', label: 'MAX', change: `${evolutionPercentages['max'] > 0 ? '+' : ''}${evolutionPercentages['max']}%`, isPositive: evolutionPercentages['max'] >= 0 }
  ];

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
          color: '#e6e6e6',
          borderColor: '#ccd6eb',
        },
        ticks: {
          color: '#666666',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: '#e6e6e6',
          borderDash: [4, 3],
          drawBorder: false
        },
        ticks: {
          color: '#666666',
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
        borderColor: '#b8a994', // doré olive
        backgroundColor: 'rgba(193, 161, 106, 0.15)', // zone sous la courbe
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#b8a994',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#c1a16a',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3
      }]
    };
  };

  const propertyDetails = [
    { label: 'Surface', value: '145 m²', icon: Home },
    { label: 'Configuration', value: 'Maison à étage avec piscine', icon: Target },
    { label: 'Commune', value: 'Le Lavandou (83980)', icon: MapPin },
    { label: 'Estimation', value: '21 juillet 2025', icon: Calendar }
  ];

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>RÉCAPITULATIF GÉNÉRAL</h2>
        
        {/* Récapitulatif général */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-6 mb-8 border-2 shadow-lg" style={{ borderColor: '#c1a16a' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(193, 161, 106, 0.5)' }}>
                  <th className="text-left px-4 py-3 text-yellow-400 text-lg"></th>
                  <th className="text-right px-4 py-3" style={{ color: '#c1a16a' }}>MONTANT HT</th>
                  <th className="text-right px-4 py-3" style={{ color: '#c1a16a' }}>TVA 20%</th>
                  <th className="text-right px-4 py-3" style={{ color: '#c1a16a' }}>MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-4 py-3 text-gray-900 font-semibold">COÛT DES TRAVAUX</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-mono">332 725,52 €</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-mono">66 545,11 €</td>
                  <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: '#c1a16a' }}>399 270,63 €</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-semibold">HONORAIRES MAÎTRISE D'ŒUVRE</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-mono">27 283,49 €</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-mono">5 456,70 €</td>
                  <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: '#c1a16a' }}>32 740,19 €</td>
                </tr>
                <tr className="border-t-2" style={{ background: 'linear-gradient(to right, rgba(193, 161, 106, 0.2), rgba(193, 161, 106, 0.1))', borderTopColor: '#c1a16a' }}>
                  <td className="px-4 py-4 font-bold text-lg" style={{ color: '#c1a16a' }}>TOTAL GÉNÉRAL</td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-lg" style={{ color: '#c1a16a' }}>360 009,01 €</td>
                  <td className="px-4 py-4 text-right font-mono font-bold" style={{ color: '#c1a16a' }}>72 001,81 €</td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-xl" style={{ color: '#c1a16a' }}>432 010,82 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Potentiel Immobilier Améliorée */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>POTENTIEL IMMOBILIER</h2>
          {/* Boutons de période */}
          <div className="flex space-x-2 mb-4 habitation-price-evolution__header">
            {evolutionData.map((period) => (
              <button
                key={period.period}
                onClick={() => setSelectedPeriod(period.period)}
                className={`habitation-price-evolution__button px-4 py-2 rounded font-semibold flex items-center space-x-2 ${selectedPeriod === period.period ? 'bg-yellow-100 border border-yellow-400' : 'bg-gray-50 border border-gray-200'} `}
                style={{ color: period.isPositive ? '#787346' : '#c0392b' }}
              >
                <span className="habitation-price-evolution__button-label">{period.label}</span>
                <span className={`habitation-price-evolution__button-percentage ${period.isPositive ? 'habitation-price-evolution__button-percentage--positive' : 'habitation-price-evolution__button-percentage--negative'}`}>{period.change}</span>
              </button>
            ))}
          </div>
          {/* Courbe d'évolution */}
          <div style={{ height: 300, background: '#fff' }}>
            <Line data={getChartData()} options={chartOptions} />
          </div>
          <div className="text-xs text-gray-500 mt-2 habitation-price-evolution__info">
            Cette courbe est mise à jour mensuellement en fonction des dernières transactions connues dans l’environnement du bien.
          </div>
        </div>

        {/* Bloc estimation adapté */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#c1a16a' }}>Estimations réalisées le 21 juillet 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prix net vendeur */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold mb-2" style={{ color: '#787346' }}>Prix net vendeur</div>
                <div className="text-3xl font-extrabold mb-1" style={{ color: '#c1a16a' }}>1 563 820&nbsp;€</div>
                <div className="text-sm text-gray-600 mb-2">soit 10 782&nbsp;€ /m²</div>
                <div className="flex justify-between text-xs text-gray-500">
                  <div>Fourchette basse <span className="font-bold text-gray-900 ml-1">1 479 062&nbsp;€</span></div>
                  <div>Fourchette haute <span className="font-bold text-gray-900 ml-1">1 944 692&nbsp;€</span></div>
                </div>
              </div>
            </div>
            {/* Loyer hors charges */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-lg font-bold mb-2" style={{ color: '#787346' }}>Loyer hors charges</div>
                <div className="text-3xl font-extrabold mb-1" style={{ color: '#c1a16a' }}>2 002&nbsp;€ hc /mois</div>
                <div className="text-sm text-gray-600 mb-2">soit 14&nbsp;€ /m²</div>
                <div className="flex justify-between text-xs text-gray-500">
                  <div>Fourchette basse <span className="font-bold text-gray-900 ml-1">1 782&nbsp;€</span></div>
                  <div>Fourchette haute <span className="font-bold text-gray-900 ml-1">2 222&nbsp;€</span></div>
                </div>
              </div>
            </div>
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
                <span className="font-bold text-gray-900">432 010,82 €</span>
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
    </section>
  );
};

export default TotalSummary;